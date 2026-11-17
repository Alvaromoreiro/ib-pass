dFrontJs.ibe_datepicker = function () {
	var init = function ($selector, params) {
		var $datepicker = ($selector) ? $selector.find('[data-datepicker]') : $('[data-datepicker]');
		$datepicker.each(function () {
			var label = $(this).find('label');
			var input = $(this).find('input');
			var inputId = $(this).find('input').attr('id');
			var paramsCurrent = $.extend({}, params);
			paramsCurrent.formElements = {};
			paramsCurrent.formElements[inputId] = '%d/%m/%Y';
			paramsCurrent.noTodayButton = 'false';

			datePickerController.createDatePicker(paramsCurrent);
			//datePickerController.setDisabledDates(inputId, disabledDates);

			$(this).find('.date-picker-control').on('click', function () {
				var id;
				datePickerController.show(inputId);

				id = 'fd-' + inputId;
				if ($('#' + id).parents('[data-datepicker]').length === 0) {
					$('#' + id).appendTo($(this).parents('[data-datepicker]'));
				}

				label.addClass('xui-label--up');
				input.focus();
			});

			$(this).find('input').focus(function (e) {
				var id;
				datePickerController.show(inputId);

				id = 'fd-' + inputId;
				if ($('#' + id).parents('[data-datepicker]').length === 0) {
					$('#' + id).appendTo($(this).parents('[data-datepicker]'));
				}

			});
			$(this).find('input').focusout(function () {
				datePickerController.hide(inputId);

			});
		})
	};
	return {
		'init': init
	};
}(jQuery);
