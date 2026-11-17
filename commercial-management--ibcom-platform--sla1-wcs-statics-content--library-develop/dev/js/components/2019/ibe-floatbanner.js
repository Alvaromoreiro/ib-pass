dFrontJs.ibe_floatbanner = function(){

	function renderFloatBackground(banner, img){
		banner.css('background-image', 'url("'+img+'")');
		
	}
   
    // Event CLICK
    var init = function(){
	    var banner = $('[data-floatbackground]');
		  
		banner.each(function () {
			var img = $(this).data("floatbackground");
			$(this).attr('data-floatbackground','');
			renderFloatBackground($(this), img); 
		});   
	    

    };
    return{
        "init": init
    };
}(jQuery); 
