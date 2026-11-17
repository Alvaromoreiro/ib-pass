dFrontJs.ibe_compact_search = function () {
	var init = function (selector) {
		var node = $(selector), position = node.position(), overlay = $('.ibe-overlay'), detector = $('.fc-searcher-detector');
		var searcherContainer = $('[data-compact-searcher=mobile],[data-compact-searcher="desktop"]'),
		openText = $('[data-accesible-container-open]').data('accesible-container-open'), closeText = $('[data-accesible-container-close]').data('accesible-container-close');
    var targetParent;
    
		searcherContainer.css({ display: 'none' });
		if (!searcherContainer.hasClass( 'compactSearcherInited' )) {
			node.on({
				'click': function () {
					if (node.hasClass('fc-searcherOpen')) {
						closeCompactSearcher();
					} else {
						openCompactSearcher();
					}
				}
			});
			var openCompactSearcher = function(){
				var isDesktop =  window.innerWidth >= 1024;
				var visibleContainer = isDesktop ? searcherContainer.filter('[data-compact-searcher="desktop"]') : searcherContainer.filter('[data-compact-searcher="mobile"]') ;
				var hiddenContainer = !isDesktop ? searcherContainer.filter('[data-compact-searcher="desktop"]') : searcherContainer.filter('[data-compact-searcher="mobile"]');
				var widthAuto = $('.ibe-search-compact__searcher-container--desktop .fc-searcher-detector').width() + 'px'; 
				node.addClass('fc-searcherOpen');
				visibleContainer.attr('aria-hidden', false);
				hiddenContainer.attr('aria-hidden', false);
				visibleContainer.attr('aria-label', openText);
				hiddenContainer.attr('aria-label', openText);
				node.hide();
				visibleContainer.css({ overflow: 'visible' });
				// make visible the hidden container cause is under a hidden-lg
				hiddenContainer.css({ overflow: 'visible' });
				// visibleContainer.css({display:'block'}).removeClass('ibe-search-compact__searcher-container--close').addClass('ibe-search-compact__searcher-container--open').addClass('fc-searcherContainer')
				if (visibleContainer.data('compact-searcher') === 'desktop') {
					visibleContainer.css({display:'block'}).removeClass('ibe-search-compact__searcher-container--close').addClass('ibe-search-compact__searcher-container--open').addClass('fc-searcherContainer')
					visibleContainer.css({width:'0', height:'0'}).animate({width: '100%', height: '170px'}, {duration: 500, easing: 'easeOutSine', done: function() {
						visibleContainer.css({height:'auto'})
					}});
					visibleContainer.find('.ibe-searcher--accordion').css({opacity: 0, 'max-width':widthAuto, 'min-width': widthAuto}).animate({opacity: 1},{duration: 500, easing: 'easeInSine',
					 done: function (){
						visibleContainer.find('.ibe-searcher--accordion').css({opacity: '', 'max-width':'', 'min-width': ''});
					 }});
					 hiddenContainer.css({display:'block'});
					 hiddenContainer.removeClass('ibe-search-compact__searcher-container--close').addClass('ibe-search-compact__searcher-container--open').addClass('fc-searcherContainer');
				} else {
					hiddenContainer.css({display:'block'});
					visibleContainer.removeClass('ibe-search-compact__searcher-container--close').addClass('ibe-search-compact__searcher-container--open').addClass('fc-searcherContainer');
					// visibleContainer.css({width:'100%', height:'0'}).animate({height: 'auto'}, {duration: 500, easing: 'easeOutSine'});
					visibleContainer.css({width:'100%'}).slideDown(500, 'easeInSine');
					hiddenContainer.find('.ibe-searcher--accordion').css({opacity: '', 'max-width':'', 'min-width': ''})
					hiddenContainer.css({display:'block'}).removeClass('ibe-search-compact__searcher-container--close').addClass('ibe-search-compact__searcher-container--open').addClass('fc-searcherContainer');
					// visibleContainer.find('.ibe-searcher--accordion').css({opacity: 0}).animate({opacity: 1},{duration: 750, easing: 'easeInSine'});
				}
			}
		

			var closeCompactSearcher = function(){
				var afterClose = function(){
					node.show();
					visibleContainer.css({display:'none',width:'',height:''});
					visibleContainer.find('.ibe-searcher--accordion').css({'max-width': '', 'min-width': ''});
				};
				var isDesktop =  window.innerWidth >= 1024;
				var widthAuto = $('.ibe-search-compact__searcher-container--desktop .fc-searcher-detector').width() + 'px'; 
				var visibleContainer = isDesktop ? searcherContainer.filter('[data-compact-searcher="desktop"]') : searcherContainer.filter('[data-compact-searcher="mobile"]');
				var hiddenContainer = !isDesktop ?searcherContainer.filter('[data-compact-searcher="desktop"]') : searcherContainer.filter('[data-compact-searcher="mobile"]');
				node.removeClass('fc-searcherOpen');
				visibleContainer.attr('aria-hidden', true);
				visibleContainer.attr('aria-label', closeText);
				hiddenContainer.attr('aria-hidden', true);
				hiddenContainer.attr('aria-label', closeText);
				hiddenContainer.css({display:'none'});
				visibleContainer.removeClass('ibe-search-compact__searcher-container--open').addClass('ibe-search-compact__searcher-container--close');
				hiddenContainer.removeClass('ibe-search-compact__searcher-container--open').addClass('ibe-search-compact__searcher-container--close');
				visibleContainer.css({ overflow: 'hidden' });
				hiddenContainer.css({ overflow: 'hidden' });
				overlay.hide();
				if (visibleContainer.data('compact-searcher') === 'desktop') {
					visibleContainer.find('.ibe-searcher--accordion').css({'max-width': widthAuto, 'min-width': widthAuto});
					visibleContainer.animate({width: '0', height: '0'}, {duration: 500, easing: 'easeOutSine', done : afterClose});
					visibleContainer.find('.ibe-searcher--accordion').animate({opacity: 0},{duration: 500, easing: 'easeOutSine'});
				} else {
					// visibleContainer.animate({height: '0'}, {duration: 500, easing: 'easeOutSine', done : afterClose});
					visibleContainer.slideUp(500, 'easeOutSine', function () { node.show(); });
					// visibleContainer.find('.ibe-searcher--accordion').animate({opacity: 0},{duration: 750, easing: 'easeOutSine'});
				}

				
			}
			$(document).on('click', function (event) {
				var clickedElement, clickedParent;
				clickedElement = event.target;
				clickedParent = clickedElement.closest('.fc-searcher-detector');
				if (clickedParent === null) {
					closeCompactSearcher();
				}
				searcherContainer.addClass('compactSearcherInited');
			});
			$(document).on('keydown', function (e) {
				// ESCAPE key pressed
				var isChildrenOpen = $('.ibe-tab__container [aria-expanded="true"]').length > 0 ? true : false;
				if (e.keyCode === 27 && $('.fc-searcherOpen').length > 0 && !isChildrenOpen) {
					closeCompactSearcher();
				}
			});
			$(document).on('keyup', function (e) {
				var eventTarget = e.target;
				targetParent = eventTarget.closest('[data-function="data-compact-searcher"]');
				if (e.keyCode === 9 && targetParent === null) {
					closeCompactSearcher();
				}
			});
			$(document.body).on('setOfferSeekerWCS', openCompactSearcher);
		}
	};
	return {
		'init': init
	};
}(jQuery);
