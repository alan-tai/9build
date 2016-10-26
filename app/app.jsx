'use strict';

import React from 'react';
import { observer } from 'mobx-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
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
import { Grid, Row, Col } from 'react-bootstrap';
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
            this.props.store.messageDialogStore.title   = '';
            this.props.store.messageDialogStore.message = 'Loading…';
            this.props.store.messageDialogStore.visible = true;

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

                this.props.store.messageDialogStore.visible = false;
            }).catch(error => {
                this.props.store.messageDialogStore.title   = 'Error';
                this.props.store.messageDialogStore.message = error.toString();
            });
        }

        this._createVariantToggles = () => {
            const variants = [];

            if (this.props.store.projectId === PROJECT_COOKIE) {
                variants.push(
                    <Toggle
                        key="AppStaging"
                        label="AppStaging"
                        defaultToggled={this.props.store.variantAppStaging[this.props.store.projectId]}
                        style={ToggleStyle}
                        labelStyle={ToggleLabelStyle}
                        onToggle={this._handleChange.bind(this, 'variantAppStaging')} />
                );

                variants.push(
                    <Toggle
                        key="AppRelease"
                        label="AppRelease"
                        defaultToggled={this.props.store.variantAppRelease[this.props.store.projectId]}
                        style={ToggleStyle}
                        labelStyle={ToggleLabelStyle}
                        onToggle={this._handleChange.bind(this, 'variantAppRelease')} />
                );

                variants.push(
                    <Toggle
                        key="ProfDebug"
                        label="ProfDebug"
                        defaultToggled={this.props.store.variantProfDebug[this.props.store.projectId]}
                        labelStyle={ToggleLabelStyle}
                        onToggle={this._handleChange.bind(this, 'variantProfDebug')} />
                );
            } else if (this.props.store.projectId === PROJECT_9GAG) {
                variants.push(
                    <Toggle
                        key="AppJokes"
                        label="AppJokes"
                        defaultToggled={this.props.store.variantAppStaging[this.props.store.projectId]}
                        style={ToggleStyle}
                        labelStyle={ToggleLabelStyle}
                        onToggle={this._handleChange.bind(this, 'variantAppStaging')} />
                );

                variants.push(
                    <Toggle
                        key="AppRelease"
                        label="AppRelease"
                        defaultToggled={this.props.store.variantAppRelease[this.props.store.projectId]}
                        style={ToggleStyle}
                        labelStyle={ToggleLabelStyle}
                        onToggle={this._handleChange.bind(this, 'variantAppRelease')} />
                );

                variants.push(
                    <Toggle
                        key="AppDebug"
                        label="AppDebug"
                        defaultToggled={this.props.store.variantProfDebug[this.props.store.projectId]}
                        labelStyle={ToggleLabelStyle}
                        onToggle={this._handleChange.bind(this, 'variantProfDebug')} />
                );
            }

            return variants;
        }

        this._createApkToggles = () => {
            const apks = [];

            if (this.props.store.projectId === PROJECT_COOKIE) {
                apks.push(
                    <Toggle
                        key="Universal"
                        label="Universal"
                        defaultToggled={this.props.store.apkUniversal[this.props.store.projectId]}
                        style={ToggleStyle}
                        labelStyle={ToggleLabelStyle}
                        onToggle={this._handleChange.bind(this, 'apkUniversal')} />
                );

                apks.push(
                    <Toggle
                        key="ArmV7"
                        label="ARM v7"
                        defaultToggled={this.props.store.apkArmV7[this.props.store.projectId]}
                        style={ToggleStyle}
                        labelStyle={ToggleLabelStyle}
                        onToggle={this._handleChange.bind(this, 'apkArmV7')} />
                );

                apks.push(
                    <Toggle
                        key="ArmV8"
                        label="ARM v8"
                        defaultToggled={this.props.store.apkArmV8[this.props.store.projectId]}
                        style={ToggleStyle}
                        labelStyle={ToggleLabelStyle}
                        onToggle={this._handleChange.bind(this, 'apkArmV8')} />
                );

                apks.push(
                    <Toggle
                        key="Arm"
                        label="ARM"
                        defaultToggled={this.props.store.apkArm[this.props.store.projectId]}
                        style={ToggleStyle}
                        labelStyle={ToggleLabelStyle}
                        onToggle={this._handleChange.bind(this, 'apkArm')} />

                );

                apks.push(
                    <Toggle
                        key="x86"
                        label="x86"
                        defaultToggled={this.props.store.apkX86[this.props.store.projectId]}
                        style={ToggleStyle}
                        labelStyle={ToggleLabelStyle}
                        onToggle={this._handleChange.bind(this, 'apkX86')} />

                );

                apks.push(
                    <Toggle
                        key="x8664"
                        label="x86_64"
                        defaultToggled={this.props.store.apkX8664[this.props.store.projectId]}
                        labelStyle={ToggleLabelStyle}
                        onToggle={this._handleChange.bind(this, 'apkX8664')} />
                );
            } else if (this.props.store.projectId === PROJECT_9GAG) {
                apks.push(
                    <Toggle
                        key="apk"
                        label="Install APK to device"
                        defaultToggled={this.props.store.apkUniversal[this.props.store.projectId]}
                        labelStyle={ToggleLabelStyle}
                        onToggle={this._handleChange.bind(this, 'apkUniversal')} />
                );
            }

            return apks;
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
        const variantToggles = this._createVariantToggles();
        const apkToggles     = this._createApkToggles();

        return (
            <MuiThemeProvider muiTheme={this.props.store.isDarkTheme ? DarkMuiTheme : LightMuiTheme}>
                <div style={{ backgroundColor : this.props.store.isDarkTheme ? DarkTheme.backgroundColor : LightTheme.backgroundColor }}>
                    <Drawer
                        docked={false}
                        open={this.props.store.isDrawerOpened}
                        onRequestChange={open => this.props.store.isDrawerOpened = open }>
                        <List>
                            <Subheader>Projects</Subheader>
                            <ListItem
                                primaryText={PROJECT_NAMES[0]}
                                leftAvatar={<Avatar src={PROJECT_ICONS[PROJECT_COOKIE]} />}
                                style={{ backgroundColor : this.props.store.projectId === PROJECT_COOKIE ? this.props.store.isDarkTheme ? DarkTheme.backgroundColor : LightTheme.selectedColor : this.props.store.isDarkTheme ? DarkTheme.selectedColor : LightTheme.backgroundColor }}
                                onTouchTap={() => this._handleDrawerClick(PROJECT_COOKIE)} />
                            <ListItem
                                primaryText={PROJECT_NAMES[1]}
                                leftAvatar={<Avatar src={PROJECT_ICONS[PROJECT_9GAG]} />}
                                style={{ backgroundColor : this.props.store.projectId === PROJECT_9GAG ? this.props.store.isDarkTheme ? DarkTheme.backgroundColor : LightTheme.selectedColor : this.props.store.isDarkTheme ? DarkTheme.selectedColor : LightTheme.backgroundColor }}
                                onTouchTap={() => this._handleDrawerClick(PROJECT_9GAG)} />
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
                        zDepth={this.props.store.isDarkTheme ? DarkTheme.zDepth : LightTheme.zDepth}
                        onLeftIconButtonTouchTap={() => this.props.store.isDrawerOpened = true } />
                    <Grid fluid>
                        <Row>
                            {/* Project path */}
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <TextField
                                    fullWidth={true}
                                    floatingLabelText="Project path"
                                    value={this.props.store.projectPath[this.props.store.projectId]}
                                    errorText={this.props.store.projectPath[this.props.store.projectId] && this.props.store.projectPath[this.props.store.projectId].length > 0 ? '' : 'Project path is required'}
                                    style={{ marginBottom : Config.margin }}
                                    onChange={() => this._handleChange('projectPath')} />
                            </Col>
                        </Row>
                        <Row>
                            {/* Variants */}
                            <Col
                                lg={6} md={6} sm={6} xs={6}
                                style={{ paddingRight : Config.margin }}>
                                <Card
                                    zDepth={this.props.store.isDarkTheme ? DarkTheme.zDepth : LightTheme.zDepth}
                                    style={{ marginBottom : Config.margin }}>
                                    <CardHeader title="Variants"/>
                                    <CardText>
                                        {variantToggles}
                                    </CardText>
                                </Card>
                            </Col>
                            {/* Build options */}
                            <Col
                                lg={6} md={6} sm={6} xs={6}
                                style={{ paddingLeft : Config.margin }}>
                                <Card
                                    zDepth={this.props.store.isDarkTheme ? DarkTheme.zDepth : LightTheme.zDepth}
                                    style={{ marginBottom : Config.margin }}>
                                    <CardHeader title="Build Options"/>
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
                            </Col>
                            {/* Installation */}
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <Card
                                    zDepth={this.props.store.isDarkTheme ? DarkTheme.zDepth : LightTheme.zDepth}
                                    style={{ marginTop : Config.margin, marginBottom : Config.margin }}>
                                    <CardHeader title="Installation"/>
                                    <CardText>
                                        {apkToggles}
                                        <TextField
                                            floatingLabelText="Device ID (Optional)"
                                            fullWidth={true}
                                            value={this.props.store.deviceId[this.props.store.projectId]}
                                            onChange={() => this._handleChange('deviceId')} />
                                    </CardText>
                                </Card>
                            </Col>
                            {/* Unit test */}
                            <Col
                                lg={6} md={6} sm={6} xs={6}
                                style={{ paddingRight : Config.margin }}>
                                <Card
                                    zDepth={this.props.store.isDarkTheme ? DarkTheme.zDepth : LightTheme.zDepth}
                                    style={{ marginTop : Config.margin, marginBottom : Config.margin }}>
                                    <CardHeader title="Test"/>
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
                            </Col>
                            {/* Local Maven (AAR) */}
                            <Col
                                lg={6} md={6} sm={6} xs={6}
                                style={{paddingLeft: Config.margin}}>
                                <Card
                                    zDepth={this.props.store.isDarkTheme ? DarkTheme.zDepth : LightTheme.zDepth}
                                    style={{ marginTop : Config.margin, marginBottom : Config.margin }}>
                                    <CardHeader title="Local Maven (AAR)"/>
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
                            </Col>
                            {/* Local Maven (JAR) */}
                            <Col
                                lg={6} md={6} sm={6} xs={6}
                                style={{paddingRight: Config.margin}}>
                                <Card
                                    zDepth={this.props.store.isDarkTheme ? DarkTheme.zDepth : LightTheme.zDepth}
                                    style={{ marginTop : Config.margin, marginBottom : Config.margin }}>
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
                            </Col>
                            {/* DAO generation */}
                            <Col
                                lg={6} md={6} sm={6} xs={6}
                                style={{ paddingLeft : Config.margin} }>
                                <Card
                                    zDepth={this.props.store.isDarkTheme ? DarkTheme.zDepth : LightTheme.zDepth}
                                    style={{ marginTop : Config.margin, marginBottom : Config.margin }}>
                                    <CardHeader title="DAO generation"/>
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
                            </Col>
                            {/* Dark theme */}
                            <Col
                                lg={6} md={6} sm={6} xs={6}
                                style={{ paddingRight : Config.margin }}>
                                <Toggle
                                    label="Dark theme"
                                    labelPosition="right"
                                    defaultToggled={this.props.store.isDarkTheme}
                                    style={{ marginTop : Config.margin, paddingBottom : Config.marginDouble }}
                                    labelStyle={ToggleLabelStyle}
                                    onToggle={() => this._handleChange('isDarkTheme')} />
                            </Col>
                        </Row>
                    </Grid>
                    <FloatingActionButton
                        zDepth={this.props.store.isDarkTheme ? DarkTheme.zDepth : LightTheme.zDepth}
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
                </div>
            </MuiThemeProvider>
        );
    }
}

App.propTypes = {
    store : React.PropTypes.instanceOf(AppStore)
};

module.exports = App;
