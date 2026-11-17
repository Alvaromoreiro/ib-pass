(function () {
    'use strict';

    angular.module('ib-check-in-search').service('CheckinSearchService', CheckinSearchService);

    CheckinSearchService.$inject = [
        '$rootScope',
        'CommonsCheckLoginWCSService',
        'GetFrequentFlyersService',
        'ModalService',
        '$cookies',
        '$location',
        'CommonsSessionStorageService',
        'SearchFlightsPassengersService',
        'CkiDatalayerUtilsService',
        'UpdateFlightsPassengerInfoService',
        'GetCKICachedInformationService',
        'EndpointsService',
        'CkiDatalayerConstants',
        'CheckinAppConstants',
        'CkiCommonsGetLoginInfoService',
        'CommonsUserUtilsService',
        'CommonsLoginUtilsService',
        'FlightsPassengersService',
        'NewMainHeaderFacade',
        '$timeout',
        'IbSessionConfigService',
        'IbAncillariesPaymentUtilsService',
        'IbUtilsService',
        'CommonsModalService'
    ];
    function CheckinSearchService (
        $rootScope,
        CommonsCheckLoginWCSService,
        GetFrequentFlyersService,
        ModalService,
        $cookies,
        $location,
        CommonsSessionStorageService,
        SearchFlightsPassengersService,
        CkiDatalayerUtilsService,
        UpdateFlightsPassengerInfoService,
        GetCKICachedInformationService,
        EndpointsService,
        CkiDatalayerConstants,
        CheckinAppConstants,
        CkiCommonsGetLoginInfoService,
        CommonsUserUtilsService,
        CommonsLoginUtilsService,
        FlightsPassengersService,
        NewMainHeaderFacade,
        $timeout,
        IbSessionConfigService,
        IbAncillariesPaymentUtilsService,
        IbUtilsService,
        CommonsModalService
    ) {
        const self = this;
        self.initCheckin = initCheckin;
        self.getDinamicPricingCookieParameter = getDinamicPricingCookieParameter;

        ////////////////

        function initCheckin () {
            const gdrInfo = getSessionJson('IBERIACOM_GDR_PA_ACCESS');
            const gdrError = getSessionJson('IBERIACOM_GDR_PA_ERROR');

            ModalService.isNotWaiting();

            if (!CommonsSessionStorageService.isSupported) {
                openPrivateBrowserModal();
                return;
            }

            const params = initializeCheckin();

            if (isUserLogged()) {
                ModalService.isWaiting();
                getEndpointsVersion(() => goLoggedAccess(params, gdrInfo, gdrError));
                return;
            }

            goAnonymous(params, gdrInfo, gdrError);
        }

        function initializeCheckin () {
            const initialParams = getInitialParameters();

            CommonsSessionStorageService.set('buildNumber', IbUtilsService.generateBuildNumberQueryString());
            CommonsSessionStorageService.set('urlParams', initialParams);

            CommonsCheckLoginWCSService.generateSSOInfo(true);
            IbSessionConfigService.initStorage();

            $rootScope.$broadcast('initializeGreyBar');
            CommonsSessionStorageService.set('channel', initialParams.channel || '');

            return initialParams;
        }

        function isUserLogged () {
            const cookiesInfo = CommonsCheckLoginWCSService.generateSSOInfo(true);

            return cookiesInfo.isLogged;
        }

        function openPrivateBrowserModal () {
            ModalService.openGenericModal('md', 'ibcose.vista-modal-private-browser-mode', true, {
                idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.PRIVATE_BROWSER_ERROR
            });
        }

        function getInitialParameters () {
            return {
                pnr: IbUtilsService.getParameterByName({ name: CheckinAppConstants.URL_PARAMS.PNR }),
                surname: IbUtilsService.getParameterByName({ name: CheckinAppConstants.URL_PARAMS.SURNAME }),
                market: IbUtilsService.getParameterByName({ name: CheckinAppConstants.URL_PARAMS.MARKET }),
                language: IbUtilsService.getParameterByName({ name: CheckinAppConstants.URL_PARAMS.LANGUAGE }),
                channel: IbUtilsService.getParameterByName({ name: CheckinAppConstants.URL_PARAMS.CHANNEL }),
                device: IbUtilsService.getParameterByName({ name: CheckinAppConstants.URL_PARAMS.DEVICE }),
                errorCode: IbUtilsService.getParameterByName({ name: CheckinAppConstants.URL_PARAMS.ERROR_CODE }),
                code: IbUtilsService.getParameterByName({ name: CheckinAppConstants.URL_PARAMS.CODE }),
                travelAgencies: IbUtilsService.getTravelAgencies(CheckinAppConstants.URL_PARAMS.CKI_AAVV),
                reInvoicing: IbUtilsService.getTravelAgencies(CheckinAppConstants.URL_PARAMS.UNDOCKI),
                travelAgent: IbUtilsService.getParameterByName({
                    name: CheckinAppConstants.URL_PARAMS.TRAVEL_AGENT
                })
            };
        }

        function goLoggedAccess (params, gdrInfo, gdrError) {
            CkiCommonsGetLoginInfoService.checkCustomerStatus(true).then(
                (data) => handleLoggedCustomerStatus(data, params, gdrInfo, gdrError),
                (error) => handleLoggedAccessError(error, params, gdrInfo, gdrError),
            );
        }

        function handleLoggedCustomerStatus (data, params, gdrInfo, gdrError) {
            if (!data) {
                ModalService.isNotWaiting();
                goAnonymous(params, gdrInfo, gdrError);
                return;
            }

            CommonsSessionStorageService.set('loggedInfo', CommonsSessionStorageService.get('customerData'));
            CkiDatalayerUtilsService.updateDatalayerInitType(CkiDatalayerConstants.DATALAYER_VALUES.INIT_IB_PLUS);

            if (params.code !== null) {
                startDeepLinkSearch(params);
                return;
            }

            if (gdrError) {
                redirectToGdrError(gdrError);
                return;
            }

            if (startGdrInfo(gdrInfo, params)) {
                return;
            }

            handleLoggedUserWithoutAccess();
        }

        function startGdrInfo (gdrInfo, params) {
            if (hasLocatorAndSurname(params) && !gdrInfo) {
                startLocatorSearch(params);
                return true;
            }

            if (gdrInfo) {
                startGdrCheckin(gdrInfo);
                return true;
            }
        }

        function handleLoggedAccessError (error, params, gdrInfo, gdrError) {
            ModalService.isNotWaiting();
            serviceError(error);
            goAnonymous(params, gdrInfo, gdrError);
        }

        function handleLoggedUserWithoutAccess () {
            $rootScope.$emit('destroyBanners', true);
            $rootScope.$broadcast('updateLoginModelEvent');

            if (!CommonsUserUtilsService.isSoftUser() && !CommonsUserUtilsService.isUserLoggedONB()) {
                $location.path('/ibcose2');
                return;
            }

            ModalService.isNotWaiting();
        }

        function goAnonymous (params, gdrInfo, gdrError) {
            CommonsLoginUtilsService.updateStateToAnonymous();

            CkiDatalayerUtilsService.updateDatalayerInitType(CkiDatalayerConstants.DATALAYER_VALUES.INIT_LOCATOR);

            if (params.code !== null) {
                startAnonymousDeepLinkSearch(params);
                return;
            }

            if (gdrError) {
                redirectToGdrError(gdrError);
                return;
            }

            if (hasLocatorAndSurname(params) && !gdrInfo) {
                startAnonymousLocatorSearch(params);
                return;
            }

            if (gdrInfo) {
                startAnonymousGdrCheckin(gdrInfo);
                return;
            }

            getEndpointsVersion(GetFrequentFlyersService.getFrequentFlyers);
        }

        function startDeepLinkSearch (params) {
            ModalService.isWaiting();
            CommonsSessionStorageService.set('confirmationPNR', false);
            searchFlightsDeepLink(params);
        }

        function startAnonymousDeepLinkSearch (params) {
            ModalService.isWaiting();
            CommonsSessionStorageService.set('confirmationPNR', false);
            getEndpointsVersion(() => searchFlightsDeepLink(params));
        }

        function startLocatorSearch (params) {
            CkiDatalayerUtilsService.updateDatalayerInitType(CkiDatalayerConstants.DATALAYER_VALUES.INIT_LOCATOR);

            CommonsSessionStorageService.set('confirmationPNR', false);
            searchFlightsPassengers(params);
        }

        function startAnonymousLocatorSearch (params) {
            ModalService.isWaiting();
            CommonsSessionStorageService.set('confirmationPNR', false);
            getEndpointsVersion(() => searchFlightsPassengers(params));
        }

        function startGdrCheckin (gdrInfo) {
            removeSessionItem('IBERIACOM_GDR_PA_ACCESS');
            configureGdrCheckin(gdrInfo);
            doCheckinFromGdr(gdrInfo);
        }

        function startAnonymousGdrCheckin (gdrInfo) {
            removeSessionItem('IBERIACOM_GDR_PA_ACCESS');
            configureGdrCheckin(gdrInfo);
            getEndpointsVersion(() => doCheckinFromGdr(gdrInfo));
        }

        function configureGdrCheckin (gdrInfo) {
            CommonsSessionStorageService.set('checkinPa', true);
            CommonsSessionStorageService.set('flowId', gdrInfo.checkinId);
        }

        function redirectToGdrError (gdrError) {
            removeSessionItem('IBERIACOM_GDR_PA_ERROR');
            $location.path(gdrError.nextStep);
        }

        function hasLocatorAndSurname (params) {
            return Boolean(params.pnr && params.surname);
        }

        function searchFlightsPassengers (params) {
            GetFrequentFlyersService.getFrequentFlyers().then(() => {
                removeUrlParameters();

                IbSessionConfigService.setPNR(params.pnr);
                CommonsSessionStorageService.set('checkinSurname', params.surname);

                SearchFlightsPassengersService.searchFlighsPassengersByLocatorAndSurname(params.surname, params.pnr, false);
            });
        }

        function searchFlightsDeepLink (params) {
            GetFrequentFlyersService.getFrequentFlyers().then(() => {
                removeUrlParameters();
                SearchFlightsPassengersService.searchFlighsPassengersDeepLink(params.code);
            });
        }

        function serviceError (error) {
            ModalService.isNotWaiting();
            ModalService.setErrorMessage(error.message);
            ModalService.setErrorCode(error.internalErrorCode);
            ModalService.isError(error);

            removeUrlParameters();
        }

        function doCheckinFromGdr (gdrInfo) {
            const selectedSegment = buildSelectedSegment(gdrInfo);
            const passengerAvailable = getSelectedPassengers(gdrInfo);
            const printBoardingCard = isBoardingCardStep(gdrInfo);
            const segments = [selectedSegment];

            selectedSegment.pasajerosSelected = passengerAvailable;

            const dataGdrInfo = {
                selectedSegment: selectedSegment,
                segments: segments,
                passengerAvailable: passengerAvailable,
                printBoardingCard: printBoardingCard
            };

            GetCKICachedInformationService.getCachedInformation().then(
                (cachedData) =>
                    handleCachedInformation(
                        cachedData,
                        gdrInfo,
                        dataGdrInfo
                    ),
                handleCachedInformationError,
            );
        }

        function buildSelectedSegment (gdrInfo) {
            const selectedSegment = gdrInfo.selectedSegment[0];

            angular.extend(selectedSegment, {
                whatToDo: {
                    selectedBlock: {
                        nextStep: gdrInfo.nextStep
                    }
                }
            });

            return selectedSegment;
        }

        function getSelectedPassengers (gdrInfo) {
            return gdrInfo.selectedPassenger.map((passengerId) => ({
                id: passengerId
            }));
        }

        function isBoardingCardStep (gdrInfo) {
            return gdrInfo.nextStep === CheckinAppConstants.SHUTTLE_NEXT_STEPS.BOARDING_CARDS;
        }

        function handleCachedInformation (
            cachedData,
            gdrInfo,
            dataGdrInfo,
        ) {
            const { selectedSegment, segments, passengerAvailable, printBoardingCard } = dataGdrInfo;
            const checkinPa = CommonsSessionStorageService.get('checkinPa') || false;

            CommonsSessionStorageService.set('bookingInfo', cachedData);

            if (cachedData?.gdsLocator) {
                IbSessionConfigService.setPNR(cachedData.gdsLocator);
            }

            if (checkinPa) {
                const params = {
                    gdrInfo: gdrInfo,
                    selectedSegment: selectedSegment,
                    segments: segments,
                    passengerAvailable: passengerAvailable,
                    printBoardingCard: printBoardingCard
                };
                searchFlightsForGdr(params);
                return;
            }

            updateFlightsPassengerInfo(passengerAvailable, segments, printBoardingCard, selectedSegment);
        }

        function searchFlightsForGdr (params) {
            const { gdrInfo, selectedSegment, segments, passengerAvailable, printBoardingCard } = params;
            FlightsPassengersService.searchFlightsAndPassengers().then((data) => {
                const availableSegments = getAvailableGdrSegments(data, segments);

                if (availableSegments.length > 0) {
                    configureGdrSegments(data, gdrInfo, selectedSegment, availableSegments);
                }

                updateFlightsPassengerInfo(passengerAvailable, availableSegments, printBoardingCard, selectedSegment);
            });
        }

        function getAvailableGdrSegments (data, segments) {
            const flightSegments = data?.flightsPassengersInfo?.segments || [];

            return flightSegments.filter((flightSegment) => {
                return segments.some((segment) => {
                    return flightSegment.id.toString() === segment.id.toString();
                });
            });
        }

        function configureGdrSegments (data, gdrInfo, selectedSegment, availableSegments) {
            initHeader(data);

            CommonsSessionStorageService.set('segmentsSelected', availableSegments);

            angular.extend(selectedSegment, availableSegments[0]);

            selectedSegment.whatToDo.selectedBlock = {
                nextStep: gdrInfo.nextStep
            };
        }

        function updateFlightsPassengerInfo (passengerAvailable, segments, printBoardingCard, selectedSegment) {
            UpdateFlightsPassengerInfoService.updateFlightsPassengerInfo(
                passengerAvailable,
                segments,
                printBoardingCard,
                [],
                selectedSegment,
            );
        }

        function handleCachedInformationError (error) {
            ModalService.isNotWaiting();
            ModalService.setErrorMessage(error.message);
            ModalService.isError(error);
        }

        function getEndpointsVersion (callback) {
            EndpointsService.getEndpoints().then((endpointsData) => {
                IbSessionConfigService.saveEndpoints(endpointsData.data.endpoints);
                callback();
            }, callback);
        }

        function removeUrlParameters () {
            const checkinQuadrigam = CheckinAppConstants.HASH_PAGES.CHECKIN.replace('#', '#!');

            if (hasUndoCheckinParameters() && !$location.search().ckiParaAAVV) {
                redirectAfterUndoCheckin(checkinQuadrigam);
            } else if (isUnSearchPage()) {
                location = location.pathname + location.search + checkinQuadrigam;
            } else if (hasLocatorParameters()) {
                location = location.pathname + getCleanQueryParameters() + checkinQuadrigam + location.search;
            }

            $location.search({}).replace();
        }

        function hasUndoCheckinParameters () {
            const { CKI_AAVV, UNDOCKI, TRAVEL_AGENT } = CheckinAppConstants.UNDOCHECKIN;

            return (
                location.search.indexOf(CKI_AAVV) !== -1 ||
                location.search.indexOf(UNDOCKI) !== -1 ||
                location.search.indexOf(TRAVEL_AGENT) !== -1
            );
        }

        function isUnSearchPage () {
            const { UNDOCKI } = CheckinAppConstants.UNDOCHECKIN;
            const unSearch = CheckinAppConstants.QUADRIGAM.UN_SEARCH.toLowerCase();

            return location.hash.indexOf(UNDOCKI) === -1 && location.hash.indexOf(unSearch) !== -1;
        }

        function hasLocatorParameters () {
            return (
                location.search.indexOf(CheckinAppConstants.USER_PARAMS.SURNAME) !== -1 ||
                location.search.indexOf(CheckinAppConstants.USER_PARAMS.PNR) !== -1
            );
        }

        function redirectAfterUndoCheckin (checkinQuadrigam) {
            const cleanParams = getCleanQueryParameters();

            if (hasAllUndoCheckinParameters()) {
                location = location.pathname + cleanParams + CheckinAppConstants.HASH_PAGES.UNDOCHECKIN + location.search;
                return;
            }

            location = location.pathname + cleanParams + checkinQuadrigam;
        }

        function hasAllUndoCheckinParameters () {
            const { CKI_AAVV, UNDOCKI, TRAVEL_AGENT } = CheckinAppConstants.UNDOCHECKIN;

            return (
                IbUtilsService.getTravelAgencies(CKI_AAVV) &&
                IbUtilsService.getTravelAgencies(UNDOCKI) &&
                IbUtilsService.getParameterByName({ name: CheckinAppConstants.URL_PARAMS.TRAVEL_AGENT }) &&
                !$location.search().ckiParaAAVV
            );
        }

        function getCleanQueryParameters () {
            const excludedParameters = getExcludedQueryParameters();
            const queryParameters = new URLSearchParams(location.search);
            const cleanParameters = new URLSearchParams();

            queryParameters.forEach((value, key) => {
                if (!excludedParameters.includes(key)) {
                    cleanParameters.append(key, value);
                }
            });

            const queryString = cleanParameters.toString();

            return queryString ? `?${queryString}` : '';
        }

        function getExcludedQueryParameters () {
            return [
                CheckinAppConstants.USER_PARAMS.SURNAME,
                CheckinAppConstants.USER_PARAMS.PNR,
                CheckinAppConstants.UNDOCHECKIN.UNDOCKI,
                CheckinAppConstants.UNDOCHECKIN.TRAVEL_AGENT
            ];
        }

        function getSessionJson (key) {
            const value = CommonsSessionStorageService.get(key);

            if (!value) {
                return null;
            }

            try {
                return JSON.parse(value);
            } catch (error) {
                CommonsSessionStorageService.remove(key);
                return null;
            }
        }

        function removeSessionItem (key) {
            CommonsSessionStorageService.remove(key);
        }

        function getDinamicPricingCookieParameter () {
            const isDinamicPricing = !!$cookies.get(CheckinAppConstants.COOKIES.DYNAMIC_PRICING);
            return isDinamicPricing;
        }

        function initHeader (data) {
            const headerInfo = IbAncillariesPaymentUtilsService.getInfoHeader(
                data?.flightsPassengersInfo?.segments,
                data?.flightsPassengersInfo?.passengers,
            );

            $rootScope.showMainHeader = false;
            $rootScope.showHeaders = true;
            CommonsSessionStorageService.set('headerInfo', headerInfo);
            $timeout(() => {
                NewMainHeaderFacade.initHeader(
                    {
                        originDestination: headerInfo,
                        redemption: '',
                        flightType: CheckinAppConstants.FLIGHTTYPE,
                        currency: '',
                        showModalBackHome: true
                    },
                    { hasSteps: false, steps: 'DEFAULT_STEPS', position: 0 },
                    {
                        onLogin: onLogin,
                        onError: onError,
                        afterLogin: () => { },
                        userLogged: CommonsSessionStorageService.get('userLogged'),
                        loggedData:
                            CommonsSessionStorageService.get('customerData') ||
                            CommonsSessionStorageService.get('membershipData') ||
                            undefined
                    },
                );
            });
        }

        function onLogin () {
            CommonsModalService.showWaitingModal(
                'ib-modal-loading-plane',
                'ib-modals ib-modals--transparent ib-modals--loading-page',
                true,
            );
        }

        function onError (error) {
            CommonsModalService.finishWaiting();
            CommonsModalService.showGenericDynamicModal(
                true,
                'generic-login-modal-error.html',
                error,
                'GenericErrorModalController',
                error?.stateUserLogged ? 'ib-modals--backdrop-off' : null,
            );
        }
    }
})();
