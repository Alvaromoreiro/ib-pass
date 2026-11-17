describe('SegmentInfoPAController', function () {

    var $controller, $rootScope, $scope, controller;

    var fakeModalService = {
        'setErrorMessage' : jasmine.createSpy('setErrorMessage'),
        'isError' : jasmine.createSpy('isError')
    };

    var fakeIbUtilsService = { setTitlePage: jasmine.createSpy() };

    var fakeCheckinAppConstants = {
        TITLE_PAGE: {
            FLIGHT_CONFIRMATION : "CKI_TITLE_PAGE_IBFNCOPA"
        },
        iconsRoute: '/assets/icons',
        lang: 'es',
        defaultLang: 'en'

    };

    beforeEach(function () {
        angular.mock.module('ib-segment-info-pa-module', function ($provide) {
            $provide.value('CheckinAppConstants', fakeCheckinAppConstants);
            $provide.value('ModalService', fakeModalService);
            $provide.value('IbUtilsService', fakeIbUtilsService);
        });
        inject(function (_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $controller('SegmentInfoPAController', {
                $scope: $scope,
                $rootScope: $rootScope
            });
        });
    });

    describe('when activate() is called', function () {
        it('showPa exists or true assign an url' , function() {
            controller.showPa = true;
            controller.$onInit();
            expect(controller.paIconUrl).toBe('/assets/icons/puente_aereo/logo_pte_aero_short_es.png');
            expect(fakeIbUtilsService.setTitlePage).toHaveBeenCalledWith('CKI_TITLE_PAGE_IBFNCOPA');
        });
        it('showPa not exists or false assign an other url' , function() {
            controller.showPa = false;
            controller.$onInit();
            expect(controller.paIconUrl).toBeUndefined();
        });
    });

    describe('when showSegmentError() is called', function() {
        it('show an error modal', function() {
            controller.segmentInfoModel = {
                status: {
                    message: 'Error'
                }
            };
            controller.showSegmentError();
            expect(fakeModalService.setErrorMessage).toHaveBeenCalledWith('Error');
            expect(fakeModalService.isError).toHaveBeenCalledWith({
                message: 'Error',
                errorCode: '',
                internalErrorCode: 'SEGMENT_STATUS_ERROR'
            });
        });
    });

});
