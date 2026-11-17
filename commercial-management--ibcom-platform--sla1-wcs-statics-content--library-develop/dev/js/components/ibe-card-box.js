dFrontJs.ibe_card_box = function () {
	//ibe-card-box
	var calculateHeightText = function () {
		var selector = $('.ibe-card-box'),
			textHeight, heightTitle, lineHeightTitle, rest, initialHeightText, finalHeight, cont, rest;

		setTimeout(function () {
			$.each($(selector.parents('.ibe-card-box--vertical')), function () {
				var $this = $(this);
				heightTitle = $this.find($('.ibe-card-box__title')).innerHeight();
				lineHeightTitle = $this.find('.ibe-card-box__title').css('line-height').split('px')[0];
				initialHeightText = $this.find('.ibe-card-box__text').innerHeight();
				finalHeight = parseInt(initialHeightText) + parseInt(lineHeightTitle);
				if ($this.find('.ibe-card-box__title').length > 0 && heightTitle > lineHeightTitle) {
					rest = heightTitle - lineHeightTitle;
					textHeight = $this.find('.ibe-card-box__content').innerHeight();
					$this.find('.ibe-card-box__content').height(textHeight - rest);
				}

			});
		}, 1000)


	};
	var init = function () {

	};

	var calculateHeightBox = function (elements, child) {
		requestAnimFrame(function () {
			$(elements).find(child).css('height', 'auto');
			if (window.innerWidth >= dFrontJs.resolutions.md) {
				$.each($(elements), function () {
					var $parent = $(this).parents(':eq(1)'),
						$cards = $parent.find(elements);
					var auxHeight, maxHeight;
					if ($cards.length >= 1) {
						auxHeight = [];
						$.each($cards, function () {
							auxHeight.push($(this).find(child)[0].offsetHeight);
						});

						maxHeight = Math.max.apply(Math, auxHeight);
						$.each($cards, function () {
							$(this).find(child).css('height', maxHeight);

							// Parche para IE "Forzar a dar una altura al figure de la imagen"
							if ((navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) && $(this).find(child).parents('.ibe-card-box--vertical').length > 0 && window.innerWidth >= dFrontJs.resolutions.md) {
								// console.log("hay", maxHeight);
								// //backHeight = $(this).find(child).height();
								$(this).find('.ibe-card-box__figure').height(maxHeight);
							}

						});

					}
				});
			} else {
				$(elements).find(child).css('height', 'auto');
			}
		})
	};
	return {
		'init': init,
		'calculateHeightBox': calculateHeightBox,
		'calculateHeightText': calculateHeightText
	};
}(jQuery);
