module.exports = function(gulp, plugins, config) {
    gulp.task('staticsIMG-min', function() {
        gulp.src(config.target.img)
            .pipe(gulp.dest(config.target.dist.WCSimgFolder));
    });
};
