dFrontJs.ibe_tab = function() {
    var iniTabsjquery = function(selector, json) {
        var $this = $(selector);
        var param_active = $this.data('tab-active') !== undefined ? $this.data('tab-active') : 0;
        var param_disable = $this.data('tab-disable') !== undefined ? $this.data('tab-disable') : '';
        json = json !== undefined ? json : '';
        $this.tabs({
            active: param_active,
            disabled: [param_disable],
            activate: function(event, ui) {
                dFrontJs.app.emitInView();

                if ($(ui.newTab[0]).parents('[data-city-list="collapse"]').length > 0 && !$(ui.newTab[0]).hasClass('loaded_cities')) {
                    $(ui.newTab[0]).addClass('loaded_cities');
					var selectorNewSelector = $('.fc-dialog-all-destinations').is(':visible') ? $('.fc-dialog-all-destinations:visible').find('.modal-body') : $(ui.newTab[0].children).parents('.fc_form_group').find('input');
					var selectorNewTab = $(ui.newTab[0].children).parent();
                    dFrontJs.ibe_searcher_choose_city.cityListConstructor(selectorNewSelector, selectorNewTab, json);
                }
                $('.ioslist-wrapper').scrollTop(0);
            }
        });
    };
    //Plugin tab
    var init = function(selector) {
        //Bootstrap tabdrop
        var btnReload = $('[data-reload-animation="true"]');
        var btd = selector === undefined ? $('[data-tab="bootstrap-tabdrop"]') : $(selector);
        var bt = selector === undefined ? $('[data-tab="jquery-ui"]:not(.ui-tabs)') : $(selector);
        var btt = $('[data-tab="bootstrap-tab"]');

        if (btd.length > 0) {
            $.each(btd, function() {
                var $this = $(this),
                    text = $this.data('tab-text');

                //console.log($this.children().length);
                //-btd.tabdrop({
                $this.tabdrop({
                    'text': text
                });

                // }
                $this.addClass('ibe-tab-menu__tabdrop');

                $this.on('click', function() {
                    requestAnimFrame(function() {
                        dFrontJs.app.emitInView();
                    });
                })


            });
        }
        //Tab jQuery ui
        if (bt.length > 0) {
            bt.each(function() {
                var $this = $(this);
                if (!$this.parent().hasClass('ibe-choose-city')) {
                    iniTabsjquery($this);
                }
            });
            bt.find('.ibe-tab__container').removeClass('hidden');
            bt.css('min-height', 'inherit');
        }
        //Bootstrap tab
        if (btt.length > 0) {
            btt.tab();
        }

        // Reload mosaic animation
        if (btnReload.length) {
            reloadAnimation();
            $(btnReload).click(reloadAnimation);
        }
    }; //pluginTab

    // Function to change view mosaic/list
    var reloadAnimation = function() {
        $('.ibe_mosaic').find('.ibe_mosaic__piece').removeClass('active');
        setTimeout(function() {
            $('.ibe_mosaic').find('.ibe_mosaic__piece').addClass('active');
        });
    };

    return {
        'init': init,
        'reloadAnimation': reloadAnimation,
        'iniTabsjquery': iniTabsjquery
    };
}(jQuery);
