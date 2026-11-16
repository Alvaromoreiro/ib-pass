(function () {


    // Usage: <ib-shuttle-avios-and-money model="myCtrl.myModel"></ib-shuttle-avios-and-money>

    /* istanbul ignore next */
    angular.module('ib-shuttle-avios-and-money-module')
        .component('ibShuttleAviosAndMoney', {
            controller: 'IbShuttleAviosAndMoneyController',
            controllerAs: 'ibShuttleAviosAndMoneyCtrl',
            bindings: {
                model: '=',
                fareRate: '<',
                customerData: '<',
                totalPrice: '=',
                withoutAviosMoney: '<'
            },
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-shuttle-avios-and-money-view.html';
            }]
        });
})();