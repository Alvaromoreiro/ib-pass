dFrontJs.ibe_passenger = function () {

	var $data_resident,
		$data_family;

	var init = function () {
		clickSaveValues();
		changeValues();
	};

	/* Guarda los valores de los radio buttons y actualiza el texto de pasajeros - Evento Click Botón 'Guardar' */
	var clickSaveValues = function () {
		$('.ibe-searcher__passenger [data-function="save-passenger"]').click(function () {
			var passenger = $(this).parents('.ibe-searcher__passenger');
			var content = $(this).parent();
			content.find('[data-passenger-resident-radio="data-passenger-resident-radio"]').find('.ibe_form__radio-input').each(function () {
				if ($(this).is(':checked')) {
					passenger.find('[data-passenger-resident="data-passenger-resident"]').text($(this).parent().find('label').text())
				}
			});

			content.find('[data-passenger-family-radio="data-passenger-family-radio"]').find('.ibe_form__radio-input').each(function () {
				if ($(this).is(':checked')) {
					passenger.find('[data-passenger-family="data-passenger-family"]').text($(this).parent().find('label').text())
				}
			});

			passenger.find('.ibe-searcher__passenger-button').trigger('click');
		});
	};

	/* Guarda los valores de los radio buttons y actualiza el texto de pasajeros - Evento Focus Radio Buttons */
	var changeValues = function () {

		$('.ibe-searcher__passenger [data-passenger-resident-radio="data-passenger-resident-radio"], .ibe-searcher__passenger [data-passenger-family-radio="data-passenger-family-radio"]').change(function () {
			var passenger = $(this).parents('.ibe-searcher__passenger');
			var content = $(this).parent();
			content.find('[data-passenger-resident-radio="data-passenger-resident-radio"]').find('.ibe_form__radio-input').each(function () {
				if ($(this).is(':checked')) {
					passenger.find('[data-passenger-resident="data-passenger-resident"]').text($(this).parent().find('label').text())
				}
			});

			content.find('[data-passenger-family-radio="data-passenger-family-radio"]').find('.ibe_form__radio-input').each(function () {
				if ($(this).is(':checked')) {
					passenger.find('[data-passenger-family="data-passenger-family"]').text($(this).parent().find('label').text())
				}
			});

		});
	};

	/////////// Restore values of modals in searcher vintage ////////////////////////
	var getValues = function () {
		$tab = $('.ui-tabs-panel:visible'),
			$data_resident = $tab.find('[data-passenger-resident]').text();
		$data_family = $tab.find('[data-passenger-family]').text();

		//-Restores radiobuttons in case of cancel modal
		$tab.find('input[name=resident]').each(function () {
			//-debugger
			if ($(this).next('label').text() === $data_resident) {

				$(this).prop('checked', true);
				return false;
			}
		});
		$tab.find('input[name=family]').each(function () {
			//-debugger
			if ($(this).next('label').text() === $data_family) {

				$(this).prop('checked', true);
				return false;
			}
		});
		// end restores
			
	}
	var restore_values_family = function () {
		$tab.find('[data-passenger-resident]').text($data_resident);
		$tab.find('[data-passenger-family]').text($data_family);
	}


	//----------------------------------------------------------------

	//init
	return {
		'init': init,
		'getValues': getValues,
		'restore_values_family': restore_values_family
	};
}(jQuery);
