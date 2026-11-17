//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: People counter
//    Descripcion: Funcion para seleccionar pasajeros en buscador de hotel
//******************************************************************************/
/*eslint no-underscore-dangle: ["error", { "allow": ["__constructor", "_print"] }]*/
dFrontJs.ibe_searcher_people_counter = function () {
	//Variables
	var $obj = 0,
		$input = 0,
		$list = 0,
		$parent = 0,
		$important = 0,
		$babies = 0,
		$counter = 0,
		$babiesCount = 0,
		$peopleAdult,
		$peopleChildren,
		$peopleBabies,
		$peopleSenior,
		$peopleYoung,
		$count,
		$peopleTeenager,
		$form,
		classPlus = 'ibe-people-counter__counter--plus',
		classNone = 'ibe-people-counter__counter--none',
		$agesList = ['02', '02', '02', '02', '02', '02', '02', '02'],
		countNumber,
		nine;
	//Constructor
	/**@name constructor 
	 * @description Initialize selectors for a people counter compontent
	 * @param $this Selector of the html for people counter component
	 */
	var __constructor = function ($this) {
		$obj = $this;
		$form = $this.parents('.ibe_form__group');
		$input = $form.find('.ibe_form__input-text');
		$list = $this.parents('.ibe-people-counter__list');
		$parent = $this.parents('.ibe-people-counter__list-item');
		$count = $parent.find('[data-people-counter="counter"]');
		$important = $list.find('.fc-people-counter-important');
		$babies = $list.find('.fc-people-counter-babies');
		$babiesCount = $list.find('.fc-people-counter-babies').find('[data-people-counter="counter"]');
		$peopleSenior = ('[data-people-type="senior"]');
		$peopleAdult = ('[data-people-type="adult"]');
		$peopleChildren = ('[data-people-type="children"]');
		$peopleBabies = ('[data-people-type="babies"]');
		$peopleYoung = ('[data-people-type="young"]');
		$peopleTeenager = ('[data-people-type="teenager"]');

	};


	//Restamos o sumamos al contador actual
	/**@name lessOrPlus
	 * @param
	 * @description Add or subtract in one the number of pasengers
	 */
	var lessOrPlus = function () {
		var c = parseInt($count.text());
		($obj.data('people-counter-button') == 'less') ? c-- : c++;
		return c;
	};
	//Devuelve el numero maximo de personas
	/**@name getNumberOrPeople
	 * @param
	 * @description Returns the number of people
	 * @return An integer with the number of people that are not babies
	 */
	var getNumberOrPeople = function () {
		var n = 0;
		$.each($list.find('.ibe-people-counter__list-item').not($parent).not($babies), function () {
			n = n + parseInt($(this).find('[data-people-counter="counter"]').html());
		});
		n = n + countNumber;
		return n;
	};
	//Recorre el objeto que se le pasa por parametro y suma sus contadores
	/**@name getSumCountersObj
	 * @param $o A selector that it's wanted to sum the total number of passengers
	 * @description Returns the number of people
	 * @return An integer with the number of people
	 */
	var getSumCountersObj = function ($o) {
		var i = 0;
		$.each($o, function () {
			i = i + parseInt($(this).find('[data-people-counter="counter"]').text());
		});
		return i;
	};
	//Actualiza y guarda las edades seleccionadas al añadir o eliminar niños
	/**@name updateAgesList
	 * @param array
	 * @description Updates the ages of child's ages array
	 */
	var updateAgesList = function (array) {
		var i;
		setTimeout(function () {
			for (i = 0; i < array.length; i++) {
				$agesList[i] = array.eq(i).val();
			}
		}, 500);
	};
	//Guarda los valores de las edades cuando éstos cambian su valor
	/**@name udpdateValueChildren
	 * @param array
	 * @description Update variable that store the Children ages values
	 */
	var udpdateValueChildren = function () {
		$('.fc-people-counter-children select').on('change', function () {
			updateAgesList($('.fc-people-counter-children select'));
		});
	};
	//Validaciones visuales
	/**@name visualValidations 
	 * @description Enable or disable the buttons to add or substract children
	 * @param parentElem
	 * @param listElem
	 * @param imp
	*/
	var visualValidations = function (parentElem, listElem, imp) {
		var $parentIn = parentElem || $parent;
		var $listIn = listElem || $list;
		var sumChil, sumBabies, sumMin, total, $childrenTooltipAloneLimit, $childrenTooltipDefault, minorsAloneFlowEnabled, youngCountVis, adultCountVis, seniorCountVis;
		$important = imp || $important;
		$babiesCount = $listIn.find('.fc-people-counter-babies').find('[data-people-counter="counter"]');
		//El flujo de menores viajando solos (UMNR) solo aplica en la pestaña Vuelo (#tab-searcher-1
		//en desktop, #m-tab-searcher-1 en mobile: el buscador mueve el markup entre ambos wrappers
		//responsive, ver moveContentResponsive en ibe-searcher-accordion-mobile.js)
		//y si la property de WCS modal.unmrs.wcs.enabled lo tiene activado;
		//no debe afectar a otras pestañas del buscador como Vuelo+Coche (#tab-searcher-3)
		minorsAloneFlowEnabled = $listIn.closest('#tab-searcher-1, #m-tab-searcher-1').length > 0 && typeof unmrModalEnabled !== 'undefined' && unmrModalEnabled === "true";
		if ($($parentIn).parents('[data-validate-searcher]').length || $($parentIn).parents('[data-valid-form]').length) {
			if ($babiesCount.html() == getSumCountersObj($important)) {
				$listIn.find('.fc-people-counter-babies').addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').attr('disabled', 'disabled');
			}
      else {
				$listIn.find('.fc-people-counter-babies').removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').removeAttr('disabled');
      }
			// else if (!$('[data-checkBaby]:visible').is(':checked')) {
			// 	$listIn.find('.fc-people-counter-babies').removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').removeAttr('disabled');
			// }
			$listIn.find('[data-people-counter="counter"]').each(function () {
				if (parseInt($(this).html()) == 0) {
					$(this).parent().addClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').attr('disabled', 'disabled');
				} else if ($(this).data('people-type') == 'children' && $(this).html() >= 1) {
					$(this).parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').removeAttr('disabled');
				} else if ($(this).data('people-type') == 'teenager' && $(this).html() >= 1) {
					$(this).parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').removeAttr('disabled');
				} else if ($(this).data('people-type') == 'young' && $(this).html() >= 1) {
					$(this).parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').removeAttr('disabled');
				}else if ($(this).html() >= 1) {
					$(this).parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').removeAttr('disabled');
				}
			});

			switch (getSumCountersObj($important) + getSumCountersObj($listIn.find('.fc-people-counter-children'))) {
				case 1:
					$listIn.find('[data-people-counter="counter"]').each(function () {
						if (minorsAloneFlowEnabled && ($(this).data('people-type') == 'adult' || $(this).data('people-type') == 'senior')) {
							//Adultos y seniors pueden bajar a 0 (flujo UMNR), pero ya en 0 el "-" debe quedar deshabilitado
							if ($(this).html() > 0) {
								$(this).parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').removeAttr('disabled');
							} else if ($(this).html() == 0) {
								$(this).parent().addClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').attr('disabled', 'disabled');
							}
						} else if ($(this).html() == 1  &&  $(this).data('people-type') != 'teenager' &&  $(this).data('people-type') != 'young' &&  (!minorsAloneFlowEnabled || $(this).data('people-type') != 'children') ) {
							$(this).parent().addClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').attr('disabled', 'disabled');
						}
					});
					break;
				case 9:
					$important.addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').attr('disabled', 'disabled');
					$listIn.find('.fc-people-counter-children').addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').attr('disabled', 'disabled');
					break;
				default:
					if (getSumCountersObj($important) > 1) {//>=0 para que niños puedan viajar solos sino >1
						$important.find('[data-people-counter="counter"]').each(function () {
							if ($(this).html() > 0) {
								$(this).parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').removeAttr('disabled');
							}
						});
					} else {
						$important.find('[data-people-counter="counter"]').each(function () {
							if (minorsAloneFlowEnabled && ($(this).data('people-type') == 'adult' || $(this).data('people-type') == 'senior')) {
								//Adultos y seniors pueden bajar a 0 (flujo UMNR), pero ya en 0 el "-" debe quedar deshabilitado
								if ($(this).html() > 0) {
									$(this).parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').removeAttr('disabled');
								} else if($(this).html() == 0) {
									$(this).parent().addClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').attr('disabled', 'disabled');
								}
							} else if ($(this).html() > 0) {
								$(this).parent().addClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').attr('disabled', 'disabled');
							}
						});
					}
					$listIn.find('.fc-people-counter-children [data-people-counter="counter"]').each(function () {//toggle para que niños no puedan viajar solos
						if ($(this).html() > 0) {
							$(this).parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').removeAttr('disabled');
						} else if($(this).html() == 0) {
							$(this).parent().addClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').attr('disabled', 'disabled');
						}
					});
					$listIn.find('.fc-people-counter-children').removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').removeAttr('disabled');
					$important.each(function (i, element) {
						if (!$(element).find('.ibe-people-counter__message').hasClass('active')) {
							$(element).removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').removeAttr('disabled');
						}
					});
			}
			if (parseInt($babiesCount.html()) >= 1) {
				$babiesCount.parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').removeAttr('disabled');
			}
			sumChil = parseInt($listIn.find('.fc-people-counter-children [data-people-counter="counter"]').html());
			sumChil = !isNaN(sumChil) ? sumChil : 0;
			sumBabies = isNaN(parseInt($babiesCount.html())) ? 0 : parseInt($babiesCount.html());
			sumMin = sumChil + sumBabies;
			total = sumChil + getSumCountersObj($important);
			//Tooltip de niños: por defecto se ve el mensaje general (SEEK_006, tope de 9);
			//solo se muestra el de tope de niños solos (SEEK_021) cuando realmente viajan solos (0 adultos)
			$childrenTooltipAloneLimit = $listIn.find('.fc-people-counter-children .ibe-message-tooltip__content--children-alone-limit');
			$childrenTooltipDefault = $listIn.find('.fc-people-counter-children .ibe-message-tooltip__content').not($childrenTooltipAloneLimit);
			$childrenTooltipAloneLimit.addClass('hidden');
			$childrenTooltipDefault.removeClass('hidden');
			if (sumMin > 2 * getSumCountersObj($important) && getSumCountersObj($important) !== 0) {
				$listIn.find('.fc-people-counter-children').removeClass('ibe-people-counter__item-children-alone');
				$listIn.find('.fc-people-counter-children').addClass('ibe-people-counter__item-children');
			} else if (sumChil > 0 && getSumCountersObj($important) == 0) {
				//UMNR: 0 adultos, niños viajando solos, tope de 8 (en vez del disabled fijo anterior)
				//No mostramos el mensaje legado --children-alone: su copy (llamar/volver al formulario) ya no aplica con el flujo UMNR habilitado
				$listIn.find('.fc-people-counter-children').removeClass('ibe-people-counter__item-children');
				$listIn.find('.fc-people-counter-children').removeClass('ibe-people-counter__item-children-alone');
				if (sumChil >= 8) {
					//Tope de niños solos (SEEK_021): distinto del tope general de 9 pasajeros (SEEK_006)
					$childrenTooltipAloneLimit.removeClass('hidden');
					$childrenTooltipDefault.addClass('hidden');
					$listIn.find('.fc-people-counter-children').addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').attr('disabled', 'disabled');
				} else {
					$listIn.find('.fc-people-counter-children').removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').removeAttr('disabled');
				}
			} else if (total == 9) {
				$listIn.find('.fc-people-counter-children').addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').attr('disabled', 'disabled');
			} else {
				$important.each(function (i, element) {
					if (!$(element).find('.ibe-people-counter__message').hasClass('active')) {
						$(element).removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').removeAttr('disabled');
					}
				});

				$listIn.find('.fc-people-counter-children').removeClass('ibe-people-counter__item-children');
				$listIn.find('.fc-people-counter-children').removeClass('ibe-people-counter__item-children-alone');
				$listIn.find('.fc-people-counter-children').removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').removeAttr('disabled');
			}
			//Un joven tiene que ir por fuerza acompañado de un adulto o un senior (solo flujo UMNR, tab Vuelo)
			if (minorsAloneFlowEnabled) {
				youngCountVis = parseInt($listIn.find('[data-people-type="young"]').html()) || 0;
				adultCountVis = parseInt($listIn.find('[data-people-type="adult"]').html()) || 0;
				seniorCountVis = parseInt($listIn.find('[data-people-type="senior"]').html()) || 0;
				//No se puede añadir un joven si todavía no hay ningún adulto ni senior
				if (adultCountVis === 0 && seniorCountVis === 0) {
					$listIn.find('[data-people-type="young"]').parent().addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').attr('disabled', 'disabled');
				} else {
					$listIn.find('[data-people-type="young"]').parent().removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').removeAttr('disabled');
				}
				//El adulto no puede bajar a 0 si hay algún joven y no queda ningún senior que lo acompañe
				if (youngCountVis > 0 && adultCountVis === 1 && seniorCountVis === 0) {
					$listIn.find('[data-people-type="adult"]').parent().addClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').attr('disabled', 'disabled');
				}
				//El senior no puede bajar a 0 si hay algún joven y no queda ningún adulto que lo acompañe
				if (youngCountVis > 0 && seniorCountVis === 1 && adultCountVis === 0) {
					$listIn.find('[data-people-type="senior"]').parent().addClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').attr('disabled', 'disabled');
				}
			}
		}
		toggleUmnrFlow($listIn, minorsAloneFlowEnabled);
	};

	//Cambios del buscador cuando estamos en flujo UMNR (0 adultos + niños): check de Avios y mensaje de mascotas
	/**@name toggleUmnrFlow
	 * @description Apply the UMNR restrictions (pay with avios check, pets message) depending on the passengers
	 * @param listElem Passengers list of the searcher
	 * @param minorsAloneFlowEnabled UMNR flow enabled for this searcher (tab Vuelo + WCS property)
	 */
	var toggleUmnrFlow = function (listElem, minorsAloneFlowEnabled) {
		var adultCount, childrenCount, isUmnrFlow;
		//Solo aplica al pasajero de la tab Vuelo: el resto de tabs no deben tocar el buscador de vuelo
		if (!listElem.closest('#tab-searcher-1, #m-tab-searcher-1').length) {
			return;
		}
		adultCount = parseInt(listElem.find('[data-people-type="adult"]').html()) || 0;
		childrenCount = parseInt(listElem.find('[data-people-type="children"]').html()) || 0;
		isUmnrFlow = minorsAloneFlowEnabled && adultCount === 0 && childrenCount > 0;
		toggleAviosUmnr(isUmnrFlow);
		togglePetsMessageUmnr(isUmnrFlow);
	};

	//Mensaje de mascotas: en flujo UMNR se muestra --umnrs y se oculta --flow; en flujo normal al revés
	/**@name togglePetsMessageUmnr
	 * @description Show the pets message that matches the current flow (UMNR or normal)
	 * @param isUmnrFlow Minors travelling alone
	 */
	var togglePetsMessageUmnr = function (isUmnrFlow) {
		$('.ibe-people-counter__people-subtitle--umnrs').toggleClass('hidden', !isUmnrFlow);
		$('.ibe-people-counter__people-subtitle--flow').toggleClass('hidden', isUmnrFlow);
	};

	//Incompatibilidad con "Pagar con Avios": en flujo UMNR (0 adultos + niños) no se puede marcar
	/**@name toggleAviosUmnr
	 * @description Disable (and uncheck) the pay with avios check while minors travel alone (UMNR)
	 * @param isUmnrFlow Minors travelling alone
	 */
	var toggleAviosUmnr = function (isUmnrFlow) {
		var $aviosCheck = $('#paywithAvios');
		if (!$aviosCheck.length) {
			return;
		}
		if (isUmnrFlow) {
			if ($aviosCheck.attr('data-disabled-umnr') !== 'true') {
				$aviosCheck.attr('disabled', 'disabled').attr('data-disabled-umnr', 'true');
				if ($aviosCheck.is(':checked')) {
					$aviosCheck.prop('checked', false).trigger('change');
				}
			}
		} else if ($aviosCheck.attr('data-disabled-umnr') === 'true') {
			//Solo lo reactivamos si fuimos nosotros quienes lo deshabilitamos
			$aviosCheck.removeAttr('disabled').removeAttr('data-disabled-umnr');
		}
	};


	//Mostrar las edades de los niños
	var showChildrenAges = function (countChildren, parent, list) {
		var $countChildren = countChildren || countNumber;
		var $ages, $selectors, id, html, minAges, maxAges, i, index, $select;
		$parent = parent || $parent;
		$list = list || $list;
		$ages = $parent.find('.ibe-people-counter__ages');
		$selectors = $parent.find('.ibe_form__selectize-multi__selectors');
		//Con el siguiente data distinguimos los distintos ids de los elementos de los formularios en cada tab
		id = $list.attr('data-id');
		$selectors.html('');
		if ($countChildren <= 0) {
			$ages.css('display', 'none');
		} else {
			html = '';
			minAges = $ages.data('min-ages') || 2;
			maxAges = $ages.data('max-ages') || 17;
			for (i = 0; i < $countChildren; i++) {
				html += '<label class="hideAccessible" for="' + id + 'children_' + i + '">Ni&ntilde;o ' + (i + 1) + '</label>' +
					'<select class="ibe_form__selectize" name="' + id + 'children_' + i + '" data-selectize="simple" id="' + id + 'children_' + i + '">';
				for (index = minAges; index <= maxAges; index++) {
					if (index < 10) {
						html += '<option value="0' + index + '">0' + index + '</option>';
					} else {
						html += '<option value="' + index + '">' + index + '</option>';
					}
				}
				html += '</select>';
			}
			$selectors.append(html);
			dFrontJs.ibe_combobox.init();
			$select = $parent.find('select');
			for (i = 0; i < $select.length; i++) {
				$select.eq(i)[0].selectize.setValue($agesList[i].toString());
			}
			udpdateValueChildren();
			setTimeout(function () {
				$ages.css('display', 'block');
			}, 100);
		}
	};
	//Init
	var init = function (elem) {
		var $element, $thisTime, list, imp, item, countn;
		if (elem !== undefined) {
			$element = $(elem);
			$thisTime = $element.parent();
			list = $thisTime.find('.ibe-people-counter__list');
			imp = list.find('.fc-people-counter-important');

		} else {
			$thisTime = $('.ibe-people-counter').parent();
			list = $thisTime.find('.ibe-people-counter__list');
			imp = list.find('.fc-people-counter-important');
		}
		$.each($thisTime, function () {
			item = $(this).find('.ibe-people-counter__list-item');
			list = $(this).find('.ibe-people-counter__list');
			imp = list.find('.fc-people-counter-important');
			if (!$(this).find('button').hasClass('fc-people-counter-active')) {
				$(this).find('button').not('[data-dinamic-close]').addClass('fc-people-counter-active');
				__constructor($(this));
				visualValidations(item, list, imp);
				$(this).find($('[data-people-counter-button]')).on('click', function () {
					var i, total, b, j, babiesRecount, adultsRecount, seniorRecount, youngRecount, childrenRecount,
						teenagerRecount, recount, $people_counter, aType, html, _print, $childrenCounter, adultsCount, maxChildren, $petsToggle, minorsAloneFlowEnabled, youngCount, adultCount, seniorCount;
					__constructor($(this));
					//Recogemos el valor actual del contador
					countNumber = lessOrPlus();
					//Recogemos el numero maximo de personas
					nine = getNumberOrPeople();
					//El flujo de menores viajando solos (UMNR) solo aplica en la pestaña Vuelo (#tab-searcher-1
					//en desktop, #m-tab-searcher-1 en mobile: el buscador mueve el markup entre ambos wrappers
					//responsive, ver moveContentResponsive en ibe-searcher-accordion-mobile.js)
					//y si la property de WCS modal.unmrs.wcs.enabled lo tiene activado;
					//no debe afectar a otras pestañas del buscador como Vuelo+Coche (#tab-searcher-3)
					minorsAloneFlowEnabled = $list.closest('#tab-searcher-1, #m-tab-searcher-1').length > 0 && typeof unmrModalEnabled !== 'undefined' && unmrModalEnabled === "true";
					//Si es adulto (Senior, Adulto, Jovenes)
					if ($parent.hasClass('fc-people-counter-important') && nine <= 9) {
						i = getSumCountersObj($important.not($parent));
						//Un joven tiene que ir por fuerza acompañado de un adulto o un senior (solo flujo UMNR):
						//bloqueamos el incremento de joven si todavía no hay ningún adulto ni senior
						if (minorsAloneFlowEnabled && $count.data('people-type') === 'young' && $obj.data('people-counter-button') === 'more') {
							adultCount = parseInt($important.find('[data-people-type="adult"]').html()) || 0;
							seniorCount = parseInt($important.find('[data-people-type="senior"]').html()) || 0;
							if (adultCount === 0 && seniorCount === 0) {
								countNumber = countNumber - 1;
							}
						}
						if (countNumber <= 0) {
							countNumber = 0;
							youngCount = parseInt($important.find('[data-people-type="young"]').html()) || 0;
							adultCount = parseInt($important.find('[data-people-type="adult"]').html()) || 0;
							seniorCount = parseInt($important.find('[data-people-type="senior"]').html()) || 0;
							//toggle para que niños no puedan viajar solos( cambiar también el visual ), excepto adultos y seniors (permiten flujo UMNR solo en la tab de Vuelo);
							//el adulto/senior tampoco puede bajar a 0 si hay algún joven y no queda el otro (adulto o senior) para acompañarlo
							if ((i <= 0 && (!minorsAloneFlowEnabled || ($count.data('people-type') !== 'adult' && $count.data('people-type') !== 'senior'))) ||
								(minorsAloneFlowEnabled && $count.data('people-type') === 'adult' && youngCount > 0 && seniorCount === 0) ||
								(minorsAloneFlowEnabled && $count.data('people-type') === 'senior' && youngCount > 0 && adultCount === 0)) {
								countNumber = 1;
							}
						}
						$count.html(countNumber);
						total = getSumCountersObj($important);
						if ($parent.hasClass('fc-people-counter-important')) {
							//Comprobar numero de bebes
							b = parseInt($babies.find('[data-people-counter="counter"]').text());
							if (total < b) {
								$babies.find('[data-people-counter="counter"]').html(total);
							}
						}
						//Si los adultos llegan a 0, los niños solos tienen un tope de 8 (UMNR)
						if ($count.data('people-type') === 'adult' && countNumber === 0) {
							$childrenCounter = $list.find('[data-people-type="children"]');
							if (parseInt($childrenCounter.text()) > 8) {
								$childrenCounter.text(8);
							}
							//Evitar que el total de pasajeros llegue a 0: si bajamos el adulto a 0 sin niños NI otros
							//"important" (senior/joven, ver "i" más arriba), forzamos 1 niño. Si hay un senior/joven,
							//ya no estamos en flujo UMNR y no hace falta forzar nada.
							if (minorsAloneFlowEnabled && i <= 0 && parseInt($childrenCounter.text()) === 0) {
								$childrenCounter.html(1).removeClass(classNone).addClass(classPlus);
								showChildrenAges(1, $list.find('.fc-people-counter-children'), $list);
							}
						}
						//Si el senior llega a 0 (sin quedar otro acompañante), los niños solos tienen un tope de 8 (UMNR):
						//el senior también puede bajar a 0 para que el niño entre en el flujo UMNR
						if ($count.data('people-type') === 'senior' && countNumber === 0) {
							$childrenCounter = $list.find('[data-people-type="children"]');
							if (parseInt($childrenCounter.text()) > 8) {
								$childrenCounter.text(8);
							}
							//Evitar que el total de pasajeros llegue a 0: si bajamos el senior a 0 sin niños NI otros
							//"important" (adulto/joven, ver "i" más arriba), forzamos 1 niño.
							if (minorsAloneFlowEnabled && i <= 0 && parseInt($childrenCounter.text()) === 0) {
								$childrenCounter.html(1).removeClass(classNone).addClass(classPlus);
								showChildrenAges(1, $list.find('.fc-people-counter-children'), $list);
							}
						}
						//Incompatibilidad con mascotas: un UMNR (0 adultos) no puede viajar con mascota
						if ($count.data('people-type') === 'adult') {
							$petsToggle = $('#flyWithPets');
							if ($petsToggle.length) {
								if (countNumber === 0) {
									$petsToggle.prop('checked', false).trigger('change').attr('disabled', 'disabled').attr('data-disabled-umnr', 'true');
								} else if ($petsToggle.attr('data-disabled-umnr') === 'true') {
									//Solo la reactivamos si fuimos nosotros quienes la deshabilitamos (no pisar otras reglas, ej. fecha <48h)
									$petsToggle.removeAttr('disabled').removeAttr('data-disabled-umnr');
								}
							}
						}
						//Si es bebé
					} else if ($parent.hasClass('fc-people-counter-babies')) {
						//Recojemos el numero maximo de adultos
						j = getSumCountersObj($important);
						if (countNumber > 0) {
							if (countNumber >= j) {
								countNumber = j;
							}
						} else {
							countNumber = 0;
						}
						$count.html(countNumber);
						//Si es niños
					} else if ($parent.hasClass('fc-people-counter-children') && nine <= 9) {
						//Total de pasajeros "important" (adulto+senior+joven): si es 0 los niños viajan solos (UMNR)
						adultsCount = getSumCountersObj($important);
						//Niños viajando solos (0 adultos/senior/joven) tienen un tope de 8 en vez de 9 (UMNR)
						maxChildren = adultsCount === 0 ? 8 : 9;
						if (countNumber > maxChildren) {
							countNumber = maxChildren;
						} else if (countNumber < 0) {
							countNumber = 0;
						}
						$count.html(countNumber);
						//Evitar que el total de pasajeros llegue a 0: si bajamos los niños a 0 sin ningún adulto/senior/joven, forzamos 1 adulto
						if (minorsAloneFlowEnabled && countNumber === 0 && adultsCount === 0) {
							$list.find('[data-people-type="adult"]').html(1).removeClass(classNone).addClass(classPlus);
							//El adulto se fuerza aquí sin pasar por su click normal, así que hay que reactivar
							//mascotas a mano (si fuimos nosotros quienes la deshabilitamos por UMNR)
							$petsToggle = $('#flyWithPets');
							if ($petsToggle.length && $petsToggle.attr('data-disabled-umnr') === 'true') {
								$petsToggle.removeAttr('disabled').removeAttr('data-disabled-umnr');
							}
						}
						//Edades de los niños
						showChildrenAges();

						//Si es adolescente
					} else if ($parent.hasClass('fc-people-counter-teenager') && nine <= 9) {
						if (countNumber > 9) {
							countNumber = 9;
						} else if (countNumber < 0) {
							countNumber = 0;
						}
						$count.html(countNumber);
					} else if ($parent.hasClass('fc-people-counter-young') && nine <= 9) {
						if (countNumber > 9) {
							countNumber = 9;
						} else if (countNumber < 0) {
							countNumber = 0;
						}
						$count.html(countNumber);
					}
					//Aplicar estilos --plus/--none
					if (nine <= 9) {
						(countNumber > 0) ? $count.addClass(classPlus).removeClass(classNone) : $count.addClass(classNone).removeClass(classPlus);
					} else if (nine > 9) {
						if (parseInt($babiesCount.html()) !== 0) {
							(countNumber > 0) ? $babiesCount.addClass(classPlus).removeClass(classNone) : $babiesCount.addClass(classNone).removeClass(classPlus);
						} else {
							$babiesCount.addClass(classNone).removeClass(classPlus);
						}
					}
					//Validaciones visuales
					visualValidations($(this));
					//Recuento
					babiesRecount = getSumCountersObj($list.find('.ibe-people-counter__list-item.fc-people-counter-babies'));
					adultsRecount = getSumCountersObj($list.find('[data-people-type="adult"]').parents('.ibe-people-counter__list-item.fc-people-counter-important'));
					seniorRecount = getSumCountersObj($list.find('[data-people-type="senior"]').parents('.ibe-people-counter__list-item.fc-people-counter-important'));
					youngRecount = getSumCountersObj($list.find('[data-people-type="young"]').parents('.ibe-people-counter__list-item.fc-people-counter-important'));
					childrenRecount = getSumCountersObj($list.find('.ibe-people-counter__list-item.fc-people-counter-children'));
					teenagerRecount = getSumCountersObj($list.find('[data-people-type="teenager"]').parents('.ibe-people-counter__list-item.fc-people-counter-important'));
					recount = getSumCountersObj($list.find('.ibe-people-counter__list-item'));
					if ($('[data-text-adults]').length > 0) {
						$people_counter = $input.parent().find('.ibe-people-counter__counter--plus'); //selected element
						aType = [];
						html = '';
						$people_counter.each(function () {
							aType.push($(this).data('peopleType')); //push people type to array
						});

						//Function for print element with coma
						_print = function (recount, type, textP, textS) {
							var aux;
							if (recount > 0) {
								if (aType.length > 1 && aType[0] !== type) {
									aux = ', ';
								} else {
									aux = '';
								}
								html += aux + updateInput(recount, textP, textS, type, $input);
							}
							return html;

						};

						html = _print(seniorRecount, 'senior', 'text-seniors', 'text-senior');
						html = _print(adultsRecount, 'adult', 'text-adults', 'text-adult');
						html = _print(youngRecount, 'young', 'text-youngs', 'text-young');
						html = _print(teenagerRecount, 'teenager', 'text-teenagers', 'text-teenager');
						html = _print(childrenRecount, 'children', 'text-children', 'text-child');
						html = _print(babiesRecount, 'baby', 'text-babies', 'text-baby');

						$input.text(html);
						$input.val(html);

					} else {
						//Numero de pasajeros en el input principal
						$people_counter = $input.parent().find('.ibe-people-counter__counter--plus'); //selected element
						aType = [];
						html = '';
						$people_counter.each(function () {
							aType.push($(this).data('peopleType')); //push people type to array
						});
						if (recount >= 1) {
							if (minorsAloneFlowEnabled && adultsRecount > 0 && childrenRecount === 0 && seniorRecount === 0 && youngRecount === 0 && teenagerRecount === 0 && babiesRecount === 0) {
								//Solo adultos (sin niños ni otros tipos), solo en la tab de Vuelo: numero + literal adulto/adultos
								html = adultsRecount + ' ' + (adultsRecount === 1 ? $input.data('text-adult') : $input.data('text-adult-plural'));
							} else if (minorsAloneFlowEnabled && childrenRecount > 0 && adultsRecount === 0 && seniorRecount === 0 && youngRecount === 0 && teenagerRecount === 0 && babiesRecount === 0) {
								//Solo niños (sin adultos ni otros tipos), solo en la tab de Vuelo: numero + literal niño/niños
								html = childrenRecount + ' ' + (childrenRecount === 1 ? $input.data('text-child') : $input.data('text-children'));
							} else {
								html = recount + ' ' + $input.data('text-passenger');
							}
						} else {
							if (aType[0] == 'senior') {
								html = $input.data('value-senior');
							} else if (aType[0] == 'young') {
								html = $input.data('value-young');
							} else if (aType[0] == 'teenager') {
								html = $input.data('value-teenager');
							} else {
								html = $input.data('value-adult');
							}
						}

						$input.text(html);
						$input.val(html);
					}

				});
			}

		});

		$('[data-checkBaby]').off('change',  changeCheckAviosSearch);
		$('[data-checkBaby]').on('change',  changeCheckAviosSearch);
	};

	/*****************************************************************************************************************/
	/*****************************************************************************************************************/
	/*********************************** FUNCIONES PARA ACTUALIZAR PASAJEROS ***************************************/
	/***********************************************************************************************************/
	/*****************************************************************************************************************/
	//Update function for passangers
	var updateInput = function (num, plural, singular, type, input) {
		var value = '';

		if (num > 1) {
			return value + num + ' ' + input.data(plural) + '';
		} else if (num == 1) {
			return value + num + ' ' + input.data(singular) + '';
		}

		return '';

	};

	//updateResults - generic for home
	var updateResults = function (selector, num, people) {
		var $selector = $(selector),
			recount = 0,
			list = $selector.next().find('.ibe-people-counter__list'),
			html, $people_counter, aType, minorsAloneFlowEnabled, adultsRecount, childrenRecount,
			seniorRecount, youngRecount, teenagerRecount, babiesRecount;
		num = num || 0;

		//Numero de pasajeros en el input principal
		$selector.each(function () {
			list = $(this).next().find('.ibe-people-counter__list');
			$(this).next().find(people).text(num); //actualizamos el numero de adultos
			recount = getSumCountersObj(list.find('.ibe-people-counter__list-item'));
			$people_counter = list.find('.ibe-people-counter__counter--plus'); //selected element
			aType = [];
			html = '';



			$people_counter.each(function () {
				if (parseInt($(this).text()) === 0) {
					$(this).addClass(classNone).removeClass(classPlus);
				} else{
					aType.push($(this).data('peopleType')); //push people type to array
				}
			});

			if (recount >= 1) {
				//El flujo de menores viajando solos (UMNR) solo aplica en la pestaña Vuelo (#tab-searcher-1
				//en desktop, #m-tab-searcher-1 en mobile: el buscador mueve el markup entre ambos wrappers
				//responsive, ver moveContentResponsive en ibe-searcher-accordion-mobile.js)
				//y si la property de WCS modal.unmrs.wcs.enabled lo tiene activado;
				//no debe afectar a otras pestañas del buscador como Vuelo+Coche (#tab-searcher-3)
				minorsAloneFlowEnabled = list.closest('#tab-searcher-1, #m-tab-searcher-1').length > 0 && typeof unmrModalEnabled !== 'undefined' && unmrModalEnabled === "true";
				adultsRecount = getSumCountersObj(list.find('[data-people-type="adult"]').parents('.ibe-people-counter__list-item.fc-people-counter-important'));
				seniorRecount = getSumCountersObj(list.find('[data-people-type="senior"]').parents('.ibe-people-counter__list-item.fc-people-counter-important'));
				youngRecount = getSumCountersObj(list.find('[data-people-type="young"]').parents('.ibe-people-counter__list-item.fc-people-counter-important'));
				teenagerRecount = getSumCountersObj(list.find('[data-people-type="teenager"]').parents('.ibe-people-counter__list-item.fc-people-counter-important'));
				childrenRecount = getSumCountersObj(list.find('.ibe-people-counter__list-item.fc-people-counter-children'));
				babiesRecount = getSumCountersObj(list.find('.ibe-people-counter__list-item.fc-people-counter-babies'));
				if (minorsAloneFlowEnabled && adultsRecount > 0 && childrenRecount === 0 && seniorRecount === 0 && youngRecount === 0 && teenagerRecount === 0 && babiesRecount === 0) {
					//Solo adultos (sin niños ni otros tipos), solo en la tab de Vuelo: numero + literal adulto/adultos
					html = adultsRecount + ' ' + (adultsRecount === 1 ? $(this).data('text-adult') : $(this).data('text-adult-plural'));
				} else if (minorsAloneFlowEnabled && childrenRecount > 0 && adultsRecount === 0 && seniorRecount === 0 && youngRecount === 0 && teenagerRecount === 0 && babiesRecount === 0) {
					//Solo niños (sin adultos ni otros tipos), solo en la tab de Vuelo: numero + literal niño/niños
					html = childrenRecount + ' ' + (childrenRecount === 1 ? $(this).data('text-child') : $(this).data('text-children'));
				} else {
					html = recount + ' ' + $(this).data('text-passenger');
				}
			} else {
				if (aType[0] == 'senior') {
					html = $(this).data('value-senior');
				} else if (aType[0] == 'young') {
					html = $(this).data('value-young');
				} else if (aType[0] == 'teenager') {
					html = $(this).data('value-teenager');
				} else {
					html = $(this).data('value-adult');
				}
			}
			$(this).text(html);
			$(this).val(html);

		});

		updateColor(selector);

	};
	//Actualizar el color
	var updateColor = function (selector) {
		var $selector = $(selector),
			$count = $selector.next().find('[data-people-counter="counter"]'),
			nine = 0,
			item,
			list = $selector.next().find('.ibe-people-counter__list'),
			imp = list.find('.fc-people-counter-important'),
			$petsToggle;
		// Recogemos el valor actual del contador para actualizar los estados
		$count.each(function (i) {
			item = $(this).parents('.ibe-people-counter__list-item');
			list = $(this).parents('.ibe-people-counter__list');
			imp = list.find('.fc-people-counter-important');

			//Recogemos el numero maximo de personas
			if ($(this).not('[data-people-type="babies"]').text()) {
				nine = nine + parseInt($(this).not('[data-people-type="babies"]').text());
			}

			if (parseInt($(this).text()) > 0) {
				$(this).addClass(classPlus).removeClass(classNone);
			} else {
				$(this).addClass(classNone).removeClass(classPlus);
			}

			visualValidations(item, list, imp);

			//Incompatibilidad con mascotas cuando el estado se actualiza sin pasar por el click (ej. restorePassenger)
			if ($(this).data('people-type') === 'adult') {
				$petsToggle = $('#flyWithPets');
				if ($petsToggle.length) {
					if (parseInt($(this).text()) === 0) {
						$petsToggle.prop('checked', false).trigger('change').attr('disabled', 'disabled').attr('data-disabled-umnr', 'true');
					} else if ($petsToggle.attr('data-disabled-umnr') === 'true') {
						$petsToggle.removeAttr('disabled').removeAttr('data-disabled-umnr');
					}
				}
			}

		});
	};

		//updateResults - numSenior
	/**@name updateResultsAdult 
	 * @description Update the value of Adult passengers
	 * @param selector Selector that points to flight passenger module
	 * @param numAdult Number of adults that it's wanted to assing
	*/
	var updateResultsAdult = function (selector, numAdult) {
		var people = $peopleAdult,
			$selector = $(selector),
			$adult,
			$container = $selector.parent().find('.ibe-people-counter');
		if ($selector.data('text-adults') == undefined) {
			if (numAdult == 0) {
				$adult = $(selector).parent().find('[data-people-type="adult"]');
				$adult.removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
			}
			updateResults(selector, numAdult, people);
		} else {
			$selector.each(function () {
				var $input, html, _print, childrenRecount, babiesRecount, seniorRecount,
					youngRecount, teenagerRecount;
				if (!$(this).hasClass('fc-updateAdult-loaded')) {
					$input = $(this);
					html = '';

					//Function for print element with coma
					_print = function (recount, type, textP, textS) {
						var aux;
						if (recount > 0) {
							if (html.length > 0) {
								aux = ', ';
							} else {
								aux = '';
							}
							html += aux + updateInput(recount, textP, textS, type, $input);
						}
						return html;

					};
					$(this).next().find(people).text(numAdult);
					childrenRecount = $(this).next().find($peopleChildren).text();
					babiesRecount = $(this).next().find($peopleBabies).text();
					seniorRecount = $(this).next().find($peopleSenior).text();
					youngRecount = $(this).next().find($peopleYoung).text();
					teenagerRecount = $(this).next().find($peopleTeenager).text();

					html = _print(seniorRecount, 'senior', 'text-seniors', 'text-senior');
					html = _print(numAdult, 'adult', 'text-adults', 'text-adult');
					html = _print(youngRecount, 'young', 'text-youngs', 'text-young');
					html = _print(teenagerRecount, 'teenager', 'text-teenagers', 'text-teenager');
					html = _print(childrenRecount, 'children', 'text-children', 'text-child');
					html = _print(babiesRecount, 'baby', 'text-babies', 'text-baby');

					$(this).text(html);
					$(this).val(html);
					$(this).addClass('fc-updateAdult-loaded');
				}
			});
			updateColor(selector);
		}

		if (!$container.hasClass('save')) {
			$container.addClass('save');
		}

		$(selector).data('adultSave', numAdult);


	};

	//updateResults - numChildren
	/**@name updateResultsChildren 
	 * @description Update the value of Children passengers
	 * @param selector Selector that points to flight passenger module
	 * @param numChildren Number of Children that it's wanted to assing
	 * @param ages array of chilldren ages
	*/
	var updateResultsChildren = function (selector, numChildren, ages) {
		var $selector = $(selector),
			people = $peopleChildren,
			$ages = ages,
			$parent = $selector.parent().find('.fc-people-counter-children'),
			$list = $selector.next().find('.ibe-people-counter__list'),
			$container = $selector.parent().find('.ibe-people-counter'),
			html, adultsRecount, babiesRecount, seniorRecount, youngRecount, teenagerRecount, i, _print;

		//Entra en la Home
		if ($selector.data('text-adults') == undefined) {
			updateResults(selector, numChildren, people);
			//LLamamos a la función que muestra las edades
			$selector.each(function () {
				$parent = $(this).parent().find('.fc-people-counter-children');
				$list = $(this).next().find('.ibe-people-counter__list');
				showChildrenAges(numChildren, $parent, $list);
			});


			//Actualizar las edades de los niños
			if ($ages !== undefined) {
				if ($(selector).parent().find('.ibe-people-counter').length > 0) {
					for (i = 0; i <= ages.length - 1; i++) {
						if ($(selector).parent().find('#Vchildren_' + i).length > 0) {
							$(selector).parent().find('.ibe-people-counter__ages').find('#Vchildren_' + (i))[0].selectize.setValue($ages[i]);
						}
						if ($(selector).parent().find('#VCchildren_' + i).length > 0) {
							$(selector).parent().find('.ibe-people-counter__ages').find('#VCchildren_' + (i))[0].selectize.setValue($ages[i]);
						}
					}
				}
			}
		} else { //no entra en la home
			html = '';
			$selector.each(function () {
				if (!$(this).hasClass('fc-updateChildren-loaded')) {
					$input = $(this);
					html = '';
					$parent = $(this).parent().find('.fc-people-counter-children');
					$list = $(this).next().find('.ibe-people-counter__list');
					adultsRecount = $(this).next().find($peopleAdult).text();
					$(this).next().find(people).text(numChildren);
					babiesRecount = $(this).next().find($peopleBabies).text();
					seniorRecount = $(this).next().find($peopleSenior).text();
					youngRecount = $(this).next().find($peopleYoung).text();
					teenagerRecount = $(this).next().find($peopleTeenager).text();

					//Function for print element with coma
					_print = function (recount, type, textP, textS) {
						var aux;
						if (recount > 0) {
							if (html.length > 0) {
								aux = ', ';
							} else {
								aux = '';
							}
							html += aux + updateInput(recount, textP, textS, type, $input);
						}
						return html;

					};

					html = _print(seniorRecount, 'senior', 'text-seniors', 'text-senior');
					html = _print(adultsRecount, 'adult', 'text-adults', 'text-adult');
					html = _print(youngRecount, 'young', 'text-youngs', 'text-young');
					html = _print(teenagerRecount, 'teenager', 'text-teenagers', 'text-teenager');
					html = _print(numChildren, 'children', 'text-children', 'text-child');
					html = _print(babiesRecount, 'baby', 'text-babies', 'text-baby');

					$(this).text(html);
					$(this).val(html);

					//LLamamos a la función que muestra las edades
					showChildrenAges(numChildren, $parent, $list);

					//Actualizar las edades de los niños
					if ($ages !== undefined) {
						if ($(selector).parent().find('.ibe-people-counter').length > 0) {
							for (i = 0; i <= ages.length - 1; i++) {
								if ($(selector).parent().find('#Vchildren_' + i).length > 0) {
									$(selector).parent().find('.ibe-people-counter__ages').find('#Vchildren_' + (i))[0].selectize.setValue($ages[i]);
								}
								if ($(selector).parent().find('#VCchildren_' + i).length > 0) {
									$(selector).parent().find('.ibe-people-counter__ages').find('#VCchildren_' + (i))[0].selectize.setValue($ages[i]);
								}
							}
						}
					}
					$(this).addClass('fc-updateChildren-loaded');
				}
			});
			updateColor(selector);
		}

		if (!$container.hasClass('save')) {
			$container.addClass('save');
		}

		$(selector).data('childrenSave', numChildren);
		$(selector).data('agesSave', ages);
	};

	//updateResults - numBabies
	/**@name updateResulupdateResultsBabiestsChildren 
	 * @description Update the value of babies passengers
	 * @param selector Selector that points to flight passenger module
	 * @param numBabies Number of babies
	*/
	var updateResultsBabies = function (selector, numBabies) {
		var $selector = $(selector),
			people = $peopleBabies,
			$container = $selector.parent().find('.ibe-people-counter'),
			html, $input, $people_counter, aType, _print, adultsRecount, childrenRecount, seniorRecount, youngRecount,
			teenagerRecount;

		//Entra en la Home
		if ($selector.data('text-adults') == undefined) {
			updateResults(selector, numBabies, people);

		} else { // NO Entra en la Home
			html = '';
			$selector.each(function () {
				if (!$(this).hasClass('fc-updateBabies-loaded')) {
					$input = $(this);
					html = '';

					//Function for print element with coma
					_print = function (recount, type, textP, textS) {

						var aux;
						if (recount > 0) {
							if (html.length > 0) {
								aux = ', ';
							} else {
								aux = '';
							}
							html += aux + updateInput(recount, textP, textS, type, $input);
						}
						return html;

					};

					adultsRecount = $(this).next().find($peopleAdult).text();
					childrenRecount = $(this).next().find($peopleChildren).text();
					$(this).next().find($peopleBabies).text(numBabies);
					seniorRecount = $(this).next().find($peopleSenior).text();
					youngRecount = $(this).next().find($peopleYoung).text();
					teenagerRecount = $(this).next().find($peopleTeenager).text();

					html = _print(seniorRecount, 'senior', 'text-seniors', 'text-senior');
					html = _print(adultsRecount, 'adult', 'text-adults', 'text-adult');
					html = _print(youngRecount, 'young', 'text-youngs', 'text-young');
					html = _print(teenagerRecount, 'teenager', 'text-teenagers', 'text-teenager');
					html = _print(childrenRecount, 'children', 'text-children', 'text-child');
					html = _print(numBabies, 'baby', 'text-babies', 'text-baby');


					$(this).text(html);
					$(this).val(html);
					$(this).addClass('fc-updateBabies-loaded');
				}
			});

			updateColor(selector);
		}

		if (!$container.hasClass('save')) {
			$container.addClass('save');
		}

		$(selector).data('babiesSave', numBabies);
	};

	//updateResults - numSenior
	/**@name updateResultsSenior 
	 * @description Update the value of Senior passengers
	 * @param selector Selector that points to flight passenger module
	 * @param numSenior Number of Senior that it's wanted to assing
	*/
	var updateResultsSenior = function (selector, numSenior) {
		var people = $peopleSenior,
			$selector = $(selector),
			$container = $selector.parent().find('.ibe-people-counter'),
			html, $input, _print, adultsRecount, childrenRecount, youngRecount, teenagerRecount,
			babiesRecount;

		//Entra en la Home
		if ($selector.data('text-adults') == undefined) {
			updateResults(selector, numSenior, people);

		} else {	// No entra en la home
			html = '';
			$selector.each(function () {
				if (!$(this).hasClass('fc-updateSenior-loaded')) {
					$input = $(this);
					html = '';

					//Function for print element with coma
					_print = function (recount, type, textP, textS) {

						var aux;
						if (recount > 0) {
							if (html.length > 0) {
								aux = ', ';
							} else {
								aux = '';
							}
							html += aux + updateInput(recount, textP, textS, type, $input);
						}
						return html;

					};

					adultsRecount = $(this).next().find($peopleAdult).text();
					childrenRecount = $(this).next().find($peopleChildren).text();
					babiesRecount = $(this).next().find($peopleBabies).text();
					$(this).next().find(people).text(numSenior);
					youngRecount = $(this).next().find($peopleYoung).text();
					teenagerRecount = $(this).next().find($peopleTeenager).text();

					html = _print(numSenior, 'senior', 'text-seniors', 'text-senior');
					html = _print(adultsRecount, 'adult', 'text-adults', 'text-adult');
					html = _print(youngRecount, 'young', 'text-youngs', 'text-young');
					html = _print(teenagerRecount, 'teenager', 'text-teenagers', 'text-teenager');
					html = _print(childrenRecount, 'children', 'text-children', 'text-child');
					html = _print(babiesRecount, 'baby', 'text-babies', 'text-baby');

					$(this).text(html);
					$(this).val(html);
					$(this).addClass('fc-updateSenior-loaded');
				}
			});

			updateColor(selector);
		}

		if (!$container.hasClass('save')) {
			$container.addClass('save');
		}

		$(selector).data('seniorSave', numSenior);

	};

	//updateResults -
	/**@name updateResultsYoung 
	 * @description Update the value of Young passengers
	 * @param selector Selector that points to flight passenger module
	 * @param numYoung Number of Young that it's wanted to assing
	*/
	var updateResultsYoung = function (selector, numYoung) {
		var people = $peopleYoung,
			$selector = $(selector),
			$container = $selector.parent().find('.ibe-people-counter'),
			html, $input, _print, adultRecount, childrenRecount, seniorRecount, teenagerRecount,
			babiesRecount;

		//Entra en  la Home
		if ($selector.data('text-adults') == undefined) {
			updateResults(selector, numYoung, people);
		} else { //No Entra en la Home
			html = '';
			$selector.each(function () {
				if (!$(this).hasClass('fc-updateYoung-loaded')) {
					$input = $(this);
					html = '';


					//Function for print element with coma
					_print = function (recount, type, textP, textS) {
						var aux;
						if (recount > 0) {
							if (html.length > 0) {
								aux = ', ';
							} else {
								aux = '';
							}
							html += aux + updateInput(recount, textP, textS, type, $input);
						}
						return html;

					};
					adultRecount = $(this).next().find($peopleAdult).text();
					childrenRecount = $(this).next().find($peopleChildren).text();
					babiesRecount = $(this).next().find($peopleBabies).text();
					seniorRecount = $(this).next().find($peopleSenior).text();
					$(this).next().find(people).text(numYoung);
					teenagerRecount = $(this).next().find($peopleTeenager).text();

					html = _print(seniorRecount, 'senior', 'text-seniors', 'text-senior');
					html = _print(adultRecount, 'adult', 'text-adults', 'text-adult');
					html = _print(numYoung, 'young', 'text-youngs', 'text-young');
					html = _print(teenagerRecount, 'teenager', 'text-teenagers', 'text-teenager');
					html = _print(childrenRecount, 'children', 'text-children', 'text-child');
					html = _print(babiesRecount, 'baby', 'text-babies', 'text-baby');

					$(this).text(html);
					$(this).val(html);
					$(this).addClass('fc-updateYoung-loaded');
				}
			});

			updateColor(selector);
		}
		if (!$container.hasClass('save')) {
			$container.addClass('save');
		}

		$(selector).data('youngSave', numYoung);
	};

	//updateResults - numTeenager
	/**@name updateResultsTeenager 
	 * @description Update the value of Teenager passengers
	 * @param selector Selector that points to flight passenger module
	 * @param numTeenager Number of Teenager that it's wanted to assing
	*/
	var updateResultsTeenager = function (selector, numTeenager) {
		var people = $peopleTeenager,
			$selector = $(selector),
			$container = $selector.parent().find('.ibe-people-counter'),
			html, $input, _print, adultRecount, childrenRecount, seniorRecount, youngRecount,
			babiesRecount;

		//Entra en  la Home
		if ($selector.data('text-teenager') == undefined) {
			updateResults(selector, numTeenager, people);
		} else { //No Entra en la Home
			html = '';
			$selector.each(function () {
				if (!$(this).hasClass('fc-updateTeenager-loaded')) {
					$input = $(this);
					html = '';

					//Function for print element with coma
					_print = function (recount, type, textP, textS) {
						var aux;
						if (recount > 0) {
							if (html.length > 0) {
								aux = ', ';
							} else {
								aux = '';
							}
							html += aux + updateInput(recount, textP, textS, type, $input);
						}
						return html;

					};
					adultRecount = $(this).next().find($peopleAdult).text();
					childrenRecount = $(this).next().find($peopleChildren).text();
					babiesRecount = $(this).next().find($peopleBabies).text();
					seniorRecount = $(this).next().find($peopleSenior).text();
					youngRecount = $(this).next().find($peopleYoung).text();
					$(this).next().find(people).text(numTeenager);

					html = _print(seniorRecount, 'senior', 'text-seniors', 'text-senior');
					html = _print(adultRecount, 'adult', 'text-adults', 'text-adult');
					html = _print(youngRecount, 'young', 'text-youngs', 'text-young');
					html = _print(numTeenager, 'teenager', 'text-teenagers', 'text-teenager');
					html = _print(childrenRecount, 'children', 'text-children', 'text-child');
					html = _print(babiesRecount, 'baby', 'text-babies', 'text-baby');

					$(this).text(html);
					$(this).val(html);
					$(this).addClass('fc-updateTeenager-loaded');
				}
			});

			updateColor(selector);
		}
		if (!$container.hasClass('save')) {
			$container.addClass('save');
		}

		$(selector).data('teenagerSave', numTeenager);

	};

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////// SEARCHER VINTAGE /////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////// Function to save passenger ///////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	var savePassenger = function (button, selector) {
		var $container = button.parent().find('.ibe-people-counter').length ? button.parent().find('.ibe-people-counter') :
			button.closest('.ibe_form__group').find('.ibe-people-counter');
		var $agesBox, $inputAge, $agesValue;
		$(selector).data('seniorSave', $container.find('[data-people-type="senior"]').text());
		$(selector).data('adultSave', $container.find('[data-people-type="adult"]').text());
		$(selector).data('youngSave', $container.find('[data-people-type="young"]').text());
		$(selector).data('teenagerSave', $container.find('[data-people-type="teenager"]').text());
		$(selector).data('childrenSave', $container.find('[data-people-type="children"]').text());
		$(selector).data('babiesSave', $container.find('[data-people-type="babies"]').text());


		if ($(selector).data('childrenSave') !== '0') {
			$agesBox = $container.find('.ibe-people-counter__ages');
			$inputAge = $agesBox.find('.selectize-input');
			$(selector).data('agesSave', []);

			$inputAge.each(function () {
				$agesValue = $(this).find('[data-value]').text();
				$(selector).data('agesSave').push($agesValue);
			});
		}

		$container.addClass('save');


	};
	///////////////////////////// Restore values in modal mode where click X /////////////////////////////////////////
	var restorePassenger = function (button, selector) {
		var $save = button.parent().find('.ibe-modal__button-save').length ? button.parent().find('.ibe-modal__button-save') :
			button.parent().find('.ibe-dinamic-modal__button--save'),
			$container = $save.parent().find('.ibe-people-counter').length ? $save.parent().find('.ibe-people-counter') :
				$save.closest('.ibe_form__group').find('.ibe-people-counter'),
			$list = $container.find('.ibe-people-counter__list'),
			$people = $list.find('.ibe-people-counter__list-item > [data-people-type]'),
			$ages = $container.find('.ibe-people-counter__ages');

		if ($container.hasClass('save')) {
			$people.each(function () {
				var $type = $(this).attr('data-people-type');
				var i;

				switch ($type) {
					case 'adult':
						if ($(this).text() !== $(selector).data('adultSave')) {
							if ($(selector).data('adultSave') == '0') {
								$(this).removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
							}
							updateResults(selector, $(selector).data('adultSave'), $peopleAdult);
						}
						break;
					case 'senior':
						if ($(this).text() !== $(selector).data('seniorSave')) {
							if ($(selector).data('seniorSave') == '0') {
								$(this).removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
							}
							updateResults(selector, $(selector).data('seniorSave'), $peopleSenior);
						}
						break;
					case 'young':
						if ($(this).text() !== $(selector).data('youngSave')) {
							if ($(selector).data('youngSave') == '0') {
								$(this).removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
							}
							updateResults(selector, $(selector).data('youngSave'), $peopleYoung);
						}
						break;
					case 'teenager':
						if ($(this).text() !== $(selector).data('teenagerSave')) {
							if ($(selector).data('teenagerSave') == '0') {
								$(this).removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
							}
							updateResults(selector, $(selector).data('teenagerSave'), $peopleTeenager);
						}
						break;
					case 'babies':
						if ($(this).text() !== $(selector).data('babiesSave')) {
							if ($(selector).data('babiesSave') == '0') {
								$(this).removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
							}
							updateResults(selector, $(selector).data('babiesSave'), $peopleBabies);
						}
						break;
					case 'children':
						if ($(this).text() !== $(selector).data('childrenSave')) {
							if ($(selector).data('childrenSave') == '0') {
								$(this).removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
							}
							updateResults(selector, $(selector).data('childrenSave'), $peopleChildren);
						}
						break;
				}

				//Actualizar las edades de los niños
				if ($(selector).data('agesSave') !== undefined) {
					if ($(selector).parent().find('.ibe-people-counter').length > 0) {
						for (i = 0; i <= $(selector).data('agesSave').length - 1; i++) {
							if ($(selector).parent().find('#Vchildren_' + i).length > 0) {
								$(selector).parent().find('.ibe-people-counter__ages').find('#Vchildren_' + (i))[0].selectize.setValue($(selector).data('agesSave')[i]);
							}
							if ($(selector).parent().find('#VCchildren_' + i).length > 0) {
								$(selector).parent().find('.ibe-people-counter__ages').find('#VCchildren_' + (i))[0].selectize.setValue($(selector).data('agesSave')[i]);
							}
						}
					}
				}
			})

			updateColor(selector);
		} else {
			$people.each(function () {
				var i, $inputAge;
				var $type = $(this).attr('data-people-type');

				switch ($type) {
					case 'adult':
						if ($(this).text() !== '1') {
							updateResults(selector, 1, $peopleAdult);
						}
						break;
					case 'senior':
						if ($(this).text() !== '0') {
							$(this).removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
							updateResults(selector, 0, $peopleSenior);
						}
						break;
					case 'young':
						if ($(this).text() !== '0') {
							$(this).removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
							updateResults(selector, 0, $peopleYoung);
						}
						break;
					case 'teenager':
						if ($(this).text() !== '0') {
							$(this).removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
							updateResults(selector, 0, $peopleTeenager);
						}
						break;
					case 'babies':
						if ($(this).text() !== '0') {
							$(this).removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
							updateResults(selector, 0, $peopleBabies);
						}
						break;
					case 'children':
						if ($(this).text() !== '0') {
							$(this).removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
							updateResults(selector, 0, $peopleChildren);
							$ages.css('display', 'none');
							$inputAge = $ages.find('.selectize-input');

							for (i = 0; i <= $inputAge.length - 1; i++) {
								if ($(selector).parent().find('#Vchildren_' + i).length > 0) {
									$(selector).parent().find('.ibe-people-counter__ages').find('#Vchildren_' + (i))[0].selectize.setValue('02');
								}
								if ($(selector).parent().find('#VCchildren_' + i).length > 0) {
									$(selector).parent().find('.ibe-people-counter__ages').find('#VCchildren_' + (i))[0].selectize.setValue('02');
								}
							}
						}
						break;
				}
			})

			updateColor(selector);

		}
	}

	var deleteBabies = function (status, select) {
		var itemBaby = select.find('[data-people-type="babies"]').closest('.ibe-people-counter__list-item');
		if (status) {
			itemBaby.addClass('hidden');
		} else {
			itemBaby.removeClass('hidden');
		}
	};

	var getBabies = function (select) {
		return select.find('[data-people-type="babies"]').text();
	};

	var showMessageAviosBabies = function (status, select) {
		var itemBaby = select.find('.fc-people-counter-babies'),
			counterItem = itemBaby.find('[data-people-counter="counter"]'),
			$babiesMessage = select.find('[data-validate="baby-redemption"]'),
			important = select.find('.fc-people-counter-important');

		if (status) {
			$babiesMessage.removeClass('hidden');
			$babiesMessage.closest('.ibe_form__group').addClass('ibe_form__group--error');
			counterItem.html('0');
			counterItem.addClass('ibe-people-counter__counter--none');
			itemBaby.addClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').attr('disabled', 'disabled');
			itemBaby.addClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').trigger('click');
			itemBaby.addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').attr('disabled', 'disabled');
			itemBaby.addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').addClass('ibe-people-counter__buttons-no-hover');
			itemBaby.find('.ibe-people-counter__message').addClass('active');
		} else {
			$babiesMessage.addClass('hidden');
			$babiesMessage.closest('.ibe_form__group').removeClass('ibe_form__group--error');
			if(!parseInt(itemBaby.find('[data-people-type="babies"]').html())>=1) {
				itemBaby.addClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').attr('disabled', 'disabled');
			} else {
				itemBaby.removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').removeAttr('disabled');
			}
			if (parseInt(itemBaby.find('[data-people-type="babies"]').html()) < getSumCountersObj(important)) {
				itemBaby.removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').removeAttr('disabled');
				itemBaby.removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').removeClass('ibe-people-counter__buttons-no-hover');
				
			} /*else {
				itemBaby.addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').attr('disabled','disabled');
				itemBaby.addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').addClass('ibe-people-counter__buttons-no-hover');
			
			}*/
			itemBaby.find('.ibe-people-counter__message').removeClass('active');
			
		}
	};

	var changeCheckAviosSearch = function (e) {   
		var $target = $(e.target) || $(e.srcElement),
			$form = $target.closest('[data-parent-avios]'),
			$babiesMessage = $form.find('[data-validate="baby-redemption"]');
		$('.ibe-people-counter').on('shown.bs.collapse', function () {
			if ($target.is(':checked')) {
				$babiesMessage.addClass('hidden');
				$babiesMessage.closest('.ibe_form__group').removeClass('ibe_form__group--error');
			}
		});
    // Comentamos esta parte para poder seleccionar la parte de beber en pagar con avios
		// if ($target.is(':checked')) {
		// 	$form.find('.fc-people-counter-babies').addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').attr('disabled', 'disabled');
		// 	if (getBabies($form) > 0) {
		// 		showMessageAviosBabies(true, $form);
		// 	} else {
		// 		$form.find('.fc-people-counter-babies .ibe-people-counter__message').addClass('active');
		// 		$form.find('.fc-people-counter-babies').find('[data-people-counter-button="more"]').addClass('ibe-people-counter__buttons-no-hover');
		// 	}
		// } else {
		// 	showMessageAviosBabies(false, $form);
		// }
	};


	//dFrontJs.ibe_searcher_people_counter.checkPassenger('active','senior', '#form1')
	var checkPassenger = function (state, typePassenger, form) {
		var $state = state !== undefined ? state : 'active';
		var $typePassenger = typePassenger !== undefined ? typePassenger : 'senior';
		var $form = form !== undefined ? $(form) : $('form:visible');
		var $babiesMessage = $form.find('[data-validate="baby-redemption"]');

		$('.ibe-people-counter').on('shown.bs.collapse', function () {
			$babiesMessage.addClass('hidden');
			$babiesMessage.closest('.ibe_form__group').removeClass('ibe_form__group--error');
		});

		if ($state === 'active') {
			$form.find('.ibe-people-counter [data-people-type="' + $typePassenger + '"]').parent().removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').removeAttr('disabled');
			$form.find('.ibe-people-counter [data-people-type="' + $typePassenger + '"]').parent().find('.ibe-people-counter__message').removeClass('active');
			$babiesMessage.addClass('hidden');
			$babiesMessage.closest('.ibe_form__group').removeClass('ibe_form__group--error');
		} else {
			$form.find('.ibe-people-counter [data-people-type="' + $typePassenger + '"]').parent().addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').attr('disabled', 'disabled');
			$form.find('.ibe-people-counter [data-people-type="' + $typePassenger + '"]').parent().find('.ibe-people-counter__message').addClass('active');
			$babiesMessage.removeClass('hidden');
			$babiesMessage.closest('.ibe_form__group').addClass('ibe_form__group--error');
		}

	};

	// When you open the selector, take the focus so that it does not close automatically
	if (window.innerWidth > dFrontJs.resolutions.lg) {
		// When you open the selector, take the focus so that it does not close automatically
		$('.ibe-people-counter').on('shown.bs.collapse', function () {
			$(this).attr('tabindex', '0').addClass('ibe-people-counter--focus-not-border').focus();
			$('.ibe-searcher__col--alt').scrollTop(0);
		});
	}


	//Public functions
	return {
		'init': init,
		'updateResultsAdult': updateResultsAdult,
		'updateResultsChildren': updateResultsChildren,
		'updateResultsBabies': updateResultsBabies,
		'updateResultsSenior': updateResultsSenior,
		'updateResultsYoung': updateResultsYoung,
		'updateResultsTeenager': updateResultsTeenager,
		'savePassenger': savePassenger,
		'restorePassenger': restorePassenger,
		'getBabies':  getBabies,
		'deleteBabies':  deleteBabies,
		'showMessageAviosBabies':  showMessageAviosBabies,
		'changeCheckAviosSearch':  changeCheckAviosSearch,
		'checkPassenger': checkPassenger
	}
}(jQuery);
