import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';

export function Inputs({
  firstValue,
  secondValue,
  onChangeFirst,
  onChangeSecond,
}: {
  firstValue: string;
  secondValue: string;
  onChangeFirst: (value: string) => void;
  onChangeSecond: (value: string) => void;
}) {
  return (
    <>
      <div className="flex flex-col gap-2 md:flex-row px-2">
        <div className="flex-1">
          <div className="font-bold text-indigo-800 dark:text-indigo-200">
            First file
          </div>
          <textarea
            name="first-file"
            className="border border-gray-500 bg-white dark:bg-black rounded-md p-2 min-h-[200px] w-full resize-none"
            value={firstValue}
            onChange={(e) => onChangeFirst(e.target.value)}
          ></textarea>
        </div>
        <div className="flex-1">
          <div className="font-bold text-indigo-800 dark:text-indigo-200">
            Second file
          </div>
          <textarea
            name="second-file"
            className="border border-gray-500 bg-white dark:bg-black dark:border-gray-400 rounded-md p-2 min-h-[200px] w-full resize-none"
            value={secondValue}
            onChange={(e) => onChangeSecond(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="flex justify-center mt-1">
        <button
          type="button"
          name="swap-files"
          className={`border rounded-md p-1 cursor-pointer transition ${firstValue === secondValue ? 'border-gray-800 dark:border-gray-200 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400' : 'border-sky-800 dark:border-sky-200 bg-sky-200 dark:bg-sky-800  dark:text-white'}`}
          onClick={() => {
            onChangeFirst(secondValue);
            onChangeSecond(firstValue);
          }}
          title="Click to swap the content of both files"
        >
          <FontAwesomeIcon icon={faArrowRightArrowLeft} /> Swap files
        </button>
      </div>
    </>
  );
}
