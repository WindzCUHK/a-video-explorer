
import * as types from './TYPES.js';

export function changeDir(newPath) {
	return {
		type: types.CHANGE_DIR,
		newPath
	};
}

export function openCover(file) {
	return {
		type: types.OPEN_COVER,
		file
	};
}
