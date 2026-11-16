describe('ibDropdownSelectController Test', () => {
    let controller, $controller, $timeout;

    let fakelistFlightFilter = [
        { name: 'Ordenar por precio' },
        { name: 'Ordenar por salida' },
        { name: 'Ordenar por tarifa' },
        { name: 'Ordenar por escalas' }
    ];
    beforeEach(() => {
        angular.mock.module('ib-dropdown-select')
    });

beforeEach(inject((_$controller_, _$timeout_) => {
    $controller = _$controller_;
    $timeout = _$timeout_;
    controller = $controller('ibDropdownSelectController', {
        $timeout: $timeout
    });
}));

    describe('When ibDropdownSelectController is called', () => {
        it('Check if controller is active', () => {
            expect(controller.listFlightFilter).toEqual(fakelistFlightFilter);
        });

        it('Check if clickListFlightFilter is called', () => {
            let fakeItem = 'test';
            let e = jasmine.createSpyObj('e', ['preventDefault']);
            controller.clickListFlightFilter(fakeItem, e);
            expect(e.preventDefault).toHaveBeenCalled();
        });

        it('Check if clickHoursFilter is called', () => {
            let fakeItem = 'test';
            let e = jasmine.createSpyObj('e', ['preventDefault']);
            controller.clickHoursFilter(fakeItem, e);
            expect(e.preventDefault).toHaveBeenCalled();
        });

        it('Check if clickListFlightFilter2 is called', () => {
            let fakeItem = 'test';
            let e = jasmine.createSpyObj('e', ['preventDefault']);
            controller.clickListFlightFilter2(fakeItem, e);
            expect(e.preventDefault).toHaveBeenCalled();
        });

        it('Check if clickListFareDetail is called', () => {
            let fakeItem = 'test';
            let e = jasmine.createSpyObj('e', ['preventDefault']);
            controller.clickListFareDetail(fakeItem, e);
            expect(e.preventDefault).toHaveBeenCalled();
        });

        it('Check if clickUsers is called', () => {
            let fakeItem = 'test';
            let e = jasmine.createSpyObj('e', ['preventDefault']);
            controller.clickUsers(fakeItem, e);
            expect(e.preventDefault).toHaveBeenCalled();
        });

        it('Should clickListFlightFilterVC is called', (done) => {
            controller.clickListFlightFilterVC('test');
            $timeout.flush();
            expect(controller.selectedListFlightFilterVC).toEqual('test');
            done();
        });
         
    });
});
