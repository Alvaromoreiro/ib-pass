angular
    .module('ib-booking-filters-module')
    .filter('EliteQualification', EliteQualification);

EliteQualification.$inject = ['IbElitePointsManager'];
function EliteQualification (IbElitePointsManager) {
    getElitePoints.$stateful = true;

    return getElitePoints;

    function getElitePoints (fare, comercialNameES, flightRatio) {
        return IbElitePointsManager.eliteQualificationMapper(fare, comercialNameES, flightRatio);
    }
}
