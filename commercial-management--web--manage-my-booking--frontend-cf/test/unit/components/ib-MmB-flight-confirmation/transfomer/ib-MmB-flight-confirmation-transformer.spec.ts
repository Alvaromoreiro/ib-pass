describe('FlightConfirmationTransformer test', function () {

    var flightConfirmationTransformer, localStorageService, filter;

    var fakeMmBAppConstants = {
        STATUS: {
            'UNCHECKABLE': 'UNCHECKABLE',
            'CHECKABLE': 'CHECKABLE',
            'CHECKED': 'CHECKED',
            'STANDBY': 'STANDBY',
            'REISSUE': 'REISSUE',
            'NOT_SELECTABLE': 'NOT_SELECTABLE'
        }
    };

    var fakeMmBUtilService = {
        'setFareFamilyConditions': jasmine.createSpy(),
        'getFormatedDate': jasmine.createSpy('getFormatedDate').and.callFake(function () {
            return { 'formatedDate': '12/12/2012', 'dateFormatByLanguage': {} };
        })
    };

    var fakeDateFormatFilter = function (inputDate) {
        return inputDate;
    };

    var fakeSegmentSelected = {
        'id': '1',
        'type': 'CONFIRMED',
        'flown': false,
        'ckiStatus': {
            'code': 'UNCHECKABLE',
            'message': 'El vuelo no está disponible para su facturación en estos momentos. Inténtalo más tarde o acude al aeropuerto para obtener tu tarjeta de embarque.'
        },
        'departureDateTime': '2017-06-12 17:30',
        'transformedDepartureDate': {
            'dateTime': '17:30',
            'weekDay': 'WEEKDAY_MONDAY',
            'day': 12,
            'monthNumber': 6,
            'month': 'MONTH_JUNE',
            'year': 2017,
            'originalDate': '2017-06-12T15:30:00.000Z'
        },
        'transformedArrivalDate': {
            'dateTime': '18:45',
            'weekDay': 'WEEKDAY_MONDAY',
            'day': 12,
            'monthNumber': 6,
            'month': 'MONTH_JUNE',
            'year': 2017,
            'originalDate': '2017-06-12T16:45:00.000Z'
        },
        'segment': {
            'company': 'IB',
            'companyName': 'Iberia',
            'number': '2732',
            'companyURL': '../../content-mmb/iconos/aerolineas/logo_pos_IB.svg',
            'companyDisabledURL': '../../content-mmb/iconos/aerolineas/logo_desact_IB.svg'
        },
        'cabinClass': {
            'rbd': 'Y',
            'bookingClass': 'ECONOMY',
            'description': 'Turista',
            'remainingSeats': 0,
            'fareFamily': 'TFLESEU'
        },
        'sliceId': 'SHUTTLE_01',
    };

    var fakeNewSegmentSelected = {
        'outbound': '09:45',
        'outboundDate': '2017-06-15 09:45',
        'inbound': '11:05',
        'inboundDate': '2017-06-15 11:05',
        'company': {
            'description': 'Vueling Airlines S.A.',
            'logo': '../../content-mmb/iconos/aerolineas/logo_pos_VY.svg'
        },
        'remainingSeats': 4,
        'sliceId': '1',
        'originDestinationId': 'OD1',
        'offerItemIds': [
            '931065b4658f4abcb1138ff81c9fc08c_01'
        ],
        'cabinClass': {
            'fareFamily': 'TFLESEU'
        },
        'myflight': false
    };

    var fakeBookingInfo = {
        'order': {
            'slices': [{
                'sliceId': 'SHUTTLE_01',
                'type': 'SHUTTLE',
                'departureDateTime': '2017-06-12 17:30',
                'arrivalDateTime': '2017-06-12 18:45',
                'duration': 75,
                'stopsNumber': 0,
                'segments': [{
                    'type': 'CONFIRMED',
                    'mmbAllowed': true,
                    'ckiStatus': {
                        'code': 'CHECKED',
                        'message': 'El vuelo no está disponible para su facturación en estos momentos.'
                    },
                    'id': '1'
                }]
            }]
        },
        'fareFamilyConditions': [
            {
                'cabinType': 'E',
                'cabinDescription': 'Turista',
                'commercialCode': 'TFLESEU',
                'commercialName': 'Flexible',
                'priority': 500,
                'conditions': [
                    {
                        'code': 'EQMANO',
                        'name': 'Equipaje de mano',
                        'text': '1 bulto',
                        'extendedInfo': {
                            'title': '1 bulto en cabina',
                            'message': '1 bulto/ 56x45x25cm.',
                            'conditionStatus': true
                        }
                    }]
            }],
        'overnight': false
    };

    var fakeFareFamilyConditionsData = [
        {
            'cabinType': 'E',
            'cabinDescription': 'Turista',
            'commercialCode': 'TFLESEU',
            'commercialName': 'Flexible',
            'priority': 500,
            'conditions': [
                {
                    'code': 'EQMANO',
                    'name': 'Equipaje de mano',
                    'text': '1 bulto',
                    'extendedInfo': {
                        'title': '1 bulto en cabina',
                        'message': '1 bulto/ 56x45x25cm.',
                        'conditionStatus': true
                    }
                }
            ]
        }
    ];

    beforeEach(function () {
        angular.mock.module('ib-MmB-flight-confirmation-module', 'ib-MmB-filters-module', 'LocalStorageModule', 'ib-MmB-services-module', function ($provide) {
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('DateFormatFilter', fakeDateFormatFilter);
            $provide.value('MmBUtilService', fakeMmBUtilService);
        });
        inject(function (_FlightConfirmationTransformer_, _localStorageService_, _DateFormatFilter_) {
            flightConfirmationTransformer = _FlightConfirmationTransformer_;
            filter = _DateFormatFilter_;
            localStorageService = _localStorageService_;
        });
    });

    describe('when transformConfirmationView is called', function () {
        var returnedData;

        it('and have bookingInfo, it should return data', function (done) {
            localStorageService.set('selectedSegment', fakeSegmentSelected);
            localStorageService.set('newSelectedSegment', fakeNewSegmentSelected);
            localStorageService.set('bookingInfo', fakeBookingInfo);
            returnedData = flightConfirmationTransformer.transformConfirmationView();
            expect(returnedData.selectedSegmentDetails).toEqual(fakeSegmentSelected);
            expect(returnedData.oldSegmentInfo.departureDate.weekDay).toEqual(fakeSegmentSelected.transformedDepartureDate.weekDay);
            expect(returnedData.newSegmentInfo.company).toEqual(fakeNewSegmentSelected.company);
            localStorageService.clearAll();
            done();
        });

        it('and don´t have bookingInfo in localStorage but have fareFamilyConditionsData, it should return data', function (done) {
            localStorageService.set('selectedSegment', fakeSegmentSelected);
            localStorageService.set('newSelectedSegment', fakeNewSegmentSelected);
            localStorageService.set('bookingInfo', {});
            localStorageService.set('fareFamilyConditionsData', fakeFareFamilyConditionsData);
            returnedData = flightConfirmationTransformer.transformConfirmationView();
            expect(returnedData.selectedSegmentDetails).toEqual(fakeSegmentSelected);
            expect(returnedData.oldSegmentInfo.departureDate.weekDay).toEqual(fakeSegmentSelected.transformedDepartureDate.weekDay);
            expect(returnedData.newSegmentInfo.company).toEqual(fakeNewSegmentSelected.company);
            localStorageService.clearAll();
            done();
        });
    });

    it('when setFareFamilyConditions has been called', function (done) {
        flightConfirmationTransformer.transformFareFamiliesConditions('hola');
        expect(fakeMmBUtilService.setFareFamilyConditions).toHaveBeenCalled();
        done();
    });

    it('when generateChangeOrderRequest is called and return data', function (done) {
        var returnData;
        localStorageService.set('newSelectedSegment', fakeNewSegmentSelected);
        localStorageService.set('responseId', '2');
        localStorageService.set('selectedPassengerId', '1');
        localStorageService.set('flowId', '2222');
        returnData = flightConfirmationTransformer.generateChangeOrderRequest();
        expect(returnData.passengerIds).toEqual('1');
        expect(returnData.shoppingResponseId).toEqual('2');
        expect(returnData.offerItemIds[0]).toEqual('931065b4658f4abcb1138ff81c9fc08c_01');
        localStorageService.clearAll();
        done();
    });


    describe('when posibleDeleteSegments is called', function () {
        var returnedValue;
        it('and exist segments with state CHECKED and return true', function (done) {
            localStorageService.set('bookingInfo', fakeBookingInfo);
            localStorageService.set('selectedSegment', fakeSegmentSelected);
            returnedValue = flightConfirmationTransformer.posibleDeleteSegments();
            expect(returnedValue).toBe(true);
            done();
        });

        xit('and no exist segments with state UNCHECKED and return false', function (done) {
            fakeBookingInfo.order.slices[0].segments[0].ckiStatus.code = 'UNCHECKED';
            localStorageService.set('bookingInfo', fakeBookingInfo);
            localStorageService.set('selectedSegment', fakeSegmentSelected);
            returnedValue = flightConfirmationTransformer.posibleDeleteSegments();
            expect(returnedValue).toBe(false);
            done();
        });
    });


    describe('when areDeletedSegments is called', function () {
        var returnedValue, data;
        it('and is called with data information, should return data', function (done) {
            data = [{ '1': '1', '2': '2' }];
            returnedValue = flightConfirmationTransformer.areDeletedSegments(data);
            expect(returnedValue).toEqual(true);
            done();
        });

        it('and is called without data information, should no return data', function (done) {
            data = [];
            returnedValue = flightConfirmationTransformer.areDeletedSegments(data);
            expect(returnedValue).toEqual(false);
            done();
        });
    })
});