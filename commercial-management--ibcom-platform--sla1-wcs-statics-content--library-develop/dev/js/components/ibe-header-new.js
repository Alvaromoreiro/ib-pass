dFrontJs.ibe_headerNew = function () {
	/*eslint no-underscore-dangle: ['error', { 'allow': ['_documentClickHeader', '_dudesClick', '_overlayHeaderClick', '_loggedClick', '_overlayTouchStart', '_loggedResizeClick', '_resizeHeaderFunction'] }]*/
	var _documentClickHeader = function (event) {
		var $dudes = $('[data-dudes]');
		var $logged = $('.ibe-header-new__logged-link');
		var containerLogged = $logged.data('target');
		if ($(event.target).parents('.ibe-header-new').length === 0 && !$(event.target).hasClass('ibe-header-new')) {
			if ($dudes.hasClass('open') && $('.ibe-header-new__dudes .ibe_form').is(':visible') && !$(event.target).hasClass('ibe-header-new__dudes-input') && $(event.target).attr('data-dudes') !== 'dudes' && $(event.target).parents('.ibe-header-new__dudes').length === 0) {
				$dudes.removeClass('open');
				$('.ibe-header-new__dudes .ibe_form').animate({width: 'toggle'}, 600, function () {
					$dudes.parent().animate({width: 'toggle'}, 400);
				});
			}
		}
		if (window.innerWidth < dFrontJs.resolutions.lg && $(containerLogged).is(':visible') && !$(event.target).hasClass('ibe-login') && $(event.target).parents('.ibe-login').length === 0) {
			$logged.removeClass('active');
			$(containerLogged).collapse('hide');
			$('.ibe-menu-new__overlay').hide();
			$('html, body').css({'overflow': ''});
		}
	};

	var _dudesClick = function () {
		var $this = $(this);
		$this.addClass('open');
		$this.parent().animate({width: 'toggle'}, 400, function () {
			$this.parents('.ibe-header-new__dudes').find('.ibe_form').animate({width: 'toggle'}, 600);
			$this.parents('.ibe-header-new__dudes').find('.ibe-header-new__dudes-input').focus();
		});
	};


	var _overlayHeaderClick = function (e) {
		var $logged = $('.ibe-header-new__logged-link');
		var containerLogged = $logged.data('target');
		e.preventDefault();
		$(this).hide();
		$('[data-click-toggle="popover"]').css('z-index', '');
		$('[data-function="data-focus-searcher"], .ibe-search-flights__search--overlay').css('z-index', '');
		$('[data-function="data-focus-searcher-mobile"], .ibe-search-flights__search--overlay').css('z-index', '');
		$logged.removeClass('active');
		$(containerLogged).collapse('hide');
		$('html, body').css({'overflow': ''});
	};

	var _loggedClick = function () {
		var windowWidth = window.innerWidth;
		var $overlayHeader = $('.ibe-header-new__overlay');
		var $logged = $('.ibe-header-new__logged-link');
		var containerLogged = $logged.data('target');
		var $this = $(this);
		if (windowWidth < dFrontJs.resolutions.lg) {
			requestAnimFrame(function () {
				$this.toggleClass('active');
				$overlayHeader.toggle();
				if ($('body').css('overflow') === 'hidden') {
					$('html, body').css({'overflow': ''});
				} else {
					$('html, body').css({'overflow': 'hidden'});
				}
				if ($(containerLogged).is(':visible')) {
					$overlayHeader.show();
				} else if ($(containerLogged).not(':visible')) {
					$overlayHeader.hide();
				}
			});
		}
	};

	var _overlayTouchStart = function () {
		var $logged = $('.ibe-header-new__logged-link');
		var containerLogged = $logged.data('target');
		var $overlayHeader = $('.ibe-header-new__overlay');
		if ($(containerLogged).is(':visible')) {
			requestAnimFrame(function () {
				$logged.toggleClass('active');
				$overlayHeader.hide();
				$(containerLogged).collapse('hide');
			});
		}
	};

	var _loggedResizeClick = function () {
		var $this = $(this);
		if (windowWidth < dFrontJs.resolutions.lg) {
			$this.toggleClass('active');
			$('.ibe-menu-new__overlay').toggle();
			if ($('body').css('overflow') === 'hidden') {
				$('html, body').css({'overflow': ''});
			} else {
				$('html, body').css({'overflow': 'hidden'});
			}
		}
	};

	var _resizeHeaderFunction = function () {
		var $logged = $('.ibe-header-new__logged-link');
		var containerLogged = $logged.data('target');
		windowWidth = window.innerWidth;
		clearTimeout($.data(this, 'resizeLogged'));
		$.data(this, 'resizeLogged', setTimeout(function () {
			if (windowWidth < dFrontJs.resolutions.lg) {
				//New Login
				if ($('.ibe-login.collapse').hasClass('in')) {
					$('.ibe-login.collapse.in').collapse('hide');
				}
				//New Logged
				if (!$logged.hasClass('logged-responsive')) {
					$(containerLogged).collapse('hide');
					$logged.addClass('logged-responsive');
					$logged.off('click', _loggedResizeClick);
					$logged.on('click', _loggedResizeClick);
				} else {
					$('.ibe-header-new__overlay').hide();
				}
			} else {
				//New Login
				if ($('.ibe-dialog--login').is(':visible')) {
					$('.ibe-dialog--login').dialog('close');
				}

				//New Logged
				$logged.removeClass('logged-responsive');
				if ($logged.hasClass('active')) {
					$logged.removeClass('active');
					$('.ibe-menu-new__overlay').hide();
					$('.ibe-header-new__overlay').hide();
					$(containerLogged).collapse('hide');
					$('html, body').css({'overflow': ''});
				}
			}
		}, 200));
	};
	var init = function () {
		//Search dude
		var $dudes = $('[data-dudes]');
		var $logged = $('.ibe-header-new__logged-link');
		var windowWidth = window.innerWidth;
		var $overlayHeader = $('.ibe-header-new__overlay');
		if ($overlayHeader.length === 0) {
			$('body').append('<div class="ibe-header-new__overlay" style="display: none;">');
			$overlayHeader = $('.ibe-header-new__overlay');
		}

		$overlayHeader.off('click', _overlayHeaderClick);
		$overlayHeader.on('click', _overlayHeaderClick);

		$dudes.off('click', _dudesClick);
		$dudes.on('click', _dudesClick);

		if (windowWidth < dFrontJs.resolutions.lg) {
			if (!$logged.hasClass('logged-responsive')) {
				$logged.addClass('logged-responsive');
			}
			$logged.off('click', _loggedClick);
			$logged.on('click', _loggedClick);
		}

		// Click Overlay closes menu header new
		$overlayHeader.off('touchstart', _overlayTouchStart);
		$overlayHeader.on('touchstart', _overlayTouchStart);

		$(window).off('resize', _resizeHeaderFunction);
		$(window).on('resize', _resizeHeaderFunction);

		$(document).off('click', _documentClickHeader);
		$(document).on('click', _documentClickHeader);

	};//ibeHeader
	return {
		'init': init
	};
}(jQuery);
