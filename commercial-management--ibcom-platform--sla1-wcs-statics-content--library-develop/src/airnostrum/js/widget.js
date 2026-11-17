if (typeof globalConfig === 'undefined') {
    globalConfig = {};
}
//Replace all ocurrences of a string
String.prototype.replaceAll = function (oldStr, newStr){return this.split(oldStr).join(newStr);}

$(document).ready(function(){
	/* custom select boxes and radio buttons */
	customElementsIberia.init();
	
	/* general events */
	miscInteractions.init();
	
	/* main fly-search behaviors */
	homeBox.init();
	
	/* destination tab behaviors */
	destinationTab.init();
  
	$("#toStep2").click(function(e){
		e.preventDefault();
		var $form = $(this).closest('form');
		$form.addClass('step-2');

      var errors = destinationTab.searchFlyValidateToStep2($form, true);
      if (errors.hasErrors) {
        utils.prettyAlert(errors.messagesTxt, globalConfig.errorData.errorsTitle);
        return;
      }else{
			$('.search-step1').hide();
			$('.search-step2').show();
		}
	})
	$("#toStep1").click(function(e){
		e.preventDefault();
		var $form = $(this).closest('form');
		$form.removeClass('step-2');
		$('.search-step1').show();
		$('.search-step2').hide();
	})
	
	$(document).on('click','.close-calendar', function(e) { 
		destinationTab.closeCalendarBox();
		return false;
	});
	
	var host = document.referrer.replace('http://','').replace('https://','').replace('www.','');
	if(host.indexOf(':')!=-1){
		host = host.substr(0, host.indexOf(':') );
	}
	if(host.indexOf('/')!=-1){
		host = host.substr(0, host.indexOf('/') );
	}
	if(host.lastIndexOf('.')!=-1){
		host = host.substr(0, host.lastIndexOf('.') );
	}
	
	$('a.more').each(function(){
		this.href = this.href +(this.href.indexOf('?')!=-1?'&':'?') +'utm_medium=microsites&utm_campaign=widget&utm_content='+this.id+'&utm_source=' + host;
	});
	$('#utm_source').val(host);
});


var customElementsIberia = {
  config : {
    wrapper : 'select,  radios',
    container : 'div',
    context : 'html'
  },

  init : function(config) {
    $.extend(customElementsIberia.config, config);

    var $context = $(this.config.context);
    if ($context.length < 1) {
      return;
    }

    customElementsIberia.blockEnterKeyOnForms($context);
    customElementsIberia.loadSelects($context);
    customElementsIberia.loadRadios($context);
    
    $(document).trigger('customElementsRunnin');
  },
  


  blockEnterKeyOnForms : function($context) {
    if (typeof $context == 'undefined') {
      $context = $('html');
    }

    // block enter key event
    $context.find('form').on('keypress', function(evt) {
      var evt = (evt) ? evt : ((event) ? event : null);
      var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
      var arr = ["search","helper"];
      var id = evt.target.id;
      if ((evt.keyCode == 13) && (node.type=="text") && ($.inArray(id,arr) < 0))  {return false;}
    });
  },

  loadSelects : function($context) {
  
    if (typeof $context == 'undefined') {
      $context = $('html');
    }

    if ($context.find('select').length) {
   
      
      
      if ( $('#main').find('select').length == 0 && $('#mainComplete').find('select').length == 0 ) {
      
        $context.find('select').each(function() {
		      var $select = $(this);

		      var defaultValue = $select.val();
		      if (defaultValue) {
			      $select.find('option[value="'+ defaultValue +'"]').attr('selected', 'selected').prop('selected', true);
		      }
 
		      $select.sSelect({
			      ddMaxHeight: '100px'
		      });
          
        });
        
      }
     
    }
    
  },

  loadRadios : function($context) {
    if (typeof $context == 'undefined') {
      $context = $('html');
    }

    /* Custom radios */
    $context.find('.form-radio').each(function() {
      var $form_radio = $(this);
      var $wrapper = $(this).parent();
      $form_radio.hide();
      $wrapper.prepend('<div class="custom-radio" tabindex="0"></div>');
      if ($form_radio.is(':checked')) {
        $wrapper.find('.custom-radio').addClass('custom-radio-active');
      }
      if ($form_radio.attr('disabled') == 'disabled') {
          $wrapper.addClass('disabled');
      }

      $('.custom-radio', $wrapper).click(function(e) {
        var $this = $(this);
        var $form_radio = $this.parent().find('.form-radio');
        if ($form_radio.attr('disabled') == 'disabled') {
          return;
        }

        var name = $form_radio.attr('name');
        $('input[name="' + name + '"]').each(function() {          
          $(this).removeAttr('checked').parent().find('.custom-radio').removeClass('custom-radio-active');
        });
        $this.addClass('custom-radio-active');
        $form_radio.attr('checked', 'checked').prop('checked',true).change();
        e.preventDefault();
      });
      $form_radio.on('change', function(event) {        
        var name = $form_radio.attr('name');        
        $('input[name="' + name + '"]').parent().find('.custom-radio').removeClass('custom-radio-active');
        if ($form_radio.is(':checked') ) {
          $wrapper.find('.custom-radio').addClass('custom-radio-active').removeClass('error');
        }
      });

      // Fix jquery.validate required error issues
      $('.form-radio.required').on('change', function() {
        var name = $(this).attr('name');
        $(this).closest('form').find('.form-radio.required[name="' + name + '"]').siblings('.error').removeClass('error');
      });
      $('.form-radio.requiredApi').on('change', function() {
        var name = $(this).attr('name');
        $(this).closest('form').find('.form-radio.requiredApi[name="' + name + '"]').siblings('.error').removeClass('error');
      });

    });

  },
 

};


var miscInteractions = {
  init : function() {
    miscInteractions.placeholderLabels();
  },
  
  modal: function($context) {
    if ($context === undefined) {
      $context = document;
    }

    // Add modal-inner and block-modal divs, and a closing link to each modal-layer.
    $('.modal-layer', $context).each(function() { 
      $(this).hide();
      var modalInner = $(this).children('.modal-inner');
      if (!modalInner.length) {
        modalInner = $(this).wrapInner('<div class="modal-inner" />').children();
      }
      var blockModal = modalInner.children('.block-modal');
      if (!blockModal.length) {
        blockModal = modalInner.wrapInner('<div class="block-style block-modal" />').children();
      }
      var closePopup = blockModal.children('.close-popup');
      if (!closePopup.length && !$(this).hasClass('no-close-link')) {
        if (globalConfig.modal == undefined) {
          globalConfig.modal = defaultGlobalConfig.modal;
        }
        blockModal.prepend('<a title="' + globalConfig.modal.closeTitle + '" class="close-popup" href="#"><img title="' + globalConfig.modal.closeImageTitle + '" alt="' + globalConfig.modal.closeImageAlt + '" src="' + globalConfig.modal.closeImageSrc + '" class="fade" /></a>');
      }
    });

    // Opening
    $('.modal-link', $context).each(function() {
      var target = $(this).attr('href');
      var $selector = $(this);
      $(target).hide().addClass('modal-layer');
      $selector.click(function(e) {
        e.preventDefault();
        miscInteractions.openModal(target, undefined, $selector);
      });
    });


  },

  openModal: function(target, effect, $selector) { 
    if (effect == undefined) {
      effect = 'fade';
    }

    // Hide previous modal if exists
    $('.modal-layer').removeClass('current-visible-popup').hide();
    $('div.overlay').remove();
    
    // dispatch event
    $(document).trigger({ type:"openModalLayer", selector: $selector });
    
    var $layer = $(target);
    var $modal = $layer.find(".modal-inner");
    $layer.after('<div class="overlay"></div>');
	 miscInteractions.closePopupClickAction( $layer );
    var windowHeight = $(window).height();
    var scroll = $(document).scrollTop();
    
    $layer.addClass('current-visible-popup');

    switch (effect) {
      case 'fade':
        $layer.fadeIn('slow');
        break;
      case 'show':
        $layer.show();
    }
  },

  closePopupClickAction: function($context) {
    var $outside = $context;
    if ($context === undefined) {
      $context = document;
      $outside = $('.modal-layer');

      // Add scape key binding
      $(document).on('keydown', function (e) {
        if (e.keyCode === 27) {
          e.preventDefault();
          if ($('.current-visible-popup').length > 0) {
            $('.current-visible-popup .close-popup').click();
          }
          else {
            $('.close-popup:visible').click();
          }
        }
      });
    }

    // Add closing click outside
    $outside.next('.overlay').on('click', function(e) {
      $(this).prev().find('.close-popup').click();
    }).children().click(function(e) {
      e.stopPropagation();
    });

    // Add closing on close link click
    $('.close-popup, .close-popup-2, a.close-tooltip', $context).on('click', function(e) { 
      e.preventDefault();

      var $closest = $(this).closest('.current-visible-popup');
      if ($closest.length > 0) {
        $(this).closest('.current-visible-popup').removeClass('current-visible-popup').hide();
      }
      else {
        $(this).parent().hide();
      }

      var closeOverlay = $(this).parents('.current-visible-popup').length < 1;
      if (closeOverlay && ($('.overlay').length > 0)) {
        $('.overlay').hide();
      }
      
      $(document).trigger('closingModalLayer');

      e.stopPropagation();
    });
  },

  placeholderLabels: function() {

    $('.placeholder-wrapper input[type!="hidden"]').each(function(){
      if($(this).val() == '') {}
      else {
        $(this).parent().find("label").hide();
      }
    });
    $(".placeholder-wrapper label").on('click', function(){
      $(this).hide().siblings('input').focus().click();
    });
    $(".placeholder-wrapper input").on('focus', function(){

      $(this).parent().addClass("focused");
      $(this).parent().removeClass("blured");
      $(this).parent().find("label").hide();
    });
    $(".placeholder-wrapper input").on('blur', function(){
      $(this).parent().removeClass("focused");
      $(this).parent().addClass("blured");
      if(this.value=='') {
        $(this).parent().find("label").show();
      }
      else {
        $(this).parent().find("label").hide();
      }
    });
  },

};


var utils = {

  parseSearchTerm: function (term) {
    var translate = {
      'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
      'æ': 'ae',
      'ç': 'c',
      'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
      'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
      'ñ': 'n',
      'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
      'œ': 'oe',
      'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
      'ý': 'y', 'ÿ': 'y'
    };
    return term.replace(/[àáâãäåæçèéêëìíîïñòóôõöœùúûüýÿ]/g, function(match) {
      return translate[match];
    });
  },

  prettyAlert : function(message, title, id, unablinEvents) {
    var generic = 'pretty-alert-generic-message';
    if (id == undefined) {
      id = generic;
      $('#' + generic).remove();
    }
    var $messageLayer = $('#' + id);
    if ($messageLayer.length < 1) {
      var html = utils.prettyAlertMarkup(message, title, id);
      $('body').append(html);
      $messageLayer = $('#' + id);
      miscInteractions.modal();
      /*if(unablinEvents != true) {
        miscInteractions.closePopupClickAction($messageLayer);
      }*/
    }
    miscInteractions.openModal('#' + id);
  },

  prettyAlertMarkup : function(message, title, id) {
    var html = '';
    html += '<div class="modal-layer" id="' + id + '">';
    html += '  <div class="modal-inner w-640">';
    if (title) {
      html += '    <strong class="heading-1 info">' + title + '</strong>';
      html += '    <hr class="full-hr" />';
    }
    html += '  <p class="wk-90">' + message + '</p>';
    html += '  </div>';
    html += '</div>';
    return html;
  },
  
  isValidDate: function(string) {
    if (typeof string == 'undefined') {
      return false;
    }

    var parts = string.match(/(\d+)/g);
    return parts && (parts.length == 3);
  },

  isValidDateRange : function(date, dateMin, dateMax) {
    if (typeof date == 'string') {
      date = utils.parseDate(date);
    }
    
    if ((typeof dateMin == 'undefined') || !dateMin) {
      dateMin = new Date();
      dateMin.setHours(0, 0, 0, 0);
    }
    
    if (date < dateMin) {
      return false;
    }

    if ((typeof dateMax != 'undefined') && dateMax && (date > dateMax)) {
      return false;
    }
    
    return true;
  },

  parseDate : function(string) {
    if (typeof string == 'undefined') {
      return 0;
    }

    var parts = string.match(/(\d+)/g);
    if (!parts || parts.length != 3) {
      return 0;
    }
    
    var dateFormat = utils.loadDateFormat();
    var pos = utils.getDatePositions(dateFormat);

    var day = parseInt(parts[pos.day], 10);
    var month = parseInt(parts[pos.month], 10);
    var year = parseInt(parts[pos.year], 10);
    if (!(day >= 1) || !(month >= 1) || !(year >= 0)) {
      return 0;
    }

    return new Date(year, month-1, day); // months are 0-based
  },

  splitDate : function(string, forceDefaulFormat) {
    if (typeof string == 'undefined') {
      return null;
    }
    
    if (typeof forceDefaulFormat == 'undefined') {
      forceDefaulFormat = false;
    }

    var dateFormat = utils.getDefaultDateFormat();
    if (!forceDefaulFormat) {
      dateFormat = utils.loadDateFormat();
    }
    
    var pos = utils.getDatePositions(dateFormat);
    var parts = string.match(/(\d+)/g);
    
    if (!parts || (parts.length != 3)) {
      return '';
    }
    
    return [parts[pos.day], parts[pos.month], parts[pos.year]]; // day, month, year
  },

  buildDate : function(day, month, year) {
    var dateFormat = utils.loadDateFormat();
    dateFormat = utils.reduceDateFormat(dateFormat, true);
    dateFormat = dateFormat.replace('d', day);
    dateFormat = dateFormat.replace('m', month);
    dateFormat = dateFormat.replace('y', year);
    return dateFormat;
  },
  
  maxValidDate : function(dates) {
    return utils.searchDate(dates, 'max');
  },

  minValidDate : function(dates) {
    return utils.searchDate(dates, 'min');
  },

  searchDate : function(dates, type) {
    var resultDate = null;
    for (var i = 0; i < dates.length; i++) {
      var date = dates[i];
      if (typeof date == 'string') {
        date = utils.parseDate(date);
      }
      if (date) {
        var update = (type == 'min') ? (date < resultDate) : (date > resultDate);
        if (!resultDate || update) {
          resultDate = date;
        }
      }
    }
    return resultDate;
  },
  
  getDatePositions : function(dateFormat) {
    dateFormat = utils.reduceDateFormat(dateFormat);
    var positions = {
      day: dateFormat.indexOf('d'),
      month: dateFormat.indexOf('m'),
      year: dateFormat.indexOf('y')
    };
    return positions;
  },
 
  reduceDateFormat : function(dateFormat, preserveSeparator) {
    if ((typeof preserveSeparator == 'undefined') || !preserveSeparator) {
      dateFormat = dateFormat.replace(/\//g, '');
    }
    while (dateFormat.indexOf('dd') != -1) {
      dateFormat = dateFormat.replace('dd', 'd');
    }
    while (dateFormat.indexOf('mm') != -1) {
      dateFormat = dateFormat.replace('mm', 'm');
    }
    while (dateFormat.indexOf('yy') != -1) {
      dateFormat = dateFormat.replace('yy', 'y');
    }
    return dateFormat;
  },
  
  loadDateFormat : function() {    
    // load from globalConfig.calendarDateFormat
    if ((typeof globalConfig.calendarDateFormat != 'undefined') && globalConfig.calendarDateFormat) {
      return globalConfig.calendarDateFormat;
    } 
    
    // load from datepicker's regional configuration
    var language = utils.loadCurrentLanguage();
    if (language &&
        (typeof $.datepicker != 'undefined') &&
        (typeof $.datepicker.regional != 'undefined') &&
        (typeof $.datepicker.regional[language] != 'undefined') &&
        (typeof $.datepicker.regional[language].dateFormat != 'undefined') &&
        $.datepicker.regional[language].dateFormat) {
          return $.datepicker.regional[language].dateFormat;
    }
    
    return utils.getDefaultDateFormat();
  },

  getDefaultDateFormat : function() {
    return 'dd/mm/yy';
  },

  loadCurrentLanguage : function() {
    var lang = 'es';
    if ((typeof globalConfig != 'undefined') && globalConfig.currentLanguage) {
      lang = globalConfig.currentLanguage; 
    } else if((typeof language != 'undefined') && language) {
      lang = language;
    }
    return lang;
  },
  
  containsNumber : function(string) {
    return string.match(/\d+/g);
  },

  decodeAirportString : function(airport) {
    var splitted = airport.split('(');      
    var result = {
      city : splitted[0],
      code : splitted[1],
      country : airport.split('),')[1]
    }

    if (result.code == undefined) {
      result.code = '';
    }
    else if (result.code.length > 3) {
      result.code = result.code.substr(0, 3);
    }

    if (result.country == undefined) {
      result.country = '';
    }
    else {
      result.country = $.trim(result.country);
    }

    return result;
  },
 
  onOutsideClick : function($element, callback) {
    $(document).on('mousedown', function (e){
      if ($element.has(e.target).length === 0) {
        callback();
	      $(this).off( e );
      }
    });
  }

}

var leverageTypeahead = {
  /*
   * Highlighter that works with no US-ASCII characters
   */
  highlighter: function (item, query) {
    if (this.query != undefined) {
      query = this.query;
    }
    var regex = new RegExp( '(' + utils.parseSearchTerm(query) + ')', 'gi' );
    //return item.replace( regex, "<strong>$1</strong>" );
    var parsedItem = utils.parseSearchTerm(item).replace(regex, function(match) {
      return "<strong>" + match + "</strong>";
    });
    var arr = parsedItem.split('<strong>');
    var index = arr[0].length;
    var index2;
    for (var i = 1; i < arr.length; i++) {
      // Insert <strong> at the corresponding position
      item = item.substr(0, index) + '<strong>' + item.substr(index);
      index += 8;

      // Insert </strong> at the corresponding position
      index2 = index + arr[i].indexOf("</strong>");
      item = item.substr(0, index2) + '</strong>' + item.substr(index2);
      index += arr[i].length;
    }
    return item;
  }
}



/*
 * Interactions for destination box tab.
 */
var destinationTab = {
  config : {
    context : '#search-form div.search-fly-content',
    dateFrom : '',
    dateTo : '',
    calendarIsOpen : false,
    goinOnOrBack : "text-date-from"
  },

  init : function(config) {
    $.extend(destinationTab.config, config);

    var $context = $(destinationTab.config.context);
    if ($context.length < 1) {
      return;
    }

	 destinationTab.calendar($context);
    // get default date text from hidden inputs
    destinationTab.setDefaultDate($('#diaSalida'));
    destinationTab.setDefaultDate($('#diaRegreso'));

    destinationTab.setCurrentStep('step-from');
    
    destinationTab.dateInputClick();
    destinationTab.formBehaviors($context);
  },


  formBehaviors: function($context) {
    destinationTab.typeSelection();
    destinationTab.searchFlySubmit($context);
  },
  
  calendar : function($context) {
    $context.find('#calendar_selector').each(function() {
      var $calendar = $(this);

      $calendar.attr('autocomplete', 'off');
		  var limits = destinationTab.getCalendarDateRange('step-from');

      $calendar.datepicker({
        numberOfMonths: 1,
        showButtonPanel: false,
        beforeShowDay: destinationTab.onCalendarShowDay,
        onSelect: destinationTab.onCalendarSelect,
        minDate: limits.minDate,
        maxDate: limits.maxDate
      });

		  $(document).on("mouseover",".ui-datepicker-calendar a",function(){
  			var step = destinationTab.getCurrentStep(); 
  			var from = destinationTab.config.dateFrom;
  			var to = destinationTab.config.dateTo;
  			var id = parseInt( $(this).attr("id").replace("cal","") ,10);
  			var currentHover = new Date( id );
  			var selection = $("");
				
			  if(step == "step-from" && destinationTab.config.calendarIsOpen){
  				$("#diaSalida").siblings('label.placeholder').hide();
  				$("#diaSalida").val( $.datepicker.formatDate($.datepicker._defaults.dateFormat, currentHover) )
  				$("a.highlight-interval").removeClass("highlight-interval");
  				$("td.highlight-interval").removeClass("highlight-interval").addClass("highlight-interval-temp");
  				var date = new Date( to );
  				date.setDate( date.getDate()-1 );
  				while( date.getTime()>currentHover.getTime()  ){
  					selection = selection.add( $("#cal"+date.getTime()) );
  					date.setDate( date.getDate()-1 );
  				}
			  }else if(step == "step-to" && destinationTab.config.calendarIsOpen){
  				$("#diaRegreso").siblings('label.placeholder').hide();
  				$("#diaRegreso").val( $.datepicker.formatDate($.datepicker._defaults.dateFormat, currentHover) )
  				$("a.highlight-interval").removeClass("highlight-interval");
  				$("td.highlight-interval").removeClass("highlight-interval").addClass("highlight-interval-temp");
  				var date = new Date( from );
  				date.setDate( date.getDate()+1 );
  				while( date.getTime()<currentHover.getTime()  ){
  					selection = selection.add( $("#cal"+date.getTime()) );
  					date.setDate( date.getDate()+1 );
  				}
			  }
			  selection.addClass("highlight-interval")
		  });

  		$(document).on("mouseout",".ui-datepicker-calendar a",function(){
  			$("a.highlight-interval").removeClass("highlight-interval");
  			$("td.highlight-interval-temp").removeClass("highlight-interval-temp").addClass("highlight-interval");
  			
  			var step = destinationTab.getCurrentStep(); 
  			if(step == "step-from"){
  				$("#diaSalida").val( $.datepicker.formatDate($.datepicker._defaults.dateFormat, destinationTab.config.dateFrom) )//.blur()
  			}else if(step == "step-to"){
  				$("#diaRegreso").val( $.datepicker.formatDate($.datepicker._defaults.dateFormat, destinationTab.config.dateTo) )//.blur()
  			}
  		});

    });

    
  },

  setDefaultDate : function($input) {
    var newDateText = '';
    newDateText = destinationTab.getDateFromHiddenInputs($input);

    if (newDateText) {
      $input.val(newDateText).siblings('label').hide();
      destinationTab.setConfigDates($input, newDateText,true);
    }
  },

  getDateFromHiddenInputs : function($input) {
    var $hiddens = $input.siblings('input[type="hidden"]');
    if ($hiddens.length < 2) {
      return '';
    }

    var day = $hiddens.eq(0).val();
    var yearMonth = $hiddens.eq(1).val();
    var year = yearMonth.substr(0, 4);
    var month = yearMonth.substr(4, 2);
    if (!day || !month || !year) {
		 $input.val("").blur();
      return '';
    }

    return utils.buildDate(day, month, year);
  },


  dateInputClick: function() {
		function dateInputEnter(e) { 
      e.preventDefault();

      var isDeparture = ($(this).attr('id') == 'diaSalida' || $(this).hasClass('text-date-from'));
      var step = isDeparture ? 'step-from' : 'step-to';
      destinationTab.setCurrentStep(step); 
      
      var applicatedClass = $(this).attr('class');
	      if(applicatedClass==undefined){
		      applicatedClass = null;
	      }else{
		      if(applicatedClass.indexOf("text-date-from") != -1) {
			      applicatedClass = "text-date-from";
		      } else if(applicatedClass.indexOf("text-date-to") != -1) {
			      applicatedClass = "text-date-to";
		      } else {
			      applicatedClass = null;
		      }
	      }
	  $(".js-focused").removeClass("js-focused");
	  $(this).closest('span').addClass("focused js-focused");


      if(applicatedClass != destinationTab.config.goinOnOrBack) { 
				//destinationTab.config.calendarIsOpen = false;
         destinationTab.openCalendarBox( $(this) );
      } else if(destinationTab.config.calendarIsOpen != true) {
         destinationTab.openCalendarBox( $(this) );
      } else {
         destinationTab.closeCalendarBox();
      }
	  
      if(applicatedClass != null) {
         destinationTab.config.goinOnOrBack = applicatedClass;
      }
      
      
		}
		var $texts = $('#diaSalida, #diaRegreso');
		$texts.on('focus', dateInputEnter);
		$('a.text-date-from, a.text-date-to').on('click', dateInputEnter);
		
		//Handle keyboard enter
		var calendar = $(destinationTab.config.context).find('#calendar_selector')
		if(calendar.length==0) calendar = $(destinationTab.config.context).find('#calendar_selector2')
		calendarActions.init($texts, calendar.get(0) );
		
		
  },

  openCalendarBox: function($trigger) {

       var $context = $(destinationTab.config.context);

       destinationTab.setCalendarDates();
		

       var $calendar = $context.find('div.bl-calendar');
       if (!$calendar.length)return;
		 var $inputs= $trigger.closest('.open-calendar')

		 if(destinationTab.config.calendarIsOpen != true) {
			 $calendar.fadeIn(400, function() { 
				destinationTab.config.calendarIsOpen = true;
			 });
			 $inputs.closest('.search-step2').addClass('calendar-opened');

			 utils.onOutsideClick( $('.open-calendar',$context).add($calendar), destinationTab.closeCalendarBox);  
			$('div.overlay').remove();
			$('body').append('<div class="overlay"></div>');			 
	    }
  },

  closeCalendarBox: function() {

       var $context = $(destinationTab.config.context);
       destinationTab.config.calendarIsOpen = false;
       $context.find('div.bl-calendar').fadeOut(400, function() {

       });
		 $('div.overlay').delay(200).fadeOut(200, function() {
				$(this).remove();
		 });
       
       
		 $context.find('div.search-step2').removeClass('calendar-opened');

  },

  onCalendarShowDay: function(date) {
    var from = destinationTab.config.dateFrom;
    var to = destinationTab.config.dateTo;
    var showToDate = to && (destinationTab.getCurrentType() != 'soloIda');

    if (from && to && showToDate && (from.getTime() == date.getTime()) && (from.getTime()==to.getTime())) {
      return [true, 'selected-from selected-to', null];
    }
    else if (from && (from.getTime() == date.getTime())) {
      return [true, 'selected-from', null];
    }
    else if (showToDate && (to.getTime() == date.getTime())) {
      return [true, 'selected-to', null];
    } else if(from && to && showToDate &&(from.getTime() < date.getTime()) && (to.getTime() > date.getTime()) ){
		return [true, 'highlight-interval', null];
    }
    return [true, '', null];
  },

  onCalendarSelect: function(dateText, inst) {


    var type = destinationTab.getCurrentType();
    var step = destinationTab.getCurrentStep();

		  if (step == 'step-from') {
			  destinationTab.updateCalendarInputs($('#diaSalida'), dateText);
			  if (type == 'idaYvuelta') {
				//Deselect dateTo if dateFrom is greatest
				if(destinationTab.config.dateFrom && destinationTab.config.dateTo && 
					destinationTab.config.dateFrom.getTime() > destinationTab.config.dateTo.getTime() ){
					destinationTab.updateCalendarInputs($('#diaRegreso'), "");
					//destinationTab.setCurrentStep('step-to');
				   // destinationTab.openCalendarBox( $('#diaRegreso') );
					//$('#diaRegreso').focus();
				}/*else if(destinationTab.config.dateFrom && !destinationTab.config.dateTo){
				//If not selected, select next step
				  destinationTab.setCurrentStep('step-to');
				  destinationTab.openCalendarBox( $('#diaRegreso') );
				  $('#diaRegreso').focus();
			  }*/
		  }
		}
		  else {
			  // step == 'step-to'
			  destinationTab.updateCalendarInputs($('#diaRegreso'), dateText);
			//Deselect dateFrom if dateTo is lowest
			if(destinationTab.config.dateFrom && destinationTab.config.dateTo && 
				destinationTab.config.dateFrom.getTime() > destinationTab.config.dateTo.getTime() ){
				destinationTab.updateCalendarInputs($('#diaSalida'), "");
				//destinationTab.setCurrentStep('step-from');
				//destinationTab.openCalendarBox( $('#diaSalida') );
				//$('#diaSalida').focus();
			}/*else if(!destinationTab.config.dateFrom && destinationTab.config.dateTo){
			//If not selected, select prev step
				  destinationTab.setCurrentStep('step-from');
				  destinationTab.openCalendarBox( $('#diaSalida') );
				  $('#diaSalida').focus();
		  }*/
	  }
		var from = destinationTab.config.dateFrom;
		var to = destinationTab.config.dateTo;
		//if( (from && to) || type != 'idaYvuelta'){//close only if both selected and return trip
			setTimeout(destinationTab.closeCalendarBox,300);
		//}

	  $(document).find('.focused').removeClass('focused');
  },

  updateCalendarInputs: function($input, newDateText, moveCalendar) {
    var isValidDate = utils.isValidDate(newDateText) && utils.isValidDateRange(newDateText);
    var isValidDateString = isValidDate || (newDateText && !utils.containsNumber(newDateText));
    var $siblings = $input.siblings('input[type="hidden"]');

    if (!isValidDateString) {
      $input.val('');//.blur();
      $siblings.val('');
    }
    else {
      $input.attr('value', newDateText).val(newDateText).siblings('label').hide();
      if ($siblings.length > 1) {
        if (isValidDate) {
          var parts = utils.splitDate(newDateText);
          $siblings.eq(0).attr('value', parts[0]);  // DAY
          $siblings.eq(1).attr('value', parts[2] + parts[1]);  // (YEAR+MONTH)
          $siblings.eq(2).attr('value', parts[2]);  // YEAR
        }
      }
    }

    destinationTab.setConfigDates($input, newDateText, moveCalendar);
	  /*if($("#BEGIN_DAY_01").val()!="" && $("#END_DAY_01").val()!=""){
		  var $context = $(this.config.context);
		  var $box = $context.find('#calendar_selector').closest('div.bl-calendar');
		  var $elements = $context.find('div.search-step2').add($box);
		  $elements.removeClass('step-from step-to');
	  }*/
  },

  /*
   * Set from/to dates in config in order to avoid calling input.val().
   */
  setConfigDates : function ($input, newDateText, moveCalendar) {
    var isValidDate = utils.isValidDate(newDateText) && utils.isValidDateRange(newDateText);
    var isValidDateString = isValidDate || (newDateText && !utils.containsNumber(newDateText));
    switch ($input.attr('id')) {
      case 'diaSalida':
          destinationTab.config.dateFrom = isValidDateString ? utils.parseDate(newDateText) : '';
			 var step = 'step-from';
        break;
      case 'diaRegreso':
          destinationTab.config.dateTo   = isValidDateString ? utils.parseDate(newDateText) : '';
			 var step ='step-to';
        break;
    }
	 if(moveCalendar){
		 var $calendar = $('#calendar_selector');
		 this.setCalendarCurrentDate($calendar, step);
	 }
	  $input.closest('span').removeClass('js-focused');
  },

  /*
   * Set date properties on calendar.
   */
  setCalendarDates : function() {
    var $calendar = $('#calendar_selector');
    var step = this.getCurrentStep();

    this.setCalendarDateRange($calendar, step);
    this.setCalendarCurrentDate($calendar, step);
	 setTimeout(function(){
	 $calendar.find('.ui-state-active').removeClass('ui-state-highlight ui-state-hover ui-state-active').parent().removeClass("ui-datepicker-days-cell-over")
	 },1);
  },

  setCalendarDateRange : function($calendar, step) {
    var limits = this.getCalendarDateRange(step);

    if (limits.minDate) {
      $calendar.datepicker('option', 'minDate', limits.minDate);
    }

    if (limits.maxDate) {
      $calendar.datepicker('option', 'maxDate', limits.maxDate);
    }
  },

  getCalendarDateRange : function(step) {
    var minDates = [];
    var maxDates = [];

    // get limits from landing forced range hidden inputs
    var type = (step == 'step-from') ? 'origin' : 'destination';
    minDates.push($('#'+ type +'-min-date').val());
    maxDates.push($('#'+ type +'-max-date').val());

    // get limits from booking range hidden inputs
	if(typeof cDays!= "undefined"){
    	var maxBookingDays = cDays;
	}else{
    var maxBookingDays = $('#maxBookingDays, [name=MAX_DAYS]').val();
	}
    if (maxBookingDays) {
	  if(typeof cToday!= "undefined"){
      	var maxBookingDate = new Date(cToday);
	  }else{
		var maxBookingDate = new Date();
	  }
      maxBookingDate.setDate(maxBookingDate.getDate() + parseInt(maxBookingDays, 10));
      maxBookingDate.setHours(0,0,0,0);
      maxDates.push(maxBookingDate);
    }
	if(typeof cHours!= "undefined"){
    	var bookingMinHours = cHours;
	}else{
    var bookingMinHours = $('#minBookingHours, [name=MIN_HOURS]').val();
	}
    if (bookingMinHours) {
	  if(typeof cToday!= "undefined"){
      	var minBookingDate = new Date(cToday);
	  }else{
		var minBookingDate = new Date();
	  }
      minBookingDate.setHours(minBookingDate.getHours() + parseInt(bookingMinHours, 10));
      minBookingDate.setHours(0,0,0,0);
      minDates.push(minBookingDate);
    }

    // get limits from date selectors
    /*if (step == 'step-to') {
      minDates.push($('#diaSalida').val());
    }
    else {  // step == 'step-from'
	  if(typeof cToday != "undefined"){
			var today = new Date(cToday)
			today.setHours(0,0,0,0)
      	minDates.push(today);
	  }else{
		var today = new Date()
		today.setHours(0,0,0,0)
		minDates.push(today);
	  }
    }*/

    // use most restrictive limits
    return {
      minDate: utils.maxValidDate(minDates),
      maxDate: utils.minValidDate(maxDates)
    }
  },

  setCalendarCurrentDate : function($calendar, step) {
    var originDate = destinationTab.config.dateFrom;
    var destinationDate = destinationTab.config.dateTo;

    var currentDate = null;
    var sameTwoMonths = originDate && destinationDate &&
                        (destinationDate.getMonth() > originDate.getMonth()) &&
                        (destinationDate.getMonth() - originDate.getMonth() < 2);

    if ((step == 'step-from') || sameTwoMonths) {
      currentDate = originDate;
    }
    else {
      currentDate = destinationDate;
    }

    if (currentDate) {
      $calendar.datepicker('setDate', currentDate);
    }
  },

  typeSelection: function() {
    var $radios = $('#ida-vuelta').parent().parent().find('div.custom-radio');
    var $labels = $('#ida-vuelta').parent().parent().find('label');

    destinationTab.typeSelectionUpdate(true);

    $radios.click(function(e) { 
      e.preventDefault();
      destinationTab.typeSelectionUpdate();
    });

     $labels.click(function() { 
      $(this).parent().parent().find('div.custom-radio').removeClass('custom-radio-active');
      $(this).parent().find('div.custom-radio').addClass('custom-radio-active');
      destinationTab.typeSelectionUpdate();
    });
  },
  recentSearchOpenCalendar:true,
  typeSelectionUpdate : function(isInitialCall) {
    if (typeof isInitialCall == 'undefined') {
      isInitialCall = false;
    }

    var type = destinationTab.getCurrentType();
    var $dateInput = $('#diaRegreso').parent();
    if (type == 'soloIda') {
      $dateInput.slideUp().val("")
		$('#diaRegreso').siblings().val("");
		destinationTab.config.dateTo="";
      
		destinationTab.setDefaultDate($('#diaSalida'));
    }
    else {
      $dateInput.slideDown();

		destinationTab.setDefaultDate($('#diaRegreso'));
    }

    
	 

  },

  setCurrentStep: function(step) {
	 destinationTab.config.currentStep = step;
    var $context = $(this.config.context);
    var $box = $context.find('#calendar_selector').closest('div.bl-calendar');
	 if(typeof calendarStepLabelFrom!='undefined' && typeof calendarStepLabelTo!='undefined'){
		 if(step=="step-from") $box.find('.step-label').html(calendarStepLabelFrom)
		 else if(step=="step-to") $box.find('.step-label').html(calendarStepLabelTo)
		 else $box.find('.step-label').html("")
	 }
    var $elements = $context.find('div.search-step2').add($box);
    $elements.removeClass('step-from step-to');
    $elements.addClass(step);
  },

  getCurrentStep: function() {
    return  destinationTab.config.currentStep;
  },

  // gets current fly type from radios
  getCurrentType: function() {
    var idaActive = $('#ida').siblings('div.custom-radio').hasClass('custom-radio-active');
    return idaActive ? 'soloIda' : 'idaYvuelta';
  },

  getForm : function($context) {
    var $form = $context;
    if ($context.prop('tagName') != 'FORM') {
      $form = $context.find('form');
    }
    return $form;
  },

  searchFlySubmit : function($context) {
    var $form = destinationTab.getForm($context);

    $form.submit(function(e) {
      var $form = $(this);
      var errors = destinationTab.searchFlyValidate($form,false);
      if (errors.hasErrors) {
        e.preventDefault();
        utils.prettyAlert(errors.messagesTxt, globalConfig.errorData.errorsTitle);
        return;
      }

    });
  },

  searchFlyValidate : function($form,onlyCities) {
    var errors = destinationTab.searchFlyValidateEmptyErrors();

    errors = destinationTab.validatePassengers($form, errors);
    errors = destinationTab.validateOriginDestination($form, errors);
	 if(!onlyCities){
		errors = destinationTab.validateDates($form, errors);
	 }

    return errors;
  },
  
  searchFlyValidateToStep2 : function($form,onlyCities) {
	    var errors = destinationTab.searchFlyValidateEmptyErrors();

	    errors = destinationTab.validateOriginDestination($form, errors);
		 if(!onlyCities){
			errors = destinationTab.validateDates($form, errors);
		 }

	    return errors;
  },

  searchFlyValidateEmptyErrors : function() {
    return {
      hasErrors: false,
      hasWarnings: false,
      messagesTxt: ''
    };
  },

  getPassengerCount : function($form, fieldName) {
    var $field = $form.find("select[name='"+ fieldName +"']");
    if ($field.length) {
      var $count = parseInt($field.val(), 10);
      return $count ? $count : 0;
    }
    return 0;
  },
	  
  validatePassengers : function($form, errors) {
    if (typeof errors == 'undefined') {
      errors = destinationTab.searchFlyValidateEmptyErrors();
    }

    var isInfoUmnr = false;
    var hasErrors = false;
    var hasWarnings = false;
    var messagesTxt = '';

    if (typeof globalConfig.errorData == 'undefined') {
      return errors;
    }

    
    if ($form.find("select[name='ADT']").length) {
      var numAdult = destinationTab.getPassengerCount($form, 'ADT');
      var numChildren = destinationTab.getPassengerCount($form, 'CHD');
      var numInfant = destinationTab.getPassengerCount($form, 'INF');
	  

      var total = parseInt(numAdult + numChildren);
      var totalMinors = parseInt(numChildren + numInfant);
      var totalAdults = parseInt(numAdult);
      var totalPassengers = parseInt(numAdult + numChildren + numInfant);

  	  if (totalPassengers > 9) {
  		  if (!hasWarnings) {
  			  hasWarnings = true;
  			  hasErrors = true;
  			  isInfoUmnr =true;
  		  }
  		  messagesTxt  += globalConfig.errorData.strErrsPassengers[1] + '<br />';
  	  }  

      if ((totalAdults == 0) && (numChildren == 0) && (numInfant == 0)) {
        if (!hasErrors) {
          hasErrors = true;
        }
        messagesTxt  += globalConfig.errorData.strErrsPassengers[3] + '<br />';
      }
	  if ((totalMinors / 2 > totalAdults) && (!isInfoUmnr)){
		    if (!hasErrors && !hasWarnings) {	
			    hasWarnings = true;
			    hasErrors = true;
		    }
		    messagesTxt  += globalConfig.errorData.strErrsPassengers[2] + '<br />';
	  }
      if (totalAdults < numInfant  && (!isInfoUmnr)) {
        if (!hasErrors && !hasWarnings) { 
          hasErrors = true;
        }
        messagesTxt  += globalConfig.errorData.strErrsPassengers[0] + '<br />';
      }
      if ((totalAdults == 0) && (numChildren != 0)  && (!isInfoUmnr)) {
        if (!hasErrors && !hasWarnings) {
          hasErrors = true;
        }
        messagesTxt  += globalConfig.errorData.strErrsPassengers[4] + '<br />';
      }
    }

    return {
      hasErrors: errors.hasErrors || hasErrors,
      hasWarnings: errors.hasWarnings || hasWarnings,
      messagesTxt: errors.messagesTxt + messagesTxt
    }
  },
	  
  validateDates : function($form, errors) {
    if (typeof errors == 'undefined') {
      errors = destinationTab.searchFlyValidateEmptyErrors();
    }

    var hasErrors = false;
    var hasWarnings = false;
    var messagesTxt = '';

    var translations = destinationTab.getValidationTranslations();

    // to-date must be greater than from-date
    var $inputs = $form.find('.open-calendar input[type="text"]');
    var $visibleInputs = $inputs.filter(':visible');
    var isMultiFly = $inputs.length > 2;
    var lastValidDate = {date: 0, time: 0};

    $visibleInputs.each(function(index) {
      var $input = $(this);
      var date = utils.parseDate($input.val());
      if (!date) {
        hasErrors = true;
        messagesTxt += globalConfig.errorData.strNullDate[index] + '<br />';
      }



      /*if (index === 0) {
        lastValidDate.date = date;
      }
      else {
        var isValidDate = (lastValidDate.date !== 0) && (date >= lastValidDate.date);
        if (!isValidDate) {
          
			hasErrors = true;
			messagesTxt += translations.invalidDate + '<br />';

        }
        else {
          lastValidDate.date = date;
        }
      }*/
    });


    return {
      hasErrors: errors.hasErrors || hasErrors,
      hasWarnings: errors.hasWarnings || hasWarnings,
      messagesTxt: errors.messagesTxt + messagesTxt
    }
  },

  getTimeFromDateInput : function($input) {
    return $input.closest('div').next().find('select').val();
  },

	validateOriginDestination : function($form, errors) {
    if (typeof errors == 'undefined') {
      errors = destinationTab.searchFlyValidateEmptyErrors();
    }
    if (typeof globalConfig.errorData == 'undefined') {
      return errors;
    }
		var hasErrors = false;
		var hasWarnings = false;
		var messagesTxt = '';

    if ($("#text-from-visible").val() == '') {
      if($form.attr('id') != "search-land") {
	      var hasErrors = true;
        messagesTxt  += globalConfig.errorData.strErrsOrDest[0] + '<br />';
      }
    }

    if ($("#text-to-visible").val() == '') {
      if($form.attr('id') != "search-land") {
	      var hasErrors = true;
        messagesTxt  += globalConfig.errorData.strErrsOrDest[1] + '<br />';
      }
    }

	 if (!hasErrors && ($("#text-from-visible").val()!= undefined && $("#text-to-visible").val() != undefined) && ($("#text-from-visible").val() == $("#text-to-visible").val())) {
	    var hasErrors = true;
        messagesTxt  +=  globalConfig.errorData.strErrsOrDest[2] + '<br />';
    }
    return {
      hasErrors: errors.hasErrors || hasErrors,
      hasWarnings: errors.hasWarnings || hasWarnings,
      messagesTxt: errors.messagesTxt + messagesTxt
    }
  },

  getValidationTranslations : function() {
    var translations = {
      adviceText: 'Warning',
      backText: 'Back',
      continueText: 'Continue',
      invalidDate: 'Selected dates are not valid. Return date must be greater than departure date'

    };

    if (typeof globalConfig.errorData == 'undefined') {
      return translations;
    }

    if (typeof globalConfig.errorData.strAdviceText != 'undefined') {
      translations.adviceText = globalConfig.errorData.strAdviceText;
    }
    if (typeof globalConfig.errorData.strBackText != 'undefined') {
      translations.backText = globalConfig.errorData.strBackText;
    }
    if (typeof globalConfig.errorData.strContinueText != 'undefined') {
      translations.continueText = globalConfig.errorData.strContinueText;
    }
    if (typeof globalConfig.errorData.strInvalidDate != 'undefined') {
      translations.invalidDate = globalConfig.errorData.strInvalidDate;
    }


    return translations;
  }


  
};

/*
 * Interactions in main search box.
 */
var homeBox = {
  config : {
    context : '#search-form',
    currentSelection : 'text-from',
	  activeCountryTab: 0,
	  activeCityTab: null,
    typeaheadOn: false
    
  },

  init : function(config) {
    $.extend(this.config, config);

    var $context = $(this.config.context);
    if (!$context.length) {
      return;
    }
    
    homeBox.setValidCities($context);
    homeBox.destinationAutocomplete($context);    
    
  },

  //Funcion que permite solo introducir ciudades validas en el origen y destino
  setValidCities: function($context) {
    //Para las ciudades origen y destino cuando perdemos el foco en los inputs
    $context.find('#text-from-visible, #text-to-visible').off('focusout').on('focusout', function(e) {
      e.preventDefault();
      //Si no se han metido las fechas todavía en el calendario, abrimos el calendario
      var from_to = $(this).attr('id');
      //Para saber si es la ciduad origen o destino
      from_to = (from_to.indexOf('text-from-visible')) ?  'to' : 'from';
      var selection = $(this).val();
      $(this).change(function() {
        //Siempre que se cambia la ciudad origen o destino reseteamos el valor en sus campos ocultos
        $context.find('#text-'+from_to).val('');
        $context.find('#text-'+from_to+'-country').val('');
        //$context.find('input[name="text-'+from_to+'-visible"]').attr('value', '');
      });
      if($context.find('#text-'+from_to).val() == '') {

        //Recorremos el array para comprobar si la ciudad que se esta metiendo es correcta
		  $context.find('#text-'+from_to+'-visible').val('');
        $context.find('#text-'+from_to+'-visible').attr('value', '');
		  var selectionString = utils.parseSearchTerm(selection.toLowerCase());
		  for(i in cities){
          //No distinguimos entre mayusculas y minusculas. Nos saltamos los acentos
			 var name = utils.parseSearchTerm(cities[i].name.toLowerCase())
			 var city_name = name.substr(0,name.indexOf('(')-1)
          if((selection != '') && ( selectionString == city_name || selectionString == name) ) {
            $context.find('#text-'+from_to+'-visible').val(cities[i].name);
            
				$context.find('#text-'+from_to).val(i);
				
            $context.find('#text-'+from_to+'-country').val(cities[i].ctry);
            return;    
          }
        }
      }       
      return false;
    });
  },

  destinationAutocomplete : function($context) { 
    
 
    $context.find('span.open-destination.autocomplete input[type="text"]').each(function() { 
      var $input = $(this);

      homeBox.destinationLoadDefaultCities($input);

      var newCityCode = $input.siblings('input[type="hidden"]').eq(0).val();
      var openCalendar = !$input.hasClass('do-not-open-calendar');

      // clear selection
      $input.keyup(function() {
        if (this.value == '') {
			 $(this).siblings('input[type="hidden"]').val('');
        }
      });

      // autocomplete behavior
      $input.attr('autocomplete', 'off');

      var destinationAutocompleteAirports;
      
		//select all text on input focus
      $input.focus(function() { $(this).select().mouseup(function (e) {e.preventDefault();}); var _this=this;setTimeout(function(){$(_this).unbind("mouseup");},100);});
			
      $input.typeahead({ 
		  items:	100,//show all
		  minLength:3,
        source: function () { 
          destinationAutocompleteAirports = homeBox.getDestinationsData($input);
          return destinationAutocompleteAirports.source;
        },
        highlighter: function(item) {
          return leverageTypeahead.highlighter(item, this.query);
        },
        matcher: function (item) { 
          if (this.query.length >= 3) { 
            var query = utils.parseSearchTerm(this.query.toLocaleLowerCase());
            var code = destinationAutocompleteAirports.elements[item].airport.code.indexOf(query) != -1;
            var city = destinationAutocompleteAirports.elements[item].airport.city.indexOf(query) != -1;
            var country = destinationAutocompleteAirports.elements[item].airport.country.indexOf(query) != -1;
            return (code || city || country);
          } 
          
          return false;
        },
        updater: function (item, key, code) {
        
          var name = item; 
          var value = destinationAutocompleteAirports.elements[item].value;








		      if(key == "enter") {            
            homeBox.updateDestinationInputs($input, name, value, true, "enter");
            code = 100;
			      $('.typeahead').hide();
		      }
          else if(key == "click") {
            homeBox.updateDestinationInputs($input, name, value, true, "click");
          }
          
          
          var valueTo = $('#text-to-visible').val();
          var valueFrom = $('#text-from-visible').val();
          
          if($($input).attr('id') == "text-to-visible" && valueFrom.length > 3 && code != 0) {
            homeBox.updateDestinationInputs($input, name, value, true, "enter");
			      $('.typeahead').hide();
            destinationTab.config.calendarIsOpen = false;
            //destinationTab.openCalendarBox();
          } else if($($input).attr('id') == "text-from-visible" && valueTo.length > 3 && code != 0) {
            homeBox.updateDestinationInputs($input, name, value, true, "enter");
			      $('.typeahead').hide();
            destinationTab.config.calendarIsOpen = false;
            //destinationTab.openCalendarBox();
          }
          
          return name;
          
        },
        sorter : function (items) {
          var query = utils.parseSearchTerm(this.query);
          var result = items.sort(

            function(a, b) {
              var a = destinationAutocompleteAirports.elements[a].airport;
              var b = destinationAutocompleteAirports.elements[b].airport;
              var i, j;

              // 1. Matching first city code characters
              if (query.length >= 3) { 

                // Only Alphabetically by city
                //return (a.city) < (b.city) ? -1 : 1; 

                               
                i = a.code.indexOf(query);
                j = b.code.indexOf(query);

                if (i == 0 && j != 0) {
                  return -1;
                }
                else if (i != 0 && j == 0) {
                  return 1;
                }
                
              }
              

              // City
              i = a.city.indexOf(query);
              j = b.city.indexOf(query);

              // 2. Matching first city characters
              if (i == 0 && j != 0) {
                return -1;
              }
              if (j == 0 && i != 0) {
                return 1;
              }

              // 3. Alphabetically by city
              if (a.city > b.city) {
                return 1;
              }
              else if (a.city < b.city) {
                return -1;
              }

              // Country
              i = a.country.indexOf(query);
              j = b.country.indexOf(query);

              // 4. Matching first country characters
              if (i == 0 && j != 0) {
                return -1;
              }
              if (j == 0 && i != 0) {
                return 1;
              }

              // 5. Alphabetically by country
              if (a.country > b.country) {
                return 1;
              }
              else if (b.country < a.country) {
                return -1;
              }

              // Rest alphabetically by code although this should never happend because
              // city and country should not be equal at two different items
              if (a.code > b.code) {
                return 1;
              }
              else if (b.code < a.code) {
                return -1;
              }
              else {
                return 0;
              }
              
            }
          );
          return result;
        }
      });
      
    }); 
  },

  destinationLoadDefaultCities : function($input) {
    if (($input.val() != '')) {
      return;
    }

    var cityText = homeBox.getDestinationFromHiddenInput($input);

    if (cityText) {
      $input.val(cityText).attr('value', cityText).siblings('label').hide();
    }
  },

  getCityCodeSeparatorFromFlyBox : function($flyBox) {
    var separator = '#';
    var $firstLink = $flyBox.find('div.destination-cities:first .cities a:first');
    if ($firstLink.length) {
      var href = $firstLink.attr('href');
      if (href.indexOf('--') !== -1) {
        separator = '--';
      }
    }
    return separator;
  },

  /*
   * Fill text input from hidden input.
   */
  getDestinationFromHiddenInput : function($input) {
    var $hiddenInputs = $input.siblings('input[type="hidden"]');
    var cityCode = $hiddenInputs.eq(0).val();
	 cityCode= cityCode.split("|")[cityCode.split("|").length-1];
    //var countryCode = $hiddenInputs.eq(1).val();

    if (cityCode != '') {
		return cities[cityCode].name;
    }

    return '';
  },


  getDestinationsData : function($input, resetCache, type) {
    if (typeof resetCache == 'undefined') {
      resetCache = false;
    }

    if (typeof type == 'undefined') {
      type = null;
    }

    var cache = $input.data('cacheDestinationData');
    if (!resetCache && (typeof cache != 'undefined')) {
      return cache;
    }
    var destiniesArray = [];
	 for(i in cities){
		destiniesArray.push({name: cities[i].name, value: i});
	 }

    destiniesArray.sort(function(a, b) {
      var aName = a.name;
      var bName = b.name;
      return (aName == bName) ? 0 : (aName > bName) ? 1 : -1;
    });

    var result = {
      source : [],
      elements : {}
    }
    $.each(destiniesArray, function(index, element) {

      if (result.source.indexOf(element.name) == -1) {
        result.source.push(element.name);
      }

      var name = utils.parseSearchTerm(element.name.toLocaleLowerCase());
      var newElement = {
        name : name,
        value : element.value,
        airport : utils.decodeAirportString(name)
      }
      result.elements[element.name] = newElement;
    });

    $input.data('cacheDestinationData', result);
    return result;
  },

  destinationExist : function(name, destiniesArray) {
    for (index in destiniesArray) {
      if (destiniesArray[index].name == name) {
        return true;
      }
    }
    return false;
  },

  updateDestinationInputs : function($input, newText, newCode, openCalendar) {
    if (typeof openCalendar == 'undefined') {
      openCalendar = true;
    }

    var newDestination = homeBox.parseCityCode(newCode);
    var textChanged = (newText != '') && (newText != $input.val());
    var $hiddenInputs = $input.siblings('input[type="hidden"]');

    var $formContainer = homeBox.getInputContainer($input);
    var isOrigin = homeBox.isOriginInput($input, $formContainer);

    $input.val(newText).attr('value', newText).focus();
	  $input.siblings('label.placeholder').hide();
    var $inputCity = $hiddenInputs.eq(0);
    if ($inputCity.length && (typeof newDestination.city != 'undefined') && newDestination.city) {
      $inputCity.attr('value', newDestination.city).trigger('change');
    }

    var isOneWay = $('#ida:checked').length > 0;
    var datesFilled = destinationTab.config.dateFrom && (destinationTab.config.dateTo || isOneWay);
    var open = openCalendar && textChanged && !datesFilled && !$input.hasClass('do-not-open-calendar');
    
  },


  getInternetExplorerVersion: function()
  // Returns the version of Internet Explorer or a -1
  // (indicating the use of another browser).
  {
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer')
    {
      var ua = navigator.userAgent;
      var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) != null)
        rv = parseFloat( RegExp.$1 );
    }
    return rv;
  },

  toggleDestinationInput : function($input, enable) {
    var loadingText = 'Cargando...';
    if ((typeof globalConfig.loadingText != 'undefined') && globalConfig.loadingText) {
      loadingText = globalConfig.loadingText;
    }

    if (enable) {
      $input.removeAttr('disabled');
      $input.siblings('span.destination-loading').remove();
    }
    else {
      $input.attr('disabled','disabled');
      $input.parent().append('<span class="destination-loading">'+ loadingText +'</span>');

    }
  },

  loadDestinationInfoApplyLoader : function($flyBoxes) {
    $flyBoxes.children(':not(.close-popup)').remove();
    $flyBoxes.append(ajaxInteractions.ajaxLoaderCentered());
  },

  /*
   * Parses city code into object.
   */
  parseCityCode : function(cityCode) {
    var cityInfo = {};
    var isCountryCode = false;

    if (typeof cityCode == 'undefined') {
      return cityInfo;
    }
		
    var separator = '|';
    if (cityCode.indexOf('--') != -1) {
      separator = '--';
    }
    else if (cityCode.indexOf('#') != -1) {
      separator = '#';
    }

    var parts = cityCode.split(separator);
    switch (parts.length) {
      case 3:
        cityInfo.zone = parts[0];
        cityInfo.country = parts[1];
        cityInfo.city = parts[2];
        isCountryCode = true;
        break;
      case 2:
        cityInfo.country = parts[0];
        cityInfo.city = parts[1];
        isCountryCode = true;
        break;
      case 1:
		  cityInfo.country = cities[parts[0]].ctry;
        cityInfo.city = parts[0];
        break;
    }
    
    if(isCountryCode === true) {  
      if(cityInfo.country.indexOf("#") != -1) {
        cityInfo.country = cityInfo.country.replace("#","");
        cityInfo.country = $.trim(cityInfo.country);
      }
    }
    
    return cityInfo;
  },


  getInputContainer : function($input) {
    return $input.closest('fieldset, form');
  },

  isOriginInput : function($input, $formContainer) {
    var elementIndex = $formContainer.find('span.open-destination:not(.open-destination-country) input[type="text"]').index($input);
    return elementIndex % 2 == 0;
  }

};


var calendarActions = {
	userClicked:false,
	init:function($texts, calendar){
		$texts.attr('autocomplete', 'off');
		$texts.on('keydown', function(e){calendarActions._doKeyDown(e,this,calendar||this)})
		$texts.on('keypress',function(e){return calendarActions._doKeyPress(e,this,calendar||this)})
		//$texts.on('keyup',function(e){calendarActions._doKeyUp(e,this,calendar||this)})
		$texts.on('blur',function(e){calendarActions._doBlur(e,this,calendar||this)});
		$(calendar).on('mousedown',function(){calendarActions.userClicked=true;});
		$(calendar).on('mouseup',function(){calendarActions.userClicked=false;});
	},
	/* Handle keystrokes. */
	_doKeyDown:function (event,element,calendar) {
			var onSelect, dateStr, sel,
				inst = $.datepicker._getInst(calendar),
				handled = true,
				isRTL = inst.dpDiv.is(".ui-datepicker-rtl");
			var input = $(element);
			inst._keyEvent = true;

			switch (event.keyCode) {
				case 9: $.datepicker._hideDatepicker();
						handled = false;
						break; // hide on tab out
				case 13: 
						sel = $("td." + $.datepicker._dayOverClass + ":not(." +
									$.datepicker._currentClass + ")", inst.dpDiv);
						if (sel[0]) {
							$.datepicker._selectDay(calendar, inst.selectedMonth, inst.selectedYear, sel[0]);
						}
						onSelect = $.datepicker._get(inst, "onSelect");
						if (onSelect) {
							try {
								var date = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
									(input ? input.val() : null),
									$.datepicker._getFormatConfig(inst));

								if (date) { // only if valid
									if( (typeof inst.settings.maxDate=='object' && date.getTime()>inst.settings.maxDate.getTime() )|| 
										(typeof inst.settings.minDate=='object' && date.getTime()<inst.settings.minDate.getTime() ) ){
										throw 'Date out of range';
									}
									$(calendar).datepicker('setDate', date);
									sel = $("#cal"+date.getTime()).parent();
									if (sel[0]) {
										$.datepicker._selectDay(calendar, date.getMonth(), date.getFullYear(), sel[0]);
									}

								}
							}
							catch (err) {
								setTimeout(function(){input.val("").focus();},1);
							}
							
						} else {
							$.datepicker._hideDatepicker();
						}

						if(handled){ // don't submit the form
							event.preventDefault();
							return false;
						}
				case 27: $.datepicker._hideDatepicker();
						break; // hide on escape
				case 33: $.datepicker._adjustDate(calendar, (event.ctrlKey ?
							-$.datepicker._get(inst, "stepBigMonths") :
							-$.datepicker._get(inst, "stepMonths")), "M");
						break; // previous month/year on page up/+ ctrl
				case 34: $.datepicker._adjustDate(calendar, (event.ctrlKey ?
							+$.datepicker._get(inst, "stepBigMonths") :
							+$.datepicker._get(inst, "stepMonths")), "M");
						break; // next month/year on page down/+ ctrl
				case 35: if (event.ctrlKey || event.metaKey) {
							$.datepicker._clearDate(calendar);
						}
						handled = event.ctrlKey || event.metaKey;
						break; // clear on ctrl or command +end
				case 36: if (event.ctrlKey || event.metaKey) {
							$.datepicker._gotoToday(calendar);
						}
						handled = event.ctrlKey || event.metaKey;
						break; // current on ctrl or command +home
				case 37: if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(calendar, (isRTL ? +1 : -1), "D");
						}
						handled = event.ctrlKey || event.metaKey;
						// -1 day on ctrl or command +left
						if (event.originalEvent.altKey) {
							$.datepicker._adjustDate(calendar, (event.ctrlKey ?
								-$.datepicker._get(inst, "stepBigMonths") :
								-$.datepicker._get(inst, "stepMonths")), "M");
						}
						// next month/year on alt +left on Mac
						break;
				case 38: if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(calendar, -7, "D");
						}
						handled = event.ctrlKey || event.metaKey;
						break; // -1 week on ctrl or command +up
				case 39: if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(calendar, (isRTL ? -1 : +1), "D");
						}
						handled = event.ctrlKey || event.metaKey;
						// +1 day on ctrl or command +right
						if (event.originalEvent.altKey) {
							$.datepicker._adjustDate(calendar, (event.ctrlKey ?
								+$.datepicker._get(inst, "stepBigMonths") :
								+$.datepicker._get(inst, "stepMonths")), "M");
						}
						// next month/year on alt +right
						break;
				case 40: if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(calendar, +7, "D");
						}
						handled = event.ctrlKey || event.metaKey;
						break; // +1 week on ctrl or command +down
				default: handled = false;
			}

			if (handled) {
				event.preventDefault();
				event.stopPropagation();
			}
		},
		/* Filter entered characters - based on date format. */
		_doKeyPress:function(event,element,calendar) {
			var chars, chr,
				inst = $.datepicker._getInst(calendar);

			if ($.datepicker._get(inst, "constrainInput")) {
				chars = $.datepicker._possibleChars($.datepicker._get(inst, "dateFormat"));
				chr = String.fromCharCode(event.charCode == null ? event.keyCode : event.charCode);
				return (event.ctrlKey && !event.altKey) || event.metaKey || (chr < " " || !chars || chars.indexOf(chr) > -1);
			}
		},
		/* Synchronise manual entry and field/alternate field. */
		/*function _doKeyUp(event,element,calendar) {
			var date,
				inst = $.datepicker._getInst(calendar);
			var input = $(element);

			if (input.val() !== inst.lastVal) {
				try {
					date = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
						(input ? input.val() : null),
						$.datepicker._getFormatConfig(inst));

					if (date) { // only if valid
						//$.datepicker._setDateFromField(inst);
						//$.datepicker._updateAlternate(inst);
						//$.datepicker._updateDatepicker(inst);
						//destinationTab.updateCalendarInputs(input, input.val(),true);
						//destinationTab.onCalendarSelect(date,inst)
					}
				}
				catch (err) {
				}
			}
			return true;
		},*/
		_doBlur:function(event,element,calendar){
			var onSelect, dateStr, sel,
				inst = $.datepicker._getInst(calendar);
			var input = $(element);
			onSelect = $.datepicker._get(inst, "onSelect");
			if (onSelect) {
				try {
					var date = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
						(input ? input.val() : null),
						$.datepicker._getFormatConfig(inst));
					var currentDay = input.siblings("[type=hidden]:first");
					var dayChange = true;
					if(currentDay.length){
						var currentMonthYear = currentDay.next().val();
						if(currentMonthYear){
							var currentDate = new Date( currentMonthYear.substr(0,4),parseFloat(currentMonthYear.substr(4,2))-1, currentDay.val() );
							if (date) dayChange = date.getTime()!=currentDate.getTime() 
						}
					}
					var isUserClick = calendarActions.userClicked//false // || event.originalEvent.explicitOriginalTarget != element;
					if ( date ){ // only if valid 
						if( dayChange && !isUserClick) { //different from current && not user click
						if( (typeof inst.settings.maxDate=='object' && date.getTime()>inst.settings.maxDate.getTime() )|| 
							(typeof inst.settings.minDate=='object' && date.getTime()<inst.settings.minDate.getTime() ) ){
							throw 'Date out of range';
						}
						$(calendar).datepicker('setDate', date);
						sel = $("#cal"+date.getTime()).parent();
						if (sel[0]) {
							$.datepicker._selectDay(calendar, date.getMonth(), date.getFullYear(), sel[0]);
						}
						}
					}else if(date==null){//date blank
						var currentDay = input.siblings("[type=hidden]:first");
						if(currentDay.length==0 || !currentMonthYear){
							input.val("");
						}else{
								input.val( $.datepicker.formatDate($.datepicker._defaults.dateFormat, currentDate) )
									.siblings("label.placeholder").hide();
							
						}
					}
				}
				catch (err) {
					setTimeout(function(){input.val("").focus();},1);
				}
				
			} else {
				$.datepicker._hideDatepicker();
			}
		}
}

