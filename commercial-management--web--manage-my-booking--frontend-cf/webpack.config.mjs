import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { plugins } from './config/webpack/pluginsConfig.mjs';
import { rules } from './config/webpack/rules.mjs';
import HttpsProxyAgent from 'https-proxy-agent';
import { TerserConfig } from './config/webpack/terserConfig.mjs';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default (env, argv) => {

    const { mode } = argv;
    const isProduction = mode === 'production';
    const isBuildProduction = process.env.npm_lifecycle_event === 'build-pro';
    const outputPath = 'build';
    const replaceVersion = '-' + process.env.npm_package_version.replace(/[.]/g, '-');
    const terserPluginConfig = new TerserConfig().config;


    return {
        mode: isProduction ? 'production' : 'development',
        entry: {
            [`${packageJson.name}${replaceVersion}`]: {
                import: './src/main.ts'
            }
        },
        output: {
            filename: `[name].min.js`,
            path: path.resolve(
                __dirname,
                outputPath
            ),
            clean: true
        },
        resolve: {
            extensions: ['.ts', '.js', '.mjs', '.cjs'],
            modules: ['node_modules'],
            descriptionFiles: ['package.json'],
            plugins: [
                new TsconfigPathsPlugin({ configFile: './tsconfig.json' })
            ],
            alias: {
                'jquery-ui/datepicker': 'components-jqueryui/ui/widgets/datepicker'
            },
            symlinks: true
        },
        devtool: isBuildProduction ? 'hidden-source-map' : 'source-map',
        module: {
            rules: rules(env, isBuildProduction)
        },
        optimization: {
            minimize: isProduction,
            minimizer: [new TerserPlugin(terserPluginConfig)],
            splitChunks: {
                cacheGroups: {
                    dependencies: {
                        test: /node_modules.*(?<!css)$/,
                        name: `${packageJson.name}${replaceVersion}.dependencies`,
                        chunks: 'all'
                    }
                }
            }
        },
        plugins: plugins(env, isBuildProduction),
        snapshot: {
            managedPaths: [],
            immutablePaths: []
        },
        devServer: {
            port: 9008,
            historyApiFallback: true,
            host: '127.0.0.1',
            client: {
                overlay: {
                    errors: true
                }
            },
            open: env.open !== 'false',
            hot: false,
            static: {
                directory: path.join(__dirname, './node_modules'),
                publicPath: ''
            },
            proxy: {
                context: function (pathname, req) {
                    // return pathname.match('^/api') && (!req.headers.accept || req.headers.accept.indexOf('html') === -1);
                },
                target: 'http://localhost:4000',
            }
        },
        performance: {
            hints: false
        }
    };
};
