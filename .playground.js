
import fs from 'fs';
import path from 'path';

import DataStore from 'nedb';
import { setFfmpegPath, setFfprobePath, ffprobe } from 'fluent-ffmpeg';



const arrayDiff = (a, b) => {
	return a.filter( e => b.indexOf(e) < 0 );
};



/*|================================================================|*/
/*|                    define constants & init                     |*/
/*|================================================================|*/
const CONSTANTS = {};
(function declareConstants () {

	// initialization
	const navigator = { platform: 'windows' };
	const ffprobePath = (navigator.platform === 'MacIntel') ? '/Users/windz/bin/ffprobe' : 'C:\\myTools\\ffmpeg-20161101-60178e7-win64-static\\bin\\ffprobe.exe';
	setFfprobePath(ffprobePath);

	// CONSTANTS.DB
	const dataStoreConfig = {
		filename: __dirname + '/db/fileList.db',
		autoload: true
	};
	CONSTANTS.DB = new DataStore(dataStoreConfig);

	// CONSTANTS.IMAGE
	const IMAGE = CONSTANTS.IMAGE = "i";
	// CONSTANTS.IMAGE
	const VIDEO = CONSTANTS.VIDEO = "v";
	// CONSTANTS.EXT_DICT
	CONSTANTS.EXT_DICT = {
		"jpg": IMAGE,
		"jpeg": IMAGE,
		"png": IMAGE,
		"bmp": IMAGE,
		"avi": VIDEO,
		"mp4": VIDEO,
		"mkv": VIDEO,
		"wmv": VIDEO
	};

	// CONSTANTS.RESOLUTION_DICT
	CONSTANTS.RESOLUTION_DICT = {
		"HD": "HD",
		"SD": "SD",
		"GG": "GG"
	};
	// CONSTANTS.HD_VIDEO_HEIGHT
	CONSTANTS.HD_VIDEO_HEIGHT = 1000;

})();

/*|================================================================|*/
/*|                    get dirPath & normalize                     |*/
/*|================================================================|*/
function normalizeDirPath (targetPath) {

	// normalize windows path, path.sep === '/' on windows...
	if (targetPath.indexOf('\\') >= 0) targetPath = targetPath.replace(/\\/g, path.sep);

	// check file exist and can access
	fs.accessSync(targetPath);

	// for non-directory, return its dir path
	const stats = fs.lstatSync(targetPath);
	if (!stats.isDirectory()) return path.dirname(targetPath);
	else return targetPath;
}

/*|================================================================|*/
/*|                   parse & bind files in dir                    |*/
/*|================================================================|*/
function _getFileTags (filePath, fileStats) {
	const tags = filePath.split(path.sep);

	// don't include file name as tag
	if (fileStats.isFile()) tags.pop();

	// remove last empty tag for directory
	if (fileStats.isDirectory() && tags[tags.length - 1].length === 0) tags.pop();

	return tags;
}
function _parseFileAttributes (filePath, parseDone) {

	const stats = fs.lstatSync(filePath);
	const fileName = path.basename(filePath);
	const tags = _getFileTags(filePath, stats);

	// parse directory
	if (stats.isDirectory()) {
		parseDone(null, {
			isFile: false,
			path: filePath,
			stat: stats,
			tags: tags,
			name: fileName
		});
		return;
	}

	// parse file
	if (stats.isFile()) {

		const fileExt = path.extname(fileName);
		const fileAttributes =  {
			isFile: true,
			path: filePath,
			stat: stats,
			tags: tags,
			name: fileName.substring(0, fileName.length - fileExt.length),
			ext: fileExt.substr(1).toLowerCase()
		};

		// check video file resolution
		if (CONSTANTS.EXT_DICT[fileAttributes.ext] === CONSTANTS.VIDEO) {
			ffprobe(filePath, function(err, metadata) {

				if (err) {
					fileAttributes.resolution = CONSTANTS.RESOLUTION_DICT.GG;
					fileAttributes.resolutionError = err.toString();
					parseDone(null, fileAttributes);
					return;
				}

				const videoStreams = metadata.streams.filter((s) => {
					return s.codec_type === 'video';
				});
				if (videoStreams.length > 0) {
					// only consider the 1st video stream
					const videoHeight = videoStreams[0].height;
					fileAttributes.resolution = (videoHeight >= CONSTANTS.HD_VIDEO_HEIGHT) ? CONSTANTS.RESOLUTION_DICT.HD : CONSTANTS.RESOLUTION_DICT.SD;
				} else {
					fileAttributes.resolution = CONSTANTS.RESOLUTION_DICT.GG;
				}
				parseDone(null, fileAttributes);
				return;
			});
		} else {
			parseDone(null, fileAttributes);
		}

		return;
	}

	// symbolic link and others
	parseDone(null, null);
}
function _bindVideoToCover(fas) {

	const images = fas.filter( f => CONSTANTS.EXT_DICT[f.ext] === CONSTANTS.IMAGE );
	const videos = fas.filter( f => CONSTANTS.EXT_DICT[f.ext] === CONSTANTS.VIDEO );
	
	const videosWithCover = [];
	images.forEach((image) => {
		const coveredVideos = [];
		videos.forEach((video) => {

			if (image.name === video.name) {

				// name equal
				coveredVideos.push({
					isEqual: true,
					file: video
				});
				videosWithCover.push(video);

			} else {

				const imageIndex = video.name.indexOf(image.name);
				if (imageIndex >= 0) {
					coveredVideos.push({
						episode: video.name.substring(0, imageIndex) + video.name.substring(imageIndex + image.name.length),
						file: video
					});
					videosWithCover.push(video);
				}


				/* use diff, but add part have some problem @@

				// console.log(image.name, video.name);
				const diff = diffChars(image.name, video.name);
				const diffAdded = diff.filter( d => d.added );
				const diffRemoved = diff.filter( d => d.removed );
				if (diffAdded.length === 1 && diffRemoved.length === 0) {

					const addedContent = diffAdded[0].value;

					// prefix match
					coveredVideos.push({
						episode: addedContent,
						file: video
					});
					videosWithCover.push(video);

					// const digitFilter = /\d+/g;
					// const letterFilter = /[a-z]+/gi;
					// const digitMatches = addedContent.match(digitFilter);
					// const letterMatches = addedContent.match(letterFilter);

					// // only different in digital part (exclude non-alphanumeric characters)
					// if (digitMatches && !letterMatches && digitMatches.length === 1) {
					// 	coveredVideos.push({
					// 		episode: digitMatches[0],
					// 		file: video
					// 	});
					// 	videosWithCover.push(video);
					// }
					// // only different in 1 letter (exclude non-alphanumeric characters)
					// if (letterMatches && !digitMatches && letterMatches.length === 1 && letterMatches[0].length === 1) {
					// 	coveredVideos.push({
					// 		episode: letterMatches[0],
					// 		file: video
					// 	});
					// 	videosWithCover.push(video);
					// }
				}
				*/
			}
		});
		image.coveredVideos = coveredVideos;
	});

	// filter out videos with its cover (the video file will be child of its cover image file)
	const fasWithVideoMerged = arrayDiff(fas, videosWithCover);

	return fasWithVideoMerged;
}
function parseDir(dirPath, parseDone) {

	const files = fs.readdirSync(dirPath);
	const toParseFileAttributes = (filePath) => {
		return new Promise((resolve, reject) => {
			_parseFileAttributes(filePath, (err, fa) => {
				if (err) return reject(err);
				resolve(fa);
			});
		});
	};

	// create promises to read all child files attributes
	const faPromises = files.map((fileName) => {
		const filePath = path.join(dirPath, fileName);
		return toParseFileAttributes(filePath);
	});

	Promise.all(faPromises).then((fas) => {

		const fasWithVideoMerged = _bindVideoToCover(fas.filter( fa => fa !== null ));
		parseDone(null, fasWithVideoMerged);

	}).catch(parseDone);
}

/*|================================================================|*/
/*|  load file attributes of files in this directory (same level)  |*/
/*|================================================================|*/
function _parseDirAndUpsertDataStore (dirPath, loadDone) {
	parseDir(dirPath, (err, fas) => {

		if (err) return loadDone(err);

		// prepare doc
		const stats = fs.lstatSync(dirPath);
		const newDoc = {
			_id: dirPath,
			mtime: stats.mtime,
			childs: fas
		};

		// insert/update to DB
		const query = { _id: dirPath };
		const options = { upsert: true }
		CONSTANTS.DB.update(query, newDoc, options, function (err, numAffected, affectedDocuments, upsertFlag) {

			if (err) return loadDone(err);

			// affectedDocuments is set, iff, upsertFlag = true or options.returnUpdatedDocs = true

			// load finish
			loadDone(null, fas);

		});
	});
}
function loadDirFAS (dirPath, loadDone) {

	// search directory doc by ID
	CONSTANTS.DB.findOne({ _id: dirPath }, function (err, doc) {

		if (err) return loadDone(err);

		// null if not found
		if (!doc) {
			// not found, parse and insert to data store
			console.log(`[${dirPath}] not found in DB`);
			_parseDirAndUpsertDataStore(dirPath, loadDone);
		} else {
			const stats = fs.lstatSync(dirPath);
			// check if directory structure updated by its modification time
			if (doc.mtime.getTime() === stats.mtime.getTime()) {
				// found, unchanged
				console.log(`[${dirPath}] load from DB`);
				loadDone(null, doc.childs);
			} else {
				// found but changed, parse and update to data store
				console.log(`[${dirPath}] structure updated, will update DB`);
				_parseDirAndUpsertDataStore(dirPath, loadDone);
			}
		}
	});
}

/*|================================================================|*/
/*|            recursive load directory and its childs             |*/
/*|================================================================|*/
export default function recursiveLoadAllFAS (dirPath, loadAllDone) {

	const dirFAS = [];
	const directoryOnly = f => !f.isFile;
	const flattenArray = (baseArray, nestedArray) => [].concat.apply([], baseArray.concat(nestedArray));

	loadDirFAS(dirPath, (err, fas) => {

		if (err) return loadAllDone(err);

		// add childs on the same level first
		dirFAS.push(fas);

		// filter sub directories
		const subDirs = fas.filter(directoryOnly);
		if (subDirs.length === 0) return loadAllDone(null, dirFAS[0]);

		// go in sub directories
		const toSubDirPromise = (subDirPath) => {
			return new Promise((resolve, reject) => {
				recursiveLoadAllFAS(subDirPath, (err, fas) => {
					if (err) return reject(err);
					resolve(fas);
				});
			});
		};

		// when all sub directories done, concat their file attributes with fa of current directory
		Promise.all(subDirs.map( fa => toSubDirPromise(fa.path) ))
			.then((allSubDirFAS) => {
				loadAllDone(null, flattenArray(dirFAS, allSubDirFAS));
			})
			.catch(loadAllDone);

	});
}






/*|================================================================|*/
/*|                          code to play                          |*/
/*|================================================================|*/
// const testPath = 'C:\\Users\\Public\\Videos\\Sample Videos\\Wildlife.wmv';
const testPath = 'C:\\Users\\windz.fan\\Git\\a-video-explorer\\test-pic\\';
recursiveLoadAllFAS(normalizeDirPath(testPath), (err, fas) => {
	console.log(err, fas);
});

