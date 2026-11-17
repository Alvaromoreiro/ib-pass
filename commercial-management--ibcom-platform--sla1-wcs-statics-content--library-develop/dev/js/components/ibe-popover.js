dFrontJs.ibe_popover = function () {
	/*eslint no-underscore-dangle: ['error', { 'allow': ['_showPopoverOverlay', '_shownPopover', '_hidePopover','_documentClickPopover'] }]*/
	var toggleMsg = function (status) {
		var txt;
		status ? txt = $msgToggle.data('status-open') : txt = $msgToggle.data('status-close');
		$msgToggle.text(txt);
	};

	// Inmediatly show event
	var _showPopoverOverlay = function () {
		$('.ibe-overlay').show();
	};

	// When Finish animation, run shown event
	var _shownPopover = function () {
		var $element = $('[data-toggle="popover"]');
		$msgToggle = $('[data-toggle-status="true"]');

		$element.next().attr('aria-hidden', 'false');
		if ($msgToggle.length > 0) {
			toggleMsg(true);
		}
		dFrontJs.ibe_inputs.init();
		//dFrontJs.validationForm.init();
		dFrontJs.ibe_validate.init();
		dFrontJs.modalFunction.init();

		//params: (element, modalButton, appendTo);
		dFrontJs.ibe_modal.init();

		$element.parents().find('[data-function="ibe-popover-content"]').trigger('change');
		if ($('[data-function="show-qr"]').length) {
			dFrontJs.ibe_qr.init('[data-function="show-qr"]');
		}

		$('[data-toggle="popover"] + .popover').on('focusout', function () {
			var buttonParent = $(this).parent();
			setTimeout(function () {
				if (buttonParent.has(':focus, .new-clicked-element').length === 0) {
					buttonParent.find('.ibe-button--white-effect').removeClass('active').css('z-index', '');
					if (buttonParent.find('.popover').is(':visible')) {
						buttonParent.find('.popover').popover('hide').data('bs.popover').inState.click = false;
						buttonParent.find('.ibe-button--white-effect').css('z-index', '');
						$('body').removeClass('fc-show-popover');
						$('.ibe-overlay').hide();
						$('[data-function="data-focus-searcher-mobile"], [data-function="data-focus-searcher"]').css('z-index', '');
					}
				}
			}, 200);
		});
	};

	var _hidePopover = function (e) {
		var $element = $('[data-toggle="popover"]');
		$msgToggle = $('[data-toggle-status="true"]');
		$element.next().attr('aria-hidden', 'true');
		if ($msgToggle.length > 0) {
			toggleMsg(false);
		}
	};

	var _documentClickPopover = function (e) {
		$('[data-toggle="popover"]').each(function () {
			if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
				if ($('.popover .popover-content').length) {
					$(this).parent().find('.popover .popover-content input').each(function () {
						$(this).attr('value', $(this).val())
					});
					$(this).parent().find('.popover .popover-content input:checked').each(function () {
						$(this).attr('checked', 'checked')
					});
					$(this).parent().find('.popover .popover-content input[checked="checked"]:not(:checked)').each(function () {
						$(this).removeAttr('checked')
					});
					$(this).parent().find('[data-function="ibe-popover-content"]').html(($(this).parent().find('.popover .popover-content').html()));

					$(this).popover('hide').data('bs.popover').inState.click = false // fix for BS 3.3.6
					$(this).parent().removeClass('xui-icon-share-active');
					dFrontJs.ibe_inputs.init();
				}

			}

		});
	};

	//Jquery popover
	var init = function () {
		var $elementOverlay = $('[data-click-toggle="popover"]');
		var $element = $('[data-toggle="popover"]');
		var lastModal, po, eventTouch;

		$element.next().attr('aria-hidden', 'true');
		$msgToggle = $('[data-toggle-status="true"]');
		if ($element.length > 0) {
			$element.popover({
				sanitize: false,
				html: true,
				content: function () {
					return $(this).parent().find('[data-function="ibe-popover-content"]').html();
				}
				//trigger:'click'
			});
		}

		$elementOverlay.off('show.bs.popover', _showPopoverOverlay);
		$elementOverlay.on('show.bs.popover', _showPopoverOverlay);

		$element.off('shown.bs.popover', _shownPopover);
		$element.on('shown.bs.popover', _shownPopover);

		$element.off('hidden.bs.popover', _hidePopover);
		$element.on('hidden.bs.popover', _hidePopover);

		$(document).off('click', _documentClickPopover);
		$(document).on('click', _documentClickPopover);

		//Control Popover Focus - Home
		if ($('.ibe-home').length) {
			lastModal = '';
			po;
			eventTouch;

			if (is_touch_device()) {
				eventTouch = 'touchend';
			} else {
				eventTouch = 'focusin';
			}

			$('[data-toggle="popover"].ibe-button--white-effect').on(eventTouch, function (e) {
				var target, tar, $elem;
				$('.ibe-button--white-effect').removeClass('active').css('z-index', '');
				$(this).addClass('active').css('z-index', '1002');
				target = e.target || e.srcElement;
				tar = $(target);
				if (lastModal !== target) {
					lastModal = target;
					if ($('.popover').is(':visible')) {
						$('.popover').popover('hide').data('bs.popover').inState.click = false;
					}
					$('.ibe-overlay').hide();
					$('[data-function="data-focus-searcher-mobile"], [data-function="data-focus-searcher"]').css('z-index', '');
				}
				$elem = $(this);
				if (!$('body').hasClass('fc-show-popover')) {
					$('body').addClass('fc-show-popover');
					$('body').on('click', function po(e) {
						var target = e.target || e.srcElement;
						var tar = $(target);
						var buttonParent;
						if ($elem.parent().find(tar).length) {
							$(target).addClass('new-clicked-element');
							setTimeout(function () {
								$('.new-clicked-element').removeClass('new-clicked-element');
							}, 200)
						} else {
							buttonParent = $elem.parent();
							buttonParent.find('.ibe-button--white-effect').removeClass('active');
							$('body').removeClass('fc-show-popover');
							setTimeout(function () {
								if (buttonParent.has(':focus, .new-clicked-element').length === 0) {
									if (buttonParent.find('.popover').is(':visible')) {
										buttonParent.find('.popover').popover('hide').data('bs.popover').inState.click = false;
										$('.ibe-overlay').hide();
										$('[data-function="data-focus-searcher-mobile"], [data-function="data-focus-searcher"]').css('z-index', '');
										buttonParent.find('.ibe-button--white-effect').css('z-index', '');
									}
									$('body').unbind('click', po);
								}
							}, 200);
						}
					});
				}
			});
			$('[data-toggle="popover"].ibe-button--white-effect').on('blur', function () {
				var buttonParent = $(this).parent();
				setTimeout(function () {
					if (buttonParent.has(':focus, .new-clicked-element').length === 0) {
						buttonParent.find('.ibe-button--white-effect').removeClass('active').css('z-index', '');
						if (buttonParent.find('.popover').is(':visible')) {
							$('body').removeClass('fc-show-popover');
							buttonParent.find('.popover').popover('hide').data('bs.popover').inState.click = false;
							buttonParent.find('.ibe-button--white-effect').css('z-index', '');
							$('.ibe-overlay').hide();
							$('[data-function="data-focus-searcher-mobile"], [data-function="data-focus-searcher"]').css('z-index', '');
						}
					}
				}, 200);
			});
		}
	};//pluginPopover
	return {
		'init': init
	};
}(jQuery);
