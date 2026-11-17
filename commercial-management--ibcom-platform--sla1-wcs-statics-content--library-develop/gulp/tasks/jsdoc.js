module.exports = function(gulp, plugins, config, functions) {
	var jsdoc = require('gulp-jsdoc3');
	gulp.task('doc', function (cb) {
		gulp.src(['README.md', './dev/js/init.js'], {read: false})
			.pipe(jsdoc(cb));
	});
};
