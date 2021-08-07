import {
  storeInDB,
  getFromDB,
  deleteFromDB,
  SECURITY_KEY_STORAGE_ID,
  SALT_STORAGE_ID,
  MUK_STORAGE_ID,
  PROCESSED_SECRET_KEY_STORAGE_ID,
} from '@/hooks/indexDB';

export const getSalt = () => {
  return getFromDB(SALT_STORAGE_ID);
};

export const setupSalt = async () => {
  const salt = await crypto.getRandomValues(new Uint8Array(16));
  await storeInDB(SALT_STORAGE_ID, salt);
  return salt;
};

export const getSecretKey = () => {
  return getFromDB(SECURITY_KEY_STORAGE_ID);
};

export const getProcessedSecretKey = () => {
  return getFromDB(PROCESSED_SECRET_KEY_STORAGE_ID);
};

export const setupSecretKey = async () => {
  const secretKey = await generateSecretKey();
  await storeInDB(SECURITY_KEY_STORAGE_ID, secretKey);

  return secretKey;
};

export const generateSecretKey = () => {
  return crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
};

export const deleteSecretKeyFromDevice = () => {
  return deleteFromDB(SECURITY_KEY_STORAGE_ID);
};

export const deleteMukFromDevice = () => {
  return deleteFromDB(MUK_STORAGE_ID);
};

export const getMUK = () => {
  return getFromDB(MUK_STORAGE_ID);
};
