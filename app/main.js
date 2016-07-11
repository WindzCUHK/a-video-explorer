// import app from 'app';
// import BrowserWindow from 'browser-window';

import electron from 'electron';

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const rootPath = `file://${__dirname}`;

let mainWindow = null;
app.on('ready', function() {
	mainWindow = new BrowserWindow({
		width: 1024,
		height: 768
	});

	mainWindow.loadURL(`${rootPath}/index.html`);

	mainWindow.webContents.openDevTools();

	mainWindow.on('closed', () => {
		// for multi-windows, delete it in array
		mainWindow = null;
	});
});


app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
});
