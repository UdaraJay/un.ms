import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/auth';
import Label from '@/components/Label';
import Input from '@/components/Input';
import Button from '@/components/Button';
import AuthCard from '@/components/AuthCard';
import ApplicationLogo from '@/components/ApplicationLogo';
import GuestLayout from '@/components/Layouts/GuestLayout';
import AuthValidationErrors from '@/components/AuthValidationErrors';
import zxcvbn from 'zxcvbn';
import { DuplicateIcon } from '@heroicons/react/solid';

const SetupEncryption = () => {
  const { user, encryptionPackage } = useAuth({ middleware: 'auth' });

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityKey, setSecurityKey] = useState(null);
  const [passwordScore, setPasswordScore] = useState(null);
  const [errors, setErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  // useEffect(() => {
  //   if (encryptionPackage == null) {
  //     console.log('user in setup encryption', encryptionPackage);
  //   }
  // }, [user, encryptionPackage]);

  const submitForm = async (event) => {
    event.preventDefault();

    // make sure the password scores ok here...
    register({ username, email, password, setErrors });
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

        <div className="flex items-center mb-3 font-medium">
          <p className="font-medium">Save your encryption key</p>
        </div>

        <p className="text-sm text-gray-500 mb-5">
          Your secret key is used alongside your master password to access your
          private data. This allows us to encrypt and decrypt your private data
          directly on your device. This ensures your private data never leaves
          your computer.
        </p>

        <form onSubmit={submitForm}>
          {/* Email Address */}
          <div className="mt-4">
            <Label htmlFor="email">Secret key</Label>
            <div className="mt-3 flex rounded-md shadow-sm">
              <input
                id="key"
                type="text"
                value={password}
                required
                autoComplete="new-password"
                className="focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 flex-1 block w-full border-r-0 rounded-none rounded-l-md border-gray-300"
              />
              <span className="inline-flex items-center px-2 rounded-r-md border border-l-0 border-gray-300 text-gray-500 text-sm hover:text-indigo-500 cursor-pointer">
                <DuplicateIcon className="h-6 w-6" />
              </span>
            </div>
            <p className="mt-2 text-sm text-red-500">
              Make sure you store this safely. You'll need both your master
              password <u>and</u> secret key to access your account.
            </p>
          </div>

          <div className="flex items-center justify-end mt-4">
            <Link href="/login">
              <a className="underline text-sm text-gray-600 hover:text-gray-900">
                Already registered?
              </a>
            </Link>

            <Button className="ml-4">Create an account</Button>
          </div>
        </form>
      </AuthCard>
    </GuestLayout>
  );
};

export default SetupEncryption;
