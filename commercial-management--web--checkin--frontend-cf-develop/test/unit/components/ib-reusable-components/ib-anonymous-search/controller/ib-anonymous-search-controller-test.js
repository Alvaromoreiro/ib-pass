describe('AnonymousSearchController test', function () {

    var controller;
    var controllerDependencies = {
        '$scope': {},
        'localStorageService': {}
    };
    var componentBindings = {
        title: '',
        buttonText: '',
        titleStyle: ''
    };

    beforeEach(angular.mock.module('LocalStorageModule', 'ib-anonymous-search-module'));

    describe('when activate is called', function () {
        it('vm.buttonStyle,surname and pnr should have input binding values', function (done) {
            inject(function ($rootScope, $componentController, _localStorageService_) {
                controllerDependencies.$scope = $rootScope.$new();
                controllerDependencies.localStorageService = _localStorageService_;
                controllerDependencies.localStorageService.set('confirmationPNR', true);
                controllerDependencies.localStorageService.set('checkinSurname', 'testSurname');
                controllerDependencies.localStorageService.set('PNR', 'testPnr');
                componentBindings.buttonStyle = 'testButtonStyle';
                controller = $componentController('ibAnonymousSearch', controllerDependencies, componentBindings);
                controllerDependencies.$scope.$digest();
                controller.$onInit();
            });
            expect(controller.buttonStyle).toEqual('testButtonStyle');
            expect(controller.model.surname).toEqual('testSurname');
            expect(controller.model.pnr).toEqual('testPnr');
            delete componentBindings.buttonStyle;
            done();
        });
        it('vm.buttonStyle should be "ib-button--red" and surname,pnr shoud be empty', function (done) {
            inject(function ($rootScope, $componentController, _localStorageService_) {
                controllerDependencies.$scope = $rootScope.$new();
                controllerDependencies.localStorageService = _localStorageService_;
                controllerDependencies.localStorageService.set('confirmationPNR', false);
                controller = $componentController('ibAnonymousSearch', controllerDependencies, componentBindings);
                controllerDependencies.$scope.$digest();
                controller.$onInit();
            });
            expect(controller.buttonStyle).toEqual('ib-button--red');
            expect(controller.model.surname).toEqual('');
            expect(controller.model.pnr).toEqual('');
            done();
        });
        afterEach(function () {
            controllerDependencies.localStorageService.clearAll();
        });
    });

    describe('when openGenericModal is called', function () {
        it('openGenericModal event shoud be called with parameters', function (done) {
            inject(function ($rootScope, $componentController, _localStorageService_) {
                controllerDependencies.$scope = $rootScope.$new();
                controllerDependencies.localStorageService = _localStorageService_;
                controller = $componentController('ibAnonymousSearch', controllerDependencies, componentBindings);
                spyOn(controllerDependencies.$scope, '$emit');
            });
            controller.openGenericModal('size', 'tpl', 'anim');
            expect(controllerDependencies.$scope.$emit).toHaveBeenCalledWith('openGenericModal', 'size', 'tpl', 'anim');
            done();
        });
    });

    describe('when initBooking is called', function () {
        var currentForm = { '$valid': true };
        it('anonymousSubmit event shoud be called with parameters if currentForm is valid', function (done) {
            inject(function ($rootScope, $componentController, _localStorageService_) {
                controllerDependencies.$scope = $rootScope.$new();
                controllerDependencies.localStorageService = _localStorageService_;
                controller = $componentController('ibAnonymousSearch', controllerDependencies, componentBindings);
                spyOn(controllerDependencies.$scope, '$emit');
            });
            controller.initBooking(currentForm);
            expect(controllerDependencies.$scope.$emit).toHaveBeenCalledWith('anonymousSubmit', { pnr: '', surname: '' });
            done();
        });
    });

    describe('when getPNRLength is called', function () {
        var pnrLength;
        it('pnrLenght shoud be 6 if pnr is only letters and length 6', function (done) {
            inject(function ($rootScope, $componentController, _localStorageService_) {
                controllerDependencies.$scope = $rootScope.$new();
                controllerDependencies.localStorageService = _localStorageService_;
                controller = $componentController('ibAnonymousSearch', controllerDependencies, componentBindings);
                controllerDependencies.$scope.$digest();
                controller.$onInit();
            });
            controller.model.pnr = 'AAAAAA';
            pnrLength = controller.getPNRLength();
            expect(pnrLength).toBe(6);
            done();
        });
        it('pnrLenght shoud be 14 if pnr length is 7', function (done) {
            inject(function ($rootScope, $componentController, _localStorageService_) {
                controllerDependencies.$scope = $rootScope.$new();
                controllerDependencies.localStorageService = _localStorageService_;
                controller = $componentController('ibAnonymousSearch', controllerDependencies, componentBindings);
                controllerDependencies.$scope.$digest();
                controller.$onInit();
            });
            controller.model.pnr = 'AAAAAAA';
            pnrLength = controller.getPNRLength();
            expect(pnrLength).toBe(14);
            done();
        });
        it('pnrLenght shoud be 14 if pnr not exists', function (done) {
            inject(function ($rootScope, $componentController, _localStorageService_) {
                controllerDependencies.$scope = $rootScope.$new();
                controllerDependencies.localStorageService = _localStorageService_;
                controller = $componentController('ibAnonymousSearch', controllerDependencies, componentBindings);
            });
            pnrLength = controller.getPNRLength();
            expect(pnrLength).toBe(14);
            done();
        });
    });



});