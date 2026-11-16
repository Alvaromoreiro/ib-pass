describe('PassengersInfoController test', () => {

    var scope, localStorageService, controller, rootScope, $timeout, $location, $q;
    var mockPassengersInfo = {
        'companies': [
            { 'airlineName': { 'description': 'test', 'needsTranslate': true }, 'iataCompanyCode': 'test' },
            { 'airlineName': { 'description': 'test2', 'needsTranslate': false }, 'iataCompanyCode': 'test2' }
        ],
        'indexTab': 0,
        'passengersContactInfo': [{
            'ckiStatus': 'test',
            'contactInfo': { 'email': 'email@email.es', 'phone': '321313', 'phoneType': 'MOBILE' },
            'frequentFlyerInfo': { 'company': 'AA', 'number': '21212' },
            'passengerId': '1',
            'passengerType': 'ADULT',
            'personalInfo': { 'birthdate': null, 'name': 'nombre', 'surname': 'apellido' },
            'tickets': '12313-123132',
        }],
        'primaryContactInfo': { 'email': 'prim@es.com', 'phone': '123123', 'phoneType': 'MOBILE', 'status': true }
    };


    var fakePassengerInfoService = {
        generatePassengerData: jasmine.createSpy(),
        updateDataPassenger: jasmine.createSpy(),
        updateLocalPassengers: jasmine.createSpy('updateLocalPassengers').and.callFake(() => { }),
        updateDataContactInfo: jasmine.createSpy(),
        backPage: jasmine.createSpy()
    };

    var fakeMmBModalService = {
        showWaitingModal: jasmine.createSpy('showWaitingModal').and.callFake(() => { }),
        finishWaiting: jasmine.createSpy('finishWaiting').and.callFake(() => { }),
        showGenericError: jasmine.createSpy('showGenericError').and.callFake(() => {
            return { 'result': { 'then': () => { } } };
        }),
        'showGenericModal':jasmine.createSpy().and.callFake(function () {
            return {
                result: $q.when({})
            };
        })
    };

    let fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy(),
        'sendDatalayerEvent': jasmine.createSpy(),
        'updateDigitalDataWithQuadrigam': jasmine.createSpy('updateDigitalDataWithQuadrigam').and.callFake(function () { }),
        'updateDatalayerViewEvent': jasmine.createSpy('updateDatalayerViewEvent').and.callFake(function () { }),
        'setProcessAndStep': jasmine.createSpy(),
        'updateDatalayerInfo': jasmine.createSpy()
    };

    var fakeMmBAppConstants = {
        'PAGES_URL': { 'BOOKING_MANAGE': '/ibmtdt', 'CHANGE_PASSENGERS_SPECIAL_NEEDS': 'test' },
        'QUADRIGAM': { 'PASSENGER_INFO': 'test' },
        'DATALAYER_EVENT_TYPES': { 'VIEW': 'view' }
    };

    var fakeMmBUtilService = {
        'isUserLogged': jasmine.createSpy('isUserLogged').and.callFake(angular.noop)
    };

    var fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy()
    }

    var fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: { 'VIEW': 'view' },
        DATALAYER_MODAL_ID: { 'BACK_MODAL': 'BACK_MODAL' }
    };

    let errorObject = { 'errorCode' : '101' };

    let fakeLocation = {
        'path': jasmine.createSpy()
    };

    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-services-module', 'ib-MmB-passengers-info-module', ($provide) => {
            $provide.value('PassengersInfoService', fakePassengerInfoService);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            // $provide.value('$location', fakeLocation);
        });
        inject(function ($rootScope, $controller, _localStorageService_, _$timeout_, _$location_, _$q_) {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            $timeout = _$timeout_;
            $q = _$q_;
            $location = _$location_;
            spyOn($location, 'path');
            localStorageService = _localStorageService_;
            fakePassengerInfoService.generatePassengerData = jasmine.createSpy('generatePassengerData').and.callFake(() => {
                return mockPassengersInfo;
            });
            controller = $controller('PassengersInfoController', {
                'PassengersInfoModel': { 'initializeModel': () => { } },
                '$scope': scope,
                'localStorageService': _localStorageService_,
                'MmBModalService': fakeMmBModalService
            });
            scope.$digest();

        });
    });

    describe('when activate is called', () => {
        it('model index tab should be 0', (done) => {
            $timeout.flush();
            expect(controller.model.indexTab).toEqual(0);
            done();
        });
    });

    describe('when updateIndexTab is called', () => {
        it('model index tab should be the input parameter', (done) => {
            rootScope.$broadcast('updateIndexTab', { 'index': 5 });
            expect(controller.model.indexTab).toEqual(5);
            done();
        });
    });

    describe('when passengerFormContactNext is called', () => {
        var updateObject = { 'frequentFlyerInfo': { 'company': 'AA', 'number': '123123123' } }

        describe('and needsUpate is TRUE and have data', () => {
            var qService, PassengersInfoConstants;

            beforeEach(inject(($q, _PassengersInfoConstants_) => {
                qService = $q;
                PassengersInfoConstants = _PassengersInfoConstants_;
            }));

            it('and updateDataPassenger´s promise is resolved, localStorage savedChangeSuccess should be true and passenger status should be PassengersInfoConstants.STATUS_COMPLETE', (done) => {
                var currentIndexTab = controller.model.indexTab;
                fakePassengerInfoService.updateDataPassenger = jasmine.createSpy('updateDataPassenger').and.callFake(() => {
                    var defer = qService.defer();
                    defer.resolve();
                    return defer.promise;
                });
                rootScope.$broadcast('passengerFormContactNext', updateObject, true);
                rootScope.$apply();//force the promise to be executed before expects
                expect(controller.model.indexTab).toEqual(currentIndexTab + 1);
                expect(controller.model.passengersInfo.passengersContactInfo[currentIndexTab].status).toEqual(PassengersInfoConstants.STATUS_COMPLETE);
                expect(localStorageService.get('savedChangeSuccess')).toBe(true);
                done();
            });

            it('and updateDataPassenger´s promise is rejected, passenger status should be PassengersInfoConstants.STATUS_INCOMPLETE and fakeMmBModalService.showGenericError should be called', (done) => {;
                fakePassengerInfoService.updateDataPassenger = jasmine.createSpy('updateDataPassenger').and.callFake(() => {
                    var defer = qService.defer();
                    defer.reject(errorObject);
                    return defer.promise;
                });
                rootScope.$broadcast('passengerFormContactNext', updateObject, true);
                rootScope.$apply();//force the promise to be executed before expects
                expect(controller.model.passengersInfo.passengersContactInfo[controller.model.indexTab].status).toEqual(PassengersInfoConstants.STATUS_INCOMPLETE);
                expect(fakeMmBModalService.showGenericError).toHaveBeenCalledWith(errorObject);
                done();
            });
        });

        it('and needsUpate is false indexTab should be one more', (done) => {
            var currentIndexTab = controller.model.indexTab;
            rootScope.$broadcast('passengerFormContactNext', updateObject, false);
            expect(controller.model.indexTab).toEqual(currentIndexTab + 1);
            done();
        });

    });

    describe('when infantFormContactNext is called', () => {
        it('model index tab should be one more', (done) => {
            var currentIndexTab = controller.model.indexTab;
            rootScope.$broadcast('infantFormContactNext');
            expect(controller.model.indexTab).toEqual(currentIndexTab + 1);
            done();
        });
    });


    describe('when updateContactInfo is called ', () => {

        describe('and needsUpdate are true  and have data', () => {
            var qService, PassengersInfoConstants;

            beforeEach(inject(($q, _PassengersInfoConstants_) => {
                qService = $q;
                PassengersInfoConstants = _PassengersInfoConstants_;
            }));

            it('and updateDataContactInfo promise is resolved, localStorage savedChangeSuccess should be true and passenger status should be PassengersInfoConstants.STATUS_COMPLETE', (done) => {
                fakePassengerInfoService.updateDataContactInfo = jasmine.createSpy('updateDataContactInfo').and.callFake(() => {
                    var defer = qService.defer();
                    defer.resolve();
                    return defer.promise;
                });
                rootScope.$broadcast('updateContactInfo', null, null, true);
                rootScope.$apply();//force the promise to be executed before expects
                expect(localStorageService.get('savedChangeSuccess')).toBe(true);
                expect(localStorageService.get('savedDataContactSuccess')).toEqual(PassengersInfoConstants.STATUS_COMPLETE);
                done();
            });

            it('and updateDataContactInfo promise is rejected', (done) => {;
                fakePassengerInfoService.updateDataContactInfo = jasmine.createSpy('updateDataContactInfo').and.callFake(() => {
                    var defer = qService.defer();
                    defer.reject(errorObject);
                    return defer.promise;
                });
                rootScope.$broadcast('updateContactInfo', null, null, true);
                rootScope.$apply();//force the promise to be executed before expects
                expect(fakeMmBModalService.showGenericError).toHaveBeenCalledWith(errorObject);
                done();
            });

            it('and updateDataContactInfo promise is rejected', (done) => {;
                rootScope.$broadcast('updateContactInfo', null, null, false);
                rootScope.$apply();//force the promise to be executed before expects
                expect($location.path).toHaveBeenCalled();
                done();
            });

        });
    });

    describe('when backPage is called', () => {
        var qService;

        beforeEach(inject(($q) => {
            qService = $q;
        }));

        it('and backPage promise is resolved', (done) => {
            rootScope.$broadcast('passengerFormContactBack', {});
            fakeMmBModalService.showGenericModal = jasmine.createSpy().and.callFake(function () {
                return {
                    result: $q.when()
                };
            });
            rootScope.$apply();//force the promise to be executed before expects
            rootScope.$digest();
            expect($location.path).toHaveBeenCalled();
            done();
        });
    });


    describe('and openSpecialPassengersPage()', () => {
        it('and openSpecialPassengersPage called', (done) => {
            rootScope.$broadcast('openSpecialPassengers', {});
            rootScope.$apply();//force the promise to be executed before expects
            expect($location.path).toHaveBeenCalled();
            done();
        });
    });
});
