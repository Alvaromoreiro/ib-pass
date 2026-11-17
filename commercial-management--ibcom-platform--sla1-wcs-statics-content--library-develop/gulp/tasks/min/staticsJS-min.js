module.exports = function(gulp, plugins, config) {
    gulp.task('staticsJS-min', ['jsmin'], function() {
        return gulp.src(config.target.dist.staticsJSElements)
            .pipe(gulp.dest(config.target.dist.WCSjsFolder));
    });
};
