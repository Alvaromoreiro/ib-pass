import * as angular from 'angular';

const CommonsAviosConstants = {
    ANCILLARIES_LITERALS: {
        PRIORITY_BOARDING: 'PRIORITY_BOARDING_TITLE',
        FLEXIBILITY_ON_DEMAND: 'ANCILLARIES_FLEXIBILITY_SUBTITLE_MODAL',
        SKI_SNOW: 'SPEQS_SKI_SNOW',
        GOLF_EQUIPMENT: 'SPEQS_GOLF_EQUIPMENT',
        BICYCLE: 'SPEQS_BICYCLE',
        SURFBOARD: 'SPEQS_SURFBOARD_TITLE',
        SCUBA_DIVING: 'SPEQS_SCUBA_TITLE',
        FISHING_EQUIPMENT: 'SPEQS_FISHING_TITLE',
        BAGGAGE_15: 'ANCILLARIES_BAGGAGE_TITLE_15',
        BAGGAGE_23: 'ANCILLARIES_BAGGAGE_TITLE_23',
        BAGGAGE_32: 'ANCILLARIES_BAGGAGE_TITLE_32',
        SEAT: 'SEAT_TEXT',
        VOUCHER_REFUND: 'ANCILLARIES_FLEXIBILITY_VOUCHER_REFUND_CHANGE_TITLE',
        FLIGHT_CHANGE: 'ANCILLARIES_FLEXIBILITY_FLIGHT_CHANGE_TITLE',
        FLEXIBILITY_PACK: 'ANCILLARIES_FLEXIBILITY_PACK_FLEXIBILITY',
        PET: 'PETC_IN_CABIN'
    }
};

angular.module('ib-commons-avios-constants', []);
angular
    .module('ib-commons-avios-constants')
    .constant('CommonsAviosConstants', CommonsAviosConstants);

export { CommonsAviosConstants };
export type CommonsAviosConstantsType = typeof CommonsAviosConstants;
