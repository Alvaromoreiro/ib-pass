dFrontJs.ibe_validations_searcher = function () {
	//Init
	//Init validations searcher

	/*eslint no-underscore-dangle: ['error', { 'allow': ['_thisKeypress', '_thisKeyup'] }]*/
	var dateParser = function (date, format) {
		var dateParts = date.split('/');
		if (format === 'DD/MM/YYYY') {
			return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
		}

		return new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
	};

	var selectableDate = function (date, format) {
		var dateParts = date.split('/');
		if (format === 'DD/MM/YYYY') {
			return (parseInt(dateParts[0]) < 27 || new Date(dateParts[2], dateParts[1] - 1, dateParts[0]).getMonth() === new Date(dateParts[2], dateParts[1] - 1, dateParts[0] - 5).getMonth());
		}

		return (parseInt(dateParts[0]) < 27 || new Date(dateParts[2], dateParts[0], dateParts[1] - 1).getMonth() === new Date(dateParts[2], dateParts[0] - 5, dateParts[1] - 1).getMonth());

	};

	var getDatePickerMaxDate = function (selector) {
		var maxValue = $(selector).attr('data-maxrange') || '361';
		maxValue = parseInt(maxValue, 10);
		if (!isNaN(maxValue)) {
			if (maxValue > 1) {
				return maxValue -1;
			} else {
				return 1;
			}
		}
		return 360;
	} 

	var checkPartialDate = function (date, format) {
		if (/[A-zÀ-ÿ]/.test(date.replace('/', '').toLowerCase())) {
			return false;
		}
		switch (date.length) {
			case 1:
				if (format === 'DD/MM/YYYY') {
					if (parseInt(date) > 3) {
						return '0' + date + '/';
					}
					return date;
				}
				if (parseInt(date.substr(0, 1)) >= 2) {
					return '0' + date.substr(0, 1) + '/';
				}
				return date;

				break;
			case 2:
				if (format === 'DD/MM/YYYY') {
					if (/^(0[1-9]|1\d|2\d|3[01])$/.test(date)) {
						return date + '/';
					}
					return false;

				}
				if (/^(0[1-9]|1[0-2])$/.test(date)) {
					return date + '/';
				}
				return false;

				break;
			case 3:
				if (format === 'DD/MM/YYYY') {
					if (/^(0[1-9]|1\d|2\d|3[01])\/$/.test(date)) {
						return date;
					}
					return false;
				}
				if (/^(0[1-9]|1[0-2])\/$/.test(date)) {
					return date;
				}
				return false;


				break;
			case 4:
				if (format === 'DD/MM/YYYY') {
					if (/^(0[1-9]|1\d|2\d|3[01])\/$/.test(date.substr(0, 3))) {
						if (parseInt(date.substr(3, 4)) >= 2) {
							return date.substr(0, 3) + '0' + date.substr(3, 4) + '/';
						}
						return date;

					}
					return false;

				}
				if (/^(0[1-9]|1[0-2])\/$/.test(date.substr(0, 3))) {
					if (parseInt(date.substr(3, 4)) > 3) {
						return date.substr(0, 3) + '0' + date.substr(3, 4) + '/';
					}

					return date;

				}
				return false;

				break;
			case 5:
				if (format === 'DD/MM/YYYY') {
					if (/^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])$/.test(date)) {
						return date + '/';
					}
					return false;
				}

				if (/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])$/.test(date)) {
					return date + '/';
				}

				return false;

				break;
			case 6:
				if (format === 'DD/MM/YYYY') {
					if (/^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/$/.test(date)) {
						return date;
					}
					return false;

				}
				if (/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/$/.test(date)) {
					return date;
				}
				return false;


				break;
			case 7:
				if (format === 'DD/MM/YYYY') {
					return /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(1|2)$/.test(date);
				}

				return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(1|2)$/.test(date);

				break;
			case 8:
				if (format === 'DD/MM/YYYY') {
					return /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)$/.test(date);
				}

				return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)$/.test(date);

				break;
			case 9:
				if (format === 'DD/MM/YYYY') {
					return /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{1}$/.test(date);
				}
				return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{1}$/.test(date);

				break;
			case 10:
				if (format === 'DD/MM/YYYY') {
					return /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/.test(date);
				}
				return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/.test(date);

				break;
			default:
				return false
		}
	};

	var checkDate = function (date, format) {
		if (format === 'DD/MM/YYYY') {
			return /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/.test(date);
		}

		return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/.test(date);

	};

	var isFocusing;
	var dateValidator = function (group) {
		var dtoday = new Date(new Date().setHours(0, 0, 0, 0));
		var dateO = new Date(new Date().setHours(0, 0, 0, 0));
		var roundElement = group.find('input[data-cal="start"]');
		var round = roundElement.val();
		var roundFormat = group.find('input[data-cal="start"]').data('format');
		var retFormat = roundFormat;
		var retElement = group.find('input[data-cal="end"]').length > 0 ? group.find('input[data-cal="end"]') : roundElement;
		var ret = retElement.val();
		var dataDayCalendar = group.find('[data-hour-restriction]');
		var maxrange = getDatePickerMaxDate(group.find('[data-maxrange]'));
		var dateRestriction;
		var dataHour;
		var dataNumDays;

		if (dataDayCalendar.length > 0) {
			dateRestriction = new Date();
			dataHour = parseInt(dataDayCalendar.eq(0).data()['hourRestriction']);
			dateRestriction.setMilliseconds(dataHour * 60 * 60 * 1000); //Horas por segundos/hora
			dateRestriction.setHours(0);
			dateRestriction.setMinutes(0);
			dateRestriction.setSeconds(0);

			dataNumDays = dataDayCalendar.length ? parseInt(dataDayCalendar.eq(0).data()['hourRestriction']) : 0;
		}

		//-console.log('compara:', dateParser(round, roundFormat), dtoday, dateParser(round, roundFormat).getTime(), new Date().setDate(new Date().getDate() + 330))
		// date inserted is empty
		if (round === "") {
			//group.find("[data-function="cal-start"]").datepicker('setDate', new Date());
			//group.find("[data-function="cal-end"]").datepicker('option', 'minDate', group.find("[data-function="cal-start"]").datepicker('getDate'));
			//group.find('[data-validate]').addClass('hidden');
			// group.find('[data-validate="exist"]').removeClass('hidden');

			//END UNDEFINED (ONEWAY)
			if (roundElement === retElement || retElement.is(':hidden') || retElement.prop('disabled')) {
				group.addClass('ibe_form__group--error').find('[data-validate="exist-one-way"]').each(function () {
					$(this).removeClass('hidden');
					$(this).html($(this).data('validate-text'));
				});

			} else {
				// if (ret === ""){
				group.addClass('ibe_form__group--error').find('[data-validate="exist"]').each(function () {
					$(this).removeClass('hidden');
					$(this).html($(this).data('validate-text'));
				});
				// }
			}

			if (group.find('[data-validate]').not('.hidden').length) {
				group.find('[data-validate]').not('.hidden').closest('.ibe_form__group').addClass('ibe_form__group--error');
			} else {
				group.removeClass('ibe_form__group--error');
			}
			if (group.closest('.ibe_form').find('input[data-function="roundtrip"]').length === 1 && group.closest('.ibe_form').find('input[data-function="roundtrip"]:checked').length === 0) {
				group.find('[data-function="cal-end"]').closest('.fc_form_group').find('.collapse.in').collapse('hide');
			}
			if (ret !== "" && (!checkDate(ret, retFormat) || !selectableDate(ret, retFormat))) {
				group.addClass('ibe_form__group--error');
				group.find('[data-validate]').addClass('hidden');
				group.find('[data-validate="parse"]').removeClass('hidden');
				//group.find("[data-function="cal-end"]").datepicker('setDate');
				//group.find("[data-function="cal-start"]").datepicker('option', 'maxDate', 330);
				group.find('.collapse.in').collapse('hide');
				if ($('.ibe-dinamic-modal').length > 0) {
					group.closest('.ibe-dinamic-modal').removeClass('ibe-dinamic-modal');
				}
				return false;
			}
			else if(ret !== "" && checkDate(ret, retFormat) && selectableDate(ret, retFormat)){
				return true;
			}
			return false;
			// date format is incorrect

		} else if (ret === "" && !group.find('input[data-cal="start"]').parents('.ibe_form__group').hasClass('ibe_form__group--half-only-round') && !group.find('input[data-cal="end"]').parents('.ibe_form__group-half').hasClass('ibe_form__group-half-one-way')) {
			//END UNDEFINED (ONEWAY)

			// if (ret === "") {
				group.addClass('ibe_form__group--error').find('[data-validate="exist"]').each(function () {
					$(this).removeClass('hidden');
					$(this).html($(this).data('validate-text'));
				});
			// }

			// requestAnimFrame(function () {
				if ($('.ibe-stopover').length > 0) {
					group.find('[data-validate="exist"]').removeClass('hidden');
					group.find('[data-validate]').not('.hidden').closest('.ibe_form__group').addClass('ibe_form__group--error');
				}
				if (round !== "" && checkDate(round, roundFormat) && selectableDate(round, roundFormat)) {
					return true;
				}

			// });

			return false;

		} else if (group.find('input[data-cal="start"]').parent().hasClass('xui-one-way') || group.find('input[data-cal="start"]').parents('.ibe_form__group').hasClass('ibe_form__group--half-only-round')) {
			if (!checkDate(round, roundFormat) || !selectableDate(round, roundFormat)) {
				group.addClass('ibe_form__group--error');
				group.find('[data-validate]').addClass('hidden');
				group.find('[data-validate="parse"]').removeClass('hidden');
				return false;
			} else if (dateParser(round, roundFormat).getTime() < dtoday.getTime() && !group.hasClass('ibe_form__group--error')) {
				group.addClass('ibe_form__group--error');
				group.find('[data-validate]').addClass('hidden');
				group.find('[data-validate="valid"]').removeClass('hidden');
				group.find('.collapse.in').collapse('hide');
				return false;
			} else if (dataNumDays > 0 && dateParser(round, roundFormat).getTime() < dateRestriction) {
				group.addClass('ibe_form__group--error');
				group.find('[data-validate]').addClass('hidden');
				group.find('[data-validate="restriction"]').removeClass('hidden');
				return false;
			}

			group.find('[data-validate]').addClass('hidden');
			group.removeClass('ibe_form__group--error');
			return true;

		} else if (!checkDate(round, roundFormat) || !selectableDate(round, roundFormat)) {

			//group.find('[data-function="cal-start"]').datepicker('setDate', new Date());
			//group.find('[data-function="cal-end"]').datepicker('option', 'minDate', group.find('[data-function="cal-start"]').datepicker('getDate'));
			//group.find('[data-function="cal-end"] .end-selected').removeClass('end-selected');
			group.addClass('ibe_form__group--error');
			group.find('[data-validate]').addClass('hidden');
			group.find('[data-validate="parse"]').removeClass('hidden');
			group.find('.collapse.in').collapse('hide');
			if ($('.ibe-dinamic-modal').length > 0) {
				group.closest('.ibe-dinamic-modal').removeClass('ibe-dinamic-modal');
			}


		} else if (dateParser(round, roundFormat).getTime() > new Date().setDate(new Date().getDate() + maxrange)) {
			//group.find('[data-function="cal-start"]').datepicker('setDate', new Date());
			//group.find('[data-function="cal-end"]').datepicker('option', 'minDate', group.find('[data-function="cal-start"]').datepicker('getDate'));
			group.addClass('ibe_form__group--error');
			group.find('[data-validate]').addClass('hidden');
			group.find('[data-validate="max"]').removeClass('hidden');
			return false;
			// } else if (date.getTime() < new Date(today)) {
			// 	group.addClass('ibe_form__group--error');
			// 	group.find('[data-validate]').addClass('hidden');
			// 	group.find('[data-validate="valid"]').removeClass('hidden');
		} else if (dateParser(round, roundFormat).getTime() < dtoday.getTime()) {
			group.addClass('ibe_form__group--error');
			group.find('[data-validate]').addClass('hidden');
			group.find('[data-validate="valid"]').removeClass('hidden');
			group.find('.collapse.in').collapse('hide');
			if ($('.ibe-dinamic-modal').length > 0) {
				group.closest('.ibe-dinamic-modal').removeClass('ibe-dinamic-modal');
			}
		} else if (ret !== "" && (!checkDate(ret, retFormat) || !selectableDate(ret, retFormat))) {

			group.addClass('ibe_form__group--error');
			group.find('[data-validate]').addClass('hidden');
			group.find('[data-validate="parse"]').removeClass('hidden');
			//group.find('[data-function="cal-end"]').datepicker('setDate');
			//group.find('[data-function="cal-start"]').datepicker('option', 'maxDate', 330);
			group.find('.collapse.in').collapse('hide');
			if ($('.ibe-dinamic-modal').length > 0) {
				group.closest('.ibe-dinamic-modal').removeClass('ibe-dinamic-modal');
			}
			return false;

		} else if (dateParser(ret, retFormat).getTime() > new Date().setDate(new Date().getDate() + maxrange)) {
			group.addClass('ibe_form__group--error');
			group.find('[data-validate]').addClass('hidden');
			group.find('[data-validate="max"]').removeClass('hidden');
			//group.find('[data-function="cal-end"]').datepicker('setDate');
			//group.find('[data-function="cal-start"]').datepicker('option', 'maxDate', 330);
			return false;
		} else if (dateParser(ret, roundFormat).getTime() < dtoday.getTime()) {
			group.addClass('ibe_form__group--error');
			group.find('[data-validate]').addClass('hidden');
			group.find('[data-validate="valid"]').removeClass('hidden');
			group.find('.collapse.in').collapse('hide');
			if ($('.ibe-dinamic-modal').length > 0) {
				group.closest('.ibe-dinamic-modal').removeClass('ibe-dinamic-modal');
			}
			//} else if (dataNumDays > 0 && dateParser(round, roundFormat).getTime() < new Date().setHours(0, 0, 0, 0) + parseInt($('[data-hour-restriction]').eq(0).data()['hourRestriction'] / 24)) {
		} else if (dataNumDays > 0 && dateParser(round, roundFormat).getTime() < dateRestriction) {
			group.addClass('ibe_form__group--error');
			group.find('[data-validate]').addClass('hidden');
			group.find('[data-validate="restriction"]').removeClass('hidden');
			return false;
		} else if ((ret === "" || ret === undefined) && dataNumDays === 0) {
			//group.find('[data-function="cal-start"]').datepicker('setDate', round);
			//group.find('[data-function="cal-start"]').datepicker('option', 'maxDate', 330);
			//group.find('[data-function="cal-end"]').datepicker('option', 'minDate', round);
			//group.find('[data-function="cal-end"]').datepicker('setDate');
			group.removeClass('ibe_form__group--error');
			group.find('[data-validate]').addClass('hidden');
			return true;
		} else if (!group.hasClass('ibe_form__group--error') && dateParser(round, roundFormat) < dateRestriction) {
			//group.find('[data-function="cal-start"]').datepicker('setDate', new Date());
			group.addClass('ibe_form__group--error');
			group.find('[data-validate]').addClass('hidden');

			if (dateO.getTime() > dtoday.getTime() && dateParser(round, roundFormat).getTime() >= dtoday.getTime()) {
				group.find('[data-validate="restriction"]').removeClass('hidden');
			} else {
				group.find('[data-validate="valid"]').removeClass('hidden');
			}
			return false;
		} else if (!group.hasClass('ibe_form__group--error') && dateParser(ret, roundFormat) < dateRestriction) {
			//group.find('[data-function="cal-start"]').datepicker('setDate', new Date());
			group.addClass('ibe_form__group--error');
			group.find('[data-validate]').addClass('hidden');

			if (dateO.getTime() > dtoday.getTime() && dateParser(ret, roundFormat).getTime() >= dtoday.getTime()) {
				group.find('[data-validate="restriction"]').removeClass('hidden');
			} else {
				group.find('[data-validate="valid"]').removeClass('hidden');
			}
			return false;

		} else if (group.find('input[data-cal="end"]:visible:not(:disabled)').length === 0 &&
			!group.find('input[data-cal="end"]').closest('[data-searcher-accordion]')) {
			//group.find('[data-function="cal-start"]').datepicker('setDate', round);
			//group.find('[data-function="cal-end"]').datepicker('option', 'minDate', round);
			//group.find('[data-function="cal-end"]').datepicker('setDate', new Date());
			group.find('[data-function="cal-end"]').closest('.fc_form_group').find('.collapse.in').collapse('hide');
			group.removeClass('ibe_form__group--error');
			group.find('[data-validate]').addClass('hidden');
			return false;

		} else {
			//group.find('[data-function="cal-start"]').datepicker('setDate', round);
			//group.find('[data-function="cal-start"]').datepicker('option', 'maxDate', ret);
			//group.find('[data-function="cal-end"]').datepicker('option', 'minDate', round);
			//group.find('[data-function="cal-end"]').datepicker('setDate', ret);
			group.removeClass('ibe_form__group--error');
			group.find('[data-validate]').addClass('hidden');
			return true;
		}
	};
	//Valida el tab abierto actualmente y devuelve true/false si es valido/ivalido
	var submiting = false;
	var isOpen = false;
	var validateSearcher = function (json) {
			var inputsValid = $('[data-validate-searcher] .ibe_form:visible').first().find('input[name*=_origin], input[name*=_destiny], input[data-cal="start"], input[data-cal="end"], [data-text-passenger]').not(':hidden');
			var res = true;
			var result = true;
			submiting = true;
			json = json !== undefined ? json : '';

			setTimeout(function () {
				submiting = false;
			}, 300);
			inputsValid.closest('.ibe_form__group').find('.collapse.in').collapse('hide');
			inputsValid.each(function () {
				var $peopleList, adultsCount, childrenCount, seniorCount;
				if (($(this).attr('data-cal') === 'start' || $(this).attr('data-cal') === 'end')) {
					dateValidator($(this).closest('.ibe_form__group'));
					if (!dateValidator($(this).closest('.ibe_form__group'))) {
						res = false;
						result = res;
					} else {
						res = true;
					}
				} else if ($(this).is('[data-text-passenger]')) {
					//Flujo UMNR: valido si Adultos > 0, si hay algun Senior (viaja como un adulto), o si no hay Adultos ni Senior y hay al menos 1 Niño
					$peopleList = $(this).next().find('.ibe-people-counter__list');
					adultsCount = parseInt($peopleList.find('[data-people-type="adult"]').text(), 10) || 0;
					childrenCount = parseInt($peopleList.find('[data-people-type="children"]').text(), 10) || 0;
					seniorCount = parseInt($peopleList.find('[data-people-type="senior"]').text(), 10) || 0;
					if (adultsCount > 0 || seniorCount > 0 || (adultsCount === 0 && seniorCount === 0 && childrenCount >= 1)) {
						$(this).closest('.ibe_form__group').removeClass('ibe_form__group--error');
					} else {
						$(this).closest('.ibe_form__group').addClass('ibe_form__group--error');
						res = false;
						result = res;
					}
				} else {
					switch ($(this).attr('data-validate')) {
						case 'input-origin':
							if (json !== "") {
								dFrontJs.ibe_validations_searcher.checkCity($(this).parents('.ibe_form'), $(this), json);
							} else {
								dFrontJs.ibe_validations_searcher.checkCity($(this).parents('.ibe_form'), $(this));
							}
							break;
						case 'input-destiny':
							if (json !== "") {
								dFrontJs.ibe_validations_searcher.checkCity($(this).parents('.ibe_form'), $(this), json);
							} else {
								dFrontJs.ibe_validations_searcher.checkCity($(this).parents('.ibe_form'), $(this));

							}
					}
					if ($(this).val() === "") {
						$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="exist"]').each(function () {
							$(this).removeClass('hidden');
							$(this).html($(this).data('validate-text'));
						});
						res = false;
						result = res;

					}
				}

				if ($(this).closest('.ibe_form__group').hasClass('ibe_form__group--error')) {
					res = false;
					result = res;
				} else {
					res = true;
				}
			});

			//if exist only one case false then all validation is false and not continue ; then return false;
			if (!result) {
				res = result;
			}
			return res;
	};

	var insertDate = function (e, key, _this) {
		var newDate = _this.val();

		var iDate = checkPartialDate(newDate, _this.data('format'));

		switch (iDate) {
			case true:
				_this.val(newDate);
				break;
			case false:
				if (e.target.selectionStart < _this.val().length) {
					iDate = checkPartialDate(_this.val().substr(0, e.target.selectionStart) + key, _this.data('format'));
					switch (iDate) {
						case true:
							_this.val(_this.val().substr(0, e.target.selectionStart) + key);
							break;
						case false:
							break;
						default:
							_this.val(iDate);
					}
				}
				break;
			default:
				_this.val(iDate);
		}
	};

	var keyBloqued = function (e, key) {
		// backspace: / delete: 8 // Sup: 46 // left arrow: 37 // up arrow: 38 // right arrow : 39// down arrow : 40

		if (key !== 'Backspace' && key !== 'Delete' && key !== 'Tab' && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 38 && e.keyCode !== 39 && e.keyCode !== 40) {
			e.preventDefault();
		}
	};

	var onFocusOut = function (_this, node) {

		$(document).off('mousedown touchstart');
		$(document).on('mousedown touchstart', function (e) {
			if ($(e.target).parents('.ibe-searcher__calendar').length > 0) {
				isOpen = true;
			} else {
				isOpen = false;
			}


		});


		_this.on('blur', function (e) {
			var $elem = _this;
			isFocusing = true;


			// forzamos el change al hacer foco fuera del input
//
			if (!isOpen) {
				_this.change();
			} else {
				isOpen = false;
			}

			setTimeout(function () {
				var $thisInp = $elem;
				if ($elem.closest('.ibe_form__group-half').find(node).length === 0 && !submiting) {
					setTimeout(function () {
						dFrontJs.ibe_journey.controlDates($thisInp);
					}, 50);
				}
			}, 300);
		});
	};


	var _thisKeypress = function (e) {
		if (!(navigator.userAgent.match(/(iPhone)|(iPad)|(iPod)/i) || /* No es Ipad */
			/\d/.test(e.key) || /* Allow Number */
			/\//.test(e.key) || /* Allow caracter '/' */
			/Backspace/.test(e.key) || /* Allow Delete */
			/Delete/.test(e.key) ||/* Allow Sup */
			/ArrowLeft/.test(e.key) || /* Allow Cursor left */
			/ArrowRight/.test(e.key) /* Allow Cursor right */
		)) {
			e.preventDefault();
		}
	};

	var _thisKeyup = function (e) {
		var key = e.key;
		var $this = $(this);
		var inputVal = $this.val();
		var inputFormat = $this.data('format');

		if (key === undefined || key === 'Unidentified') {
			key = String.fromCharCode(e.keyCode)
		}

		if (key === 'Backspace' || key === 'Delete') {
			if (!$(this).parents().find('.modal-mode').length > 0) {
				$(this).closest('.fc_form_group').find('.collapse.in').collapse('hide');
			}
		}

		if (!isNaN(key) || key === '/') {


			insertDate(e, key, $this);

			// if ($this.val().length === 10) {
			//
			// 	switch (dateValidator($this.closest('.ibe_form__group'))) {
			// 		case true:
			// 			$this.closest('.fc_form_group').find('.collapse.in').collapse('hide');
			// 			if ($this.closest('.ibe_form__group').find('input[data-cal="end"]').siblings('[data-cal-button]').length && !submiting) {
			// 				requestAnimFrame(function () {
			// 					$this.closest('.ibe_form__group').find('input[data-cal="end"]').siblings('[data-cal-button]').click();
			// 					isFocusing = false;
			// 				});
			// 			} else if (!submiting) {
			// 				$this.closest('.ibe_form__group').find('input[data-cal="end"]').focus();
			// 			}
			// 			break;
			// 		case false:
			// 			$this.closest('.fc_form_group').find('.collapse.in').collapse('hide');
			// 			if ($('.ibe-dinamic-modal').length > 0) {
			// 				$this.closest('.ibe-dinamic-modal').removeClass('ibe-dinamic-modal');
			// 			}
			//
			// 	}
			// 	isFocusing = true;
			//
			// } else {
			// 	isFocusing = false;
			// }
		}

		// caracteres que no generen eventos
		keyBloqued(e, key);

	};

	var checkCity = function (searcher, input, json, type) {
		var _searcher = searcher.get(0);
		var _input = input.get(0);
		var group = _input.closest('.ibe_form__group');
		var ori = _searcher.querySelector('input[name*=_origin]');
		var dest = _searcher.querySelector('input[name*=_destiny]');
		var results = json !== undefined ? json : _input.dataset.validationjson !== undefined ?JSON.parse(_input.dataset.validationjson) : '';
		var xtype = type !== undefined ? type : undefined;
		var complete = false;
		var i, parentOri, parentDest;
		
		if (json !== undefined) {
			_input.dataset.validationjson = JSON.stringify(json);
		}

		if (xtype === undefined || xtype === 'cities') {
			for (i = 0; i < results.length; i++) {
				$.each(results[i].cities, function () {
					if (this.description + ' (' + this.code + ')' === input.val()) {
						complete = true;
						return false;
					}
				});
			}
		} else if (xtype === 'airports') {
			for (i = 0; i < results.length; i++) {
				if (results[i].name + ' (' + results[i].iataCode + ')' === input.val()) {
					complete = true;
					break;
				}
			}
		}

		if (results === '') {
			complete = true;
		}
		switch (complete) {
			case true:
				group.classList.remove('ibe_form__group--error');
				group.querySelector('[data-validate="exist"]').classList.add('hidden');
				
				if (document.querySelector('[data-journey]') !== null && _input.closest('.ibe-journey')!==null) {
					ori = _input.closest('.ibe-journey').querySelector('input[name*=_origin]');
					dest = _input.closest('.ibe-journey').querySelector('input[name*=_destiny]');
				}

				if (ori.value === dest.value) {
					if (_input.value) {
						group.classList.add('ibe_form__group--error');
						var msg = group.querySelector('[data-validate="equal"]');
						msg.classList.remove('hidden');
						msg.value = msg.getAttribute('data-validate-text');
					}
				} else {
					parentOri = ori.closest('.ibe_form__group');
					parentDest = dest.closest('.ibe_form__group');
					parentOri.querySelector('[data-validate="equal"]').classList.add('hidden');
					parentDest.querySelector('[data-validate="equal"]').classList.add('hidden');
					if(parentOri.querySelectorAll('[data-validate="equal"].hidden').length === 0){
						parentOri.classList.remove('ibe_form__group--error');
					}
					if(parentDest.querySelectorAll('[data-validate="equal"].hidden').length === 0){
						parentDest.classList.remove('ibe_form__group--error');
					}
				}
				break;
			case false:
				if (input.val() !== "") {
					group.classList.add('ibe_form__group--error')
					msg = group.querySelector('[data-validate="exist"]');
					msg.classList.remove('hidden');
					msg.value = msg.getAttribute('data-validate-text');
					group.querySelector('[data-validate="equal"]').classList.add('hidden');
				}
				break;
		}
	};


	var init = function () {
		var validSearcher = $('[data-validate-searcher]');

		if (validSearcher.length) {
			validSearcher.find('[data-validate-text]').each(function () {
				$(this).html($(this).data('validate-text'));
			});

			validSearcher.find('.ibe_form').each(function () {
				if ($(this).hasClass('loaded')) {
					return true;
				}

				$(this).addClass('loaded');

				$(this).on('submit', function (e) {
					if (!validSearcher) {
						e.preventDefault();
					}
				});
			});
		}
	};
	return {
		'init': init,
		'dateValidator': dateValidator,
		'validateSearcher': validateSearcher,
		'insertDate': insertDate,
		'checkCity': checkCity
	};
}(jQuery);
