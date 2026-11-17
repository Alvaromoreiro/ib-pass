import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackTagsPlugin from 'html-webpack-tags-plugin';
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyPlugin from 'copy-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import StylelintPlugin from 'stylelint-webpack-plugin';
import { AngularWebpackPlugin } from '@ngtools/webpack';
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DECORATORS_PATH = '../../src';

const plugins = (env, isBuildProduction) => {

    let ENVIRONMENT;
    const replaceVersion = '-' + process.env.npm_package_version.replace(/[.]/g, '-');
    const ignoreKeysToEnv= ['WEBPACK_BUNDLE', 'WEBPACK_BUILD', 'WEBPACK_SERVE', 'open', 'login', 'user', 'pass', 'code'];
    Object.keys(env).forEach((val) => {
        if (!ignoreKeysToEnv.includes(val)) {
            ENVIRONMENT = val;
        }
    });

    const isDevServer = env.WEBPACK_SERVE;

    return [
      !isDevServer && new MiniCssExtractPlugin(),
      new AngularWebpackPlugin({
        tsconfig: path.resolve(__dirname, '../../tsconfig.app.json'),
        jitMode: isDevServer,
        directTemplateLoading: false,
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './index.html'),
        meta: {
          version: packageJson.version,
          buildNumber: packageJson.buildNumber.toString(),
          cmns: packageJson.dependencies['ib-web-commons'].toString(),
          payments: packageJson.dependencies['ib-web-payments'].toString(),
          menus: packageJson.dependencies['ib-menus'].toString(),
          anc: packageJson.dependencies['ib-web-ancillaries'].toString(),
          digitalComponentsLibrary:
            packageJson.dependencies['commercial-management--digital--web-components-design--library'].toString(),
        },
      }),
      new HtmlWebpackTagsPlugin({
        append: false,
        scripts: [`env${replaceVersion}.js`],
      }),
      new CopyPlugin({
        patterns: [
          {
            from: `config/environments/env-${ENVIRONMENT}.js`,
            to: `env${replaceVersion}.js`,
            force: true,
          },
        ],
      }),
      !isDevServer &&
        new CleanWebpackPlugin({
          protectWebpackAssets: false,
          cleanAfterEveryBuildPatterns: ['*.LICENSE.txt'],
        }),
      new webpack.SourceMapDevToolPlugin({
        filename: isBuildProduction ? '[contenthash].js.map' : '[file].map[query]',
        append: isBuildProduction ? false : '\n//# sourceMappingURL=[url]',
      }),
      new webpack.ProvidePlugin(providePluginConfig),
      new ESLintPlugin({
        extensions: ['ts', 'html'],
        files: './{src,test}/**/*.{ts,component.html}',
        fix: true,
      }),
      new StylelintPlugin({
        configFile: path.resolve(__dirname, '../../stylelint.config.js'),
        files: './src/**/*.{css,scss}',
        fix: true,
      }),
    ].filter(Boolean);
};

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
}


export { plugins }
