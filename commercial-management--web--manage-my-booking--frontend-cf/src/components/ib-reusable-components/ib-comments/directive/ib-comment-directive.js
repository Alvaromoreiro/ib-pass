(function () {
    'use strict';

    angular
        .module('ib-comment-module')
        .directive('ibComment', ibComment);

    ibComment.$inject = ['$interpolate'];
    function ibComment($interpolate) {
        // Usage: <!-- directive: ib-comment "something something {{expression}}" -->
        //
        // Creates: an interpolate comment parsing angular expression on comments
        //
        var directive = {
            link: link,
            restrict: 'M',
            scope: true
        };
        return directive;

        function link($scope, $element, $attrs) {
            var originalComment = $attrs.ibComment;
            $scope.$on('updateDatalayer', function () {
                var comment = $interpolate(originalComment)($scope);
                $element.replaceWith('<!-- ' + comment + '-->');
            });
        }
    }

})();