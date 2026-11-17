dFrontJs.ibe_select_tab = function () {
	//Jquery ui accordion
	var init = function () {
		var select = $('[data-ibe-select-tab="content"]');
		$.each(select, function () {
			$(this).on('change', function () {
				$('[data-ibe-select-tab="content"]').closest('[data-ibe-select-tab="container"]').children().find('[data-ibe-select-tab][data-ibe-select-tab!="content"][data-ibe-select-tab!="container"]').addClass('hidden');
				$('[data-ibe-select-tab="' + $(this).closest('[data-ibe-select-tab="content"]').val() + '"]').each(function () {
					$(this).removeClass('hidden');
				});
			})
		})
	};//pluginAccordion
	return {
		'init': init
	};
}(jQuery);
