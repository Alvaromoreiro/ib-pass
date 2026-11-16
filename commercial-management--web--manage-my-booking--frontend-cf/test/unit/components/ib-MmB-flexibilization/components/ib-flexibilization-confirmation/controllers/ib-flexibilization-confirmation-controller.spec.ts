describe('IbFlexibilizationConfirmationController test', () =>  {
    var $scope, $rootScope, $localStorageService, $controller, controller;
    var fake$scope = {
        '$emit': jasmine.createSpy(),
    };
    var fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy(),
        'sendDatalayerEvent': jasmine.createSpy(),
        'addDataLayerEcommerceInfo': jasmine.createSpy(),
        'setProcessAndStep': jasmine.createSpy(),
    };

    var fakeMmBAppConstants = {
        'QUADRIGAM': {
            'FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_ONE_WAY': 'CIFPOW',
            'FLEXIBILIZATION_AVAILABILITY_ONE_WAY': 'CVFPOW',
            'FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_RETURN': 'CIFPRT',
            'FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_ONE_CHOOSE': 'CIFPSG',
            'FLEXIBILIZATION_AVAILABILITY_RETURN': 'CVFPRT',
            'FLEXIBILIZATION_AVAILABILITY_ONE_CHOOSE': 'CVFPSG',
            'AVAILABILITY_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL': 'CITOAV',
            'AVAILABILITY_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL_OPTIONAL': 'CIPTAV',
            'AVAILABILITY_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_FLEXIB_PARCIAL': 'CIPAAV',
            'FLEXIBILIZATION_INVOLUNTARY_REBOOK_SERVICE_ERROR': 'CIFERS',
            'FLEXIBILIZATION_REBOOK_SERVICE_ERROR': 'CVFERS',
            'FLEXIBILIZATION_INVOLUNTARY_BLACKOUT_DATE_SERVICE_ERROR': 'CIFERB',
            'FLEXIBILIZATION_INVOLUNTARY_NOT_AVAILABILITY': 'CIFERR',
            'FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_SERVICE_ERROR': 'CIFERD',
            'FLEXIBILIZATION_BLACKOUT_DATE_SERVICE_ERROR': 'CVFERB',
            'FLEXIBILIZATION_NOT_AVAILABILITY': 'CVFERR',
            'FLEXIBILIZATION_AVAILABILITY_SERVICE_ERROR': 'CVFERD'
        },
        'PAGES_URL': {
            'REBOOK_ERROR': '/rbkerr'
        },
        'TITLES_APP':{
            'MANAGEMYBOOKING_DISRUPTION':'MMBDISR',
        }
    };
    var fakeDatalayerConstants = {
        'DATALAYER_EVENT_TYPES': {
            'VIEW': 'TEST_4'
        }
    };
    let fakeMmBUtilsSharedService = {
        'updateQuadrigam': jasmine.createSpy(),
    };
    var fakeDisruptionDashboardConstants = {
        'QUADRIGAM_BY_DISRUPTION_FLOW': {
            'ALTERNATIVE_TOTAL_WITH_FLEXIBILIZATION': 'ALT_TOTAL_WITH_FLEX',
            'ALTERNATIVE_PARCIAL_WITH_FLEXIBILIZATION': 'ALT_PARC_WITH_FLEX'
        }
    };

    var fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy('setTitlePage').and.callFake(() =>  {
            return 'TITULO'
        }),
    };

    var fakeDisruptionUtilService = {
        'quadrigamByTypeFlow':  jasmine.createSpy()
    }

    let fakeorderChangeRelatedKey = [{
        key: 'FLIGHTS_NOT_OPERATED_BY_GROUP_IBERIA',
        value: 'test'
    }]

    beforeEach(() =>  {
        angular.mock.module('ib-flexibilization-confirmation-module', 'LocalStorageModule', ($provide) => {
            $provide.value('$scope', fake$scope);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
            $provide.value('DisruptionDashboardConstants', fakeDisruptionDashboardConstants);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('DisruptionUtilService', fakeDisruptionUtilService);
        });
        inject((_$controller_, _$rootScope_, _localStorageService_) => {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $localStorageService = _localStorageService_;
            controller = $controller('IbFlexibilizationConfirmationController', {
                $scope: $scope,
                $rootScope: $rootScope,
                $localStorageService: $localStorageService
            });

            $localStorageService.set('orderChangeRelatedKey', fakeorderChangeRelatedKey);
        });
    });
    describe('when activate() is called', () =>  {
        beforeEach(inject((localStorageService, $rootScope) => {
            var mockCommercialInfo = {
                'currency': {
                    'groupingSeparator': ',',
                    'code': 'code'
                },
                'market': {
                    'code': 'code'
                }
            }
            localStorageService.set('commercialInfo', mockCommercialInfo);
            controller.model = {
                confirmationCode: 7,
                slices: ''
            };
            $rootScope.isDisruptionFlow = true;
        }));
        it('$rootScope.isDisruptionFlow is true and typeFlowDisruption is false', (done) =>  {

            controller.$onInit();
            $rootScope.$broadcast('sendUpdateToMonetate');
            $rootScope.$digest();
            // expect(fakeDatalayerUtilsService.updateDatalayerWithQuadrigam).toHaveBeenCalled();
            // expect(fakeDatalayerUtilsService.addDataLayerEcommerceInfo).toHaveBeenCalled();
            done();
        });



    });
    describe('when activate() is called', () =>  {
        beforeEach(inject((localStorageService, $rootScope) => {
            var mockCommercialInfo = {
                'currency': {
                    'groupingSeparator': ',',
                    'code': 'code'
                },
                'market': {
                    'code': 'code'
                }
            }
            localStorageService.set('commercialInfo', mockCommercialInfo);
            controller.model = {
                confirmationCode: 7,
                slices: [{
                    segments: [{
                        arrivalCode: 'ES'
                    }]
                }]
            };
            $rootScope.isDisruptionFlow = false;
        }));
        it('$rootScope.isDisruptionFlow is false', (done) =>  {

            controller.$onInit();
            $rootScope.$digest();
            // expect(fakeDatalayerUtilsService.updateDatalayerWithQuadrigam).toHaveBeenCalled();
            done();
        });
        it('$rootScope.isDisruptionFlow is false', (done) =>  {
            $localStorageService.set( 'flowTitlesApp', fakeMmBAppConstants.TITLES_APP.MANAGEMYBOOKING_DISRUPTION);
            controller.$onInit();
            $rootScope.$digest();
            // expect(fakeDatalayerUtilsService.updateDatalayerWithQuadrigam).toHaveBeenCalled();
            done();
        });
    });
    describe('when quadrigamByTypeFlow() is called', () =>  {
        beforeEach(inject((localStorageService, $rootScope) => {
            var mockCommercialInfo = {
                'currency': {
                    'groupingSeparator': ',',
                    'code': 'code'
                },
                'market': {
                    'code': 'code'
                }
            }
            localStorageService.set('commercialInfo', mockCommercialInfo);
            localStorageService.set('typeDisruptionFlow', 'ALT_TOTAL_WITH_FLEX');
            localStorageService.set('optionalFlight', true);
            controller.model = {
                confirmationCode: 7,
                slices: []
            };
            $rootScope.isDisruptionFlow = true;
        }));
        it('typeFlowDisruption is true', (done) =>  {

            controller.$onInit();
            // expect(fakeDatalayerUtilsService.addDataLayerEcommerceInfo).toHaveBeenCalled();
            done();
        });
        it('typeFlowDisruption is true and optional is false', (done) =>  {

            $localStorageService.set('typeDisruptionFlow', 'ALT_PARC_WITH_FLEX');
            $localStorageService.set('optionalFlight', false);
            controller.$onInit();
            // expect(fakeDatalayerUtilsService.addDataLayerEcommerceInfo).toHaveBeenCalled();
            done();
        });
        it('typeFlowDisruption is true and optional is true', (done) =>  {

            $localStorageService.set('typeDisruptionFlow', 'ALT_PARC_WITH_FLEX');
            controller.$onInit();
            expect(fakeDatalayerUtilsService.addDataLayerEcommerceInfo).toHaveBeenCalled();
            done();
        });

    });

    describe('when prevStep() is called', () =>  {
        it('emit prevStep', () =>  {
            spyOn($scope, '$emit');
            controller.prevStep();
            expect($scope.$emit).toHaveBeenCalledWith('prevStep');
        });
    });


});

//La función getStatusResidentOfPassengers no se puede cubrir ya que el programa no lee la función en ningun momento.
