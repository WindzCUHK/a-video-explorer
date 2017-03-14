
import Immutable from 'immutable';
import Perf from 'react-addons-perf'

import * as types from './actions/TYPES.js';
import * as navigationActions from './actions/navigation.js';
import * as actionHandlers from './action-handler/handlers.js';
import { getStore } from './index.jsx';

function measurePref() {
	Perf.start();
	setTimeout(function () {
		Perf.stop();
		const measurements = Perf.getLastMeasurements();
		// Perf.printInclusive(measurements)
		Perf.printExclusive(measurements)
		Perf.printWasted(measurements)
		// Perf.printOperations(measurements)

	}, 2000);
}

// react will not update, if the simply changing the object content, it needs a new object
export default (state, action) => {

	let map1, map2, map3;

	switch (action.type) {

		case types.CHANGE_DIR:
			setTimeout(() => {
				actionHandlers.changeDir(action.newPath, (result) => {
					getStore().dispatch(navigationActions.changeDirDone(result));
				});
			}, 50);
			map2 = state.get('ui').set('isLoading', true);
			map1 = state.set('ui', map2);
			return map1;
		case types.CHANGE_DIR_DONE:
			// measurePref();
			// state = { pathError, currentPathFragments, files }
			let newState = state.merge(action.result);
			newState = newState.set('currentDirTags', newState.get('currentDirTags').toSet());
			console.log('will render for dir change');

			// clear filter tag
			map3 = newState.get('ui').get('filterTagSet').clear();
			map2 = newState.get('ui')
				.set('filterTagSet', map3)
				.set('isLoading', false);
			map1 = newState.set('ui', map2);
			
			return map1;

		case types.OPEN_COVER:
			actionHandlers.openCover(action.filePath, action.player);
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
			const { tag, shouldClearOthers } = action;

			map3 = state.get('ui').get('filterTagSet');
			if (map3.has(tag)) {
				map3 = map3.delete(tag);
			} else {
				if (shouldClearOthers) map3 = map3.clear().add(tag);
				else map3 = map3.add(tag);
			}
			map2 = state.get('ui').set('filterTagSet', map3);
			map1 = state.set('ui', map2);
			return map1;

		case types.SELECT_COVER:
			const { cover } = action;
			map2 = state.get('ui').set('selectedCover', cover);
			map1 = state.set('ui', map2);
			return map1;
		case types.UNSELECT_COVER:
			map2 = state.get('ui').set('selectedCover', null);
			map1 = state.set('ui', map2);
			return map1;
	}

	return state;
};




/*|================================================================|*/
/*|                           React Perf                           |*/
/*|================================================================|*/

