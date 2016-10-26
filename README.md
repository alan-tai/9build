# 9build

A tool for building [Cookie for Android](https://github.com//9gag/9gag-chat-android) and [9GAG for Android](https://github.com//9gag/9gag-android) based on [Node.js](https://nodejs.org/) + [Electron](http://electron.atom.io/) + [React](https://facebook.github.io/react/) + [MobX](https://mobxjs.github.io/mobx/) + [Material UI](http://www.material-ui.com).

![Screen Shot](https://github.com/alan-tai/9build/raw/master/screenshot.png)

## Download

A pre-built executable for Mac OS X is ready for [download](https://github.com/alan-tai/9build/raw/master/releases/0.2.0/9build.zip).

## Installation

To install from source, you will need `npm` or `yarn`.

### Install with `npm`

Run this command from the app project directory:
```
npm Install
```

### Install with `yarn`

Run this command from the app project directory:
```
yarn
```

### Usage

This app requires [`npm`](https://www.npmjs.com/) to run.

#### From the Command Line

Run this command from the app project directory:
```
npm start
```

#### From the Mac OS X binary

##### macOS

Run this command from the app project directory:
```
npm install -g electron-packager
electron-packager . 9build --platform=darwin --arch=x64 --icon=./res/logo.icns --ignore=.idea --ignore=.gitignore --ignore=yarn.lock --ignore=.DS_Store
```
`9build-darwin-x64/9build.app` will be generated. Double-click to run it.

##### Windows

Run this command from the app project directory:
```
npm install -g electron-packager
electron-packager . 9build --platform=win32 --arch=x64 --icon=./res/logo.ico --ignore=.idea --ignore=.gitignore --ignore=yarn.lock --ignore=.DS_Store
```
`9build-win32-x64` folder will be generated. Double-click `9build-win32-x64\9build.exe` to start the app.
