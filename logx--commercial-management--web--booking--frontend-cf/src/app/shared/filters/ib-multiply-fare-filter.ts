angular
    .module('ib-booking-filters-module')
    .filter('MultiplyFare', MultiplyFare);

MultiplyFare.$inject = [];
function MultiplyFare () {
    getAvios.$stateful = true;//make a filter to be called in every angular digest cicle
    const valuesAvios = {
        classic: 5,
        silver: 6,
        gold: 7,
        platinum: 8,
        Infinity: 8,
        InfinityPlus: 8
    };
    return getAvios;

    ////////////////
    // multiply fare by tier
    function getAvios (fare, tier) {
        if(fare === null || fare === undefined) return 0;
        if(tier === null || tier === undefined) tier = 'classic';
        return Math.round(fare * valuesAvios[tier] );
    }
}
