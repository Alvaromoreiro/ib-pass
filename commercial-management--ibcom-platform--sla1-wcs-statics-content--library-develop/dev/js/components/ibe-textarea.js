dFrontJs.ibe_textarea = function () {
	/*eslint no-underscore-dangle: ["error", { "allow": ["_keyupTextarea"] }]*/
	var text_max = $('[data-textarea-max]').length > 0 ? $('[data-textarea]').data('textarea-max') : 1500;

	var _keyupTextarea = function () {
		var tval = $('[data-textarea]').val();
		var text_length = tval.length;
		var text_remaining = text_max - text_length;

		if (text_length <= text_max) {
			$('[data-textarea-text]').html(text_remaining);
		} else {
			$(this).val(tval.substr(0, text_max));
		}

	};

	var init = function (selector) {
		var $selector = selector !== undefined ? $(selector) : $('[data-textarea]');
		$selector.off('keyup', _keyupTextarea);
		$selector.on('keyup', _keyupTextarea);
	};

	$('[data-textarea-text]').html(text_max);

	return {
		'init': init
	};
}(jQuery);
