describe('MonetateUtilsService Test', function () {
    var MonetateUtilsService, window, localStorageService, $rootScope;

    var fakeMonetateService = {
        initMonetate: jasmine.createSpy(),
        addMonetateGeneralInfo: jasmine.createSpy(),
        addMonetatePageType: jasmine.createSpy(),
        sendUpdateToMonetate: jasmine.createSpy(),
        sendMonetatePageType: jasmine.createSpy(),
        trackAncillariesProductsAdded: jasmine.createSpy(),
        addProductDetails: jasmine.createSpy(),
        sendUpdateToMonetateWithDigitalData: jasmine.createSpy()
    };

    var fakeWindow = {
        monetateQ: [],
        datalayer_general: {
            quadrigam: 'test'
        },
        digital_data: {
            quadrigam: 'test'
        },
        datalayer_ecommerce: {
            CURRENCY: 'currency',
            TRANSACTION: 'transaction',
            PRODUCTS: 'products',
            REVENUE: 'revenue',
            SHIPPING: 'shipping',
            TYPE_FLIGHT: 'flight'
        }
    };

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

    var fakeMonetateTransformer = {
        transformAncillariesInMonetateProductModel: jasmine.createSpy(),
        transformPassengersInMonetateProductModel: jasmine.createSpy(),
        transformCabinInMonetateProductModel: jasmine.createSpy(),
        transformFareDataInProductModel: jasmine.createSpy(),
        transformDestinationAreasCitiesListInProductModel: jasmine.createSpy(),
        transformPurchasedInfoInProductModel: jasmine.createSpy(),
        transformOriginDestinationInfoIntoTripType: jasmine.createSpy(),
        transformFlightRouteProductDetail: jasmine.createSpy(),
        transformSelectedOfferInProductModel: jasmine.createSpy()
    };

    beforeEach(function () {
        angular.mock.module('ib-monetate-module', 'LocalStorageModule', function ($provide) {
            $provide.value('MonetateService', fakeMonetateService);
            $provide.value('$window', fakeWindow);
            $provide.value('MonetateConstants', fakeMonetateConstants);
            $provide.value('MonetateTransformer', fakeMonetateTransformer);
        });
        inject(function (_MonetateUtilsService_, $window, _localStorageService_, _$rootScope_) {
            MonetateUtilsService = _MonetateUtilsService_;
            window = $window;
            localStorageService = _localStorageService_;
            $rootScope = _$rootScope_;
        });
    });

    describe('When initializeMonetate() is called', function () {
        it('It must call initMonetate()', function (done) {
            MonetateUtilsService.initializeMonetate();
            expect(fakeMonetateService.initMonetate).toHaveBeenCalled();
            done();
        });
    });

    describe('When addMonetateInfo() is called', function () {
        it('It must call addMonetateGeneralInfo() when monetateInfo is an array', function (done) {
            MonetateUtilsService.addMonetateInfo(['test']);
            expect(fakeMonetateService.addMonetateGeneralInfo).toHaveBeenCalledWith(['test']);
            done();
        });
    });

    describe('When updateMonetateWithQuadrigam() is called', function () {
        it('It extends monetateQ object with the quadrigam info and the extended info given', function (done) {
            MonetateUtilsService.updateMonetateWithQuadrigam('type1', 'q1', { test: 'test' });
            expect(fakeMonetateService.addMonetateGeneralInfo).toHaveBeenCalled();
            done();
        });
    });

    describe('When updateMonetateWithPageType() is called', function () {
        it('It extends monetateQ object with the quadrigam info and the extended info given', function (done) {
            MonetateUtilsService.updateMonetateWithPageType('type1', 'q1', { test: 'test' });
            expect(fakeMonetateService.addMonetatePageType).toHaveBeenCalled();
            done();
        });
    });

    describe('When updateMonetateInfo() is called', function () {
        it('It must call sendUpdateToMonetate()', function (done) {
            MonetateUtilsService.sendUpdateToMonetate();
            expect(fakeMonetateService.sendUpdateToMonetateWithDigitalData).toHaveBeenCalled();
            done();
        });
    });

    describe('When updatePageType() is called', function () {
        it('It must call sendUpdateToMonetate()', function (done) {
            MonetateUtilsService.updatePageType();
            expect(fakeMonetateService.sendMonetatePageType).toHaveBeenCalled();
            done();
        });
    });

    describe('When trackAncillariesProductsAdded() is called', function () {
        it('It must call trackAncillariesProductsAdded()', function (done) {
            MonetateUtilsService.trackAncillariesProductsAdded();
            expect(fakeMonetateService.trackAncillariesProductsAdded).toHaveBeenCalled();
            done();
        });
    });

    describe('When trackFlightPassengers() is called', function () {
        it('It must call transformPassengersInMonetateProductModel()', function (done) {
            MonetateUtilsService.trackFlightPassengers();
            expect(fakeMonetateService.trackAncillariesProductsAdded).toHaveBeenCalled();
            done();
        });
    });

    describe('When trackFlightCabin() is called', function () {
        it('It must call transformPassengersInMonetateProductModel()', function (done) {
            MonetateUtilsService.trackFlightCabin();
            expect(fakeMonetateService.trackAncillariesProductsAdded).toHaveBeenCalled();
            done();
        });
    });

    describe('When trackFareTypeSelected() is called', function () {
        it('It must call transformPassengersInMonetateProductModel()', function (done) {
            MonetateUtilsService.trackFareTypeSelected();
            expect(fakeMonetateService.trackAncillariesProductsAdded).toHaveBeenCalled();
            done();
        });
    });

    describe('When trackFlightDestination() is called', function () {
        it('It must call transformPassengersInMonetateProductModel()', function (done) {
            MonetateUtilsService.trackFlightDestination();
            expect(fakeMonetateService.trackAncillariesProductsAdded).toHaveBeenCalled();
            done();
        });
    });

    describe('When trackPurchasedProducts() is called', function () {
        it('It must call transformPassengersInMonetateProductModel()', function (done) {
            MonetateUtilsService.trackPurchasedProducts();
            expect(fakeMonetateService.trackAncillariesProductsAdded).toHaveBeenCalled();
            done();
        });
    });

    describe('When trackTripType() is called', function () {
        it('It must call transformPassengersInMonetateProductModel()', function (done) {
            MonetateUtilsService.trackTripType();
            expect(fakeMonetateService.trackAncillariesProductsAdded).toHaveBeenCalled();
            done();
        });
    });

    describe('When trackRouteProductDetails() is called', function () {
        it('It must call transformPassengersInMonetateProductModel()', function (done) {
            MonetateUtilsService.trackRouteProductDetails();
            expect(fakeMonetateService.addProductDetails).toHaveBeenCalled();
            done();
        });
    });

    describe('When trackSelectedSegments() is called', function () {
        it('It must call transformPassengersInMonetateProductModel()', function (done) {
            MonetateUtilsService.trackSelectedSegments();
            expect(fakeMonetateService.trackAncillariesProductsAdded).toHaveBeenCalled();
            done();
        });
    });
});
