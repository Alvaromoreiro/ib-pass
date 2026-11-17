//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: loading
//    Descripcion: Funcion para el componente de loading
//******************************************************************************/
dFrontJs.ibe_loading = function () {
	//init
	var openCLASS = 'ibe-loading__overlay--open';
	var init = function () {
		var $loading = $('[data-loading]'),
			$loadingSmall = $('.ibe-loading__overlay--grey'),
			$loadingNoSpace = $('.ibe-loading__overlay--nocolor'),
			$spinner = $loading.find('.ibe-loading__spinner'),
			$icon = $loading.find('.ibe-loading__icon'),
			$text = $loading.find('.ibe-loading__text'),
			spinWidth = $spinner.width();

		if ($loading.length > 0) {
			$loading.each(function () {
				$(this).parent().css('position', 'relative');
				if ($(this).is(':visible') && $(this).closest('[data-modal-login]').length === 0) {
					$(this).parent().css('min-height', '284px');

				}
				$spinner = $(this).find('.ibe-loading__spinner'),
				$icon = $(this).find('.ibe-loading__icon'),
				$text = $(this).find('.ibe-loading__text'),
				spinWidth = $(this).width();
				if (spinWidth < 80 && $(this).closest('[data-modal-login]').length === 0) {
					$icon.css('height', spinWidth + 'px');
					$text.css('padding-top', spinWidth + 'px');
				} else {
					$icon.removeAttr('style');
					$text.removeAttr('style');
				}
			});
		}

		if ($loadingSmall.length > 0) {
			$loading.parent().css('min-height', '64px');
		}
		if ($loadingNoSpace.length > 0) {
			$loading.parent().css('min-height', '0');
		}
	};

	//dFrontJs.ibe_loading.close() || //dFrontJs.ibe_loading.close(selector)
	var close = function (selector) {
		var $loadingFull = $('[data-loading-full]'),
			$overlay = '.ibe-loading__overlay',
			$selector;

		if (selector === undefined) {
			$selector = $('body');
			$selector.find($overlay).removeClass(openCLASS);
			if ($loadingFull.length > 0) {
				$selector.css('overflow', '');
			}
		} else if (selector === 'body') {
			$selector = $('body');
			$selector.find('.ibe-loading__overlay--full').removeClass('ibe-loading__overlay--open');
			if ($loadingFull.length > 0) {
				$selector.css('overflow', '');
			}
		} else {
			$selector = $(selector);
			$selector.find($overlay).removeClass(openCLASS);
		}

		$selector.find($overlay).parent().css('min-height', '');

	};

	//dFrontJs.ibe_loading.open() || //dFrontJs.ibe_loading.open(selector)
	var open = function (selector) {
		var $overlay = '.ibe-loading__overlay',
			$overlayFull = $('.ibe-loading__overlay--full'),
			$loadingSmall = $('.ibe-loading__overlay--grey'),
			$selector, $spinner, $icon, $text, spinWidth;
		if (selector === undefined) {
			$selector = $('body');
			$selector.find($overlay).addClass(openCLASS);
			if ($overlayFull.length > 0) {
				$selector.css('overflow', 'hidden');
			}
		} else if (selector === 'body') {
			$selector = $('body');
			$selector.find('.ibe-loading__overlay--full').addClass(openCLASS);
			if ($overlayFull.length > 0) {
				$selector.css('overflow', 'hidden');
			}
		} else {
			$selector = $(selector);
			$selector.find($overlay).addClass(openCLASS);
		}
		$selector.find($overlay).parent().css('position', 'relative');

		$spinner = $selector.find('.ibe-loading__spinner');
		$icon = $selector.find('.ibe-loading__icon');
		$text = $selector.find('.ibe-loading__text');
		spinWidth = $spinner.width();


		if (!spinWidth < 80) {
		// 	$icon.css('height', spinWidth + 'px');
		// 	$text.css('padding-top', spinWidth + 'px');
		// } else {
			$icon.removeAttr('style');
			$text.removeAttr('style');
		}


		if ($loadingSmall.length > 0) {
			$selector.find($overlay).parent().css('min-height', '64px');
		} else if ($selector.closest('[data-modal-login]').length !== 0){
			$selector.find($overlay).parent().css('min-height', '');
		} else {
			$selector.find($overlay).parent().css('min-height', '284px');
		}

	};


	var spinnerButton = function (paramTime) {
		var spinnerTime = paramTime || 5000,
			$boton = $('[data-boton-send-form]'),
			newText = '',
			buttonText = '';
		$boton.find('.ibe-loading__spinner').show();
		buttonText = $boton.find('[data-boton-text]').text();
		newText = $boton.find('[data-boton-text]').data('boton-text');
		$boton.find('[data-boton-text]').text(newText);
		setTimeout(function () {
			$boton.find('[data-boton-text]').text(buttonText);
			$boton.find('.ibe-loading__spinner').hide();
		}, spinnerTime);

	};


	return {
		'init': init,
		'close': close,
		'open': open,
		'spinnerButton': spinnerButton
	}
}(jQuery);
