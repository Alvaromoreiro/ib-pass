import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbCLinkPipe } from 'ib-web-commons/pipes';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PriceSubscriptionModel } from '@src/app/core/models/ib-checkin-payments/ib-checkin-payments-component.model';
import {
    IbCheckinVoucherComponent
} from './ib-checkin-voucher.component';
import {
    IbCheckinVoucherService
} from '@src/app/shared/http-services/ass-fass/ib-checkin-voucher.service';
import { IbCheckInPmtFormService } from '@src/app/pages/ib-checkin-payments/components/ib-checkin-pmt-component/services/ib-checkin-pmt-form.service';
import { NgReactComponent } from '@src/app/react/wrapper/ng-react.component';
import { IbCModalService } from 'ib-web-commons/ib-modal';


describe('IbCheckinVoucherComponent', () => {
    let component: IbCheckinVoucherComponent;
    let fixture: ComponentFixture<IbCheckinVoucherComponent>;
    let mockPmtFormService: jasmine.SpyObj<IbCheckInPmtFormService>;
    let mockVoucherService: jasmine.SpyObj<IbCheckinVoucherService>;
    let mockSessionStorageService: jasmine.SpyObj<CommonsSessionStorageService>;
    let mockLinkPipe: jasmine.SpyObj<IbCLinkPipe>;
    let mockIbCModalService: jasmine.SpyObj<IbCModalService>;
    let mockRootScope: { appLang: string };

    beforeEach(async () => {
        mockPmtFormService = jasmine.createSpyObj('IbCheckInPmtFormService', ['priceUpdateEmitter', 'getPriceFormatted']);
        mockVoucherService = jasmine.createSpyObj('IbCheckinVoucherService', ['checkVoucherCode', 'deleteVoucherCode']);
        mockSessionStorageService = jasmine.createSpyObj('CommonsSessionStorageService', ['get', 'set', 'remove']);
        mockLinkPipe = jasmine.createSpyObj('IbCLinkPipe', ['transform']);
        mockIbCModalService = jasmine.createSpyObj('IbCModalService', ['showGenericComponentModal']);

        mockPmtFormService.priceUpdateEmitter = new EventEmitter<PriceSubscriptionModel>();
        mockLinkPipe.transform.and.returnValue('http://terms-conditions-link');
        mockRootScope = { appLang: 'es' };

        await TestBed.configureTestingModule({
            declarations: [IbCheckinVoucherComponent, NgReactComponent],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: IbCheckInPmtFormService, useValue: mockPmtFormService },
                { provide: IbCheckinVoucherService, useValue: mockVoucherService },
                { provide: CommonsSessionStorageService, useValue: mockSessionStorageService },
                { provide: IbCLinkPipe, useValue: mockLinkPipe },
                { provide: IbCModalService, useValue: mockIbCModalService },
                { provide: AJSRootScope, useValue: mockRootScope },
                { provide: TranslateService, useValue: jasmine.createSpyObj('TranslateService', ['instant']) }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbCheckinVoucherComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize props on creation', () => {
        expect(component.props).toEqual({
            handleClick: jasmine.any(Function),
            urlLink: 'http://terms-conditions-link',
            id: 'voucher-module'
        });
    });

    it('should subscribe to priceUpdateEmitter on ngOnInit', () => {
        spyOn(component, 'handleVoucherUpdate');
        component.ngOnInit();
        const mockPriceSubscriptionModel: PriceSubscriptionModel = {
            total: 0,
            currency: { code: 'USD', format: {} },
            charges: [],
            discounts: []
        };
        mockPmtFormService.priceUpdateEmitter.emit(mockPriceSubscriptionModel);
        expect(component.handleVoucherUpdate).toHaveBeenCalledWith(mockPriceSubscriptionModel);
    });

    it('should update voucher info on handleVoucherUpdate with no discounts', () => {
        component.ngOnInit();
        component.handleVoucherUpdate({ discounts: [] } as PriceSubscriptionModel);
        expect(mockSessionStorageService.remove).toHaveBeenCalledWith('checkinVoucherPmtForm');
    });

    it('should update voucher info on handleVoucherUpdate with discounts', () => {
        const mockVoucherDiscount = { voucherId: '123' };
        mockSessionStorageService.get.and.returnValue(mockVoucherDiscount);
        component.ngOnInit();
        component.handleVoucherUpdate({ discounts: [{}] } as PriceSubscriptionModel);
        expect(mockSessionStorageService.get).toHaveBeenCalledWith('checkinVoucherPmtForm');
        expect(component.voucherDiscount).toEqual(mockVoucherDiscount);
    });

    it('should handle voucher click to add voucher', async () => {
        const mockResponse = {
            data: {
                voucherDiscount: {
                    amount: 50,
                    voucherId: '123',
                    remainingAmount: 50
                }
            }
        };
        mockVoucherService.checkVoucherCode.and.returnValue(Promise.resolve(mockResponse));
        mockPmtFormService.getPriceFormatted.and.returnValue('$50');

        const result = await component.handleVoucherClick('CODE123', false);
        expect(result).toEqual({
            status: true,
            discount: '$50',
            remainingAmount: '$50',
            isRemainingAmountZero: null
        });
    });

    it('should handle voucher click to remove voucher', async () => {
        const mockResponse = { data: {} };
        component.voucherDiscount = { voucherId: '123' };
        mockVoucherService.deleteVoucherCode.and.returnValue(Promise.resolve(mockResponse));

        const result = await component.handleVoucherClick('CODE123', true);
        expect(mockVoucherService.deleteVoucherCode).toHaveBeenCalledWith('123', component.flowId);
        expect(mockSessionStorageService.remove).toHaveBeenCalledWith('checkinVoucherPmtForm');
        expect(result).toBeNull();
    });



      it('should call showGenericComponentModal when addVoucher throws an error', async () => {
        const mockResponse = {
            data: {
                voucherDiscount: {
                    amount: 50,
                    voucherId: '123',
                    remainingAmount: 50
                }
            },
            code: 202
        };
        mockVoucherService.checkVoucherCode.and.returnValue(Promise.resolve(mockResponse));
        try {
            await component.handleVoucherClick('CODE123', false);
        } catch (e) {
        }
        expect(mockIbCModalService.showGenericComponentModal).toHaveBeenCalled();
      });


    it('should call showGenericComponentModal when addVoucher throws an error', async () => {
        mockVoucherService.checkVoucherCode.and.returnValue(
            new Promise( (resolve, reject)=> {
                reject('prueba')
            })
        )
        await component.handleVoucherClick('CODE123', false);

        expect(mockIbCModalService.showGenericComponentModal).toHaveBeenCalled();
      });
});
