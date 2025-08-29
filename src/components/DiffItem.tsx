import { type EnvVariableDiff } from '../utils/envUtils';

interface DiffItemProps {
  className: string;
  item: EnvVariableDiff;
  sideBySide: boolean;
}

const DELETED_STYLE =
  'bg-red-200 dark:bg-red-900 line-through text-slate-700 dark:text-slate-300';
const INSERTED_STYLE = 'bg-green-200 dark:bg-green-900';
const CHANGED_STYLE_NEW = 'bg-sky-200 dark:bg-sky-900';
const CHANGED_STYLE_OLD = `${CHANGED_STYLE_NEW} line-through text-slate-600 dark:text-slate-400`;

// TODO: Display comments.
export default function DiffItem({
  className,
  item,
  sideBySide,
}: DiffItemProps) {
  const isInserted = !item.oldValue && item.newValue;
  const isDeleted = item.oldValue && !item.newValue;
  const isChanged =
    item.oldValue && item.newValue && item.oldValue !== item.newValue;

  if (!item.key) {
    return null;
  }

  if (sideBySide) {
    return (
      <div className={`flex ${className}`}>
        <div className="px-2 w-1/2">
          {item.oldValue && (
            <span
              className={`inline-block ${isDeleted ? DELETED_STYLE : isChanged ? CHANGED_STYLE_OLD : ''}`}
            >
              {item.key}={item.oldValue}
            </span>
          )}
          {!item.oldValue && <span>&nbsp;</span>}
        </div>
        <div className="px-2 w-1/2">
          {item.newValue && (
            <span
              className={`inline-block ${isInserted ? INSERTED_STYLE : isChanged ? CHANGED_STYLE_NEW : ''}`}
            >
              {item.key}={item.newValue}
            </span>
          )}
          {!item.newValue && <span>&nbsp;</span>}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {(isDeleted || isChanged) && (
        <div
          className={`px-2 ${isDeleted ? DELETED_STYLE : CHANGED_STYLE_OLD}`}
        >
          {item.key}={item.oldValue}
        </div>
      )}
      {!isDeleted && (
        <div
          className={`px-2 ${isInserted ? INSERTED_STYLE : isChanged ? CHANGED_STYLE_NEW : ''}`}
        >
          {item.key}={item.newValue}
        </div>
      )}
    </div>
  );
}
