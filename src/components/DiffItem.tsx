import {
  getDiffType,
  type CommentDiff,
  type EnvVariableDiff,
} from '../utils/envUtils';

const REMOVED_STYLE = 'bg-red-200 dark:bg-red-900 line-through';
const REMOVED_BG_STYLE = 'bg-red-100 dark:bg-red-950';
const ADDED_STYLE = 'bg-green-200 dark:bg-green-900';
const ADDED_BG_STYLE = 'bg-green-100 dark:bg-green-950';
const CHANGED_NEW_STYLE = 'bg-sky-200 dark:bg-sky-900';
const CHANGED_OLD_STYLE = `${CHANGED_NEW_STYLE} line-through text-slate-600 dark:text-slate-400`;
const CHANGED_BG_STYLE = 'bg-sky-100 dark:bg-sky-950';

const COMMENT_REMOVED_STYLE = `${REMOVED_STYLE} text-red-900 dark:text-red-200 italic`;
const COMMENT_ADDED_STYLE = `${ADDED_STYLE} text-green-800 dark:text-green-200 italic`;
const COMMENT_UNCHANGED_STYLE = 'text-slate-500 dark:text-slate-400 italic';

function DiffComment({
  comment,
  item,
  sideBySide,
}: {
  comment: string | CommentDiff;
  item: EnvVariableDiff;
  sideBySide: boolean;
}) {
  const diffType = getDiffType(item);
  const content = typeof comment === 'string' ? comment : comment.value;
  const added =
    typeof comment !== 'string'
      ? comment.added
      : comment !== '' && diffType === 'Added';
  const removed =
    typeof comment !== 'string'
      ? comment.removed
      : comment !== '' && diffType === 'Removed';

  const bgClass = removed
    ? REMOVED_BG_STYLE
    : added
      ? ADDED_BG_STYLE
      : COMMENT_UNCHANGED_STYLE;

  return sideBySide ? (
    <div className="flex">
      <div className={`w-1/2 ${bgClass}`}>
        {content && !added ? (
          <span
            className={`inline-block px-2 ${removed ? COMMENT_REMOVED_STYLE : ''}`}
          >
            {content}
          </span>
        ) : (
          <br />
        )}
      </div>
      <div className={`w-1/2 ${bgClass}`}>
        {content && !removed ? (
          <span
            className={`inline-block px-2 ${added ? COMMENT_ADDED_STYLE : ''}`}
          >
            {content}
          </span>
        ) : (
          <br />
        )}
      </div>
    </div>
  ) : (
    <div className={bgClass}>
      {content ? (
        <span
          className={`inline-block px-2 ${added ? COMMENT_ADDED_STYLE : removed ? COMMENT_REMOVED_STYLE : ''}`}
        >
          {content}
        </span>
      ) : (
        <br />
      )}
    </div>
  );
}

function DiffVariable({
  item,
  sideBySide,
}: {
  item: EnvVariableDiff;
  sideBySide: boolean;
}) {
  if (!item.key) {
    return null;
  }

  const diffType = getDiffType(item);
  const added = diffType === 'Added';
  const removed = diffType === 'Removed';
  const changed = diffType === 'Changed';

  const bgClass = removed
    ? REMOVED_BG_STYLE
    : added
      ? ADDED_BG_STYLE
      : changed
        ? CHANGED_BG_STYLE
        : '';

  return sideBySide ? (
    <div className="flex">
      <div className={`w-1/2 ${bgClass}`}>
        {item.oldValue && (
          <span
            className={`inline-block px-2 ${removed ? REMOVED_STYLE : changed ? CHANGED_OLD_STYLE : ''}`}
          >
            {item.key}={item.oldValue}
          </span>
        )}
        {!item.oldValue && <br />}
      </div>
      <div className={`w-1/2 ${bgClass}`}>
        {item.newValue && (
          <span
            className={`inline-block px-2 ${added ? ADDED_STYLE : changed ? CHANGED_NEW_STYLE : ''}`}
          >
            {item.key}={item.newValue}
          </span>
        )}
        {!item.newValue && <br />}
      </div>
    </div>
  ) : (
    <>
      {(removed || changed) && (
        <div className={bgClass}>
          <span
            className={`inline-block px-2 ${removed ? REMOVED_STYLE : CHANGED_OLD_STYLE}`}
          >
            {item.key}={item.oldValue}
          </span>
        </div>
      )}
      {!removed && (
        <div className={bgClass}>
          <span
            className={`inline-block px-2 ${added ? ADDED_STYLE : changed ? CHANGED_NEW_STYLE : ''}`}
          >
            {item.key}={item.newValue}
          </span>
        </div>
      )}
    </>
  );
}

interface DiffItemProps {
  className?: string;
  item: EnvVariableDiff;
  sideBySide: boolean;
}

export default function DiffItem({
  className,
  item,
  sideBySide,
}: DiffItemProps) {
  return (
    <div className={`${className ?? ''} break-all`}>
      {item.comments.map((comment, index) => (
        <DiffComment
          key={index}
          item={item}
          comment={comment}
          sideBySide={sideBySide}
        />
      ))}
      <DiffVariable item={item} sideBySide={sideBySide} />
    </div>
  );
}
