describe('BoxModuleLinkController test', () =>  {
    let controller, $scope, $rootScope;

    let fakeBookingDashboradConstant = {
        BOX_COL_SIZES: {
            FULL: 1920,
        },
        BOX_LINK_SIZES: {
            FULL: 1200,
        },
        TABS: {
            documents: 'documents'
        }
    };

    let fakeMmBAppConstants = {
        templatesRoute: 'web-manage-my-booking/templates/'
    }

    beforeEach(() =>  {
        angular.mock.module('ib-box-module-link-module', ($provide) => {
            $provide.value('BookingDashboardConstants', fakeBookingDashboradConstant);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);

        });
        inject((_$rootScope_, $componentController, ) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $componentController('ibBoxModuleLink', {
                $scope: $scope,
                BookingDashboardConstants:fakeBookingDashboradConstant,
            });
        });
    });

    describe('templateUrl definition', () => {
        it('templateUrl should be defined', inject(($compile, $rootScope, $httpBackend) => {
            $httpBackend.expectGET('web-manage-my-booking/templates/ib-box-module-link-view.html').respond(200, '<div id="test-template"></div>');
            const scope = $rootScope.$new();
            const element = $compile('<ib-box-module-link></ib-box-module-link>')(scope);
            scope.$digest();
            $httpBackend.flush();
            expect(element.html()).toContain('id="test-template"');
        }));
    });

    describe('init component', () =>  {
        it('its create correctly', () =>  {
            expect(controller.$onInit).toBeDefined();
        });
    });
    describe('Execute activate', () => {
        it('it should initialize model', (done) => {
            //Expect not added due to called function has all inside code commented
            controller.$onInit();
            $rootScope.$digest();
            done();
        });
    });
    describe ('redirectClick', () => {
        it('Should emit redirectClick', (done) =>  {
            spyOn($rootScope,'$emit');
            controller.linkId = 'test'
            controller.redirectClick();
            expect($rootScope.$emit).toHaveBeenCalled();
            done();
        });
    });
    describe ('redirectToDigitalBoarding call', () => {
        it('Should call redirection service', (done) => {
            spyOn($scope,'$emit');
            controller.redirectToDigitalBoarding();
            expect($scope.$emit).toHaveBeenCalled();
            done();
        });
    });
    describe ('updateBoxModuleLinkFront call', () => {
        it ('update sizes variables', (done) => {
            $rootScope.$emit('updatePhoneFrontEvent');
            $rootScope.$digest();
            expect(controller.colSize).toEqual(fakeBookingDashboradConstant.BOX_COL_SIZES.FULL);
            expect(controller.boxSize).toEqual(fakeBookingDashboradConstant.BOX_LINK_SIZES.FULL);
            done();
        });
    });
    describe ('redirectTo call', () => {
        it('If isDigitalBoarding is false should call redirectClick() function', (done) => {
            spyOn(controller,'redirectClick');
            controller.isDigitalBoarding = false;
            controller.redirectTo();
            expect(controller.redirectClick).toHaveBeenCalled();
            done();
        });
        it('If isDigitalBoarding is true should call redirectToDigitalBoarding() function', (done) => {
            spyOn(controller,'redirectToDigitalBoarding');
            controller.isDigitalBoarding = true;
            controller.redirectTo();
            expect(controller.redirectToDigitalBoarding).toHaveBeenCalled();
            done();
        });
    });
});
