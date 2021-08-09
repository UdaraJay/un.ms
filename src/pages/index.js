import { useEffect } from 'react';
import { IdentificationIcon, LoginIcon } from '@heroicons/react/solid';
import PageLayout from '@/components/Layouts/PageLayout';
import { useAuth } from '@/hooks/auth';

export default function Index() {
  const { user } = useAuth();

  return (
    <PageLayout>
      <div>
        <div className="max-w-sm">
          <p>
            A private place for logging activity and keeping track of things.
          </p>
          {!user ? (
            <div className="relative z-0 inline-flex shadow-sm rounded-md mt-5">
              <a
                href="/register"
                className="relative inline-flex items-center px-4 py-1.5 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <IdentificationIcon
                  className="-ml-1 mr-2 h-4 w-4 text-gray-600"
                  aria-hidden="true"
                />
                Create an account
              </a>
              <a
                href="/login"
                className="-ml-px relative inline-flex items-center px-3 py-1.5 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                Sign in
              </a>
            </div>
          ) : (
            <div className="relative z-0 inline-flex shadow-sm rounded-md mt-5">
              <a
                href="/activity"
                className="relative inline-flex items-center px-2.5 py-1.5 rounded-md border 
              border-gray-300 bg-white
              text-sm font-medium text-gray-700 hover:bg-gray-50 
              focus:z-10 focus:outline-none focus:ring-1 
              focus:ring-indigo-500 focus:border-indigo-500"
              >
                <LoginIcon className="mr-1.5 h-4 w-4" aria-hidden="true" />
                {user?.username}
              </a>
            </div>
          )}

          <div className="max-w-lg mx-auto mt-10 text-gray-500">
            <ul role="list" className="mt-0 divide-y">
              <li>
                <div className="relative group py-4 flex items-start space-x-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      Log activity
                    </div>
                    <p className="text-sm">
                      Record achievements and thoughts, or track how many
                      glasses of water you've had today. Log whatever you want
                      really.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="relative group py-4 flex items-start space-x-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      Take notes
                    </div>
                    <p className="text-sm">
                      Write notes and access them from anywhere. You can make
                      some notes public if you'd like.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="relative group py-4 flex items-start space-x-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      Private by design
                    </div>
                    <p className="text-sm">
                      Your data is encrypted and decrypted on your device, with
                      a key only you have. To put it simply, we never want to
                      see your data and we take more than a few steps to ensure
                      it.
                    </p>
                    <div className="text-sm mt-2">
                      This is an open-source project, so you can learn more and
                      dig around the code{' '}
                      <a
                        href=""
                        className="text-indigo-500 hover:text-indigo-600 font-medium"
                      >
                        on GitHub
                      </a>
                      .
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="mt-14 bg-gray-100
        rounded-xl pt-4 px-4 pb-0.5 overflow-hidden"
        >
          <img className="rounded-t" src="/preview-1.png" width="100%" />
        </div>
      </div>
    </PageLayout>
  );
}
