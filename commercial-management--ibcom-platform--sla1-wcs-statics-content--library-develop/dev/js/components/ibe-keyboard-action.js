dFrontJs.ibe_keyboard_action = function () {

	var init = function () {

	};

	var close = function (elem) {

		// CLOSE COLLAPSE
		$(elem).on('show.bs.collapse', function () {
			$(document).on('keydown', function (e) {
				var dataKey = $(elem).data('keyboard-close');
				checkKey(e.keyCode, dataKey) ? $(elem).collapse('hide') : false;
			});
		})

	}

	// check that the key pressed matches the data attribute
	var checkKey = function (keyCode, dataKey) {
		var keys = {
			27: ['esc', 'escape']
		}

		try {

			return keys[keyCode].includes(dataKey.toLowerCase());

		} catch (err) {
			return false;
		}
	}

	return {
		'init': init,
		'close': close
	};
}(jQuery);
