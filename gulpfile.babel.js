
import del from 'del';
import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import runSequence from 'run-sequence';
import eventStream from 'event-stream';
import gutil from 'gulp-util';
import webpack from 'webpack';

function onWarning(error) {
    gutil.log(error);
}

function onError(error) {
    gutil.log(error);
    process.exit(1);
}

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
        .on('error', onWarning);
});

// for easier debugging of the generated spec bundle
gulp.task('specs:debug', gulpCallback => {
    const webpackConfig = Object.assign({}, require('./webpack.config.js'), {
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
    const KarmaServer = require('karma').Server;

    new KarmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true,
    }, karmaExitCode => {
        if (karmaExitCode !== 0) {
            process.exit(1);
        }

        gulpCallback();
    }).start();
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
        .on('error', onError);
});

gulp.task('default', [
    'clean',
], gulpCallback => {
    runSequence(
        'test',
        'js',
        gulpCallback
    );
});
