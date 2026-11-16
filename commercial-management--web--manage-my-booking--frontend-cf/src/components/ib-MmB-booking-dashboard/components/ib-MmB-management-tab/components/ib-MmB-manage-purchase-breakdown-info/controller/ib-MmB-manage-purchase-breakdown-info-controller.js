(function () {
    'use strict';
    angular.module('ib-MmB-manage-purchase-breakdown-info-module').controller('MmBManagePurchaseBreakdownInfoController', MmBManagePurchaseBreakdownInfoController);
    MmBManagePurchaseBreakdownInfoController.$inject = ['MmBAppConstants', '$rootScope', 'CurrencyService', '$filter', 'localStorageService', 'MmBModalService'];
    function MmBManagePurchaseBreakdownInfoController(MmBAppConstants, $rootScope, CurrencyService, $filter, localStorageService, MmBModalService) {
        var vm = this;
        var totalPrice = 0, flightItinerary = false, flightItineraryPrice = 0, totalPricePackage = 0, listAditionals = [], listdepositAmount = [], listFees = [], typeTotalPricePackage, pendingAmount = 0, listPurchase = [], packageElement = 0;
        var symbolPrice, currency;
        vm.$onInit = activate;
        vm.popoverHolidays = [
            {
                'text': $filter('translate')('IBCOAC_MMB_REQUEST_BILL_LINK_TITLE'),
                'path': null
            }, {
                'text': $filter('translate')('MMB_VC_IB_VACIONES_YOUR_CAR'),
                'path': null
            }
        ];
        vm.yourPurchase = {};
        function activate() {
            var itemDeposit, itemListFee, itemlistdepositAmount, itemAditional, itemExperience, itemflightItinerary, itemTransfer;
            if (vm.model.packagedProduct) {
                symbolPrice = vm.model.packagedProduct[0].payment.pending.symbolBreakdown;
                for (packageElement; packageElement < vm.model.packagedProduct.length; packageElement++) {
                    const packagedProduct = vm.model.packagedProduct[packageElement];

                    if (packagedProduct.totalPrice) {
                        totalPrice += packagedProduct.totalPrice.total;
                        currency = packagedProduct.totalPrice.currency;
                    }
                    if (packagedProduct?.packagePrice?.total) {
                        const totalPrice = isNaN(packagedProduct.packagePrice.total) ? 0 : packagedProduct.packagePrice.total;
                        totalPricePackage = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currency), totalPrice, true).trim();
                    }
                    else {
                        flightItinerary = true;
                        const totalPrice = isNaN(packagedProduct.totalPrice.total) ? 0 : packagedProduct.totalPrice.total;
                        totalPricePackage = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currency), totalPrice, true).trim();

                        typeTotalPricePackage = $filter('translate')('IBV_TITLE_FLIGTH');
                        for (let itemProduct = 0; itemProduct < packagedProduct.products.length; itemProduct++) {
                            const product = packagedProduct.products[itemProduct];
                            const procutPrice = isNaN(product.price.total) ? 0 : product.price.total;
                            flightItineraryPrice = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currency), procutPrice, true).trim();
                        }
                    }

                    if (packagedProduct?.payment && packagedProduct?.payment?.payments) {
                        const payments = packagedProduct.payment.payments;

                        for (itemDeposit = 0; itemDeposit < payments.length; itemDeposit++) {

                            const payment = payments[itemDeposit];

                            const haveAdditionalPayment = payment.additionalPayment;
                            const isTotalANumber = !isNaN(payment.total);
                            const filterName = haveAdditionalPayment ? 'MMB_VC_IB_VACIONES_DEPOSIT_PAID' : 'MMB_VC_IB_VACIONES_DEPOSIT_PAID';
                            const price = MmBAppConstants.IBERIA_HOLIDAYS.MMB_IB_VACIONES_TYPE_NEGATIVE + CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currency), payment.total, isTotalANumber).trim();

                            listdepositAmount.push(
                                {
                                    name: $filter('translate')(filterName),
                                    price: price
                                }
                            );
                        }
                    }

                    if (packagedProduct?.payment && packagedProduct?.payment.fees) {
                        const fees = packagedProduct.payment.fees;

                        for (let itemFee = 0; itemFee < fees.length; itemFee++) {
                            const fee = packagedProduct.payment.fees[itemFee];
                            const feeAmount = isNaN(fee?.amount) ? 0 : fee.amount;
                            if (!feeAmount) continue;
                            let name;
                            const price = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currency), feeAmount, true).trim();

                            switch (fee?.code) {
                                case 'CC':
                                    name = $filter('translate')('MMB_VC_IB_VACIONES_CREDIT_CARD');
                                    break;
                                case 'OB':
                                    name = $filter('translate')('MMB_VC_IB_VACIONES_BOOKING_FREE');
                                    break;
                                default:
                                    name = fee?.description;
                            }

                            listFees.push({ name, price });

                        }
                    }

                    if (packagedProduct.payment.pending != null && packagedProduct.payment.pending.total && packagedProduct.payment.pending.total > 0) {
                        pendingAmount = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currency), packagedProduct.payment.pending.total, true);
                    }

                    typeTotalPricePackage = $filter('translate')('MMB_VC_IB_VACIONES_PACK_CAR');

                    for (let itemProduct = 0; itemProduct < packagedProduct.products.length; itemProduct++) {
                        if (!packagedProduct.products[itemProduct].packaged) continue;

                        if (packagedProduct.products[itemProduct].type === MmBAppConstants.IBERIA_HOLIDAYS.MMB_IB_VACIONES_TYPE_PACKAGE_HOTEL) {
                            typeTotalPricePackage = $filter('translate')('MMB_VC_IB_VACIONES_PACK_HOTEL');
                        }
                    }
                }

                vm.yourPurchase.symbol = symbolPrice;
                listPurchase.push({
                    name: typeTotalPricePackage,
                    price: flightItinerary ? flightItineraryPrice : totalPricePackage
                });

            }
            if (vm.model.hotel) {

                for (let itemHotel = 0; itemHotel < vm.model.hotel.length; itemHotel++) {
                    const hotel = vm.model.hotel[itemHotel];
                    if (!hotel?.packaged && hotel?.price != null) {

                        const priceTotal = isNaN(hotel?.price.total) ? 0 : hotel.price.total;
                        const name = $filter('translate')('MMB_VC_IB_VACIONES_HOTEL') + MmBAppConstants.IBERIA_HOLIDAYS.MMB_IB_VACIONES_TYPE_SPACE + hotel?.name;
                        const price = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currency), priceTotal, true).trim();

                        listPurchase.push({ name, price });
                    }
                }
            }
            if (vm.model.vehicle) {
                for (let itemVehicle = 0; itemVehicle < vm.model.vehicle.length; itemVehicle++) {
                    const vehicle = vm.model.vehicle[itemVehicle];
                    if (!vehicle?.packaged && vehicle?.price != null) {

                        const priceTotal = isNaN(vehicle?.price.total) ? 0 : vehicle.price.total;
                        const name = vehicle?.provider.name +
                            MmBAppConstants.IBERIA_HOLIDAYS.MMB_IB_VACIONES_TYPE_NEGATIVE +
                            $filter('translate')('MMB_VC_IB_VACIONES_AVIS_GROUP') +
                            vehicle?.groupCode +
                            MmBAppConstants.IBERIA_HOLIDAYS.MMB_IB_VACIONES_TYPE_SPACE +
                            MmBAppConstants.IBERIA_HOLIDAYS.MMB_IB_VACIONES_TYPE_NEGATIVE + vehicle?.groupName;

                        const price = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currency), priceTotal, true).trim();

                        listPurchase.push({ name, price });

                    }
                }
            }
            if (vm.model.flightItinerary) {
                for (itemflightItinerary; itemflightItinerary < vm.model.flightItinerary.length; itemflightItinerary++) {
                    if (vm.model.flightItinerary[itemflightItinerary].packaged) {
                        const vehicle = vm.model.vehicle[itemflightItinerary];
                        const totalPrice = isNaN(vehicle?.price?.total) ? 0 : vehicle.price.total;
                        const price = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currency), totalPrice, true).trim();
                        const name = vehicle.provider.name +
                            MmBAppConstants.IBERIA_HOLIDAYS.MMB_IB_VACIONES_TYPE_NEGATIVE +
                            $filter('translate')('WIDGET_YOUR_TRANSFERS') +
                            vehicle.groupCode +
                            MmBAppConstants.IBERIA_HOLIDAYS.MMB_IB_VACIONES_TYPE_SPACE +
                            MmBAppConstants.IBERIA_HOLIDAYS.MMB_IB_VACIONES_TYPE_NEGATIVE +
                            vehicle.groupName;

                        listPurchase.push({ name, price });
                    }
                }
            }

            if (vm.model.experience) {
                for (let itemExperience = 0; itemExperience < vm.model.experience.length; itemExperience++) {
                    const experience = vm.model.experience[itemExperience];
                    const name = $filter('translate')('WIDGET_YOUR_EXPERIENCES');
                    const priceTotal = isNaN(experience?.price.total) ? 0 : experience.price.total;
                    const price = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currency), priceTotal, true).trim();

                    listPurchase.push({ name, price });
                }
            }
            if (vm.model.transfer) {
                for (itemTransfer = 0; itemTransfer < vm.model.transfer.length; itemTransfer++) {
                    const transfer = vm.model.transfer[itemTransfer];
                    const name = $filter('translate')('WIDGET_YOUR_TRANSFERS');
                    const totalPrice = isNaN(transfer?.price.total) ? 0 : transfer.price.total;
                    const price = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currency), totalPrice, true).replace(/^\s+|\s+$/gm, '');

                    listPurchase.push({ name, price });
                }
            }

            const AmountTotal = isNaN(totalPrice) ? 0 : totalPrice;
            vm.yourPurchase.totalPrice = CurrencyService.formatPrice(
                CurrencyService.getCurrencyObject(currency),
                AmountTotal,
                true
            ).trim();

            vm.yourPurchase.typePackage = typeTotalPricePackage;
            vm.yourPurchase.listPurchase = listPurchase.concat(listFees, listdepositAmount, listAditionals);
            vm.yourPurchase.pendingAmount = pendingAmount;

            localStorageService.set('yourPurchase', vm.yourPurchase);
        };

    }

})();
