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
import {
  EyeIcon,
  EyeOffIcon,
  InformationCircleIcon,
} from '@heroicons/react/solid';

const Register = () => {
  const { register } = useAuth({ middleware: 'guest' });

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityKey, setSecurityKey] = useState(null);
  const [passwordScore, setPasswordScore] = useState(null);
  const [errors, setErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    const { score, feedback } = zxcvbn(password);
    setPasswordScore({ score, feedback });
  }, [password]);

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
              <div className="text-center">
                <ApplicationLogo className="w-auto h-16 mb-2" />
              </div>
            </a>
          </Link>
        }
      >
        {/* Validation Errors */}
        <AuthValidationErrors className="mb-4" errors={errors} />
        <p className="flex mb-6 text-sm text-gray-400">
          <InformationCircleIcon className="w-5 h-5 mr-1.5 text-yellow-500" />
          Currently in beta. The product may change significantly during this
          period.
        </p>
        <form onSubmit={submitForm}>
          {/* Name */}

          <div className="col-span-3 sm:col-span-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 text-gray-500 text-sm">
                un.ms/
              </span>
              <input
                type="text"
                name="username"
                id="username"
                className="focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 flex-1 block w-full rounded-none rounded-r-md border-gray-300"
                type="text"
                onChange={(event) => setUsername(event.target.value)}
                value={username}
                required
                autoFocus
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="mt-4">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              className="block mt-1 w-full"
              type="email"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              required
            />
          </div>

          <hr className="mt-6" />

          <p className="mt-5 text-sm">Master Password</p>

          <p className="mt-1 text-sm text-gray-500">
            Your master pasword never leaves your browser, so we can't recover
            your account if you lose it. Make sure you store this safely.
          </p>

          <div className="mt-4 flex rounded-md shadow-sm">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              required
              autoComplete="new-password"
              className="focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 flex-1 block w-full border-r-0 rounded-none rounded-l-md border-gray-300"
            />
            <span
              onClick={toggleShowPassword}
              className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 text-gray-500 text-sm hover:text-indigo-500 cursor-pointer"
            >
              {showPassword ? (
                <EyeIcon className="h-4 w-4" />
              ) : (
                <EyeOffIcon className="h-4 w-4" />
              )}
            </span>
          </div>

          {/* <div className="mt-4">
                    <Label htmlFor="email">Secret Key</Label>
                    <p className="mt-1 text-sm text-gray-500">
                        Your secret key is an auto-generated password that's used alongside your master password to 
                        access your private data.  
                    </p>
                    </div>
                    <div className="mt-4 flex rounded-md shadow-sm">
                   
                        <input 
                            id="secret"
                            type={'text'}
                            value={password}
                            required
                            autoComplete="off"
                            className="focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 flex-1 block w-full border-r-0 rounded-none rounded-l-md border-gray-300" 
                            disabled
                        />
                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 text-gray-500 text-sm hover:text-indigo-500 cursor-pointer">
                           <KeyIcon className="h-4 w-4"/>
                        </span>
                    </div>

                    <hr className="mt-6"/>
                    <p className="mt-5 text-sm text-red-400">
                        Make sure your store your master password <u>and</u> secret key somewhere safe.
                        We can't recover them for you if you lose or forget them.  
                    </p> */}

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

export default Register;
