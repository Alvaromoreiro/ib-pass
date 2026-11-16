import angular from 'angular';


describe('GenericModalController', () => {
    let controller;
    let $rootScope;
    let localStorageServiceMock;
    let scope, controllerDependencies;

    const mockObject = {
        idModal: 'MODAL_ID',
        isPassenger: false
    };

    let lsStore;
    const resetLS = () => {
        lsStore = {
            flowApp: 'TEST',
            loadingNextFlow: 1,
            userLogged: true,
            originDestination: { destinationCity: { description: 'Madrid' } },
            cashAviosPossibilities: [{ offerAvailable: true, totalDiscount: 50 }],
            CalculatedPoints: { Avios: 1000, Elite: 500 },
            commercialData: { currency: { recommendedDisplay: 'symbol', symbol: '€', code: 'EUR' } },
            customerData: {
                personalInfo: { name: 'User', partnersInfoBKI: [{ isSelected: true }, { isSelected: false }] },
                generalInfo: { aviosTransformed: '2000', category: 'Gold' }
            }
        };
    };

    localStorageServiceMock = {
        get: jasmine.createSpy('get').and.callFake((key) => (key in lsStore ? lsStore[key] : null)),
        set: jasmine.createSpy('set').and.callFake((key, value) => { lsStore[key] = value; })
      };
  

    const fakeCommonsConstants = {
        APP: {
            GIFTCARD: {
                NAME: 'GIFTCARDS'
            },
        }
    };

    const fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: {
            MODAL: 'modal'
        }
    };

    const fakeDatalayerUtilsService = {
        sendDatalayerModalEvent: jasmine.createSpy('sendDatalayerModalEvent'),
        removeDatalayerModalAttrs: jasmine.createSpy('removeDatalayerModalAttrs')
    };

    const fakeRedirectionService = {
        externalRedirect: jasmine.createSpy('externalRedirect')
    };

    const fake$uibModalInstance = {
        result: {
            then: jasmine.createSpy('then')
        },
        dismiss: jasmine.createSpy('dismiss'),
        close: jasmine.createSpy('close')
    };
    let fakeCommonsUserUtilsService: CommonsUserUtilsServiceMock;
    class CommonsUserUtilsServiceMock {
        isSoftUser = jasmine.createSpy( 'isSoftUser' ).and.returnValue( true );
    }
    const fakeFilter = jasmine.createSpy().and.callFake(() => () => 'https://test.com');

    beforeEach(() => {
        resetLS();
        fakeCommonsUserUtilsService = new CommonsUserUtilsServiceMock();
        angular.mock.module('ib-commons-modal-service-module', ($provide) => {
            $provide.value('$uibModalInstance', fake$uibModalInstance);
            $provide.value('localStorageService', localStorageServiceMock);
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('RedirectionService', fakeRedirectionService);
            $provide.value('DatalayerConstants', fakeDatalayerConstants);
            $provide.value('CommonsConstants', fakeCommonsConstants);
            $provide.value('$filter', fakeFilter);
            $provide.value('CommonsUserUtilsService', fakeCommonsUserUtilsService);
        });

        inject(($controller, _$rootScope_) => {
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            spyOn($rootScope, '$on').and.callThrough();
            controllerDependencies = {
                $rootScope,
                $uibModalInstance: fake$uibModalInstance,
                object: mockObject,
                DatalayerUtilsService: fakeDatalayerUtilsService,
                RedirectionService: fakeRedirectionService,
                $filter: fakeFilter,
                DatalayerConstants: fakeDatalayerConstants,
                CommonsConstants: fakeCommonsConstants,
                CommonsUserUtilsService: fakeCommonsUserUtilsService
            }

            controller = $controller('GenericModalController', controllerDependencies);
        });
    });

    describe('$onInit()', () => {
        it('should call sendDatalayerModalEvent with idModal', () => {
            controller.$onInit();
            expect(fakeDatalayerUtilsService.sendDatalayerModalEvent).toHaveBeenCalledWith('MODAL_ID');
        });

        it('should fallback to model when idModal is missing', () => {
            controller.model = { key: 'value' };
            controller.$onInit();
            expect(fakeDatalayerUtilsService.sendDatalayerModalEvent).toHaveBeenCalledWith(controller.model);
        });
    });

    describe('accept()', () => {
        it('should close the modal with a type', () => {
            const type = { type: 'test' };
            controller.accept(type);
            expect(fake$uibModalInstance.close).toHaveBeenCalledWith(type);
        });
    });

    describe('acceptBuyAvios()', () => {
        it('should redirect and close modal', () => {
            controller.acceptBuyAvios();
            expect(fakeRedirectionService.externalRedirect).toHaveBeenCalledWith('https://test.com');
            expect(fake$uibModalInstance.dismiss).toHaveBeenCalled();
        });
    });

    describe('keepAliveCloseReloadFlow()', () => {
        it('should set refresh flag and close modal', () => {
            controller.keepAliveCloseReloadFlow();
            expect($rootScope.keepAliveRefreshFlow).toBeTrue();
            expect(fake$uibModalInstance.dismiss).toHaveBeenCalled();
        });
    });

    describe('showDestinationCity()', () => {
        beforeEach(() => {
            spyOn(controller as any, 'updateDestinationCity').and.callThrough();
            spyOn(controller as any, 'updatePlaneMessage').and.callThrough();
            spyOn(controller as any, 'updateLoggedUser').and.callThrough();
        });

        it('should update and show destinationCity if availability is true', () => {
            controller.model.userData = {
                isAvailability: true,
                destinationCity: 'Madrid',
                isLogged: false,
                isPassenger: false
            };
            const result = controller.showDestinationCity('Barcelona');
            expect(result).toBeTrue();
            expect(controller.destinationCity).toBe('Barcelona');
        });

        it('should fallback to model.userData.destinationCity if input is empty', () => {
            controller.model.userData = {
                isAvailability: true,
                destinationCity: 'Sevilla',
                isLogged: false,
                isPassenger: false
            };
            const result = controller.showDestinationCity('');
            expect(result).toBeTrue();
            expect(controller.destinationCity).toBe('Sevilla');
        });
    });


    describe('updateLoggedUser', () => {
        it('should set isLogguedUser to true if logged and has name', () => {
            controller.model.userData = {
                isLogged: true,
                name: 'Carlos'
            };
            (controller as any).updateLoggedUser();
            expect(controller.isLogguedUser).toBeTrue();
        });

    });

    describe('cases', () => {
        it('sets isPassenger when loadingNextFlow = 2', () => {
          localStorageServiceMock.set('loadingNextFlow', 2);
          controller.model = {};
          controller.showInfoWaitingModal();
          expect(controller.model.userData.isPassenger).toBeTrue();
        });
      
        it('sets isAncillaries when loadingNextFlow = 3', () => {
          localStorageServiceMock.set('loadingNextFlow', 3);
          controller.model = {};
          localStorageServiceMock.set('userData')
          controller.showInfoWaitingModal();
          expect(controller.model.userData.isAncillaries).toBeTrue();
        });
      
        it('sets isPayments when loadingNextFlow = 4', () => {
          localStorageServiceMock.set('loadingNextFlow', 4);
          controller.model = {};
          controller.showInfoWaitingModal();
          expect(controller.model.userData.isPayments).toBeTrue();
        });
      
        it('defaults to isAvailability when loadingNextFlow is unknown', () => {
          localStorageServiceMock.set('loadingNextFlow', undefined);
          controller.model = {};
          controller.showInfoWaitingModal();
          expect(controller.model.userData.isAvailability).toBeTrue();
        });

      });

      describe('cashAvios / points cases', () => {
        beforeEach(() => {
          localStorageServiceMock.set('userLogged', true);
          controller.model = {};
        });
      
        xit('should chose previous offer if last is not available', () => {
          localStorageServiceMock.set('cashAviosPossibilities', [
            { offerAvailable: false, totalDiscount: 10 }, 
            { offerAvailable: true,  totalDiscount: 20 },
            { offerAvailable: false, totalDiscount: 30 } 
          ]);
          localStorageServiceMock.set('commercialData', { currency: { recommendedDisplay: 'symbol', symbol: '€', code: 'EUR' } });
      
          controller.showInfoWaitingModal();
      
          expect(controller.model.userData.cashAviosPossibilities.bestOfferAvailable.totalDiscount).toBe(20);
        });
      
        xit('should use currency code if recommendedDisplay is "code"', () => {
          localStorageServiceMock.set('cashAviosPossibilities', [
            { offerAvailable: true, totalDiscount: 50 }
          ]);
          localStorageServiceMock.set('commercialData', {
            currency: { recommendedDisplay: 'code', code: 'EUR', symbol: '€' }
          });
      
          controller.model = {};
          controller.showInfoWaitingModal();
      
          expect(controller.model.userData.cashAviosPossibilities.currency).toBe('EUR');
        });
      
        xit('should load earn message', () => {
            localStorageServiceMock.set('userLogged', true);
            localStorageServiceMock.set('cashAviosPossibilities', []);
            localStorageServiceMock.set.calls.reset();
          
            controller.model = {};
            controller.showInfoWaitingModal();
          
            expect(controller.model.userData.discountMessage).toBeFalse();
            expect(controller.model.userData.earnMessage).toBeTrue();
            expect(localStorageServiceMock.set).toHaveBeenCalledWith('loadingEarnMessage', true);
          });
          
      });

      xit('should use eventCustomerData if provided', () => {
        const eventCustomerData = {
          personalInfo: {
            name: 'eventTest',
            partnersInfoBKI: [
              { isSelected: false },
              { isSelected: true, partnerId: 'P1' }
            ]
          },
          generalInfo: {
            aviosTransformed: '1234',
            category: 'Gold'
          }
        };
    
        controller.model = {};
        controller.showInfoWaitingModal(null, eventCustomerData);
    
        const data = controller.model.userData;
        expect(data.name).toBe('eventTest');
        expect(data.selectedParner).toEqual(jasmine.objectContaining({ isSelected: true }));
        expect(data.avios).toBe('1234');
        expect(data.category).toBe('Gold');
      });
    
      xit('should use $rootScope.customerData when no event payload', () => {
        $rootScope.customerData = {
          personalInfo: {
            name: 'rootScopeTest',
            partnersInfoBKI: null
          },
          generalInfo: {
            aviosTransformed: '777',
            category: 'Silver'
          }
        };
    
        controller.model = {};
        controller.showInfoWaitingModal();
    
        const data = controller.model.userData;
        expect(data.name).toBe('rootScopeTest');
        expect(data.selectedParner).toBeNull();
        expect(data.avios).toBe('777');
        expect(data.category).toBe('Silver');
    
        delete $rootScope.customerData;
      });
    })