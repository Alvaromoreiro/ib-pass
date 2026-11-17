/* Menu responsive de Iberia */
dFrontJs.ibe_responsive_menu = function () {
	var init = function () {
		$('[data-menu-responsive="old"]').click(function (e) {
			if ($(this).hasClass('on')) {
				$('.ibe-responsive__main-menu .ibe-responsive__main-menu-container').animate({
					'left': '-100%'
				}, {
					duration: 250,
					complete: function () {
						$('.ibe-responsive__main-menu').hide();
					}
				});
				$(this).removeClass('on');
			} else {
				$('.ibe-responsive__main-menu').show();
				$('.ibe-responsive__main-menu .ibe-responsive__main-menu-container').animate({'left': '0'}, 250);
				$(this).addClass('on');
			}
		});
	};//ibeResponsiveMenu
	return {
		'init': init
	};
}(jQuery);
