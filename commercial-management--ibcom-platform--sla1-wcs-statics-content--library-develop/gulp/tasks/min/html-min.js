module.exports = function(gulp, plugins, config) {
    gulp.task('htmlmin', function() {
        return gulp.src(config.target.html)
            .pipe(plugins.htmlmin({ collapseWhitespace: true }))
            .pipe(gulp.dest(config.dist));
    });
};
