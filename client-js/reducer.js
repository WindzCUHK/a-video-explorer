
import Immutable from 'immutable';
import Perf from 'react-addons-perf'

import * as types from './actions/TYPES.js';
import * as navigationActions from './actions/navigation.js';
import * as actionHandlers from './action-handler/handlers.js';
import { getStore } from './index.jsx';

// react will not update, if the simply changing the object content, it needs a new object
export default (state, action) => {

	let map1, map2, map3;

	switch (action.type) {

		case types.CHANGE_DIR:
			actionHandlers.changeDir(action.newPath, (result) => {
				getStore().dispatch(navigationActions.changeDirDone(result));
			});
			return state;
		case types.CHANGE_DIR_DONE:
			// state = { pathError, currentPath, files }
			return state.merge(action.result);

		case types.OPEN_COVER:
			actionHandlers.openCover(action.filePath);
			return state;

		case types.CHANGE_COVER_NAME_FILTER:
			map2 = state.get('ui').set('nameFilter', action.coverNameFilter);
			map1 = state.set('ui', map2);
			return map1;
		case types.CHANGE_TAG_FILTER:
			map2 = state.get('ui').set('tagFilter', action.tagFilter);
			map1 = state.set('ui', map2);
			return map1;

		case types.ADD_COVER_FILTER_TAG:
			map3 = state.get('ui').get('filterTagSet').add(action.tag);
			map2 = state.get('ui').set('filterTagSet', map3);
			map1 = state.set('ui', map2);
			return map1;
		case types.DELETE_COVER_FILTER_TAG:
			map3 = state.get('ui').get('filterTagSet').delete(action.tag);
			map2 = state.get('ui').set('filterTagSet', map3);
			map1 = state.set('ui', map2);
			return map1;
		case types.TOGGLE_COVER_FILTER_TAG:
			Perf.start();
			setTimeout(function () {
				Perf.stop();
				const measurements = Perf.getLastMeasurements();
				// Perf.printInclusive(measurements)
				// Perf.printExclusive(measurements)
				Perf.printWasted(measurements)
				// Perf.printOperations(measurements)

			}, 2000);

			map3 = state.get('ui').get('filterTagSet');
			if (map3.has(action.tag)) {
				map3 = map3.delete(action.tag);
			} else {
				map3 = map3.clear().add(action.tag);
			}
			map2 = state.get('ui').set('filterTagSet', map3);
			map1 = state.set('ui', map2);
			return map1;
	}

	return state;
};




/*|================================================================|*/
/*|                           React Perf                           |*/
/*|================================================================|*/

