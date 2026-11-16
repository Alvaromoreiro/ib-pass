export class BookingNavigationServiceMock {
    currentURL =  '/mock-url';
    public navigateTo = jasmine.createSpy('navigateTo').and.returnValue(Promise.resolve());
    public navigateByUrl = jasmine.createSpy('navigateByUrl').and.returnValue(Promise.resolve());
}