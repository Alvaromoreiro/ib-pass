describe('GetBookingNameService', () => {
    let GetBookingNameService, $rootScope, $q, MmBAppConstants, BookingNameProxy, CommonsHttpUtilsErrorService, base64;
    let fakeBookingNameProxy = {
        'getBooking': jasmine.createSpy('getBooking').and.callFake(() => {
            return Promise.resolve({});
        })
    };
    let deferred;
    let fakeMmBAppConstants = {
        QUADRIGAM: {
            STOP_OVER: 'STOP_OVER',
            COMPLETE_TRAVEL: 'COMPLETE_TRAVEL'
        },
        PNR_EMITION_CHANNEL: {
            FLEX_FLIGHT_DIRECT: [
                'IBCOM',
                'CALL_CENTER',
                'NDC_DIRECT'
            ],
            FLEX_FLIGHT_INDIRECT: [
                'NDC_INDIRECT',
                'OTHER',
            ],
        },
        ORDER_ITEMS_TYPE_TO_AVOID: ['baggage', 'specialEquipment', 'flexibilityOnDemand', 'priorityBoarding'],
        COMMON_LABELS: {
            CHANNEL: {
                IBCOM: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                },
                NDC_DIRECT: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                },
                NDC_INDIRECT: {
                    'VALUE': 'MMB_DISRUPTION_AGENCY_CONTACT_MSG',
                    'PHONE': false
                },
                CALL_CENTER: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                },
                OTHER: {
                    'VALUE': 'MMB_DISRUPTION_AGENCY_CONTACT_MSG',
                    'PHONE': false
                },
                DEFAULT: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                }


            }
        },
        WCS: {
            'PHONE_TYPES': {
                'SALES': 'RESERVAS',
                'IBHOLIDAYS': 'ATTBAH'
            }
        }
    };
    let fakeCommonsHttpUtilsErrorService = {
        'controlError': jasmine.createSpy('controlError').and.returnValue({})
    }
    let fakeBase64 = {

    }
    beforeEach(() => {
        angular.mock.module('ib-http-services-module', ($provide) => {
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('BookingNameProxy', fakeBookingNameProxy);
            $provide.value('CommonsHttpUtilsErrorService', fakeCommonsHttpUtilsErrorService);
            $provide.value('base64', fakeBase64);
        });

        inject((_GetBookingNameService_, _$rootScope_, _$q_, _MmBAppConstants_, _CommonsHttpUtilsErrorService_, _base64_) => {
            GetBookingNameService = _GetBookingNameService_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            MmBAppConstants = _MmBAppConstants_;
            CommonsHttpUtilsErrorService = _CommonsHttpUtilsErrorService_;
            base64 = _base64_;
        });
    });

    describe('When getBooking() called', () => {
        it('should call BookingNameProxy.getBooking with the correct parameters and return the data', (done) => {
            const name = 'John';
            const surname = 'Doe';
            const checkinId = '1234';
            const data = { status: 'OK', data: 'booking data' };
    
            GetBookingNameService.getBooking(name, surname, checkinId).then((result) => {
                expect(result).toEqual(data.data);
            });
            expect(fakeBookingNameProxy.getBooking).toHaveBeenCalledWith(MmBAppConstants.getBookingInformationNameURI + checkinId, name, surname);
            done();
        });        
    });

    describe('When getBooking() called', () => {
        beforeEach(()=> {
            fakeBookingNameProxy.getBooking = jasmine.createSpy('getBooking').and.callFake(() => {
                return Promise.reject({});
            })
        });
      
        it('should call BookingNameProxy.getBooking with the correct parameters and return the data', (done) => {
            const name = 'John';
            const surname = 'Doe';
            const checkinId = '1234';
            const data = { status: 'OK', data: 'booking data' };
           
            GetBookingNameService.getBooking(name, surname, checkinId).then((result) => {
                expect(result).toEqual(data.data);
            });
            expect(fakeBookingNameProxy.getBooking).toHaveBeenCalledWith(MmBAppConstants.getBookingInformationNameURI + checkinId, name, surname);
            done();
        });
        afterEach(()=> {
            fakeBookingNameProxy.getBooking = jasmine.createSpy('getBooking').and.callFake(() => {
                return Promise.resolve({});
            })
        })
    });
    
});
