import angular from "angular";

describe("ib-MmB-manage-assistance-voucher-info component", () => {
    let $componentController: ng.IComponentControllerService;
    let $rootScope: ng.IRootScopeService;
    let $scope: ng.IScope;
    let commonsModalServiceMock: any;
    let controller: any;
    let fakeMmBAppConstants = {
        templatesRoute: 'web-manage-my-booking/templates/',
    };

    beforeEach(() => {
        commonsModalServiceMock = {
            showGenericDynamicModal: jasmine.createSpy("showGenericDynamicModal")
        };

        angular.mock.module("ib-MmB-manage-assistance-voucher-info-module", ($provide: ng.auto.IProvideService) => {
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value("CommonsModalService", commonsModalServiceMock);
        });
    });

    beforeEach(inject([
        "$componentController",
        "$rootScope",
        ($componentController_: ng.IComponentControllerService, $rootScope_: ng.IRootScopeService) => {
            $componentController = $componentController_;
            $rootScope = $rootScope_;
            $scope = $rootScope.$new();
            controller = $componentController("ibMmbManageAssistanceVoucherInfo", { $scope, CommonsModalService: commonsModalServiceMock }, { attendanceVouchers: [] });
        }
    ]));

    describe('templateUrl definition', () => {
        it('templateUrl should be defined', inject(($compile, $rootScope, $httpBackend) => {
            $httpBackend.expectGET('web-manage-my-booking/templates/ib-MmB-manage-assistance-voucher-info.view.html').respond(200, '<div id="test-template"></div>');
            const scope = $rootScope.$new();
            const element = $compile('<ib-MmB-manage-assistance-voucher-info></ib-MmB-manage-assistance-voucher-info>')(scope);
            scope.$digest();
            $httpBackend.flush();
            expect(element.html()).toContain('id="test-template"');
        }));
    });

    describe('controller definition', () => {
        it("init component defined", () => {
            expect(controller).toBeDefined();
            expect(controller.attendanceVouchers).toEqual([]);
        });
    });

    describe('sendAttendanceVoucherByEmail Event', () => {
        it("Should call showGenericDynamicModalto when emit sendAttendanceVoucherByEmail event", () => {
            spyOn(controller, "openModal").and.callThrough();
            controller.$onInit();
            $scope.$emit("sendAttendanceVoucherByEmail");
            $scope.$digest();
            expect(controller.openModal).toHaveBeenCalled();
            expect(commonsModalServiceMock.showGenericDynamicModal).toHaveBeenCalledWith(
                false,
                "ib-modal-assistance-voucher-email-view.html",
                {},
                "ibModalAssistanceVoucherEmailController",
                "ib-modals ib-modals--right fade"
            );
        });
    });
});
