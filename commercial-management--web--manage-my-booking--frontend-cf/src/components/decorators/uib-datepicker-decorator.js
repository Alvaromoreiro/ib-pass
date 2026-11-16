/* istanbul ignore next */
export function uibDatepickerDecorator($delegate) {
    'use strict';
    var directive = $delegate[0];
    var directiveCompile = directive.compile;
    directive.compile = function () {
        var link = directiveCompile.apply(this, arguments);
        return function (scope) {
            var originalMove, calendarRows;
            link.apply(this, arguments);
            originalMove = scope.move;
            scope.move = function (direction) {
                originalMove.apply(this, arguments);
                calendarRows = this.rows;
                scope.$emit('datepicker.monthChanged', calendarRows);
            };
        };
    };
    return $delegate;
};