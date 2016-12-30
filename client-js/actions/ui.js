
import * as types from './TYPES.js';

export function changeCoverNameFilter(coverNameFilter) {
	return {
		type: types.CHANGE_COVER_NAME_FILTER,
		coverNameFilter
	};
};

export function changeTagFilter(tagFilter) {
	return {
		type: types.CHANGE_TAG_FILTER,
		tagFilter
	};
};

export function addCoverFilterTag(tag) {
	return {
		type: types.ADD_COVER_FILTER_TAG,
		tag
	};
};

export function deleteCoverFilterTag(tag) {
	return {
		type: types.DELETE_COVER_FILTER_TAG,
		tag
	};
};

export function toggleCoverFilterTag(tag, shouldClearOthers) {
	return {
		type: types.TOGGLE_COVER_FILTER_TAG,
		tag, shouldClearOthers
	};
};
