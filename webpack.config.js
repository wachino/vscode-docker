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

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

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
            './getCoreNodeModule': 'commonjs getCoreNodeModule',
            //'./serviceClient': 'commonjs serviceClient',
            'ms-rest': 'commonjs ms-rest'
        },
        // /package.json/
    ],
    plugins: [
        // new webpack.NoEmitOnErrorsPlugin(),
        // // extracts embedded css as external files, adding cache-busting hash to the filename.
        // new ExtractTextPlugin('[name].[hash].css'),
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         'ENV': JSON.stringify(ENV)
        //     }
        // }),
        // new webpack.DefinePlugin({
        //     'NICE_FEATURE': JSON.stringify(true),
        //     'EXPERIMENTAL_FEATURE': JSON.stringify(false)
        // }),
        // new webpack.DefinePlugin({
        //     loadStartTime: 'Date.now()',
        //     asdf: '1234567',
        //     abcd: JSON.stringify('abcd')
        // }),
        //new webpack.IgnorePlugin(/ab/, /.+/),
        new CopyWebpackPlugin([
            { from: './images/*' },
            { from: './package.json' },
            { from: './utils/getCoreNodeModule.js', to: './node_modules' },
            { from: './node_modules/ms-rest', to: './node_modules/ms-rest' },
            //{ from: './node_modules/uuid', to: './node_modules/uuid' }
        ])
        // new webpack.ContextReplacementPlugin(
        //     // The criterion to search: './node_modules/ms-rest/lib sync recursive'
        //     ///.\/node_modules\/ms-rest\/lib/,
        //     /node_modules\/ms-rest/,

        //     // The new directory to look for the files
        //     path.resolve(__dirname, 'node_modules/ms-rest'),

        //     // The new recursive flag. True by default.
        //     // Pass false to disable recursive lookup
        //     //false,

        //     // The new regular expression to match
        //     // and import the files.
        //     // Specify the mapping in form of
        //     // { runtime request : compile-time request }
        //     // IMPORTANT: runtime request should exactly match
        //     // the text that is passed into `require()`
        //     // IMPORTANT: compile-time request should be relative
        //     // to the directory from the previous parameter
        //     {
        //         'package.json': 'package.json'
        //     }
        //)
    ],
    resolve: { // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'ts-loader',
                }]
            }
            /*{
                // vscode-nls-dev loader:
                // * rewrite nls-calls
                loader: 'vscode-nls-dev/lib/webpack-loader',
                options: {
                    base: path.join(__dirname, 'src')
                }
            }*/
        ]
    },
    optimization: {
        // minimize: process.env. ENV === 'production'
    }
}

//if (ENV === 'production') {
//config.plugins.push(new webpack.optimize.UglifyJsPlugin()); // asdf
//}


module.exports = config;
