module.exports = function(gulp, plugins, config) {
    gulp.task('staticsFonts-min', function() {
      return gulp.src(config.target.fontsFiles)
            .pipe(gulp.dest(config.target.dist.WCSfontsFolder));
    });
};
