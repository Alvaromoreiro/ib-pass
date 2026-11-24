(function () {
    'use strict';

    angular
        .module('ib-pmt-tabs-module')
        .directive('ibPmtTabResponsive', ibPmtTabResponsive);

    ibPmtTabResponsive.$inject = ['$timeout', '$window'];
    function ibPmtTabResponsive($timeout, $window) {
        return {
            restrict: 'AE',
            link: link
        }
        function link(scope, elem, attrs) {
            function initTabResponsive() {
                var $elem = angular.element(elem),
                    $nav = $elem.find('.nav-pills, .nav-tabs');
                $nav.tabdrop({
                    text: attrs.tabResponsiveText
                });
                angular.element('.dropdown-toggle').attr('href', 'javascript:void(0)');
                $nav.find('.dropdown-toggle').on('click', (e) => {
                    if (!angular.element('.tabdrop').hasClass('open')) {
                        angular.element('.tabdrop').addClass('open');
                    } else {
                        angular.element('.tabdrop').removeClass('open');
                    }
                    e.stopPropagation();
                });
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
            $timeout(function () {
                rewriteTabdrop();
            });
            $timeout(function () {
                initTabResponsive();
                angular.element($window).triggerHandler('resize');
            });

        }
    }
})();