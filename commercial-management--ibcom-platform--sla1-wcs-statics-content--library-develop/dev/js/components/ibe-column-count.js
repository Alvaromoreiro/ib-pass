dFrontJs.ibe_column_count = function () {
	return function (nCols, element, items, columns, responsive) {
		var win = $(window);
		var $element, i;

		var calc = function (cols) {
			var itemsSelector = $(dFrontJs.columnsList).clone(),
				nItems = itemsSelector.length,
				calcRows = parseInt(nItems / cols),
				nRows = Math.floor(calcRows),
				subRows = nItems - (calcRows * cols),
				position = 0,
				columnsSelector = $element.find(columns),
				j, i;

			for (j = 0; j < cols; j++) {
				if (subRows > j) {
					$(columnsSelector[j]).append(itemsSelector[position]);
					position++;
				}
				for (i = 0; i < nRows; i++) {
					$(columnsSelector[j]).append(itemsSelector[position]);
					position++;
				}
			}
		};

		var createList = function (e) {
			var i
			var cols = nCols;
			for (i = 0; i < cols; i++) {
				e.append('<ul class="' + columns.replace('.', '') + '"></ul>');
			}
		};

		var reset = function (e) {
			e.children('ul').remove();
		};

		var init = function (e) {
			var destiniesToHtml = e.find('[data-destinies]').html();
			dFrontJs.columnsList = $(destiniesToHtml).find('li.ibe-list-column__item').clone();
			$element = e;
			reset(e);
			createList(e);
			calc(nCols);
		};

		for (i = 0; i < element.length; i++) {
			init($(element).eq(i));
		}
	}

}(jQuery);
