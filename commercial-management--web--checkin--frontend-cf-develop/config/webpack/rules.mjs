import linkerPlugin from '@angular/compiler-cli/linker/babel';
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const rules = (env, isBuildProduction) => {
    const isDevServer = env.WEBPACK_SERVE;

    return [
        {
            test: /(web\-commons\.min|datepicker-[\w-]+)\.js/,
            parser: { amd: false }
        },
        {
            test: /(?:.ngfactory.js|.ngstyle.js|.ts)$/,
            exclude: [/node_modules\/(?!(ib-web-commons|ib-web-payments|ib-menus|ib-web-ancillaries)\/).*/],
            use: [
                {
                    loader: '@ngtools/webpack'
                }
            ]
        },
        {
            test: /\.[cm]?js$/,
            include: [/ib-web-commons/, /ib-menus/, /ib-web-payments/, /ib-web-ancillaries/],
            enforce: 'pre',
            use: ['source-map-loader']
        },
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                useBuiltIns: 'usage',
                                corejs: 3
                            }]
                        ]
                    }
                }
            ]
        },
        {
            test: /\.[cm]?js$/,
            include: {
                or: [/ib-web-commons/, /ib-menus/, /ib-web-payments/, /ib-web-ancillaries/],
                not: [/core-js/]
            },
            resolve: {
                fullySpecified: false
            },
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', {
                            useBuiltIns: 'usage',
                            corejs: 3
                        }]
                    ],
                    cacheDirectory: false,
                    compact: false,
                    plugins: [linkerPlugin]
                }
            }],
            sideEffects: true
        },
        {
            test: /\.[cm]?js$/,
            include: [
                /@angular/, /@ngx-translate/, /@ng-bootstrap/, /ngx-device-detector/, /ngx-cookie-service/, /@datorama/,
                /@ngxs/, /primeng/, /@ngrx/, /@ng-select/, /@rx-angular/, /@agm/, /@swimlane/, /ngx-moment/, /ngx-pipes/
            ],
            resolve: {
                fullySpecified: false
            },
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', {
                            useBuiltIns: 'usage',
                            corejs: 3
                        }]
                    ],
                    cacheDirectory: true,
                    compact: false,
                    plugins: [linkerPlugin]
                }
            }],
            sideEffects: true
        },
        {
            test: /\.[cm]?js$/,
            include: [/@ngx-translate/, /@ng-bootstrap/],
            resolve: {
                fullySpecified: false
            },
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', {
                            useBuiltIns: 'usage',
                            corejs: 3
                        }]
                    ],
                    cacheDirectory: true,
                    compact: false,
                    plugins: [linkerPlugin]
                }
            }],
            sideEffects: false
        },
        {
            test: /\.html$/,
            exclude: [/node_modules\/(?!(ib-web-commons|ib-web-payments|ib-menus|ib-web-ancillaries)\/).*/],
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
            test: /\.scss$/,
            use: [
                isDevServer ? 'style-loader' : MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        url: false,
                        esModule: false
                    }
                },
                'postcss-loader',
                'sass-loader'
            ]
        },
        {
            test: /\.css$/,
            use: [
                isDevServer ? 'style-loader' : MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        url: false,
                        sourceMap: !isBuildProduction,
                        esModule: false
                    }
                }
            ]
        }
    ]
}

export { rules }