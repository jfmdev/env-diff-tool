import {
  getDiffType,
  type CommentDiff,
  type EnvVariableDiff,
} from '../utils/envUtils';

const DELETED_STYLE = 'bg-red-200 dark:bg-red-900 line-through';
const INSERTED_STYLE = 'bg-green-200 dark:bg-green-900';
const CHANGED_STYLE_NEW = 'bg-sky-200 dark:bg-sky-900';
const CHANGED_STYLE_OLD = `${CHANGED_STYLE_NEW} line-through text-slate-600 dark:text-slate-400`;

const COMMENT_REMOVED_STYLE = `${DELETED_STYLE} text-red-900 dark:text-red-200 italic`;
const COMMENT_ADDED_STYLE = `${INSERTED_STYLE} text-green-800 dark:text-green-200 italic`;
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
      : comment !== '' && diffType === 'Inserted';
  const removed =
    typeof comment !== 'string'
      ? comment.removed
      : comment !== '' && diffType === 'Deleted';

  return sideBySide ? (
    <div className="flex">
      <div
        className={`px-2 w-1/2 ${removed ? COMMENT_REMOVED_STYLE : COMMENT_UNCHANGED_STYLE}`}
      >
        {content && !added ? <>{content}</> : <br />}
      </div>
      <div
        className={`px-2 w-1/2 ${added ? COMMENT_ADDED_STYLE : COMMENT_UNCHANGED_STYLE}`}
      >
        {content && !removed ? <>{content}</> : <br />}
      </div>
    </div>
  ) : (
    <div
      className={`px-2 ${added ? COMMENT_ADDED_STYLE : removed ? COMMENT_REMOVED_STYLE : COMMENT_UNCHANGED_STYLE}`}
    >
      {content ? <>{content}</> : <br />}
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
  const isInserted = diffType === 'Inserted';
  const isDeleted = diffType === 'Deleted';
  const isChanged = diffType === 'Changed';

  return sideBySide ? (
    <div className="flex">
      <div className="w-1/2">
        {item.oldValue && (
          <span
            className={`inline-block px-2 ${isDeleted ? DELETED_STYLE : isChanged ? CHANGED_STYLE_OLD : ''}`}
          >
            {item.key}={item.oldValue}
          </span>
        )}
        {!item.oldValue && <br />}
      </div>
      <div className="w-1/2">
        {item.newValue && (
          <span
            className={`inline-block px-2 ${isInserted ? INSERTED_STYLE : isChanged ? CHANGED_STYLE_NEW : ''}`}
          >
            {item.key}={item.newValue}
          </span>
        )}
        {!item.newValue && <br />}
      </div>
    </div>
  ) : (
    <>
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
