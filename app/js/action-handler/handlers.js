
import fs from 'fs';
import path from 'path';

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
