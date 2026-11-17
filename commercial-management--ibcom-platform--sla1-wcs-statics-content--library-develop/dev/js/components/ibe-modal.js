dFrontJs.ibe_modal = function () {
	/*eslint no-underscore-dangle: ['error', { 'allow': ['_buttonCloseClick', '_modalMainClick', '_modalButtonClickEvent', '_classPopover'] }]*/
	var $focusin;
	var nativeShowModal = function(e){
		e.stopImmediatePropagation();
		var $dialog = $(this.dataset.modalId);
		var tabmenu, itemsTabMenu, itemsTabContainer, i, attrs;
		var chooseCity = $dialog.find('[data-choose-city="predictive"]');
		var isResponsive = window.innerWidth < 1024;
		if(isResponsive){
			$dialog.css("display", "block");
			if($dialog.hasClass("fc-dialog-login")){
				$dialog.trigger("dialogopen");
			}			
		}

		if ($dialog.hasClass('fc-dialog-all-destinations') && chooseCity.length === 0) {
			tabmenu = chooseCity.find('.ibe-tab__menu');
			itemsTabMenu = tabmenu.find('.ibe-tab__menu-item');
			itemsTabContainer = chooseCity.find('.ibe-tab__container .ui-tabs-panel');
			$(chooseCity).find('.ibe-tab').addClass('ibe-accordion');
			for (i = 0; i < itemsTabContainer.length; i++) {
				attrs = {
					'id': 'group_accordion_' + [i],
					'data-toggle': 'container'
				};
				let tabFilter = $(itemsTabContainer[i]).find('.ibe-filter-letter');
				tabFilter.before('<h4 class="ibe-tab__title-accordion ibe-accordion__header" data-toggle="accordion" data-target="#group_accordion_' + [i] + '"><a href="#" class="ibe-tab__title-accordion-link" title="' + $(itemsTabMenu[i].children).html() + '">' + $(itemsTabMenu[i].children).html() + '</a></h4>');
				tabFilter.addClass('ibe-accordion__collapse');
				tabFilter.attr(attrs);
			}
			chooseCity.show();
			$dialog.find('.modal-body').append(chooseCity);
		}

		var iframe = $(this).find('iframe');
		if (iframe) {
			iframe.each(function () {
				var id = $(this).attr('src');
				var autoPlay = $(this).attr('data-autoplay');
				var initParam = $(this).attr('src').indexOf('?');
				if (autoPlay) {
					if (initParam === -1) {
						$(this).attr('src', id + '?autoplay=1');
					} else {
						$(this).attr('src', id + '&autoplay=1');
					}
				}
			});
		}

		if ($(this).hasClass('fc-dialog-language') || $(this).hasClass('fc-dialog-dudes') || $(this).hasClass('fc-dialog-onbusiness')) {
			dFrontJs.ibe_menu_new.statusMenuMobile('hide');
			$('.ibe-menu-new__overlay').show();
		}
		//- Se llama a la funcion que pausa el video del herobanner en caso de que exista.
		if ($('[data-video="html5"]').length > 0) {
			dFrontJs.ibe_video.pauseVideo($('[data-video="html5"]'));
		}

		$dialog.find('[data-dialog="close"]').off("click");
		$dialog.find('[data-dialog="close"]').on("click", nativeCloseModal);
	};

	var nativeCloseModal = function(e, isLoginFinEvent){
		var $dialog = null;
		var isResponsive = window.innerWidth < 1024;
		if(this != window && isLoginFinEvent == undefined){
			$dialog = $(this).closest('[data-dialog="modal"].ibe-dialog');
			$dialog.css("display", "none");
		} else {
			if(!isResponsive || (isLoginFinEvent != undefined && isLoginFinEvent == true)){
				$dialog = $('[data-dialog="modal"].ibe-dialog:visible');
				if($dialog.length > 0){
					$dialog.css("display", "none");
				}
				
			}
		}

		if($dialog != null){
			var iframe = $dialog.find("iframe");
			if(iframe.length > 0){
				iframe.remove();
			}
		}
	};

	//Jquery ui dialog
	var createModal = function (element, modalFull, cssClass, appendTo) {
		var $dialog = $(element);
		var $dialogFull = modalFull ? true : false;
		var initVideo = {};
		if ($dialog.length > 0 && !$dialog.hasClass('fc-init-modal')) {
			$dialog.addClass('fc-init-modal');
			$dialog.dialog({
				modal: true,
				resizable: true,
				autoOpen: false,
				closeOnEscape: true,
				closeText: 'X',
				classes: {
					'ui-dialog-content': cssClass
				},
				close: function (event, ui) {
					if ($(this).find('iframe')) {
						$(this).find('iframe').each(function () {
							var id = $(this).attr('src');
							var numAutoPlay = $(this).attr('src').indexOf('autoplay=1');
							if (numAutoPlay >= 0) {
								id = id.split(id.substr(numAutoPlay - 1, 11));
								$(this).attr('src', id[0]);
							} else {
								$(this).attr('src', id);
							}
						});
					}

					if ($(this).hasClass('fc-dialog-popover')) {
						if($('[data-toggle="popover"]').offset()!=undefined){
							setTimeout(function () {
								var topPopoverButton = $('[data-toggle="popover"]').offset().top;
								$('html, body').animate({
									scrollTop: topPopoverButton
								}, 500);
							}, 50);
						}

					}

					if ($(this).hasClass('fc-dialog-language') || $(this).hasClass('fc-dialog-dudes') || $(this).hasClass('fc-dialog-onbusiness')) {
						$('.ibe-menu-new__overlay').hide();
						dFrontJs.ibe_menu_new.statusMenuMobile('show');
					}

					var remainingOpen = $('.ibe-dialog').filter(function() {
						return $(this).dialog('instance') && $(this).dialog('isOpen');
					});
					if (remainingOpen.length === 0) {
						$('body').removeClass('modal-open');
						$('html').css('overflow', '');
					}

					if ($(this).parents('.ibe-dialog').hasClass('defaultModal')) {
						$(this).parents('.defaultModal').find('.ibe-modal').html('');
					}
				},
				create: function (event, ui) {
					if ($dialogFull) {
						$dialog.addClass('modal--fullw');
					}

				},
				open: function (event, ui) {
					var chooseCity, tabmenu, itemsTabMenu, itemsTabContainer, i, attrs;
					if ($dialog.hasClass('fc-dialog-all-destinations') && $dialog.find('[data-choose-city="predictive"]').length === 0) {
						chooseCity = $('[data-choose-city="predictive"]');
						tabmenu = chooseCity.find('.ibe-tab__menu');
						itemsTabMenu = tabmenu.find('.ibe-tab__menu-item');
						itemsTabContainer = chooseCity.find('.ibe-tab__container .ui-tabs-panel');
						$(chooseCity).find('.ibe-tab').addClass('ibe-accordion');
						for (i = 0; i < itemsTabContainer.length; i++) {
							attrs = {
								'id': 'group_accordion_' + [i],
								'data-toggle': 'container'
							};
							$(itemsTabContainer[i]).find('.ibe-filter-letter').before('<h4 class="ibe-tab__title-accordion ibe-accordion__header" data-toggle="accordion" data-target="#group_accordion_' + [i] + '"><a href="#" class="ibe-tab__title-accordion-link" title="' + $(itemsTabMenu[i].children).html() + '">' + $(itemsTabMenu[i].children).html() + '</a></h4>');
							$(itemsTabContainer[i]).find('.ibe-filter-letter').addClass('ibe-accordion__collapse');
							$(itemsTabContainer[i]).find('.ibe-filter-letter').attr(attrs);
						}
						chooseCity.show();
						$dialog.find('.modal-body').append(chooseCity);
					}
					if ($(this).find('iframe')) {
						$(this).find('iframe').each(function () {
							var id = $(this).attr('src');
							var autoPlay = $(this).attr('data-autoplay');
							var initParam = $(this).attr('src').indexOf('?');
							if (autoPlay) {
								if (initParam === -1) {
									$(this).attr('src', id + '?autoplay=1');
								} else {
									$(this).attr('src', id + '&autoplay=1');
								}
							}
						});
					}

					if ($(this).hasClass('fc-dialog-language') || $(this).hasClass('fc-dialog-dudes') || $(this).hasClass('fc-dialog-onbusiness')) {
						dFrontJs.ibe_menu_new.statusMenuMobile('hide');
						$('.ibe-menu-new__overlay').show();
					}
					//- Se llama a la funcion que pausa el video del herobanner en caso de que exista.
					if ($('[data-video="html5"]').length > 0) {
						dFrontJs.ibe_video.pauseVideo($('[data-video="html5"]'));
					}
				}
			});
		}

	};

	var showModal = function (element, modalFull, cssClass) {
		var $dialog = $(element);
		var $dialogFull = modalFull ? true : false;
		var $cssClass;
		// $focusin = $('html').scrollTop();

		if (cssClass !== undefined) {
			$cssClass = cssClass;
		}

		$dialog.addClass($cssClass);

		if ($dialogFull) {
			$dialog.addClass('modal--fullw');
		} else {
			$dialog.removeClass('modal--fullw');
		}

		$dialog.dialog('open');
		// $('body').addClass('modal-open');
		// $('html').css('overflow', 'hidden');

		dFrontJs.app.emitInView();		//Lazy load img refresh

		if (navigator.userAgent.match(/(iPhone)|(iPad)|(iPod)/i)) {
			$('body').addClass('modal-ios').css('position', 'relative');
			$('html').css('overflow', 'auto');
		}
	};

	var _buttonCloseClick = function (e) {
        var dialog = $(this).parents('.ibe-dialog');
        if (dialog.data('reload') !== undefined) {
            document.location.reload(false);
        } else {
            e.stopImmediatePropagation();
            dialog.dialog('close');
            if (dialog.hasClass('defaultModal')) {
                $(this).parents('.defaultModal').find('.ibe-modal').html('');
            }
            var remainingDialogs = $('.ibe-dialog').filter(function() {
                return $(this).dialog('instance') && $(this).dialog('isOpen');
            });
            if (remainingDialogs.length === 0) {
                document.getElementsByTagName("body")[0].classList.remove("modal-open");
                document.getElementsByTagName("html")[0].style.overflow = '';
                $('html').scrollTop($focusin);
            }
        }
    };

	var _modalMainClick = function (e) {
		if ($(e.target).find('.modal-dialog').hasClass('ibe-noClose') || e.target !== this && $(e.target).attr('data-dialog') !== 'modal') {
			// Remove stopPropagation - Click on select options in modals
			// e.stopImmediatePropagation();
			return;
		}

		if ($(this).data('reload') !== undefined) {
			document.location.reload(false);
		} else {
			e.stopImmediatePropagation();
			$('body').removeClass('modal-open');
			$('html').css('overflow', '');
			$(this).dialog('close');
			if ($(this).hasClass('defaultModal')) {
				$(this).parents('.defaultModal').find('.ibe-modal').html('');
			}
		}
		$('html').scrollTop($focusin);
	};

	var closeModal = function (buttonClose) {

		//-console.log('aa',element, $('.ibe-dialog').find('.ibe-noClose').length);
		var $modalMain = $('.ibe-dialog');
		var $buttonClose;
		if (buttonClose !== undefined) {
			$buttonClose = $(buttonClose);
		} else {
			$buttonClose = $('[data-dialog="close"]');

		}
		//Close dialog on Button close
		$buttonClose.off('click', _buttonCloseClick);
		$buttonClose.on('click', _buttonCloseClick);


		// close dialog on Body click
		$modalMain.off('click', _modalMainClick);
		$modalMain.on('click', _modalMainClick);

	};

	var clickModal = function (element, modalButton, appendTo) {
		var $modalButton;
		var _modalButtonClickEvent = function (e) {
			var $element, $cssClass, $this, modalFull, appendTo, $galleryAirplane, $galleryExperiences,
				_classPopover = 'fc-dialog-popover';
			e.preventDefault();
			$this = $(this),
			modalFull = $this.data('full-width');
			appendTo = $this.data('append-to');
			if (element !== undefined) {
				$element = $(element);
			} else {
				$element = $this.data('modal-view');
			}

			if ($this.parents('.popover').length > 0) {
				$cssClass = _classPopover;

			} else {
				$cssClass = undefined;
			}

			if ($(e.currentTarget).data('gallery')) {
				galleryCarousel = $(e.currentTarget).data('gallery');
			}

			//Card Airplane galeria de imagenes
			$galleryAirplane = $(this).parents('[data-gallery="airplane"]');
			$galleryAirplane.find('[data-modal="button"]').each(function (index) {
				if ($(this)[0] === $this[0]) {
					dFrontJs.app.indexCarouselCardAirplane = index;
				}
			});

			//Card Experiences galeria de imagenes
			$galleryExperiences = $(this).parents('[data-gallery="experiences"]');
			$galleryExperiences.find('[data-modal="button"]').each(function (index) {
				if ($(this)[0] === $this[0]) {
					dFrontJs.app.indexCarouselCardAirplane = index;
				}
			});

			//Inicializamos la modal pasandole la clase
			createModal($element, modalFull, $cssClass, appendTo);
			showModal($element, modalFull, $cssClass);
		};

		if (modalButton !== undefined) {
			$modalButton = $(modalButton);
		} else {
			$modalButton = $('[data-modal="button"]')
		}

		$modalButton.off('click', _modalButtonClickEvent);
		$modalButton.on('click', _modalButtonClickEvent);
	};

	var init = function (element, modalButton, appendTo) {
		closeModal();
		clickModal(element, modalButton, appendTo);
	};

	return {
		'init': init,
		'createModal': createModal,
		'showModal': showModal,
		'closeModal': closeModal,
		'clickModal': clickModal,
		'nativeCloseModal': nativeCloseModal,
		'nativeShowModal': nativeShowModal
	};
}(jQuery);
