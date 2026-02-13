// TODO
// Merge rules:

// Variable has non-empty values in both files → Use the value from:
// - First file
// - Second file

// Variable is empty in the first file but not in the second →
// - Keep it empty
// - Use the value from the second file

// Variable exists only in the second file →
// - Omit it
// - Include it

// Comments
// - Remove all comments
// - Keep comments only from the first file.
// - Keep comments from both files (omitting duplicates).

// [ ] Sort merged variables alphabetically
// [ ] Remove empty variables

import { useState } from 'react';

type MergeSettings = {
  conflictResolution: 'first' | 'second';
  emptyInFirst: 'keepEmpty' | 'useSecond';
  onlyInSecond: 'omit' | 'include';
  comments: 'remove' | 'firstOnly' | 'both';
  sortAlphabetically: boolean;
  removeEmpty: boolean;
};

export function Merge() {
  const [settings, setSettings] = useState<MergeSettings>({
    conflictResolution: 'second',
    emptyInFirst: 'useSecond',
    onlyInSecond: 'include',
    comments: 'both',
    sortAlphabetically: false,
    removeEmpty: false,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl drop-shadow-lg">Files merge</h2>
      
      <form className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {/* Conflict Resolution */}
        <div className="space-y-3">
          <label className="block font-semibold text-gray-900 dark:text-gray-100">
            Variable has non-empty values in both files → Use the value from:
          </label>
          <div className="space-y-2 ml-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="conflictResolution"
                value="first"
                checked={settings.conflictResolution === 'first'}
                onChange={(e) => setSettings({ ...settings, conflictResolution: e.target.value as 'first' | 'second' })}
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">First file</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="conflictResolution"
                value="second"
                checked={settings.conflictResolution === 'second'}
                onChange={(e) => setSettings({ ...settings, conflictResolution: e.target.value as 'first' | 'second' })}
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">Second file</span>
            </label>
          </div>
        </div>

        {/* Empty in First */}
        <div className="space-y-3">
          <label className="block font-semibold text-gray-900 dark:text-gray-100">
            Variable is empty in the first file but not in the second →
          </label>
          <div className="space-y-2 ml-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="emptyInFirst"
                value="keepEmpty"
                checked={settings.emptyInFirst === 'keepEmpty'}
                onChange={(e) => setSettings({ ...settings, emptyInFirst: e.target.value as 'keepEmpty' | 'useSecond' })}
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">Keep it empty</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="emptyInFirst"
                value="useSecond"
                checked={settings.emptyInFirst === 'useSecond'}
                onChange={(e) => setSettings({ ...settings, emptyInFirst: e.target.value as 'keepEmpty' | 'useSecond' })}
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">Use the value from the second file</span>
            </label>
          </div>
        </div>

        {/* Only in Second */}
        <div className="space-y-3">
          <label className="block font-semibold text-gray-900 dark:text-gray-100">
            Variable exists only in the second file →
          </label>
          <div className="space-y-2 ml-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="onlyInSecond"
                value="omit"
                checked={settings.onlyInSecond === 'omit'}
                onChange={(e) => setSettings({ ...settings, onlyInSecond: e.target.value as 'omit' | 'include' })}
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">Omit it</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="onlyInSecond"
                value="include"
                checked={settings.onlyInSecond === 'include'}
                onChange={(e) => setSettings({ ...settings, onlyInSecond: e.target.value as 'omit' | 'include' })}
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">Include it</span>
            </label>
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-3">
          <label className="block font-semibold text-gray-900 dark:text-gray-100">
            Comments
          </label>
          <div className="space-y-2 ml-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="comments"
                value="remove"
                checked={settings.comments === 'remove'}
                onChange={(e) => setSettings({ ...settings, comments: e.target.value as 'remove' | 'firstOnly' | 'both' })}
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">Remove all comments</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="comments"
                value="firstOnly"
                checked={settings.comments === 'firstOnly'}
                onChange={(e) => setSettings({ ...settings, comments: e.target.value as 'remove' | 'firstOnly' | 'both' })}
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">Keep comments only from the first file</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="comments"
                value="both"
                checked={settings.comments === 'both'}
                onChange={(e) => setSettings({ ...settings, comments: e.target.value as 'remove' | 'firstOnly' | 'both' })}
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">Keep comments from both files (omitting duplicates)</span>
            </label>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3 border-t pt-4 dark:border-gray-700">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.sortAlphabetically}
              onChange={(e) => setSettings({ ...settings, sortAlphabetically: e.target.checked })}
              className="cursor-pointer"
            />
            <span className="font-semibold text-gray-900 dark:text-gray-100">Sort merged variables alphabetically</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.removeEmpty}
              onChange={(e) => setSettings({ ...settings, removeEmpty: e.target.checked })}
              className="cursor-pointer"
            />
            <span className="font-semibold text-gray-900 dark:text-gray-100">Remove empty variables</span>
          </label>
        </div>
      </form>
    </div>
  );
}
