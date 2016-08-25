'use babel';
'use strict';

import React      from 'react';
import BaseDialog from './base/base-dialog.jsx';
import PubSub     from 'pubsub-js';

const Path        = require('path');
const PackageInfo = require('../package.json');
const is          = require('electron-is');

if (is.dev()) {
    PubSub.immediateExceptions = true;
}

export default class AboutDialog extends BaseDialog {
    constructor(props) {
        super(props);
    }

    getContent() {
        let logo = '';

        if (this.props.logoPath && this.props.logoPath.length > 0) {
            logo = <img src={'file://' + Path.join(__dirname, this.props.logoPath)} width={this.props.logoWdith} height={this.props.logoHeight} />;
        }

        return (
            <div style={{ width : '100%', textAlign : 'center' }}>
                {logo}<br />
                Version {PackageInfo.version}<br />
                Copyright {new Date().getFullYear()} {PackageInfo.author}<br />
                All rights reserved
            </div>
        );
    }
}

AboutDialog.propTypes = {
    title      : React.PropTypes.string,
    logoPath   : React.PropTypes.string,
    logoWidth  : React.PropTypes.number,
    logoHeight : React.PropTypes.number,
    visible    : React.PropTypes.bool,
    eventScope : React.PropTypes.string.isRequired,
};

AboutDialog.defaultProps = {
    title   : '',
    visible : false
};

module.exports = AboutDialog;
