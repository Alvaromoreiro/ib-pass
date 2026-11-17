dFrontJs.ibe_read_more = function() {

	var initialHeight;

	var _openClick = function(elem, callback){
		var eventOpen = new CustomEvent('open');
		var $elem = (elem !== undefined ? $(elem) : $('[data-read-more="button"]'));
		var box, initHeight, heightCss, heightElem, children, eventOpenCreated;
		var callFunction = (callback !== undefined ? callback : '');
		if (typeof callFunction === 'function'){
			$elem[0].addEventListener('open', callFunction);
		}

		for (var i = 0; $elem.length > i; i++) {
			box = $($elem[i]).parent().find('[data-read-more="content"]');
			initHeight = box.outerHeight();
			heightCss = parseFloat(box.css('max-height'));

			if (initHeight >= heightCss){
				heightElem = 0;
				children = box[0].children;
				initialHeight = box.outerHeight();
				for (var index = 0; index < children.length; index++){
					heightElem += $(children[index]).outerHeight(true);
				}

				box.css('height', initialHeight);
				box.css('max-height','inherit');

				box.addClass('active');
				$elem.attr('data-read-more-status','opened');
				$elem.text($elem.data('text-opened'));
				$elem.removeClass('icon-flecha_1_abajo');
				$elem.addClass('icon-flecha_1_arriba');
				$elem.attr('aria-expanded','true');
				requestAnimFrame(function(){
					box.animate({
						height: heightElem,
					}, 500, 'swing');
					// Disparar event.
					$elem[0].dispatchEvent(eventOpen);
				});
			}
		}
	};

	var _closeClick = function(elem, callback){
		var eventClose= new CustomEvent('close');
		var $elem = (elem !== undefined ? $(elem) : $('[data-read-more="button"]'));
		var box = $elem.parent().find('[data-read-more="content"]');
		var callFunction = (callback !== undefined ? callback : '');
		if (typeof callFunction === 'function'){
			$elem[0].addEventListener('close', callFunction);
		}

		$elem.attr('data-read-more-status','collapsed');
		$elem.text($elem.data('text-collapsed'));
		$elem.removeClass('icon-flecha_1_arriba');
		$elem.addClass('icon-flecha_1_abajo');
		$elem.attr('aria-expanded','false');
		if (initialHeight === undefined){
			initialHeight = box.outerHeight(true);
			box.data('height', initialHeight)
		}
		requestAnimFrame(function(){
			box.animate({
				height: initialHeight
			}, 500, 'swing', function(){
				box.removeClass('active');
				box.css('max-height','');
			});
			// Disparar event.
			$elem[0].dispatchEvent(eventClose);
		})
	};

	var open = function(elem, callback){
		var $elem = (elem !== undefined ? $(elem) : $('[data-read-more="button"]'));
		if ($elem.attr('data-created') !== 'true'){
			$elem[0].addEventListener('created', function (e) {
				_openClick(e.target, callback);
			});
		} else{
			_openClick(elem, callback);
		}

	};

	var close = function(elem, callback){
		var $elem = (elem !== undefined ? $(elem) : $('[data-read-more="button"]'));
		if (!$elem.attr('data-created') !== true){
			$elem[0].addEventListener('created', function (e) {
				_closeClick(e.target, callback);
			});
		} else{
			_closeClick(elem, callback);
		}
	};

	var destroy = function(elem){
		var $elem = (elem !== undefined ? $(elem) : $('[data-read-more="button"]'));
		if ($elem.hasAttribute('data-created')){
			$elem.removeAttr('data-created','');
		}
	};


	var _onClickFunction = function(e){
		var elem = e.currentTarget;
		var $elem = $(elem);
		var status = ($elem.attr('data-read-more-status') !== undefined ? $elem.attr('data-read-more-status') : 'collapsed');

		if (status === 'collapsed'){
			_openClick(elem);
		} else{
			_closeClick(elem);
		}
	};

	var init = function (selector) {
		var eventCreated = new CustomEvent('created');
		var $button = (selector !== undefined ? $(selector) : $('[data-read-more="button"]'));
		var box, initHeight, heightCss;

		for (var i = 0; $button.length > i; i++){
			box = $($button[i]).parent().find('[data-read-more="content"]');
			initHeight = box.outerHeight();
			heightCss = parseFloat(box.css('max-height'));

			// console.log(box.css('overflow'), box.css('max-height'));
			//
			// console.log(initHeight, heightCss);

			if (initHeight >= heightCss){
				$($button[i]).on('click', _onClickFunction);
			}
			else{
				$($button[i]).hide();
			}
			$($button[i]).attr('data-created', true);
			// Disparar event.
			$button[i].dispatchEvent(eventCreated);
		}

	};


	return {
		'init': init,
		'open':  open,
		'close': close
	};
}(jQuery);
