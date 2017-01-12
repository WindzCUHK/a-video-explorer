
import path from 'path';

import Immutable from 'immutable';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import reducer from './reducer.js';
import MainBlock from './components/MainBlock.jsx';
import * as navigationActions from './actions/navigation.js';

/*|================================================================|*/
/*|                          Redux Store                           |*/
/*|================================================================|*/
const store = createStore(reducer, Immutable.Map({
	ui: Immutable.Map({
		nameFilter: '',
		tagFilter: '',
		filterTagSet: Immutable.Set(),
		isLoading: false
	}),
	currentDirTags: Immutable.Set(),
	currentPathFragments: Immutable.List(),
	files: Immutable.List(),
	fileTags: Immutable.List(),
	selectedCover: 'test'
}));

const defaultDir = (navigator.platform === 'MacIntel') ? '/Users/windz/Downloads/CC' : 'C:/Users/windz.fan/Git/a-video-explorer/test-pic';
store.dispatch(navigationActions.changeDir(defaultDir));

export function getStore() {
	return store;
};

/*|================================================================|*/
/*|                         Rendering Main                         |*/
/*|================================================================|*/
export default function renderMain(state, containerElement) {

	// react root
	render(
		<Provider store={store}>
			<MainBlock />
		</Provider>,
		containerElement
	);


	// bind drag-drop event
	const ddLayer = containerElement;
	ddLayer.ondragover = () => {
		return false;
	};
	ddLayer.ondragleave = ddLayer.ondragend = () => {
		return false;
	};
	ddLayer.ondrop = event => {
		event.preventDefault();
		const targetFile = event.dataTransfer.files[0];
		if (!targetFile) return false;

		store.dispatch(navigationActions.changeDir(targetFile.path));

		console.log('File you dragged here is', targetFile.path);
		return false;
	};
};
