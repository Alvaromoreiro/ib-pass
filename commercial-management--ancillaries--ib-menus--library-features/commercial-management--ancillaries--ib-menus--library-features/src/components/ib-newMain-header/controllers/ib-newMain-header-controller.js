(function () {
    'use strict';

    angular
        .module('ib-newMain-header-module')
        .controller('NewMainHeaderController', NewMainHeaderController);

    NewMainHeaderController.$inject = ['NewMainHeaderService', 'NewMainHeaderFacade', 'localStorageService', 'ibBasketTransformer', '$rootScope', 'CurrencyService', '$scope','CommonsUserUtilsService'];
    function NewMainHeaderController (NewMainHeaderService, NewMainHeaderFacade, localStorageService, ibBasketTransformer, $rootScope, CurrencyService, $scope, CommonsUserUtilsService) {
        const vm = this;
        vm.initializeHeader = initializeHeader;
        vm.flowName = $rootScope.flowName;
        vm;

        const toggleAdvancedSearchEvent = $scope.$on('toggleAdvancedSearch', toggleAdvancedSearch);
        $scope.$on('openAdvancedSearchAndOpenCalendar', openAdvancedSearchAndOpenCalendar);
        $scope.$on('$destroy', toggleAdvancedSearchEvent);
        activate();

        function activate () {
            vm.showAdvancedSearch = false;
            vm.openCalendar = false;
            vm.model = getHeaderModel() || {};
            vm.isSoftUser = CommonsUserUtilsService.isSoftUser();
            NewMainHeaderFacade.setAPIFunctions({
                initializeHeader: initializeHeader,
                updateHeaderModel: updateHeaderModel,
                updateStepsModel: updateStepsModel,
                setLogin: setLogin,
                updateTripsBasket: updateTripsBasket,
                updateDiscounts: updateDiscounts,
                updateBasketOthers: updateBasketOthers,
                updateTripsBasketFromOrder: updateTripsBasketFromOrder,
                showLogin: showLogin,
                updateLogin: updateLogin,
                updateBasketFlexibilization: updateBasketFlexibilization,
                initHeaderModel: initHeaderModel,
                updateBasketUpgrading: updateBasketUpgrading,
                updatePendingPaymentItems: updatePendingPaymentItems,
                updateTripsBasketFromDispo: updateTripsBasketFromDispo,
                deleteTripsBasketFromDispo: deleteTripsBasketFromDispo,
                updateBasketPriority: updateBasketPriority,
                updateDiscountsNew: updateDiscountsNew,
                addDiscountBasket:addDiscountBasket,
                deleteDiscountBasket:deleteDiscountBasket,
                updateHeaderModelOnHold: updateHeaderModelOnHold,
                showLoginMMBOnHold: showLoginMMBOnHold
            });



        }


        /**
         * Initialize all the models
         * @param {*} headerModel
         * @param {*} config
         * @param {*} position
         */
        function initializeHeader (headerModel, stepsModel, greyBarModel) {
            const headerModelTemp = localStorageService.get('headerModel');
            const datesHasChanged = checkIfDateHasChanged(headerModel);
            let  loggedData =localStorageService.get('customerData');
            vm.isSoftUser = CommonsUserUtilsService.isSoftUser();

            if( !headerModelTemp || headerModelTemp.headerModel.flightType === 'metasearchFlight' || datesHasChanged ) {
                vm.model = angular.copy(NewMainHeaderService.initHeader(headerModel, stepsModel, greyBarModel));
                saveHeaderModel();
            }

            if(vm.isSoftUser && loggedData) {
                loggedData =NewMainHeaderService.updateLoggedData(loggedData);
                vm.model.greyBarModel.loggedData= loggedData;
                vm.model.greyBarModel.isLogged= loggedData.isLogged;
            }



        }

        function checkIfDateHasChanged (headerModel) {
            let datesHasChanged = false;
            if(headerModel.originDestination && headerModel.originDestination.dates && headerModel.originDestination.dates.outboundFlight ) {
                if (headerModel.originDestination.dates.outboundFlight !== headerModel.originDestination.dates.formatedOutboundFlight.slice(0,10) ) {
                    datesHasChanged = true;
                }
            }
            if(headerModel.originDestination && headerModel.originDestination.dates && headerModel.originDestination.dates.returnFlight ) {
                if (headerModel.originDestination.dates.returnFlight !== headerModel.originDestination.dates.formatedReturnFlight.slice(0,10) ) {
                    datesHasChanged = true;
                }
            }
            return datesHasChanged;
        }

        /**
         * Initialize headerModel
         * @param {*} headerModel
         */
        function initHeaderModel (headerModel) {
            const headerModelTemp = localStorageService.get('headerModel');

            if(!headerModelTemp.shoppingBasket) {
                vm.model.headerModel = angular.copy(NewMainHeaderService.initHeaderModel(headerModel));
                if(headerModelTemp.headerModel.shoppingBasket) {
                    vm.model.headerModel.shoppingBasket =  headerModelTemp.headerModel.shoppingBasket;
                    vm.model.headerModel.shoppingBasket.showBasket = true;
                    if(vm.model.headerModel.shoppingBasket.currency === '') {
                        vm.model.headerModel.shoppingBasket.currency = vm.model.headerModel.currency;
                    }
                }
                saveHeaderModel();
            }else{
                vm.model.headerModel.shoppingBasket.showBasket = headerModel.showBasket;
                saveHeaderModel();
            }

        }

        function updateHeaderModel (model) {

            vm.model = model;
            saveHeaderModel();
        }

        function updateHeaderModelOnHold (model) {
            const headerTemp = angular.copy(NewMainHeaderService.initHeaderModel(model));
            return headerTemp;
        }

        function updateStepsModel (position) {
            vm.isSoftUser = CommonsUserUtilsService.isSoftUser();
            let loggedData = localStorageService.get('customerData');
            let i = 0, founded = false;

            if(vm.isSoftUser && vm.model?.greyBarModel && loggedData) {
                loggedData = NewMainHeaderService.updateLoggedData(loggedData);
                vm.model.greyBarModel.loggedData= loggedData;
                vm.model.greyBarModel.isLogged= loggedData.isLogged;
            }

            if(vm.model && vm.model.stepsModel && vm.model.stepsModel.steps) {
                while (!founded && i < vm.model.stepsModel.steps.length) {
                    if (vm.model.stepsModel.steps[i].position === position) {
                        founded = true;
                    } else
                        ++i;
                }

                vm.model.stepsModel.position = position;
                vm.model.headerModel.steps.position = i >= vm.model.headerModel.steps.length ? vm.model.headerModel.steps.position + 1 : vm.model.stepsModel.steps[i].index;

                saveHeaderModel();
            }
        }

        /**
         * Save header model on localStorage
         */
        function saveHeaderModel () {
            localStorageService.set('headerModel', vm.model);
        }

        /**
         * Recover header model of localStorage
         */
        function getHeaderModel () {
            return localStorageService.get('headerModel');
        }

        function setLogin (onLogin, afterLogin, errorLogin, loggedData) {
            if(loggedData) {
                loggedData=NewMainHeaderService.updateLoggedData(loggedData);
            }
            vm.model.greyBarModel.login = {
                onLogin: onLogin,
                afterLogin: afterLogin,
                onError: errorLogin
            };
            vm.model.greyBarModel.loggedData = loggedData || vm.model.greyBarModel.loggedData;
            saveHeaderModel();
        }

        /**
         * Update Basket in Availability
         * @param {*} offerSelected
         * @param {*} model
         */
        function updateTripsBasketFromDispo (offerSelected, model) {
            const transformedTrips = ibBasketTransformer.transformTripsCartFromDispo(offerSelected, model);
            vm.model.headerModel.shoppingBasket = angular.extend(vm.model.headerModel.shoppingBasket,{trips:transformedTrips,total: angular.copy(transformedTrips.total)} );
            if(vm.model.headerModel.shoppingBasket.discountsModel && vm.model.headerModel.shoppingBasket.discountsModel.total) {
                vm.model.headerModel.shoppingBasket.total.totalPrice = offerSelected.price.total;
                vm.model.headerModel.shoppingBasket.total.formatted = CurrencyService.formatPrice(vm.model.headerModel.shoppingBasket.currency, vm.model.headerModel.shoppingBasket.total.totalPrice, true);
            }
            if( transformedTrips && transformedTrips.ticketingFee ) {
                updateBasketOthers('SUMMARY_OTHER_FEES_ADMINISTRATION', {
                    code: 'ticketingFee',
                    description: 'SUMMARY_OTHER_FEES_ADMINISTRATION',
                    parsedFee: transformedTrips.ticketingFeeFormatted,
                    totalFee: transformedTrips.ticketingFee
                });
            }
            $rootScope.$broadcast('closeCollapseHeader');
            saveHeaderModel();
        }

        /**
         * Delete Trips and Update Basket in Availability
         */
        function deleteTripsBasketFromDispo () {
            const transformedTrips = ibBasketTransformer.deleteTripsCartFromDispo();
            vm.model.headerModel.shoppingBasket.othersModel.hasElements = false;
            vm.model.headerModel.shoppingBasket = angular.extend(vm.model.headerModel.shoppingBasket,{trips:transformedTrips,total: angular.copy(transformedTrips.total)} );
            saveHeaderModel();
        }

        function updateTripsBasket (model, offer) {
            const transformedTrips = ibBasketTransformer.transformTripsCart(model, offer);
            vm.model.headerModel.shoppingBasket = angular.extend(vm.model.headerModel.shoppingBasket,{trips:transformedTrips,total: angular.copy(transformedTrips.total)} );
            saveHeaderModel();
        }

        function updateTripsBasketFromOrder (order) {
            const transformedTrips = ibBasketTransformer.transformTripsFromOrder(order);
            vm.model.headerModel.shoppingBasket = angular.extend(vm.model.headerModel.shoppingBasket,{trips:transformedTrips,total: angular.copy(transformedTrips.total)} );
            saveHeaderModel();
        }

        function updateDiscounts (discountType,modelDiscount) {
            const modelDiscountUpdated = NewMainHeaderService.updateBasketDiscounts(vm.model.headerModel,discountType,modelDiscount);
            vm.model.headerModel.shoppingBasket = angular.extend(vm.model.headerModel.shoppingBasket, modelDiscountUpdated);
            saveHeaderModel();
        }

        function updateDiscountsNew (discountData,originalPrice,totalDiscounts,totalPriceWithDiscounts) {
            const updatedBasket = NewMainHeaderService.updateBasketDiscountsNew(vm.model.headerModel,discountData,originalPrice,totalDiscounts,totalPriceWithDiscounts);
            vm.model.headerModel.shoppingBasket = angular.extend(vm.model.headerModel.shoppingBasket, updatedBasket,totalPriceWithDiscounts);
            saveHeaderModel();
        }

        function deleteDiscountBasket (discountType) {
            const updatedBasket = NewMainHeaderService.deleteDiscountFromBasket(vm.model.headerModel,discountType);
            vm.model.headerModel.shoppingBasket = angular.extend(vm.model.headerModel.shoppingBasket, updatedBasket );
            saveHeaderModel();
        }

        function addDiscountBasket (discountData) {
            const updatedBasket = NewMainHeaderService.addDiscountToBasket(vm.model.headerModel,discountData);
            vm.model.headerModel.shoppingBasket = angular.extend(vm.model.headerModel.shoppingBasket, updatedBasket );
            saveHeaderModel();
        }

        function updateBasketOthers (type,feeInfo) {
            NewMainHeaderService.updateBasketOthers(vm.model.headerModel, type, feeInfo);
            saveHeaderModel();
        }

        function updateBasketFlexibilization (flexInfo) {
            NewMainHeaderService.updateBasketFlexibilization(vm.model.headerModel, flexInfo);
            saveHeaderModel();
        }

        function updateBasketUpgrading (upgrading) {
            NewMainHeaderService.updateBasketUpgrading(vm.model.headerModel, upgrading);
            saveHeaderModel();
        }

        function updatePendingPaymentItems (headerInfo) {
            let seatsInfo;
            vm.model.headerModel.shoppingBasket.showBasket = true;
            let alreadyLoaded = localStorageService.get('alreadyLoaded');
            if(vm.model.headerModel.shoppingBasket.currency === '') {
                vm.model.headerModel.shoppingBasket.currency = headerInfo.currency;
            }
            if(headerInfo.basket) {
                seatsInfo = headerInfo.basket.seats;
            }else {
                seatsInfo = headerInfo.seats;
            }
            if(!alreadyLoaded) {
                localStorageService.set('alreadyLoaded', true);
                alreadyLoaded = localStorageService.get('alreadyLoaded');
                NewMainHeaderService.updatePendingPaymentItems(vm.model.headerModel, seatsInfo, headerInfo.upgrading);
            }
            saveHeaderModel();
        }

        function updateBasketPriority (priorityInfo) {
            NewMainHeaderService.updateBasketPriority(vm.model.headerModel, priorityInfo);
            saveHeaderModel();
        }

        function showLogin () {
            const actualStepFlow = localStorageService.get('actualStepFlow');
            const showAccesLogin = !((angular.isDefined(actualStepFlow) && actualStepFlow === 'ibpbah') || (location.hash.includes('ibpbah')));
            if (vm.model && vm.model.headerModel && vm.model.headerModel.steps && vm.model.headerModel.steps.position>=0 && vm.model.greyBarModel.show) {
                switch (vm.model.headerModel.steps.position) {
                        case 1:
                        case 2:
                            vm.model.greyBarModel.show = showAccesLogin;
                            break;
                        default:
                            vm.model.greyBarModel.show = vm.model.greyBarModel.loggedData.isLogged === true;
                            break;
                }
                saveHeaderModel();
            }
        }

        function updateLogin (data) {
            vm.model.greyBarModel.loggedData = NewMainHeaderService.dataUserLogin(data);
            vm.model.greyBarModel.isLogged = true;
            vm.model.greyBarModel.show = true ;
            saveHeaderModel();
        }
        function toggleAdvancedSearch (event, isActive) {
            vm.showAdvancedSearch = !!isActive;
            vm.openCalendar = null;
            if (isActive) {
                angular.element('body').addClass('modal-open');
            } else {
                angular.element('body').removeClass('modal-open');
            }
        }
        function openAdvancedSearchAndOpenCalendar (event, type) {
            vm.showAdvancedSearch = true;
            vm.openCalendar = type;
        }

        function showLoginMMBOnHold () {
            vm.model.headerModel.steps = {
                position: 0,
                totalSteps: 0
            };
            showLogin();
        }
    }
})();
