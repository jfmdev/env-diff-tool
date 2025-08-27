import { useDragUtil } from '../hooks/useDragUtil.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';

type InputsProps = {
  firstValue: string;
  secondValue: string;
  onChangeFirst: (value: string) => void;
  onChangeSecond: (value: string) => void;
};

// TODO: Save in local storage the last entered values.
// TODO: Add a 'Load sample data' button.
// TODO: Add a 'Clear all' button.
export function Inputs({
  firstValue,
  secondValue,
  onChangeFirst,
  onChangeSecond,
}: InputsProps) {
  const dragPropsA = useDragUtil((file: File) => readFile(file, onChangeFirst));
  const dragPropsB = useDragUtil((file: File) =>
    readFile(file, onChangeSecond),
  );

  return (
    <>
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="flex-1">
          <div className="font-bold text-indigo-800 dark:text-indigo-200">
            First file
          </div>
          <textarea
            name="first-file"
            className={`font-mono border border-gray-500 bg-white dark:bg-black rounded-md p-2 min-h-[200px] w-full resize-none
              ${dragPropsA.draggingOver ? 'ring-2 border-indigo-300 dark:border-indigo-600 ring-indigo-400 dark:ring-indigo-700' : dragPropsA.isDragging ? 'ring-2 border-sky-300 dark:border-sky-600 ring-sky-400 dark:ring-sky-700' : 'border-gray-500 dark:border-gray-400'}
            `}
            value={firstValue}
            onChange={(evt) => onChangeFirst(evt.target.value)}
            onDragOver={dragPropsA.onDragOver}
            onDragLeave={dragPropsA.onDragLeave}
            onDrop={dragPropsA.onDrop}
          ></textarea>
        </div>

        <div className="flex-1">
          <div className="font-bold text-indigo-800 dark:text-indigo-200">
            Second file
          </div>
          <textarea
            name="second-file"
            className={`font-mono border bg-white dark:bg-black rounded-md p-2 min-h-[200px] w-full resize-none
              ${dragPropsB.draggingOver ? 'ring-2 border-indigo-300 dark:border-indigo-600 ring-indigo-400 dark:ring-indigo-700' : dragPropsB.isDragging ? 'ring-2 border-sky-300 dark:border-sky-600 ring-sky-400 dark:ring-sky-700' : 'border-gray-500 dark:border-gray-400'}
            `}
            value={secondValue}
            onChange={(evt) => onChangeSecond(evt.target.value)}
            onDragOver={dragPropsB.onDragOver}
            onDragLeave={dragPropsB.onDragLeave}
            onDrop={dragPropsB.onDrop}
          ></textarea>
        </div>
      </div>

      <div className="flex justify-center mt-1">
        <button
          type="button"
          name="swap-files"
          className={`border rounded-md p-1 cursor-pointer ${firstValue === secondValue ? 'border-gray-800 dark:border-gray-200 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400' : 'border-sky-800 dark:border-sky-200 bg-sky-200 dark:bg-sky-800  dark:text-white'}`}
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

// Helper to read file as text
function readFile(file: File, callback: (text: string) => void) {
  const reader = new FileReader();
  reader.onload = (evt) => callback(evt.target?.result as string);
  reader.readAsText(file);
}
