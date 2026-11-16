import angular from 'angular';
import { fakeModelMock, fakeModelExpected, fakeModelExpected2, fakeModelExpected3, fakeModel2Mock, fakeModel3Mock, fakemodelOrder1, fakemodelOrder2, fakemodelOrder3, fakemodelOrder4, fakemodelOrder5, fakemodelOrder6, expectedOutputOrder1,expectedOutputOrder1reverse,expectedOutputOrder2, expectedOutputOrder2reverse, expectedOutputOrder3, expectedOutputOrder3reverse, expectedOutputOrder3reverseLetter, expectedOutputOrder3reversePriceNumberNull, expectedOutputOrder3PriceNumberNull, expectedOutputOrder4, expectedOutputOrder4reverse, expectedOutputFilter, getDifferenceInDays, fakeAvailabilityModelTransformer} from '../mocks/ib-MmB-booking-availability-transformer.mock';


describe('AvailabilityTransformer test', () => {

    let result, localStorageService, $filter, $translate, AvailabilityTransformer;


    let fakeMmBUtilService = {
        'getCompanyLogo': jasmine.createSpy('getCompanyLogo').and.callFake(() => { }),
        'getFormatedDate': jasmine.createSpy('getFormatedDate').and.callFake(() => {
            return '';
        }),
        'isUserLogged': jasmine.createSpy('isUserLogged').and.callFake(() => {
            return false;
        }),
        
    };

    let faketranslate = {
        'onReady': jasmine.createSpy()
    };

    let mockTranslateFilter = () => {
        return 'test';
    };

    let fakemodel = fakeModelMock;

    let fakemodel2 = fakeModel2Mock;

    let fakemodel3 = fakeModel3Mock;

    let fakemodelFilter = require('../../../../ib-MmB-simulator-availability/cmpnts/ib-MmB-simulator-booking-availability/mocks/ib-MmB-simulator-booking-availability-transformer-modelFilter-mock.json');

    let fakeModelDataLayer = require('../../../../ib-MmB-simulator-availability/cmpnts/ib-MmB-simulator-booking-availability/mocks/ib-MmB-simulator-booking-availability-transformer-datalayer-mock.json');


    let fakeMmBAppConstants = {
        'QUADRIGAM': {
            'CHANGE_FLIGHTS_AVAILABILITY': 'ATCFPOW',
            'MANAGE_RESERV': 'IBMMBR'
        }
    };

    function getDifferenceInDays(departureDate, actualDate) {
        return Math.round((departureDate.getTime() - actualDate.getTime()) / (1000 * 60 * 60 * 24));
    };

    let fakeMmBUtilsSharedService = {
        getDifferenceInDays: getDifferenceInDays
    };

    beforeEach(async() => {
        angular.mock.module('ib-MmB-booking-availability-module', 'ib-MmB-filters-module', 'LocalStorageModule', function ($provide) {
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('$translate', faketranslate);
            $provide.value('translateFilter', mockTranslateFilter);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
        });
        inject(function ($rootScope, _AvailabilityTransformer_, _$filter_, _$translate_, _localStorageService_) {
            $rootScope = $rootScope;
            localStorageService = _localStorageService_;
            AvailabilityTransformer = _AvailabilityTransformer_;
            $filter = _$filter_;
            $translate = _$translate_;
        });
    });

    describe('when init()', () => {

        it('With model data and index equal 0 should return the model transformed correctly', () => {
            result = AvailabilityTransformer.init(fakemodel, 0);
            expect(result).toEqual(fakeModelExpected);
        });
        it('With model data and existCabineAvailable is false', () => {
            result = AvailabilityTransformer.init(fakemodel2, 0);
            expect(result).toEqual(fakeModelExpected2);
        });

        it('With model data, return and sorted true', () => {
            result = AvailabilityTransformer.init(fakemodel3, 1, true);
            expect(result).toEqual(fakeModelExpected3);
        });

    });

    describe('when getOrderSlices()', () => {

        it('With slice data and info with filter departure time and no reverse, should return the slice ordered correctly', () => {
            result = AvailabilityTransformer.getOrderSlices({ filterType: 'departureDateTime', reverse: false }, fakemodelOrder1);
            expect(angular.toJson(result)).toEqual(angular.toJson(expectedOutputOrder1));
        });

        it('With slice data and info with filter departure time and reverse, should return the slice ordered correctly', () => {
            result = AvailabilityTransformer.getOrderSlices({ filterType: 'departureDateTime', reverse: true }, fakemodelOrder1);
            expect(angular.toJson(result)).toEqual(angular.toJson(expectedOutputOrder1reverse));
        });

        it('With slice data and info with filter duration and no reverse, should return the slice ordered correctly', () => {
            result = AvailabilityTransformer.getOrderSlices({ filterType: 'duration', reverse: false }, fakemodelOrder5);
            expect(angular.toJson(result)).toEqual(angular.toJson(expectedOutputOrder4));
        });

        it('With slice data and info with filter duration and reverse, should return the slice ordered correctly', () => {
            result = AvailabilityTransformer.getOrderSlices({ filterType: 'duration', reverse: true }, fakemodelOrder6);
            expect(angular.toJson(result)).toEqual(angular.toJson(expectedOutputOrder4reverse));
        });

        it('With slice data and info with filter slicePrice and no reverse, should return the slice ordered correctly', () => {
            result = AvailabilityTransformer.getOrderSlices({ filterType: 'slicePrice', reverse: false }, fakemodelOrder2);
            expect(angular.toJson(result)).toEqual(angular.toJson(expectedOutputOrder3));
        });

        it('With slice data and info with filter slicePrice and reverse, should return the slice ordered correctly', () => {
            result = AvailabilityTransformer.getOrderSlices({ filterType: 'slicePrice', reverse: true }, fakemodelOrder2);
            expect(angular.toJson(result)).toEqual(angular.toJson(expectedOutputOrder3reverse));
        });


        it('With slice data and info with filter slicePrice and reverse with a cabin letter distint of posibilities, should return the slice ordered correctly', () => {
            result = AvailabilityTransformer.getOrderSlices({ filterType: 'slicePrice', reverse: true }, fakemodelOrder3);
            expect(angular.toJson(result)).toEqual(angular.toJson(expectedOutputOrder3reverseLetter));
        });

        it('With slice data and info with filter slicePrice and reverse with a cabin with priceNumber equal to null, should return the slice ordered correctly', () => {
            result = AvailabilityTransformer.getOrderSlices({ filterType: 'slicePrice', reverse: true }, fakemodelOrder4);
            expect(angular.toJson(result)).toEqual(angular.toJson(expectedOutputOrder3reversePriceNumberNull));
        });

        it('With slice data and info with filter slicePrice and no reverse with a cabin with priceNumber equal to null, should return the slice ordered correctly', () => {
            result = AvailabilityTransformer.getOrderSlices({ filterType: 'slicePrice', reverse: false }, fakemodelOrder4);
            expect(angular.toJson(result)).toEqual(angular.toJson(expectedOutputOrder3PriceNumberNull));
        });

    });

    xdescribe('when generateQuadrigam()', () => {

        it('and haveFlights with one way', () => {
            let model = {
                originDestinations: [{}]
            }
            result = AvailabilityTransformer.generateQuadrigam(true, model);
        });

        it('and haveFlights WITH_RETURN', () => {
            let model = {
                originDestinations: [{},{}],
                selectedSlice: [{},{}]
            }
            result = AvailabilityTransformer.generateQuadrigam(true, model);
        });
        it('and haveFlights WITH_RETURN_ONE_CHOOSE', () => {
            let model = {
                originDestinations: [{},{}],
                selectedSlice: [{}]
            }
            result = AvailabilityTransformer.generateQuadrigam(true, model);
        });
        it('and without haveFlights', () => {
            let model = {
                originDestinations: [{}]
            }
            result = AvailabilityTransformer.generateQuadrigam(true, model);
        });

    });

    describe('when getTotalPrice()', () => {

        it('With model containt relatedContent, should return the model correctly', () => {
            result = AvailabilityTransformer.getTotalPrice({ relatedContent: 'test', contextMetadata: 'test2' });
            expect(angular.toJson(result)).toEqual(angular.toJson({ contextMetadata: 'test2', relatedContent: 'test' }));
        });

        it('With model containt relatedContent, should return the model correctly', () => {
            result = AvailabilityTransformer.getTotalPrice({ contextMetadata: 'test2' });
            expect(angular.toJson(result)).toEqual(angular.toJson({ contextMetadata: 'test2' }));
        });

    });

    describe('when getModelfilter()', () => {
        it('should return the model correctly', () => {
            result = AvailabilityTransformer.getModelfilter(fakemodelFilter);
            expect(angular.toJson(result)).toEqual(angular.toJson(expectedOutputFilter));
        });
    });

    describe('when generateDataLayerAvailability is called', () => {
        it('should set datalayer correctly for a booking outbound', () => {
                    let model = angular.copy(fakeModelDataLayer);
                    let expected = {
                        'EstadoUsuario': 'no_logado',
                        'SearchCity': 'MAD',
                        'SearchCountry': 'ES',
                        'trayectoPais': 'ES,PT',
                        'trayectoBuscado': 'MAD,LIS',
                        'SearchDest': 'LIS',
                        'SearchOrigin': 'ES',
                        'origenBusqueda': 'es/ES/IBMMBR',
                        'numeroPax': '2',
                        'numeroNinios': '1',
                        'numeroBebes': '1',
                        'numeroAdultos': '1',
                        'NivelUsuario': 'INFINITA',
                        'FlightType': 'OW',
                        'antelacionCompra': (getDifferenceInDays(new Date(model[0].selectedSlice[0].date.serviceDate), new Date())).toString(),
                        'fecha': '12/20/2019',
                        'resultadosIda': '5'
                    };
                    localStorageService.remove('customerData');
                    localStorageService.remove('cvDatalayer');
                    model[0].modeFlight = 'outbound';

                    localStorageService.set('customerData', { 'generalInfo': { 'category': 'INFINITA' } });
                    AvailabilityTransformer.setAvailabilityModelTransformer(model);
                    AvailabilityTransformer.generateDataLayerAvailability();
                    expect(angular.toJson(localStorageService.get('cvDatalayer'))).toEqual(angular.toJson(expected));
        });
        it('should set datalayer correctly for a booking twice', () => {
            let model = angular.copy(fakeModelDataLayer);
            let expected = {
                'EstadoUsuario': 'no_logado',
                'SearchCity': 'MAD',
                'SearchCountry': 'ES',
                'trayectoPais': 'ES,PT',
                'trayectoBuscado': 'MAD,LIS',
                'SearchDest': 'LIS',
                'SearchOrigin': 'ES',
                'origenBusqueda': 'es/ES/IBMMBR',
                'numeroPax': '2',
                'numeroNinios': '1',
                'numeroBebes': '1',
                'numeroAdultos': '1',
                'FlightType': 'RT',
                'fecha': '12/20/2019-12/20/2019',
                'antelacionCompra': (getDifferenceInDays(new Date(model[0].selectedSlice[0].date.serviceDate), new Date())).toString(),
                'estanciaDestino': '0',
                'resultadosIda': '5',
                'resultadosVuelta': '5'
            }
            localStorageService.remove('customerData');
            localStorageService.remove('cvDatalayer');

            AvailabilityTransformer.setAvailabilityModelTransformer(model);
            AvailabilityTransformer.generateDataLayerAvailability();
            expect(angular.toJson(localStorageService.get('cvDatalayer'))).toEqual(angular.toJson(expected));
        });
        it('should set datalayer correctly for a booking return', () => {
            let model = angular.copy(fakeModelDataLayer);
            let fakeDatalayerExpected = {
                'EstadoUsuario': 'no_logado',
                'SearchCity': 'MAD',
                'SearchCountry': 'ES',
                'trayectoPais': 'ES,PT',
                'trayectoBuscado': 'MAD,LIS',
                'SearchDest': 'LIS',
                'SearchOrigin': 'ES',
                'origenBusqueda': 'es/ES/IBMMBR',
                'numeroPax': '2',
                'numeroNinios': '1',
                'numeroBebes': '1',
                'numeroAdultos': '1',
                'FlightType': '',
                'fecha': '12/20/2019',
                'antelacionCompra': (getDifferenceInDays(new Date(model[0].selectedSlice[0].date.serviceDate), new Date())).toString(),
                'resultadosVuelta': '5'
            };
            model[0].modeFlight = 'return';
            model[1].modeFlight = 'return';
            localStorageService.remove('customerData');
            localStorageService.remove('cvDatalayer');

            localStorageService.set('isUnifiedFlow', false);
            AvailabilityTransformer.setAvailabilityModelTransformer(model);
            AvailabilityTransformer.generateDataLayerAvailability();
            expect(angular.toJson(localStorageService.get('cvDatalayer'))).toEqual(angular.toJson(fakeDatalayerExpected));
        });
        it('should set datalayer correctly for a booking return with isUnifiedFlow is true and unifiedOptionalData and unifiedOfferType', () => {
            let model = angular.copy(fakeModelDataLayer);
            let fakeDatalayerExpected = {
                'EstadoUsuario': 'no_logado',
                'SearchCity': 'MAD',
                'SearchCountry': 'ES',
                'trayectoPais': 'ES,PT',
                'trayectoBuscado': 'MAD,LIS',
                'SearchDest': 'LIS',
                'SearchOrigin': 'ES',
                'origenBusqueda': 'es/ES/IBMMBR',
                'numeroPax': '2',
                'numeroNinios': '1',
                'numeroBebes': '1',
                'numeroAdultos': '1',
                'FlightType': '',
                'fecha': '12/20/2019',
                'antelacionCompra': (getDifferenceInDays(new Date(model[0].selectedSlice[0].date.serviceDate), new Date())).toString(),
                'resultadosVuelta': '5'
            };
            model[0].modeFlight = 'return';
            model[1].modeFlight = 'return';
            localStorageService.remove('customerData');
            localStorageService.remove('cvDatalayer');

            localStorageService.set('isUnifiedFlow', true);
            localStorageService.set('unifiedOptionalData', true);
            localStorageService.set('unifiedOfferType', 'INVOLUNTARY_CHANGE');
            AvailabilityTransformer.setAvailabilityModelTransformer(model);
            AvailabilityTransformer.generateDataLayerAvailability();
            expect(angular.toJson(localStorageService.get('cvDatalayer'))).toEqual(angular.toJson(fakeDatalayerExpected));
        });
        it('should set datalayer correctly for a booking without data', () => {
            let model = [];
            localStorageService.remove('customerData');
            localStorageService.remove('cvDatalayer');
            AvailabilityTransformer.setAvailabilityModelTransformer(model);
            AvailabilityTransformer.generateDataLayerAvailability();
            expect(angular.toJson(localStorageService.get('cvDatalayer'))).toEqual(angular.toJson({ 'EstadoUsuario': 'no_logado' }));
        });
        it('should set datalayer correctly for a booking outbound with data without selectedSlice', () => {
            let model = [{ selectedSlice: [], originDestinations: [], modeFlight: 'outbound' }];
            localStorageService.remove('customerData');
            localStorageService.remove('cvDatalayer');
            AvailabilityTransformer.setAvailabilityModelTransformer(model);
            AvailabilityTransformer.generateDataLayerAvailability();
            expect(angular.toJson(localStorageService.get('cvDatalayer'))).toEqual(angular.toJson({ 'EstadoUsuario': 'no_logado', 'FlightType': 'OW' }));
        });
        it('should set datalayer correctly for a booking twice with data without selectedSlice', () => {
            let model = [{ selectedSlice: [], originDestinations: [], modeFlight: 'twice' }];
            localStorageService.remove('customerData');
            localStorageService.remove('cvDatalayer');
            AvailabilityTransformer.setAvailabilityModelTransformer(model);
            AvailabilityTransformer.generateDataLayerAvailability();
            expect(angular.toJson(localStorageService.get('cvDatalayer'))).toEqual(angular.toJson({ 'EstadoUsuario': 'no_logado', 'FlightType': 'RT' }));
        });
        it('should set datalayer correctly for a booking twice with only one flight', () => {
            let model = fakeAvailabilityModelTransformer;
            localStorageService.remove('customerData');
            localStorageService.remove('cvDatalayer');
            AvailabilityTransformer.setAvailabilityModelTransformer(model);
            AvailabilityTransformer.generateDataLayerAvailability();
            expect(angular.toJson(localStorageService.get('cvDatalayer'))).toEqual(angular.toJson({"EstadoUsuario":"no_logado","SearchCity":"MAD","SearchCountry":"ES","trayectoPais":"ES,PT","trayectoBuscado":"MAD,LIS","SearchDest":"LIS","SearchOrigin":"ES","origenBusqueda":"es/ES/IBMMBR","numeroPax":"2","numeroNinios":"1","numeroBebes":"1","numeroAdultos":"1","FlightType":"RT","fecha":"12/20/2019-12/20/2019",'antelacionCompra': (getDifferenceInDays(new Date(model[0].selectedSlice[0].date.serviceDate), new Date())).toString(),"estanciaDestino":"0","resultadosIda":"1","resultadosVuelta":"1"}));
        });
        it('should set datalayer correctly for a booking with logged', (done) => {
            fakeMmBUtilService.isUserLogged = jasmine.createSpy('isUserLogged').and.callFake(() => {
                return true;
            });
            let model = [{ selectedSlice: [], originDestinations: [], modeFlight: 'twice' }];

            localStorageService.remove('customerData');
            localStorageService.remove('cvDatalayer');
            AvailabilityTransformer.setAvailabilityModelTransformer(model);
            AvailabilityTransformer.generateDataLayerAvailability();
            expect(angular.toJson(localStorageService.get('cvDatalayer'))).toEqual(angular.toJson({ 'EstadoUsuario': 'logado', 'FlightType': 'RT' }));
            done();
        });
        afterEach(() => {
            localStorageService.set('isUnifiedFlow', false);
            localStorageService.remove('unifiedOptionalData');
            localStorageService.remove('unifiedOfferType');
            fakeMmBUtilService.isUserLogged = jasmine.createSpy('isUserLogged').and.callFake(() => {
                return false;
            });
        });
    });

    describe('when resetData() is called', () => {
        it('should all param', () => {
            AvailabilityTransformer.resetData('all');
            expect(AvailabilityTransformer.availabilityModelTransformer).toEqual([]);
        });
        it('should other param', () => {
            AvailabilityTransformer.availabilityModelTransformer = ['testA', 'testB']
            AvailabilityTransformer.resetData('test');
            expect(AvailabilityTransformer.availabilityModelTransformer).toEqual(['testA']);
        });
    });
});
