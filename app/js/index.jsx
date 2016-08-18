
import Immutable from 'immutable';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducer.js';
import MainBlock from './components/MainBlock.jsx';
import * as navigationActions from './actions/navigation.js';

const store = createStore(reducer, Immutable.Map({
	currentPath: '.'
}));



export default function renderMain(state, containerElement) {
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

		store.dispatch(navigationActions.changeDir(targetFile.path));

		console.log('File you dragged here is', targetFile.path);
		return false;
	};
};
