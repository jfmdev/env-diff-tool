import {
  getDiffType,
  type CommentDiff,
  type EnvVariableDiff,
} from '../utils/envUtils';

const DELETED_STYLE = 'bg-red-200 dark:bg-red-900 line-through';
const INSERTED_STYLE = 'bg-green-200 dark:bg-green-900';
const CHANGED_STYLE_NEW = 'bg-sky-200 dark:bg-sky-900';
const CHANGED_STYLE_OLD = `${CHANGED_STYLE_NEW} line-through text-slate-600 dark:text-slate-400`;

const COMMENT_DELETED_STYLE = `${DELETED_STYLE} text-red-900 dark:text-red-200 italic`;
const COMMENT_INSERTED_STYLE = `${INSERTED_STYLE} text-green-800 dark:text-green-200 italic`;
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
  if (comment === '') {
    return sideBySide ? (
      <div className="flex">
        <div className="w-1/2">
          <br />
        </div>
        <div className="w-1/2">
          <br />
        </div>
      </div>
    ) : (
      <br />
    );
  }

  if (typeof comment === 'string') {
    const diffType = getDiffType(item);
    const isInserted = diffType === 'Inserted';
    const isDeleted = diffType === 'Deleted';

    return sideBySide ? (
      <div className="flex">
        <div
          className={`px-2 w-1/2 ${isDeleted ? COMMENT_DELETED_STYLE : COMMENT_UNCHANGED_STYLE}`}
        >
          {!isInserted ? <div>{comment}</div> : <br />}
        </div>
        <div
          className={`px-2 w-1/2 ${isInserted ? COMMENT_INSERTED_STYLE : COMMENT_UNCHANGED_STYLE}`}
        >
          {!isDeleted ? <div>{comment}</div> : <br />}
        </div>
      </div>
    ) : (
      <div
        className={`px-2 ${isInserted ? COMMENT_INSERTED_STYLE : isDeleted ? COMMENT_DELETED_STYLE : COMMENT_UNCHANGED_STYLE}`}
      >
        {comment}
      </div>
    );
  }

  return sideBySide ? (
    <div className="flex">
      <div
        className={`px-2 w-1/2 ${comment.removed ? COMMENT_DELETED_STYLE : COMMENT_UNCHANGED_STYLE}`}
      >
        {!comment.added ? <div>{comment.value}</div> : <br />}
      </div>
      <div
        className={`px-2 w-1/2 ${comment.added ? COMMENT_INSERTED_STYLE : COMMENT_UNCHANGED_STYLE}`}
      >
        {!comment.removed ? <div>{comment.value}</div> : <br />}
      </div>
    </div>
  ) : (
    <div
      className={`px-2 ${comment.added ? COMMENT_INSERTED_STYLE : comment.removed ? COMMENT_DELETED_STYLE : COMMENT_UNCHANGED_STYLE}`}
    >
      {comment.value}
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
