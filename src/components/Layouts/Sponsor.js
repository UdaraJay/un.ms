import Link from 'next/link';

const Sponsor = () => {
  return (
    <div className="inline-block mt-20 border-t border-gray-300 border-dotted pt-5">
      <a
        href="https://clew.ai"
        target="_blank"
        className="text-xs text-gray-400"
      >
        <div className="font-medium mb-0.5 leading-tight text-gray-500 hover:text-indigo-500">
          Sponsored by Clew
        </div>
        A digital workspace for work.
        <div>Search, organize, and collaborate in one place.</div>
      </a>
    </div>
  );
};

export default Sponsor;
