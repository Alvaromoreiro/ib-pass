//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: bootstrap.collapse
//    Descripcion: Funciones para el collapse de bootstrap
//******************************************************************************/

dFrontJs.ibe_bootstrap_collapse = function () {

	//Collapse Accessible
	var toggleCollapseAccesible = function (obj, type) {
		var $this = $(obj),
			$accessible = $this.parent().find('[data-toggle-status]');
		var textCollapsed, textExpanded;
		if ($accessible.length > 0) {
			textCollapsed = $accessible.data('status-open');
			textExpanded = $accessible.data('status-close');
			switch (type) {
				case 'show':
					$($accessible.context).find('.collapse.in').collapse('hide');
					if ($(obj).hasClass('ibe-searcher__calendar')) {
						$(obj).closest('.ibe_form__group--half').find('.collapse.in').collapse('hide');
					}
					$accessible.text(textCollapsed);
					break;
				case 'hide':
					$accessible.text(textExpanded);
					break;
			}
		}
	};
	//Collapse igualar tamaño del componente boxy (menu-board)
	var toggleBoxy = function (obj, type) {
		var $this = $(obj),
			$boxy = $this.find('[data-boxy]');
		if ($boxy.length > 0) {
			switch (type) {
				case 'shown':
					dFrontJs.app.calculateHeightComponents($boxy, false);
					dFrontJs.app.calculateHeightComponents($boxy, false);
					dFrontJs.app.emitInView();
					break;
			}
		}
	};
	//Collapse igualar tamaño del component step (partners-detail)
	var toggleSteps = function (obj, type) {
		var $this = $(obj);
		switch (type) {
			case 'shown':
				dFrontJs.app.calculateHeightComponents('.ibe-card-steps', '.ibe-card-steps__box');
				break;

		}
	};
	//Mostrar lista de ciudades version movil
	var loadCityList = function (obj) {
		var $this = $(obj);
		if ($this.find('[data-function="city-list"]').length > 0) {
			if (!$this.find('[data-function="city-list"]:visible').hasClass('ioslist')) {
				$this.find('[data-function="city-list"]:visible *').css('font-size', '0');
			}
		}
	};

	var loadIOSList = function (obj) {
		var $this = $(obj);
		if ($this.find('[data-function="city-list"]').length > 0) {
			if (!$this.find('[data-function="city-list"]:visible').hasClass('ioslist')) {
				$this.find('[data-function="city-list"]:visible *').css('font-size', '');
				$this.find('[data-function="city-list"]:visible').ioslist();
			}
		}
	};

	var init = function () {
		var $collapse = $('[data-toggle="collapse"]');
		var $headernew = $('.ibe-header-new');
		var $containerCollapse = $('[data-toggle="container"]');
		var $accordion = $('.ibe-accordion').find('[data-toggle="accordion"]');
		//Quitamos el margin-botton de todos los contenidos collapse para que no salga el error del salto

		//Añadir clase 'collapsed' a todos los botones
		$collapse.each(function () {
			var $this = $(this);
			$this.addClass('collapsed');
		});

		$collapse.off('keyup', collapseKeyUp);
		$collapse.on('keyup', collapseKeyUp);

		$collapse.off('focus', collapseCloseClick);
		$collapse.on('focus', collapseCloseClick);

		$headernew.find('[data-toggle="collapse"]').off('click', collapseClick);
		$headernew.find('[data-toggle="collapse"]').on('click', collapseClick);

		//Click on document para ocultar componentes como el 'toggle'
		$('.ibe_form__selectize').off('change', changeSelectize);
		$('.ibe_form__selectize').on('change', changeSelectize);


		$('[data-toggle="close-collapse"]').off('click', closeCollapseClick);
		$('[data-toggle="close-collapse"]').on('click', closeCollapseClick);

		//Eventos collapse
		$containerCollapse.off('shown.bs.collapse hidden.bs.collapse', eventsCollapse);
		$containerCollapse.on('shown.bs.collapse hidden.bs.collapse', eventsCollapse);

		$('[data-city-list="collapse"]').off('show.bs.collapse', showCityCollapse);
		$('[data-city-list="collapse"]').on('show.bs.collapse', showCityCollapse);

		$('[data-city-list="collapse"]').off('shown.bs.collapse', initIoslist);
		$('[data-city-list="collapse"]').on('shown.bs.collapse', initIoslist);

		$('[data-header-searcher="collapsed"] + [data-toggle="container"]').off('show.bs.collapse', showSearcherContainer);
		$('[data-header-searcher="collapsed"] + [data-toggle="container"]').on('show.bs.collapse', showSearcherContainer);

		$('[data-toggle="button-collapse"]').off('click', openCloseAllAccordion);
		$('[data-toggle="button-collapse"]').on('click', openCloseAllAccordion);

		$accordion.off('click', clickAccordion);
		$accordion.on('click', clickAccordion);


		$('[data-toggle="container"].ibe-accordion__collapse').off('hidden.bs.collapse', hiddenEventCollapse);
		$('[data-toggle="container"].ibe-accordion__collapse').on('hidden.bs.collapse', hiddenEventCollapse);

		$('[data-toggle="container"].ibe-accordion__collapse').off('show.bs.collapse', showCollapse);
		$('[data-toggle="container"].ibe-accordion__collapse').on('show.bs.collapse', showCollapse);

		$(document).off('click', documentEventClick);
		$(document).on('click', documentEventClick);
	};


	var hideCollapse = function (element) {
		$(element).collapse('hide');
	};

	var modalAccordion = function (modal) {
		var $modal = $(modal);
		//Boton cerra dentro de un toggle collapse
		//Boton cerra dentro de un toggle collapse
		function closeCollapseModal() {
			var $this = $(this),
				$collapse = $this.parents('[data-toggle="container"]');
			$collapse.collapse('hide');
		}

		$modal.find('[data-toggle="close-collapse"]').off('click', closeCollapseModal);
		$modal.find('[data-toggle="close-collapse"]').on('click', closeCollapseModal);

		//Eventos collapse
		function eventsCollapseModal(e) {
			if ($(this).parent().find('[data-toggle-status]').length) {
				toggleCollapseAccesible(this, e.type);
			}
			if ($(this).data('boxy') === 'collapse') {
				toggleBoxy(this, e.type);
			}
			dFrontJs.app.emitInView();			//Lazy load img refresh
		}

		$modal.find('[data-toggle="container"]').off('shown.bs.collapse hidden.bs.collapse', eventsCollapseModal);
		$modal.find('[data-toggle="container"]').on('shown.bs.collapse hidden.bs.collapse', eventsCollapseModal);

		//Boton cerrar varios acordeones (Ampliar todo/Cerrar todo)
		function OpenCloseCollapseModal() {
			var $this = $(this),
				textCollapsed = $this.data('text-collapsed'),
				textExpanded = $this.data('text-expanded'),
				$parent = $this.parents('.ibe-accordion'),
				$buttonCollapse = $parent.find('[data-toggle="accordion"]'),
				$collapse = $parent.find('[data-toggle="container"]');
			if ($this.hasClass('collapsed')) {
				$this.removeClass('collapsed');
				$this.text(textExpanded);
				for (i = 0; i < $collapse.length; i++) {
					$collapse.eq(i).collapse('show');
				}
				$buttonCollapse.addClass('collapsed');
			} else {
				$this.addClass('collapsed');
				$this.text(textCollapsed);
				for (i = 0; i < $collapse.length; i++) {
					$collapse.eq(i).collapse('hide');
				}
				$buttonCollapse.removeClass('collapsed');
			}
		}

		$modal.find('[data-toggle="button-collapse"]').off('click', OpenCloseCollapseModal);
		$modal.find('[data-toggle="button-collapse"]').on('click', OpenCloseCollapseModal);

		//Click en un acordeon
		function clickAccordionModal(e) {
			var $this = $(this);
			var $parent = $this.closest('.ibe-accordion'),
				$ibSearcher = $this.closest('.ibe-searcher'),
				$button = $parent.find('[data-toggle="button-collapse"]'),
				textCollapsed = $button.data('text-collapsed'),
				textExpanded = $this.data('text-expanded'),
				collapseOpens = $parent.find('.collapse.in').length;
			//previene el click en los accordion abiertos del buscador
			if ($this.is('[data-header-searcher][data-toggle="accordion"]')) {
				$this.parent().find('.ibe_form .collapse.in').collapse('hide');
				if (!$this.hasClass('collapsed')) {
					$this.closest('[data-tab-searcher="data-tab-searcher"]').find('.collapsed').removeClass('collapsed');
					setTimeout(function () {
						$this.addClass('collapsed');
					}, 100)
				} else {
					return false;
				}
			}

			// Toggle collapse
			if ($this.parent().find('[data-toggle="container"].in').length > 0) {
				$this.siblings('[data-toggle="container"]').collapse('hide');
				$this.removeClass('collapsed');
			} else {
				$this.siblings('[data-toggle="container"]').collapse('show');
				$this.addClass('collapsed');
			}
			// Cerramos los demás acordeones
			$('.ibe-accordion').not($parent).each(function () {
				var $allAccordion = $(this),
					$thisButtonCollapse = $allAccordion.find('[data-toggle="button-collapse"]');
				$allAccordion.find('.collapse.in').collapse('hide');
				$allAccordion.find('[data-toggle="accordion"].collapsed').removeClass('collapsed');
				//Si otro acordeon tiene activo el ampliar todo, lo cerramos
				if (!$thisButtonCollapse.hasClass('collapsed')) {
					$thisButtonCollapse.addClass('collapsed');
					$thisButtonCollapse.text(textCollapsed);
				}
			});
			//Acordeon actual
			$parent.find('[data-toggle="accordion"]').each(function () {
				var $thisAccordion = $(this);
				//Si hay un acordeon abierto solo
				if (collapseOpens <= 1) {
					if ($thisAccordion[0] !== $this[0]) {
						$thisAccordion.parent().find('[data-toggle="container"]').collapse('hide');
						$thisAccordion.removeClass('collapsed');
					}
					//Si hay mas de un acordeon abierto
				} else {
					if ($thisAccordion[0] === $this[0]) {

						if ($this.siblings('[data-toggle="container"]').hasClass('in')) {
							$this.siblings('[data-toggle="container"]').collapse('show');
							$this.addClass('collapsed');
						} else {
							$this.siblings('[data-toggle="container"]').collapse('hide');
							$this.removeClass('collapsed');
						}
					}
				}
			});


			//Si el boton esta en (ampliar todo)
			if ($button.hasClass('collapsed')) {
				//Chequeamos si hay algun acordeon abierto para cambiar el estado del boton a collapsed
				if ($parent.find('.collapse.in').length > 1) {
					$button.removeClass('collapsed');
					$button.text(textExpanded);
				} else {
					$button.addClass('collapsed');
					$button.text(textCollapsed);
				}
			} else {
				if ($parent.find('.collapse.in').length === 1) {
					$button.addClass('collapsed');
					$button.text(textCollapsed);
				}
			}

			//preventDefault a los enlaces dentro del calendario (buscador de vuelos)
		}

		$modal.find('.ibe-accordion [data-toggle="accordion"]').off('click', clickAccordionModal);
		$modal.find('.ibe-accordion [data-toggle="accordion"]').on('click', clickAccordionModal);

		function hiddenAccordionModal(e) {
			e.stopPropagation();
		}

		$modal.find('[data-toggle="container"].ibe-accordion__collapse').off('hidden.bs.collapse', hiddenAccordionModal);
		$modal.find('[data-toggle="container"].ibe-accordion__collapse').on('hidden.bs.collapse', hiddenAccordionModal);
	};


	//Control del foco del collapse en calendar
	focusArrow = false;
	//init

	var collapseKeyUp = function (e) {
		if (e.key === 'Enter') {
			$(this).closest('.ibe_form__group').children('[data-toggle="container"]').first().collapse('toggle');
		}
	};


	//Cerrar todos los collapse dentro del nuevo header
	var collapseClick = function (e) {
		var target = $(e.currentTarget).data('target');
		var $headernew = $('.ibe-header-new');
		$headernew.find('[data-toggle="container"]:visible').each(function () {
			var $this = $(this);
			if (($this).attr('id') !== target) {
				$this.collapse('hide');
			}
		});
	};

	//Click on document para ocultar componentes como el 'toggle'
	var changeSelectize = function () {
		focusArrow = true;
		setTimeout(function () {
			focusArrow = false;
		}, 350);
	};

	//Boton cerrar dentro de un toggle collapse
	var closeCollapseClick = function () {
		var $this = $(this),
			$collapse = $this.parents('[data-toggle="container"]');
	};

	//Eventos collapse
	var eventsCollapse = function (e) {
		if ($(this).parent().find('[data-toggle-status]').length > 0) {
			toggleCollapseAccesible(this, e.type);
		}
		if ($(this).data('boxy') === 'collapse') {
			toggleBoxy(this, e.type);
		}
		if ($(this).data('steps') === 'collapse') {
			toggleSteps(this, e.type);
		}
	};

	//Select City Responsive - Click Collapse Button
	var showCityCollapse = function (e) {
		e.stopPropagation();
		loadCityList(this, e.type);
	};

	var initIoslist = function (e) {
		e.stopPropagation();
		loadIOSList(this, e.type);
	};


	var showSearcherContainer = function (e) {
		var inputs = $(e.target).find('[data-fligths-collapse-mobile="button"]');
		var $collapse = $('.ibe-searcher').find('[data-fligths-collapse-mobile="collapse"]');
		if ((inputs.eq(0).val() !== "") && (inputs.eq(1).val() !== "")) {
			$collapse.slideDown('slow', function () {
			});
		} else {
			$collapse.slideUp('slow', function () {
			});
		}
	};

	//Boton cerrar varios acordeones (Ampliar todo/Cerrar todo)
	var openCloseAllAccordion = function () {
		var $this = $(this),
			textCollapsed = $this.data('text-collapsed'),
			textExpanded = $this.data('text-expanded'),
			$parent = $this.parents('.ibe-accordion'),
			$buttonCollapse = $parent.find('[data-toggle="accordion"]'),
			$collapse = $parent.find('[data-toggle="container"]');

		if ($this.hasClass('collapsed')) {
			$this.removeClass('collapsed');
			$this.text(textExpanded);
			for (let i = 0; i < $collapse.length; i++) {
				$collapse.eq(i).collapse('show');
			}
			$buttonCollapse.addClass('collapsed');
		} else {
			$this.addClass('collapsed');
			$this.text(textCollapsed);
			for (let i = 0; i < $collapse.length; i++) {
				$collapse.eq(i).collapse('hide');
			}
			$buttonCollapse.removeClass('collapsed');
		}
	};

	//Click en un acordeon
	var clickAccordion = function () {


		var $this = $(this),
			$parent = $this.closest('.ibe-accordion'),
			$ibSearcher = $this.closest('.ibe-searcher'),
			$button = $parent.find('[data-toggle="button-collapse"]'),
			textCollapsed = $button.data('text-collapsed'),
			textExpanded = $this.data('text-expanded'),
			collapseOpens = $parent.find('.collapse.in').length,
			$thisAccordion;
		//previene el click en los accordion abiertos del buscador
		if ($this.closest('.ibe-footer').length > 0 && !mobile) {
			return false;
		}
		if ($this.is('[data-header-searcher][data-toggle="accordion"]')) {
			$this.parent().find('.ibe_form .collapse.in').collapse('hide');
			if (!$this.hasClass('collapsed')) {
				$this.closest('[data-tab-searcher="data-tab-searcher"]').find('.collapsed').removeClass('collapsed');
				requestAnimFrame(function () {
					$this.addClass('collapsed');
				})
			} else {
				return false;
			}
		}
		//Toggle collapse
		if ($this.parent().find('[data-toggle="container"].in').length > 0) {
			$this.siblings('[data-toggle="container"]').collapse('hide');
			$this.removeClass('collapsed');
		} else {
			$this.siblings('[data-toggle="container"]').collapse('show');
			$this.addClass('collapsed');
		}
		if ($this.closest('.ibe-searcher').length === 0) {
			setTimeout(function () {
				$('html, body').animate({
					scrollTop: $this.offset().top
				}, 500);
			}, 500);
		}
		// Cerramos los demás acordeones
		if ($ibSearcher.length > 0) {
			$('.ibe-accordion').not($parent).each(function () {
				var $allAccordion = $(this),
					$thisButtonCollapse = $allAccordion.find('[data-toggle="button-collapse"]');
				$allAccordion.find('.collapse.in').collapse('hide');
				$allAccordion.find('[data-toggle="accordion"].collapsed').removeClass('collapsed');
			});
		}
		//Acordeon actual
		$thisAccordion = $parent.find('[data-toggle="accordion"]');
		//Si hay un acordeon abierto solo
		if (collapseOpens <= 1) {
			if ($thisAccordion[0] !== $this[0]) {
				$thisAccordion.parent().find('[data-toggle="container"]').collapse('hide');
				$thisAccordion.not($this[0]).removeClass('collapsed');
			} else {
				$thisAccordion.parent().find('[data-toggle="container"]').collapse('hide');
				$thisAccordion.not($this[0]).removeClass('collapsed');
			}
		}

		//Si el boton esta en (ampliar todo)
		if ($button.hasClass('collapsed')) {
			//Chequeamos si hay algun acordeon abierto para cambiar el estado del boton a collapsed
			if ($parent.find('.collapse.in').length > 1) {
				$button.removeClass('collapsed');
				$button.text(textExpanded);
			} else {
				$button.addClass('collapsed');
				$button.text(textCollapsed);
			}
		} else {
			if ($parent.find('.collapse.in').length === 1) {
				$button.addClass('collapsed');
				$button.text(textCollapsed);
			}
		}
	};

	var hiddenEventCollapse = function (e) {
		e.stopPropagation();
		if ($(e.target).hasClass('ibe-accordion__collapse')) {
			if ($(this).find('[data-city-list="collapse"]').length > 0) {
				$(this).find('[data-city-list="collapse"]').collapse('hide');
			}
		}
	};

	//Evento que actualiza el calendario al desplegar el accordion
	var showCollapse = function (e) {
		var ida, vuelta;
		// Si el elemento contiene la siguiente clase entra (esta entrando tambien en los hijos collapse dentro de collapse aunque no tengan esa clase)
		if ($(e.target).hasClass('ibe-accordion__collapse')) {
			//Variables para cargar el calendario
			ida = $(this).parents('.ibe-accordion').find('[data-cal="start"]'); //input de ida
			vuelta = $(this).parents('.ibe-accordion').find('[data-cal="end"]'); //input de vuelta

			if ((ida.val() !== "") && (vuelta.val() !== "")) {
				vuelta.trigger('change'); //Actualización del rango del calendario
			}
		}
	};

	var documentEventClick = function (event) {
		var $headernew = $('.ibe-header-new');
		var clickover = $(event.target);
		var accordion = clickover.closest('.ibe-accordion');
		var collapse, isBtn, isChildBtn;
		if (accordion.length === 0) {

			collapse = clickover.closest('.collapse.in');
			isBtn = clickover.is('[data-toggle="collapse"]');
			isChildBtn = clickover.closest('[data-toggle="collapse"]');
			if (!collapse.length && !isBtn && !isChildBtn.length) {
				$('.ibe-tools').find('.collapse.in').not(collapse).each(function () {
					var $this = $(this),
						accordion = $this.closest('.ibe-accordion');
					if (accordion.length === 0) {
						$this.collapse('hide');
					}
				});
				$headernew.find('.collapse.in').not(collapse).each(function () {
					var $this = $(this),
						accordion = $this.closest('.ibe-accordion');
					if (accordion.length === 0) {
						$this.collapse('hide');
					}
				});
				// Control de Funcionalidades del accordion del buscador de la Home - Click fuera del accordion
				if (clickover.length === 1 && clickover[0].localName !== 'body') {
					dFrontJs.ibe_searcher_accordion_mobile.showFirst();
				}
			}
		} else {

			clickover.closest('[data-toggle="container"]').find('.ibe_form .collapse.in').collapse('hide');
			$headernew.find('.collapse.in').not(collapse).each(function () {
				var $this = $(this),
					accordion = $this.closest('.ibe-accordion');
				if (accordion.length === 0) {
					$this.collapse('hide');
				}
			});
		}
		$('[data-cal-button]').removeClass('hidden');
		$('.focus-ios').removeClass('focus-ios');
	};

	var collapseCloseClick = function (e) {
		var $element = $(this);
		var $target = $(e.currentTarget).data('target').split('#')[1];
		if (!$element.parents('.ibe-searcher').length) {
			$('[data-toggle="container"]:visible').each(function () {
				var $this = $(this);

				if (($this).attr('id') !== $target && !$this.hasClass('off')) {
					$this.collapse('hide');
				}

			});
		}
	};

	return {
		'init': init,
		'hideCollapse': hideCollapse,
		'modalAccordion': modalAccordion
	};
}(jQuery);
