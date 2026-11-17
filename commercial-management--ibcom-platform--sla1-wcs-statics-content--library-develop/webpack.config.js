const path = require('path');
const semver = require('semver');
const supportedNodeVersion = require('./package').engines.node;
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const PugPlugin = require('pug-plugin');
const WebpackConcatPlugin = require('webpack-concat-files-plugin');
const babel = require('@babel/core');
const TerserPlugin = require('terser-webpack-plugin');
const {
    jsEntryPoints, cssEntryPoints, legacyEntryPoints, initFile,
} = require('./entryPoints');

const jsDistPath = 'js/';

module.exports = (env, argv) => {
    const { mode } = argv;
    const isProduction = mode === 'production';
    const outputPath = isProduction ? 'src' : 'dev/wcs_statics';
    if (!semver.satisfies(process.version, supportedNodeVersion)) {
        console.log(`NodeJS Version Check: Required node version ${supportedNodeVersion} NOT SATISFIED with current version ${process.version}.`);
        process.exit(1);
    }

    return {
        mode: isProduction ? 'production' : 'development',
        entry: { ...cssEntryPoints, ...jsEntryPoints, ...legacyEntryPoints },
        output: {
            path: path.resolve(__dirname, outputPath),
            filename: '[name].js',
            clean: isProduction
                ? {
                    keep: (asset) => !(asset.startsWith('js/') || asset.startsWith('css/')),
                }
                : true,
            publicPath: '/wcs_statics/',
        },
        optimization: {
            usedExports: true,
            concatenateModules: true,
            removeAvailableModules: false,
            mangleExports: 'size',
            mangleWasmImports: true,
            providedExports: true,
            minimize: isProduction,
            splitChunks: {
                cacheGroups: {
                    calendarLibrary: {
                        test: /[\\/]node_modules[\\/]commercial-management--digital--price-calendar-library[\\/]/,
                        name: (module) => {
                            const resource = String(module.resource ?? '');
                            const match = resource.match(/[\\/]dist[\\/](.+)\.js$/);
                            if (match) {
                                const distPath = match[1].replace(/[\\/]/g, '/');
                                return `js/price-calendar/${distPath}`;
                            }
                            return 'js/price-calendar/price-calendar-misc';
                        },
                        priority: 50,
                        reuseExistingChunk: true,
                        enforce: true,
                    },
                },
            },
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    extractComments: false,
                    terserOptions: {
                        mangle: true,
                        compress: true,
                    },
                }),
                new CssMinimizerPlugin(),
            ],
        },
        module: {
            // configuration regarding modules
            rules: [
                {
                    test: /\.js$/,
                    exclude: [/node_modules/],
                    include: path.resolve(__dirname, 'dev/js'),
                    use: { loader: 'babel-loader' },
                },
                {
                    test: /\.s?css$/i,
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                            },
                        },
                        'postcss-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                // eslint-disable-next-line global-require
                                implementation: require('sass'),
                            },
                        },
                    ],
                },
            ],
        },
        devtool: isProduction ? false : 'source-map',
        plugins: [
            new PugPlugin({
                test: /\.(pug|jade)$/,
                modules: [
                    PugPlugin.extractCss({
                        filename: '[name].css',
                    }),
                ],
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: './dev/js/inte-legacy-build/localization/datepicker-locales/**/*',
                        to: 'js/localization/datepicker-locales/[name][ext]',
                    },
                    {
                        from: 'fonts/**/*',
                        to: 'css',
                        context: './dev',
                    },
                    {
                        from: 'satisfly.js',
                        to: jsDistPath,
                        context: './dev/js/inte-legacy-build/',
                    },
                    {
                        from: './dev/js/front-build/libs.dependencies.js',
                        to: jsDistPath,
                    },
                    {
                        from: './node_modules/@iberia/ib-core-fonts/dist/fonts/**.*',
                        to: './css/fonts/ib-core-fonts/[name][ext]',
                    },
                ],
            }),
            new WebpackConcatPlugin({
                bundles: [
                    {
                        src: initFile,
                        dest: path.resolve(__dirname, `${outputPath}/${jsDistPath}/init.js`),
                        transforms: {
                            before: async (code) => {
                                const babelTransformed = await babel.transformAsync(code, {
                                    configFile: false,
                                    presets: ['@babel/preset-env'],
                                    plugins: [],
                                });
                                return babelTransformed.code;
                            },
                        },
                    },
                ],
                allowOptimization: isProduction,
            }),
        ].filter(Boolean),
        performance: {
            hints: false,
        },
    };
};
