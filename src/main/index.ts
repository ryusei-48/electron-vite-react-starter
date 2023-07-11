/// <reference types="vite/client" />
import { app, shell, BrowserWindow, ipcMain } from 'electron'
//import Store from 'electron-store';
import { join } from 'path'
//import fs from "fs";
//import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../build/icon.png'
//import Database from "better-sqlite3-multiple-ciphers";

//export type storeConfig = { instance?: { label: string, id: number, path: string }[] }

//const USER_DATA_PATH = app.getPath('userData');
//const STORAGE_PATH = USER_DATA_PATH + '/storage/database';

const CleePIXMain: {

  Windows: { main?: BrowserWindow },
  //storage: { [key: number]: { db?: Database.Database, stmt?: { [key: string]: Database.Statement } } },
  //config: Store<storeConfig>,
  run: () => void,
  createWindowInstance: () => BrowserWindow

} = {

  Windows: {}, //storage: {},
  //config: new Store<storeConfig>({ encryptionKey: 'ymzkrk33' }),

  run: function () {

    /*this.config.clear();
    if (this.config.size === 0) {
      this.config.store = {
        instance: [{
          label: 'default', id: 1,
          path: STORAGE_PATH + `/ite_${randomString()}.db`
        }, {
          label: 'main', id: 2,
          path: STORAGE_PATH + `/ite_${randomString()}.db`
        }]
      }
    }*/

    app.whenReady().then(() => {

      this.Windows.main = this.createWindowInstance();

      app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) CleePIXMain.createWindowInstance();
      });
    });

    ipcMain.on('window-close', () => {
      app.quit();
    });

    ipcMain.on('window-maximize', () => {
      if (this.Windows.main?.isMaximized()) {
        this.Windows.main?.unmaximize();
      } else this.Windows.main?.maximize();
    });

    ipcMain.on('window-minize', () => {
      this.Windows.main?.minimize();
    });

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    });
  },

  createWindowInstance: function () {

    const window = new BrowserWindow({
      width: 1360,
      height: 830,
      show: false, frame: true,
      autoHideMenuBar: true,
      backgroundColor: "#0f0f0f",
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false, webviewTag: true
      }
    })

    window.on('ready-to-show', () => {
      window.show()
    })

    window.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
      window.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      window.loadFile(join(__dirname, '../renderer/index.html'))
    }

    return window;
  }
}
/*
function randomString(len: number = 10): string {

  let str: string = "0123456789abcdefghijklmnopqrstuvwxyz";
  let strLen: number = str.length;
  let result: string = '';

  for (let i = 0; i < len; i++) {
    result += str[Math.floor(Math.random() * strLen)];
  }

  return result;
}
*/

CleePIXMain.run();