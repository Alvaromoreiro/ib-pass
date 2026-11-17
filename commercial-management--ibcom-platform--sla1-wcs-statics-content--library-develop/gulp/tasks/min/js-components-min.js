module.exports = function(gulp, plugins, config) {
    gulp.task('js-components-min', function() {
        return gulp.src(config.target.jsComponentsFolder)
			.pipe(plugins.uglify().on('error', (e) => {console.log(e);}))
			// .pipe(rename({
			//     suffix: '.min'
			// }))
			.pipe(plugins.rename(function (path) {
				path.dirname = path.basename;
			}))
            .pipe(gulp.dest(config.target.dist.componentsFolder));
            // .pipe(plugins.browserSync.stream());
    });
};
