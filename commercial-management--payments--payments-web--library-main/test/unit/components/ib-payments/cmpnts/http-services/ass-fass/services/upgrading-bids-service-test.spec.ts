describe('Test of PmtUgradingBidService', ()=>{
    let pmtUpgradingBidService, rootScope, scope, localStorageService;
    let fakePmtConstants = { SERVICE_WAITING_TIMES: {
        ISSUE_INFO_WAITING_TIME_INTERVAL: 3000,
        ISSUE_INFO_K0_WAITING_TIME: 30000,
        ISSUE_INFO_OK_WAITING_TIME: 60000
    }};
    let fakeData = {
        code: 200,
        paymentStatus: 200,
        errorCode: null,
        failedToDelete : []  
    };

    let fakeQ = { 'defer': jasmine.createSpy('defer') };
    let fakeTimeout = {};
    let fakePmtHttpErrorFilter = {'errorHandlerFactory': jasmine.createSpy('errorHandlerFactory')};   
    let fakePmtEndPointsFilterService = {'getEndPointIssue': jasmine.createSpy('getEndpointIssue').and.returnValue('endPoint')};
    let fakePmtUpgradingBidProxy = {'upgradingBidOrder': jasmine.createSpy('upgradingBidOrder'),
        'getUpgradingBidInfoBy3dsPay': jasmine.createSpy('getUpgradingBidInfoBy3dsPay')};
    let fakeCommonsAncillariesService = {'deleteAllAncillaries': jasmine.createSpy('deleteAllAncillaries')};
    let fakePmtDatalayerConstants = {
        DATALAYER_MODAL_ID: { 
            STATE: { 
                BLANKSPACE: ' '
            },
            PAYMENT_ERRORS: { 
                MANAGEMYBOOKING_VOLUNTARY_CHANGES: {
                    CREDITCARD_DENIED: 'ATCCCDN',
                    CREDITCARD_REJECT: 'ATCREJC',
                    CREDITCARD_PCC: 'ATCPCC'
                }
            }
        }};

    beforeEach(()=>{
        angular.mock.module('ib-pmt-services-http-module', 'LocalStorageModule', ($provide) => {
            $provide.value('PmtUpgradingBidProxy', fakePmtUpgradingBidProxy);
            $provide.value('PmtConstants', fakePmtConstants);
            $provide.value('$timeout', fakeTimeout);
            $provide.value('PmtHttpErrorFilter', fakePmtHttpErrorFilter);
            $provide.value('pmtEndPointsFilterService', fakePmtEndPointsFilterService);
            $provide.value('PmtDatalayerConstants', fakePmtDatalayerConstants);
            $provide.value('CommonsAncillariesService', fakeCommonsAncillariesService);
        });

        inject((_PmtUpgradingBidService_, _localStorageService_, $rootScope)=>{
            pmtUpgradingBidService = _PmtUpgradingBidService_;
            localStorageService = _localStorageService_;
            rootScope = $rootScope;
            scope = $rootScope.$new();
            $rootScope.$apply();
        });
    });
    
    describe('when the upgradingBidOrder is called', ()=> {

        it('should make a promise if isRecall === 3ds2OneSite and UPG_BIDS_AVIOS is false', (done)=>{
            pmtUpgradingBidService.defer = {
                'promise': 'promise',
                'resolve': jasmine.createSpy('resolve')
            };
            fakePmtUpgradingBidProxy.getUpgradingBidInfoBy3dsPay = jasmine.createSpy('getUpgradingBidInfoBy3dsPay').and.callFake(() => {
                return Promise.resolve(fakeData);
            });
            localStorageService.set('UPG_BIDS_AVIOS', false);
            expect(pmtUpgradingBidService.upgradingBidOrder('test', 'test', 'test', '3ds2OneSite')).toBeDefined();
            done();
        });

        it('should make a promise if isRecall === 3ds2OneSite and UPG_BIDS_AVIOS is true and delete is error', (done)=>{
            pmtUpgradingBidService.defer = {
                'promise': 'promise',
                'resolve': jasmine.createSpy('resolve')
            };
            fakePmtUpgradingBidProxy.getUpgradingBidInfoBy3dsPay = jasmine.createSpy('getUpgradingBidInfoBy3dsPay').and.callFake(() => {
                return Promise.resolve(fakeData);
            });
            fakeCommonsAncillariesService.deleteAllAncillaries = jasmine.createSpy('deleteAllAncillaries').and.callFake(() => {
                return Promise.reject({});
            });
            localStorageService.set('UPG_BIDS_AVIOS', true);
            expect(pmtUpgradingBidService.upgradingBidOrder('test', 'test', 'test', '3ds2OneSite')).toBeDefined();
            done();
        });

        it('should make a promise if isRecall === 3ds2OneSite and UPG_BIDS_AVIOS is true and delete is success', (done)=>{
            pmtUpgradingBidService.defer = {
                'promise': 'promise',
                'resolve': jasmine.createSpy('resolve')
            };
            fakePmtUpgradingBidProxy.getUpgradingBidInfoBy3dsPay = jasmine.createSpy('getUpgradingBidInfoBy3dsPay').and.callFake(() => {
                return Promise.resolve(fakeData);
            });
            const fakeDelete = {
                code: 200,
                paymentStatus: 200,
                errorCode: null,
                failedToDelete : [{
                    error: {
                        code: 200,
                        description: 'Error test'
                    }
                }]
            }; 
            fakeCommonsAncillariesService.deleteAllAncillaries = jasmine.createSpy('deleteAllAncillaries').and.callFake(() => {
                return Promise.resolve(fakeDelete);
            });
            localStorageService.set('UPG_BIDS_AVIOS', true);
            expect(pmtUpgradingBidService.upgradingBidOrder('test', 'test', 'test', '3ds2OneSite')).toBeDefined();
            done();
        });
        
        it('should make a promise if isRecall !== 3ds2OneSite and upgradingBidOrder is success', (done)=>{
            pmtUpgradingBidService.defer = {
                'promise': 'promise',
                'resolve': jasmine.createSpy('resolve')           
            };
            fakePmtUpgradingBidProxy.upgradingBidOrder = jasmine.createSpy('upgradingBidOrder').and.callFake(() => {
                return Promise.resolve(fakeData);
            });
            expect(pmtUpgradingBidService.upgradingBidOrder('test', 'test', 'test', 'false')).toBeDefined();
            done();
        });

        it('should make a promise if isRecall !== 3ds2OneSite and upgradingBidOrder is error whith error code 417', (done)=>{
            pmtUpgradingBidService.defer = {
                'promise': 'promise',
                'resolve': jasmine.createSpy('resolve')           
            };
            const fakeBidOrder = {
                code: 500,
                paymentStatus: 100,
                errorCode: 417,
                failedToDelete : [],
                data: {
                    errors: [{
                        code: 'PMT_PPM_8009'
                    },
                    {
                        code: 'PMT_PPM_8015'
                    },
                    {
                        code: 'PMT_PPM_8014'
                    }]
                }
            }; 
            fakePmtUpgradingBidProxy.upgradingBidOrder = jasmine.createSpy('upgradingBidOrder').and.callFake(() => {
                return Promise.reject(fakeBidOrder);
            });
            expect(pmtUpgradingBidService.upgradingBidOrder('test', 'test', 'test', 'false')).toBeDefined();
            done();
        });
    });
});