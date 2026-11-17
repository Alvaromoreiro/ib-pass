const path = require('path');
const semver = require('semver');
const CopyPlugin = require('copy-webpack-plugin');
const PugPlugin = require('pug-plugin');
const WebpackConcatPlugin = require('webpack-concat-files-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const babel = require('@babel/core');
const {
  jsEntryPoints, cssEntryPoints, legacyEntryPoints, pugEntryPoints, initFile,
} = require('./entryPoints');
const supportedNodeVersion = require('./package').engines.node;

const jsDistPath = 'js/';
const outputPath = 'examples';

/* GENERATES INDEX OF PUGS * */
let bodyStringIndex = '<html><body><main style="margin: 30px"><h2 style="margin: 20px 0; font-size: 1.875rem">Listado de paginas de WCS</h2>';
Object.entries(pugEntryPoints).forEach(([key]) => {
  bodyStringIndex += `<a href="${key}.html" style="font-size: 16px; color: grey; font-weight: 700;">${key}</a><br>`;
});
bodyStringIndex += '</main></body></html>';

if (!semver.satisfies(process.version, supportedNodeVersion)) {
  console.log(`NodeJS Version Check: Required node version ${supportedNodeVersion} NOT SATISFIED with current version ${process.version}.`);
  process.exit(1);
}

module.exports = {
  mode: 'development',
  entry: {
    ...cssEntryPoints, ...jsEntryPoints, ...legacyEntryPoints, ...pugEntryPoints,
  },
  output: {
    path: path.resolve(__dirname, outputPath),
    filename: '[name].js',
    clean: true,
    publicPath: '',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: { loader: 'babel-loader' },
      },
      {
        test: /\.s?css$/i,
        use: [
          MiniCssExtractPlugin.loader,
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
              implementation: require('sass'),
            },
          },
        ],
      },
      {
        test: /\.(pug|jade)$/,
        loader: PugPlugin.loader,
        options: {
          method: 'render',
        },
      },
    ],
  },
  devtool: false,
  plugins: [
    new MiniCssExtractPlugin(),
    new PugPlugin({
      test: /\.(pug|jade)$/,
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
          from: 'images/**/*',
          context: './dev',
        },
        {
          from: 'debug.js',
          to: jsDistPath,
          context: './dev/js/dev/',
        },
        {
          from: './dev/js/front-build/libs.dependencies.js',
          to: jsDistPath,
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
    }),
    new HtmlWebpackPlugin({
      filename: 'dev-server.html',
      inject: false,
      templateContent: bodyStringIndex,
    }),
  ],
  devServer: {
    port: 9201,
    client: {
      overlay: {
        warnings: false,
        errors: true,
      },
    },
    hot: false,
    open: ['/dev-server.html'],
    static: {
      directory: path.join(__dirname, outputPath),
      publicPath: '',
      serveIndex: true,
      watch: true,
    },
    watchFiles: ['dev/pug/**/*', 'dev/js/**/*', 'dev/scss/**/*'],
  },
  performance: {
    hints: false,
  },
};
