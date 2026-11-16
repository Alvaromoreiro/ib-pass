// @ts-nocheck
'use strict';

jasmine.getEnv().allowRespy(true);
describe('test for module ib-choose-language-mobile-module - controllers', () => {
    const CommonsModalServiceMock = {
        openBuildGenericModal: jasmine.createSpy()
    };

    beforeEach(() => {
        angular.mock.module('ib-choose-language-mobile-module');
    });

    describe('test for IbChooseLanguageMobileComponent', () => {
        let IbChooseLanguageMobileComponent;
        let $controller;
        let $injector;

        beforeEach(() => {
            inject((_$componentController_, _$injector_) => {
                $controller = _$componentController_;
                $injector = Object.keys(_$injector_).reduce((clone, key) => {
                    clone[key] = _$injector_[key];
                    return clone;
                }, {});
                IbChooseLanguageMobileComponent = $controller('ibChooseLanguageMobile', {
                    CommonsModalService: CommonsModalServiceMock
                }, null);
            });
        });

        it('should be defined', () => {
            expect(IbChooseLanguageMobileComponent).toBeDefined();
        });

        it('should open the modal with the correct params', () => {
            const mockMouseEvent = { preventDefault: jasmine.createSpy() };

            IbChooseLanguageMobileComponent.openModal(mockMouseEvent);

            expect(mockMouseEvent.preventDefault).toHaveBeenCalled();
            expect(CommonsModalServiceMock.openBuildGenericModal).toHaveBeenCalledWith(null, 'ib-choose-language-mobile-modal-view.html', 'ib-modals--sm ib-modals--mobile-full', 'IbChooseLanguageMobileModalComponent');
        });
    });
});