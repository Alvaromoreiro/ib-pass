import angular from 'angular';
import { StorageServiceMock } from "@test/unit/utils/StorageServiceMock";

describe('MmbManageBundlesController test', () => {
    let $controller, $scope, $rootScope;

    let fakeMmBAppConstants = {
        ANCILLARIES_TYPES: {
            'FLEXIBILITY':  'FLEXIBILITY',
            'PRIORITY_BOARDING': 'PRIORITY_BOARDING',
            'BAGGAGE': 'BAGGAGE',
            'SPEQS': 'SPEQS'
        },
        BAGG_TYPE: {
            BAGGAGE_15: 'BAGGAGE_15',
            BAGGAGE_23: 'BAGGAGE_23',
            BAGGAGE_32: 'BAGGAGE_32'
        },
        SPEQ_TYPE: {
            SKI_SNOW: 'SKI_SNOW',
            GOLF_EQUIPMENT: 'GOLF_EQUIPMENT',
            FISHING_EQUIPMENT: 'FISHING_EQUIPMENT',
            SCUBA_DIVING: 'SCUBA_DIVING',
            SURFBOARD: 'SURFBOARD',
            BICYCLE: 'BICYCLE',
            SPORTING_FIREARMS: 'SPORTING_FIREARMS'
        }
    };
    const fakeFilter = jasmine.createSpy('$filter').and.callFake((filter) => {
        let filterFunc :any = function () {
            return [];
        };
        switch (filter) {
            case 'translate':
                filterFunc = function (label) {
                    return 'test';
                };
                break;
            default:
                break;
        }

        return filterFunc;
    });
    let fakeCommonsSessionStorageService: StorageServiceMock = new StorageServiceMock();

    let fakeBookingInfo = {
        passengers: [{}]
    }

    let fakeModel = [{
        items: [
            {
                type: 'FLEXIBILITY',
                subtype: 'FLIGHT_CHANGE'
            },
            {
                type: 'FLEXIBILITY',
                subtype: 'VOUCHER_REFUND'
            },
            {
                type: 'FLEXIBILITY',
                subtype: 'FLEXIBILITY_PACK'
            },
            {
                type: 'PRIORITY_BOARDING',
                subtype: 'FLIGHT_CHANGE'
            },
            {
                type: 'BAGGAGE',
                subtype: 'BAGGAGE_15'
            },
            {
                type: 'BAGGAGE',
                subtype: 'BAGGAGE_23'
            },
            {
                type: 'BAGGAGE',
                subtype: 'BAGGAGE_32'
            },
            {
                type: 'BAGGAGE',
                subtype: 'OTHER'
            },
            {
                type: 'SPEQS',
                subtype: 'SKI_SNOW'
            },
            {
                type: 'SPEQS',
                subtype: 'GOLF_EQUIPMENT'
            },
            {
                type: 'SPEQS',
                subtype: 'FISHING_EQUIPMENT'
            },
            {
                type: 'SPEQS',
                subtype: 'SCUBA_DIVING'
            },
            {
                type: 'SPEQS',
                subtype: 'SURFBOARD'
            },
            {
                type: 'SPEQS',
                subtype: 'BICYCLE'
            },
            {
                type: 'SPEQS',
                subtype: 'SPORTING_FIREARMS'
            },
            {
                type: 'SPEQS',
                subtype: 'OTHER'
            }
        ]
    }];

    let bundleTextResponse = '1 test, 1 test, 1 test, 1 test, 1  15Kg, 1  23Kg, 1  32Kg, 1 , 1 test, 1 test, 1 test, 1 test, 1 1 test, 1 test, 1 test, 1 test, 1  15Kg, 1  23Kg, 1  32Kg, 1 , 1 test, 1 test, 1 test, 1 test, 1 test, 1 test, 1 Armas deportivas, 1 '

    beforeEach(() => {

        angular.mock.module('ib-MmB-manage-bundles-module', 'LocalStorageModule', ($provide) => {
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('$filter', fakeFilter);
            $provide.value('CommonsSessionStorageService', fakeCommonsSessionStorageService);
        });
        inject((_$rootScope_, _$controller_) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            fakeCommonsSessionStorageService.set('bookingInfo', fakeBookingInfo);
            $controller = _$controller_('MmbManageBundlesController', {
                $scope: $scope
            });
            $controller.model = fakeModel;
        });
    });
    describe('when the onInit function is called', () => {
        it('and check all conditions', (done) => {
            $controller.$onInit();
            expect($controller.model.bundleText).toEqual(bundleTextResponse);
            done();
        });

    });

});
