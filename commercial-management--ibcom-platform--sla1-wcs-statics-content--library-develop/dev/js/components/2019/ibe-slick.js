dFrontJs.ibe_slick = function(){
	var calculateHeight = function(box){
		if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) {
			dFrontJs.app.calculateHeightComponents(box, false);
		}else{
			dFrontJs.app.adaptHeight(box);
		}
	};

	var inicializateSlick = function(slick){

		slick.not('.slick-initialized').slick({
			dots: true,
			arrows: false,
			slidesToShow: 2,
			slidesToScroll: 2,
			infinite: false,
			variableWidth: true,
			adaptiveHeight: true,
			responsive: [
				{
					breakpoint: 768,
					infinite: false,
					variableWidth: true,
					adaptiveHeight: true,
					settings:{
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}, {
					breakpoint: 1024,
					infinite: false,
					variableWidth: true,
					adaptiveHeight: true,
					settings:{
						slidesToShow: 2,
						slidesToScroll: 2
					}
				},{
					breakpoint: 10000,
					settings: 'unslick'
				},
			]
		})


	}

    var init = function(){
    	var box = $('[data-resize="info-box"]'),
	        slick = $('[data-slick="info-box"]');

    	inicializateSlick(slick);

    	calculateHeight(box);

    };//

    return{
        "init": init,
	    "calculateHeight": calculateHeight,
	    "inicializateSlick": inicializateSlick
    };
}(jQuery);
