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
import ab2base64, { base642ab } from '@/lib/ab2base64';

const EmergencyKit = () => {
  const router = useRouter();
  const [secretKey, setSecretKey] = useState('loading...');
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    async function getSecretKeyToState() {
      const key = await getSecretKey();
      const rawKey = await crypto.subtle.exportKey('raw', key);
      const base64Key = await ab2base64(rawKey);
      setSecretKey(base64Key);
    }

    getSecretKeyToState();
  }, []);

  const submitForm = async (event) => {
    event.preventDefault();

    // delete the device_key
    await deleteSecretKeyFromDevice();

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
        {/* Validation Errors */}
        <AuthValidationErrors className="mb-4" errors={errors} />

        <div className="mb-3 font-medium">
          <p className="font-medium text-gray-300">1. Create an account</p>
          <p className="font-medium">2. Backup your secret key</p>
        </div>

        <p className="text-sm text-gray-500 mb-5">
          Your secret key is used alongside your master password to encrypt your
          private data directly on your device.
        </p>
        <form onSubmit={submitForm}>
          {/* Email Address */}
          <div className="mt-4">
            <Label htmlFor="email">Secret key</Label>
            <div className="mt-3 flex rounded-md shadow-sm">
              <textarea
                id="key"
                type="text"
                value={secretKey}
                required
                onClick={(e) => e.target.select()}
                autoComplete="new-password"
                className="resize-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 flex-1 block w-full border-r-0 rounded-none rounded-l-md border-gray-300"
              />
              <span className="inline-flex items-start px-2 py-2 rounded-r-md border border-l-0 border-gray-300 text-gray-500 text-sm hover:text-indigo-500 cursor-pointer">
                <DuplicateIcon className="h-6 w-6" />
              </span>
            </div>
          </div>

          <ul className="list-inside list-disc text-sm text-gray-500 mt-5 mb-6 space-y-1 text-red-500">
            <li>Store your secret key somewhere safe</li>
            <li>We can't restore your secret key if you lose it</li>
          </ul>

          <div className="flex items-center justify-start mt-4">
            <Button>I've saved my secret key</Button>
          </div>
        </form>
      </AuthCard>
    </GuestLayout>
  );
};

export default EmergencyKit;
