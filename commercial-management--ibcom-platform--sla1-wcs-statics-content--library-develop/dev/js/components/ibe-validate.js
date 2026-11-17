/*
 Validation for forms.
*/
/*eslint no-underscore-dangle: ["error", { "allow": ["_oneWayWarranty", "_roundtripWarranty"] }]*/
dFrontJs.ibe_validate = function () {

	var dateParser = function (date, format) {
		var dateParts = date.split('/');
		if (format === 'DD/MM/YYYY') {
			return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
		}
		return new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
	};

	var clearAllErrors = function (value) {
		value.closest('.ibe_form__group')
			.removeClass('ibe_form__group--error')
			.find('[data-validate]')
			.addClass('hidden');
	};

	var isFormatValid = function(valor) {
		valor.closest('.ibe_form__group')
			.has('[data-validate="valid"]:visible')
			.removeClass('ibe_form__group--error')
			.find('[data-validate="valid"]')
			.addClass('hidden');
	};

	var noFormatValid = function(valor) {
		clearAllErrors(valor);
		valor.closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
			$(this).removeClass('hidden');
			$(this).html($(this).data('validate-text'));
		});
	};

	var compareCity = function(input, ori, des){
		var searcher = (input !== undefined ? $(input).parents('.ibe_form') : $('input[name*=_origin]').parents('.ibe_form'));
		var origin = (ori !== undefined ? ori : searcher.find('input[name*=_origin]'));
		var destiny = (des !== undefined ? des : searcher.find('input[name*=_destiny]'));
		if (origin.val() === destiny.val()) {
			input.closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="equal"]').each(function () {
				$(this).removeClass('hidden');
				$(this).html($(this).data('validate-text'));
			});
		} else{
			input.parents('.ibe_form__group').parent().parent().find('.ibe_form__group').each(function () {
				$(this).removeClass('ibe_form__group--error');
				$(this).find('[data-validate="equal"]').addClass('hidden');
			});
		}
	};

	var valid_luhn_algorithm = function (value) {
		var nCheck = 0, nDigit = 0, bEven = false, n, cDigit;
		// accept only digits, dashes or spaces
		if (/[^0-9-\s]+/.test(value)) return false;

		if (parseInt(value) === 0) return false;

		// The Luhn Algorithm. It's so pretty.
		value = value.replace(/\D/g, '');

		for (n = value.length - 1; n >= 0; n--) {
			cDigit = value.charAt(n);
			nDigit = parseInt(cDigit, 10);

			if (bEven) {
				if ((nDigit *= 2) > 9) nDigit -= 9;
			}

			nCheck += nDigit;
			bEven = !bEven;
		}

		return (nCheck % 10) === 0;
	};

	var formatTicket = function (event) {
		var aKey = 65,
			cKey = 67,
			vKey = 86,
			key = event.keyCode || event.which,
			num = event.target.value,
			pattern = /^\d{3}-\d{10}$/;

		if(event.key == "Unidentified"){
			let value = $(event.target).val();
			value = (value).substr(value.length-1, 1);
			key = value.charCodeAt(0);
		}

		if (key === 8 || key === 9 || key === 46) return true;

		if ((key !== 222) && ((key >= 48) && (key <= 57) || (key >= 96) && (key <= 105) || (key >= 35 && key <= 40) || (key === aKey && event.ctrlKey) || (key === vKey && event.ctrlKey) || (key === cKey && event.ctrlKey))) {
			if (num.length === 3) {
				if ((num.split('-').length <= 1)) {
					num = num.replace(num, num.substr(0, 3) + '-' + num.substr(3, num.length));
				}
			}
			if (num.length > 3) {
				if ((num.split('-').length <= 1)) {
					num = num.replace(num, num.substr(0, 3) + '-' + num.substr(3, num.length));
				}
			}
			if (((num.split('-').length <= 1) && key === vKey && event.ctrlKey) && (num.length > 3)) {
				num = num.replace(num, num.substr(0, 3) + '-' + num.substr(3, num.length));
			}
			if (num.length > 14) {
				event.target.value = num.substr(0, 14);
			} else {
				event.target.value = num;
			}
		} else {
			return false;
		}
		if ((event.type === 'keyup') && (key === vKey && event.ctrlKey)) {
			setTimeout(function () {
				if (pattern.test(num) === false) {
					event.target.value = '';
					num = '';
				}
			}, 200);
		}

	};

	var numFlight = function(input){
		var airlines;
		input = (input !== undefined ? $(input) : $('[data-isotipo]:visible'));
		airlines = input.parents('[data-airlines]').data('airlines');
		if (input.length > 0){
			if (input.val().match(new RegExp('^(' + airlines + ')([0-9]+)$', 'i')) && input.val().length >= 3 && input.val().length < 7) {
				isFormatValid(input);
			} else {
				noFormatValid(input);
			}
		}

	};

	/*Event to validate username for onbusiness login form, it shows a "not valid format" error
	*	Params
	*		regex: Regex of chars that are allowed
	*/
	var keyBlockandCleanOB = function (event) {
		var keyVal, removeRegex, regex,
		val, self = $(this);
		
		regex = new RegExp(event.data.regex);
		//keyVal = event.keyCode || event.which;
		keyVal = $('.user-login-OB').val();

		if(!regex.test(keyVal)){
			$('.user-login-OB').closest(".ibe_form__group").find('.ibe_form__msg-info').addClass("hidden");
			$('.user-login-OB').closest(".ibe_form__group").addClass("ibe_form__group--error");
			
			let errorSpan = $('.user-login-OB').closest(".ibe_form__group").find('[data-validate="valid"]');
			errorSpan.html(errorSpan.data("validate-text")).removeClass("hidden");
			errorSpan.removeClass("hidden");
			
		} else {
			$('.user-login-OB').closest(".ibe_form__group").removeClass("ibe_form__group--error");
			$('.user-login-OB').closest(".ibe_form__group").find('.ibe_form__msg-info').addClass("hidden");
		}
	}

	/*Event that filters whch letters cand be written and remove not allowed when paste 
	*	receives two regex on event data 
	*		removeRegex Regex of chars that must be removed
	*		regex: Regex of chars that are allowed
	*/
	var keyBlockandClean = function (event) {
		var keyVal, removeRegex, regex,
		val, self = $(this);
		if (event && event.data) {
			keyVal = event.keyCode || event.which;
			keyVal = String.fromCharCode(keyVal);
			if (event.data.removeRegex && (event.type !== 'keypress')){
				setTimeout(function(){
					removeRegex = new RegExp(event.data.removeRegex);
					val = self.val();
					val = val.replaceAll(removeRegex,'');
					self.val(val);
				},50);
			} else {
				regex = new RegExp(event.data.regex);
				return regex.test(keyVal);
			}
		}
		return true;
	}
	var pnrTKTKeyFilter = function (evt) {
		var keyVal, self = $(this), event = evt,
		val = self.val();
		keyVal = event.originalEvent.key;
		if (val.length > 0 && val.length <= 6 && /[a-zA-Z]{1,6}/.test(val)) {
			self.attr('maxlength',6);
		} else {
			self.attr('maxlength',14);
		}
		event.data = {regex: /[a-z0-9\-]/gi, removeRegex:/[^a-z0-9\-]/gi};  	
		return keyBlockandClean.call(this, event);
	}
	var keyupValidation =  function () {
		var val = $(this).val();
		if ($(this).data('validator') === 'pnr-tkt'){
			if (val && val.length > 0) {
				if (/(^[a-zA-Z0-9]{0,6}$)|(^[0-9]{03}[- ]?[0-9]{0,10}$)/.test($(this).val())) {
					isFormatValid($(this));
				} else {
					noFormatValid($(this));
				}
			} else if (!$(this).val() && !$(this).attr('required')) {
				clearAllErrors($(this));

			}
		}
	}

	var init = function () {
		var inputTicket = $('[data-format="ticket"]');
		var inputTktPnr = $('[data-format="pnr-tkt"]');
		var inputpersonal = $('[data-format="personal"]');
		var validRequired = $('[data-valid-form] [required]');
		var inputUserOB = $('[data-format="user-onbusiness"]');

		//Added keydown for android compatibility
		inputTicket.off('keydown keyup', formatTicket);
		inputTktPnr.off('keypress keydown  paste', pnrTKTKeyFilter);
		inputpersonal.off('keypress keydown paste', keyBlockandClean);
		inputTicket.on('keydown keyup', formatTicket);
		inputTktPnr.on('keypress keydown paste',{regex: /[a-z0-9\-]/gi, removeRegex:/[^a-z0-9\-]/gi}, pnrTKTKeyFilter);
		inputpersonal.on('keypress keydown paste',{regex: /^(?!.*[0-9*¡!?¿<>\\\\ºª|/\·@#$%&,;=?¿())_¬+{}\[\]"~\^€$£])/gi, removeRegex:/[0-9*¡!?¿<>\\ºª|/\·@#$%&,;=?¿())_+~¬{}\[\]"\^€$£]/gi}, keyBlockandClean);
		validRequired.off('keyup',keyupValidation);
		validRequired.on('keyup',keyupValidation);
		inputUserOB.off('keypress keydown paste');
		inputUserOB.on('keyup paste',{regex: /^[a-zA-Z0-9\-_.'@]*$/gi}, keyBlockandCleanOB);
		

		if ($('[data-valid-form] [required][data-validator="file"]').length > 0) {
			$('[data-valid-form] [required][data-validator="file"]').closest('.ibe_form__group').find('[data-validate="exist"]').each(function () {
				$(this).html($(this).data('validate-text'));
			})
		}



		validRequired.focusout(function (e) {
			var $this = $(this);
			var pattern, expression, regex, t, nif, fecha, format, arrF, group, flight, dataDayCalendar, re, formatCal, cadena,
				airlines, validatePinLength, num, sum, uni, c, date2, fechaCalendar, rangeMin, rangeMax, dateRestriction,
				datepickerGeneral, dataHour, dataNumDays, splitDate, dateSelected, oneDay, dateNow, diffDays, sum, number;
			if (!$(this).val() && $(this).data('validator') !== 'file' && $(this).prop('type') !== 'checkbox') {
				if (!(e.relatedTarget !== null && e.relatedTarget.closest('.ibe_form__group'))) {

					// Remove all error message (when data-validate attr aren't input)
					$(this).closest('.ibe_form__group').find('[data-validate]:not("input")').addClass('hidden');

					$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="exist"]').each(function () {
						$(this).removeClass('hidden');
						$(this).html($(this).data('validate-text'));
					});

				}

			} else if ($(this).data('validator') !== 'file') {
				$(this).closest('.ibe_form__group')
					.has('[data-validate="exist"]:visible')
					.removeClass('ibe_form__group--error')
					.find('[data-validate="exist"]')
					.addClass('hidden');

				if ($(this).data('validator') === 'PIR') {
					if ($(this).val().match('[a-zA-Z]{5}[0-9]{5}') && $(this).val().length === 10) {
						isFormatValid($(this));
					} else {
						noFormatValid($(this));
					}


				} else if ($(this).data('validator') === 'cod-ticket') {
					cadena = $(this).val();
					if ($(this).val().match('^[0-9-]*$') && cadena.indexOf('075-') > -1 && $(this).val().length === 14) {
						isFormatValid($(this));
					} else {
						noFormatValid($(this));
					}

				} else if ($(this).data('validator') === 'numflight') {
					numFlight($(this));

				} else if ($(this).data('validator') === 'code') {
					if ($(this).val().match('^[a-zA-Z0-9]*$') && $(this).val().length > 4 && $(this).val().length < 7) {
						isFormatValid($(this));
					} else {
						noFormatValid($(this));
					}
				} else if ($(this).data('validator') === 'ibePlus' && $(this).val().length > 0) {
					if (valid_luhn_algorithm($(this).val())) {
						isFormatValid($(this));
					} else {
						pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
						if (pattern.test($(this).val()) === true) {
							isFormatValid($(this));
						} else {
							noFormatValid($(this));
						}
					}
				} else if ($(this).data('validator') === 'onBusiness' && $(this).val().length > 0) {
					if (!$(this).val().match('^OB[0-9-]{8}$')) {
						noFormatValid($(this));
					} else {
						sum = 0;
						number = $(this).val();
						for (var i = 2; i < number.length - 1; i++) {
							sum = sum + parseInt(number.charAt(i));
						}
						var result = sum % 7 === parseInt(number.charAt(number.length - 1));

						if(result){
							isFormatValid($(this));
						} else {
							noFormatValid($(this));
						}
					}

				} else if ($(this).data('validator') === 'pin' && $(this).val().length > 0) {
					var globalPattern = /^((?!.*[\s])(.){6,20})$/gm;
					if(globalPattern.test($(this).val())) {
						isFormatValid($(this));
					} else{
						noFormatValid($(this));
					}

				} else if ($(this).data('validator') === 'ticket') {
					if ($(this).val().match('^[0-9]*$') && $(this).val().length === 13 || $(this).val().match('^[0-9]+( |-[0-9])*[0-9]+$') && $(this).val().length === 14) {
						isFormatValid($(this));
					} else {
						noFormatValid($(this));
					}

				} else if ($(this).data('validator') === 'tel') {
					if ($(this).val()) {
						expression = /(^[+][0-9 ]+$)|(^[0-9 ]{8,30}$)/;
						regex = new RegExp(expression);
						t = $(this).val();

						if (t.match(regex)) {
							$(this).closest('.ibe_form__group')
								.removeClass('ibe_form__group--error')
								.find('[data-validate]')
								.addClass('hidden');
						} else {
							$(this).closest('.ibe_form__group').find('[data-validate]').addClass('hidden');		//remove all error messages for show only 1
							if (isNaN(t)) {		// if not number
								$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="letter"]').each(function () {
									$(this).removeClass('hidden');
									$(this).html($(this).data('validate-text'));
								});
							} else {
								noFormatValid($(this));
							}
						}
					}

					// if (/.test($(this).val()) && $(this).val().length > 1 && $(this).val().length <= 20 ) {
				} else if ($(this).data('validator') === 'cod-postal') {
					if (/^[0-9 ]*$/.test($(this).val()) && $(this).val().length === 5) {
						isFormatValid($(this));
					} else {
						noFormatValid($(this));
					}
				} else if ($(this).data('validator') === 'price') {
					if ($(this).val().match('^[0-9 a-zA-Z,.€$£¥]*$')) {
						isFormatValid($(this));
					} else {
						noFormatValid($(this));
					}
				} else if ($(this).data('validator') === 'plus') {

					if ($(this).val()) {
						if (/^[0-9]*$/.test($(this).val()) && $(this).val().length > 7 && $(this).val().length < 13) {
							isFormatValid($(this));
						} else {
							noFormatValid($(this));
						}
					}

				} else if ($(this).data('validator') === 'nif-cif') {
					nif = $(this).val().toUpperCase().replace(/[\s\-]+/g, '');
					if (/^(\d|[XYZ])\d{7}[A-Z]$/.test(nif)) {
						num = nif.match(/\d+/);
						num = (nif[0] !== 'Z' ? nif[0] !== 'Y' ? 0 : 1 : 2) + num;
						if (nif[8] === 'TRWAGMYFPDXBNJZSQVHLCKE'[num % 23]) {
							//return /^\d/.test(nif)? 'DNI': 'NIE';
							$(this).closest('.ibe_form__group')
								.removeClass('ibe_form__group--error')
								.find('[data-validate="valid"]')
								.addClass('hidden');
						}
					} else if (/^[ABCDEFGHJKLMNPQRSUVW]\d{7}[\dA-J]$/.test(nif)) {
						for (sum = 0, i = 1; i < 8; ++i) {
							num = nif[i] << i % 2;
							uni = num % 10;
							sum += (num - uni) / 10 + uni;
						}
						c = (10 - sum % 10) % 10;
						if (nif[8] === c || nif[8] === 'JABCDEFGHI'[c]) {
							//return /^[KLM]/.test(nif)? 'ESP': 'CIF';
							$(this).closest('.ibe_form__group')
								.removeClass('ibe_form__group--error')
								.find('[data-validate="valid"]')
								.addClass('hidden');
						}
					} else {
						$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
							$(this).removeClass('hidden');
							$(this).html($(this).data('validate-text'));
						});
						$(this).closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
					}

				} else if ($(this).data('validator') === 'mail') {
					pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
					if ($this.val() && pattern.test($this.val()) === true) {
						isFormatValid($this);
					} else {
						noFormatValid($this);
					}
				} else if ($(this).data('validator') === 'mail-repeat') {
					if ($(this).data('different') !== undefined) {
						if ($(this).val() !== $(this).closest('.row').prev().find('input[type=text]').val()) {
							$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="different"]').each(function () {
								$(this).removeClass('hidden');
								$(this).html($(this).data('validate-text'));
							});
							$(this).closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
						} else {
							$(this).closest('.ibe_form__group')
								.removeClass('ibe_form__group--error')
								.find('[data-validate="different"]')
								.addClass('hidden');
						}
					}
				} else if ($(this).data('validator') === 'personal') {
					if ($(this).val()) {
						if (/^(?!.*[0-9*¡!?¿<>\\\\ºª|/\·@#$%&,;=?¿())_¬+{}\[\]"~\^€$£])/.test($(this).val()) && $(this).val().length <= 30) {
							isFormatValid($(this));
						} else {
							noFormatValid($(this));
						}
					} else if (!$(this).val() && !$(this).attr('required')) {
						clearAllErrors($(this));

					}


				} else if ($(this).data('validator') === 'flight') {
					if ($(this).val().match('[a-zA-Z]{2}[0-9]{1,4}$')) {
						isFormatValid($(this));
					} else {
						noFormatValid($(this));
					}
				} else if ($(this).data('validator') === 'partner') {
					if ($(this).val().match('^[0-9]*$') && $(this).val().length === 8) {
						isFormatValid($(this));
					} else {
						noFormatValid($(this));
					}
				} else if ($(this).data('validator') === 'url') {
					expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/
					regex = new RegExp(expression);
					t = $(this).val();

					if (t.match(regex)) {
						$(this).closest('.ibe_form__group')
							.removeClass('ibe_form__group--error')
							.find('[data-validate="valid"]')
							.addClass('hidden');
					} else {
						$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
							$(this).removeClass('hidden');
							$(this).html($(this).data('validate-text'));
						});
					}


				} else if ($(this).data('validator') === 'date') {
					//Take de value and convert to an array
					fecha = $(this).val();
					format = $(this).data('format');
					arrF = fecha.split('/');
					//Change the position of the array to MM/DD/AAAAA
					//fecha = arrF[1] + '/' + arrF[0] + '/' + arrF[2];
					if (format === 'DD/MM/YYYY') {
						re = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/
					} else {
						re = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/
					}

					if (re.test(fecha)) {

						isFormatValid($(this));
						$(this).closest('.ibe_form__group')
							.removeClass('ibe_form__group--error');


					} else {
						noFormatValid($(this));
					}

				} else if ($(this).data('validator') === 'date-valid') {
					//Take de value and convert to an array
					fecha = $(this).val();
					group = $('.ibe_form__group');
					format = $(this).data('format');
					flight = $(this).data('flight');
					dataDayCalendar = group.find('[data-hour-restriction]');
					if (format === 'DD/MM/YYYY') {
						re = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
						formatCal = 'dd/mm/yy';
					} else {
						re = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
						formatCal = 'mm/dd/yy';
					}

					if (re.test(fecha)) {
						if (flight === 'start') {
							date2 = $('.ibe_form__group').find('[data-flight="return"]').val();
							if (date2 !== "") {
								if ($.datepicker.parseDate(formatCal, date2) < $.datepicker.parseDate(formatCal, fecha)) {
									clearAllErrors($(this));
									$(this).closest('.ibe-datepicker-general').addClass('ibe_form__group--error').find('[data-validate="range-return"]').each(function () {
										$(this).removeClass('hidden');
										$(this).html($(this).data('validate-text'));
									});
									return false;

								}

								// else
								$('.ibe-datepicker-general').find('[data-validate="range-return"]').addClass('hidden');
								$('.ibe-datepicker-general').find('[data-validate="range-go"]').addClass('hidden');
								isFormatValid($(this));
								$(this).closest('.ibe_form__group').removeClass('ibe_form__group--error');
								$('.ibe-datepicker-general').find('[data-validate="range-go"]').closest('.ibe_form__group').removeClass('ibe_form__group--error');

							}

						} else {
							date2 = $('.ibe_form__group').find('[data-flight="start"]').val();
							if (date2 !== "") {
								if ($.datepicker.parseDate(formatCal, date2) > $.datepicker.parseDate(formatCal, fecha)) {
									clearAllErrors($(this));
									$(this).closest('.ibe-datepicker-general').addClass('ibe_form__group--error').find('[data-validate="range-go"]').each(function () {
										$(this).removeClass('hidden');
										$(this).html($(this).data('validate-text'));
									});
								} else {
									isFormatValid($(this));
									if ($('.ibe-datepicker-general').find('[data-validate="range-return"]').is(':visible')) {
										$('.ibe-datepicker-general').find('[data-validate="range-return"]').addClass('hidden');
										$('.ibe-datepicker-general').find('[data-validate="range-return"]').closest('.ibe_form__group').removeClass('ibe_form__group--error');
									}

									$('.ibe-datepicker-general').find('[data-validate="range-go"]').addClass('hidden');
									$(this).closest('.ibe_form__group').removeClass('ibe_form__group--error');
								}
							}

						}
						if (dataDayCalendar.length > 0 && $(this).val() !== "") {
							dateRestriction = new Date();
							datepickerGeneral = $(this).closest('.ibe-datepicker-general');
							dataHour = parseInt(dataDayCalendar.eq(0).data()['hourRestriction']);
							dateRestriction.setMilliseconds(dataHour * 60 * 60 * 1000); //Horas por segundos/hora
							dateRestriction.setHours(0);
							dateRestriction.setMinutes(0);
							dateRestriction.setSeconds(0);

							dataNumDays = dataDayCalendar.length ? parseInt(dataDayCalendar.eq(0).data()['hourRestriction']) : 0;

							if (dataNumDays > 0 && dateParser(fecha, format).getTime() < dateRestriction) {

								clearAllErrors($(this));
								datepickerGeneral.addClass('ibe_form__group--error').find('[data-validate="restriction"]').each(function () {
									$(this).removeClass('hidden');
									$(this).html($(this).data('validate-text'));
								});

							} else {
								isFormatValid($(this));
								if ($(this).closest('.ibe_form__group').find('[data-validate="restriction"]').is(':visible')) {
									$(this).closest('.ibe_form__group')
										.removeClass('ibe_form__group--error')
										.find('[data-validate="restriction"]').addClass('hidden');
								}
							}
						}

					} else {
						//noFormatValid($(this));
						clearAllErrors($(this));
						$(this).closest('.ibe_form__group')
							.find('[data-validate]').html('');

						$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
							$(this).removeClass('hidden');
							$(this).html($(this).data('validate-text'));
						});
						$(this).closest('.ibe_form__group').find('[data-validate="range-go"]').addClass('hidden');
						$(this).closest('.ibe_form__group').find('[data-validate="range-return"]').addClass('hidden');
					}

				} else if ($(this).data('validator') === 'pnr-tkt'){
					if ($(this).val()) {
						if (/(^[a-zA-Z0-9]{5,6}$)|(^[0-9]{3}[- ]?[0-9]{10}$)|(^[0-9]{16}$)/.test($(this).val())) {
							isFormatValid($(this));
						} else {
							noFormatValid($(this));
						}
					} else if (!$(this).val() && !$(this).attr('required')) {
						clearAllErrors($(this));

					}
				}
				if ($(this).data('validator-range') === 'range-custom') {
					// Check that the date is between a range of days
					fechaCalendar = $(this).val();
					format = $(this).data('format');
					rangeMin = $(this).data('range-min');
					rangeMax = $(this).data('range-max');

					if (format === 'DD/MM/YYYY') {
						re = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/
					} else {
						re = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/
					}


					if (re.test(fechaCalendar)) {
						splitDate = fechaCalendar.split('/');
						if (format === 'DD/MM/YYYY') {
							dateSelected = new Date(splitDate[2], splitDate[1] - 1, splitDate[0]);
						} else {
							dateSelected = new Date(splitDate[2], splitDate[0] - 1, splitDate[1]);
						}
						oneDay = 24 * 60 * 60 * 1000;
						dateNow = new Date();
						dateNow.setHours(0, 0, 0, 0);

						diffDays = Math.round(Math.abs((dateSelected.getTime() - dateNow.getTime())) / oneDay);

						if (dateNow > dateSelected) {
							if (diffDays <= parseInt(rangeMin)) {
								$('.ibe-datepicker-general').find('[data-validate="range-min"]').addClass('hidden');
								$('.ibe-datepicker-general').find('[data-validate="range-max"]').addClass('hidden');
								isFormatValid($(this));
								$(this).closest('.ibe_form__group')
									.removeClass('ibe_form__group--error');
							} else {
								$('.ibe-datepicker-general').find('[data-validate="range-max"]').addClass('hidden');
								$(this).closest('.ibe-datepicker-general').addClass('ibe_form__group--error').find('[data-validate="range-min"]').each(function () {
									$(this).removeClass('hidden');
									$(this).html($(this).data('validate-text'));
								});
							}
						} else {
							if (diffDays <= parseInt(rangeMax)) {
								$('.ibe-datepicker-general').find('[data-validate="range-min"]').addClass('hidden');
								$('.ibe-datepicker-general').find('[data-validate="range-max"]').addClass('hidden');
								$(this).closest('.ibe-datepicker-general')
									.removeClass('ibe_form__group--error')
								isFormatValid($(this));
							} else {
								$('.ibe-datepicker-general').find('[data-validate="range-min"]').addClass('hidden');
								$(this).closest('.ibe-datepicker-general').addClass('ibe_form__group--error').find('[data-validate="range-max"]').each(function () {
									$(this).removeClass('hidden');
									$(this).html($(this).data('validate-text'));
								});
							}
						}

					}
				}

			}

			function isFormatValid(valor) {
				valor.closest('.ibe_form__group')
					.has('[data-validate="valid"]:visible')
					.removeClass('ibe_form__group--error')
					.find('[data-validate="valid"]')
					.addClass('hidden');
			}

			function noFormatValid(valor) {
				clearAllErrors(valor);
				valor.closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
					$(this).removeClass('hidden');
					$(this).html($(this).data('validate-text'));
				});
			}

		});
		$('[data-valid-form] input:not([required])').focusout(function () {
			var nif, num, sum, uni, c, pattern, expression, regex, t, validatePinLength, airlines;
			if ($(this).data('validator') === 'plus') {
				if ($(this).val()) {
					if (/^[0-9]*$/.test($(this).val()) && $(this).val().length > 7 && $(this).val().length < 13) {
						$(this).closest('.ibe_form__group')
							.removeClass('ibe_form__group--error')
							.find('[data-validate="valid"]')
							.addClass('hidden')

					} else {
						$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
							$(this).removeClass('hidden');
							$(this).html($(this).data('validate-text'))

						});
						$(this).closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
					}
				} else if (!$(this).val() && !$(this).attr('required')) {
					clearAllErrors($(this));

				}
			} else if ($(this).data('validator') === 'nif') {
				nif = $(this).val().toUpperCase().replace(/[\s\-]+/g, '');
				if (/^(\d|[XYZ])\d{7}[A-Z]$/.test(nif)) {
					num = nif.match(/\d+/);
					num = (nif[0] !== 'Z' ? nif[0] !== 'Y' ? 0 : 1 : 2) + num;
					if (nif[8] === 'TRWAGMYFPDXBNJZSQVHLCKE'[num % 23]) {
						//return /^\d/.test(nif)? 'DNI': 'NIE';
						$(this).closest('.ibe_form__group')
							.removeClass('ibe_form__group--error')
							.find('[data-validate="valid"]')
							.addClass('hidden');
					}
				} else if (/^[ABCDEFGHJKLMNPQRSUVW]\d{7}[\dA-J]$/.test(nif)) {
					for (sum = 0, i = 1; i < 8; ++i) {
						num = nif[i] << i % 2;
						uni = num % 10;
						sum += (num - uni) / 10 + uni;
					}
					c = (10 - sum % 10) % 10;
					if (nif[8] === c || nif[8] === 'JABCDEFGHI'[c]) {
						//return /^[KLM]/.test(nif)? 'ESP': 'CIF';
						$(this).closest('.ibe_form__group')
							.removeClass('ibe_form__group--error')
							.find('[data-validate="valid"]')
							.addClass('hidden');
					}
				} else {
					$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
						$(this).removeClass('hidden');
						$(this).html($(this).data('validate-text'));
					});
					$(this).closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
				}


			} else if ($(this).data('validator') === 'mail') {
				if ($(this).val()) {
					pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
					if (pattern.test($(this).val()) === true) {
						$(this).closest('.ibe_form__group')
							.removeClass('ibe_form__group--error')
							.find('[data-validate="valid"]')
							.addClass('hidden');
						if ($(this).data('different') !== undefined) {
							if ($(this).val() !== $(this).closest('.row').prev().find('input[type=text]').val()) {
								$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="different"]').each(function () {
									$(this).removeClass('hidden');
									$(this).html($(this).data('validate-text'));
								});
								$(this).closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
							} else {
								$(this).closest('.ibe_form__group')
									.removeClass('ibe_form__group--error')
									.find('[data-validate="different"]')
									.addClass('hidden');
							}


						}
					} else {
						$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
							$(this).removeClass('hidden');
							$(this).html($(this).data('validate-text'));
						});
						$(this).closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');

					}
				} else if (!$(this).val() && !$(this).attr('required')) {
					clearAllErrors($(this));
				}
			} else if ($(this).data('validator') === 'personal') {

				if ($(this).val()) {
					if (/^(?!.*[0-9*¡!?¿<>\\\\ºª|/\·@#$%&,;=?¿())_¬+{}\[\]"~\^€$£])/.test($(this).val()) && $(this).val().length <= 30) {
						isFormatValid($(this));
					} else {
						noFormatValid($(this));
					}
				} else if (!$(this).val() && !$(this).attr('required')) {
					clearAllErrors($(this));

				}


			} else if ($(this).data('validator') === 'tel') {
				if ($(this).val()) {
					expression = /(^[+][0-9 ]+$)|(^[0-9 ]{8,30}$)/;
					regex = new RegExp(expression);
					t = $(this).val();

					if (t.match(regex)) {
						$(this).closest('.ibe_form__group')
							.removeClass('ibe_form__group--error')
							.find('[data-validate]')
							.addClass('hidden');
					} else {
						$(this).closest('.ibe_form__group').find('[data-validate]').addClass('hidden');		//remove all error messages for show only 1
						if (isNaN(t)) {		// if not number
							$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="letter"]').each(function () {
								$(this).removeClass('hidden');
								$(this).html($(this).data('validate-text'));
							});
						} else {
							noFormatValid($(this));
						}
					}
				} else if (!$(this).val() && !$(this).attr('required')) {
					clearAllErrors($(this));
				}


			} else if ($(this).data('validator') === 'cod-postal') {
				if ($(this).val()) {
					if (/^[0-9]*$/.test($(this).val()) && $(this).val().length === 5) {
						isFormatValid($(this));
					} else {
						noFormatValid($(this));
					}
				} else if (!$(this).val() && !$(this).attr('required')) {
					clearAllErrors($(this));

				}
			} else if ($(this).data('validator') === 'ibePlus') {  
				if($(this).val().length > 0){ 
					if (valid_luhn_algorithm($(this).val())) {
						$(this).closest('.ibe_form__group')
							.removeClass('ibe_form__group--error')
							.find('[data-validate="valid"]')
							.addClass('hidden');
					} else {
						pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
						if (pattern.test($(this).val()) === true) {
							$(this).closest('.ibe_form__group')
								.removeClass('ibe_form__group--error')
								.find('[data-validate="valid"]')
								.addClass('hidden');
						} else {
							$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
								$(this).removeClass('hidden');
								$(this).html($(this).data('validate-text'));
							});
						}
					}
				}else {  
					clearAllErrors($(this)); 
				}
			} else if ($(this).data('validator') === 'pin' && $(this).val().length > 0) {

				var globalPattern = /^((?!.*[\s])(.){6,20})$/gm;
				if(globalPattern.test($(this).val())) {
					$(this).closest('.ibe_form__group')
						.removeClass('ibe_form__group--error')
						.find('[data-validate="valid"]')
						.addClass('hidden');
				} else {
					$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
						$(this).removeClass('hidden');
						$(this).html($(this).data('validate-text'));
					});
				}

			} else if ($(this).data('validator') === 'numflight') {
				numFlight($(this));

			} else if ($(this).data('validator') === 'code') {
				if ($(this).val()) {
					if ($(this).val().match('^[a-zA-Z0-9_]*$') && $(this).val().length > 4 && $(this).val().length < 7) {
						$(this).closest('.ibe_form__group')
							.removeClass('ibe_form__group--error')
							.find('[data-validate="valid"]')
							.addClass('hidden');
					} else {
						$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
							$(this).removeClass('hidden');
							$(this).html($(this).data('validate-text'));
						});
						$(this).closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
					}
				} else if (!$(this).val() && !$(this).attr('required')) {
					clearAllErrors($(this));

				}
			} else if ($(this).data('validator') === 'pnr-tkt'){
				if ($(this).val()) {
					if (/(^[a-zA-Z0-9]{5,6}$)|(^[0-9]{3}[- ]?[0-9]{10}$)|(^[0-9]{16}$)/.test($(this).val())) {
						isFormatValid($(this));
					} else {
						noFormatValid($(this));
					}
				} else if (!$(this).val() && !$(this).attr('required')) {
					clearAllErrors($(this));

				}
			}
		});

		$('[data-valid-form]').find('input[data-validator="date"]').each(function () {
			$(this).on('keydown', function (e) {
				var key = e.key, newDate, iDate;
				if (key === undefined || key === 'Unidentified') {
					key = String.fromCharCode(e.keyCode)
				}
				if (key === 'Backspace' || key === 'Delete') {
					$(this).closest('.fc_form_group').find('.collapse.in').collapse('hide');
				}
				if (!isNaN(key) || key === '/') {
					newDate = $(this).val().substr(0, e.target.selectionStart) + key + $(this).val().substr(e.target.selectionStart, $(this).val().length);
					iDate = checkPartialDate(newDate, $(this).data('format'));
					switch (iDate) {
						case true:
							$(this).val(newDate);
							break;
						case false:
							if (e.target.selectionStart < $(this).val().length) {
								iDate = checkPartialDate($(this).val().substr(0, e.target.selectionStart) + key, $(this).data('format'));
								switch (iDate) {
									case true:
										$(this).val($(this).val().substr(0, e.target.selectionStart) + key);
										break;
									case false:
										break;
									default:
										$(this).val(iDate);
								}
							}
							break;
						default:
							$(this).val(iDate);
					}
				}
				if (key !== 'Backspace' && key !== 'Delete' && key !== 'Tab' && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 38 && e.keyCode !== 39 && e.keyCode !== 40) {
					e.preventDefault();
				}
			});
		});


		//Function for checkbox for oneway and roundtrip
		$('[data-oneway]').off('click', _oneWayWarranty);
		$('[data-oneway]').on('click', _oneWayWarranty);

		$('[data-roundtrip]').off('click', _roundtripWarranty);
		$('[data-roundtrip]').on('click', _roundtripWarranty);


	};

	var nocopyPaste = function () {

		// NO copy paste in imputs text
		$('[data-no-paste]').on('paste', function (e) {
			e.preventDefault();
			//-alert('Esta acción está prohibida');
		});

		$('[data-no-copy]').on('copy', function (e) {
			e.preventDefault();
			//-alert('Esta acción está prohibida');
		});
	};

	var _oneWayWarranty = function () {
		if ($(this).is(':checked')) {
			$('[data-cal-end]').parent().hide();
		}
	};
	var _roundtripWarranty = function () {
		if ($(this).is(':checked')) {
			$('[data-cal-end]').parent().show();
		}
	};

	var validateLoginFormOB = function(dataOb){
		var regex = new RegExp(/^[a-zA-Z0-9\-_.'@]*$/gi);
		var result = true;
		var errorSpan = null;

		$(".inte-linkOB").closest(".ibe-form__fieldset").find(".ibe_form__group").removeClass("ibe_form__group--error");
		$(".inte-linkOB").closest(".ibe-form__fieldset").find(".ibe_form__msg-info").addClass("hidden");

		if(dataOb.username != ""){			
			if(!regex.test(dataOb.username)){
				result = false;
				errorSpan = $(".user-login-OB").closest(".ibe_form__group").children('[data-validate="valid"]');
				errorSpan.closest(".ibe_form__group").addClass("ibe_form__group--error");
				errorSpan.html(errorSpan.data("validate-text")).removeClass("hidden");
			}			
		} else {
			result = false;
			errorSpan = $(".user-login-OB").closest(".ibe_form__group").children('[data-validate="exist"]');
			errorSpan.closest(".ibe_form__group").addClass("ibe_form__group--error");
			errorSpan.html(errorSpan.data("validate-text")).removeClass("hidden");
		}

		if(dataOb.password == ""){			
			result = false;
			errorSpan = $(".passw-login-OB").closest(".ibe_form__group").children('[data-validate="exist"]');
			errorSpan.closest(".ibe_form__group").addClass("ibe_form__group--error");
			errorSpan.html(errorSpan.data("validate-text")).removeClass("hidden");
		}

		return result;
	};

	var validateForm = function (form) {
		var selector = form || '';
		var date = new Date();

		$(selector + '[data-valid-form] [data-selectmenu][required]').each(function () {
			if ($(this).next('.ui-selectmenu-button:visible')) {
				if ($(this).val() === "") {
					$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="exist"]').each(function () {
						$(this).removeClass('hidden');
						$(this).html($(this).data('validate-text'));
					});
				}
			}
		});

		$(selector + '[data-valid-form] [required]:visible').each(function () {
			var group, format, flight, validatedFiles, expression, regex, t, fecha, re, dataDayCalendar, formatCal, date2,
				dateRestriction, datepickerGeneral, dataHour, dataNumDays, fechaCalendar, rangeMin, rangeMax, splitDate,
				dateSelected, oneDay, dateNow, diffDays;
			if (!$(this).val() && $(this).prop('type') !== 'checkbox') {
				if ($(this).val() === "") {
					// Remove all error message (when data-validate attr aren't input)
					$(this).closest('.ibe_form__group').find('[data-validate]:not("input")').addClass('hidden');
					$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="exist"]').each(function () {
						$(this).removeClass('hidden');
						$(this).html($(this).data('validate-text'));
					});
				}

				if ($(this).data('validator') === 'file') {
					validatedFiles = $(this).data('validatedFiles');
					if (validatedFiles !== undefined) {
						$(this).closest('.ibe_form__group').removeClass('ibe_form__group--error');
						$(this).closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
					} else {
						$(this).closest('.ibe_form__group').addClass('ibe_form__group--error');
						$(this).closest('.ibe_form__group').find('[data-validate="exist"]').removeClass('hidden');
					}
				}

			} else {
				if ($(this).prop('type') === 'checkbox') {
					if (!$(this).is(':checked')) {
						$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="exist"]').each(function () {
							$(this).removeClass('hidden');
							$(this).html($(this).data('validate-text'));
						});
					}
				}

				if ($(this).data('validator') === 'PIR') {
					if ($(this).val().match('[a-zA-Z]{5}[0-9]{5}') && $(this).val().length === 10) {
						isFormatValid($(this));
					} else {
						noFormatValid($(this));
					}
				} else if ($(this).data('validator') === 'ticket') {
					if ($(this).val().match("^[0-9]*$") && $(this).val().length === 13 || $(this).val().match("^[0-9]+( |-[0-9])*[0-9]+$") && $(this).val().length === 14) {
						isFormatValid($(this));
					} else {
						noFormatValid($(this));
					}
				} else if ($(this).data('validator') === 'price') {
					if ($(this).val().match('^[0-9 a-zA-Z,.€$£¥]*$')) {
						isFormatValid($(this));
					} else {
						noFormatValid($(this));
					}
				} else if ($(this).data('validator') === 'personal') {

					if ($(this).val()) {
						if (/^(?!.*[0-9*¡!?¿<>\\\\ºª|/\·@#$%&,;=?¿())_¬+{}\[\]"~\^€$£])/.test($(this).val()) && $(this).val().length <= 30) {
							isFormatValid($(this));
						} else {
							noFormatValid($(this));
						}
					} else if (!$(this).val() && !$(this).attr('required')) {
						clearAllErrors($(this));

					}

				} else if ($(this).data('validator') === 'flight') {
					if ($(this).val().match('[a-zA-Z]{2}[0-9]{1,4}$')) {
						isFormatValid($(this));
					} else {
						noFormatValid($(this));
					}
				} else if ($(this).data('validator') === 'partner') {
					if ($(this).val().match('^[0-9]*$') && $(this).val().length === 8) {
						isFormatValid($(this));
					} else {
						noFormatValid($(this));
					}
				} else if ($(this).data('validator') === 'url') {
					expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/
					regex = new RegExp(expression);
					t = $(this).val();

					if (t.match(regex)) {
						$(this).closest('.ibe_form__group')
							.removeClass('ibe_form__group--error')
							.find('[data-validate="valid"]')
							.addClass('hidden');
					} else {
						$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
							$(this).removeClass('hidden');
							$(this).html($(this).data('validate-text'));
						});
					}
				} else if ($(this).data('validator') === 'date') {
					//Take de value and convert to an array
					fecha = $(this).val();
					format = $(this).data('format');
					//Change the position of the array to MM/DD/AAAAA
					//fecha = arrF[1] + '/' + arrF[0] + '/' + arrF[2];
					if (format === 'DD/MM/YYYY') {
						re = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/
					} else {
						re = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/
					}

					if (re.test(fecha)) {

						isFormatValid($(this));
						$(this).closest('.ibe_form__group')
							.removeClass('ibe_form__group--error');


					} else {
						noFormatValid($(this));
					}

				} else if ($(this).data('validator') === 'date-valid') {
					//Take de value and convert to an array
					fecha = $(this).val();
					group = $('.ibe_form__group');
					format = $(this).data('format');
					flight = $(this).data('flight');
					dataDayCalendar = group.find('[data-hour-restriction]');
					if (format === 'DD/MM/YYYY') {
						re = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
						formatCal = 'dd/mm/yy';
					} else {
						re = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
						formatCal = 'mm/dd/yy';
					}

					if (re.test(fecha)) {
						if (flight === 'start') {
							date2 = $('.ibe_form__group').find('[data-flight="return"]').val();
							if (date2 !== "") {
								if ($.datepicker.parseDate(formatCal, date2) < $.datepicker.parseDate(formatCal, fecha)) {
									clearAllErrors($(this));
									$(this).closest('.ibe-datepicker-general').addClass('ibe_form__group--error').find('[data-validate="range-return"]').each(function () {
										$(this).removeClass('hidden');
										$(this).html($(this).data('validate-text'));
									});
									return false;

								}

								//else
								$('.ibe-datepicker-general').find('[data-validate="range-return"]').addClass('hidden');
								$('.ibe-datepicker-general').find('[data-validate="range-go"]').addClass('hidden');
								isFormatValid($(this));
								$(this).closest('.ibe_form__group').removeClass('ibe_form__group--error');
								$('.ibe-datepicker-general').find('[data-validate="range-go"]').closest('.ibe_form__group').removeClass('ibe_form__group--error');
							}

						} else {
							date2 = $('.ibe_form__group').find('[data-flight="start"]').val();
							if (date2 !== "") {
								if ($.datepicker.parseDate(formatCal, date2) > $.datepicker.parseDate(formatCal, fecha)) {
									clearAllErrors($(this));
									$(this).closest('.ibe-datepicker-general').addClass('ibe_form__group--error').find('[data-validate="range-go"]').each(function () {
										$(this).removeClass('hidden');
										$(this).html($(this).data('validate-text'));
									});
								} else {
									isFormatValid($(this));
									if ($('.ibe-datepicker-general').find('[data-validate="range-return"]').is(':visible')) {
										$('.ibe-datepicker-general').find('[data-validate="range-return"]').addClass('hidden');
										$('.ibe-datepicker-general').find('[data-validate="range-return"]').closest('.ibe_form__group').removeClass('ibe_form__group--error');
									}

									$('.ibe-datepicker-general').find('[data-validate="range-go"]').addClass('hidden');
									$(this).closest('.ibe_form__group').removeClass('ibe_form__group--error');
								}
							}

						}
						if (dataDayCalendar.length > 0 && $(this).val() !== "") {
							dateRestriction = new Date();
							datepickerGeneral = $(this).closest('.ibe-datepicker-general');
							dataHour = parseInt(dataDayCalendar.eq(0).data()['hourRestriction']);
							dateRestriction.setMilliseconds(dataHour * 60 * 60 * 1000); //Horas por segundos/hora
							dateRestriction.setHours(0);
							dateRestriction.setMinutes(0);
							dateRestriction.setSeconds(0);
							dataNumDays = dataDayCalendar.length ? parseInt(dataDayCalendar.eq(0).data()['hourRestriction']) : 0;

							if (dataNumDays > 0 && dateParser(fecha, format).getTime() < dateRestriction) {

								clearAllErrors($(this));
								datepickerGeneral.addClass('ibe_form__group--error').find('[data-validate="restriction"]').each(function () {
									$(this).removeClass('hidden');
									$(this).html($(this).data('validate-text'));
								});

							} else {
								isFormatValid($(this));
								if ($(this).closest('.ibe_form__group').find('[data-validate="restriction"]').is(':visible')) {
									$(this).closest('.ibe_form__group')
										.removeClass('ibe_form__group--error')
										.find('[data-validate="restriction"]').addClass('hidden');
								}
							}
						}

					} else {
						//noFormatValid($(this));
						clearAllErrors($(this));
						$(this).closest('.ibe_form__group')
							.find('[data-validate]').html('');

						$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
							$(this).removeClass('hidden');
							$(this).html($(this).data('validate-text'));
						});
						$(this).closest('.ibe_form__group').find('[data-validate="range-go"]').addClass('hidden');
						$(this).closest('.ibe_form__group').find('[data-validate="range-return"]').addClass('hidden');
						return false;
					}

				} else if ($(this).data('validator') === 'pnr-tkt'){
					if ($(this).val()) {
						if (/(^[a-zA-Z0-9]{5,6}$)|(^[0-9]{3}[- ]?[0-9]{10}$)|(^[0-9]{16}$)/.test($(this).val())) {
							isFormatValid($(this));
						} else {
							noFormatValid($(this));
						}
					} else if (!$(this).val() && !$(this).attr('required')) {
						clearAllErrors($(this));

					}
				} else if ($(this).data('validator') === 'mail') {
					if ($(this).val()) {
						regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
						if (regex.test($(this).val())) {
							isFormatValid($(this));
							if ($(this).data('different') !== undefined) {
								if ($(this).val() !== $(this).closest('.row').prev().find('input[type=text]').val()) {
									noFormatValid($(this));
								} else {
									$(this).closest('.ibe_form__group')
										.removeClass('ibe_form__group--error')
										.find('[data-validate="different"]')
										.addClass('hidden');
								}
	
	
							}
	
						} else {
							$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
								$(this).removeClass('hidden');
								$(this).html($(this).data('validate-text'));
							});
						}
					}
				} 

				if ($(this).data('validator-range') === 'range-custom') {
					// Check that the date is between a range of days
					fechaCalendar = $(this).val();
					format = $(this).data('format');
					rangeMin = $(this).data('range-min');
					rangeMax = $(this).data('range-max');

					if (format === 'DD/MM/YYYY') {
						re = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/
					} else {
						re = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/
					}


					if (re.test(fechaCalendar)) {
						splitDate = fechaCalendar.split('/')
						if (format === 'DD/MM/YYYY') {
							dateSelected = new Date(splitDate[2], splitDate[1] - 1, splitDate[0])
						} else {
							dateSelected = new Date(splitDate[2], splitDate[0] - 1, splitDate[1])
						}
						oneDay = 24 * 60 * 60 * 1000;
						dateNow = new Date();
						dateNow.setHours(0, 0, 0, 0);
						diffDays = Math.round(Math.abs((dateSelected.getTime() - dateNow.getTime())) / oneDay);

						if (dateNow > dateSelected) {
							if (diffDays <= parseInt(rangeMin)) {
								$('.ibe-datepicker-general').find('[data-validate="range-min"]').addClass('hidden');
								$('.ibe-datepicker-general').find('[data-validate="range-max"]').addClass('hidden');
								isFormatValid($(this));
								$(this).closest('.ibe_form__group')
									.removeClass('ibe_form__group--error');
							} else {
								$('.ibe-datepicker-general').find('[data-validate="range-max"]').addClass('hidden');
								$(this).closest('.ibe-datepicker-general').addClass('ibe_form__group--error').find('[data-validate="range-min"]').each(function () {
									$(this).removeClass('hidden');
									$(this).html($(this).data('validate-text'));
								});
							}
						} else {
							if (diffDays <= parseInt(rangeMax)) {
								$('.ibe-datepicker-general').find('[data-validate="range-min"]').addClass('hidden');
								$('.ibe-datepicker-general').find('[data-validate="range-max"]').addClass('hidden');
								$(this).closest('.ibe-datepicker-general')
									.removeClass('ibe_form__group--error')
								isFormatValid($(this));
							} else {
								$('.ibe-datepicker-general').find('[data-validate="range-min"]').addClass('hidden');
								$(this).closest('.ibe-datepicker-general').addClass('ibe_form__group--error').find('[data-validate="range-max"]').each(function () {
									$(this).removeClass('hidden');
									$(this).html($(this).data('validate-text'));
								});
							}
						}

					}
				}
			}
		});
		$(selector + '[data-valid-form] input:not([required])').each(function () {
			var expression, regex, t, cadena, pattern, sum, num, c, nif, airlines, validatePinLength, uni, sum, number;
			if ($(this).data('validator') === 'plus') {
				if ($(this).val()) {
					if ($(this).val().match('^[0-9]*$') && $(this).val().length > 7 && $(this).val().length < 13) {
						$(this).closest('.ibe_form__group')
							.removeClass('ibe_form__group--error')
							.find('[data-validate="valid"]')
							.addClass('hidden');
					} else {
						$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
							$(this).removeClass('hidden');
							$(this).html($(this).data('validate-text'));
						});
					}
				}

			} else if ($(this).data('validator') === 'personal') {
				if ($(this).val()) {
					if (/^(?!.*[0-9*¡!?¿<>\\\\ºª|/\·@#$%&,;=?¿())_¬+{}\[\]"~\^€$£])/.test($(this).val()) && $(this).val().length <= 30) {
						isFormatValid($(this));
					} else {
						noFormatValid($(this));
					}
				} else if (!$(this).val() && !$(this).attr('required')) {
					clearAllErrors($(this));

				}

			} else if ($(this).data('validator') === 'num-flight') {
				if ($(this).val().match('^([a-z]+[0-9]){4,6}$') && $(this).val().length > 4 && $(this).val().length < 7) {
					$(this).closest('.ibe_form__group')
						.removeClass('ibe_form__group--error')
						.find('[data-validate="valid"]')
						.addClass('hidden');
				} else {
					$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
						$(this).removeClass('hidden');
						$(this).html($(this).data('validate-text'));
					});
				}


			} else if ($(this).data('validator') === 'code') {
				if ($(this).val()) {
					if ($(this).val().match('^[a-zA-Z0-9_]*$') && $(this).val().length > 4 && $(this).val().length < 7) {
						$(this).closest('.ibe_form__group')
							.removeClass('ibe_form__group--error')
							.find('[data-validate="valid"]')
							.addClass('hidden');
					} else {
						$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
							$(this).removeClass('hidden');
							$(this).html($(this).data('validate-text'));
						});
					}
				}
			} else if ($(this).data('validator') === 'tel') {
				if ($(this).val()) {
					expression = /(^[+][0-9 ]+$)|(^[0-9 ]{8,30}$)/;
					regex = new RegExp(expression);
					t = $(this).val();

					if (t.match(regex)) {
						$(this).closest('.ibe_form__group')
							.removeClass('ibe_form__group--error')
							.find('[data-validate]')
							.addClass('hidden');
					} else {
						$(this).closest('.ibe_form__group').find('[data-validate]').addClass('hidden');		//remove all error messages for show only 1
						if (isNaN(t)) {		// if not number
							$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="letter"]').each(function () {
								$(this).removeClass('hidden');
								$(this).html($(this).data('validate-text'));
							});
						} else {
							noFormatValid($(this));
						}
					}
				}


			} else if ($(this).data('validator') === 'cod-postal') {
				if ($(this).val()) {
					if ($(this).val().match('^[0-9]*$') && $(this).val().length === 5) {
						isFormatValid($(this));
					} else {
						noFormatValid($(this));
					}
				}


			} else if ($(this).data('validator') === 'cod-ticket') {
				cadena = $(this).val();
				if ($(this).val().match('^[0-9-]*$') && cadena.indexOf('075-') > -1 && $(this).val().length === 14) {
					isFormatValid($(this));
				} else {
					noFormatValid($(this));
				}
			} else if ($(this).data('validator') === 'ibePlus' && $(this).val().length > 0) {
				if (valid_luhn_algorithm($(this).val())) {
					isFormatValid($(this));
				} else {
					pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
					if (pattern.test($(this).val()) === true) {
						isFormatValid($(this));
					} else {
						noFormatValid($(this));
					}
				}
			} else if ($(this).data('validator') === 'onBusiness' && $(this).val().length > 0) {
				if (!$(this).val().match('^OB[0-9-]{8}$')) {
					noFormatValid($(this));
				} else {
					sum = 0;
					number = $(this).val();
					for (var i = 2; i < number.length - 1; i++) {
						sum = sum + parseInt(number.charAt(i));
					}
					var result = sum % 7 === parseInt(number.charAt(number.length - 1));

					if(result){
						isFormatValid($(this));
					} else {
						noFormatValid($(this));
					}
				}
			} else if ($(this).data('validator') === 'pin' && $(this).val().length > 0) {
				var globalPattern = /^((?!.*[\s])(.){6,20})$/gm;
				if(globalPattern.test($(this).val())) {
					isFormatValid($(this));
				} else{
					noFormatValid($(this));
				}

			} else if ($(this).data('validator') === 'numflight') {
				numFlight($(this));

			} else if ($(this).data('validator') === 'nif') {
				nif = $(this).val()
				nif = nif.toUpperCase().replace(/[\s\-]+/g, '');
				if (/^(\d|[XYZ])\d{7}[A-Z]$/.test(nif)) {
					num = nif.match(/\d+/);
					num = (nif[0] !== 'Z' ? nif[0] !== 'Y' ? 0 : 1 : 2) + num;
					if (nif[8] === 'TRWAGMYFPDXBNJZSQVHLCKE'[num % 23]) {
						//return /^\d/.test(nif)? 'DNI': 'NIE';
						isFormatValid($(this));
					}
				} else if (/^[ABCDEFGHJKLMNPQRSUVW]\d{7}[\dA-J]$/.test(nif)) {
					for (sum = 0, i = 1; i < 8; ++i) {
						num = nif[i] << i % 2;
						uni = num % 10;
						sum += (num - uni) / 10 + uni;
					}
					c = (10 - sum % 10) % 10;
					if (nif[8] === c || nif[8] === 'JABCDEFGHI'[c]) {
						//return /^[KLM]/.test(nif)? 'ESP': 'CIF';
						isFormatValid($(this));
					}
				} else {
					noFormatValid($(this));
				}


			} else if ($(this).data('validator') === 'mail') {
				if ($(this).val()) {
					pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
					if (pattern.test($(this).val())) {
						isFormatValid($(this));
						if ($(this).data('different') !== undefined) {
							if ($(this).val() !== $(this).closest('.row').prev().find('input[type=text]').val()) {
								noFormatValid($(this));
							} else {
								$(this).closest('.ibe_form__group')
									.removeClass('ibe_form__group--error')
									.find('[data-validate="different"]')
									.addClass('hidden');
							}


						}

					} else {
						$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
							$(this).removeClass('hidden');
							$(this).html($(this).data('validate-text'));
						});
					}
				}
			} else if ($(this).data('validator') === 'pnr-tkt'){
				if ($(this).val()) {
					if (/(^[a-zA-Z0-9]{5,6}$)|(^[0-9]{3}[- ]?[0-9]{10}$)|(^[0-9]{16}$)/.test($(this).val())) {
						isFormatValid($(this));
					} else {
						noFormatValid($(this));
					}
				} else if (!$(this).val() && !$(this).attr('required')) {
					clearAllErrors($(this));

				}
			}

		});

		if ($(selector + '[data-valid-form]').find('.ibe_form__group--error').length > 0) {
			return false;
		}
		return true;

	};

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
	}

	return {
		'init': init,
		'validateForm': validateForm,
		'formatTicket': formatTicket,
		'nocopyPaste': nocopyPaste,
		'numFlight': numFlight,
		'compareCity': compareCity,
		'validateLoginFormOB': validateLoginFormOB
	};
}(jQuery);
