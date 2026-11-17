dFrontJs.ibe_tweets = function () {
	var init = function (list) {
		$(list).masonry({
			itemSelector: '.ibe-tweets-wall__item',
			percentPosition: true
		});
		// });
	};
	return {
		'init': init
	};
}(jQuery);
