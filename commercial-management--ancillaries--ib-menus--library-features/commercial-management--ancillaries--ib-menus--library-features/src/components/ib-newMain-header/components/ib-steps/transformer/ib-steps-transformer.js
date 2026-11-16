(function () {
    'use strict';

    angular
        .module('ib-steps-module')
        .factory('StepsTransformer', StepsTransformer);

    StepsTransformer.$inject = ['StepsConstants'];

    function StepsTransformer (StepsConstants) {


        const self = {
            initSteps: initSteps
        };

        return self;


        function initSteps (headerModel) {
            let model = undefined;

            if (headerModel.hasSteps) {
                model = {
                    steps: headerModel.steps ? StepsConstants[headerModel.steps] : StepsConstants.DEFAULT_STEPS,
                    position: headerModel.position ? headerModel.position : StepsConstants.DEFAULT_STEPS[0].position
                };

            }

            return model;
        };
    }
})();