import fs from 'fs';
import path from 'path';


let state = {
	currentPath: "../assets/",
}

document.getElementById('path-input').addEventListener("keyup", event => {
	let targetPath = path.resolve(event.target.value);

	let files = fs.readdirSync(targetPath);
	let imgFiles = files.filter(file => {
		return /\.(jpg|jpeg|png|bmp)$/.test(file);
	});

	imgFiles.forEach(imgFile => {
		let imgElement = document.createElement("img");
		imgElement.src = path.join(targetPath, imgFile);
		document.getElementById('content').appendChild(imgElement);
	});

});


console.log(process.resourcesPath);
console.log(__dirname);
console.log(window.location);
