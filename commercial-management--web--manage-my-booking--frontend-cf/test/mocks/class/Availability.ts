export class AvailabilityUnifiedServiceMock {
    availability = jasmine.createSpy('availability').and.returnValue('testAvailabilityUnifiedService');
}
export class AvailabilityDisruptionServiceMock {
    availability = jasmine.createSpy('availability').and.returnValue('testDisruptionService')
}
export class AvailabilityVoluntaryServiceMock {
    availability = jasmine.createSpy('availability').and.returnValue('testAvailabilityVoluntaryService');
    generateRequest = jasmine.createSpy('generateRequest').and.returnValue('testAvailabilityVoluntaryService');
    generateModalObject = jasmine.createSpy('generateModalObject').and.returnValue('testAvailabilityVoluntaryService');
    callModalService = jasmine.createSpy('callModalService').and.returnValue('testAvailabilityVoluntaryService');
}