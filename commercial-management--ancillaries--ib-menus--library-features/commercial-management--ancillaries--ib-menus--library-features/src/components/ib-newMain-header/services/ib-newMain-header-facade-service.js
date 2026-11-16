(function () {
    'use strict';

    angular
        .module('ib-newMain-header-module')
        .service('NewMainHeaderFacade', NewMainHeaderFacade);



    function NewMainHeaderFacade () {

        const vm = this;

        vm.setAPIFunctions = setAPIFunctions;

        vm.initHeader = initHeader;
        vm.updateHeader = updateHeader;
        vm.updateSteps = updateSteps;
        vm.setLogin = setLogin;
        vm.updateTrips = updateTrips;
        vm.updateBasketDiscounts = updateBasketDiscounts;
        vm.updateBasketOthers = updateBasketOthers;
        vm.updateTripsFromOrder = updateTripsFromOrder;
        vm.showLogin = showLogin;
        vm.updateLogin = updateLogin;
        vm.updateBasketFlexibilization = updateBasketFlexibilization;
        vm.initHeaderModel = initHeaderModel;
        vm.updateBasketUpgrading = updateBasketUpgrading;
        vm.updateBasketDiscountsNew = updateBasketDiscountsNew;
        vm.addDiscountToBasket = addDiscountToBasket;
        vm.deleteDiscountFromBasket = deleteDiscountFromBasket;
        vm.updateBasketPriority = updateBasketPriority;
        vm.showLoginMMBOnHold = showLoginMMBOnHold;

        function setAPIFunctions (functions) {
            angular.extend(vm, functions);
        }


        function initHeader (headerModel, stepsModel, greyBarModel) {
            vm.initializeHeader(headerModel, stepsModel, greyBarModel);
        }

        function initHeaderModel (headerModel) {
            vm.initHeaderModel(headerModel);
        }

        function updateHeader (model) {
            vm.updateHeaderModel(model);
        }

        function updateSteps (position) {
            vm.updateStepsModel(position);
        }

        function setLogin (onLogin, afterLogin, errorLogin,loggedData) {
            if(vm.setLogin)
                vm.setLogin(onLogin, afterLogin, errorLogin, loggedData);
        }

        function updateTrips (model, offer) {
            vm.updateTripsBasket(model, offer);
        }

        function updateTripsFromOrder (order) {
            vm.updateTripsBasketFromOrder(order);
        }

        function updateBasketDiscounts (discountType, modelDiscount) {
            vm.updateDiscounts(discountType,modelDiscount);
        }

        function updateBasketDiscountsNew (discountData,originalPrice,totalDiscounts,totalPriceWithDiscounts) {
            vm.updateDiscountsNew(discountData,originalPrice,totalDiscounts,totalPriceWithDiscounts);
        }

        function addDiscountToBasket (discountData) {
            vm.addDiscountBasket(discountData);
        }

        function deleteDiscountFromBasket (discountType) {
            vm.deleteDiscountBasket(discountType);
        }

        function updateBasketOthers (modelOthers, othersType ) {
            vm.updateBasketOthers(othersType,modelOthers);
        }

        function showLogin () {
            vm.showLogin();
        }

        function updateLogin (data) {
            vm.updateLogin(data);
        }

        function updateBasketFlexibilization (flexInfo) {
            vm.updateBasketFlexibilization(flexInfo);
        }

        function updateBasketUpgrading (upgrading) {
            vm.updateBasketUpgrading(upgrading);
        }

        function updateBasketPriority (priorityInfo) {
            vm.updateBasketPriority(priorityInfo);
        }
        function showLoginMMBOnHold () {
            vm.showLoginMMBOnHold();
        }
    }


})();
