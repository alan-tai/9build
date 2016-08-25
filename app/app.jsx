'use babel';
'use strict';

import React                          from 'react';
import BaseComponent                  from './base/base-component.jsx';
import MuiThemeProvider               from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme                    from 'material-ui/styles/getMuiTheme';
import Drawer                         from 'material-ui/Drawer';
import { List, ListItem }             from 'material-ui/List';
import Avatar                         from 'material-ui/Avatar';
import Subheader                      from 'material-ui/Subheader';
import AppBar                         from 'material-ui/AppBar';
import IconMenu                       from 'material-ui/IconMenu';
import IconButton                     from 'material-ui/IconButton';
import MenuItem                       from 'material-ui/MenuItem';
import FontIcon                       from 'material-ui/FontIcon';
import MoreVertIcon                   from 'material-ui/svg-icons/navigation/more-vert';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Toggle                         from 'material-ui/Toggle';
import TextField                      from 'material-ui/TextField';
import FloatingActionButton           from 'material-ui/FloatingActionButton';
import { Grid, Row, Col }             from 'react-bootstrap';
import AboutDialog                    from './about-dialog.jsx';
import MessageDialog                  from './message-dialog.jsx';
import ProgressDialog                 from './progress-dialog.jsx';
import Settings                       from './util/settings.js';
import PubSub                         from 'pubsub-js';

import { grey50, grey100, grey300, grey500, grey700, grey800, grey900, lightBlueA700, blueA200 } from 'material-ui/styles/colors';

const PackageInfo              = require('../package.json');
const Config                   = require('../config/config.json');
const LightTheme               = require('../config/theme.light.json');
const DarkTheme                = require('../config/theme.dark.json');
const generateCommandForCookie = require('./util/build-script.cookie.js');
const generateCommandFor9Gag   = require('./util/build-script.9gag.js');
const is                       = require('electron-is');

if (is.dev()) {
    PubSub.immediateExceptions = true;
}

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

export default class App extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            isDrawerOpened    : false,
            isDarkTheme       : false,
            projectId         : PROJECT_COOKIE,
            projectPath       : [ '', '' ],
            variantAppStaging : [ false, false ],
            variantAppRelease : [ false, false ],
            variantProfDebug  : [ false, false ],
            buildClean        : [ false, false ],
            buildFast         : [ false, false ],
            buildLeak         : [ false, false ],
            apkUniversal      : [ false, false ],
            apkArmV7          : [ false, false ],
            apkArmV8          : [ false, false ],
            apkArm            : [ false, false ],
            apkX86            : [ false, false ],
            apkX8664          : [ false, false ],
            deviceId          : [ '', '' ],
            testUnit          : [ false, false ],
            testCoverage      : [ false, false ],
            aarBuild          : [ false, false ],
            aarClean          : [ false, false ],
            jarBuild          : [ false, false ],
            jarClean          : [ false, false ],
            daoBuild          : [ false, false ],
            daoClean          : [ false, false ]
        };
    }

    componentDidMount() {
        this._loadSettings();
    }

    _handleOnDrawerClick(id) {
        this.setState({
            projectId      : id,
            isDrawerOpened : false
        });

        Settings.set('projectId', id);
    }

    _handleOnAboutClick() {
        PubSub.publish('AboutDialog.visible', {
            visible : true
        });
    }

    _handleOnChange(id, target, prop) {
        let values;

        if (id === 'isDarkTheme') {
            values = !this.state.isDarkTheme;

            this.setState({
                isDarkTheme : values
            });
        } else if (id === 'projectPath') {
            values = [ this.state.projectPath[0], this.state.projectPath[1] ];
            values[this.state.projectId] = prop;

            this.setState({
                projectPath : values
            });
        } else if (id === 'variantAppStaging') {
            values = [ this.state.variantAppStaging[0], this.state.variantAppStaging[1] ];
            values[this.state.projectId] = !this.state.variantAppStaging[this.state.projectId];

            this.setState({
                variantAppStaging : values
            });
        } else if (id === 'variantAppRelease') {
            values = [ this.state.variantAppRelease[0], this.state.variantAppRelease[1] ];
            values[this.state.projectId] = !this.state.variantAppRelease[this.state.projectId];

            this.setState({
                variantAppRelease : values
            });
        } else if (id === 'variantProfDebug') {
            values = [ this.state.variantProfDebug[0], this.state.variantProfDebug[1] ];
            values[this.state.projectId] = !this.state.variantProfDebug[this.state.projectId];

            this.setState({
                variantProfDebug : values
            });
        } else if (id === 'buildClean') {
            values = [ this.state.buildClean[0], this.state.buildClean[1] ];
            values[this.state.projectId] = !this.state.buildClean[this.state.projectId];

            this.setState({
                buildClean : values
            });
        } else if (id === 'buildFast') {
            values = [ this.state.buildFast[0], this.state.buildFast[1] ];
            values[this.state.projectId] = !this.state.buildFast[this.state.projectId];

            this.setState({
                buildFast : values
            });
        } else if (id === 'buildLeak') {
            values = [ this.state.buildLeak[0], this.state.buildLeak[1] ];
            values[this.state.projectId] = !this.state.buildLeak[this.state.projectId];

            this.setState({
                buildLeak : values
            });
        } else if (id === 'apkUniversal') {
            values = [ this.state.apkUniversal[0], this.state.apkUniversal[1] ];
            values[this.state.projectId] = !this.state.apkUniversal[this.state.projectId];

            this.setState({
                apkUniversal : values
            });
        } else if (id === 'apkArmV7') {
            values = [ this.state.apkArmV7[0], this.state.apkArmV7[1] ];
            values[this.state.projectId] = !this.state.apkArmV7[this.state.projectId];

            this.setState({
                apkArmV7 : values
            });
        } else if (id === 'apkArmV8') {
            values = [ this.state.apkArmV8[0], this.state.apkArmV8[1] ];
            values[this.state.projectId] = !this.state.apkArmV8[this.state.projectId];

            this.setState({
                apkArmV8 : values
            });
        } else if (id === 'apkArm') {
            values = [ this.state.apkArm[0], this.state.apkArm[1] ];
            values[this.state.projectId] = !this.state.apkArm[this.state.projectId];

            this.setState({
                apkArm : values
            });
        } else if (id === 'apkX86') {
            values = [ this.state.apkX86[0], this.state.apkX86[1] ];
            values[this.state.projectId] = !this.state.apkX86[this.state.projectId];

            this.setState({
                apkX86 : values
            });
        } else if (id === 'apkX8664') {
            values = [ this.state.apkX8664[0], this.state.apkX8664[1] ];
            values[this.state.projectId] = !this.state.apkX8664[this.state.projectId];

            this.setState({
                apkX8664 : values
            });
        } else if (id === 'deviceId') {
            values = [ this.state.deviceId[0], this.state.deviceId[1] ];
            values[this.state.projectId] = prop;

            this.setState({
                deviceId : values
            });
        } else if (id === 'testUnit') {
            values = [ this.state.testUnit[0], this.state.testUnit[1] ];
            values[this.state.projectId] = !this.state.testUnit[this.state.projectId];

            this.setState({
                testUnit : values
            });
        } else if (id === 'testCoverage') {
            values = [ this.state.testCoverage[0], this.state.testCoverage[1] ];
            values[this.state.projectId] = !this.state.testCoverage[this.state.projectId];

            this.setState({
                testCoverage : values
            });
        } else if (id === 'aarBuild') {
            values = [ this.state.aarBuild[0], this.state.aarBuild[1] ];
            values[this.state.projectId] = !this.state.aarBuild[this.state.projectId];

            this.setState({
                aarBuild : values
            });
        } else if (id === 'aarClean') {
            values = [ this.state.aarClean[0], this.state.aarClean[1] ];
            values[this.state.projectId] = !this.state.aarClean[this.state.projectId];

            this.setState({
                aarClean : values
            });
        } else if (id === 'jarBuild') {
            values = [ this.state.jarBuild[0], this.state.jarBuild[1] ];
            values[this.state.projectId] = !this.state.jarBuild[this.state.projectId];

            this.setState({
                jarBuild : values
            });
        } else if (id === 'jarClean') {
            values = [ this.state.jarClean[0], this.state.jarClean[1] ];
            values[this.state.projectId] = !this.state.jarClean[this.state.projectId];

            this.setState({
                jarClean : values
            });
        } else if (id === 'daoBuild') {
            values = [ this.state.daoBuild[0], this.state.daoBuild[1] ];
            values[this.state.projectId] = !this.state.daoBuild[this.state.projectId];

            this.setState({
                daoBuild : values
            });
        } else if (id === 'daoClean') {
            values = [ this.state.daoClean[0], this.state.daoClean[1] ];
            values[this.state.projectId] = !this.state.daoClean[this.state.projectId];

            this.setState({
                daoClean : values
            });
        }

        Settings.set(id, values).catch(error => this._showMessage(error));
    }

    _handleOnBuildClick() {
        if (!this.state.projectPath || !this.state.projectPath[[this.state.projectId]] || this.state.projectPath[this.state.projectId].length === 0) {
            this._showMessage(new Error('Project path is required'));
            return;
        }

        let command = '';

        if (this.state.projectId === PROJECT_COOKIE) {
            command = generateCommandForCookie(this.state);
        } else if (this.state.projectId === PROJECT_9GAG) {
            command = generateCommandFor9Gag(this.state);
        } else {
            this._showMessage(new Error('Unknown project ' + this.state.projectId));
            return;
        }

        console.log(command);

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
    }

    _loadSettings() {
        this._showProgress();

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
            this.setState({
                isDarkTheme       : results[0],
                projectId         : results[1]  ? results[1]  : PROJECT_COOKIE,
                projectPath       : results[2]  ? results[2]  : [ '', '' ],
                variantAppStaging : results[3]  ? results[3]  : [ false, false ],
                variantAppRelease : results[4]  ? results[4]  : [ false, false ],
                variantProfDebug  : results[5]  ? results[5]  : [ false, false ],
                buildClean        : results[6]  ? results[6]  : [ false, false ],
                buildFast         : results[7]  ? results[7]  : [ false, false ],
                buildLeak         : results[8]  ? results[8]  : [ false, false ],
                apkUniversal      : results[9]  ? results[9]  : [ false, false ],
                apkArmV7          : results[10] ? results[10] : [ false, false ],
                apkArmV8          : results[11] ? results[11] : [ false, false ],
                apkArm            : results[12] ? results[12] : [ false, false ],
                apkX86            : results[13] ? results[13] : [ false, false ],
                apkX8664          : results[14] ? results[14] : [ false, false ],
                deviceId          : results[15] ? results[15] : [ '', '' ],
                testUnit          : results[16] ? results[16] : [ false, false ],
                testCoverage      : results[17] ? results[17] : [ false, false ],
                aarBuild          : results[18] ? results[18] : [ false, false ],
                aarClean          : results[19] ? results[19] : [ false, false ],
                jarBuild          : results[20] ? results[20] : [ false, false ],
                jarClean          : results[21] ? results[21] : [ false, false ],
                daoBuild          : results[22] ? results[22] : [ false, false ],
                daoClean          : results[23] ? results[23] : [ false, false ]
            });

            this._hideProgress();
        }).catch(error => {
            this._hideProgress();
            this._showMessage(error);
        });
    }

    _createVariantToggles() {
        let variants = [];

        if (this.state.projectId === PROJECT_COOKIE) {
            variants.push(
                <Toggle
                    key="AppStaging"
                    label="AppStaging"
                    defaultToggled={this.state.variantAppStaging[this.state.projectId]}
                    style={ToggleStyle}
                    labelStyle={ToggleLabelStyle}
                    onToggle={this._handleOnChange.bind(this, 'variantAppStaging')} />
            );

            variants.push(
                <Toggle
                    key="AppRelease"
                    label="AppRelease"
                    defaultToggled={this.state.variantAppRelease[this.state.projectId]}
                    style={ToggleStyle}
                    labelStyle={ToggleLabelStyle}
                    onToggle={this._handleOnChange.bind(this, 'variantAppRelease')} />
            );

            variants.push(
                <Toggle
                    key="ProfDebug"
                    label="ProfDebug"
                    defaultToggled={this.state.variantProfDebug[this.state.projectId]}
                    labelStyle={ToggleLabelStyle}
                    onToggle={this._handleOnChange.bind(this, 'variantProfDebug')} />
            );
        } else if (this.state.projectId === PROJECT_9GAG) {
            variants.push(
                <Toggle
                    key="AppJokes"
                    label="AppJokes"
                    defaultToggled={this.state.variantAppStaging[this.state.projectId]}
                    style={ToggleStyle}
                    labelStyle={ToggleLabelStyle}
                    onToggle={this._handleOnChange.bind(this, 'variantAppStaging')} />
            );

            variants.push(
                <Toggle
                    key="AppRelease"
                    label="AppRelease"
                    defaultToggled={this.state.variantAppRelease[this.state.projectId]}
                    style={ToggleStyle}
                    labelStyle={ToggleLabelStyle}
                    onToggle={this._handleOnChange.bind(this, 'variantAppRelease')} />
            );

            variants.push(
                <Toggle
                    key="AppDebug"
                    label="AppDebug"
                    defaultToggled={this.state.variantProfDebug[this.state.projectId]}
                    labelStyle={ToggleLabelStyle}
                    onToggle={this._handleOnChange.bind(this, 'variantProfDebug')} />
            );
        }

        return variants;
    }

    _createApkToggles() {
        let apks = [];

        if (this.state.projectId === PROJECT_COOKIE) {
            apks.push(
                <Toggle
                    key="Universal"
                    label="Universal"
                    defaultToggled={this.state.apkUniversal[this.state.projectId]}
                    style={ToggleStyle}
                    labelStyle={ToggleLabelStyle}
                    onToggle={this._handleOnChange.bind(this, 'apkUniversal')} />
            );

            apks.push(
                <Toggle
                    key="ArmV7"
                    label="ARM v7"
                    defaultToggled={this.state.apkArmV7[this.state.projectId]}
                    style={ToggleStyle}
                    labelStyle={ToggleLabelStyle}
                    onToggle={this._handleOnChange.bind(this, 'apkArmV7')} />
            );

            apks.push(
                <Toggle
                    key="ArmV8"
                    label="ARM v8"
                    defaultToggled={this.state.apkArmV8[this.state.projectId]}
                    style={ToggleStyle}
                    labelStyle={ToggleLabelStyle}
                    onToggle={this._handleOnChange.bind(this, 'apkArmV8')} />
            );

            apks.push(
                <Toggle
                    key="Arm"
                    label="ARM"
                    defaultToggled={this.state.apkArm[this.state.projectId]}
                    style={ToggleStyle}
                    labelStyle={ToggleLabelStyle}
                    onToggle={this._handleOnChange.bind(this, 'apkArm')} />

            );

            apks.push(
                <Toggle
                    key="x86"
                    label="x86"
                    defaultToggled={this.state.apkX86[this.state.projectId]}
                    style={ToggleStyle}
                    labelStyle={ToggleLabelStyle}
                    onToggle={this._handleOnChange.bind(this, 'apkX86')} />

            );

            apks.push(
                <Toggle
                    key="x8664"
                    label="x86_64"
                    defaultToggled={this.state.apkX8664[this.state.projectId]}
                    labelStyle={ToggleLabelStyle}
                    onToggle={this._handleOnChange.bind(this, 'apkX8664')} />
            );
        } else if (this.state.projectId === PROJECT_9GAG) {
            apks.push(
                <Toggle
                    key="apk"
                    label="Install APK to device"
                    defaultToggled={this.state.apkUniversal[this.state.projectId]}
                    labelStyle={ToggleLabelStyle}
                    onToggle={this._handleOnChange.bind(this, 'apkUniversal')} />
            );
        }

        return apks;
    }

    render() {
        let variantToggles = this._createVariantToggles();
        let apkToggles     = this._createApkToggles();

        return (
            <MuiThemeProvider muiTheme={this.state.isDarkTheme ? DarkMuiTheme : LightMuiTheme}>
                <div style={{ backgroundColor : this.state.isDarkTheme ? DarkTheme.backgroundColor : LightTheme.backgroundColor }}>
                    <Drawer
                        docked={false}
                        open={this.state.isDrawerOpened}
                        onRequestChange={(open) => this.setState({ isDrawerOpened : open })}>
                        <List>
                            <Subheader>Projects</Subheader>
                            <ListItem
                                primaryText={PROJECT_NAMES[0]}
                                leftAvatar={<Avatar src={PROJECT_ICONS[0]} />}
                                style={{ backgroundColor : this.state.projectId === PROJECT_COOKIE ? this.state.isDarkTheme ? DarkTheme.backgroundColor : LightTheme.selectedColor : this.state.isDarkTheme ? DarkTheme.selectedColor : LightTheme.backgroundColor }}
                                onTouchTap={this._handleOnDrawerClick.bind(this, 0)} />
                            <ListItem
                                primaryText={PROJECT_NAMES[1]}
                                leftAvatar={<Avatar src={PROJECT_ICONS[1]} />}
                                style={{ backgroundColor : this.state.projectId === PROJECT_9GAG ? this.state.isDarkTheme ? DarkTheme.backgroundColor : LightTheme.selectedColor : this.state.isDarkTheme ? DarkTheme.selectedColor : LightTheme.backgroundColor }}
                                onTouchTap={this._handleOnDrawerClick.bind(this, 1)} />
                        </List>
                    </Drawer>
                    <AppBar
                        title={PackageInfo.description + ' - ' + PROJECT_NAMES[this.state.projectId]}
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
                                    onTouchTap={this._handleOnAboutClick.bind(this)} />
                            </IconMenu>
                        }
                        zDepth={this.state.isDarkTheme ? DarkTheme.zDepth : LightTheme.zDepth}
                        onLeftIconButtonTouchTap={() => this.setState({ isDrawerOpened : true })} />
                    <Grid fluid>
                        <Row>
                            {/* Project path */}
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <TextField
                                    fullWidth={true}
                                    floatingLabelText="Project path"
                                    value={this.state.projectPath[this.state.projectId]}
                                    errorText={this.state.projectPath[this.state.projectId] && this.state.projectPath[this.state.projectId].length > 0 ? '' : 'Project path is required'}
                                    style={{marginBottom: Config.margin}}
                                    onChange={this._handleOnChange.bind(this, 'projectPath')} />
                            </Col>
                        </Row>
                        <Row>
                            {/* Variants */}
                            <Col
                                lg={6} md={6} sm={6} xs={6}
                                style={{paddingRight: Config.margin}}>
                                <Card
                                    zDepth={this.state.isDarkTheme ? DarkTheme.zDepth : LightTheme.zDepth}
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
                                    zDepth={this.state.isDarkTheme ? DarkTheme.zDepth : LightTheme.zDepth}
                                    style={{ marginBottom : Config.margin }}>
                                    <CardHeader title="Build Options"/>
                                    <CardText>
                                        <Toggle
                                            label="Clean build"
                                            defaultToggled={this.state.buildClean[this.state.projectId]}
                                            style={ToggleStyle}
                                            labelStyle={ToggleLabelStyle}
                                            onToggle={this._handleOnChange.bind(this, 'buildClean')} />
                                        <Toggle
                                            label="Fast build"
                                            defaultToggled={this.state.buildFast[this.state.projectId]}
                                            style={ToggleStyle}
                                            labelStyle={ToggleLabelStyle}
                                            onToggle={this._handleOnChange.bind(this, 'buildFast')} />
                                        <Toggle
                                            label="Detect memory leak"
                                            defaultToggled={this.state.buildLeak[this.state.projectId]}
                                            labelStyle={ToggleLabelStyle}
                                            onToggle={this._handleOnChange.bind(this, 'buildLeak')} />
                                    </CardText>
                                </Card>
                            </Col>
                            {/* Installation */}
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <Card
                                    zDepth={this.state.isDarkTheme ? DarkTheme.zDepth : LightTheme.zDepth}
                                    style={{ marginTop : Config.margin, marginBottom : Config.margin }}>
                                    <CardHeader title="Installation"/>
                                    <CardText>
                                        {apkToggles}
                                        <TextField
                                            floatingLabelText="Device ID (Optional)"
                                            fullWidth={true}
                                            value={this.state.deviceId[this.state.projectId]}
                                            onChange={this._handleOnChange.bind(this, 'deviceId')} />
                                    </CardText>
                                </Card>
                            </Col>
                            {/* Unit test */}
                            <Col
                                lg={6} md={6} sm={6} xs={6}
                                style={{ paddingRight : Config.margin }}>
                                <Card
                                    zDepth={this.state.isDarkTheme ? DarkTheme.zDepth : LightTheme.zDepth}
                                    style={{ marginTop : Config.margin, marginBottom : Config.margin }}>
                                    <CardHeader title="Test"/>
                                    <CardText>
                                        <Toggle
                                            label="Unit test"
                                            defaultToggled={this.state.testUnit[this.state.projectId]}
                                            style={ToggleStyle}
                                            labelStyle={ToggleLabelStyle}
                                            onToggle={this._handleOnChange.bind(this, 'testUnit')} />
                                        <Toggle
                                            label="Coverage report"
                                            defaultToggled={this.state.testCoverage[this.state.projectId]}
                                            disabled={!this.state.testUnit[this.state.projectId] || this.state.projectId !== PROJECT_COOKIE}
                                            labelStyle={ToggleLabelStyle}
                                            onToggle={this._handleOnChange.bind(this, 'testCoverage')} />
                                    </CardText>
                                </Card>
                            </Col>
                            {/* Local Maven (AAR) */}
                            <Col
                                lg={6} md={6} sm={6} xs={6}
                                style={{paddingLeft: Config.margin}}>
                                <Card
                                    zDepth={this.state.isDarkTheme ? DarkTheme.zDepth : LightTheme.zDepth}
                                    style={{ marginTop : Config.margin, marginBottom : Config.margin }}>
                                    <CardHeader title="Local Maven (AAR)"/>
                                    <CardText>
                                        <Toggle
                                            label="Build"
                                            defaultToggled={this.state.aarBuild[this.state.projectId]}
                                            style={ToggleStyle}
                                            labelStyle={ToggleLabelStyle}
                                            onToggle={this._handleOnChange.bind(this, 'aarBuild')} />
                                        <Toggle
                                            label="Clean build"
                                            defaultToggled={this.state.aarClean[this.state.projectId]}
                                            disabled={!this.state.aarBuild[this.state.projectId]}
                                            labelStyle={ToggleLabelStyle}
                                            onToggle={this._handleOnChange.bind(this, 'aarClean')} />
                                    </CardText>
                                </Card>
                            </Col>
                            {/* Local Maven (JAR) */}
                            <Col
                                lg={6} md={6} sm={6} xs={6}
                                style={{paddingRight: Config.margin}}>
                                <Card
                                    zDepth={this.state.isDarkTheme ? DarkTheme.zDepth : LightTheme.zDepth}
                                    style={{ marginTop : Config.margin, marginBottom : Config.margin }}>
                                    <CardHeader title="Local Maven (JAR)"/>
                                    <CardText>
                                        <Toggle
                                            label="Build"
                                            defaultToggled={this.state.jarBuild[this.state.projectId]}
                                            style={ToggleStyle}
                                            labelStyle={ToggleLabelStyle}
                                            onToggle={this._handleOnChange.bind(this, 'jarBuild')} />
                                        <Toggle
                                            label="Clean build"
                                            defaultToggled={this.state.jarClean[this.state.projectId]}
                                            disabled={!this.state.jarBuild[this.state.projectId]}
                                            labelStyle={ToggleLabelStyle}
                                            onToggle={this._handleOnChange.bind(this, 'jarClean')} />
                                    </CardText>
                                </Card>
                            </Col>
                            {/* DAO generation */}
                            <Col
                                lg={6} md={6} sm={6} xs={6}
                                style={{paddingLeft: Config.margin}}>
                                <Card
                                    zDepth={this.state.isDarkTheme ? DarkTheme.zDepth : LightTheme.zDepth}
                                    style={{ marginTop : Config.margin, marginBottom : Config.margin }}>
                                    <CardHeader title="DAO generation"/>
                                    <CardText>
                                        <Toggle
                                            label="Build"
                                            defaultToggled={this.state.daoBuild[this.state.projectId]}
                                            disabled={this.state.projectId !== PROJECT_COOKIE}
                                            style={ToggleStyle}
                                            labelStyle={ToggleLabelStyle}
                                            onToggle={this._handleOnChange.bind(this, 'daoBuild')} />
                                        <Toggle
                                            label="Clean build"
                                            defaultToggled={this.state.daoClean[this.state.projectId]}
                                            disabled={!this.state.daoBuild[this.state.projectId] || this.state.projectId !== PROJECT_COOKIE}
                                            labelStyle={ToggleLabelStyle}
                                            onToggle={this._handleOnChange.bind(this, 'daoClean')} />
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
                                    defaultToggled={this.state.isDarkTheme}
                                    style={{ marginTop : Config.margin, paddingBottom : Config.marginDouble }}
                                    labelStyle={ToggleLabelStyle}
                                    onToggle={this._handleOnChange.bind(this, 'isDarkTheme')} />
                            </Col>
                        </Row>
                    </Grid>
                    <FloatingActionButton
                        zDepth={this.state.isDarkTheme ? DarkTheme.zDepth : LightTheme.zDepth}
                        style={{ position : 'fixed', right : Config.marginDouble, bottom : Config.marginDouble }}
                        onTouchTap={this._handleOnBuildClick.bind(this)}>
                        <FontIcon className="fa fa-android" />
                    </FloatingActionButton>
                    <AboutDialog
                        title={PackageInfo.description}
                        logoPath="../res/logo.png"
                        logoWidth={158}
                        logoHeight={86}
                        positiveButton="Close"
                        eventScope="AboutDialog" />
                    <MessageDialog
                        positiveButton="Close"
                        eventScope="MessageDialog" />
                    <ProgressDialog eventScope="ProgressDialog" />
                </div>
            </MuiThemeProvider>
        );
    }
}
