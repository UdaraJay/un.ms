import React, { createContext, useState, useContext, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { useAuth } from '@/hooks/auth';
import {
  checkIfKeyExists,
  SECURITY_KEY_STORAGE_ID,
  PROCESSED_SECRET_KEY_STORAGE_ID,
  MUK_STORAGE_ID,
} from '@/hooks/indexDB';
import { deleteMukFromDevice, getMUK } from '@/hooks/cryptoStore';

const SecureContext = createContext({});

export const SecureProvider = ({ children }) => {
  const router = useRouter();
  const { user, encryptionPackage } = useAuth({ middleware: 'auth' });

  const [locked, setLocked] = useState(true);
  const [deviceKey, setDeviceKey] = useState(null);
  const [processedDeviceKey, setProcessedDeviceKey] = useState(null);
  const [muk, setMuk] = useState(null);

  const lock = async () => {
    await deleteMukFromDevice();
    setLocked(true);
    router.push('/unlock');
  };

  useEffect(() => {
    if (!user) router.push('/login');
    if (!encryptionPackage) return;

    let active = true;
    load();
    return () => {
      active = false;
    };

    async function load() {
      // Is the secret key on device?
      // If so ask the user to save it, and then delete it
      // from device
      const unprocessedSecretKeyInStorage = await checkIfKeyExists(
        SECURITY_KEY_STORAGE_ID
      );
      if (unprocessedSecretKeyInStorage) {
        router.push('/emergency-kit');
        return;
      }

      // Is processed secret key on device?
      // if this is not here: we need to prompt the user to re-enter their
      // secret key
      const processedSecretKeyInStorage = await checkIfKeyExists(
        PROCESSED_SECRET_KEY_STORAGE_ID
      );
      if (!processedSecretKeyInStorage) {
        // delete the MUK becuase it will have to be regenerated now.
        await deleteMukFromDevice();
        router.push('/provide-secret-key');
        return;
      }

      // Is the MUK on device?
      const MukInStorage = await checkIfKeyExists(MUK_STORAGE_ID);
      if (!MukInStorage) {
        // derive muk again
        // this requires password...
        router.push('/unlock');
        return;
      }

      if (!active) {
        return;
      }

      setLocked(!MukInStorage);
    }
  }, [user, encryptionPackage]);

  // this should make the full context of encyption available

  return (
    <SecureContext.Provider value={{ lock, locked }}>
      {children}
    </SecureContext.Provider>
  );
};

export const useSecure = () => useContext(SecureContext);
