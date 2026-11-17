//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: Inputs show hide element
//    Descripcion: Funcion para mostrar y ocultar un elemento
//******************************************************************************/
dFrontJs.ibe_show_hide_element = function () {

	//init
	var init = function () {
		$('[data-show-hide]').on('click', function () {
			var $this = $(this),
				parent = $this.parent(),
				target = $this.data('show-hide-target'),
				action = $this.data('show-hide');
			parent.siblings().removeClass('active');
			parent.addClass('active');

			if (action === 'show') {
				$('[data-show-hide-target="' + target + '"]').attr('aria-expanded', true);
				$(target).show();
				$(target).attr('aria-expanded', true);
			} else {
				$('[data-show-hide-target="' + target + '"]').attr('aria-expanded', false);
				$(target).hide();
				$(target).attr('aria-expanded', false);
			}
		});
	}
	return {
		'init': init
	}
}(jQuery);
