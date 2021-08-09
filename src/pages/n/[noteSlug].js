import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ApplicationLogo from '@/components/ApplicationLogo';
import Footer from '@/components/Layouts/Footer';
import { getNote } from '@/services/note';
import Editor from 'rich-markdown-editor';
import moment from 'moment-timezone';
import LoadingFull from '@/components/LoadingFull';

const PublicNote = () => {
  const router = useRouter();
  const { noteSlug } = router.query;
  const note = getNote(noteSlug);

  if (!note) return <LoadingFull />;
  return (
    <>
      <Head>
        <title>Unanimous</title>
      </Head>
      <div className="max-w-7xl mx-auto px-6 sm:px-20 lg:px-10">
        <div className="max-w-prose mx-auto pt-16">
          <Link href="/">
            <a>
              <ApplicationLogo className="w-7 h-7 stroke-none fill-current" />
            </a>
          </Link>
          <div className="mt-10 pb-40">
            <h1 className="font-semibold text-gray-900 leading-relaxed text-4xl">
              {note.title}
            </h1>
            <div className="text-gray-400 text-sm mb-10 ">
              <span className="font-medium">@{note.username}</span> •{' '}
              {moment.utc(note.created_at).format('dddd, MMMM Do YYYY, h:mm a')}
            </div>
            <Editor id={noteSlug} value={note.data.markdown} readOnly />
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicNote;
