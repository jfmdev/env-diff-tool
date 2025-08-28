import { useState, useEffect } from 'react';

import { Compare } from './components/Compare';
import { Inputs } from './components/Inputs';
import { Merge } from './components/Merge';
import { ThemeSwitcher } from './components/ThemeSwitcher';

const LSKeys = {
  FIRST: 'env-diff_first',
  SECOND: 'env-diff_second',
};

function App() {
  const [first, setFirst] = useState(
    () => localStorage.getItem(LSKeys.FIRST) || '',
  );
  const [second, setSecond] = useState(
    () => localStorage.getItem(LSKeys.SECOND) || '',
  );

  useEffect(() => {
    localStorage.setItem(LSKeys.FIRST, first);
  }, [first]);

  useEffect(() => {
    localStorage.setItem(LSKeys.SECOND, second);
  }, [second]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-2">
      <h1 className="text-4xl md:text-5xl font-bold text-center drop-shadow-lg mb-6">
        Env Diff Tool
      </h1>

      <ThemeSwitcher className="absolute top-4 right-2" />

      <Inputs
        firstValue={first}
        secondValue={second}
        onChangeFirst={setFirst}
        onChangeSecond={setSecond}
      />

      <div className="mt-3">
        <Compare firstValue={first} secondValue={second} />
      </div>

      <div className="mt-3">
        <Merge />
      </div>
    </div>
  );
}

export default App;
