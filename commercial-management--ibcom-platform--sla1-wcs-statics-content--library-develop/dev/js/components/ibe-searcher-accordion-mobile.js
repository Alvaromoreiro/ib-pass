dFrontJs.ibe_searcher_accordion_mobile = function () {
	/*eslint no-underscore-dangle: ['error', { 'allow': ['_activateTabAccordion', '_inputsFull', '_slideInputFocus', '_slideFirstClick', '_linkAccordionClick', '_preventNavigationLinksClick'] }]*/
	//Linka los tabs seleccionados en desktop con los accordion que deben abrirse en responsive
	var _activateTabAccordion = function () {
		var self = this;
		if (window.innerWidth < dFrontJs.resolutions.lg) {
			setTimeout(function () {
				$('[data-tab-view="desktop"]').tabs('option', 'active', parseInt($('.ibe-searcher [data-tab-view="responsive"] [data-active].collapsed').attr('data-active')));
				$(self).closest('.ibe-accordion').append($('#last-searchs-mobile').closest('.ibe-last-searchs').detach());
			});
		}
	};

	var _inputsFull = function () {
		var inputs = $('[data-fligths-collapse-mobile="button"]');
		var container = $('[data-fligths-collapse-mobile="collapse"]');
		if ((inputs.eq(0).val() !== "") && (inputs.eq(1).val() !== "")) {
			setTimeout(function () {
				container.slideDown('slow');
			});
		}
	};

	var _slideInputFocus = function () {
		var container = $('[data-fligths-collapse-mobile="collapse"]');
		setTimeout(function () {
			container.slideDown('slow');
		});
	};

	//Colapsa y deja visible por defecto los 2 primeros inputs del primer accordion del buscador
	var _slideFirstClick = function (e) {
		var searcher = $('.ibe-searcher');
		var inputs = $('[data-fligths-collapse-mobile="button"]');
		if ((inputs.eq(0).val() !== "") && (inputs.eq(1).val() !== "")) {
			setTimeout(function () {
				searcher.find('[data-fligths-collapse-mobile="collapse"]').slideDown('slow');
			})
		} else {
			setTimeout(function () {
				searcher.find('[data-fligths-collapse-mobile="collapse"]').slideUp('slow');
			})
		}
	};

	//Permite clickar sobre los enlaces en forma de accordion
	var _linkAccordionClick = function (e) {
		var $this = $(this);
		if ($('.ibe-overlay').is(':visible')) {
			$this.children('[data-function="data-focus-text"]').toggleClass('ibe-accordion__overlay-text');
			if ($this.find('a').attr('target')) {
				window.open($this.find('a').attr('href'), $this.find('a').attr('target'));
			} else if ($this.find('a').length > 0) {
				window.location.href = $this.find('a').attr('href');
			} else {
				$this.find('button.link').click();
				e.stopPropagation();
			}
		}
	};

	//Previene la navegación de los elementos <a> de los tabs
	var _preventNavigationLinksClick = function (e) {
		e.preventDefault();
	};

	var init = function () {
		var btn = $('[data-fligths-collapse-mobile="button"]');
		var first = $('.ibe-searcher').find('[data-searcher-accordion="first"] [data-prevent="click"]');

		btn.off('focus', _slideInputFocus);
		btn.on('focus', _slideInputFocus);

		first.off('click', _slideFirstClick);
		first.on('click', _slideFirstClick);

		$('[data-fligths-collapse-mobile="button-tab"]').off('click', _preventNavigationLinksClick);
		$('[data-fligths-collapse-mobile="button-tab"]').on('click', _preventNavigationLinksClick);

		$('[data-tab-searcher="data-tab-searcher"]').find('[data-toggle="link"]').off('click', _linkAccordionClick);
		$('[data-tab-searcher="data-tab-searcher"]').find('[data-toggle="link"]').on('click', _linkAccordionClick);

		moveContentResponsive();

		$('[data-tab-view="responsive"] .ibe-tab__container .ibe-accordion [data-active]').off('click', _activateTabAccordion);
		$('[data-tab-view="responsive"] .ibe-tab__container .ibe-accordion [data-active]').on('click', _activateTabAccordion);

		$('[data-searcher-accordion="first"]').find('.hidden-xl [data-city-list="collapse"]').off('focusout click', _inputsFull);
		$('[data-searcher-accordion="first"]').find('.hidden-xl [data-city-list="collapse"]').on('focusout click', _inputsFull);

	};

	var showFirst = function () {
		var searcherAccordion = $('[data-searcher-accordion]'),
			$ibSearcher = $('.ibe-searcher'),
			inputs;
		if (searcherAccordion.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
			//Colapsa los data-searcher-accordion="others"
			$('[data-searcher-accordion="others"] [data-header-searcher]').removeClass('collapsed').siblings('.collapse.in').collapse('hide');
			//Colapsa el data-searcher-accordion="first" y lo pone en su estado original (mostrando 2 inputs)
			$ibSearcher.find('[data-searcher-accordion="first"] [data-header-searcher="collapsed"]').addClass('collapsed').siblings('[data-toggle="container"].ibe-accordion__collapse').collapse('show').removeClass('collapsed').addClass('collapse in').css('min-height', '');
			//Colapsa todos los collapses al pulsar fuera
			$ibSearcher.find('[data-searcher-accordion] [data-header-searcher="collapsed"] + [data-toggle="container"] .collapse.in').collapse('hide');
			inputs = $('[data-fligths-collapse-mobile="button"]');
			if ($ibSearcher.find('[data-searcher-accordion="first"] [data-header-searcher="collapsed"]').hasClass('collapsed') && (inputs.eq(0).val() !== "") && (inputs.eq(1).val() !== "")) {
				requestAnimFrame(function () {
					$ibSearcher.find('[data-fligths-collapse-mobile="collapse"]').slideDown('slow');
				})
			} else {
				requestAnimFrame(function () {
					$ibSearcher.find('[data-fligths-collapse-mobile="collapse"]').slideUp('slow');
				});
			}
			$ibSearcher.find('[data-function="data-focus-text"]').removeClass('ibe-accordion__overlay-text');
			$ibSearcher.find('.ibe-accordion__button').parent().removeClass('ibe-accordion__overlay-button');
			$ibSearcher.find('[data-function="data-focus-searcher-mobile"]').css('z-index', '');
			$('[data-tab-view="desktop"]').tabs('option', 'active', parseInt($ibSearcher.find('[data-tab-view="responsive"] [data-active].collapsed').attr('data-active')));
		}
	};

	//Permite clickar sobre los enlaces en forma de accordion
	var linkAccordion = function () {
		$('[data-tab-searcher="data-tab-searcher"]').find('[data-toggle="link"]').click(function (e) {
			var $this = $(this);
			if ($('.ibe-overlay').is(':visible')) {
				$this.children('[data-function="data-focus-text"]').toggleClass('ibe-accordion__overlay-text');
				if ($this.find('a').attr('target')) {
					window.open($this.find('a').attr('href'), $this.find('a').attr('target'));
				} else if ($this.find('a').length > 0) {
					window.location.href = $this.find('a').attr('href');
				} else {
					$this.find('button.link').click();
					e.stopPropagation();
				}
			}
		});
	};

	//Mueve los campos del formulario del buscador de Móvil a Desktop
	var moveContentResponsive = function (e) {
		var tabDesktop = $('[data-move="tab"]');
		var tabMobile = $('[data-move="tab-mobile"]');

		tabDesktop.each(function (index, value) {
			var i;
			var parentDesktop = $(this).find('[data-move="parent"]');
			var parentMobile = tabMobile.eq(index).find('[data-move="parent-mobile"]');
			for (i = 0; i < $(this).find(parentDesktop).length; i++) {
				var equivalentMobile = getObjectPosition(parentMobile, parentDesktop.eq(i).data('position'));
				parentDesktop.eq(i).children().prependTo(equivalentMobile);
				parentDesktop.eq(i).hasClass('ibe_form__group--half-only-round') ? equivalentMobile.addClass('ibe_form__group--half-only-round') : '';
			}
			// }
		});

		function getObjectPosition(array, position) {
			var i;
			for (i = 0; i < array.length; i++) {
				if (array.eq(i).data('position-mobile') === position) {
					return array.eq(i);
				}
			}
		}

	};

	//init
	return {
		'init': init,
		'showFirst': showFirst
	};
}(jQuery);
