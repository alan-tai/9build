'use strict';

import React from 'react';
import { observer } from 'mobx-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Drawer from 'material-ui/Drawer';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem  from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { GridList, GridTile } from 'material-ui/GridList';
import AboutDialog from './components/dialogs/AboutDialog.jsx';
import MessageDialog from './components/dialogs/MessageDialog.jsx';
import AppStore from './AppStore';
import Settings from './util/Settings.js';
import Config from '../config/config.json';
import LightTheme from '../config/theme.light.json';
import DarkTheme from '../config/theme.dark.json';
import PubSub from 'pubsub-js';
import is from 'electron-is';
import { grey50, grey100, grey300, grey500, grey700, grey800, grey900, lightBlueA700, blueA200 } from 'material-ui/styles/colors';
import { generateCommandForCookie } from './util/build-script.cookie.js';
import { generateCommandFor9Gag } from './util/build-script.9gag.js';

if (is.dev()) PubSub.immediateExceptions = true;

const { app } = require('electron').remote;

const LightMuiTheme = getMuiTheme({
    palette : {
        primary1Color      : blueA200,
        textColor          : grey900,
        alternateTextColor : grey50,
        canvasColor        : grey50
    }
});

const DarkMuiTheme = getMuiTheme({
    palette : {
        primary1Color      : lightBlueA700,
        primary3Color      : grey700,
        accent2Color       : grey300,
        textColor          : grey100,
        alternateTextColor : grey100,
        canvasColor        : grey800,
        disabledColor      : grey500
    }
});

const ToggleStyle      = { marginBottom : Config.marginDouble };
const ToggleStyleLast  = { marginBottom : 0 };
const ToggleLabelStyle = { fontWeight : 300 };

const PROJECT_COOKIE = 0;
const PROJECT_9GAG   = 1;
const PROJECT_NAMES  = [ 'COOKIE', '9GAG' ];
const PROJECT_ICONS  = [ '../res/ic_cookie.png', '../res/ic_9gag.png' ]

@observer
export default class App extends React.Component {
    constructor(props) {
        super(props);

        this._subscriptions = [];

        this._handleDrawerClick = id => {
            this.props.store.projectId      = id;
            this.props.store.isDrawerOpened = false;

            Settings.set('projectId', id);
        };

        this._handleAboutClick = () => {
            this.props.store.aboutDialogStore.visible = true;
        };

        this._handleChange = (id, target, prop) => {
            let values;

            if (id === 'isDarkTheme') {
                values = !this.props.store.isDarkTheme;

                this.props.store.isDarkTheme = values;
            } else if (id === 'projectPath') {
                values = [ this.props.store.projectPath[0], this.props.store.projectPath[1] ];
                values[this.props.store.projectId] = prop;

                this.props.store.projectPath = values;
            } else if (id === 'variantAppStaging') {
                values = [ this.props.store.variantAppStaging[0], this.props.store.variantAppStaging[1] ];
                values[this.props.store.projectId] = !this.props.store.variantAppStaging[this.props.store.projectId];

                this.props.store.variantAppStaging = values;
            } else if (id === 'variantAppRelease') {
                values = [ this.props.store.variantAppRelease[0], this.props.store.variantAppRelease[1] ];
                values[this.props.store.projectId] = !this.props.store.variantAppRelease[this.props.store.projectId];

                this.props.store.variantAppRelease = values;
            } else if (id === 'variantProfDebug') {
                values = [ this.props.store.variantProfDebug[0], this.props.store.variantProfDebug[1] ];
                values[this.props.store.projectId] = !this.props.store.variantProfDebug[this.props.store.projectId];

                this.props.store.variantProfDebug = values;
            } else if (id === 'buildClean') {
                values = [ this.props.store.buildClean[0], this.props.store.buildClean[1] ];
                values[this.props.store.projectId] = !this.props.store.buildClean[this.props.store.projectId];

                this.props.store.buildClean = values;
            } else if (id === 'buildFast') {
                values = [ this.props.store.buildFast[0], this.props.store.buildFast[1] ];
                values[this.props.store.projectId] = !this.props.store.buildFast[this.props.store.projectId];

                this.props.store.buildFast = values;
            } else if (id === 'buildLeak') {
                values = [ this.props.store.buildLeak[0], this.props.store.buildLeak[1] ];
                values[this.props.store.projectId] = !this.props.store.buildLeak[this.props.store.projectId];

                this.props.store.buildLeak = values;
            } else if (id === 'apkUniversal') {
                values = [ this.props.store.apkUniversal[0], this.props.store.apkUniversal[1] ];
                values[this.props.store.projectId] = !this.props.store.apkUniversal[this.props.store.projectId];

                this.props.store.apkUniversal = values;
            } else if (id === 'apkArmV7') {
                values = [ this.props.store.apkArmV7[0], this.props.store.apkArmV7[1] ];
                values[this.props.store.projectId] = !this.props.store.apkArmV7[this.props.store.projectId];

                this.props.store.apkArmV7 = values;
            } else if (id === 'apkArmV8') {
                values = [ this.props.store.apkArmV8[0], this.props.store.apkArmV8[1] ];
                values[this.props.store.projectId] = !this.props.store.apkArmV8[this.props.store.projectId];

                this.props.store.apkArmV8 = values;
            } else if (id === 'apkArm') {
                values = [ this.props.store.apkArm[0], this.props.store.apkArm[1] ];
                values[this.props.store.projectId] = !this.props.store.apkArm[this.props.store.projectId];

                this.props.store.apkArm = values;
            } else if (id === 'apkX86') {
                values = [ this.props.store.apkX86[0], this.props.store.apkX86[1] ];
                values[this.props.store.projectId] = !this.props.store.apkX86[this.props.store.projectId];

                this.props.store.apkX86 = values;
            } else if (id === 'apkX8664') {
                values = [ this.props.store.apkX8664[0], this.props.store.apkX8664[1] ];
                values[this.props.store.projectId] = !this.props.store.apkX8664[this.props.store.projectId];

                this.props.store.apkX8664 = values;
            } else if (id === 'deviceId') {
                values = [ this.props.store.deviceId[0], this.props.store.deviceId[1] ];
                values[this.props.store.projectId] = prop;

                this.props.store.deviceId = values;
            } else if (id === 'testUnit') {
                values = [ this.props.store.testUnit[0], this.props.store.testUnit[1] ];
                values[this.props.store.projectId] = !this.props.store.testUnit[this.props.store.projectId];

                this.props.store.testUnit = values;
            } else if (id === 'testCoverage') {
                values = [ this.props.store.testCoverage[0], this.props.store.testCoverage[1] ];
                values[this.props.store.projectId] = !this.props.store.testCoverage[this.props.store.projectId];

                this.props.store.testCoverage = values;
            } else if (id === 'aarBuild') {
                values = [ this.props.store.aarBuild[0], this.props.store.aarBuild[1] ];
                values[this.props.store.projectId] = !this.props.store.aarBuild[this.props.store.projectId];

                this.props.store.aarBuild = values;
            } else if (id === 'aarClean') {
                values = [ this.props.store.aarClean[0], this.props.store.aarClean[1] ];
                values[this.props.store.projectId] = !this.props.store.aarClean[this.props.store.projectId];

                this.props.store.aarClean = values;
            } else if (id === 'jarBuild') {
                values = [ this.props.store.jarBuild[0], this.props.store.jarBuild[1] ];
                values[this.props.store.projectId] = !this.props.store.jarBuild[this.props.store.projectId];

                this.props.store.jarBuild = values;
            } else if (id === 'jarClean') {
                values = [ this.props.store.jarClean[0], this.props.store.jarClean[1] ];
                values[this.props.store.projectId] = !this.props.store.jarClean[this.props.store.projectId];

                this.props.store.jarClean = values;
            } else if (id === 'daoBuild') {
                values = [ this.props.store.daoBuild[0], this.props.store.daoBuild[1] ];
                values[this.props.store.projectId] = !this.props.store.daoBuild[this.props.store.projectId];

                this.props.store.daoBuild = values;
            } else if (id === 'daoClean') {
                values = [ this.props.store.daoClean[0], this.props.store.daoClean[1] ];
                values[this.props.store.projectId] = !this.props.store.daoClean[this.props.store.projectId];

                this.props.store.daoClean = values;
            }

            Settings.set(id, values).catch(error => {
                this.props.store.messageDialogStore.message = error.toString();
                this.props.store.messageDialogStore.visible = true;
            });
        };

        this._handleBuildClick = () => {
            if (!this.props.store.projectPath || !this.props.store.projectPath[[this.props.store.projectId]] || this.props.store.projectPath[this.props.store.projectId].length === 0) {
                this.props.store.messageDialogStore.message = 'Project path is required';
                this.props.store.messageDialogStore.visible = true;

                return;
            }

            let command = '';

            if (this.props.store.projectId === PROJECT_COOKIE) {
                command = generateCommandForCookie(this.props.store);
            } else if (this.props.store.projectId === PROJECT_9GAG) {
                command = generateCommandFor9Gag(this.props.store);
            } else {
                this.props.store.messageDialogStore.message = 'Unknown project ' + this.props.store.projectId;
                this.props.store.messageDialogStore.visible = true;

                return;
            }

            console.trace(command);

            if (command.length > 0) {
                let script =
                    'tell application "Terminal"\n' +
                    '    activate\n' +
                    '    tell application "System Events" to keystroke "' + command + '"\n' +
                    '    tell application "System Events" to key code 36\n' +
                    'end tell';

                require('child_process')
                    .exec('osascript -e \'' + script + '\'')
                    .unref();
            }
        };

        this._loadSettings = () => {
            this.props.store.loadingIndicatorStatus = 'loading';

            Promise.all([
                Settings.get('isDarkTheme'),
                Settings.get('projectId'),
                Settings.get('projectPath'),
                Settings.get('variantAppStaging'),
                Settings.get('variantAppRelease'),
                Settings.get('variantProfDebug'),
                Settings.get('buildClean'),
                Settings.get('buildFast'),
                Settings.get('buildLeak'),
                Settings.get('apkUniversal'),
                Settings.get('apkArmV7'),
                Settings.get('apkArmV8'),
                Settings.get('apkArm'),
                Settings.get('apkX86'),
                Settings.get('apkX8664'),
                Settings.get('deviceId'),
                Settings.get('testUnit'),
                Settings.get('testCoverage'),
                Settings.get('aarBuild'),
                Settings.get('aarClean'),
                Settings.get('jarBuild'),
                Settings.get('jarClean'),
                Settings.get('daoBuild'),
                Settings.get('daoClean')
            ]).then(results => {
                this.props.store.isDarkTheme       = results[0];
                this.props.store.projectId         = results[1]  ? results[1]  : PROJECT_COOKIE;
                this.props.store.projectPath       = results[2]  ? results[2]  : [ '', '' ];
                this.props.store.variantAppStaging = results[3]  ? results[3]  : [ false, false ];
                this.props.store.variantAppRelease = results[4]  ? results[4]  : [ false, false ];
                this.props.store.variantProfDebug  = results[5]  ? results[5]  : [ false, false ];
                this.props.store.buildClean        = results[6]  ? results[6]  : [ false, false ];
                this.props.store.buildFast         = results[7]  ? results[7]  : [ false, false ];
                this.props.store.buildLeak         = results[8]  ? results[8]  : [ false, false ];
                this.props.store.apkUniversal      = results[9]  ? results[9]  : [ false, false ];
                this.props.store.apkArmV7          = results[10] ? results[10] : [ false, false ];
                this.props.store.apkArmV8          = results[11] ? results[11] : [ false, false ];
                this.props.store.apkArm            = results[12] ? results[12] : [ false, false ];
                this.props.store.apkX86            = results[13] ? results[13] : [ false, false ];
                this.props.store.apkX8664          = results[14] ? results[14] : [ false, false ];
                this.props.store.deviceId          = results[15] ? results[15] : [ '', '' ];
                this.props.store.testUnit          = results[16] ? results[16] : [ false, false ];
                this.props.store.testCoverage      = results[17] ? results[17] : [ false, false ];
                this.props.store.aarBuild          = results[18] ? results[18] : [ false, false ];
                this.props.store.aarClean          = results[19] ? results[19] : [ false, false ];
                this.props.store.jarBuild          = results[20] ? results[20] : [ false, false ];
                this.props.store.jarClean          = results[21] ? results[21] : [ false, false ];
                this.props.store.daoBuild          = results[22] ? results[22] : [ false, false ];
                this.props.store.daoClean          = results[23] ? results[23] : [ false, false ];

                this.props.store.loadingIndicatorStatus = 'hide';
            }).catch(error => {
                this.props.store.messageDialogStore.message = error.toString();
                this.props.store.messageDialogStore.visible = true;
            });
        }
    }

    componentDidMount() {
        this._subscriptions.push(PubSub.subscribe('AboutDialog.visible', () => this._handleAboutClick()));

        this._loadSettings();
    }

    componentWillUnmount() {
        this._subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    render() {
        const renderVariantToggle = (key, label, defaultToggled, isLast) => {
            return (
                <Toggle
                    key={key}
                    label={label}
                    defaultToggled={defaultToggled}
                    style={isLast ? ToggleStyleLast : ToggleStyle}
                    labelStyle={ToggleLabelStyle}
                    onToggle={(target, prop) => this._handleChange(key, target, prop)} />
            );
        };

        const createVariantToggles = () => {
            const variants = [];

            if (this.props.store.projectId === PROJECT_COOKIE) {
                variants.push(renderVariantToggle('variantAppStaging', 'AppStaging', this.props.store.variantAppStaging[this.props.store.projectId]));
                variants.push(renderVariantToggle('variantAppRelease', 'AppRelease', this.props.store.variantAppRelease[this.props.store.projectId]));
                variants.push(renderVariantToggle('variantProfDebug',  'ProfDebug',  this.props.store.variantProfDebug[this.props.store.projectId], true));
            } else if (this.props.store.projectId === PROJECT_9GAG) {
                variants.push(renderVariantToggle('variantAppStaging', 'AppJokes',   this.props.store.variantAppStaging[this.props.store.projectId]));
                variants.push(renderVariantToggle('variantAppRelease', 'AppRelease', this.props.store.variantAppRelease[this.props.store.projectId]));
                variants.push(renderVariantToggle('variantProfDebug',  'AppDebug',  this.props.store.variantProfDebug[this.props.store.projectId], true));
            }

            return variants;
        };

        const renderApkToggle = (key, label, defaultToggled, isLast) => {
            return (
                <Toggle
                    key={key}
                    label={label}
                    defaultToggled={defaultToggled}
                    style={isLast ? ToggleStyleLast : ToggleStyle}
                    labelStyle={ToggleLabelStyle}
                    onToggle={(target, prop) => this._handleChange(key, target, prop)} />
            );
        };

        const createApkToggles = () => {
            const apks = [];

            if (this.props.store.projectId === PROJECT_COOKIE) {
                apks.push(renderApkToggle('apkUniversal', 'Universal', this.props.store.apkUniversal[this.props.store.projectId]));
                apks.push(renderApkToggle('apkArmV7',     'ARM v7',    this.props.store.apkArmV7[this.props.store.projectId]));
                apks.push(renderApkToggle('apkArmV8',     'ARM v8',    this.props.store.apkArmV8[this.props.store.projectId]));
                apks.push(renderApkToggle('apkArm',       'ARM',       this.props.store.apkArm[this.props.store.projectId]));
                apks.push(renderApkToggle('apkX86',       'x86',       this.props.store.apkX86[this.props.store.projectId]));
                apks.push(renderApkToggle('apkX8664',     'x86_64',    this.props.store.apkX8664[this.props.store.projectId], true));
            } else if (this.props.store.projectId === PROJECT_9GAG) {
                apks.push(renderApkToggle('apkUniversal', 'Install APK to device', this.props.store.apkUniversal[this.props.store.projectId], true));
            }

            return apks;
        };

        const renderListItem = projectId => {
            return (
                <ListItem
                    primaryText={PROJECT_NAMES[projectId]}
                    leftAvatar={<Avatar src={PROJECT_ICONS[projectId]} />}
                    style={{ backgroundColor : this.props.store.projectId === projectId ? this.props.store.isDarkTheme ? DarkTheme.backgroundColor : LightTheme.selectedColor : this.props.store.isDarkTheme ? DarkTheme.selectedColor : LightTheme.backgroundColor }}
                    onTouchTap={() => this._handleDrawerClick(projectId)} />
            );
        };

        return (
            <MuiThemeProvider muiTheme={this.props.store.isDarkTheme ? DarkMuiTheme : LightMuiTheme}>
                <div style={{ backgroundColor : this.props.store.isDarkTheme ? DarkTheme.backgroundColor : LightTheme.backgroundColor }}>
                    <Drawer
                        docked={false}
                        open={this.props.store.isDrawerOpened}
                        onRequestChange={open => this.props.store.isDrawerOpened = open }>
                        <List>
                            <Subheader>Projects</Subheader>
                            {renderListItem(PROJECT_9GAG)}
                            {renderListItem(PROJECT_COOKIE)}
                        </List>
                    </Drawer>
                    <AppBar
                        title={app.getName() + ' - ' + PROJECT_NAMES[this.props.store.projectId]}
                        iconElementRight={
                            <IconMenu
                                targetOrigin={{ horizontal : 'right', vertical : 'top' }}
                                anchorOrigin={{ horizontal : 'right', vertical : 'top' }}
                                iconButtonElement={
                                    <IconButton touch={true}>
                                        <MoreVertIcon />
                                    </IconButton>
                                }>
                                <MenuItem
                                    primaryText="About"
                                    onTouchTap={() => this._handleAboutClick()} />
                            </IconMenu>
                        }
                        onLeftIconButtonTouchTap={() => this.props.store.isDrawerOpened = true } />
                    <GridList
                        cols={2}
                        cellHeight={1}>
                        {/* Project path */}
                        <GridTile
                            cols={2}
                            rows={72}
                            style={{ paddingLeft : Config.marginDouble, paddingRight : Config.marginDouble, paddingTop : 0, paddingBottom : 0 }}>
                            <TextField
                                fullWidth={true}
                                floatingLabelText="Project path"
                                value={this.props.store.projectPath[this.props.store.projectId]}
                                errorText={this.props.store.projectPath[this.props.store.projectId] && this.props.store.projectPath[this.props.store.projectId].length > 0 ? '' : 'Project path is required'}
                                style={{ marginBottom : Config.margin }}
                                onChange={() => this._handleChange('projectPath')} />
                        </GridTile>
                        {/* Variants */}
                        <GridTile
                            cols={1}
                            rows={228}
                            style={{ paddingLeft : Config.marginDouble, paddingRight : Config.margin, paddingTop : Config.margin, marginBottom : Config.margin }}>
                            <Card style={{ marginBottom : Config.margin }}>
                                <CardHeader title="Variants" />
                                <CardText>
                                    {createVariantToggles()}
                                </CardText>
                            </Card>
                        </GridTile>
                        {/* Build options */}
                        <GridTile
                            cols={1}
                            rows={228}
                            style={{ paddingLeft : Config.margin, paddingRight : Config.marginDouble, paddingTop : Config.margin, marginBottom : Config.margin }}>
                            <Card style={{ marginBottom : Config.margin }}>
                                <CardHeader title="Build Options" />
                                <CardText>
                                    <Toggle
                                        label="Clean build"
                                        defaultToggled={this.props.store.buildClean[this.props.store.projectId]}
                                        style={ToggleStyle}
                                        labelStyle={ToggleLabelStyle}
                                        onToggle={() => this._handleChange('buildClean')} />
                                    <Toggle
                                        label="Fast build"
                                        defaultToggled={this.props.store.buildFast[this.props.store.projectId]}
                                        style={ToggleStyle}
                                        labelStyle={ToggleLabelStyle}
                                        onToggle={() => this._handleChange('buildFast')} />
                                    <Toggle
                                        label="Detect memory leak"
                                        defaultToggled={this.props.store.buildLeak[this.props.store.projectId]}
                                        labelStyle={ToggleLabelStyle}
                                        onToggle={() => this._handleChange('buildLeak')} />
                                </CardText>
                            </Card>
                        </GridTile>
                        {/* Installation */}
                        <GridTile
                            cols={2}
                            rows={this.props.store.projectId === PROJECT_9GAG ? 204 : 434}
                            style={{ paddingLeft : Config.marginDouble, paddingRight : Config.marginDouble, paddingTop : 0, paddingBottom : 0 }}>
                            <Card style={{ marginTop : Config.margin, marginBottom : Config.margin }}>
                                <CardHeader title="Installation" />
                                <CardText>
                                    {createApkToggles()}
                                    <TextField
                                        floatingLabelText="Device ID (Optional)"
                                        fullWidth={true}
                                        value={this.props.store.deviceId[this.props.store.projectId]}
                                        onChange={() => this._handleChange('deviceId')} />
                                </CardText>
                            </Card>
                        </GridTile>
                        {/* Unit test */}
                        <GridTile
                            cols={1}
                            rows={188}
                            style={{ paddingLeft : Config.marginDouble, paddingRight : Config.margin, paddingTop : Config.margin, marginBottom : Config.margin }}>
                            <Card style={{ marginTop : Config.margin, marginBottom : Config.margin }}>
                                <CardHeader title="Test" />
                                <CardText>
                                    <Toggle
                                        label="Unit test"
                                        defaultToggled={this.props.store.testUnit[this.props.store.projectId]}
                                        style={ToggleStyle}
                                        labelStyle={ToggleLabelStyle}
                                        onToggle={() => this._handleChange('testUnit')} />
                                    <Toggle
                                        label="Coverage report"
                                        defaultToggled={this.props.store.testCoverage[this.props.store.projectId]}
                                        disabled={!this.props.store.testUnit[this.props.store.projectId] || this.props.store.projectId !== PROJECT_COOKIE}
                                        labelStyle={ToggleLabelStyle}
                                        onToggle={() => this._handleChange('testCoverage')} />
                                </CardText>
                            </Card>
                        </GridTile>
                        {/* Local Maven (AAR) */}
                        <GridTile
                            cols={1}
                            rows={188}
                            style={{ paddingLeft : Config.margin, paddingRight : Config.marginDouble, paddingTop : Config.margin, marginBottom : Config.margin }}>
                            <Card style={{ marginTop : Config.margin, marginBottom : Config.margin }}>
                                <CardHeader title="Local Maven (AAR)" />
                                <CardText>
                                    <Toggle
                                        label="Build"
                                        defaultToggled={this.props.store.aarBuild[this.props.store.projectId]}
                                        style={ToggleStyle}
                                        labelStyle={ToggleLabelStyle}
                                        onToggle={() => this._handleChange('aarBuild')} />
                                    <Toggle
                                        label="Clean build"
                                        defaultToggled={this.props.store.aarClean[this.props.store.projectId]}
                                        disabled={!this.props.store.aarBuild[this.props.store.projectId]}
                                        labelStyle={ToggleLabelStyle}
                                        onToggle={() => this._handleChange('aarClean')} />
                                </CardText>
                            </Card>
                        </GridTile>
                        {/* Local Maven (JAR) */}
                        <GridTile
                            cols={1}
                            rows={188}
                            style={{ paddingLeft : Config.marginDouble, paddingRight : Config.margin, paddingTop : Config.margin, marginBottom : Config.margin }}>
                            <Card style={{ marginTop : Config.margin, marginBottom : Config.margin }}>
                                <CardHeader title="Local Maven (JAR)" />
                                <CardText>
                                    <Toggle
                                        label="Build"
                                        defaultToggled={this.props.store.jarBuild[this.props.store.projectId]}
                                        style={ToggleStyle}
                                        labelStyle={ToggleLabelStyle}
                                        onToggle={() => this._handleChange('jarBuild')} />
                                    <Toggle
                                        label="Clean build"
                                        defaultToggled={this.props.store.jarClean[this.props.store.projectId]}
                                        disabled={!this.props.store.jarBuild[this.props.store.projectId]}
                                        labelStyle={ToggleLabelStyle}
                                        onToggle={() => this._handleChange('jarClean')} />
                                </CardText>
                            </Card>
                        </GridTile>
                        {/* DAO generation */}
                        <GridTile
                            cols={1}
                            rows={188}
                            style={{ paddingLeft : Config.margin, paddingRight : Config.marginDouble, paddingTop : Config.margin, marginBottom : Config.margin }}>
                            <Card style={{ marginTop : Config.margin, marginBottom : Config.margin }}>
                                <CardHeader title="DAO generation" />
                                <CardText>
                                    <Toggle
                                        label="Build"
                                        defaultToggled={this.props.store.daoBuild[this.props.store.projectId]}
                                        disabled={this.props.store.projectId !== PROJECT_COOKIE}
                                        style={ToggleStyle}
                                        labelStyle={ToggleLabelStyle}
                                        onToggle={() => this._handleChange('daoBuild')} />
                                    <Toggle
                                        label="Clean build"
                                        defaultToggled={this.props.store.daoClean[this.props.store.projectId]}
                                        disabled={!this.props.store.daoBuild[this.props.store.projectId] || this.props.store.projectId !== PROJECT_COOKIE}
                                        labelStyle={ToggleLabelStyle}
                                        onToggle={() => this._handleChange('daoClean')} />
                                </CardText>
                            </Card>
                        </GridTile>
                        {/* Dark theme */}
                        <GridTile
                            cols={2}
                            rows={48}
                            style={{ paddingLeft : Config.marginDouble, paddingRight : Config.marginDouble, paddingTop : 0, paddingBottom : 0 }}>
                            <Toggle
                                label="Dark theme"
                                labelPosition="right"
                                defaultToggled={this.props.store.isDarkTheme}
                                style={{ marginTop : Config.margin, paddingBottom : Config.marginDouble }}
                                labelStyle={ToggleLabelStyle}
                                onToggle={() => this._handleChange('isDarkTheme')} />
                        </GridTile>
                    </GridList>
                    <FloatingActionButton
                        style={{ position : 'fixed', right : Config.marginDouble, bottom : Config.marginDouble }}
                        onTouchTap={() => this._handleBuildClick()}>
                        <FontIcon className="fa fa-android" />
                    </FloatingActionButton>
                    <AboutDialog
                        store={this.props.store.aboutDialogStore}
                        logoPath="../../../res/logo.png"
                        logoWidth={158}
                        logoHeight={86} />
                    <MessageDialog store={this.props.store.messageDialogStore} />
                    <RefreshIndicator
                        size={72}
                        left={248}
                        top={193}
                        status={this.props.store.loadingIndicatorStatus} />
                </div>
            </MuiThemeProvider>
        );
    }
}

App.propTypes = {
    store : React.PropTypes.instanceOf(AppStore)
};

module.exports = App;
