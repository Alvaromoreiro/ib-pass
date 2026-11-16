import * as angular from 'angular';
describe('CookiesUtilService Test', () => {
    let rootScope, CookiesUtilService,
    fakeCookies = {
        get: () => { return 'cookie'; },
        set: () => { },
        remove: () => { },
        put: ()=> {}
    };

    beforeEach( () => {
        angular.mock.module('ngCookies','ib-booking-services-module', ($provide) => {
        });
        inject(($rootScope, _CookiesUtilService_, $cookies) => {
            CookiesUtilService = _CookiesUtilService_;
            rootScope = $rootScope;
            fakeCookies = $cookies;
        });
    });
    describe('when updateCookie is called', () => {
        beforeEach(inject(() => {

        }));
        it('should set the given cookie with the given content, expiry time, and path', () => {
            spyOn(fakeCookies,'put')
            CookiesUtilService.updateCookie('putSpy', 'my_cookie', 'my_content', 3600, '/');
            expect(fakeCookies.put).toHaveBeenCalled();
          });
    });
    describe('when getCookieParams is called', () => {
        beforeEach(inject(() => {

        }));
        it('should set the given cookie with the given content, expiry time, and path', () => {
            fakeCookies.get = jasmine.createSpy('get').and.returnValue('cookie');
            const returnValue = CookiesUtilService.getCookieParams('cookie', 'my_cookie', 'my_content', 3600, '/');
            expect(returnValue).toEqual('cookie|');
          });
    });
});
