# 9build

A tool for building [Cookie for Android](https://github.com//9gag/9gag-chat-android) and [9GAG for Android](https://github.com//9gag/9gag-android) based on [Node.js](https://nodejs.org/) + [Electron](http://electron.atom.io/) + [React](https://facebook.github.io/react/) + [Material UI](http://www.material-ui.com).

![Screen Shot](https://github.com/alan-tai/9build/raw/master/screenshot.png)

## Download

A pre-built executable for Mac OS X is ready for [download](https://github.com/alan-tai/9build/raw/master/releases/0.1.0/9build.zip).

## Installation

This app requires [Node.js](https://nodejs.org) 4.0 or higher to run.
```
npm Install
sudo npm install -g electron
```

### Usage

#### From the Command Line

Run this command from the app project directory:
```
npm start
```

#### From the Mac OS X binary

Run this command from the app project directory:
```
sudo npm install -g electron-packager
electron-packager . 9build --platform=darwin --arch=x64 --icon=./res/logo.icns --prune
```
`9build-darwin-x64/9build.app` will be generated. Double-click to run it.