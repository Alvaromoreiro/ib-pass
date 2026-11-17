dFrontJs.ibe_searcher_vintage = function () {
	/*eslint no-underscore-dangle: ['error', { 'allow': ['_buttonClickShowHide', '_resizeSearcherVintage'] }]*/
	var _buttonClickShowHide = function () {
		var $this = $(this);

		if ($this.parent().hasClass('active')) {
			$this.parent().removeClass('active');
			$('html, body').css('overflow', '')
		} else {
			if ($('[data-autocomplete="cities"]').length > 0) {
				dFrontJs.ibe_autocomplete.loadCityList($('[data-autocomplete="cities"]'));
			}

			$this.parent().addClass('active');
			$('html, body').css('overflow', 'hidden')
		}

	};

	var _resizeSearcherVintage = function () {
		var $this = $('.ibe-searcher__vintage').find('.ibe-accordion__header');
		if (window.innerWidth >= dFrontJs.resolutions.lg) {
			if ($this.parent().hasClass('active')) {
				$this.parent().removeClass('active');
				$('html, body').css('overflow', '');
				$this.next().collapse('hide');
			}
			if ($('[data-autocomplete="cities"]').length > 0) {
				dFrontJs.ibe_autocomplete.loadCityList($('[data-autocomplete="cities"]'));
			}
		}
	};

	var init = function () {
		var $accordion = $('.ibe-searcher__vintage').find('.ibe-accordion__header');

		$accordion.off('click', _buttonClickShowHide);
		$accordion.on('click', _buttonClickShowHide);
		$(window).off('resize', _resizeSearcherVintage);
		$(window).on('resize', _resizeSearcherVintage);
	};
	//init
	return {
		'init': init,
		'buttonClickShowHide': _buttonClickShowHide
	};
}(jQuery);
