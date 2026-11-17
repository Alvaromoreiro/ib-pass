import * as angular from 'angular';
import 'angular-mocks';
import { CallBoardingCardsService } from './ib-call-boarding-cards-service';

type SpyMap<Names extends string> = Record<Names, jasmine.Spy>;

describe('CallBoardingCardsService', () => {
    let service: CallBoardingCardsService;
    let $q: ng.IQService;
    let $rootScope: ng.IRootScopeService;
    let $timeout: ng.ITimeoutService;

    let localStorageService: SpyMap<'get'>;
    let commonsGenericProxy: SpyMap<'postGeneric' | 'getGeneric'>;
    let commonsHttpUtilsErrorService: SpyMap<'controlError'>;
    let translate: jasmine.Spy;
    let filter: jasmine.Spy;

    const checkinId = 'CHECKIN-123';
    const boardingCardsUri = '/boarding-cards/';
    const boardingDocumentUri = '/checkins/';

    const httpServicesConstants = {
        URI: {
            DEFAULT_ENDPOINTS: {
                boardingCardsURI: boardingCardsUri,
                getBoardingDocument: boardingDocumentUri
            }
        }
    };

    beforeEach(angular.mock.module('ng'));

    beforeEach(angular.mock.inject((
        _$q_: ng.IQService,
        _$rootScope_: ng.IRootScopeService,
        _$timeout_: ng.ITimeoutService
    ) => {
        $q = _$q_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;

        translate = jasmine.createSpy('translate').and.returnValue('Session expired');
        filter = jasmine.createSpy('$filter').and.returnValue(translate);

        localStorageService = {
            get: jasmine.createSpy('get').and.returnValue(checkinId)
        };

        commonsGenericProxy = {
            postGeneric: jasmine.createSpy('postGeneric'),
            getGeneric: jasmine.createSpy('getGeneric')
        };

        commonsHttpUtilsErrorService = {
            controlError: jasmine.createSpy('controlError')
        };

        service = new CallBoardingCardsService(
            $q,
            httpServicesConstants,
            localStorageService as unknown as angular.local.storage.ILocalStorageService,
            filter as unknown as ng.IFilterFunction,
            $timeout,
            commonsGenericProxy,
            commonsHttpUtilsErrorService
        );
    }));

    function resolvePromises(): void {
        $rootScope.$digest();
    }

    function expectRequestResponse(requestCase: {
        request: () => angular.IPromise<unknown>;
        proxyMethod: jasmine.Spy;
        expectedArguments: unknown[];
        expectedResult: unknown;
    }): void {
        let result: unknown;
        requestCase.proxyMethod.and.returnValue($q.when({ data: requestCase.expectedResult }));

        requestCase.request().then((data: unknown) => result = data);
        resolvePromises();

        expect(requestCase.proxyMethod).toHaveBeenCalledWith(...requestCase.expectedArguments);
        expect(result).toEqual(requestCase.expectedResult);
    }

    function expectRequestError(
        request: () => angular.IPromise<unknown>,
        proxyMethod: jasmine.Spy,
        callback: () => void,
        error: unknown
    ): void {
        proxyMethod.and.returnValue($q.reject(error));

        request();
        resolvePromises();

        expect(commonsHttpUtilsErrorService.controlError).toHaveBeenCalledWith(
            error,
            0,
            callback,
            jasmine.any(Object)
        );
    }

    function expectSessionExpiredForBothRequests(): void {
        const rejectedErrors: unknown[] = [];

        service.updateBoardingCards({ passengerId: 'PAX-1' })
            .catch((error: unknown) => rejectedErrors.push(error));

        service.getBoardingCards()
            .catch((error: unknown) => rejectedErrors.push(error));

        $timeout.flush();

        expect(filter).toHaveBeenCalledWith('translate');
        expect(translate).toHaveBeenCalledWith('SESSION_EXPIRED');

        expect(rejectedErrors).toEqual([
            {
                errorCode: 'IB_00002',
                message: 'Session expired',
                internalErrorCode: 'IB_00002'
            },
            {
                errorCode: 'IB_00002',
                message: 'Session expired',
                internalErrorCode: 'IB_00002'
            }
        ]);
    }

    describe('successful requests', () => {
        it('returns response data for both update and retrieval requests', () => {
            const updateInfo = { passengerId: 'PAX-1', seat: '12A' };
            const updateResponse = { documentId: 'DOC-001' };
            const retrievalResponse = { boardingCards: [{ seat: '12A' }] };

            expectRequestResponse({
                request: () => service.updateBoardingCards(updateInfo),
                proxyMethod: commonsGenericProxy.postGeneric,
                expectedArguments: ['/boarding-cards/CHECKIN-123/boarding-document/print', updateInfo],
                expectedResult: updateResponse
            });

            expectRequestResponse({
                request: () => service.getBoardingCards(),
                proxyMethod: commonsGenericProxy.getGeneric,
                expectedArguments: ['/checkins/CHECKIN-123/boarding-document'],
                expectedResult: retrievalResponse
            });
        });
    });

    describe('updateBoardingCards', () => {
        it('delegates update failures to the common error handler', () => {
            const error = { status: 500 };
            expectRequestError(
                () => service.updateBoardingCards({ passengerId: 'PAX-1' }),
                commonsGenericProxy.postGeneric,
                service.updateBoardingCardsCallback,
                error
            );
        });

        it('retries the update and increments the attempt counter', () => {
            spyOn(service, 'updateBoardingCards').and.returnValue($q.when({}));

            service.updateBoardingCardsCallback();

            expect(service.attemp).toBe(1);
            expect(service.updateBoardingCards).toHaveBeenCalledWith(undefined);
        });
    });

    describe('getBoardingCards', () => {
        it('delegates retrieval failures to the common error handler', () => {
            const error = { status: 404 };
            expectRequestError(
                () => service.getBoardingCards(),
                commonsGenericProxy.getGeneric,
                service.getBoardingCardsErrorCallback,
                error
            );
        });

        it('retries the request and increments the attempt counter', () => {
            spyOn(service, 'getBoardingCards').and.returnValue($q.when({}));

            service.getBoardingCardsErrorCallback();

            expect(service.attemp).toBe(1);
            expect(service.getBoardingCards).toHaveBeenCalledTimes(1);
        });
    });

    describe('expired session', () => {
        it('rejects both operations when the flow ID is missing', () => {
            localStorageService.get.and.returnValue(null);

            expectSessionExpiredForBothRequests();
        });
    });
});
