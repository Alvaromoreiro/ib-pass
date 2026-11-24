(function () {
    'use strict';

    angular
        .module('ib-pmt-mmb-confirmation-module')
        .factory('PmtMmbConfirmationTransformer', PmtMmbConfirmationTransformer);

    PmtMmbConfirmationTransformer.$inject = ['localStorageService', 'PmtConstants', 'CurrencyService'];
    function PmtMmbConfirmationTransformer (localStorageService, PmtConstants, CurrencyService) {

        return {
            transformInfoConfirmation: transformInfoConfirmation,
            transformCO2InfoConfirmation: transformCO2InfoConfirmation
        };

        ////////////////
        function transformInfoConfirmation () {
            let headerModel = localStorageService.get('headerModel'),
                bookingInfo = localStorageService.get('bookingInfo'), confirmationInfo = [], infoSlice = {},
                segmentsSlice = [];

            angular.forEach(bookingInfo.order.slices, (slice) => {
                infoSlice = {
                    origin: {
                        description: slice.segments[0].departure.city.description,
                        code: slice.segments[0].departure.city.code
                    },
                    destination: {
                        description: slice.segments[slice.segments.length - 1].arrival.city.description,
                        code: slice.segments[slice.segments.length - 1].arrival.city.description
                    },
                    segments: []
                };
                segmentsSlice = [];
                angular.forEach(slice.segments, (segment) => {
                    angular.forEach(headerModel.headerModel.shoppingBasket.seats.segments, (headerSegment) => {
                        if (angular.equals(segment.id, headerSegment.segmentId)) {
                            infoSlice.segments.push(headerSegment);
                        }
                    });
                });
                confirmationInfo.push(infoSlice);
            });
            return confirmationInfo;
        }

        function transformCO2InfoConfirmation () {
            const ancillariesInfo = localStorageService.get('ancillariesInfo');
            const co2Ancillary = ancillariesInfo?.ancillaries?.find(ancillary => ancillary.type === PmtConstants.ANCILLARIES_TYPES.CO2_FOOTPRINT && ancillary.status.code === PmtConstants.GENERAL_STATUS.AVAILABLE);
            if (co2Ancillary) {
                return {
                    kilosCo2Equivalent: co2Ancillary.kilosCo2Equivalent,
                    kilosCo2EquivalentFormatted: co2Ancillary.kilosCo2Equivalent.toString().replace('.', ','),
                    price: co2Ancillary.price,
                    priceFormatted: CurrencyService.formatPrice(CurrencyService.getCurrencyObject(ancillariesInfo.currencies[0]), co2Ancillary.price, true, null)
                };
            }
            return null;
        }

    }
})();
