dFrontJs.ibe_view_more = function () {
	var init = function () {
		var $element = $('[data-view-more="parent"]');
		var $button;
		if ($element.length > 0) {
			$button = $element.find('[data-view-more="button"]');
			$button.css('display', 'none');
			$('[data-value="more"]').css('display', 'block');
			$('[data-view-more="container"] *:last-child').css('margin-bottom', '0');
			//Events
			$button.on('click', function (e) {
				var $this = $(this), $text = $this.parent().find('[data-view-more="container"]');
				e.preventDefault();
				$text.css({'float': 'left', 'width': '100%'});

				if ($this.hasClass('ibe-link-view-more--more')) {
					$this.addClass('ibe-link-view-more--less').removeClass('ibe-link-view-more--more');
					$this.text($this.data('text-expanded'));
					$this.attr('title', $this.data('text-expanded'));
				} else {
					$this.addClass('ibe-link-view-more--more').removeClass('ibe-link-view-more--less');
					$this.text($this.data('text-collapsed'));
					$this.attr('title', $this.data('text-collapsed'));

					if ($(window).scrollTop() > $this.parent().offset().top) {
						$('html, body').animate({
							scrollTop: $this.parent().offset().top
						}, 1000);
					}

				}

				if ($text.hasClass('xui-collapse_moreInfo-text-close')) {
					$text.switchClass('xui-collapse_moreInfo-text-close', 'xui-collapse__moreInfo-link-open', 400);
				} else {
					$text.switchClass('xui-collapse__moreInfo-link-open', 'xui-collapse_moreInfo-text-close', 400);
				}
				$text.css({'float': 'none', 'width': '100%'});
			});
		}
	};
	return {
		'init': init
	};
}(jQuery);
