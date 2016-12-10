
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


/*|================================================================|*/
/*|                           React Perf                           |*/
/*|================================================================|*/
// import Perf from 'react-addons-perf'
// Perf.start()

// setTimeout(function () {
// 	Perf.stop();
// 	const measurements = Perf.getLastMeasurements();
// 	Perf.printInclusive(measurements)
// 	Perf.printExclusive(measurements)
// 	Perf.printWasted(measurements)
// 	Perf.printOperations(measurements)

// }, 10 * 1000);
