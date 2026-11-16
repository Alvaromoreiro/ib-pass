import SimulatorAvailabilityAnimation from "@src/components/ib-MmB-booking-dashboard/components/ib-MmB-simulator-availability/cmpnts/ib-MmB-simulator-booking-availability/animations/ib-MmB-simulator-booking-availability-animation"; 

describe('SimulatorBookingAvailabilityAnimation animation', () => {
    let $rootScope, $window, $timeout, fakeComponentsUtils, animationInstance;

    beforeEach(() => {
        $rootScope = {
            $broadcast: jasmine.createSpy('$broadcast'),
            $apply: jasmine.createSpy('$apply'),
            selectedSlice: {
                selectedSlicesLength: 1,
                selectedSliceIndex: 0,
                articleOffset: 0,
                heightHeadingFlight: 0,
                transformOffset: 0,
                cabin: 'Y'
            },
            animationIndex: 0
        };
        $window = { innerWidth: 1024 };
        $timeout = (fn) => fn && fn();
        fakeComponentsUtils = { equalHeight: jasmine.createSpy('equalHeight') };

        animationInstance = SimulatorAvailabilityAnimation($window, $timeout, $rootScope, fakeComponentsUtils);
    });

    it('Should enter is function', () => {
        expect(animationInstance && typeof animationInstance.enter).toBe('function');
    });

    it('Should innerWidth < 768> (mobile)', () => {
        $window.innerWidth = 480;
        animationInstance = SimulatorAvailabilityAnimation($window, $timeout, $rootScope, fakeComponentsUtils);

        const doneMock = jasmine.createSpy('done');
        const elementMock = jasmine.createSpyObj('element', ['find', 'css', 'on', 'removeAttr']);
        const findResultMock = jasmine.createSpyObj('findResult', ['css', 'removeAttr', 'offset']);
        findResultMock.offset = jasmine.createSpy('offset').and.returnValue({ top: 0, left: 0 });

        elementMock.find.and.callFake((selector) => {
            if (selector.startsWith('#selectedSliceMobile-')) {
                elementMock._mobileBranchCalled = true;
            }
            return findResultMock;
        });
        elementMock.css.and.stub();
        elementMock.on.and.callFake((event, cb) => { });
        elementMock.removeAttr.and.stub();

        // Mock de angular.element global para evitar error de offset().top
        // @ts-expect-error: mock para test, ignora tipos de JQLite/JQuery
        spyOn(window.angular, 'element').and.callFake(() =>
            ({
                css: jasmine.createSpy('css'),
                removeAttr: jasmine.createSpy('removeAttr'),
                offset: ((...args) => ({ top: 0, left: 0 })),
                scrollTop: jasmine.createSpy('scrollTop')
            } as any)
        );

        animationInstance.enter(elementMock, doneMock);

        expect(elementMock._mobileBranchCalled).toBeTrue();
    });

    it('Should enter()', () => {
        $window.innerWidth = 1024;
        animationInstance = SimulatorAvailabilityAnimation($window, $timeout, $rootScope, fakeComponentsUtils);
        const findResultMock = jasmine.createSpyObj('findResult', ['css', 'removeAttr', 'offset']);
        findResultMock.offset = jasmine.createSpy('offset').and.returnValue({ top: 0, left: 0 });

        const elementMock = jasmine.createSpyObj('element', ['find', 'css', 'on', 'removeAttr']);
        elementMock.find.and.returnValue(findResultMock);
        elementMock.css.and.stub();
        elementMock.on.and.callFake((event, cb) => { /* Simula evento */ });
        elementMock.removeAttr.and.stub();

        // @ts-expect-error: mock para test, ignora tipos de JQLite/JQuery
        spyOn(window.angular, 'element').and.callFake(() =>
            ({
                css: jasmine.createSpy('css'),
                removeAttr: jasmine.createSpy('removeAttr'),
                offset: ((...args) => ({ top: 0, left: 0 })),
                scrollTop: jasmine.createSpy('scrollTop')
            } as any)
        );

        const doneMock = jasmine.createSpy('done');

        animationInstance.enter(elementMock, doneMock);

        expect(doneMock).toHaveBeenCalled();
    });

    it('Should callback element.on(eventsEnd, fn) event and $rootScope.$apply', () => {

        const findResultMock = jasmine.createSpyObj('findResult', ['css', 'removeAttr', 'offset']);
        findResultMock.offset = jasmine.createSpy('offset').and.returnValue({ top: 0, left: 0 });

        const elementMock = jasmine.createSpyObj('element', ['find', 'css', 'on', 'removeAttr']);
        elementMock.find.and.returnValue(findResultMock);
        elementMock.css.and.stub();
        elementMock.removeAttr.and.stub();

        let onCallback;
        elementMock.on.and.callFake((event, cb) => { onCallback = cb; });

        // @ts-expect-error: mock para test, ignora tipos de JQLite/JQuery
        spyOn(window.angular, 'element').and.callFake(() =>
            ({
                css: jasmine.createSpy('css'),
                removeAttr: jasmine.createSpy('removeAttr'),
                offset: ((...args) => ({ top: 0, left: 0 })),
                scrollTop: jasmine.createSpy('scrollTop')
            } as any)
        );

        const doneMock = jasmine.createSpy('done');

        const applySpy = jasmine.createSpy('$apply');
        $rootScope.$apply = applySpy;

        animationInstance.enter(elementMock, doneMock);

        expect(typeof onCallback).toBe('function');
        onCallback();

        expect(applySpy).toHaveBeenCalled();
        const applyArg = applySpy.calls.mostRecent().args[0];
        expect(typeof applyArg).toBe('function');
        applyArg();
    });
});