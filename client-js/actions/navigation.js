
import * as types from './TYPES.js';

export function changeDir(newPath) {
	return {
		type: types.CHANGE_DIR,
		newPath
	};
};
export function changeDirDone(result) {
	return {
		type: types.CHANGE_DIR_DONE,
		result
	};
};

export function openCover(filePath) {
	return {
		type: types.OPEN_COVER,
		filePath
	};
};
