//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: ibe-box-icon
//    Descripcion: Javascript para indicar el comportamiento de las tarjetas con
//    con icono y desplegable
//******************************************************************************/

dFrontJs.ibe_box_icon = function () {

	var init = function () {
		// Version con data attribute

		var $box = $('[flight-status-box]'),
			$article = $box.find('.ibe-infocheckin__box--icon'),
			$title = $article.find('.ibe-infocheckin__box-title');

		// Pon de titulo principal el titulo del primero
		$article.each(function () {
			$(this).find($title).remove();
		});
	};

	return {
		'init': init
	};
}(jQuery);
