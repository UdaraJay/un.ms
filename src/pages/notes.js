import { useState } from 'react';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layouts/AppLayout';
import { list } from '@/services/note';
import {
  ArrowNarrowRightIcon,
  ArrowNarrowLeftIcon,
  GlobeAltIcon,
  LockClosedIcon,
  LockOpenIcon,
} from '@heroicons/react/solid';
import moment from 'moment-timezone';
import Link from 'next/link';

const Notes = () => {
  const [page, setPage] = useState(1);

  const notes = list(page);

  if (!notes) return null;

  const renderNotes = () => {
    return notes.data.map((note) => {
      return (
        <li
          key={note.id}
          className="col-span-1 bg-white rounded-lg border shadow-sm divide-y divide-gray-200  hover:border-gray-300"
        >
          <Link href={`/note/${note.slug}`}>
            <a className="w-full flex min-h-full  items-start justify-between p-4 space-x-3">
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
        className="bg-white py-3 flex items-center justify-between mt-5"
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
