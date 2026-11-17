//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: rooms
//    Descripcion: Funcion para seleccionar habitaciones en buscador de hotel
//******************************************************************************/
/*eslint no-underscore-dangle: ['error', { 'allow': ['_updateAgesList', '_updateValueChildren'] }]*/
dFrontJs.ibe_searcher_room = function () {
	var $countRoom = 1;
	var $agesList1 = ['02', '02', '02', '02', '02', '02', '02', '02', '02'];
	var $agesList2 = ['02', '02', '02', '02', '02', '02', '02', '02', '02'];
	var $agesList3 = ['02', '02', '02', '02', '02', '02', '02', '02', '02'];
	var $agesList4 = ['02', '02', '02', '02', '02', '02', '02', '02', '02'];
	//Actualiza y guarda las edades seleccionadas al añadir o eliminar niños
	var _updateAgesList = function (e) {
		var array = $('[data-searcher-room="children-ages"]');
		var i;
		array.each(function (index, value) {
			for (i = 0; i < $(array).eq(index).find('select').length; i++) {
				switch (index) {
					case 0:
						$agesList1[i] = array.eq(index).find('select').eq(i).val();
						break;
					case 1:
						$agesList2[i] = array.eq(index).find('select').eq(i).val();
						break;
					case 2:
						$agesList3[i] = array.eq(index).find('select').eq(i).val();
						break;
					case 3:
						$agesList4[i] = array.eq(index).find('select').eq(i).val();
						break;
				}
			}
		});
	};
	//Cambiar tamaño del contenedor por si hay seleccionado mas de 8 niños
	var testingNumberChildrenRoom = function ($container) {
		var $this = $(this),
			child = false,
			classExtend = 'ibe-searcher-room--extend';
		$container.find('[data-searcher-room="children"]').each(function () {
			if ($(this).val() > 4) {
				child = true;
			}
		});
		if (child) {
			$container.addClass(classExtend);
		} else {
			$container.removeClass(classExtend);
		}
	}; //testingNumberChildrenRoom

	//Cambiar numero de habitaciones del input principal
	var changeTextInput = function ($this) {
		var $button = $this.parents('.ibe_form__group').find('.ibe_form__input-text').not('[data-select-rooms]'),
			rooms = $this.find('[data-searcher-room^="room-"]').length,
			text = ' ' + $button.attr('data-text-room'),
			$input = $('[data-select-rooms="select"]');
		text = (rooms > 1) ? ' ' + $button.attr('data-text-room-plural') : ' ' + $button.attr('data-text-room');
		$button.val(rooms + text);
		$button.text(rooms + text);
		if ($input.length > 0) {
			$input.val(rooms);
			$input.selectmenu('refresh');
		}
	}; //changeTextInput

	//Devuelve el html para añadir habitaciones
	var addNewRoom = function ($room, sequence, index) {
		var html = $room.find('[data-template-searcher-room]').html();
		html = html.replace(/{{index}}/g, index);
		html = html.replace(/{{sequence}}/g, sequence);

		return html;
	};//addNewRoom

	var roomsModify = function ($room, sequence, index) {
		var html = $room.find('[data-template-searcher-room]').html();
		html = html.replace(/{{index}}/g, index);
		html = html.replace(/{{sequence}}/g, sequence);

		return html;
	};//roomsModify
	//Devuelve el numero maximo de personas en todas las habitaciones
	var numMaxPeopleRooms = function ($obj) {
		//Numero maximo de personas en total en todas las habitaciones
		var i = 0;
		$obj.each(function () {
			var aux = parseInt($(this).val());
			if (aux) {
				i = (i + aux);
			}
		});
		return i;
	};//numMaxPeopleRooms
	//Desactiva o activar inputs dependiente del numero de personas
	var disabledEnabledInputs = function ($rooms, numMaxPeople) {
		var $obj = $rooms.find('[data-selectize-multi="hide-label"]').not('[data-searcher-room="babies"]');
		if (numMaxPeople >= 9) {
			$.each($obj, function () {
				var $this = $(this);
				if ($this.val() <= 0) {
					$this[0].selectize.disable();
					$this.parents('.ibe_form__selectize-multi').addClass('ibe_form__selectize-multi--disabled');
				} else {
					$(this).parents('.ibe_form__selectize-multi').removeClass('ibe_form__selectize-multi--disabled');
				}

			});
			$.each($rooms.find('[data-searcher-room^="room-"]'), function () {
				var $this = $(this);
				if ($this.find('[data-searcher-room="adults"]').val() <= 0) {
					$this.find('[data-searcher-room="babies"]')[0].selectize.disable();
					$this.find('[data-searcher-room="babies"]').parents('.ibe_form__selectize-multi').addClass('ibe_form__selectize-multi--disabled');
				}
			});
		} else {
			$.each($rooms.find('[data-selectize-multi="hide-label"]'), function () {
				$(this)[0].selectize.enable();
				$(this).parents('.ibe_form__selectize-multi').removeClass('ibe_form__selectize-multi--disabled');
			});
		}
	};//disabledEnabledInputs
	//Cambiar texto añadir habitaciones
	var changeTextButtonAddRooms = function ($container) {
		var $button = $container.find('[data-searcher-room="add-room"]'),
			$txtComplete = $container.find('[data-no-more-rooms="true"]'),
			lng = $container.find('[data-searcher-room^="room-"]').length;
		if (lng >= 4) {
			$txtComplete.css('display', 'inline-block');
			$button.hide();
		} else {
			$txtComplete.css('display', 'none');
			$button.show();
		}
	};//changeTextButtonAddRooms
	// Inicia por defecto con un adulto al añadir adultos
	var initAdults = function ($rooms, numMaxPeople) {
		var $objAdult = $rooms.find('[data-selectize-multi="hide-label"]').not('[data-searcher-room="children"]').not('[data-searcher-room="babies"]');
		var $objChildren = $rooms.find('[data-selectize-multi="hide-label"]').not('[data-searcher-room="adults"]').not('[data-searcher-room="babies"]');
		var changed = false;
		if (numMaxPeople >= 9) {
			$.each($objChildren, function () {
				var $this = $(this);
				if ($this.val() > 1) {
					$this[0].selectize.setValue($this.val() - 1);
					changed = true;
					return false;
				}
			});
			if (changed === false) {
				$.each($objAdult, function () {
					var $this = $(this);
					if ($this.val() > 1) {
						$this[0].selectize.setValue($this.val() - 1);
						return false;
					}
				});
			}
		}
	};//initAdults
	//Recalc options of all selects
	var recalculateAllSelects = function ($room) {
		var numMaxPeople = numMaxPeopleRooms($room.find('[data-selectize-multi="hide-label"]').not('[data-searcher-room="babies"]')),
			$selects = $room.find('[data-selectize-multi="hide-label"]').not('[data-searcher-room="babies"]');
		var x, i;
		$.each($selects, function () {
			var $self = $(this),
				selfValue = $self.val(),
				selectJson = [];
			var begin = $($self[0]).attr('data-searcher-room') === 'adults' ? 1 : 0;
			for (x = 9; x > selfValue; x--) {
				$self[0].selectize.removeOption(x);
			}
			for (i = begin; i <= (9 - (numMaxPeople - selfValue)); i++) {
				selectJson.push({'value': i, 'text': i});
			}
			$self[0].selectize.addOption(selectJson);
		});
	};//recalculateAllSelects
	//Guarda los valores de las edades cuando éstos cambian su valor
	var _updateValueChildren = function () {
		var array = $('[data-searcher-room="children-ages"]');
		var $agesList;
		var i;
		array.each(function (index, value) {
			for (i = 0; i < array.eq(index).find('select').length; i++) {
				if (index === 0){
					$agesList = $agesList1;
				} else if (index === 1){
					$agesList = $agesList2;
				}else if (index === 2){
					$agesList = $agesList3;
				}else if (index === 3){
					$agesList = $agesList4;
				}
				array.eq(index).find('select').eq(i)[0].selectize.setValue($agesList[i]);
			}
		});

	};
	//Eliminar Habitaciones
	var deleteRooms = function ($element) {
		var $this = $element,
			index = $this.attr('data-index'),
			$container = $this.parents('.ibe-searcher-room'),
			$rooms = $this.parents('.ibe-searcher-room__container'),
			$room = $container.find('[data-searcher-room^="room-"]'),
			$parent = $this.parents('[data-searcher-room="room-'+ index + '"]'),
			i, j, numMaxPeople;
		$countRoom--;
		if ($room.length > 1) {
			$parent.remove();
			$room = $container.find('[data-searcher-room^="room-"]');
			i = 1;
			$room.each(function () {
				var $this = $(this),
					$number = $this.find('[data-searcher-room="number"]');
				$this.attr('data-index', i);
				$this.attr('data-sequence', i);
				$this.attr('data-searcher-room', 'room-' + i);
				$this.find('[data-searcher-room="delete"]').attr('data-index', i);
				//input adulto
				$this.find('[data-searcher-room="adults"]').parent().find('label').attr('for', $this.find('[data-searcher-room="adults"]').parent().find('label').attr('for').replace($this.find('[data-searcher-room="adults"]').attr('name'), 'adult_' + i));
				$this.find('[data-searcher-room="adults"]').parent().find('.selectize-control input').attr('id', $this.find('[data-searcher-room="adults"]').parent().find('.selectize-control input').attr('id').replace($this.find('[data-searcher-room="adults"]').attr('name'), 'adult_' + i));
				$this.find('[data-searcher-room="adults"]').attr('name', 'adult_' + i).attr('id', 'adult_' + i);
				//niños
				$this.find('[data-searcher-room="children"]').parent().find('label').attr('for', $this.find('[data-searcher-room="children"]').parent().find('label').attr('for').replace($this.find('[data-searcher-room="children"]').attr('name'), 'children_' + i));
				$this.find('[data-searcher-room="children"]').parent().find('.selectize-control input').attr('id', $this.find('[data-searcher-room="children"]').parent().find('.selectize-control input').attr('id').replace($this.find('[data-searcher-room="children"]').attr('name'), 'children_' + i));
				$this.find('[data-searcher-room="children"]').attr('name', 'children_' + i).attr('id', 'children_' + i);
				//bebes
				$this.find('[data-searcher-room="babies"]').parent().find('label').attr('for', $this.find('[data-searcher-room="babies"]').parent().find('label').attr('for').replace($this.find('[data-searcher-room="babies"]').attr('name'), 'baby_' + i));
				$this.find('[data-searcher-room="babies"]').parent().find('.selectize-control input').attr('id', $this.find('[data-searcher-room="babies"]').parent().find('.selectize-control input').attr('id').replace($this.find('[data-searcher-room="babies"]').attr('name'), 'baby_' + i));
				$this.find('[data-searcher-room="babies"]').attr('name', 'baby_' + i).attr('id', 'baby_' + i);
				//edades
				$this.find('[data-searcher-room="children-ages"] select').each(function (actual) {
					var $sel = $(this);
					$sel.parent().find('label').eq(actual).attr('for', $sel.parent().find('label').eq(actual).attr('for').replace($sel.attr('name'), 'room_children_' + i + '-' + (actual + 1)));
					$sel.parent().find('.selectize-control input').eq(actual).attr('id', $sel.parent().find('.selectize-control input').eq(actual).attr('id').replace($sel.attr('name'), 'room_children_' + i + '-' + (actual + 1)));
					$sel.attr('name', 'room_children_' + i + '-' + (actual + 1)).attr('id', 'room_children_' + i + '-' + (actual + 1));
				});
				$number.html(i + 'º');
				i++;

				$room = $this.parents('.ibe-searcher-room');
				$rooms = $this.parents('.ibe-searcher-room__container');
				//Recalcular las opciones de todos los select
				recalculateAllSelects($room);
				//Comprobamos el numero maximo de personas en las habitaciones
				numMaxPeople = numMaxPeopleRooms($rooms.find('[data-selectize-multi="hide-label"]').not('[data-searcher-room="babies"]'));
				if (numMaxPeople > 9) {
					j = (9 - (numMaxPeople - value));
					$this[0].selectize.setValue(j);
				}
				//Desactivar o activar los selectize segun el numero de personas
				disabledEnabledInputs($rooms, numMaxPeople);
			});
			changeTextInput($container);
		}

		changeTextButtonAddRooms($container);
	};

	//Añadir habitaciones
	var addRooms = function ($element) {
		var $container = $element,
			$room = $container.find('.ibe-searcher-room__container'),
			$last = $room.find('[data-searcher-room^="room-"]').last(),
			index = $last.attr('data-index'),
			sequence = $last.attr('data-sequence'),
			numMaxPeople, html, selected;
		index++;
		sequence++;
		$countRoom++;
		if (sequence <= 4) {
			//Comprobamos el numero maximo de personas en las habitaciones
			numMaxPeople = numMaxPeopleRooms($room.find('[data-selectize-multi="hide-label"]').not('[data-searcher-room="babies"]'));
			//Añadimos la nueva habitacion
			html = addNewRoom($room, sequence, index);
			$room.append(html);
			dFrontJs.ibe_combobox.init();
			// Por defecto añade un adulto
			initAdults($room, numMaxPeople);
			selected = 1;
			//Volvemos a recoger el ultimo item
			$last = $room.find('[data-searcher-room^="room-"]').last();
			$last.find('[data-searcher-room="adults"]')[0].selectize.setValue(selected);
			//Desactivar o activar los selectize segun el numero de personas
			disabledEnabledInputs($room, numMaxPeople);
			//Un adulto por defecto al añadir habitacion si el numero de personas no sobrepasa el maximo
			if (numMaxPeople < 9) {
				$last.find('.selectize-control').first().addClass('selectize-control--show-label');
				$last.find('.ibe_form__input-label').first().css('display', 'block');
			}
			//Cambiar estado del input de habitaciones
			changeTextInput($container);
		}
		changeTextButtonAddRooms($container);
	};
	//Inicializar template
	var initTemplate = function (selector) {
		var $templates = $(selector);

		$.each($templates, function () {

			var $this = $(this),
				index = 1,
				sequence = 1,
				$container = $this.parents('.ibe-searcher-room'),
				$room = $container.find('.ibe-searcher-room__container'),
				$firstRoom = $('[data-searcher-room="room-' + index + '"]');

			//Esto seria la funcion addRoom
			var html = addNewRoom($room, index, sequence);
			$room.append(html);
			dFrontJs.ibe_combobox.init();
			$room.find('[data-searcher-room="adults"]')[0].selectize.setValue(2);
			$room.find('[data-searcher-room="adults"]').closest('.ibe_form__selectize-multi--hide-label').find('.ibe_form__input-label').show();
			$room.find('[data-searcher-room="adults"]').siblings('.selectize-control').addClass('selectize-control--show-label');
			//La primera habitacion eliminamos los botones de borrar
			$room.find('[data-searcher-room="delete"]').remove();

			//Seleccionamos 2 adultos por defecto en la primera habitacion
			if ($firstRoom.length > 0) {
				$.each($firstRoom, function () {
					var $this = $(this);
					$this.find('.selectize-control').first().addClass('selectize-control--show-label');
					$this.find('.ibe_form__input-label').first().css('display', 'block');
				});

			}

		});
	};//initTemplate

	var chargeSearcherRoomInit = function(e){
		var positionCounter;
		if (e !== undefined){
			if (!$(this).hasClass('fc-searcher-room-opened')) {
				$(this).addClass('fc-searcher-room-opened');
			}
		}
		$('.ibe-searcher-room').each(function () {
			if (!$(this).hasClass('fc-searcher-room-active')) {

				positionCounter = $('.ibe-people-counter');
				positionCounter.position({
					my: 'right bottom',
					at: 'right bottom',
					collision: 'fit fit'
				});
				initTemplate('[data-template-searcher-room]');
				//Selectize "buscador habitaciones"
				$(document).on('change', '[data-selectize-multi="hide-label"]', function () {
					var $this = $(this),
						value = $this.val(),
						$room = $this.parents('.ibe-searcher-room'),
						$rooms = $this.parents('.ibe-searcher-room__container'),
						$container = $this.parents('[data-searcher-room^="room-"]'),
						$parent = $this.parents('.ibe_form__selectize-multi'),
						$text = $parent.find('.ibe_form__input-label'),
						data, $babies, babiesValue, selectJson, i, countBabies, numMaxPeople, j;
					//Si el valor es cero reseteamos el selectize
					if (value === '0') {
						$this[0].selectize.setValue('');
					}
					//Recalcular las opciones de todos los select
					recalculateAllSelects($room);

					data = $this.data('searcher-room');
					switch (data) {
						case 'adults':
							//Cambiamos el numero maximo de bebes por habitacion/Cambiamos el numero maximo de bebes por habitacion
							$babies = $container.find('[data-searcher-room="babies"]');
							babiesValue = $container.find('[data-searcher-room="babies"]').val();
							selectJson = [];
							$babies[0].selectize.clearOptions();
							for (i = 0; i <= value; i++) {
								selectJson.push({'value': i, 'text': i});
							}

							$babies[0].selectize.addOption(selectJson);

							countBabies = 0;
							$.each($rooms.find('[data-searcher-room="adults"]'), function () {
								countBabies = countBabies + parseInt($(this).val());
							});
							countBabies = $babies.val();
							if (babiesValue > 0) {
								if (babiesValue >= value) {
									$babies[0].selectize.setValue(value);
								} else {
									$babies[0].selectize.setValue(babiesValue);
								}
							}
							break;
						case 'children':
							break;
					}
					//Volvemos a recoger el valor reseteado para evitar errores
					value = $this.val();
					if (value == 0 || value == "") {
						$text.css('display', 'none');
						$parent.find('.selectize-control').removeClass('selectize-control--show-label');
					} else {
						$text.css('display', 'block');
						$parent.find('.selectize-control').addClass('selectize-control--show-label');
					}
					//Comprobamos el numero maximo de personas en las habitaciones
					numMaxPeople = numMaxPeopleRooms($rooms.find('[data-selectize-multi="hide-label"]').not('[data-searcher-room="babies"]'));
					if (numMaxPeople > 9) {
						j = (9 - (numMaxPeople - value));
						$this[0].selectize.setValue(j);
					}
					//Desactivar o activar los selectize segun el numero de personas
					disabledEnabledInputs($rooms, numMaxPeople);
					//Elegir la edad en el buscador (searcher)
				}).on('change', '[data-searcher-room="children"]', function (e) {
					var $this = $(this),
						value = $this.val(),
						$container = $this.parents('.ibe-searcher-room'),
						$parent = $this.parents('.ibe-searcher-room__item'),
						$collapse = $parent.find('[data-searcher-room="children-ages"]'),
						html, minAges, maxAges, options, countRoom, classLabel, template, tpl, i, select, newIndex;

					if (value == 0 || value == "") {
						$collapse.find('.ibe-searcher-room__column-ages').find('.ibe_form__selectize-multi__selectors').html('');
						$collapse.css('display', 'none');
					} else {
						html = '';
						minAges = $collapse.data('min-ages') || 2;
						maxAges = $collapse.data('max-ages') || 17;
						options = '';
						countRoom = $(this).parents('[data-searcher-room]').find('[data-searcher-room="number"]').text().substring(0, 1);
						classLabel = 'hideAccesible';
						template = $('[data-select-children-years]').html();
						tpl = '';
						if (template){
							for (i = 1; i <= value; i++) {
								tpl = template.replace(/{{countRoom}}/g, countRoom);
								tpl = template.replace(/{{index}}/g, i);
								html += tpl;
							}
							$collapse.find('.ibe-searcher-room__column-ages').find('.ibe_form__selectize-multi__selectors').html(html);
							if (!maxAges){
								select = $collapse.find('.ibe-searcher-room__column-ages').find('.ibe_form__selectize-multi__selectors').find('select');
								select.find('option').remove();
								for (newIndex = minAges; newIndex <= maxAges; newIndex++) {
									if (newIndex < 10){
										options += '<option value="0' + newIndex + '">0' + newIndex + '</option>'
									} else{
										options += '<option value="' + newIndex + '">' + newIndex + '</option>'
									}
								}
								select.append(options);
							}
						} else{
							for (i = 1; i <= value; i++) {
								if ($collapse.parents('.ibe-advanced-searcher').length > 0){
									html += '<div class="ibe_form__selectize-multi-min">';
									classLabel = 'ibe_form__input-label-min';
								}
								html += '<label for="room_children_' + countRoom + '-' + i + '" class="'+classLabel+'">Edad ni&ntilde;o ' + i + '</label>' +
									'<select name="room_children_' + countRoom + '-' + i + '" data-selectize="simple" id="room_children_' + countRoom + '-' + i + '" class="ibe_form__selectize">';
								for (newIndex = minAges; newIndex <= maxAges; newIndex++) {
									if (newIndex < 10){
										html += '<option value="0' + newIndex + '">0' + newIndex + '</option>';
									} else{
										html += '<option value="' + newIndex + '">' + newIndex + '</option>';
									}
								}
								html += '</select>';
								if ($collapse.parents('.ibe-advanced-searcher').length > 0){
									html += '</div>';
								}
							}
							$collapse.find('.ibe-searcher-room__column-ages').find('.ibe_form__selectize-multi__selectors').html(html);
						}

						dFrontJs.ibe_combobox.init();
						dFrontJs.ibe_tooltip.init();


						$('[data-searcher-room="children-ages"]').off('change', _updateAgesList);
						$.when(_updateValueChildren(e)).then($('[data-searcher-room="children-ages"]').on('change', _updateAgesList));



						setTimeout(function () {

							if (window.innerWidth > 600 && $('[data-searcher-room="children-ages"]').parents('.ibe-advanced-searcher__separator').length === 0) {
								$collapse.css('display', 'inline-block');
							} else {
								$collapse.css('display', 'block');
							}
						}, 100);
					}
					testingNumberChildrenRoom($container);
					//Eliminar linea de habitacion
				}).on('click', '[data-searcher-room="delete"]', function (e) {
					deleteRooms($(this));
					e.stopPropagation();
					//Añadir nueva habitacion
				}).on('click', '[data-searcher-room="add-room"]', function (e) {
					addRooms($(this).parents('.ibe-searcher-room'));
				}).on('selectmenuchange', '[data-select-rooms="select"]', function () {
					var $this = $(this),
						sVal = $this.val(),
						$container = $this.parent().closest('[data-select-rooms]').find('.ibe-searcher-room'),
						$room = $container.find('.ibe-searcher-room__container'),
						$last = $room.find('[data-searcher-room^="room-"]').last(),
						index = $last.attr('data-index'),
						sequence = $last.attr('data-sequence'),
						i, numMaxPeople, html, selected;
					if (sVal > sequence) {
						sVal = sVal - sequence;
						for (i = 0; i < sVal; i++) {
							index++;
							sequence++;
							$countRoom++;
							//Comprobamos el numero maximo de personas en las habitaciones
							numMaxPeople = numMaxPeopleRooms($room.find('[data-selectize-multi="hide-label"]').not('[data-searcher-room="babies"]'));
							//Añadimos la nueva habitacion
							html = addNewRoom($room, sequence, index);
							$room.append(html);
							dFrontJs.ibe_combobox.init();
							// Por defecto añade un adulto
							initAdults($room, numMaxPeople);
							selected = 1;
							//Volvemos a recoger el ultimo item
							$last = $room.find('[data-searcher-room^="room-"]').last();
							$last.find('[data-searcher-room="adults"]')[0].selectize.setValue(selected);
							//Desactivar o activar los selectize segun el numero de personas
							disabledEnabledInputs($room, numMaxPeople);
							//Un adulto por defecto al añadir habitacion si el numero de personas no sobrepasa el maximo
							if (numMaxPeople < 9) {
								$last.find('.selectize-control').first().addClass('selectize-control--show-label');
								$last.find('.ibe_form__input-label').first().css('display', 'block');
							}
						}
					} else if (sequence > sVal) {
						sVal = sequence - sVal;
						for (i = 0; i < sVal; i++) {
							$room.find('[data-searcher-room^="room-"]').last().remove();
							recalculateAllSelects($room);
							if (numMaxPeople < 9) {
								$last.find('.selectize-control').first().addClass('selectize-control--show-label');
								$last.find('.ibe_form__input-label').first().css('display', 'block');
							}
							disabledEnabledInputs($room, numMaxPeople);
						}
					}
				});
				$(this).addClass('fc-searcher-room-active');
			}
		});
	};
	//Eventos jquery
	var init = function () {
		if ($('.ibe-advanced-searcher').length > 0){
			chargeSearcherRoomInit();
		}
		$('[data-text-room]').off('click',chargeSearcherRoomInit);
		$('[data-text-room]').on('click',chargeSearcherRoomInit);

	};
	//public functions

	//Actualizar Habitaciones
	// Example: dFrontJs.ibe_searcher_room.updateRooms("#searcher-rooms-1",4)
	var updateRooms = function (selector, numberRooms) {
		var sequence, i;
		sequence = $(selector).find('.ibe-searcher-room__container [data-searcher-room^="room-"]').last().attr('data-sequence');
		if (numberRooms > sequence) {
			for (i = sequence; numberRooms > i; i++) {
				addRooms($(selector));
			}
		} else {
			for (i = numberRooms; sequence > i; i++) {
				deleteRooms($(selector).find('.ibe-searcher-room__container [data-searcher-room^="room-"]').last().find('[data-searcher-room="delete"]'));
			}
		}
	};

	//Actualizar numero de adultos
	// Example: dFrontJs.ibe_searcher_room.updateAdults("#searcher-rooms-1",1,3)
	var updateAdults = function (selector, room, numberAdult) {
		var $numberAdult = numberAdult || 0;
		if ($(selector).find('[data-sequence="' + room + '"]').length > 0) {
			$(selector).find('[data-sequence="' + room + '"]').find($('[data-searcher-room="adults"]'))[0].selectize.setValue($numberAdult);
		}
	};

	//Actualizar numero de niños
	// Example: dFrontJs.ibe_searcher_room.updateChildren("#searcher-rooms-1",1,3)
	var updateChildren = function (selector, room, numberChildren) {
		var $numberChildren = numberChildren || 0;
		if ($(selector).find('[data-sequence="' + room + '"]').length > 0) {
			$(selector).find('[data-sequence="' + room + '"]').find($('[data-searcher-room="children"]'))[0].selectize.setValue($numberChildren);
		}
	};

	//Actualizar numero de bebes
	// Example: dFrontJs.ibe_searcher_room.updateBabies("#searcher-rooms-1",1,3)
	var updateBabies = function (selector, room, numberBabies) {
		var $numberBabies = numberBabies || 0;
		if ($(selector).find('[data-sequence="' + room + '"]').length > 0) {
			$(selector).find('[data-sequence="' + room + '"]').find($('[data-searcher-room="babies"]'))[0].selectize.setValue($numberBabies);
		}
	};

	//Actualizar edades de niños
	// Example: dFrontJs.ibe_searcher_room.updateAgesChildren("#searcher-rooms-1",1,["03","05","10"])
	var updateAgesChildren = function (selector, room, numberAges) {
		var i, $numberAges = numberAges;
		if ($(selector).find('[data-sequence="' + room + '"]').length > 0) {
			for (i = 0; i <= $numberAges.length - 1; i++) {
				if ($(selector).find('[data-sequence="' + room + '"] #room_children_' + room + '-' + (i + 1)).length > 0) {
					$(selector).find('[data-sequence="' + room + '"]').find('#room_children_' + room + '-' + (i + 1))[0].selectize.setValue($numberAges[i]);
				}
			}
		}
	};

	return {
		'init': init,
		'initTemplates': initTemplate,
		'updateRooms': updateRooms,
		'updateAdults': updateAdults,
		'updateChildren': updateChildren,
		'updateBabies': updateBabies,
		'updateAgesChildren': updateAgesChildren,
		'chargeSearcherRoomInit': chargeSearcherRoomInit
	};
}(jQuery);
