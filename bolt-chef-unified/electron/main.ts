import { app, BrowserWindow, shell } from 'electron';
import { join } from 'path';
import { electronApp } from '@electron-toolkit/utils';

class AppWindow {
  private mainWindow: BrowserWindow | null = null;

  createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      title: 'Bolt-Chef Unified',
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: 'deny' };
    });

    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.loadURL('http://localhost:5173');
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    }
  }

  getMainWindow() {
    return this.mainWindow;
  }
}

const appWindow = new AppWindow();

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.boltchef.unified');

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) appWindow.createWindow();
  });

  appWindow.createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
