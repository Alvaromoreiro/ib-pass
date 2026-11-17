export class CheckinModalServiceMock {
  showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => Promise.resolve());
  finishWaiting = jasmine.createSpy('finishWaiting');
  showWaitingModal = jasmine.createSpy('showWaitingModal');
}
