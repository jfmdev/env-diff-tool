import { type EnvVariableDiff } from '../utils/envUtils';

export default function item({
  className,
  item,
}: {
  className: string;
  item: EnvVariableDiff;
}) {
  return (
    <div className={className}>
      {item.oldValue && item.oldValue !== item.newValue && (
        <div
          className={`px-2 ${item.newValue ? 'bg-sky-200 dark:bg-sky-900 line-through text-slate-600 dark:text-slate-400' : 'bg-red-200 dark:bg-red-900 line-through text-slate-700 dark:text-slate-300'}`}
        >
          {item.key}={item.oldValue}
        </div>
      )}
      {item.newValue && (
        <div
          className={`px-2 ${!item.oldValue ? 'bg-green-200 dark:bg-green-900' : item.oldValue !== item.newValue ? 'bg-sky-200 dark:bg-sky-900' : ''}`}
        >
          {item.key}={item.newValue}
        </div>
      )}
    </div>
  );
}
