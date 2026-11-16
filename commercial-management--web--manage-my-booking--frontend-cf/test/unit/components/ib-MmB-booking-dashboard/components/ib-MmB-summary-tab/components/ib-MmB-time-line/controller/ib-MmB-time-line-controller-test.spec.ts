describe('TimeLineController test', function () {

    let $rootScope, $scope, controller;

    beforeEach(function () {
        angular.mock.module('ib-MmB-time-line-module', 'LocalStorageModule');
        inject(function (_$controller_, _$rootScope_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = _$controller_('TimeLineController', {
                $scope: $scope,
                $rootScope: $rootScope,
            });
            controller.$onInit();
        });
    });

    describe('when activate is called', function () {
        it('Its called correctly', function (done) {
            expect(controller.$onInit).toBeDefined();
            done();
        })
    })

});