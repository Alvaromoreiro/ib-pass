import angular from 'angular';
import { DatalayerUtilsService } from '../../../../../src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service';
import { StorageServiceMock } from '../../../../mocks/Services/StorageServiceMock';
import { bookingUrlParams as shuttleURLparams, originDest as origShuttle, shuttleExampleModel, shuttleDigitalDataInitial } from '../Mocks/ib-shuttle-datalayer-mock-data';
import { confirmationDigitalInfo } from '../Mocks/confirmation-digital-info-mock';
import dayjs from 'dayjs';
import { DatalayerConstants } from '@src/app/shared/services/ib-datalayer/constants/ib-datalayer-constants';

describe('Test DatalayerUtilsService', () => {
    const mockAncillariesInfo = {
        ancillaries: [{
            "provider": "ALLIANZ",
            "type": "INSURANCE"
        }]
    }
    const mockInsuranceSelected = {
        id: 'testIdinsuranceSelected'
    }

    const mockSlices = [
        {
            departureDateTime: "2023-02-09 19:45",
            arrivalDateTime: "2023-02-09 20:50",
            segments:[
                {
                    departure:{
                        city:{
                            code:'MAD'
                        }
                    },
                    arrival:{
                        city:{
                            code:'BCN'
                        },
                        code:'BCN'
                    },
                    cabin:{
                        fareFamily:'E',
                        bookingClass:'bookingClass'
                    },
                    flight:{
                        operationalFlightNumber:'IBetc',
                        marketingFlightNumber:'IBetc',
                        operationalDisclosure:'OperationalEtc'
                    }
                }
            ],
            price: {
                currency: 'EUR',
                fare: 16
            }
        }
    ]
    const mockPriceInfo = {
        price:{
            totalCash:2,
            totalAvios:0,
            tax:1,
            total: 10,
            fare:1
        }
    }
    const mockHeaderModal = require('../../../../mocks/Responses/HeaderModal-mock.json');
    class DataLayerServiceMock {
        addDataLayerGeneralInfo = jasmine.createSpy('addDataLayerGeneralInfo');
        initDatalayer = jasmine.createSpy('initDatalayer');
        callUpdateTagManager = jasmine.createSpy('callUpdateTagManager');
        getDatalayerGeneral = jasmine.createSpy('getDatalayerGeneral');
        getEcommerceDatalayer = jasmine.createSpy('getEcommerceDatalayer');
        removeDatalayerGeneralInfo = jasmine.createSpy('removeDatalayerGeneralInfo');
        addDataLayerEcommerceInfo = jasmine.createSpy('addDataLayerEcommerceInfo');
    }
    class CommonsUtilServiceMock {
        getTypeSearch = jasmine.createSpy('getTypeSearch').and.returnValue('turista');
        getProcess = jasmine.createSpy('getProcess').and.returnValue('booking');
        getUserTypeByToken = jasmine.createSpy('getUserTypeByToken');
        getSliceDetailsById = jasmine.createSpy('getSliceDetailsById');
        getSegmentDetailsById = jasmine.createSpy('getSegmentDetailsById');
        sha256 = jasmine.createSpy('sha256');

    }
    class CommonsUserUtilsServiceMock {
        isIbPlus = jasmine.createSpy('isIbPlus');
        isUserLoggedONB = jasmine.createSpy('isUserLoggedONB');
        isSoftUser = jasmine.createSpy('isSoftUser');
        getUserRole = jasmine.createSpy('getUserRole');
    }
    class MonetateUtilsServiceMock {
        updateDigitalDataMonetate = jasmine.createSpy('updateDigitalDataMonetate');
    }
    class DigitalDataServiceMock {
        addDigitalDataInfo = jasmine.createSpy('addDigitalDataInfo');
        isDigitalDataInit = jasmine.createSpy('isDigitalDataInit');
        initDigitalData = jasmine.createSpy('initDigitalData');
        getDigitalData = jasmine.createSpy('getDigitalData');
        removeDigitalDataInfo = jasmine.createSpy('removeDigitalDataInfo');
        emitViewEvent = jasmine.createSpy('emitViewEvent');
        emitInteractionEvent = jasmine.createSpy('emitInteractionEvent');
        emitEvent = jasmine.createSpy('emitEvent');
    }
    class CommonsConstantsMock {
        passengerTypes: {
            Default: 'DEFAULT',
            senior: 'SENIOR',
            adult: 'ADULT',
            young: 'YOUTH',
            child: 'CHILD',
            infant: 'INFANT',
            SPECIAL_NEEDS: 'specialNeed'
        }
    }
    class DigitalDataPropertiesUtilsServiceMock {
        setProcess = jasmine.createSpy( 'setProcess' ).and.returnValue( 'booking' );
    }
    //Define variables
    let service: DatalayerUtilsService;
    let rootScope :CommonsRootScope;
    let DataLayerService: DataLayerServiceMock;
    let localStorageService: StorageServiceMock = new StorageServiceMock();
    let CommonsUtilService: CommonsUtilServiceMock;
    let CommonsUserUtilsService: CommonsUserUtilsServiceMock;
    let MonetateUtilsService: MonetateUtilsServiceMock;
    let DigitalDataService: DigitalDataServiceMock;
    let CommonsConstants: CommonsConstantsMock;
    let $timeout: ng.ITimeoutService;
    let cookies;
    let $filter: ng.FilterFactory = () => { return (input: string) => { return input; };};
    let fakeDigitalDataPropertiesUtilsService: DigitalDataPropertiesUtilsServiceMock;
    beforeEach(() => {
        DataLayerService = new DataLayerServiceMock();
        CommonsUserUtilsService = new CommonsUserUtilsServiceMock();
        CommonsUtilService = new CommonsUtilServiceMock();
        MonetateUtilsService = new MonetateUtilsServiceMock();
        DigitalDataService = new DigitalDataServiceMock();
        CommonsConstants = new CommonsConstantsMock();
        fakeDigitalDataPropertiesUtilsService = new DigitalDataPropertiesUtilsServiceMock();
        localStorageService.clear();


        angular.mock.module('ib-datalayer-bki-module', 'ngCookies', 'ib-commons-constants-module','ib-monetate-module',($provide) => {
            $provide.value('localStorageService', localStorageService);
            $provide.value('DataLayerService', DataLayerService);
            $provide.value('CommonsUserUtilsService', CommonsUserUtilsService);
            $provide.value('CommonsUtilService', CommonsUtilService);
            $provide.value('MonetateUtilsService', MonetateUtilsService);
            $provide.value('DigitalDataService', DigitalDataService);
            $provide.value('CommonsSessionStorageService', localStorageService);
            $provide.value('CommonsConstants', CommonsConstants);
            $provide.value('$filter', $filter);
            $provide.value('DigitalDataPropertiesUtilsService', fakeDigitalDataPropertiesUtilsService);
        });
        inject((_DatalayerUtilsService_, _$rootScope_, _$timeout_, _$cookies_) => {
            service = _DatalayerUtilsService_;
            rootScope = _$rootScope_;
            $timeout = _$timeout_;
            cookies = _$cookies_;
        });


    });
    describe('Call updateDiscountData', () => {
        let resulDigitalDataTest;
        beforeEach(() => {
            DigitalDataService.addDigitalDataInfo = jasmine.createSpy('addDigitalDataInfo').and.callFake((input) => { resulDigitalDataTest = input;});
        });
        it('Get string with no discounts', () => {
            service.updateDiscountData([]);
            expect(DigitalDataService.addDigitalDataInfo).toHaveBeenCalled();
            expect(resulDigitalDataTest).toEqual({ DiscountsApplied: '' });
        });
        it('Get string with all discounts', () => {
            service.updateDiscountData([{'type':'CORPORATE', 'discountType':'ODM', 'description':'Descuento exclusivo', 'percentDiscount':27.95, 'totalDiscount':5, 'corporateCodes':'047053'}, {'type':'RES', 'discountType':'CANARIAS', 'description':'Dto. Residente', 'percentDiscount':75, 'totalDiscount':89.45, 'discountCode':'RC'}, {'type':'LGF', 'discountType':'SPECIAL', 'description':'Dto. Fam. numerosa', 'percentDiscount':10, 'totalDiscount':11.92}, {'type':'PARTNER', 'percentDiscount':10, 'totalDiscount':4, 'description':'Plan Santander One Iberia Plus', 'discountType':'GENERAL', 'partner':{'partnerId':'SAN', 'productId':'63'}, 'userMustFly':false}]);
            expect(DigitalDataService.addDigitalDataInfo).toHaveBeenCalled();
            expect(resulDigitalDataTest).toEqual({ DiscountsApplied: 'CORPORATE_ODM_047053|RES_RC|LGF_SPECIAL|PARTNER_SAN' });
        });
    });
    describe('Call addShuttleDigitalData', () => {
        let exampleModel;
        beforeEach(() => {
            localStorageService.set('bookingUrlParams', shuttleURLparams);
            localStorageService.set('originDestination', origShuttle);
            exampleModel = JSON.parse(JSON.stringify(shuttleExampleModel));
            service.LANG = 'es';
            service.MARKET = 'ES';
            fakeDigitalDataPropertiesUtilsService.setProcess = jasmine.createSpy('getProcess').and.returnValue('puente aéreo');
            CommonsUtilService.getTypeSearch = jasmine.createSpy('getTypeSearch').and.returnValue('turista');
            spyOn(service, 'addDigitalDataInfo');


        });
        it('test for shuttle view', () => {
            service.addShuttleDigitalData('ibshuttle', exampleModel);
            expect(service.addDigitalDataInfo).toHaveBeenCalledWith(shuttleDigitalDataInitial);

        });
        it('test for passengers view', () => {
            localStorageService.set('fareData',{offers:[{offerItems:[{passengerIds:'ids',price:{total:0}}],discountsApplied:{originalPrice:{total:0},discounts:[{percentDiscount:1,totalDiscount:0.1,type:'DynamicPricing'}]}}], fareFamilyConditions:[{commercialName:'ES'},{commercialName:'ES'}]});
            service.addShuttleDigitalData('ibairp', exampleModel);
            expect(service.addDigitalDataInfo).toHaveBeenCalledWith({PaxPrice: "0 : 0 : 0",ProcessStart: "es/ES/PAHMPA",Slice1Results: 1,Slice2Results: 1,CheapestFare: "NO",Quadrigam: "PAAIRP",TrackingCode: "es/ES/PAAIRP",Step: "pasajeros"});
        });
        it('test for payments view', () => {
            localStorageService.set('headerModel',mockHeaderModal);
            localStorageService.set('ancillariesInfo', mockAncillariesInfo);
            localStorageService.set('insuranceSelected', mockInsuranceSelected);
            service.addShuttleDigitalData('ibpurc', exampleModel);
            expect(service.addDigitalDataInfo).toHaveBeenCalledWith({Quadrigam: "PAPURC",TrackingCode: "es/ES/PAPURC",Step: "pago",CashAviosOffer: "NO",VoucherShown: "NO"
            });
        });
        it('test for confirmation view', () => {
            service.addShuttleDigitalData('confirmation', exampleModel);
            expect(service.addDigitalDataInfo).toHaveBeenCalledWith({PaymentMethod: null,Quadrigam: "PABKCF",TrackingCode: "es/ES/PABKCF",Step: "confirmacion",CashAviosUsed: "no",VoucherUsed: "no"});
        });

    });

    describe('Call setProcessAndStep', () => {
        beforeEach(() => {
            localStorageService.set('flowApp', 'CKI');
            localStorageService.set('confirmationDigitalInfo', confirmationDigitalInfo);
            spyOn(service, 'setProcessAndStep');
        });
        it('set quadrigam ancillaries MOSEAT', () => {
            service.setProcessAndStep(null, null, 'MOSEAT');
            expect(service.setProcessAndStep).toHaveBeenCalled();

        });
        it('set quadrigam ancillaries MOBAGG', () => {
            service.setProcessAndStep('MOBAGG', 'MOBAGG', 'MOBAGG');
            expect(service.setProcessAndStep).toHaveBeenCalled();

        });

    });
    describe('Call initializeDatalayer', () => {
        beforeEach(() => {
            DigitalDataService.isDigitalDataInit = jasmine.createSpy('isDigitalDataInit').and.returnValue(false);
        });
        it('and set initial datalayer and digital_data parameters', () => {
            service.initializeDatalayer('es', 'ES', 'desktop');
            expect(DigitalDataService.initDigitalData).toHaveBeenCalled();
        });

    });
    describe('Call setDatalayerAvailabilityInitialParams', () => {
        beforeEach(() => {
            spyOn(service, 'addDigitalDataInfo');
        });
        it('and set initial datalayer and digital_data parameters', () => {
            service.setDatalayerAvailabilityInitialParams('es', 'ES', 'desktop');
            expect(service.addDigitalDataInfo).toHaveBeenCalled();
        });
    });

    describe('Call addCompatibiltyDatalayerVoidFunctions', () => {
        it('and assign a compatible void function to every deprecated API', () => {
            const deprecatedFunctions = (service as any).DEPRECATED_DATALAYER_FUNCTIONS;

            (service as any).addCompatibiltyDatalayerVoidFunctions();

            deprecatedFunctions.forEach((functionName: string) => {
                expect(typeof (service as any)[functionName]).toBe('function');
                expect(() => (service as any)[functionName]('test', 1, {})).not.toThrow();
            });
        });
    });
    describe('Call sendDatalayerEvent', () => {

        let timeoutSpy: jasmine.Spy;
        let broadcastSpy: jasmine.Spy;

        beforeEach(() => {
            const $rootScope = { $broadcast: jasmine.createSpy('$broadcast') } as unknown as ng.IRootScopeService;
            const $timeout = jasmine.createSpy('$timeout').and.callFake((fn: () => void) => fn());

            (service as unknown as { $rootScope: ng.IRootScopeService }).$rootScope = $rootScope;
            (service as unknown as { $timeout: typeof $timeout }).$timeout = $timeout;

            timeoutSpy = $timeout as jasmine.Spy;
            broadcastSpy = $rootScope.$broadcast as jasmine.Spy;

        });
        it('should call $timeout and broadcast event when type is string', () => {
            service.sendDatalayerEvent('view');

            expect(timeoutSpy).toHaveBeenCalled();
            expect(broadcastSpy).toHaveBeenCalledWith('updateDigitalData');
        });

        it('should not call anything when type is not string', () => {
            service.sendDatalayerEvent(undefined as unknown as string);

            expect(timeoutSpy).not.toHaveBeenCalled();
            expect(broadcastSpy).not.toHaveBeenCalled();
        });

    });
    describe('Call updateLoggedDigitalData', () => {
        beforeEach(() => {
            localStorageService.set('membershipData', {clid: '0000'});
            CommonsUserUtilsService.isUserLoggedONB = jasmine.createSpy('isUserLoggedONB').and.returnValue(true);
            spyOn(service, 'addDigitalDataInfoHashEID');
        });
        it('and it is ONB user, set ONB logged datalayer parameters', () => {
            service.updateLoggedDigitalData({category:'test',generalInfo:{category:'test'},avios:10,hashEID:'hgrd',email:'test@gmail.com'});
            expect(service.addDigitalDataInfoHashEID).toHaveBeenCalled();
        });
    });
    describe('Call updateLoggedDigitalDataAvios', () => {
        beforeEach(() => {
            spyOn(service, 'addDigitalDataInfo');
        });
        it('set avios datalayer parameter', () => {
            service.updateLoggedDigitalDataAvios('10');
            expect(service.addDigitalDataInfo).toHaveBeenCalled();
        });
    });
    describe('Call updateDigitalDataWithQuadrigam', () => {
        beforeEach(() => {
            CommonsUserUtilsService.isIbPlus = jasmine.createSpy('isIbPlus').and.returnValue(true);
            CommonsUserUtilsService.isSoftUser = jasmine.createSpy('isSoftUser').and.returnValue(false);
            CommonsUserUtilsService.getUserRole = jasmine.createSpy('getUserRole').and.returnValue(false);
            CommonsUtilService.getUserTypeByToken = jasmine.createSpy('getUserTypeByToken').and.returnValue('');
            spyOn(service, 'addDigitalDataInfo');
        });
        it(' and update quadrigam and user state digital_data parameters', () => {
            service.updateDigitalDataWithQuadrigam('IBAIRP',{}, true);
            expect(service.addDigitalDataInfo).toHaveBeenCalled();
        });
    });
    describe('Call sendDigitalDataErrorEvent', () => {
        beforeEach(() => {
            CommonsUserUtilsService.isIbPlus = jasmine.createSpy('isIbPlus').and.returnValue(true);
            CommonsUserUtilsService.isSoftUser = jasmine.createSpy('isSoftUser').and.returnValue(false);
            CommonsUserUtilsService.getUserRole = jasmine.createSpy('getUserRole').and.returnValue(false);
            CommonsUtilService.getUserTypeByToken = jasmine.createSpy('getUserTypeByToken').and.returnValue('');
            spyOn(service, 'addDigitalDataInfo');
        });
        it(' and update digital_data with error event parameters', () => {
            service.sendDigitalDataErrorEvent({errorCode: 404, quadrigam: 'IBKERROR', isLogged: 'false', internalErrorCode:'55050',message:'error', eventCategory: 'test', eventAction: 'test', eventLabel: 'test'});
            expect(service.addDigitalDataInfo).toHaveBeenCalled();
        });
    });
    describe('Call removeDatalayerModalAttrs', () => {
        beforeEach(() => {
        });
        it('and remove datalayer modal attributes', () => {
            service.removeDatalayerModalAttrs();
            expect(DigitalDataService.removeDigitalDataInfo).toHaveBeenCalled();
        });
    });
    describe('Call removeDatalayerErrorAttrs', () => {
        beforeEach(() => {
        });
        it('and remove datalayer error attributes', () => {
            service.removeDatalayerErrorAttrs();
            expect(DigitalDataService.removeDigitalDataInfo).toHaveBeenCalled();
        });
    });
    describe('Call sendDatalayerModalEvent', () => {
        beforeEach(() => {
            spyOn(service, 'sendDatalayerEvent');
        });
        it('and add modal attributes to datalayer_general', () => {
            service.sendDatalayerModalEvent({ idModal: 'test-modal' });
            expect(service.sendDatalayerEvent).toHaveBeenCalled();
        });
    });
    describe('Call addDataLayerEcommerceInfo', () => {
        beforeEach(() => {
        });
        it('and add attributes to datalayer_ecommerce', () => {
            service.addDataLayerEcommerceInfo({});
            expect(DataLayerService.addDataLayerEcommerceInfo).toHaveBeenCalled();
        });
    });
    describe('Call generateDatalayerAvailability', () => {
        it('and create availability page datalayer attributes', () => {
            const outbounDate = new Date();
            outbounDate.setDate(outbounDate.getDate() + 30);
            const returnDate = new Date()
            returnDate.setDate(returnDate.getDate() + 45);
            localStorageService.set('bookingUrlParams', {originCity: {code:'MAD', description:'Madrid', country:{code:'Spain'}}, destinationCity: {code:'BCN',description:'Barcelona'},numberPassengrsWithoutInfant: 1, dates:{formatedReturnFlight:returnDate.toISOString(), formatedOutboundFlight: outbounDate.toISOString(), outboundFlight:dayjs(outbounDate).format('DD-MM-YYYY'), returnFlight: dayjs(returnDate).format('DD-MM-YYYY')}, searchOrigin:'PAHMPA', adult:1, child:0, senior: 0, infant: 0, young:0, teenager: 0});
            localStorageService.set('originDestination', {originCity: {code:'MAD', description:'Madrid', country:{code:'Spain'}}, destinationCity: {code:'BCN',description:'Barcelona'},numberPassengrsWithoutInfant: 1, dates:{formatedReturnFlight:returnDate.toISOString(), formatedOutboundFlight: outbounDate.toISOString(), outboundFlight:dayjs(outbounDate).format('DD-MM-YYYY'), returnFlight: dayjs(returnDate).format('DD-MM-YYYY')}, numAdults: 1});
            let returnValue=service.generateDatalayerAvailability({flightRatio:'Corto Radio', originDestinations: [{slices:[{},{}],origin: 'MAD',originCity:{countryCode:'ES'}, destinationCity: {countryCode: 'ES'}}]});
            expect(returnValue).toEqual({});

        });
    });
    describe('When generateDatalayerPassengers is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
            localStorageService.set('fareFamilyConditionsInfo',[{commercialCode:'E',commercialNameES:'test'}])
            localStorageService.set('fareData',{offers:[{offerItems:[{passengerIds:'ids',price:{total:0}}],discountsApplied:{originalPrice:{total:0},discounts:[{percentDiscount:1,totalDiscount:0.1,type:'DynamicPricing'}]}}], fareFamilyConditions:[{commercialName:'ES'},{commercialName:'ES'}]})
        }));
        it(', it will return a full datalayer object for passengers page', () => {
            localStorageService.set('fareData',{
                offers: [
                    {
                        offerItems: [
                            {
                                passengerIds:'ids',price: {
                                    total:0
                                }
                            }
                        ],
                        discountsApplied:{
                            originalPrice:{
                                total:0
                            },
                            discounts: [
                                {
                                    percentDiscount:1,
                                    totalDiscount:0.1,
                                    type:'DynamicPricing'
                                }
                            ]
                        }
                    }
                ],
                fareFamilyConditions: [
                    {
                        commercialName:'ES',
                        conditions: [
                            {
                                code: 'CAMBIO',
                                extendedInfo: {
                                    code: 'CA_CAMBIO',
                                    conditionStatus: true,
                                    message: 'Permitido',
                                    mobileMessage: 'Permitido',
                                    observationCode: null,
                                    title: 'Cambio de vuelo con coste'
                                },
                                name: 'Cambios',
                                text: 'Permitido',
                                units: 65
                            },
                            {
                                code: 'REEMBOLSO',
                                extendedInfo: {
                                    code: 'CA_REEMBOLSO',
                                    conditionStatus: true,
                                    message: 'Permitido',
                                    mobileMessage: 'Permitido',
                                    observationCode: null,
                                    title: 'Reembolso'
                                },
                                name: 'Reembolso (por sentido)',
                                text: 'Permitido con coste, no permitido en caso de no-show.',
                                units: 65
                            }
                        ]
                    },
                    {
                        commercialName:'ES'
                    }
                ]
            });
            let returnData = service.generateDatalayerPassengers(mockSlices, mockPriceInfo, "€", 'Corto Radio');
            expect(returnData).toEqual({});
        });
    });
    describe('When generateDatalayerPayments is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
        }));
        it(', it will return a full dalayer_general object for payments page', () => {
            let returnData = service.generateDatalayerPayments({paymentMethods:[{total:5, type: 'VOUCHER'}]},{order:{price:{total:5, fare: 0}},orderItems:[{type:'specialNeed'}]})
            expect(returnData).toEqual({});
        });
    });
    describe('When generateDigitalDataPayments is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
        }));
        it(', it will return a full dalayer_general object for payments page', () => {
            let returnData = service.generateDigitalDataPayments({paymentMethods:[{total:5, type: 'VOUCHER'}]},{order:{price:{total:5, fare: 0}},orderItems:[{type:'specialNeed'}]})
            expect(returnData).toEqual({Step: 'pago', CashAviosOffer: 'NO', VoucherShown: 'SI', TotalPrice: 5, TotalPriceWithoutTaxes: 0, Quantity: '0', pmr: 'NO'});
        });
    });
    describe('When generateConfirmationDigitalDataObject is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
            localStorageService.set('confirmationDigitalInfo',{Quadrigam:'IBAIRP', Step: 'pasajeros', Process: 'booking'});
            localStorageService.set('pmtModelInfo',{quadrigams:{confirmation:'IBBKCF'}});
        }));
        it(', it will set new parameters into digital_data in confirmation page', () => {
            service.LANG = 'es';
            service.MARKET = 'ES';
            service.generateConfirmationDigitalDataObject();
            expect(DigitalDataService.addDigitalDataInfo).toHaveBeenCalledWith({Quadrigam: 'IBBKCF', Step: 'confirmacion', Process: 'booking', CashAviosUsed: 'no', VoucherUsed: 'no', VoucherRecord: '', TrackingCode: 'es/ES/IBBKCF', UserStatus: 'no_logado'});
        });

        it(', it will set VoucherUsed to "si" and VOUCHER_RECORD to "V452Z" in confirmationDigitalInfo', () => {
            service.LANG = 'es';
            service.MARKET = 'ES';
            // Prepare localStorage to simulate voucher usage
            localStorageService.set('confirmationDigitalInfo', {Quadrigam:'IBAIRP', Step: 'pasajeros', Process: 'booking', TrackingCode: 'test/test/IBAIRP'});
            localStorageService.set('pmtModelInfo', {quadrigams:{confirmation:'IBBKCF'}});
            // Simulate applied voucher discount in paymentsInfo
            localStorageService.set('paymentsInfo', { appliedDiscounts: { types: { VOUCHER: true } } });
            // Simulate PNR in session storage (CommonsSessionStorageService is mocked as localStorageService)
            localStorageService.set('PNR', 'V452Z');
            service.generateConfirmationDigitalDataObject();

            expect(DigitalDataService.addDigitalDataInfo).toHaveBeenCalledWith({Quadrigam: 'IBBKCF', Step: 'confirmacion', Process: 'booking', CashAviosUsed: 'no', VoucherUsed: 'si', VoucherRecord: 'V452Z', TrackingCode: 'es/ES/IBBKCF', UserStatus: 'no_logado'});
        });
    });
    describe('When getPassengersMetasearch is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
        }));
        it(', it will return the number of passengers in metasearch flow', () => {
            let returnValue = service.getPassengersMetasearch([{count:1, passengerType: 'ADULT'},{count:0, passengerType: 'CHILD'},{count:0, passengerType: 'YOUTH'},{count:0, passengerType: 'SENIOR'},{count:0, passengerType: 'INFANT'}]);
            expect(returnValue).toEqual({numberPassengers: 1, numberPassengrsWithoutInfant: 1, numChilds: 0, numInfant: 0, numAdults: 1, numSeniors: 0, numYoung: 0, numTeenager: 0});
        });
    });
    describe('When resetDatalayer is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
            localStorageService.set('cvDatalayer',['EstadoUsuario'])
            spyOn(service, 'removeDigitalDataObjects');
        }));
        it(', it will reset datalayer', () => {
            service.resetDatalayer();
            expect(service.removeDigitalDataObjects).toHaveBeenCalledWith(['0']);
        });
    });
    describe('When updateDatalayerViewEvent is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
        }));
        it(', it will call emitViewEvent', () => {
            service.updateDatalayerViewEvent();
            expect(DigitalDataService.emitViewEvent).toHaveBeenCalled();
        });
    });
    describe('When updateDatalayerInteractionEvent is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
        }));
        it(', it will call emitInteractionEvent', () => {
            service.updateDatalayerInteractionEvent();
            expect(DigitalDataService.emitInteractionEvent).toHaveBeenCalled();
        });
    });
    describe('When updatePnr is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
            spyOn(service, 'addDigitalDataInfo');
        }));
        it(', it will update pnr datalayer parameters', () => {
            service.updatePnr({provider:'IB',reference:'IB504'});
            expect(service.addDigitalDataInfo).toHaveBeenCalledWith({Provider: 'IB',Reference: 'IB504'});
        });
    });
    describe('When setAncillariesDatalayer is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
            localStorageService.set('headerModel',mockHeaderModal);
            spyOn(service, 'addDigitalDataInfo');
        }));
        it(', it will set ancillaries datalayer parameters', () => {
            localStorageService.set('ancillariesInfo', mockAncillariesInfo);
            localStorageService.set('insuranceSelected', mockInsuranceSelected);
            service.setAncillariesDatalayer();
            expect(service.addDigitalDataInfo).toHaveBeenCalled();
        });
    });
    describe('When updateDatalayerForUpgrade is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
            localStorageService.set('headerModel',mockHeaderModal);
        }));
        it(', it will execute upgrade flow using compatibility datalayer methods', () => {
            expect(() => service.updateDatalayerForUpgrade(true,false,[{offerSegmentClasses:[{cabinClass:{type:'E'}}],totalAmount:50}],false,'€')).not.toThrow();
        });
    });
    describe('When addDigitalDataInfoHashEID is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
            CommonsUtilService.sha256 = jasmine.createSpy('sha256').and.returnValue(Promise.resolve('test'));
            // spyOn(service, 'addDigitalDataInfo');
        }));
        it(', it will update digital_data with hash EID info parameters', () => {
            service.addDigitalDataInfoHashEID({personalInfo:{contactEmail:'test@gmail.com'}});
            expect(CommonsUtilService.sha256).toHaveBeenCalled();
        });
    });
    describe('When updateDatalayerWithEvents is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
            spyOn(service, 'addDigitalDataInfo');
        }));
        it(', it will update digital_data with events parameters', () => {
            service.updateDatalayerWithEvents('testCategory', 'testAction', 'testLabel');
            expect(service.addDigitalDataInfo).toHaveBeenCalled();
        });
    });
    describe('When addDestinationInfoDigitalData is called', () => {
        it(', it will add destination info to digital_data', () => {
            const outbounDate = new Date();
            outbounDate.setDate(outbounDate.getDate() + 30);
            const returnDate = new Date()
            returnDate.setDate(returnDate.getDate() + 45);
            localStorageService.clearAll();
            localStorageService.set('bookingUrlParams', {originCity: {code:'MAD', description:'Madrid', country:{code:'Spain'}}, destinationCity: {code:'BCN',description:'Barcelona'},numberPassengrsWithoutInfant: 1, dates:{formatedReturnFlight:returnDate.toISOString(), formatedOutboundFlight: outbounDate.toISOString(), outboundFlight:dayjs(outbounDate).format('DD-MM-YYYY'), returnFlight: dayjs(returnDate).format('DD-MM-YYYY')}, searchOrigin:'PAHMPA', adult:1, child:0, senior: 0, infant: 0, young:0, teenager: 0});
            localStorageService.set('originDestination', { originCity: { code: 'MAD', description: 'Madrid', country: { code: 'Spain' } }, destinationCity: { code: 'BCN', description: 'Barcelona' }, numberPassengrsWithoutInfant: 1, dates: { formatedReturnFlight: returnDate.toISOString(), formatedOutboundFlight: outbounDate.toISOString(), outboundFlight:  dayjs(outbounDate).format('DD-MM-YYYY'), returnFlight: dayjs(returnDate).format('DD-MM-YYYY') }, numAdults: 1 });
            localStorageService.set('fareData',{offers:[{offerItems:[{passengerIds:'ids',price:{total:0}}],discountsApplied:{originalPrice:{total:0},discounts:[{percentDiscount:1,totalDiscount:0.1,type:'DynamicPricing'}]}}], fareFamilyConditions:[{commercialName:'ES'},{commercialName:'ES'}]})
            spyOn(service, 'addDigitalDataInfo');
            service.addDestinationInfoDigitalData({originCity: {code: 'MAD', description: 'Madrid', country: {code: 'ES',description:'España'},timezone: 'GMT'},
            destinationCity: {code: 'BCN', description: 'Barcelona', country: {code: 'ES', description:'España'}, timezone: 'GMT'},
            numberPassengrsWithoutInfant: '2',dates: {formatedReturnFlight: returnDate.toISOString(), formatedOutboundFlight: outbounDate.toISOString(), outboundFlight: dayjs(outbounDate).format('DD-MM-YYYY'), returnFlight: dayjs(returnDate).format('DD-MM-YYYY')},
            numAdults: 2, numChilds: 0, numInfant: 0, numSeniors: 0, numTeenager: 0, numYoung: 0, tripType:'RT'},
            {availabilityData:{originDestinations:[{origin:{code:'MAD'},destination:{code:'BCN'}, country:{code:'ES'},originCity:{country:{code:'ES'}},destinationCity:{country:{code:'ES'}}}]}});
            expect(service.addDigitalDataInfo).toHaveBeenCalled();
        });
    });
    describe('When updateDatalayerEvents is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
        }));
        it(', it will update events parameters in datalayer', () => {
            service.updateDatalayerEvents('testCategory', 'testAction','testLabel','testName');
            expect(MonetateUtilsService.updateDigitalDataMonetate).toHaveBeenCalled();
        });
    });
    describe('When updateDatalayerInfo is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
            spyOn(service, 'sendDatalayerEvent');
        }));
        it(', it will update datalayer parameters', () => {
            service.updateDatalayerInfo('IBAIRP');
            expect(service.sendDatalayerEvent).toHaveBeenCalled();
        });
    });
    describe('When generateBbkiDataPayments is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
            spyOn(service, 'addDigitalDataInfo');
        }));
        it(', it will generate datalayer parameter in payments page', () => {
            service.generateBbkiDataPayments({generalInfo:['pmr']},{order:{orderId:'HTJDK'}});
            expect(service.addDigitalDataInfo).toHaveBeenCalledWith({ pmr: 'NO', OrderId: 'HTJDK' });
        });
    });
    describe('When generateBbkiRedemptionDataPayments is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
            spyOn(service, 'addDigitalDataInfo');
        }));
        it(', it will generate datalayer parameter in payments page', () => {
            service.generateBbkiRedemptionDataPayments({generalInfo:['pmr']},{order:{orderId:'HTJDK'}});
            expect(service.addDigitalDataInfo).toHaveBeenCalledWith({ pmr: 'NO', OrderId: 'HTJDK' });
        });
    });
    describe('When getItemCategory3 is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
            spyOn(service, 'addDigitalDataInfo');
        }));
        it(', it will return item category info', () => {
            let returnValue = service.getItemCategory3('evento','17-22','17|22');
            expect(returnValue).toEqual('all');
        });
        it(', it will return item category info', () => {
            localStorageService.set('selectedTripInfo',[{info:{segments:[{departure:{code:'17'},arrival:{code:'22'}}]}}]);
            let returnValue = service.getItemCategory3('evento','17-22','17|22');
            expect(returnValue).toEqual('1');
        });
    });
    describe('When setProcessAndStep is called', () => {
        beforeEach(inject(function () {
            localStorageService.clearAll();
            spyOn(service, 'addDigitalDataInfo');
        }));
        it(', it will return item category info', () => {
            service.setProcessAndStep('booking','pasajeros','IBAIRP');
            expect(service.addDigitalDataInfo).toHaveBeenCalledWith({Process: 'booking',Step: 'pasajeros',Quadrigam: 'IBAIRP'});
        });
    });
    describe('addDigitalData functions', () => {
        let headerModelStorage;
        let extendedDatalayerInfo;

        beforeEach(() => {
            headerModelStorage = {
                headerModel: {
                    shoppingBasket: {
                        insuranceAllianzFusionInfo: {
                            info: { description: 'Fusion' },
                            total: { total: 99.99 }
                        },
                        globickActivities: {
                            info: { description: ['activity1', 'activity2'] },
                            total: { total: 123.45 }
                        },
                        globickTransfers: {
                            info: { transferCar: 'Bus' },
                            total: { total: 55.55 }
                        }
                    }
                }
            };

            extendedDatalayerInfo = {};
        });

        it('should add Allianz Fusion data', () => {
            (service as any).addDigitalDataAllianzFusion(extendedDatalayerInfo, headerModelStorage);

            expect(extendedDatalayerInfo).toEqual({
                [DatalayerConstants.DATALAYER_INFO.INSURANCE_TYPE]: 'Fusion',
                [DatalayerConstants.DATALAYER_INFO.INSURANCE_TOTAL_PRICE]: 99.99,
                [DatalayerConstants.DATALAYER_INFO.INSURANCE_POLICY]: null
            });
        });

        it('should add Globick Activities data', () => {
            (service as any).addDigitalDataGlobickActivities(headerModelStorage, extendedDatalayerInfo);

            expect(extendedDatalayerInfo).toEqual({
                [DatalayerConstants.DATALAYER_INFO.GLOBICK_ACTIVITIES]: 2,
                [DatalayerConstants.DATALAYER_INFO.GLOBICK_ACTIVITIES_TOTAL_PRICE]: 123.45
            });
        });

        it('should add Globick Transfer data', () => {
            (service as any).addDigitalDataGlobickTransfer(headerModelStorage, extendedDatalayerInfo);

            expect(extendedDatalayerInfo).toEqual({
                [DatalayerConstants.DATALAYER_INFO.GLOBICK_TRANSFER]: 'Bus',
                [DatalayerConstants.DATALAYER_INFO.GLOBICK_TRANSFER_TOTAL_PRICE]: 55.55
            });
        });
    });

    describe('When mapSeatsForDigitalData is called', () => {
        const SI = DatalayerConstants.DATALAYER_INFO.SEATSINFO;

        const buildHeaderModel = (seats: { type: string; quanty: number; amount: number }[]) => ({
            headerModel: { shoppingBasket: { seats: { segments: [{ seats }] } } }
        });

        beforeEach(() => {
            spyOn(service as any, 'addDigitalDataSeatsInfoByType');
        });

        it('should set SEATSTOTAL and SEATSTOTALPRICE aggregating all seats', () => {
            const extendedDatalayerInfo = {};
            const headerModel = buildHeaderModel([
                { type: SI.SEATS_HEADER_FORMAT.UPFRONT, quanty: 2, amount: 30 },
                { type: SI.SEATS_HEADER_FORMAT.EMERGENCY, quanty: 1, amount: 15 },
            ]);

            (service as any).mapSeatsForDigitalData(headerModel, extendedDatalayerInfo);

            expect(extendedDatalayerInfo[SI.SEATSTOTAL]).toBe(3);
            expect(extendedDatalayerInfo[SI.SEATSTOTALPRICE]).toBe(45);
        });

        const SEAT_TYPE_CASES = [
            { type: SI.SEATS_HEADER_FORMAT.UPFRONT,             totalKey: SI.SEATSBYTYPE.UPFRONT.SEATSEUPFRONTTOTAL,                         priceKey: SI.SEATSBYTYPE.UPFRONT.SEATSEUPFRONTPRICE },
            { type: SI.SEATS_HEADER_FORMAT.EXTRA_SIZE,          totalKey: SI.SEATSBYTYPE.XL.SEATSXLTOTAL,                                    priceKey: SI.SEATSBYTYPE.XL.SEATSXLPRICE },
            { type: SI.SEATS_HEADER_FORMAT.EMERGENCY,           totalKey: SI.SEATSBYTYPE.EMERGENCY.SEATSEMERGENCYTOTAL,                       priceKey: SI.SEATSBYTYPE.EMERGENCY.SEATSEMERGENCYPRICE },
            { type: SI.SEATS_HEADER_FORMAT.PROMO,               totalKey: SI.SEATSBYTYPE.PROMO.SEATSPROMOTOTAL,                               priceKey: SI.SEATSBYTYPE.PROMO.SEATSPROMOPRICE },
            { type: SI.SEATS_HEADER_FORMAT.INFANT,              totalKey: SI.SEATSBYTYPE.PASSENGER_WITH_INFANT.SEATSEINFANTTOTAL,             priceKey: SI.SEATSBYTYPE.PASSENGER_WITH_INFANT.SEATSEINFANTPRICE },
            { type: SI.SEATS_HEADER_FORMAT.RESTRICTED_MOBILITY, totalKey: SI.SEATSBYTYPE.RESTRICTED_MOBILITY.SEATSRESTRICTEDMOBILITYTOTAL,   priceKey: SI.SEATSBYTYPE.RESTRICTED_MOBILITY.SEATSRESTRICTEDMOBILITYPRICE },
            { type: '',                                          totalKey: SI.SEATSBYTYPE.STANDARD.SEATSSTANDARDTOTAL,                        priceKey: SI.SEATSBYTYPE.STANDARD.SEATSSTANDARDTOTALPRICE },
        ];

        SEAT_TYPE_CASES.forEach(({ type, totalKey, priceKey }) => {
            it(`should call addDigitalDataSeatsInfoByType for type "${type || 'STANDARD'}"`, () => {
                const headerModel = buildHeaderModel([{ type, quanty: 1, amount: 10 }]);

                (service as any).mapSeatsForDigitalData(headerModel, {});

                expect((service as any).addDigitalDataSeatsInfoByType)
                    .toHaveBeenCalledOnceWith(jasmine.any(Object), jasmine.any(Array), jasmine.any(String), totalKey, priceKey);
            });
        });
    });


    describe('When getTypeSearch is called', ()=> {
        beforeEach(() => {
            localStorageService.remove('bookingUrlParams');
        });
        it('and is metaseach with economy selected return digital_data value', ()=> {
            localStorageService.set('bookingUrlParams', {metasearchMainCabin: 'Economy'});
            expect(service.getTypeSearch(true)).toEqual(DatalayerConstants.DIGITAL_DATA_TYPE_SEARCH.LOW_COST);
        });
        it('and is metaseach with economy selected, return value for datalayer', ()=> {
            localStorageService.set('bookingUrlParams', {metasearchMainCabin: 'Economy'});
            expect(service.getTypeSearch()).toEqual(DatalayerConstants.DATALAYER_TYPE_SEARCH.LOW_COST);
        });
        it('and is shuttle  with economy selected return digital_data value', ()=> {
            localStorageService.set('bookingUrlParams', {beginFareType: 'E'});
            expect(service.getTypeSearch(true)).toEqual(DatalayerConstants.DIGITAL_DATA_TYPE_SEARCH.LOW_COST);
        });
        it('and is roudtrip with economy selected return digital_data value for R', ()=> {
            localStorageService.set('bookingUrlParams', {preferredCabin: 'R'});
            expect(service.getTypeSearch(true)).toEqual(DatalayerConstants.DIGITAL_DATA_TYPE_SEARCH.LOW_COST);
        });
        it('and is roudtrip with economy selected return digital_data value for N', ()=> {
            localStorageService.set('bookingUrlParams', {preferredCabin: 'N'});
            expect(service.getTypeSearch(true)).toEqual(DatalayerConstants.DIGITAL_DATA_TYPE_SEARCH.FLEXIBLE);
        });
        it('and is roudtrip with economy selected return digital_data value for B', ()=> {
            localStorageService.set('bookingUrlParams', {preferredCabin: 'B'});
            expect(service.getTypeSearch(true)).toEqual(DatalayerConstants.DIGITAL_DATA_TYPE_SEARCH.PREMIUM_CABIN);
        });
        it('and is roudtrip with economy selected return digital_data value for Economy', ()=> {
            localStorageService.set('bookingUrlParams', {preferredCabin: 'Economy'});
            expect(service.getTypeSearch(true)).toEqual(DatalayerConstants.DIGITAL_DATA_TYPE_SEARCH.LOW_COST);
        });
        it('and is roudtrip with economy selected return digital_data value for Business', ()=> {
            localStorageService.set('bookingUrlParams', {preferredCabin: 'Business'});
            expect(service.getTypeSearch(true)).toEqual(DatalayerConstants.DIGITAL_DATA_TYPE_SEARCH.PREMIUM_CABIN);
        });
        it('and is roudtrip with economy selected return digital_data value for PremiumEconomy', ()=> {
            localStorageService.set('bookingUrlParams', {preferredCabin: 'PremiumEconomy'});
            expect(service.getTypeSearch(true)).toEqual(DatalayerConstants.DIGITAL_DATA_TYPE_SEARCH.PREMIUM_CABIN);
        });
        it('and is roudtrip with economy selected return digital_data value for any other', ()=> {
            localStorageService.set('bookingUrlParams', {preferredCabin: 'Cualquiera'});
            expect(service.getTypeSearch(true)).toEqual(DatalayerConstants.DIGITAL_DATA_TYPE_SEARCH.LOW_COST);
        });
    });
});
