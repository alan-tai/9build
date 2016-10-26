'use strict';

import { extendObservable } from 'mobx';

export default class SimpleDialogStore {
    constructor() {
        extendObservable(this, {
            title   : '',
            visible : false
        });
    }
}

module.exports = SimpleDialogStore;
