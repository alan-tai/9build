'use strict';

import React            from 'react';
import ReactDOM         from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App              from './app.jsx';
import PubSub           from 'pubsub-js';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const remote      = require('electron').remote;
const Menu        = remote.Menu;
const PackageInfo = require('../package.json');
const is          = require('electron-is');

if (is.dev()) {
    PubSub.immediateExceptions = true;
}

function createWindowMenu() {
    let template = null;

    if (is.macOS()) {
        template = [{
            label   : 'Edit',
            submenu : [{
                role        : 'undo',
                accelerator : 'CmdOrCtrl+Z'
            }, {
                role        : 'redo',
                accelerator : 'Shift+CmdOrCtrl+Z'
            }, {
                type : 'separator'
            }, {
                role        : 'cut',
                accelerator : 'CmdOrCtrl+X'
            }, {
                role        : 'copy',
                accelerator : 'CmdOrCtrl+C'
            }, {
                role        : 'paste',
                accelerator : 'CmdOrCtrl+V'
            }, {
                type : 'separator'
            }, {
                role        : 'selectall',
                accelerator : 'CmdOrCtrl+A'
            }]
        }, {
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
            label   : PackageInfo.description,
            submenu : [{
                label : 'About ' + PackageInfo.description,
                click() {
                    PubSub.publish('AboutDialog.visible', {
                        visible : true
                    });
                }
            }, {
                type : 'separator'
            }, {
                role    : 'services',
                submenu : []
            }, {
                label : 'Hide ' + PackageInfo.description,
                role  : 'hide'
            }, {
                role : 'hideothers'
            }, {
                role : 'unhide'
            }, {
                type : 'separator'
            }, {
                label : 'Quit ' + PackageInfo.description,
                role  : 'quit'
            }]
        });
    } else if (is.windows()) {
        template = [{
            label   : 'Edit',
            submenu : [{
                role        : 'undo',
                accelerator : 'CmdOrCtrl+Z'
            }, {
                role        : 'redo',
                accelerator : 'Shift+CmdOrCtrl+Z'
            }, {
                type : 'separator'
            }, {
                role        : 'cut',
                accelerator : 'CmdOrCtrl+X'
            }, {
                role        : 'copy',
                accelerator : 'CmdOrCtrl+C'
            }, {
                role        : 'paste',
                accelerator : 'CmdOrCtrl+V'
            }, {
                type : 'separator'
            }, {
                role        : 'selectall',
                accelerator : 'CmdOrCtrl+A'
            }]
        }, {
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
                click() {
                    PubSub.publish('AboutDialog.visible', {
                        visible : true
                    });
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
    } else {
        template = [{
            label   : 'Edit',
            submenu : [{
                role        : 'undo',
                accelerator : 'CmdOrCtrl+Z'
            }, {
                role        : 'redo',
                accelerator : 'Shift+CmdOrCtrl+Z'
            }, {
                type : 'separator'
            }, {
                role        : 'cut',
                accelerator : 'CmdOrCtrl+X'
            }, {
                role        : 'copy',
                accelerator : 'CmdOrCtrl+C'
            }, {
                role        : 'paste',
                accelerator : 'CmdOrCtrl+V'
            }, {
                type : 'separator'
            }, {
                role        : 'selectall',
                accelerator : 'CmdOrCtrl+A'
            }]
        }, {
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
                click() {
                    PubSub.publish('AboutDialog.visible', {
                        visible : true
                    });
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

function createContextMenu() {
    const template = [{
        role : 'undo'
    }, {
        role : 'redo'
    }, {
        type : 'separator'
    }, {
        role : 'cut'
    }, {
        role : 'copy'
    }, {
        role : 'paste'
    }, {
        type : 'separator'
    }, {
        role : 'selectall'
    }];

    const contextMenu = Menu.buildFromTemplate(template);

    document.body.addEventListener('contextmenu', e => {
        e.preventDefault();
        e.stopPropagation();

        let node = e.target;

        while (node) {
            if (node.nodeName.match() || node.isContentEditable) {
                contextMenu.popup(remote.getCurrentWindow());

                break;
            }

            node = node.parentNode;
        }
    });
}

createWindowMenu();
createContextMenu();

const MuiApp = () => (
    <MuiThemeProvider>
        <App />
    </MuiThemeProvider>
);

ReactDOM.render(<MuiApp />, document.getElementById("app"));
