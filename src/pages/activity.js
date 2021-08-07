import { useState, useCallback, useRef } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import { parse } from 'twemoji-parser';
import * as calculateSentiment from 'wink-sentiment';
import { Transition } from '@headlessui/react';
import { useAuth } from '@/hooks/auth';
import { encrypt, decrypt } from '@/hooks/encryption';
import { create, list } from '@/services/activity';
import TextareaAutosize from 'react-textarea-autosize';
import TodaySummary from '@/components/Activity/TodaySummary';
import ActivityTutorial from '@/components/Activity/ActivityTutorial';
import SingleActivity from '@/components/Activity/SingleActivity';

const ActivityList = ({ index }) => {
  const { data } = list(index);
  return data.map((item) => <SingleActivity activity={item} key={item.id} />);
};

const Activity = () => {
  const { encryptionPackage } = useAuth({ middleware: 'auth' });
  const [text, setText] = useState('');
  const [sentiment, setSentiment] = useState(0);
  const [saving, setSaving] = useState(false);
  const [cnt, setCnt] = useState(1);
  const activityInputRef = useRef(null);

  const appendText = useCallback(
    (t) => {
      setText(text + t);
      activityInputRef?.current?.focus();
    },
    [text, activityInputRef]
  );

  const updateText = (e) => {
    const text = e.target.value;

    // calculate sentiment
    if (text != '') {
      const sentiment = calculateSentiment(text);
      setSentiment(sentiment.normalizedScore);
    }

    setText(text);
  };

  const createActivity = async () => {
    const emojis = parse(text);
    let emojiCounter = {};

    emojis.map((e) => {
      emojiCounter[e.text] = emojiCounter[e.text]
        ? emojiCounter[e.text] + 1
        : 1;
    });

    const data = { text, sentiment, emojis: emojiCounter };
    const { data: encryptedData, iv } = await encrypt(encryptionPackage, data);
    const encryptedPackage = { data: encryptedData, iv: iv };
    const result = await create(encryptedPackage);

    // now decrypt it
    // const decryptedData = await decrypt(encryptionPackage, encryptedData);
    // console.log('decryptedData', decryptedData);

    // once done
    setSaving(false);
    setText('');
    activityInputRef?.current?.focus();
  };

  const onEnter = async (e) => {
    if (e.target.value == '') return;

    if (e.key === 'Enter' && e.shiftKey) {
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      setSaving(true);
      await createActivity();
      return;
    }
  };

  const pages = [];

  for (let i = 1; i <= cnt; i++) {
    pages.push(<ActivityList index={i} key={i} />);
  }

  console.count('re-render activity');
  return (
    <AppLayout>
      <div className="w-2/3 mt-5">
        <TextareaAutosize
          value={text}
          onChange={updateText}
          ref={activityInputRef}
          minRows={3}
          onKeyDown={onEnter}
          className={`resize-none h-28 p-0 border block w-full text-gray-600
            border-transparent outline-none focus:outline-none focus:ring-0 focus:border-transparent
            placeholder-gray-300 text-3xl sm:text-2xl font-medium duration-500 ease-in-out
            overflow-hidden whitespace-pre-wrap leading-snug shadow-none
            ${saving && 'animate-pulse'}
            ${sentiment < -1 && 'text-pink-600'}
            ${sentiment > 1 && 'text-green-500'}
          `}
          placeholder="Type out an activity you want to record and press enter..."
          autoFocus
          disabled={saving}
        ></TextareaAutosize>

        <div className="mt-5">
          <ActivityTutorial />
          <TodaySummary appendText={appendText} />
          <Transition
            appear={true}
            show={true}
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {pages}
          </Transition>
          <button
            className="inline-flex mt-4 items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setCnt(cnt + 1)}
          >
            Load More
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Activity;
