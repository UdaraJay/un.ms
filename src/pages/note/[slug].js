import { Fragment, useState, useEffect, useCallback, useRef } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
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
  CheckCircleIcon,
} from '@heroicons/react/solid';
import { encrypt, decrypt } from '@/hooks/encryption';
import TextareaAutosize from 'react-textarea-autosize';
import { Switch, Menu, Transition } from '@headlessui/react';
import moment from 'moment-timezone';
import pause from '@/lib/pause';
import { deleteNote as deleteNoteApiCall } from '@/services/note';
import FastEditor from '@/components/FastEditor';
import { debounce } from 'lodash';

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
    <span className="relative z-0 inline-flex rounded-md pl-3">
      <div className="flex justify-center items-center mr-3">
        <CheckCircleIcon
          className={`h-5 w-5 text-gray-300 duration-200 ${
            saving && 'animate-pulse text-yellow-300'
          }`}
        />
      </div>
      <Menu as="span" className="-ml-px relative block">
        {({ open }) => (
          <>
            <Menu.Button className="relative inline-flex items-center px-1 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
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
  const [isPublic, setIsPublic] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(null);

  // load the markdown, decrypt if necessary
  useEffect(() => {
    if (!note) return;
    if (!encryptionPackage) return;

    setTitle(note.title);
    // if the note has no data then
    // it's just blank
    if (note.data == null) {
      setContent('');
      return;
    }

    // public note
    if (note.public) {
      setIsPublic(note.public);
      setContent(note.data.content);
      return;
    }

    let active = true;
    load();

    return () => {
      active = false;
    };

    async function load() {
      const data = await decrypt(encryptionPackage, note.data).catch(() => {
        console.log('error');
      });
      if (!active) {
        return;
      }

      // save here
      setContent(data.content);
    }
  }, [note, encryptionPackage]);

  const onTitleChange = (e) => {
    const title = e.target.value;
    setTitle(title);
    debouncedTitleChange(slug, title);
  };

  const debouncedTitleChange = useCallback(
    debounce(async (slug, title) => {
      await updateNote(slug, { title });
    }, 250),
    []
  );

  const togglePublic = async () => {
    const setPublicTo = !isPublic;
    setIsPublic(setPublicTo);
    await togglePublicApiCall(note.slug);
    await save(setPublicTo, content);
  };

  const onChange = useCallback(
    async (content) => {
      await save(isPublic, content);
      setContent(content);
    },
    [slug, isPublic, encryptionPackage]
  );

  const save = async (isPublic, content) => {
    setSaving(true);

    // if public: write plain markdown
    if (isPublic) {
      await updateNote(slug, { data: { content } });
      await pause(300);
      setSaving(false);
      return;
    }

    const encryptedPackage = await encrypt(encryptionPackage, {
      content,
    }).catch((err) => {
      // handle this
    });

    await updateNote(slug, { data: encryptedPackage });
    await pause(400);

    setSaving(false);
  };

  const renderNote = () => {
    if (!note) return null;
    if (content == null) return null;

    return (
      <div className="max-w-lg bg-white rounded-lg shadow-sm border">
        <div className="px-6 pt-5 pb-1">
          <div className="flex justify-between">
            <TextareaAutosize
              value={title}
              onChange={onTitleChange}
              minRows={1}
              className={`w-full resize-none mb-0.5 p-0 border block text-gray-800
    border-transparent outline-none focus:outline-none focus:ring-0 focus:border-transparent
    placeholder-gray-300 text-xl font-semibold leading-relaxed overflow-hidden whitespace-pre-wrap shadow-none
  `}
              placeholder="Title"
              autoFocus
              disabled={saving}
            ></TextareaAutosize>
            <div>
              <SaveButton
                isPublic={isPublic}
                save={save}
                slug={note.slug}
                saving={saving}
              />
            </div>
          </div>

          <div className="text-gray-400 text-sm mb-3">
            {moment.utc(note.created_at).format('dddd, MMMM Do YYYY, h:mm a')}
            {isPublic && (
              <span className="ml-1 text-sm text-gray-400">
                •{' '}
                <a
                  href={`https://un.ms/n/${note.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-500 select-all"
                >
                  {`un.ms/n/${note.slug}`}
                </a>
              </span>
            )}
          </div>
        </div>

        <div className="max-w-lg px-6">
          <FastEditor
            id={slug}
            onChange={onChange}
            content={content}
            editable={true}
          />
        </div>
        <div className="flex bg-gray-50 px-6 py-4 rounded-b-lg justify-between items-center mt-5">
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
          </Switch.Group>
        </div>
      </div>
    );
  };

  return <AppLayout>{renderNote()}</AppLayout>;
};

export default WriteNote;
