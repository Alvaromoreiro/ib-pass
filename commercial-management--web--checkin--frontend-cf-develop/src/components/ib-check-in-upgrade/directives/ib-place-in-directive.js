(function () {
	'use strict';
	angular
		.module('ib-check-in-upgrade-module')
		.directive('placeIn', placeIn);

	placeIn.$inject = ['$window'];
	function placeIn($window) {
		return {
			restrict: 'A',
			link: link
		};

		function link(scope, element) {

			var positionType = angular.element(element).attr('place-in');
			var breakpoint = angular.element(element).data('breakpoint');

			function calculatePosition() {
				switch (positionType) {
					case 'w-center':
						calculatePositionWcenter();
						break;
				}
			}
			function calculatePositionWcenter() {
				if ($window.innerWidth < breakpoint) {
					var reference = angular.element(element).parents('[data-place-in-reference]');
					var refPosition = angular.element(reference).offset().left;
					var refWidth = angular.element(reference).outerWidth() / 2;
					var elemWidth = angular.element(element).outerWidth() / 2;
					var positionFinal = refPosition + refWidth - elemWidth
					element.offset({ left: positionFinal })
				} else {
					element.css({ 'left': '' });
				}
			}

			// Initial Launch
			calculatePosition();

			// Resize
			angular.element($window).bind('resize', function () {
				calculatePosition();
			});
		}
	}
})();
