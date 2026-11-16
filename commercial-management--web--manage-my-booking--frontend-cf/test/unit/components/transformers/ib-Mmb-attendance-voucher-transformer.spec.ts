describe("AttendanceVoucherTransformer Test", () => {
    let AttendanceVoucherTransformer;

    let fakeFilter = jasmine.createSpy('$filter').and.callFake((filter) => {
        let filterFunc = () => {
            return [];
        };
        switch (filter) {
            case 'translate':
                filterFunc = function (label) {
                    return label;
                } as any;
                break;
            default:
                break;
        }

        return filterFunc;
    });

    let fakeMmBAppConstants = {
        VOUCHER_TYPES: {
            RESTAURANT: 'RESTAURANT',
            ACCOMODATION: 'ACCOMODATION'
        },
        VOUCHER_TYPES_ACTION: {
            DOWNLOAD: 'DOWNLOAD',
            EMAIL: 'EMAIL'
        },
        VOUCHER_CONDITION_TYPES: {
            BOARDING: 'BOARDING'
        }
    }

    let fakeAttendanceVoucherRequest = {
        locator: '1234',
        surname: 'test',
        voucher: [{
            voucherType: fakeMmBAppConstants.VOUCHER_TYPES.RESTAURANT,
            actions: [{
                actionType: fakeMmBAppConstants.VOUCHER_TYPES_ACTION.DOWNLOAD,
            }],
            additionalInfo: [{
                infoType: fakeMmBAppConstants.VOUCHER_CONDITION_TYPES.BOARDING
            }]
        },
        {
            voucherType: fakeMmBAppConstants.VOUCHER_TYPES.ACCOMODATION,
            actions: [{
                actionType: fakeMmBAppConstants.VOUCHER_TYPES_ACTION.EMAIL
            }],
            additionalInfo: [{
                infoType: fakeMmBAppConstants.VOUCHER_CONDITION_TYPES.BOARDING
            }]
        }]
    };



    let fakeResponseAttendanceVoucher = jasmine.objectContaining({
         locator: '1234',
         surname: 'test',
         attendanceVoucher: [
            jasmine.objectContaining({
                typeVoucher: 'RESTAURANT',
                titleVoucher: 'ATTENDANCE_VOUCHER_RESTAURANT_VOUCHER_TYPE',
                linkName: 'ATTENDANCE_VOUCHER_RESTAURANT_LINK',
                linkUrl: 'https://inci.iberia.com/QSP/client/general-info/interesting-points',
                infoTitle: 'ATTENDANCE_VOUCHER_RESTAURANT_VOUCHER_TYPE',
                infoTextPayments: 'ATTENDANCE_VOUCHER_RESTAURANT_PAY_INFO',
                infoTextMMB: 'ATTENDANCE_VOUCHER_RESTAURANT_MMB_INFO',
                actionsVoucher: [jasmine.objectContaining({ typeAction: 'DOWNLOAD', textAction: 'ATTENDANCE_VOUCHER_ACCOMODATION_ACTION_DOWNLOAD' }) ],
                conditionsVoucher: [jasmine.objectContaining({ typeCondition: 'BOARDING', textCondition: 'ATTENDANCE_VOUCHER_RESTAURANT_ADDITIONAL_INFO_1' }) ]
            }),
            jasmine.objectContaining({
                typeVoucher: 'ACCOMODATION',
                titleVoucher: 'ATTENDANCE_VOUCHER_ACCOMODATION_VOUCHER_TYPE',
                linkName: 'ATTENDANCE_VOUCHER_ACCOMODATION_LINK',
                linkUrl: 'https://www2.melia.com/meliapro/es/landing/iberia/vouchers.html',
                infoTitle: 'ATTENDANCE_VOUCHER_ACCOMODATION_VOUCHER_TYPE',
                infoTextPayments: 'ATTENDANCE_VOUCHER_ACCOMODATION_PAY_INFO',
                infoTextMMB: 'ATTENDANCE_VOUCHER_ACCOMODATION_MMB_INFO',
                actionsVoucher: [jasmine.objectContaining({ typeAction: 'EMAIL', textAction: 'ATTENDANCE_VOUCHER_ACCOMODATION_ACTION_EMAIL' }) ],
                conditionsVoucher: [jasmine.objectContaining({ typeCondition: 'BOARDING', textCondition: 'ATTENDANCE_VOUCHER_RESTAURANT_ADDITIONAL_INFO_1' }) ]
            }
        )]
    });


    beforeEach(() => {
        angular.mock.module( "ib-MmB-transformers-module","LocalStorageModule", ($provide) => {
                $provide.value("$filter", fakeFilter);
            }
        );
        inject((_AttendanceVoucherTransformer_) => {
            AttendanceVoucherTransformer = _AttendanceVoucherTransformer_;
        });
    });

    describe("When transformAttendanceVoucher called", () => {
        it("Should called with RESTAURANT", (done) => {
            let result = AttendanceVoucherTransformer.transformAttendanceVoucher(fakeAttendanceVoucherRequest);
            expect(result).toEqual(fakeResponseAttendanceVoucher);
            done();
        });
    });


});
