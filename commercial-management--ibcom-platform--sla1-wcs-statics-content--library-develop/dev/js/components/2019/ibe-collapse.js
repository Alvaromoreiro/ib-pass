dFrontJs.ibe_collapse = function(){

	var _slideToogle = function(container){
		container.slideToggle()
	};


	var _clickElement = function(){
		var $this = $(this),
			$container = $this.parents().find('[data-toggle-content]'),
			$button = $('.ibe-search-collapse__item--button-s');
		if(!$container.is(':visible')) {
			$button.removeClass('collapsed');
			_slideToogle($container)
		}else if($this.data('toggle-element') === 'both' || $this.data('toggle-element') === 'close' ){
			$button.addClass('collapsed');
			_slideToogle($container)
		}

	}

	var _$dataclickClickEvent = function(){
		var $this = $(this),
			$data = $this.data('click'),
			$block = $this.parents().find('[data-open="'+$data+'"]');

		if($block.length > 0 && !$this.is(':checked')){
			$block.hide('fade');
		}else{
			$block.show('fade');
		}

	}

    // Event CLICK
    var init = function(){
    	var $element = $('[data-toggle-element]'),
		    $click = $('[data-click]'),
		    $button = $('.ibe-search-collapse__item--button-s'),
            $dataToggle = $('[data-toggle-element="both"]');

    	$button.addClass('collapsed');


		$click.off('click', _$dataclickClickEvent);
    	$click.on('click', _$dataclickClickEvent);

	    $element.off('click', _clickElement);
	    $element.on('click', _clickElement);



    };
    return{
        "init": init
    };
}(jQuery);
