(function () {
    'use strict';

    // Usage: <"></>
    // 
    // Creates: A  struture with the info of the trip. 
    // The binding 'segmentModel' is a one-way binding with all the information to show in the view.
    // This information is formed by the departure and arrival info, seatList, cabinClass,diferent segment options, the company
    // logo and number of the trip etc.
    //
    // segmentModel: Model of data for load in component
    // showFooter: If are true show footer of component with information
    // showBody :If are true show body of component with information
    // showPreHeader: Show preheader with title IBCOAC_MMB_SEGMENT_DETAILS_AIR
    // showState: If are true show statusMessage of segment
    // showAlert: If are true then show alert message when segments change has succes
    // showDetailsFlight: Add to header "Airport" & "Terminal" text
    
    /* istanbul ignore next */
    angular.module('ib-MmB-segment-details-module')
        .component('ibMmbSegmentDetails', {
            controller: 'MmBSegmentDetailsController',
            controllerAs: 'segmentCtrl',
            bindings: {
                segmentModel: '<',
                showFooter: '<?',
                showBody: '<?',
                showPreHeader: '<?',
                showState: '<?',
                showAlert: '<',
                showDetailsFlight: '<'
            },
            templateUrl: ['$element', '$attrs', 'MmBAppConstants', function ($element, $attrs, MmBAppConstants) {
                return MmBAppConstants.templatesRoute + ($attrs.templateUrl || 'ib-MmB-segment-details-section-view.html');
            }]
        });
})(); 