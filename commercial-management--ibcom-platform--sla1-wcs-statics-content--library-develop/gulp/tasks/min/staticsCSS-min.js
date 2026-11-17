module.exports = function(gulp, plugins, config) {
    gulp.task('staticsCSS-min', ['cssmin'], function() {
      return gulp.src(config.target.dist.cssAll)
            .pipe(gulp.dest(config.target.dist.WCScssFolder));
    });
};
