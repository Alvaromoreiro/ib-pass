import { CustomWebpackBrowserSchema, TargetOptions } from '@angular-builders/custom-webpack';
import * as webpack from 'webpack';
import path from 'path';
import fs from 'fs';
import semver from 'semver';
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

    // add support to change libraries
    config.snapshot = {
        managedPaths: [],
        immutablePaths: []
    };

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
            include: [/ib-web-commons/],
            enforce: 'pre',
            use: ['source-map-loader']
        },
        {
            test: /\.html$/,
            exclude: [/node_modules\/(?!(ib-web-commons|ib-web-payments|ib-menus|ib-web-ancillaries)\/).*/, /\.component\.html$/],
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
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }
    ]);


    config.plugins.push(
        new webpack.ProvidePlugin(providePluginConfig)
    );

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
