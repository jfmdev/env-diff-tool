import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDownAZ,
  faTableColumns,
} from '@fortawesome/free-solid-svg-icons';

export function Compare() {
  // REQ: Keep the comments and empty lines as they are. Assume that they should be keep above the next
  // variable (except for comments that are at the end of the file, that should remain there).

  return (
    <div>
      <h2>Compare</h2>
      Button: fill with sample data Allow to drag files
      <div>
        <FontAwesomeIcon icon={faTableColumns} /> Side by side view
        <FontAwesomeIcon icon={faTableColumns} rotation={270} /> Stacked view
      </div>
      <div>
        <FontAwesomeIcon icon={faArrowDownAZ} /> Sort keys alphabetically
      </div>
    </div>
  );
}
