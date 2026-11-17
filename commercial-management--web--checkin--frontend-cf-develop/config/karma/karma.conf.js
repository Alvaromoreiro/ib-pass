// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    const WATCH_MODE = process.env.npm_lifecycle_event === 'test-watch';
    const IS_A11Y = process.env.npm_lifecycle_event === 'test:a11y';
    const coverageReporter = {
        dir: require('path').join(__dirname, '../../reports'),
        subdir: '.',
        reporters: [
            { type: 'lcov' },
            { type: 'text-summary' }
        ]
    };

    if (!IS_A11Y) {
        coverageReporter.check = {
            global: {
                statements: 55,
                branches: 40,
                functions: 50,
                lines: 55
            }
        };
    }

    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            jasmine: {
                random: false
            },
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        jasmineHtmlReporter: {
            suppressAll: true // removes the duplicated traces
        },
        coverageReporter,
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browserNoActivityTimeout: WATCH_MODE ? 120000 : 300000,
        browsers: [WATCH_MODE ? 'ChromeDebug' : 'ChromeHeadless'],
        customLaunchers: {
            Chrome_headless: {
                base: 'ChromeHeadless'
            },
            ChromeDebug: {
                base: 'Chrome',
                flags: [
                    '--no-sandbox',
                    '--remote-debugging-port=9333'
                ]
            },
            ChromeHeadlessCI: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        },
        singleRun: !WATCH_MODE,
        restartOnFileChange: true
    });
};
