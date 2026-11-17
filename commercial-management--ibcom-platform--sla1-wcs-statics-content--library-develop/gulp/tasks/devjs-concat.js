module.exports = function(gulp, plugins) {
    gulp.task('devjsconcat', function() {
        return gulp.src([
            './dev/js/main.js',
            './dev/js/manage-iberia-services.js',
            './dev/js/satisfly.js',
            ])
            .pipe(plugins.concat('devjs.js'))
            .pipe(gulp.dest('./dev/js/'))
            .pipe(plugins.browserSync.stream());
    });
};
