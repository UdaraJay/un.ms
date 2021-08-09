import { list } from '@/services/activity';
import { InformationCircleIcon } from '@heroicons/react/solid';

const ActivityTutorial = () => {
  const { data: activity } = list(1);
  if (activity.length > 2) return null;

  return (
    <div className="flex mb-5 w-full justify-between text-gray-500 text-sm leading-relaxed border p-5 rounded-lg">
      <div>
        <ol className="list-decimal list-inside">
          <li>Activities are short status messages</li>
          <li>You can use emojis to tag things</li>
          <li>They are encrypted by default, and are for your eyes only</li>
        </ol>
        <div className="mt-3 text-xs text-gray-400">
          These tips will go away once you've recorded 3 activites
        </div>
      </div>
      <div className="ml-4 flex-shrink-0">
        <InformationCircleIcon className="h-6 w-6 fill-current text-gray-500" />
      </div>
    </div>
  );
};

export default ActivityTutorial;
