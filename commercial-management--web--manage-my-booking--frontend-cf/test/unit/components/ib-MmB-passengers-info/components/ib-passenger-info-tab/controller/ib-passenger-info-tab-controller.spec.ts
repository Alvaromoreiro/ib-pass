describe('PassengerInfoTabController test', () => {
    var scope, controller, timeout;

    var ctrlBinds = {
        'passengersTabModel': 'test',
        'companies': {},
        'indexTab': {},
        'optionalInformation': {},
        'passengerInformation': {}
    };


    beforeEach(() => {
        angular.mock.module('ib-passenger-info-tab-module');
        inject(function ($componentController, $rootScope, $timeout) {
            scope = $rootScope.$new();
            timeout = $timeout;
            controller = $componentController('ibPassengerInfoTab', {
                $scope: scope,
                $timeout: timeout
            }, ctrlBinds);
            
        });
        controller.$onInit();
    });

    it('When activate() is called', (done) => {
        controller.updateScrollbar = angular.noop;
        scope.$digest();
        timeout.flush();
        expect(controller.originalData).toEqual('test');
        done();
    });

    it('When updateIndexTab() is called, should emit event', (done) => {
        var event = {
            type: 'click',
            preventDefault: () => { }
        };
        controller.updateScrollbar = angular.noop;
        scope.$broadcast('updateIndexTab', {}, {});
        controller.updateIndexTab(event, 1);
        done();
    });
});