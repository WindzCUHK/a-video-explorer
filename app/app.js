
import path from 'path';

import electron from 'electron';
import electronReload from 'electron-reload';


const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
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
