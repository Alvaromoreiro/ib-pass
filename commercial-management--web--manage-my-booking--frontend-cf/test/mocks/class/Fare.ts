export class FareUnifiedServiceMock {
    getFareUnified = jasmine.createSpy('getFareUnified').and.callFake(()=>{return Promise.resolve('testUnified')});
}

export class FareReshopServiceMock {
    getFareReshop = jasmine.createSpy('getFareReshop').and.callFake(()=>{return Promise.resolve('testReshop')});
}

export class SimulatorFareReshopServiceMock {
    getFareReshop = jasmine.createSpy('getFareReshop').and.callFake(()=>{return Promise.resolve('testReshop')});
}
