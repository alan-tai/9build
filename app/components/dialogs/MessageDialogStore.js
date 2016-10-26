'use strict';

import { extendObservable } from 'mobx';
import SimpleDialogStore from './SimpleDialogStore';

export default class MessageDialogStore extends SimpleDialogStore {
    constructor() {
        super();

        extendObservable(this, {
            message : ''
        });
    }
}

module.exports = MessageDialogStore;
