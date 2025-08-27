import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';

export function ThemeSwitcher({ className }: { className?: string }) {
  const isDarkPreferred = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches;
  const [isDark, setIsDark] = useState(isDarkPreferred);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <button
      type="button"
      name="theme-switcher"
      className={`border border-gray-600 dark:border-gray-400 rounded cursor-pointer inline-flex flex-row ${className}`}
      onClick={toggleTheme}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <div className="rounded-l p-1 transition-colors bg-amber-500 text-black dark:bg-gray-800 dark:text-gray-400">
        <FontAwesomeIcon icon={faSun} />
      </div>
      <div className="rounded-r p-1 transition-colors bg-gray-100 text-gray-500 dark:bg-cyan-800 dark:text-white">
        <FontAwesomeIcon icon={faMoon} />
      </div>
    </button>
  );
}
