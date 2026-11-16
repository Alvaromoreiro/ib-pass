import * as angular from "angular";

@Service("ib-commons-utils-module", ["$window", "$timeout"])
export class CommonsComponentUtils {
  constructor(
    private $window: ng.IWindowService,
    private $timeout: ng.ITimeoutService,
  ) {}

  equalHeight = (e: HTMLElement, reload?: boolean): void => {
    const equals = angular.element(e).find("[data-equal]");
    const equalNames: string[] = [];

    const autoHeight = (): void => {
      let equals, maxHeight: number;

      for (let i = 0; i <= equalNames.length; i++) {
        equals = angular
          .element(e)
          .find('[data-equal="' + equalNames[i] + '"]');
        equals.css("height", "auto");
        const auxHeight = [];

        angular.forEach(equals, (value) => {
          const element = angular.element(value);
          auxHeight.push(element[0].clientHeight);
        });
        maxHeight = Math.max.apply(Math, auxHeight);
        equals.css("height", "0");
        equals.css("transition", "height 0.5s");
        equals.css("height", maxHeight + "px");
      }
    };

    if (reload === void 0) {
      reload = false;
    }

    angular.forEach(equals, (value) => {
      const thisName: string = angular.element(value).data("equal");
      if (equalNames.indexOf(thisName) <= -1) {
        equalNames.push(thisName);
      }
    });

    if (reload) {
      autoHeight();
    } else {
      this.$timeout(autoHeight);
    }
  };

  // Equalize element widths
  equalWidth = (e: HTMLElement, reload: boolean): void => {
    const equals = angular.element(e).find("[data-equal-w]");
    const equalNames: string[] = [];

    const autoWidth = () => {
      for (let i = 0; i <= equalNames.length; i++) {
        const equals = angular
          .element(e)
          .find('[data-equal-w="' + equalNames[i] + '"]');
        equals.css("width", "auto");
        const auxWidth = [];

        angular.forEach(equals, (value) => {
          const element = angular.element(value);
          auxWidth.push(element[0].clientWidth);
        });

        const maxWidth = Math.max.apply(Math, auxWidth);
        equals.css("width", "0");
        equals.css("transition", "width 0.5s");
        equals.css("width", maxWidth + "px");
      }
    };

    if (reload === void 0) {
      reload = false;
    }

    angular.forEach(equals, (value) => {
      const thisName = angular.element(value).data("equal-w");
      if (equalNames.indexOf(thisName) <= -1) {
        equalNames.push(thisName);
      }
    });

    if (reload) {
      autoWidth();
    } else {
      this.$timeout(autoWidth);
    }
  };

  //Collect parent of an element (Native javascript y angular element)
  get_parents = (el, fn): void => {
    let element = el[0];
    while (element) {
      if (fn(element)) return element;
      element = element.parentNode;
    }
  };

  //Face effect opacity 0 to 1
  fadeIn = (el): void => {
    const element = el[0];
    element.style.opacity = 0;
    let last = new Date().getTime();
    const tick = () => {
      element.style.opacity =
        (+element.style.opacity + (<any>new Date() - last)) / 400;
      last = new Date().getTime();
      if (+element.style.opacity < 1) {
        (this.$window.requestAnimationFrame && requestAnimationFrame(tick)) ||
          this.$timeout(tick, 16);
      }
    };
    tick();
  };
  //Face effect opacity 1 to 0
  fadeOut = (el) => {
    const element = el[0];
    element.style.opacity = 1;
    let last = new Date().getTime();
    const tick = () => {
      element.style.opacity =
        (+element.style.opacity - (<any>new Date() - last)) / 400;
      last = new Date().getTime();
      if (+element.style.opacity > 0) {
        (this.$window.requestAnimationFrame && requestAnimationFrame(tick)) ||
          this.$timeout(tick, 16);
      }
    };
    tick();
  };

  //Detect navigator
  detectNavigator = (): boolean => {
    let oldIE = false;
    if (angular.element("html").is(".ie7, .ie8, .ie9")) {
      oldIE = true;
    }
    return oldIE;
  };
}
