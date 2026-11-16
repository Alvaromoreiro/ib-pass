describe('MmBYourExperienceTabController test', function () {

    var controller, $scope,$rootScope, localStorage;

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
    }

    var fakeMmBAppConstants = {
        templatesRoute: 'test',
        QUADRIGAM: {
            STOP_OVER: 'STOP_OVER',
            COMPLETE_TRAVEL: 'COMPLETE_TRAVEL'
        },
        PNR_EMITION_CHANNEL: {
            FLEX_FLIGHT_DIRECT: [
                'IBCOM',
                'CALL_CENTER',
                'NDC_DIRECT'
            ],
            FLEX_FLIGHT_INDIRECT: [
                'NDC_INDIRECT',
                'OTHER',
            ],
        },
        ORDER_ITEMS_TYPE_TO_AVOID: ['baggage', 'specialEquipment', 'flexibilityOnDemand', 'priorityBoarding'],
        COMMON_LABELS: {
            CHANNEL: {
                IBCOM: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                },
                NDC_DIRECT: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                },
                NDC_INDIRECT: {
                    'VALUE': 'MMB_DISRUPTION_AGENCY_CONTACT_MSG',
                    'PHONE': false
                },
                CALL_CENTER: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                },
                OTHER: {
                    'VALUE': 'MMB_DISRUPTION_AGENCY_CONTACT_MSG',
                    'PHONE': false
                },
                DEFAULT: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                }


            }
        },
        WCS: {
            'PHONE_TYPES': {
                'SALES': 'RESERVAS',
                'IBHOLIDAYS': 'ATTBAH'
            }
        }
    };

    beforeEach(function () {
        angular.mock.module('ib-MmB-your-experience-tab-module', 'LocalStorageModule', function ($provide) {
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });

        inject(function (_$rootScope_, _$controller_, _localStorageService_) {
            $rootScope= _$rootScope_;
            $scope = _$rootScope_.$new();
            localStorage = _localStorageService_;
            localStorage.set('bookingInfo', fakeBookingInfo);
            controller = _$controller_('MmBYourExperienceTabController', {
                $scope: $scope,
                $rootScope: $rootScope
            });
            controller.model = 
                [
                    {
                        'activityDate': '12/03/2023'
                    }
                ]
        });
    });

    describe('when activate is called', function () {
        it('and default case', function (done) {
            var arrivalCity = fakeBookingInfo.order.slices[0].segments[0].arrivalCity.description;
            var fakeDate = new Date(controller.model[0].activityDate);
            controller.$onInit();
            expect(controller.city).toEqual(arrivalCity);
            expect(controller.activityDate).toEqual(fakeDate);
            done();
        });
    });
});
