describe('BookingDashboardTransformer Test', function () {
    var scope, rootScope, transformer, result;

    beforeEach(function () {
        angular.mock.module('ib-MmB-change-flights-service',  function () {
        });
        inject(function (_$rootScope_, _ChangeFlightsTransformer_) {
            rootScope = _$rootScope_;
            transformer = _ChangeFlightsTransformer_;
            scope = rootScope.$new();
        });
        rootScope.$digest();
    });

    describe('when ChangeFlightsTransformer is called', function () {
        it('and Call transformBlackOutPeriods with response', function (done) {
            var response = {
                blackoutPeriods:[],
                allowedPeriods:[
                    {
                        dateTo: '12-06-1994',
                        dateFrom: '12-09-1994',
                        type: 'BLACKOUT'
                    }
                ]
            };
            result = transformer.transformBlackOutPeriods(response);
            expect(result).toBeDefined();
            done();
        });

        it('must return transformedData when response have more than one allowedPeriods', function (done) {
            var response = {
                blackoutPeriods: [
                    {
                        dateTo: '12-06-1994',
                        dateFrom: '12-09-1994',
                        type: 'BLACKOUT'
                    }
                ],
                allowedPeriods: [
                    {
                        dateTo: '12-06-1994',
                        dateFrom: '12-09-1994',
                        type: 'BLACKOUT'
                    },
                    {
                        dateTo: '12-06-1995',
                        dateFrom: '12-09-1995',
                        type: 'BLACKOUT2'
                    }
                ]
            };
            result = transformer.transformBlackOutPeriods(response);
            expect(result).toBeDefined();
            done();
        });
    });
});
