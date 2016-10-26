'use strict';

import Config from './config/config.json';
import Path from 'path'
import is from 'electron-is';

const { app, BrowserWindow, shell } = require('electron');

let win;

const createWindow = () => {
    win = new BrowserWindow({
        title          : app.getName(),
        width          : Config.windowWidth,
        height         : Config.windowHeight,
        minWidth       : Config.windowMinWidth,
        minHeight      : Config.windowMinHeight,
        center         : true,
        show           : false,
        webPreferences : {
            defaultEncoding : 'UTF-8',
            webaudio        : false,
            webgl           : false
        }
    });

    win.once('ready-to-show', () => win.show());
    win.on('closed', () => win = null);
    win.loadURL('file://' + Path.join(__dirname, 'app/index.html'));

    win.webContents.on('will-navigate', (e, url) => {
        e.preventDefault();

        shell.openExternal(url);
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (!is.macOS()) app.quit();
});

app.on('activate', () => {
    if (win === null) createWindow();
});
