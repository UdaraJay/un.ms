import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { MenuAlt2Icon, XIcon, SearchIcon } from '@heroicons/react/solid';
import ApplicationLogo from '@/components/ApplicationLogo';
import LockUnlock from '@/components/Layouts/LockUnlock';
import NewNoteButton from '@/components/Layouts/NewNoteButton';
import { useAuth } from '@/hooks/auth';
import { SecureProvider } from '@/contexts/secure';

const navigation = [
  {
    name: 'Activity',
    href: '/activity',
  },
  { name: 'Notes', href: '/notes' },
];

const secondaryNavigation = [
  // { name: 'About', href: '/about' },
  { name: 'Settings', href: '/settings' },
];

const tabs = [
  { name: 'General', href: '#', current: true },
  { name: 'Password', href: '#', current: false },
  { name: 'Notifications', href: '#', current: false },
  { name: 'Plan', href: '#', current: false },
  { name: 'Billing', href: '#', current: false },
  { name: 'Team Members', href: '#', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Example({ header, children }) {
  const { user, logout } = useAuth({ middleware: 'auth' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SecureProvider>
      <div className="relative h-screen bg-gray-50 overflow-hidden flex">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            static
            className="fixed inset-0 z-40 flex md:hidden"
            open={sidebarOpen}
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative max-w-xs w-full bg-white pt-5 pb-4 flex-1 flex flex-col">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-14 p-1">
                    <button
                      className="h-12 w-12 rounded-full flex items-center justify-center focus:outline-none focus:bg-gray-600"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Close sidebar</span>
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-shrink-0 px-4 flex items-center">
                  <ApplicationLogo className="w-10 h-10" />
                </div>
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <nav className="h-full flex flex-col">
                    <div className="space-y-1">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-purple-50 border-purple-600 text-purple-600'
                              : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                            'group border-l-4 py-2 px-3 flex items-center text-base font-medium'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                    <div className="mt-auto pt-10 space-y-1">
                      {secondaryNavigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="group border-l-4 border-transparent py-2 px-3 flex items-center text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        >
                          {item.name}
                        </a>
                      ))}

                      <div
                        key="logout"
                        onClick={logout}
                        className="group border-l-4 border-transparent py-2 px-3 flex items-center text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
                      >
                        Logout
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="w-60 flex flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <nav className="bg-gray-50 pl-2 pt-6 pb-5 flex flex-col flex-grow overflow-y-auto">
              <div className="flex-shrink-0 px-4 flex items-center">
                <ApplicationLogo className="w-10 h-10" />
              </div>
              <div className="flex-grow mt-5 flex flex-col">
                <div className="flex-1 space-y-1">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'bg-purple-50 border-purple-600 text-purple-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                        'group border-l-4 py-1 px-3 flex items-center text-sm font-medium'
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 block w-full">
                {secondaryNavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group border-l-4 border-transparent py-1 px-3 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}

                <a
                  key={'logout'}
                  onClick={logout}
                  className="group border-l-4 border-transparent py-1 px-3 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
                >
                  Logout
                </a>
              </div>
            </nav>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col">
          <div className="w-full max-w-4xl mx-auto pt-5 md:px-8 xl:px-0">
            <div className="relative z-10 flex-shrink-0 h-16 flex items-center sm:px-5 md:px-0">
              <button
                className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <MenuAlt2Icon
                  className="h-6 w-6 text-gray-900"
                  aria-hidden="true"
                />
              </button>
              <div className="flex-1 flex justify-end sm:justify-between md:px-0">
                <div className="hidden sm:flex flex-1">
                  <form className="w-full" action="#" method="GET">
                    <div className="relative sm:w-40 rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-200 rounded-md"
                        placeholder="Quick search..."
                      />
                    </div>
                  </form>
                </div>
                <div className="flex items-center md:ml-6">
                  <NewNoteButton />
                  <LockUnlock />
                </div>
              </div>
            </div>
          </div>

          <main className="flex-1 overflow-y-auto focus:outline-none">
            <div className="relative max-w-4xl mx-auto md:px-8 xl:px-0">
              <div className="pt-5 pb-16 px-5 h-full sm:px-10 md:px-0">
                <div>{header}</div>
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SecureProvider>
  );
}
