
import fs from 'fs';
import path from 'path';
import { diffChars } from 'diff';

const IMAGE = "i";
const VIDEO = "v";
const extDict = {
	"jpg": IMAGE,
	"jpeg": IMAGE,
	"png": IMAGE,
	"bmp": IMAGE,
	"avi": VIDEO,
	"mp4": VIDEO,
	"mkv": VIDEO,
	"wmv": VIDEO
};

export function changeDir(newPath) {

	function normalizeDirPath(targetPath) {

		// normalize windows path, path.sep === '/' on windows...
		if (targetPath.indexOf('\\') >= 0) targetPath = targetPath.replace(/\\/g, path.sep);

		// check file exist and can access
		fs.accessSync(targetPath);

		// for non-directory, return its dir path
		const stats = fs.lstatSync(targetPath);
		if (!stats.isDirectory()) return path.dirname(targetPath);
		else return targetPath;
	}

	function listFilesInDir(dirPath, tags) {
		const files = fs.readdirSync(dirPath);

		return files.map((f) => {
			const filePath = path.join(dirPath, f);
			const stats = fs.lstatSync(filePath);
			if (stats.isDirectory()) {
				return {
					isFile: false,
					path: filePath,
					stat: stats,
					tags: tags,
					name: f
				};
			} else if (stats.isFile()) {
				const fileExt = path.extname(f);
				return {
					isFile: true,
					path: filePath,
					stat: stats,
					tags: tags,
					name: f.substring(0, f.length - fileExt.length),
					ext: fileExt.substr(1).toLowerCase()
				};
			} else return null;
		}).filter((f) => {
			return f !== null;
		});
	}

	function recursiveListDir(dirs) {

		if (dirs.length === 0) return [];

		// list all files in current level
		let files = [];
		dirs.forEach((dir) => {
			const fileTags = (dir.name) ? dir.tags.concat(dir.name) : [];
			const filesInDir = listFilesInDir(dir.path, fileTags);
			files = files.concat(filesInDir);
		});

		// filter all directories in sub-level, list all sub-level files
		const subDirs = files.filter( f => !f.isFile );
		const subFiles = recursiveListDir(subDirs);

		return files.concat(subFiles);
	};


	try {
		const files = {};
		const targetDirPath = normalizeDirPath(newPath);
		const allSubFiles = recursiveListDir([{
			isFile: false,
			path: targetDirPath
		}]);

		const images = allSubFiles.filter((f) => {
			return extDict[f.ext] === IMAGE;
		});
		const videos = allSubFiles.filter((f) => {
			return extDict[f.ext] === VIDEO;
		});
		const videosWithCover = [];
		images.forEach((image) => {





			// const coveredVideo = image.coveredVideo = {};




			
			videos.forEach((video) => {
				if (image.name === video.name) {
					// name equal
					coveredVideo['same'] = video;
					videosWithCover.push(video);
				} else {
					// console.log(image.name, video.name);
					const diff = diffChars(image.name, video.name);
					const diffAdded = diff.filter( d => d.added );
					const diffRemoved = diff.filter( d => d.removed );
					if (diffAdded.length === 1 && diffRemoved.length === 0) {

						const addedContent = diffAdded[0].value;

						const digitFilter = /\d+/g;
						const letterFilter = /[a-z]+/gi;
						const digitMatches = addedContent.match(digitFilter);
						const letterMatches = addedContent.match(letterFilter);

						if (digitMatches && !letterMatches && digitMatches.length === 1) {
							coveredVideo[digitMatches[0]] = video;
							videosWithCover.push(video);
						}
						if (letterMatches && !digitMatches && letterMatches.length === 1 && letterMatches[0].length === 1) {
							coveredVideo[letterMatches[0]] = video;
							videosWithCover.push(video);
						}
					}
				}
			});
		});
		console.log('images', images);
		// console.log('videos', videos.map( v => v.name ));
		Array.prototype.diff = function(a) {
			return this.filter(function(i) {return a.indexOf(i) < 0;});
		};

		// get all sub-dir paths
		// const subDirPaths = {};
		// allSubFiles.map((f) => {
		// 	return '.' + path.sep + f.tags.join(path.sep);
		// }).forEach((filePath) => {
		// 	subDirPaths[filePath] = true;
		// });
		// console.log(Object.keys(subDirPaths));

		return {
			currentPath: targetDirPath,
			files: allSubFiles
		};
	} catch (pathError) {
		return { pathError };
	}
};
