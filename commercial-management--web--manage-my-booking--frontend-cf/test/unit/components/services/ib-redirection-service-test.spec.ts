describe('RedirectionService Test', function () {
    var redirectionService, testWindow, rootScope;

    var fakeWindows = {
        'location': jasmine.createSpy(),
        'open': jasmine.createSpy()
    };

    var fakeCommonsGenericProxy = {
        postGeneric: jasmine.createSpy()
    };

    var MmBAppConstantsFake = {
        voucherInfoURI: 'test'
    };

    var fakeCommonsNewHttpUtilsErrorService = {
        'controlError': jasmine.createSpy('controlError').and.callFake((error) => {
            return error;
        })
    };

    beforeEach(function () {
        angular.mock.module('ib-MmB-services-module', function ($provide) {
            $provide.value('$window', fakeWindows);
        });
        inject(function ($rootScope, _RedirectionService_, $window) {
            redirectionService = _RedirectionService_;
            testWindow = $window;
        });
    });

    it('When externalRedirect() is called, should modify window.location.href', function (done) {
        spyOn(testWindow, 'open');
        redirectionService.externalRedirect('\modifi');
        expect(testWindow.location.href).toEqual('\modifi');
        done();
    });

    it('When externalRedirect() is called, should modify window.location.href in a newTab', function (done) {
        spyOn(testWindow, 'open');
        redirectionService.externalRedirect('\modifi', true);
        done();
    });


});
