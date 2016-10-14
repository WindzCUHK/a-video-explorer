
import * as types from './TYPES.js';

export function changeCoverNameFilter(coverNameFilter) {
	return {
		type: types.CHANGE_COVER_NAME_FILTER,
		coverNameFilter
	};
}

export function addCoverFilterTag(filePath) {
	return {
		type: types.ADD_COVER_FILTER_TAG,
		filePath
	};
}

export function removeCoverFilterTag(filePath) {
	return {
		type: types.REMOVE_COVER_FILTER_TAG,
		filePath
	};
}
