import { CommonsRootScope } from 'ib-web-commons/utils';
import * as angular from 'angular';
import {PmtConstants} from 'src/app/core/ib-pmt-constants';

xdescribe('PmtService test', () => {

    let PmtService, rootScope: CommonsRootScope, localStorageService: ng.local.storage.ILocalStorageService;
    const fakePmtTransformer = jasmine.createSpyObj('PmtTransformer', ['getPaymentsModel']);
    const fakePmtMethodsService = jasmine.createSpyObj('PmtMethodsService', ['getPaymentsModel']);
    const fakePmtIssueOrderService = jasmine.createSpyObj('PmtIssueOrderService', ['getPaymentsModel']);
    const fakePmtCreditCardsService = jasmine.createSpyObj('PmtCreditCardsService', ['getPaymentsModel']);
    const fakePmtSummaryInfoQuotaService = jasmine.createSpyObj('PmtSummaryInfoQuotaService', ['getPaymentsModel']);
    const fakePmtCountriesListService = jasmine.createSpyObj('PmtCountriesListService', ['getPaymentsModel']);
    const fakePmtStatesListService = jasmine.createSpyObj('PmtStatesListService', ['getPaymentsModel']);


    beforeEach(() => {
        angular.mock.module('ib-pmt-module', 'LocalStorageModule', ($provide) => {
            $provide.value('PmtConstants', PmtConstants);
            $provide.value('PmtTransformer', fakePmtTransformer);
            $provide.value('PmtStatesListService', fakePmtStatesListService);
            $provide.value('PmtCountriesListService', fakePmtCountriesListService);
            $provide.value('PmtSummaryInfoQuotaService', fakePmtSummaryInfoQuotaService);
            $provide.value('PmtIssueOrderService', fakePmtIssueOrderService);
            $provide.value('PmtMethodsService', fakePmtMethodsService);
            $provide.value('PmtCreditCardsService', fakePmtCreditCardsService);
        });

        inject((_PmtService_, $rootScope, _localStorageService_) => {
            rootScope = $rootScope;
            rootScope.appMarket = 'ES';

            PmtService = _PmtService_;
            localStorageService = _localStorageService_;
        });
    });

    afterEach(() => {
        sessionStorage.clear();
    });

    describe('When #buildPaymentInfo is called', () => {

        describe('and is BBKI flow', function () {
            beforeEach(() => {
                localStorageService.set('flowApp', 'BBKI');
            });

            describe('and is user logged but not ONB', function () {
                beforeEach(() => {
                    localStorageService.set('userLogged', true);
                });

                it('is bkki flow', (done) => {
                    PmtService.buildPaymentInfo('BBKI', 'ES', 'DOES NOT MATTER', true, 'ARE YOU KIDDING ME?');


                    done();
                });
            });
        });


    });
});