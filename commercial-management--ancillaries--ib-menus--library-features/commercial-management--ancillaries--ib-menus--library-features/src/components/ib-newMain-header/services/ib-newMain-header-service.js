(function () {
    'use strict';

    angular
        .module('ib-newMain-header-module')
        .service('NewMainHeaderService', NewMainHeaderService);


    NewMainHeaderService.$inject = ['ibGreyBarTransformer', 'HeaderTransformer', 'StepsTransformer', 'ShoppingBasketViewModel'];

    function NewMainHeaderService (ibGreyBarTransformer, HeaderTransformer, StepsTransformer, ShoppingBasketViewModel) {
        const vm = this;
        vm.initHeader = initHeader;
        vm.updateBasketDiscounts = updateBasketDiscounts;
        vm.updateBasketOthers = updateBasketOthers;
        vm.dataUserLogin = dataUserLogin;
        vm.updateBasketFlexibilization = updateBasketFlexibilization;
        vm.initHeaderModel = initHeaderModel;
        vm.updateBasketUpgrading = updateBasketUpgrading;
        vm.updatePendingPaymentItems = updatePendingPaymentItems;
        vm.updateBasketPriority = updateBasketPriority;
        vm.updateBasketDiscountsNew = updateBasketDiscountsNew;
        vm.addDiscountToBasket = addDiscountToBasket;
        vm.deleteDiscountFromBasket = deleteDiscountFromBasket;
        vm.updateLoggedData =updateLoggedData;

        function initHeader (headerModel, stepsModel, greyBarModel) {
            const currency = headerModel ? headerModel.currency : {},
                model = {
                    headerModel: HeaderTransformer.initHeader(headerModel),
                    greyBarModel: ibGreyBarTransformer.initGreyBar(greyBarModel, currency),
                    stepsModel: StepsTransformer.initSteps(stepsModel)
                };

            if (model.stepsModel)
                model.headerModel.steps = HeaderTransformer.addSteps(model.stepsModel);
            return model;
        }

        function initHeaderModel (headerModel) {
            const headerModelInfo = HeaderTransformer.initHeader(headerModel);
            headerModelInfo.steps = HeaderTransformer.addSteps({
                steps: []
            });
            return headerModelInfo;
        }

        function updateBasketDiscountsNew (headerModel,discountData,originalPrice,totalDiscounts,totalPriceWithDiscounts) {
            const updatedBasket = HeaderTransformer.updateBasketDiscountsNew(headerModel.shoppingBasket,discountData,originalPrice,totalDiscounts,totalPriceWithDiscounts);
            return updatedBasket;
        }

        function addDiscountToBasket (headerModel,discountData) {
            const updatedBasket = HeaderTransformer.addDiscountToBasket(headerModel.shoppingBasket,discountData);
            return updatedBasket;
        }

        function deleteDiscountFromBasket (headerModel,discountType) {
            const updatedBasket = HeaderTransformer.deleteDiscountFromBasket(headerModel.shoppingBasket,discountType);
            return updatedBasket;
        }

        function updateBasketDiscounts (headerModel,discountType,modelDiscount) {
            const modelDiscountUpdated = HeaderTransformer.updateBasketDiscounts(headerModel.shoppingBasket, discountType,modelDiscount);
            return modelDiscountUpdated;
        }

        function updateBasketOthers (headerModel, othersType, feeInfo) {
            ShoppingBasketViewModel.updateOthersFee(headerModel, othersType, feeInfo);
        }

        function updateBasketFlexibilization (headerModel, flexInfo) {
            ShoppingBasketViewModel.updateFlexibilization(headerModel, flexInfo);
        }

        function updateBasketUpgrading (headerModel, upgrading) {
            ShoppingBasketViewModel.updateUpgrading(headerModel, upgrading);
        }

        function updatePendingPaymentItems (headerModel, seats, upgrading) {
            ShoppingBasketViewModel.updatePendingPaymentItems(headerModel, seats, upgrading);
        }

        function updateBasketPriority (headerModel, priorityInfo) {
            ShoppingBasketViewModel.updateBasketPriority(headerModel, priorityInfo);
        }

        function dataUserLogin (loginData) {
            return {
                name: loginData.personalInfo.name||loginData.personalInfo.contactEmail ,
                surname: loginData.personalInfo.surname1,
                avios: loginData.generalInfo.avios || null
            };
        }
        function updateLoggedData (loggedData) {

            return ibGreyBarTransformer.updateLoggedData(loggedData);
        }


    }
})();
