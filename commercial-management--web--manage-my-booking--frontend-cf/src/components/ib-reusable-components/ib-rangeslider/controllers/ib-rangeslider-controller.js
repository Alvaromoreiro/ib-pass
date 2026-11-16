(function () {
    'use strict';

    angular
        .module('ib-rangeslider')
        .controller('ibRangesliderController', ibRangesliderController);

    ibRangesliderController.$inject = ['$scope', '$timeout'];

    function ibRangesliderController($scope, $timeout) {
        var vm = this;

        vm.filter_price = {
            minValue: 0,
            maxValue: 300,
            options: {
                hideLimitLabels: true,
                floor: 0,
                ceil: 300,
                step: 1,
                translate: function(value) {
                    return value + '€';
                }
            }
        };
        vm.filter_hours = {
            minValue: 0,
            maxValue: 23,
            options: {
                hideLimitLabels: true,
                floor: 0,
                ceil: 23,
                step: 1,
                translate: function(value) {
                    if(value < 10){
                        return '0' + value + ':00';
                    }

                    return value + ':00';
                }
            }
        };

        $timeout(function () {
            $scope.$broadcast('rzSliderForceRender');
        });
    }
})();
