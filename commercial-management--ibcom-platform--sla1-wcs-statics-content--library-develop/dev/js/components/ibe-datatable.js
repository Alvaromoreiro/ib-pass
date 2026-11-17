dFrontJs.ibe_datatable = function () {
	/*eslint no-underscore-dangle: ['error', { 'allow': ['_clickCity', '_selectCity'] }]*/
	/**
	 * Map that relates the object the tab of the seeeker that should be updated 
	 * with the cities that will aplly for the tab
	 */
	var citiesAndTabsMap = {};
	//dFrontJs.ibe_datatable.loadJson(jsonOrigin,jsonDestiny);
	var loadJson = function (jsonOrigin, jsonDestiny,tabSelector) {
		var $click = $('[data-table-click]'),
			$change = $('[data-selectmenu-city]');
		var cities = {jsonOrigin: jsonOrigin, jsonDestiny: jsonDestiny};
		if (typeof(tabSelector) === 'string'){
		citiesAndTabsMap[tabSelector] = cities;
			if ($click.length > 0) {
				$click.off('click', _clickCity);
				$click.on('click', _clickCity);
				$change.off('change', _selectCity);
				$change.on('change', _selectCity);
			}
		}
	};

	/**
	 * @name _updateCityInput
	 * @description update destination or departure input of a given seeker tab
	 * @param {string} type type of input to be updates (destiny/origin)
	 * @param {string} value value that it's wanted the input to take
	 * @param {string} tabParent selector string of seeker tab which contains the input to update
	 */
	var _updateCityInput =  function(type, value,tabParent) {
		var i, item, $this, text, iata, $des, $ori, maininput,json, countryCode;
		var cities;
		if (typeof tabParent === 'string') {
			cities =  citiesAndTabsMap[tabParent];
			if (cities) {
				$ori = $('.ibe-searcher__col--ori input',tabParent);
				$des =  $('.ibe-searcher__col--des input',tabParent);
				if (type === 'destiny') {
					json = cities.jsonDestiny;
					dFrontJs.ibe_searcher_choose_city.init($des, json);
				} else {
					json = cities.jsonOrigin;
					dFrontJs.ibe_searcher_choose_city.init($ori, json);
				}
				i = 0;
				item = undefined;
				while ((i < json.length) && item === undefined) {
					item = json[i].cities.find(function (item) {
						return item.code === value;
					});
					i++;
				}
				if (item !== undefined) {
					$this = item; //enlace
					text = $this.description; //ciudad
					iata = $this.code;
					countryCode = $this.country.code; //code pais

				} else {
					text = ''; //ciudad
					iata = '';
					countryCode = '';

				} 
				if (iata === value || iata.length === 0 ) {
					if (type === 'destiny') {
						if (iata.length !== 0 ){
							$des.val(text + ' (' + iata + ')');
							$des.closest('.ibe_form__group').addClass('ibe_form__group--content');
						} else {
							$des.val('');
							$des.closest('.ibe_form__group').removeClass('ibe_form__group--content');
						}
						maininput=$des
					} else {
						if (iata.length !== 0 ){
							$ori.val(text + ' (' + iata + ')');
							$ori.closest('.ibe_form__group').addClass('ibe_form__group--content');
						} else {
							$ori.val('');
							$ori.closest('.ibe_form__group').removeClass('ibe_form__group--content');
						}
						
						maininput=$ori;
					}

					dFrontJs.ibe_validate.compareCity(maininput,$ori,$des);

					// dataDestination =  countryCode+'|'+iata+'|'+text;
					//ES|BIO|Bilbao
				}
			}
		}
	};
	/**
	 * @description Logic that handles the event click on a city card of mosaic or table
	 * @param {*} e JQuery event 
	 */
	var _clickCity = function (e) {
		var $attrIata = $(this).data('city');
		var $tableOriginDestiny = $(this).parents('[data-type-trip]').data('table-destination');
		// Tipo de ciudad del selector del mosaico
		var selectorType = ($tableOriginDestiny=== 'destiny')?'origin':'destiny';
		// Solo se obtiene resultados si el selector si la ciudad está en el selector o en la tabla
		// ofdt city attr it's used on the selector to filter the displayed results
		var selectorValue = $(this).closest('[data-ofdtcity]').data('ofdtcity')
		e.preventDefault();
		Object.keys(citiesAndTabsMap).forEach(function (tab){
			var vintageHeader = $(tab).prev('.ibe-accordion__header:visible'); //Takes value only if this tab it's selected on vintage view (responsive)
			if ($(tab).is(":visible") || vintageHeader.length > 0){
				requestAnimFrame(function(){
					vintageHeader.click();
					$('html, body').animate({
						scrollTop: 0
					}, 600, function(){
						$(tab+':visible [data-cal="start"]').focus();
					});
				});
			}
			_updateCityInput($tableOriginDestiny,$attrIata,tab);
			// Borrar si no se quiere actualizar la ciudad en base al valor del selector del mosaico
			if(selectorValue){
				_updateCityInput(selectorType,selectorValue,tab);
			}
			
		});

	};
	/**
	 * @description Logic that handles the event change 
	 * @param {*} e JQuery event 
	 */
	var _selectCity = function (e) {
		var $attrIata = $(this).find(':selected').data('city-select');
		var $selectOriginDestiny = $(this).data('selectmenu-city');
		var type = $selectOriginDestiny==='des'?'destiny':'origin';
		e.preventDefault();
		Object.keys(citiesAndTabsMap).forEach(function (tab){
			_updateCityInput(type,$attrIata,tab);
			
		});
	};


	var init = function () {
		var $element = $('[data-datatable]'),
			$order = $('[data-table-order]'),
			$customOrder = $('[data-table-flight-status-order]'),
			$click = $('[data-table-click]'),
			$change = $('[data-selectmenu-city]'),
			$ascending = $('[data-text-ascending]'),
			$descending = $('[data-text-descending]'),
			data, numbers_length, this$, ascendingText, descendingText;
		if ($element.length > 0) {
			data = $element.data('datatable');
			numbers_length = (data.numbers_length) ? data.numbers_length : 6;
			$.fn.DataTable.ext.pager.numbers_length = numbers_length;
			$element.DataTable({
				'searching': false,
				'ordering': false,
				'info': false,
				'bLengthChange': false,
				'iDisplayLength': 6,
				'pageLength': 6,
				'oLanguage': {
					'oPaginate': {
						'sNext': '<span class="hideAccessible">Siguiente</span>',
						'sPrevious': '<span class="hideAccessible">Anterior</span>'
					}
				}
			});
		} else if ($customOrder.length > 0) {
			$customOrder.each(function () {
				this$ = $(this);
				ascendingText = this$.data('text-ascending');
				descendingText = this$.data('text-descending');

				if (!this$.hasClass('dataTable')) {
					this$.DataTable({
						'searching': false,
						'paging': false,
						'info': false,
						'order': [[3, 'asc']],
						'language': {
							'aria': {
								'sortAscending': ascendingText,
								'sortDescending': descendingText
							}
						},

					});
				}
			});
		} else if ($order.length > 0) {
			ascendingText = $ascending.data('text-ascending');
			descendingText = $descending.data('text-descending');
			$order.DataTable({
				'searching': false,
				'paging': false,
				'info': false,
				'order': [[1, 'asc']],
				'language': {
					'aria': {
						'sortAscending': ascendingText,
						'sortDescending': descendingText
					}
				}
			});

		}

		if ($click.length > 0 && Object.keys(citiesAndTabsMap).length > 0) {
			$click.off('click', _clickCity);
			$click.on('click', _clickCity);
			$change.off('change', _selectCity);
			$change.on('change', _selectCity);
		}
	};

	return {
		'init': init,
		'loadJson': loadJson
	};
}(jQuery);
