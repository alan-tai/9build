'use strict';

import { extendObservable } from 'mobx';
import SimpleDialogStore from './components/dialogs/SimpleDialogStore';
import MessageDialogStore from './components/dialogs/MessageDialogStore';

export default class AppStore {
    constructor() {
        extendObservable(this, {
            aboutDialogStore       : new SimpleDialogStore(),
            messageDialogStore     : new MessageDialogStore(),
            loadingIndicatorStatus : 'loading',
            isDrawerOpened         : false,
            isDarkTheme            : false,
            projectId              : 0,
            projectPath            : [ '', '' ],
            variantAppStaging      : [ false, false ],
            variantAppRelease      : [ false, false ],
            variantProfDebug       : [ false, false ],
            buildClean             : [ false, false ],
            buildFast              : [ false, false ],
            buildLeak              : [ false, false ],
            apkUniversal           : [ false, false ],
            apkArmV7               : [ false, false ],
            apkArmV8               : [ false, false ],
            apkArm                 : [ false, false ],
            apkX86                 : [ false, false ],
            apkX8664               : [ false, false ],
            deviceId               : [ '', '' ],
            testUnit               : [ false, false ],
            testCoverage           : [ false, false ],
            aarBuild               : [ false, false ],
            aarClean               : [ false, false ],
            jarBuild               : [ false, false ],
            jarClean               : [ false, false ],
            daoBuild               : [ false, false ],
            daoClean               : [ false, false ]
        });
    }
}

module.exports = AppStore;
