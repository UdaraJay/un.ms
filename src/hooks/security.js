import axios from '@/lib/axios';
import {
  getSalt,
  setupSalt,
  getSecretKey,
  setupSecretKey,
} from '@/hooks/cryptoStore';
import {
  generateEncryptionKey,
  deriveMasterUnlockKey,
  PBKDF2,
  wrapKey,
  wrapRSAKey,
  unwrapKey,
} from '@/hooks/encryption';

// crypto things need to happen here
// If you're feeling clueless about this, this was inspired by the 1Password's
// design. We don't do a bunch of things they do, but it's a great reference
// for what we're doing here...

// 0. Generate a salt => salt1 ↖︎ (use the user email to derive it)
// 1. Generate an encryption key => keyE (MUK - Master unlock key)
// 2. Generate a secret key => key2a
// 3. Use password -> string.normalize('NFKD') -> pbkdf2() => key1
// 4. use key1 + key2 to encrypt keyE => eKeyE ↖︎

const crypto = typeof window !== 'undefined' ? window.crypto : null;

export const setupEncryptionKeys = async (accountId, password) => {
  // Generate Secret Key
  const encryptionKeySalt = await setupSalt(); // upload this
  const secretKey = await setupSecretKey(); // stored in IndexedDB

  // Derive the final Master Unlock Key
  const MUK = await deriveMasterUnlockKey(
    encryptionKeySalt,
    secretKey,
    password,
    accountId
  );

  // public-private key pair used for encryption/decryption
  const privateKeyIv = await crypto.getRandomValues(new Uint8Array(12));

  // THIS IS WHERE I'M FIXING FROM
  const encryptionKey = await generateEncryptionKey();
  // This is a JWK
  const wrappedEncryptionKey = await wrapKey(encryptionKey, MUK, privateKeyIv);

  // encrypt something so we can check it later
  // - encrypt a phrase
  const keyCheckData = await crypto.getRandomValues(new Uint8Array(12));
  const keyCheckIv = await crypto.getRandomValues(new Uint8Array(12));
  const keyCheckResult = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: keyCheckIv,
    },
    encryptionKey,
    keyCheckData
  );

  const encryption_data = {
    encryptedPrivateKey: new Uint8Array(wrappedEncryptionKey),
    privateKeyIv: new Uint8Array(privateKeyIv),
    salt: encryptionKeySalt,
    keyCheckData: new Uint8Array(keyCheckData),
    keyCheckResult: new Uint8Array(keyCheckResult),
    keyCheckIv: new Uint8Array(keyCheckIv),
  };

  // upload things to store on server
  await axios.post('/api/setup-encryption', {
    encryption_data,
  });
};

export const generateAuthenticationKey = async (
  authenticationKeySalt,
  password
) => {
  const enc = new TextEncoder();
  const encodedSalt = enc.encode(authenticationKeySalt);
  const key = await PBKDF2(encodedSalt, password);
  const jwkKey = await crypto.subtle.exportKey('jwk', key);

  // We just return the key portion here.
  return jwkKey.k;
};

export const hexKeyToCryptoKey = (key) => {
  const jwk = {
    alg: 'A256KW',
    ext: true,
    k: key,
    key_ops: ['wrapKey', 'unwrapKey'],
    kty: 'oct',
  };

  return crypto.subtle.importKey('jwk', jwk, 'AES-KW', true, [
    'wrapKey',
    'unwrapKey',
  ]);
};
