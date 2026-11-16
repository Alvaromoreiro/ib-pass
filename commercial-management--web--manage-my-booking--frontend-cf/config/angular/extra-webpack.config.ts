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

    if (!semver.satisfies(process.version, packageJson.engines.node)) {
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

    const getEnvironmentByLifescycleEvent = (): string | null => {
        const event = process.env['npm_lifecycle_event'];
        switch (event) {
          case 'build':
            return 'aws';
          case 'build-dev':
            return 'uatb';
          case 'build-pre':
            return 'uatd';
          default:
            return null;
        }
      };

    const environment = getParamCommand('env') ??  getEnvironmentByLifescycleEvent();
    const isProduction = process.env.npm_lifecycle_event === 'build' || process.env.npm_lifecycle_event === 'build-dev' || process.env.npm_lifecycle_event === 'build-pre' || process.env.npm_lifecycle_event === 'build-pro';
    const isBuildProduction = process.env.npm_lifecycle_event === 'build-pro';
    const isBuildAnalyze = process.env.npm_lifecycle_event === 'build-analyze';
    const isDevServer = process.env.npm_lifecycle_script.includes('serve');
    const isTest = process.env.npm_lifecycle_script.includes('test') || process.env['_INTELLIJ_KARMA_INTERNAL_PARAMETER_user_config'];
    const replaceVersion =  process.env.npm_package_version.replace(/[.]/g, '-');

    if(!environment && !isTest) {
        console.log('\nNo environment specified');
        console.log('\nSee README.md for more information');
        process.exit(1);
    }

    //Change output name
    if(!isTest) {
        config.output.filename = `${process.env.npm_package_name}-[name]-${replaceVersion}.js`;
        config.output.chunkFilename = `${process.env.npm_package_name}-[name]-${replaceVersion}.js`;
    }

    // add support to change libraries
    config.snapshot = {
        managedPaths: [],
        immutablePaths: []
    };

    // rules for angularjs support
    config.module.rules = config.module.rules.concat([
        {
            test: /(web\-commons\.min|datepicker-[\w-]+)\.js/,
            parser: { amd: false }
        },
        {
            test: /\.[cm]?js$/,
            include: [/ib-web-commons/, /ib-web-payments/, /ib-menus/, /ib-web-ancillaries/, /commercial-management--digital--web-components-design--library/],
            enforce: 'pre',
            use: ['source-map-loader']
        },
        {
            test: /\.html$/,
            exclude: [/node_modules\/(?!(ib-web-commons|ib-web-payments|ib-menus|ib-web-ancillaries)\/).*/, /\.component\.html/],
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
        },
        {
            test: /ib-web-ancillaries/,
            sideEffects: true
        },
        {
            test: /ib-web-payments/,
            sideEffects: true
        },
        {
            test: /ib-menus/,
            sideEffects: true
        },
        {
            test: /commercial-management--digital--web-components-design--library/,
            sideEffects: false
        },
        {
            test: /\.css$/,
            use: ['style-loader','css-loader']
        }
    ]);
    //deactivate mangling for JavascriptOptimizer angular >= 12
    config.optimization.minimizer.filter (({constructor: {name}}) => name === 'JavaScriptOptimizerPlugin')
        .forEach ( (plugin: any) => {
            plugin.options.keepIdentifierNames = true;
            plugin.options.keepNames = true;
            plugin.options.removeLicenses = false;
        });

    // customizable plugins
    if (isProduction) {
        config.plugins.push(
            new CleanWebpackPlugin({
                protectWebpackAssets: false,
                cleanOnceBeforeBuildPatterns: [],
                cleanAfterEveryBuildPatterns: ['*.txt', '*.gif', '*.eot', '*.svg', '*.ttf', '*.woff', '*.png', '*.woff2']
            })
        );
    }
    if (!isTest) {
        config.plugins.push(
            new CopyPlugin({
                patterns: [
                    {
                        from: `config/environments/env-${environment}.js`,
                        to: `env-${replaceVersion}.js`,
                        force: true
                    }
                ]
            })
        );
    }
    config.plugins.push(
        new webpack.BannerPlugin({
            banner: `Version: ${process.env.npm_package_version} , Build Number: ${packageJson.buildNumber} , Commons Version: ${packageJson.dependencies['ib-web-commons']} ,!! `
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
    }
    config.plugins.push(
        new webpack.ProvidePlugin(providePluginConfig)
    );
    if(isBuildAnalyze) {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
        config.plugins.push(
            new BundleAnalyzerPlugin({
                analyzerMode:  'static',
                openAnalyzer:  true
            })
        );
    }

    config.plugins.filter(({constructor: {name}}) => name.includes('MiniCssExtractPlugin'))
        .forEach ( (plugin: any) => {
            plugin.options.filename = `[name]-${replaceVersion}.css`;
            plugin.options.chunkFilename = `[name]-${replaceVersion}.css`;
        });
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
    dayjs: 'dayjs',
    Directives: [path.resolve(__dirname,`${DECORATORS_PATH}/decorators`), 'Directives'],
    Service: [path.resolve(__dirname,`${DECORATORS_PATH}/decorators`), 'Service'],
    Controller: [path.resolve(__dirname,`${DECORATORS_PATH}/decorators`), 'Controller'],
    Filters: [path.resolve(__dirname,`${DECORATORS_PATH}/decorators`), 'Filters'],
    Component: [path.resolve(__dirname,`${DECORATORS_PATH}/decorators`), 'Component'],
    Config: [path.resolve(__dirname,`${DECORATORS_PATH}/decorators`), 'Config']
};
