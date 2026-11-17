module.exports = function(gulp, plugins, config) {
	var args = require('yargs').argv;
    gulp.task('yargsJS-min', ['yargs-min'], function() {
		console.log("Moved to dist wcs-statics the file "+args.fileName);
		return gulp.src([
			'./dist/js/'+args.fileName
		])
		.pipe(gulp.dest(config.target.dist.WCSjsFolder));
    });
};
