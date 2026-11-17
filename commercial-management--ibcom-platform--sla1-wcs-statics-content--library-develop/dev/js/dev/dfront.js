/* eslint-disable no-extend-native */
/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-bitwise */
/* eslint-disable newline-per-chained-call */
/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable no-var */
//* ****************************************************************************
// Document ready
//* *****************************************************************************/
/* eslint no-underscore-dangle: ['error', { 'allow': ['_tooltipTouchStartClick', '_disableClickbodyClick', '_ibeSeacherFocusout', '_collapseTouchstart','_documentTouchstart',
  '_documentGeneralClick', '_sameoofficeClick'] }] */

// import { loadjsfile } from '../inte-modules/ibe-modules/general/ibe_inte-util';

var is_touch_device = () => 'ontouchstart' in window;

var getAtributes = function ($node) {
    var attrs = {};
    $.each($node[0].attributes, (index, attribute) => {
        attrs[attribute.name] = attribute.value;
    });

    return attrs;
};

var mobile; var desktop;

var checkResolution = function () {
    var thisResolution = window.innerWidth;
    if (thisResolution >= dFrontJs.resolutions.xl) {
        return 'xl';
    }
    if (thisResolution >= dFrontJs.resolutions.lg && thisResolution < dFrontJs.resolutions.xl) {
        return 'lg';
    }
    if (thisResolution >= dFrontJs.resolutions.md && thisResolution < dFrontJs.resolutions.lg) {
        return 'md';
    }
    if (thisResolution >= dFrontJs.resolutions.sm && thisResolution < dFrontJs.resolutions.md) {
        return 'sm';
    }
    if (thisResolution >= dFrontJs.resolutions.xs && thisResolution < dFrontJs.resolutions.sm) {
        return 'xs';
    }
};

//--------------------------

var fnReady = function () {
    var _sameoofficeClick;

    dFrontJs.ibe_check.init('[data-control="check"]');
    dFrontJs.app.init();// Eventos jquery
    if (window.innerWidth < dFrontJs.resolutions.lg && $('.ibe-searcher__vintage').length > 0) {
        dFrontJs.ibe_modals_vintage.init(); // Modals in vintage
    }
    dFrontJs.ibe_resize.init();
    // Componentsloca
    dFrontJs.ibe_view_more.init();
    dFrontJs.ibe_combobox.init();// Inicializar libreria selectize
    dFrontJs.ibe_placeholder.init();// Inicializar jquery placeholder
    dFrontJs.ibe_accordion.init();// Inicializar accordion jquery accordion
    dFrontJs.ibe_popover.init();// Inicializar popover bootstrap
    if ($('[data-dotdotdot]').length > 0) {
        // loadjsfile(`components/ibe-box-elllipsis.js`);
        dFrontJs.ibe_box_ellipsis.init();// Inicializar dotdotdot colapsar texto
    }
    if ($('[data-progressbar]').length > 0) {
        dFrontJs.ibe_progressbar.init();// Inicializar progressbar
    }
    if ($('[data-tooltip="bootstrap"]').length > 0 || $('[data-tooltipGeneric]').length > 0) {
        dFrontJs.ibe_tooltip.init();// Inicializar tooltip
    }
    // if ($('[data-datatable]').length > 0) {
    dFrontJs.ibe_datatable.init();// Inicializar datatable pagination
    // }
    if ($('[data-slick]').length > 0 || $('[data-theta-carousel]').length > 0) {
        dFrontJs.ibe_carousel.init();// Inicializar slick carrousel
    }
    if ($('[data-wwo]').length > 0) {
        dFrontJs.ibe_wwo.init('[data-wwo="day-1"]');
    }
    if ($('[data-tab]').length > 0) {
        dFrontJs.ibe_tab.init();// Inicializar tab jquery ui
    }
    if ($('.ibe-searcher-room').length > 0) {
        dFrontJs.ibe_searcher_room.init();
    }
    if ($('.ibe-people-counter').length > 0) {
        dFrontJs.ibe_searcher_people_counter.init();
    }

    dFrontJs.ibe_overlay.init();

    if ($('[data-video]').length > 0) {
        dFrontJs.ibe_video.init();
    }
    dFrontJs.ibe_inputs.init();
    dFrontJs.ibe_bootstrap_collapse.init();
    if ($('[data-tweets="wall"]').length > 0) {
        dFrontJs.ibe_tweet_wall.init();
    }
    if ($('[data-guide="open-modal"]').length > 0 || $('[data-guide="close-modal"]').length > 0) {
        dFrontJs.ibe_guide.init();
    }
    // if ($('[data-validate="origin-destiny"]').length > 0) {
    //    dFrontJs.ibe_validate.initValCity('[data-validate="origin-destiny"]');
    // }
    if ($('[data-show-hide]').length > 0) {
        dFrontJs.ibe_show_hide_element.init();
    }
    if ($('a[title]').find('img[title]').parents('a')) {
        dFrontJs.ibe_accessibility.imgTitle();
    }
    if ($('[data-filter]').length > 0) {
        dFrontJs.ibe_filter.init();
    }
    dFrontJs.ibe_loading.init();

    if ($('[data-ibe-select-tab]').length > 0) {
        dFrontJs.ibe_select_tab.init();
    }
    if ($('[data-selectmenu]').length > 0 || $('[data-selectmenu-edit]').length > 0 || $('[data-selectmenu_claim]').length > 0) {
        dFrontJs.ibe_selectmenu.init();
    }
    if ($('[data-function="masonry"]').length > 0) {
        dFrontJs.ibe_tweets.init('[data-function="masonry"]', '[data-function="masonry"] li');
    }
    if ($('[data-validate-searcher]').length > 0) {
        dFrontJs.ibe_validations_searcher.init();
    }
    if ($('[data-searcher_room-selectmenu]').length > 0) {
        dFrontJs.ibe_searcher_room_selectmenu.init();
    }
    if ($('[data-people-counter-button-selectmenu]').length > 0) {
        dFrontJs.ibe_searcher_people_counter_selectmenu.init();
    }

    if ($('.ibe-searcher__passenger').length > 0) {
        dFrontJs.ibe_passenger.init();
    }

    if ($('[data-textarea]').length > 0) {
        dFrontJs.ibe_textarea.init();
    }

    dFrontJs.ibe_uploadfile.init();
    dFrontJs.ibe_outsideclick.init();
    dFrontJs.ibe_validate.init();
    dFrontJs.ibe_card_box.calculateHeightText();
    dFrontJs.ibe_menu_new.init();
    dFrontJs.ibe_headerNew.init();
    dFrontJs.ibe_dateFormat.init(); // Elegir formato de fecha
    dFrontJs.ibe_modal.init();
    // Escape Collapse [data-cal] inputs and collapse start and end calendars
    dFrontJs.ibe_escape.init($('[data-cal]'), '.ibe_form__group');
    dFrontJs.ibe_escape.init($('.ibe-searcher__calendar--start'), '.ibe_form__group');
    dFrontJs.ibe_escape.init($('.ibe-searcher__calendar--end'), '.ibe_form__group');
    if ($('[data-keyboard-close]').length > 0) {
        dFrontJs.ibe_keyboard_action.close($('[data-keyboard-close]'));
    }

    dFrontJs.ibe_warnings.init(); // Warnings
    dFrontJs.ibe_device_apps.init(); // Detect the operation system
    dFrontJs.ibe_focusin.init(); // Focusin
    if ($('[data-cal="claim"]').length > 0) {
        dFrontJs.ibe_form_calendar.init(); // Datepicker for de forms
    }
    // Detail in table
    if ($('[data-flight-status-table]').length > 0) {
        dFrontJs.ibe_data_flight_status_table.init();
    }

    // Version con data attribute
    /* if($('[data-box^="box-icon-"]').length > 0){
        dFrontJs.ibe_box_icon.init();
    } */

    // Si encuentra más de un box icon entonces tenemos una lista
    if ($('.ibe-flight-status__section').find('.ibe-infocheckin__box--icon').length > 1) {
        dFrontJs.ibe_box_icon.init();
    }

    dFrontJs.app.inviewFunction();

    if ($('[data-gifanimated]').length > 0) {
        dFrontJs.app.gifFunction();// Start or Stop Gif Animated
    }

    if ($('[data-img-anim]').length > 0) {
        dFrontJs.app.imgAnim();// Start Image Animation
    }

    if ($('.ibe-searcher__vintage').length > 0) {
        dFrontJs.ibe_searcher_vintage.init();
    }

    if ($('[data-function="discount"]').length > 0) {
        dFrontJs.ibe_card_discount.init();
    }

    // Inicializador del calendar solo cuando existe
    if ($('[data-function="cal-start"]').length > 0) {
        dFrontJs.ibe_searcher_calendar.init();
    }

    if ($('[data-function="show-qr"]').length) {
        dFrontJs.ibe_qr.init('[data-function="show-qr"]');
    }

    $('.ibe-home .slick-menu.slick-full-window article.row').addClass('hidden').parent().find('article.row:not("slick-cloned")').eq(dFrontJs.app.indexCarouselCardAirplane).removeClass('hidden');

    // CRR: Insertamos esta condicion para que las modales del menu vintage se eejcuten en movil correctamente
    if (window.innerWidth < dFrontJs.resolutions.lg && $('.ibe-searcher__vintage').length > 0) {
        dFrontJs.ibe_modals_vintage.init(); // Modals in vintage
    }

    if (window.innerWidth >= dFrontJs.resolutions.lg) {
        dFrontJs.ibe_searcher_accordion.init();
        // dFrontJs.ibe_overlay.init();
        setTimeout(() => {
            $('[data-tab-view="responsive"]').find('[data-active]').eq($('[data-tab-view="desktop"]').attr('data-tab-active')).click();
        }, 500);
    } else {
        $('.ibe-header').addClass('fc-init');
        // dFrontJs.ibe_searcher_accordion_mobile.init();   //Comment to charge in main.js for Ajax tabs //Se comenta porque se carga en el main por la carga Ajax de los tabs
        dFrontJs.ibe_searcher_accordion_mobile.showFirst();
        dFrontJs.ibe_bootstrap_collapse.hideCollapse('[data-collapse="hide-resize"]');
        dFrontJs.ibe_inputs.init();
        // dFrontJs.ibe_overlay.init();
        setTimeout(() => {
            $('[data-tab-view="responsive"]').find('[data-active]').eq($('[data-tab-view="desktop"]').attr('data-tab-active')).click();
        }, 500);
    }
    setTimeout(() => {
        dFrontJs.ibe_scrollTop.init();
    }, 600);

    // Function for banner with background in float
    if ($('[data-floatbackground]').length > 0) {
        dFrontJs.ibe_floatbanner.init();
    }

    // Dfront Columns list
    checkDeviceColumnList(false);

    // Vista info_checkin
    if ($('.ibe-vidBanner__text').length > 0) {
        dFrontJs.app.resizeHeight('.ibe-vidBanner__text');
    }
    if ($('[data-resize="card-distributive-1"]').length > 0) {
        dFrontJs.app.resizeHeight('[data-resize="card-distributive-1"]');
    }
    if ($('[data-resize="card-distributive-2"]').length > 0) {
        dFrontJs.app.resizeHeight('[data-resize="card-distributive-2"]');
    }
    // Vista Equipaje de mano
    if ($('[data-fc-box-height]').length) {
        dFrontJs.app.calculateHeightComponents('.ibe-box-divided', '[data-fc-box-height]');
        dFrontJs.app.calculateHeightComponents('.ibe-box-divided', '[data-fc-box-title-height]');
    }
    // ibe-link-card
    if ($('.ibe-card-link--auto-height').length) {
        dFrontJs.app.calculateHeightComponentsCard('.ibe-card-link--auto-height', '.ibe-card-link__info');
        dFrontJs.app.calculateHeightComponentsCard('.ibe-card-cont--auto-height', '.ibe-card-cont__container');
    }
    // ibe-link-card--news
    if ($('.ibe-card-link--auto-height-xs').length) {
        dFrontJs.app.calculateHeightComponentsCard('.ibe-card-link--auto-height-xs', '.ibe-card-link__info');
    }
    // ibe-card--auto-height
    if ($('.ibe-card--auto-height').length) {
        dFrontJs.app.calculateHeightComponentsCard('.ibe-card--auto-height', '.ibe-card-link__info');
    }
    // ibe-card-box--auto-height
    // if ($(".ibe-card-box__title--auto-height").length) {
    //   dFrontJs.ibe_card_box.calculateHeightBox(".ibe-card-box__title--auto-height", ".ibe-card-box__title");
    // }
    if ($('.ibe-card-box__content--auto-height').length) {
        dFrontJs.ibe_card_box.calculateHeightBox('.ibe-card-box__content--auto-height', '.ibe-card-box__content');
    }
    if ($('.ibe-card-box__container--auto-height').length) {
        dFrontJs.ibe_card_box.calculateHeightBox('.ibe-card-box__container--auto-height', '.ibe-card-box__container');
    }
    if ($('[data-function^="google-gallery"]').length) {
        dFrontJs.ibe_gallery.init('[data-function^="google-gallery"]');
    }

    //* ***************************************************************************************************
    //* ** Recogida y devolucion de coche (misma ciudad o ciudades diferentes) en el buscador de vuelos ***
    //* ***************************************************************************************************

    if ($('[data-function="sameoffice"]').length) {
        _sameoofficeClick = function () {
            if ($(this).is(':checked')) {
                $(this).parents('.ibe-tab__container-desktop').find('.ibe-searcher__car-diferent-city').addClass('xui-car-city-hide');
                $(this).parents('.ibe-tab__container-desktop').find('.ibe-searcher__car-same-city').removeClass('xui-car-city-hide');
            } else {
                $(this).parents('.ibe-tab__container-desktop').find('.ibe-searcher__car-diferent-city').removeClass('xui-car-city-hide');
                $(this).parents('.ibe-tab__container-desktop').find('.ibe-searcher__car-same-city').addClass('xui-car-city-hide');
            }
        };
        $('[data-function="sameoffice"]').off('click', _sameoofficeClick);
        $('[data-function="sameoffice"]').on('click', _sameoofficeClick);
    }

    //* **********************************************************************************
    //* ** Cierre de elemento de galeria cuando hacemos scroll en la lista de imagenes ***
    //* **********************************************************************************
    if ($('[data-function="google-gallery"]').length) {
        $('[data-function="google-gallery"] .ibe-food-table__list').bind('touchmove', () => {
            $('[data-function="google-gallery"]').find('.GI_TW_close').trigger('touchstart');
        });
        $('[data-function="google-gallery"] .ibe-food-table__link').bind('click', (e) => {
            var target = e.target || e.srcElement;
            $('.ibe-food-table__list').stop().animate({ scrollLeft: $(target).parents('.ibe-food-table__item')[0].offsetLeft }, 500);
        });
    }

    $('[data-day-calendar] [data-function="cal-end"] .ui-datepicker-current-day').removeClass('ui-datepicker-current-day');

    requestAnimFrame(() => {
        $('[data-tab="bootstrap-tabdrop"]').trigger('resize');
    }, 700);

    // Function for ib-slick

    if ($('[data-slick="info-box"]').length > 0) {
        dFrontJs.ibe_slick.init();
    }

    if ($('[data-slick="carrousel-gift-cards"]').length > 0) {
        dFrontJs.ibe_slick_gift_cards.init();
    }

    // Function for dinamic modals
    if ($('[data-dinamic-open]').length > 0) {
        dFrontJs.ibe_dinamic_modal.init();
    }

    // Function for banner with background
    if ($('[data-background]').length > 0) {
        dFrontJs.ibe_banner.init();
    }

    // Function for click input and toggle content
    if ($('[data-toggle-element]').length > 0) {
        dFrontJs.ibe_collapse.init();
    }

    // Function for calculate night
    if ($('[data-max-night]').length > 0) {
        dFrontJs.ibe_counter_night.init();
    }

    // compact searcher
    /* if ($('[data-function="data-compact-searcher"]').length > 0) {
      dFrontJs.ibe_compact_search.init('[data-compact-searcher="trigger"]');
    } */
    // Function for compact offers
    if ($('[data-function="data-offers-collapser"]').length > 0) {
        $('[data-function="data-offers-collapser"]').each(function (index) {
            $(this).attr('data-offers-id', index);
            dFrontJs.ibe_compact_offers.init(`[data-offers-id="${index}"]`, index);
        });
    }

    if ($('[data-chart]').length > 0) {
        dFrontJs.ibe_chart.init();
    }
};

var reload = (function ($selector) {
    fnReady();
    $(window).trigger('load');
});


    $(document).ready(fnReady);

DOMTokenList.prototype.addMany = function (classes) {
    var i;
    var array = classes.split(' ');
    for (i = 0, length = array.length; i < length; i++) {
        this.add(array[i]);
    }
};

window.requestAnimFrame = (() => window.requestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.oRequestAnimationFrame
  || window.msRequestAnimationFrame
  || function (/* function */ callback, /* DOMElement */ element) {
      window.setTimeout(callback, 1000 / 60);
  })();

window.requestIdleCallback = window.requestIdleCallback || function (cb) {
    var start = Date.now();
    return setTimeout(() => {
        cb({
            didTimeout: false,
            timeRemaining() {
                return Math.max(0, 50 - (Date.now() - start));
            },
        });
    }, 1);
};

window.cancelIdleCallback = window.cancelIdleCallback || function (id) {
    clearTimeout(id);
};

if (window.innerWidth >= dFrontJs.resolutions.lg) {
    desktop = true;
    mobile = false;
} else {
    desktop = false;
    mobile = true;
}

// polyfills

if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
        var el = this;

        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
        value(predicate) {
            var o; var len; var thisArg; var k; var
                kValue;
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }

            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            thisArg = arguments[1];

            // 5. Let k be 0.
            k = 0;

            // 6. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return kValue.
                kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return kValue;
                }
                // e. Increase k by 1.
                k++;
            }

            // 7. Return undefined.
            return undefined;
        },
        configurable: true,
        writable: true,
    });
}

(function () {
    if (typeof window.CustomEvent === 'function') return false;

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
}());

//* ****************************************************************************
// Window onload
//* *****************************************************************************/

window.onload = function () {
    var cardIberiaPlus; var _tooltipTouchStartClick; var _ibeSeacherFocusout; var _collapseTouchstart; var
        _documentGeneralClick;
    // Vista preapara tu equipaje
    if ($('[data-function="prepare-baggage"]').length) {
        dFrontJs.app.resizeHeight('[data-function="prepare-baggage"]');
    }
    if ($('[data-function="prepare-baggage-child"]').length) {
        dFrontJs.app.calculateHeightComponents('[data-function="prepare-baggage"]', '[data-function="prepare-baggage-child"]');
    }

    if ($('[data-resize="gallery"]').length > 0) {
        dFrontJs.app.calculateHeightMin('.ibe-infocheckin__box--gallery', '[data-resize="gallery"]');
    }

    // Alturas de ibe-minibox-icon
    if ($('[data-fc-minibox-height]').length) {
        dFrontJs.app.calculateHeightComponents('[data-fc-minibox-height]', false);
        dFrontJs.app.calculateHeightComponents('[data-fc-minibox-height]', '.ibe-minibox-icon__title');
    }
    if ($('[data-fc-minibox-loged-height]').length) {
        dFrontJs.app.calculateHeightComponents('[data-fc-minibox-loged-height]', false);
        dFrontJs.app.calculateHeightComponents('[data-fc-minibox-loged-height]', '.ibe-minibox-icon__title');
    }
    // Vista Tarjetas de Iberia Plus
    cardIberiaPlus = '[data-card-iberia-plus="auto-height"]';
    if ($(cardIberiaPlus).length > 0) {
        dFrontJs.app.calculateHeightComponents(cardIberiaPlus, '.ibe-card-iberia-plus__header');
        dFrontJs.app.calculateHeightComponents(cardIberiaPlus, '.ibe-card-iberia-plus__body');
    }

    if ($('.ibe-ckeckin__list').length > 0) {
        dFrontJs.app.calculateHeightComponents('.ibe-ckeckin__list-container', '.ibe-ckeckin__list-box');
    }

    if ($('.ioslist-wrapper').length) {
        $('.ioslist-wrapper').scrollTop(0);
    }

    // Function for checkbox for personal or legal person
    if ($('[data-type="personal"]').length) {
        dFrontJs.app.hideShowCompanyPersonal();
    }

    // Añadir calculo de altura para template que no sea emergency
    if ($('[data-fc-height]').length > 0) {
        $('[data-fc-height]').each(function () {
            var number;
            if (!$(this).hasClass('fc-calculated')) {
                number = $(this).attr('data-fc-height');
                dFrontJs.app.calculateHeightComponents(`[data-fc-height=${number}]`, false);
            }
        });
    }

    // Igualar altura de la cabecera de (guide-chicago)
    if ($('[data-guide="header"]').length) {
        dFrontJs.app.calculateHeightHeaderGuides('[data-guide="header"]');
    }

    // Poner input en modo lectura en selectize simples.
    if ($('[data-select="true"]').length > 0) {
        $('.ibe_form__selectize--only-select.selectize-control').find('input').addClass('input-readonly');
        $('.ibe_form__selectize--only-select.selectize-control').find('input').attr('readonly', 'readonly');
    }

    _tooltipTouchStartClick = function (e) {
        var $buttonClose = $(this);
        var $toolt = $buttonClose.closest('.ibe-message-tooltip');
        var _disableClickbodyClick = function () {
            $toolt.removeClass('hidden');
            $toolt.css('display', '');
        };
        if (e.type === 'touchstart') {
            $toolt.hide('slow', () => {
                setTimeout(() => {
                    $('.disabledClick').remove();
                    $toolt.addClass('hidden');
                    $('.disabledClick,body').off('click', _disableClickbodyClick);
                    $('.disabledClick,body').on('click', _disableClickbodyClick);
                }, 100);
            });
            e.stopPropagation();
        } else {
            $toolt.hide('slow');
            setTimeout(() => {
                $toolt.css('display', '');
            }, 1000);
        }
    };

    $('.ibe-message-tooltip__button-close').off('touchstart click', _tooltipTouchStartClick);
    $('.ibe-message-tooltip__button-close').on('touchstart click', _tooltipTouchStartClick);

    _ibeSeacherFocusout = function (event) {
        var $elem = $(this);
        var hasFocus;
        setTimeout(() => {
            if (!$elem.parent().hasClass('ibe_form__box')) {
                hasFocus = $elem.closest('.ibe_form__group, .ibe-searcher__passenger, .ibe-searcher__calendar-header').find(':focus, .new-clicked-element').length;
                if (!hasFocus && !focusArrow) {
                    // selectFocus(target);
                } else {
                    $('body').on('click', function cd(e) {
                        var target = e.target || e.srcElement;
                        var tar = $(target);
                        if (!tar.closest('[data-event="click"]').length && !$elem.closest('.ibe_form__group, .ibe-searcher__passenger').find(tar).length && (tar.length == 1 && tar[0].localName != 'body')) {
                            selectFocus($elem);
                        }
                        $(this).unbind('click', cd);
                    });
                }
            }
        }, 200);
    };

    $('.ibe-searcher [data-toggle="collapse"]').off('focusout', _ibeSeacherFocusout);
    $('.ibe-searcher [data-toggle="collapse"]').on('focusout', _ibeSeacherFocusout);

    _collapseTouchstart = function (event) {
        var $elem = $(this);
        var _documentTouchstart = function (e) {
            var target = e.target || e.srcElement;
            var tar = $(target);
            if (!tar.closest('[data-event="click"]').length && !$elem.closest('.ibe_form__group, .ibe-searcher__passenger').find(tar).length && (tar.length == 1 && tar[0].localName != 'body')) {
                selectFocus($elem);
            }
        };
        $(document).on('touchstart', _documentTouchstart);
        $(document).on('touchstart', _documentTouchstart);
    };

    if (navigator.userAgent.match(/(ipad)/i)) {
        $('[data-tab-view="desktop"] [data-toggle="collapse"], [data-tab-view="desktop"] [data-cal-button]').off('touchstart', _collapseTouchstart);
        $('[data-tab-view="desktop"] [data-toggle="collapse"], [data-tab-view="desktop"] [data-cal-button]').on('touchstart', _collapseTouchstart);
    }

    function selectFocus(obj) {
        obj = $(obj);
        if (obj.closest('.ibe_form__group, .ibe-searcher__passenger')) {
            dFrontJs.ibe_bootstrap_collapse.hideCollapse(obj.closest('.ibe_form__group, .ibe-searcher__passenger').find('[data-toggle="container"]'));
        }
    }

    _documentGeneralClick = function () {
        if ($('.ibe-modal').is(':visible')) {
            $('body').addClass('modal-open');
            if (navigator.userAgent.match(/(iPhone)|(iPad)|(iPod)/i)) {
                $('body').addClass('menu-action modal-open').css('position', 'relative');
                $('html').css('overflow', 'auto');
                $('body').addClass('modal-ios');
            }
        } else if ($('.ibe-modal:visible').length === 0 && $('body').hasClass('modal-open')) {
            $('body').removeClass('modal-open').removeClass('modal-ios');
        }
    };

    $(document).off('click', _documentGeneralClick);
    $(document).on('click', _documentGeneralClick);

    // setTimeout(function(){$('[data-tab="bootstrap-tabdrop"]').trigger('resize')}, 700);
};

//* ****************************************************************************
// Window resize
//* *****************************************************************************/

$(window).on('resize', function () {
    var $slickInfo; var win; var $vid_banner; var $vintage; var
        cardIberiaPlus;

    if (window.innerWidth >= dFrontJs.resolutions.lg) {
        mobile = false;
        desktop = true;
    } else {
        mobile = true;
        desktop = false;
    }

    /** ***************************************************************************** */
    /* -------------------- MODULE INFO - STOPOVER ----------------------------------*/
    /** ***************************************************************************** */
    $slickInfo = $('[data-slick="info-box"]');
    if ($slickInfo.length > 0) {
        dFrontJs.ibe_slick.init();
    }

    /** ***************************************************************************** */
    /* -------------------- MODULE INFO - STOPOVER ----------------------------------*/
    /** ***************************************************************************** */
    // Function for banner with background
    if ($('[data-background]').length > 0) {
        dFrontJs.ibe_banner.init();
    }

    /** **************************************************************************** */

    // Function for dinamic modals
    if ($('[data-dinamic-open]').length > 0) {
        dFrontJs.ibe_dinamic_modal.resize();
    }

    if ($('[data-date-large]').length > 0) {
        dFrontJs.ibe_dateFormat.init(); // Elegir formato de fecha
    }

    if (!dFrontJs.ibe_resize.resolutionChange(window.innerWidth)) {
        setTimeout(() => {
            $('[data-tab="bootstrap-tabdrop"]').trigger('resize');
        }, 50);
        return false;
    }

    // Loading
    dFrontJs.ibe_loading.init();
    if (window.innerWidth >= dFrontJs.resolutions.md) {
        desktop = true;
    } else {
        desktop = false;
    }
    // vista info_checkin
    win = $(this);
    $vid_banner = $('.ibe-vidBanner__text');
    if ($vid_banner.length > 0) {
        if (win.width() < dFrontJs.resolutions.lg && win.width() >= dFrontJs.resolutions.md) {
            dFrontJs.app.resizeHeight('.ibe-vidBanner__text');
        } else {
            $vid_banner.css('height', 'auto');
        }
    }

    checkDeviceColumnList(true);

    if (window.innerWidth >= dFrontJs.resolutions.lg) {
        dFrontJs.ibe_searcher_accordion.init();
        dFrontJs.ibe_inputs.init();
        // dFrontJs.ibe_overlay.init();
        $('body').removeClass('modal-open');

        $vintage = $('.ibe-searcher__vintage');
        if ($vintage.length > 0) {
            dFrontJs.ibe_modals_vintage.closeModalDatepicker();
            dFrontJs.ibe_modals_vintage.closeModalsVintage();
            // $("[data-cal='end'],[data-cal='start']").off('focus click', dFrontJs.ibe_modals_vintage.openModalDatepicker());
        }
    } else {
        if (navigator.userAgent.match(/(Android)|(webOS)|(BlackBerry)|(Windows Phone)|(iPhone)|(iPad)|(iPod)/i)) {
            dFrontJs.ibe_searcher_accordion_mobile.init();
            dFrontJs.ibe_bootstrap_collapse.hideCollapse('[data-collapse="hide-resize"]');
            dFrontJs.ibe_inputs.init();
            // dFrontJs.ibe_overlay.init();
        } else {
            dFrontJs.ibe_searcher_accordion_mobile.init();
            dFrontJs.ibe_bootstrap_collapse.hideCollapse('[data-collapse="hide-resize"]');
            dFrontJs.ibe_inputs.init();
            // dFrontJs.ibe_overlay.init();
        }
        $vintage = $('.ibe-searcher__vintage');
        if ($vintage.length > 0) {
            dFrontJs.ibe_modals_vintage.init();
        }
        dFrontJs.ibe_headerNew.init();
    }
    // Init Overlay and Inputs Animation in Resize Event
    $('.ibe-accordion__button').parent().removeClass('ibe-accordion__overlay-button');

    // vista layout-card-link
    if ($('.ibe-card-link--auto-height').length > 0) {
        dFrontJs.app.calculateHeightComponentsCard('.ibe-card-link--auto-height', '.ibe-card-link__info');
        dFrontJs.app.calculateHeightComponentsCard('.ibe-card-cont--auto-height', '.ibe-card-cont__container');
    }
    // ibe-link-card--news
    if ($('.ibe-card-link--auto-height-xs').length) {
        dFrontJs.app.calculateHeightComponentsCard('.ibe-card-link--auto-height-xs', '.ibe-card-link__info');
    }
    // ibe-card-box
    // if ($(".ibe-card-box__title--auto-height").length) {
    //   dFrontJs.ibe_card_box.calculateHeightBox(".ibe-card-box__title--auto-height", ".ibe-card-box__title");
    // }
    if ($('.ibe-card-box__content--auto-height').length) {
        dFrontJs.ibe_card_box.calculateHeightBox('.ibe-card-box__content--auto-height', '.ibe-card-box__content');
    }
    // ibe-card--auto-height
    if ($('.ibe-card--auto-height').length) {
        dFrontJs.app.calculateHeightComponentsCard('.ibe-card--auto-height', '.ibe-card-link__info');
    }
    // vista layout-card-distributive
    if ($('[data-resize="card-distributive-1"]').length > 0) {
        dFrontJs.app.resizeHeight('[data-resize="card-distributive-1"]');
    }
    if ($('[data-resize="card-distributive-2"]').length > 0) {
        dFrontJs.app.resizeHeight('[data-resize="card-distributive-2"]');
    }
    // Vista Equipaje de mano
    if ($('[data-fc-box-height]').length) {
        dFrontJs.app.calculateHeightComponents('.ibe-box-divided', '[data-fc-box-height]');
        dFrontJs.app.calculateHeightComponents('.ibe-box-divided', '[data-fc-box-title-height]');
    }
    // Vista preapara tu equipaje
    if ($('[data-function="prepare-baggage"]').length) {
        dFrontJs.app.resizeHeight('[data-function="prepare-baggage"]');
    }
    if ($('[data-function="prepare-baggage-child"]').length) {
        dFrontJs.app.calculateHeightComponents('[data-function="prepare-baggage"]', '[data-function="prepare-baggage-child"]');
    }
    // Alturas de ibe-minibox-icon
    if ($('[data-fc-minibox-height]').length) {
        dFrontJs.app.calculateHeightComponents('[data-fc-minibox-height]', false);
        dFrontJs.app.calculateHeightComponents('[data-fc-minibox-height]', '.ibe-minibox-icon__title');
    }
    if ($('[data-fc-minibox-loged-height]').length) {
        dFrontJs.app.calculateHeightComponents('[data-fc-minibox-loged-height]', false);
        dFrontJs.app.calculateHeightComponents('[data-fc-minibox-loged-height]', '.ibe-minibox-icon__title');
    }

    // Mover check avios en el buscador de puente aereo
    if ($('.ibe-advanced-searcher__puente').length > 0) {
        dFrontJs.ibe_searcher_calendar.moveCheckAviosPuente();
    }

    // Añadir calculo de altura para template que no sea emergency
    if ($('[data-fc-height]').length > 0) {
        $('[data-fc-height]').each(function () {
            var number = $(this).attr('data-fc-height');
            dFrontJs.app.calculateHeightComponents(`[data-fc-height=${number}]`, false);
        });
    }
    if ($('.ibe-ckeckin__list').length > 0) {
        dFrontJs.app.calculateHeightComponents('.ibe-ckeckin__list', '.ibe-ckeckin__list-box');
    }
    // Resize Steps para partners
    if ($('.ibe-card-steps').length > 0) {
        dFrontJs.app.calculateHeightComponents('.ibe-card-steps', '.ibe-card-steps__box');
    }

    // cambio de numero de meses en datepicker
    if ($('[data-function="cal-start"]').length) {
        if (window.innerWidth < dFrontJs.resolutions.md) {
            $('[data-function="cal-start"]').datepicker('option', 'numberOfMonths', 1);
            $('[data-function="cal-end"]').datepicker('option', 'numberOfMonths', 1);
        } else {
            $('[data-function="cal-start"]').datepicker('option', 'numberOfMonths', 2);
            $('[data-function="cal-end"]').datepicker('option', 'numberOfMonths', 2);
        }
        if ($('[data-cal="start"][data-one-month]').length) {
            $('[data-cal="start"][data-one-month]').parents('.ibe_form__group').find('[data-function="cal-start"], [data-function="cal-end"]').datepicker('option', 'numberOfMonths', 1);
        }
        requestAnimFrame(() => {
            $('[data-cal="start"]').closest('.ibe_form__group--half').parent().find('.ibe-searcher__calendar').css('opacity', '1');
        });
    }

    // Vista Tarjetas de Iberia Plus
    cardIberiaPlus = '[data-card-iberia-plus="auto-height"]';
    if ($(cardIberiaPlus).length > 0) {
        dFrontJs.app.calculateHeightComponents(cardIberiaPlus, '.ibe-card-iberia-plus__header');
        dFrontJs.app.calculateHeightComponents(cardIberiaPlus, '.ibe-card-iberia-plus__body');
    }

    if (desktop) {
        $('.ibe-footer .ibe-footer__collapse').removeClass('collapse');
    }

    // Ocultar collapse en responsive
    if ($('[data-collapse="hide-resize"]').length > 0) {
        dFrontJs.ibe_bootstrap_collapse.hideCollapse('[data-collapse="hide-resize"]');
    }
    if ($('[data-guide="header"]').length) {
        dFrontJs.app.calculateHeightHeaderGuides('[data-guide="header"]');
    }

    // Ocultar Overlay con resize
    if (navigator.userAgent.match(/(Android)|(webOS)|(BlackBerry)|(Windows Phone)|(iPhone)|(iPad)|(iPod)/i)) {
        $('.ibe-overlay').hide();
        $('[data-function="data-focus-searcher-mobile"], [data-function="data-focus-searcher"]').css('z-index', '');
    }
    $('[data-function="data-focus-searcher"]').css('z-index', '');
    $('[data-toggle="accordion"]').children('[data-function="data-focus-text"]').removeClass('ibe-accordion__overlay-text');
    $('[data-toggle="link"]').children('[data-function="data-focus-text"]').removeClass('ibe-accordion__overlay-text');
    $('[data-toggle="link"]').children('[data-function="data-focus-text"]').css('z-index');
    // activate new logged

    if ($('.popover').is(':visible')) {
        $('.ibe-overlay').show();
    } else {
        $('.ibe-overlay').hide();
        $('[data-function="data-focus-searcher-mobile"], [data-function="data-focus-searcher"]').css('z-index', '');
    }

    // dFrontJs.ibe_card_box.calculateHeightText();

    if ($('.ibe-searcher__vintage').length > 0) {
        if (window.innerWidth < dFrontJs.resolutions.lg) {
            // dFrontJs.ibe_modals_vintage.resizeMobile(); // Modals in vintage)

        } else {
            // dFrontJs.ibe_modals_vintage.resizeDesktop(); // Modals in vintage
        }
    }
});

// Dfront Columns list

function checkDeviceColumnList(responsive) {
    if (window.innerWidth < dFrontJs.resolutions.md && window.innerWidth >= dFrontJs.resolutions.xs) {
        dFrontJs.ibe_column_count(2, '[data-columns-list]', '[data-columns-list] .ibe-list-column .ibe-list-column__item', '.ibe-list-column', responsive);
    } else {
        dFrontJs.ibe_column_count(4, '[data-columns-list]', '[data-columns-list] .ibe-list-column .ibe-list-column__item', '.ibe-list-column', responsive);
    }
}
