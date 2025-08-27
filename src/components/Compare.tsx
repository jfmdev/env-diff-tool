import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDownAZ,
  faTableColumns,
} from '@fortawesome/free-solid-svg-icons';
import { useDeferredValue, useMemo, useState } from 'react';

import { diffEnvFiles } from '../utils/envUtils';

type CompareProps = {
  firstValue: string;
  secondValue: string;
};

// TODO: Display comments.
// TODO: Implement Sort button.
// TODO: Implement Side-by-side button.
export function Compare({ firstValue, secondValue }: CompareProps) {
  const [sideBySide, setSideBySide] = useState(true);
  const [sort, setSort] = useState(false);

  const deferredFirstValue = useDeferredValue(firstValue);
  const deferredSecondValue = useDeferredValue(secondValue);

  const diffValue = useMemo(() => {
    console.log(
      'diffValue',
      diffEnvFiles(deferredFirstValue, deferredSecondValue),
    );
    return diffEnvFiles(deferredFirstValue, deferredSecondValue);
  }, [deferredFirstValue, deferredSecondValue]);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="w-[100px]">
          <button
            type="button"
            name="sort"
            className={`border border-gray-600 dark:border-gray-400 rounded cursor-pointer ${sort ? 'bg-teal-400 text-black dark:bg-teal-800 dark:text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}
            onClick={() => setSort(!sort)}
            title={sort ? 'Use default sort order' : 'Sort keys alphabetically'}
            aria-label={
              sort ? 'Use default sort order' : 'Sort keys alphabetically'
            }
          >
            <FontAwesomeIcon icon={faArrowDownAZ} />
          </button>
        </div>

        <h2 className="text-2xl md:text-3xl drop-shadow-lg">Comparison</h2>

        <div className="w-[100px] text-right">
          <button
            type="button"
            name="view"
            className="border border-gray-600 dark:border-gray-400 rounded cursor-pointer inline-flex flex-row"
            onClick={() => setSideBySide(!sideBySide)}
            title={`Switch to ${sideBySide ? 'Stacked' : 'Side by side'} view`}
            aria-label={`Switch to ${sideBySide ? 'Stacked' : 'Side by side'} view`}
          >
            <div
              className={`rounded-l p-1 ${sideBySide ? 'bg-violet-400 text-black dark:bg-violet-800 dark:text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}
            >
              <FontAwesomeIcon icon={faTableColumns} />
            </div>
            <div
              className={`rounded-r p-1 ${!sideBySide ? 'bg-indigo-400 text-black dark:bg-indigo-800 dark:text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}
            >
              <FontAwesomeIcon icon={faTableColumns} rotation={270} />
            </div>
          </button>
        </div>
      </div>

      <div className="font-mono border border-gray-500 bg-white dark:bg-black rounded-md py-2 mt-4">
        {diffValue.map((diffItem, index) => (
          <div key={diffItem.key} className={index > 0 ? 'mt-1' : ''}>
            {diffItem.oldValue && diffItem.oldValue !== diffItem.newValue && (
              <div
                className={`px-2 ${diffItem.newValue ? 'bg-sky-200 dark:bg-sky-900 line-through text-slate-600 dark:text-slate-400' : 'bg-red-200 dark:bg-red-900 line-through text-slate-700 dark:text-slate-300'}`}
              >
                {diffItem.key}={diffItem.oldValue}
              </div>
            )}
            {diffItem.newValue && (
              <div
                className={`px-2 ${!diffItem.oldValue ? 'bg-green-200 dark:bg-green-900' : diffItem.oldValue !== diffItem.newValue ? 'bg-sky-200 dark:bg-sky-900' : ''}`}
              >
                {diffItem.key}={diffItem.newValue}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
