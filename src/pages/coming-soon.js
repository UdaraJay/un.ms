import AppLayout from '@/components/Layouts/AppLayout';

const ComingSoon = () => {
  return (
    <AppLayout>
      <div className="max-w-md text-gray-600 border rounded-xl bg-white shadow-sm p-7 text-sm">
        <h2 className="text-lg font-semibold mb-1">We're working on it!</h2>
        This feature is in the works, you can follow along for progress or
        contribute features on our GitHub repository.
        <br />
        <a
          href="https://github.com/UdaraJay/un.ms"
          type="button"
          target="_blank"
          className="mt-5 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          rel="noopener noreferrer"
        >
          GitHub/un.ms
        </a>
      </div>
    </AppLayout>
  );
};

export default ComingSoon;
