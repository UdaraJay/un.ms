import { useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import { useAuth } from '@/hooks/auth';
import { list } from '@/services/note';
import {
  ArrowNarrowRightIcon,
  ArrowNarrowLeftIcon,
  GlobeAltIcon,
  LockClosedIcon,
  PlusIcon,
} from '@heroicons/react/solid';
import moment from 'moment-timezone';
import Link from 'next/link';

const Notes = () => {
  const { user } = useAuth({ middleware: 'auth' });
  const [page, setPage] = useState(1);

  const notes = list(page);

  if (!notes) return null;

  const renderNotes = () => {
    if (!notes || notes.data.length == 0)
      return (
        <div className="border w-full rounded-lg shadow-sm p-5 pb-7 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No notes</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new note.
          </p>
          <div className="mt-6">
            <a
              href="/note/create"
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Note
            </a>
          </div>
        </div>
      );

    return notes.data.map((note) => {
      return (
        <li
          key={note.id}
          className="col-span-1 bg-white rounded-lg border shadow-sm divide-y divide-gray-200  hover:border-gray-300"
        >
          <Link href="/note/[slug]" as={`/note/${note.slug}`}>
            <a className="w-full flex min-h-full items-start justify-between p-4 space-x-3">
              <div className="flex h-40 flex-col justify-between break-word">
                <h3 className="text-gray-900 text-sm font-medium">
                  {note.title || 'Untitled'}
                </h3>
                <p className="text-gray-500 text-sm">
                  {moment.utc(note.created_at).fromNow()}
                </p>
              </div>
              <div>
                {note.public ? (
                  <GlobeAltIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <LockClosedIcon className="w-5 h-5 text-green-400" />
                )}
              </div>
            </a>
          </Link>
        </li>
      );
    });
  };

  const renderNavigation = () => {
    return (
      <nav
        className="py-3 flex items-center justify-between mt-5"
        aria-label="Pagination"
      >
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{notes.from}</span> to{' '}
            <span className="font-medium">{notes.to}</span> of{' '}
            <span className="font-medium">{notes.total}</span> notes
          </p>
        </div>
        <div className="flex-1 flex justify-between sm:justify-end">
          {notes.current_page > 1 && (
            <div
              onClick={() => setPage(page - 1)}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <ArrowNarrowLeftIcon className="w-5 h-5" />
            </div>
          )}

          {notes.current_page < notes.last_page && (
            <div
              onClick={() => setPage(page + 1)}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <ArrowNarrowRightIcon className="w-5 h-5" />
            </div>
          )}
        </div>
      </nav>
    );
  };

  return (
    <AppLayout>
      <div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {renderNotes()}
        </ul>
        {renderNavigation()}
      </div>
    </AppLayout>
  );
};

export default Notes;
