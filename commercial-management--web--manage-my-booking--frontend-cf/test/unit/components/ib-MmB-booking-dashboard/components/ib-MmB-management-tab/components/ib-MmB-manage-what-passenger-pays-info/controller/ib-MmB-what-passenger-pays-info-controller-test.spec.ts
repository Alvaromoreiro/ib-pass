describe('MmBManageWhatPassengerPaysInfoController test', function () {
    var controller, $scope, localStorageService, $rootScope, $controller, $filter, $translate;

    var whatPassenger = undefined;

    var fakeBookingDashboardConstants = {
        TABS: {
            'summary': {
                name: 'summary',
                isSubtab: false
            },
            'management': {
                name: 'management',
                isSubtab: false
            },
            'flights': {
                name: 'flights',
                isSubtab: true
            },
            'hotel': {
                name: 'hotel',
                isSubtab: true
            },
            'car': {
                name: 'car',
                isSubtab: true
            },
            'changeFlights': {
                name: 'changeFlights',
                isSubtab: true
            },
            'passengers': {
                name: 'passengers',
                isSubtab: true
            },
            'refunds': {
                name: 'refunds',
                isSubtab: true
            },
            'invoices': {
                name: 'invoices',
                isSubtab: true
            },
            'customize': {
                name: 'customize',
                isSubtab: false
            },
            'complete': {
                name: 'complete',
                isSubtab: false
            }
        },
        STEPS_STATUS: {
            'ACTIVE': 'ACTIVE',
            'PAST': 'PAST',
            'FUTURE': 'FUTURE'
        },
        BOX_LINKS_TYPES: {
            'CHECK_IN': 'checkIn',
            'EMERGENCY_CONTACT': 'emergencyContact',
            'SEATS_AUCTION': 'seatsAuction',
            'FLIGHT_REMINDER': 'flightReminder'
        },
        BOX_COL_SIZES: {
            'FULL': 'ib-box-menu__section--full',
            'EXTRALARGE': 'col-xs-12',
            'LARGE': 'col-md-6 col-lg-12 col-xl-6 col-xs-12',
            'MEDIUM': 'col-md-6 col-xs-12'
        },
        BOX_LINK_SIZES: {
            'FULL': 'ib-box-menu__section--full',
            'LEFT': 'ib-box-menu__section--left',
            'RIGHT': 'ib-box-menu__section--right'
        },
        BOX_LINK_ICONS: {
            'CHECK_IN': 'icon-checking_online',
            'MESSAGES': 'icon-mensajes',
            'AUCTION': 'icon-subasta'
        },
        APIS_FORM: {
            DOCUMENT_TYPES: {
                'DNI': 'DNI',
                'GREENCARD': 'GREENCARD',
                'REDRESSNUMBER': 'REDRESSNUMBER',
                'KNOWNTRAVELERNUMBER': 'KNOWNTRAVELERNUMBER',
                'OTHERS': 'OTHERS',
                'PSPT': 'PSPT',
                'TITLE': 'TITLE',
                'VISA': 'VISA',
                'CREWCERT': 'CREWCERT',
                'RESCARD': 'RESCARD',
                'MILITARYCARD': 'MILITARYCARD'
            },
            TYPE_DATA_FORM: {
                'ADDITIONAL_INFO': 'additionalData',
                'EMERGENCY_INFO': 'emergencyData',
                'UPDATE_SHOW_FOR_ALL': 'showForAll',
                'UPDATE_SHOW_DATA': 'showData'
            },
            DOCUMENT_FIELDS: {
                'NUM_DOC': 'NUM_DOC',
                'EXPIRY_DOC': 'EXPIRY_DOC',
                'ISSUE_DOC': 'ISSUE_DOC',
                'CNTRY_DOC': 'CNTRY_DOC',
                'CITY_DOC': 'CITY_DOC'
            },
            FIELDS: {
                'TITLE': 'TITLE',
                'NAME': 'NAME',
                'SURNAME': 'SURNAME',
                'GENDER': 'GENDER',
                'BIRTH_DATE': 'BIRTH_DATE',
                'DESTINATION_ADDRESS': 'DESTINATION_ADDRESS',
                'DESTINATION_CITY': 'DESTINATION_CITY',
                'DESTINATION_STATE': 'DESTINATION_STATE',
                'DESTINATION_ZIP': 'DESTINATION_ZIP',
                'DESTINATION_COUNTRY': 'DESTINATION_COUNTRY',
                'HOME_ADDRESS': 'HOME_ADDRESS',
                'HOME_CITY': 'HOME_CITY',
                'HOME_STATE': 'HOME_STATE',
                'HOME_ZIP': 'HOME_ZIP',
                'HOME_COUNTRY': 'HOME_COUNTRY',
                'EMERGENCY_CONTACT_NAME': 'EMERGENCY_CONTACT_NAME',
                'EMERGENCY_CONTACT_PHONE': 'EMERGENCY_CONTACT_PHONE',
                'NATIONALITY': 'NATIONALITY',
                'CITY_OF_BIRTH': 'CITY_OF_BIRTH'
            },
            GENDERS: {
                'MALE': 'MALE',
                'FEMALE': 'FEMALE',
                'DEFAULT_GENDER': 'MALE'
            },
            TITLES: {
                'MR': 'MR',
                'MRS': 'MRS',
                'MSS': 'MSS'
            },
            SPANISH_NATIONALITY: 'ES',
            USA_NATIONALITY: 'US',
            TAB_STATES: {
                'NOT_TOUCHED': 'NOT_TOUCHED',
                'COMPLETED': 'COMPLETED',
                'WARNING': 'WARNING'
            },
            TAB_SCROLL_ID: '#APIS_TAB_',
            ADDTIONAL_ERROR_SERVICE: {
                'PASSENGER_IS_UNCHECKABLE': 'PASSENGER_IS_UNCHECKABLE'
            },
            PASSENGER_STATUS: {
                'ALLOWED': 'ALLOWED',
                'NOT_ALLOWED': 'NOT_ALLOWED'
            },
            IBERIA_HOLIDAYS: {
                'MMB_IB_VACIONES_TYPE_PACKAGE': 'flight+hotel',
                'MMB_IB_VACIONES_TYPE_PACKAGE_HOTEL': 'hotel',
                'MMB_IB_VACIONES_TYPE_LINK_AVIS': '../iberia-web-content/iconos/IB_Vacaciones/AVIS_RED@2x.svg',
                'MMB_IB_VACIONES_TYPE_LINK_BUDGET': '../iberia-web-content/iconos/IB_Vacaciones/Budget_logo.svg',
                'MMB_IB_VACIONES_TYPE_COMPANY_CAR_AVIS': 'ZI',
                'MMB_IB_VACIONES_TYPE_COMPANY_CAR_BUDGET': 'ZD',
                'MMB_IB_VACIONES_TYPE_NEGATIVE': '-',
                'MMB_IB_VACIONES_TYPE_SPACE': ' '
            }
        }
    }

    var fakeBookingInfo1 = {
        order: {
            bookingReferences: [{
                reference: 'V6X6LR',
                provider: 'IB'
            }]
        }
    };
    var fakeBookingInfo2 = {
        order: {
            bookingReferences: [{
                reference: 'V6X6LR',
                provider: '1A'
            }]
        }
    };
    var fakeInitModel = [
        { testPassenger: 'Passenger' }
    ];
    var fakePassengerPay = {
        flightPNRReferenceRPH: 1,
        personalInfo:{
            name:'Yos',
            surname:'Adames'
        }
    };

    var fakePassengerPay99 = {
        flightPNRReferenceRPH: 99
    };
    var fakeIbvInfo = [{
        consumers:[{
            flightPNRReferenceRPH: 1,
            consumerType: 'ADULT',
            name:{
                firstName:'Yos',
                lastName:'Adames'
            }
        }]
    }];
    
    var faketranslate = {
        'onReady': jasmine.createSpy(),
        'storageKey': jasmine.createSpy('storageKey').and.callFake(function () { }),
        'storage': jasmine.createSpy('storage').and.callFake(function () { }),
        'preferredLanguage': jasmine.createSpy('preferredLanguage').and.callFake(function () { }),
        'use': jasmine.createSpy('use').and.callFake(function () { })
    };
    var $fakeFilter = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc = function () {
            return [];
        };
        switch (filter) {
            case 'translate':
                filterFunc = function (label) {
                    return label;
                } as any;
                break;
            default:
                break;
        }

        return filterFunc;
    })
    beforeEach(function () {
        angular.mock.module('ib-MmB-manage-what-passenger-pays-info-module', 'LocalStorageModule', function ($provide) {
            $provide.value('$translate', $fakeFilter);
            $provide.value('BookingDashboardConstants', fakeBookingDashboardConstants);
            $provide.value('$translate', faketranslate);
        });
        inject(function (_$rootScope_, _$filter_, _$translate_,  _localStorageService_, _$controller_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $filter = $fakeFilter;
            localStorageService = _localStorageService_;
            localStorageService.set('bookingInfo', fakeBookingInfo1);
            localStorageService.set('PNR', 'V6X6LR');
            $controller = _$controller_;
            $rootScope.appMarket = 'ES';
            $rootScope.appLang = 'ES';
            controller = $controller('MmBManageWhatPassengerPaysInfoController', {
                $scope: $scope,
                $rootScope: $rootScope,
                $filter: $filter,
                $translate: faketranslate,
                localStorageService: _localStorageService_
            });
        });
    });
    var $fakeFilter = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc = function () {
            return [];
        };
        switch (filter) {
            case 'translate':
                filterFunc = function (label) {
                    return label;
                } as any;
                break;
            default:
                break;
        }

        return filterFunc;
    })

    describe('when the component is created', function () {

        it('Should set popoverHolidays correctly', function () {
            expect(controller.popoverHolidays).toEqual(
                [{ 'text': 'IBCOAC_MMB_REQUEST_BILL_LINK_TITLE', 'path': null },
                { 'text': 'MMB_VC_IB_VACIONES_YOUR_CAR', 'path': null }]
            );

        });
    });
    describe('when the component is created with 1A provider', function () {
        beforeEach(function () {
            localStorageService.set('bookingInfo', fakeBookingInfo2);
        });
        it('Should set popoverHolidays correctly', function () {
            expect(controller.popoverHolidays).toEqual(
                [{ 'text': 'IBCOAC_MMB_REQUEST_BILL_LINK_TITLE', 'path': null },
                { 'text': 'MMB_VC_IB_VACIONES_YOUR_CAR', 'path': null }]
            );

        });
    });
    describe('when activate() function is called', function () {

        it('Should set passangerArray correctly)', function (done) {
            controller.model = fakeInitModel;
            controller.$onInit();
            expect(controller.model[0].testPassenger).toEqual(fakeInitModel[0].testPassenger);
            expect(controller.passangerArray.length + 1).toEqual(fakeInitModel.length);
            done();
        });

        it('Should set passangerArray correctly)', function (done) {
            controller.ibvInfo = fakeIbvInfo;
            controller.$onInit();
            expect(controller.passangerArray[0].consumerType).toEqual('ADULT');
            done();
        });

    });

    describe('when changePassengerPay() function is called', function () {

        it('passengerInfo.passengerId === ADULT_99)', function (done) {
            controller.changePassengerPay(fakePassengerPay99);
            expect(localStorageService.get('paymentpassengerIdIBV')).toEqual(99);
            done();
        });

        it('passengerInfo.passengerId !== ADULT_99)', function (done) {
            controller.changePassengerPay(fakePassengerPay);
            expect(localStorageService.get('paymentpassengerIdIBV')).toEqual(1);
            done();
        });

    });
});