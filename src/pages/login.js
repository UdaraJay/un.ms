import Link from 'next/link';
import { useState } from 'react';
import Input from '@/components/Input';
import Label from '@/components/Label';
import { useAuth } from '@/hooks/auth';
import Button from '@/components/Button';
import AuthCard from '@/components/AuthCard';
import GuestLayout from '@/components/Layouts/GuestLayout';
import ApplicationLogo from '@/components/ApplicationLogo';
import AuthSessionStatus from '@/components/AuthSessionStatus';
import AuthValidationErrors from '@/components/AuthValidationErrors';
import { KeyIcon } from '@heroicons/react/solid';
import { generateAuthenticationKey } from '@/hooks/security';

const Login = () => {
  const { login, user } = useAuth({ middleware: 'guest' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const submitForm = async (event) => {
    event.preventDefault();

    const pwd = await generateAuthenticationKey(email, password);
    login({ email, password: pwd, setErrors });
  };

  if (user) return null;

  return (
    <GuestLayout>
      <AuthCard
        logo={
          <Link href="/">
            <a>
              <ApplicationLogo className="w-14 h-14" />
            </a>
          </Link>
        }
      >
        {/* Session Status */}
        <AuthSessionStatus className="mb-4" status={null} />

        {/* Validation Errors */}
        <AuthValidationErrors className="mb-4" errors={errors} />

        <form onSubmit={submitForm}>
          {/* Email Address */}
          <div>
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              className="block mt-1 w-full"
              type="email"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              required
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="mt-4">
            <Label htmlFor="password">Master Password</Label>

            <Input
              id="password"
              className="block mt-1 w-full"
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              required
              autoComplete="current-password"
            />
          </div>

          {/* Remember Me */}
          <div className="block mt-4">
            <label htmlFor="remember_me" className="inline-flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                name="remember"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          <div className="flex items-center justify-end mt-4">
            {/* <Link href="/forgot-password">
              <a className="underline text-sm text-gray-600 hover:text-gray-900">
                Forgot your password?
              </a>
            </Link> */}

            <Button className="ml-3">Login</Button>
          </div>
        </form>
      </AuthCard>
    </GuestLayout>
  );
};

export default Login;
