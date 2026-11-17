/*-------------------------------------------------
   #Iberia-WCS - bower-libs-concat.js
--------------------------------------------------*/

module.exports = function (gulp, plugins) {
	gulp.task('bowerConcat', function () {
		return gulp.src([
			"./node_modules/jquery/dist/jquery.js",
			"./dev/bower_components/bootstrap-sass/assets/javascripts/bootstrap.js",
			"./dev/js/dev/jquery.dependencies.js",
			"./dev/bower_components/jquery-placeholder/jquery.placeholder.min.js",
			"./dev/bower_components/selectize/dist/js/standalone/selectize.js",
			"./dev/bower_components/jquery.cookie/jquery.cookie.js",
			"./dev/bower_components/jQuery.dotdotdot/src/jquery.dotdotdot.js",		//if ($("[data-dotdotdot]").length > 0)
			"./dev/bower_components/ioslist/dist/js/jquery.ioslist.js",		//if ($('[data-function="city-list"]').length > 0 || ['data-list-cities'].length > 0){
			"./dev/bower_components/datatables/media/js/jquery.dataTables.js",		//if ($('[data-datatable-load]').length > 0 || $('[data-datatable]').length > 0 || $('[data-table-order]').length > 0 || $('[data-table-flight-status-order]').length > 0)
			"./node_modules/slick-carousel/slick/slick.js",		//if ($("[data-slick]").length > 0)
			"./dev/bower_components/jquery-gi-thewall/jQuery.GI.TheWall.js",	//if ($("[data-function^='google-gallery']").length > 0)
			"./dev/bower_components/masonry/dist/masonry.pkgd.js",  // if ($("[data-function='masonry']").length > 0)
			"./node_modules/libgif/libgif.js",  //if ($('[data-gifanimated]').length > 0)
			"./dev/js/lib/tabdrop-extended/js/bootstrap-tabdrop.js",    //if ($("[data-tab='bootstrap-tabdrop']").length > 0)
			"./dev/js/lib/theta-carousel/theta-carousel.min.js",	// if ($('[data-theta-carousel]').length > 0)
			// "./node_modules/picturefill/dist/picturefill.min.js",
			"./node_modules/in-view/dist/in-view.min.js"
		])
		// .pipe(plugins.uglify())
			.pipe(plugins.concat('libs.dependencies.js'))
			.pipe(gulp.dest('./dev/js/front-build/'));
	});
};
