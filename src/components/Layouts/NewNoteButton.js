import { useState } from 'react';
import { useRouter } from 'next/router';
import { create } from '@/services/note';
import pause from '@/lib/pause';

const NewNoteButton = () => {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const createNote = async () => {
    setCreating(true);
    const slug = await create();
    await pause(200);
    setCreating(false);
    router.push(`/note/${slug}`);
  };

  return (
    <button
      onClick={async () => await createNote()}
      className="inline-flex mr-3 items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {creating && (
        <svg
          className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-gray-500"
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
      New Note
    </button>
  );
};

export default NewNoteButton;
