describe('ibMmbFareType test', () =>  {

    let $componentController, $rootScope, $scope, controller;

    let fakeCurrencyService = {};
    let fakeMmBModalService = {
        'showGenericModal': jasmine.createSpy()
    };

    let fakeMmBAppConstants = {
        FARE_FAMILY_ICON_PROPERTY_CODE: {
            test: 'test',
        }
    }

    beforeEach(() =>  {
        angular.mock.module('ib-MmB-fare-type-module', ($provide) => {
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject((_$componentController_, _$rootScope_) => {
            $componentController = _$componentController_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $componentController('ibMmbFareType', { $scope: $scope});
        });
    });

    describe('when activate() is called', () =>  {

        it('The model variable lengthText should be defined' , () =>  {
            controller.$onInit();
        });

    });

    describe('when isFareSelected() is called', () =>  {

        it('The should be emit event correctly' , () =>  {
            spyOn($scope, '$emit');
            controller.isFareSelected();
            expect($scope.$emit).toHaveBeenCalledWith('updateFareSelected', { selectedFare: undefined, typeFlight: undefined });
        });

    });

    describe('when openModalConditions() is called', () =>  {

        it('The should be open modal correctly' , () =>  {
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() =>  {
                return {
                    'result': {
                        'then': () =>  {}
                    }
                };
            })
            controller.openModalConditions({preventDefault: () => {}},{conditions:[{test: 'test', code: 'test'}]});
            // expect(fakeMmBModalService.showGenericModal).toHaveBeenCalledWith(false, 'ib-compare-fares-modal-multiple.html', { selectedFareInfo: [{conditions:[{test: 'test', code: 'test', icon: 'test'}]}] });
        });

    });

});
