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
import { getProcessedSecretKey } from '@/hooks/cryptoStore';
import { recreateMuk, wrapKey, importKey, unwrapKey } from '@/hooks/encryption';
import { useAuth } from '@/hooks/auth';
import pause from '@/lib/pause';

const abEqual = (buf1, buf2) => {
  if (buf1.byteLength != buf2.byteLength) return false;
  var dv1 = new Int8Array(buf1);
  var dv2 = new Int8Array(buf2);
  for (var i = 0; i != buf1.byteLength; i++) {
    if (dv1[i] != dv2[i]) return false;
  }
  return true;
};

const Unlock = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { encryptionPackage } = useAuth({ middleware: 'auth' });

  const onChangePassword = (e) => setPassword(e.target.value);

  const submitForm = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (encryptionPackage) {
      try {
        const secretKey = await getProcessedSecretKey();
        const salt = new Uint8Array(encryptionPackage.data.salt).buffer;

        const muk = await recreateMuk(salt, secretKey, password);

        const wrappedKey = new Uint8Array(
          encryptionPackage.data.encryptedPrivateKey
        ).buffer;
        const privateKeyIv = new Uint8Array(encryptionPackage.data.privateKeyIv)
          .buffer;
        const privateKey = await unwrapKey(wrappedKey, muk, privateKeyIv);

        const keyCheckIv = new Uint8Array(encryptionPackage.data.keyCheckIv)
          .buffer;
        const keyCheckData = new Uint8Array(encryptionPackage.data.keyCheckData)
          .buffer;
        const keyCheckResult = new Uint8Array(
          encryptionPackage.data.keyCheckResult
        ).buffer;

        const decryptedMessage = await crypto.subtle.decrypt(
          {
            name: 'AES-GCM',
            iv: keyCheckIv, //The initialization vector you used to encrypt
          },
          privateKey, //from generateKey or importKey above
          keyCheckResult //ArrayBuffer of the data
        );

        // good to go if result is the same
        if (!abEqual(keyCheckData, decryptedMessage)) {
          // MUK not correct – likely user entered
          // master password wrong
          setLoading(false);
          setPassword('');
          return;
        }
      } catch (err) {
        console.log('unlock error');
        setLoading(false);
        setPassword('');
        return;
      }
    } else {
      router.push('/login');
      return;
    }

    await pause(1000);
    setLoading(false);
    router.push('/login');
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
          <p className="font-medium">Unlock</p>
        </div>

        <p className="text-sm text-gray-500 mb-5">
          Provide your master password to unlock.
        </p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await submitForm(e);
          }}
        >
          <div className="mt-4">
            <Label htmlFor="pwd">Master password</Label>
            <div className="mt-3 flex rounded-md shadow-sm">
              <input
                id="key"
                name="pwd"
                type="password"
                value={password}
                onChange={onChangePassword}
                required
                autoComplete="off"
                placeholder="Your master password..."
                className="focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 flex-1 block w-full rounded-md border-gray-300"
              />
            </div>
          </div>
          <div className="flex items-center justify-start mt-4">
            <Button disabled={loading}>
              {loading && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              Unlock
            </Button>
          </div>
        </form>
      </AuthCard>
    </GuestLayout>
  );
};

export default Unlock;
