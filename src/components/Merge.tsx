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

import { useMemo, useState } from 'react';
import { parseEnvFile } from '../utils/envUtils';

type MergeSettings = {
  conflictResolution: 'first' | 'second';
  emptyInFirst: 'keepEmpty' | 'useSecond';
  onlyInSecond: 'omit' | 'include';
  comments: 'remove' | 'firstOnly' | 'both';
  sortAlphabetically: boolean;
  removeEmpty: boolean;
};

type MergedLine = {
  content: string;
  source: 'first' | 'second' | 'both' | 'none';
  isComment: boolean;
};

type MergeProps = {
  firstValue: string;
  secondValue: string;
};

function mergeEnvFiles(
  firstContent: string,
  secondContent: string,
  settings: MergeSettings,
): MergedLine[] {
  const firstVars = parseEnvFile(firstContent);
  const secondVars = parseEnvFile(secondContent);
  const result: MergedLine[] = [];
  const processedKeys = new Set<string>();

  // Process variables from first file
  for (const firstVar of firstVars) {
    if (!firstVar.key) {
      // Handle trailing comments from first file
      if (settings.comments !== 'remove') {
        firstVar.comments.forEach((comment) => {
          if (comment)
            result.push({ content: comment, source: 'first', isComment: true });
        });
      }
      continue;
    }

    const secondVar = secondVars.find((v) => v.key === firstVar.key);
    processedKeys.add(firstVar.key);

    // Handle comments
    if (settings.comments === 'firstOnly') {
      firstVar.comments.forEach((comment) => {
        if (comment)
          result.push({ content: comment, source: 'first', isComment: true });
      });
    } else if (settings.comments === 'both' && secondVar) {
      const allComments = new Set([
        ...firstVar.comments,
        ...secondVar.comments,
      ]);
      allComments.forEach((comment) => {
        if (comment) {
          const inFirst = firstVar.comments.includes(comment);
          const inSecond = secondVar.comments.includes(comment);
          result.push({
            content: comment,
            source: inFirst && inSecond ? 'both' : inFirst ? 'first' : 'second',
            isComment: true,
          });
        }
      });
    } else if (settings.comments === 'both' && !secondVar) {
      firstVar.comments.forEach((comment) => {
        if (comment)
          result.push({ content: comment, source: 'first', isComment: true });
      });
    }

    // Determine value to use
    let valueToUse = firstVar.value;
    let source: 'first' | 'second' | 'both' = 'first';

    if (secondVar) {
      const firstEmpty = !firstVar.value || firstVar.value.trim() === '';
      const secondEmpty = !secondVar.value || secondVar.value.trim() === '';
      const bothNonEmpty = !firstEmpty && !secondEmpty;
      const valuesEqual = firstVar.value === secondVar.value;

      if (valuesEqual) {
        source = 'both';
      } else if (bothNonEmpty) {
        // Both have values but they differ
        valueToUse =
          settings.conflictResolution === 'first'
            ? firstVar.value
            : secondVar.value;
        source = settings.conflictResolution === 'first' ? 'first' : 'second';
      } else if (firstEmpty && !secondEmpty) {
        // Empty in first, non-empty in second
        if (settings.emptyInFirst === 'useSecond') {
          valueToUse = secondVar.value;
          source = 'second';
        } else {
          valueToUse = firstVar.value;
          source = 'first';
        }
      }
    }

    // Skip if removeEmpty is enabled and value is empty
    if (settings.removeEmpty && (!valueToUse || valueToUse.trim() === '')) {
      continue;
    }

    result.push({
      content: `${firstVar.key}=${valueToUse}`,
      source,
      isComment: false,
    });
  }

  // Process variables only in second file
  if (settings.onlyInSecond === 'include') {
    for (const secondVar of secondVars) {
      if (!secondVar.key || processedKeys.has(secondVar.key)) continue;

      // Handle comments for second-only variables
      if (settings.comments === 'both') {
        secondVar.comments.forEach((comment) => {
          if (comment)
            result.push({
              content: comment,
              source: 'second',
              isComment: true,
            });
        });
      }

      // Skip if removeEmpty is enabled and value is empty
      if (
        settings.removeEmpty &&
        (!secondVar.value || secondVar.value.trim() === '')
      ) {
        continue;
      }

      result.push({
        content: `${secondVar.key}=${secondVar.value}`,
        source: 'second',
        isComment: false,
      });
    }
  }

  // Sort if requested
  if (settings.sortAlphabetically) {
    const comments: MergedLine[] = [];
    const variables: MergedLine[] = [];

    result.forEach((line) => {
      if (line.isComment) {
        comments.push(line);
      } else {
        variables.push(line);
      }
    });

    variables.sort((a, b) => {
      const keyA = a.content.split('=')[0];
      const keyB = b.content.split('=')[0];
      return keyA.localeCompare(keyB);
    });

    return [...variables, ...comments];
  }

  return result;
}

export function Merge({ firstValue, secondValue }: MergeProps) {
  const [settings, setSettings] = useState<MergeSettings>({
    conflictResolution: 'second',
    emptyInFirst: 'useSecond',
    onlyInSecond: 'include',
    comments: 'both',
    sortAlphabetically: false,
    removeEmpty: false,
  });

  const mergedResult = useMemo(
    () => mergeEnvFiles(firstValue, secondValue, settings),
    [firstValue, secondValue, settings],
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl drop-shadow-lg text-center">Merge</h2>

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
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    conflictResolution: e.target.value as 'first' | 'second',
                  })
                }
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">
                First file
              </span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="conflictResolution"
                value="second"
                checked={settings.conflictResolution === 'second'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    conflictResolution: e.target.value as 'first' | 'second',
                  })
                }
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Second file
              </span>
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
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    emptyInFirst: e.target.value as 'keepEmpty' | 'useSecond',
                  })
                }
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Keep it empty
              </span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="emptyInFirst"
                value="useSecond"
                checked={settings.emptyInFirst === 'useSecond'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    emptyInFirst: e.target.value as 'keepEmpty' | 'useSecond',
                  })
                }
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Use the value from the second file
              </span>
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
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    onlyInSecond: e.target.value as 'omit' | 'include',
                  })
                }
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
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    onlyInSecond: e.target.value as 'omit' | 'include',
                  })
                }
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Include it
              </span>
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
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    comments: e.target.value as 'remove' | 'firstOnly' | 'both',
                  })
                }
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Remove all comments
              </span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="comments"
                value="firstOnly"
                checked={settings.comments === 'firstOnly'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    comments: e.target.value as 'remove' | 'firstOnly' | 'both',
                  })
                }
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Keep comments only from the first file
              </span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="comments"
                value="both"
                checked={settings.comments === 'both'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    comments: e.target.value as 'remove' | 'firstOnly' | 'both',
                  })
                }
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Keep comments from both files (omitting duplicates)
              </span>
            </label>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3 border-t pt-4 dark:border-gray-700">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.sortAlphabetically}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  sortAlphabetically: e.target.checked,
                })
              }
              className="cursor-pointer"
            />
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Sort merged variables alphabetically
            </span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.removeEmpty}
              onChange={(e) =>
                setSettings({ ...settings, removeEmpty: e.target.checked })
              }
              className="cursor-pointer"
            />
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Remove empty variables
            </span>
          </label>
        </div>
      </form>

      {/* Merged Result Display */}
      {(firstValue || secondValue) && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Merged Result
          </h3>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-200 dark:bg-blue-900 border border-blue-400 dark:border-blue-700 rounded"></div>
              <span className="text-gray-700 dark:text-gray-300">
                From first file
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-200 dark:bg-green-900 border border-green-400 dark:border-green-700 rounded"></div>
              <span className="text-gray-700 dark:text-gray-300">
                From second file
              </span>
            </div>
          </div>

          <div className="font-mono text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded border border-gray-300 dark:border-gray-700 overflow-x-auto">
            {mergedResult.length > 0 ? (
              mergedResult.map((line, index) => (
                <div
                  key={index}
                  className={`${
                    line.source === 'first' && !line.isComment
                      ? 'bg-blue-200 dark:bg-blue-900'
                      : line.source === 'second' && !line.isComment
                        ? 'bg-green-200 dark:bg-green-900'
                        : ''
                  } ${line.isComment ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}
                >
                  {line.content || '\u00A0'}
                </div>
              ))
            ) : (
              <div className="text-gray-500 dark:text-gray-400 italic">
                No content to merge
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
