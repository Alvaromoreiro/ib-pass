describe('ModalService', function () {
    var ModalService, uibmodal, uibModalStack;
    var CKIAppConstants = { 'templatesRoute': 'web-checkin/templates/' }
    var fakeModal = {
        result: {
            then: function (confirmCallback, cancelCallback) {
                this.confirmCallBack = confirmCallback;
                this.cancelCallback = cancelCallback;
            }
        },
        close: function (item) {
            this.result.confirmCallBack(item);
        },
        dismiss: function (type) {
            this.result.cancelCallback(type);
        }
    };
    var fakeRoute = {
        '$route' : jasmine.createSpy()
    }   


    beforeEach(function () {
        angular.mock.module('ib-cki-modal-module', 'ui.bootstrap', function ($provide) {
            $provide.value('CheckinRouterConstants', CKIAppConstants);
            $provide.value('$route', fakeRoute);

        });
        inject(function (_ModalService_, $uibModal, $uibModalStack) {
            uibmodal = $uibModal;
            uibModalStack = $uibModalStack;
            ModalService = _ModalService_;
        });
    });

    describe('when showGenericError is called', function () {

        beforeEach(inject(function () {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));

        it('and is not a blocked modal and no template is provided, not blocked modal instance with default template should be returned', function (done) {
            var modalErrorObject = {
                animation: false,
                templateUrl: CKIAppConstants.templatesRoute + 'generic-error-modal.html',
                controller: 'GenericErrorModalController',
                controllerAs: 'modalCtrl',
                windowClass: 'ib-modals ib-modals--md',
                resolve: {
                    errorObject: jasmine.any(Function)
                }
            };
            var returnedInstance = ModalService.showGenericError({});
            done();
        });

        it('and is a blocked modal and template is provided, blocked modal instance with provided template should be returned', function (done) {
            var template = 'test';
            var modalErrorObject = {
                animation: false,
                templateUrl: CKIAppConstants.templatesRoute + template,
                controller: 'GenericErrorModalController',
                controllerAs: 'modalCtrl',
                windowClass: 'ib-modals ib-modals--md',
                resolve: {
                    errorObject: jasmine.any(Function)
                },
                backdrop: 'static',
                keyboard: false
            };
            var returnedInstance = ModalService.showGenericError({}, true, template);
            expect(returnedInstance).toEqual(fakeModal);
            done();
        });
    });

    describe('when showGenericModal is called', function () {
        beforeEach(inject(function () {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));

        it('and is a blocked modal and template is provided, blocked modal instance with provided template should be returned', function (done) {
            var template = 'test';
            var modalErrorObject = {
                animation: false,
                templateUrl: CKIAppConstants.templatesRoute + template,
                controller: 'GenericModalController',
                controllerAs: 'modalCtrl',
                windowClass: 'ib-modals ib-modals--md',
                resolve: {
                    object: jasmine.any(Function)
                },
                backdrop: 'static',
                keyboard: false
            };
            var returnedInstance = ModalService.showGenericModal(true, template);
            expect(returnedInstance).toEqual(fakeModal);
            done();
        });
    });

    describe('When isWaiting is called', function () {
        
        beforeEach(inject(function () {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));

        it('and waiting Modal Instance does not exist, new waiting modal should be opened', function (done) {
            var waitModalObject = {
                animation: false,
                templateUrl: CKIAppConstants.templatesRoute + 'generic-wait-modal.html',
                size: 'loading',
                backdrop: 'static',
                keyboard: false,
                windowClass: 'ib-modals ib-modals--loading',
                controller: 'GenericErrorModalController',
                controllerAs:'modalCtrl',
                resolve: {
                    object: jasmine.any(Function)
                }
            }
            ModalService.isWaiting();
            done();
        });

        it('and waiting Modal Instance exists, existing waiting modal should assigned', function (done) {
            ModalService.waitingModalInstance = 'testModal';
            ModalService.isWaiting();
            expect(ModalService.waitingModalInstance).toEqual('testModal');
            done();
        });
    });

    describe('When finishWaiting is called', function () {

        it('and waitingModalInstance exists, waitingModalInstance close should be called and waitingModalInstance should be null', function (done) {
            spyOn(fakeModal, 'close');
            ModalService.waitingModalInstance = fakeModal;
            ModalService.waitingModalInstance.result.then(angular.noop, angular.noop);
            ModalService.finishWaiting();
            expect(fakeModal.close).toHaveBeenCalled();
            expect(ModalService.waitingModalInstance).toEqual(null);
            done();
        });
    });

    describe('When closeAllCurrentModals is called', function () {
        it('$uibModalStack.dismissAll() should be called', function (done) {
            spyOn(uibModalStack, 'dismissAll');
            ModalService.closeAllCurrentModals();
            expect(uibModalStack.dismissAll).toHaveBeenCalled();
            done();
        });
    });
});