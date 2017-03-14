
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { shell } from 'electron';
// import { diffChars } from 'diff';

import recursiveLoadAllFAS, { arrayDiff, normalizeDirPath, getFileTags } from './utils/recursiveLoadAllFAS.js';

export const PlayerTypes = {
	DEFAULT: 'DEFAULT',
	ALTERNATIVE: 'ALTERNATIVE',
	FOLDER: 'FOLDER'
}

export function openCover (filePath, player) {
	// console.log(filePath);
	switch(player) {
		case PlayerTypes.FOLDER:
			shell.showItemInFolder(filePath);
			break;
		case PlayerTypes.ALTERNATIVE:
			const childProcess = spawn('open', ['-a', 'MPlayerX', filePath], {
				detached: true,
				stdio: 'ignore'
			});
			break;
		default:
			shell.openItem(filePath);
	}

	// vlc movie.avi --start-time 240 --stop-time 560 --repeat
}

export function changeDir (newPath, done) {

	// need set timeout to fake redux that the reducer does not dispatch event, i.e. no side effect
	const delayTimeout = 100;
	try {

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


		function getPathFragments (currentPath) {
			const dirPaths = [];

			do {
				let nextPath = path.join(currentPath, '..');

				const dirName = path.basename(currentPath);
				dirPaths.push({
					dirName: (dirName) ? dirName : currentPath,
					dirPath: currentPath
				});

				// check if root dir reached
				if (currentPath === nextPath) break;
				else currentPath = nextPath;

			} while (true);

			// for windows...
			dirPaths[dirPaths.length - 1].dirName = dirPaths[dirPaths.length - 1].dirName.replace(path.sep, '');

			return dirPaths.reverse();
		}

		/*|================================================================|*/
		/*|                           load files                           |*/
		/*|================================================================|*/
		const targetDirPath = normalizeDirPath(newPath);
		recursiveLoadAllFAS(targetDirPath, (err, fileAttributes) => {

			// console.log(err, fileAttributes);
			// fileAttributes = [];

			if (err) {
				const result = {
					pathError: err,
					currentDirTags: [],
					currentPathFragments: ['unknown path'],
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
			const pathFragments = getPathFragments(targetDirPath);
			const result = {
				pathError: undefined,
				currentDirTags: pathFragments.map(pf => pf.dirName),
				currentPathFragments: pathFragments,
				files: fileAttributes,
				fileTags: fileTags
			};

			// done !!!
			setTimeout(done.bind(null, result), delayTimeout);
		});
	} catch (err) {
		// normalizeDirPath() will throw error
		const result = {
			pathError: err,
			currentDirTags: [],
			currentPathFragments: ['path not exist'],
			files: [],
			fileTags: []
		};
		setTimeout(done.bind(null, result), delayTimeout);
	}

};
