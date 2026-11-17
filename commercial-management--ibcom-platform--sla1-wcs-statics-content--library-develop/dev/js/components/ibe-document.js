dFrontJs.ibe_document = function () {
	var init = function () {
		var $headernew = $('.ibe-header-new');
		var $dudes = $('[data-dudes]');
		var $logged = $('.ibe-header-new__logged-link');
		var containerLogged = $logged.data('target');

		$(document).on('click', function (event) {

			// START ibe-header-new.js
			//Conditions - only close if click an element outside the header
			if ($(event.target).parents('.ibe-header-new').length === 0 && !$(event.target).hasClass('ibe-header-new')) {
				if ($dudes.hasClass('open') && $('.ibe-header-new__dudes .ibe_form').is(':visible') && !$(event.target).hasClass('ibe-header-new__dudes-input') && $(event.target).attr('data-dudes') !== 'dudes' && $(event.target).parents('.ibe-header-new__dudes').length === 0) {
					$dudes.removeClass('open');
					$('.ibe-header-new__dudes .ibe_form').animate({width: 'toggle'}, 600, function () {
						$dudes.parent().animate({width: 'toggle'}, 400);
					});
				}
			}

			if (window.innerWidth < dFrontJs.resolutions.lg && $(containerLogged).is(':visible') && !$(event.target).hasClass('ibe-login') && $(event.target).parents('.ibe-login').length === 0) {
				$logged.removeClass('active');
				$(containerLogged).collapse('hide');
				$('.ibe-menu-new__overlay').hide();
				$('html, body').css({'overflow': ''});
			}
			// END ibe-header-new.js


			// // START ibe-modal.js
			// dFrontJs.ibe_modal.closeModal($('.ibe-dialog:visible'));
			// // END ibe-modal.js

		});


	};
	return {
		'init': init
	};
}(jQuery);
