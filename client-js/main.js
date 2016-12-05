
import injectTapEventPlugin from 'react-tap-event-plugin';

import renderMain from './index.jsx';



/*|=======================================================|*/
/*|         prevent electron open file directly           |*/
/*|=======================================================|*/
document.addEventListener('dragover', event => {
	event.preventDefault();
	return false;
}, false);

document.addEventListener('drop', event => {
	event.preventDefault();
	return false;
}, false);



/*|================================================================|*/
/*|                        React Rendering                         |*/
/*|================================================================|*/
injectTapEventPlugin();

const thumbnailBlock = document.getElementById('content');
renderMain(null, thumbnailBlock);
