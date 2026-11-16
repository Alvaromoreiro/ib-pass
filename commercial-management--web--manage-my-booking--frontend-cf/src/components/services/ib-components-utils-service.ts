import * as angular from 'angular';

@Service(
    'ib-MmB-services-module',
    ['$rootScope', '$window', '$timeout', 'AddOnService'],
    []
)
export class ComponentsUtils {
    constructor (
        private $rootScope:  any,
        private $window: angular.IWindowService,
        private $timeout: angular.ITimeoutService,
        private AddOnService) {}

    // Equalize element heights
    equalHeight = (e) => {
        let equals = angular.element(e).find('[data-equal]');
        let equalNames = [];

        angular.forEach(equals, function (value) {
            let thisName = angular.element(value).data('equal');
            if (equalNames.indexOf(thisName) <= -1) {
                equalNames.push(thisName);
            }
        });

        const autoHeight = () => {
            let equals;
            let auxHeight = [];
            let maxHeight;
            for (let i = 0; i <= equalNames.length; i++) {
                equals = angular.element(e).find('[data-equal="' + equalNames[i] + '"]');
                equals.css('height', 'auto');
                if (equals && equals.height() > 0) {
                    auxHeight = [];

                    angular.forEach(equals, (value) => {
                        let $this = angular.element(value);
                        auxHeight.push($this[0].clientHeight);
                    });

                    maxHeight = Math.max.apply(Math, auxHeight);
                    equals.css('height', '0');
                    equals.css('transition', 'height 0.5s');
                    equals.css('height', maxHeight + 'px');
                }
            }
        };

        this.$timeout(autoHeight);
    };

    // Collect parent of an element (Native javascript y angular element)
    get_parents = (el, fn) => {
        var el = el[0];
        while (el) {
            if (fn(el)) return el;
            el = el.parentNode;
        }
    };

    // Face effect opacity 0 to 1
    fadeIn = (el: any) => {
        var el = el[0];
        let last, tick, date: any;
        el.style.opacity = 0;
        last = new Date().getTime();
        date = new Date();
        tick = () => {
            el.style.opacity = +el.style.opacity + (date - last) / 400;
            last = new Date().getTime();
            if (+el.style.opacity < 1) {
                (this.$window.requestAnimationFrame && requestAnimationFrame(tick)) || this.$timeout(tick, 16);
            }
        };
        tick();
    };

    // Face effect opacity 1 to 0
    fadeOut = (el) => {
        var el = el[0];
        let last, tick, date: any;
        el.style.opacity = 1;

        last = new Date().getTime();
        date = new Date();
        tick = () => {
            el.style.opacity = +el.style.opacity - (date - last) / 400;
            last = new Date().getTime();
            if (+el.style.opacity > 0) {
                (this.$window.requestAnimationFrame && requestAnimationFrame(tick)) || this.$timeout(tick, 16);
            }
        };
        tick();
    };

    // Detect navigator
    detectNavigator = () => {
        return angular.element('html').is('.ie7, .ie8, .ie9');
    };

    /**
     * @function 
     * @name initAddOn
     * @desc init Add Ons 
     */
    initAddOn = () => {
        const width = this.$window.innerWidth;
        if (width >= 768 && width < 1024) {
            this.AddOnService.displayAddOn(this.$rootScope.BANNER_IDS.TYPE_0);
        } else if (width < 768) {
            this.AddOnService.displayAddOn(this.$rootScope.BANNER_IDS.TYPE_1);
        } else if (width >= 1024 && width < 1280) {
            this.AddOnService.displayAddOn(this.$rootScope.BANNER_IDS.TYPE_3);
        } else if (width >= 1280) {
            this.AddOnService.displayAddOn(this.$rootScope.BANNER_IDS.TYPE_2);
        }
    };
}