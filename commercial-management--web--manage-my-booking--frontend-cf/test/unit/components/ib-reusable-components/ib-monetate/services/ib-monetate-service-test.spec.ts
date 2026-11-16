describe('MonetateService Test', function () {
    var MonetateService, window, localStorageService;

    var fakeMonetateConstants = {
        MONETATE_INFO: {
            SETPAGETYPE: 'setPageType',
            CUSTOMVARS: 'setCustomVariables',
            TRACKDATA: 'trackData'
        },
        FUNCTIONS: {
            ADDCARTROWS: 'addCartRows',
            ADDPURCHASEROWS: 'addPurchaseRows',
            ADDPRODUCTDETAILS: 'addProductDetails'
        },
        TRACK_PLACE: {
            CART: 'cart',
            PURCHASE: 'purchase'
        }
    };

    var fakeWindow = {
        monetateQ: [],
        datalayer_general: {
            quadrigam: 'test'
        },
        digital_data: {
            Quadrigam: 'test'
        }
    };

    beforeEach(function () {
        angular.mock.module('ib-monetate-module', 'LocalStorageModule', function ($provide) {
            $provide.value('MonetateConstants', fakeMonetateConstants);
            $provide.value('$window', fakeWindow);
        });
        inject(function (_MonetateService_, $window, _localStorageService_) {
            MonetateService = _MonetateService_;
            window = $window;
            localStorageService = _localStorageService_;
        });
    });

    describe('When initMonetate() is called', function () {
        it('It must Initializes the monetateQ', function (done) {
            window.monetateQ = [];
            MonetateService.initMonetate();
            expect(MonetateService.monetateQ).toEqual([]);
            done();
        });
    });

    describe('When checkMonetateQ() is called', function () {
        it('It must return true', function (done) {
            expect(MonetateService.checkMonetateQ()).toBe(true);
            done();
        });
    });

    describe('When addMonetatePageType() is called', function () {
        it('It must extends the current monetate information with the page type', function (done) {
            window.monetateQ = [];
            MonetateService.addMonetatePageType({ TEST: 'test'});
            expect(window.monetateQ).toEqual([{ TEST: 'test' }]);
            done();
        });
    });

    describe('When addMonetateGeneralInfo() is called', function () {
        it('It must extends the current monetate information with the extendObj object', function (done) {
            window.monetateQ = [];
            MonetateService.addMonetateGeneralInfo({ TEST2: 'test2'});
            expect(window.monetateQ).toEqual([{ TEST2: 'test2'}]);
            done();
        });
    });

    describe('When sendUpdateToMonetate() is called', function () {
        it('It must sends an event with the current monetateQ info', function (done) {
            window.monetateQ = [];
            MonetateService.sendUpdateToMonetate();
            expect(window.monetateQ).toEqual([[ 'setPageType', 'test' ], [ 'trackData' ]]);
            done();
        });
    });

    describe('When sendUpdateToMonetateWithDigitalData() is called', function () {
        it('It must sends an event with the current monetateQ info', function (done) {
            window.monetateQ = [];
            MonetateService.sendUpdateToMonetateWithDigitalData();
            expect(window.monetateQ).toEqual([[ 'setPageType', 'test' ], [ 'trackData' ]]);
            done();
        });
    });

    describe('When sendMonetatePageType() is called', function () {
        it('It must initialize $window.monetateQ', function (done) {
            window.monetateQ = [];
            MonetateService.sendMonetatePageType();
            expect(window.monetateQ).toEqual([[ 'setPageType', false], [ 'trackData' ]]);
            done();
        });
    });

    describe('When getMonetateGeneral() is called', function () {
        it('It must return the correct monetateQ', function (done) {
            expect(MonetateService.getMonetateGeneral()).not.toBeDefined();
            done();
        });
    });

    describe('When trackAncillariesProductsAdded() is called', function () {
        it('It must return the correct monetateQ', function (done) {
            window.monetateQ = [];
            MonetateService.trackAncillariesProductsAdded([{ purchaseId: 'id1' }], 'purchase');
            expect(window.monetateQ[0]).toEqual(['addPurchaseRows', [{ purchaseId: 'id1' }]]);
            done();
        });
    });

    describe('When addProductDetails() is called', function () {
        it('It must update an substute the string that identifies the main product  of the flow', function (done) {
            window.monetateQ = [];
            MonetateService.addProductDetails(['test']);
            expect(window.monetateQ).toEqual([[ 'addProductDetails', ['test']]]);
            done();
        });
    });
});
