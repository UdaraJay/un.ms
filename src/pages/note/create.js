import AppLayout from '@/components/Layouts/AppLayout_old';

const CreateNote = () => {
  return (
    <AppLayout
      header={
        <h2 className="font-semibold text-sm uppercase text-gray-400 leading-tight">
          Create a new note
        </h2>
      }
    >
      <div className="w-full mt-6  py-4 border-b border-gray-200 overflow-hidden">
        <div className="">
          <div className="">You're logged in! 2</div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateNote;
