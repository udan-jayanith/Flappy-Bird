const {app, BrowserWindow} = require('electron')

let mainWindow

app.on('ready', () => {
	mainWindow = new BrowserWindow({
		fullscreen: true,
		autoHideMenuBar: true,
		icon: __dirname + '/favicon.ico',
	})

	mainWindow.loadFile('index.html')

	mainWindow.on('closed', () => {
		mainWindow = null
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
