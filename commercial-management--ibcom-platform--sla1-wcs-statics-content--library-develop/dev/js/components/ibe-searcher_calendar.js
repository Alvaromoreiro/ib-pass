//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: Calendario
//    Descripcion: Calendario en buscador de vuelos
//******************************************************************************/
dFrontJs.ibe_searcher_calendar = function () {
	/*eslint no-underscore-dangle: ['error', { 'allow': ['_inputsKeyup', '_buttonCalendarTouchFocusClick', '_calStartFocus', '_roundtripFunction', '_oneWayFunction',
	'_disableCollapse', '_preventClicks', '_inputsBlur','_focusoutFunction', '_changefromFunction', '_changeEndFunction', '_defaults','_updateDatepicker','_get',
	'_mouseoverTDtoFunction', '_mouseoverTDtoFunction', '_touchStartFunction', '_mouseoverTDfromFunction', '_disableRound'] }]*/
	var endTimeCalendar;

	var getDatePickerMaxDate = function (selector) {
		var maxValue = $(selector).attr('data-maxrange') || '361';
		maxValue = parseInt(maxValue, 10);
		if (!isNaN(maxValue)) {
			if (maxValue > 1) {
				return maxValue -1 + '';
			} else {
				return '1';
			}
		}
		return '360';
	} 

	var dateParser = function (date, format) {
		var dateParts = date.split('/');
		if (format === 'DD/MM/YYYY') {
			return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
		}
		return new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
	};

	var checkDate = function (date, format) {
		if (format === 'DD/MM/YYYY') {
			return /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/.test(date);
		}
		return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/.test(date);
	};

	var _inputsKeyup = function (e) {
		var $this = $(this),
			$first_parent = $this.closest('.ibe_form__group--half'),
			$from_calendar = $first_parent.find('[data-function="cal-start"]'),
			$to_calendar = $first_parent.find('[data-function="cal-end"]'),
			input_from = $first_parent.find('[data-cal="start"]'),
			input_to = $first_parent.find('[data-cal="end"]').length > 0 ? $first_parent.find('[data-cal="end"]') : input_from,
			key = e.which,
			$vintage = $('.ibe-searcher__vintage'),
			$colDate = $vintage.find('.ibe-searcher__col--date'),
			$modal = $('.ibe-dinamic-modal');
		var datepicker = {
			minDate: 0,
			maxDate: getDatePickerMaxDate($from_calendar)
		};
		var dataCal, value, dateFormat, date, group, today, dataDayCalendar, dateRestriction, dataHour, dataNumDays, value_from,
			date_from, value_to, date_to;
		var errorDate;
		//- 10 Maximun date caracterers in imputs data calendars
		if ($this.attr('data-cal').length > 0 && $this.val().length > 10) {
			dataCal = $this.val();
			$this.val(dataCal.substr(0, 10));
		}
		//- ///////////////////////////////////////////////////////

		// Journeys without calendar-end
		if ($this.parents('[data-journey]').length > 0 && $this.val().length === 0) {
			requestAnimFrame(function () {
				$from_calendar.datepicker('setDate', -1);
				$from_calendar.data('datesRange', [null, null]);
				$from_calendar.datepicker('refresh');
				dFrontJs.ibe_journey.controlDates(input_from);
			});
		}
		if (e.target.value.length === 10 && key !== 8 && key !== 46 && key !== 9 && key !== 229 && key !== 37 && key !== 39) {
			value = e.target.value;
			dateFormat = $this.data('format');
			date = dateParser(value, dateFormat);
			group = $(e.target).closest('.ibe_form__group--half');
			today = new Date(new Date().setHours(0, 0, 0, 0));
			dataDayCalendar = group.closest('[data-hour-restriction]');
			focusDatepicker(e.target);
			
			if (dataDayCalendar.length > 0) {
				dateRestriction = new Date();
				dataHour = parseInt(dataDayCalendar.eq(0).data()['hourRestriction']);

				dateRestriction.setMilliseconds(dataHour * 60 * 60 * 1000); //Horas por segundos/hora
				dateRestriction.setHours(0);
				dateRestriction.setMinutes(0);
				dateRestriction.setSeconds(0);

				dataNumDays = dataDayCalendar.length ? parseInt(dataDayCalendar.eq(0).data()['hourRestriction']) : 0;
			}

			/*if (!input_from.hasClass('initRangeDatepicker')) {
				input_from.addClass('initRangeDatepicker');
				$from_calendar.datepicker('option', 'beforeShowDay', rangeDays);
				if (!$this.parents('[data-journey="parent"]').length > 0) {
					input_to.addClass('initRangeDatepicker');
					requestAnimFrame(function () {
						$to_calendar.datepicker('option', 'beforeShowDay', rangeDays);
					});
				}
			}*/
			errorDate = true;
			if (!checkDate(value, dateFormat)) {
				group.addClass('ibe_form__group--error');
				group.find('[data-validate]').addClass('hidden');
				group.find('[data-validate="parse"]').removeClass('hidden');
				if ($('.ibe-dinamic-modal').length > 0) {
					group.closest('.ibe-dinamic-modal').removeClass('ibe-dinamic-modal');
				}

			} else if (date.getTime() > new Date().setDate(new Date().getDate() + datepicker.maxDate)) {
				group.addClass('ibe_form__group--error');
				group.find('[data-validate]').addClass('hidden');
				group.find('[data-validate="max"]').removeClass('hidden');

			} else if (date.getTime() < new Date(today)) {
				group.addClass('ibe_form__group--error');
				group.find('[data-validate]').addClass('hidden');
				group.find('[data-validate="valid"]').removeClass('hidden');

			} else if (date.getTime() < dateRestriction) {
				group.addClass('ibe_form__group--error');
				group.find('[data-validate]').addClass('hidden');
				group.find('[data-validate="restriction"]').removeClass('hidden');

			} else {
				group.find('[data-validate="max"]').addClass('hidden');
				group.find('[data-validate="valid"]').addClass('hidden');
				group.find('[data-validate="restriction"]').addClass('hidden');
				group.find('[data-validate="parse"]').addClass('hidden');
				if (!group.find('[data-validate]').not('.hidden').length) {
					group.removeClass('ibe_form__group--error');
				} 
				errorDate = false
			}
			
			
			if (input_from.val().length === 10 && input_to.val().length !== 10  && !errorDate && dFrontJs.ibe_validations_searcher.dateValidator(group)) {
				if ($modal.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
					// Only oneway
					requestAnimFrame(function () {
						if (input_from.val() !== "" && $('input[data-click="oneway"]').length > 0 &&
							!$('input[data-click="oneway"]').is(':checked')) {
							dFrontJs.ibe_dinamic_modal.close(input_from)
						}
					});
				}

				$from_calendar.datepicker('setDate', date);
				$to_calendar.datepicker('setDate', date);
				$to_calendar.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');

				$to_calendar.find('td.range').removeClass('range');
				$from_calendar.find('td.range').removeClass('range');

				$from_calendar.data('datesRange', [date, null]);
				$to_calendar.data('datesRange', [date, null]);

				$from_calendar.trigger('change');
				$from_calendar.datepicker('refresh');
				$to_calendar.datepicker('refresh');

			} else if (input_from.val().length !== 10 && input_to.val().length === 10  && !errorDate && dFrontJs.ibe_validations_searcher.dateValidator(group)) {
				$from_calendar.datepicker('setDate', date);
				$to_calendar.datepicker('setDate', date);
				$from_calendar.data('datesRange', [null, date]);
				$to_calendar.data('datesRange', [null, date]);
				input_from.focus();
				$to_calendar.trigger('change');

				$from_calendar.datepicker('refresh');
				$to_calendar.datepicker('refresh');
			} else if (input_from.val().length === 10 && input_to.val().length === 10  && !errorDate && dFrontJs.ibe_validations_searcher.dateValidator(group)) {
				dateFormat = $this.data('format');
				value_from = input_from.val();
				date_from = dateParser(value_from, dateFormat);
				value_to = input_to.val();
				date_to = dateParser(value_to, dateFormat);

				$from_calendar.datepicker('setDate', date_from);
				$to_calendar.datepicker('setDate', date_to);
				$from_calendar.data('datesRange', [$from_calendar.datepicker('getDate'), $to_calendar.datepicker('getDate')]);
				$to_calendar.data('datesRange', [$from_calendar.datepicker('getDate'), $to_calendar.datepicker('getDate')]);
				$from_calendar.trigger('change');

				if ($vintage.length > 0) {
					dFrontJs.ibe_modals_vintage.closeModalDatepicker();
				}

				if ($(e.target).parents('.ibe_form').find('[data-cal="end"]').length > 0 && $(e.target).attr('data-cal') === 'start' &&
					$from_calendar.data('datesRange')[0].getTime() > $from_calendar.data('datesRange')[1].getTime()) {
					//For open the calendar in specific months
					$to_calendar.datepicker('setDate', $from_calendar.datepicker('getDate'));
					$to_calendar.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');

					$to_calendar.find('td.range').removeClass('range');
					$from_calendar.find('td.range').removeClass('range');

					$from_calendar.data('datesRange', [$from_calendar.datepicker('getDate'), null]);
					$to_calendar.data('datesRange', [$from_calendar.datepicker('getDate'), null]);

					$to_calendar.trigger('change');
					$from_calendar.datepicker('refresh');
					$to_calendar.datepicker('refresh');

					input_to.focus(); //open de to calendar
					requestAnimFrame(function () {
						input_to.val('');
						input_to.closest('.ibe_form__group-half').removeClass('ibe_form__group--content');
					});

				} else if ($(e.target).attr('data-cal') === 'end' &&
					$from_calendar.data('datesRange')[0].getTime() > $from_calendar.data('datesRange')[1].getTime()) {
					$from_calendar.datepicker('setDate', $to_calendar.datepicker('getDate'));
					$from_calendar.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');

					$to_calendar.find('td.range').removeClass('range');
					$from_calendar.find('td.range').removeClass('range');

					$from_calendar.data('datesRange', [null, $to_calendar.datepicker('getDate')]);
					$to_calendar.data('datesRange', [null, $to_calendar.datepicker('getDate')]);

					$from_calendar.trigger('change');
					$from_calendar.datepicker('refresh');
					$to_calendar.datepicker('refresh');

					input_from.focus(); //open de to calendar
					requestAnimFrame(function () {
						input_from.val('');
						input_from.closest('.ibe_form__group-half').removeClass('ibe_form__group--content');
					});
				} else {
					if ($(e.target).attr('data-cal') === 'start') {
						$from_calendar.trigger('change');
					} else {
						$to_calendar.trigger('change');
					}

					$from_calendar.datepicker('refresh');
					$to_calendar.datepicker('refresh');
					if (!$this.parents('[data-journey="parent"]').length > 0 && $from_calendar.data('datesRange')[0] !== null && $from_calendar.data('datesRange')[0].getTime() === $from_calendar.data('datesRange')[1].getTime()) {
						$from_calendar.find('.selected-day--from').addClass('selected-day--both');
					}
					$(e.target).blur();
					if ($modal.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
						dFrontJs.ibe_dinamic_modal.close($(e.target))
					}
				}

			}
		} else if (e.target.value.length === 0 && key !== 9 && key !== 229 && key !== 37 && key !== 39) {

			if ($(e.target).attr('data-cal') === 'start') {
				$from_calendar.datepicker('setDate', null);
				if(input_to.val().length > 0){
					$from_calendar.data('datesRange', [null, $to_calendar.datepicker('getDate')]);
					$to_calendar.data('datesRange', [null, $to_calendar.datepicker('getDate')]);
				} else {
					$to_calendar.datepicker('setDate', null);
					$from_calendar.data('datesRange', [null, null]);
					$to_calendar.data('datesRange', [null, null]);
				}
				

			} else {
				
				$to_calendar.datepicker('setDate', null);
				if(input_from.val().length > 0){
					$from_calendar.data('datesRange', [$from_calendar.datepicker('getDate'), null]);
					$to_calendar.data('datesRange', [$from_calendar.datepicker('getDate'), null]);
				} else {
					$from_calendar.datepicker('setDate', null);
					$from_calendar.data('datesRange', [null, null]);
					$to_calendar.data('datesRange', [null, null]);
				}
			}
			focusDatepicker(e.target);
			$from_calendar.datepicker('refresh');
			$to_calendar.datepicker('refresh');
		}
	};

	var _buttonCalendarTouchFocusClick = function (e) {
		var $this = $(this);
		//INITCALENDAR when click input (this Calendar)
		if (!$this.parents('.ibe_form__group--half').hasClass('fc-initCalendar')) {
			initCalendar($this.parents('.ibe_form__group--half').find('[data-function="cal-start"]'), $this.parents('.ibe_form__group--half').find('[data-function="cal-end"]'));
			$this.parents('.ibe_form__group--half').addClass('fc-initCalendar');
		}
	};

	var _calStartFocus = function () {
		$(this).closest('.ibe_form__group').find('.ibe-searcher__calendar--end').collapse('hide');
	};

	var activeOneWayFunction = function (selector) {
		var $parent = selector.closest('.ibe-tab__container-desktop'),
			$input_from = $parent.find('[data-cal="start"]'),
			$from_val = $input_from.val(),
			$input_to = $parent.find('[data-cal="end"]'),
			$to_val = $input_to.val(),
			$from_cal = $parent.find('[data-function="cal-start"]'),
			$to_cal = $parent.find('[data-function="cal-end"]');

		if ($input_to.val().length < 10) {
			$input_to.val('');
			$input_to.closest('.ibe_form__group-half').removeClass('ibe_form__group--content');
			if ($to_cal.find('.selected-day--from').length === 0 && $from_cal.find('.selected-day--from').length === 0) {
				$to_cal.datepicker('setDate', 'null');
			}
		}

		$input_to.parent().addClass('xui-return-date-hide');
		$input_from.parent().addClass('xui-one-way').parent().removeClass('icon-caret_derecha').closest('.ibe_form__group--error').find('[data-cal="start"]').trigger('change');
		$input_from.closest('.ibe_form__group--half').addClass('ibe_form__group--half-only-round');

		if ($from_val.length !== "") {
			$input_from.closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
		} else {
			$input_from.closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
			$input_from.closest('.ibe_form__group').find('[data-validate="exist-one-way"]').removeClass('hidden');

		}
		if (selector.closest('[data-validate-searcher]').length > 0) {
			if ($from_val !== "" && $to_val !== "" || $from_val === "" && $to_val !== "") {
				$from_cal.find('.selected-day--to').removeClass('selected-day--to');
				$from_cal.find('.range').removeClass('range');
			}
		}
		$from_cal.datepicker('refresh');
	};

	var activeRountripFunction = function (selector) {
		var $input_from = selector.closest('.ibe-tab__container-desktop').find('[data-cal="start"]'),
			$input_to = selector.closest('.ibe-tab__container-desktop').find('[data-cal="end"]'),
			$from_cal = selector.closest('.ibe-tab__container-desktop').find('[data-function="cal-start"]'),
			$to_cal = selector.closest('.ibe-tab__container-desktop').find('[data-function="cal-end"]');

		$input_to.parent().removeClass('xui-return-date-hide');
		$input_from.parent().removeClass('xui-one-way').parent().addClass('icon-caret_derecha').closest('.ibe_form__group--error').find('[data-cal="start"]').trigger('change');
		$input_from.closest('.ibe_form__group--half').removeClass('ibe_form__group--half-only-round');

		if ($input_from.val() !== "" && $input_to.val() !== "") {
			$from_cal.datepicker('refresh');
			$to_cal.datepicker('refresh');
		} else if ($input_from.val() !== "" && $input_to.val() === "") {
			$to_cal.datepicker('setDate', $from_cal.datepicker('getDate'));
			$input_to.focus();
		}
		if ($input_from.val() === "" || $input_to.val() === "") {
			$input_from.closest('.ibe_form__group').find('[data-validate="exist-one-way"]').addClass('hidden');
			$input_from.closest('.ibe_form__group').find('[data-validate="exist"]').removeClass('hidden');
		} else {
			$input_from.closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
		}
		$from_cal.datepicker('refresh');
		$to_cal.datepicker('refresh');
	};

	var _roundtripFunction = function () {
		if ($(this).is(':checked')) {
			activeRountripFunction($(this));
		}
	};

	var _oneWayFunction = function () {
		var $this = $(this);
		if ($this.is(':checked')) {
			activeOneWayFunction($this);
		}
	};

	var _disableCollapse = function (e) {
		e.preventDefault();
		e.stopPropagation();
	};

	//Function for avoid close when click in the datepicker
	var _preventClicks = function (e) {
		e.preventDefault();
		e.stopPropagation();

		focusArrow = true;
		setTimeout(function () {
			focusArrow = false;
		}, 350);

	}

	var clickReturnPuente = function (e) {
		if ($(this).is(':checked')) {
			$('.ibe-advanced-searcher').find('.ibe-return-puente').hide();
		} else {
			$('.ibe-advanced-searcher').find('.ibe-return-puente').show();
		}
	};

	var clickChangeOrder = function (e) {

		var go = $('[data-ori-go]').val();
		var retu = $('[data-ori-return]').val();

		$('[data-ori-go]').val(retu);
		$('[data-ori-return]').val(go);

		$('[data-des-go]').val(go);
		$('[data-des-return]').val(retu);

	};

	var clickOneWay = function (e) {
		var $this, $group, $groupTo, $inputsTo, $linkTo, $selectTo, $inputCal, $calendarTo, $calendarFrom, $inputFrom;
		if (e === undefined) {
			e = $('[data-calendar-disable]:visible')
		}
		if (e.target !== undefined) {
			$this = $(this);
		} else {
			$this = $(e[0]);
		}
		$group = $this.closest('.ibe_form').find('.ibe_form__group-half');
		$groupTo = $group.last();
		$inputFrom = $group.find('[data-cal="start"]');
		$inputsTo = $groupTo.find('input');
		$linkTo = $groupTo.find('a');
		$selectTo = $groupTo.find('select');
		$inputCal = $groupTo.find('[data-cal="end"]');
		$calendarTo = $groupTo.find('[data-function="cal-end"]');
		$calendarFrom = $group.find('[data-function="cal-start"]');
		if ($this.is(':checked')) {
			$groupTo.addClass('ibe_form__group-half-one-way');
			$inputsTo.attr('disabled', 'disabled');
			$linkTo.attr('tabindex', '-1');
			$selectTo.selectmenu('disable');
			$groupTo.removeClass('ibe_form__group--content');


			if ($calendarFrom.find('.selected-day--to').length > 0) {
				$calendarFrom.find('.selected-day--to').removeClass('selected-day--to');
				$calendarFrom.find('.range').removeClass('range');
			}

			dFrontJs.ibe_validations_searcher.dateValidator($('[data-cal="start"]:visible').parents('.ibe_form__group'))


		} else {
			$groupTo.removeClass('ibe_form__group-half-one-way');
			$inputsTo.removeAttr('disabled');
			$linkTo.attr('tabindex', '0');
			$selectTo.selectmenu('enable');
			if ($calendarTo.find('.selected-day--to').length > 0) {
				$calendarFrom.datepicker('refresh');
				$calendarTo.datepicker('refresh');
				$groupTo.addClass('ibe_form__group--content');
			}
		}

	};

	var _inputsBlur = function (e) {
		var $target = $(e.target);
		var $this, $parent;
		if (!($target.hasClass('ui-datepicker-prev') || $target.hasClass('ui-datepicker-next') || $target.hasClass('ibe-form__check-label'))) {
			e.stopPropagation();
			$this = $(this);
			$parent = $this.closest('[data-toggle="container"]');
			$parent.addClass('isFocus');
			setTimeout(function () {
				var $focus = $(':focus');
				if (!($focus.closest('[data-toggle="container"]').hasClass('isFocus'))) {
					$parent.collapse('hide');
				}
				$parent.removeClass('isFocus');
			});
		}
	};

	//Init Calendar library
	var initCalendar = function ($from, $to) {
		var _focusoutFunction = function (e) {
			var $element = $(e.target),
				$parent = $element.closest('.ibe_form__group--half'),
				$elementFrom = $parent.find('[data-cal="start"]'),
				$elementTo = $parent.find('[data-cal="end"]'),
				$calendar_start = $parent.find('[data-function="cal-start"]'),
				$calendar_end = $parent.find('[data-function="cal-end"]');
			if ($element.val() === "") {
				if ($(e.target).attr('data-cal') === 'start' && $calendar_start.find('.selected-day--from').length > 0) {
					$calendar_start.data('datesRange')[0] = null;
					$calendar_start.datepicker('refresh');
					if ($calendar_end.length > 0) {
						$calendar_end.data('datesRange')[0] = null;
						$calendar_end.datepicker('refresh');
					}

				} else if ($(e.target).attr('data-cal') === 'end' && $calendar_end.find('.selected-day--to').length > 0) {
					$calendar_start.data('datesRange')[1] = null;
					$calendar_start.datepicker('refresh');
					if ($calendar_end.length > 0) {
						$calendar_end.data('datesRange')[1] = null;
						$calendar_end.datepicker('refresh');
					}
				}
			} else if ($parent.hasClass('ibe_form__group--error')) {
				if ($element.attr('data-cal') === 'start' && $calendar_start.find('.selected-day--from').length > 0 && $elementFrom.val().length !== 10) {
					$calendar_start.data('datesRange')[0] = null;
					$calendar_start.datepicker('refresh');
					if ($calendar_end.length > 0) {
						$calendar_end.data('datesRange')[1] = null;
						$calendar_end.datepicker('refresh');
					}

				} else if ($(e.target).attr('data-cal') === 'end' && $calendar_end.find('.selected-day--to').length > 0 && $elementTo.val().length !== 10) {
					$calendar_start.data('datesRange')[1] = null;
					$calendar_start.datepicker('refresh');
					if ($calendar_end.length > 0) {
						$calendar_end.data('datesRange')[1] = null;
						$calendar_end.datepicker('refresh');
					}
				}
			}
			focusDatepicker($(this));
		};
		var _changefromFunction = function () {
			var thisObj = $(this),
				thisValue = thisObj.val(),
				searcherCal = thisObj.closest('.ibe-searcher__calendar'),
				thisParent = thisObj.closest('.ibe_form__group').parent(),
				$calendar_start = thisParent.find('[data-function="cal-start"]'),
				starthour = 0,
				startmin = 0,
				value, selector, nights;

			if (thisParent.find('.xui-one-way').length <= 0 && !thisParent.find('[data-cal="end"]').prop('disabled')) {
				if (thisParent.find('[data-cal="end"]').siblings('[data-cal-button]').length) {
					thisParent.find('[data-cal="end"]').siblings('[data-cal-button]').click();
				} else {
					if (thisParent.find('[data-cal="end"]').val() === "") {
						thisParent.find('[data-cal="end"]').focus();
					}
				}
			} else {
				thisObj.blur();
			}

			if (thisObj.parents('[data-journey]').length > 0) {
				$calendar_start.find('.selected-day--from').addClass('selected-day--both');
				if (thisObj.data('datesRange') !== undefined) {
					thisObj.data('datesRange')[1] = $calendar_start.datepicker('getDate');
				}
			}


			if (thisObj.closest('.ibe_form__group-full').find('.ibe_form__selectize-multi__selectors').length > 0) {
				starthour = searcherCal.find('[data-cal="hour"]').eq(0).val();
				startmin = searcherCal.find('[data-cal="min"]').eq(0).val();
				thisValue = thisValue + '/' + starthour + ':' + startmin;
			}
			thisParent.find('[data-cal="start"]').val(thisValue);
			searcherCal.collapse('hide');

			if (navigator.userAgent.match(/(Android)|(webOS)|(BlackBerry)|(Windows Phone)/i)) {
				thisParent.find('[data-cal="start"]').attr('readonly', true);
			}
			if (navigator.userAgent.match(/(iPhone)|(iPad)|(iPod)/i)) {
				thisParent.find('[data-cal="start"]').siblings('[data-cal-button]').removeClass('hidden');
			}

			if ($('[data-max-night]').length > 0) {
				value = $('[data-max-night]').data('max-night');
				selector = $('.ibe-search-collapse__button--minus');
				nights = parseInt($('[data-night-counter]').text());
				dFrontJs.ibe_counter_night.visualValidation(nights, value, selector);
			}

			//changePetToggle(thisValue);
			focusDatepicker(thisObj);
		};
		var _changeEndFunction = function () {
			var thisObj = $(this),
				thisValue = thisObj.val(),
				thisParent = thisObj.closest('.ibe_form__group').parent(),
				searcherCal = thisObj.closest('.ibe-searcher__calendar'),
				thisToday = thisObj.find('.ui-datepicker-today'),
				endhour = 0,
				endmin = 0,
				value, selector, nights;

			//thisParent.find('[data-function="cal-start"]').datepicker('option', 'maxDate', thisObj.datepicker('getDate'));
			thisParent.find('[data-function="cal-start"]').datepicker('refresh');

			if (thisObj.closest('.ibe_form__group-full').find('.ibe_form__selectize-multi__selectors').length) {
				endhour = searcherCal.find('[data-cal="hour"]').eq(0).val();
				endmin = searcherCal.find('[data-cal="min"]').eq(0).val();
				thisValue = thisValue + '/' + endhour + ':' + endmin;
			}
			thisParent.find('[data-cal="end"]').val(thisValue);
			searcherCal.collapse('hide');
			if (thisObj.closest('[data-validate-searcher]').length) {
				//dateValidator($(this).closest('.ibe_form__group'));
			}
			if (navigator.userAgent.match(/(Android)|(webOS)|(BlackBerry)|(Windows Phone)/i)) {
				thisParent.find('[data-cal="end"]').attr('readonly', true);
				thisParent.find('[data-cal="end"]').siblings('[data-cal-button]').removeClass('hidden');
			}
			if (navigator.userAgent.match(/(iPhone)|(iPad)|(iPod)/i)) {
				thisParent.find('[data-cal="end"]').siblings('[data-cal-button]').removeClass('hidden');
			}

			if (thisToday) {
				setTimeout(function (e) {
					thisToday.addClass('ui-datepicker-current-day');
					thisToday.removeClass('ui-datepicker-today');
				}, 50)
			}

			if ($('[data-max-night]').length > 0) {
				value = $('[data-max-night]').data('max-night');
				selector = $('.ibe-search-collapse__button--plus');
				nights = parseInt($('[data-night-counter]').text());
				dFrontJs.ibe_counter_night.visualValidation(nights, value, selector);
			}

			focusDatepicker(thisObj);
		};

		var $calStart = $('[data-function="cal-start"]');
		var $journey = $from.closest($('[data-journey]')).length;
		var datepicker, language, format, firstday, datepicker__updateDatepicker, onAfterUpdate, showMonth, totalDate, $this,
			newTotalDate, dataHour, fechaInicio, fechaFin, diff, newDiff;

		if ($calStart.length) {

			datepicker = {
				minDate: 0,
				maxDate: getDatePickerMaxDate($calStart)
			}
			//Language
			language = $calStart.attr('data-language') ? $calStart.attr('data-language') : 'en';
			$.datepicker.setDefaults($.datepicker.regional[language]);	//the language is applied in integration WCS
			//Format
			format = $calStart.attr('data-format') ? $calStart.attr('data-format') : $.datepicker.regional[language].dateFormat;
			//Firstday
			firstday = $calStart.attr('data-firstday') ? $calStart.attr('data-firstday') : $.datepicker.regional[language].firstDay;

			Date.prototype.yyyymmdd = function (sep) {
				var mm = this.getMonth() + 1;
				var dd = this.getDate();

				return {
					'mm': mm,
					'dateFormat': [this.getFullYear(), mm, dd].join(sep),
					'yyyy': this.getFullYear(),
					'dd': dd
				};
			};

			$.datepicker._defaults.onAfterUpdate = null;
			datepicker__updateDatepicker = $.datepicker._updateDatepicker;
			$.datepicker._updateDatepicker = function (inst) {
				datepicker__updateDatepicker.call(this, inst);
				onAfterUpdate = this._get(inst, 'onAfterUpdate');
				if (onAfterUpdate)
					onAfterUpdate.apply((inst.input ? inst.input[0] : null), [(inst.input ? inst.input.val() : ''), inst]);
			};



			showMonth = getNumberMonth();
			$from.off('change');
			$from.datepicker({
				minDate: datepicker.minDate,
				maxDate: datepicker.maxDate,
				dateFormat: format,
				firstDay: firstday,
				numberOfMonths: showMonth,
				beforeShowDay: rangeDays,
				onSelect: function (e, date) {
					var $this = $(this),
						$parent = $this.parents('.ibe_form__group--half'),
						$this_to = $parent.find('[data-function="cal-end"]').length > 0 ? $parent.find('[data-function="cal-end"]') : $this,
						$input_from = $parent.find('[data-cal="start"]'),
						$vintage = $('.ibe-searcher__vintage'),
						$input_to = $parent.find('[data-cal="end"]').length > 0 ? $parent.find('[data-cal="end"]') : $input_from,
						$modal = $('.ibe_form__group-half').find('[data-dinamic-open]'),
						idCal, dateTo, dateForm, _mouseoverTDtoFunction;
					/*
					if (!$input_from.hasClass('initRangeDatepicker')) {
						$input_from.addClass('initRangeDatepicker');
						$this.datepicker('option', 'beforeShowDay', rangeDays);
						if (!$this.parents('[data-journey="parent"]').length > 0) {
							$input_to.addClass('initRangeDatepicker');
							requestAnimFrame(function () {
								$this_to.datepicker('option', 'beforeShowDay', rangeDays);
							});
						}
					}*/

					requestAnimFrame(function () {
						if ($this.data('datesRange')[1] !== null && $this.data('datesRange')[0].getTime() === $this.data('datesRange')[1].getTime()) {
							$this_to.find('.selected-day--from').addClass('selected-day--both');
							$this.find('.selected-day--from').addClass('selected-day--both');
						}
						if ($this.data('datesRange')[1] === null && $this.data('datesRange')[0].getTime()) {
							$this.find('.selected-day--from').addClass('selected-day--both');
						}
					});

					if ($this.parents('[data-journey="parent"]').length > 0) {
						$this.find('.selected-day--from').addClass('selected-day--both');
					}

					$this.trigger('change');
					if ($journey) {
						dFrontJs.ibe_journey.controlDates($this);
					}

					if ($parent.hasClass('ibe_form__group--error') && $input_to.val().length === 10 || $parent.hasClass('ibe_form__group--error') && $input_from.val().length === 10) {
						$parent.removeClass('ibe_form__group--error');
						$parent.find('[data-validate]').addClass('hidden');
					}


					if ($vintage.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {

						idCal = $input_from.attr('data-target');
						$(idCal).off('hide.bs.collapse', _disableCollapse);
						$(idCal).collapse('hide');


						// Only oneway
						requestAnimFrame(function () {
							var colDate;
							if ($input_from.val() !== "" && $('input[data-function="oneway"]:checked').length > 0) {
								colDate = $('.ibe-searcher__col--date');
								colDate.removeClass('modal-mode');
								$('.ibe-button-close-modal').hide();
								colDate.parents('.ibe-accordion.active').css('overflow', '');
							}
						}, 500);

					} else if ($modal.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
						// Only oneway
						requestAnimFrame(function () {
							if ($input_from.val() !== "" && $('input[data-click="oneway"]').length > 0 &&
								!$('input[data-click="oneway"]').is(':checked')) {
								dFrontJs.ibe_dinamic_modal.close($modal);
							}
						}, 500);
					}

					_mouseoverTDtoFunction = function () {
						var hoverDate = $('a', this).html() + '/' + ($(this).data('month') + 1) + '/' + $(this).data('year'), //Cell where hover
							dateParts = hoverDate.split('/'),
							date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]),
							time = date.getTime(),
							day_to,
							td = $(this).parents('.ibe_form__group--half').find('[data-function="cal-end"]').find('td');

						if ($this.data('datesRange')[0] !== null) {
							day_to = $this.data('datesRange')[0].getTime(); //Day to
						}
						//$('.isHover').removeClass('isHover');
						//$(this).addClass('isHover');
						$(td).each(function (index) {
							var dateClass = $(this).attr('class')||'';
							var dateMatch=[];
							var year, month,day; 
							if ($(this).data('month')){
								year = $(this).data('year');
								month = $(this).data('month');
								day = $('a', this).html();
							} else {
								dateMatch = dateClass.match(/\bactualDate-(([0-9]{1,2})_([0-9]{1,2})_([0-9]{4}))\b/);
								if (dateMatch && dateMatch.length === 5){
									year = parseInt(dateMatch[4], 10);
									month = parseInt(dateMatch[3], 10) -1;
									day = parseInt(dateMatch[2], 10);
								}
							}

							var cellDate = day + '/' + (month + 1) + '/' + year, //All cell date
								dateParts = cellDate.split('/'),
								dateCell = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]),
								timeCell = dateCell.getTime(),
								$roundtrip = $('[data-function="roundtrip"]'),
								$switch = $('[data-click="oneway"]');


							if (day_to <= timeCell && timeCell <= time && $roundtrip.is(':checked') ||
								day_to <= timeCell && timeCell <= time && $switch.is(':checked')) { //If td in the middel of to date and hover date
								$(this).addClass('mouse');
							} else {
								$(this).removeClass('mouse');
							}
						});
					};
					//Function to mouseover
					$this_to.off('mouseover', '.ui-datepicker td', _mouseoverTDtoFunction);
					$this_to.on('mouseover', '.ui-datepicker td', _mouseoverTDtoFunction);

					//Update array for the days in both calendar
					dateTo = $this_to.datepicker('getDate');
					dateForm = $this.datepicker('getDate');

					$this.data('datesRange', [dateForm, dateTo]);
					$this_to.data('datesRange', [dateForm, dateTo]);

					$this_to.datepicker('refresh');

					//Show specific month at calendar
					if ($input_to.val() === "") {
						$this_to.datepicker('setDate', dateForm);
						$this_to.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');
						$this_to.find('.range').removeClass('range');
					}


					if ($this.data('datesRange')[1] !== null) { //If exist date in to
						if ($this.data('datesRange')[0].getTime() > $this.data('datesRange')[1].getTime()) { //If date from is late than to
							$this_to.find('td.selected-day--to').removeClass('selected-day--to');

							$this_to.find('.range').removeClass('range');
							$this.find('.range').removeClass('range');

							$this.data('datesRange', [dateForm, null]);
							$this_to.data('datesRange', [dateForm, null]);


							$input_to.val('');
							!$input_to.prop('disabled') && $input_to.focus(); //open de to calendar
							$input_to.closest('.ibe_form__group-half').removeClass('ibe_form__group--content');
							$this_to.datepicker('setDate', 'null');

							//For open the calendar in specific months
							$this_to.datepicker('setDate', dateForm);
							$this_to.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');
						} else if ($input_to.val() !== "") {
							if ($vintage.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
								dFrontJs.ibe_modals_vintage.closeModalDatepicker();
							} else if ($modal.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
								dFrontJs.ibe_dinamic_modal.close($parent);
							}
						}
					}

				},
				onAfterUpdate: function () {
					var $this = $(this),
						selParent = $this.closest('.ibe_form__group--half').parent(),
						elem = selParent.find('[data-cal="start"]'),
						$dataDayCalendar = $this.parent().find('[data-hour-restriction]');

					selParent.find('a.ui-corner-all').attr('href', '#');

					$('[data-event="click"]').off('click', _preventClicks);
					$('[data-event="click"]').on('click', _preventClicks);

					if ($dataDayCalendar.length && (!elem.val() || elem.closest('.ibe_form__group--error').length)) {
						$dataDayCalendar.parents('.ibe_form__group').find('[data-function="cal-end"]').find('.ui-datepicker-current-day').removeClass('ui-datepicker-today');
						$dataDayCalendar.parents('.ibe_form__group').find('[data-function="cal-start"]').find('.ui-datepicker-current-day').addClass('ui-datepicker-today').removeClass('ui-datepicker-current-day');
					} else {
						$dataDayCalendar.parents('.ibe_form__group').find('[data-function="cal-end"]').find('.ui-datepicker-current-day').removeClass('ui-datepicker-today');
					}
					noFlightsTooltip(this);

				}
			}).on('change', _changefromFunction).on('focusout', _focusoutFunction).parents('.ibe_form__group--half').find('[data-cal="start"]').on('keyup', _inputsKeyup);



			if ($from.parents('.ibe_form__group--half').find('[data-cal="start"]') === "") {
				$from.datepicker('setDate', null);	//Default set null date datepicker Start
			}


			if ($journey) {
				dFrontJs.ibe_journey.controlDates($from.parents('.ibe_form__group--half').find('.hasDatepicker'));
			}


			$to.off('change');
			$to.datepicker({
				minDate: datepicker.minDate,
				maxDate: datepicker.maxDate,
				dateFormat: format,
				firstDay: firstday,
				numberOfMonths: showMonth,
				beforeShowDay: rangeDays,
				onSelect: function () {
					var $this = $(this),
						$parent = $this.parents('.ibe_form__group--half'),
						$this_from = $parent.find('[data-function="cal-start"]'),
						$input_from = $parent.find('[data-cal="start"]'),
						$input_to = $parent.find('[data-cal="end"]'),
						$vintage = $('.ibe-searcher__vintage'),
						$modal = $('.ibe_form__group-half').find('[data-dinamic-open]'),
						idCal, colDate, dateTo, dateFrom, _mouseoverTDtoFunction, _mouseoverTDfromFunction;

					/*if (!$input_to.hasClass('initRangeDatepicker')) {
						$input_to.addClass('initRangeDatepicker');
						$input_from.addClass('initRangeDatepicker');
						$this.datepicker('option', 'beforeShowDay', rangeDays);
						requestAnimFrame(function () {
							$this_from.datepicker('option', 'beforeShowDay', rangeDays);
						});
					}*/

					requestAnimFrame(function () {
						if ($this.data('datesRange')[0] !== null && $this.data('datesRange')[0].getTime() === $this.data('datesRange')[1].getTime()) {
							$this_from.find('.selected-day--from').addClass('selected-day--both');
							$this.find('.selected-day--from').addClass('selected-day--both');
						}
					});


					$this.trigger('change');
					dFrontJs.ibe_journey.controlDates($this);

					if ($parent.hasClass('ibe_form__group--error') && $input_from.val().length === 10) {
						$parent.removeClass('ibe_form__group--error');
						$parent.find('[data-validate]').addClass('hidden');
					}

					if ($vintage.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
						idCal = $input_to.attr('data-target');
						$(idCal).off('hide.bs.collapse', _disableCollapse);
						$(idCal).collapse('hide');

						if ($input_from.val() !== "" && $input_to.val() !== "") {
							colDate = $('.ibe-searcher__col--date');
							colDate.removeClass('modal-mode');
							$('.ibe-button-close-modal').hide();
							colDate.parents('.ibe-accordion.active').css('overflow', '');
						}
					}

					_mouseoverTDfromFunction = function () {
						var hoverDate = $('a', this).html() + '/' + ($(this).data('month') + 1) + '/' + $(this).data('year'), //Cell where hover
							dateParts = hoverDate.split('/'),
							date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]),
							time = date.getTime(),
							day_from, //Day from
							td = $(this).parents('.ibe_form__group--half').find('[data-function="cal-start"]').find('td');

						if ($this.data('datesRange')[1] !== null) {
							day_from = $this.data('datesRange')[1].getTime();
						}

						$(td).each(function () {
							var year, month, day, cellDate, dateParts, dateCell, timeCell,  $roundtrip, $switch, dateClass, dateMatch = [];
								dateClass = $(this).attr('class')||'';
								if ($(this).data('month')) {
									year = $(this).data('year');
									month = $(this).data('month');
									day = $('a', this).html();
								} else {
									dateMatch = dateClass.match(/\bactualDate-(([0-9]{1,2})_([0-9]{1,2})_([0-9]{4}))\b/);
									if (dateMatch && dateMatch.length === 5){
										year = parseInt(dateMatch[4], 10);
										month = parseInt(dateMatch[3], 10) -1;
										day = parseInt(dateMatch[2], 10);
									}
								}
								cellDate = day + '/' + (month + 1) + '/' + year; //All cell date
								dateParts = cellDate.split('/');
								dateCell = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
								timeCell = dateCell.getTime();
								$roundtrip = $('[data-function="roundtrip"]');
								$switch = $('[data-click="oneway"]');

							if (timeCell <= day_from && time <= timeCell && $roundtrip.is(':checked')
								|| timeCell <= day_from && time <= timeCell && $switch.is(':checked')) { //If td in the middel of to date and hover date
								$(this).addClass('mouse');
							} else {
								$(this).removeClass('mouse');
							}
						})
					};

					//Function to mouseover
					$this_from.off('mouseover', '.ui-datepicker td', _mouseoverTDfromFunction);
					$this_from.on('mouseover', '.ui-datepicker td', _mouseoverTDfromFunction);


					dateFrom = $this_from.datepicker('getDate');
					dateTo = $this.datepicker('getDate');

					if ($input_from.val() !== "") {

						$this.data('datesRange', [dateFrom, dateTo]);
						$this_from.data('datesRange', [dateFrom, dateTo]);

					} else {

						//Show specific month at calendar
						$this_from.datepicker('setDate', dateTo);
						$this_from.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');

						$this_from.find('td.selected-day--from').removeClass('selected-day--from');

						$this_from.find('td.range').removeClass('range');
						$this.find('td.range').removeClass('range');

						$this.data('datesRange', [null, dateTo]);
						$this_from.data('datesRange', [null, dateTo]);

						$input_from.focus(); //If not has from, open it

					}


					if ($this.data('datesRange')[0] !== null) {
						if ($this.data('datesRange')[0].getTime() === $this.data('datesRange')[1].getTime()) {
							$this_from.find('td.selected-day--from').addClass('selected-day--both');
							$this.find('td.selected-day--from').addClass('selected-day--both');
						}
						if ($this.data('datesRange')[1].getTime() < $this.data('datesRange')[0].getTime()) {

							$this_from.find('td.selected-day--from').removeClass('selected-day--from');

							$this_from.find('td.range').removeClass('range');
							$this.find('td.range').removeClass('range');

							$this.data('datesRange', [null, dateTo]);
							$this_from.data('datesRange', [null, dateTo]);

							$input_from.val('');
							$input_from.closest('.ibe_form__group-half').removeClass('ibe_form__group--content');

							//Show specific month at calendar
							$this_from.datepicker('setDate', dateTo);
							$this_from.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');

							$this_from.datepicker('refresh');
							$input_from.focus();
						} else {
							if ($modal.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
								dFrontJs.ibe_dinamic_modal.close($parent);
							}
						}

					}

					$this_from.datepicker('refresh');

				},
				onAfterUpdate: function (date, elem) {
					var $this = $(this),
						selParent = $this.closest('.ibe_form__group--half'),
						elem = selParent.find('[data-cal="start"]'),
						$dataDayCalendar = $this.parent().find('[data-hour-restriction]');

					selParent.find('a.ui-corner-all').attr('href', '#');

					$('[data-event="click"]').off('click', _preventClicks);
					$('[data-event="click"]').on('click', _preventClicks);

					if ($dataDayCalendar.length && ((!elem.val() && $this.val()) || elem.closest('.ibe_form__group--error').length)) {
						$dataDayCalendar.parents('.ibe_form__group').find('[data-function="cal-start"],[data-function="cal-end"]').find('.ui-datepicker-days-cell-over').addClass('ui-datepicker-today');
						if (elem.closest('.ibe_form__group--error').length) {
							$dataDayCalendar.parents('.ibe_form__group').find('[data-function="cal-end"]').find('.ui-datepicker-current-day').removeClass('end-selected');
							$dataDayCalendar.parents('.ibe_form__group').find('[data-function="cal-end"]').find('.ui-datepicker-current-day').removeClass('ui-datepicker-today');
						}
					} else {
						$dataDayCalendar.parents('.ibe_form__group').find('[data-function="cal-end"]').find('.ui-datepicker-current-day').removeClass('ui-datepicker-today');
					}
					noFlightsTooltip(this);
				}
			}).on('change', _changeEndFunction).on('focusout', _focusoutFunction).parents('.ibe_form__group--half').find('[data-cal="end"]').on('keyup', _inputsKeyup);

			


			if ($to.parents('.ibe_form__group--half').find('[data-cal="start"]') === "") {
				$to.datepicker('setDate', null);	//Default set null date datepicker End
			}
			//change date for hours

			totalDate = new Date();

			//Function for hour restriction

			if ($from.parent().find('[data-hour-restriction]').length > 0) {
				$this = $from.parent().find('[data-hour-restriction]');
				newTotalDate = new Date();
				dataHour = parseInt($this.attr('data-hour-restriction'));

				newTotalDate.setMilliseconds(dataHour * 60 * 60 * 1000); //Horas por segundos/hora
				newTotalDate.setHours(0);
				newTotalDate.setMinutes(0);
				newTotalDate.setSeconds(0);

				fechaInicio = totalDate.getTime();
				fechaFin = newTotalDate.getTime();
				diff = fechaFin - fechaInicio;
				newDiff = Math.ceil(diff / (1000 * 60 * 60 * 24));


				$this.parents('.ibe_form__group').find('[data-function="cal-start"],[data-function="cal-end"]').datepicker('option', 'minDate', newDiff);
			}

		}
	}; //initCalendar


	////////

	var _touchStartFunction = function (e) {
		var $this = $(this),
			$header_top = $('.ibe_form__group-half').height(),
			$htmlScrollTop = $('html').scrollTop() > 0 ? $('html').scrollTop() : $('body').scrollTop(),
			$vintage = $('.ibe-searcher__vintage'),
			$modal = $this.parent().find(('[data-dinamic-open]')),
			calendar, parent, thisContainer;
		if (!$this.parents('.ibe_form__group--half').hasClass('fc-initCalendar')) {
			initCalendar($this.parents('.ibe_form__group--half').find('[data-function="cal-start"]'), $this.parents('.ibe_form__group--half').find('[data-function="cal-end"]'));
			$this.parents('.ibe_form__group--half').addClass('fc-initCalendar');
		}
		// e.preventDefault();
		e.stopImmediatePropagation();

		//Collapse others data-toggle="container" collapsed when data-cal-button clicks/touchstarts
		$('[data-toggle="container"]').not($(this).parents()).collapse('hide');
		if (!$this.hasClass('hidden')) {
			$this.addClass('hidden');
			$this.closest('.fc_form_group').find('[data-cal]').addClass('collapsed');
			$this.closest('.fc_form_group').find('[data-toggle="container"]').collapse('show');
		}
		calendar = $this.parent().find('[data-cal]').data('cal');
		parent = $this.closest('.ibe_form__group');
		if (calendar === 'start') {
			parent.find('[data-cal="end"] + [data-cal-button]').removeClass('hidden');
			parent.find('[data-cal="start"] + [data-cal-button]').addClass('hidden');
			parent.find('[data-function="cal-end"]').parent().collapse('hide');
			$('.focus-ios').removeClass('focus-ios');
			parent.find('[data-cal="start"]').parent().addClass('focus-ios');
		} else {
			parent.find('[data-cal="start"] + [data-cal-button]').removeClass('hidden');
			parent.find('[data-cal="end"] + [data-cal-button]').addClass('hidden');
			parent.find('[data-function="cal-start"]').parent().collapse('hide');
			$('.focus-ios').removeClass('focus-ios');
			parent.find('[data-cal="end"]').parent().addClass('focus-ios');
		}

		//For vintage open modals
		if ($vintage.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
			dFrontJs.ibe_modals_vintage.openModalDatepicker();
		}
		if ($modal.length > 0 && (window.innerWidth < dFrontJs.resolutions.lg)) {
			thisContainer = $this.closest('.ibe_form__group-half').find('[data-toggle="container"]');
			$this.closest('.ibe_form__group').addClass('ibe-dinamic-modal');
			$this.closest('.ibe_form__group').attr('data-keyboard-close', 'esc');
			$('body').css('overflow', 'hidden');

			$this.parents('.ibe_form__group-half').find('.ibe-searcher__calendar').animate({
				scrollTop: 0
			});

			if ($this.val() !== "") {
				setTimeout(function () {
					var selectedToTop, aux;
					if ($this.attr('data-cal') === 'start') {
						// requestAnimationFrame(function(){
						aux = $this.parents('.ibe_form__group-half').find('.selected-day--from').parents('.ui-datepicker-group').offset();
						if (aux !== undefined) {
							selectedToTop = aux.top - parseInt($header_top) - $htmlScrollTop;
						}
						// })

					} else {
						aux = $this.parents('.ibe_form__group-half').find('.selected-day--to').parents('.ui-datepicker-group').offset();
						if (aux !== undefined) {
							selectedToTop = aux.top - parseInt($header_top) - $htmlScrollTo;
						}
					}

					$this.parents('.ibe_form__group-half').find('.ibe-searcher__calendar').animate({
						scrollTop: selectedToTop
					}, 600);
				}, 900)
			}
		}
	};


	var init = function () {
		var $from = $('[data-function="cal-start"]'),
			$end = $('[data-function="cal-end"]'),
			$both = $('[data-cal]'),
			$checkDisabledCalendar = $('[data-calendar-disable]:visible'),
			$input_fromVisible = $('[data-cal="start"]:visible'),
			$input_toVisible = $('[data-cal="end"]:visible'),
			$calendar_react = $('.ibe-searcher__calendar-react');

		requestAnimFrame(function () {

			if ($('[data-one-month]').length > 0 && !$input_fromVisible.parents('.ibe_form__group--half').hasClass('fc-initCalendar')) {
				initCalendar($input_fromVisible.parents('.ibe_form__group--half').find('[data-function="cal-start"]'), $input_toVisible.parents('.ibe_form__group--half').find('[data-function="cal-end"]'));
				$input_fromVisible.parents('.ibe_form__group--half').addClass('fc-initCalendar');
			}

			//- Control de Teclado de Dispositivos Móviles Reales
			if (navigator.userAgent.match(/(Android)|(webOS)|(BlackBerry)|(Windows Phone)/i)) {
				$('[data-cal="start"]').attr('readonly', true);
				$('[data-cal="end"]').attr('readonly', true);
			} else if (navigator.userAgent.match(/(iPhone)|(iPad)|(iPod)/i)) {
				$('[data-cal="start"]').each(function () {

					var text = $(this).siblings('label').text();
					var button = '<button type="button" class="ibe_form__button-hide" data-cal-button="start"><span class="hideAccessible">' + text + '</span></button>';
					$(button).insertAfter($(this));
				});
				$('[data-cal="end"]').each(function () {

					var text = $(this).siblings('label').text();
					var button = '<button type="button" class="ibe_form__button-hide" data-cal-button="end"><span class="hideAccessible">' + text + '</span></button>';
					$(button).insertAfter($(this));
				});

				//Touchstart for work in ios
				$('[data-cal-button]').off('touchstart click', _touchStartFunction);
				$('[data-cal-button]').on('touchstart click', _touchStartFunction);
			}

			// Update the multi-journey calendar (advanced search), when the date is modified automatically. Use the 'keyup' functionality

			//Focus Inverse Accesible Keyboard
			$('[data-cal="start"]').off('focus', _calStartFocus);
			$('[data-cal="start"]').on('focus', _calStartFocus);

			//Prevent the collapse of the calendar in IOS devices when selecting first return
			$('[data-cal="start"],[data-cal="end"]').on('focus', function (e) {
				var eventInput = $(e.target);
				var calendar = $(eventInput.data('target'));

				if (navigator.userAgent.match(/(iPhone)|(iPad)|(iPod)/i)) {
					$('.focus-ios').removeClass('focus-ios');
					eventInput.addClass('focus-ios');
					// Delete height for collapse in
					if (navigator.userAgent.match(/(iPhone)/i)) {
						// Delete height for collapse in
						calendar.css('height', '');
					}
				}
			});

			//INITCALENDAR when click input (this Calendar)
			$('[data-cal="end"],[data-cal="start"]').on('focus click', function (e) {
				var $this = $(this);
				var $header_top = $('.ibe_form__group-half').height(),
					$htmlScrollTop = $('html').scrollTop() > 0 ? $('html').scrollTop() : $('body').scrollTop(),
					$vintage = $('.ibe-searcher__vintage'),
					$modal = $this.is('[data-dinamic-open]'),
					$journey = $('[data-journey="journey"]').length,
					idCal = $(this).attr('data-target'),
					$parent = $this.closest('.ibe_form__group--half'),
					$input_from = $parent.find('[data-cal="start"]'),
					$input_to = $parent.find('[data-cal="end"]'),
					$from_cal = $parent.find('[data-function="cal-start"]'),
					$to_cal = $parent.find('[data-function="cal-end"]'),
					thisContainer, id, $id;

				if (!$this.parents('.ibe_form__group--half').hasClass('fc-initCalendar')) {
					initCalendar($this.parents('.ibe_form__group--half').find('[data-function="cal-start"]'), $this.parents('.ibe_form__group--half').find('[data-function="cal-end"]'));
					$this.parents('.ibe_form__group--half').addClass('fc-initCalendar');
				}

				if ($(idCal).parents('.ibe-dinamic-modal').length > 0 && $this.attr('aria-expanded') === 'true') {
					e.stopPropagation();
				}

				if ($vintage.length > 0 && (window.innerWidth < dFrontJs.resolutions.lg)) {
					//Al abrir el calendario, reinicio su posicion (top 0)
					$this.parents('.ibe-searcher__col.ibe-searcher__col--date.modal-mode').find('.ibe-searcher__calendar--all-months').animate({
						scrollTop: 0
					});

					idCal = $(this).attr('data-target');
					//si tiene fecha, hacer scroll hacia la ida o la vuelta

					if ($(this).val() !== "") {
						setTimeout(function () {
							var selectedToTop, aux;
							if ($this.attr('data-cal') === 'start') {
								aux = $this.parents('.ibe_form__group-half').find('.selected-day--from').parents('.ui-datepicker-group').offset();
								if (aux !== undefined) {
									selectedToTop = aux.top - parseInt($header_top);
								}
							} else {
								aux = $this.parents('.ibe_form__group-half').find('.selected-day--to').parents('.ui-datepicker-group').offset();
								if (aux !== undefined) {
									selectedToTop = aux.top - parseInt($header_top);
								}
							}
							$this.parents('.ibe-searcher__col.ibe-searcher__col--date.modal-mode').find('.ibe-searcher__calendar--all-months').animate({
								scrollTop: selectedToTop

							}, 600);
						}, 900);
					} else {

						setTimeout(function () {
							var selectedToTop, aux;
							if ($this.attr('data-cal') === 'start') {
								aux = $this.parents('.ibe_form__group-half').find('.selected-day--to').parents('.ui-datepicker-group').offset();
								if (aux !== undefined) {
									selectedToTop = aux.top - parseInt($header_top);
								}
							} else {
								aux = $this.parents('.ibe_form__group-half').find('.selected-day--from').parents('.ui-datepicker-group').offset();
								if (aux !== undefined) {
									selectedToTop = aux.top - parseInt($header_top);
								}

							}

							$this.parents('.ibe-searcher__col.ibe-searcher__col--date.modal-mode').find('.ibe-searcher__calendar--all-months').animate({
								scrollTop: selectedToTop
							}, 600);


						}, 900);
					}


					if ($(idCal).hasClass('in')) {

						$(idCal).off('hide.bs.collapse', _disableCollapse)
						$(idCal).on('hide.bs.collapse', _disableCollapse)
					} else {

						$(idCal).off('hide.bs.collapse', _disableCollapse)
					}

				}

				if ($modal && (window.innerWidth < dFrontJs.resolutions.lg)) {
					thisContainer = $this.closest('.ibe_form__group-half').find('[data-toggle="container"]')
					$this.closest('.ibe_form__group').addClass('ibe-dinamic-modal');
					$this.closest('.ibe_form__group').attr('data-keyboard-close', 'esc');
					$('body').css('overflow', 'hidden');

					$this.parents('.ibe_form__group-half').find('.ibe-searcher__calendar').animate({
						scrollTop: 0
					});

					if ($this.val() !== "") {
						setTimeout(function () {
							var selectedToTop, aux;
							if ($this.attr('data-cal') === 'start') {
								// requestAnimationFrame(function(){
								aux = $this.parents('.ibe_form__group-half').find('.selected-day--from').parents('.ui-datepicker-group').offset();
								if (aux !== undefined) {
									selectedToTop = aux.top - parseInt($header_top) - $htmlScrollTop;
								}
								// })

							} else {
								aux = $this.parents('.ibe_form__group-half').find('.selected-day--to').parents('.ui-datepicker-group').offset();
								if (aux !== undefined) {
									selectedToTop = aux.top - parseInt($header_top) - $htmlScrollTop;
								}
							}

							$this.parents('.ibe_form__group-half').find('.ibe-searcher__calendar').animate({
								scrollTop: selectedToTop
							}, 600);
						}, 900)
					}
				}

				if ($(this).parents('.ibe-search-flights__search-box').length > 0) {
					$('.ibe-overlay').show();
					$('[data-function="data-focus-searcher"], [data-function="data-focus-searcher-mobile"], .ibe-search-flights__search--overlay').css('z-index', '10000');
				}


				if (!$('[data-toggle="container"]').hasClass('off')) {
					$('[data-toggle="container"]').not($(this).parents()).collapse('hide');
				}

				$this = $(this);
				id = $this.attr('data-target');
				$id = $(id);

				if ($id.is(':hidden')) {

					//- Control de Teclado de Dispositivos Móviles Reales
					if (navigator.userAgent.match(/(Android)|(webOS)|(BlackBerry)|(Windows Phone)/i)) {
						$id.collapse('show');
						$this.removeClass('collapse');
					}
					if (navigator.userAgent.match(/(iPhone)|(iPad)|(iPod)/i)) {
						$this.siblings('[data-cal-button]').removeClass('hidden');
					} else {
						$id.collapse('show');
						$this.removeClass('collapse');
					}

				}

				if (!$this.parents('[data-journey="parent"]').length > 0) {
					if ($input_from.val() !== "" && $input_to.val() === "") {
						$to_cal.datepicker('setDate', $from_cal.datepicker('getDate'));
					} else if ($input_from.val() === "" && $input_to.val() !== "") {
						$from_cal.datepicker('setDate', $to_cal.datepicker('getDate'));
					}
				}
			});


			//Focus Accesible Keyboard - Test
			$('.ibe-searcher__calendar--start,.ibe-searcher__calendar--end').off('blur', _inputsBlur);
			$('.ibe-searcher__calendar--start,.ibe-searcher__calendar--end').on('blur', _inputsBlur);


			if ($('[data-one-month]').length) {
				$('[data-one-month]').parents('.ibe_form__group').find('[data-function="cal-start"], [data-function="cal-end"]').datepicker('option', 'numberOfMonths', 1);
			}
			$('[data-cal="start"]').closest('.ibe_form__group--half').parent().find('.ibe-searcher__calendar').css('opacity', '1');

			//Control Foco Datepìcker
			// ------------------------------- Control focus datepicker ---------------------------------------------------
			//-------------------------------------------------------------------------------------------------------------
			if ($from.length) {
				$from.change(function (e) {
					focusDatepicker($(this));
				});
				$end.change(function (e) {
					focusDatepicker($(this));
				});
				$both.each(function (e) {
					focusDatepicker($(this));
				});

			}

			changeNumberMonth($from, $end);

			if ($checkDisabledCalendar.is(':checked')) {
				clickOneWay();
			}

			//*******************************************************************************************
			//*** Cambiar campos de fechas en el buscador de vuelos al elegir solo ida, o ida y vuelta***
			//*******************************************************************************************
			$('[data-calendar-disable]').off('click', clickOneWay);
			$('[data-calendar-disable]').on('click', clickOneWay);

			//*******************************************************************************************
			//*** Mostrar / ocultar la vuelta en españa puente aereo***
			//*******************************************************************************************
			$('[data-return-puente]').off('click', clickReturnPuente);
			$('[data-return-puente]').on('click', clickReturnPuente);

			//*******************************************************************************************
			//*** Cambiar orden de vuelo MAD/BCN en españa puente aereo***
			//*******************************************************************************************
			$('[data-change-order]').off('click', clickChangeOrder);
			$('[data-change-order]').on('click', clickChangeOrder);

			//----------------------------------------------------------------------------------------------------------
			//-------------------------------- Funcionalidad sólo ida, ida y vuelta ------------------------------------
			//----------------------------------------------------------------------------------------------------------
			if ($('[data-function="oneway"]').length) {

				$('[data-function="oneway"]').off('click', _oneWayFunction);
				$('[data-function="oneway"]').on('click', _oneWayFunction);

				$('[data-function="roundtrip"]').off('click', _roundtripFunction);
				$('[data-function="roundtrip"]').on('click', _roundtripFunction);
			}

			if ($('[data-click="oneway"]').length > 0) {
				$('[data-click="oneway"]').off('click', _disableRound);
				$('[data-click="oneway"]').on('click', _disableRound);
			}

			endTimeCalendar = Date.now();
		});
	};


	var focusDatepicker = function (object) {
		var obj = $(object);
		var parent = obj.closest('.fc_form_group');
		if (obj.val() !== "") {
			parent.addClass('ibe_form__group--content');
		} else {
			parent.removeClass('ibe_form__group--content');
		}
	}

	var getNumberMonth = function () {
		var $vintage = $('.ibe-searcher__vintage'),
			$modal = $('.ibe_form__group-half').find('[data-dinamic-open]');


		if ($vintage.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
			return 12;
		} else if ($modal.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
			return 12;
		}
		if (window.innerWidth < dFrontJs.resolutions.md) {
			return 1;
		}
		return 2;
	};


	//-----------------------------------------------------------------------------------------------------
	//-------------------------------- CHANGE FOR VINTAGE DATE RESPONSIVE ---------------------------------
	//----------------------------------------------------------------------------------------------------

	var changeNumberMonth = function ($from, $end) {

		var $vintage = $('.ibe-searcher__vintage'),
			$modal = $('.ibe_form__group-half').find('[data-dinamic-open]'),
			$advancedFly = $('.ibe-advanced-searcher--fly'),
			$ida = $advancedFly.find('[data-function="cal-start"]'),
			$vuelta = $advancedFly.find('[data-function="cal-end"]');


		if ($vintage.length > 0) {

			if (window.innerWidth < dFrontJs.resolutions.lg) {
				$vintage.find('[data-function="cal-start"], [data-function="cal-end"]').parent().addClass('ibe-searcher__calendar--all-months');
			} else {
				$vintage.find('[data-function="cal-start"], [data-function="cal-end"]').parent().removeClass('ibe-searcher__calendar--all-months');
			}
			$(window).on('resize', function (e) {
				if (window.innerWidth < dFrontJs.resolutions.lg) {
					$vintage.find('[data-function="cal-start"], [data-function="cal-end"]').parent().addClass('ibe-searcher__calendar--all-months');
				}
				$from.each(function () {
					$(this).datepicker('option', 'numberOfMonths', getNumberMonth());
				});
				$end.each(function () {
					$(this).datepicker('option', 'numberOfMonths', getNumberMonth());
				});
			});
		} else if ($modal.length > 0) {
			$(window).on('resize', function () {
				if (window.innerWidth < dFrontJs.resolutions.lg) {
					$modal.find('[data-function="cal-start"], [data-function="cal-end"]').parent().addClass('ibe-searcher__calendar--all-months');
				}
				$from.each(function () {
					$(this).datepicker('option', 'numberOfMonths', getNumberMonth());
				});
				$end.each(function () {
					$(this).datepicker('option', 'numberOfMonths', getNumberMonth());
				});
			});
		} else {
			$from.each(function () {
				$(this).datepicker('option', 'numberOfMonths', getNumberMonth());
			});
			$end.each(function () {
				$(this).datepicker('option', 'numberOfMonths', getNumberMonth());
			});
			if ($advancedFly.length > 0) {
				$ida.each(function () {
					$(this).datepicker('option', 'numberOfMonths', 1);
				});
				$vuelta.each(function () {
					$(this).datepicker('option', 'numberOfMonths', 1);
				});
			}
		}
	};

	//*******************************************************************************************
	//***  Función para que puedan actualizar el calendario dada una fecha  ***
	//*******************************************************************************************
	var updateCalendar = function (selector, start, end) {
		var $elemento = $(selector);
		$elemento.each(function () {
			var $this = $(this),
				$parent = $this.closest('.ibe-tab__container'),
				$check = $parent.find('[data-function="roundtrip"]'),
				ida = $this.find('[data-cal="start"]'), //input de ida
				vuelta = $this.find('[data-cal="end"]'), //input de vuelta
				cal_ida = $this.find('[data-function="cal-start"]'), //calendario ida
				cal_vuelta = $this.find('[data-function="cal-end"]'), //calendario vuelta
				$journey = $('[data-journey="journey"]').length;

			if (!$this.parents('.ibe_form__group--half').hasClass('fc-initCalendar')) {
				initCalendar(cal_ida, cal_vuelta);
				$this.parents('.ibe_form__group--half').addClass('fc-initCalendar');
			}

			requestAnimFrame(function () {
			/*	if (ida.length > 0 && !ida.hasClass('initRangeDatepicker')) {
					ida.addClass('initRangeDatepicker')
					cal_ida.data('feedata', restrictions);
					cal_ida.datepicker('option', 'beforeShowDay', rangeDays);
					if (vuelta.length > 0 && !vuelta.hasClass('initRangeDatepicker')) {
						vuelta.addClass('initRangeDatepicker');
						cal_vuelta.data('feedata', restrictions);
						cal_vuelta.datepicker('option', 'beforeShowDay', rangeDays);
					}
				}*/

				if (start !== undefined && start !== null) { //No entro a la función si no tengo fecha de ida
					ida.val(start); //Actualizo el input+ con la fecha dada
					ida.parents('.fc_form_group').addClass('ibe_form__group--content');
					cal_ida.datepicker('setDate', start); //Selecciono la fecha en el calendario
					cal_ida.data('datesRange', [cal_ida.datepicker('getDate'), null]);
					cal_vuelta.data('datesRange', [cal_ida.datepicker('getDate'), null]);
					cal_ida.datepicker('refresh');
					cal_vuelta.datepicker('refresh');
					ida.trigger('change'); //update validate input val
					if ($journey) {
						dFrontJs.ibe_journey.controlDates(ida);
					}

					if ($check.is(':checked')) {
						cal_vuelta.data('datesRange', [cal_ida.datepicker('getDate'), null]);
						cal_vuelta.datepicker('refresh');

					}
					if (end !== undefined && end !== null) { //No entro a la función si no tngo fecha de vuelta
						vuelta.val(end);
						vuelta.parents('.fc_form_group').addClass('ibe_form__group--content');
						cal_vuelta.datepicker('setDate', end);
						cal_ida.data('datesRange', [cal_ida.datepicker('getDate'), cal_vuelta.datepicker('getDate')]);
						cal_vuelta.data('datesRange', [cal_ida.datepicker('getDate'), cal_vuelta.datepicker('getDate')]);
						cal_ida.datepicker('refresh');
						cal_vuelta.datepicker('refresh');
						ida.trigger('change'); //update validate input val
						vuelta.trigger('change'); //Actualización del rango del calendario
					}
				}
			})
		});
	};
	var isDateAvailable = function (caldate, type, restrictionConfig, selectedDate){
		var restriction, cellDate, cellDateStr, lastdate, keys, utcSelected, startDate;
		if (restrictionConfig){
			restriction = restrictionConfig[type];
			cellDate = new Date(Date.UTC(caldate.getFullYear(),caldate.getMonth(),caldate.getDate()));
			cellDateStr = cellDate.toJSON();
			if (restriction.endDate === null) {
				lastdate = new Date();
				lastdate.setTime(lastdate.getTime() + 90 * 86400000);	
			}	else {
				lastdate = new Date(restriction.endDate);
			}
			if ( restriction && restriction.info ){
				keys = Object.keys(restriction.info);
				
				startDate = new Date(restriction.startDate);
				if (cellDate.getTime() >= startDate.getTime() && cellDate.getTime() <= lastdate.getTime()) {
					if ((selectedDate === null || selectedDate === undefined)) {
						return typeof (restriction.info[cellDateStr]) === 'object' || typeof (restriction.info[cellDateStr]) === 'number';
					} else if (selectedDate) {
						utcSelected = new Date(Date.UTC(selectedDate.getFullYear(),selectedDate.getMonth(),selectedDate.getDate()));
						utcSelected = utcSelected.toJSON();
						if(restriction.info[utcSelected]) {
							return typeof (restriction.info[utcSelected][cellDateStr]) === 'object' || typeof (restriction.info[utcSelected][cellDateStr]) === 'number';
						} else {
							return isDateAvailable(caldate, ((type==='departure')? 'return':'departure'), restrictionConfig);
						}
					}
				}
			} else if (restriction.info === null && cellDate.getTime() <= lastdate.getTime()){
				return false;
			}
		
		}
		
		return true;
	}


	var noFlightsTooltip = function (selector) {
		var parent = $(selector);
		var literal = $('[data-noflights-tooltip]').data('noflights-tooltip');
		var noFlightsTooltipOptions = {
			animation: false,
			placement: 'top',
			trigger: 'hover',
			template: '<div class="tooltip ib-calendar--tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="icon-menos_2"></div><div class="tooltip-inner"></div></div>'
		};
		setTimeout(function (){
			var highlighted = parent.find('.date-has-tooltip span');
			highlighted.tooltip('destroy');
			highlighted.attr('title', literal);
			highlighted.tooltip(noFlightsTooltipOptions);
		},300);
		
	};
	var rangeDays = function (date) {
		if (rangeDays.self !== this) {
			rangeDays.self = this;
			rangeDays.this$ = $(this);
			rangeDays.formParent = rangeDays.this$.closest('form'); 
			rangeDays.roundtrip$ = rangeDays.formParent.find('[data-function="roundtrip"]');
			rangeDays.advanced$ = rangeDays.this$.parents('.ibe-advanced-searcher');
			rangeDays.oneway$ = rangeDays.advanced$.find('[data-calendar-disable]');
			rangeDays.calendarParent$ = rangeDays.this$.parents('.ibe_form__group--half');
			rangeDays.cal_from$ = rangeDays.calendarParent$.find('[data-function="cal-start"]');
			rangeDays.cal_end$ = rangeDays.calendarParent$.find('[data-function="cal-end"]');
			rangeDays.input_from$ = rangeDays.calendarParent$.find('[data-cal="start"]');
			rangeDays.input_to$ = rangeDays.calendarParent$.find('[data-cal="end"]');
			rangeDays.switch$ = rangeDays.formParent.find('[data-click="oneway"]');
		}
		var $this = rangeDays.this$,
			isDayEnabled = true,
			$roundtrip = rangeDays.roundtrip$,
			$advanced = rangeDays.advanced$, 
			$oneway = rangeDays.oneway$,
			$cal_from = rangeDays.cal_from$,
			$cal_end = rangeDays.cal_end$,
			$input_from = rangeDays.input_from$,
			$input_to = rangeDays.input_to$,
			lastKnownDate = new Date(),
			auxSelectedDate,
			dateClass = ' actualDate-'+ date.getDate() + '_' + (date.getMonth() + 1) + '_' + (date.getFullYear()) + ' ',
			$switch = rangeDays.switch$,
			minDate = new Date(),
			showNotAvailTooltip = false;
			minDate.setTime(new Date().getTime() + ($cal_from.datepicker( "option", "minDate" ) * 86400000));
			minDate.setHours(0);
			minDate.setMinutes(0);
			minDate.setSeconds(0);
			minDate.setMilliseconds(0);
			lastKnownDate.setTime(lastKnownDate.getTime() + 90 * 86400000);
			if ($this.data('feedata') && $this.data('feedata')['departure'].endDate) {
				lastKnownDate = new Date($this.data('feedata')['departure'].endDate);
			}
			if($this.data('feedata'))	{
				if (($roundtrip.length > 0 && !$roundtrip.is(':checked')) || ($advanced.length > 0 && $oneway.is(':checked'))){
					isDayEnabled = isDateAvailable(date,'oneway', $this.data('feedata'));
				} else if ($this.data('function') === 'cal-start') {
					auxSelectedDate = $cal_end.datepicker('getDate');
					if (auxSelectedDate !== null && auxSelectedDate !== undefined
							&&$input_to.val().length > 0 && $input_to.val() !== $input_to.attr('placeholder'))	 {
								if (date.getTime() < auxSelectedDate.getTime() && auxSelectedDate.getTime() <= lastKnownDate.getTime()) {
									isDayEnabled = isDateAvailable(date, 'return', $this.data('feedata'), auxSelectedDate);
								} else {
									isDayEnabled = isDateAvailable(date, 'departure', $this.data('feedata'));
								}
						
					} else {
						isDayEnabled = isDateAvailable(date, 'departure', $this.data('feedata'));
					} 
				} else if ($this.data('function') === 'cal-end'){
					auxSelectedDate = $cal_from.datepicker('getDate');
					if (auxSelectedDate !== null && auxSelectedDate !== undefined
							&&$input_from.val().length > 0 && $input_from.val() !== $input_from.attr('placeholder')) {
								if (date.getTime() >= auxSelectedDate.getTime() && auxSelectedDate.getTime() <= lastKnownDate.getTime()) {
									isDayEnabled = isDateAvailable(date, 'departure', $this.data('feedata'), auxSelectedDate);
								} else {
									isDayEnabled = isDateAvailable(date, 'return', $this.data('feedata'));
								}
					} else {
						isDayEnabled = isDateAvailable(date, 'return', $this.data('feedata'));
					} 
				}
			}
			
			showNotAvailTooltip = (!isDayEnabled && (date.getTime() >= minDate.getTime()));

			
		if ($this.data('datesRange') !== undefined) {
			// for (var i = 0; i < $this.data('datesRange').length; i++) {
			if (new Date($this.data('datesRange')[0]).getTime() === date.getTime()) {
				return [isDayEnabled, dateClass + 'selected-day--from' + (showNotAvailTooltip? ' date-has-tooltip ':'')];
			} else if (new Date($this.data('datesRange')[1]).getTime() === date.getTime() && $roundtrip.length === 0 && $oneway.length === 0 && $switch.length === 0) {
				return [isDayEnabled, dateClass + 'selected-day--to' + (showNotAvailTooltip? ' date-has-tooltip ':'')];
			} else if (new Date($this.data('datesRange')[1]).getTime() === date.getTime() && $roundtrip.is(':checked')) {
				return [isDayEnabled, dateClass + 'selected-day--to' + (showNotAvailTooltip? ' date-has-tooltip ':'')];
			} else if (new Date($this.data('datesRange')[1]).getTime() === date.getTime() && $advanced.length > 0 && !$oneway.is(':checked')) {
				return [isDayEnabled, dateClass + 'selected-day--to'+ (showNotAvailTooltip? ' date-has-tooltip ':'')];
			} else if (new Date($this.data('datesRange')[1]).getTime() === date.getTime() && $switch.is(':checked')) {
				return [isDayEnabled, dateClass + 'selected-day--to' + (showNotAvailTooltip? ' date-has-tooltip ':'')];
			}
			if ((new Date($this.data('datesRange')[0]).getTime() <= date.getTime()) && (new Date($this.data('datesRange')[1]).getTime() >= date.getTime()) && $roundtrip.length === 0 && $oneway.length === 0 && $switch.length === 0){
				if ($this.data('datesRange')[0] !== null) {
					return [isDayEnabled, dateClass + 'range' + (showNotAvailTooltip? ' date-has-tooltip ':'')];
				}
			}else if ((new Date($this.data('datesRange')[0]).getTime() <= date.getTime()) && (new Date($this.data('datesRange')[1]).getTime() >= date.getTime()) && $roundtrip.is(':checked')) {
				if ($this.data('datesRange')[0] !== null) {
					return [isDayEnabled, dateClass + 'range' + (showNotAvailTooltip? ' date-has-tooltip ':'')];
				}
			} else if ((new Date($this.data('datesRange')[0]).getTime() <= date.getTime()) && (new Date($this.data('datesRange')[1]).getTime() >= date.getTime()) && $advanced.length > 0 && !$oneway.is(':checked')) {
				if ($this.data('datesRange')[0] !== null) {
					return [isDayEnabled, dateClass + 'range' + (showNotAvailTooltip? ' date-has-tooltip ':'')];
				}
			} else if ((new Date($this.data('datesRange')[0]).getTime() <= date.getTime()) && (new Date($this.data('datesRange')[1]).getTime() >= date.getTime()) && $switch.is(':checked')) {
				if ($this.data('datesRange')[0] !== null) {
					return [isDayEnabled, dateClass + 'range' + (showNotAvailTooltip? ' date-has-tooltip ':'')];
				}
			}
		}
		return [isDayEnabled, dateClass + (showNotAvailTooltip? 'date-has-tooltip':'')];
	};

	var _disableRound = function () {
		var $this = $(this),
			$parent = $this.closest('.ibe-search-collapse'),
			$input_from = $parent.find('[data-cal="start"]'),
			$from_val = $input_from.val(),
			$input_to = $parent.find('[data-cal="end"]'),
			$to_val = $input_to.val(),
			$from_cal = $parent.find('[data-function="cal-start"]'),
			$to_cal = $parent.find('[data-function="cal-end"]');
		if (!$this.is(':checked')) {

			if ($input_to.val().length < 10) {
				$input_to.val('');
				$input_to.closest('.ibe_form__group-half').removeClass('ibe_form__group--content');
				if ($to_cal.find('.selected-day--from').length === 0 && $from_cal.find('.selected-day--from').length === 0) {
					$to_cal.datepicker('setDate', 'null');
				}
			}

			$input_from.closest('.icon-caret_derecha').removeClass('icon-caret_derecha').closest('.ibe_form__group--error').find('[data-cal="start"]').trigger('change');
			$input_from.closest('.ibe_form__group--half').addClass('ibe_form__group--half-only-round');


			if ($from_val !== "" && $to_val !== "" || $from_val === "" && $to_val !== "") {
				$from_cal.find('.selected-day--to').removeClass('selected-day--to');
				$from_cal.find('.range').removeClass('range');
			} else {
				$input_to.closest('.ibe_form__group-half').addClass('ibe_form__group--content');
				$from_cal.datepicker('refresh');
				$to_cal.datepicker('refresh');
			}
		} else {
			$input_from.closest('.ibe_form__group-half').addClass('icon-caret_derecha').closest('.ibe_form__group--error').find('[data-cal="start"]').trigger('change');
			$input_from.closest('.ibe_form__group--half').removeClass('ibe_form__group--half-only-round');
			if ($from_val !== "" && $to_val !== "" || $from_val === "" && $to_val !== "") {
				$from_cal.find('.selected-day--to').removeClass('selected-day--to');
				$from_cal.find('.range').removeClass('range');
			} else if ($to_val === "") {
				$input_to.closest('.ibe_form__group-half').removeClass('ibe_form__group--content');
			} else {
				$input_to.closest('.ibe_form__group-half').addClass('ibe_form__group--content');
				$from_cal.datepicker('refresh');
				$to_cal.datepicker('refresh');
			}
		}
		if(quadrigam !== "HMADVS" && quadrigam !== "HMEXPS" && quadrigam !== "HMPLRC" && quadrigam !== "HMFAQS" && !quadrigam.startsWith("HMEX")){
			dFrontJs.ibe_validations_searcher.dateValidator($input_from.parents('.ibe_form__group.ibe_form__group--half'));
		}else{
			if($('#SearcherContent > div > form > fieldset > div.ibe-search-collapse__row.ibe-search-collapse__row--first > div > div.ibe-search-collapse__item.ibe-search-collapse__item--input.ibe-searcher__stopover-calendar > div').find('[data-validate="exist-one-way"]').hasClass('hidden') && !$('#SearcherContent > div > form > fieldset > div.ibe-search-collapse__row.ibe-search-collapse__row--first > div > div.ibe-search-collapse__item.ibe-search-collapse__item--input.ibe-searcher__stopover-calendar > div').find('[data-validate="exist"]').hasClass('hidden')) {
				$('#SearcherContent > div > form > fieldset > div.ibe-search-collapse__row.ibe-search-collapse__row--first > div > div.ibe-search-collapse__item.ibe-search-collapse__item--input.ibe-searcher__stopover-calendar > div').find('[data-validate="exist-one-way"]').removeClass('hidden');
				$('#SearcherContent > div > form > fieldset > div.ibe-search-collapse__row.ibe-search-collapse__row--first > div > div.ibe-search-collapse__item.ibe-search-collapse__item--input.ibe-searcher__stopover-calendar > div').find('[data-validate="exist"]').addClass('hidden');
			}else if(!$('#SearcherContent > div > form > fieldset > div.ibe-search-collapse__row.ibe-search-collapse__row--first > div > div.ibe-search-collapse__item.ibe-search-collapse__item--input.ibe-searcher__stopover-calendar > div').find('[data-validate="exist-one-way"]').hasClass('hidden') && $('#SearcherContent > div > form > fieldset > div.ibe-search-collapse__row.ibe-search-collapse__row--first > div > div.ibe-search-collapse__item.ibe-search-collapse__item--input.ibe-searcher__stopover-calendar > div').find('[data-validate="exist"]').hasClass('hidden')) {
				$('#SearcherContent > div > form > fieldset > div.ibe-search-collapse__row.ibe-search-collapse__row--first > div > div.ibe-search-collapse__item.ibe-search-collapse__item--input.ibe-searcher__stopover-calendar > div').find('[data-validate="exist-one-way"]').addClass('hidden');
				$('#SearcherContent > div > form > fieldset > div.ibe-search-collapse__row.ibe-search-collapse__row--first > div > div.ibe-search-collapse__item.ibe-search-collapse__item--input.ibe-searcher__stopover-calendar > div').find('[data-validate="exist"]').removeClass('hidden');
			}
		}
	};

	//Checks the departure date, and if it's less than 48hrs compared to the current date, 
	// disables the pet toggle and shows a message to the customer
	/*function changePetToggle(date){
		if(date != "") {
			date = date.split("/");
			let departure_date = "";
			//Declares the variables
			if((localeg == 'en'&& marketg == 'US') || (localeg == 'es' && marketg == 'US') ){
				departure_date = new Date(date[2], date[0]-1, date[1]);
			} else {
				departure_date = new Date(date[2], date[1]-1, date[0]);
			}
			departure_date.setHours(0,0,0,0);
			
			let current_date = new Date();
			current_date.setHours(0,0,0,0);
			let day_as_milliseconds = 86400000;
			//Compares the current date to the departure date to know how many days of diffenrece there are between the dates
			let difference_mili = departure_date - current_date;
			//More than 2 days
			if(difference_mili >= day_as_milliseconds*2) {
				$("#flyWithPets").removeAttr("disabled");
				$(".ibe-searcher-switch").removeClass("hidden");
				$(".ibe-people-counter__people-subtitle--enabled").removeClass("hidden");
				$(".ibe-people-counter__people-subtitle--disabled").addClass("hidden");
			} else {
				$("#flyWithPets").attr("disabled", "disabled");
				$(".ibe-searcher-switch").addClass("hidden");
				$(".ibe-people-counter__people-subtitle--enabled").addClass("hidden");
				$(".ibe-people-counter__people-subtitle--disabled").removeClass("hidden");
			}
		}
	}*/

	var keyupFunction = function (selector) {
		$(selector).off('keyup', _inputsKeyup);
		$(selector).on('keyup', _inputsKeyup);
	};

	var performanceTime = function (time) {
		var $time = time || endTimeCalendar;
		return $time - performance.timing.navigationStart;
	};

	//Mover check avios en el buscador de puente aereo
	var moveCheckAviosPuente = function (e) {
		var dataMove = $('[data-move-check]');
		if (dataMove.length > 0 && window.innerWidth < dFrontJs.resolutions.md) {
			dataMove.insertBefore($('[data-move-inmobile]'));
			dataMove.css('display', 'block');
		} else {
			$('[data-check-indesktop]').append(dataMove);
		}
	};
	var updateAvailableDates = function  (selector, restrictions) {
		var parent = $(selector);
		var cal_ida = parent.find('[data-function=cal-start]');
		var cal_vuelta = parent.find('[data-function=cal-end]');
		cal_ida.data('feedata', restrictions);
		cal_vuelta.data('feedata', restrictions);
		cal_ida.datepicker('refresh');
		cal_vuelta.datepicker('refresh');
		var value_ida = $('.ibe-searcher__col.ibe-searcher__col--date').find('[data-cal="start"]').val();
		/*if (value_ida !== undefined && value_ida !== null && value_ida.trim() !== '') {
			changePetToggle(value_ida);
		}*/
	}
	

	return {
		'init': init,
		'initCalendar': initCalendar,
		'updateCalendar': updateCalendar,
		'changeNumberMonth': changeNumberMonth,
		'getNumberMonth': getNumberMonth,
		'clickOneWay': clickOneWay,
		'activeOneWayFunction': activeOneWayFunction,
		'activeRountripFunction': activeRountripFunction,
		'keyupFunction': keyupFunction,
		'performanceTime': performanceTime,
		'moveCheckAviosPuente': moveCheckAviosPuente,
		'updateAvailableDates':updateAvailableDates
	};
}(jQuery);
