describe('CheckForDeepLink test', function () {

    var checkForDeepLink, rootScope, uibmodal, uibModalStack, httpBackend;
    var mockDeepLinkData = {
        externalCompany: 'external-company',
        externalMobileUrl: 'https://example.test/mobile',
        externalUrl: 'https://example.test',
        message: 'Deep link message'
    };
    var fakeModal = {
        result: {
            catch: function () {
                return this;
            },
            then: jasmine.createSpy('then')
        },
        close: function (item) {
            this.result.confirmCallBack(item);
        },
        dismiss: function (type) {
            this.result.cancelCallback(type);
        }
    };
    var MockModalOpen = {
        controller: 'IbcoseModalDeepController',
        controllerAs: 'modalCtrl',
        templateUrl: 'web-checkin/templates/ibcose.modal-mensaje-deep.html',
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        resolve: {
            object: jasmine.any(Function)
        }
    };

    const fakeCheckinRouterConstants = {
        templatesRoute: 'web-checkin/templates/'
    };

    beforeEach(function () {
        angular.mock.module('ib-checkin-services-module', 'ui.bootstrap', ($provide) => {
            $provide.value('CheckinRouterConstants', fakeCheckinRouterConstants);
        });
        inject(function ($rootScope, _CheckForDeepLink_, _CheckinRouterConstants_, $uibModalStack, $uibModal, $injector) {
            checkForDeepLink = _CheckForDeepLink_;
            rootScope = $rootScope;
            uibmodal = $uibModal;
            uibModalStack = $uibModalStack;
            httpBackend = $injector.get('$httpBackend');
        });
    });
    describe('When checkDeepLink() is called', function () {
        beforeEach(inject(function () {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));
        it('open an uibmodal', function (done) {
            checkForDeepLink.checkDeepLink(mockDeepLinkData);
            expect(uibmodal.open).toHaveBeenCalledWith(MockModalOpen);
            done();
            rootScope.$digest();
        });
    });


});