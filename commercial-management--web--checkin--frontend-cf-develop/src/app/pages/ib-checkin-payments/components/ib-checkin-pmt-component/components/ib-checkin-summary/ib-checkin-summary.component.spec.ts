import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { SummaryProps } from 'commercial-management--digital--web-components-design--library';
import { PriceSubscriptionModel } from '@src/app/core/models/ib-checkin-payments/ib-checkin-payments-component.model';
import {
    IbCheckinSummaryComponent
} from './ib-checkin-summary.component';
import {
    IbCheckinSummaryService
} from './ib-checkin-summary.service';
import { IbCheckInPmtFormService } from '@src/app/pages/ib-checkin-payments/components/ib-checkin-pmt-component/services/ib-checkin-pmt-form.service';
import { NgReactComponent } from '@src/app/react/wrapper/ng-react.component';
import { AJSRootScope } from 'ib-web-commons/utils';

describe('IbCheckinSummaryComponent', () => {
    let component: IbCheckinSummaryComponent;
    let fixture: ComponentFixture<IbCheckinSummaryComponent>;
    let mockCheckInPmtFormService: jasmine.SpyObj<IbCheckInPmtFormService>;
    let mockSummaryService: jasmine.SpyObj<IbCheckinSummaryService>;
    let mockRootScope: { appLang: string };

    beforeEach(async () => {
        mockCheckInPmtFormService = jasmine.createSpyObj('IbCheckInPmtFormService', ['priceUpdateEmitter']);
        mockSummaryService = jasmine.createSpyObj('IbCheckinSummaryService', ['getSummaryInfo', 'updateSummaryInfo']);
        mockCheckInPmtFormService.priceUpdateEmitter = new EventEmitter<PriceSubscriptionModel>();
        mockRootScope = { appLang: 'es' };

        await TestBed.configureTestingModule({
            declarations: [IbCheckinSummaryComponent, NgReactComponent],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: IbCheckInPmtFormService, useValue: mockCheckInPmtFormService },
                { provide: IbCheckinSummaryService, useValue: mockSummaryService },
                { provide: AJSRootScope, useValue: mockRootScope },
                { provide: TranslateService, useValue: jasmine.createSpyObj('TranslateService', ['instant']) }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbCheckinSummaryComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize props on ngOnInit', () => {
        const mockSummaryProps: SummaryProps = {
            isMultiTrip: false, upgradingBid: false,
            ancillaries: [],
            totalPrice: '100'
        };
        mockSummaryService.getSummaryInfo.and.returnValue(mockSummaryProps);

        component.ngOnInit();

        expect(component.props).toEqual({
            ...mockSummaryProps,
            isMultiTrip: false,
            upgradingBid: false
        });
        expect(mockSummaryService.getSummaryInfo).toHaveBeenCalled();
    });

    it('should update props when priceUpdateEmitter emits', () => {
        const mockSummaryProps: SummaryProps = {
            isMultiTrip: false, upgradingBid: false,
            ancillaries: [],
            totalPrice: '100'
        };
        const mockUpdatedProps: SummaryProps = {
            isMultiTrip: false, upgradingBid: false,
            ancillaries: [],
            totalPrice: '200'
        };
        const mockPriceSubscriptionModel: PriceSubscriptionModel = {
            total: 200,
            currency: { code: 'USD', format: {} },
            charges: [],
            discounts: []
        };

        mockSummaryService.getSummaryInfo.and.returnValue(mockSummaryProps);
        mockSummaryService.updateSummaryInfo.and.returnValue(mockUpdatedProps);

        component.ngOnInit();
        mockCheckInPmtFormService.priceUpdateEmitter.emit(mockPriceSubscriptionModel);

        expect(component.props).toEqual(mockUpdatedProps);
        expect(mockSummaryService.updateSummaryInfo).toHaveBeenCalledWith(mockSummaryProps, mockPriceSubscriptionModel);
    });
});
