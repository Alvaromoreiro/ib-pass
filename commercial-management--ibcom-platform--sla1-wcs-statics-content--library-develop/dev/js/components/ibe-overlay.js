dFrontJs.ibe_overlay = function () {
	/*eslint no-underscore-dangle: ['error', { 'allow': ['_clickEventOverlay', '_clickSearchBox', '_clickFocusSearcher', '_focusSearcherMobile', '_clickSearcherMobile', '_clickSeacherText'] }]*/
	var _clickEventOverlay = function (e) {
		e.preventDefault();
		$(this).hide();
		$('[data-click-toggle="popover"]').css('z-index', '');
		$('[data-function="data-focus-searcher"], .ibe-search-flights__search--overlay').css('z-index', '');
		$('[data-function="data-focus-searcher-mobile"], .ibe-search-flights__search--overlay').css('z-index', '');
		$('html').css({'overflow': ''});
		if(document.getElementById("home-CKI-Content-pop").style.display == "block"){
			document.getElementById("home-CKI-Content-pop").style.display="none";
			document.getElementById("home-CKI-Content-pop").ariaHidden = "true";
			document.getElementById("home-CKI-processLink").style.zIndex = "";
		}
	};


	//click margins y paddings
	var _clickSearchBox = function (e) {
		var $overlay = $('.ibe-overlay');
		var target = e.target || e.srcElement;
		if (target !== this)
			return;
		$overlay.hide();
	};

	var _clickFocusSearcher = function (e) {
		var $overlay = $('.ibe-overlay');
		if (window.innerWidth >= dFrontJs.resolutions.lg && !$overlay.is(':visible')) {
			$('[data-function="data-focus-searcher"]').css('z-index', '10000');
			$overlay.show();
		}
	};

	var _focusSearcherMobile = function (e) {
		var $overlay = $('.ibe-overlay');
		var active = $(e.currentTarget).parents('.ibe-accordion__collapse').siblings('[data-toggle="accordion"]').find('[data-function="data-focus-text"]');
		e.stopPropagation();
		if (window.innerWidth < dFrontJs.resolutions.lg && !$overlay.is(':visible')) {
			$('[data-function="data-focus-searcher-mobile"]').css('z-index', '10000');
			$('[data-function="data-focus-text"]').not(active).addClass('ibe-accordion__overlay-text');
			$('.ibe-overlay').show();
			$('.ibe-accordion__button').parent().addClass('ibe-accordion__overlay-button');
			active.removeClass('ibe-accordion__overlay-text');
		}
	};

	//Click in Accordion Responsive Items in Search Component
	var _clickSearcherMobile = function () {
		var el = $(this),
			$text = el.siblings('[data-function="data-focus-text"]');
		$('.ibe-overlay').show();
		$('[data-function="data-focus-searcher-mobile"]').css('z-index', '10000');
		$text.removeClass('ibe-accordion__overlay-text');
		$('[data-function="data-focus-text"]').not($text).addClass('ibe-accordion__overlay-text');
		$('.ibe-accordion__button').parent().addClass('ibe-accordion__overlay-button');
	};

	//Click in Links Responsive Items in Search Component
	var _clickSeacherText = function () {
		var el = $(this);
		$('.ibe-overlay').show();
		$('[data-function="data-focus-searcher-mobile"]').css('z-index', '10000');
		$('[data-function="data-focus-searcher-mobile"]').find('[data-function="data-focus-text"]').addClass('ibe-accordion__overlay-text');
		el.removeClass('ibe-accordion__overlay-text');
	};

	var init = function () {
		var $overlay = $('.ibe-overlay');
		var $focusSearcher = $('[data-function="data-focus-searcher"]');
		var $focusSearcherMobile = $('[data-function="data-focus-searcher-mobile"]');

		if (!$overlay.length > 0) {
			$('body').append('<div class="ibe-overlay"></div>');
			$overlay = $('.ibe-overlay');
		}

		// Controla algunas funcionalidades cuando se hace click sobre el overlay
		// 1 - Oculta el overlay
		// 2 - Quita atributo z-index a los popover desplegados con el atributo [data-click-toggle="popover"]
		// 3 - Quita atributo z-index a los elementos del buscador de la home
		$overlay.off('click', _clickEventOverlay);
		$overlay.on('click', _clickEventOverlay);

		$('.ibe-search-flights__search-box, [data-validate-searcher]').parent().off('click', _clickSearchBox);
		$('.ibe-search-flights__search-box, [data-validate-searcher]').parent().on('click', _clickSearchBox);

		// Control Overlay Buscador Desktop
		$focusSearcher.find('form').off('click focusin', _clickFocusSearcher);
		$focusSearcher.find('form').on('click focusin', _clickFocusSearcher);


		// Control Overlay Buscador Responsive
		$focusSearcherMobile.find('form').off('focusin', _focusSearcherMobile);
		$focusSearcherMobile.find('form').on('focusin', _focusSearcherMobile);

		$focusSearcherMobile.find('[data-toggle="accordion"] a').off('click', _clickSearcherMobile);
		$focusSearcherMobile.find('[data-toggle="accordion"] a').on('click', _clickSearcherMobile);

		$focusSearcherMobile.find('[data-toggle="accordion"] [data-function="data-focus-text"]').off('click', _clickSeacherText);
		$focusSearcherMobile.find('[data-toggle="accordion"] [data-function="data-focus-text"]').on('click', _clickSeacherText);
	};

	var showOverlay = function () {
		var $overlay = $('.ibe-overlay');
		if (!$overlay.is(':visible')) {
			$overlay.show();
		}
	};
	var hideOverlay = function () {
		var $overlay = $('.ibe-overlay');
		if ($overlay.is(':visible')) {
			$overlay.hide();
		}
	};

	//init
	return {
		'init': init,
		'showOverlay': showOverlay,
		'hideOverlay': hideOverlay
	};
}(jQuery);
