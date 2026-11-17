dFrontJs.ibe_autocomplete = function () {
	/*eslint no-underscore-dangle: ['error', { 'allow': ['_hoverAutocomplete', '_focusAutocomplete', '_focusoutInput', '_loadCityList',
	'_inputClickSelect', '_inputClickSelect', 'cityAirportsConstructor', '_changeValidationCities', '_focusoutValidationCities', '_move', '_renderItem', '_value'] }]*/
	var _hoverAutocomplete = function ($selector) {
		var $item = $selector.find('.ui-menu-item'),
			$focus = $selector.find('.ui-state-focus')
		$item.mouseover(function () {
			$focus.removeClass('ui-state-focus');

		});
	};

	var _focusAutocomplete = function () {
		$(this).off('focusout', _focusoutInput);
		$(this).on('focusout', _focusoutInput);

		setTimeout(function () {
			if ($('[data-city-list="collapse"]').is(':visible')) {
				$('[data-city-list="collapse"]').collapse('hide');
			}
		}, 500);
	};

	var _focusoutInput = function () {
		var inputVal = $(this).val();
		var $tab = $('.ui-tabs-panel:visible');
		var listCity = $(this).parent().find('[data-tab-cities="mobile"]');
		var match = $(listCity).find('a[title="' + inputVal + '"]');

		// console.log(match)

		if ($(match).length > 0) {
			$(listCity).find('.city-selected').removeClass('city-selected');
			//-$(match).addClass('city-selected');
			$($tab).find(match).addClass('city-selected');
		}

	};

	var _loadCityList = function (inputCity) {

		inputCity.each(function () {
			var inputVal = $(this).val();
			var $tab = $(this).closest('.ui-tabs-panel');
			var listCity = $(this).parent().find('[data-tab-cities="mobile"]');
			var match = $(listCity).find('a[title="' + inputVal + '"]');

			if ($(match).length > 0) {
				$(listCity).find('.city-selected').removeClass('city-selected');
				$tab.each(function (key, value) {
					$(value).find(match).first().addClass('city-selected');
				});
			}
		});

	};

	var _inputClickSelect = function (e) {
		if (navigator.userAgent.match(/(iPhone)|(iPad)|(iPod)/i)) {
			$(this).get(0).setSelectionRange(0, $(this).val().length);
		} else {
			$(this).select();
		}
	};


	//Función para ordenar los elementos por el label
	var sortLabel = function (a, b) {
		var accentMap = {
			'á': 'a', 'à': 'a', 'â': 'a', 'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
			'í': 'i', 'ï': 'i', 'î': 'i', 'ó': 'o', 'ô': 'o', 'ö': 'o', 'û': 'u', 'ù': 'u', 'ú': 'u',
			'Á': 'A', 'À': 'A', 'Â': 'A', 'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E',
			'Í': 'I', 'Ï': 'I', 'Î': 'I', 'Ó': 'O', 'Ô': 'O', 'Ö': 'O', 'Û': 'U', 'Ù': 'U', 'Ú': 'U'
		};
		var a = a.label.replace(/[^\w ]/g, function (char) {
			return accentMap[char] || char;
		}).toLowerCase();
		var b = b.label.replace(/[^\w ]/g, function (char) {
			return accentMap[char] || char;
		}).toLowerCase();

		return ((a < b) ? -1 : ((a > b) ? 1 : 0));
	}

	var cityAirportsConstructor = function (json) {
		var data_autocomplete = [];
		$.each(json, function () {
			var $this = this, //link
				name = $this.name, //city
				fs = $this.cityCode, //code
				iata = $this.iataCode,  //IATA code
				country = $this.countryName; //country


			var aux = {
				'label': name + ' (' + iata + ')',
				'value': name + ' (' + iata + ')',
				'country': country,
				'fs': fs,
				'iata': iata
			};

			data_autocomplete.push(aux);
		});

		//Ordenamos los elementos por el label alfabéticamente
		return data_autocomplete = data_autocomplete.sort(sortLabel);
	};

	var cityListContructor = function (json) {
		var data_autocomplete = [];
		var i;
		for (i = 0; i < json.length; i++) {
			$.each((json[i]).cities, function () {
				var $this = this, //enlace
					text = $this.description, //ciudad
					iata = $this.code,
					country = $this.country && $this.country.description ? $this.country.description : ''; //pais
				var aux = {
					'label': text + ' (' + iata + ')',
					'value': text + ' (' + iata + ')',
					'country': country,
					'iata': iata
				};				
					data_autocomplete.push(aux)
			});
		}
		//Ordenamos los elementos por el label alfabéticamente

		return data_autocomplete = data_autocomplete.sort(sortLabel);
	};
	var updateSourceList = function (input,list){
		var normalize = function (term) {
			var ret = '';
			var accentMap = {
						  'á': 'a', 'à': 'a', 'â': 'a', 'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
						  'í': 'i', 'ï': 'i', 'î': 'i', 'ó': 'o', 'ô': 'o', 'ö': 'o', 'û': 'u', 'ù': 'u', 'ú': 'u',
						  'Á': 'A', 'À': 'A', 'Â': 'A', 'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E',
						  'Í': 'I', 'Ï': 'I', 'Î': 'I', 'Ó': 'O', 'Ô': 'O', 'Ö': 'O', 'Û': 'U', 'Ù': 'U', 'Ú': 'U'
					  };
			for (var i = 0; i < term.length; i++) {
			  ret += accentMap[term.charAt(i)] || term.charAt(i);
			}
			return ret;
		  };
		var source = function source(request, response) {
			var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), 'i');
			response($.grep(list, function (value) {
				return matcher.test(value.label) || matcher.test(value.country) || matcher.test(normalize(value.label)) || matcher.test(normalize(value.country));
			}));
		};
		input.autocomplete('option', 'source', source);
	};

	//Función para mover elementos dentro de un array
	//Función que cambia la posición del array
	var insertAndShift = function (arr, from, to) {
		var cutOut = arr.splice(from, 1) [0]; // cut the element at index 'from'
		arr.splice(to, 0, cutOut);            // insert it at index 'to'
	}

	const sanitizeText = (text) => {
		const div = document.createElement('div');
		div.appendChild(document.createTextNode(text));
		return div.innerHTML;
	};

	//Jquery ui autocomplete
	//dFrontJs.init(selector,json) --> selector = input ; json = json ciudades correspondiente al input
	//crear una funcion accesible para llevar el json a la creación del HTML de ciudades ( choose-city )
	// en la construccion del HTML que solo se genere las ciudades del tab activo (siempre la primera tab).
	var init = function (selector, json) {
		var $tools_questions = $('[data-autocomplete="tools_questions"]');
		var equalIata = undefined;
		var valorInput;
		var $parent;
		var $tools_search_cities = $('[data-autocomplete="cities"]');
		var airports = $('[data-autocomplete="airports"]');
		var $selector = selector !== undefined ? $(selector) : $tools_search_cities;
		var data_autocomplete, _changeValidationCities, _focusoutValidationCities,_ValidationCities;
		json = json !== undefined ? json : '';

		if ($tools_questions.length > 0) {
			data_autocomplete = $tools_questions.data('autocomplete-result');
			$parent = $tools_questions.parent();

			$tools_questions.autocomplete({
				source: data_autocomplete,
				minLength: 1,
				appendTo: $parent,
				delay: 0
			});
			$('.ui-helper-hidden-accessible').hide();
		}

		if ($selector.length > 0) {
			_ValidationCities = function (selector) {
				const inputs = selector ? selector : $selector;
				var jsonValid = json;
				if (inputs.val() !== "") {
					inputs.closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="exist"]').addClass('hidden');
					if (inputs.data('autocomplete') === 'airports') {
						dFrontJs.ibe_validations_searcher.checkCity(inputs.parents('.ibe_form'), inputs, jsonValid, 'airports');
					} else {
						dFrontJs.ibe_validations_searcher.checkCity(inputs.parents('.ibe_form'), inputs, jsonValid);
					}
				} else {
					inputs.closest('.ibe_form__group').removeClass('ibe_form__group--error').find('p[data-validate]').addClass('hidden');
				}
			}
			//Function to validate origin and destiny for JSON file
			_changeValidationCities = function (e) {
				var jsonValid = json;
				if ($(e.target).val() !== "") {
					$(e.target).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="exist"]').addClass('hidden');
					if ($(e.target).data('autocomplete') === 'airports') {
						dFrontJs.ibe_validations_searcher.checkCity($(e.target).parents('.ibe_form'), $(e.target), jsonValid, 'airports');
					} else {
						dFrontJs.ibe_validations_searcher.checkCity($(e.target).parents('.ibe_form'), $(e.target), jsonValid);
					}
				} else {
					$(e.target).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('p[data-validate]').addClass('hidden');
				}
			};

			//Valid Inputs to click buttons and other inputs autocomplete (focusout)
			_focusoutValidationCities = function (e) {
				var jsonValid = json;
				if ($(e.target).val() !== "") {
					$(e.target).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="exist"]').addClass('hidden');
					if ($(e.target).data('autocomplete') === 'airports') {
						dFrontJs.ibe_validations_searcher.checkCity($(e.target).parents('.ibe_form'), $(e.target), jsonValid, 'airports');
					} else {
						dFrontJs.ibe_validations_searcher.checkCity($(e.target).parents('.ibe_form'), $(e.target), jsonValid);
					}
				}else{
					$(e.target).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('p[data-validate]').addClass('hidden');
				}
			};

			$selector.each(function () {
				var accentMap = {
					'á': 'a', 'à': 'a', 'â': 'a', 'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
					'í': 'i', 'ï': 'i', 'î': 'i', 'ó': 'o', 'ô': 'o', 'ö': 'o', 'û': 'u', 'ù': 'u', 'ú': 'u',
					'Á': 'A', 'À': 'A', 'Â': 'A', 'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E',
					'Í': 'I', 'Ï': 'I', 'Î': 'I', 'Ó': 'O', 'Ô': 'O', 'Ö': 'O', 'Û': 'U', 'Ù': 'U', 'Ú': 'U'
				};
				var $this = $(this); //input
				var data_autocomplete = [];
				var dataAutocompleteInit = [];
				var normalize, i;
				$parent = $this.parent(); //div form group

				//Función para que se seleccione todo el valor del input
				$this.off('click', _inputClickSelect);
				$this.on('click', _inputClickSelect);

				if ($this.data('autocomplete') === 'airports') {
					data_autocomplete = cityAirportsConstructor(json);
				} else {
					data_autocomplete = cityListContructor(json);		//default list results
				}

				//Guardamos una copia del array que usaremos para formatearlo
				dataAutocompleteInit = data_autocomplete.slice();

				var autocomplete_focusout_value = "";
				var _focusOutHandler = function (selector) {
					if (selector.parent().find('.ui-state-focus:visible').length) {
						$selector.val(selector.parent().find('.ui-state-focus:visible .ui-menu-item-link').attr('title'));
					} else if (selector.parent().find('.ui-menu-item:visible').length) {
						selector.val(selector.parent().find('.ui-menu-item:visible .ui-menu-item-link').attr('title'));
					} else if(autocomplete_focusout_value != ""){
						selector.val(autocomplete_focusout_value);
					} else if(autocomplete_focusout_value == "") {
						selector.val(autocomplete_focusout_value);
					}
				}
				


				normalize = function (term) {
					var ret = '';
					for (i = 0; i < term.length; i++) {
						ret += accentMap[term.charAt(i)] || term.charAt(i);
					}
					return ret;
				};
				$this.off('focus', _focusAutocomplete);
				$this.autocomplete({
					autoFocus: true,
					delay: 0,
					// source: data_autocomplete,
					source: function (request, response) {
						var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), 'i');
						response($.grep(data_autocomplete, function (value) {
							// value =  value.label || value.value || value.country || value;
							return matcher.test(value.label) || matcher.test(value.country) || matcher.test(normalize(value.label)) || matcher.test(normalize(value.country));
						}));
					},
					minLength: $($this).data('char-activation') ? $($this).data('char-activation') : 3,
					appendTo: $($this).data('target') ? $($this).data('target') : $parent,
					create: function () {
						$(this).data('ui-autocomplete')._renderItem = function (ul, item) {
							if (item.isNotFound !== true) {
								return $('<li>')
									.append('<a class="ui-menu-item-link" href="#" title="' + item.label + '">'
										+ '<p class="ui-menu-item-link__city">' + item.label + '</p><span class="ui-menu-item-link__country">' + (item.dist ? item.dist.toFixed(0) + " km, " : '')+ item.country + '</span></a>')
									.appendTo(ul);
							} else {
								return $('<li>')
								.append('<p class="ui-menu-item-notFound">' + sanitizeText(item.label) + '</p>')
									.appendTo(ul);
							}
						};
						$(this).parent().find('ul.ui-autocomplete').after('<i class="arrow-list"></i>');

					},
					open: function (e, ui) {
						var acData = $(this).data('ui-autocomplete'),
							menu = $(this).data('ui-autocomplete').menu.element,
							$group = $(this).parent(),
							positioned_layer = $($this).data('positioned') !== null ? '.' + $($this).data('positioned') : null;
						var me, keywords;
						if (positioned_layer !== null) {
							$(positioned_layer).hide();
						}
						$(menu).attr('aria-hidden', false);
						acData.menu.element.find('.ui-menu-item').first().addClass('ui-state-focus');
						acData.menu.element.find('.ui-menu-item-link').each(function () {
							var me = $(this),
								city = me.find('.ui-menu-item-link__city'),
								country = me.find('.ui-menu-item-link__country'),
								i = city.text().toLowerCase().indexOf(acData.term.toLowerCase()),
								c = country.text().toLowerCase().indexOf(acData.term.toLowerCase());
							if (i >= 0) {
								keywords = acData.term.replace(/[\s\(\)]/g, '|');
								city.html(city.text().replace(new RegExp('(' + keywords + ')', 'gi'), '<strong class="bold">$1</strong>'));
							}
							if (c >= 0) {
								keywords = acData.term.replace(/[\s\(\)]/g, '|');
								country.html(country.text().replace(new RegExp('(' + keywords + ')', 'gi'), '<strong class="bold">$1</strong>'));
							}
						});

						// Cerrar desplegable de ciudades al aparecer el autocomplete

						if ($('[data-city-list="collapse"]').is(':visible')) {
							$('[data-city-list="collapse"]').collapse('hide');
						}
						_hoverAutocomplete($group);
					},
					close: function (e, ui) {
						var menu = $(this).data('ui-autocomplete').menu.element,
							positioned_layer = $($this).data('positioned') !== null ? '.' + $($this).data('positioned') : null;

						if (positioned_layer !== null) {
							$(positioned_layer).show();
							$this.trigger('change');
						};
						var searchValue = sanitizeText($(this).val());
						var match = $(this).parent().find('a[title="' + searchValue + '"]');
						if (searchValue.length > 2) {
							if ($(match).length > 0) {
								autocomplete_focusout_value = searchValue;
							}else{
								var firstValue = menu.children(".ui-menu-item:first-child").children("a.ui-menu-item-link").attr("title");
								autocomplete_focusout_value = firstValue ? firstValue : "";
							}
							$(menu).attr('aria-hidden', true);
							data_autocomplete = dataAutocompleteInit.slice();
							_focusOutHandler($(this));
							_ValidationCities($(this));
						} 
					},
					search: function (e, ui) {
						valorInput = $(this).val();
					},
					response: function (e, ui) {
						var acData = $(this).data('ui-autocomplete'),
							array = ui.content,
							sum = 0,
							sumI,
							tooltipNoResults = $(this).data('autocomplete-no-results');
						if(ui.content.length > 0){
							$.each(ui.content, function (i) {
								var $this = $(this), //elemento del array ciudades
									label = $this[0].label.replace(/[^\w ]/g, function (char) {
										return accentMap[char] || char;
									}).toLowerCase(),
									valorL = valorInput.length;
								var country = $this[0].country.replace(/[^\w ]/g, function (char) {
									return accentMap[char] || char;
								}).toLowerCase();
								var iata, areEqual, letter, areLetter;

								if (label !== undefined) {
									iata = $this[0].iata;
									areEqual = (valorInput.toLowerCase() === iata.toLocaleLowerCase());
									letter = label.substring(0, valorL);
									areLetter = (valorInput.toLowerCase() === letter.toLocaleLowerCase());
								}

								//Not IATA
								if (areLetter && !areEqual) {
									//Encuentro los elementos que me coinciden y los meto en un array aux
									insertAndShift(array, i, sum);
									sum++;
								}
							});
							equalIata = undefined;
							sumI = 0;
							$.each(ui.content, function (i) {
								//Coloco el iata en primera posición del array
								var $this = $(this), //elemento del array ciudades
									label = $this[0].label,
									country = $this[0].country,
									iata,
									areEqual;

								if (label !== undefined) {
									iata = $this[0].iata;
									areEqual = (valorInput.toLowerCase() === iata.toLocaleLowerCase());
								}
								if (areEqual || equalIata !== undefined) {
									insertAndShift(ui.content, i, sumI);
									sumI++;
								}

							});
						} else if(typeof(tooltipNoResults === 'string') && tooltipNoResults.length > 0){
							tooltipNoResults= tooltipNoResults.replace('{{inputValue}}', $(this).val());
							var noResult = { value:valorInput,label: tooltipNoResults, isNotFound: true };
            	ui.content.push(noResult);
						}
					}
					// Cerrar desplegable de ciudades al coger el foco del input
				}).on('focus', _focusAutocomplete
				).autocomplete('instance')._move = function (direction, event) {
					if (!this.menu.element.is(':visible')) {
						this.search(null, event);
						return;
					}
					if (this.menu.isFirstItem() && /^previous/.test(direction) ||
						this.menu.isLastItem() && /^next/.test(direction)) {
						if (!this.isMultiLine) {
							this._value(this.term);
						}
						this.menu[direction](event);
						// this.menu.blur();
						return;
					}
					this.menu[direction](event);
				};


				// CALL VALIDATION CITIES WITH JSON

				/*if ($this.attr('name').indexOf('_origin') > -1 || $this.attr('name').indexOf('_destiny') > -1) {
					//Function to Valitate origin and destiny with JSON param
					$this.off('change', _changeValidationCities);
					$this.on('change', _changeValidationCities);

					$this.off('focusout', _focusoutValidationCities);
					$this.on('focusout', _focusoutValidationCities);
				}*/
				_ValidationCities();
				
			});
		}
		$('.ui-helper-hidden-accessible').hide();

	};//pluginAutocomplete

	return {
		'init': init,
		'loadCityList': _loadCityList,
		'cityListContructor': cityListContructor,
		'updateSourceList' : updateSourceList,
	};
}(jQuery);
