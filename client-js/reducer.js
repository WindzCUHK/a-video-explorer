
import Immutable from 'immutable';

import * as types from './actions/TYPES.js';
import * as actionHandlers from './action-handler/handlers.js';

// react will not update, if the simply changing the object content, it needs a new object
export default (state, action) => {

	let map1, map2, map3;

	switch (action.type) {
		case types.CHANGE_DIR:
			// state = { pathError, currentPath, files }

			const result = actionHandlers.changeDir(action.newPath);
			return state.merge(result);
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
	}

	return state;
};
