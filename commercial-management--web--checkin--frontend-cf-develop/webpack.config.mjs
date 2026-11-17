import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { plugins } from './config/webpack/pluginsConfig.mjs';
import HttpsProxyAgent from 'https-proxy-agent';
import { rules } from './config/webpack/rules.mjs'
import { TerserConfig } from './config/webpack/terserConfig.mjs';
import {} from './config/';

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
        import: './src/main.ts',
      },
    },
    output: {
      filename: `[name].min.js`,
      path: path.resolve(__dirname, outputPath),
      clean: true,
    },
    resolve: {
      extensions: ['.ts', '.js', '.mjs', '.cjs'],
      modules: ['node_modules'],
      descriptionFiles: ['package.json'],
      plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
      alias: {},
      symlinks: true,
    },
    devtool: isBuildProduction ? 'hidden-source-map' : 'source-map',
    module: {
      rules: rules(env, isBuildProduction),
    },
    optimization: {
      minimize: isProduction,
      minimizer: [new TerserPlugin(terserPluginConfig)],
      splitChunks: {
        cacheGroups: {
          dependencies: {
            test: /node_modules.*(?<!css)$/,
            name: `web-checkin${replaceVersion}.dependencies`,
            chunks: 'all',
          },
        },
      },
    },
    plugins: plugins(env, isBuildProduction),
    snapshot: {
      managedPaths: [],
      immutablePaths: [],
    },
    devServer: {
      port: 9006,
      historyApiFallback: true,
      client: {
        overlay: {
          errors: true,
        },
      },
      open: env.open !== 'false',
      hot: false,
      static: {
        directory: path.join(__dirname, './node_modules'),
        publicPath: '',
      },
      proxy: {
        '/cs': {
          agent: new HttpsProxyAgent('http://proxyib.ib:80'),
          target: 'https://int.iberia.es/',
          secure: false,
          logLevel: 'silent',
        },
        '/iberia-web-content': {
          agent: new HttpsProxyAgent('http://proxyib.ib:80'),
          target: 'https://int.iberia.es/',
          secure: false,
          logLevel: 'silent',
        },
      },
    },
    performance: {
      hints: false,
    },
  };
};
