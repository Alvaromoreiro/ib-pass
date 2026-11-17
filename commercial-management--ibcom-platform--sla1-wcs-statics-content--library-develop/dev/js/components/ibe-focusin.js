dFrontJs.ibe_focusin = function () {

	var focusHandler = function (e, isClick, elem) {
		var $elem = $(elem);
		if (isClick) {
			if ($elem.hasClass('focus')) {
				// console.log(e,isClick, $elem)
				$elem.removeClass('focus');
			}
		} else {
			if (!$elem.hasClass('focus')) {
				// console.log(e,isClick, $elem)
				$elem.addClass('focus');
			}
		}

	}
	//init
	var init = function () {
		var $element = $('[data-focusin]');
		$element.each(function () {
			var $this = $(this);
			// Keydown and Mousedown Events
			$this.mousedown(function (e) {
				focusHandler(e, true, e.target);
			});
			$this.keyup(function (e) {
				focusHandler(e, false, e.target);
			});
			$this.focusout(function (e) {
				focusHandler(e, true, e.target);
			});
		});
	};
	return {
		'init': init
	};
}(jQuery);
