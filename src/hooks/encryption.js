import {
  storeInDB,
  MUK_STORAGE_ID,
  PROCESSED_SECRET_KEY_STORAGE_ID,
} from '@/hooks/indexDB';

import { getMUK } from '@/hooks/cryptoStore';
import ab2base64, { base642ab } from '@/lib/ab2base64';

export const generateEncryptionKey = () => {
  const aesAlg = {
    name: 'AES-GCM',
    length: 256,
  };

  return crypto.subtle.generateKey(aesAlg, true, ['encrypt', 'decrypt']);
};

export const recreateMuk = async (salt, processedSecretKey, password) => {
  let MUK = await PBKDF2(salt, password);
  MUK = await digestTwoKeys(processedSecretKey, MUK);
  await storeInDB(MUK_STORAGE_ID, MUK);

  return MUK;
};

export const deriveMasterUnlockKey = async (
  salt,
  secretKey,
  password,
  accountId
) => {
  let MUK = await PBKDF2(salt, password);

  secretKey = await processAndStoreSecretKey(secretKey, accountId);
  MUK = await digestTwoKeys(secretKey, MUK);

  await storeInDB(MUK_STORAGE_ID, MUK);
  return MUK;
};

export const PBKDF2 = async (salt, password) => {
  const enc = new TextEncoder();

  // The password is trimmed and normalized
  const normalizedPassword = password.trim().normalize('NFKD');

  // We first need to import the normlaized
  // plain-text password as a key
  const passwordAsKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(normalizedPassword),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  // The above key is then used to derive the
  // MUK – it's not fully processed yet.
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordAsKey,
    { name: 'AES-KW', length: 256 },
    true,
    ['wrapKey', 'unwrapKey']
  );
};

export const processAndStoreSecretKey = async (secretKey, accountID) => {
  const enc = new TextEncoder();
  const encodedSalt = enc.encode(accountID);
  const secretKeyAsBytes = await crypto.subtle.exportKey('raw', secretKey);
  const intermediateKey = await crypto.subtle.importKey(
    'raw',
    secretKeyAsBytes,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  // also stored in the DB
  const processed_secret_key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encodedSalt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    intermediateKey,
    { name: 'AES-KW', length: 256 },
    true,
    ['wrapKey', 'unwrapKey']
  );

  await storeInDB(PROCESSED_SECRET_KEY_STORAGE_ID, processed_secret_key);
  return processed_secret_key;
};

export const digestTwoKeys = async (key1, key2) => {
  const key1Buffer = await crypto.subtle.exportKey('raw', key1);
  const key2Buffer = await crypto.subtle.exportKey('raw', key2);

  let a = Array.from(new Uint8Array(key1Buffer));
  const b = Array.from(new Uint8Array(key2Buffer));

  const length = Math.min(a.length, b.length);

  for (let i = 0; i < length; ++i) {
    a[i] = a[i] ^ b[i];
  }

  const newKeyBuffer = new Uint8Array(a);
  const newKey = await crypto.subtle.importKey(
    'raw',
    newKeyBuffer.buffer,
    'AES-GCM',
    false,
    ['wrapKey', 'unwrapKey']
  );

  return newKey;
};

export const importKey = (rawKey) => {
  return crypto.subtle.importKey(
    'raw', //can be "jwk" or "raw"
    rawKey,
    {
      name: 'AES-GCM',
    },
    true, //whether the key is extractable (i.e. can be used in exportKey)
    ['encrypt', 'decrypt'] //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
  );
};

export const wrapKey = (key, wrappingKey, iv) => {
  return crypto.subtle.wrapKey(
    'raw', //can be "jwk", "raw", "spki", or "pkcs8"
    key, //the key you want to wrap, must be able to export to above format
    wrappingKey, //the AES-GCM key with "wrapKey" usage flag
    {
      //these are the wrapping key's algorithm options
      name: 'AES-GCM',

      //Don't re-use initialization vectors!
      //Always generate a new iv every time your encrypt!
      //Recommended to use 12 bytes length
      iv: iv,
    }
  );
};

export const unwrapKey = (wrapped, wrappingKey, iv) => {
  return crypto.subtle.unwrapKey(
    'raw', //"jwk", "raw", "spki", or "pkcs8" (whatever was used in wrapping)
    wrapped, //the key you want to unwrap
    wrappingKey, //the AES-GCM key with "unwrapKey" usage flag
    {
      //these are the wrapping key's algorithm options
      name: 'AES-GCM',
      iv: iv, //The initialization vector you used to encrypt
    },
    {
      //this what you want the wrapped key to become (same as when wrapping)
      name: 'AES-GCM',
      length: 256,
    },
    false, //whether the key is extractable (i.e. can be used in exportKey)
    ['encrypt', 'decrypt'] //the usages you want the unwrapped key to have
  );
};

const unwrapEncyptionKey = async (encryptionPackage) => {
  if (!encryptionPackage) return;

  const muk = await getMUK();
  const wrappedKey = new Uint8Array(encryptionPackage.data.encryptedPrivateKey);
  const iv = new Uint8Array(encryptionPackage.data.privateKeyIv);
  const key = await unwrapKey(wrappedKey, muk, iv);

  return key;
};

export const encrypt = async (encryptionPackage, data) => {
  const objJsonStr = JSON.stringify(data);
  const enc = new TextEncoder();
  const objJsonBuffer = enc.encode(objJsonStr);

  const iv = await crypto.getRandomValues(new Uint8Array(12));
  const key = await unwrapEncyptionKey(encryptionPackage);

  const result = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    objJsonBuffer
  );

  const asBase64 = ab2base64(result);
  const encryptedPackage = { data: asBase64, iv: iv };
  return encryptedPackage;
};

export const decrypt = async (encryptionPackage, encryptedPackage) => {
  if (!encryptionPackage) return;
  if (!encryptedPackage) return;

  const { data: encryptedData, iv } = encryptedPackage;
  const key = await unwrapEncyptionKey(encryptionPackage);
  const asArrayBuffer = base642ab(encryptedData);

  const result = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(iv).buffer, // The initialization vector you used to encrypt
    },
    key, // CryptoKey
    asArrayBuffer //ArrayBuffer of the data
  );

  const enc = new TextDecoder('utf-8');
  const jsonString = enc.decode(result);
  const parsedJson = JSON.parse(jsonString);

  return parsedJson;
};
