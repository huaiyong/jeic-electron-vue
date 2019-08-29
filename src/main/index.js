import electron from 'electron';
import {
	app,
	BrowserWindow,
	ipcMain
} from 'electron';
import {
	autoUpdater
} from 'electron-updater';
var  Menu=electron.Menu;
var  newwin=null;
var  pingtai=null;
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
	global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development' ?
	'http://localhost:9080' :
	`file://${__dirname}/index.html`;

function createWindow() {

	/**
	 * Initial window options
	 */
	mainWindow = new BrowserWindow({ //760,380
		frame: false,
		//useContentSize: true,
		resizable: false,
		width: electron.screen.getPrimaryDisplay().workAreaSize.width,
		height: electron.screen.getPrimaryDisplay().workAreaSize.height
	});
	mainWindow.loadURL(winURL);

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	// 加载好html再呈现window，避免白屏
	mainWindow.on('ready-to-show', () => {
		mainWindow.show();
		mainWindow.focus();
	});

	// mainWindow.webContents.openDevTools({ detach: true });
}

app.on('ready', () => {
	if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdatesAndNotify();
	const apis = require('./api');
	new apis();
	createWindow();
});

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

/**
 * 边框
 */
// 窗口最小化
ipcMain.on('min-window', () => {
	mainWindow.minimize();
});
// 窗口最大化
ipcMain.on('max-window', () => {
	if (mainWindow.isMaximized()) {
		mainWindow.restore();
	} else {
		mainWindow.maximize();
	}
});
// 关闭
ipcMain.on('close-window', () => {
	mainWindow.close();
});
ipcMain.on('open-baidu', () => {
	Menu.setApplicationMenu(null);
    newwin = new BrowserWindow({
        width: 600, 
        height: 400,
        parent: mainWindow, //win是主窗口
		webPreferences:{
		        nodeIntegration:false
		  }
    })
    newwin.loadURL("https://www.baidu.com/"); //new.html是新开窗口的渲染进程
    newwin.on('closed',()=>{newwin = null});
});
ipcMain.on('open-pingtai', ($even,userId,cityId) => {
	Menu.setApplicationMenu(null);
    pingtai = new BrowserWindow({
        width: 800, 
        height: 400,
        parent: mainWindow, //win是主窗口
		webPreferences:{
		        nodeIntegration:false
		}
    })
    pingtai.loadURL("http://edu.jetsen.cn:9001/jeuc/api/oauth/toClientUrl?clientId=1&userId="+userId+"&areaCode="+cityId); //new.html是新开窗口的渲染进程
    pingtai.on('closed',()=>{newwin = null});
});

/**
 * 导出下载
 */
ipcMain.on('download', (event, downloadPath) => {
	mainWindow.webContents.downloadURL(downloadPath);
	mainWindow.webContents.session.once('will-download', (event, item) => {
		item.once('done', (event, state) => {
			// 成功的话 state为completed 取消的话 state为cancelled
			mainWindow.webContents.send('downstate', state);
		});
	});
});


/**
 * 自动更新
 */

function sendUpdateMessage(message, data) {
	mainWindow.webContents.send('update-message', {
		message,
		data
	});
}

// 阻止程序关闭自动安装升级
autoUpdater.autoInstallOnAppQuit = false;

autoUpdater.on('error', data => {
	sendUpdateMessage('error', data);
});

/* // 检查更新
autoUpdater.on('checking-for-update', data => {
  sendUpdateMessage('checking-for-update', data);
});*/

// 有可用更新
autoUpdater.on('update-available', data => {
	sendUpdateMessage('update-available', data);
});

// 已经最新
autoUpdater.on('update-not-available', data => {
	sendUpdateMessage('update-not-available', data);
});

// 更新下载进度事件
autoUpdater.on('download-progress', data => {
	sendUpdateMessage('download-progress', data);
});
// 更新下载完成事件(event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate)
autoUpdater.on('update-downloaded', () => {
	sendUpdateMessage('update-downloaded', {});
	ipcMain.once('update-now', () => {
		autoUpdater.quitAndInstall();
	});
});
