dFrontJs.ibe_placeholder = function () {
	//Jquery placeholder
	var init = function () {
		var $custom = $('[data-placeholder]');
		if ($custom.length > 0) {
			$custom.placeholder();
			if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) {
				$custom.blur(function () {

					var placeholderText = $(this).attr('placeholder');
					$(this).val() === placeholderText ? $(this).val('') : false;
					$(this).removeClass('ibe_form__input-text--ie-placeholder');

				});
				$custom.click(function () {
					var value;
					var placeholderText = $(this).attr('placeholder');
					$(this).val() === "" ? $(this).val(placeholderText) : false;

					value = $(this).val();
					checkPlaceHolder(value, placeholderText) ? $(this).addClass('ibe_form__input-text--ie-placeholder') : $(this).removeClass('ibe_form__input-text--ie-placeholder');
				});
				$custom.change(function () {
					var placeholderText = $(this).attr('placeholder');
					var value = $(this).val();
					checkPlaceHolder(value, placeholderText) ? $(this).addClass('ibe_form__input-text--ie-placeholder') : $(this).removeClass('ibe_form__input-text--ie-placeholder');

				});
			}
		}
	}; //pluginPlaceholder


	var checkPlaceHolder = function (value, placeholder) {
		if (value === "" || value === placeholder) {
			return true;
		}
	}
	return {
		'init': init
	};
}(jQuery);
