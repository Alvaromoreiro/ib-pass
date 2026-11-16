(function () {


    angular
        .module('ib-booking-modal-module')
        .controller('FareModalController', FareModalController);

    FareModalController.$inject = ['$rootScope', '$uibModalInstance', 'object', 'DatalayerUtilsService', 'BookingRedirectionService', '$window','$uibModalStack'];
    function FareModalController ($rootScope, $uibModalInstance, object, DatalayerUtilsService, BookingRedirectionService, $window,$uibModalStack) {
        const vm = this;
        vm.model = object;
        vm.model.comboFirst ={};
        vm.model.comboSecond = {};
        vm.model.comboThird = {};
        activate();
        vm.close = closeModal;
        vm.return = recoverMainPage;
        vm.accept = acceptModal;
        vm.findFareDetail = findFareDetail;
        ////////////////

        function activate () {
            const idModal = vm.model && vm.model.idModal ? vm.model.idModal : vm.model;
            if (vm.model && !vm.model.indexFare) {
                vm.model.indexFare = 0;
            }
            DatalayerUtilsService.sendDatalayerModalEvent(idModal);
            $uibModalInstance.result.then(DatalayerUtilsService.removeDatalayerModalAttrs, DatalayerUtilsService.removeDatalayerModalAttrs);
            setDataCombo();
        }


        /**
         * Closes the modal dismissing its instance
         */
        function closeModal () {
            $uibModalStack.dismissAll();
        }

        /**
         * returns to main page
         */
        function recoverMainPage () {
            BookingRedirectionService.externalRedirect($window.location.origin);
        }

        /**
         * Closes the modal calling close method of its instance
         */
        function acceptModal (type) {
            $uibModalInstance.close(type);
        }

        

        function findFareDetail (selectedFare, combo) {
            switch (combo) {
                    case 1:
                        vm.model.comboFirst = selectedFare;
                        break;
                    case 2:
                        vm.model.comboSecond = selectedFare;
                        break;
                    case 2:
                        vm.model.comboThird = selectedFare;
                        break;
                    default:
                        vm.model.comboFirst = selectedFare;
                        break;
            }
        }

        
        

        function setDataCombo () {
            let conditionArray=[], indexLastFare, found= false, selectedIndexArray = [];

            if(vm.model.selectedFareInfo) {
                angular.forEach(vm.model.fareFamilyConditions.faresInfo,(condition, index)=> {
                    if(condition.cabinType === vm.model.selectedFareInfo.cabinType) {
                        conditionArray.push(condition);
                        indexLastFare = index;
                        selectedIndexArray.push(index);
                    }
                });
                addFareToArray();
            }

            

            function checkSelectedFare () {
                angular.forEach(vm.model.fareFamilyConditions.faresInfo,(condition)=> {
                    if(vm.model.selectedFareInfo.commercialCode === condition.commercialCode) {
                        found = true;
                    }
                });
                if(!found) {
                    vm.model.comboThird = vm.model.selectedFareInfo;
                }
            }


            function addFareToArray () {
                let i, complementArray=[], indexCycle;
                if(conditionArray.length<3) {
                    if(indexLastFare < vm.model.fareFamilyConditions.faresInfo.length-1 ) {
                        indexCycle = indexLastFare+1;
                    }else{

                        indexLastFare = 0;
                        indexCycle = selectedIndexArray.length-1;
                        selectedIndexArray = [];
                    }
                    for(i = indexLastFare; i<vm.model.fareFamilyConditions.faresInfo.length; i++) {
                        if(vm.model.fareFamilyConditions.faresInfo[i].cabinType ===
                            vm.model.fareFamilyConditions.faresInfo[indexCycle].cabinType) {
                            complementArray.push(vm.model.fareFamilyConditions.faresInfo[i]);
                            indexLastFare =i;
                            selectedIndexArray.push(i);
                        }
                    }
                    switch (conditionArray.length) {
                            case 1:
                                switch (complementArray.length) {
                                        case 1:
                                            conditionArray.push(complementArray[0]);
                                            addFareToArray();
                                            break;
                                        default:
                                            conditionArray.push(complementArray[0]);
                                            conditionArray.push(complementArray[1]);
                                            break;
                                }
                                break;
                            case 2:
                                complementArray.sort((a, b) => {
                                    if (a.priority > b.priority) {
                                        return 1;
                                    }
                                    if (a.priority < b.priority) {
                                        return -1;
                                    }
                                    return 0;
                                });
                                conditionArray.push( complementArray[0]);
                                break;
                    }
                }

                
                vm.model.comboFirst =conditionArray[0];

                vm.model.comboSecond = conditionArray[1];

                vm.model.comboThird = conditionArray[2];

                checkSelectedFare();
            }
        }

    }
})();
