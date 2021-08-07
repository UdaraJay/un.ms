import PageLayout from '@/components/Layouts/PageLayout';

export default function About() {
  return (
    <PageLayout>
      <div className="max-w-sm leading-normal text-gray-900">
        <p>
          I built un.ms, or <u>unanimous</u> if you need a name for it, mostly
          for myself. It's a simple tool that I built to take notes and
          synchronize them across devices.
        </p>

        <p className="mt-3">
          Sometime ago I created an open-source command-line tool called{' '}
          <a
            className="text-indigo-500 hover:text-indigo-600"
            href="https://github.com/UdaraJay/atm"
            target="_blank"
          >
            atm (at the moment)
          </a>{' '}
          to do the same thing. It had the benifit of being very simple and
          keeping the data local, on my own computer, but I could use it only on
          one device.
        </p>

        <p className="mt-3"></p>
      </div>
    </PageLayout>
  );
}
