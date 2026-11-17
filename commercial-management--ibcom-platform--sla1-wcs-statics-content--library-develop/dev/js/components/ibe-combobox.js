dFrontJs.ibe_combobox = function () {
	var index = 0;

	var init = function (selector) {
		var $simple = $(selector).length > 0 ? $(selector) : $('[data-selectize="simple"]');
		var openCombobox, closeCombobox, addItem, init, optionRender; //Functions
		if ($simple.length > 0) {
			openCombobox = function (e) {
				$(e).parent().find('input').attr('aria-expanded', 'true');
			};
			closeCombobox = function (e) {
				$(e).parent().find('input').attr('aria-expanded', 'false');
			};
			addItem = function (value, item) {
				item.parent().parent().find('.option').each(function () {
					if ($(this).html() !== item.html()) {
						$(this).removeClass('selected');
					}
				});
			};
			init = function () {
				var $this = $(this);
				//change id dynamically for duplicate id on init component.
				setTimeout(function () {
					index++;
					$($this[0].$control_input[0]).attr('aria-owns', $this[0].$dropdown[0].id + index);
					$($this[0].$dropdown[0]).attr('id', $this[0].$dropdown[0].id + index);
				})
			};
			optionRender = function ($item, escape) {
				return '<div role="option" class="option">' + $item.text + '</div>';
			};
			$simple.selectize({
				onItemAdd: addItem,
				onInitialize: init,
				//openOnFocus: false,
				plugins: {'accessibility': {}},
				render: {
					option: optionRender
				},
				closeAfterSelect: true,
				onDropdownOpen: openCombobox,
				onDropdownClose: closeCombobox
			});
		}
	};//pluginSelectize

	//Libreria selectize
	Selectize.define('accessibility', function (options) {
		var self = this;

		self.setup = (function () {
			var original = self.setup;

			return function () {
				original.apply(self, arguments);
				self.$wrapper.attr({'role': 'application'});
				self.$dropdown.attr({'id': 'aria-selectize-dropdown', 'role': 'listbox'});
				self.$control_input.attr({
					'aria-owns': 'aria-selectize-dropdown',
					'aria-haspopup': 'true',
					'role': 'combobox',
					'aria-autocomplete': 'list',
					'aria-expanded': 'false'
				});
			};
		})();
	});
	return {
		'init': init
	};
}(jQuery);
