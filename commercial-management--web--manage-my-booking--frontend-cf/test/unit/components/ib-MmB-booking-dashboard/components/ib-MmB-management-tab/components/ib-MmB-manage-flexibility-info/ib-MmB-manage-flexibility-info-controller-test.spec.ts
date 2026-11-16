describe('MmbManageFlexibilityInfoController test', () => {
    var controller, $scope, $rootScope, $q, localStorage, $filter;

    var fakeMmBModalService = {
        showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(() => {
            return {
                'result': {
                    'then': (angular.noop, angular.noop)
                }
            };
        }),
        showGenericInfoModal : jasmine.createSpy('showGenericInfoModal').and.callFake(() => {
            return {
                'result': {
                    'then': (angular.noop, angular.noop)
                }
            };
        }),
        showWaitingModal:jasmine.createSpy(),
        finishWaiting:jasmine.createSpy(),
        showGenericError: jasmine.createSpy('showGenericError').and.callFake(() => {
            return {
                'result': {
                    'then': () => {}
                }
            };
        }),
    };
    var fakeBookingInfo = {
        'flowId':'TWFuYWdlTXlCb29raW5nQElCNmU1NzgyZjg1ODVhNDIzM2EwZDJkOTdiZDkxODFjOTg%3D',
        'orderFlags':[
            {
                type: 'VOUCHER_REFUND_ON_DEMAND',
                enabled: true
            }
        ]
    };

    var segmentInfo = [
    {
        'type':'CONFIRMED',
        'mmbAllowed':true,
        'ckiStatus':{'code':'CHECKABLE','message':null},
        'noShow':false,
        'flyNow':false,
        'flown':false,
        'departure':{
            'code':'MAD',
            'name':'BARAJAS',
            'terminal':'4',
            'city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}
        },
        'arrival':{
            'code':'FCO',
            'name':'FIUMICINO',
            'terminal':'3',
            'city':{'code':'ROM','description':'Roma','countryCode':'IT','country':{'code':'IT','description':'Italia'}}
        },
        'departureCity':{'code':'MAD','description':'Madrid','countryCode':'ES','timeZone':'Europe/Madrid'},
        'arrivalCity':{'code':'ROM','description':'Roma','countryCode':'IT','timeZone':'Europe/Rome'},
        'flight':{
            'marketingCarrier':{'code':'IB','name':'Iberia'},
            'operationalCarrier':{'code':'IB','name':'Iberia'},
            'marketingFlightNumber':'3230',
            'operationalFlightNumber':'3230',
            'operationalDisclosure':'IB',
            'aircraft':{'code':'320','description':'Airbus A320'}
        },
        'cabin':{'rbd':'A','description':'','remainingSeats':9,'fareFamily':'TBAESEU','code':'R','type':'ECONOMY','bookingClass':'ECONOMY'},
        'overnight':false,
        'id':'IB323020210315',
        'duration':150,
        'waitingTime':0,
        'operatorLocator':null,
        'stop':null,
        'departureDateTime':'2021-03-15 09:05',
        'departureUtcDateTime':'2021-03-15T08:05:00.000',
        'arrivalDateTime':'2021-03-15 11:35',
        'arrivalUtcDateTime':'2021-03-15T10:35:00.000',
        'status':{'code':'HK','description':'Confirmado'}
    }];
    var model = [
        {
            segments:[
                {
                    segmentId:'IB323020210315',
                    destination:'',
                    origin: ''
                }
            ]
        }
    ];
    var flags = [
        {
            flags:[
                {
                    type:'FLIGHT_MODIFICATION_ON_DEMAND',
                    enabled:true
                },
            ]
        }
    ];
    var tabs = {
        tabs:{
            refunds: true,
            changeFlights: true
        }
    };
    var fakeAncillariesInfo ={
        ancillariesAvailable:[
            'VOUCHER_REFUND'
        ],
        isAncillariesInTime:{
            isIntime:true
        }
    };
    

    var faketranslate = {
        'onReady': jasmine.createSpy(),
        'storageKey': jasmine.createSpy('storageKey').and.callFake(() => { }),
        'storage': jasmine.createSpy('storage').and.callFake(() => { }),
        'preferredLanguage': jasmine.createSpy('preferredLanguage').and.callFake(() => { }),
        'use': jasmine.createSpy('use').and.callFake(() => { })
    };

    var $filterFake = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc = function () {
            return ('');
        };
        switch (filter) {
            case 'translate':
                filterFunc = function () {
                    return 'Translated Text';
                };
                break;
            default:
                break;
        }

        return filterFunc;
    });

    var fakeOrderFlags = [
        {
            type: 'VOUCHER_REFUND_ON_DEMAND',
            enabled: false
        }
    ]

    beforeEach(() => {
        angular.mock.module('ib-MmB-manage-flexibility-info-module', 'LocalStorageModule', ($provide) => {
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('$translate', faketranslate);
            $provide.value('$filter', $filterFake);
        });
        inject(function (_$rootScope_, $controller, _localStorageService_, _$q_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $q = _$q_;
            localStorage = _localStorageService_;
            localStorage.set('bookingInfo', fakeBookingInfo);
            localStorage.set('segmentsInfo', segmentInfo);
            controller = $controller('MmbManageFlexibilityInfoController', {
                $scope: $scope,
                $rootScope: $rootScope,
                $translate: faketranslate
            });
            controller.model = model;
            controller.flags = flags;
            controller.ancillariesInfo = fakeAncillariesInfo;
            controller.tabs = tabs;
            controller.orderFlags = fakeOrderFlags;
        });
    });

    describe('when the activate function is called', () => {
        it('And everything its ok', (done) =>  {
            controller.$onInit();
            done();
        });
    });
    describe('Function of controller', () => {
        it('openRefundFlowFromInfo', (done) =>  {
            controller.openRefundFlowFromInfo();
            done();
        });
        it('openChangeFlightsFlowFromInfo', (done) =>  {
            controller.openChangeFlightsFlowFromInfo();
            done();
        });
    });
    describe('openCallCenterModalFlex', () => {
        beforeEach(()=>{
            inject(($q) => {
                controller.clickToCallCenter = true;
            });
        });
        it('modalName === FLIGHT_CHANGE', (done) =>  {
            controller.openCallCenterModalFlex('FLIGHT_CHANGE');
            expect(fakeMmBModalService.showGenericInfoModal).toHaveBeenCalled();
            done();
        });
        it('modalName === \'VOUCHER_REFUND\'', (done) =>  {
            controller.openCallCenterModalFlex('VOUCHER_REFUND');
            expect(fakeMmBModalService.showGenericInfoModal).toHaveBeenCalled();
            done();
        });
        it('modalName === \'refunds\'', (done) =>  {
            controller.openCallCenterModalFlex('refunds');
            expect(fakeMmBModalService.showGenericInfoModal).toHaveBeenCalled();
            done();
        });
        it('modalName === \'refundsCallCenter\'', (done) =>  {
            controller.openCallCenterModalFlex('refundsCallCenter');
            expect(fakeMmBModalService.showGenericInfoModal).toHaveBeenCalled();
            done();
        });
    });
    describe('called openPackFlex() function', () => {
            inject(($q) => {
                fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(function () {
                    return {
                        'result': {
                            'then':() => {}
                        }
                    };
                });
            });
        it('percentage >= 100', (done) =>  {
            controller.openPackFlex({}, 100, true);
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
            done();
        });
        it('percentage < 100', (done) =>  {
            controller.openPackFlex({}, 99, false);
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
            done();
        });
    });
    
});
