import { CkiDataLayerService } from "@src/app/shared/services/ib-datalayer/services/ib-cki-datalayer-service";

describe('IbcoseModalDeepController test', () => {
    let $rootScope, $scope, $controller;
    const fake = {
        ModalService: {
            openGenericModal: jasmine.createSpy().and.callFake(() => {
                return { result: { then: angular.noop } };
            }),
            finishWaiting: jasmine.createSpy().and.callFake(() => {
                return { result: { then: angular.noop } };
            }),
            isWaiting: jasmine.createSpy().and.callFake(() => {
                return { result: { then: angular.noop } };
            }),
            afterLogin: jasmine.createSpy().and.callFake(() => {
                return { result: { then: angular.noop } };
            }),
            isNotWaiting: jasmine.createSpy().and.callFake(() => {
                return { result: { then: angular.noop } };
            })
        },
        IbSessionConfigService: {
            isUserLogged: jasmine.createSpy().and.callFake(angular.noop),
            initStorage: jasmine.createSpy().and.callFake(angular.noop)
        },
        IbUtilsService: {
            getDeviceType: jasmine.createSpy().and.callFake(angular.noop),
        },
        CkiDataLayerService: {
            addDigitalDataInfo: jasmine.createSpy().and.callFake(angular.noop)
        },
        CkiDatalayerConstants: {
            DIGITAL_DATA_INFO: {
                DEEPLINK: 'Deeplink'
            }
        },
        object: {
            externalMobileUrl: 'testExternalMobileUrl',
            externalUrl: 'testExternalUrl',
            externalCompany: {
                description: 'testDescription'
            },
            message: 'testMessage'
        },
        uibModalInstance: {
            dismiss: jasmine.createSpy()
        },
        sce: {
            trustAsHtml: jasmine.createSpy().and.returnValue(),
            getTrusted: jasmine.createSpy().and.callFake(() => { })
        },
        window: {
            location: {
                href: 'tets'
            }
        }
    };

    beforeEach(() => {
        angular.mock.module("ib-check-in-search", ($provide) => {
            $provide.value("ModalService", fake.ModalService);
            $provide.value('CkiDataLayerService', fake.CkiDataLayerService);
            $provide.value('CkiDatalayerConstants', fake.CkiDatalayerConstants);
            $provide.value('$sce', fake.sce);
            $provide.value('$uibModalInstance', fake.uibModalInstance);
            $provide.value('object', fake.object);
            $provide.value('$window', fake.window);
            $provide.value('IbSessionConfigService', fake.IbSessionConfigService);
            $provide.value('IbUtilsService', fake.IbUtilsService);
        });

        angular.mock.module('ib-check-in-search');

        inject((_$controller_, _$rootScope_) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $controller = _$controller_("IbcoseModalDeepController as vm", {
                $rootScope : $rootScope,
                $scope: $scope,
            });
        });
    });

    describe('when IbUtilsService getDeviceType() is equal to mobile', () => {
        beforeEach(inject((_$controller_) => {
            fake.IbUtilsService.getDeviceType = jasmine.createSpy('getDeviceType').and.callFake(() => {
                return 'mobile';
            });

            $controller = _$controller_('IbcoseModalDeepController', {
                $uibModalInstance: fake.uibModalInstance,
                object: fake.object
            });
            $scope.$digest();
        }));

        it('url should be testExternalMobileUrl', (done) => {
            $controller.openurl();
            expect($controller.url).toBe('testExternalMobileUrl');
            done();
        });
    });

    describe('when IbUtilsService getDeviceType() is not equal to mobile', () => {
        beforeEach(inject((_$controller_) => {
            fake.IbUtilsService.getDeviceType = jasmine.createSpy('getDeviceType').and.callFake(() => {
                return 'test';
            });

            $controller = _$controller_('IbcoseModalDeepController', {
                $uibModalInstance: fake.uibModalInstance,
                object: fake.object
            });
            $scope.$digest();
        }));

        it('url should be testExternalUrl', () => {
            $controller.openurl();
            expect($controller.url).toBe('testExternalUrl');
        });
    });

    describe('when close', () => {
        beforeEach(inject((_$controller_) => {
            $controller = _$controller_('IbcoseModalDeepController', {
                $uibModalInstance: fake.uibModalInstance,
                object: fake.object
            });
            $scope.$digest();
        }));

        it('$uibModalInstance dimiss should be called', (done) => {
            $controller.close();
            expect(fake.uibModalInstance.dismiss).toHaveBeenCalled();
            done();
        });
    });

    describe('when deeplinkDigitalData is called', () => {

        it('should call CkiDataLayerService.addDigitalDataInfo with the correct data when source has 2 or more characters', () => {
            // Mock data
            $scope.vm.model = {
                externalCompany: {
                    code: 'AA'
                }
            };

            // Call the function
            $scope.vm.deeplinkDigitalData();

            // Create digital_data
            var digital_data = {};
            digital_data[fake.CkiDatalayerConstants.DIGITAL_DATA_INFO.DEEPLINK] = 'AA';

            expect(fake.CkiDataLayerService.addDigitalDataInfo).toHaveBeenCalledWith(digital_data);
        });

    });

});
