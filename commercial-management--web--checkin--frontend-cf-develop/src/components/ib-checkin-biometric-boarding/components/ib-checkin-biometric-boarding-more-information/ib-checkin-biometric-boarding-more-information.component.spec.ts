import * as angular from 'angular';

interface MoreInformationController {
    $ngOnInit(): void;
    labelHideMoreInformation: string;
    labelShowMoreInformation: string;
}

describe('IbCheckinBiometricBoardingMoreInformationComponent', () => {
    let $componentController: (name: string, locals?: object, bindings?: object) => MoreInformationController;
    let translate: jasmine.Spy;
    let filter: jasmine.Spy;

    beforeEach(() => {
        translate = jasmine.createSpy('translate').and.callFake((key: string) => `translated:${key}`);
        filter = jasmine.createSpy('$filter').and.returnValue(translate);
        angular.mock.module('ib-checkin-biometric-boarding-module');
        angular.mock.inject((
            _$componentController_: (name: string, locals?: object, bindings?: object) => MoreInformationController
        ) => {
            $componentController = _$componentController_;
        });
    });

    it('initializes the translated labels for showing and hiding additional information', () => {
        const controller = $componentController('ibCheckinBiometricBoardingMoreInformation', { $filter: filter });

        controller.$ngOnInit();

        expect(filter).toHaveBeenCalledWith('translate');
        expect(translate).toHaveBeenCalledWith('BIOMETRIC_BOARDING_LINK_MORE_INFO_HIDE');
        expect(translate).toHaveBeenCalledWith('BIOMETRIC_BOARDING_LINK_MORE_INFO');
        expect(controller.labelHideMoreInformation).toBe('translated:BIOMETRIC_BOARDING_LINK_MORE_INFO_HIDE');
        expect(controller.labelShowMoreInformation).toBe('translated:BIOMETRIC_BOARDING_LINK_MORE_INFO');
    });
});
