(function () {
    'use strict';

    angular
        .module('ib-MmB-routing-module')
        .service('MmBRouterPreconditionsService', MmBRouterPreconditionsService);

    function MmBRouterPreconditionsService() {

        var self = this;

        self.preConditions = {};
        self.registerPreCondition = registerPreCondition;
        self.canTransition = canTransition;
        self.otherwise = otherwise;

        ////////////////
        /**
         * Registration function for preconditions
         * @param {string} state - name of state to be registered
         * @param {Function} transitionEvaluator - function to perform can transition logic
         * @param {string=} otherwise - name of state to transition to if not allowed to progress
         */
        function registerPreCondition(state, transitionEvaluator, otherwise) {
            var property;
            // Validate State parameter
            if (!state || !(angular.isString(state))) {
                throw 'Must provide state name';
            }

            // Validate the transitionEvaluator parameter
            if (!transitionEvaluator || !(transitionEvaluator instanceof Function)) {
                throw 'Must provide transitionEvaluator';
            }

            // Ensure the state precondition has not already been registered
            for (property in self.preConditions) {
                if (self.preConditions.hasOwnProperty(property)) {
                    if (property === state) {
                        throw 'Pre-condition already registered';
                    }
                }
            }

            // Add the precondition to the pre-condition store
            self.preConditions[state] = {
                transitionEvaluator: transitionEvaluator,
                otherwise: otherwise
            };
        }

        /**
         * Runs the preconditions transition evaluator returning true of false to indicate if a state transition can progress
         * @param {string} stateTransitioningTo - state you are trying to transition to
         * @param {Object.<string, string>} toParams - parameters that are passed in the state change
         * @returns {boolean} - Boolean response of "transitionEvaluator" registered in registerPreCondition or return true if no pre-condition set
         */
        function canTransition(stateTransitioningTo, toParams) {
            var returnedEvaluator = true; // return true if no pre-condition is registered
            // Check if a pre-condition is registered for this transition
            if (self.preConditions[stateTransitioningTo]) {
                returnedEvaluator = self.preConditions[stateTransitioningTo].transitionEvaluator(toParams);
            }
            return returnedEvaluator;
        }

        /**
         * Alternate states if you where unable to transition to the state you desired
         * @param {string} stateTransitioningTo - State you where trying to transition to
         * @returns {string} - otherwise state or empty string
         */
        function otherwise(stateTransitioningTo) {
            // Return the otherwise set in preCondition or return empty string
            return self.preConditions[stateTransitioningTo] && self.preConditions[stateTransitioningTo].otherwise || '';
        }
    }
})();