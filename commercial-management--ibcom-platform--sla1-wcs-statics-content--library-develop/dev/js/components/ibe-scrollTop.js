dFrontJs.ibe_scrollTop = function () {
	/*eslint no-underscore-dangle: ['error', { 'allow': ['_clickEventScroll', '_actionShowTimer'] }]*/
	//Scroll top function
	var _clickEventScroll = function (e) {
		var target = e.target || e.srcElement;
		var typeTarget = $(this).attr('data-scrollTop');
		var targetPos;

		switch (typeTarget) {
			case 'input':
				if ($(target).is('input')) {
					$('html, body').animate({
						scrollTop: $(this).offset().top
					}, 500);
				}
				break;
			case 'timer':
				targetPos = $(this);
				if ($(target).parents('.ibe-accordion__header-mobile').length || window.innerWidth < dFrontJs.resolutions.lg && ($(target).parents('.ibe-accordion__collapse').length === 0 || $(target).is('[data-searcher-accordion="first"] input[data-autocomplete="cities"]'))) {
					targetPos.find('[data-toggle="container"]').eq(0).off('shown.bs.collapse', _actionShowTimer);
					targetPos.find('[data-toggle="container"]').eq(0).on('shown.bs.collapse', _actionShowTimer);
				} else if (window.innerWidth < dFrontJs.resolutions.lg && ($(target).closest('.ibe_form__group-half').length || $(target).is('input[data-cal]') || $(target).siblings('input[data-cal]').length) && $(target).closest('.fc_form_group').find('.ibe-searcher__calendar-header:visible').length === 0) {
					setTimeout(function () {
						$('html, body').animate({
							scrollTop: $(target).closest('.ibe_form__group--half').offset().top
						}, 500);
					}, 500);
				}
				break;
			case 'partner':
				//-if(window.innerWidth < dFrontJs.resolutions.xl){
				targetPos = $(this).attr('href');
				setTimeout(function () {
					$('html, body').animate({
						scrollTop: $(targetPos).offset().top
					}, 600);
				}, 500);
				//-}
				break;
			case 'conditions':
				e.preventDefault();
				targetPos = $(this).attr('href');
				setTimeout(function () {
					$('html, body').animate({
						scrollTop: $(targetPos).offset().top
					}, 500);
				}, 500);
				break;
			case undefined:
				break;
			default:
				$('html, body').animate({
					scrollTop: $(this).offset().top
				}, 500);
		}
	};

	var _actionShowTimer = function (e) {
		if ($(e.target).prev('[data-toggle="accordion"]').length > 0) {
			requestAnimFrame(function () {
				$('html, body').animate({
					scrollTop: $(e.target).prev('[data-toggle="accordion"]').offset().top
				}, 500);
			});
		}
	};

	// Example:
	// dFrontJs.ibe_scrollTop.scrollId('#id',600);
	// Params:
	//      [selector] as string (default: html )
	//      [time] as number (default: 500)
	var scrollId = function (selector, time) {
		var $selector = selector || 'html';
		var $time = time || 500;
		$('html, body').animate({
			scrollTop: $($selector).offset().top
		}, $time);
	};

	var init = function () {
		var $element = $('[data-scrollTop]');
		if ($element.length) {
			$element.off('click', _clickEventScroll);
			$element.on('click', _clickEventScroll);
		}

	};//Scroll top function
	return {
		'init': init,
		'scrollId': scrollId
	};
}(jQuery);
