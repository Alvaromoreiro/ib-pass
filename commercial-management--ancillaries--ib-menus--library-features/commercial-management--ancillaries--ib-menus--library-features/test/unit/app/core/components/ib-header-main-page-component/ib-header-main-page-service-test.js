// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);

describe('ibHeaderMainPageServiceModel', () => {
    let ibHeaderMainPageServiceModel;
    let localStorageService;
    let $rootScope;
    let CommonsUserUtilsService;
    let $injector;

    const marketsMock = [
        { code: 'ES', description: 'España' },
        { code: 'GB', description: 'United Kingdom' }
    ];
    const languagesMock = [
        { code: 'es', description: 'Español' },
        { code: 'en', description: 'English' }
    ];

    beforeEach(() => {
        angular.mock.module(
            'ib-header-main-page-component-module',
            'LocalStorageModule',
            ($provide) => {
                $provide.value('CommonsUserUtilsService', {
                    isSoftUser: jasmine.createSpy('isSoftUser').and.returnValue(false),
                    isIbZero: jasmine.createSpy('isIbZero').and.returnValue(false)
                });
            }
        );

        inject((_$injector_) => {
            $injector = Object.keys(_$injector_).reduce((clone, key) => {
                clone[key] = _$injector_[key];
                return clone;
            }, {});
            ibHeaderMainPageServiceModel = $injector.get('ibHeaderMainPageServiceModel');
            localStorageService = $injector.get('localStorageService');
            $rootScope = $injector.get('$rootScope');
            CommonsUserUtilsService = $injector.get('CommonsUserUtilsService');

            $rootScope.appMarket = 'ES';
            $rootScope.appLang = 'es';

            const ibHeaderMainPageConstants = $injector.get('ibHeaderMainPageConstants');
            ibHeaderMainPageConstants.languagesWcs = { es: languagesMock };
            ibHeaderMainPageConstants.marketsWcs = marketsMock;
        });
    });

    afterEach(() => {
        localStorageService.clearAll();
    });

    it('should be defined', () => {
        expect(ibHeaderMainPageServiceModel).toBeDefined();
    });

    describe('initializeMainPageHeader', () => {

        describe('when user is a soft user', () => {
            beforeEach(() => {
                CommonsUserUtilsService.isSoftUser.and.returnValue(true);
            });

            it('should return customerData as null and logged as null', () => {
                const result = ibHeaderMainPageServiceModel.initializeMainPageHeader();
                expect(result.customerData).toBeNull();
                expect(result.logged).toBeNull();
            });

            it('should NOT throw', () => {
                expect(() => {
                    ibHeaderMainPageServiceModel.initializeMainPageHeader();
                }).not.toThrow();
            });
        });

        describe('when user is not logged (no customerData nor membershipData in storage)', () => {
            beforeEach(() => {
                CommonsUserUtilsService.isSoftUser.and.returnValue(false);
                localStorageService.remove('customerData');
                localStorageService.remove('membershipData');
            });

            // This is the exact scenario that caused the TypeError crash
            it('should NOT throw a TypeError when storage is empty', () => {
                expect(() => {
                    ibHeaderMainPageServiceModel.initializeMainPageHeader();
                }).not.toThrow();
            });

            it('should return customerData as null and logged as null', () => {
                const result = ibHeaderMainPageServiceModel.initializeMainPageHeader();
                expect(result.customerData).toBeNull();
                expect(result.logged).toBeNull();
            });
        });

        describe('when customerData is in storage (hard user)', () => {
            const customerDataMock = {
                personalInfo: { name: 'John', surname1: 'Doe', contactEmail: 'john@iberia.com' },
                generalInfo: { aviosTransformed: 5000 }
            };

            beforeEach(() => {
                CommonsUserUtilsService.isSoftUser.and.returnValue(false);
                CommonsUserUtilsService.isIbZero.and.returnValue(false);
                localStorageService.set('customerData', customerDataMock);
            });

            it('should return the customer name built from personalInfo', () => {
                const result = ibHeaderMainPageServiceModel.initializeMainPageHeader();
                expect(result.customerData.name).toBe('John Doe');
            });

            it('should return avios when user is not ibZero', () => {
                const result = ibHeaderMainPageServiceModel.initializeMainPageHeader();
                expect(result.customerData.avios).toBe(5000);
            });

            it('should return avios as null when user is ibZero', () => {
                CommonsUserUtilsService.isIbZero.and.returnValue(true);
                const result = ibHeaderMainPageServiceModel.initializeMainPageHeader();
                expect(result.customerData.avios).toBeNull();
            });

            it('should use contactEmail as fallback when name is absent', () => {
                localStorageService.set('customerData', {
                    personalInfo: { name: '', surname1: 'Doe', contactEmail: 'john@iberia.com' },
                    generalInfo: { aviosTransformed: 0 }
                });
                const result = ibHeaderMainPageServiceModel.initializeMainPageHeader();
                expect(result.customerData.name).toBe('john@iberia.com Doe');
            });

            it('should set logged to true', () => {
                const result = ibHeaderMainPageServiceModel.initializeMainPageHeader();
                expect(result.logged).toBe(true);
            });
        });

        describe('when membershipData is in storage (ONB user)', () => {
            const membershipDataMock = {
                userInfo: { firstName: 'Jane', lastName: 'Smith', email: 'jane@iberia.com' }
            };

            beforeEach(() => {
                CommonsUserUtilsService.isSoftUser.and.returnValue(false);
                localStorageService.remove('customerData');
                localStorageService.set('membershipData', membershipDataMock);
            });

            it('should return the customer name from membershipData', () => {
                const result = ibHeaderMainPageServiceModel.initializeMainPageHeader();
                expect(result.customerData.name).toBe('Jane Smith');
            });

            it('should use email as fallback when firstName is absent', () => {
                localStorageService.set('membershipData', {
                    userInfo: { firstName: '', lastName: '', email: 'jane@iberia.com' }
                });
                const result = ibHeaderMainPageServiceModel.initializeMainPageHeader();
                expect(result.customerData.name).toBe('jane@iberia.com');
            });

            it('should return avios as null', () => {
                const result = ibHeaderMainPageServiceModel.initializeMainPageHeader();
                expect(result.customerData.avios).toBeNull();
            });

            it('should set logged to true', () => {
                const result = ibHeaderMainPageServiceModel.initializeMainPageHeader();
                expect(result.logged).toBe(true);
            });
        });
    });
});
