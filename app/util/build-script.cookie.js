'use strict';

import Path from 'path';

const prepareCommandForAppend = command => {
    if (command.length > 0 && !command.endsWith(' && ')) {
        command += ' && ';
    }

    return command;
};

const executeUploadArchives = (props, enableBuild, enableClean, type) => {
    let command = '';

    if (enableBuild) {
        command += 'cd ' + Path.join(props.projectPath[0], 'repo/' + type);
        command  = prepareCommandForAppend(command);
        command += './gradlew -i' + (enableClean ? ' clean' : '') + (type === 'dao' ? ' run' : ' uploadArchives');
    }

    return command;
};

const executeAssemble = props => {
    let command = '';

    if (props.buildClean[0]) {
        command += ' clean';
    }

    if (props.buildFast[0]) {
        command += ' -PfastBuild=true';
    }

    if (props.buildLeak[0]) {
        command += ' -PdetectLeak=true';
    }

    if (props.testUnit[0]) {
        command += ' testAppStagingUnitTest';

        if (props.testCoverage[0]) {
            command += ' jacocoReport';
        }
    }

    if (props.variantAppRelease[0]) {
        command += ' assembleAppRelease';
    }

    if (props.variantAppStaging[0]) {
        command += ' assembleAppStaging';
    }

    if (props.variantProfDebug[0]) {
        command += ' assembleProfDebug';
    }

    if (command.length > 1) {
        command = prepareCommandForAppend('cd ' + props.projectPath[0]) + './gradlew -i' + command
    }

    return command;
};

const executeInstall = (props, variant) => {
    if (variant) {
        let command = 'adb';

        if (props.deviceId[0] && props.deviceId[0] && props.deviceId[0].length > 0) {
            command += ' -s ' + props.deviceId[0];
        }

        command += ' install -r ' + Path.join(props.projectPath[0], 'apps/9gag-chat/build/outputs/apk/9gag-chat-' + variant + '.apk');

        return command;
    }

    let command = '';

    const variants = [];

    if (props.apkUniversal[0]) {
        addVariants(props, variants, 'universal');
    }

    if (props.apkArmV7[0]) {
        addVariants(props, variants, 'armeabi-v7a');
    }

    if (props.apkArmV8[0]) {
        addVariants(props, variants, 'arm64-v8a');
    }

    if (props.apkArm[0]) {
        addVariants(props, variants, 'armeabi');
    }

    if (props.apkX86[0]) {
        addVariants(props, variants, 'x86');
    }

    if (props.apkX8664[0]) {
        addVariants(props, variants, 'x86_64');
    }

    variants.forEach(variant => {
        command  = prepareCommandForAppend(command);
        command += executeInstall(props, variant);
    });

    return command;
};

const addVariants = (props, variants, abi) => {
    if (props.variantAppRelease[0]) {
        variants.push('app-' + abi + '-release');
    }

    if (props.variantAppStaging[0]) {
        variants.push('app-' + abi + '-staging');
    }

    if (props.variantProfDebug[0]) {
        variants.push('prof-' + abi + '-debug');
    }
};

const generateCommandForCookie = props => {
    let command = '';

    command += executeUploadArchives(props, props.daoBuild[0], props.daoClean[0], 'dao');
    command  = prepareCommandForAppend(command);
    command += executeUploadArchives(props, props.jarBuild[0], props.jarClean[0], 'jar');
    command  = prepareCommandForAppend(command);
    command += executeUploadArchives(props, props.aarBuild[0], props.aarClean[0], 'aar');
    command  = prepareCommandForAppend(command);
    command += executeAssemble(props);
    command  = prepareCommandForAppend(command);
    command += executeInstall(props);

    if (command.length > 0) {
        if (command.endsWith(' && ')) {
            command = command.substring(0, command.lastIndexOf(' && '));
        }
    }

    return command;
};

module.exports = { generateCommandForCookie };
