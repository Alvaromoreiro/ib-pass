module.exports = function(gulp, plugins, config) {
    gulp.task('staticsHTML-min', function() {
        gulp.src(config.target.dist.html)
            .pipe(gulp.dest(config.target.dist.WCSmainmin));
    });
};
