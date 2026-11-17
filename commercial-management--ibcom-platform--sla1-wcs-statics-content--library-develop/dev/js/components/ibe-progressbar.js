dFrontJs.ibe_progressbar = function () {
	//init
	var init = function () {
		var $element = $('[data-progressbar]'),
			progress = $element.data('progressbar');
		if ($element.length > 0)
			$element.progressbar({
				value: progress
			});
	};
	return {
		'init': init
	};
}(jQuery);
