import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";

(function () {
    'use strict';

    angular
        .module('ib-bob-widget-module')
        .controller('BobWidgetController', BobWidgetController);

    BobWidgetController.$inject = ['$rootScope', 'MmBAppConstants', 'MmBDatalayerUtilsService', 'localStorageService'];
    function BobWidgetController ($rootScope, MmBAppConstants, MmBDatalayerUtilsService, localStorageService) {
        const vm = this;
        vm.passengers = localStorageService.get('passengers');
        vm.bookingInfo = localStorageService.get('bookingInfo');
        vm.bobInfo = localStorageService.get('bobInfo'); // TODO: check bobinfo access free tier passenger
        vm.openModal = openModal;
        vm.$onInit = activate;
        vm.quanty = 0;
        vm.specialUser = false;

        let infoPassedToWidget = false;

        function openModal () {
            // let pnr = vm.bookingInfo.order.bookingReferences[0].reference
            let pax = undefined;
            vm.passengers.forEach(passenger => {
                if(pax === undefined && passenger.personalInfo !== undefined){
                    pax = passenger;
                }
            });

            const name = pax.personalInfo.name;
            const surname = pax.personalInfo.surname;
            const email = pax.contactInfo?.email ? pax.contactInfo.email : '' ;
            let phone = pax.contactInfo?.phone ? pax.contactInfo.phone: '' ;

            // add '+' for widget pre-population phone. Requires "+"
            if(phone !== undefined && phone !== '' && phone.charAt(0) !== '+')
                phone = '+' + phone;

            const listFlights = [];

            // send just once the passenger info
            if (infoPassedToWidget === false) {
                let payload = { name: name, surname: surname, email: email, phone: phone };

                vm.bookingInfo.tickets.forEach( ticket => {
                    ticket.coupons.forEach( x => {
                        listFlights.push({ segments: [x.departure, x.arrival], flights: [{number: x.carrier + x.flightNumber, date: x.departureDate + 'Z'}] });
                    });
                });
                const uniqueFlightsPayload = [...new Map(listFlights.map(item => [item.flights[0].date, item])).values()];

                BoBWidget?.sendFlightList(uniqueFlightsPayload);

                if(vm.specialUser === true) {
                    payload = {...payload, type_checkin: 'business'};
                }

                BoBWidget?.setBookerPersonalInfo(payload);

                document.addEventListener('bobWidget.orderCreated', ({ detail }) => {
                    vm.quanty = detail.numBags;
                });

                infoPassedToWidget = true;

                document.addEventListener('bobWidget.hide', ({ detail }) => {
                    $rootScope.$broadcast('updateMonetateInfo');
                });

            }
            BoBWidget?.show();
            /* INIT DELETE GA4 MIGRATION */
            localStorageService.set('close', MmBAppConstants.QUADRIGAM.CUSTOMIZE_FLIGHTS);
            MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MODBOB, MMBDatalayerConstants.DIGITAL_DATA_STEP.MODBOB, MmBAppConstants.QUADRIGAM.MODAL_BOB);
        }

        function activate () {
            const bobInfo = localStorageService.get('bobInfo');
            const order = localStorageService.get('bobOrder');

            if (order) {
                vm.quanty = 1;
            } else {
                vm.quanty = 0;
            }

            angular.forEach(bobInfo.slices, (slice) => {
                angular.forEach(slice.products, (product) => {
                    if (product.price === 0) {
                        vm.specialUser = true;
                    }else{
                        vm.specialUser = false;
                    }
                });
            });
            localStorageService.set('specialUserBob', vm.specialUser);
        }
    }
})();
