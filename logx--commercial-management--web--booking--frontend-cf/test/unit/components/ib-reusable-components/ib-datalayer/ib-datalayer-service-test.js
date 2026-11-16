xdescribe('DataLayerService Test', function () {
    var DataLayerService, testWindow, localStorageService;

    beforeEach(function () {
        angular.mock.module('LocalStorageModule', 'ib-datalayer-module');
        inject(function ($window, _DataLayerService_, _localStorageService_) {
            DataLayerService = _DataLayerService_;
            testWindow = $window;
            DataLayerService.removeAllDatalayerInfo();
            localStorageService = _localStorageService_;
        });
    });

    describe('When initDatalayer is called', function () {

        it('with no initial data, empty datalayer objects should be created associated to page window', function (done) {
            DataLayerService.initDatalayer();
            expect(testWindow.datalayer_general).toEqual({});
            expect(testWindow.datalayer_ecommerce).toEqual({});
            done();
        });

        it('with initial data, datalayer objects should be created with the initial info', function (done) {
            var datalayer_general = { 'test': 'test' };
            var datalayer_ecommerce = { 'test_ecommerce': 'test_ecommerce' };
            var oldData = { 'old': 'oldData' };
            testWindow.datalayer_general = angular.copy(oldData);
            testWindow.datalayer_ecommerce = angular.copy(oldData);
            DataLayerService.initDatalayer(datalayer_general, datalayer_ecommerce);
            angular.extend(datalayer_general, oldData);
            angular.extend(datalayer_ecommerce, oldData)
            expect(testWindow.datalayer_general).toEqual(datalayer_general);
            expect(testWindow.datalayer_ecommerce).toEqual(datalayer_ecommerce);
            done();
        });
    });

    describe('When addDataLayerGeneralInfo is called', function () {

        it('with no object, the datalayer general must be the same', function (done) {
            var initialDatalayerGeneral = { 'testAdd': 'testAdd' };
            DataLayerService.initDatalayer(initialDatalayerGeneral);
            DataLayerService.addDataLayerGeneralInfo(null);
            expect(testWindow.datalayer_general).toEqual(initialDatalayerGeneral);
            done();
        });

        it('with an Object, datalayer general must be extended with the new info', function (done) {
            var datalayer_general = { 'testAddInit': 'testAddInit', 'test': 'testInit' };
            var newData = { 'test_new': 'test_new', 'test': 'testInitNew' };
            DataLayerService.initDatalayer(datalayer_general);
            DataLayerService.addDataLayerGeneralInfo(newData);
            angular.extend(datalayer_general, newData);
            expect(testWindow.datalayer_general).toEqual(datalayer_general);
            done();
        });
    });

    it('When removeDatalayerGeneralInfo is called, with and array with attributes, the datalayer general must remove the array attributes', function (done) {
        var initialDatalayerGeneral = { 'testRem': 'testRem', 'testRem2': 'testRem2', 'testRem3': 'testRem3' };
        DataLayerService.initDatalayer(initialDatalayerGeneral);
        DataLayerService.removeDatalayerGeneralInfo(['testRem2']);
        expect(testWindow.datalayer_general).toEqual({ 'testRem': 'testRem', 'testRem3': 'testRem3' });
        done();
    });

    it('When removeAllDatalayerInfo is called, the datalayer general must be empty', function (done) {
        var initialDatalayerGeneral = { 'testRem': 'testRem', 'testRem2': 'testRem2', 'testRem3': 'testRem3' };
        DataLayerService.initDatalayer(initialDatalayerGeneral);
        DataLayerService.removeAllDatalayerInfo();
        expect(testWindow.datalayer_general).toEqual({});
        done();
    });

    it('When callUpdateTagManager is called, it must call $window.DigitalChange function with input type and datalayer objects', function (done) {
        var initialDatalayerGeneral = { 'testRem': 'testRem', 'testRem2': 'testRem2', 'testRem3': 'testRem3' };
        testWindow.DigitalChange = jasmine.createSpy('DigitalChange').and.callFake(angular.noop);
        DataLayerService.initDatalayer(initialDatalayerGeneral);

        it('if datalayer_ecommerce has been sent', function () {
            localStorageService.set('sendDatalayerEcommerce', false);
            rootScope.$digest();
        });
        it('if datalayer_ecommerce has not been sent', function () {
            localStorageService.set('sendDatalayerEcommerce', true);
        });

        DataLayerService.callUpdateTagManager('type');
        expect(testWindow.DigitalChange).toHaveBeenCalledWith('type', initialDatalayerGeneral, {});
        done();
    });

    it('When getDatalayerGeneral is called, current general datalayer object must be returned', function (done) {
        var initialDatalayerGeneral = { 'testRem': 'testRem', 'testRem2': 'testRem2', 'testRem3': 'testRem3' };
        DataLayerService.initDatalayer(initialDatalayerGeneral);
        expect(DataLayerService.getDatalayerGeneral()).toEqual(initialDatalayerGeneral);
        done();
    });
});