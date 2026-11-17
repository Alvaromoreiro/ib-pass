(function () {
    'use strict';

    angular
        .module('ib-checkin-mode-boxes-module')
        .controller('IbCheckInModeBoxesController', IbCheckInModeBoxesController);

    IbCheckInModeBoxesController.$inject = ['$scope', 'BoardingCardsConstants'];
    function IbCheckInModeBoxesController ($scope, BoardingCardsConstants) {
        const vm = this;
        vm.oneModeChecked = oneModeChecked;

        vm.$onInit = activate;

        ////////////////

        function activate () {
        }


        /**
         *
         * @param {*} type
         * @param {*} value
         */
        function selectedCheckbox (type, value) {
            if (type === BoardingCardsConstants.CHANNELS_NAMES.EMAIL || type === BoardingCardsConstants.CHANNELS_NAMES.SMS) {
                $scope.$emit('showInputsEvent', value, type);
            }
        }

        /**
         * check if at least one send type| format is selected
         * @param {*} itemsList
         * @param {*} index
         * @param {*} type
         * @param {*} value
         */
        function oneModeChecked (itemsList, index, type, value) {
            let listIndex = 0, oneSelected = false;
            while (!oneSelected && listIndex < itemsList.length) {
                oneSelected = itemsList[listIndex].isSelected;
                listIndex++;
            }
            if (!oneSelected) {
                $scope.$emit('atLeastOneItemEvent');
                itemsList[index].isSelected = true;
            }else{
                selectedCheckbox(type, value);
            }
        }
    }
})();