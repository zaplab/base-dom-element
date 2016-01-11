
var path = require('path');
var webpack = require('webpack');

module.exports = {
    module: {
        loaders: [
            {
                test: /\.js?$/,
                include: [
                    path.resolve(__dirname, 'node_modules'),
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'tests/spec'),
                ],
                loader: 'babel',
                query: {
                    presets: [
                        'es2015',
                        'stage-0',
                    ],
                    plugins: [
                        'babel-plugin-add-module-exports',
                        'transform-es2015-modules-commonjs',
                        'transform-object-assign',
                    ],
                },
            }
        ]
    },

    resolve: {
        root: __dirname,
        alias: {
            'zap-base-dom-element': 'src/index.js',
        },
        modulesDirectories: [
            'node_modules',
            'src',
        ],
    },

    resolveLoader: {
        root: __dirname,
        modulesDirectories: [
            'node_modules',
            'src',
        ],
    },
};
