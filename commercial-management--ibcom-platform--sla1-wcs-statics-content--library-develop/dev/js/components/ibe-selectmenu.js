dFrontJs.ibe_selectmenu = function () {
	/*eslint no-underscore-dangle: ["error", { "allow": ["_createAutocomplete", "_createShowAllButton", "_on", "_trigger", "_renderItem"] }]*/
	var init = function (selector) {
		var $select = $('[data-selectmenu]'),
			$selectEdit = $('[data-selectmenu-edit]'),
			$selectLabel = $('[data-selectmenu_claim]'),
			$vintage = $('.ibe-searcher__vintage'),
			$modal = $('.ibe-dinamic-modal');

		requestAnimFrame(function () {
			var i, initialvalue, select;
			if ($selectEdit) {
				for (i = 0; $selectEdit.length > i; i++) {
					select = $($selectEdit[i]);

					//Creamos el combobox
					function selecciona_value(objInput) {
						var valor_input = objInput.value;
						var longitud = valor_input.length;
						var range;
						if (objInput.setSelectionRange) {
							objInput.focus();
							objInput.setSelectionRange(0, longitud);
						} else if (objInput.createTextRange) {
							range = objInput.createTextRange();
							range.collapse(true);
							range.moveEnd('character', longitud);
							range.moveStart('character', 0);
							range.select();
						}
					}

					$.widget('custom.combobox', {
						//Casuistica sin data-placeholder
						_create: function () {
							this.wrapper = $('<div>')
								.addClass('custom-combobox ibe-select__edit')
								.insertAfter(this.element);
							this.element.hide();
							this._createAutocomplete();
							this._createShowAllButton();
						},
						_createAutocomplete: function () {
							//Aquí solo entra una vez
							var elementEmpty = '', element, selected, wasOpen, value;

							//Casuistica sin data-placeholder
							if (!select.attr('data-placeholder')) {
								element = this.element.children();
								element.each(function (i) {
									var $this = $(this); //Aquí estamos cogiendo los option
									if ($this.val() === "") {
										elementEmpty = $(this).text();
									}
								});
							}

							selected = this.element.children(':selected'); //El option del select que aparece seleccionado por defecto
							value = selected.val() ? selected.text() : elementEmpty;

							wasOpen = false;
							this.label = $('<label for="select-edit-' + (i + this.uuid) + '" class="ibe-select__label ibe-select__input">')
								.appendTo(this.wrapper)
								.text(value);
							initialvalue = this.label.text();

							this.input = $('<input id="select-edit-' + (i + this.uuid) + '" name="select-edit' + (i + this.uuid) + '">')
								.appendTo(this.wrapper)
								.val(value)
								.addClass('ibe-select__input custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left')
								.click(function (e) {
									selecciona_value(e.currentTarget);
									wasOpen = $(this).autocomplete('widget').is(':visible');
									$(this).trigger('focus');
									$(this).autocomplete('search', '');               //Search empty text, show all items

									if (wasOpen) {
										$(this).parent().find('.ibe-select__autocomplete').toggle();
										$(this).parent().toggleClass('ibe-select__edit--open');
									}
								})
								.autocomplete({
									appendTo: this.wrapper,
									delay: 0,
									minLength: 0,
									// autoFocus: true,    // auto select in search input text
									source: $.proxy(this, '_source'),
									position: {
										my: 'left top',
										at: 'left bottom',
										collision: 'fit'
									},
									create: function () {
										$(this).autocomplete('close');
									},
									open: function () {
										$(this).parent().addClass('ibe-select__edit--open');
									},
									close: function () {
										$(this).parent().removeClass('ibe-select__edit--open');
									},
									select: function () {
										var valueS = $(this).parent().siblings('select').find('option:selected').text();
										$(this).val(valueS);
										$(this).blur();

									}
								})
								.focus(function (e) {
									selecciona_value(e.currentTarget);
								});


							if (select.attr('data-placeholder')) {
								this.input.attr('placeholder', select.attr('data-placeholder'));
								this.wrapper.addClass('ibe-select__placeholder');
							}


							this.wrapper.find('.ui-autocomplete').addClass('ibe-select__autocomplete');
							this._on(this.input, {
								autocompleteselect: function (event, ui) {
									ui.item.option.selected = true;
									this._trigger('select', event, {
										item: ui.item.option
									});
									this.bindings.eq(0).trigger('change');
									this.label.text(ui.item.value);

								},
								autocompletechange: '_removeIfInvalid'
							});
						},
						_createShowAllButton: function () {
							var input = this.input,
								wasOpen = false;

							$('<a class="ibe-select__toggle custom-combobox-toggle ui-corner-right" aria-label="Button combobox">')
								.appendTo(this.wrapper)
								.button({
									icons: {
										primary: 'ui-icon-triangle-1-s'
									},
									text: false
								})
								.removeClass('ui-corner-all')
								.on('mousedown', function () {
									wasOpen = input.autocomplete('widget').is(':visible');
								})
								.on('click', function () {
									input.trigger('focus');

									// Close if already visible
									if (wasOpen) {
										return;
									}

									// Pass empty string as value to search for, displaying all results
									input.autocomplete('search', '');
								});
						},
						_source: function (request, response) {
							var accentMap = {
								'á': 'a', 'à': 'a', 'â': 'a', 'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
								'í': 'i', 'ï': 'i', 'î': 'i', 'ó': 'o', 'ô': 'o', 'ö': 'o', 'û': 'u', 'ù': 'u',
								'Á': 'A', 'À': 'A', 'Â': 'A', 'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E',
								'Í': 'I', 'Ï': 'I', 'Î': 'I', 'Ó': 'O', 'Ô': 'O', 'Ö': 'O', 'Û': 'U', 'Ù': 'U'
							};
							var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), 'i');
							var matcher2 = new RegExp($.ui.autocomplete.escapeRegex(request.term.replace(/[^\w ]/g, function (char) {
								return accentMap[char] || char;
							})), 'i');
							response(this.element.children('option').map(function () {
								var text = $(this).text();
								if (this.value && (!request.term || matcher.test(text) || matcher2.test(text.replace(/[^\w ]/g, function (char) {
									return accentMap[char] || char;
								}))))
									return {
										label: text,
										value: text,
										option: this
									};
							}));
						},
						_removeIfInvalid: function (event, ui) {
							var value, valueLowerCase, valid;

							// Selected an item, nothing to do
							if (ui.item) {
								select.find('.ibe-select__label').text(event.target.value);
								return;
							}

							select.find('.ibe-select__label').text(initialvalue);
							this.label.text(initialvalue);

							// Search for a match (case-insensitive)
							value = this.input.val();
							valueLowerCase = value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
							valid = false;
							this.element.children('option').each(function () {
								if ($(this).text().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === valueLowerCase) {
									this.selected = valid = true;
									return false;
								}
							});

							// Found a match, nothing to do
							if (valid) {
								$(event.target).parents().siblings('label').text(event.target.value);
								$(event.target).siblings('label').text(event.target.value);
								return;
							}

							// Remove invalid value
							this.input.val(initialvalue);
							this.element.val('');
							// this._delay(function () {
							//   this.input.tooltip('close').attr('title', '');
							// }, 2500);d
							this.input.autocomplete('instance').term = '';
						},
						_destroy: function () {
							this.wrapper.remove();
							this.element.show();
						}
					});
					$(select).combobox();
					// console.log($selectEdit.value())
					if ($selectEdit.parent().hasClass('ibe_form__group--select-edit')) {

					}
				}
			}
		});
		requestAnimFrame(function () {
			if ($select) {
				$select.each(function () {
					var select = $(this);
					var id = $(this).attr('id');
					var addscroll = $(this).data('addscroll');
					select.selectmenu({
						appendTo: $(this).parent(),
						position: {
							my: 'left top',
							at: 'left bottom',
							collision: 'flip flip'
						},
						create: function () {
							if (addscroll !== undefined) {
								$('#' + id + '-menu').addClass('ibe-select__menu--scroll');
							}
							$('#' + id + '-menu').addClass('ibe-select__menu');
							$('#' + id + '-button').addClass('ibe-select__button');
							$('#' + id + '-button').find('span').attr('role', 'presentation');
						},

						open: function () {
							$('#' + id + '-button').addClass('ibe-select__button--open');
							/////// To open / close the modal in case of vintage search//////////////////
							if ($('#' + id + '-button').parents('.ibe-searcher__vintage').length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
								dFrontJs.ibe_modals_vintage.openModalTarifas();
							}
							/////// End open / close the modal modal ////////////////////////////

							//Selectmenu Disable modal option in advanced searcher - IBDIGITAL
							if (!$(this).parents('.ibe-advanced-searcher').length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
								dFrontJs.ibe_dinamic_modal.open($('#' + id + '-button'));
							}

						},
						close: function () {
							if (window.innerWidth < dFrontJs.resolutions.lg) {
								dFrontJs.ibe_dinamic_modal.close($('#' + id + '-button'));
							}
							$('#' + id + '-button').removeClass('ibe-select__button--open');
							if ($('#' + id + '-button').parents('.ibe-searcher__vintage').length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
								dFrontJs.ibe_modals_vintage.closeModalsVintage('yes');
							}

						},
						change: function (event, ui) {
							if ($(ui.item.element).data('function')) {
								if ($(ui.item.element).data('src')) {
									window.location = $(ui.item.element).data('src');
								} else {
									if ($(ui.item.element).data('function') === 'oneway') {
										dFrontJs.ibe_searcher_calendar.activeOneWayFunction(select);
									} else if ($(ui.item.element).data('function') === 'roundtrip') {
										dFrontJs.ibe_searcher_calendar.activeRountripFunction(select);
									}
								}
							}
						},


					}).data('ui-selectmenu')._renderItem = function (ul, item) {
						var src = item.element.data('src');
						if (src) {
							return $('<li>')
								.append('<a class="ui-menu-item-link ui-menu-item-wrapper" href="' + src + '" title="' + item.label + '">'
									+ '<span class="ui-menu-item-link__text">' + item.label + '</span></a>')
								.appendTo(ul);
						}

						return $('<li>')
							.append('<div class="ui-menu-item-wrapper"' + item.label + '>'
								+ '<span class="ui-menu-item-link__text">' + item.label + '</span></div>')
							.appendTo(ul);
					};

				});

			}
		});
		requestAnimFrame(function () {
			if ($selectLabel) {
				$selectLabel.each(function () {
					var select = $(this).find('select');
					select.selectmenu({
						change: function (event, ui) {
							var value = select.val();
							var div = $(this).parent();
							var label = div.find('label');
							var text = label.find('span');
							var parentForm, selectedValue, selctrelated, listaMotivos, options = [], i;
							if (value.length > 0) {
								$(label).addClass('ibe_form__selectize--label02');
								$(text).addClass('ibe_form__input-text--selectnew');
							} else {
								$(label).removeClass('ibe_form__selectize--label02');
								$(text).removeClass('ibe_form__input-text--selectnew');
							}
							if (select.hasClass('inte-claim-type')) {
								parentForm = '#' + select.closest('.inte-contentClaims').attr('id');
								selectedValue = $(parentForm + ' .inte-claim-type')[0].value;

								$(parentForm + ' .inte-claim-reason00').parent().removeClass('ibe_form__group--error');
								$(parentForm + ' .inte-claim-reason00').parent().find('p').each(function () {
									if ($(this)[0].className.indexOf('hidden') === -1) {
										$(this).addClass('hidden');
									}
								});
								if (selectedValue === 'Equipaje') {
									$('.inte-pir').removeClass('hidden');
									$('.inte-pir-date').removeClass('hidden');
									$('#divInformation1').removeClass('hidden');
									$('#divInformation2').removeClass('hidden');
									$('#pir').attr('Required', 'true');
									$('[data-valid-form] #pir').focusout(function () {
										if ($(this).attr('required') === 'required') {
											if (!$(this).val()) {
												$(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="exist"]').each(function () {
													$(this).removeClass('hidden');
													$(this).html($(this).data('validate-text'));
												});
												$(this).closest('.ibe_form__group')
													.find('[data-validate="valid"]')
													.addClass('hidden');
											} else {
												$(this).closest('.ibe_form__group')
													.has('[data-validate="exist"]:visible')
													.removeClass('ibe_form__group--error')
													.find('[data-validate="exist"]')
													.addClass('hidden');
												if ($(this).val().match('[a-zA-Z]{5}[0-9]{5}') && $(this).val().length === 10) {
													$(this).closest('.ibe_form__group')
														.has('[data-validate="valid"]:visible')
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
										}
									});
								} else if ($('#divInformation2').length > 0) {
									$('.inte-pir').addClass('hidden');
									$('.inte-pir-date').addClass('hidden');
									$('#divInformation1').addClass('hidden');
									$('#divInformation2').addClass('hidden');
									$('.inte-pir input').removeAttr('Required');
									$('.inte-pir-date input').removeAttr('Required');
									$('#pir').parent().removeClass('ibe_form__group--error');
									$('#pir').parent().find('p').each(function () {
										if ($(this)[0].className.indexOf('hidden') === -1) {
											$(this).addClass('hidden');
										}
									});
								}
								$(parentForm + ' .inte-claim-reason00').children('option:not(:first)').remove();
								$(parentForm + ' .inte-claim-reason00').selectmenu('refresh');

								selctrelated = $(parentForm + ' .inte-claim-type option:selected').attr('data-related');
								listaMotivos = getSubtypes(parentForm);
								for (i = 0; i < listaMotivos.length; i++) {
									if (listaMotivos[i].parent === selectedValue || (listaMotivos[i].parent).indexOf(selctrelated) > -1) {
										options.push('<option value="' + listaMotivos[i].id + '">' + listaMotivos[i].value + '</option>');
									}
								}
								if (options.length > 0) {
									$(parentForm + ' .inte-claim-reason00').attr('Required', 'true');
									$(parentForm + ' .inte-slcClaimReason').removeClass('hide');
									$(parentForm + ' .inte-claim-reason00').append(options.join('')).selectmenu();
									$(parentForm + ' .inte-claim-reason00').selectmenu('refresh');
									if ($(parentForm + ' .inte-slcClaimReason').length > 0) {
										if ($(parentForm + ' .inte-slcClaimReason')[0].className.indexOf('ibe_form__group--disabled') > -1) {
											$(parentForm + ' .inte-slcClaimReason').removeClass('ibe_form__group--disabled');
											$(parentForm + ' .inte-claim-reason00').selectmenu('enable');
										}
									}
									$(parentForm + ' .inte-claim-reason00').parent().removeClass('ibe_form__group--error');
									$(parentForm + ' .inte-claim-reason00').parent().find('p').each(function () {
										if ($(this)[0].className.indexOf('hidden') === -1) {
											$(this).addClass('hidden');
										}
									});
									$(parentForm + ' .inte-claim-reason00').val('');
									$(parentForm + ' .inte-claim-reason00').selectmenu('destroy');
									dFrontJs.ibe_selectmenu.init();
									$(parentForm + ' .inte-claim-reason00').parent().removeClass('ibe_form__group--content');
								} else {
									$(parentForm + ' .inte-claim-reason00').removeAttr('Required');
									$(parentForm + ' .inte-slcClaimReason').addClass('hide');
									$(parentForm + ' .inte-slcClaimReason').addClass('ibe_form__group--disabled');
									$(parentForm + ' .inte-claim-reason00').selectmenu('disable');
									$(parentForm + ' .inte-claim-reason00').parent().removeClass('ibe_form__group--error');
									$(parentForm + ' .inte-claim-reason00').parent().find('p').each(function () {
										if ($(this)[0].className.indexOf('hidden') === -1) {
											$(this).addClass('hidden');
										}
									});
								}
							} else if (select.hasClass('inte-type')) {
								parentForm = '#' + select.closest('.inte-typesubtypeForm').attr('id');
								selectedValue = $(parentForm + ' .inte-type')[0].value;
								options = [];
								selctrelated = $(parentForm + ' .inte-type option:selected').attr('data-related');
								listaMotivos = getSubtypes(parentForm);
								for (i = 0; i < listaMotivos.length; i++) {
									if (listaMotivos[i].parent === selectedValue || (listaMotivos[i].parent).indexOf(selctrelated) > -1) {
										options.push('<option value="' + listaMotivos[i].id + '">' + listaMotivos[i].value + '</option>');
									}
								}
								$(parentForm + ' .inte-subtype').children('option:not(:first)').remove();
								$(parentForm + ' .inte-subtype').selectmenu('refresh');
								$(parentForm + ' .inte-subtype').append(options.join('')).selectmenu();
								$(parentForm + ' .inte-subtype').selectmenu('refresh');
							}
						},
						open: function (event) {
							var id = $(this).attr('id');
							var menu = $('#' + id + '-menu');
							//Ocultar Selecciona (primer elemento que mostramos de ejemplo)
							if (event.target[0].value === "") {
								menu.find('li').first().hide();
							}
						},
						close: function () {
							var $this = $(this);
							if ($('[data-valid-form] [required]')) {
								if ($this.attr('required') === 'required') {
									if (!$this.val()) {
										$this.closest('.ibe_form__group').addClass('ibe_form__group--error');
										$this.closest('.ibe_form__group').find('[data-validate]').each(function () {
											var $this = $(this);
											$this.removeClass('hidden');
											$this.html($this.data('validate-text'));
										});
									} else {
										$this.closest('.ibe_form__group').has('[data-validate-text]:visible').removeClass('ibe_form__group--error');
										$this.closest('.ibe_form__group').find('[data-validate]').each(function () {
											var $this = $(this);
											$this.addClass('hidden');
										});
									}
								}
							}
						}
					});
				});
			}
		});
	};
	return {
		'init': init
	};
}(jQuery);
