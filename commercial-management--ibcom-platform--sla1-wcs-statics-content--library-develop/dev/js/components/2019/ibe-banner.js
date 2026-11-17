dFrontJs.ibe_banner = function(){

	function renderBackground(banner, img, resolution, format) {
		var imgUrl = `${img}_${resolution}.${format}`;
		var defaultUrl = img + '.' + format;
		$.ajax({
			url: imgUrl,
			type: 'HEAD',
			success: function () {
				banner.css('background-image', 'url(' + imgUrl + ')');
			},
			error: function () {
				banner.css('background-image', 'url(' + defaultUrl + ')');
			}
		});
	}

    var init = function(){
	    var banner = $('[data-background]'),
		    img = banner.data('background'),
		    resolution = banner.data('background-resolution') || '1280',
	    	format = banner.data('background-format') || 'png';

	    if(window.innerWidth >= dFrontJs.resolutions.xl){
	    	resolution='1280';
	    }else if(window.innerWidth >= dFrontJs.resolutions.lg){
		    resolution='1024';
	    }else if(window.innerWidth >= dFrontJs.resolutions.md){
		    resolution='768';
	    }else if(window.innerWidth >= dFrontJs.resolutions.sm){
		    resolution='480';
	    }else if(window.innerWidth >= dFrontJs.resolutions.xs){
		    resolution='320';
	    }


	    renderBackground(banner, img, resolution, format);


    };//
    return{
        "init": init
    };
}(jQuery);
