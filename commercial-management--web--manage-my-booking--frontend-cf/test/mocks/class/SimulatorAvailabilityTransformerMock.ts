export class SimulatorAvailabilityTransformerMock {
        "getDataAvailabilityTransformed" = jasmine.createSpy("getDataAvailabilityTransformed").and.callFake(() => {return "test";});
        "getDataAvailabilityTransformedReturns" = jasmine.createSpy("getDataAvailabilityTransformedReturns").and.callFake(() => {return "test";});
        "changeFlightsData" = jasmine.createSpy("changeFlightsData").and.callFake( () => {return "test"});
        "searchFlights" = jasmine.createSpy("searchFlights").and.callFake( () => {});
    }