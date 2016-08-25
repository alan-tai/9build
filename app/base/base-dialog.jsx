'use babel';
'use strict';

import React         from 'react';
import BaseComponent from './base-component.jsx';
import Dialog        from 'material-ui/Dialog';
import FlatButton    from 'material-ui/FlatButton';
import PubSub        from 'pubsub-js';

const is = require('electron-is');

if (is.dev()) {
    PubSub.immediateExceptions = true;
}

export default class BaseDialog extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            title          : this.props.title,
            visible        : this.props.visible,
            style          : this.props.style,
            titleStyle     : this.props.titleStyle,
            contentStyle   : this.props.contentStyle,
            bodyStyle      : this.props.bodyStyle,
            positiveButton : this.props.positiveButton,
            neutralButton  : this.props.neutralButton,
            negativeButton : this.props.negativeButton
        };
    }

    componentDidMount() {
        this._subscriptions.push(PubSub.subscribe(this.props.eventScope + '.visible', this._handleEvent.bind(this)));
    }

    /**
     * Gets the content to be displayed on this dialogs.
     */
    getContent() {
        return (
            <div></div>
        );
    }

    /**
     * Shows this dialog.
     */
    show(props) {
        this.setState({
            title   : props.title ? props.title : this.props.title,
            visible : true
        });
    }

    /**
     * Hides this dialog.
     */
    hide() {
        this.setState({
            title   : '',
            visible : false
        });
    }

    handleOnPositiveButtonClick(e) {
        this.hide();
    }

    handleOnNeutralButtonClick(e) {
        this.hide();
    }

    handleOnNegativeButtonClick(e) {
        this.hide();
    }

    _handleEvent(msg, data) {
        if (msg === this.props.eventScope + '.visible') {
            if (data) {
                this.show(data);
            } else {
                this.hide();
            }
        }
    }

    render() {
        let content = this.getContent();
        let actions = [];

        if (this.state.negativeButton) {
            actions.push(
                <FlatButton
                    label={this.state.negativeButton}
                    primary={true}
                    onTouchTap={this.handleOnNegativeButtonClick.bind(this)} />
            );
        }

        if (this.state.neutralButton) {
            actions.push(
                <FlatButton
                    label={this.state.neutralButton}
                    primary={true}
                    onTouchTap={this.handleOnNeutralButtonClick.bind(this)} />
            );
        }

        if (this.state.positiveButton) {
            actions.push(
                <FlatButton
                    label={this.state.positiveButton}
                    primary={true}
                    onTouchTap={this.handleOnPositiveButtonClick.bind(this)} />
            );
        }

        return (
            <Dialog
                title={this.state.title}
                modal={true}
                open={this.state.visible}
                autoScrollBodyContent={true}
                style={this.state.style}
                titleStyle={this.state.titleStyle}
                bodyStyle={this.state.bodyStyle}
                contentStyle={this.state.contentStyle}
                actions={actions}>
                {content}
            </Dialog>
        );
    }
}

BaseDialog.propTypes = {
    title          : React.PropTypes.string,
    visible        : React.PropTypes.bool,
    eventScope     : React.PropTypes.string.isRequired,
    positiveButton : React.PropTypes.string,
    neutralButton  : React.PropTypes.string,
    negativeButton : React.PropTypes.string,
    style          : React.PropTypes.object,
    titleStyle     : React.PropTypes.object,
    bodyStyle      : React.PropTypes.object,
    contentStyle   : React.PropTypes.object
};

BaseDialog.defaultProps = {
    title   : '',
    visible : false
};

module.exports = BaseDialog;
