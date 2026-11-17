//**********************************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: People counter
//    Descripcion: Funcion para seleccionar pasajeros en buscador de hotel - Versión Selectmenu
//**********************************************************************************************/
dFrontJs.ibe_searcher_people_counter_selectmenu = function () {
	/*eslint no-underscore-dangle: ["error", { "allow": ["__constructor"] }]*/
	//Variables
	var $obj = 0,
		$input = 0,
		$list = 0,
		$parent = 0,
		$important = 0,
		$babies = 0,
		$counter = 0,
		$babiesCount = 0;
	var $agesList = ['02', '02', '02', '02', '02', '02', '02', '02'];
	//Constructor
	var __constructor = function ($this) {
		$obj = $this;
		$form = $this.parents('.ibe_form__group'),
			$input = $form.find('.ibe_form__input-text'),
			$list = $this.parents('.ibe-people-counter__list');
		$parent = $this.parents('.ibe-people-counter__list-item');
		$count = $parent.find('[data-people-counter-selectmenu="counter"]');
		$important = $list.find('.fc-people-counter-important-selectmenu');
		$babies = $list.find('.fc-people-counter-babies-selectmenu');
		$babiesCount = $list.find('.fc-people-counter-babies-selectmenu').find('[data-people-counter-selectmenu="counter"]');
	};
	//Restamos o sumamos al contador actual
	var lessOrPlus = function () {
		c = parseInt($count.text());
		($obj.data('people-counter-button-selectmenu') === 'less') ? c-- : c++;
		return c;
	};
	//Devuelve el numero maximo de personas
	var getNumberOrPeople = function () {
		var n = 0;
		$.each($list.find('.ibe-people-counter__list-item').not($parent).not($babies), function () {
			n = n + parseInt($(this).find('[data-people-counter-selectmenu="counter"]').html());
		});
		n = n + countNumber;
		return n;
	};
	//Recorre el objeto que se le pasa por parametro y suma sus contadores
	var getSumCountersObj = function ($o) {
		var i = 0;
		$.each($o, function () {
			i = i + parseInt($(this).find('[data-people-counter-selectmenu="counter"]').text());
		});
		return i;
	};
	//Actualiza y guarda las edades seleccionadas al añadir o eliminar niños
	var updateAgesList = function (array) {
		setTimeout(function () {
			var i;
			for (i = 0; i < array.length; i++) {
				$agesList[i] = array.eq(i).val();
			}
		}, 500);
	}
	//Guarda los valores de las edades cuando éstos cambian su valor
	var udpdateValueChildren = function () {
		$('.fc-people-counter-children-selectmenu select').on('change', function () {
			updateAgesList($('.fc-people-counter-children-selectmenu select'));
		});
	};
	//Validaciones visuales
	var visualValidations = function ($o) {
		var sumChil, sumMin;
		if ($($parent).parents('[data-validate-searcher]').length) {
			if ($babiesCount.html() === getSumCountersObj($important)) {
				$list.find('.fc-people-counter-babies-selectmenu').addClass('ibe-people-counter__item-plus').find('[data-people-counter-button-selectmenu="more"]').attr('disabled', 'disabled');
			} else {
				$list.find('.fc-people-counter-babies-selectmenu').removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button-selectmenu="more"]').removeAttr('disabled');
			}
			$list.find('[data-people-counter-selectmenu="counter"]').each(function () {
				if ($(this).html() === 0) {
					$(this).parent().addClass('ibe-people-counter__item-minus').find('[data-people-counter-button-selectmenu="less"]').attr('disabled', 'disabled');
				} else if ($(this).html() > 1) {
					$(this).parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button-selectmenu="less"]').removeAttr('disabled');
				}
			});
			switch (getSumCountersObj($important) + getSumCountersObj($list.find('.fc-people-counter-children-selectmenu'))) {
				case 1:
					$list.find('[data-people-counter-selectmenu="counter"]').each(function () {
						if ($(this).html() === 1) {
							$(this).parent().addClass('ibe-people-counter__item-minus').find('[data-people-counter-button-selectmenu="less"]').attr('disabled', 'disabled');
						}
					});
					break;
				case 9:
					$important.addClass('ibe-people-counter__item-plus').find('[data-people-counter-button-selectmenu="more"]').attr('disabled', 'disabled');
					$list.find('.fc-people-counter-children-selectmenu').addClass('ibe-people-counter__item-plus').find('[data-people-counter-button-selectmenu="more"]').attr('disabled', 'disabled');
					break;
				default:
					if (getSumCountersObj($important) > 1) {//>=0 para que niños puedan viajar solos sino >1
						$important.find('[data-people-counter-selectmenu="counter"]').each(function () {
							if ($(this).html() > 0) {
								$(this).parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button-selectmenu="less"]').removeAttr('disabled');
							}
						});
					} else {
						$important.find('[data-people-counter-selectmenu="counter"]').each(function () {
							if ($(this).html() > 0) {
								$(this).parent().addClass('ibe-people-counter__item-minus').find('[data-people-counter-button-selectmenu="less"]').attr('disabled', 'disabled');
							}
						});
					}
					$list.find('.fc-people-counter-children-selectmenu [data-people-counter-selectmenu="counter"]').each(function () {//toggle para que niños no puedan viajar solos
						if ($(this).html() > 0) {
							$(this).parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button-selectmenu="less"]').removeAttr('disabled');
						}
					});
					$important.removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button-selectmenu="more"]').removeAttr('disabled');
					$list.find('.fc-people-counter-children-selectmenu').removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button-selectmenu="more"]').removeAttr('disabled');
			}
			if ($babiesCount.html() >= 1) {
				$babiesCount.parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button-selectmenu="less"]').removeAttr('disabled');
			}
			sumChil = parseInt($list.find('.fc-people-counter-children-selectmenu [data-people-counter-selectmenu="counter"]').html());
			sumMin = sumChil + parseInt($babiesCount.html());
			if (sumMin > 2 * getSumCountersObj($important) && getSumCountersObj($important) !== 0) {
				$list.find('.fc-people-counter-children-selectmenu').removeClass('ibe-people-counter__item-children-alone');
				$list.find('.fc-people-counter-children-selectmenu').addClass('ibe-people-counter__item-children');
			} else if (sumChil > 0 && getSumCountersObj($important) === 0) {
				$list.find('.fc-people-counter-children-selectmenu').removeClass('ibe-people-counter__item-children');
				$list.find('.fc-people-counter-children-selectmenu').addClass('ibe-people-counter__item-children-alone');
			} else {
				$list.find('.fc-people-counter-children-selectmenu').removeClass('ibe-people-counter__item-children');
				$list.find('.fc-people-counter-children-selectmenu').removeClass('ibe-people-counter__item-children-alone');
			}
		}
	}
	//Mostrar las edades de los niños
	var showChildrenAges = function () {
		var $ages = $parent.find('.ibe-people-counter__ages'),
			$selectors = $parent.find('.ibe_form__selectize-multi__selectors'),
			html, selected, i, j, ages;
		//Con el siguiente data distinguimos los distintos ids de los elementos de los formularios en cada tab
		var id = $list.attr('data-id');
		$selectors.html('');
		if (countNumber <= 0) {
			$ages.css('display', 'none');
		} else {
			html = '';
			ages = ['02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];
			for (i = 0; i < countNumber; i++) {
				html += '<label class="hideAccessible" for="' + id + 'children_' + i + '">Ni&ntilde;o ' + i + '</label>' +
					'<select class="ibe-select ibe-select--selectize" name="' + id + 'children_' + i + '" data-selectmenu-edit id="' + id + 'children_' + i + '">';
				selected = $agesList[i];
				for (j = 0; j < ages.length; j++) {
					if (ages[j] === selected) {
						html += '<option value="' + ages[j] + '" selected>' + ages[j] + '</option>';
					} else {
						html += '<option value="' + ages[j] + '">' + ages[j] + '</option>';
					}
				}
				html += '</select>';
			}
			$selectors.append(html);
			dFrontJs.ibe_selectmenu.init();
			$('[data-selectmenu-edit]').siblings('.custom-combobox').removeClass('ibe-select__edit--open');
			$('[data-selectmenu-edit]').siblings('.custom-combobox').find('.ibe-select__autocomplete').hide();
			udpdateValueChildren();
			setTimeout(function () {
				$ages.css('display', 'block');
			}, 100);
		}
	};
	//Init
	var init = function () {
		$('[data-validate-searcher] .fc-people-counter-babies-selectmenu [data-people-counter-button-selectmenu="less"]').each(function () {
			__constructor($(this));
			visualValidations($(this));
		});
		$('[data-people-counter-button-selectmenu]').on('click', function (e) {
			var classPlus = 'ibe-people-counter__counter--plus',
				classNone = 'ibe-people-counter__counter--none',
				i, b, j, total, recount, html;
			__constructor($(this));
			//Recogemos el valor actual del contador
			countNumber = lessOrPlus();
			//Recogemos el numero maximo de personas
			nine = getNumberOrPeople();
			//Si es adulto (Senior, Adulto, Jovenes)
			if ($parent.hasClass('fc-people-counter-important-selectmenu') && nine <= 9) {
				i = getSumCountersObj($important.not($parent));
				if (countNumber <= 0) {
					countNumber = 0;
					//toggle para que niños no puedan viajar solos( cambiar también el visual )
					if (i <= 0) {
						countNumber = 1;
					}
				}
				$count.html(countNumber);
				total = getSumCountersObj($important);
				if ($parent.hasClass('fc-people-counter-important-selectmenu')) {
					//Comprobar numero de bebes
					b = parseInt($babies.find('[data-people-counter-selectmenu="counter"]').text());
					if (total < b) {
						$babies.find('[data-people-counter-selectmenu="counter"]').html(total);
					}
				}
				//Si es bebé
			} else if ($parent.hasClass('fc-people-counter-babies-selectmenu')) {
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
			} else if ($parent.hasClass('fc-people-counter-children-selectmenu') && nine <= 9) {
				if (countNumber > 9) {
					countNumber = 9;
				} else if (countNumber < 0) {
					countNumber = 0;
				}
				$count.html(countNumber);
				//Edades de los niños
				showChildrenAges();
			}
			//Aplicar estilos --plus/--none
			if (nine <= 9) {
				(countNumber > 0) ? $count.addClass(classPlus).removeClass(classNone) : $count.addClass(classNone).removeClass(classPlus);
			} else if (nine > 9) {
				if (!parseInt($babiesCount.html()) === 0) {
					(countNumber > 0) ? $babiesCount.addClass(classPlus).removeClass(classNone) : $babiesCount.addClass(classNone).removeClass(classPlus);
				} else {
					$babiesCount.addClass(classNone).removeClass(classPlus);
				}

			}
			//Validaciones visuales
			visualValidations($(this));
			//Recuento
			recount = getSumCountersObj($list.find('.ibe-people-counter__list-item').not('.fc-people-counter-babies-selectmenu'));
			//Numero de pasajeros en el input principal
			html = (recount > 1) ? recount + ' ' + $input.data('text-passenger') : $input.data('value');
			$input.val(html);
		});
	}
	//Public functions
	return {
		'init': init
	}
}(jQuery);
