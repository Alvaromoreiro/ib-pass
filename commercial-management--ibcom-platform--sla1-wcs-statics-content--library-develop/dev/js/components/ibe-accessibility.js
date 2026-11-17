dFrontJs.ibe_accessibility = function () {
	//CHANGE INPUTS LABELS
	var init = function (selector) {
		var node = $(selector);
		var inputBox = node.find('input');

		inputBox.on({
			'focus': function () {
				$(this).prev().addClass('xui-label--up');
			},
			'blur': function () {
				$(this).prev().removeClass('xui-label--up');
			}
		})
	};//
	var imgTitle = (function () {
		var link = $('a[title]').find('img[title]').parents('a');
		var title = '';
		link.on('mouseover', function () {
			title = $(this).find('img').attr('title');
			$(this).find('img').removeAttr('title');
		});
		link.on('mouseout', function () {
			$(this).find('img').attr('title', title);
		});
	});
	return {
		'init': init,
		'imgTitle': imgTitle
	};
}(jQuery);
