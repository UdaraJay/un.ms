import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/auth';
import exportPublicKey, { ab2str } from '@/lib/exportPublicKey';
import { checkIfKeyExists, MUK_STORAGE_ID } from '@/hooks/indexDB';

const EncryptionDetails = () => {
  const { user, encryptionPackage } = useAuth({ middleware: 'auth' });
  const [publicKey, setPublicKey] = useState('');
  const [mukPresent, setMukPresent] = useState(false);

  useEffect(() => {
    if (!encryptionPackage) return;

    async function parseDetails() {
      const publicKey = await crypto.subtle.importKey(
        'jwk',
        encryptionPackage.data.publicKey,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256',
        },
        true,
        ['encrypt']
      );
      const publicKeyString = await exportPublicKey(publicKey);
      setPublicKey(publicKeyString);

      const mukPresent = await checkIfKeyExists(MUK_STORAGE_ID);
      setMukPresent(mukPresent);

      // console.log('salt', ...encryptionPackage.data.salt);
      // const b64 = window.btoa(
      //   ab2str(new Uint8Array(encryptionPackage.data.salt))
      // );
      // console.log('salt b64', b64);
      // const back = new Uint8Array(str2ab(window.atob(b64)), null, 16);
      // console.log('back to salt', ...back);
    }

    parseDetails();
  }, [encryptionPackage]);

  return (
    <div className="mt-10 sm:mt-0">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Encryption
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Details about your client-side encryption.
            </p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="bg-white border overflow-hidden sm:rounded-lg">
            <div>
              <dl>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Encryption setup
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Complete
                    </span>
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Master Unlock Key
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {mukPresent ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Available
                      </span>
                    ) : (
                      <div>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Unavailable
                        </span>
                        <p className="text-sm text-gray-500 mt-2">
                          This means you can't encrypt/decrypt data right now.
                          Please try logging out and logging back into your
                          account to fix this.
                        </p>
                      </div>
                    )}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Account ID
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {encryptionPackage?.account_id}
                  </dd>
                </div>
                <div className="bg-gray-50  px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Encryption salt
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {encryptionPackage?.data?.salt &&
                      window.btoa(
                        ab2str(new Uint8Array(encryptionPackage.data.salt))
                      )}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Public Key
                  </dt>
                  <dd className="mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2 break-all">
                    <p>{publicKey}</p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EncryptionDetails;
