/*-------------------------------------------------
   #Iberia-WCS - bower-jquery-concat.js
--------------------------------------------------*/

module.exports = function (gulp, plugins) {
	gulp.task('jqueryConcat', function () {
		return gulp.src([
			/*! jQuery UI - v1.12.1 - 2016-09-14
			* http://jqueryui.com
			* Includes: widget.js, position.js, data.js, disable-selection.js, effect.js, effects/effect-blind.js, effects/effect-bounce.js, effects/effect-clip.js, effects/effect-drop.js, effects/effect-explode.js, effects/effect-fade.js, effects/effect-fold.js, effects/effect-highlight.js, effects/effect-puff.js, effects/effect-pulsate.js, effects/effect-scale.js, effects/effect-shake.js, effects/effect-size.js, effects/effect-slide.js, effects/effect-transfer.js, focusable.js, form-reset-mixin.js, jquery-1-7.js, keycode.js, labels.js, scroll-parent.js, tabbable.js, unique-id.js, widgets/accordion.js, widgets/autocomplete.js, widgets/button.js, widgets/checkboxradio.js, widgets/controlgroup.js, widgets/datepicker.js, widgets/dialog.js, widgets/draggable.js, widgets/droppable.js, widgets/menu.js, widgets/mouse.js, widgets/progressbar.js, widgets/resizable.js, widgets/selectable.js, widgets/selectmenu.js, widgets/slider.js, widgets/sortable.js, widgets/spinner.js, widgets/tabs.js, widgets/tooltip.js
			* Copyright jQuery Foundation and other contributors; Licensed MIT */
			// Not includes:  tooltip.js
			// "./dev/bower_components/jquery-ui/ui/core.js",
			"./dev/bower_components/jquery-ui/ui/widget.js",
			"./dev/bower_components/jquery-ui/ui/position.js",
			"./dev/bower_components/jquery-ui/ui/data.js",
			"./dev/bower_components/jquery-ui/ui/disable-selection.js",
			"./dev/bower_components/jquery-ui/ui/effect.js",
			"./dev/bower_components/jquery-ui/ui/effects/effect-blind.js",
			"./dev/bower_components/jquery-ui/ui/effects/effect-bounce.js",
			"./dev/bower_components/jquery-ui/ui/effects/effect-clip.js",
			"./dev/bower_components/jquery-ui/ui/effects/effect-drop.js",
			"./dev/bower_components/jquery-ui/ui/effects/effect-explode.js",
			"./dev/bower_components/jquery-ui/ui/effects/effect-fade.js",
			"./dev/bower_components/jquery-ui/ui/effects/effect-fold.js",
			"./dev/bower_components/jquery-ui/ui/effects/effect-highlight.js",
			"./dev/bower_components/jquery-ui/ui/effects/effect-puff.js",
			"./dev/bower_components/jquery-ui/ui/effects/effect-pulsate.js",
			"./dev/bower_components/jquery-ui/ui/effects/effect-scale.js",
			"./dev/bower_components/jquery-ui/ui/effects/effect-shake.js",
			"./dev/bower_components/jquery-ui/ui/effects/effect-size.js",
			"./dev/bower_components/jquery-ui/ui/effects/effect-slide.js",
			"./dev/bower_components/jquery-ui/ui/effects/effect-transfer.js",
			"./dev/bower_components/jquery-ui/ui/focusable.js",
			// "./dev/bower_components/jquery-ui/ui/form.js",                  //no
			"./dev/bower_components/jquery-ui/ui/form-reset-mixin.js",
			// "./dev/bower_components/jquery-ui/ui/ie.js",                    //no
			"./dev/bower_components/jquery-ui/ui/jquery-1-7.js",
			"./dev/bower_components/jquery-ui/ui/keycode.js",
			"./dev/bower_components/jquery-ui/ui/labels.js",
			// "./dev/bower_components/jquery-ui/ui/plugin.js",                //no
			// "./dev/bower_components/jquery-ui/ui/safe-active-element.js",   //no
			// "./dev/bower_components/jquery-ui/ui/safe-blur.js",             //no
			"./dev/bower_components/jquery-ui/ui/scroll-parent.js",
			"./dev/bower_components/jquery-ui/ui/tabbable.js",
			"./dev/bower_components/jquery-ui/ui/unique-id.js",
			// "./dev/bower_components/jquery-ui/ui/version.js",

			"./dev/bower_components/jquery-ui/ui/widgets/accordion.js",
			"./dev/bower_components/jquery-ui/ui/widgets/autocomplete.js",
			"./dev/bower_components/jquery-ui/ui/widgets/button.js",
			"./dev/bower_components/jquery-ui/ui/widgets/checkboxradio.js",
			"./dev/bower_components/jquery-ui/ui/widgets/controlgroup.js",
			"./dev/bower_components/jquery-ui/ui/widgets/datepicker.js",
			"./dev/bower_components/jquery-ui/ui/widgets/dialog.js",
			"./dev/bower_components/jquery-ui/ui/widgets/draggable.js",
			"./dev/bower_components/jquery-ui/ui/widgets/droppable.js",
			"./dev/bower_components/jquery-ui/ui/widgets/menu.js",
			"./dev/bower_components/jquery-ui/ui/widgets/mouse.js",
			"./dev/bower_components/jquery-ui/ui/widgets/progressbar.js",
			"./dev/bower_components/jquery-ui/ui/widgets/resizable.js",
			"./dev/bower_components/jquery-ui/ui/widgets/selectable.js",
			"./dev/bower_components/jquery-ui/ui/widgets/selectmenu.js",
			"./dev/bower_components/jquery-ui/ui/widgets/slider.js",
			"./dev/bower_components/jquery-ui/ui/widgets/sortable.js",
			"./dev/bower_components/jquery-ui/ui/widgets/spinner.js",
			"./dev/bower_components/jquery-ui/ui/widgets/tabs.js"
			// "./dev/bower_components/jquery-ui/ui/widgets/tooltip.js"
		])
		// .pipe(plugins.uglify())
			.pipe(plugins.concat('jquery.dependencies.js'))
			.pipe(gulp.dest('./dev/js/dev/'));
	});
};
