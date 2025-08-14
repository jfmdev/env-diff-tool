import { useState } from 'react';

import { Compare } from './components/Compare';
import { Inputs } from './components/Inputs';
import { Merge } from './components/Merge';
import { ThemeSwitcher } from './components/ThemeSwitcher';

function App() {
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl md:text-5xl font-bold text-center drop-shadow-lg mb-6">
        Env Diff Tool
      </h1>

      <ThemeSwitcher className="absolute top-4 right-4" />

      <Inputs
        firstValue={first}
        secondValue={second}
        onChangeFirst={setFirst}
        onChangeSecond={setSecond}
      />

      <Compare />

      <Merge />
    </div>
  );
}

export default App;
