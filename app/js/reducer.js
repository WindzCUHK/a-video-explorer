
import Immutable from 'immutable';

import * as types from './actions/TYPES.js';
import * as actionHandlers from './action-handler/handlers.js';

// react will not update, if the simply changing the object content, it needs a new object
export default (state, action) => {

	switch (action.type) {
		case types.CHANGE_DIR:
			// { pathError, currentPath, files }
			const result = actionHandlers.changeDir(action.newPath);
			return state.merge(result);
		case types.OPEN_COVER:
			console.log(action);
			return state;
	}

	return state;
};
