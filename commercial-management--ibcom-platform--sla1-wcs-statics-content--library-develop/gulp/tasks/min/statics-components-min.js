module.exports = function(gulp, plugins, config) {
    gulp.task('statics-components-min', ['js-components-min'], function() {
		return gulp.src([
			'./dist/ibe-components/**/',
		]).pipe(gulp.dest(config.target.dist.WCScomponentsFolder));
    });
};
