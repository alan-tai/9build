'use babel';
'use strict';

import React  from 'react';
import PubSub from 'pubsub-js';

const PackageInfo = require('../../package.json');
const is          = require('electron-is');

if (is.dev()) {
    PubSub.immediateExceptions = true;
}

export default class BaseComponent extends React.Component {
    constructor(props) {
        super(props);

        this._subscriptions = [];
    }

    componentWillUnmount() {
        this._subscriptions.forEach(subscription => {
            PubSub.unsubscribe(subscription);
        });

        this._subscriptions = [];
    }

    /**
     * Shows a message.
     * @param {any} message The message to show.
     */
    _showMessage(message) {
        if (message) {
            if (message instanceof Error) {
                console.log(message);

                PubSub.publish('MessageDialog.visible', {
                    title   : 'Error',
                    message : message.toString()
                });
            } else {
                PubSub.publish('MessageDialog.visible', {
                    title   : PackageInfo.description,
                    message : message
                });
            }
        }
    }

    /**
     * Hides any message currently shown.
     */
    _hideMessage() {
        PubSub.publish('MessageDialog.visible');
    }

    /**
     * Shows a progress dialog.
     */
    _showProgress() {
        PubSub.publish('ProgressDialog.visible', {
            title : 'Please wait...'
        });
    }

    /**
     * Hides any progress dialog currently shown.
     */
    _hideProgress() {
        PubSub.publish('ProgressDialog.visible');
    }
}

module.exports = BaseComponent;
