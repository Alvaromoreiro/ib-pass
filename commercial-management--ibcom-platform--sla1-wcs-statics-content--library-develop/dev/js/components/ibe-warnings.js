dFrontJs.ibe_warnings = function () {
	var init = function () {
		var $button = $('[data-warnings="close"]'), //close button serious warning
			$serious = $('[data-warnings="serious"]'), //serious warning
			$slight = $('[data-warnings="slight"]'); //slight warning
		if ($serious.length === 0) {
			//if not exist serious show slight
			$slight.show().attr('aria-hidden', 'false');
			$slight.show();
		}
		$button.on('click keypress', function (event) {
			var code;
			//when click close hide serious and show slight
			$serious.hide().attr('aria-hidden', 'true');
			$slight.show().attr('aria-hidden', 'false');
			if (event.type === 'keypress') {
				code = event.charCode || event.keyCode;
				if ((code === 32) || (code === 13)) {
					$slight.focus();
				}
			}
		});


	};//pluginAccordion
	return {
		'init': init
	};
}(jQuery);
