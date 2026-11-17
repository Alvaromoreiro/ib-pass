describe('CheckAncillariesService test', function () {
    var CheckAncillariesService, rootScope, localStorageService;
    var mockAncillaries = {
        'ancillaries': [
            { 'type': 'BAGGAGE', 'status': { 'code': 'AVAILABLE' }, 'segments':['id', 'pruebas', 'prueba2','prueba2'] },
            { 'type': 'INSURANCE', 'status': { 'code': 'AVAILABLE' }, 'segments':['id', 'pruebas', 'prueba2','prueba2'] },
            { 'type': 'BOB', 'status': { 'code': 'AVAILABLE' }, 'segments':['id', 'pruebas', 'prueba2','prueba2'] },
            { 'type': 'SEAT', 'status': { 'code': 'AVAILABLE' }, 'segments':['id', 'pruebas', 'prueba2','prueba2'] },
            { 'type': 'PREORDER', 'status': { 'code': 'AVAILABLE' }, 'segments':['id', 'pruebas', 'prueba2','prueba2'] },
            { 'type': 'PRIORITY_BOARDING', 'status': { 'code': 'AVAILABLE' }, 'segments':['id', 'pruebas', 'prueba2','prueba2'] },


        ]
    };
    var mockAncillariesOnlyBaggage = {
        'ancillaries': [
            { 'type': 'BAGGAGE', 'status': { 'code': 'AVAILABLE' }, 'segments':['id', 'pruebas', 'prueba2','prueba2'] }
        ]
    };
    var mockAncillariesOnlyInsurance = {
        'ancillaries': [
            { 'type': 'INSURANCE', 'status': { 'code': 'AVAILABLE' }, 'segments':['id', 'pruebas', 'prueba2','prueba2'] },
        ]
    };
    var mockAncillariesOnlyPreorder = {
        'ancillaries': [
            { 'type': 'PREORDER', 'status': { 'code': 'AVAILABLE' }, 'segments':['id', 'pruebas', 'prueba2','prueba2'] },
        ]
    };
    var mockAncillariesOnlyPriority = {
        'ancillaries': [
            { 'type': 'PRIORITY_BOARDING', 'status': { 'code': 'AVAILABLE' }, 'segments':['id', 'pruebas', 'prueba2','prueba2'] },
        ]
    };
    var fakeCommonsAncillariesService = {
        'getAncillaries': jasmine.createSpy()
    }

    var fakeConfig = {
        'ANCILLARIES_TYPES': {
            'BAGGAGE': 'BAGGAGE',
            'SEAT': 'SEAT',
            'INSURANCE': 'INSURANCE',
            'VEHICLE_RENTAL': 'VEHICLE_RENTAL',
            'UPGRADING': 'UPGRADING',
            'BOB': 'BOB',
            'PREORDER': 'PREORDER',
            'PRIORITY_BOARDING': 'PRIORITY_BOARDING'
        },
        'GENERAL_STATUS': {
            'AVAILABLE': 'AVAILABLE',
            'NOT_AVAILABLE': 'NOT_AVAILABLE',
            'CHECKED': 'CHECKED'
        }
    };
    beforeEach(function () {
        angular.mock.module('ib-checkin-services-module', 'LocalStorageModule', function ($provide) {
            $provide.value('CommonsAncillariesService', fakeCommonsAncillariesService);
            $provide.value('CheckinAppConstants', fakeConfig);
        });
        inject(function ($rootScope, _CheckAncillariesService_, _localStorageService_) {
            CheckAncillariesService = _CheckAncillariesService_;
            rootScope = $rootScope;
            localStorageService = _localStorageService_;
        });
    });
    describe('When checkAncillaries() is called', function () {
        it('and resolve promise,should return data', function (done) {
            inject(function ($q) {
                fakeCommonsAncillariesService.getAncillaries = jasmine.createSpy('getAncillaries').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve(mockAncillaries);
                    return defer.promise;
                });
            });
            CheckAncillariesService.checkAncillaries().then(function (response) {
                expect(response).toEqual({ ancillaries: true, seatsAvailable: true });
            }, angular.noop);
            rootScope.$digest();
            done();
        });
        it('and resolve promise,should return data with only baggages', function (done) {
            inject(function ($q) {
                fakeCommonsAncillariesService.getAncillaries = jasmine.createSpy('getAncillaries').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve(mockAncillariesOnlyBaggage);
                    return defer.promise;
                });
            });
            CheckAncillariesService.checkAncillaries().then(function (response) {
                expect(response).toEqual({ ancillaries: true, seatsAvailable: false });
            }, angular.noop);
            rootScope.$digest();
            done();
        });
        it('and resolve promise,should return data with only Insurance', function (done) {
            inject(function ($q) {
                fakeCommonsAncillariesService.getAncillaries = jasmine.createSpy('getAncillaries').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve(mockAncillariesOnlyInsurance);
                    return defer.promise;
                });
            });
            CheckAncillariesService.checkAncillaries().then(function (response) {
                expect(response).toEqual({ ancillaries: true, seatsAvailable: false });
            }, angular.noop);
            rootScope.$digest();
            done();
        });
        it('and resolve promise,should return data with only Preorder', function (done) {
            inject(function ($q) {
                fakeCommonsAncillariesService.getAncillaries = jasmine.createSpy('getAncillaries').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve(mockAncillariesOnlyPreorder);
                    return defer.promise;
                });
            });
            CheckAncillariesService.checkAncillaries().then(function (response) {
                expect(response).toEqual({ ancillaries: true, seatsAvailable: false });
            }, angular.noop);
            rootScope.$digest();
            done();
        });
        it('and resolve promise,should return data with only Priority', function (done) {
            inject(function ($q) {
                fakeCommonsAncillariesService.getAncillaries = jasmine.createSpy('getAncillaries').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve(mockAncillariesOnlyPriority);
                    return defer.promise;
                });
            });
            CheckAncillariesService.checkAncillaries().then(function (response) {
                expect(response).toEqual({ ancillaries: true, seatsAvailable: false });
            }, angular.noop);
            rootScope.$digest();
            done();
        });

        it('and reject prmise, should return error', function (done) {
            var mockError = { 'errorCode': 400, 'message': 'error' };
            inject(function ($q) {
                fakeCommonsAncillariesService.getAncillaries = jasmine.createSpy('getAncillaries').and.callFake(function () {
                    var defer = $q.defer();
                    defer.reject(mockError);
                    return defer.promise;
                });
            });
            CheckAncillariesService.checkAncillaries().then(angular.noop, function (error) {
                expect(error.errorCode).toEqual(400);
            });
            rootScope.$digest();
            done();

        });
    });

});
