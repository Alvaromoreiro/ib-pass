describe('BookingSegmentDetailsInfoController Test', function () {
    var scope, controller;



    beforeEach(function () {
        
        angular.mock.module('ib-booking-segment-details-info-module', function ($provide) {
        });

        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();

            controller = $controller('BookingSegmentDetailsInfoController', {
                '$scope': scope
            });

            scope.$digest();
        });

    });

    describe('When closeDetailsInfo is called', function () {
        it(' showDetailsInfo is emmited with false', function (done) {

            spyOn(scope, '$emit');

            controller.closeDetailsInfo();

            expect(scope.$emit).toHaveBeenCalledWith('showDetailsInfo', false);
            done();
        });
    });

});