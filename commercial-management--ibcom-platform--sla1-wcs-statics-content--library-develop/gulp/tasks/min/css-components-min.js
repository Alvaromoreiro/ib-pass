module.exports = function(gulp, plugins, config) {
    gulp.task('css-components-min', function() {
        gulp.src(config.target.cssComponentsFolder)
            .pipe(plugins.cssmin())
            // .pipe(rename({
            //     suffix: '.min'
            // }))
			.pipe(plugins.rename(function (path) {
				path.dirname = path.basename;
			}))
            .pipe(gulp.dest(config.target.dist.componentsFolder));
    });
};
