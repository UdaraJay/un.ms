import Link from 'next/link';
import Head from 'next/head';
import ApplicationLogo from '@/components/ApplicationLogo';
import { useEffect } from 'react';
import { IdentificationIcon } from '@heroicons/react/solid';
import PageLayout from '@/components/Layouts/PageLayout';

export default function Index() {
  return (
    <PageLayout>
      <div className="max-w-sm">
        <p>A private place for logging activity and keeping track of things.</p>
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
        <div className="max-w-lg mx-auto mt-10">
          <ul role="list" className="mt-0 divide-y">
            <li>
              <div className="relative group py-4 flex items-start space-x-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    Log activity
                  </div>
                  <p className="text-sm text-gray-500">
                    Log tasks, achievements or track how many glasses of water
                    you've consumed.
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
                  <p className="text-sm text-gray-500">
                    Write notes and access them from anywhere. You can make some
                    notes public if you'd like.
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
                  <p className="text-sm text-gray-500">
                    Your data is encrypted and decrypted on your device, with a
                    key only you have. To put it simply, we never want to see
                    your data and we take more than a few steps to ensure it.
                  </p>
                </div>
              </div>
            </li>
          </ul>
          <div className="mt-4 flex">
            <a
              href="/about"
              className="text-sm font-medium text-gray-500 hover:text-indigo-500"
            >
              Learn more
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
