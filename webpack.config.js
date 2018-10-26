/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

// Full webpack documentation: [https://webpack.js.org/configuration/]().
// In short, the config-files defines the entry point of the extension, to use TypeScript, to produce a commonjs-module, and what modules not to bundle.

'use strict';

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/**@type {import('webpack').Configuration}*/
const config = {
    target: 'node', // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
    entry: './entry.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
    output: { // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
        path: path.resolve(__dirname, 'dist'),
        filename: 'extension.js',
        libraryTarget: "commonjs",
        devtoolModuleFilenameTemplate: "../[resource-path]",
    },
    devtool: 'source-map',
    externals: [
        {
            vscode: 'commonjs vscode', // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
            './getCoreNodeModule': 'commonjs getCoreNodeModule'
        },
        // /package.json/
    ],
    plugins: [
        // new webpack.DefinePlugin({
        //     'NICE_FEATURE': JSON.stringify(true),
        //     'EXPERIMENTAL_FEATURE': JSON.stringify(false)
        // }),
        // new webpack.DefinePlugin({
        //     loadStartTime: 'Date.now()',
        //     asdf: '1234567',
        //     abcd: JSON.stringify('abcd')
        // }),
        //new webpack.IgnorePlugin(/getPackageInfo/, /vscode-azureextensionui/),
        new CopyWebpackPlugin([
            { from: './images/*' },
            { from: './package.json' },
            { from: './utils/getCoreNodeModule.ts', to: './utils' }
            //{ from: 'node_modules/vscode-azureextensionui/out/src/getPackageInfo.js', to: 'node_modules/vscode-azureextensionui/out/src/getPackageInfo.js' }
        ])
        //new webpack.ContextReplacementPlugin(/package.json/)
    ],
    resolve: { // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [{
                loader: 'ts-loader',
            }]
        }]
    },
    optimization: {
        // minimize: true
    }
}

//if (ENV === 'production') {
//config.plugins.push(new webpack.optimize.UglifyJsPlugin()); // asdf
//}


module.exports = config;
