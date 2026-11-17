dFrontJs.ibe_form_calendar = function () {
	const {
		host, hostname, href, origin, pathname, port, protocol, search
	  } = window.location
	  
	  host // "ui.dev"
	  hostname // "ui"
	  href // "https://ui.dev/get-current-url-javascript/?comments=false"
	  origin // "https://ui.dev"
	  pathname // "/get-current-url-javascript/""
	  port // ""
	  protocol // "https:"
	  search // "?comments=false"
	  console.log(dFrontJs)
	/*eslint no-underscore-dangle: ['error', { 'allow': ['_inputsKeyup', '_buttonCalendarTouchFocusClick', '_calStartFocus', '_roundtripFunction', '_oneWayFunction',
        '_disableCollapse', '_preventClicks', '_inputsBlur','_focusoutFunction', '_changefromFunction', '_changeEndFunction', '_defaults','_updateDatepicker','_get',
        '_mouseoverTDtoFunction', '_mouseoverTDtoFunction', '_touchStartFunction', '_mouseoverTDfromFunction', '_disableRound'] }]*/
	var dateParser = function (date, format) {
		var dateParts = date.split('/');
		if (format === 'DD/MM/YYYY') {
			return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
		}
		return new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
	};

	var preventClicks = function () {
		$('[data-event="click"]').on('click', function (e) {
			e.preventDefault();
			e.stopPropagation();

			focusArrow = true;
			setTimeout(function () {
				focusArrow = false;
			}, 350);
		});
	};

	var initFormCalendar = function (calendar) {
		var $calForm = $('[data-function="cal-form"]'),
			$calInput = $('[data-cal="claim"]');
		var language, format, firstday, datepicker__updateDatepicker, onAfterUpdate, showMonth, totalDate, newTotalDate, dataHour, fechaInicio, fechaFin, diff, newDiff;
		if ($calForm.length) {
			//Language
			language = $calForm.attr('data-language') ? $calForm.attr('data-language') : 'en';
			$.datepicker.setDefaults($.datepicker.regional[language]);			//the language is applied in integration WCS

			//Format
			format = $calForm.attr('data-format') ? $calForm.attr('data-format') : $.datepicker.regional[language].dateFormat;
			//Firstday
			firstday = $calForm.attr('data-firstday') ? $calForm.attr('data-firstday') : $.datepicker.regional[language].firstDay;

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

			showMonth = 1;

			calendar.datepicker({
				dateFormat: format,
				numberOfMonths: showMonth,
				onAfterUpdate: function () {
					var thisObj = $(this),
						thisParent = thisObj.closest('.ibe_form__group'),
						thisInput = thisParent.find('[data-cal="claim"]');
					$('a.ui-corner-all').removeAttr('href');
					preventClicks(); //To avoid close de datepicker
					if (thisInput.val() === "") {
						thisObj.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');
					}


				}
			}).on('change', function () {
				var thisObj = $(this),
					thisValue = thisObj.val(),
					thisCal = thisObj.closest('.ibe-searcher__calendar'),
					thisParent = thisCal.closest('.ibe_form__group'),
					thisInput = thisParent.find('[data-cal="claim"]');

				thisInput.val(thisValue);
				thisParent.addClass('ibe_form__group--content');
				if (thisParent.find('ibe_form__group--error')) {
					thisInput.blur(); //For borrow the error
				}
				thisCal.collapse('hide');

			});

			$calInput.on('focus click', function (e) {
				var $this = $(this);
				if ($this.val() !== "") {
					$this.select();
				}
			});

			$calInput.keyup(function (e) {
				var $cal = $(this).closest('.ibe_form__group').find('[data-function="cal-form"]');
				if (e.target.value.length === 10) {
					$cal.datepicker('setDate', e.target.value); //To select input-day
					if (e.key !== 'ArrowRight' && e.key !== 'ArrowDown' && e.key !== 'ArrowLeft' && e.key !== 'ArrowUp') {
						$(this).blur();
						$cal.closest('.ibe-searcher__calendar').collapse('hide');
					}
					if (e.key === 'Tab') {
						$(this).focus();
					}

				}
				if (e.target.value.length < 10 && e.key !== 46 && e.key !== 46 && e.key !== 9 && e.key !== 229 && e.key !== 37 && e.key !== 39) {
					$cal.datepicker('setDate', null);
				}


			});

			// Function for days restrictions
			$('[data-validator-range]').each(function () {
				var rangeMin = $(this).data('range-min'),
					rangeMax = $(this).data('range-max');

				rangeMin = '-' + (rangeMin) + 'd';
				rangeMax = '+' + rangeMax + 'd';

				//console.log('entra en mi funcion', $(this), rangeMin, rangeMax)

				$('[data-function="cal-form"]').datepicker('option', 'maxDate', rangeMax);
				$('[data-function="cal-form"]').datepicker('option', 'minDate', rangeMin);
			});

			

			//Function restrictionDays dataHourRestriction
			if ($calForm.parent().find('[data-hour-restriction]').length > 0) {
				totalDate = new Date();
				$this = $calForm.parent().find('[data-hour-restriction]');
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


				$this.datepicker('option', 'minDate', newDiff); 
			}

		}

	};

	var init = function () {
		var $calInput = $('[data-cal="claim"]');
		var $buttonInput = $calInput.siblings('button');

		requestAnimFrame(function () {

			$($calInput).on('focus click', function (e) {
				var $this = $(this);
				if (!$this.parents('.ibe_form__group').hasClass('fc-initCalendar')) {
					initFormCalendar($this.parents('.ibe_form__group').find('[data-function="cal-form"]'));
					$this.parents('.ibe_form__group').addClass('fc-initCalendar');
				}
			});

			$($buttonInput).on('focus click', function (e) {
				var $this = $(this);
				if (!$this.parents('.ibe_form__group').hasClass('fc-initCalendar')) {
					initFormCalendar($this.parents('.ibe_form__group').find('[data-function="cal-form"]'));
					$this.parents('.ibe_form__group').addClass('fc-initCalendar');
				}
			});


		});


	};

	//*******************************************************************************************
	//***  Función para que puedan actualizar el calendario dada una fecha  ***
	//*******************************************************************************************
	var updateFormCalendar = function (selector, start) {
		var $elemento = $(selector);
		$elemento.each(function () {
			var $this = $(this),
				ida = $this.find('[data-cal="claim"]'), //input de ida
				cal_ida = $this.find('[data-function="cal-form"]'), //calendario ida
				$journey = $('[data-journey="journey"]').length;

			if (!$this.find('.ibe-datepicker-general').hasClass('fc-initCalendar')) {
				initFormCalendar(cal_ida);
				$this.find('.ibe-datepicker-general').addClass('fc-initCalendar');
			}


			if (start !== undefined) { //No entro a la función si no tengo fecha de ida
				ida.val(start); //Actualizo el input+ con la fecha dada
				ida.parents('.fc_form_group').addClass('ibe_form__group--content');
				cal_ida.datepicker('setDate', start); //Selecciono la fecha en el calendario
				cal_ida.data('datesRange', [cal_ida.datepicker('getDate'), null]);
				//cal_vuelta.data('datesRange', [cal_ida.datepicker('getDate'), null]);
				cal_ida.datepicker('refresh');
				//cal_vuelta.datepicker('refresh');
				if ($journey) {
					dFrontJs.ibe_journey.controlDates(ida);
				}

			}
		});
	};
	return {
		'init': init,
		'updateFormCalendar': updateFormCalendar
	};
}(jQuery);
