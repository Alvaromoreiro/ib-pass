/* =========================================================
 * bootstrap-tabdrop.js
 * http://www.eyecon.ro/bootstrap-tabdrop
 * =========================================================
 * Copyright 2012 Stefan Petre
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

!function( $ ) {
	
		var WinReszier = (function(){
			var registered = [];
			var inited = false;
			var timer;
			var resize = function(ev) {
				$('.nav-tabs').addClass('resize');
				clearTimeout(timer);
				timer = setTimeout(notify, 5);//Corrección salto al hacer resize (antes 100)
			};
			var notify = function() {
				for(var i=0, cnt=registered.length; i<cnt; i++) {
					registered[i].apply();
				}
			};
			return {
				register: function(fn) {
					registered.push(fn);
					if (inited === false) {
						$(window).bind('resize', resize);
						inited = true;
					}
				},
				unregister: function(fn) {
					for(var i=0, cnt=registered.length; i<cnt; i++) {
						if (registered[i] == fn) {
							delete registered[i];
							break;
						}
					}
				}
			}
		}());
	
		var TabDrop = function(element, options) {
			this.element = $(element);
			this.dropdown = $('<li class="dropdown hide tabdrop"><button class="dropdown-toggle" data-toggle="dropdown">'+options.text+'</button><ul class="dropdown-menu dropdown-menu-right"></ul></li>')
								.appendTo(this.element);
			if (this.element.parent().is('.tabs-below')) {
				this.dropdown.addClass('dropup');
			}
			WinReszier.register($.proxy(this.layout, this));
			this.layout();
		};
	
		TabDrop.prototype = {
			constructor: TabDrop,
	
			layout: function () {
        //Move dropdown to right
        var drop = this.element.find('.dropdown.tabdrop').appendTo(this.element),
          tabdropElements = '',
          vlength = 0,
          aux = 0,
          isDropdown = false,
          widthUlTab = 0,
          collection = [];
        // We show the dropdown previously
        this.dropdown.removeClass('hide');
        this.element.css('width', 'auto');
        this.element
          .append(this.dropdown.find('li'))
          .find('>li')
          .not('.tabdrop')
          .each(function () {
              var $this = $(this);
  
              if ($this.css('min-width').length > 0) {
                $this.css('width', $this.css('min-width'));
              }
              else {
                $this.css('width', 'auto');
              }
  
              if (this.offsetTop > 0) {
                collection.push(this);
              }
          });
        if (collection.length > 1 ) {
          collection = $(collection);
          this.dropdown
            .find('ul')
            .empty()
            .append(collection);
          if (this.dropdown.find('.active').length == 1) {
            this.dropdown.addClass('active');
          } else {
            this.dropdown.removeClass('active');
          }
        } else {
          this.dropdown.addClass('hide');
        }
  
        if (collection.length == 1) {
          //-console.log(this.element.children().length);
          if(this.element.children().length == 3){
            this.element.addClass('ibe-tab-menu--reset');
          }
          this.element.children("li").css('min-width','auto');
        }
  
        tabdropElements = this.element.find(' > li'),
          vlength = tabdropElements.length,
          isDropdown = this.element.find('.dropdown.tabdrop').hasClass('hide');
  
        //If dropdown show
        if (!isDropdown) {
          this.element.css('width', '100%');
          widthUlTab = this.element.outerWidth() / vlength;
  
          this.element.css({
            'width': 'calc(100% - ' + widthUlTab + 'px)'
          });
          //If dropdown hide
        } else {
          this.element.css({'width': '100%'});
        }
        aux = (100 / (vlength - 1));
        this.element.find('.dropdown').css({
          'width': widthUlTab
        });
        this.element.find(' > li').not('.dropdown').css('width', aux + '%');
  
        $('.nav-tabs').removeClass('resize');
      }
    }
	
		$.fn.tabdrop = function ( option ) {
			return this.each(function () {
				var $this = $(this),
					data = $this.data('tabdrop'),
					options = typeof option === 'object' && option;
				if (!data)  {
					$this.data('tabdrop', (data = new TabDrop(this, $.extend({}, $.fn.tabdrop.defaults,options))));
				}
				if (typeof option == 'string') {
					data[option]();
				}
			})
		};
	
		$.fn.tabdrop.defaults = {
			text: '<i class="icon-align-justify"></i>'
		};
	
		$.fn.tabdrop.Constructor = TabDrop;
	
	}( window.jQuery );
