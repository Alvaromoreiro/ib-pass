module.exports = function(gulp, plugins, config) {
    gulp.task('js-components', function() {
        return gulp.src([
            './dev/js/ibe-components/**/**.*',
            ])
			.pipe(plugins.rename(function (path) {
				path.dirname = path.basename;
			}))
            .pipe(gulp.dest(config.target.componentsFolder))
            // .pipe(plugins.browserSync.stream());
    });
};
