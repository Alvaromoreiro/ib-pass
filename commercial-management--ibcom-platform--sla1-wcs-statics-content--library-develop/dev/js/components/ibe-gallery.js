dFrontJs.ibe_gallery = function () {
	var init = function (element) {
		var $gallery = $(element);

		var itemCurrent = 0;

		var showItem = function () {
			$(this.$items[this.currentIndex]).find('a').attr('aria-expanded', true);
			$(this.$items[this.currentIndex]).find('a').attr('aria-label', 'Para cerrar pulse Escape');
			itemCurrent = this.currentIndex;
		};
		var hideItem = function () {
			$(this.$items[itemCurrent]).find('a').attr('aria-expanded', false);
			$(this.$items[itemCurrent]).find('a').attr('aria-label', ' ');
			itemCurrent = 0;
		};
		var itemChange = function (i) {
			$(this.$items[itemCurrent]).find('a').attr('aria-expanded', false);
			$(this.$items[itemCurrent]).find('a').attr('aria-label', ' ');
			$(this.$items[i]).find('a').attr('aria-label', 'Para cerrar pulse Escape');
			$(this.$items[i]).find('a').attr('aria-expanded', true);
			itemCurrent = i;
		};
		$gallery.each(function (index) {
			$(this).GITheWall({
				scrollOffset: 300,
				animationSpeed: 300,
				arrows: false,
				responsive: true,
				closeButtonClass: 'ibe-paper-sheet__options-close',
				onContentLoading: function () {
					this.$expanderInner.addClass('hidden');
				},
				onContentLoaded: function () {
					var elem = this;
					this.$expanderInner.removeClass('hidden');
					dFrontJs.app.emitInView();
					setTimeout(function () {
						elem.resizeHeight($($gallery[index]).find('.ibe-paper-sheet').outerHeight());
					}, 100);
				},
				onShow: showItem,
				onHide: hideItem,
				onItemChange: itemChange
			});
			$(this).find('a').attr({
				'aria-expanded': 'false'
			});
		});
	};
	return {
		'init': init
	};
}(jQuery);
