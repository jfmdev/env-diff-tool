import { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { Compare } from './components/Compare';
import { Merge } from './components/Merge';
import { ThemeSwitcher } from './components/ThemeSwitcher';

function App() {
  const [count, setCount] = useState(0);

  // REQ: Keep the comments and empty lines as they are. Assume that they should be keep above the next
  // variable (except for comments that are at the end of the file, that should remain there).

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-bold text-center drop-shadow-lg mb-6">
        Env Diff Tool
      </h1>

      <ThemeSwitcher className="absolute top-4 right-4" />

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <div className="flex flex-col gap-2 mt-4 md:flex-row px-2">
        <div className="flex-1">
          <div>First file</div>
          <textarea className="border border-gray-500 dark:border-gray-400 rounded-md p-2 min-h-[150px] w-full resize-none"></textarea>
        </div>
        <div className="flex-1">
          <div>Second file</div>
          <textarea className="border border-gray-500 dark:border-gray-400 rounded-md p-2 min-h-[150px] w-full resize-none"></textarea>
        </div>
      </div>

      {/*
        <FontAwesomeIcon icon={faArrowRightArrowLeft} /> Switch files
      */}

      <Compare />

      <Merge />
    </>
  );
}

export default App;
