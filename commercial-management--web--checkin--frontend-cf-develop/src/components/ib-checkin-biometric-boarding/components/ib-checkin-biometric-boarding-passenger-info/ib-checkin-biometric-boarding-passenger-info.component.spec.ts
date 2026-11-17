import angular from 'angular';

describe('IbCheckinBiometricBoardingPassengerInfoComponent test', () => {
  let controller, scope, rootScope;
  let controllerDependencies = {
    '$scope': {}
  };
  let componentController: IbCheckinBiometricBoardingPassengerInfoComponent;
  let bindings = {
    passengerInfo: {
      status: ['AVAILABLE', 'COMPLETE'],
      statusToShow: ''
    }
  };
  let commonsModalServiceSpy = {
    openBuildGenericModal: jasmine.createSpy()
  }
  let ModalServiceSpy = {
    closeAllCurrentModals: jasmine.createSpy()
  }

  beforeEach(() => {
    angular.mock.module('ib-checkin-biometric-boarding-module', ($provide) => {
      $provide.value('ModalService', ModalServiceSpy);
      $provide.value('CommonsModalService', commonsModalServiceSpy);
    });
    inject(($rootScope, $componentController) => {
      rootScope = $rootScope;
      scope = $rootScope.$new();
      controllerDependencies.$scope = scope;
      componentController = $componentController;
      controller = $componentController('ibCheckinBiometricBoardingPassengerInfo', controllerDependencies, bindings);
      scope.$digest();
    });
  })

  it('When ngOninit()', () => {
    expect(controller).toBeDefined();
});

  it('When $onInit() is called', () => {
    spyOn(controller, 'transformStatuses');
    controller.$onInit();
    expect(ModalServiceSpy.closeAllCurrentModals).toHaveBeenCalled();
    expect(controller.transformStatuses).toHaveBeenCalled();
  });

  it('When transformStatuses() is called, statusToShow should be set', () => {
    controller.transformStatuses(controller.passengerInfo);
    expect(controller.passengerInfo.statusToShow).toEqual('AVAILABLE');
  })

  it('When openModalBiometricPassengerInfo() is called, the modal should be opened', () => {
    controller.openModalBiometricPassengerInfo(controller.passenger);
    expect(commonsModalServiceSpy.openBuildGenericModal).toHaveBeenCalled();
  })
})