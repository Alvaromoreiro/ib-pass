import { CustomWebpackBrowserSchema, TargetOptions } from '@angular-builders/custom-webpack';
import * as webpack from 'webpack';
import path from 'path';
import fs from 'fs';
import semver from 'semver';
import CopyPlugin from 'copy-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import StylelintPlugin from 'stylelint-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8'));


export default (
    config: webpack.Configuration,
    options: CustomWebpackBrowserSchema,
    targetOptions: TargetOptions
) => {

    if (!semver.satisfies(process.version, process.env['npm_package_engines_node'] || process.env['npm_config_node_version'])) {
        console.log(`NodeJS Version Check: Required node version ${process.env['npm_package_engines_node'] || process.env['npm_config_node_version']} NOT SATISFIED with current version ${process.version}.`);
        process.exit(1);
    }

    const getParamCommand = (key: string) => {
        let value;
        try {
            value = process.env['npm_config_' + key.toLowerCase()];
        } catch (err) {
            console.log('No value found for the key ' + key);
            process.exit(1);
        }
        return value;
    };
    const environment = getParamCommand('env');
    const isProduction = process.env.npm_lifecycle_event === 'build' || process.env.npm_lifecycle_event === 'build-dev' || process.env.npm_lifecycle_event === 'build-pre' || process.env.npm_lifecycle_event === 'build-pro';
    const isBuildProduction = process.env.npm_lifecycle_event === 'build-pro';
    const isDevServer = process.env.npm_lifecycle_script.includes('serve');
    const isTest = process.env.npm_lifecycle_script.includes('test');

    if(!environment && !isTest) {
        console.log('\nNo environment specified');
        console.log('\nSee README.md for more information');
        process.exit(1);
    }

    // local login script
    const login = getParamCommand('login');
    if (login && isDevServer) {
        config.entry = { //@ts-ignore
            ...config.entry,
            login: [ path.resolve(__dirname, './localLogin.js') ]
        };
    }

    //Change output name
    if(!isTest) {
        config.output.filename = `${process.env.npm_package_name}-[name].js`;
        config.output.chunkFilename = `${process.env.npm_package_name}-[name].js`;
    }

    // add support to change libraries
    config.snapshot = {
        managedPaths: [],
        immutablePaths: []
    };

    //change alias in production for styles
    config.resolve.alias = {
        'jquery-ui/datepicker': 'components-jqueryui/ui/widgets/datepicker'
    };

    if (isTest) {
        const commonsMockPath = path.resolve(__dirname, '../../test/mocks/ib-web-commons');
        config.resolve.alias = {
            ...config.resolve.alias,
            'ib-web-commons$': path.join(commonsMockPath, 'index.ts'),
            'ib-web-commons/utils': path.join(commonsMockPath, 'utils.ts'),
            'ib-web-commons/services': path.join(commonsMockPath, 'services.ts'),
            'ib-web-commons/models': path.join(commonsMockPath, 'models.ts'),
            'ib-web-commons/pipes': path.join(commonsMockPath, 'pipes.ts'),
            'ib-web-commons/proxies': path.join(commonsMockPath, 'proxies.ts'),
            'ib-web-commons/ib-datalayer': path.join(commonsMockPath, 'ib-datalayer.ts'),
            'ib-web-commons/app/core/ib-modal/services/ib-modal-service': path.join(
                commonsMockPath,
                'app/core/ib-modal/services/ib-modal-service.ts'
            ),
            'ib-web-commons/app/core/models/http-services/cmlm-mbm/ib-commons-on-business-membership.model': path.join(
                commonsMockPath,
                'app/core/models/http-services/cmlm-mbm/ib-commons-on-business-membership.model.ts'
            )
        };
    }

    // rules for angularjs support
    config.module.rules = config.module.rules.concat([
        {
            test: /(web\-commons\.min|datepicker-[\w-]+)\.js/,
            parser: { amd: false }
        },
        {
            test: /\.[cm]?js$/,
            include: [/ib-web-commons/],
            enforce: 'pre',
            use: ['source-map-loader']
        },
        {
            test: /\.html$/,
            exclude: [/node_modules\/(?!(ib-style-modules|ib-web-commons|ib-web-payments|ib-menus|ib-web-ancillaries)\/).*/, /\.component\.html$/],
            use: [
                {
                    loader: 'html-loader',
                    options: {
                        sources: false,
                        minimize: false,
                        esModule: false
                    }
                }
            ]
        },
        {
            test: /ib-web-commons/,
            sideEffects: true
        }
    ]);
    //deactivate mangling for both Terser angular < 12 and JavascriptOptimizer angular >= 12
    config.optimization.minimizer.filter (({constructor: {name}}) => name === 'TerserPlugin')
        .forEach ( (terser: any) => {
            terser.options.extractComments = false;
            terser.options.terserOptions.mangle = false;
        });
    config.optimization.minimizer.filter (({constructor: {name}}) => name === 'JavaScriptOptimizerPlugin')
        .forEach ( (plugin: any) => {
            plugin.options.keepIdentifierNames = true;
            plugin.options.keepNames = true;
            plugin.options.removeLicenses = false;
        });

    //change dev server iberia web content path
    if(config.devServer) {
        const open = getParamCommand('open');
        config.devServer.static = {
            directory: path.join(__dirname, '../../node_modules'),
            publicPath: ''
        };
        config.devServer.open = open !== '';
    }

    // customizable plugins
    if (isProduction) {
        config.plugins.push(
            new CleanWebpackPlugin({
                protectWebpackAssets: false,
                cleanOnceBeforeBuildPatterns: [],
                cleanAfterEveryBuildPatterns: ['*.txt', '*.gif', '*.eot', '*.svg', '*.ttf', '*.woff', '*.png']
            })
        );
    }
    if (!isTest) {
        config.plugins.push(
            new CopyPlugin({
                patterns: [
                    {
                        from: `config/environments/env-${environment}.js`,
                        to: 'env.js',
                        force: true
                    }
                ]
            })
        );
    }
    config.plugins.push(
        new webpack.BannerPlugin({
            banner: `Version: ${process.env.npm_package_version} , Build Number: ${packageJson.buildNumber} , Commons Version: ${packageJson.dependencies['ib-web-commons']} , Styles Version: ${packageJson.dependencies['ib-style-modules']} ,!! `
        })
    );
    if (isDevServer) {
        config.plugins.push(
            new ESLintPlugin({
                extensions: ['ts', 'js', 'html'],
                files: './{src,test}/**/*.{ts,component.html}',
                fix: true
            })
        );
        config.plugins.push(
            new StylelintPlugin({
                configFile: path.resolve(__dirname, '../../stylelint.config.js'),
                files: './src/**/*.{css,scss}',
                fix: true
            })
        );
        // local login script
        if(login) {
            config.plugins.push(
                new webpack.DefinePlugin({
                    'process.env.USER_LOGIN': JSON.stringify(getParamCommand('user') || false),
                    'process.env.PASS_LOGIN': JSON.stringify(getParamCommand('pass') || false),
                    'process.env.ZERO_LOGIN': JSON.stringify(login === 'zero'),
                    'process.env.CODE_LOGIN': JSON.stringify(getParamCommand('code') || false)
                })
            );
        }
    }
    config.plugins.push(
        new webpack.ProvidePlugin(providePluginConfig)
    );
    // Showing percentage
    if (isProduction) {
        config.plugins.filter (({constructor: {name}}) => name === 'ProgressPlugin')
            .forEach ( (asd: any) => {
                asd.handler = (percentage, message, ...args)  => {
                    console.info(`Phase ${message}: ${ (percentage * 100).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} %`);
                };
            });
    }

    return config;
};

const DECORATORS_PATH = '../../src';
const providePluginConfig = {
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    $: 'jquery',
    Directives:
        'exports-loader?type=commonjs&exports=single|Directives!' +
        path.resolve(
            __dirname,
            `${DECORATORS_PATH}/decorators`
        ),
    Service:
        'exports-loader?type=commonjs&exports=single|Service!' +
        path.resolve(
            __dirname,
            `${DECORATORS_PATH}/decorators`
        ),
    Controller:
        'exports-loader?type=commonjs&exports=single|Controller!' +
        path.resolve(
            __dirname,
            `${DECORATORS_PATH}/decorators`
        ),
    Filters:
        'exports-loader?type=commonjs&exports=single|Filters!' +
        path.resolve(
            __dirname,
            `${DECORATORS_PATH}/decorators`
        ),
    Component:
        'exports-loader?type=commonjs&exports=single|Component!' +
        path.resolve(
            __dirname,
            `${DECORATORS_PATH}/decorators`
        ),
    Config:
        'exports-loader?type=commonjs&exports=single|Config!' +
        path.resolve(
            __dirname,
            `${DECORATORS_PATH}/decorators`
        )
};
