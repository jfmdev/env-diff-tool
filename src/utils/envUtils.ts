import { diffLines } from 'diff';

function arraysEqual(arrayA: string[], arrayB: string[]): boolean {
  return (
    arrayA.length === arrayB.length &&
    arrayA.every((item, index) => item === arrayB[index])
  );
}

// CAVEAT: We assume that all comments are placed above their respective variables.
interface EnvVariable {
  key: string;
  value: string;
  comments: string[];
}

export interface EnvVariableDiff {
  key: string;
  oldValue: string | null;
  newValue: string | null;
  comments: string[] | CommentDiff[];
}

export interface CommentDiff {
  value: string;
  added: boolean;
  removed: boolean;
}

type DiffType = 'Changed' | 'Removed' | 'Added' | 'Unchanged';

function diffComments(
  oldComments: string[],
  newComments: string[],
): CommentDiff[] {
  return diffLines(newComments.join('\n'), oldComments.join('\n'))?.flatMap(
    ({ count, value, added, removed }) =>
      count <= 1
        ? { value: value.replace('\n', ''), added, removed }
        : (value
            .split('\n')
            .filter((line) => line.trim() !== '')
            .map((line) => ({ value: line, added, removed })) ?? []),
  );
}

export function getDiffType(item: EnvVariableDiff): DiffType {
  return !item.oldValue && item.newValue
    ? 'Added'
    : item.oldValue && !item.newValue
      ? 'Removed'
      : item.oldValue !== item.newValue
        ? 'Changed'
        : 'Unchanged';
}

export function diffEnvFiles(
  oldContent: string,
  newContent: string,
): EnvVariableDiff[] {
  const oldVariables = parseEnvFile(oldContent);
  const newVariables = parseEnvFile(newContent);

  const diffs: EnvVariableDiff[] = [];

  // Check variables from the old file.
  for (const oldVar of oldVariables) {
    const newVar = newVariables.find((newVar) => newVar.key === oldVar.key);
    diffs.push({
      key: oldVar.key,
      oldValue: oldVar.value,
      newValue: newVar?.value ?? null,
      comments:
        newVar && !arraysEqual(newVar.comments, oldVar.comments)
          ? diffComments(newVar.comments, oldVar.comments)
          : oldVar.comments,
    });
  }

  // Check variables from the new file that aren't on the old file.
  let lastOldKeyIndex = -1;
  for (const newVar of newVariables) {
    const oldVar = oldVariables.find((oldVar) => oldVar.key === newVar.key);
    if (!oldVar) {
      diffs.splice(lastOldKeyIndex + 1, 0, {
        key: newVar.key,
        newValue: newVar.value,
        oldValue: '',
        comments: newVar.comments,
      });

      // Increase the index to avoid placing future new variables before this one.
      lastOldKeyIndex += 1;
    } else {
      lastOldKeyIndex = diffs.findIndex(
        (diffItem) => diffItem.key === oldVar.key,
      );
    }
  }

  return diffs;
}

export function parseEnvFile(envContent: string): EnvVariable[] {
  const variables: EnvVariable[] = [];

  let comments: string[] = [];
  const trimmedLines = envContent.split('\n').map((line) => line.trim());
  for (const line of trimmedLines) {
    // Handle empty and comment lines.
    if (line.length === 0 || line.startsWith('#')) {
      comments.push(line);
      continue;
    }

    // Handle variables.
    const [key, value] = line.split('=').map((item) => item.trim());
    if (key) {
      variables.push({ key, value, comments });
      comments = [];
    }
  }

  // CAVEAT: Handle the case of comments at the end of the file (below all variables).
  if (comments.length > 0) {
    variables.push({ key: '', value: '', comments });
  }

  return variables;
}
