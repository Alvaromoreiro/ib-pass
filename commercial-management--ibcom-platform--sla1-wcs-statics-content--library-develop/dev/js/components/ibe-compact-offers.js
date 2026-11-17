dFrontJs.ibe_compact_offers = function () {
	var init = function (selector, index) {
		var isMobile = window.innerWidth < 768, node = $(selector),  topLinkSeparation = 16, idName = 'dot-' + index, idSelector = '#' + idName, openBtnTxt = node.attr('data-button-open'), closedBtnTxt = node.attr('data-button-closed'), closedAriaCont = node.attr('data-cont-closed'), openAriaCont = node.attr('data-cont-open'), isContainerCollapsable, trigger, offersWrapper, baseLink, baseLinkLenght, collapsed, firstColum, topLink;
		var numberItemsPerRow = node.attr('data-offers-number');
		var itemsPerRow = numberItemsPerRow ? numberItemsPerRow : 3;
    var collapsable = false;
    var linkHeight, minHeight, maxHeight, isflexOffers,isflexOffers1;
		trigger = node.find('[data-offers-collapse="trigger"]');
		offersWrapper = node.find('.ibe-offer-landings__offers-wrapper');
		collapsed = trigger.attr('data-offers-collapsed');
		trigger.attr('data-offers-target', idName);
		offersWrapper.attr('id', idName);
		firstColum = $(idSelector + ' .ibe-offer-landings__offers-column:nth-child(1)');
		topLink = firstColum.find('.ibe-offer-landings__offers-title-link');
		isflexOffers=node.hasClass('ibe-offer-landings__offers-flex');
		isflexOffers1= node.hasClass('ibe-offer-landings__offers-flex1');
		baseLink = firstColum.find('.ibe-offer-landings__offers-list li');
		baseLinkLenght = baseLink.length;

		if(isflexOffers){
			baseLinkLenght=baseLinkLenght/3;
			if (baseLinkLenght % 1 != 0) {
				baseLinkLenght+=1;
			}
			baseLinkLenght=parseInt(baseLinkLenght);
		}

		if (isMobile) {
			initMobile();
		} else {
			initDesktop();
		}
		trigger.on({
			'click': function (event) {
				collapsed = trigger.attr('data-offers-collapsed') === 'false' ? false : true;
				collapsed ? openOffersWrapper(trigger, collapsed) : closeOffersWrapper(trigger, collapsed);
			}
		});
		function initDesktop() {
			isContainerCollapsable = node.attr('data-content-collapsable') === 'true' ? true : false;
			baseLinkLenght > itemsPerRow && !isMobile && isContainerCollapsable ? collapsable = true : collapsable = false;
			if (!collapsable) {
				trigger.hide();
			} else {
				trigger.show();
				baseLinkLenght = node.attr("data-content-flex") ? (baseLinkLenght%3 > 0 ? parseInt((baseLinkLenght/3)+1) : baseLinkLenght/3) : baseLinkLenght;				
				linkHeight = baseLink[0].clientHeight, minHeight = topLink.length > 0 ? topLink[0].clientHeight + (linkHeight * itemsPerRow) + topLinkSeparation : linkHeight * itemsPerRow, maxHeight = topLink.length > 0 ? topLink[0].clientHeight + (baseLinkLenght * linkHeight) + baseLinkLenght : (baseLinkLenght * linkHeight) + baseLinkLenght,
				offersWrapper.attr('data-collapsed-height', minHeight).attr('data-opened-height', maxHeight).css('height', minHeight);
				if(isflexOffers || isflexOffers1){
					minHeight=minHeight-1;
					offersWrapper.attr('data-collapsed-height', minHeight).attr('data-opened-height', maxHeight).css('height', minHeight);
				}
				closeOffersWrapper(trigger, false);
			}
		};
		function initMobile() {
			trigger.attr('data-offers-collapsed', false);
			trigger.hide();
			toggleWrappedOffers(offersWrapper, true)
			offersWrapper.attr('aria-label', openAriaCont).removeAttr('data-collapsed-height').removeAttr('data-opened-height').css('height', 'auto');
			
		};
		function openOffersWrapper(selector, collapsed) {
			var trigger = $(selector), container = $('#' + trigger.attr('data-offers-target')), triggerIcon = $(trigger).find('.ibe-offer-landings__trigger-icon'), triggerText = $(trigger).find('.sr-only');
			triggerIcon.removeClass('icon-flecha_1_abajo').addClass('icon-flecha_1_arriba');
			trigger.attr('data-offers-collapsed', !collapsed).attr('aria-label', openBtnTxt);
			triggerText.text(openBtnTxt);
			toggleWrappedOffers(container, true);
			container.attr('data-offers-collapsed', !collapsed).attr('aria-label', openAriaCont).css('height', maxHeight + 'px');
		};
		function closeOffersWrapper(selector, collapsed) {
			var trigger = $(selector), container = $('#' + trigger.attr('data-offers-target')), triggerIcon = $(trigger).find('.ibe-offer-landings__trigger-icon'), triggerText = $(trigger).find('.sr-only');
			triggerIcon.removeClass('icon-flecha_1_arriba').addClass('icon-flecha_1_abajo');
			trigger.attr('data-offers-collapsed', !collapsed).attr('aria-label', closedBtnTxt);
			triggerText.text(closedBtnTxt);
			toggleWrappedOffers(container, false);
			container.attr('data-offers-collapsed', !collapsed).attr('aria-label', closedAriaCont).css('height', minHeight + 'px');
		};
		function toggleWrappedOffers(container, visible) {
			var containerColumn = $(container).find('.ibe-offer-landings__offers-column');
			containerColumn.each(function (columIndex) {
				var columnItem = $(this).find('.ibe-offer-landings__offers-list-item');
				columnItem.each(function (itemIndex) {
					if (itemIndex >= numberItemsPerRow) {
						visible ? $(this).show() : $(this).hide();
					}
				});
			});
		};
		$(window).on('resize', function () {
			var isMobile = window.innerWidth < 768;
			if (isMobile) {
				initMobile();
			} else {
				initDesktop();
			}
		});
	};
	return {
		'init': init
	};
}(jQuery);
