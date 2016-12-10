
import path from 'path';

import { app, BrowserWindow, ipcMain } from 'electron';
import electronReload from 'electron-reload';



electronReload(__dirname);

const rootPath = `file://${__dirname}`;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1024,
		height: 768,
		fullscreen: true
	});

	mainWindow.loadURL(`${rootPath}/index.html`);

	if (process.argv[2] !== 'noDebug') mainWindow.webContents.openDevTools();

	mainWindow.on('closed', () => {
		// for multi-windows, delete it in array
		mainWindow = null;
	});

	// prevent window directly open the drag content
	mainWindow.webContents.on('will-navigate', (event) => {
		event.preventDefault();
	});
}

let mainWindow = null;
app.on('ready', createWindow);
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});

// console.log(app.getPath('home'));

import fs from 'fs';
import os from 'os';
import DataStore from 'nedb';
!function () {

	// if `nedb` run in render process, it will use browser's storage for the DB. Hence, nedb to declare in main process and use IPC to communicate
	// the path is useless, electron will save it in browser storage (filename = key to doc saving the whole DB)...

	// console.log('os:', os.platform());
	const dbDirPath = (os.platform() !== 'win32') ? '/Users/windz/Code/a-video-explorer/db' : 'C:\\Users\\windz.fan\\Git\\a-video-explorer\\db';
	const dataStoreConfig = {
		filename: path.join(dbDirPath, 'fileList.db'),
		autoload: false
	};
	const DB = new DataStore(dataStoreConfig);
	DB.loadDatabase((err) => {
		if (err) console.error(err);
	});

	/*|================================================================|*/
	/*|                           IPC events                           |*/
	/*|================================================================|*/
	ipcMain.on('getAll', (event) => {
		DB.find({}, (err, docs) => {
			console.log(err, docs);
		});
	});
	ipcMain.on('presist', (event) => {
		DB.persistence.compactDatafile();
	});
	ipcMain.on('get', (event, id) => {
		DB.findOne({ _id: id }, (err, doc) => {
			event.returnValue = { err, doc };
		});
	});
	ipcMain.on('upsert', (event, doc) => {

		const query = { _id: doc._id };
		const options = { upsert: true };

		DB.update(query, doc, options, function (err, numAffected, affectedDocuments, upsertFlag) {
			// affectedDocuments is set, iff, upsertFlag = true or options.returnUpdatedDocs = true
			event.returnValue = { err };
		});
	});

	ipcMain.on('clearNonExist', (event) => {
		DB.find({}, (err, docs) => {
			console.log('--- clearNonExist() start ---');
			const paths = docs.map( d => d._id );
			paths.forEach((p) => {
				try {
					fs.accessSync(p);
				} catch (err) {
					console.log(`[path 404]\t ${p}`);
					DB.remove({ _id: p }, { multi: false }, function (err, numRemoved) {
						if (numRemoved !== 1) console.error(`[remove 500]\t ${p}`);
						else console.log(`[remove 200]\t ${p}`);
					});
				}
			});
		});
	});

}();

import { setFfprobePath, ffprobe } from 'fluent-ffmpeg';
!function () {

	const ffprobePath = (os.platform() !== 'win32') ? '/Users/windz/bin/ffprobe' : 'C:\\myTools\\ffmpeg-20161101-60178e7-win64-static\\bin\\ffprobe.exe';
	setFfprobePath(ffprobePath);


	ipcMain.on('getResolution', (event, filePath) => {
		ffprobe(filePath, function(err, metadata) {
			event.returnValue = { err, metadata };
		});
	});
}();
