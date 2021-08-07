import useSWR from 'swr';
import axios from '@/lib/axios';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  generateAuthenticationKey,
  setupEncryptionKeys,
} from '@/hooks/security';

export const useAuth = ({ middleware } = {}) => {
  const router = useRouter();

  const { data: user, error, revalidate } = useSWR('/api/user', () =>
    axios
      .get('/api/user')
      .then(async (res) => {
        return res.data;
      })
      .catch((error) => {
        if (error.response.status != 409) throw error;

        router.push('/verify-email');
      })
  );

  const { data: encryptionPackage = null, encryptionPackageError } = useSWR(
    '/api/encryption-package',
    () =>
      // use this to check the encryption
      axios
        .get('/api/encryption-package')
        .then(async (res) => {
          return res.data;
        })
        .catch((error) => {
          if (error.response.status != 404) throw error;
          // router.push('/setup-encryption')
          return null;
        })
  );

  const csrf = () => axios.get('/sanctum/csrf-cookie');

  const register = async ({ setErrors, ...props }) => {
    await csrf();

    const { username, email: rawEmail, password } = props;
    const email = rawEmail.trim().toLowerCase();
    const authenticationKeySalt = email;

    const authenticationKey = await generateAuthenticationKey(
      authenticationKeySalt,
      password
    );

    // Perform registration
    axios
      .post('/register', {
        username: username,
        email: email,
        password: authenticationKey,
      })
      .then(async ({ data }) => {
        const { accountId } = data;
        await setupEncryptionKeys(accountId, password);
        router.push('/emergency-kit');
        revalidate();
      })
      .catch((error) => {
        if (!error?.response) throw error;
        if (error.response.status != 422) throw error;
        if (!error?.response?.data) throw error;
        setErrors(Object.values(error.response.data.errors));
      });
  };

  const login = async ({ setErrors, ...props }) => {
    await csrf();

    axios
      .post('/login', props)
      .catch((error) => {
        if (error.response.status != 422) throw error;

        setErrors(Object.values(error.response.data.errors));
      })
      .then(() => revalidate());
  };

  const forgotPassword = async ({ setErrors, setStatus, email }) => {
    await csrf();

    axios
      .post('/forgot-password', { email })
      .catch((error) => {
        if (error.response.status != 422) throw error;

        setErrors(Object.values(error.response.data.errors));
      })
      .then((response) => setStatus(response.data.status));
  };

  const resetPassword = async ({ setErrors, setStatus, ...props }) => {
    await csrf();

    axios
      .post('/reset-password', { token: router.query.token, ...props })
      .catch((error) => {
        if (error.response.status != 422) throw error;

        setErrors(Object.values(error.response.data.errors));
      })
      .then((response) => setStatus(response.data.status));
  };

  const resendEmailVerification = ({ setStatus }) => {
    axios
      .post('/email/verification-notification')
      .then((response) => setStatus(response.data.status));
  };

  const logout = () => {
    axios
      .post('/logout')
      .then(() => {
        revalidate();
        window.location.pathname = '/login';
      })
      .catch((error) => {
        if (error?.response?.status != 401) throw error;
        window.location.pathname = '/login';
      });
  };

  useEffect(() => {
    if (middleware == 'guest' && user) router.push('/activity');
    if (middleware == 'auth' && error) logout();
  }, [user, error]);

  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
    encryptionPackage,
  };
};
