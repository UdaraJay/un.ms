import Link from 'next/link';
import Head from 'next/head';
import ApplicationLogo from '@/components/ApplicationLogo';
import Footer from '@/components/Layouts/Footer';

const PageLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Unanimous</title>
      </Head>
      <div className="max-w-7xl mx-auto px-6 sm:px-20 lg:px-10">
        <div className="max-w-prose mx-auto pt-16">
          <Link href="/">
            <a>
              <ApplicationLogo className="w-10 h-10 stroke-none fill-current" />
            </a>
          </Link>
          <div className="mt-10 pb-40">{children}</div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default PageLayout;
