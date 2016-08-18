
import * as types from './actions/TYPES.js';

export default (state, action) => {

	switch (action.type) {
		case types.CHANGE_DIR:
			console.log(action);
			state.currentPath = action.newPath;
			return state;
	}

	return state;
};
