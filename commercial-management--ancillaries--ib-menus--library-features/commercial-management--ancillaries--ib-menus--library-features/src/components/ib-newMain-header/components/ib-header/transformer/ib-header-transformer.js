import dayjs from 'dayjs';

(function () {

    'use strict';

    angular
        .module('ib-header-module')
        .factory('HeaderTransformer', HeaderTransformer);

    HeaderTransformer.$inject = ['NewMainHeaderConstants', 'DiscountsViewModel', 'CurrencyService', 'OthersFeesViewModel','ShoppingBasketViewModel', '$rootScope', 'CommonsUtilService'];
    function HeaderTransformer (NewMainHeaderConstants, DiscountsViewModel, CurrencyService, OthersFeesViewModel,ShoppingBasketViewModel, $rootScope, CommonsUtilService) {

        return {
            initHeader: initHeader,
            addSteps: addSteps,
            updateBasketDiscounts: updateBasketDiscounts,
            updateBasketDiscountsNew: updateBasketDiscountsNew,
            addDiscountToBasket: addDiscountToBasket,
            deleteDiscountFromBasket: deleteDiscountFromBasket
        };

        function initHeader (model) {
            let i = 0, flightType, originDestinationLocal;
            const headerModel = {
                flightType: '',
                redemption: '',
                trips: [],
                isMultiflight: false,
                isOnHold: false,
                passengers: null,
                shoppingBasket: {
                    baggages: {
                        segments: [],
                        hasBaggage: false
                    },
                    bundle: {
                        info: [],
                        hasBundle: false
                    },
                    seats: {
                        segments: [],
                        hasSeats: false
                    },
                    insurance: {
                        info: null,
                        hasInsurance: false
                    },
                    flexibilization: {
                        info: null,
                        hasFlexibilization: false
                    },
                    upgrading: {
                        segments: [],
                        hasUpgrading: false
                    },
                    speqs: {
                        segments: [],
                        hasSpeqs: false
                    },
                    petc: {
                        segments: [],
                        hasPetc: false,
                        total: {
                            total: 0,
                            totalFormatted: ''
                        }
                    },
                    priorityBoarding: {
                        info: null,
                        hasPriorityBoarding: false
                    },
                    carbonFootprint: {
                        info: null,
                        hasCarbonFootprint: false
                    },
                    globickTransfers: {
                        info: null,
                        hasTransfersGlobick: false
                    },
                    globickActivities: {
                        info: null,
                        hasActivitiesGlobick: false
                    },
                    insuranceAllianzFusionInfo: {
                        info: null,
                        hasInsuranceAllianzFusion: false
                    },
                    discountsModel: {},
                    othersModel: {},
                    segmentsInfo: [],
                    showBasket: model.showBasket === true,
                    currency: {},
                    total: {
                        formatted: '',
                        totalPrice: 0
                    }
                },
                advancedSearch: false
            };

            if (model) {
                headerModel.redemption = model.redemption;
                headerModel.trips = [];
                headerModel.showModalBackHome = model.showModalBackHome || false;
                headerModel.currency = model.currency;
                headerModel.isOnHold = model.isOnHold;
                if (model.flightType) {

                    flightType = detectFlightType(model.flightType);
                    if (flightType.isMultiCity) {
                        originDestinationLocal = angular.isArray(model.originDestination) ? model.originDestination[0] : model.originDestination;
                    } else {
                        originDestinationLocal = model.originDestination;
                    }

                    headerModel.flightType = flightType.flightType;
                    headerModel.isMultiflight = flightType.isMultiCity;
                    headerModel.passengers = {
                        numberPassengers: originDestinationLocal.passengers,
                        numAdults: originDestinationLocal.numAdults,
                        numSeniors: originDestinationLocal.numSeniors,
                        numYouth: originDestinationLocal.numYoung,
                        numTeenager: originDestinationLocal.numTeenager,
                        numChilds: originDestinationLocal.numChilds,
                        numInfants: originDestinationLocal.numInfant
                    };

                    if (flightType.isMultiCity) {

                        for (i = 0; i < model.originDestination.length; ++i) {
                            headerModel.trips.push(createTripObject(model.originDestination[i]));
                        }

                        headerModel.passengers.numberPassengers = angular.isArray(model.originDestination) && model.originDestination[0] ? model.originDestination[0].passengers : model.originDestination.passengers;
                    } else {
                        headerModel.trips.push(createTripObject(model.originDestination));
                    }
                }

                if ( typeof model.showAdvancedSearch === 'undefined' && $rootScope.flowName === 'BKI') {
                    headerModel.showAdvancedSearch = true;
                } else if(typeof model.showAdvancedSearch !== 'undefined') {
                    headerModel.showAdvancedSearch = model.showAdvancedSearch;
                }

                if ( typeof model.advancedSearch === 'undefined' && $rootScope.flowName === 'BKI') {
                    headerModel.avancedSearch = true;
                } else if(typeof model.avancedSearch !== 'undefined') {
                    headerModel.avancedSearch = model.avancedSearch;
                }

                if (model.shoppingBasket?.discountsModel) {
                    headerModel.shoppingBasket.discountsModel = model.shoppingBasket.discountsModel;
                } else {
                    headerModel.shoppingBasket.discountsModel = DiscountsViewModel.getDiscountsViewModel();
                }

                if (model.shoppingBasket?.othersModel) {
                    headerModel.shoppingBasket.othersModel = model.shoppingBasket.othersModel;
                } else {
                    headerModel.shoppingBasket.othersModel = OthersFeesViewModel.getOthersViewModel(model.currency ? model.currency : '');
                }

                headerModel.shoppingBasket.currency = model.currency;

                if (model.shoppingBasket?.total) {
                    headerModel.shoppingBasket.total = model.shoppingBasket.total;
                } else {
                    headerModel.shoppingBasket.total = {
                        formatted: CurrencyService.formatPrice(model.currency, 0, true),
                        totalPrice: 0
                    };
                }

            }
            return headerModel;
        }

        /**
         * Create a trip object using the originDestination object
         * @param {Object} originDestination
         */
        function createTripObject (originDestination) {
            return {
                originCode: originDestination.originCity.code,
                originCity: originDestination.originCity.description,
                destinyCode: originDestination.destinationCity.code,
                destinyCity: originDestination.destinationCity.description,
                dateFlight: originDestination.dates.outboundFlight ? dayjs(originDestination.dates.outboundFlight).format('DD/MM/YYYY') : null,
                returnFlight: originDestination.dates.returnFlight ? dayjs(originDestination.dates.returnFlight).format('DD/MM/YYYY') : null,
                passengers: originDestination.passengers,
                tripType: (originDestination.tripType ?? ((originDestination?.dates?.returnFlight) ? '2': '1'))
            };
        }

        /**
         * Use the flightType for detect the current flow and create a speciall model if its need it
         * @param {string} flightType
         */
        function detectFlightType (flightType) {
            let flightTypeTransformed;
            switch (flightType) {
                    case NewMainHeaderConstants.HEADER_TYPE.MULTITRIP:
                        flightTypeTransformed = {
                            flightType: flightType,
                            isMultiCity: true
                        };
                        break;
                    default: {
                        flightTypeTransformed = {
                            flightType: flightType,
                            isMultiCity: false
                        };
                    }
                        break;
            }
            return flightTypeTransformed;
        }

        function addSteps (stepsModel) {
            let i = 0, founded = false;

            while (!founded && i < stepsModel.steps.length) {
                if (stepsModel.steps[i].position === stepsModel.position) {
                    founded = true;
                } else
                    ++i;
            }

            return {
                position: i >= stepsModel.steps.length ? 0 : stepsModel.steps[i].index,
                totalSteps: stepsModel.steps.length
            };

        }

        function updateBasketDiscountsNew (shoppingBasket, discountData, originalPrice, totalDiscounts, totalPriceWithDiscounts) {
            if(discountData && originalPrice && originalPrice.total) {
                if (CommonsUtilService.isDiscountTypePartnerEquivalent(discountData.type)) {
                    discountData.type = NewMainHeaderConstants.DISCOUNT_TYPES.PARTNER;
                }
                if(shoppingBasket.discountsModel.discounts[discountData.type]
                    && shoppingBasket.discountsModel.discounts[discountData.type].type === discountData.type) {
                    shoppingBasket.discountsModel.total = totalDiscounts ? totalDiscounts : shoppingBasket.discountsModel.total - shoppingBasket.discountsModel.discounts[discountData.type].totalDiscount;
                }else{
                    shoppingBasket.discountsModel.discounts[discountData.type] = discountData;
                }
                if(totalDiscounts) {
                    shoppingBasket.discountsModel.total = totalDiscounts;
                }else{
                    shoppingBasket.discountsModel.total += shoppingBasket.discountsModel.discounts[discountData.type].totalDiscount;
                }
                shoppingBasket.discountsModel.hasDiscounts = true;
                shoppingBasket.total.original = originalPrice.total;
                shoppingBasket.discountsModel.discounts[discountData.type].discountFormatted = CurrencyService.formatPrice(shoppingBasket.currency, discountData.totalDiscount, true);
                shoppingBasket.discountsModel.totalFormated = CurrencyService.formatPrice(shoppingBasket.currency, -shoppingBasket.discountsModel.total, true);
                shoppingBasket.total.totalPrice = totalPriceWithDiscounts;
                shoppingBasket.total.formatted = CurrencyService.formatPrice(shoppingBasket.currency, totalPriceWithDiscounts, true);
            }else{
                shoppingBasket.discountsModel.discounts = {};
                shoppingBasket.discountsModel.hasDiscounts = false;
                shoppingBasket.discountsModel.total = 0;
                shoppingBasket.discountsModel.totalFormated = CurrencyService.formatPrice(shoppingBasket.currency, -shoppingBasket.discountsModel.total, true);
                shoppingBasket.total.totalPrice = shoppingBasket.total.original;
                shoppingBasket.total.formatted = CurrencyService.formatPrice(shoppingBasket.currency, shoppingBasket.total.original, true);
            }

            ShoppingBasketViewModel.calculateAllBasket(shoppingBasket);
            return shoppingBasket;
        }

        function addDiscountToBasket (shoppingBasket, discountData) {
            let existentDiscount = false;
            try {
                existentDiscount =  (typeof (shoppingBasket.discountsModel.discounts[discountType]) === 'object');
            } catch (e) {
                existentDiscount = false;
            }
            if (CommonsUtilService.isDiscountTypePartnerEquivalent(discountData.type)) {
                discountData.type = NewMainHeaderConstants.DISCOUNT_TYPES.PARTNER;
            }
            if(!existentDiscount) {
                shoppingBasket.discountsModel.discounts[discountData.type] = discountData;
                shoppingBasket.discountsModel.discounts[discountData.type].discountFormatted = CurrencyService.formatPrice(shoppingBasket.currency, discountData.totalDiscount, true);
                shoppingBasket.discountsModel.total += shoppingBasket.discountsModel.discounts[discountData.type].totalDiscount ? shoppingBasket.discountsModel.discounts[discountData.type].totalDiscount : shoppingBasket.discountsModel.discounts[discountData.type].originalDiscount;
                shoppingBasket.discountsModel.totalFormated = CurrencyService.formatPrice(shoppingBasket.currency, -shoppingBasket.discountsModel.total, true);
                shoppingBasket.total.formatted = CurrencyService.formatPrice(shoppingBasket.currency, shoppingBasket.total.original - shoppingBasket.discountsModel.total, true);
            }
            shoppingBasket.discountsModel.hasDiscounts = true;
            return shoppingBasket;
        }

        function deleteDiscountFromBasket (shoppingBasket, discountType) {
            let existentDiscount = false;
            try {
                existentDiscount =  (typeof (shoppingBasket.discountsModel.discounts[discountType]) === 'object');
            } catch (e) {
                existentDiscount = false;
            }
            if (CommonsUtilService.isDiscountTypePartnerEquivalent(discountType)) {
                discountType = NewMainHeaderConstants.DISCOUNT_TYPES.PARTNER;
            }
            if(existentDiscount) {
                shoppingBasket.discountsModel.total -= shoppingBasket.discountsModel.discounts[discountType].totalDiscount ? shoppingBasket.discountsModel.discounts[discountType].totalDiscount : shoppingBasket.discountsModel.discounts[discountType].originalDiscount;
                shoppingBasket.discountsModel.totalFormated = CurrencyService.formatPrice(shoppingBasket.currency, -shoppingBasket.discountsModel.total, true);
                shoppingBasket.total.formatted = CurrencyService.formatPrice(shoppingBasket.currency, shoppingBasket.total.original - shoppingBasket.discountsModel.total, true);
                delete shoppingBasket.discountsModel.discounts[discountType];
            }
            if(!shoppingBasket.discountsModel.discounts || !Object.keys(shoppingBasket.discountsModel.discounts).length > 0) {
                shoppingBasket.discountsModel.hasDiscounts = false;
            }
            return shoppingBasket;
        }

        function updateBasketDiscounts (shoppingBasket, discountType, modelDiscount) {
            let appliedDiscounts;
            const originalPrice = shoppingBasket.total.original;
            if (discountType && modelDiscount) {
                if (CommonsUtilService.isDiscountTypePartnerEquivalent(discountType)) {
                    discountType = NewMainHeaderConstants.DISCOUNT_TYPES.PARTNER;
                }
                // Si ya existe el mismo descuento, lo desactivamos para aplicar el nuevo recibido
                if (shoppingBasket.discountsModel.discounts[discountType]) {
                    shoppingBasket.total.original += shoppingBasket.discountsModel.discounts[discountType].discount;
                    shoppingBasket.discountsModel.total -= shoppingBasket.discountsModel.discounts[discountType].discount;
                }
                //Aplicamos nuevo descuento
                shoppingBasket.discountsModel.discounts[discountType] = DiscountsViewModel.getDiscountModel(modelDiscount, discountType, shoppingBasket.total.original);
                shoppingBasket.total.original -= shoppingBasket.discountsModel.discounts[discountType].discount;
                shoppingBasket.discountsModel.total += shoppingBasket.discountsModel.discounts[discountType].discount;
                shoppingBasket.discountsModel.hasDiscounts = true;
                shoppingBasket.discountsModel.totalFormated = CurrencyService.formatPrice(shoppingBasket.currency, -shoppingBasket.discountsModel.total, true);
            } else {
                //Borramos el descuento del tipo indicado
                if (discountType) {
                    if (shoppingBasket.discountsModel.discounts[discountType]) {
                        shoppingBasket.total.original += shoppingBasket.discountsModel.discounts[discountType].discount;
                    }
                } else {
                    appliedDiscounts = Object.keys(shoppingBasket.discountsModel.discounts);
                    angular.forEach(appliedDiscounts, (discountKey) => {
                        shoppingBasket.total.original = calculateTotalWhenDeleteVoucher();
                    });
                }
                DiscountsViewModel.deleteDiscount(shoppingBasket.discountsModel, discountType);
                appliedDiscounts = Object.keys(shoppingBasket.discountsModel.discounts);
                appliedDiscounts.length > 0 ? shoppingBasket.discountsModel.hasDiscounts = true : shoppingBasket.discountsModel.hasDiscounts = false;
            }
            if (originalPrice !== shoppingBasket.total.original) {
                shoppingBasket.total.formatted = CurrencyService.formatPrice(shoppingBasket.currency, shoppingBasket.total.original, true);
            }

            ShoppingBasketViewModel.calculateAllBasket(shoppingBasket);

            return shoppingBasket;

            function calculateTotalWhenDeleteVoucher () {
                let totalPrice = 0;
                if (shoppingBasket.trips && shoppingBasket.trips.total && shoppingBasket.trips.total.totalPrice > 0) {
                    totalPrice += shoppingBasket.trips.total.totalPrice;
                }
                if (shoppingBasket.seats.total && shoppingBasket.seats.total.total > 0) {
                    totalPrice += shoppingBasket.seats.total.total;
                }
                if (shoppingBasket.baggages.total && shoppingBasket.baggages.total.total > 0) {
                    totalPrice += shoppingBasket.baggages.total.total;
                }
                if (shoppingBasket.insurance.hasInsurance && shoppingBasket.insurance.total && shoppingBasket.insurance.total.total > 0) {
                    totalPrice += shoppingBasket.insurance.total.total;
                }
                if (shoppingBasket.upgrading.hasUpgrading && shoppingBasket.upgrading.total && shoppingBasket.upgrading.total > 0) {
                    totalPrice += shoppingBasket.upgrading.total;
                }
                if (shoppingBasket.speqs.hasSpeqs && shoppingBasket.speqs.total && shoppingBasket.speqs.total.total > 0) {
                    totalPrice += shoppingBasket.speqs.total.total;
                }
                if (shoppingBasket.flexibilization.hasFlexibilization && shoppingBasket.flexibilization.info && shoppingBasket.flexibilization.info.amount && shoppingBasket.flexibilization.info.amount.price && shoppingBasket.flexibilization.info.amount.price > 0) {
                    totalPrice += shoppingBasket.flexibilization.info.amount.price;
                }
                return totalPrice;
            }
        }
    }
})();
