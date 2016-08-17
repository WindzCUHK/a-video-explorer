
import React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';
import MainBlock from './components/MainBlock.jsx';
// import ThumbnailBlock from './components/ThumbnailBlock.jsx';

const reducer = (state, action) => {
	return state;
};
const store = createStore(reducer, {
	currentPath: '.'
});

// render(
// 	<ThumbnailBlock pair={pair} winner="Trainspotting" />,
// 	document.getElementById('app')
// );

export default function renderMain(state, containerElement) {
	render(
		<MainBlock />,
		containerElement
	);
};
