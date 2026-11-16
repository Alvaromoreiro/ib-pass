describe('MainFooterController test', () => {

    let controller, $scope, $rootScope, localStorage, $controller;

    let fakeGetWcsPhonesService = {
        'getPhoneByCode': jasmine.createSpy()
    };

    let fakeMmBAppConstants = {
        'WCS': {
            'PHONE_TYPES': {
                'SALES': '910 555 101'
            }
        },
        'QUADRIGAM': {
            'CANCEL_FLIGHT_INV': 'TEST',
            'MODAL_ACCEPT_CHANGE_WITH_ONLY_ALTERNATIVE_TOTAL': 'TEST_2',
            'DISRUPTION_VOUCHER_REFUND_BEGGINING': 'TEST_3'
        }
    };

    let fakePhoneList = {
        RESERVAS: {
            'prefix': '(+34)',
            'telephone': '901 111 500',
            'text': 'Reservas y Venta:',
            'prefixAlt': '',
            'telephoneAlt': '',
            'textAlt': '',
            'timeText': '24h'
        }
    };

    beforeEach(() => {
        angular.mock.module('ib-mmb-main-footer-module', 'LocalStorageModule', ($provide) => {
            $provide.value('CommonsGetWcsPhonesService', fakeGetWcsPhonesService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });

        inject((_$controller_, _$rootScope_, _localStorageService_) => {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorage = _localStorageService_;
            controller = $controller('mainFooterController', {
                $scope: $scope,
                $rootScope: $rootScope,
            });
        });
        $rootScope.$digest();
    });

    describe('when activate() function is called', () => {
        beforeEach(inject((_localStorageService_) => {
            localStorage.set('phonesList', fakePhoneList);
            
        }));

        it('should set correct value properties', () => {
            $scope.$on('activate', (event, eventData) => {
                expect(controller.phonesList).toBe(fakePhoneList);
                // expect(controller.phoneNumber).toBe(fakePhoneList.RESERVAS.telephone);
                // expect(controller.prefix).toBe(fakePhoneList.RESERVAS.prefix);
            });
        });
    });

    describe('when updateInfoFooter() function is called', () => {
        beforeEach(inject((_localStorageService_) => {
            localStorage.set('phonesList', fakePhoneList);
            localStorage.set('qualifierBoolean', {});
        }));

        it('should set correct value properties', () => {
            controller.updateInfoFooter();
            expect(controller.qualifierBoolean).toEqual({});
            // expect(controller.phoneNumber).toBe(fakePhoneList.RESERVAS.telephone);
            // expect(controller.prefix).toBe(fakePhoneList.RESERVAS.prefix);
        });
    });

});
