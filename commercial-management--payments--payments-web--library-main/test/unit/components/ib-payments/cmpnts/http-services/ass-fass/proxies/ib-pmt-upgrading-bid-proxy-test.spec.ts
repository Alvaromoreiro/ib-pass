import * as angular from 'angular';
import 'angular-mocks';
import { of, throwError } from 'rxjs';

describe('ibPmtUpgradingBidProxy test', function () {

    let PmtUpgradingBidProxy;

    const PROXY_URL = '/myURL';

    const fakePmtRxProxy = {
        put: jasmine.createSpy('put'),
        post: jasmine.createSpy('post'),
        get: jasmine.createSpy('get')
    };

    const fakeLocalStorageService = {
        get: jasmine.createSpy('get'),
        set: jasmine.createSpy('set'),
        remove: jasmine.createSpy('remove')
    };

    const fakeCommonsCookiesService = {
    getCookie: jasmine.createSpy('getCookie')
};

    const fakeCommonsLoginConstants = {
        SSO_COOKIES: {}
    };

    beforeEach(function () {

        angular.mock.module('ib-pmt-services-http-module', function ($provide) {

            $provide.value('PmtRxProxy', fakePmtRxProxy);
            $provide.value('localStorageService', fakeLocalStorageService);

            // 👇 IMPORTANTE
            $provide.value('CommonsCookiesService', fakeCommonsCookiesService);
            $provide.value('CommonsLoginConstants', fakeCommonsLoginConstants);
        });

        inject(function (_PmtUpgradingBidProxy_) {
            PmtUpgradingBidProxy = _PmtUpgradingBidProxy_;
        });
    });

    describe('When upgradingBidOrder is called', function () {

        it('should resolve when response is OK', function (done) {

            fakePmtRxProxy.post.and.returnValue(
                of({ code: 200, data: { response: 'Ok' } })
            );

            PmtUpgradingBidProxy.upgradingBidOrder(PROXY_URL, {}, false)
                .then((responseData) => {
                    expect(responseData.data.response).toEqual('Ok');
                    done();
                });
        });

        it('should reject when response is KO', function (done) {

            fakePmtRxProxy.post.and.returnValue(
                throwError(() => ({
                    status: 500,
                    error: { data: 'KO' }
                }))
            );

            PmtUpgradingBidProxy.upgradingBidOrder(PROXY_URL, {}, false)
                .then(
                    () => fail('Should not resolve'),
                    (responseData) => {
                        expect(responseData.errorCode).toEqual(500);
                        expect(fakeLocalStorageService.remove)
                            .toHaveBeenCalledWith('redirectionPaymentCallback');
                        done();
                    }
                );
        });
    });

    describe('When getUpgradingBidInfoBy3dsPay is called', function () {

        it('should resolve when response is OK', function (done) {

            fakePmtRxProxy.get.and.returnValue(
                of({ code: 200, data: { response: 'Ok' } })
            );

            PmtUpgradingBidProxy.getUpgradingBidInfoBy3dsPay(PROXY_URL)
                .then((responseData) => {
                    expect(responseData.data.response).toEqual('Ok');
                    done();
                });
        });

        it('should reject when response is KO', function (done) {

            fakePmtRxProxy.get.and.returnValue(
                throwError(() => ({
                    status: 500,
                    error: { data: 'KO' }
                }))
            );

            PmtUpgradingBidProxy.getUpgradingBidInfoBy3dsPay(PROXY_URL)
                .then(
                    () => fail('Should not resolve'),
                    (responseData) => {
                        expect(responseData.errorCode).toEqual(500);
                        expect(fakeLocalStorageService.remove)
                            .toHaveBeenCalledWith('redirectionPaymentCallback');
                        done();
                    }
                );
        });
    });

});
