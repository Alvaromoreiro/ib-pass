export const fakeDatalayerUtilsService = {
    updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(() => {}),
    sendDatalayerEvent: jasmine.createSpy(),
    updateDigitalDataWithQuadrigam: jasmine.createSpy(),
    updateDatalayerViewEvent: jasmine.createSpy(),
    setProcessAndStep: jasmine.createSpy(),
    updateDatalayerInfo: jasmine.createSpy()
};

export const fakeMmBUtilService = {
    'isUserLogged': jasmine.createSpy('isUserLogged').and.callFake(() => {
        return true;
    }),
    orderItemContained : jasmine.createSpy('orderItemContained').and.callFake(() => {
        return true;
    })
};

 export const fakeMmBModalService = {
    showGenericModal : jasmine.createSpy('showGenericModal').and.callFake(() => {
        return {
            'result': {
                'then': () => {}
            }
        };
    }),
    showWaitingModal:jasmine.createSpy(),
    finishWaiting:jasmine.createSpy(),
    showEmptyBasketModal: jasmine.createSpy('showEmptyBasketModal').and.callFake(() => {
        return {
            'result': Promise.resolve({})
        };
    })
};

export const fakeChangleFlightsService = {
    'getDisruptionPeriods': jasmine.createSpy()
};
export const fakeCommonsUtilService = {
    'setTitlePage': jasmine.createSpy()
};

export const fakeVoluntaryChangesLogService = {
    getVoluntaryChangesLog : jasmine.createSpy()
}

export const fakeCommonsAncillariesService = {};
export const fakeBookingDashboardService = {
    'initializeDashboard': jasmine.createSpy()
};
