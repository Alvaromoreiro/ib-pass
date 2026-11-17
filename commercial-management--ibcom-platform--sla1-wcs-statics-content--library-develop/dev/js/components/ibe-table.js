//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: Table detail
//    Descripcion: Function to show the detail of a row of the table in collapse
//******************************************************************************/
dFrontJs.ibe_data_flight_status_table = function () {
	/*eslint no-underscore-dangle: ['error', { 'allow': ['_closeStructureDetailTable', '_openStructureDetailTable'] }]*/
	var _closeStructureDetailTable = function ($structure) {
		$structure.remove();
	};

	var _openStructureDetailTable = function ($structure, $row) {
		var $atribute = $row.parents('.ibe-tab__container').find('[data-box-detail]'),
			icon = 'ibe-flight-status__icon ibe-flight-status__icon--status icon-' + $($row).data('icon'),
			$copy = $atribute.clone(),
			textColor = '',
			coord,
			detailBox = $('.ibe-table-flight-status__detail-box');

		if ($($row).next('.tr-active').length === 0) {
			$('.tr-active').remove();
			$structure.insertAfter($row);
			if ($('.box-active').find('[data-box-detail]').length === 0) {
				$copy.appendTo('.box-active');
				$copy.css('display', 'block');
			}


			$($row).next('tr').css('cursor', 'inherit');
			$structure.show(500);
			$('[data-close-detail]').click(function () {
				_closeStructureDetailTable($structure)
			});

			if (window.innerWidth < dFrontJs.resolutions.md) {
				coord = $($row).next('tr').position();
				$('html, body').animate({scrollTop: coord.top + $($row).height()}, 600);
			}

			windowWidth = window.innerWidth;
			clearTimeout($.data(this, 'resizeOpen'));
			$.data(this, 'resizeOpen', setTimeout(function () {
				var coord;
				if (windowWidth < dFrontJs.resolutions.md) {
					coord = $($row).next('tr').position();
					$('html, body').animate({scrollTop: coord.top + $($row).height()}, 600);
				}
			}));

			//-console.log('boton', $(this).next('tr').find('[data-close-detail]'))
			//- Fill the dates
			//FLIGHT
			$($row).next('tr').find('[data-flight-date]').html($($row).data('flight-date'));
			$($row).next('tr').find('[data-flight-duration]').html($($row).data('flight-duration'));
			$($row).next('tr').find('[data-state]').html($($row).data('state'));
			//-console.log($($row).data('state'));			
			$($row).next('tr').find('[data-icon]').removeClass();
			$($row).next('tr').find('[data-icon]').addClass(icon);
			$($row).next('tr').find('[data-flight]').html($($row).data('flight'));
			$($row).next('tr').find('[data-airplane]').html($($row).data('airplane'));
			$($row).next('tr').find('[data-puntuality1]').html($($row).data('puntuality1'));
			$($row).next('tr').find('[data-puntuality2]').html($($row).data('puntuality2'));

			$detailBox = $row.parents('.ibe-tab__container').find('.ibe-table-flight-status__detail-box');
			deteleColors = 'ibe-table-flight-status__text--green ibe-table-flight-status__text--brown ibe-table-flight-status__text--black ibe-table-flight-status__text--grey';
			textColor = $($row).data('flight-color');

			$detailBox.find('[data-icon]')
				.removeClass(deteleColors)
				.addClass('ibe-table-flight-status__text--' + textColor)
				.parent().find('[data-state]')
				.removeClass(deteleColors)
				.addClass('ibe-table-flight-status__text--' + textColor);

			$detailBox.find('[data-confirmed-departure-from], [data-confirmed-departure-to]')
				.removeClass(deteleColors)
				.addClass('ibe-table-flight-status__text--' + textColor);

			$detailBox.find('.ibe-table-flight-status__td-detail-left > .ibe-table-flight-status__text').eq(1)
				.removeClass(deteleColors)
				.addClass('ibe-table-flight-status__text--' + textColor);
			$detailBox.find('.ibe-table-flight-status__td-detail-left > .ibe-table-flight-status__text').eq(5)
				.removeClass(deteleColors)
				.addClass('ibe-table-flight-status__text--' + textColor);

			// FROM
			$($row).next('tr').find('[data-from]').html($($row).data('from'));
			$($row).next('tr').find('[data-scheduled-departure-responsive-from]').html($($row).data('hour-scheduled-from'));
			$($row).next('tr').find('[data-scheduled-departure-from]').html($($row).data('hour-scheduled-from'));
			$($row).next('tr').find('[data-confirmed-departure-resposive-from]').html($($row).data('confirmed-departure-from'));
			$($row).next('tr').find('[data-confirmed-departure-from]').html($($row).data('confirmed-departure-from'));
			$($row).next('tr').find('[data-terminal-responsive-from]').html($($row).data('terminal-from'));
			$($row).next('tr').find('[data-terminal-from]').html($($row).data('terminal-from'));
			$($row).next('tr').find('[data-gate-responsive-from]').html($($row).data('gate-from'));
			$($row).next('tr').find('[data-gate-from]').html($($row).data('gate-from'));
			if ($($row).data('date-departure') !== undefined && $($row).data('date-departure') !== "") {
				if (window.innerWidth < dFrontJs.resolutions.sm) {
					$($row).next('tr').find('[data-date-departure-responsive]').show();
					$($row).next('tr').find('[data-date-departure-responsive]').html($($row).data('date-departure'));
				} else {
					$($row).next('tr').find('[data-date-departure]').show();
					$($row).next('tr').find('[data-date-departure]').html($($row).data('date-departure'));
				}
			} else {
				if (window.innerWidth < dFrontJs.resolutions.sm) {
					$($row).next('tr').find('[data-date-departure-responsive]').hide();
					$($row).next('tr').find('[data-date-departure-responsive]').html('');
				} else {
					$($row).next('tr').find('[data-date-departure]').hide();
					$($row).next('tr').find('[data-date-departure]').html('');
				}
			}


			//- TO
			$($row).next('tr').find('[data-to]').html($($row).data('to'));
			$($row).next('tr').find('[data-scheduled-departure-responsive-to]').html($($row).data('hour-scheduled-to'));
			$($row).next('tr').find('[data-scheduled-departure-to]').html($($row).data('hour-scheduled-to'));
			$($row).next('tr').find('[data-confirmed-departure-resposive-to]').html($($row).data('confirmed-departure-to'));
			$($row).next('tr').find('[data-confirmed-departure-to]').html($($row).data('confirmed-departure-to'));
			$($row).next('tr').find('[data-terminal-responsive-to]').html($($row).data('terminal-to'));
			$($row).next('tr').find('[data-terminal-to]').html($($row).data('terminal-to'));
			$($row).next('tr').find('[data-gate-responsive-to]').html($($row).data('gate-to'));
			$($row).next('tr').find('[data-gate-to]').html($($row).data('gate-to'));
			if ($($row).data('date-arrival') !== undefined && $($row).data('date-arrival') !== "") {
				if (window.innerWidth < dFrontJs.resolutions.sm) {
					$($row).next('tr').find('[data-date-arrival-responsive]').show();
					$($row).next('tr').find('[data-date-arrival-responsive]').html($($row).data('date-arrival'));
				} else {
					$($row).next('tr').find('[data-date-arrival]').show();
					$($row).next('tr').find('[data-date-arrival]').html($($row).data('date-arrival'));
				}
			} else {
				if (window.innerWidth < dFrontJs.resolutions.sm) {
					$($row).next('tr').find('[data-date-arrival-responsive]').hide();
					$($row).next('tr').find('[data-date-arrival-responsive]').html('');
				} else {
					$($row).next('tr').find('[data-date-arrival]').hide();
					$($row).next('tr').find('[data-date-arrival]').html('');
				}
			}
		} else {
			$('.tr-active').remove();
		}
	}

	//init
	var init = function (_parent) {

		var $structure,
			$tr = $('[data-flight-status-tr]', _parent),
			$close = $('[data-close-detail]', _parent)
		if (window.innerWidth < dFrontJs.resolutions.lg) {
			$structure = $('<tr class="ibe-table-flight-status__tr tr-active"><td class="ibe-table-flight-status__td--detail" colspan="6"><div class="ibe-table-flight-status__detail box-active"></div></td></tr>').hide();
		} else {
			$structure = $('<tr class="ibe-table-flight-status__tr tr-active"><td class="ibe-table-flight-status__td--detail" colspan="6"><div class="ibe-table-flight-status__detail box-active"></div></td></tr>').hide();
		}

		windowWidth = window.innerWidth;
		clearTimeout($.data(this, 'resizeInit'));
		$.data(this, 'resizeInit', setTimeout(function () {
			if (windowWidth < dFrontJs.resolutions.lg) {
				$structure = $('<tr class="ibe-table-flight-status__tr tr-active"><td class="ibe-table-flight-status__td--detail" colspan="6"><div class="ibe-table-flight-status__detail box-active"></div></td></tr>').hide();
			} else {
				$structure = $('<tr class="ibe-table-flight-status__tr tr-active"><td class="ibe-table-flight-status__td--detail" colspan="6"><div class="ibe-table-flight-status__detail box-active"></div></td></tr>').hide();
			}
		}));

		//console.log($close);

		$close.on('click', function (e) {
			_closeStructureDetailTable($structure);
		});

		//- Call from intro
		$tr.keypress(function (e) {
			if (e.which === 13) {
				_openStructureDetailTable($structure, $(this));
			}
		});
		//- Call from click
		$tr.click(function (e) {
			_openStructureDetailTable($structure, $(this));
		});


	}


	return {
		'init': init,
		'_closeStructureDetailTable': _closeStructureDetailTable,
	}
}(jQuery);
