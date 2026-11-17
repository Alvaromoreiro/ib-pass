/* Nuevo menu para  Iberia */
dFrontJs.ibe_menu_new = function () {
	//Abrir/Cerrar menu mobile
	var statusMenuMobile = function (action) {

		if (!$('body').hasClass('menu-action')) {
			$('body').addClass('menu-action');
		}

		if ($('.ibe-menu-new').hasClass('menu-responsive')) {
			switch (action) {
				case 'show':
					if ($('.ibe-cookies').length > 0 && $('.ibe-cookies').is(':visible')) {
						$('.ibe-cookies').slideToggle('slow', function () {
							$('.ibe-menu-new').addClass('active');
							$('body').addClass('menu-open');
							$('body').scrollTop(0);
							$('[data-menu-new="button"]').addClass('on');
							$('.ibe-menu-new__overlay').show();
							$('[data-list="menu"]').focus();
							$('.ibe-menu-new').css({'visibility':'visible'});
							$('body').css({'position': 'relative'});
							$('html').css({'overflow': 'hidden'});
						});
					} else {
						$('.ibe-menu-new').addClass('active');
						$('body').addClass('menu-open');
						$('body').scrollTop(0);
						$('[data-menu-new="button"]').addClass('on');
						$('.ibe-menu-new__overlay').show();
						$('[data-list="menu"]').focus();
						$('.ibe-menu-new').css({'visibility':'visible'});
						$('body').css({'position': 'relative'});
						$('html').css({'overflow': 'hidden'});
					}

					break;
				case 'hide':
					setTimeout(function () {
						$('.ibe-menu-new').css({'visibility':'hidden'});
					}, 500);
					$('.ibe-menu-new').removeClass('active');
					$('body').removeClass('menu-open');
					$('[data-menu-new="button"]').removeClass('on');
					$('.ibe-menu-new__overlay').hide();
					$('html').css({'overflow': 'auto'});

					if ($('.ibe-cookies').length > 0) {
						$('.ibe-cookies').slideToggle();
					}
					break;
			}
		}
	};//statusMenuMobile
	//Abrir/Cerrar submenu
	var openCloseSubmenu = function (obj, menu, type) {
		var $menuBlock = $('[data-menu-new="' + menu + '"]');
		if ($('.ibe-menu-new').hasClass('menu-responsive')) {
			if (type === 'close') {
				$('.ibe-menu-new__panel').height($($menuBlock.parents('[data-list="menu"]')[0]).height());
				$menuBlock.parent().removeClass('open-submenu');
				$menuBlock.parent().siblings().css('visibility', 'visible');
				$menuBlock.removeClass('active');
				setTimeout(function () {
					$menuBlock.css('display', 'none');
				}, 300);
				$menuBlock.parent().children('[data-link="menu"]').css('visibility', 'visible');
				$menuBlock.parents('[data-menu]').first().find('a').first().focus();
				$menuBlock.parents('ul').eq(0).find('> li > a').removeAttr('tabindex');
				$menuBlock.find('> li > a').attr('tabindex', '-1');
			} else if (type === 'open') {
				$menuBlock.css('display', 'block');
				$('.ibe-menu-new__panel').height($menuBlock.height());
				$menuBlock.parent().addClass('open-submenu');
				$menuBlock.parent().siblings().not('.open-submenu').css('visibility', 'hidden');
				$menuBlock.parent().children('[data-link="menu"]').css('visibility', 'hidden');
				$menuBlock.find('a').first().focus();
				$menuBlock.parents('ul').find('> li > a').attr('tabindex', '-1');
				$menuBlock.find('> li > a').removeAttr('tabindex');
				$menuBlock.addClass('active');
			}
		}

	};//openCloseSubmenu

	var init = function () {
		//Variables del listado principal
		var $menu = $('.ibe-menu-new'),
			item = $('.ibe-menu-new__item'),
			link = $('.ibe-menu-new__link--tab'),
			itemsFocusout = $('.ibe-menu-new__link--tab, .ibe-menu-new__link--submenu, .ibe-menu-new__title'),
			container = $('.ibe-menu-new__container'),
			underline = $('.ibe-menu-new__item--underline'),
			myTimer,
			myTimeout;

		if ($('.ibe-menu-new__overlay').length === 0) {
			$('body').append('<div class="ibe-menu-new__overlay" style="display: none;">');
		}

		//Hover change background
		item.hover(function () {
			var $this = $(this);
			$this.find(container).attr('aria-hidden', false);
			$this.find(container).attr('aria-expanded', true);
			$this.find(link).attr('aria-hidden', false);
			//Delay to open the menu
			myTimeout = setTimeout(function () {
				item.removeClass('ibe-menu-new__item--active');
				$this.addClass('ibe-menu-new__item--active');
				item.find(container).removeClass('ibe-menu-new__container--active');
				$this.find(container).addClass('ibe-menu-new__container--active');
				underline.removeClass('ibe-menu-new__item--underline');
			}, 200);
			clearTimeout(myTimer);
		}, function () {
			var $this = $(this);
			$this.find(link).attr('aria-hidden', true);
			$this.find(container).attr('aria-hidden', true);
			$this.find(container).attr('aria-expanded', false);
			myTimer = setTimeout(function () {
				item.removeClass('ibe-menu-new__item--active');
				item.find('.ibe-menu-new__container').removeClass('ibe-menu-new__container--active');
				underline.addClass('ibe-menu-new__item--underline');
			}, 300);
			clearTimeout(myTimeout);
		});

		//Focus for keyboard
		link.on('focus', function (e) {
			var $this = $(this);
			$this.parent().find(container).attr('aria-hidden', false);
			$this.parent().find(container).attr('aria-expanded', true);
			$this.parent().find(link).attr('aria-expanded', true);
			$this.parent().find(link).attr('aria-hidden', false);
			underline.removeClass('ibe-menu-new__item--underline');
			$('.ibe-menu-new__item.ibe-menu-new__item--active').removeClass('ibe-menu-new__item--active');
			$('.ibe-menu-new__container.ibe-menu-new__container--active').removeClass('ibe-menu-new__container--active');
			$('.ibe-menu-new__container.ibe-menu-new__container--active').parent().removeClass('ibe-menu-new__item--underline');
			$this.parent().addClass('ibe-menu-new__item--active');
			$this.parent().find(container).addClass('ibe-menu-new__container--active');
		});

		itemsFocusout.on('keydown', function (e) {
			if (e.keyCode === 39) {
				$(this).parents('.ibe-menu-new__item').next().children('.ibe-menu-new__link--tab').focus();
			} else if (e.keyCode === 37) {
				$(this).parents('.ibe-menu-new__item').prev().children('.ibe-menu-new__link--tab').focus();
			}
			if (e.keyCode === 27) {
				$(this).blur();
			}
		});
		itemsFocusout.on('focusout', function (e) {
			var $this = $(this);

			if (!$(e.relatedTarget).parents('.ibe-menu-new__item--active').length > 0) {
				$(link).attr('aria-hidden', true);
				$(link).attr('aria-expanded', false);
				$(container).attr('aria-expanded', false);
				$(container).attr('aria-hidden', true);
				if ($(e.relatedTarget).parents('.ibe-menu-new')) {
					item.find(container).removeClass('ibe-menu-new__container--active');
					item.removeClass('ibe-menu-new__item--active');
				}
			}

			if (!$(e.relatedTarget).parents('.ibe-menu-new').length > 0) {
				$this.parents('.ibe-menu-new__item').removeClass('ibe-menu-new__item--active');
				$this.parent().find(link).attr('aria-hidden', true);
				$this.parent().find(link).attr('aria-expanded', false);
				$this.parent().find(container).attr('aria-hidden', true);
				$this.parent().find(container).attr('aria-expanded', false);
				myTimer = setTimeout(function () {
					item.find(container).removeClass('ibe-menu-new__container--active');
					underline.addClass('ibe-menu-new__item--underline');
				}, 300);
			}
		});

		$(document).off('click touchend', '[data-open-menu-new]');
		$(document).off('click touchend', '[data-menu-new="button"]');
		$(document).off('click touchend', '.ibe-menu-new__overlay');
		$(document).off('click touchend', '[data-close-menu-new]');

		/// Mostrar menu mobile

		$(document).on('click', '[data-menu-new="button"]', function () {
			var $this = $(this);

			if ($this.hasClass('on')) {
				statusMenuMobile('hide');
			} else {
				statusMenuMobile('show');
			}
			//Cerrar menu clickeando en el overlay
		}).on('click touchend', '.ibe-menu-new__overlay', function (e) {
			e.preventDefault();
			statusMenuMobile('hide');
			//Abrir menu
		}).on('click', '[data-open-menu-new]', function () {
			var $this = $(this),
				menu = $this.data('open-menu-new');
			openCloseSubmenu($this, menu, 'open');
			//Cerrar menu
		}).on('click', '[data-close-menu-new]', function () {
			var $this = $(this),
				menu = $this.data('close-menu-new');
			openCloseSubmenu($this, menu, 'close');
		});

		if (document.querySelector(".ibe-header-new__menu-button").offsetParent !== null) {
			$menu.addClass('menu-responsive');
		} else {
			$menu.removeClass('menu-responsive');
			$('.ibe-menu-new__title').each(function () {
				if (!$(this).hasClass('ibe-menu-new__title--link')) {
					$(this).attr('tabindex', '-1');
				}
			});
		}

		$(window).on('resize', function () {
			if (document.querySelector(".ibe-header-new__menu-button").offsetParent !== null ) {
				if (!$menu.hasClass('menu-responsive')) {
					$menu.addClass('menu-responsive');
					$('.ibe-menu-new__overlay').hide();
				}
			} else {
				$menu.removeClass('active');
				$menu.removeClass('menu-responsive');
				$menu.css('visibility', '');
				$('.ibe-menu-new__item--submenu').css({visibility:'', display:''});
				$('.ibe-menu-new__title').css({visibility:'', display:''});
				$('.ibe-menu-new__list').css({visibility:'', display:''});
				$('.ibe-menu-new__list--submenu').css({visibility:'', display:''});
				$('.ibe-menu-new__panel').css('height', 'auto');
				$('.open-submenu').removeClass('open-submenu');
				$('.ibe-menu-new__item--back').css({visibility:'', display:''});
				
				$menu.find('.active').removeClass('active').css('display','');
				if ($('.fc-dialog-language').hasClass('ui-dialog-content')) {
					$('.fc-dialog-language').dialog('close');
				}
				if ($('.fc-dialog-dudes').hasClass('ui-dialog-content')) {
					$('.fc-dialog-dudes').dialog('close');
				}
				if ($('.fc-dialog-onbusiness').hasClass('ui-dialog-content')) {
					$('.fc-dialog-onbusiness').dialog('close');
				}
				$('.ibe-menu-new__overlay').hide();
				$('.ibe-menu-new__title').each(function () {
					if (!$(this).hasClass('ibe-menu-new__title--link')) {
						$(this).attr('tabindex', '-1');
					}
				});
			}
		});

		// icons menu
		if ($('.ibe-menu-new__list--submenu').find('[class*=" icon-"]').length > 0) {
			$('.ibe-menu-new__list--submenu').each(function () {
				var $this = $(this);
				if ($this.find('[class*=" icon-"]').length > 0) {
					$this.addClass('ibe-menu-new__list--icons');
				}
			});
		}

	};//ibe-menu-new
	return {
		'init': init,
		'statusMenuMobile': statusMenuMobile
	};
}(jQuery);
