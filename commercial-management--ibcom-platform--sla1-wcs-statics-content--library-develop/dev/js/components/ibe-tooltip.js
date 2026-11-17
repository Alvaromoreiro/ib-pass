dFrontJs.ibe_tooltip = function () {
	/*eslint no-underscore-dangle: ['error', { 'allow': ['_tooltipGenericInserted', '_tooltipGenericShown', '_showTooltipGeneric', '_closeTooltipButton'] }]*/
	var initLibraryTooltip = function () {
		var $element = $('[data-tooltip="bootstrap"]');
		if ($element.length > 0) {
			$.each($element, function () {
				var $this = $(this);
				var htmlTooltip = $this.find('[data-tooltip="content"]').html();
				$this.tooltip({
					position: {my: 'center top', at: 'center bottom'},
					items: $this,
					content: htmlTooltip
				});
			});
		}
	};

	var _tooltipGenericInserted = function () {
		$(this).next().css('opacity', '0');
	};

	var _tooltipGenericShown = function () {
		var $this = $(this),
			distButtonL = $this.position().left,    //distance left of button
			distTooltipL = $this.next().position().left,   //distance left of tooltip
			wTooltip = $this.next().width(),
			$thisTooltip = $this.next(),
			leftTooltip = $thisTooltip.offset().left,
			paddingContainer = 16,
			paddingLeft, paddingRight;

		if ($('.ibe-box__primary').length > 0) {
			paddingLeft = parseInt($this.parents('.ibe-box__primary').css('padding-left').substr(0, 2));
			paddingRight = parseInt($this.parents('.ibe-box__primary').css('padding-right').substr(0, 2));
		} else {
			paddingLeft = parseInt($this.parents('.ibe-tab__container').css('padding-left').substr(0, 2));
			paddingRight = parseInt($this.parents('.ibe-tab__container').css('padding-right').substr(0, 2));
		}

		if (window.innerWidth < dFrontJs.resolutions.sm) {
			paddingContainer = 0;
			leftTooltip = leftTooltip - 16;
		}
		if (window.innerWidth < dFrontJs.resolutions.lg) {
			if (leftTooltip <= Math.round(((window.innerWidth - $this.parents('.container').innerWidth()) + paddingContainer * 2) / 2)) {
				$this.next().css({'left': 0});
				$('.arrow-desktop-tooltip-head').remove();
				$('head').append('<style class="arrow-desktop-tooltip-head">.ibe-message-tooltip--type02:before{left:' + ($this.position().left + 6) + 'px }</style>');
			} else if ((distTooltipL + wTooltip + paddingLeft + paddingRight) > $this.parents('.container').innerWidth()) {
				$this.next().css({'left': '', 'right': 0});
				$('.arrow-desktop-tooltip-head').remove();
				$('head').append('<style class="arrow-desktop-tooltip-head">.ibe-message-tooltip--type02:before{left: ' + (($this.position().left - $this.next().position().left) + 6) + 'px }</style>');
			} else {
				$('.arrow-desktop-tooltip-head').remove();
			}
		} else {
			$('.arrow-desktop-tooltip-head').remove();
		}
		$(this).next().css('opacity', '1');
	};

	var positionTooltip = function () {
		var $tooltipGeneric = $('[data-tooltipGeneric]');

		if ($tooltipGeneric) {
			$tooltipGeneric.off('inserted.bs.tooltip', _tooltipGenericInserted);
			$tooltipGeneric.on('inserted.bs.tooltip', _tooltipGenericInserted);

			$tooltipGeneric.off('shown.bs.tooltip', _tooltipGenericShown);
			$tooltipGeneric.on('shown.bs.tooltip', _tooltipGenericShown);

			$tooltipGeneric.tooltip({
				template: '<div class="tooltip  ibe-message-tooltip ibe-message-tooltip--type02" role="tooltip"><div class="arrow ibe-message-tooltip__button-close ibe-message__button-close--type02 icon-cerrar"></div><div class="tooltip-inner ibe-message-tooltip__inner"></div></div>',
				//html: true,
				placement: 'bottom'
			});
		}
	};

	var _showTooltipGeneric = function () {
		var $tooltip = $('.tooltip');
		$tooltip.not(this).hide();
		$tooltip.not(this).prev().blur();
	};

	var _closeTooltipButton = function () {
		$(this).parents('[data-tooltip="bootstrap"]').tooltip('hide');
	};

	var init = function () {
		var $element = $('[data-tooltip="bootstrap"]');
		var $tooltipGeneric = $('[data-tooltipGeneric]');
		var $buttonTooltip = $('[data-tooltip="close"]');
		initLibraryTooltip();
		positionTooltip();


		// Only one tooltip should ever be open at a time
		$tooltipGeneric.off('show.bs.tooltip', _showTooltipGeneric);
		$tooltipGeneric.on('show.bs.tooltip', _showTooltipGeneric);

		//Button close
		$buttonTooltip.off('click', _closeTooltipButton);
		$buttonTooltip.on('click', _closeTooltipButton);

		$(window).resize(function (e) {

			$element.tooltip('hide');

		});
	};

	return {
		'init': init
	};
}(jQuery);
