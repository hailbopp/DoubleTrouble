const DEBUG = process.env.NODE_ENV === 'development';

const path = require('path');

const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

const extractSass = new ExtractTextPlugin({
    filename: "doubletrouble.styles.css",
    disable: DEBUG
});

const baseConfig = {
    mode: "development",
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 9001,
        host: "0.0.0.0",
        disableHostCheck: true,
        proxy: {
            '/ws': {
              target: 'ws://localhost:9000/ws',
              secure: false,
              ws: true,
            },
            '/sockjs-node/*': {
                target: 'ws://localhost:9000',
                secure: false,
                ws: true,
              }
        }
    },
    resolve: { extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'], alias: {}, plugins: [ new TsConfigPathsPlugin() ]},
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
            {
                test: /\.scss$/,
                use: extractSass.extract({ use: ["css-loader", "resolve-url-loader", "sass-loader"], fallback: 'style-loader' })
            }, {
                test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
                use: [{
                    loader: "file-loader"
                }]
            }
        ]
    },
    node: {
      __dirname: false,
      __filename: false,
    }
};

const copyConfig = () => JSON.parse(JSON.stringify(baseConfig));
const clientConfig = Object.assign({}, baseConfig, {
    entry: "./src/client.ts",
    output: {
        path: path.resolve(__dirname, 'dist/client'),
        publicPath: '/',
        filename: `doubletrouble.client${DEBUG ? '' : '.[hash:8]'}.js`
    },
    plugins: [
        extractSass,
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        }),
        new WebpackCleanupPlugin()
    ],
});
const serverConfig = Object.assign({}, baseConfig, {
    entry: "./src/server.ts",
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: `doubletrouble.server.js`
    }
});

module.exports = [clientConfig, serverConfig];