'use strict';

import React from 'react';
import { observer } from 'mobx-react';
import SimpleDialog from './SimpleDialog.jsx';
import MessageDialogStore from './MessageDialogStore';

@observer
export default class MessageDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <SimpleDialog
                store={this.props.store}
                positiveButtonText="Close"
                onPositiveButtonClick={() => this.props.store.visible = false}>
                <div>{this.props.store.message}</div>
            </SimpleDialog>
        );0
    }
}

MessageDialog.propTypes = {
    store : React.PropTypes.instanceOf(MessageDialogStore).isRequired
};

module.exports = MessageDialog;
