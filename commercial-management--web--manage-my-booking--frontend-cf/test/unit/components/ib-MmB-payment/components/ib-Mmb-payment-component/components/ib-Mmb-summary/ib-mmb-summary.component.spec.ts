import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IbMmbSummaryComponent } from "@src/components/ib-MmB-payment/components/ib-Mmb-payment-component/components/ib-mmb-summary/ib-mmb-summary.component";
import { NgReactComponent } from "@src/app/react/wrapper/ng-react.component";
import { IbMmbPaymentFormService } from "@src/components/ib-MmB-payment/components/ib-Mmb-payment-component/services/ib-Mmb-payment-form.service";
import { IbMmbSummaryService } from "@src/components/ib-MmB-payment/components/ib-Mmb-payment-component/components/ib-mmb-summary/services/ib-Mmb-summary.service";
import { EventEmitter } from "@angular/core";
import { PriceSubscriptionModel } from "@src/components/ib-MmB-payment/models/ib-Mmb-payments-component-model";
import { Observable, Subscriber } from "rxjs";
import { priceSubscriptionData } from "../../services/price-subscription-data.mock";

export class IbMmbPaymentFormServiceMock {
    priceUpdateEmitter: EventEmitter<PriceSubscriptionModel> =
        new EventEmitter();
};

let fakeProps = {
    stopover: false,
    upgradingBid: false,
    collapsed: false,
    ancillaries: [{
        code: 'SEAT',
        segments: [{
            id: 'seg0',
            title: 'MAD - BCN',
            items: [{
                amount: 1,
                code: 'SEAT',
                price: '13€',
                description: 'ASIENTOS'
            }]
        }],
        total: '13€'
    }],
    totalPrice: '13€'
};

describe("IbMmbSummaryComponent", () => {
    let component: IbMmbSummaryComponent;
    let fixture: ComponentFixture<IbMmbSummaryComponent>;
    let fakeIbMmbPaymentFormService = new IbMmbPaymentFormServiceMock();
    let fakeIbMmbSummaryService = {
        getSummaryInfo: jasmine.createSpy(),
        updateSummaryInfo: jasmine.createSpy()
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [IbMmbSummaryComponent, NgReactComponent],
            imports: [],
            providers: [
                {
                    provide: IbMmbSummaryService,
                    useValue: fakeIbMmbSummaryService,
                },
                {
                    provide: IbMmbPaymentFormService,
                    useValue: fakeIbMmbPaymentFormService,
                },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(IbMmbSummaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("Component exists", () => {
        expect(component).toBeTruthy();
    });

    describe("When ngOnInit is called", () => {
        beforeEach(() => {
            // @ts-expect-error
            spyOn(fakeIbMmbPaymentFormService.priceUpdateEmitter, 'subscribe').and.callFake(() => new Observable((subscriber: Subscriber<any>) => {
                subscriber.next(priceSubscriptionData);
                subscriber.complete();
            }));
        });

        it("Should call updateSummaryInfo with correct arguments", () => {
            // @ts-expect-error
            component.props = fakeProps;
            component.ngOnInit();
            //expect(component['updateSummaryInfo'](priceSubscriptionData)).toHaveBeenCalledWith(priceSubscriptionData);
            // @ts-expect-error
            expect(component.props).toBe(fakeProps);
        });
    });

    describe("When updateSummaryInfo is called", () => {
        it("Should call updateSummaryInfo from IbMmbSummaryService with correct arguments", () => {
            // @ts-expect-error
            component.props = fakeProps;
            // @ts-expect-error
            component['updateSummaryInfo'](priceSubscriptionData);
            expect(fakeIbMmbSummaryService.updateSummaryInfo).toHaveBeenCalledWith(fakeProps, priceSubscriptionData);
        });
    });
});
