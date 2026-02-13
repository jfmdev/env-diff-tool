import { useMemo, useState } from 'react';
import { parseEnvFile } from '../utils/envUtils';

// TODO: Refactor code.
// TODO: Improve UI.

type MergeSettings = {
  conflictResolution: 'first' | 'second';
  emptyValue: 'keepEmpty' | 'useOther';
  onlyInOne: 'omit' | 'includeAll' | 'includeFirst' | 'includeSecond';
  comments: 'remove' | 'firstOnly' | 'secondOnly' | 'both';
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
      if (settings.comments === 'firstOnly' || settings.comments === 'both') {
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
    } else if (settings.comments === 'secondOnly' && secondVar) {
      secondVar.comments.forEach((comment) => {
        if (comment)
          result.push({ content: comment, source: 'second', isComment: true });
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
        if (
          settings.conflictResolution === 'first' &&
          settings.emptyValue === 'useOther'
        ) {
          valueToUse = secondVar.value;
          source = 'second';
        } else {
          valueToUse = firstVar.value;
          source = 'first';
        }
      } else if (secondEmpty && !firstEmpty) {
        // Empty in second, non-empty in first
        if (
          settings.conflictResolution === 'second' &&
          settings.emptyValue === 'useOther'
        ) {
          valueToUse = firstVar.value;
          source = 'first';
        } else {
          valueToUse = secondVar.value;
          source = 'second';
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

  // Process variables only in first file
  if (
    settings.onlyInOne === 'includeAll' ||
    settings.onlyInOne === 'includeFirst'
  ) {
    for (const firstVar of firstVars) {
      if (!firstVar.key || processedKeys.has(firstVar.key)) continue;

      // Handle comments for first-only variables
      if (settings.comments === 'firstOnly' || settings.comments === 'both') {
        firstVar.comments.forEach((comment) => {
          if (comment)
            result.unshift({
              content: comment,
              source: 'first',
              isComment: true,
            });
        });
      }

      // Skip if removeEmpty is enabled and value is empty
      if (
        settings.removeEmpty &&
        (!firstVar.value || firstVar.value.trim() === '')
      ) {
        continue;
      }

      result.unshift({
        content: `${firstVar.key}=${firstVar.value}`,
        source: 'first',
        isComment: false,
      });
    }
  }

  // Process variables only in second file
  if (
    settings.onlyInOne === 'includeAll' ||
    settings.onlyInOne === 'includeSecond'
  ) {
    for (const secondVar of secondVars) {
      if (!secondVar.key || processedKeys.has(secondVar.key)) continue;

      // Handle comments for second-only variables
      if (settings.comments === 'secondOnly' || settings.comments === 'both') {
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
    emptyValue: 'useOther',
    onlyInOne: 'includeAll',
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
            Variable defined in both files:
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
                Use value from first file
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
                Use value from second file
              </span>
            </label>
          </div>
        </div>

        {/* Empty Value Handling */}
        <div className="space-y-3">
          <label className="block font-semibold text-gray-900 dark:text-gray-100">
            {settings.conflictResolution === 'first' && (
              <span>
                Variable empty in first file <small>(but not in second)</small>:
              </span>
            )}
            {settings.conflictResolution !== 'first' && (
              <span>
                Variable empty in second file <small>(but not in first)</small>:
              </span>
            )}
          </label>
          <div className="space-y-2 ml-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="emptyValue"
                value="keepEmpty"
                checked={settings.emptyValue === 'keepEmpty'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    emptyValue: e.target.value as 'keepEmpty' | 'useOther',
                  })
                }
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Keep empty
              </span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="emptyValue"
                value="useOther"
                checked={settings.emptyValue === 'useOther'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    emptyValue: e.target.value as 'keepEmpty' | 'useOther',
                  })
                }
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">
                {settings.conflictResolution === 'first'
                  ? 'Use value from second file'
                  : 'Use value from first file'}
              </span>
            </label>
          </div>
        </div>

        {/* Only in One */}
        <div className="space-y-3">
          <label className="block font-semibold text-gray-900 dark:text-gray-100">
            Variable defined in only one file:
          </label>
          <div className="space-y-2 ml-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="onlyInOne"
                value="omit"
                checked={settings.onlyInOne === 'omit'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    onlyInOne: e.target.value as
                      | 'omit'
                      | 'includeAll'
                      | 'includeFirst'
                      | 'includeSecond',
                  })
                }
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Exclude variable
              </span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="onlyInOne"
                value="includeAll"
                checked={settings.onlyInOne === 'includeAll'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    onlyInOne: e.target.value as
                      | 'omit'
                      | 'includeAll'
                      | 'includeFirst'
                      | 'includeSecond',
                  })
                }
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Include variable
              </span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="onlyInOne"
                value="includeFirst"
                checked={settings.onlyInOne === 'includeFirst'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    onlyInOne: e.target.value as
                      | 'omit'
                      | 'includeAll'
                      | 'includeFirst'
                      | 'includeSecond',
                  })
                }
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Include variable only if defined in first file
              </span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="onlyInOne"
                value="includeSecond"
                checked={settings.onlyInOne === 'includeSecond'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    onlyInOne: e.target.value as
                      | 'omit'
                      | 'includeAll'
                      | 'includeFirst'
                      | 'includeSecond',
                  })
                }
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Include variable only if defined in second file
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
                    comments: e.target.value as
                      | 'remove'
                      | 'firstOnly'
                      | 'secondOnly'
                      | 'both',
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
                    comments: e.target.value as
                      | 'remove'
                      | 'firstOnly'
                      | 'secondOnly'
                      | 'both',
                  })
                }
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Keep comments from the first file only
              </span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="comments"
                value="secondOnly"
                checked={settings.comments === 'secondOnly'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    comments: e.target.value as
                      | 'remove'
                      | 'firstOnly'
                      | 'secondOnly'
                      | 'both',
                  })
                }
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Keep comments from second file only
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
                    comments: e.target.value as
                      | 'remove'
                      | 'firstOnly'
                      | 'secondOnly'
                      | 'both',
                  })
                }
                className="cursor-pointer"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Keep comments from both files (remove duplicates)
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
              Sort variables alphabetically
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
