describe('ibMmbBookingContactInfoComponent test', () => {
    let controller, $rootScope, $scope, localStorage;
    let fakeMmBModalService = {
        'showGenericModal': jasmine.createSpy(),
        'showPassengerModal': jasmine.createSpy('showPassengerModal').and.callFake(angular.noop)
    };

    let fakeDatalayerUtilsService = {
        updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
        sendDatalayerEvent: jasmine.createSpy(),
        updateDigitalDataWithQuadrigam: jasmine.createSpy(),
        updateDatalayerViewEvent: jasmine.createSpy(),
        setProcessAndStep: jasmine.createSpy(),
        updateDatalayerInfo: jasmine.createSpy()
    };

    let fakeMmBAppConstants = {
        QUADRIGAM: {
            SEARCH: 'CHKTRP',
            LOGGED_SEARCH: 'MYTRPS',
            TRIP_DETAILS: 'IBMTDT',
            CHANGE_FLIGHT: 'TCADVS',
            CHANGE_FLIGHT_DISPO: 'TCFLPA',
            FLIGHT_CONFIRMATION: 'TCFREV',
            ORDER_TICKETS: 'IBENIT',
            ORDER_TICKETS_CONFIRMATION: 'IBCENIT',
            CHANGED_HOURS_INV: 'IBICHC',
            CANCEL_FLIGHT_INV: 'IBICFC',
            SPECIAL_NEEDS: 'MOPMR',
            SPECIAL_NEEDS_CONFIRMED: 'MOPMRCF',
            PASSENGER_INFO: 'MOINFO',
            ON_HOLD_CONF: 'OHMTDT',
            ON_HOLD_CONF_ON_BUSINESS: 'CIPOHMTDT',
            ON_HOLD_CONF_RESIDENTS: 'OHSARA',
            ON_HOLD_CONF_LOGIN: 'OHLOIN',
            ON_HOLD_CONF_PAYMENT: 'MOPURC',
            ON_HOLD_CONF_PAYMENT_ON_BUSINESS: 'CIPOHINFO',
            ON_HOLD_CONF_PAYMENT_WAIT: 'OHWAIT',
            ON_HOLD_CONF_PAYMENT_FRAUD: 'OHPCC',
            ON_HOLD_CONF_CONFIRMATION: 'MOPURC',
            ON_HOLD_CONF_CONFIRMATION_ON_BUSINESS: 'CIPRTBKCF',
            ON_HOLD_CONF_CANCEL_ORDER_MODAL: 'CNCLOH',
            ON_HOLD_CONF_CANCEL_ORDER_MODAL_ON_BUSINESS: 'CIPCNCLOH',
            ON_HOLD_CONF_CANCEL_ORDER_CONFIRMATION: 'CNCLIT',
            ON_HOLD_CONF_CANCEL_ORDER_CONFIRMATION_ON_BUSINESS: 'CIPCNCLIT',
            PASSENGER_DATA: 'MODPAX',
            CUSTOMIZE_FLIGHTS: 'MOANCI',
            CUSTOMIZE_FLIGHTS_DEEPLINK: 'MOSEATJBR',
            MODAL_SELECT_SEAT_JBA: 'SEATMPJBR',
            PASSENGER_FF_ADD: 'MOEMER',
            CONFIRM_EMERGENCY_CONTACT: 'MOCEME',
            FRECUENT_F: 'MOFFLY',
            CONFIRM_FF: 'MOCFFL',
            CONFIRM_ADD_APIS: 'MOCAPI',
            SPECIAL_NEEDS_ADD: 'MOPMR',
            CONFIRM_SPECIAL_NEEDS_ADD: 'MOCPMR',
            MANAGE_RESERV: 'IBMMBR',
            ADD_APIS: 'MOAPIS',
            MODAL_INFO_SEATS: 'MODSEA',
            MODAL_INFO_BAGGAGE: 'MODBAG',
            MODAL_INFO_SECUR: 'MODINS',
            YOUR_FLIGHTS: 'IBMTFL',
            YOUR_DOCUMENTS: 'MODDOC',
            CHANGE_FLIGHTS_CALL_CENTER_MESSAGE: 'ATCFCNA',
            CHANGE_FLIGHTS_SARCH_ONE_WAY: 'ATCFOW',
            CHANGE_FLIGHTS_SEARCH_WITH_RETURN: 'ATCFRT',
            CHANGE_FLIGHTS_SEARCH_DATE_ERROR_MODAL: 'ATCERD',
            CHANGE_FLIGHTS_AVAILABILITY_ONE_WAY: 'ATCPOW',
            CHANGE_FLIGHTS_AVAILABILITY_WITH_RETURN: 'ATCPRT',
            CHANGE_FLIGHTS_AVAILABILITY_WITH_RETURN_ONE_CHOOSE: 'ATCPSG',
            CHANGE_FLIGHTS_AVAILABILITY_MESSAGE: 'ATCERR',
            CHANGE_FLIGHTS_AVAILABILITY_ERROR_MODAL: 'ATCERT',
            CHANGE_FLIGHTS_SUMMARY: 'ATCSUM',
            ANC_SPECIAL_MEALS_UPDATE: 'MEALCF',
            ANC_SPECIAL_MEALS_OPEN_MODAL: 'MOMEAL',
            COMPLETE_TRAVEL: 'IBMCYT',
            STOP_OVER: 'HMMTDT',
            FLEXIBILIZATION_SEARCH_ONE_WAY: 'CVFFOW',
            FLEXIBILIZATION_SEARCH_WITH_RETURN: 'CVFFRT',
            FLEXIBILIZATION_AVAILABILITY_SERVICE_ERROR: 'CVFERD',
            FLEXIBILIZATION_BLACKOUT_DATE_SERVICE_ERROR: 'CVFERB',
            FLEXIBILIZATION_AVAILABILITY_ONE_WAY: 'CVFPOW',
            FLEXIBILIZATION_AVAILABILITY_RETURN: 'CVFPRT',
            FLEXIBILIZATION_AVAILABILITY_ONE_CHOOSE: 'CVFPSG',
            FLEXIBILIZATION_NOT_AVAILABILITY: 'CVFERR',
            FLEXIBILIZATION_REBOOK_SERVICE_ERROR: 'CVFERS',
            FLEXIBILIZATION_REBOOK_ERROR: 'CVFERF',
            FLEXIBILIZATION_CONFIRMATION: 'CVBKCF',
            FLEXIBILIZATION_INVOLUNTARY_SEARCH_ONE_WAY: 'CIFFOW',
            FLEXIBILIZATION_INVOLUNTARY_SEARCH_WITH_RETURN: 'CIFFRT',
            FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_SERVICE_ERROR: 'CIFERD',
            FLEXIBILIZATION_INVOLUNTARY_BLACKOUT_DATE_SERVICE_ERROR: 'CIFERB',
            FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_ONE_WAY: 'CIFPOW',
            FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_RETURN: 'CIFPRT',
            FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_ONE_CHOOSE: 'CIFPSG',
            FLEXIBILIZATION_INVOLUNTARY_NOT_AVAILABILITY: 'CIFERR',
            FLEXIBILIZATION_INVOLUNTARY_REBOOK_SERVICE_ERROR: 'CIFERS',
            FLEXIBILIZATION_INVOLUNTARY_REBOOK_ERROR: 'CIFERF',
            FLEXIBILIZATION_INVOLUNTARY_CONFIRMATION: 'CIBKCF',
            FLEXIBILIZATION_VOUCHER_REFUND_BEGGINING: 'RVFDBT',
            FLEXIBILIZATION_VOUCHER_REFUND_SUMMARY: 'RVFDBD',
            FLEXIBILIZATION_VOUCHER_REFUND_CONFIRMATION_MODAL: 'RVFCEB',
            FLEXIBILIZATION_VOUCHER_REFUND_CONFIRMATION_SINGLE_PAX: 'RVFCFP',
            FLEXIBILIZATION_VOUCHER_REFUND_CONFIRMATION_MULTIPLE_PAX: 'RVFCFM',
            DISRUPTION_VOUCHER_REFUND_BEGGINING: 'RVDDBT',
            DISRUPTION_VOUCHER_REFUND_SUMMARY: 'RVDDBD',
            DISRUPTION_VOUCHER_REFUND_CONFIRMATION_MODAL: 'RVDCEB',
            DISRUPTION_VOUCHER_REFUND_CONFIRMATION_SINGLE_PAX: 'RVDCFP',
            DISRUPTION_VOUCHER_REFUND_CONFIRMATION_MULTIPLE_PAX: 'RVDCFM',
            FLEXIBILIZATION_CASH_REFUND_SUMMARY: 'RCFDBD',
            FLEXIBILIZATION_CASH_REFUND_CONFIRMATION_MODAL: 'RCFCEB',
            FLEXIBILIZATION_CASH_REFUND_CONFIRMATION_PAGE: 'RCFCFP',
            DISRUPTION_CASH_REFUND_SUMMARY: 'RCDDBD',
            DISRUPTION_CASH_REFUND_CONFIRMATION_MODAL: 'RCDCEB',
            DISRUPTION_CASH_REFUND_CONFIRMATION_PAGE: 'RCDCFP',
            /* CHANGE WITH ALTERNATIVE AND WITH FLEXIBILIZATION WHEN HAVE ALL SLICE DISRUPTED */
            DISRUPTION_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL: 'CITORE',
            AVAILABILITY_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL: 'CITOAV',
            CONFIRMATION_CHANGE_WITH_ALTERNATIVE_FLEXIB_TOTAL: 'CITOBK',
            /* CHANGE WITH ALTERNATIVE AND WITH FLEXIBILIZATION WHEN HAVE ONE SLICE DISRUPTED */
            DISRUPTION_CHANGE_WITH_ALTERNATIVE_FLEXIB_PARCIAL: 'CIPARE',
            AVAILABILITY_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_FLEXIB_PARCIAL: 'CIPAAV',
            CONFIRMATION_CHANGE_WITH_ALTERNATIVE_FLEXIB_PARCIAL: 'CIPABK',
            /* CHANGE WITH ALTERNATIVE AND WITH FLEXIBILIZATION WHEN HAVE ONE SLICE DISRUPTED BUT SELECT CHANGE ALL SLICE*/
            DISRUPTION_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL_OPTIONAL: 'CIPARE',
            AVAILABILITY_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL_OPTIONAL: 'CIPTAV',
            CONFIRMATION_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL_OPTIONAL: 'CIPTBK',
            /* CHANGE WITH ALTERNATIVE AND  WITHOUT FLEXIBILIZATION, CAN ACCEPT ALL CHANGES*/
            DISRUPTION_CHANGE_WITH_ONLY_ALTERNATIVE_TOTAL: 'CINTRE',
            MODAL_ACCEPT_CHANGE_WITH_ONLY_ALTERNATIVE_TOTAL: 'CINTBK',
            /* CHANGE WITHOUT ALTERNATIVE AND WITHOUT FLEXIBILIZATION ONLY CAN ACCEPT ONE CHANGE*/
            DISRUPTION_CHANGE_WITH_ONLY_ALTERNATIVE_PARCIAL: 'CINPRE',
            MODAL_ACCEPT_CHANGE_WITH_ONLY_ALTERNATIVE_PARCIAL: 'CINPBK',
            /* CHANGE WITHOUT ALTERNATIVE AND WITHOUT FLEXIBILIZATION*/
            DISRUPTION_CHANGE_WITHOUT_ALTERNATIVE_WITHOUT_FLEXIBILIZATION: 'IBICFC',
            /* CHANGE TIME - TK */
            DISRUPTION_CHANGE_TIME: 'IBICHC',
            CUSTOMIZE_YOUR_TRAVEL: 'MOANCI'
        }
    };

    let fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: {
            'VIEW': 'VIEW'
        },
        DIGITAL_DATA_PROCESS: {
            ATCFCNA: 'test',
            MOEMER: 'test'
        },
        DIGITAL_DATA_STEP: {
            ATCFCNA: 'test',
            MOEMER: 'test'
        },
    };

    let fakeMmBUtilsSharedService = {
        getPrefixFromMarket: jasmine.createSpy('getPrefixFromMarket').and.callFake(() => {
            return true;
        }),
    };

    let dataAux = {
        'originalData': {
            'phone': 123456789,
            'email': 'contact@contact.com'
        },
        'title': 'MMB_PASSENGERS_CONTACT_DATA_TEXT',
        'subtitle': false,
        'isEmergencyContactData': false,
        'data': {
            'phone': 123456789,
            'email': 'contact@contact.com'
        },
        'serviceData': {
            'contactData': {
                'primaryContactInfo':
                {
                    'phone': 123456789,
                    'email': 'contact@contact.com',
                    'language': null,
                    'phoneDetails': {
                        'number': 987654321,
                        'countryCode': '34'
                    }
                },
                'emergencyContactInfo': {
                    'name': '',
                    'prefix': '',
                    'phone': '',
                    'code': ''
                }
            },
            'originalData': {
                'phone': 123456789,
                'email': 'contact@contact.com'
            },
            'isEmergencyContactData': false
        },
        'type': 'primaryContact',
        'prefixesList': []
    }

    let fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy(),
    };

    beforeEach(() => {
        angular.mock.module('ib-MmB-booking-contact-info-module', 'LocalStorageModule', function ($provide) {
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
        });
        inject(function ($componentController, _$rootScope_, _localStorageService_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorage = _localStorageService_;
            // localStorage.set('phoneCodeList', fakePhoneCodeList);
            controller = $componentController('ibMmbBookingContactInfoComponent', { $scope: $scope, $rootScope: $rootScope });
        });
    });

    describe('when actiavte() is called', () => {
        it('The model variable lengthText should be defined', function (done) {
            controller.model = {
                'data': {
                    'contactData': {
                        'primaryContactInfo': {
                            'phone': 123456789,
                            'email': 'contact@contact.com',
                            'language': null,
                            'phoneDetails': {
                                'number': 987654321,
                                'countryCode': '34'
                            }
                        },
                        'emergencyContactInfo': {
                            'phone': 123456789,
                            'name': 'Test',
                            'prefix': '',
                            'code': ''
                        },
                        'onBusinessInfo': {
                            'number': 123456789,
                            'type': 'OB'
                        }
                    }
                }
            };
            controller.$onInit();
            expect(controller.emergencyPhone).toEqual(controller.model.data.contactData.emergencyContactInfo.phone);
            done();
        });
    });

    describe('when the changeContactData function is called', () => {
        beforeEach(inject(() => {
            fakeMmBModalService.showPassengerModal = jasmine.createSpy('showPassengerModal').and.callFake(() => {
                return { 'result': { 'then': () => { } } };
            });
        }));

        xit('if there is contactData', function (done) {
            controller.model = { 'data': { 'contactData': { 'primaryContactInfo': { 'phone': 123456789, 'email': 'contact@contact.com', 'language': null, 'phoneDetails': {'number': 987654321, 'countryCode': '34'} } } } }
            controller.changeContactData(false);
            expect(fakeMmBModalService.showPassengerModal).toHaveBeenCalledWith(false, 'ib-modal-passengers-emergency-contact.html', dataAux, 'ib-modals ib-modals--right fade');
            done();
        });

        it('if there is emergencyContactData', function (done) {
            controller.model = { 'data': { 'contactData': { 'primaryContactInfo': { 'name': '', 'phone': '' } } } }
            let isEmergencyContactData = true;
            controller.changeContactData(isEmergencyContactData);
            expect(isEmergencyContactData).toBe(true);
            done();
        });
    });

    describe('when the confirmEmergencyContact event function is called', () => {
        it('and event checkEmergencyContactChanges localFunction is called', function (done) {
            let nameMessage = 'testname';
            let countryCodeMessage = '34';
            let codeMessage = '34';
            let phoneMessage = 123456789;
            controller.emergencyPhoneDetails = {
                number: 123456789,
                countryCode: '34'
            };
            controller.model = {
                data: {
                    contactData: {
                        emergencyContactInfo: {}
                    }
                }
            };
            $rootScope.$broadcast('confirmEmergencyContact', {name: nameMessage, countryCode: countryCodeMessage, code: codeMessage, phone: phoneMessage});
            $rootScope.$digest();
            expect(controller.emergencyName).toEqual(nameMessage);
            expect(controller.emergencyCountryCode ).toEqual(countryCodeMessage);
            expect(controller.emergencyCode).toEqual(codeMessage);
            expect(controller.emergencyPhone).toEqual(phoneMessage);
            done();
        });
    });
});
