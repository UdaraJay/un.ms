import {
  CogIcon,
  MenuAlt2Icon,
  QuestionMarkCircleIcon,
  XIcon,
  SearchIcon,
  LockOpenIcon,
  LockClosedIcon,
} from '@heroicons/react/solid';
import { useSecure, SecureProvider } from '@/contexts/secure';

const LockUnlock = () => {
  const { locked, lock } = useSecure();

  return (
    <button
      onClick={async () => await lock()}
      className="rounded-full p-1.5 text-gray-800 border-white border-2 shadow-sm-inner hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mr-3 sm:mr-1"
    >
      {locked ? (
        <LockClosedIcon className="h-5 w-5" aria-hidden="true" />
      ) : (
        <LockOpenIcon className="h-5 w-5" aria-hidden="true" />
      )}
      <span className="sr-only">Lock</span>
    </button>
  );
};

export default LockUnlock;
