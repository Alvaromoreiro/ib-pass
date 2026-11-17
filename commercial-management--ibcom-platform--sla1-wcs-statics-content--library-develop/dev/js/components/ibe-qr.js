//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: video
//    Descripcion: Funciones video html5
//******************************************************************************/
dFrontJs.ibe_qr = function (selector) {

	var init = function (selector) {
		var element;
		$(selector).on('click mouseover touchstart', function (event) {
			element = $(this).find('.ibe-infocheckin__qr');
			if (!element.is(':visible')) {
				element.show();
				element.attr('aria-hidden', false);
				// element.slideToggle("fast");
				element.position({
					of: element.parent(),
					my: 'right top',
					at: 'right bottom',
					collision: 'fit'
				});
				dFrontJs.app.emitInView();
			}
		});
		$(selector).on('mouseout touchleave', function (event) {
			element = $(this).find('.ibe-infocheckin__qr');
			if (element.is(':visible')) {
				element.hide();
				element.attr('aria-hidden', true);
				// element.slideToggle("fast");
			}
		});
	};
	//public functions
	return {
		'init': init
	}
}(jQuery);
