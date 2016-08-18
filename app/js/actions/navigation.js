
import * as types from './TYPES.js';

export function changeDir(newPath) {
	return {
		type: types.CHANGE_DIR,
		newPath
	};
}
