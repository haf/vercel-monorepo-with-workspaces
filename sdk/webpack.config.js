// https://webpack.js.org/configuration/mode/

const PKG = require('./package.json')
const path = require('path');
const webpack = require('webpack');

const sharedConfig = (env, argv, target) => {
  return {
    // https://webpack.js.org/configuration/entry-context/#entry
    entry: './src/index.ts',

    // https://webpack.js.org/configuration/devtool/#devtool
    // devtool: argv.mode === 'production' ? 'nosources-source-map' : 'eval-nosources-source-map',
    devtool: argv.mode === 'production' ? 'source-map' : 'eval-source-map',

    // https://webpack.js.org/configuration/module/
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts'],
      fallback: {
        crypto: false
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        __TARGET__: JSON.stringify(target), // 'web' or 'node'
        __VERSION__: JSON.stringify(PKG.version + Date.now()),
        __MODE__: JSON.stringify(argv.mode === 'production' ? 'prod' : 'dev')
      }),
    ]
  }
}

const nodeConfig = (env, argv) => {
  return {
    ...sharedConfig(env, argv, 'node'),
    target: 'node',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: argv.mode === 'development' ? 'causiq.dev.node.js' : 'causiq.node.js',
      library: {
        type: 'commonjs2',
      },
    },
  }
}


const webConfig = (env, argv) => {
  // console.log('client config, argv:', JSON.stringify(argv))
  return {
    ...sharedConfig(env, argv, 'web'),
    target: 'web',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: argv.mode === 'development' ? 'causiq.dev.js' : 'causiq.js',
    },
  }
}

module.exports = [nodeConfig, webConfig];