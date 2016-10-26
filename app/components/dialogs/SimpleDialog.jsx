'use strict';

import React from 'react';
import { observer } from 'mobx-react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SimpleDialogStore from './SimpleDialogStore';

@observer
export default class SimpleDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const renderButton = (label, isPrimary, onTouchTap) => {
            return (
                <FlatButton
                    label={label}
                    primary={isPrimary}
                    onTouchTap={onTouchTap} />
            );
        };

        const actions = [];

        if (this.props.negativeButtonText) actions.push(renderButton(this.props.negativeButtonText, false, this.props.onNegativeButtonClick));
        if (this.props.neutralButtonText)  actions.push(renderButton(this.props.neutralButtonText,  false, this.props.onNeutralButtonClick));
        if (this.props.positiveButtonText) actions.push(renderButton(this.props.positiveButtonText, true,  this.props.onPositiveButtonClick));

        return (
            <Dialog
                title={this.props.store.title}
                modal={true}
                open={this.props.store.visible}
                autoScrollBodyContent={true}
                titleStyle={this.props.titleStyle}
                bodyStyle={this.props.bodyStyle}
                contentStyle={this.props.contentStyle}
                style={this.props.style}
                actions={actions}>
                {this.props.children}
            </Dialog>
        );
    }
}

SimpleDialog.propTypes = {
    store                 : React.PropTypes.instanceOf(SimpleDialogStore).isRequired,
    negativeButtonText    : React.PropTypes.string,
    neutralButtonText     : React.PropTypes.string,
    positiveButtonText    : React.PropTypes.string,
    onNegativeButtonClick : React.PropTypes.func,
    onNeutralButtonClick  : React.PropTypes.func,
    onPositiveButtonClick : React.PropTypes.func,
    titleStyle            : React.PropTypes.object,
    bodyStyle             : React.PropTypes.object,
    contentStyle          : React.PropTypes.object,
    style                 : React.PropTypes.object
};

module.exports = SimpleDialog;
