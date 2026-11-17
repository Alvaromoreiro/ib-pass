import * as angular from 'angular';
import 'angular-mocks';

describe('ibPinchZoom directive', () => {
    let $compile: ng.ICompileService;
    let $rootScope: ng.IRootScopeService & { scale?: number };
    let $timeout: ng.ITimeoutService & { flush: (delay?: number) => void };
    let element: ng.IAugmentedJQuery;

    interface TouchEventFixture {
        type: string;
        touches: Array<{ clientX: number; clientY: number }>;
        defaultPrevented: boolean;
        preventDefault(): void;
        stopPropagation(): void;
    }

    beforeEach(angular.mock.module('ib-pinch-zoom-module'));

    beforeEach(angular.mock.inject((_$compile_: ng.ICompileService, _$rootScope_: ng.IRootScopeService, _$timeout_: ng.ITimeoutService) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_ as ng.IRootScopeService & { scale?: number };
        $timeout = _$timeout_ as ng.ITimeoutService & { flush: (delay?: number) => void };
        element = $compile('<div ib-pinch-zoom max-scale="2"></div>')($rootScope);
        $timeout.flush(3000);
    }));

    const dispatchTouch = (type: string, touches: Array<{ clientX: number; clientY: number }>): TouchEventFixture => {
        const event: TouchEventFixture = {
            type,
            touches,
            defaultPrevented: false,
            preventDefault () {
                this.defaultPrevented = true;
            },
            stopPropagation: () => undefined
        };
        element.triggerHandler(event as unknown as JQueryEventObject);
        return event;
    };

    it('initializes the transform origin and scale', () => {
        expect($rootScope.scale).toBe(1);
        expect(element.css('transform-origin')).toBe('0px 0px');
    });

    it('zooms with a pinch and clamps the scale when the gesture ends', () => {
        dispatchTouch('touchstart', [{ clientX: 0, clientY: 0 }, { clientX: 100, clientY: 0 }]);
        dispatchTouch('touchmove', [{ clientX: 0, clientY: 0 }, { clientX: 100, clientY: 0 }]);
        dispatchTouch('touchmove', [{ clientX: 0, clientY: 0 }, { clientX: 500, clientY: 0 }]);

        expect($rootScope.scale).toBe(5);

        dispatchTouch('touchend', []);

        expect($rootScope.scale).toBe(2);
        expect(element.css('transform')).toMatch(/matrix\(2,\s*0,\s*0,\s*2,/);
        expect(element.css('transition')).toContain('0.1s');
    });

    it('swipes a zoomed element and ignores touchend while fingers remain', () => {
        dispatchTouch('touchstart', [{ clientX: 0, clientY: 0 }, { clientX: 100, clientY: 0 }]);
        dispatchTouch('touchmove', [{ clientX: 0, clientY: 0 }, { clientX: 100, clientY: 0 }]);
        dispatchTouch('touchmove', [{ clientX: 0, clientY: 0 }, { clientX: 200, clientY: 0 }]);
        dispatchTouch('touchend', []);

        dispatchTouch('touchstart', [{ clientX: 100, clientY: 50 }]);
        dispatchTouch('touchmove', [{ clientX: 80, clientY: 40 }]);

        dispatchTouch('touchend', [{ clientX: 80, clientY: 40 }]);
        expect($rootScope.scale).toBe(2);

        dispatchTouch('touchend', []);
        expect(element.css('transform')).toMatch(/matrix\(2,\s*0,\s*0,\s*2,/);
    });
});