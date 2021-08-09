import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Label from '@/components/Label';
import Input from '@/components/Input';
import Button from '@/components/Button';
import AuthCard from '@/components/AuthCard';
import ApplicationLogo from '@/components/ApplicationLogo';
import GuestLayout from '@/components/Layouts/GuestLayout';
import AuthValidationErrors from '@/components/AuthValidationErrors';
import { DuplicateIcon } from '@heroicons/react/solid';
import { getSecretKey, deleteSecretKeyFromDevice } from '@/hooks/cryptoStore';
import { processAndStoreSecretKey } from '@/hooks/encryption';
import { useAuth } from '@/hooks/auth';
import { base642ab } from '@/lib/ab2base64';

const ProvideSecretKey = () => {
  const router = useRouter();
  const [secretKey, setSecretKey] = useState('');
  const { encryptionPackage } = useAuth({ middleware: 'auth' });

  const onChangeSecretKey = (e) => setSecretKey(e.target.value);

  useEffect(() => {
    async function getSecretKeyToState() {
      const key = await getSecretKey();
      // console.log('getSecretKey', key);
      // const keyJwk = await crypto.subtle.exportKey('jwk', key);
      // setSecretKey(keyJwk.k);
    }

    getSecretKeyToState();
  }, []);

  const submitForm = async (event) => {
    event.preventDefault();

    if (encryptionPackage) {
      const accountId = encryptionPackage.account_id;
      const parseKeyToArrayBuffer = await base642ab(secretKey);
      const rebuiltCryptoKey = await crypto.subtle.importKey(
        'raw',
        parseKeyToArrayBuffer,
        {
          name: 'AES-GCM',
        },
        true,
        ['encrypt', 'decrypt']
      );

      await processAndStoreSecretKey(rebuiltCryptoKey, accountId);
    } else {
      return;
    }

    router.push('/activity');
  };

  return (
    <GuestLayout>
      <AuthCard
        logo={
          <Link href="/">
            <a>
              <div className="">
                <ApplicationLogo className="w-auto h-16 mb-2" />
              </div>
            </a>
          </Link>
        }
      >
        <div className="mb-3 font-medium">
          <p className="font-medium">We need your secret key again</p>
        </div>

        <p className="text-sm text-gray-500 mb-5">
          It looks like your secret key is not present on this device. Please
          add it below so we can encrypt & decrypt your data.
        </p>

        <form onSubmit={submitForm}>
          {/* Email Address */}
          <div className="mt-4">
            <Label htmlFor="email">Secret key</Label>
            <div className="mt-3 flex rounded-md shadow-sm">
              <input
                id="key"
                type="text"
                value={secretKey}
                onChange={onChangeSecretKey}
                required
                autoComplete="off"
                placeholder="Paste your secret key here..."
                className="focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 flex-1 block w-full rounded-md border-gray-300"
              />
            </div>
          </div>
          <div className="flex items-center justify-start mt-4">
            <Button>Complete sign-in</Button>
          </div>
        </form>
      </AuthCard>
    </GuestLayout>
  );
};

export default ProvideSecretKey;
