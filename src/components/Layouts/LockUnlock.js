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
      className="bg-white rounded-full p-1.5 text-gray-800 hover:bg-gray-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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
