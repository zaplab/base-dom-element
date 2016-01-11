
'use strict';

const del = require('del');
const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const eslint = require('gulp-eslint');
const runSequence = require('run-sequence');
const eventStream = require('event-stream');
const gutil = require('gulp-util');
const webpack = require('webpack');
const path = require('path');

gulp.task('clean', gulpCallback => {
    del([
        'dist',
    ], gulpCallback);
});

gulp.task('eslint', () => {
    return gulp.src('src/*.js')
        .pipe(eslint({
            configFile: 'tests/.eslintrc',
        }))
        .pipe(eslint.format())
        .on('error', error => {
            console.error('' + error);
        });
});

// for easier debugging of the generated spec bundle
gulp.task('specs:debug', gulpCallback => {
    let webpackConfig = Object.assign({}, require('./webpack.config.js'), {
        context: __dirname,
        entry: [
            'tests/spec/main.js',
            'tests/spec/_element.js',
            'tests/spec/_events.js',
            'tests/spec/_style.js',
        ],
        output: {
            path: 'tests/spec-debug/',
            filename: 'bundle.js',
        },
        plugins: [
            new webpack.optimize.UglifyJsPlugin(),
        ],
    });

    webpack(webpackConfig, (err, stats) => {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }

        gutil.log('[webpack]', stats.toString({
            // output options
        }));

        gulpCallback();
    });
});

gulp.task('specs', gulpCallback => {
    let KarmaServer = require('karma').Server;

    new KarmaServer.start({
        configFile: __dirname + '/karma.config.js',
        singleRun: true,
    }, () => {
        gulpCallback();
    });
});

gulp.task('setup-tests', gulpCallback => {
    eventStream.concat(
        // jasmine
        gulp.src([
                'node_modules/jasmine-core/lib/jasmine-core/jasmine.css',
                'node_modules/jasmine-core/lib/jasmine-core/boot.js',
                'node_modules/jasmine-core/lib/jasmine-core/jasmine.js',
                'node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js',
            ])
            .pipe(gulp.dest('tests/libs')),
        // jasmine-expect
        gulp.src('node_modules/jasmine-expect/dist/jasmine-matchers.js')
            .pipe(gulp.dest('tests/libs')),
        // es5-shim
        gulp.src('node_modules/es5-shim/es5-shim.js')
            .pipe(gulp.dest('tests/libs'))
    ).on('end', gulpCallback);
});

gulp.task('setup', [
    'setup-tests',
]);

gulp.task('test-js', [
    'eslint',
    'specs',
]);

gulp.task('test', [
    'test-js',
]);

gulp.task('js', [
    'eslint',
], () => {
    return gulp.src('src/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'))
        .on('error', error => {
            console.error('' + error);
        });
});

gulp.task('default', ['clean'], gulpCallback => {
    runSequence(
        'js',
        gulpCallback
    );
});
