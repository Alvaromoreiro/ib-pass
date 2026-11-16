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
        console.log(`NodeJS Version Check: Required node version ${packageJson.engines.node} NOT SATISFIED with current version ${process.version}.`);
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
        let env: string | null = null;
        if (process.env.npm_lifecycle_event === 'build') {
            env = 'aws';
        } else if (process.env.npm_lifecycle_event === 'build-dev'){
            env = 'uatb';
        } else if (process.env.npm_lifecycle_event === 'build-pre') {
            env = 'uatd';
        } else if (process.env.npm_lifecycle_event === 'start-cypress-ci') {
            env = 'uatb';
        }

        return env;
    };

    const environment = getParamCommand('env') ??  getEnvironmentByLifescycleEvent();
    const isProduction =['build', 'build-dev', 'build-pre', 'build-pro'].includes(process.env.npm_lifecycle_event);
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
        config.output.chunkFilename = (pathData, assetInfo) => {
            let name:string = (pathData?.chunk?.id ?? '') as string;
            name = name.replace('node_modules_', '');
            name = name.replace('commercial-management--digital--web-components-design--library_dist_', 'digital-components-');
            return `${process.env.npm_package_name}-${name}-${replaceVersion}.js`;
        };
    }
    config.plugins.filter(({constructor: {name}}) => name.includes('MiniCssExtractPlugin'))
        .forEach ( (plugin: any) => {
            plugin.options.filename = `[name]-${replaceVersion}.css`;
            plugin.options.chunkFilename = `[name]-${replaceVersion}.css`;
        });

    // add support to change libraries
    config.snapshot = {
        managedPaths: [],
        immutablePaths: []
    };
    config.experiments.topLevelAwait = true;

    //change alias in production for styles
    config.resolve.alias = {
        'jquery-ui/datepicker': 'components-jqueryui/ui/widgets/datepicker'
    };

    // rules for angularjs support
    config.module.rules = config.module.rules.concat([
        {
            test: /(web\-commons\.min|datepicker-[\w-]+)\.js/,
            parser: { amd: false }
        },
        {
            test: /\.[cm]?js$/,
            include: [/ib-web-commons/, /ib-web-payments/, /ib-web-ancillaries/, /commercial-management--digital--web-components-design--library/],
            enforce: 'pre',
            use: ['source-map-loader']
        },
        {
            test: /\.html$/,
            exclude: [/node_modules\/(?!(ib-web-commons|ib-web-payments|ib-web-ancillaries)\/).*/, /\.component\.html/],
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
            test: /commercial-management--digital--web-components-design--library/,
            sideEffects: false       
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }
    ]);
    //deactivate mangling for JavascriptOptimizer angular >= 12
    config.optimization?.minimizer?.filter (({constructor: {name}}) => name === 'JavaScriptOptimizerPlugin')
        .forEach ( (plugin: any) => {
            plugin.options.keepIdentifierNames = true;
            plugin.options.keepNames = true;
            plugin.options.removeLicenses = false;
        });



    //change dev server iberia web content path
    if(config.devServer) {
        config.devServer.client = {
            overlay: {
                warnings: false,
                errors: true,
                runtimeErrors: false
            }
        };
        let personalConfig;
        try {
            personalConfig = require('./personalLocalConf.json');

        } catch(e) {
            personalConfig = {};
        }
        const open = getParamCommand('open');
        config.devServer.static = {
            directory: personalConfig.LOCAL_STATIC_CONTENT_PATH ?
                path.join(personalConfig.LOCAL_STATIC_CONTENT_PATH) :
                path.join(__dirname, '../../node_modules/iberia-web-content'),
            publicPath: '/iberia-web-content',
            watch: false
        };
        config.devServer.open = open !== '';
        try {
            const scripts = options.scripts;
            scripts?.forEach((scriptPath) => {
                if(typeof scriptPath === 'string' && scriptPath.includes('personal')) {
                    const fullPath = path.resolve(__dirname, '../../', scriptPath);
                    const dirPath = path.dirname(fullPath);
                    if (!fs.existsSync(fullPath)) {
                        if (!fs.existsSync(dirPath)) {
                            fs.mkdirSync(dirPath, { recursive: true });
                        }
                        fs.writeFileSync(fullPath, '//empty file');
                    }
                }
            });
            
        } catch(e) {
            console.error(e);
            console.error('Some script files are missing. Please, check the "scripts" array in angular.json configuration.');
        }
    }

    config.plugins?.push(
        new webpack.BannerPlugin({
            banner: `Version: ${process.env.npm_package_version} , Build Number: ${packageJson.buildNumber} , Commons Version: ${packageJson.dependencies['ib-web-commons']} ,!! `
        })
    );
    config.plugins?.push(
        new webpack.ProvidePlugin(providePluginConfig)
    );
    
    
    // customizable plugins
    if (isProduction) {
        config.plugins?.push(
            new CleanWebpackPlugin({
                protectWebpackAssets: false,
                cleanOnceBeforeBuildPatterns: [],
                cleanAfterEveryBuildPatterns: ['*.txt', '*.gif', '*.eot', '*.svg', '*.ttf', '*.woff', '*.png']
            })
        );
    }
    if (!isTest) {
        config.plugins?.push(
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

    if (isDevServer) {
        config.plugins?.push(
            new ESLintPlugin({
                extensions: ['ts', 'js', 'html'],
                files: './{src}/**/*.{ts,component.html}',
                fix: false
            })
        );
        config.plugins?.push(
            new StylelintPlugin({
                configFile: path.resolve(__dirname, '../../stylelint.config.js'),
                files: './src/**/*.{css,scss}',
                fix: false
            })
        );
    }
   
    if(isBuildAnalyze) {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
        config.plugins?.push(
            new BundleAnalyzerPlugin({
                analyzerMode:  'static',
                openAnalyzer:  true
            })
        );
    }
    // Showing percentage
    /*if (isProduction) {
        config.plugins.filter (({constructor: {name}}) => name === 'ProgressPlugin')
            .forEach((asd: any) => {
                asd.percentBy = 'entries';W
                asd.handler = (percentage, message, ...args)  => {
                    console.info(`Phase ${message}: ${ (percentage * 100).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} %`);
                };
            });
    }*/

    return config;
};

const DECORATORS_PATH = '../../src';
const providePluginConfig = {
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    $: 'jquery',
    dayjs: 'dayjs',
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
