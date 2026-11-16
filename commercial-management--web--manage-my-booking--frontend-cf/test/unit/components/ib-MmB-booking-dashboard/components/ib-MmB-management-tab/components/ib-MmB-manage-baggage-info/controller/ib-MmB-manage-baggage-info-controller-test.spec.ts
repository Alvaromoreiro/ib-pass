describe('MmbManageBaggageInfoController test', () => {
    var controller, $scope, $rootScope, localStorageService;
    var fakeMmBModalService = {
        showGenericModal: jasmine.createSpy()
    }

    var fakeEvent = {
        'preventDefault': () => {

        }
    }

    var fakeMmBUtilService = {
        'isUserLogged': jasmine.createSpy('isUserLogged').and.callFake(angular.noop)
    };

    var fakeDatalayerUtilsService = {
        updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
        sendDatalayerEvent: jasmine.createSpy(),
        updateDigitalDataWithQuadrigam: jasmine.createSpy(),
        updateDatalayerViewEvent: jasmine.createSpy(),
        setProcessAndStep: jasmine.createSpy(),
        updateDatalayerInfo: jasmine.createSpy()
    };

    var fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: { 'VIEW': 'view' },
        DIGITAL_DATA_PROCESS: {
            MODBAG: 'test'
        },
        DIGITAL_DATA_STEP: {
            MODBAG: 'test'
        }
    };

    var fakeMmBAppConstants = {
        QUADRIGAM: { 'MODAL_INFO_BAGGAGE': 'MODBAG' }
    };

    var fakeAncillariesInfo = {
        ancillariesAvailable: [
            'BAGGAGE'
        ],
        isAncillariesInTime: {
            isIntime: true
        },
        ancillaries: [
            {
                type: 'BAGGAGE'
            }
        ]
    };
    var sliceBaggage = {
        "passBaggages": [{
            "passengerType": "ADULT",
            "personalInfo": {
                "name": "SONIA",
                "surname": "MUNOZ",
                "birthDate": "26-11-1994"
            },
            "passengerId": "ADULT_01",
            "contactInfo": {
                "phone": "34686154789",
                "email": "SMUNOZ@LEDA-MC.COM",
                "phoneType": "MOBILE"
            },
            "ckiStatus": null,
            "emergencyContactInfo": {
                "name": "NOMBRE",
                "surname": "",
                "phone": "412414242424",
                "countryCode": "ES",
                "remark": ""
            },
            "optionalInformation": [

            ]
        }],
        'segments': [
            {
                'sliceId': 1
            }
        ]
    }

    var fakeSegment = {
        'segments': [{'sliceId': 1}]
    }

    let fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy(),
    };

    let fakeBundleBaggsPerFlight = {
        deleted: false,
        quantity: 2,
        subtype: 'test'
    }

    let fakeModel = {
        baggageInfo: [{
            segments: [{
                sliceBaggage: {
                    hold: {
                        totalUnits: 2,
                        totalglobal: 2
                    },
                    passBaggages: [{
                        baggageData: [{
                            subtype: 'test',
                            purchasedPieces: 1,
                        }]
                    }]
                }
            }]
        }]
    }

    beforeEach(() => {

        angular.mock.module('ib-MmB-manage-baggage-info-module', 'LocalStorageModule', ($provide) => {
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
        });
        inject((_$rootScope_, $controller, _localStorageService_) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorageService = _localStorageService_;
            localStorageService.set('ancillariesInfo', fakeAncillariesInfo);
            localStorageService.set('bundleBaggsPerFlight', fakeBundleBaggsPerFlight);
            controller = $controller('MmbManageBaggageInfoController', {
                $scope: $scope
            });
            controller.model = fakeModel;
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                return {
                    'result': {
                        'then': (angular.noop, angular.noop)
                    }
                };
            });
        });
    });
    describe('when the onInit function is called', () => {
        it('and check all conditions', (done) => {
            controller.ancillariesInfo = fakeAncillariesInfo;
            controller.$onInit();
            expect(controller.activeLink).toBeTrue();
            done();
        });

    });
    describe('when the openModalConditions function is called', () => {
        it('and show modal correctly', (done) => {
            controller.openModalConditions(fakeEvent, sliceBaggage);
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
            done();
        });
    });
    describe('when the isActiveLink function is called', () => {
        it('and return true', (done) => {
            controller.slicesAncillaries = [
                {
                    'id': 1,
                    'status': {
                        'code': 'AVAILABLE'
                    }
                }
            ]
            expect(controller.isActiveLink(fakeSegment)).toBeTrue();
            done();
        });
        it('and return false', (done) => {
            expect(controller.isActiveLink(fakeSegment)).toBeFalse();
            done();
        });
    });
});
