describe('MmbDoubtsAndRightsVertController test', () => {
    let localStorage, controller, $controller, $rootScope, $scope;
    let fakeMmBUtilService = {
        isUserLogged: jasmine.createSpy()
    };
    let fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy(),
        'sendDatalayerEvent': jasmine.createSpy(),
        'setProcessAndStep': jasmine.createSpy(),
        'updateDatalayerInfo': jasmine.createSpy()
    };
    let fakeMmBAppConstants = {
        QUADRIGAM: {
            FLEXIBILIZATION_VOUCHER_REFUND_INFO: 'RVFSMB',
            FLEXIBILIZATION_VOUCHER_REFUND_CONDITIONS: 'RVFTYC',
            DISRUPTION_VOUCHER_REFUND_INFO: 'RVDSMB',
        }
    };
    let fakeRedirectionService = {
        externalRedirect: jasmine.createSpy(),
        newNavigation: jasmine.createSpy(),
    };
    let fakeMmBModalService = {
        'showGenericModal': jasmine.createSpy().and.returnValue({
            result: Promise.resolve()
        }),
    };

    let fakeVoucherList = [
        {
            'validityDate': '10-10-2022',
            'flightDateLimit': '10-11-2022'
        },
        {
            'validityDate': '10-10-2023',
            'flightDateLimit': '10-11-2023'
        }
    ];

    let $fakeFilter = jasmine.createSpy('$filter').and.callFake((filter) => {
        let filterFunc: any = () => {
            return [];
        };
        switch (filter) {
            case 'translate':
                filterFunc = () => {
                    return 'Translated Text';
                };
                break;
            case 'LinksFilter':
                filterFunc = () => {
                    return 'Linked Text';
                };
                break;
            default:
                break;
        }

        return filterFunc;
    });

    beforeEach(() => {
        angular.mock.module('ib-MmB-doubts-and-rights-vert-module', 'LocalStorageModule', ($provide) => {
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('RedirectionService', fakeRedirectionService);
            $provide.value('$filter', $fakeFilter);
        });

        inject((_$controller_, _$injector_, _localStorageService_, _$rootScope_) => {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorage = _localStorageService_;
            localStorage.set('voucherList', fakeVoucherList);

            controller = $controller('MmbDoubtsAndRightsVertController', {
                $scope: $scope,
            });
        });
    });

    it('Should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('Should call $onInit', () => {
        controller.$onInit();
        expect(controller.voucherValidity).toEqual(fakeVoucherList);
    });

    describe('should call $onInit with dateLimit', () => {
        let fakeVoucherListCopy = {...fakeVoucherList};
        fakeVoucherListCopy[0].flightDateLimit = '2022-08-17';
        beforeEach(() => {
            localStorage.set('voucherList', fakeVoucherListCopy);
        })

        it('MmbDoubtsAndRightsVertController should call $onInit', () => {
            controller.$onInit();
            expect(controller.voucherValidity[0].flightDateLimit).toEqual('2022-08-17');
        });
        it('and showVoucherTermsAndConditions()', () => {
            controller.showVoucherTermsAndConditions();
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
        });

    });
    describe('Should call showVoucherConditions and linkToTermsAndConditions without disruption and without orderFlags', () => {
        it('and showVoucherConditions()', () => {
            controller.showVoucherConditions();
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
        });
        it('and linkToTermsAndConditions()', () => {
            controller.flags = {}
            controller.linkToTermsAndConditions();
            expect(fakeRedirectionService.newNavigation).toHaveBeenCalled();
        });
    });
    describe('Should call showVoucherConditions and linkToTermsAndConditions without disruption and with orderFlags', () => {
        it('and showVoucherConditions()', () => {
            controller.showVoucherConditions();
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
        });
        it('and linkToTermsAndConditions()', () => {
            controller.flags = {refundVoucherSection80: true};
            controller.linkToTermsAndConditions();
            expect(fakeRedirectionService.newNavigation).toHaveBeenCalled();
        });
    });
    describe('Should call showVoucherConditions and linkToTermsAndConditions with disruption and orderFlags', () => {
        beforeEach(() => {
            localStorage.set('bookingInfo', {genericDisruptionCapabilitiesInformation: true});
            localStorage.set('orderFlags', {refundVoucherSection80: true});
            controller.$onInit();
        });
        it('and showVoucherConditions()', () => {
            controller.showVoucherConditions();
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
        });
        it('and linkToTermsAndConditions()', () => {
            controller.linkToTermsAndConditions();
            expect(fakeRedirectionService.newNavigation).toHaveBeenCalled();
        });
        it('and linkToTermsAndConditions()', () => {
            controller.linkToTermsAndConditions();
            expect(fakeRedirectionService.newNavigation).toHaveBeenCalled();
        });
        afterEach(() => {localStorage.remove('bookingInfo'); localStorage.remove('orderFlags');});
    });

    describe('Should call showVoucherConditions and linkToTermsAndConditions with disruption without orderFlags', () => {
        beforeEach(() => {
            localStorage.set('bookingInfo', {genericDisruptionCapabilitiesInformation: true});
            controller.$onInit();
        });

        it('and linkToTermsAndConditions()', () => {
            controller.linkToTermsAndConditions();
            expect(fakeRedirectionService.newNavigation).toHaveBeenCalled();
        });

        afterEach(() => {localStorage.remove('bookingInfo');});
    });

});
