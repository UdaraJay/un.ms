import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import moment from 'moment-timezone';
import { encrypt, decrypt } from '@/hooks/encryption';
import {
  toggleHighlight as toggleHighlightApiCall,
  deleteActivity as deleteActivityApiCall,
} from '@/services/activity';

const SingleActivity = ({ activity }) => {
  const { encryptionPackage } = useAuth({ middleware: 'auth' });
  const [decryptedData, setDecryptedData] = useState(null);
  const [highlight, setHighlight] = useState(activity.highlight ?? false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (!activity) return;
    if (!encryptionPackage) return;

    let active = true;
    load();
    return () => {
      active = false;
    };

    async function load() {
      const data = await decrypt(encryptionPackage, activity.data).catch(
        () => null
      );

      if (!active) {
        return;
      }
      setDecryptedData(data);
    }
  }, [activity, encryptionPackage]);

  const toggleHightlight = (id) => {
    setHighlight(!highlight);
    toggleHighlightApiCall(id);
  };

  const deleteActivity = (id) => {
    setDeleted(true);
    deleteActivityApiCall(id);
  };

  if (!activity) return null;

  const renderDate = (date) => {
    const d = new Date(date);
    const now = new Date();

    const diff = Math.round((d.getTime() - now.getTime()) / (1000 * 3600 * 24));

    switch (diff) {
      case 0:
        return moment.utc(activity.created_at).local().format('h:MM a');
    }

    return moment.utc(activity.created_at).local().format('MMM Do YYYY, h:MMa');
  };

  if (deleted) return null;

  return (
    <div
      key={activity.id}
      className={`group mb-6 duration-200 ease-in-out ${
        highlight
          ? 'border-0 border-indigo-100 rounded-xl py-3 px-5 -my-3 -ml-5 bg-gradient-to-bl from-transparent to-white'
          : 'no'
      }`}
    >
      <div
        className={`
          ${decryptedData?.text?.length <= 2 ? 'text-4xl' : 'text-2xl'}
          ${decryptedData?.sentiment < -1 && 'text-pink-600'}
          ${decryptedData?.sentiment > 1 && 'text-green-500'}
        `}
      >
        {decryptedData?.text}
      </div>
      <div className="group select-none flex item-center align-middle text-gray-400 mt-2 text-sm">
        <div className={`py-1.5 mr-2 ${highlight && 'text-indigo-500'}`}>
          {renderDate(activity.created_at)}
        </div>
        <button
          type="button"
          onClick={() => toggleHightlight(activity.id)}
          className="inline-flex rounded-full rounded-full opacity-0 duration-300 ease-in-out group-hover:opacity-100 
          items-center px-2 py-0.5 hover:text-indigo-500 font-medium"
        >
          Highlight
        </button>

        <button
          type="button"
          onClick={() => deleteActivity(activity.id)}
          className="inline-flex rounded-full delay-75 rounded-full opacity-0 duration-300 ease-in-out group-hover:opacity-100 
          items-center px-2 py-0.5 hover:text-red-500 font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default SingleActivity;
