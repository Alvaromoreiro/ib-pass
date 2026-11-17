module.exports = function(gulp, plugins) {
    gulp.task('jsconcat', function() {
        return gulp.src([
            './dev/js/components/**.*',
            './dev/js/components/**/**.*',
            './dev/js/dev/dfront.js'
            ])
            .pipe(plugins.concat('init.js'))
            .pipe(gulp.dest('./dev/js/front-build/'))
            // .pipe(plugins.browserSync.stream());
    });
};
