'use strict';

import React from 'react';
import { observer } from 'mobx-react';
import SimpleDialog from './SimpleDialog.jsx';
import SimpleDialogStore from './SimpleDialogStore';
import Package from '../../../package.json';
import Path from 'path';

const { app } = require('electron').remote;

@observer
export default class AboutDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let logo = '';

        if (this.props.logoPath && this.props.logoPath.length > 0) {
            console.trace('file://' + Path.join(__dirname, this.props.logoPath));
            logo = (
                <img
                    src={'file://' + Path.join(__dirname, this.props.logoPath)}
                    width={this.props.logoWdith}
                    height={this.props.logoHeight} />
            );
        }

        return (
            <SimpleDialog
                store={this.props.store}
                positiveButtonText="Close"
                onPositiveButtonClick={() => this.props.store.visible = false}>
                <div style={{ width : '100%', textAlign : 'center' }}>
                    <div>{logo}</div>
                    <div>Version {app.getVersion()}</div>
                    <div>{Package.author}</div>
                    <div style={{ fontWeight : 300 }}>Copyright &copy; {new Date().getFullYear()}. All rights reserved.</div>
                </div>
            </SimpleDialog>
        );
    }
}

AboutDialog.propTypes = {
    store      : React.PropTypes.instanceOf(SimpleDialogStore).isRequired,
    logoPath   : React.PropTypes.string,
    logoWidth  : React.PropTypes.number,
    logoHeight : React.PropTypes.number
};

module.exports = AboutDialog;
