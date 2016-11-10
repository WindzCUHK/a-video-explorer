
import fs from 'fs';
import path from 'path';
import {shell} from 'electron';
import { diffChars } from 'diff';

import { setFfmpegPath, setFfprobePath, ffprobe } from 'fluent-ffmpeg';

const ffprobePath = (navigator.platform === 'MacIntel') ? '/Users/windz/bin/ffprobe' : 'C:\\myTools\\ffmpeg-20161101-60178e7-win64-static\\bin\\ffprobe.exe';
setFfprobePath(ffprobePath);
// ffprobe('C:\\Users\\Public\\Videos\\Sample Videos\\Wildlife.wmv', function(err, metadata) {
// 	if (err) console.error(err);
// 	console.dir(metadata);
// });



export function openCover(filePath) {
	console.log(filePath);
	console.log(shell.openItem(filePath));
}

export function changeDir(newPath, done) {

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

	const resolutionDict = {
		"HD": "HD",
		"SD": "SD",
		"GG": "GG"
	};

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

	function recursiveListDir(dirs, level) {

		if (dirs.length === 0 || level === 0) return [];

		// list all files in current level
		let files = [];
		dirs.forEach((dir) => {
			const fileTags = (dir.name) ? dir.tags.concat(dir.name) : [];
			const filesInDir = listFilesInDir(dir.path, fileTags);
			files = files.concat(filesInDir);
		});

		// filter all directories in sub-level, list all sub-level files
		const subDirs = files.filter( f => !f.isFile );
		const subFiles = recursiveListDir(subDirs, level - 1);

		return files.concat(subFiles);
	};


	try {
		/*|================================================================|*/
		/*|                       load all sub-files                       |*/
		/*|================================================================|*/
		const files = {};
		const targetDirPath = normalizeDirPath(newPath);
		const allSubFiles = recursiveListDir([{
			isFile: false,
			path: targetDirPath
		}], 2);

		/*|================================================================|*/
		/*|                      bind image and video                      |*/
		/*|================================================================|*/
		const videosWithCover = [];
		const images = allSubFiles.filter( f => extDict[f.ext] === IMAGE );
		const videos = allSubFiles.filter( f => extDict[f.ext] === VIDEO );

		// start binding
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
						

						/*

						const digitFilter = /\d+/g;
						const letterFilter = /[a-z]+/gi;
						const digitMatches = addedContent.match(digitFilter);
						const letterMatches = addedContent.match(letterFilter);

						// only different in digital part (exclude non-alphanumeric characters)
						if (digitMatches && !letterMatches && digitMatches.length === 1) {
							coveredVideos.push({
								episode: digitMatches[0],
								file: video
							});
							videosWithCover.push(video);
						}
						// only different in 1 letter (exclude non-alphanumeric characters)
						if (letterMatches && !digitMatches && letterMatches.length === 1 && letterMatches[0].length === 1) {
							coveredVideos.push({
								episode: letterMatches[0],
								file: video
							});
							videosWithCover.push(video);
						}

						*/
					}
				}
			});
			image.coveredVideos = coveredVideos;
		});
		// console.log('images', images);
		// console.log('videos', videos.map( v => v.name ));
		const arrayDiff = (a, b) => {
			return a.filter( e => b.indexOf(e) < 0 );
		};
		const allSubFilesWithVideoMerged = arrayDiff(allSubFiles, videosWithCover);
		// console.log(videosWithCover);

		// get all sub-dir paths
		// const subDirPaths = {};
		// allSubFiles.map((f) => {
		// 	return '.' + path.sep + f.tags.join(path.sep);
		// }).forEach((filePath) => {
		// 	subDirPaths[filePath] = true;
		// });
		// console.log(Object.keys(subDirPaths));



		/*|================================================================|*/
		/*|                        merge file tags                         |*/
		/*|================================================================|*/
		function mergeFileTags(files) {
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
		/*|                         sum up results                         |*/
		/*|================================================================|*/
		const result = {
			pathError: null,
			currentPath: targetDirPath,
			files: allSubFilesWithVideoMerged,
			fileTags: mergeFileTags(allSubFilesWithVideoMerged)
		};

		/*|================================================================|*/
		/*|                     read resolution info.                      |*/
		/*|================================================================|*/

		/*
		let readCount = 0;
		const readComplete = (video) => {
			readCount = readCount + 1;
			// console.log('ffprobe', video.name, video.resolution, readCount);
			if (readCount >= videos.length) {
				done(result);
			}
		};
		videos.forEach((video) => {

			// TODO: get a callback from redux..., read call is async
			ffprobe(video.path, function(err, metadata) {

				if (err) {
					video.resolution = resolutionDict.GG;
					readComplete(video);
					return;
				}

				const videoStreams = metadata.streams.filter((s) => {
					return s.codec_type === 'video';
				});
				if (videoStreams.length > 0) {
					// only consider the 1st video stream
					const videoHeight = videoStreams[0].height;
					video.resolution = (videoHeight >= 1000) ? resolutionDict.HD : resolutionDict.SD;
				} else {
					video.resolution = resolutionDict.GG;
				}
				readComplete(video);
				return;
			});
			
		});
		*/
		// no video to process, call done directly (need set timeout to fake redux that the reducer does not dispatch event, i.e. no side effect)
		// if (videos.length === 0) setTimeout(done.bind(null, result), 100);
		setTimeout(done.bind(null, result), 100);

		return result;
	} catch (pathError) {
		const result = {
			pathError,
			currentPath: 'unknown path',
			files: [],
			fileTags: []
		};
		done(result);
		return result;
	}
};
