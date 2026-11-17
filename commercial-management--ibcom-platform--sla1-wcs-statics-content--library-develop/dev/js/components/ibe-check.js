/*
    Marcar simultaneamemnte los checkbox de 'Mis fechas son flexibles' en el buscador cuando están el calendario de ida y de vuelta.
 */

dFrontJs.ibe_check = function () {
	var init = function (e) {
		var a;
		function t(t) {
			var a = t.closest('.ibe-advanced-searcher').length === 0 ? t.parents('.ibe_form__group--half') : t.closest('.ibe-advanced-searcher');
			a.find(e).each(function (e, t) {
				$('#' + $(t).attr('for'))[0].checked = !$('#' + $(t).attr('for')).prop('checked');
			})
		}

		a = $(e);
		a.on('click', function (e) {
			e.preventDefault(), t($(this))
		}), a.each(function (e, a) {
			$('#' + $(a).attr('for')).on('keydown', function (e) {
				var a = e.which;
				e.preventDefault(), 32 !== a && 13 !== a || t($(this));
				switch (e.key) {
					case 'Tab':
						if ($(this).closest('.ibe_form__group--half').length) {
							if (e.shiftKey && e.keyCode === 9) {
								$(this).closest('.ibe_form__group-half').find('[data-cal]').focus();
							} else {
								$(this).closest('.ibe_form__group-half').find('[data-handler="selectDay"] a').eq(0).focus();
							}
						}
						break;
					case 'Enter':
						t($(this));
						break;
					default:
						break;
				}
			})
		})
	};
	return {
		'init': init
	}
}(jQuery);
