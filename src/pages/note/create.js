import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layouts/AppLayout';
import { create } from '@/services/note';

// This just needs to initialize a new note
// with the server and redirect to the edit
// page; this can show a loading screen while
// it happens
const CreateNote = () => {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    load();
    return () => {
      active = false;
    };

    async function load() {
      const slug = await create();

      if (!active) {
        return;
      }

      router.push(`/note/${slug}`);
    }
  }, []);

  return (
    <AppLayout>
      <div>Loading....</div>
    </AppLayout>
  );
};

export default CreateNote;
