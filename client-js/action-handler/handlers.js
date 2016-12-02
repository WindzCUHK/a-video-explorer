
import fs from 'fs';
// import path from 'path';
import { shell } from 'electron';
// import { diffChars } from 'diff';

import recursiveLoadAllFAS, { arrayDiff, normalizeDirPath, getFileTags } from './utils/recursiveLoadAllFAS.js';



export function openCover (filePath) {
	console.log(filePath);
	console.log(shell.openItem(filePath));
}

export function changeDir (newPath, done) {

	// need set timeout to fake redux that the reducer does not dispatch event, i.e. no side effect
	const delayTimeout = 100;

	/*|================================================================|*/
	/*|                        merge file tags                         |*/
	/*|================================================================|*/
	function mergeFileTags (files) {
		if (!files) return [];
		return Object.keys(files.map((f) => {
			return f['tags'];
		}).reduce((mergedTags, tags) => {
			tags.forEach((t) => {
				mergedTags[t] = true;
			});
			return mergedTags;
		}, {}));
	}

	/*|================================================================|*/
	/*|                           load files                           |*/
	/*|================================================================|*/
	const targetDirPath = normalizeDirPath(newPath);
	recursiveLoadAllFAS(targetDirPath, (err, fileAttributes) => {

		console.log(err, fileAttributes);

		if (err) {
			const result = {
				pathError: err,
				currentPath: 'unknown path',
				files: [],
				fileTags: []
			};
			setTimeout(done.bind(null, result), delayTimeout);
		}

		// merge file tags, filter out root folder tags
		const stats = fs.lstatSync(targetDirPath);
		const targetDirTags = getFileTags(targetDirPath, stats);
		const fileTags = arrayDiff(mergeFileTags(fileAttributes), targetDirTags);

		// result
		const result = {
			pathError: null,
			currentPath: targetDirPath,
			files: fileAttributes,
			fileTags: fileTags
		};

		// done !!!
		setTimeout(done.bind(null, result), delayTimeout);
	});

};
