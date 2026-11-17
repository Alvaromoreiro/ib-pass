describe("IssueDateController test", function () {
    const fakeIbDatesConstants = {
        DAYS_ARRAY: [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
            "29",
            "30",
            "31",
        ],
        MONTH_ARRAY: [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
        ],
        DEFAULT_TO_YEARS: 100,
        DEFAULT_FROM_YEARS: 0,
        DEFAULT_OPTIONS: {
            haveBirthdate: false,
        },
    };

    let controller, $rootScope, $scope, date, expectmonthsarray, expectmonth;

    const bindings = {
        showDay: true,
        maximumYears: "2100",
        day: "01",
        month: "01",
        year: "2007",
        dateRequired: true,
        index: "1",
        containerForm: "=",
        isRequired: true,
        nameId: "id",
        needDisabled: false,
    };

    beforeEach(function () {
        angular.mock.module("ib-issue-date-module", function ($provide) {
            $provide.value("CheckinDatesConstants", fakeIbDatesConstants);
        });
        inject(function (_$controller_, _$rootScope_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = _$controller_(
                "IssueDateController",
                {
                    $scope: $scope,
                },
                bindings
            );
        });
    });

    describe("When activate() is called", function () {
        it("IssueDateController should be defined", function () {
            expect(controller).toBeDefined();
        });
        it("", function () {
            $rootScope.$broadcast("refreshModelEvent", {});
        });
    });

    describe("when updateMonthIssue() function is called", function () {
        it("should update year value", function () {
            date = new Date();
            controller.month = date.getMonth() - 1;
            controller.year = date.getFullYear() % 100;
            controller.day = date.getDay();
            controller.showDay = true;
            controller.updateMonthIssue();
            expect(controller.year).toEqual(date.getFullYear() % 100);
        });

        it("should not update year value", function () {
            date = new Date();
            controller.month = date.getMonth() + 1;
            controller.year = date.getFullYear() % 100;
            controller.day = date.getDay();
            controller.showDay = false;
            controller.updateMonthIssue();
            expect(controller.year).toEqual(date.getFullYear() % 100);
        });
    });

    describe("when updateYearIssue() function is called", function () {
        it("should update month value", function () {
            date = new Date();
            expectmonthsarray = fakeIbDatesConstants.MONTH_ARRAY.slice();
            expectmonth = date.getMonth();
            controller.month = date.getMonth();
            controller.year = date.getFullYear() % 100;
            controller.updateYearIssue();
            expect(controller.month).toEqual(expectmonth);
        });

        it("should not update month value", function () {
            date = new Date();
            controller.month = date.getMonth() + 1;
            controller.year = date.getFullYear() % 100;
            controller.updateYearIssue();
            expect(controller.month).toEqual(date.getMonth() + 1);
        });
    });
});
