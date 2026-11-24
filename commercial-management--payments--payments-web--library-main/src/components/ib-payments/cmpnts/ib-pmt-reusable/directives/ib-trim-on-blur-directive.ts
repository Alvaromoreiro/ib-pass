import angular from 'angular';

const EDGE_TRIM_CHARS = '\\s\\u2800\\u3164\\u115F\\u1160\\uFFA0\\u200B\\u200C\\u200D\\uFEFF\\u2060\\u00AD\\u180E';
const EDGE_TRIM_PATTERN = new RegExp(`^[${EDGE_TRIM_CHARS}]+|[${EDGE_TRIM_CHARS}]+$`, 'g');

function trimEdges (value: string): string {
    return value.replace(EDGE_TRIM_PATTERN, '');
}

function ibTrimOnBlur (): ng.IDirective {
    return {
        restrict: 'A',
        require: 'ngModel',
        priority: -100,
        link (
            scope: ng.IScope,
            element: ng.IAugmentedJQuery,
            _attrs: angular.IAttributes,
            ngModel: ng.INgModelController
        ) {
            let isFocused = false;

            function trimValue (): void {
                const value = element.val();
                if (typeof value !== 'string') return;
                const trimmed = trimEdges(value);
                if (trimmed === value) return;
                scope.$evalAsync(() => {
                    ngModel.$setViewValue(trimmed);
                    ngModel.$render();
                });
            }

            function focusHandler (): void {
                isFocused = true;
            }

            function blurHandler (): void {
                isFocused = false;
                trimValue();
            }

            function changeHandler (): void {
                trimValue();
            }

            function inputHandler (): void {
                if (isFocused) return;
                trimValue();
            }

            element.on('focus', focusHandler);
            element.on('blur', blurHandler);
            element.on('change', changeHandler);
            element.on('input', inputHandler);
            scope.$on('$destroy', () => {
                element.off('focus', focusHandler);
                element.off('blur', blurHandler);
                element.off('change', changeHandler);
                element.off('input', inputHandler);
            });
        }
    };
}

angular.module('ib-reusable-module')
    .directive('ibTrimOnBlur', ibTrimOnBlur);
