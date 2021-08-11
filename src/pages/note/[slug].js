import { Fragment, useState, useEffect, useCallback, useRef } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import Editor from 'rich-markdown-editor';
import { useRouter } from 'next/router';
import {
  getNote,
  updateNote,
  togglePublic as togglePublicApiCall,
} from '@/services/note';
import { useAuth } from '@/hooks/auth';
import {
  LockOpenIcon,
  LockClosedIcon,
  ChevronDownIcon,
} from '@heroicons/react/solid';
import { encrypt, decrypt } from '@/hooks/encryption';
import TextareaAutosize from 'react-textarea-autosize';
import { Switch, Menu, Transition } from '@headlessui/react';
import moment from 'moment-timezone';
import _ from 'lodash';
import pause from '@/lib/pause';
import { deleteNote as deleteNoteApiCall } from '@/services/note';
import theme from '@/styles/editorTheme';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const SaveButton = ({ isPublic, save, slug, saving }) => {
  const router = useRouter();

  const deleteNote = async (slug) => {
    await deleteNoteApiCall(slug);
    router.push('/notes');
  };

  return (
    <span className="relative z-0 inline-flex shadow-sm rounded-md">
      <button
        type="button"
        onClick={() => save(isPublic)}
        className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
      >
        {saving && (
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
        Save changes
      </button>
      <Menu as="span" className="-ml-px relative block">
        {({ open }) => (
          <>
            <Menu.Button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
              <span className="sr-only">Open options</span>
              <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
            </Menu.Button>
            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="origin-top-right absolute right-0 mt-2 -mr-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => {}}
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'w-full block px-4 py-2 text-sm text-left'
                        )}
                      >
                        Export markdown
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={async () => await deleteNote(slug)}
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'w-full block px-4 py-2 text-sm text-left'
                        )}
                      >
                        Delete Note
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </span>
  );
};

const WriteNote = () => {
  const router = useRouter();
  const { encryptionPackage } = useAuth({ middleware: 'auth' });
  const { slug } = router.query;
  const note = getNote(slug);

  const [saving, setSaving] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [title, setTitle] = useState('');
  const [markdown, setMarkdown] = useState(null);
  const editorRef = useRef(null);

  // load the markdown, decrypt if necessary
  useEffect(() => {
    if (!note) return;
    if (!encryptionPackage) return;

    setTitle(note.title);
    // if the note has no data then
    // it's just blank
    if (note.data == null) {
      setMarkdown('');
      return;
    }

    // public note
    if (note.public) {
      setIsPublic(note.public);
      setMarkdown(note.data.markdown);
      return;
    }

    let active = true;
    load();

    return () => {
      active = false;
    };

    async function load() {
      // decrypt i
      const data = await decrypt(encryptionPackage, note.data).catch(() => {
        console.log('error');
      });
      if (!active) {
        return;
      }

      // save here
      setMarkdown(data.markdown);
    }
  }, [note, encryptionPackage]);

  const onTitleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editorRef.current.focusAtStart();
    }
  };

  const onTitleChange = (e) => {
    const title = e.target.value;
    setTitle(title);
  };

  const togglePublic = () => {
    const setPublicTo = !isPublic;
    setIsPublic(setPublicTo);
    togglePublicApiCall(note.slug);
    save(setPublicTo);
  };

  const onChange = useCallback(
    _.debounce((value) => {
      const markdown = value();
      setMarkdown(markdown);
    }, 2000),
    []
  );

  const onSave = async () => {
    await save(isPublic);
  };

  const save = async (isPublic) => {
    setSaving(true);

    // if public: write plain markdown
    if (isPublic) {
      await updateNote(slug, { title, data: { markdown } });
      await pause(300);
      setSaving(false);
      return;
    }

    const encryptedPackage = await encrypt(encryptionPackage, {
      markdown,
    }).catch((err) => {
      // handle this
    });

    await updateNote(slug, { title, data: encryptedPackage });
    await pause(400);

    setSaving(false);
  };

  const renderNote = () => {
    if (!note) return null;
    if (markdown == null) return null;

    return (
      <div className="w-full">
        <div className="flex justify-between items-center pb-5">
          <Switch.Group as="div" className="flex items-center">
            <Switch
              checked={isPublic}
              onChange={togglePublic}
              className={classNames(
                isPublic ? 'bg-indigo-600' : 'bg-gray-200',
                'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              )}
            >
              <span className="sr-only">Private/Public</span>
              <span
                className={classNames(
                  isPublic ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                )}
              >
                <span
                  className={classNames(
                    isPublic
                      ? 'opacity-0 ease-out duration-100'
                      : 'opacity-100 ease-in duration-200',
                    'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                  )}
                  aria-hidden="true"
                >
                  <LockClosedIcon className="h-3 w-3 text-gray-400" />
                </span>
                <span
                  className={classNames(
                    isPublic
                      ? 'opacity-100 ease-in duration-200'
                      : 'opacity-0 ease-out duration-100',
                    'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                  )}
                  aria-hidden="true"
                >
                  <LockOpenIcon className="h-3 w-3 text-gray-400" />
                </span>
              </span>
            </Switch>
            <Switch.Label
              as="span"
              className="flex items-center align-middle ml-3 mr-3"
            >
              <span className="text-sm font-medium text-gray-900">
                {isPublic ? 'Public' : 'Private'}
              </span>
            </Switch.Label>
            {isPublic && (
              <span className="ml-1 hidden sm:visible text-sm text-gray-500">
                (
                <a
                  href={`https://un.ms/n/${note.slug}`}
                  target="_blank"
                  className="hover:text-indigo-500 select-all"
                >
                  {`un.ms/n/${note.slug}`}
                </a>
                )
              </span>
            )}
          </Switch.Group>

          <SaveButton
            isPublic={isPublic}
            save={save}
            slug={note.slug}
            saving={saving}
          />
        </div>
        <div className="mt-5">
          <TextareaAutosize
            value={title}
            onChange={onTitleChange}
            minRows={1}
            onKeyDown={onTitleEnter}
            className={`resize-none max-w-md mt-3 mb-2 p-0 border block text-gray-600
    border-transparent outline-none focus:outline-none focus:ring-0 focus:border-transparent
    placeholder-gray-300 text-3xl sm:text-5xl font-bold leading-relaxed overflow-hidden whitespace-pre-wrap shadow-none
  `}
            placeholder="Title"
            autoFocus
            disabled={saving}
          ></TextareaAutosize>
        </div>
        <div className="text-gray-400 text-sm mb-10">
          {moment.utc(note.created_at).format('dddd, MMMM Do YYYY, h:mm a')}
        </div>
        <div className="max-w-lg">
          <Editor
            id={note.slug}
            defaultValue={markdown}
            ref={editorRef}
            placeholder={`You can start writing here. Note: Only the contents of your notes are encrypted (when notes are not public). The title remains unencrypted to make it easy for you to search and find notes.`}
            autoFocus={markdown != ''}
            headingsOffset={1}
            onChange={onChange}
            onSave={onSave}
            dark={false}
            theme={theme}
          />
        </div>
      </div>
    );
  };

  return <AppLayout>{renderNote()}</AppLayout>;
};

export default WriteNote;
