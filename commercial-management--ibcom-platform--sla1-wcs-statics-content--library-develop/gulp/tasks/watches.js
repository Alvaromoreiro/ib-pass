module.exports = function(gulp, plugins, config) {
    gulp.task('watch', function() {
        gulp.watch([
			'./dev/js/ibe-components/**/*.*',
            './dev/js/components/**.*',
            './dev/js/components/**/**.*',
            './dev/js/dev/dfront.js'
        ], ['jsconcat', 'js-components']);
        gulp.watch(config.target.sassWatch, ['sass', 'sass-components']);
        gulp.watch(config.target.pugWatch, ['pug']);
    });
};
