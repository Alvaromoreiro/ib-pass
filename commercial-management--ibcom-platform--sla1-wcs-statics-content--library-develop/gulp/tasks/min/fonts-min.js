module.exports = function(gulp, plugins, config) {
    gulp.task('fonts-min', function() {
      return gulp.src(config.target.fontsFiles)
            .pipe(gulp.dest(config.target.dist.fontsFolder));
    });
};
