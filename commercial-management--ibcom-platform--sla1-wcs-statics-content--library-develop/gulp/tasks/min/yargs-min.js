module.exports = function(gulp, plugins, config) {
	var args = require('yargs').argv;
    gulp.task('yargs-min', function() {
		console.log("Moved to wcs-statics the uglified file "+args.fileName);
        return gulp.src('./dev/js/'+args.fileName)
            .pipe(plugins.uglify())
            .pipe(gulp.dest(config.target.dist.js));
    });
};
