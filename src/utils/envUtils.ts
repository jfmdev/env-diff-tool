import { diffLines, type ChangeObject } from 'diff';

// CAVEAT: We assume that all comments are placed above their respective variables.
interface EnvVariable {
  key: string;
  value: string;
  comments: string;
}

export interface EnvVariableDiff {
  key: string;
  oldValue: string | null;
  newValue: string | null;
  comments: string | ChangeObject<string>[];
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
      comments: newVar
        ? diffLines(newVar.comments, oldVar.comments)
        : oldVar.comments,
    });
  }

  // Check variables from the new file that aren't on the old file.
  let lastOldKey: string | null = null;
  for (const newVar of newVariables) {
    const oldVar = oldVariables.find((oldVar) => oldVar.key === newVar.key);
    if (!oldVar) {
      const lastOldKeyIndex = lastOldKey
        ? diffs.findIndex((diffItem) => diffItem.key === lastOldKey)
        : -1;
      diffs.splice(lastOldKeyIndex + 1, 0, {
        key: newVar.key,
        newValue: newVar.value,
        oldValue: '',
        comments: newVar.comments,
      });
    } else {
      lastOldKey = oldVar.key;
    }
  }

  return diffs;
}

export function parseEnvFile(envContent: string): EnvVariable[] {
  const variables: EnvVariable[] = [];

  let comments: string = '';
  const trimmedLines = envContent.split('\n').map((line) => line.trim());
  for (const line of trimmedLines) {
    // Handle empty lines.
    if (line.length === 0) {
      comments += '\n';
      continue;
    }

    // Handle comment lines.
    if (line.startsWith('#')) {
      comments += line.slice(1).trim() + '\n';
      continue;
    }

    // Handle variables.
    const [key, value] = line.split('=').map((item) => item.trim());
    if (key) {
      variables.push({ key, value, comments });
      comments = '';
    }
  }

  // CAVEAT: Handle the case of comments at the end of the file (below all variables).
  if (comments.length > 0) {
    variables.push({ key: '', value: '', comments });
  }

  return variables;
}
