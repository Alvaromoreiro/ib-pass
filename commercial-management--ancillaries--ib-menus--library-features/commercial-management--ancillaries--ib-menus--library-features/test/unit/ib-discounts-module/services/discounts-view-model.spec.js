// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-discounts-module - services', function() {

    beforeEach(function() {
        module('ib-web-menus-module', 'pascalprecht.translate');
    });

    describe('test for DiscountsViewModel', function() {

        var DiscountsViewModel;
        var NewMainHeaderConstants;
        var $filter;
        var $injector;

        beforeEach(function() {
            inject(function(_$injector_) {
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key]; 
                    return clone
                } , {});
                NewMainHeaderConstants = $injector.get('NewMainHeaderConstants');
                $filter = $injector.get('$filter');
                DiscountsViewModel = $injector.get('DiscountsViewModel');
            });
        });

        it('DiscountsViewModel should be defined', function() {

            expect(DiscountsViewModel).toBeDefined();
        });


        it('test for DiscountsViewModel.getDiscountsViewModel', function() {

            var ret = DiscountsViewModel.getDiscountsViewModel();

            expect(DiscountsViewModel.getDiscountsViewModel).toBeDefined();
        });

        it('test for DiscountsViewModel.getDiscountModel', function() {
            var modelDiscount = {
                discount: '7,95€ ',
                originalDiscount: 7.95,
                type: 'PARTNER'
            };
            NewMainHeaderConstants.DISCOUNT_TYPES = {};
            DiscountsViewModel.getDiscountModel(modelDiscount,'PARTNER',79.54);
            expect(DiscountsViewModel.getDiscountModel).toBeDefined();
        });

        it('test for DiscountsViewModel.deleteDiscount', function() {

            var modelDiscount = {
                hasDiscounts: true,
                total: 7.95,
                discounts: {
                    PARTNER: {
                        discountFormatted: '7,95€ ',
                        discount: 7.95,
                        type: 'Cupón de descuento undefined'
                    }
                }
            };
            DiscountsViewModel.deleteDiscount(modelDiscount,'PARTNER');

            expect(DiscountsViewModel.deleteDiscount).toBeDefined();
        });
    });
});