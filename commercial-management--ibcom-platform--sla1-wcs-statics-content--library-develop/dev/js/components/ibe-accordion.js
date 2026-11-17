/**
 * Represents accordion.js
 * @constructor
 * @author ccasalen
 * @description Example of description - This is a example of documentation with JSDoc
 * @param {string} [title="hola"] - The title of the book.
 * @param {string} otherParam - The author of the book.
 * @returns {function} dFrontJs.ibe_accordion.init()
 * @example dFrontJs.ibe_accordion.init()
 */
dFrontJs.ibe_accordion = function () {
	//Jquery ui accordion
	var init = function () {
		var $accord = $('[data-accordion]'),
			$footer = $('.ibe-footer__collapse');
		if ($accord.length > 0) {
			$accord.accordion({
				active: false,
				collapsible: true,
				heightStyle: 'content'
			});
		}

		if ($(window).width() <= 768) {
			$footer.removeClass('off');
			$footer.removeClass('in');
		} else {
			$footer.addClass('off');
		}

		$(window).resize(function () {
			if ($(window).width() >= 768) {
				$footer.addClass('in');
				$footer.addClass('off');
			}
			if ($(window).width() <= 768) {
				$footer.removeClass('in');
				$footer.removeClass('off');
			}
		});

		$('.ibe-footer-title').click(function (e) {
			if ($(window).width() >= 768) {
				e.stopPropagation();
			}
		});

	};//pluginAccordion
	return {
		'init': init
	};
}(jQuery);
