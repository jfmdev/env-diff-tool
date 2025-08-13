import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDownAZ,
  faTableColumns,
} from '@fortawesome/free-solid-svg-icons';

export function Compare() {
  return (
    <div>
      <h2>Compare</h2>

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
