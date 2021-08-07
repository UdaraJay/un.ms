import { get, set, keys, del } from 'idb-keyval';

export const SALT_STORAGE_ID = 'device_salt';
export const SECURITY_KEY_STORAGE_ID = 'device_key';
export const PROCESSED_SECRET_KEY_STORAGE_ID = 'processed_device_key';
export const MUK_STORAGE_ID = 'muk';

export const getFromDB = (key) => {
  return get(key);
};

export const storeInDB = (key, val) => {
  return set(key, val);
};

export const checkIfKeyExists = (key) => {
  return keys().then((keys) => keys.includes(key));
};

export const deleteFromDB = (key) => {
  return del(key);
};
