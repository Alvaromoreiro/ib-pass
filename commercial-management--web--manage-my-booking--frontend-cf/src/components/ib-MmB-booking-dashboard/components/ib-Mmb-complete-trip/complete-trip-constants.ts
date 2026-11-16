import angular from "angular";

const CompleteTripConstants = {
    PARTNERS: [{
        order: '0',
        name: 'melia'
    }, {
        order: '1',
        name: 'booking'
    }, {
        order: '2',
        name: 'voucher_iberia'
    }, {
        order: '3',
        name: 'transporte_publico'
    }, {
        order: '4',
        name: 'alsa_vtc'
    }, {
        order: '5',
        name: 'avis'
    }, {
        order: '6',
        name: 'thyssen_bornemisza'
    }, {
        order: '7',
        name: 'alsa_prado'
    }, {
        order: '8',
        name: 'alsa_experiencias'
    }, {
        order: '9',
        name: 'corte_ingles'
    }, {
        order: '10',
        name: 'holafly'
    }, {
        order: '11',
        name: 'mad_madrid'
    },  {
        order: '12',
        name: 'galeria_canalejas'
    }, {
        order: '13',
        name: 'aprende_a_cocinar_una_paella'
    }, {
        order: '14',
        name: 'showcooking_ruben_arnanz'
    }, {
        order: '15',
        name: 'museo_real_madrid_y_zegna_boutique'
    }]
}
angular.module('ib-MmB-complete-trip-module').constant('CompleteTripConstants', CompleteTripConstants);
export { CompleteTripConstants };