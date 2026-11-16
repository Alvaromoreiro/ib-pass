describe('ibCollapseController test', function () {

    var $controller, $rootScope, $timeout, $window, $scope, controller;
    var fakeprevent;
    var fakeEvent;

    fakeprevent = null;
    fakeEvent = {
        preventDefault: function () { }
    }

    beforeEach(function () {
        angular.mock.module('ib-collapse', function () { });
        inject(function (_$controller_, _$rootScope_, _$timeout_, _$window_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $timeout = _$timeout_;
            $window = _$window_
        });
    });

    describe('when clickCollapse() function is called', function () {

        it('should exchange to true variable isCollapsed', function () {
            $scope = $rootScope.$new();
            controller = $controller('ibCollapseController', { $scope: $scope });
            expect(controller.isCollapsed).toEqual(false);
            controller.clickCollapse(fakeEvent, fakeprevent);
            expect(controller.isCollapsed).toEqual(true);
        });

        it('should exchange to true variable isCollapsed', function () {
            fakeprevent = true;
            $scope = $rootScope.$new();
            controller = $controller('ibCollapseController', { $scope: $scope });
            expect(controller.isCollapsed).toEqual(false);
            controller.clickCollapse(fakeEvent, fakeprevent);
            expect(controller.isCollapsed).toEqual(true);
            fakeprevent = false;
        });
    });


    describe('when clickDetails() function is called', function () {

        it('should exchange to true variable showDetails', function () {
            $scope = $rootScope.$new();
            controller = $controller('ibCollapseController', { $scope: $scope });
            expect(controller.showDetails).toEqual(false);
            controller.clickDetails(fakeEvent, fakeprevent);
            expect(controller.showDetails).toEqual(true);
        });

        it('should exchange to true variable showDetails', function () {
            fakeprevent = true;
            $scope = $rootScope.$new();
            controller = $controller('ibCollapseController', { $scope: $scope });
            expect(controller.showDetails).toEqual(false);
            controller.clickDetails(fakeEvent, fakeprevent);
            expect(controller.showDetails).toEqual(true);
        });
    });

    describe('when initCollapse() function is called', function () {

        it('should set closeText and text with param 1 and openedText with param 2', function () {
            $scope = $rootScope.$new();
            controller = $controller('ibCollapseController', { $scope: $scope });
            expect(controller.closedText).toEqual('');
            expect(controller.text).toEqual('');
            expect(controller.openedText).toEqual('');
            controller.initCollapse('test1', 'test2');
            expect(controller.closedText).toEqual('test1');
            expect(controller.text).toEqual('test1');
            expect(controller.openedText).toEqual('test2');
        });

    });

    describe('when externalChangeText() function is called', function () {

        it('should set closeText and text with param if isCollapsed is false', function () {
            $scope = $rootScope.$new();
            controller = $controller('ibCollapseController', { $scope: $scope });
            controller.isCollapsed = false
            expect(controller.closedText).toEqual('');
            expect(controller.text).toEqual('');
            controller.externalChangeText('test1');
            expect(controller.closedText).toEqual('test1');
            expect(controller.text).toEqual('test1');

        });

        it('should set closeText and text with param if isCollapsed is false', function () {
            $scope = $rootScope.$new();
            controller = $controller('ibCollapseController', { $scope: $scope });
            controller.isCollapsed = true
            controller.text = ''
            expect(controller.closedText).toEqual('');
            expect(controller.text).toEqual('');
            controller.externalChangeText('test1');
            expect(controller.closedText).toEqual('test1');
            expect(controller.text).toEqual('');

        });

    });

    describe('when toggle() function is called', function () {

        it('should set isCollapsed == true and text == openedText when init == false', function () {
            $scope = $rootScope.$new();
            controller = $controller('ibCollapseController', { $scope: $scope });
            controller.init = false;
            controller.isCollapsed = false;
            controller.openedText = 'test1'
            controller.toggle();
            expect(controller.isCollapsed).toEqual(true);
            expect(controller.text).toEqual('test1');

        });

        it('should set isCollapsed == false and text == closedText when init == false', function () {
            $scope = $rootScope.$new();
            controller = $controller('ibCollapseController', { $scope: $scope });
            controller.init = false;
            controller.isCollapsed = true;
            controller.closedText = 'test1'
            controller.toggle();
            expect(controller.isCollapsed).toEqual(false);
            expect(controller.text).toEqual('test1');

        });

        it('should set isCollapsed == true and text == openedText and init = false when init == true', function () {
            $scope = $rootScope.$new();
            controller = $controller('ibCollapseController', { $scope: $scope });
            controller.isCollapsed = false;
            controller.openedText = 'test1'
            controller.toggle();
            $timeout.flush(400);
            expect(controller.isCollapsed).toEqual(true);
            expect(controller.text).toEqual('test1');

        });

        it('should set isCollapsed == false and text == closedText and init = false when init == true', function () {
            $scope = $rootScope.$new();
            controller = $controller('ibCollapseController', { $scope: $scope });
            controller.isCollapsed = true;
            controller.closedText = 'test1'
            controller.toggle();
            $timeout.flush(400);
            expect(controller.isCollapsed).toEqual(false);
            expect(controller.text).toEqual('test1');

        });
    });

    describe('when closeContent() function is called', function () {

        it('should emit "closeContent" when init == true', function () {
            $scope = $rootScope.$new();
            controller = $controller('ibCollapseController', { $scope: $scope });
            controller.init = true;
            spyOn($scope, '$emit');
            controller.closeContent();
            expect($scope.$emit).toHaveBeenCalledWith('closeContent');

        });

    });

    describe('when toggleModal() function is called', function () {

        it('should remove class modal-open to body', function () {
            $scope = $rootScope.$new();
            controller = $controller('ibCollapseController', { $scope: $scope });
            controller.isCollapsed = true;
            $window.innerWidth = 800;
            angular.element('body').removeClass('modal-open');
            $rootScope.$digest()
            expect(angular.element('body').hasClass('modal-open')).toEqual(false);

        });

        it('should add class modal-open to body', function () {
            $scope = $rootScope.$new();
            controller = $controller('ibCollapseController', { $scope: $scope });
            controller.isCollapsed = false;
            $window.innerWidth = 800;
            angular.element('body').addClass('modal-open');
            $rootScope.$digest()
            expect(angular.element('body').hasClass('modal-open')).toEqual(true);

        });

    });
});
