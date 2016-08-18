
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducer.js';
import MainBlock from './components/MainBlock.jsx';
// import ThumbnailBlock from './components/ThumbnailBlock.jsx';

const store = createStore(reducer, {
	currentPath: '.'
});

// render(
// 	<ThumbnailBlock pair={pair} winner="Trainspotting" />,
// 	document.getElementById('app')
// );

export default function renderMain(state, containerElement) {
	render(
		<Provider store={store}>
			<MainBlock />
		</Provider>,
		containerElement
	);
};
