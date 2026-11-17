dFrontJs.ibe_outsideclick = function () {
	/*eslint no-underscore-dangle: ["error", { "allow": ["_outsideDocumentClick", "_thisKeyup"] }]*/
	var _outsideDocumentClick = function (event) {
		var target = event.target ? event.target : window.event.srcElement;
		var $foco = $(target),
			$modal = $('.ibe-dinamic-modal');


		if (!$foco.closest('[data-close="outsideclick"]').length > 0 && !$modal.length > 0 && $('[data-close="outsideclick"]').hasClass('in')) {
			$('[data-close="outsideclick"]').collapse('hide');
		}
	};

	var init = function (selector, params) {
		$(document).off('click', _outsideDocumentClick);
		$(document).on('click', _outsideDocumentClick);
	};

	return {
		'init': init
	};
}(jQuery);
