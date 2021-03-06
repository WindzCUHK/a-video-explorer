
import injectTapEventPlugin from 'react-tap-event-plugin';

import renderMain from './index.jsx';

import { ipcRenderer } from 'electron';
const clearNonExist = () => {
	ipcRenderer.send('clearNonExist');
};
document._clearNonExist = clearNonExist;

/*|=======================================================|*/
/*|         prevent electron open file directly           |*/
/*|=======================================================|*/
document.addEventListener('dragover', event => {
	event.preventDefault();
	event.stopPropagation();
	return false;
}, false);

document.addEventListener('drop', event => {
	event.preventDefault();
	event.stopPropagation();
	return false;
}, false);



/*|================================================================|*/
/*|                        React Rendering                         |*/
/*|================================================================|*/
injectTapEventPlugin();

const thumbnailBlock = document.getElementById('content');
renderMain(null, thumbnailBlock);
