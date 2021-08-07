import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { decrypt } from '@/hooks/encryption';
import { list } from '@/services/activity';

const TodaySummary = ({ appendText = () => {} }) => {
  const { encryptionPackage } = useAuth({ middleware: 'auth' });
  const [emojiCounter, setEmojiCounter] = useState({});
  const { data: activity } = list(1);

  useEffect(() => {
    let active = true;
    let emojiCounterTracker = {};
    load();
    return () => {
      active = false;
    };

    async function load() {
      const list = await Promise.all(
        activity.map(async (a) => {
          const b = { ...a, data: await decrypt(encryptionPackage, a.data) };
          return b;
        })
      );

      for (const b of list) {
        if (b.data?.emojis) {
          for (const [emoji, number] of Object.entries(b.data.emojis)) {
            emojiCounterTracker[emoji] = emojiCounterTracker[emoji]
              ? emojiCounterTracker[emoji] + number
              : number;
          }
        }
      }

      if (!active) {
        return;
      }
      setEmojiCounter(emojiCounterTracker);
    }
  }, [activity, encryptionPackage]);

  const emojis = [];

  for (const [emoji, number] of Object.entries(emojiCounter)) {
    emojis.push(
      <span
        key={emoji}
        onClick={() => {
          appendText(emoji);
        }}
        className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 mr-2 duration-100 hover:bg-gray-200 cursor-pointer"
      >
        <div className="mr-1">{emoji}</div>
        {number}
      </span>
    );
  }

  return (
    <div className="flex mb-10 item-center flex-wrap">
      <div className="mr-3 text-sm text-gray-400 py-1">Today</div> {emojis}
    </div>
  );
};

export default TodaySummary;
