const Path = require('path');

function prepareCommandForAppend(command) {
    if (command.length > 0 && !command.endsWith(' && ')) {
        command += ' && ';
    }

    return command;
}

function executeUploadArchives(props, enableBuild, enableClean, type) {
    let command = '';

    if (enableBuild) {
        command += 'cd ' + Path.join(props.projectPath[1], 'repo/' + type);
        command  = prepareCommandForAppend(command);
        command += './gradlew -i' + (enableClean ? ' clean' : '') + ' uploadArchives';
    }

    return command;
}

function executeAssemble(props) {
    let command = '';

    if (props.buildClean[1]) {
        command += ' clean';
    }

    if (props.buildFast[1]) {
        command += ' -PfastBuild=true';
    }

    if (props.buildLeak[1]) {
        command += ' -PdetectLeak=true';
    }

    if (props.testUnit[1]) {
        command += ' testAppJokesUnitTest';
    }

    if (props.variantAppRelease[1]) {
        command += ' assembleAppRelease';
    }

    if (props.variantAppStaging[1]) {
        command += ' assembleAppJokes';
    }

    if (props.variantProfDebug[1]) {
        command += ' assembleAppDebug';
    }

    if (command.length > 1) {
        command = prepareCommandForAppend('cd ' + Path.join(props.projectPath[1], 'repo/app')) + './gradlew -i' + command
    }

    return command;
}

function executeInstall(props, variant) {
    if (variant) {
        let command = 'adb';

        if (props.deviceId[1] && props.deviceId[1] && props.deviceId[1].length > 0) {
            command += ' -s ' + props.deviceId[1];
        }

        command += ' install -r ' + Path.join(props.projectPath[1], 'android/build/outputs/apk/android-' + variant + '.apk');

        return command;
    }

    let command  = '';
    let variants = [];

    addVariants(props, variants);

    variants.forEach(variant => {
        command  = prepareCommandForAppend(command);
        command += executeInstall(props, variant);
    });

    return command;
}

function addVariants(props, variants) {
    if (props.variantAppRelease[1]) {
        variants.push('app-release');
    }

    if (props.variantAppStaging[1]) {
        variants.push('app-jokes');
    }

    if (props.variantProfDebug[1]) {
        variants.push('app-debug');
    }
}

let generateCommandFor9Gag = function(props) {
    let command = '';

    command += executeUploadArchives(props, props.jarBuild[1], props.jarClean[1], 'jar');
    command  = prepareCommandForAppend(command);
    command += executeUploadArchives(props, props.aarBuild[1], props.aarClean[1], 'aar');
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

module.exports = generateCommandFor9Gag;
