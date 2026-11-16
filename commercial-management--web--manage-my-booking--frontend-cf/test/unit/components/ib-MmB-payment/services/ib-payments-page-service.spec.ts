import { TestBed } from "@angular/core/testing";
import { MmBAppConstants } from '@src/ib-MmB-constants';
import { PaymentViewType } from "@src/components/ib-MmB-payment/enums/ib-Mmb-payments-enum";
import { NewPaymentAvailableResponse } from "@src/components/ib-MmB-payment/models/ib-Mmb-payments-model";
import { IbMmbPaymentsPageService } from "@src/components/ib-MmB-payment/services/ib-Mmb-payments-page.service";
import { MmbNewPaymentAvailableService } from "@src/components/ib-MmB-payment/services/ib-new-payment-available.service";
import { CommonsSessionStorageService } from "ib-web-commons/utils";
import { StorageServiceMock } from "test/mocks/services/StorageServiceMock";

class MmbNewPaymentAvailableServiceMock {
    public response: NewPaymentAvailableResponse = {available: true};
    public callPromised = ()=> {
        if (this.response) {
            return Promise.resolve(this.response);
        } else {
            return Promise.reject();
        }
    };
}

describe('Test IbMmbPaymentsPageService', () => {
    let service: IbMmbPaymentsPageService
    let fakeSessionStorage = new StorageServiceMock();
    let fakeMmbNewPaymentAvailableService: MmbNewPaymentAvailableServiceMock;
    
    beforeEach(() => {
        fakeMmbNewPaymentAvailableService = new MmbNewPaymentAvailableServiceMock();
        fakeSessionStorage.clear();
        TestBed.configureTestingModule({
            imports: [  ],
            providers: [
                IbMmbPaymentsPageService,
                {provide: CommonsSessionStorageService, useValue: fakeSessionStorage},
                { provide: MmbNewPaymentAvailableService, useValue: fakeMmbNewPaymentAvailableService },
            ]
        });
        service = TestBed.inject( IbMmbPaymentsPageService );
    });

    describe('checkPaymentsViewType', () => {
        interface PaymentViewTypeTestCase {
            description: string;
            setup: {
                storedValue?: PaymentViewType;
                serverResponse?: NewPaymentAvailableResponse | null;
                flowApp: string;
            };
            expected: {
                viewType: PaymentViewType;
                shouldCallServer: boolean;
            };
        }

        const testCases: PaymentViewTypeTestCase[] = [
            {
                description: 'should return stored viewtype when already in storage',
                setup: {
                    storedValue: PaymentViewType.NEW,
                    flowApp: MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES
                },
                expected: {
                    viewType: PaymentViewType.NEW,
                    shouldCallServer: false
                }
            },
            {
                description: 'should return OLD when server returns available false for ancillaries flow',
                setup: {
                    serverResponse: { available: false },
                    flowApp: MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES
                },
                expected: {
                    viewType: PaymentViewType.OLD,
                    shouldCallServer: true
                }
            },
            {
                description: 'should return OLDVC when server returns available false for voluntary change flow',
                setup: {
                    serverResponse: { available: false },
                    flowApp: MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE
                },
                expected: {
                    viewType: PaymentViewType.OLDVC,
                    shouldCallServer: true
                }
            },
            {
                description: 'should return NEW when server returns available true',
                setup: {
                    serverResponse: { available: true },
                    flowApp: MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES
                },
                expected: {
                    viewType: PaymentViewType.NEW,
                    shouldCallServer: true
                }
            },
            {
                description: 'should return OLD when server response fails',
                setup: {
                    serverResponse: null,
                    flowApp: MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES
                },
                expected: {
                    viewType: PaymentViewType.OLD,
                    shouldCallServer: true
                }
            }
        ];

        testCases.forEach(({ description, setup, expected }) => {
            it(description, async () => {
                // Arrange
                if (setup.storedValue !== undefined) {
                    fakeSessionStorage.set(MmBAppConstants.STORAGE_KEYS.PAYMENTS_VIEWTYPE, setup.storedValue);
                }
                
                if (setup.serverResponse !== undefined) {
                    fakeMmbNewPaymentAvailableService.response = setup.serverResponse;
                }

                // Act
                const result = await service.checkPaymentsViewType(setup.flowApp);

                // Assert
                expect(result).toBe(expected.viewType);
                expect(fakeSessionStorage.get(MmBAppConstants.STORAGE_KEYS.PAYMENTS_VIEWTYPE)).toBe(expected.viewType);
            });
        });
    });
})
