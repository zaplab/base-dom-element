
module.exports = function (config) {
    config.set({
        autoWatch: true,

        browsers: [
            'PhantomJS',
        ],

        colors: true,

        files: [
            'tests/libs/es5-shim.js',
            'tests/libs/jasmine.js',
            'tests/libs/jasmine-matchers.js',
            'tests/spec/*.js',
            {
                pattern: 'src/js/**/*.js',
                watched: true,
                included: false,
                served: false,
            },
        ],

        frameworks: [
            'jasmine',
        ],

        plugins: [
            require('karma-webpack'),
            'karma-spec-reporter',
            'karma-jasmine',
            'karma-phantomjs-launcher',
        ],

        preprocessors: {
            'tests/spec/*.js': ['webpack'],
        },

        reporters: [
            'spec',
        ],

        webpack: require('./webpack-karma.config.js'),

        webpackMiddleware: {
            stats: {
                colors: true,
            },
        },
    });
};
