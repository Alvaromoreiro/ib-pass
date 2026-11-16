describe('IbBookingCollapseController', () =>{
    let scope, controller, timeout, window;
    let controllerDependencies = {
        $scope : {},
    };
    const fakeEvent = {
        preventDefault: jasmine.createSpy()
      };
    let fakePrevent;

    beforeEach(() =>{
        angular.mock.module('ib-booking-collapse-module', () => {});
        inject((_$controller_, _$rootScope_, _$timeout_, _$window_) => {
            scope = _$rootScope_.$new();
            controllerDependencies.$scope = scope;
            controller = _$controller_('IbBookingCollapseController', controllerDependencies);
            timeout = _$timeout_;
            window = _$window_;
            scope.$digest();
        });
    });

    describe('When controller is called', () => {
        it('it will be defined', () =>{
            expect(controller).toBeDefined();
        });
    })

    describe('When clickCollapse is called', () => {

        it('it will set isCollapsed to true value', () => {
            expect(controller.isCollapsed).toBeFalse();
            controller.clickCollapse(fakeEvent, fakePrevent);
            expect(controller.isCollapsed).toBeTrue()
            expect(fakeEvent.preventDefault).toHaveBeenCalled();
        });
    })

    describe('When clickDetails is called', () => {
        it('it will set showDetails to true value', () => {
            expect(controller.showDetails).toBeFalse();
            controller.clickDetails(fakeEvent, fakePrevent);
            expect(controller.showDetails).toBeTrue();
        })

    })
    describe('When initCollapse is called', () => {
        it('it will set closedText and Text with 1st param and openText with 2nd param', () => {
            let fakeParam1 = 'test1';
            let fakeParam2 = 'test2';
            expect(controller.closedText).toEqual('');
            expect(controller.text).toEqual('');
            expect(controller.openedText).toEqual('');
            controller.initCollapse(fakeParam1, fakeParam2);
            expect(controller.closedText).toEqual('test1');
            expect(controller.text).toEqual('test1');
            expect(controller.openedText).toEqual('test2');
        })
    })
    describe('When externalChangeText is called', () => {
        it('it will set closedText and Text with 1st param when isCollapse is false', () => {
            let fakeParam1 = 'test1';
            controller.isCollapsed = false;
            expect(controller.closedText).toEqual('');
            expect(controller.text).toEqual('');
            controller.externalChangeText(fakeParam1);
            expect(controller.closedText).toEqual('test1');
            expect(controller.text).toEqual('test1');
        })
        it('it will set closedText and Text with 1st param when isCollapse is true', () => {
            let fakeParam1 = 'test1';
            controller.isCollapsed = true;
            expect(controller.closedText).toEqual('');
            expect(controller.text).toEqual('');
            controller.externalChangeText(fakeParam1);
            expect(controller.closedText).toEqual('test1');
            expect(controller.text).toEqual('');
        })
    })

    describe('When toggle is called', () => {
        it('it will set isCollapsed == true and text == openedText when init == false', () => {
            controller.isCollapsed = false;
            controller.init = false;
            controller.openedText = 'test'
            controller.toggle();
            expect(controller.isCollapsed).toBeTrue();
            expect(controller.text).toEqual('test');
        });

        it('it ill set isCollapse == false and text == closedText when init == false', () => {
            controller.isCollapsed = true;
            controller.init = false;
            controller.closedText = 'test';
            controller.toggle();
            expect(controller.isCollapsed).toBeFalse();
            expect(controller.text).toMatch('test');
        })

        it('it will set isCollapsed == true and text == openedText and init = false when init == true', () => {
            controller.isCollapsed = false;
            controller.openedText = 'test'
            controller.toggle();
            timeout.flush(400);
            expect(controller.isCollapsed).toEqual(true);
            expect(controller.text).toEqual('test');

        });

        it('it will set isCollapsed == false and text == closedText and init = false when init == true', () => {
            controller.isCollapsed = true;
            controller.closedText = 'test'
            controller.toggle();
            timeout.flush(400);
            expect(controller.isCollapsed).toEqual(false);
            expect(controller.text).toEqual('test');

        });
    })
})
