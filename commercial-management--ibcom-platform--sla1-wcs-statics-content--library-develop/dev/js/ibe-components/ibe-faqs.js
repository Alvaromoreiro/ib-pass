/**
 * Represents ibe-menu-links.js
 * @constructor
 * @author ccasalen
 * @description Example of description - This is a example of documentation with JSDoc
 * @param {string} [title="hola"] - The title of the book.
 * @param {string} otherParam - The author of the book.
 * @returns {function} dFrontJs.ibe_menu_links.init()
 * @example dFrontJs.ibe_menu_links.init()
 */
dFrontJs.ibe_faqs = function () {

	var _openFunction = function(e, elem, box, key){
		var heightElem;
		var keyBoard = key;
		box.css('height','auto');
		heightElem = box.outerHeight();
		box.css('height', 0);
		box.addClass('active');

		elem.attr('data-more','opened');
		elem.text(elem.data('text-opened'));
		elem.removeClass('icon-flecha_1_abajo');
		elem.addClass('icon-flecha_1_arriba');
		elem.attr('aria-expanded','true');
		requestAnimFrame(function(){
			box.animate({
				height: heightElem,
			}, 1000, 'swing', function(){
				box.height('auto');
				if (keyBoard){
					box.attr('tabindex','0');
					box.focus();
				}
			});

		});

	};
	var _closeFunction = function(e, elem, box, key){
		var keyBoard = key;
		elem.attr('data-more','collapsed');
		elem.text(elem.data('text-closed'));
		elem.removeClass('icon-flecha_1_arriba');
		elem.addClass('icon-flecha_1_abajo');
		elem.attr('aria-expanded','false');
		requestAnimFrame(function(){
			box.animate({
				height: 0
			}, 1000, 'swing', function(){
				box.removeClass('active');
				box.removeAttr('tabindex');
			});
		})
	};

	var _clickFunction = function(e) {
		var key = e.keyCode;
		var elem = $(e.currentTarget);
		var status = elem.attr('data-more');
		var box = elem.parent().find('[data-more-box]');
		if (status === 'collapsed' && (key === undefined || key === 13 || key === 32)){
			_openFunction(e, elem, box, key);
		} else if (status === 'opened' && (key === undefined || key === 13 || key === 32)){
			_closeFunction(e, elem, box, key);
		}

	};

	var init = (function () {
		$('[data-more]').on('mousedown keyup',_clickFunction);

		dFrontJs.app.fcHeight();
		dFrontJs.ibe_box_ellipsis.dot('.ibe-faqs [data-dotdotdot-new]:visible', null);
	}());

	return {
		'init': init
	};

}(jQuery);
