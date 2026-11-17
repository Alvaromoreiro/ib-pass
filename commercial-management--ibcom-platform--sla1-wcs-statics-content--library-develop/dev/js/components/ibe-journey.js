//Control de múltiples trayectos
dFrontJs.ibe_journey = function () {
	/*eslint no-underscore-dangle: ['error', { 'allow': ['_clickButtonCollapse', '_addJourney', '_removeJourney'] }]*/
	var _clickButtonCollapse = function () {
		$(this).closest('.ibe_form__box').find('label.ibe_form__input-label').click();
	};

	var init = function () {
		addItems();
		$('[data-journey="journey"]').addClass('ibe-journey');
		dFrontJs.ibe_inputs.init();
		dFrontJs.ibe_selectmenu.init();
		dFrontJs.ibe_searcher_calendar.init();
		dFrontJs.ibe_validations_searcher.init();
	};

	var addItems = function () {
		var $journeyParent = $('[data-journey="parent"]');
		var $journeys = $('[data-journey="journey"]');
		var $index, i;
		if ($journeyParent.length) {
			$index = parseInt($('[data-journey-num]').attr('data-journey-num'));
			for (i = $index; i >= $journeys.length + 1; i--) {
				$journeyParent.prepend(addNewJourney('[data-journey-num]', i));
			}

			$('[data-journey="add"]').off('click', _addJourney);
			$('[data-journey="add"]').on('click', _addJourney);

			$('[data-journey="remove"]').off('click', _removeJourney);
			$('[data-journey="remove"]').on('click', _removeJourney);

			controlDates();
			showInit();
		}
	};

	var controlDates = function (obj) {
		requestAnimFrame(function () {
			var $journeys, $val, $firstCalendar, input, $pre, $next;
			if ($(obj).closest('[data-journey="journey"]').length > 0) {
				$journeys = $('[data-journey="journey"]');
				$val = $(obj).val();
				$firstCalendar = $journeys.first().find('[data-function="cal-start"]');
				$journeys.each(function (index) {
					if (index > 0) {
						input = $journeys.eq(index).find('[data-cal="start"]');
						$pre = $journeys.eq(index - 1).find('[data-function="cal-start"]');
						$next = $journeys.eq(index).find('[data-function="cal-start"]');
						if (input.val().length > 0 && $next.datepicker('getDate') < $pre.datepicker('getDate')) {
							$next.datepicker('option', 'minDate', $pre.datepicker('getDate'));
							input.val($val).trigger('change');
						} else {
							$next.datepicker('option', 'minDate', $pre.datepicker('getDate'));
							$next.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');
							if ($next.data('datesRange') !== undefined) {
								if ($next.data('datesRange')[0] !== null) {
									$next.find('.selected-day--from').addClass('selected-day--both');
								}
							}
						}
					}
				});
				$('[data-journey="journey"] button[data-toggle="collapse"]').off('click', _clickButtonCollapse);
				$('[data-journey="journey"] button[data-toggle="collapse"]').on('click', _clickButtonCollapse);
			}
		});
	};


	/*Mostrar los 2 primeros items*/
	var showInit = function () {
		var $showInit = parseInt($('[data-journey-show]').attr('data-journey-show'));
		var $maxJourney = parseInt($('[data-journey-num]').attr('data-journey-num'));
		var $numFij = 2;
		var $journeys = $('[data-journey="journey"]');
		var i;
		for (i = 0; i < $showInit; i++) {
			if (i < $numFij) {
				$journeys.eq(i).removeClass('hidden').find('[data-journey="remove"]').parent().remove();
			} else {
				$journeys.eq(i).removeClass('hidden').find('[data-journey="remove"]').hide();
			}
			if (i + 1 === $showInit) {
				//Show the last remove button
				$journeys.eq(i).find('[data-journey="remove"]').show();
			}
		}
		if ($maxJourney === $showInit) {
			$('[data-journey="add"]').hide();
		}
	};

	/* Detecta cuando se le da a añadir un nuevo trayecto */
	var _addJourney = function () {
		var $journeyParent, $journeys, $index;
		$(this).blur();
		$journeyParent = $('[data-journey="parent"]');
		$journeys = $('[data-journey="journey"]');
		$index = $journeys.not(':hidden').length + 1;
		$journeys.find('[data-journey="remove"]').hide();
		$journeys.eq($index - 1).show().removeClass('hidden').find('[data-journey="remove"]').show();

		if ($index === $journeys.length) {
			$(this).hide();
		}

	};

	/* Detecta cuando se le da a eliminar un trayecto */
	var _removeJourney = function () {
		var $journeys
		$(this).closest('[data-journey="journey"]').hide();
		$journeys = $('[data-journey="journey"]');
		$journeys.not(':hidden').last().find('[data-journey="remove"]').show();
		$('[data-journey="add"]').show();
	};

	//Devuelve el html para añadir un trayecto
	var addNewJourney = function (id, index) {
		var html = $(id).html();
		html = html.replace(/{{index}}/g, index);
		return html;
	};//addNewJourney

	//init
	return {
		'init': init,
		'controlDates': controlDates
	};
}(jQuery);
