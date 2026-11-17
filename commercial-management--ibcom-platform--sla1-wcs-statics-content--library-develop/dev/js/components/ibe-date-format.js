dFrontJs.ibe_dateFormat = function () {
	//date format function
	var init = function () {
		if ($('[data-date-large]').length) {
			$('[data-date-large]').each(function () {
				var $this = $(this),
					dateFormatShort = $this.data('date-short'),
					dateFormatLarge = $this.data('date-large');
				if (window.innerWidth < dFrontJs.resolutions.md && $this.text() !== dateFormatShort) {
					$this.text(dateFormatShort);
				} else if (window.innerWidth >= dFrontJs.resolutions.md && $this.text() !== dateFormatLarge) {
					$this.text(dateFormatLarge);
				}
			})

		}
	};//date format function
	return {
		'init': init
	};
}(jQuery);
