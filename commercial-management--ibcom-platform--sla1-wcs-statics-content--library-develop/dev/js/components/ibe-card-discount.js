dFrontJs.ibe_card_discount = function () {
	/*eslint no-underscore-dangle: ['error', { 'allow': ['_functionHeight', '_functionDestroy'] }]*/
	//ibe-card-discount 
	var _functionHeight = function () {
		var $element = $('[data-function="discount"]');
		var heightOutstanding = $('.ibe-outstanding').innerHeight();
		$element.css('margin-top', '-' + (heightOutstanding / 2) + 'px');
	};
	var _functionDestroy = function () {
		var $element = $('[data-function="discount"]');
		$element.css('margin-top', '');
	};
	var init = function () {
		if (window.innerWidth < dFrontJs.resolutions.md && window.innerWidth >= dFrontJs.resolutions.sm) {
			_functionHeight();
		}

		$(window).on('resize', function (e) {
			clearTimeout($.data(this, 'resizeDiscount'));
			$.data(this, 'resizeDiscount', setTimeout(function () {
				if (window.innerWidth < dFrontJs.resolutions.md && window.innerWidth >= dFrontJs.resolutions.sm) {
					_functionHeight();
				} else {
					_functionDestroy();
				}
			}));
		});
	};

	return {
		'init': init
	};
}(jQuery);
