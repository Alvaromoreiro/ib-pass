dFrontJs.ibe_dinamic_modal = function(){

	var _disableCollapse = function (e) {
		e.stopPropagation();
		e.preventDefault();
	};

	var _keyDown = function(e,$this){
		e.stopPropagation();
		if (e.keyCode === 27) {
			close($this);
		}
	}

	var open = function($this){
		var $group = $this.closest('.ibe_form__group'),
			calendar = $this.attr('data-target');

		if(window.innerWidth < dFrontJs.resolutions.lg){
			$group.addClass('ibe-dinamic-modal');
			$group.attr("data-keyboard-close","esc");
			$('body').css('overflow','hidden');
		}

		if($group.children('[data-autocomplete="cities"]').length > 0){
			dFrontJs.ibe_searcher_choose_city.selectedCity($group);
		}else{
			$group.scrollTop(0);
		}

		$(this).off("keydown", _keyDown);
		$(this).on("keydown", _keyDown);


	};

	var close = function($this){
		var $group = $this.closest('.ibe-dinamic-modal'),
			$collapse = $group.find('.in'),
			$calendar = $this.parent().find('.ibe-searcher__calendar');

		$group.removeClass('ibe-dinamic-modal');
		$('body').css('overflow','auto');
		if($collapse.length > 0){
			$collapse.collapse('hide');
		}
	};

	var _openClickDinamic = function(){
		var $this = $(this),
			calendar = $this.attr('data-target');

		if ($(calendar).hasClass('fc-date-loaded')){
			$(calendar).addClass('in');
		}

		open($this);
	};

	var _closeClickDinamic = function(){
		var $this = $(this),
			$selector = $this.closest('.ibe_form__group').children('.fc-people-counter-active');


		if($(this).data('dinamic-close') === 'reset'){
			if($selector){
				dFrontJs.ibe_searcher_people_counter.restorePassenger($this, $selector);
			}

		}else if($(this).data('dinamic-close') === 'save'){
			if($selector) {
				dFrontJs.ibe_searcher_people_counter.savePassenger($this, $selector);
			}
		}

		close($this);
	}


	var init = function(){
		$('[data-dinamic-close]').off('click', _closeClickDinamic);
		$('[data-dinamic-close]').on('click', _closeClickDinamic);


		$('[data-dinamic-open]').off('click',_openClickDinamic);
		$('[data-dinamic-open]').on('click',_openClickDinamic);
    };

	var resize = function(){
		if(window.innerWidth >= dFrontJs.resolutions.lg){
			if($('body').css('overflow','hidden')){
				$('body').css('overflow','auto');
			}
			if ($('.ibe-dinamic-modal').length > 0){
				$('.ibe-dinamic-modal').removeClass('ibe-dinamic-modal');
			}
		}
	};

    return{
        "init"  : init,
        "open"  : open,
        "close" : close,
	    "resize": resize
    };
}(jQuery);
