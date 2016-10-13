
import path from 'path';

import Immutable from 'immutable';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

import reducer from './reducer.js';
import MainBlock from './components/MainBlock.jsx';
import * as navigationActions from './actions/navigation.js';

const store = createStore(reducer, Immutable.Map({
	ui: {
		nameFilter: '',
		tagsFilter: []
	}
}));

const defaultDir = 'C:/Users/windz.fan/Git/a-video-explorer/test-pic';
store.dispatch(navigationActions.changeDir(defaultDir));



export default function renderMain(state, containerElement) {
	render(
		<Provider store={store}>
			<MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
				<MainBlock />
			</MuiThemeProvider>
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
