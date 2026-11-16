describe('PriceMatrixCalendarController test', () => {

    let priceCalendarCtrl, scope;
    const priceMatrixData = {
        calendarGrid: {
            columns: [
                {
                    inboundDate: { year: 2017, monthNumber: 2, day: 3 }
                }
            ]
        }
    };
    const expectedEvent = { price: 20, inboundDate: 15, outboundDate: 3 };
    const fakeCurrencyService = {
        formatPriceWithoutSimbol: jasmine.createSpy('formatPriceWithoutSimbol').and.callFake(() => {
            return 'priceFormatted';
        }),
        formatPrice: jasmine.createSpy('formatPriceWithoutSimbol').and.callFake(() => {
            return 'priceFormatted';
        })
    };
    const BookingPriceMatrixTransformer = {
        getDateFormatted: function (inputDate) {
            return inputDate;
        }
    };

    beforeEach(() => {
        angular.mock.module('ib-price-matrix-calendar', ($provide) => {
            $provide.value('BookingPriceMatrixTransformer', BookingPriceMatrixTransformer);
            $provide.value('CurrencyService', fakeCurrencyService);
        });
        inject(($rootScope, $componentController) => {
            scope = $rootScope.$new();
            priceCalendarCtrl = $componentController('ibPriceMatrixCalendar', { $scope: scope }, { priceMatrixData: priceMatrixData });
        });
    });

    describe('When the user  selects a item and ', () =>{
        it('function selectItem must emit an event with the price,inboundDate and outboundDate', (done) => {
            spyOn(scope, '$emit');
            priceCalendarCtrl.selectItem(0, { year: 2017, monthNumber: 2, day: 15 }, 20);
            expect(scope.$emit).toHaveBeenCalledWith('cellSelected', expectedEvent);
            done();
        });
    });

    describe('When the matrix is initializaded and the function formatPrice must been called', () =>{
        it('with a large price', (done) => {
            const returnValue = priceCalendarCtrl.formatPrice('123456.23');
            expect(returnValue).toEqual('priceFormatted');
            done();
        });
        it('with a short price', (done) => {
            const returnValue = priceCalendarCtrl.formatPrice('123456');
            expect(returnValue).toEqual('priceFormatted');
            done();
        });
    });

    describe('When the matrix is initializaded and the function formatPrice must been called', () =>{
        it(' and have stringInput and newStringLength', (done) => {
            const returnValue = priceCalendarCtrl.formatString('Message Test', 3);
            expect(returnValue).toEqual('Mes');
            done();
        });
        it(' and dont have input', (done) => {
            const returnValue = priceCalendarCtrl.formatString();
            expect(returnValue).toEqual('');
            done();
        });
    });
    describe('When the matrix is initializaded and the function calculateLength must been called', () =>{
        it(' and have stringInput and newStringLength', (done) => {
            const returnValue = priceCalendarCtrl.calculateLength('123456.12');
            expect(returnValue).toEqual(6);
            done();
        });

    });


});
