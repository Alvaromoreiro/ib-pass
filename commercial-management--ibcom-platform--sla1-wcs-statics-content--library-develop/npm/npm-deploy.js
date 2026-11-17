/* eslint-disable import/no-extraneous-dependencies */
const command = require('child_process');
const deployer = require('web-nexus-deployer');
const fse = require('fs-extra');
const wcsReleaseVersion = require('../wcs-release-version.json');
const config = require('../gulp/config/config');

const dirTemp = './tmp';

const runBuild = async () => {
    console.log('------------ RUN NEW BUILD ------------');
    return new Promise((resolve, reject) => {
        command.exec('npm run build-pro', (error, stdout) => {
            if (error) {
                console.error(error.message);
                reject(new Error(error.message));
            }

            if (error === null) {
                resolve();
            }
            console.log(stdout);
            console.log('---------------------------------------------------------------------------------------------\n');
        });
    });
};

const commitChanges = async () => {
    console.log('------------Performing GIT COMMIT------------');
    return new Promise((resolve, reject) => {
        // eslint-disable-next-line prefer-destructuring
        wcsReleaseVersion.lastNexusDeployDateUTC = new Date().toUTCString();
        fse.writeJsonSync('./wcs-release-version.json', wcsReleaseVersion, { spaces: 2 });
        command.exec(`git add * && git commit -am ":package: [NEXUS-DEPLOY] Release Build ${wcsReleaseVersion['release-version']}"  && git push`, (error, stdout, stderr) => {
            if (error) {
                console.error(error.message);
                reject(new Error(error.message));
            }
            if (stderr) {
                console.error(stderr);
            }
            if (error === null) {
                console.log('');
                resolve();
            }
            console.log(stdout);
        });
    });
};

const zipBuild = async () => {
    console.log('------------Zipping File------------');

    fse.removeSync(dirTemp);
    fse.mkdirsSync(dirTemp);
    fse.removeSync(dirTemp);
    fse.copySync('./dist/wcs_statics', `${dirTemp}/dist`);
    fse.copySync('./wcs-release-version.json', `${dirTemp}/dist/wcs-release-version.json`);
    return new Promise((resolve, reject) => {
        command.exec(`npx zip-build ${dirTemp}/dist ${dirTemp}/ -t wcs-statics-${wcsReleaseVersion['release-version']}.zip`, (error, stdout, stderr) => {
            if (error) {
                console.error(error.message);
                reject(new Error(error.message));
            }
            if (stderr) {
                console.error(stderr);
            }
            if (error === null) {
                resolve();
            }
            console.log(stdout);
        });
    });
};

const deployNexus = async () => {
    console.log('------------DEPLOY NEXUS------------');
    return new Promise((resolve, reject) => {
        if (wcsReleaseVersion !== undefined && wcsReleaseVersion['release-version'].length > 0) {
            const info = config.nexus;
            info.version = wcsReleaseVersion['release-version'];
            info.artifact = `./tmp/wcs-statics-${info.version}.zip`;
            try {
                deployer.deploy(info, (err) => {
                    if (err) {
                        console.error(err);
                        reject(new Error(err));
                    } else {
                        console.log('SUCCESS - PACKAGE DEPLOYED');
                        fse.removeSync(dirTemp);
                        resolve();
                    }
                });
            } catch (e) {
                console.error(e);
                reject(new Error(e));
            }
        }
    });
};

const runSequence = async () => {
    try {
        await runBuild();
        await commitChanges();
        await zipBuild();
        await deployNexus();
    } catch (e) {
        console.log('ERROR - RELEASE FAILED');
        process.on('exit', () => {
            process.exit(1);
        });
    }
};

console.log('------------Start Deploying Nexus------------');
runSequence().then(() => {
    console.log('------------Release Completed------------');
}).catch((err) => {
    console.log('------------Release Failed------------');
    console.log(err);
});
