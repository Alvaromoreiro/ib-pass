dFrontJs.ibe_escape = function () {
	//init
	var init = function (element, parent) {
		var $element = $(element);
		$element.each(function () {
			$(this).on('keydown', function (e) {
				var $vintage
				e.stopPropagation();
				if (e.keyCode === 27) {
					$(this).closest(parent).find('.collapse.in').collapse('hide');
					$vintage = $('.ibe-searcher__vintage'),
						$modal = $('.ibe-dinamic-modal');
					// close the modal in vintage mobile version
					if ($vintage.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
						dFrontJs.ibe_modals_vintage.closeModalDatepicker();
					} else if ($modal.length > 0) {
						dFrontJs.ibe_dinamic_modal.close($modal.children());
					}
				}
			});
		});
	};
	return {
		'init': init
	};
}(jQuery);
