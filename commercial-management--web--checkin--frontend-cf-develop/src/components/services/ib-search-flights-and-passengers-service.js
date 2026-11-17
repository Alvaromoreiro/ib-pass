import dayjs from 'dayjs';

(function () {
    'use strict';
    //Service that looks for the flights and passengers information of input locator and surname
    angular
        .module('ib-checkin-services-module')
        .service('SearchFlightsPassengersService', SearchFlightsPassengersService);

    SearchFlightsPassengersService.$inject = ['$rootScope', 'base64', 'CheckForDeepLink', 'GetBookingInformationService', '$location', 'ModalService', 'BookingNameService', 'localStorageService', '$filter', 'CkiDatalayerUtilsService', 'IbLotusOtpModalService', 'CloseSessionService'];
    function SearchFlightsPassengersService($rootScope, base64, CheckForDeepLink, GetBookingInformationService, $location, ModalService, BookingNameService, localStorageService, $filter, CkiDatalayerUtilsService, IbLotusOtpModalService, CloseSessionService) {

        var self = this;
        self.searchFlighsPassengersByLocatorAndSurname = searchFlighsPassengersByLocatorAndSurname;
        self.searchFlighsPassengersDeepLink = searchFlighsPassengersDeepLink;
        self.deepLinkChecked = deepLinkChecked;
        self.flightsAndPassengersInfo = {};
        self.surname = '';
        self.locator = '';
        self.flownSegments = null;

        const UNCHECKABLE_CODES = new Set(['PENDING AQQ', 'PENDING EVUS', 'UNCHECKABLE']);
        const CHECKED_CODES = new Set(['CHECKED', 'STAND BY']);
        const REISSUE_CODE = 'REISSUE';
        const HTTP_CONFLICT = 409;
        const HTTP_FORBIDDEN = 403;
        const OTP_INTERNAL_CODE = 'PAC_PRM_6969';
        const OTP_SESSION_MS = 5 * 60 * 1000; // 5 minutes

        ////////////////

        /**
         * Call service for get booking with surname and locator
         * @param {String} surname
         * @param {String} locator
         */
        function searchFlighsPassengersByLocatorAndSurname(surname, locator, flownSegments) {
            ModalService.isWaiting();
            self.surname = surname;
            self.locator = locator;
            self.flownSegments = flownSegments;
            //first get booking information service
            GetBookingInformationService.getBookingInformationByLocatorAndSurname(base64.encode(surname), locator, flownSegments)
                .then(successBookingInfo, bookingInformationReject);
        }

        /**
         * Call service of deeplink with code recived in params
         * @param {String} code Code codified
         */
        function searchFlighsPassengersDeepLink(code) {
            ModalService.isWaiting();
            //first get booking information service
            GetBookingInformationService.getBookingInformationByDeepLink(code).then(successBookingInfo, bookingInformationReject);
        }

        function getErrorKind(error) {
            const errorCode = error?.errorCode ?? '';
            const internal = error?.internalErrorCode ?? '';
            if (errorCode === HTTP_CONFLICT) return 'CONFLICT';
            if (errorCode === HTTP_FORBIDDEN && internal === OTP_INTERNAL_CODE) return 'OTP';
            return 'DEFAULT';
        };

        function bookingInformationReject(error) {
            ModalService.isNotWaiting();

            const kind = getErrorKind(error);
            const handlers = {
                CONFLICT: () => handleConflict(),
                OTP: () => handleOtp(error?.data?.otp ?? {}),
                DEFAULT: () => handleGenericError(error?.message, error?.internalErrorCode ?? '', error),
            };

            return (handlers[kind] || handlers.DEFAULT)();
        }


        function handleConflict() {
            const flowId = localStorageService.get('flowId');
            BookingNameService.checkName(self.surname, flowId);
        }

        function handleOtp(otp) {
            const email = otp.email || '';
            const sessionId = otp.sessionToken || '';
            const sessionRequested = new Date();
            const sessionExpiration = new Date(Date.now() + OTP_SESSION_MS);

            IbLotusOtpModalService.showOTPModal({
                email: email,
                voucherCode: '',
                sessionId: sessionId,
                sessionExpiration: sessionExpiration,
                sessionRequested: sessionRequested
            }).then(() => successBookingInfo(), errorOTP);
        }

        function successBookingInfo(flightsAndPassengersInfo) {
            self.flightsAndPassengersInfo = flightsAndPassengersInfo ?? localStorageService.get('bookingInfo');
            $rootScope.timeSession.startTime = dayjs();
            ModalService.isNotWaiting();
            CkiDatalayerUtilsService.updatePnr();

            //Check for deep link information
            CheckForDeepLink.checkDeepLink(self.flightsAndPassengersInfo.deepLinkInformation).then(successCheckDeepLink, () => ModalService.isNotWaiting());
        }

        function successCheckDeepLink() {
            ModalService.isNotWaiting();
            deepLinkChecked();
        }

        function errorOTP(error) {
            if (error.state === 'RESEND_CODE') {
                CloseSessionService.closeSession();
                searchFlighsPassengersByLocatorAndSurname(self.surname, self.locator, self.flownSegments);
            }
        }

        function handleGenericError(message, internalErrorCode, error) {
            ModalService.setErrorMessage(message);
            ModalService.setErrorCode(internalErrorCode);
            ModalService.showGenericError(error).result.then(angular.noop, angular.noop);
        }

        function deepLinkChecked() {
            var segmentsPassengersInfo, error = { message: '' }, onlyChecked = { return: false, outward: false };
            var params = localStorageService.get('urlParams');
            $rootScope.$emit('destroyBanners', true);
            if (params.travelAgencies && params.reInvoicing) {
                segmentsPassengersInfo = localStorageService.get('bookingInfo');
                checkPassengerFlightsStatus(segmentsPassengersInfo);
                deleteNotAvailableSegments(segmentsPassengersInfo);
                onlyChecked = checkSegmentsStates(segmentsPassengersInfo, onlyChecked);
                if (segmentsPassengersInfo.returnSegments.length === 0 && segmentsPassengersInfo.outwardSegments.length === 0) {
                    error.message = $filter('translate')('DE_INVOICING_ERROR_NO_UNDOCHECKIN_SEGMENTS');
                    ModalService.setErrorMessage(error.message);
                    ModalService.showGenericError(error).result.then(angular.noop, angular.noop);
                } else if (!onlyChecked.return && !onlyChecked.outward) {
                    error.message = $filter('translate')('DE_INVOICING_ERROR_ONLY_REISSUE');
                    ModalService.setErrorMessage(error.message);
                    ModalService.showGenericError(error).result.then(angular.noop, angular.noop);
                } else {
                    $location.path('/uncoac');
                }
            } else {
                $location.path('/ibcoac');
            }
        }

        function checkPassengerFlightsStatus(segmentsPassengersInfo) {
            processSegments(segmentsPassengersInfo?.returnSegments, 'reissue');
            processSegments(segmentsPassengersInfo?.outwardSegments, 'reissueControl');
        }

        function processSegments(segments = [], reissueProp) {
            for (const seg of segments) {
                const { isChecked, hasReissue, toDelete } = summarizePassengers(seg?.passengers);

                seg.isChecked = isChecked;
                seg[reissueProp] = hasReissue;
                seg.toDelete = toDelete;
            }
        }

        function summarizePassengers(passengers = []) {
            const codes = passengers.map(p => p?.status?.code).filter(Boolean);

            const acc = codes.reduce((a, c) => {
                a.isChecked = a.isChecked || CHECKED_CODES.has(c);
                a.hasReissue = a.hasReissue || c === REISSUE_CODE;
                a.checkable += (c === 'CHECKABLE') | 0;
                a.uncheck += UNCHECKABLE_CODES.has(c) | 0;
                return a;
            }, { isChecked: false, hasReissue: false, checkable: 0, uncheck: 0 });

            return {
                isChecked: acc.isChecked,
                hasReissue: acc.hasReissue,
                toDelete: codes.length === (acc.checkable + acc.uncheck),
            };
        }

        function deleteNotAvailableSegments(segmentsPassengersInfo) {
            function removeMarked(arr) {
                for (var i = arr.length - 1; i >= 0; i--) {
                    if (arr[i].toDelete) arr.splice(i, 1);
                }
            }

            removeMarked(segmentsPassengersInfo.returnSegments);
            removeMarked(segmentsPassengersInfo.outwardSegments);
        }

        function checkSegmentsStates(segmentsPassengersInfo, onlyChecked = {}) {
            const hasCheckedNoReissue = (segments = []) =>
                segments.some(s => !!s.isChecked) && !segments.some(s => !!s.reissueControl);

            return {
                ...onlyChecked,
                return: hasCheckedNoReissue(segmentsPassengersInfo.returnSegments),
                outward: hasCheckedNoReissue(segmentsPassengersInfo.outwardSegments),
            };
        }
    }
})();
