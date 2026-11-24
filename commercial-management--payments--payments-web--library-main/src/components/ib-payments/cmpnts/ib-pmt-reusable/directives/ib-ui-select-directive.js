(function () {
    'use strict';

    angular.module('ib-reusable-module').directive('customUiSelect', () => {
        return {
            require: 'uiSelect',
            link: function (scope, element, attrs, $select) {
                //update input type
                const $el= element[0];
                const $input = $el.querySelector('input[type="search"]');
                if(attrs.$attr && attrs.$attr.inputType && $input) {
                    $input.setAttribute('type', $el.getAttribute('data-input-type'));
                }
                //close event
                scope.$on('closeAllUiSelects', ()=>{
                    if($select.open) {
                        $select.open = false;
                    }
                });
            }
        };
    });
})();