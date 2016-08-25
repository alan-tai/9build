'use strict';

const { app, BrowserWindow, shell } = require('electron');

const Path        = require('path');
const PackageInfo = require('./package.json');
const Config      = require('./config/config.json');
const is          = require('electron-is');

let win;

function createWindow() {
    win = new BrowserWindow({
        title          : PackageInfo.description,
        width          : Config.windowWidth,
        height         : Config.windowHeight,
        minWidth       : Config.windowMinWidth,
        minHeight      : Config.windowMinHeight,
        center         : true,
        show           : false,
        webPreferences : {
            defaultEncoding : 'UTF-8',
            scrollBounce    : true
        }
    });

    win.once('ready-to-show', () => {
        win.show();
});

    win.on('closed', () => {
        win = null;
});

    win.loadURL('file://' + Path.join(__dirname, 'app/index.html'));

    win.webContents.on('will-navigate', (e, url) => {
        e.preventDefault();

    shell.openExternal(url);
});
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (!is.macOS()) {
    app.quit();
}
});

app.on('activate', () => {
    if (win === null) {
    createWindow();
}
});
