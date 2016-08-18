import fs from 'fs';
import path from 'path';
import {shell} from 'electron';


const thumbnailBlock = document.getElementById('content');
const state = {
	currentPath: "../assets/",
	imageVideoMap: null
}

function openVideoFromCover(event) {
	const videoList = state.imageVideoMap[event.target.dataset.nameKey];
	const targetVideoName = videoList[0];

	console.log(path.join(state.currentPath, targetVideoName));
	console.log(shell.openItem(path.join(state.currentPath, targetVideoName)));

	// var spawn = require('child_process').spawn;
	// var child = spawn(path.join(__dirname, '..', 'mygoap.exe'), ['game.config', '--debug']);
}
function displayThumbnails(parentNode, folderPath) {

	// set current path
	state.currentPath = folderPath;

	const IMAGE = "i";
	const VIDEO = "v";
	const exts = {
		".jpg": IMAGE,
		".jpeg": IMAGE,
		".png": IMAGE,
		".bmp": IMAGE,
		".avi": VIDEO,
		".mp4": VIDEO,
		".mkv": VIDEO,
		".wmv": VIDEO
	};
	try {

		// clear up block
		// while (parentNode.firstChild) parentNode.removeChild(parentNode.firstChild);

		// list files in the folder
		// let files = fs.readdirSync(folderPath);
		// const torrentFolder = path.join(folderPath, 'torrent');
		// try {
		// 	fs.accessSync(torrentFolder);
		// 	const torrentFiles = fs.readdirSync(torrentFolder).map(tFile => {
		// 		return path.join(torrent, tFile);
		// 	});
		// 	files = files.concat(torrentFiles);
		// } catch (ex) {}
		
		// separate images, video and other files
		const imageVideoMap = {};
		const imageNameMap = {};
		const videoFiles = [];
		const otherFiles = [];
		files.forEach(file => {
			const fileExt = path.extname(file).toLowerCase();
			switch (exts[fileExt]) {
				case IMAGE:
					// add image name as key for mapping
					const imageName = path.basename(file, fileExt).toLowerCase();
					imageVideoMap[imageName] = [];
					imageNameMap[imageName] = file;
					break;
				case VIDEO:
					videoFiles.push(file);
					break;
				default:
					otherFiles.push(file);
					break;
			}
		});

		// filter video files
		videoFiles.forEach(vFile => {

			// TODO: may be there is a better way, suffix tree?
			const matchingName = vFile.toLowerCase();
			const matchedImageKey = Object.keys(imageVideoMap).filter(imageKey => {
				return matchingName.startsWith(imageKey);
			});

			if (matchedImageKey.length > 1) {
				// more than 1 cover match => put to other files
				alert(`video #${vFile}# matched multiple images: ${matchedImageKey}`);
				otherFiles.push(vFile);
			} else if (matchedImageKey.length < 1) {
				otherFiles.push(vFile);
			} else {
				imageVideoMap[matchedImageKey[0]].push(vFile);
			}
		});

		// display image files as thumbnail
		Object.keys(imageNameMap).forEach(imageName => {
			const imgElement = document.createElement("img");
			imgElement.className = "thumb-cover";
			imgElement.title = imageNameMap[imageName];
			imgElement.src = path.join(folderPath, imageNameMap[imageName]);
			imgElement.dataset.nameKey = imageName;
			imgElement.addEventListener("dblclick", openVideoFromCover);
			parentNode.appendChild(imgElement);
		});
		// display other files as <p>
		otherFiles.forEach(file => {
			const pElement = document.createElement("p");
			pElement.textContent = file;
			parentNode.appendChild(pElement);
		});

		// add the video map to current state
		state.imageVideoMap = imageVideoMap;
		console.log(imageVideoMap);

	} catch (ex) {
		console.error(ex);
	}
}


function renderPageByDirPath(targetPath) {
	try {
		const targetDirPath = normalizeDirPath(targetPath);
		displayThumbnails(thumbnailBlock, targetDirPath);
	} catch (err) {
		window.alert(JSON.stringify(err));
	}
}

// const pathInput = document.getElementById('path-input');
// if (pathInput) {
// 	pathInput.addEventListener("keyup", event => {
// 		const targetPath = path.resolve(event.target.value);
// 		renderPageByDirPath(targetPath);
// 	});
// }


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




import renderMain from './index.jsx';
renderMain(null, thumbnailBlock);








