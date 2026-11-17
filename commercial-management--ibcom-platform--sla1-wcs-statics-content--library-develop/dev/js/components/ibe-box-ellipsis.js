dFrontJs.ibe_box_ellipsis = function () {
	//Paragraphshort with dotdotdot plugin

	var dot = function(element, height){
		var $element = element !== undefined ? $(element) : $('[data-dotdotdot-new]');
		var $height = (height !== undefined ? height : null);
		requestAnimFrame(function () {
			$element.dotdotdot({
				ellipsis: '...',
				watch: 'true',
				height: $height,	//null default
				truncate: 'letter',
				tolerance: 0
			});
		});
	};

	var init = function () {
		// console.log('se lanza dotdotdot')
		var $element = $('[data-dotdotdot]');
		if(digital_data.Language == "zh" || digital_data.Language == "ja"){
			$element = $element.not(".ibe-carousel--warnings__text");
		}
		requestAnimFrame(function () {
			$element.dotdotdot({
				ellipsis: '...',
				watch: 'true',
				height: '20px',
				truncate: 'letter',
				tolerance: 0
				//callback: function( isTruncated) {
				//reload calculate height when is truncated
				//if ($(".ibe-card-box__content--auto-height").length > 0) {
				//dFrontJs.ibe_card_box.calculateHeightBox(".ibe-card-box__content--auto-height", ".ibe-card-box__content");
				//}
				//}
			});
		});
	};//pluginDotdotdot
	return {
		'init': init,
		'dot': dot
	};
}(jQuery);
