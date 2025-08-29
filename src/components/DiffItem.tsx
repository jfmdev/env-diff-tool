import { type ChangeObject } from 'diff';

import { getDiffType, type EnvVariableDiff } from '../utils/envUtils';

const COMMENT_STYLE = 'text-slate-500 dark:text-slate-400 italic';
const DELETED_STYLE =
  'bg-red-200 dark:bg-red-900 line-through text-slate-700 dark:text-slate-300';
const INSERTED_STYLE = 'bg-green-200 dark:bg-green-900';
const CHANGED_STYLE_NEW = 'bg-sky-200 dark:bg-sky-900';
const CHANGED_STYLE_OLD = `${CHANGED_STYLE_NEW} line-through text-slate-600 dark:text-slate-400`;

function DiffComment({
  comment,
  item,
  sideBySide,
}: {
  comment: string | ChangeObject<string>;
  item: EnvVariableDiff;
  sideBySide: boolean;
}) {
  const diffType = getDiffType(item);
  const isInserted = diffType === 'Inserted';
  const isDeleted = diffType === 'Deleted';

  return sideBySide ? (
    <div className={`flex ${COMMENT_STYLE}`}>
      <div className="px-2 w-1/2">
        {comment && !isInserted ? <div>{comment + ''}</div> : <br />}
      </div>
      <div className="px-2 w-1/2">
        {comment && !isDeleted ? <div>{comment + ''}</div> : <br />}
      </div>
    </div>
  ) : comment ? (
    <div className={`px-2 ${COMMENT_STYLE}`}>{comment + ''}</div>
  ) : (
    <br />
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
      <div className="px-2 w-1/2">
        {item.oldValue && (
          <span
            className={`inline-block ${isDeleted ? DELETED_STYLE : isChanged ? CHANGED_STYLE_OLD : ''}`}
          >
            {item.key}={item.oldValue}
          </span>
        )}
        {!item.oldValue && <br />}
      </div>
      <div className="px-2 w-1/2">
        {item.newValue && (
          <span
            className={`inline-block ${isInserted ? INSERTED_STYLE : isChanged ? CHANGED_STYLE_NEW : ''}`}
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
  className: string;
  item: EnvVariableDiff;
  sideBySide: boolean;
}

export default function DiffItem({
  className,
  item,
  sideBySide,
}: DiffItemProps) {
  return (
    <div className={`${className} break-all`}>
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
