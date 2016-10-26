'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './App.jsx';
import AppStore from './AppStore';
import PubSub from 'pubsub-js';
import is from 'electron-is';
import injectTapEventPlugin from 'react-tap-event-plugin';

if (is.dev()) PubSub.immediateExceptions = true;

injectTapEventPlugin();

const remote  = require('electron').remote;
const { app, Menu } = remote;

const createWindowMenu = () => {
    let template = null;

    if (is.macOS()) {
        template = [{
            label   : 'View',
            submenu : [{
                label       : 'Reload',
                accelerator : 'CmdOrCtrl+R',
                click(item, focusedWindow) {
                    if (focusedWindow) {
                        focusedWindow.reload();
                    }
                }
            }, {
                label       : 'Toggle Developer Tools',
                accelerator : process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow) {
                    if (focusedWindow) {
                        focusedWindow.webContents.toggleDevTools();
                    }
                }
            }, {
                type : 'separator'
            }, {
                role : 'togglefullscreen'
            }]
        }, {
            role    : 'window',
            submenu : [{
                label       : 'Close',
                accelerator : 'CmdOrCtrl+W',
                role        : 'close'
            }, {
                label       : 'Minimize',
                accelerator : 'CmdOrCtrl+M',
                role        : 'minimize'
            }, {
                label : 'Zoom',
                role  : 'zoom'
            }, {
                type : 'separator'
            }, {
                label : 'Bring All to Front',
                role : 'front'
            }]
        }];

        template.unshift({
            label   : app.getName(),
            submenu : [{
                label : 'About ' + app.getName(),
                click : (item, win) => {
                    if (win) PubSub.publish('AboutDialog.visible');
                }
            }, {
                type : 'separator'
            }, {
                role    : 'services',
                submenu : []
            }, {
                label : 'Hide ' + app.getName(),
                role  : 'hide'
            }, {
                role : 'hideothers'
            }, {
                role : 'unhide'
            }, {
                type : 'separator'
            }, {
                label : 'Quit ' + app.getName(),
                role  : 'quit'
            }]
        });
    } else {
        template = [{
            label   : 'View',
            submenu : [{
                label       : 'Reload',
                accelerator : 'CmdOrCtrl+R',
                click(item, focusedWindow) {
                    if (focusedWindow) {
                        focusedWindow.reload();
                    }
                }
            }, {
                label       : 'Toggle Developer Tools',
                accelerator : is.macOS() ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow) {
                    if (focusedWindow) {
                        focusedWindow.webContents.toggleDevTools();
                    }
                }
            }, {
                type : 'separator'
            }, {
                role : 'togglefullscreen'
            }]
        }, {
            label : 'Help',
            submenu : [{
                label : 'About',
                click : (item, win) => {
                    if (win) PubSub.publish('AboutDialog.visible');
                }
            }]
        }];

        template.unshift({
            label   : 'File',
            submenu : [{
                label : 'Quit',
                role  : 'quit'
            }]
        });
    }

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

createWindowMenu();

const store = new AppStore();
store.aboutDialogStore.title   = 'About 9build';
store.messageDialogStore.title = 'Error';

const MuiApp = () => (
    <MuiThemeProvider>
        <App store={store} />
    </MuiThemeProvider>
);

ReactDOM.render(<MuiApp />, document.getElementById("app"));
