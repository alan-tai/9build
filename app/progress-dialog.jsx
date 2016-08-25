'use babel';
'use strict';

import React            from 'react';
import BaseDialog       from './base/base-dialog.jsx';
import CircularProgress from 'material-ui/CircularProgress';
import PubSub           from 'pubsub-js';

const is = require('electron-is');

if (is.dev()) {
    PubSub.immediateExceptions = true;
}

export default class ProgressDialog extends BaseDialog {
    constructor(props) {
        super(props);

        this.state.contentStyle = { width : 200 };
    }

    getContent() {
        return (
            <div style={{ width : '100%', textAlign : 'center' }}>
                <CircularProgress />
            </div>
        );
    }
}

ProgressDialog.propTypes = {
    title      : React.PropTypes.string,
    visible    : React.PropTypes.bool,
    eventScope : React.PropTypes.string.isRequired,
};

ProgressDialog.defaultProps = {
    title   : '',
    visible : false
};

module.exports = ProgressDialog;
