export class SimulatorBookingAvailabilityTransformerMock {
        'init' = jasmine.createSpy('init').and.returnValue([{visibility : true}]);
        'getTotalPrice' = jasmine.createSpy('getTotalPrice').and.callFake(() => {return 'test';});
        'getInfo' = jasmine.createSpy('getInfo').and.callFake(() => {return 'test';});
        'getSegments' = jasmine.createSpy('getSegments').and.callFake(() => {return 'test';});
        'getModelfilter' = jasmine.createSpy('getModelfilter').and.callFake(() => {return 'test';});
        'getOrderSlices' = jasmine.createSpy('getOrderSlices').and.callFake(() => {return 'test';});
        'generateDataLayerAvailability' = jasmine.createSpy('generateDataLayerAvailability').and.callFake(() => {return ['test'];});
        'getElementsOfDataLayer' = jasmine.createSpy('getElementsOfDataLayer').and.callFake(() => {return ['test'];});
        'resetData' = jasmine.createSpy('resetData').and.callFake(() => {});
        'generateQuadrigam' = jasmine.createSpy('generateQuadrigam').and.callFake( () => {return 'QUADRIGAM'});
    }