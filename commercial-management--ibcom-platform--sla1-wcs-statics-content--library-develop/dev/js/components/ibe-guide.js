//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: guide
//    Descripcion: Funciones para el componente mis guias
//******************************************************************************/
dFrontJs.ibe_guide = function () {

	//init
	var init = function () {

		//Mostrar modal de mis guias
		$(document).on('click', '[data-guide="open-modal"]', function () {
			var $this = $(this),
				$modal = $('[data-guide="modal"]'),
				$box = $('[data-guide="modal-box"]');
			$this.parent().addClass('xui-active');
			$this.attr('aria-expanded', true);
			$('body').addClass('modal-open');
			$modal.fadeIn('show');
			$modal.attr('aria-expanded', true);

			$box.animate({
				right: '0'
			}, 'slow');

			//Igualar altura de elementos (card-guide)
			if ($modal.find('[data-card-guides^="group-"]').length) {
				$modal.find('[data-card-guides^="group-"]').each(function (index) {
					var $this = $(this),
						type = $this.data('type');
					if ($modal.find('[data-card-guides="group-' + index + '"]').length) {
						switch (type) {
							case 'header':
								dFrontJs.app.calculateHeightComponents('[data-card-guides="group-' + index + '"]', '.ibe-card-guides__header');
								break;
							case 'body':
								dFrontJs.app.calculateHeightComponents('[data-card-guides="group-' + index + '"]', '.ibe-card-guides__body');
								break;
							case 'info':
								dFrontJs.app.calculateHeightComponents('[data-card-guides="group-' + index + '"]', '.ibe-card-guides__info');
								break;
						}
					}
				});
			}
			//Cerrar modal de mis guias
		}).on('click', '[data-guide="close-modal"]', function () {
			var $this = $(this),
				$modal = $('[data-guide="modal"]'),
				$box = $('[data-guide="modal-box"]'),
				$button_open = $('[data-guide="open-modal"]');

			$button_open.attr('aria-expanded', false);
			$modal.attr('aria-expanded', false);
			$box.animate({
				right: '-750px'
			}, 'slow', function () {
				$button_open.parent().removeClass('xui-active');
				$('body').removeClass('modal-open');
				$modal.fadeOut('show');
			});
		});
	};
	return {
		'init': init
	};
}(jQuery);
