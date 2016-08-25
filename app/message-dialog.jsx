'use babel';
'use strict';

import React      from 'react';
import BaseDialog from './base/base-dialog.jsx';
import PubSub     from 'pubsub-js';

const is = require('electron-is');

if (is.dev()) {
    PubSub.immediateExceptions = true;
}

export default class MessageDialog extends BaseDialog {
    constructor(props) {
        super(props);

        this.state.message = this.props.message;
    }

    /**
     * Shows this message dialog.
     */
    show(props) {
        this.setState({
            title   : props.title,
            message : props.message,
            visible : true
        });
    }

    /**
     * Hides this message dialog.
     */
    hide() {
        this.setState({
            title   : '',
            message : '',
            visible : false
        });
    }

    getContent() {
        return (
            <div>{this.state.message}</div>
        );
    }
}

MessageDialog.propTypes = {
    title      : React.PropTypes.string,
    message    : React.PropTypes.string,
    visible    : React.PropTypes.bool,
    eventScope : React.PropTypes.string.isRequired,
};

MessageDialog.defaultProps = {
    title   : '',
    message : '',
    visible : false
};

module.exports = MessageDialog;
