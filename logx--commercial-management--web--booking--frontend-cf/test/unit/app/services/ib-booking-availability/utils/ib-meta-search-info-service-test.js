describe('IbMetaSearchInfoService Test', () => {
    let IbMetaSearchInfoService, localStorageService, rootScope;
    const mockAvailability = require('./../../../../../mocks/Responses/meta-search/MetaSearchExtendedDirectModifiedRequestResponse-mock.json');
    const metaSearchInfoData = require('./../../../../../mocks/Responses/meta-search/MetaSearchInfoData-mock.json');
    const responseFaresFamilyInfo = require('./../../../../../mocks/Responses/meta-search/MetaSearchFaresArray-mock.json');
    const responseOffers = require('./../../../../../mocks/Responses/meta-search/MetaSearchOfferInfoRecommended-mock.json');
    const responseWarningMessage = require('./../../../../../mocks/Responses/meta-search/MetaSearchReturnedWarnings-mock.json');
    const responseCabin = require('./../../../../../mocks/Responses/meta-search/MetaSearchCompatibleOffersWithCabins-mock.json');
    const mockResponseGenerateInfoCabin = {
        cabin: responseCabin,
        cabinTypeAssigned: 'E'
    }
    const fakeCurrencyService = {
        formatPrice: jasmine.createSpy().and.callFake(() => {
            return '172,32 €';
        }),
        getCurrencyObject: jasmine.createSpy().and.callFake(() => {
            return { alignment: 'R', code: 'EUR', decimalSeparator: ',', decimals: 2, description: 'Euro', groupingSeparator: '.', recommendedDisplay: 'symbol', symbol: '€' };
        })
    };
    const fakeIbBookingAvailabilityUtilsService = {
        getOfferInfoRecommended: jasmine.createSpy().and.callFake(() => {
            return responseOffers;
        }),
        generateSegmentWarningMessage: jasmine.createSpy().and.callFake(() => {
            return responseWarningMessage;
        }),
    };
    const fakeIbMetaSearchInfoServiceUtils = {
        generateInfoCabin: jasmine.createSpy().and.callFake(() => {
            return mockResponseGenerateInfoCabin;
        }),
        getFaresFamilyInfo: jasmine.createSpy().and.callFake(() => {
            return responseFaresFamilyInfo;
        })
    };
    const fakeBookingAvailabilityConstants = {
        ONE_DAY_MILISECONDS: 1000 * 60 * 60 * 24
    };
    const fakeBookingUtilService = {
        getCompanyURL: jasmine.createSpy().and.callFake(() => {
            return '/aerolineas/logo_pos_IB.svg';
        }),
        getFormatedDate: jasmine.createSpy().and.callFake( () => {
            return { 'formatedDate': '10/10/2020', 'dateFormatByLanguage': '10/10/2020' }
        })
    };
    const fakeLodash = {
        cloneDeep: jasmine.createSpy().and.callFake( (copy) => {
            return copy;
        }),
        merge: jasmine.createSpy().and.callFake( (copy) => {
            return copy;
        })
    };
    beforeEach(() => {
        angular.mock.module('ib-booking-availability-module', 'LocalStorageModule','ib-commons-utils-module','ib-booking-filters-module', ($provide) => {
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('IbBookingAvailabilityUtilsService', fakeIbBookingAvailabilityUtilsService);
            $provide.value('IbMetaSearchInfoServiceUtils', fakeIbMetaSearchInfoServiceUtils);
            $provide.value('BookingAvailabilityConstants', fakeBookingAvailabilityConstants);
            $provide.value('BookingUtilService', fakeBookingUtilService);
            $provide.value('lodash', fakeLodash);
        });
        inject((_IbMetaSearchInfoService_, $rootScope, _localStorageService_, $filter) => {
            IbMetaSearchInfoService = _IbMetaSearchInfoService_;
            localStorageService = _localStorageService_;
            rootScope = $rootScope;
        });
    });
    describe('When IbMetaSearchInfoService', () => {
        describe('and createInfoMetaSearch is called', () => {
            beforeEach(() => {
            });
            it(' transform return correctly info cabin', (done) => {
                const response = IbMetaSearchInfoService.createInfoMetaSearch(mockAvailability);
                expect(response.flightMetaSearch).toEqual(metaSearchInfoData.flightMetaSearch);
                expect(response.originDestination.length).toEqual(metaSearchInfoData.originDestination.length);
                expect(response.slicesInfo.length).toEqual(metaSearchInfoData.slicesInfo.length);
                done();
            });
        });
    });
});
