'use strict';

describe('Service: SearchFlightsPassengersService', function () {
    let $q,
        $rootScope,
        $location,
        $filter,
        service,
        base64,
        CheckForDeepLink,
        GetBookingInformationService,
        ModalService,
        BookingNameService,
        localStorageService,
        CkiDatalayerUtilsService,
        IbLotusOtpModalService,
        CloseSessionService;

    // --- Constants / fixtures
    const HTTP_CONFLICT = 409;
    const HTTP_FORBIDDEN = 403;
    const OTP_INTERNAL_CODE = 'PAC_PRM_6969';

    const LOCATOR = 'ABC123';
    const SURNAME = 'DOE';
    const PNR = 'PNR-XYZ';
    const FLOW_ID = 'FLOW-123';

    const DEFAULT_PARAMS = { travelAgencies: false, reInvoicing: false };
    const deeplinkInfo = { any: 'thing' };

    // --- Micro-helpers
    const flush = () => $rootScope.$apply();
    const ok = (v) => $q.when(v);
    const fail = (e) => $q.reject(e);

    const pax = (statusCodes) => statusCodes.map(code => ({ status: { code } }));
    const mkSegments = ({ outward = [], ret = [] }) => ({
        outwardSegments: outward.map(list => ({ passengers: pax(list) })),
        returnSegments: ret.map(list => ({ passengers: pax(list) })),
        deepLinkInformation: deeplinkInfo,
    });

    // state shared y stub de localStorage.get
    let segmentsPassengersInfoFixture;

    function setUrlParams(params = DEFAULT_PARAMS) {
        localStorageService.get.and.callFake((key) => {
            if (key === 'PNR') return PNR;
            if (key === 'urlParams') return params;
            if (key === 'bookingInfo') return segmentsPassengersInfoFixture;
            if (key === 'flowId') return FLOW_ID;
            return undefined;
        });
        localStorageService.get.calls.reset();
    }

    // Helpers
    function expectGenericError(msgKey, extra = {}) {
        if (msgKey) expect(ModalService.setErrorMessage).toHaveBeenCalledWith(msgKey);
        if (extra.setCode) expect(ModalService.setErrorCode).toHaveBeenCalledWith(extra.setCode);
        expect(ModalService.showGenericError).toHaveBeenCalled();
    }

    function expectNavigates(path) {
        expect($location.path).toHaveBeenCalledWith(path);
    }

    function runDeepLinkDecision({ name, segs, params, expectPath, expectErrorKey }) {
        it(name, function () {
            segmentsPassengersInfoFixture = mkSegments(segs);
            setUrlParams(params);

            service.deepLinkChecked(segmentsPassengersInfoFixture);
            flush();

            if (expectErrorKey) {
                expectGenericError(expectErrorKey);
                if (expectPath) {
                    expect($location.path).not.toHaveBeenCalledWith('/uncoac');
                }
            } else if (expectPath) {
                expectNavigates(expectPath);
            }
        });
    }

    beforeEach(angular.mock.module('ib-checkin-services-module'));

    beforeEach(angular.mock.module(function ($provide) {
        base64 = { encode: jasmine.createSpy('encode').and.callFake(s => s) };

        CheckForDeepLink = {
            checkDeepLink: jasmine.createSpy('checkDeepLink').and.callFake(() => ok()),
        };

        GetBookingInformationService = {
            getBookingInformationByLocatorAndSurname: jasmine
                .createSpy('getBookingInformationByLocatorAndSurname')
                .and.callFake(() => ok(mkSegments({}))),
            getBookingInformationByDeepLink: jasmine
                .createSpy('getBookingInformationByDeepLink')
                .and.callFake(() => ok(mkSegments({}))),
        };

        ModalService = {
            isWaiting: jasmine.createSpy('isWaiting'),
            isNotWaiting: jasmine.createSpy('isNotWaiting'),
            setErrorMessage: jasmine.createSpy('setErrorMessage'),
            setErrorCode: jasmine.createSpy('setErrorCode'),
            showGenericError: jasmine.createSpy('showGenericError').and.callFake(() => ({ result: $q.defer().promise })),
        };

        BookingNameService = { checkName: jasmine.createSpy('checkName') };
        localStorageService = { get: jasmine.createSpy('get') };
        $location = { path: jasmine.createSpy('path') };
        CkiDatalayerUtilsService = { updatePnr: jasmine.createSpy('updatePnr') };
        IbLotusOtpModalService = { showOTPModal: jasmine.createSpy('showOTPModal').and.callFake(() => ok()) };
        CloseSessionService = { closeSession: jasmine.createSpy('closeSession') };

        // translate filter -> echo key
        $filter = function (name) {
            if (name === 'translate') return (key) => key || 'TRANSLATED_MESSAGE';
            throw new Error('Unexpected filter: ' + name);
        };

        $provide.value('base64', base64);
        $provide.value('CheckForDeepLink', CheckForDeepLink);
        $provide.value('GetBookingInformationService', GetBookingInformationService);
        $provide.value('$location', $location);
        $provide.value('ModalService', ModalService);
        $provide.value('BookingNameService', BookingNameService);
        $provide.value('localStorageService', localStorageService);
        $provide.value('$filter', $filter);
        $provide.value('CkiDatalayerUtilsService', CkiDatalayerUtilsService);
        $provide.value('IbLotusOtpModalService', IbLotusOtpModalService);
        $provide.value('CloseSessionService', CloseSessionService);
    }));

    beforeEach(inject(function (_$q_, _$rootScope_, SearchFlightsPassengersService) {
        $q = _$q_;
        $rootScope = _$rootScope_;
        $rootScope.timeSession = { startTime: null };

        service = SearchFlightsPassengersService;

        segmentsPassengersInfoFixture = mkSegments({});
        setUrlParams(DEFAULT_PARAMS);
    }));

    // --- Success paths
    const caseSuccessPaths = [
        {
            name: 'searchFlighsPassengersByLocatorAndSurname → success sets session, updates PNR, checks deeplink, navigates /ibcoac',
            spy: () => GetBookingInformationService.getBookingInformationByLocatorAndSurname,
            call: () => service.searchFlighsPassengersByLocatorAndSurname(SURNAME, LOCATOR, false),
            expectBase64: true,
            expectStartTime: true
        },
        {
            name: 'searchFlighsPassengersDeepLink → success updates PNR, checks deeplink, navigates /ibcoac',
            spy: () => GetBookingInformationService.getBookingInformationByDeepLink,
            call: () => service.searchFlighsPassengersDeepLink('encoded-code'),
            expectBase64: false,
            expectStartTime: false
        }
    ];
    caseSuccessPaths.forEach(({ name, spy, call, expectBase64, expectStartTime }) => {
        it(name, function () {
            const info = mkSegments({});
            spy().and.returnValue(ok(info));

            call();
            flush();

            expect(ModalService.isWaiting).toHaveBeenCalled();
            if (expectBase64) expect(base64.encode).toHaveBeenCalledWith(SURNAME);
            expect(service.flightsAndPassengersInfo).toEqual(info);
            if (expectStartTime) expect($rootScope.timeSession.startTime).toBeDefined();

            //expect(CkiDatalayerUtilsService.updatePnr).toHaveBeenCalledWith({ provider: '', reference: PNR });
            expect(CheckForDeepLink.checkDeepLink).toHaveBeenCalledWith(deeplinkInfo);
            expect(ModalService.isNotWaiting).toHaveBeenCalled();
            expect($location.path).toHaveBeenCalledWith('/ibcoac');
        });
    });

    // --- Errors

    it('bookingInformationReject: 409 → BookingNameService.checkName(surname, flowId)', function () {
        GetBookingInformationService.getBookingInformationByLocatorAndSurname.and.returnValue(fail({ errorCode: HTTP_CONFLICT }));
        service.surname = SURNAME;

        service.searchFlighsPassengersByLocatorAndSurname(SURNAME, LOCATOR, true);
        flush();

        expect(ModalService.isNotWaiting).toHaveBeenCalled();
        expect(BookingNameService.checkName).toHaveBeenCalledWith(SURNAME, FLOW_ID);
    });

    it('bookingInformationReject: 403 + OTP code → opens OTP modal and navigates /ibcoac', function () {
        const otp = { email: 'user@example.com', sessionToken: 'sess-123' };
        const err = { errorCode: HTTP_FORBIDDEN, internalErrorCode: OTP_INTERNAL_CODE, data: { otp } };
        GetBookingInformationService.getBookingInformationByLocatorAndSurname.and.returnValue(fail(err));

        service.searchFlighsPassengersByLocatorAndSurname(SURNAME, LOCATOR, false);
        flush();

        expect(ModalService.isNotWaiting).toHaveBeenCalled();
        expect(IbLotusOtpModalService.showOTPModal).toHaveBeenCalled();
        const args = IbLotusOtpModalService.showOTPModal.calls.mostRecent().args[0];
        expect(args.email).toBe(otp.email);
        expect(args.sessionId).toBe(otp.sessionToken);
        expect(args.sessionRequested instanceof Date).toBe(true);
        expect(args.sessionExpiration instanceof Date).toBe(true);
        expectNavigates('/ibcoac');
    });

    it('bookingInformationReject: generic error → sets message/code and shows generic modal', function () {
        const err = { errorCode: 500, internalErrorCode: 'INT_X', message: 'Boom!' };
        GetBookingInformationService.getBookingInformationByLocatorAndSurname.and.returnValue(fail(err));

        service.searchFlighsPassengersByLocatorAndSurname(SURNAME, LOCATOR, false);
        flush();

        expect(ModalService.isNotWaiting).toHaveBeenCalled();
        expectGenericError('Boom!', { setCode: 'INT_X' });
        expect(ModalService.showGenericError).toHaveBeenCalledWith(err);
    });

    // --- Deep link decision matrix
    const caseDeepLinks = [
        {
            name: 'agencies + reInvoicing → no segments left ⇒ shows NO_UNDOCHECKIN error',
            segs: { outward: [['UNCHECKABLE']], ret: [['PENDING AQQ']] },
            params: { travelAgencies: true, reInvoicing: true },
            expectErrorKey: 'DE_INVOICING_ERROR_NO_UNDOCHECKIN_SEGMENTS'
        },
        {
            name: 'agencies + reInvoicing → only reissue (no checked) ⇒ shows ONLY_REISSUE error',
            segs: { outward: [['REISSUE']], ret: [] },
            params: { travelAgencies: true, reInvoicing: true },
            expectErrorKey: 'DE_INVOICING_ERROR_ONLY_REISSUE'
        },
        {
            name: 'agencies + reInvoicing → has checked without reissue ⇒ navigates /uncoac',
            segs: { outward: [['CHECKED']], ret: [] },
            params: { travelAgencies: true, reInvoicing: true },
            expectPath: '/uncoac'
        },
        {
            name: 'default path (non-agency) ⇒ /ibcoac',
            segs: { outward: [], ret: [] },
            params: { travelAgencies: false, reInvoicing: false },
            expectPath: '/ibcoac'
        }
    ];
    caseDeepLinks.forEach(runDeepLinkDecision);

    // --- State helpers

    it('state helpers: prunes only-checkable/uncheckable and flags checked/reissue per direction', function () {
        segmentsPassengersInfoFixture = mkSegments({
            outward: [
                ['PENDING AQQ'],                 // delete
                ['UNCHECKABLE'],                 // delete
                ['CHECKABLE', 'UNCHECKABLE'],    // delete
                ['CHECKED'],                     // keep -> isChecked
                ['REISSUE'],                     // keep -> reissueControl
            ],
            ret: [
                ['PENDING EVUS'],                // delete
                ['CHECKED'],                     // keep -> isChecked
                ['REISSUE'],                     // keep -> reissue
                ['CHECKABLE'],                   // delete
            ],
        });
        setUrlParams({ travelAgencies: true, reInvoicing: true });

        service.deepLinkChecked(segmentsPassengersInfoFixture);
        flush();

        const outward = segmentsPassengersInfoFixture.outwardSegments;
        const ret = segmentsPassengersInfoFixture.returnSegments;

        expect(outward.length).toBe(2);
        expect(ret.length).toBe(2);

        expect(outward[0].isChecked).toBe(true);
        expect(!!outward[0].reissueControl).toBe(false);
        expect(!!outward[1].isChecked).toBe(false);
        expect(outward[1].reissueControl).toBe(true);

        expect(ret[0].isChecked).toBe(true);
        expect(ret[1].reissue).toBe(true);
        expect(!!ret[1].reissueControl).toBe(false);

        expectNavigates('/uncoac');
    });

    it('bookingInformationReject: tolerates missing error shape and still shows generic error', function () {
        GetBookingInformationService.getBookingInformationByLocatorAndSurname.and.returnValue(fail({}));

        service.searchFlighsPassengersByLocatorAndSurname(SURNAME, LOCATOR, false);
        flush();

        expect(ModalService.isNotWaiting).toHaveBeenCalled();
        expect(ModalService.showGenericError).toHaveBeenCalled();
    });

    it('deepLinkChecked: emits destroyBanners event', function () {
        spyOn($rootScope, '$emit');
        segmentsPassengersInfoFixture = mkSegments({});
        setUrlParams({ travelAgencies: false, reInvoicing: false });

        service.deepLinkChecked(segmentsPassengersInfoFixture);
        flush();

        expect($rootScope.$emit).toHaveBeenCalledWith('destroyBanners', true);
    });

    it('sets timeSession.startTime on successful locator+surname flow', function () {
        service.searchFlighsPassengersByLocatorAndSurname(SURNAME, LOCATOR, false);
        flush();
        expect($rootScope.timeSession.startTime).toBeDefined();
    });
});
