/**
 * Represents ibe-box-items.js
 * @constructor
 * @author jnolasca
 * @description JS with logic to ibe-box-items components
 * @returns {function} dFrontJs.ibe_menu_links.init()
 * @example dFrontJs.ibe_menu_links.init()
 */

 dFrontJs.ibe_box_items = function () {
	var setEllipsis = function () {
		$(".ibe-box-items__content").each(function(){
			$(this).find(".ibe-box-items__item-link.icon-flecha_1_derecha").attr("data-dotdotdot-new", "data-dotdotdot-new")
				$(this).find(".paragraph.paragraph__regular").attr("data-dotdotdot-new", "data-dotdotdot-new")
		});
	}
	var init = (function () {
				setEllipsis();
				dFrontJs.app.fcHeight();
       			dFrontJs.ibe_box_ellipsis.dot('.ibe-box-items [data-dotdotdot-new]:visible', null);				
	});

	init();
	$(document).on('loaded-ibe-component-css', function (evt, data){
		if (data.indexOf('ibe-box-items' >= 0)) {
			init();
		}
	})

	return {
		'init': init
	};

}(jQuery);
