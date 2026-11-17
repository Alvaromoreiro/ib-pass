dFrontJs.ibe_searcher_choose_city = function () {
	/*eslint no-underscore-dangle: ['error', { 'allow': ['_loadSelectedCity', '_cityClick', '_letterClick', '_createIosList', '_buttonInit','_constructor'] }]*/
	var arrayToResize = [];

	var _loadSelectedCity = function ($input) {
		var value = $input.val(),
			cities = $input.parent().find('[data-filter-result]');

		cities.each(function () {
			var $this = $(this);
			if ($this.text() === value) {
				$this.addClass('city-selected');
			}
		})
	};

	var selectedCity = function ($selector) {
		var $cityList = $selector.find('[data-tab-cities="mobile"]'),
			$container = $cityList.parent(),
			$cityActive = $container.find('.city-selected'),
			$input = $selector.find('[data-autocomplete="cities"]');

		if ($cityActive.length > 0) {
			if ($input.val() === "") {
				$cityActive.removeClass('city-selected');
			} else {
				if ($cityList.find('.ioslist').length === 0) {
					if ($cityList.find('.ioslist-wrapper').offset() !== undefined) {
						setTimeout(function () {
							$cityList.find('.ioslist-wrapper').animate({
								scrollTop: ($cityList.find('.city-selected').offset().top - $cityList.find('.ioslist-wrapper').offset().top + $cityList.find('.ioslist-wrapper').scrollTop() - 12)
							}, 1000)
						}, 1000);
					}
					// Rest of ocassions
				} else {
					$cityList.find('.ioslist').animate({
						scrollTop: ($cityList.find('.city-selected').offset().top - $cityList.find('.ioslist').offset().top + $cityList.find('.ioslist').scrollTop() - 12)
					}, 600)
				}
			}
		}
	};

	var _cityClick = function () {
		var $this = $(this),
			text = $this.text(),
			$collapse = $this.parents('.ibe-choose-city'),
			$parent = $collapse.parents('.ibe_form__group'),
			$input = $parent.find('.ibe_form__input-text'),
			dataDestinationInfo = $this.attr('data-destination-info'),
			$modal = $('.ibe-dinamic-modal'),
			$vintage;
		$input.val(text);
		$input.trigger('click');
		$input.trigger('focusout');
		$collapse.collapse('hide');
		$input.attr('data-destination-info', dataDestinationInfo);

		if ($modal) {
			$this.parents('[data-city-list]').find('.city-selected').removeClass('city-selected');
			$this.addClass('city-selected');
			dFrontJs.ibe_dinamic_modal.close($this);
		}


		/////// To close the modal in case of vintage search//////////////////
		$vintage = $('.ibe-searcher__vintage');
		if ($vintage.length > 0) {
			$this.parents('[data-city-list]').find('.city-selected').removeClass('city-selected');
			$this.addClass('city-selected');
			dFrontJs.ibe_modals_vintage.closeModalsVintage();
		}
		//////////////////// End close the modal /////////////////////////////////////
	};

	var _letterClick = function () {
		var $this = $(this),
			$parent = $this.parents('.ibe-filter-letter__header'),
			data = $this.data('filter-letter'),
			active = 'ibe-filter-letter__menu-item--active';

		//Menu active
		$parent.find('.' + active).removeClass(active);
		$this.parent().addClass(active);
		//Condicion 'todos' o por letra 'A'
		if (data === 'all') {
			$parent.parent().find('.ui-tabs-panel:visible [data-filter-result]').parent().show();
		} else {
			$parent.parent().find('.ui-tabs-panel:visible [data-filter-result]').parent().hide();
			$parent.parent().find('.ui-tabs-panel:visible [data-filter-result="' + data + '"]').parent().show();
		}
		//Cambiar el focus a las ciudades al seleccionar una letra
		const resultCity = $('.ibe-filter-letter__result-item:visible a.link__regular').first();
		if(resultCity){
			resultCity.attr('tabindex','0');
			resultCity.focus();
		} 
	};

	var _createIosList = function (currentTab) {
		requestAnimFrame(function () {            //Request for first load tabs
			var $currentTab = $(currentTab);
			if ($currentTab.find('[data-function="city-list"]').length > 0 && $currentTab.find('.ioslist').html().length > 0 && !$currentTab.hasClass('started')) {
				$currentTab.addClass('started');
				$currentTab.find('[data-function="city-list"]').ioslist();
			}
		})
	};


	var countryListConstructor = function (selector, json) {
		// 1. localización del menú y contenedor en el DOM
		var $root = $(selector);
		var countryListMenu = $root.find('.ibe-tab__menu');
		if (!countryListMenu.length) {
			countryListMenu = $root.parent().find('.ibe-tab__menu');
		}
		if (!countryListMenu.length) {
			countryListMenu = $('.fc-dialog-all-destinations .ibe-tab__menu');
		}
	
		var countryListContent = $root.find('.ibe-tab__container');
		if (!countryListContent.length) {
			countryListContent = $root.parent().find('.ibe-tab__container');
		}
		if (!countryListContent.length) {
			countryListContent = $('.fc-dialog-all-destinations .ibe-tab__container');
		}
	
		// 2. idSelector
		var idSelector = $('[data-modal-view=".fc-dialog-all-destinations"]').attr('id') 
			|| $(selector).parents('.ibe_form__group').find('.ibe_form__input-text').attr('id') 
			|| 'dialog-destinations';
	
		var docFragment = document.createDocumentFragment(),
			docFragmentContent = document.createDocumentFragment(),
			classNAMEdiv1 = 'ibe-filter-letter',
			classNAMEdiv2 = 'ibe-filter-letter__container',
			classNAMEioslist = 'ioslist',
			classNAMEul = 'ibe-filter-letter__result',
			classNAMEli = 'ibe-tab__menu-item',
			classNAMEa = 'link link__regular';
	
		if (countryListMenu.parents('.ibe-choose-city').find('.ibe-tab').hasClass('ui-tabs')) {
			countryListMenu.parents('.ibe-choose-city').find('.ibe-tab').tabs('destroy');
			countryListMenu.empty();
			countryListContent.find('[data-tab-cities]').remove();
		}
	
		// Comprobar si pertenece al diálogo de todos los destinos
		var isDialogAllDestinations = $root.closest('.fc-dialog-all-destinations').length > 0 
			|| $root.hasClass('fc-dialog-all-destinations')
			|| $('.fc-dialog-all-destinations').length > 0;
	
		// Solo usar layout mobile con ioslist si NO es el modal de destinos
		var useIosList = (window.innerWidth < dFrontJs.resolutions.lg) && !isDialogAllDestinations;
	
		// 3. Generar elementos
		$.each(json, function (index) {
			var $this = this,
				country = $this.description,
				div1 = document.createElement('div'),
				div2 = document.createElement('div'),
				div3 = document.createElement('div'),
				ul = document.createElement('ul'),
				li = document.createElement('li'),
				a = document.createElement('a');
	
			// Limpiar (<span>)
			var tempSpan = document.createElement('div');
			tempSpan.innerHTML = country;
			var cleanCountry = tempSpan.textContent || tempSpan.innerText || country;
	
			li.classList.add(classNAMEli);
			a.classList.addMany(classNAMEa);
	
			var tabId = 'tab-cities-' + index + '-' + idSelector;
			if (useIosList) {
				tabId = 'tab-cities-mobile-' + index + '-' + idSelector;
				a.setAttribute('href', '#' + tabId);
				div1.setAttribute('data-tab-cities', 'mobile');
				div1.setAttribute('id', tabId);
				div2.setAttribute('data-function', 'city-list');
				div2.classList.add(classNAMEioslist);
				div1.appendChild(div2);
			} else {
				a.setAttribute('href', '#' + tabId);
				div1.setAttribute('data-tab-cities', 'desktop');
				div1.setAttribute('id', tabId);
				ul.classList.add(classNAMEul);
				div2.classList.add(classNAMEdiv1);
				div3.classList.add(classNAMEdiv2);
				div3.appendChild(ul);
				div2.appendChild(div3);
				div1.appendChild(div2);
			}
	
			a.setAttribute('title', cleanCountry);
			a.textContent = cleanCountry;
			li.appendChild(a);
			docFragment.appendChild(li);
			docFragmentContent.appendChild(div1);
		});
	
		countryListMenu.append(docFragment);
		countryListContent.append(docFragmentContent);
	};

	var cityListConstructor = function (selector, tab, json) {
		var _selector = selector.get(0);
		var $parent = _selector.parentElement;
		var $activeTab, listActive, positionActiveTab, currentTab, ulList, docFragment, letter, letterAux, ul, div, div2, html, classNAMEli, classNAMEa, classNAMEdiv, classNAMEdiv2, city;
		var dialog = document.querySelector('.fc-dialog-all-destinations');
		
		// Si estamos dentro del diálogo o existe el diálogo de destinos, NO es mobile/ioslist
		var isDialogAllDestinations = $(_selector).closest('.fc-dialog-all-destinations').length > 0 
			|| $(_selector).hasClass('fc-dialog-all-destinations')
			|| (dialog !== null);
	
		var isMobile = (window.innerWidth < dFrontJs.resolutions.lg) && !isDialogAllDestinations;
	
		// 1. Localizar pestaña activa
		if (tab === -1) {
		  $activeTab = isDialogAllDestinations ? _selector.querySelector('.ui-tabs-active') : $parent.querySelector('.ui-tabs-active');
		} else {
		  $activeTab = isDialogAllDestinations 
			? _selector.querySelector('.ui-tabs-active') 
			: (typeof mobile !== 'undefined' && mobile) 
			  ? $parent.querySelector('.hidden-lg.hidden-xl')?.querySelector('.ui-tabs-active') 
			  : $parent.querySelector('.hidden-xs.hidden-sm.hidden-md')?.querySelector('.ui-tabs-active');
		}
	
		// Fallback si la pestaña activa aún no tiene la clase aplicada
		if (!$activeTab) {
		  var $menu = _selector.querySelector('.ibe-tab__menu') || (dialog ? dialog.querySelector('.ibe-tab__menu') : null);
		  if ($menu && $menu.children.length > 0) {
			var tabIndex = (typeof tab === 'number' && tab >= 0) ? tab : 0;
			$activeTab = $menu.children[tabIndex] || $menu.children[0];
			$activeTab.classList.add('ui-tabs-active', 'ui-state-active');
		  }
		}
	
		if (!$activeTab) return;
	
		// 2. Extraer ID del panel destino (listActive)
		listActive = $activeTab.getAttribute('aria-controls');
		if (!listActive) {
		  var $link = $activeTab.querySelector('a');
		  if ($link && $link.getAttribute('href')) {
			listActive = $link.getAttribute('href').replace('#', '');
		  }
		}
	
		positionActiveTab = [].slice.call($activeTab.parentNode.children).indexOf($activeTab);
		if (positionActiveTab < 0) positionActiveTab = 0;
	
		if (!json || !json[positionActiveTab] || !json[positionActiveTab].cities) return;
	
		docFragment = document.createDocumentFragment();
		letter = $('[data-filter-letter]');
		letterAux = '';
		ul = null;
		div = document.createElement('div');
		div.dataset.nosnippet = '';
		div2 = document.createElement('div');
		div2.dataset.nosnippet = '';
		html = '';
		classNAMEli = 'ibe-filter-letter__result-item';
		classNAMEa = 'link link__regular';
		classNAMEdiv = 'ioslist-group-container';
		classNAMEdiv2 = 'ioslist-group-header';
	
		// 3. Generar la lista de ciudades
		json[positionActiveTab].cities.forEach(function (current) {
		  var $this = current,
			country = $this.country.description,
			city = $this.description,
			iata = $this.code,
			letterVal = city.charAt(0),
			url = $this.url || "#ni",
			dataDestinationInfo = $this.country.locationId !== undefined ? $this.country.code + '|' + $this.code + '|' + $this.country.locationId : $this.country.code + '|' + $this.code + '|' + $this.description,
			li = document.createElement('li'),
			a = document.createElement('a');
	
		  var tmp = document.createElement('div');
		  tmp.innerHTML = country;
		  var cleanCountry = tmp.textContent || tmp.innerText || country;
	
		  // MOBILE SOLO PARA BUSCADOR PREDICTIVO (ioslist con grupos de letras)
		  if (isMobile) {
			if (letterAux !== letterVal) {
			  letterAux = letterVal;
			  div = document.createElement('div');
			  div.dataset.nosnippet = '';
			  div2 = document.createElement('div');
			  div2.dataset.nosnippet = '';
			  ul = document.createElement('ul');
			  div2.textContent = letterAux;
			  div.appendChild(div2);
			}
			div.classList.add(classNAMEdiv);
			div2.classList.add(classNAMEdiv2);
			a.classList.addMany(classNAMEa);
			a.setAttribute('href', url);
			a.setAttribute('title', city + ' (' + iata + ')');
			a.setAttribute('data-filter-result', letterVal);
			a.setAttribute('data-country', cleanCountry);
			a.setAttribute('data-destination-info', dataDestinationInfo);
			a.textContent = city + ' (' + iata + ')';
			li.appendChild(a);
			ul.appendChild(li);
			div.appendChild(ul);
			docFragment.appendChild(div);
		  } else {
			// DIÁLOGO / DESKTOP (Lista directa limpia de destinos sin letras de cabecera)
			li.classList.add(classNAMEli);
			a.classList.addMany(classNAMEa);
			a.setAttribute('href', url);
			a.setAttribute('title', city + ' (' + iata + ')');
			a.setAttribute('data-filter-result', letterVal);
			a.setAttribute('data-country', cleanCountry);
			a.setAttribute('data-destination-info', dataDestinationInfo);
			a.textContent = city + ' (' + iata + ')';
			li.appendChild(a);
			docFragment.appendChild(li);
		  }
		});
	
		// 4. Inserción en el DOM
		if (isMobile) {
		  var mobileContainer = $parent.querySelector('.hidden-lg.hidden-xl') || $parent;
		  ulList = mobileContainer.querySelectorAll('[data-tab-cities="mobile"]');
		  ulList.forEach(function (node) {
			var item = node.parentElement;
			if (!item) return;
			var targetBox = item.querySelector('#' + listActive);
			if (targetBox) {
			  var iosList = targetBox.querySelector('.ioslist');
			  if (iosList) iosList.append(docFragment);
			}
		  });
		} else {
		  ulList = $parent.querySelectorAll('[data-cities-list]');
		  ulList.forEach(function (node) {
			var targetBox = node.querySelector('#' + listActive);
			if (targetBox) {
			  var resultUl = targetBox.querySelector('.ibe-filter-letter__result');
			  if (resultUl) resultUl.append(docFragment);
			}
		  });
		}
	
		if (!$activeTab.classList.contains('loaded_cities')) {
		  $activeTab.classList.add('loaded_cities');
		}
	
		letter.off('click', _letterClick);
		letter.on('click', _letterClick);
		city = $('[data-filter-result]');
		city.off('click', _cityClick);
		city.on('click', _cityClick);
	
		if (isMobile) {
		  currentTab = $activeTab.closest('.ibe-choose-city--mobile') || $activeTab.closest('.ibe-choose-city');
		  if (currentTab && $activeTab.getAttribute('aria-labelledby')) {
			var panel = currentTab.querySelector('.ui-tabs-panel[aria-labelledby="' + $activeTab.getAttribute('aria-labelledby') + '"]');
			if (panel) _createIosList(panel);
		  }
		} else {
		  requestAnimFrame(function () {
			var item = document.querySelector('.ibe-filter-letter__menu-item--active');
			if (item) {
			  item.classList.remove('ibe-filter-letter__menu-item--active');
			}
			var all = document.querySelector('[data-filter-letter="all"]');
			if (all && all.parentElement) {
			  all.parentElement.classList.add('ibe-filter-letter__menu-item--active');
			}
		  });
		}
	};

	var _buttonInit = function (selector, json) {
		var $input = $('[data-autocomplete="cities"]');
		var $selector = selector !== undefined ? $(selector) : $input;
	
		json = json !== undefined ? json : '';
	
		$selector.each(function () {
			var $button = (typeof mobile !== 'undefined' && mobile) 
				? $(this).parent().find('.hidden-lg.hidden-xl button:not([data-dinamic-close])') 
				: $(this).parent().find('.hidden-xs.hidden-sm.hidden-md button:not([data-dinamic-close])');
			
			if ($(this).data('modal-view') === '.fc-dialog-all-destinations') {
				$button = $(this);
			}
			var selector;
			if ($(this).data('modal-view') === '.fc-dialog-all-destinations') {
				selector = $('.fc-dialog-all-destinations').find('.modal-body');
			} else if ($('#id-tab-collapse-1').length > 0) {
				selector = $('#id-tab-collapse-1');
			} else {
				selector = $(this);
			}
	
			var tab = $(selector).find('[data-tab="jquery-ui"]');
			if (!tab.length) {
				tab = $(selector).parent().find('[data-tab="jquery-ui"]');
			}
	
			var $parent, $activeTab, positionActiveTab;
			
			// 1. Construir las pestañas de países
			countryListConstructor(selector, json);
	
			// 2. Inicializar los tabs
			dFrontJs.ibe_tab.iniTabsjquery(tab, json);
	
			// 3. Localizar la pestaña activa inicial
			$parent = $(selector).hasClass('ibe-choose-city') ? $(selector) : $(selector).parent();
			$activeTab = (typeof mobile !== 'undefined' && mobile) 
				? $parent.find('.hidden-lg.hidden-xl .ui-tabs-active') 
				: $parent.find('.hidden-xs.hidden-sm.hidden-md .ui-tabs-active');
	
			if (!$activeTab.length) {
				$activeTab = $(selector).find('.ui-tabs-active');
			}
			if (!$activeTab.length) {
				$activeTab = $('.fc-dialog-all-destinations').find('.ui-tabs-active');
			}
	
			positionActiveTab = $activeTab.length ? $activeTab.index() : 0;
			if (positionActiveTab < 0) positionActiveTab = 0;
	
			// 4. Poblar las ciudades de España de entrada
			cityListConstructor(selector, positionActiveTab, json);
		});
	};

	var init = function (selector, json) {
		var $selector = selector !== undefined ? $(selector) : '';

		json = json !== undefined ? json : '';

		_buttonInit($selector, json);

		arrayToResize.push({$selector: $selector, json: json});

		$("#SearcherContent .ibe-tab__menu-item").removeAttr("tabindex");
		$("#SearcherContent .ibe-tab__menu-item .link__regular.tab.search-tab:not([data-active=0])").attr("tabindex", 0);

		$(window).on('resize', function () {
			clearTimeout($.data(this, 'resizeCity'));
			$.data(this, 'resizeCity', setTimeout(function () {
				var i;
				if (dFrontJs.app.changeView()) {
					for (i = 0; arrayToResize.length > i; i++) {
						if (!arrayToResize[i].$selector.hasClass('initSearcherChooseCityResize')) {
							arrayToResize[i].$selector.addClass('initSearcherChooseCityResize');
							_buttonInit(arrayToResize[i].$selector, arrayToResize[i].json);
						}
					}
				}
			}, 100));
		});
	};

	//init
	return {
		'init': init,
		'selectedCity': selectedCity,
		'cityListConstructor': cityListConstructor,
		'arrayToResize': arrayToResize
	};
}(jQuery);
