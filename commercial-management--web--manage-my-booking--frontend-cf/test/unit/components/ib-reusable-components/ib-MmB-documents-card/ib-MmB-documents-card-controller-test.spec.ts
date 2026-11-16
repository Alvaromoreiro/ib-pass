describe('MmBDocumentsController test', function () {

    var controller, $scope, $rootScope, localStorage, $controller;

    var fakeBookingDashboardConstants = {
        BOX_LINKS_TYPES: {
            CHECK_IN: 'checkIn',
            EMERGENCY_CONTACT: 'emergencyContact',
            SEATS_AUCTION: 'seatsAuction',
            FLIGHT_REMINDER: 'flightReminder',
            BIDABLE: 'BIDABLE'
        },
        BOX_COL_SIZES: {
            LARGE: 'ib-flex--basis-100',
            // 'LARGE: 'col-md-6 col-lg-6 col-xl-6 col-xs-12',
            MEDIUM: 'ib-mmb-dashboard__column'
            // 'MEDIUM: 'col-md-6 col-xs-12'
        },
        BOX_LINK_SIZES: {
            FULL: 'ib-box-menu__section--full',
            LEFT: 'ib-box-menu__section--left',
            RIGHT: 'ib-box-menu__section--right'
        },
        BOX_LINK_ICONS: {
            CHECK_IN: 'icon-checking_online',
            MESSAGES: 'icon-mensajes',
            AUCTION: 'icon-subasta',
            DOWNLOAD: 'icon-descargar',
            UPLOAD_FILE: 'icon-subir_archivos',
            UPGRADE: 'icon-upgrade'
        }
    };

    var fakeMmBAppConstants = {
        DOCUMENTS_SEGMENT_STATUS: {
            CODES: {
                ONLINE_DOCUMENTATION_ALLOWED: 'ONLINE_DOCUMENTATION_ALLOWED',
                ONLINE_DOCUMENTATION_NOT_ALLOWED: 'ONLINE_DOCUMENTATION_NOT_ALLOWED',
                NOT_AIRCHECK_SEGMENT: 'NOT_AIRCHECK_SEGMENT',
                UNKNOWN: 'UNKNOWN'
            },
            WARNINGS: [
                {
                    CODE: 'ONLINE_DOCUMENTATION_ALLOWED',
                    WARNING: null
                },
                {
                    CODE: 'NOT_AIRCHECK_SEGMENT',
                    WARNING: {
                        type: 'with-link',
                        icon: 'icon-informacion_2 ib-message-box__icon--big',
                        modifier: 'ib-message-box--center ib-message-box--boxed-with-icon ib-message-box--gray-50',
                        titleTxt: 'MMB_DOCUMENTS_ERROR_TITLE',
                        titleModifier: 'ib-message-box__title--xsmall ib-message-box__title--font-normal ib-message-box__title--bold',
                        text: ['MMB_DOCUMENTS_ERROR_DESCRIPTION'],
                        linkText: 'MMB_DOCUMENTS_ERROR_FIND_OUT',
                        urlLink: ''
                    }
                },
                {
                    CODE: 'ONLINE_DOCUMENTATION_NOT_ALLOWED',
                    WARNING: {
                        type: 'with-link',
                        icon: 'icon-reserva72 u-color-primary ib-message-box__icon--big',
                        modifier: ' ib-message-box--center ib-message-box--boxed-with-icon',
                        titleTxt: 'MMB_ALERT_IMPORTANT',
                        titleModifier: 'ib-message-box__title--xsmall ib-message-box__title--font-normal ib-message-box__title--bold',
                        text: ['MMB_DOCUMENTS_IMPORTANT_WARNING_MESSAGE'],
                        linkText: 'MMB_DOCUMENTS_ERROR_FIND_OUT',
                        urlLink: ''
                    }
                },
                {
                    CODE: 'UNKNOWN',
                    WARNING: {
                        type: 'with-link',
                        icon: 'icon-informacion_2 u-color-primary',
                        modifier: 'ib-message-box--center ib-message-box--boxed',
                        titleTxt: 'MMB_DOCUMENTS_STATUS_UNKNOWN_TITLE',
                        titleModifier: 'ib-message-box__title--xsmall ib-message-box__title--font-normal ib-message-box__title--bold',
                        text: ['MMB_DOCUMENTS_STATUS_UNKNOWN_TEXT'],
                        linkText: 'MMB_DOCUMENTS_STATUS_UNKNOWN_LINK',
                        urlLink: ''
                    }
                }
            ]
        },
        DOCUMENT_STATUS: [
            {
                ID: 'OK',
                CODES: ['DOCUMENTATION_OK', 'DOC_REVIEWED'],
                TITLE: 'MMB_DOCUMENTS_STATUS_OK_TITLE',
                DESCRIPTION: 'MMB_DOCUMENTS_STATUS_OK_DESCRIPTION',
                ICON: 'icon-validar',
                LINK: false
            },
            {
                ID: 'SEND',
                CODES: ['DOC_SENT'],
                TITLE: 'MMB_DOCUMENTS_STATUS_CONFIRMING_DOCUMENT_TITLE',
                DESCRIPTION: 'MMB_DOCUMENTS_STATUS_CONFIRMING_DOCUMENT_DESCRIPTION',
                ICON: 'icon-reloj',
                LINK: true
            },
            {
                ID: 'KO',
                CODES: ['DOCUMENTATION_KO'],
                TITLE: 'MMB_DOCUMENTS_STATUS_KO_TITLE',
                DESCRIPTION: 'MMB_DOCUMENTS_STATUS_UPLOAD_DOCUMENTS',
                ICON: 'icon-wrong',
                LINK: true
            },
            {
                ID: 'PENDIND',
                CODES: ['DOCUMENTATION_NOT_UPLOADED', 'PENDING'],
                TITLE: 'MMB_DOCUMENTS_STATUS_PENDING_TITLE',
                DESCRIPTION: 'MMB_DOCUMENTS_STATUS_UPLOAD_DOCUMENTS',
                ICON: 'icon-alertas_2',
                LINK: true
            },
            {
                ID: 'CANCELLED',
                CODES: ['REQUEST_CANCELLED', 'CLOSED_BY_AGENT'],
                TITLE: 'MMB_DOCUMENTS_STATUS_NOT_VERIFIED_TITLE',
                DESCRIPTION: 'MMB_DOCUMENTS_STATUS_NOT_VERIFIED_DESCRIPTION',
                ICON: 'icon-wrong',
                LINK: false
            }
        ]
    };

    var fakeBookingInfo = {
        passengers: ['passenger1', 'passenger2']
    };

    var fakeDigitalBoardingInfo = {
        digitalBoardings: {
            segments: [
                { id: 'id1', status: { code: 'UNKNOWN'}, url: 'url1', passengers:[{id: 'p1', airCheckStatus: 'airCheckStatus1'}]},
                { id: 'id2', status: { code: 'UNKNOWN'}, url: 'url2', passengers:[{id: 'p2', airCheckStatus: 'airCheckStatus2'}]}
            ]
        }
    };

    beforeEach(function () {
      angular.mock.module('ib-MmB-documents-card-module', 'LocalStorageModule', function ($provide) {
        $provide.value('BookingDashboardConstants', fakeBookingDashboardConstants);
        $provide.value('MmBAppConstants', fakeMmBAppConstants);
      });

      inject(function (_$controller_, _$rootScope_, _localStorageService_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        localStorage = _localStorageService_;
        controller = _$controller_('MmBDocumentsController', {
          $scope: $scope,
          $rootScope: $rootScope,
        });
      });
      $rootScope.$digest();
    });

    describe('when activate() function is called', function () {
      beforeEach(inject(function (_localStorageService_) {
        localStorage.set('bookingInfo', fakeBookingInfo);
        localStorage.set('digitalBoardingInfo', fakeDigitalBoardingInfo);
      }));

      it('should set correct value properties', function () {
        controller.model = {};
        controller.model.flights = [
            { sliceId: '01', segments: [{ segmentId: 'id1', sliceBaggage: { passBaggages: [{passengerId: 'p1', relatedPassengerId: 'p1',passengerType: 'INFANT', personalInfo: {name: 'alex', surname: 'boss'}}]},status: { code: 'UNKNOWN'}}, { segmentId: '1', sliceBaggage: { passBaggages: [{passengerId: 'p11', passengerType: 'INFANT', personalInfo: {name: 'john', surname: 'calvin'}}]},status: { code: 'UNKNOWN'}}] },
            { sliceId: '02', segments: [{ segmentId: 'id2', sliceBaggage: { passBaggages: [{passengerId: 'p2', passengerType: 'ADULT', personalInfo: {name: 'mar', surname: 'valta'}}]},status: { code: 'UNKNOWN'}}, { segmentId: '1', sliceBaggage: { passBaggages: [{passengerId: 'p12', passengerType: 'ADULT', personalInfo: {name: 'kirk', surname: 'hammet'}}]},status: { code: 'UNKNOWN'}}] }
        ]
        controller.$onInit();
        expect(controller.showInfoDocuments).toBe(true);
      });
    });

});
