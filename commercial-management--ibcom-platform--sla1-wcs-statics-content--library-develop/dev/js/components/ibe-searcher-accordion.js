dFrontJs.ibe_searcher_accordion = function () {
	/*eslint no-underscore-dangle: ['error', { 'allow': ['_activateTabAccordionDesktop'] }]*/
	//Linka los tabs seleccionados en desktop con los accordion que deben abrirse en responsive
	var _activateTabAccordionDesktop = function (e) {
		e.stopPropagation();
		setTimeout(function () {
			var $active = $('[data-tab-view="desktop"]').tabs('option', 'active');
			var $accordions = $('[data-tab-view="responsive"] [data-active]');
			$accordions.eq($active).click();
		});
	};

	var init = function () {
		moveContentResponsive();
		$('[data-tab-view="desktop"] > .ibe-tab__scroll .ibe-tab__menu-item a').off('click', _activateTabAccordionDesktop);
		$('[data-tab-view="desktop"] > .ibe-tab__scroll .ibe-tab__menu-item a').on('click', _activateTabAccordionDesktop);
		// dFrontJs.ibe_searcher_calendar.init();
	};

	//Mueve los campos del formulario del buscador de Móvil a Desktop
	var moveContentResponsive = function (e) {
		var tabDesktop = $('[data-move="tab"]');
		var tabMobile = $('[data-move="tab-mobile"]');

		tabMobile.each(function (index, value) {
			var i;
			var parentMobile = $(this).find('[data-move="parent-mobile"]');
			var parentDesktop = tabDesktop.eq(index).find('[data-move="parent"]');
			for (i = 0; i < $(this).find(parentMobile).length; i++) {
				parentMobile.eq(i).children().prependTo(getObjectPosition(parentDesktop, parentMobile.eq(i).data('position-mobile')));
			}
		});

		function getObjectPosition(array, position) {
			var i;
			for (i = 0; i < array.length; i++) {
				if (array.eq(i).data('position') === position) {
					return array.eq(i);
				}
			}
		}
	};

	//init
	return {
		'init': init
	};
}(jQuery);
