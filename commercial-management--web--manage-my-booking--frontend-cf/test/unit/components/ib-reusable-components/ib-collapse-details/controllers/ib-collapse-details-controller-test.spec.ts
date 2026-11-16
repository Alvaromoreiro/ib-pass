describe('CollapseDetailsController test', function () {

    var $controller, $rootScope;

    beforeEach(function () {
        angular.mock.module('ib-collapse-details-module', function() {});
        inject(function (_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
        });
    });

    describe('when initCollapse() function is called', function () {

        it('should set closedtext and text with param 1 and openedText with param 2' , function() {
            var $scope = $rootScope.$new();
            var controller = $controller('CollapseDetailsController', { $scope: $scope });
            controller.initCollapse('test1','test2');
            expect(controller.closedText).toEqual('test1');
            expect(controller.text).toEqual('test1');
            expect(controller.openedText).toEqual('test2');
        });

    });

    describe('when externalChangeText() function is called', function () {

        it('should set text and closedText with param 1 if isCollapsed == false' , function() {
            var $scope = $rootScope.$new();
            var controller = $controller('CollapseDetailsController', { $scope: $scope });
            controller.isCollapsed = false;
            controller.externalChangeText('test1');
            expect(controller.closedText).toEqual('test1');
            expect(controller.text).toEqual('test1');
        });

        it('should set text to controller text variable and closedText with value of param 1 if isCollapsed == true' , function() {
            var $scope = $rootScope.$new();
            var controller = $controller('CollapseDetailsController', { $scope: $scope });
            controller.isCollapsed = true;
            controller.text = '';
            controller.externalChangeText('test1');
            expect(controller.closedText).toEqual('test1');
            expect(controller.text).toEqual('');
        });

    });

    describe('when toggle() function is called', function () {

        it('should set text to openedText value if isCollapsed == false' , function() {
            var $scope = $rootScope.$new();
            var controller = $controller('CollapseDetailsController', { $scope: $scope });
            controller.isCollapsed = false;
            controller.openedText = 'test1'
            controller.toggle();
            expect(controller.text).toEqual('test1');
            expect(controller.isCollapsed).toEqual(true);
        });

        it('should set text to closedText value if isCollapsed == true' , function() {
            var $scope = $rootScope.$new();
            var controller = $controller('CollapseDetailsController', { $scope: $scope });
            controller.isCollapsed = true;
            controller.closedText = 'test1'
            controller.toggle();
            expect(controller.text).toEqual('test1');
            expect(controller.isCollapsed).toEqual(false);
        });


    });
});
