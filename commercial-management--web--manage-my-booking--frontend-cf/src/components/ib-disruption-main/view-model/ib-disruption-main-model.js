(function () {
    'use strict';
    angular.module('ib-disruption-main-module')
        .service('DisruptionModel', DisruptionModel);

    /**
     * Disruption Dashboard Model
     */
    function DisruptionModel() {
        var vm = this;
        vm.initializeModel = initializeModel;

        function initializeModel() {
            vm.contactPhone = '';
            vm.scheduleDisruptionActivated = false;
            vm.selectorFlights = {};
            //Model lists of flights
            vm.headerCard = {};
            vm.middleCard = {};
            vm.bottomCard = {};
            //FLAGS
            vm.flagContactCenter = false;
            vm.flagPassengerRights = false;
            vm.flagSelectorDate = false;
            vm.flagRebookDisable = false;
            vm.flagRefund = false;
            vm.flagChannelOthers = false;
            vm.showRefundLink = false;
            vm.showChangeFlightSection = true;
            //First level
            vm.flagShowRefundArea = false; //Hides the text area where refund option and callcenter messages are shown
            //Second level
            vm.flagRefundOption = false; //Manages if athe text area show a link or a callcenter message
            //Third level
            vm.refundOnlyVoucher = false;
            vm.flagRefundVoucher = false;
            vm.flagRefundCash = false;
            vm.flagRefund = false;
            //ORDER INFO
            vm.optionNumber = 0;
            vm.optionOrder = [];
            vm.slices = [];
            vm.passengersInfo = [];
            vm.tickets = [];
            vm.orderItems = [];
            vm.rawSlicesInfo = [];
            vm.pricesInfo = {};
            //COMMON LABELS
            vm.common = {};
            //CLASS
            vm.classFlightNormalAreaContainer = '';
            vm.isExternalChannel = false;
            //SISTER CITIES INFORMATION
            vm.sisterCitiesData = {
                'hasSisterCitiesPossibility': false,
            };
            vm.partialRefund = false;
            vm.isGenericDisruption = false;
            vm.notIberiaTicket = false;
            vm.specialOrderStatus = false;
            vm.textBlackoutPeriods = null;
            vm.textAllowedPeriods = null;
            vm.hasTickets = true;
        }
    }
})();
