//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: Inputs iberia
//    Descripcion: Funcion para los inputs principales de iberia
//******************************************************************************/
dFrontJs.ibe_inputs = function () {
	/*eslint no-underscore-dangle: ['error', { 'allow': ['_blurFocusoutChangeInput', '_focusBlurInputLabel'] }]*/
	var _blurFocusoutChangeInput = function () {
		inputActive(this);
	};

	var _focusBlurInputLabel = function (e) {
		labelActive(this, e.type);
	};

	var inputActive = function (obj) {
		var $this = $(obj),
			$parent = $this.parents('.ibe_form__group'),
			$label = $this.find('.ibe_form__input-label');

		if ($this.val() !== ""
			&& !$label.hasClass('hideAccessible')
			&& !$this.hasClass('ibe_form__input-text--stop-animation')) { //Stop animation because dtaepicker has two group in the same group,
			//So the group content is added in the datepicker js
			$parent.addClass('ibe_form__group--content');

		} else {
			$parent.removeClass('ibe_form__group--content');
		}
	};//inputActive
	var labelActive = function (obj, typeEvent) {
		var $this = $(obj);
		switch (typeEvent) {
			case 'focus':
				$this.prev().addClass('xui-label--up');
				$('.ibe-accordion__button').parent().addClass('ibe-accordion__overlay-button');
				break;
			case 'blur':
				$this.prev().removeClass('xui-label--up');
				break;
		}
	};//labelActive

	var showHidePassword = function () {
		var $this = $(this);
		var $input =  $this.siblings('input');
		var $accesibleText = $this.children('span.hideAccessible');
		
		if($input.attr('type')==='password'){
			//Change button icon
			$this.removeClass('icon-pass-hidden');
			$this.addClass('icon-pass-visible');
			$input.attr('type','text');
			$accesibleText.text($this.data('text-hide'));
			$input.focus();
		}else{
			$this.addClass('icon-pass-hidden');
			$this.removeClass('icon-pass-visible');
			$input.attr('type','password');
			$accesibleText.text($this.data('text-show'));
			$input.focus();
		}
	}

	//init
	var init = function () {
		var $input_text = $('.ibe_form__input-text');
		var $input_showHideLink = $('[data-showhide]');
			
		$input_showHideLink.off('click',showHidePassword);
		$input_showHideLink.on('click', showHidePassword);
		

		$input_text.each(function () {
			inputActive(this);
		});


		$input_text.off('blur focusout change', _blurFocusoutChangeInput);
		$input_text.on('blur focusout change', _blurFocusoutChangeInput);
		
		$('.fc_form_group').find('input').off('focus blur', _focusBlurInputLabel);
		$('.fc_form_group').find('input').on('focus blur', _focusBlurInputLabel);

	};

	return {
		'init': init,
		'inputActive': inputActive
	}
}(jQuery);
