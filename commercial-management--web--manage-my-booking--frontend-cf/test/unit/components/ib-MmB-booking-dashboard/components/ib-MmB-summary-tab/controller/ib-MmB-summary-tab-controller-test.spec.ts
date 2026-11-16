describe('SummaryTabController test', () => {

    var $controller, $rootScope, $scope, controller;

    var fakecheckInLinkDataOutput = {

        colSize: 'ib-box-menu__section--full',
        boxSize: 'ib-box-menu__section--full',
        icon: 'icon-checking_online',
        linkId: 'checkIn',
        text: {
            title: 'MODULES_LINK_GO_TO_CHECK_IN_TEXT',
            subtitle: 'MODULES_LINK_OPEN_TO_TEXT',
            accessibilityText: 'MODULES_LINK_GO_TO_CHECK_IN_ACCESIBLE_TEXT'
        }
    }

    var fakeBookingDashboardConstants = {
        BOX_LINKS_TYPES: {
            'CHECK_IN': 'checkIn',
            'EMERGENCY_CONTACT': 'emergencyContact',
            'SEATS_AUCTION': 'seatsAuction',
            'FLIGHT_REMINDER': 'flightReminder'
        },
        BOX_COL_SIZES: {
            'FULL': 'ib-box-menu__section--full',
            'EXTRALARGE': 'col-xs-12',
            'LARGE': 'col-md-6 col-lg-12 col-xl-6 col-xs-12',
            'MEDIUM': 'col-md-6 col-xs-12'
        },
        BOX_LINK_SIZES: {
            'FULL': 'ib-box-menu__section--full',
            'LEFT': 'ib-box-menu__section--left',
            'RIGHT': 'ib-box-menu__section--right'
        },
        BOX_LINK_ICONS: {
            'CHECK_IN': 'icon-checking_online',
            'MESSAGES': 'icon-mensajes',
            'AUCTION': 'icon-subasta'
        },
    }


    beforeEach(() => {
        angular.mock.module('ib-MmB-summary-tab-module', ($provide) => {
            $provide.value('BookingDashboardConstants', fakeBookingDashboardConstants);
        });
        inject((_$controller_, _$rootScope_) => {
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            $scope = $rootScope.$new();
            controller = $controller('SummaryTabController', { $scope: $scope });
        });
    });

    describe('when activate() function is called', () => {

        it('should set correctValue to checkInLinkData)', () => {
            expect(controller.checkInLinkData).toEqual(fakecheckInLinkDataOutput);
        });

    });

});
