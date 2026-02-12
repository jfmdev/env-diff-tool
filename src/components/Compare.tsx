import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDownAZ,
  faTableColumns,
} from '@fortawesome/free-solid-svg-icons';
import { useDeferredValue, useMemo, useState } from 'react';

import DiffItem from './DiffItem';
import { diffEnvFiles } from '../utils/envUtils';

type CompareProps = {
  firstValue: string;
  secondValue: string;
};

export function Compare({ firstValue, secondValue }: CompareProps) {
  const [sideBySide, setSideBySide] = useState(true);
  const [sort, setSort] = useState(false);

  const deferredFirstValue = useDeferredValue(firstValue);
  const deferredSecondValue = useDeferredValue(secondValue);

  const diffValue = useMemo(() => {
    const diffData = diffEnvFiles(deferredFirstValue, deferredSecondValue);
    return sort
      ? diffData.sort((itemA, itemB) => itemA.key.localeCompare(itemB.key))
      : diffData;
  }, [deferredFirstValue, deferredSecondValue, sort]);

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
        {diffValue.map((diffItem) => (
          <DiffItem
            key={diffItem.key}
            item={diffItem}
            sideBySide={sideBySide}
          />
        ))}
      </div>
    </>
  );
}
