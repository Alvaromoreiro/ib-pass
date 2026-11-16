(function () {
    'use strict';
    const DOMPurify = require('dompurify');

    angular
        .module('ib-tabs')
        .directive('tabResponsive', tabResponsive);
    
    tabResponsive.$inject = ['$timeout', '$window'];
    /* istanbul ignore next */
    function tabResponsive($timeout, $window) {
        return {
            restrict: 'AE',
            link: link,
            controller: 'tabResponsiveController'
        };
        function link(scope, elem, attrs) {
            function initTabResponsive() {
                var $elem = angular.element(elem),
                    $nav = $elem.find('.nav-pills, .nav-tabs');
                $nav.tabdrop({
                    text: attrs.tabResponsiveText
                });
                $nav.find('.dropdown-toggle').on('click', function (e) {
                    e.preventDefault();
                });
            }
            // Init tabdrop
            function initTabdrop() {
                var WinReszier = (function () {
                    var registered = [];
                    var inited = false;
                    var timer;
                    var i;
                    var cnt;
                    var resize = function (ev) {
                        clearTimeout(timer);
                        timer = $timeout(notify, 100);
                    };
                    var notify = function () {
                        for (i = 0, cnt = registered.length; i < cnt; i++) {
                            registered[i].apply();
                        }
                    };
                    return {
                        register: function (fn) {
                            registered.push(fn);
                            if (inited === false) {
                                angular.element(window).bind('resize', resize);
                                inited = true;
                            }
                        },
                        unregister: function (fn) {
                            for (i = 0, cnt = registered.length; i < cnt; i++) {
                                if (registered[i] === fn) {
                                    delete registered[i];
                                    break;
                                }
                            }
                        }
                    };
                }());

                var TabDrop = function (element, options) {
                    this.element = angular.element(element);
                    this.dropdown = angular.element('<li class="dropdown hide pull-right tabdrop">' +
                        '<a class="dropdown-toggle" data-toggle="dropdown" href="#">' +
                        DOMPurify.sanitize(options.text) + ' <b class="caret"></b></a>' +
                        '<ul class="dropdown-menu"></ul></li>').prependTo(this.element);
                    if (this.element.parent().is('.tabs-below')) {
                        this.dropdown.addClass('dropup');
                    }
                    WinReszier.register($.proxy(this.layout, this));
                    this.layout();
                };

                TabDrop.prototype = {
                    constructor: TabDrop,

                    layout: function () {
                        var collection = [];
                        this.dropdown.removeClass('hide');
                        this.element
                            .append(this.dropdown.find('li'))
                            .find('>li')
                            .not('.tabdrop')
                            .each(function () {
                                if (this.offsetTop > 0) {
                                    collection.push(this);
                                }
                            });
                        if (collection.length > 0) {
                            collection = angular.element(collection);
                            this.dropdown
                                .find('ul')
                                .empty()
                                .append(collection);
                            if (this.dropdown.find('.active').length === 1) {
                                this.dropdown.addClass('active');
                            } else {
                                this.dropdown.removeClass('active');
                            }
                        } else {
                            this.dropdown.addClass('hide');
                        }
                    }
                };

                $.fn.tabdrop = function (option) {
                    return this.each(function () {
                        var $this = angular.element(this),
                            data = $this.data('tabdrop'),
                            options = angular.isObject(option) && option;
                        if (!data) {
                            $this.data('tabdrop', (data = new TabDrop(this, $.extend({}, $.fn.tabdrop.defaults, options))));
                        }
                        if (typeof option == 'string') {
                            data[option]();
                        }
                    });
                };

                $.fn.tabdrop.defaults = {
                    text: '<i class="icon-align-justify"></i>'
                };

                $.fn.tabdrop.Constructor = TabDrop;
            }
            function rewriteTabdrop() {
                $.fn.tabdrop.Constructor.prototype = {
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
                        this.element
                            .append(this.dropdown.find('li'))
                            .find('>li')
                            .not('.tabdrop')
                            .each(function () {
                                var $this = angular.element(this);
                                $this.css('width', 'auto');

                                if (this.offsetTop > 0) {
                                    collection.push(this);
                                }
                            });
                        if (collection.length > 0) {
                            collection = angular.element(collection);
                            this.dropdown
                                .find('ul')
                                .empty()
                                .append(collection);
                            if (this.dropdown.find('.active').length === 1) {
                                this.dropdown.addClass('active');
                            } else {
                                this.dropdown.removeClass('active');
                            }
                        } else {
                            this.dropdown.addClass('hide');
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
                            this.element.css({ 'width': '100%' });
                        }
                        aux = (100 / (vlength - 1));
                        this.element.find('.dropdown').css({
                            'width': widthUlTab
                        });
                        this.element.find(' > li').not('.dropdown').css('width', aux + '%');
                    }
                };
            }

            initTabdrop();
            rewriteTabdrop();
            $timeout(function () {
                initTabResponsive();
                angular.element($window).triggerHandler('resize');
            }, 500);

        }
    }
})();