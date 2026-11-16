describe('MmBManageExperienceInfoController test', () => {
    var controller, $scope, $rootScope, $q, localStorage, $filter;

    
    var fakeBookingInfo = {
        'order': {
            'slices': [
                {
                    'segments': [
                        {
                            'arrivalCity': {
                                'description': 'test'
                            }
                        },
                        {
                            'arrivalCity': {
                                'description': 'test'
                            }
                        }
                    ]
                },
                {
                    'segments': [
                        {
                            'arrivalCity': {
                                'description': 'test'
                            }
                        },
                        {
                            'arrivalCity': {
                                'description': 'test'
                            }
                        }
                    ]
                }
            ]
        }
    };

    beforeEach(() => {
        angular.mock.module('ib-MmB-manage-experience-info-module', 'LocalStorageModule', ($provide) => {

        });
        inject((_$rootScope_, $controller, _localStorageService_, _$q_,_$filter_) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $q = _$q_;
            localStorage = _localStorageService_;
            $filter = _$filter_;
            localStorage.set('bookingInfo', fakeBookingInfo);
            controller = $controller('MmBManageExperienceInfoController', {
                $scope: $scope,
                $rootScope: $rootScope,
                $filter: $filter,
                localStorageService: _localStorageService_
            });
            controller.model = [
                {
                    'activityDate': '12/03/2023'
                }
            ]
        });
    });

    describe('when activate is called', () => {
        it('and default case', (done) => {
            var arrivalCity = fakeBookingInfo.order.slices[0].segments[0].arrivalCity.description;
            var fakeDate = new Date(controller.model[0].activityDate);
            controller.$onInit();
            expect(controller.arrivalCity).toEqual(arrivalCity);
            expect(controller.activityDate).toEqual(fakeDate);
            done();
        });
    });
});
