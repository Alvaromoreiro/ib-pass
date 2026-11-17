dFrontJs.ibe_filter = function () {
	// show = '[data-show-more]';
	// $show = $(show);
	
	// container = $show.data('show-more');
	// actives = $show.data('show-more-init');
	// number = $show.data('show-more-number');
	// total = actives;
	var checkInputs = function (inputCheck) {
		var bool = false;
		inputCheck.parents('[data-filter="menu"]').find('input[type="checkbox"]').each(function () {
			if ($(this).prop('checked')) {
				bool = true;
			}
		});
		if (!bool) {
			$('[data-filter-option="all"]').prop('checked', true);
			$('[data-filter-option="all"]').prop('disabled', true);
			$('[data-filter-item]').css('display', 'block');
		}
	};
	var init = function (selector) {
		changeItems();
		$(document).on('change', '[data-filter="menu"] input[type="checkbox"]', function (ev) {
			var $this = $(this),
				checkValue = $this.val();
			if ($('[data-filter="menu"]').find('[data-filter-option="all"]').prop('checked')) {
				ev.preventDefault();
				$('[data-filter-option="all"]').prop('disabled', true);
			} else {
				ev.preventDefault();
				$('[data-filter-option="all"]').prop('disabled', false);
			}
			if (checkValue !== 'all') {
				$('[data-filter-option="all"]').prop('checked', false);
				$('[data-filter-item]').css('display', 'none');
				$('[data-filter-option="all"]').prop('disabled', false);
				$this.parents('[data-filter="menu"]').find('input[type="checkbox"]').each(function () {

					if ($(this).prop('checked')) {
						$('[data-filter-item="' + $(this).val() + '"]').css('display', 'block');
					}
				});
				checkInputs($this);
			} else {
				$('[data-filter-item]').css('display', 'block');
				$('[data-filter="menu"] input[type="checkbox"]').not($this).prop('checked', false);
			}
			changeItems();
			dFrontJs.app.calculateHeightComponentsCard('.ibe-card-link--auto-height', '.ibe-card-link__info');
			dFrontJs.app.emitInView();
		});

		function changeItems() {
			var arr = [];
			var template, $template, $row, numItems, $itemsToShow, x, column;
			var inputsCheck = [];
			var isGrid = $('[data-content="principal-content"]').data('layout') === 'grid';
			$('[data-content="principal-content"]').empty();
			template = $('[data-filter="container"]').html();
			$template = $(template);
			$row;

			$('[data-filter="menu"]').find('input[type="checkbox"]').each(function () {
				if ($(this).prop('checked')) {
					inputsCheck.push($(this).val());
				}
			});
			numItems = 0;
			$itemsToShow = [];
			if ($('[data-filter="menu"]').find('[data-filter-option="all"]').prop('checked')) {

				$template.each(function () {
					var $this = $(this),
						dataFilter = $this.data('filter-item');
					$('[data-content="principal-content"]').empty();
					if ($this.hasClass('ibe-flights-plus-hotel__box')) {
						numItems++;
						$itemsToShow.push($this);
					}
					for (x = 0; x < $itemsToShow.length; x++) {
						if (x === 0) {
							column = $('<div class="col-lg-12 col-sm-12"></div>');
							column.append(($itemsToShow[x]));
							$('[data-content="principal-content"]').append(column);
							$($itemsToShow[x]).find('.ibe-card-link').attr('class', 'ibe-card-link ibe-card-link--xl');
							$($itemsToShow[x]).find('.ibe-card-link').find('.ibe-card-link__info').css('height', '');
						} else {
							column = $('<div class="col-md-4 col-xs-12"></div>');
							column.append(($itemsToShow[x]));
							$('[data-content="principal-content"]').append(column);
						}
					}
				});
			} else {
				$template.each(function () {
					var $this = $(this),
						dataFilter = $this.data('filter-item');
					if ($this.hasClass('ibe-flights-plus-hotel__box')) {
						if (inputsCheck.indexOf(dataFilter) !== -1) {
							numItems++;
							$itemsToShow.push($this);
						}
					}
				});
				for (x = 0; x < $itemsToShow.length; x++) {
					if (x === 0 && !isGrid) {
						column = $('<div class="col-lg-12 col-sm-12"></div>');
						column.append(($itemsToShow[x]));
						$('[data-content="principal-content"]').append(column);
						$($itemsToShow[x]).find('.ibe-card-link').attr('class', 'ibe-card-link ibe-card-link--xl');
						$($itemsToShow[x]).find('.ibe-card-link').find('.ibe-card-link__info').css('height', '');
					} else {
						column = $('<div class="col-md-4 col-xs-12"></div>');
						column.append(($itemsToShow[x]));
						$('[data-content="principal-content"]').append(column);
					}
				}
			}
		}

	};
	return {
		'init': init
	};
}(jQuery);
