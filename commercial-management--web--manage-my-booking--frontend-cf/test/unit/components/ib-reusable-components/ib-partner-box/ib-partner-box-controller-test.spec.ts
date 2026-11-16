describe('PartnerBoxModuleController test', () =>  {
    var controller, $scope, $controller, $rootScope, $filter, $window;

    let $filterFake = jasmine.createSpy('$filter').and.callFake(function (filter) {
        let filterFunc: any = function () {
            return [];
        };
        filterFunc = function () {
            return '';
        };
        return filterFunc;
    });

    var fakeWindow = {
        'open': () => { },
        'env': {
            'urlEnvironment' : 'www.pree.iberia.es/'
        }
    };

    beforeEach(() =>  {
        angular.mock.module('ib-partner-box-module', function($provide) {
            $provide.value('$filter', $filterFake);
            $provide.value('$window', fakeWindow);
        });
        inject(function(_$controller_, _$rootScope_, _$filter_) {
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            $scope = $rootScope.$new();
            $filter = _$filter_;
            $window = fakeWindow;
            controller = $controller('PartnerBoxModuleController', {
                $scope: $scope
            });
        });
    });

    describe('when activate is called', () =>  {
        it('should contain controller', () =>  {
            controller.$onInit();
            expect(controller).toBeDefined();
        });
    });

    describe('when redirect is called', () =>  {
        beforeEach(() => {
            $rootScope.appMarket= 'ES';
            $rootScope.appLang = 'es';
        });
        it('should redirect accord language and market', () =>  {
            spyOn($window, 'open');
            controller.redirect();
            expect($window.open).toHaveBeenCalledWith('www.pree.iberia.es/es/es/stopover-in-madrid', '_blank');
        });
    });

    describe('when redirect is called', () =>  {
        beforeEach(() => {
            $rootScope.appMarket= 'ES';
            $rootScope.appLang = 'ca';
        });
        it('should redirect accord language and market', () =>  {
            spyOn($window, 'open');
            controller.redirect();
            expect($window.open).toHaveBeenCalledWith('www.pree.iberia.es/es/ca/stopover-in-madrid', '_blank');
        });
    });

    describe('when redirect is called', () =>  {
        beforeEach(() => {
            $rootScope.appMarket= 'ES';
            $rootScope.appLang = 'it';
        });
        it('should redirect accord language and market', () =>  {
            spyOn($window, 'open');
            controller.redirect();
            expect($window.open).toHaveBeenCalledWith('www.pree.iberia.es/es/it/stopover-in-madrid', '_blank');
        });
    });

    describe('when redirect is called', () =>  {
        beforeEach(() => {
            $rootScope.appMarket= 'ES';
            $rootScope.appLang = 'nl';
        });
        it('should redirect accord language and market', () =>  {
            spyOn($window, 'open');
            controller.redirect();
            expect($window.open).toHaveBeenCalledWith('www.pree.iberia.es/es/nl/stopover-in-madrid', '_blank');
        });
    });

});
