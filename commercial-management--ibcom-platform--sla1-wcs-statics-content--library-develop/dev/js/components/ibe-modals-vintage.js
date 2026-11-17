dFrontJs.ibe_modals_vintage = function () {
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Para abrir la modal de origen/destino con el buscador vintage
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/*eslint no-underscore-dangle: ['error', { 'allow': ['_openModalOriDes', '_calcHeight', '_openModalFamily'] }]*/
	var _openModalOriDes = function (e) {
		var $this, idList, $input, $tab;
		if ((window.innerWidth < dFrontJs.resolutions.lg)) {
			$this = $(e.target).parents(('.ibe-searcher__col'));
			idList = $(e.target).attr('data-target');
			$input = $(e.target).closest('.ibe_form__group').find('[data-autocomplete = "cities"]');
			$tab = $('.ui-tabs-panel:visible');


			//if($input.val() === "" && $(idList).find('.city-selected').length >0){
			$(idList).find('.city-selected').removeClass('city-selected');
			//}

			if (!$this.hasClass('modal-mode')) {
				$this.addClass('modal-mode');
				$('.ibe-modal__header-close').show();
				$this.parents('.ibe-accordion.active').css('overflow', 'hidden');
				// for de first time
				if (!$(idList).find('.city-selected').length > 0 && $input.val() !== '') {
					$tab.find('li:contains(' + $input.val() + ')').find('a:first').addClass('city-selected');
				}
				requestAnimFrame(function () {
					//meter en condicional si existe la clase cityselected && el input es !== ""
					if ($(idList).find('.city-selected').length > 0 && $input.val() !== '') {
						if ($(idList).find('.ibe-tab__scroll').length > 0) {
							//-setTimeout(function () {
							$(idList).find('.ioslist-wrapper').animate({
								scrollTop: ($(idList).find('.city-selected').offset().top - $(idList).find('[data-tab-cities]:visible').find('.ioslist-wrapper').offset().top + $(idList).find('[data-tab-cities]:visible').find('.ioslist-wrapper').scrollTop() - 12)
							}, 1000);
							//-}, 3000);
						} else {
							$(idList).find('.ioslist').scrollTop(0);
						}

					}
				});

			}

			// Calculate city list height and adjust it in each resize
			_calcHeight(idList);
			$(window).resize(function () {
				_calcHeight(idList)
			});
		}
	};

	// Calculate city list height and adjust it in each resize
	var _calcHeight = function (elem) {

		var clientHeight = document.documentElement.clientHeight;
		var containerGeneral = $(elem);
		var containerElem = containerGeneral;
		var tabElem = containerGeneral.find('[data-tab="jquery-ui"]');
		var tabContainerElem = containerGeneral.find('.ibe-tab__container');
		var tabCitiesElem = containerGeneral.find('[data-tab-cities="mobile"]');
		var cityListElem = containerGeneral.find('[data-function="city-list"]');
		var elemRefer;

		containerElem.css('min-height', clientHeight - containerElem.offset().top);
		if (tabElem.offset() !== undefined) {
			tabElem.css({
				'height': clientHeight - tabElem.offset().top,
				'min-height': clientHeight - tabElem.offset().top
			});
		}

		tabContainerElem.css({
			'height': clientHeight - tabContainerElem.offset().top - 20,
			'min-height': clientHeight - tabContainerElem.offset().top - 20
		});

		//I select an element as reference to catch the height, one that is not hidden 
		elemRefer = tabCitiesElem.filter(function () {
			return $(this).offset().top > 0;
		});

		tabCitiesElem.each(function (index, element) {
			$(element).css({
				'height': clientHeight - elemRefer.offset().top - 20,
				'min-height': clientHeight - elemRefer.offset().top - 20
			});
		});

		cityListElem.each(function (index, element) {
			$(element).css({
				'height': clientHeight - elemRefer.offset().top - 20,
				'min-height': clientHeight - elemRefer.offset().top - 20
			});
		});
	};
	// Modal family in searcher vintage
	var _openModalFamily = function () {
		var $that;
		if ((window.innerWidth < dFrontJs.resolutions.lg)) {
			$that = $('.ibe-searcher__options-col--large');
			if (!$that.hasClass('modal-mode')) {
				$that.addClass('modal-mode');
				$('.ibe-modal__header-close').show();
				$('.ibe-button-close-modal-family').show();
				$that.parents('.ibe-accordion.active').css('overflow', 'hidden');
			}
			dFrontJs.ibe_passenger.getValues();
		}
	};

	var closeModalsVintage = function (fares) {
		var $that = $('.ibe-searcher__row');
		var clientHeight = document.documentElement.clientHeight;
		var $accordion = $('.ibe-searcher__row').closest('.ibe-accordion.active');
		fares = (fares !== undefined ? fares : '');

		// Check if the accordion needs a scroll bar
		if ($accordion && $accordion.scrollHeight > clientHeight) {
			$accordion.css('overflow-y', 'scroll');
		} else {
			$accordion.css('overflow-y', 'visible');
		}
		$accordion.css('overflow', '');

		function closeModal() {
			$that.find('.modal-mode').removeClass('modal-mode');
			$('.ibe-modal__header-close').hide();
			$('.ibe-button-close-modal-family').hide();

			if ($that.find('.ibe-button-close-modal-passenger').length > 0) {
				$('.ibe-button-close-modal-passenger').css('display', 'none')
			}
		}

		if (fares === '') {
			setTimeout(function () {
				closeModal();
			}, 400);
		} else {
			closeModal();
		}

	};

	// Modal fares in searcher vintage
	var openModalTarifas = function (e) {
		var $that;
		if ((window.innerWidth < dFrontJs.resolutions.lg)) {
			$that = $('.ibe-searcher__options-col--right');
			if (!$that.hasClass('modal-mode')) {
				$that.addClass('modal-mode');
				$('.ibe-modal__header-close').show();
				$that.parents('.ibe-accordion.active').css('overflow', 'hidden');
			}

		}
	};

	// Modal num passenger in searcher vintage
	var openModalPassenger = function (e) {

		var $that = $('.ibe-searcher__col--alt');

		if (window.innerWidth < dFrontJs.resolutions.lg) {

			// Delete focus to input
			e.target.blur();

			// The scroll up when closing the modal, for when it opens again it appears when opening
			$('.ibe-people-counter').on('hidden.bs.collapse', function () {
				$that.each(function (index, elem) {
					$(elem).scrollTop(0);

				});
			});

			if (!$that.hasClass('modal-mode')) {
				//dFrontJs.ibe_searcher_people_counter.restore_values_passengers('false');

				$that.addClass('modal-mode');
				$('.ibe-modal__header-close').show();
				$('.ibe-button-close-modal-passenger').show();
				$that.parents('.ibe-accordion.active').css('overflow', 'hidden');
			}

			$that.scrollTop(0);

		}
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Para abrir la modal en el datePicker con el buscador vintage
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var openModalDatepicker = function () {


		var $this = $('.ibe-searcher__col--date');

		if ((window.innerWidth < dFrontJs.resolutions.lg)) {
			if (!$this.hasClass('modal-mode')) {
				$this.addClass('modal-mode');
				$('.ibe-button-close-modal').show();
				$this.parents('.ibe-accordion.active').css('overflow', 'hidden');
			}
		}
	};
	var closeModalDatepicker = function () {
		setTimeout(function () {
			var $this = $('.ibe-searcher__col--date');
			var idCal = $this.parent().find('.collapse.in');

			requestAnimFrame(function () {
				idCal.off('hide.bs.collapse');
				idCal.collapse('hide');
			}, 500);

			$this.removeClass('modal-mode');
			$('.ibe-button-close-modal').hide();
			$this.parents('.ibe-accordion.active').css('overflow', '');
		}, 200);
	};


	var init = function (selector) {

		if (selector === undefined) {
			selector = $('[data-tab-searcher] > .ibe-tab__scroll').find('[aria-selected=true]').children().attr('href');
		}

		////////////////////////  calls to functions ////////////////////////////////////
		if (!$(selector).find('.ibe_form__group--half').find('.ibe-button-close-modal').length > 0) {
			$(selector).find('.ibe_form__group--half').append('<button type="button" style="display: none" data-hideAccessible="Close" data-text="Close" aria-label="Close modal" tabindex="0" data-focusin  class="ibe-button-close-modal"></button>');

		}
		if (!$(selector).find('.ibe-searcher__row--col2').find('.ibe-button-close-modal-fares').length > 0) {
			$(selector).find('.ibe-searcher__row--col2').find('.ibe-searcher__options-col--right > .ibe-modal__header-close').append('<button type="button" tabindex="0" data-focusin  data-hideAccessible="Close" data-text="Close" aria-label="Close modal" class="ibe-button-close-modal-fares"></button>');
		}
		if (!$(selector).find('.ibe-searcher__row--col2').find('.ibe-button-close-modal-family').length > 0) {
			$(selector).find('.ibe-searcher__row--col2').find('.ibe-searcher__options-col--large').append('<button type="button" data-hideAccessible="Close" tabindex="0" data-focusin data-text="Close" style="display:none" aria-label="Close modal" class="ibe-button-close-modal-family"></button>');
		}
		if (!$(selector).find('.ibe-searcher__row--col1').find('.ibe-button-close-modal-city').length > 0) {
			$(selector).find('.ibe-searcher__row--col1').find('.ibe-modal__header-close').append('<button type="button" data-hideAccessible="Close" aria-label="Close modal" data-text="Close" tabindex="0" data-focusin  class="ibe-button-close-modal-city"></button>');
		}
		if (!$(selector).find('.ibe-searcher__row--col2').find('.ibe-button-close-modal-passenger').length > 0) {
			$(selector).find('.ibe-searcher__col--alt').append('<button type="button" aria-label="Close modal" data-hideAccessible="Close" class="ibe-button-close-modal-passenger" tabindex="0" data-focusin data-text="Close" style="display: none"></button>');
		}

		$('[data-autocomplete="cities"]').parent().find('[data-toggle="collapse"]').off('click', _openModalOriDes);
		$('[data-autocomplete="cities"]').parent().find('[data-toggle="collapse"]').on('click', _openModalOriDes);

		$('.ibe-searcher__passenger-button').off('click', _openModalFamily);
		$('.ibe-searcher__passenger-button').on('click', _openModalFamily);

		$('[data-modal="data-modal"]').off('click', openModalPassenger);
		$('[data-modal="data-modal"]').on('click', openModalPassenger);

		$('.ibe-button-close-modal-fares').off('click', closeModalsVintage('yes'));
		$('.ibe-button-close-modal-fares').on('click', closeModalsVintage('yes'));
		$('.ibe-button-close-modal-city').off('click', closeModalsVintage);
		$('.ibe-button-close-modal-city').on('click', closeModalsVintage);

		$('[data-cal="end"],[data-cal="start"]').off('focus click', openModalDatepicker);
		$('[data-cal="end"],[data-cal="start"]').on('focus click', openModalDatepicker);
		$('.ibe-button-close-modal').off('click', closeModalDatepicker);
		$('.ibe-button-close-modal').on('click', closeModalDatepicker);


		/// Save the values in modal vintage (No save)
		$('[data-close-modal]').off('click');
		$('[data-close-modal]').on('click', function (e) {
			var $buttonSave = $(e.target).parent(),
				$closePassenger = $buttonSave.siblings('.ibe-button-close-modal-passenger'),
				$selector = $closePassenger.parent().find('.ibe_form__group').children('.fc-people-counter-active');
			if ($closePassenger.length > 0) {
				dFrontJs.ibe_searcher_people_counter.savePassenger($buttonSave, $selector);
			}

			closeModalsVintage();
		});

		/// Close the modal in vintage (Save dates)
		$('.ibe-button-close-modal-passenger').click(function () {
			var $closeButton = $(this),
				$selector = $closeButton.parent().find('.ibe_form__group').children('.fc-people-counter-active');
			dFrontJs.ibe_searcher_people_counter.restorePassenger($closeButton, $selector);
			closeModalsVintage()
		});

		/// Close the modal in vintage
		$('.ibe-button-close-modal-family').click(function () {
			dFrontJs.ibe_passenger.restore_values_family('true');
			closeModalsVintage()
		});


		//////////////////////////End calls ///////////////////////////////////////

	};

	var reloadOriDesModal = function () {
		$('[data-autocomplete="cities"]').parent().find('[data-toggle="collapse"]').off('click', _openModalOriDes);
		$('[data-autocomplete="cities"]').parent().find('[data-toggle="collapse"]').on('click', _openModalOriDes);
	};

	//public functions
	return {
		'init': init,
		'openModalTarifas': openModalTarifas,
		'closeModalsVintage': closeModalsVintage,
		'openModalPassenger': openModalPassenger,
		'closeModalDatepicker': closeModalDatepicker,
		'_openModalOriDes': _openModalOriDes,
		'openModalDatepicker': openModalDatepicker,
		'reloadOriDesModal': reloadOriDesModal
	};

}(jQuery);
