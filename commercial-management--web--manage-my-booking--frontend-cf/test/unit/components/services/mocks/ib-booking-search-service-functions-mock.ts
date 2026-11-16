export const fakeInits1Mock = (params) => {
    let {fakeMmBAppConstants, serviceResolve, bookingInfo, mockCommercialInfo, mockBookingData,  fakeTFakeBookingManagementService, fakeFrequentFlyersCompaniesService, fakeCommercialInfobyMarketService, fakeMmBAirlinesLogoService, fakeRetrieveOrderService, fakeCalculatePointsTransformer} = params;
    serviceResolve(fakeTFakeBookingManagementService, 'getBookingInfo', bookingInfo);
    serviceResolve(fakeFrequentFlyersCompaniesService, 'getFrequentFlyersCompanies', {});
    serviceResolve(fakeCommercialInfobyMarketService, 'getCommercialInfo', mockCommercialInfo);
    serviceResolve(fakeMmBAirlinesLogoService, 'getAirlinesLogos', {});
    serviceResolve(fakeRetrieveOrderService, 'retrieveOrderPost', mockBookingData);
    serviceResolve(fakeRetrieveOrderService, 'retrieveOrderByCheckinId', mockBookingData);
    serviceResolve(fakeCalculatePointsTransformer, 'generateCalcPointsRequest', {});
};
export const fakeInits2Mock = (params) => {
    let {serviceResolve, fakeAttendanceVoucherTransformer, fakeCalculatePointsService, fakeReshopConditionsService, fakeFlagsTransformer, mockFlagInfo, fakeVipLoungesService, fakeGastroOfferService, fakeRetrieveOrderService, mockBookingData, rootScope} = params;
        serviceResolve(fakeAttendanceVoucherTransformer, 'transformAttendanceVoucher', {});
        serviceResolve(fakeCalculatePointsService, 'getCalculatePoints', {});
        serviceResolve(fakeReshopConditionsService, 'getReshopConditions', {flightChangeCapabilities: true});
        serviceResolve(fakeFlagsTransformer, 'generateFlagsMenu', mockFlagInfo);
        serviceResolve(fakeVipLoungesService, 'getVipLounges', { hasData: true, data: {} });
        serviceResolve(fakeGastroOfferService, 'importGastronomicProposalComponent', { hasData: true, data: {} });
   
    serviceResolve(fakeRetrieveOrderService, 'retrieveOrderPost', mockBookingData);
    rootScope.appMarket = 'ES';
    rootScope.appLang = 'en';
};
export const getParameterByNameFalseMock = (fakeMmBUtilService) => {
    fakeMmBUtilService.getParameterByName = jasmine.createSpy('getParameterByName').and.callFake(() => {
        return false;
    });
};
export const getParameterByNameTrueMock = (fakeMmBUtilService) => {
    fakeMmBUtilService.getParameterByName = jasmine.createSpy('getParameterByName').and.callFake(() => {
        return true;
    });
};
export const MMB_MARKETS_ES_EU_Mock = (fakeMmBAppConstants) => {
    fakeMmBAppConstants.MMB_MARKETS = ['ES', 'EU'];
};
export const sameCaseAirShuttleMock = (BookingSearchService, rootScope) => {
    BookingSearchService.searchFlightsPassengersEvent(null, { 'pnr': 'pnrTest', 'surname': 'surnameTest', 'isAirShuttle': true });
    rootScope.$digest();
};
export const sameCaseAirShuttleFalseMock = (BookingSearchService, angular, rootScope ) => {
    BookingSearchService.searchFlightsPassengersEvent(null, { 'pnr': 'pnrTest', 'surname': 'surnameTest', 'isAirShuttle': false })
        .catch(angular.noop);
    rootScope.$digest();
};
export const getAirlinesLogosRejectMock = (serviceReject, fakeMmBAirlinesLogoService) => {
    serviceReject(fakeMmBAirlinesLogoService, 'getAirlinesLogos', {});

};