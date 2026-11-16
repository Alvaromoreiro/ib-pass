import { TestBed } from '@angular/core/testing';
import { IbCheckPartnersDiscountsService } from '@shared/services/ib-check-partners-discount/ib-check-partners-discount.service';
import { ibSelectPartnerModalComponent } from '@shared/components/ib-booking-partners-modal/ib-booking-partners-modal.component';
import { IbCDatalayerUtilsService } from 'ib-web-commons/ib-datalayer';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Pipe } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Pipe({
    name: 'translate'
})
export class TranslatePipeMock implements PipeTransform {
    public name: string = 'translate';

    public transform (query: string, ...args: any[]): any {
        return query;
    }
}

describe('SelectPartnerModalcomponent test', function () {
    let component, fakeValue, fakeModel ;
    const fakeEvents = {
        category: 'Programa Partner',
        click: 'Click',
        select: 'Select',
        save: 'Guardar',
        submit: 'Submit',
        name: 'Programa Partner Modal Event'
    };
    const FAKEMODEL = {
        partnerSelected: 'SAN',
        dontAskAgain: false
    };
    const fakeUibModalService = {
        'dismiss': jasmine.createSpy().and.returnValue(JSON.parse(JSON.stringify(FAKEMODEL))),
        'close': jasmine.createSpy().and.returnValue(JSON.parse(JSON.stringify(FAKEMODEL)))
    };
    const fakeDatalayerUtilsService = {
        'sendInteractionEvent': jasmine.createSpy()
    };
    const fakeIbCheckPartnersDiscountsService = {
        'getCurrentUserStoredPreference': jasmine.createSpy().and.callFake(() => {
            return JSON.parse(JSON.stringify(FAKEMODEL));
        }),
        'setPartnersDiscountsApplicationFlag': jasmine.createSpy(),
        'setSelectedPartnerDiscount': jasmine.createSpy(),
        'setCurrentUserStoredPreference': jasmine.createSpy(),
        'getPartnersResponse': jasmine.createSpy()
    };
    const PARTNERRESPONSE = {
        partners: [
            {
                partnerIdentifier: 'SAN',
                partnerName: 'SANTANDER',
                type: 'Product and registration (cobrand) assignment',
                partnerProduct: {
                    identifier: '68',
                    productName: 'SANTANDER SME ELITE',
                    percentDiscount: 10,
                    productDescription: 'Plan Santander IberiaPlus',
                    productTier: 'ELITE',
                    startDate: '2021-04-20T11:37:21.000Z',
                    priority: '9',
                    userMustFly: true
                }
            },
            {
                partnerIdentifier: 'IBCARDS',
                partnerName: 'Iberia Cards',
                type: 'Collection Partner assigment',
                partnerProduct: {
                    identifier: '0',
                    productName: 'Iberia Cards',
                    productDescription: 'Iberia Cards',
                    productTier: '',
                    percentDiscount: 5,
                    startDate: '2021-04-20T11:37:21.000Z',
                    priority: '0',
                    userMustFly: false
                }
            }
        ]
    };

    beforeEach(function () {
        TestBed.configureTestingModule({
            declarations: [
                ibSelectPartnerModalComponent,
                TranslatePipeMock
            ],
            imports:[
                TranslateModule.forRoot(),
                NgbModalModule,
                FormsModule,
                CommonModule
            ],
            providers: [
                { provide: NgbActiveModal, useValue: fakeUibModalService },
                { provide: IbCheckPartnersDiscountsService, useValue: fakeIbCheckPartnersDiscountsService },
                { provide: IbCDatalayerUtilsService, useValue: fakeDatalayerUtilsService }
            ]
        }).compileComponents();
        let fixture = TestBed.createComponent(ibSelectPartnerModalComponent);
        component = fixture.componentInstance;
        fakeIbCheckPartnersDiscountsService.getPartnersResponse.and.returnValue(PARTNERRESPONSE);
        fakeDatalayerUtilsService.sendInteractionEvent.calls.reset();
        fakeModel = JSON.parse(JSON.stringify(FAKEMODEL));


    });
    describe('When changeDontAskAgain() is called', function () {
        it('should call datalayer service changeDontAskAgain function', function () {
            component.changeDontAskAgain();
            expect(fakeDatalayerUtilsService.sendInteractionEvent).toHaveBeenCalledWith({eventCategory: fakeEvents.category, eventAction: fakeEvents.click, eventLabel: fakeEvents.save, eventName:fakeEvents.name});
        });
    });
    describe('When changePartnerSelected() is called', function () {
        it('should set the selected partner and update datalayer whit event data', function () {
            component.model = fakeModel;
            component.changePartnerSelected(fakeModel.partnerSelected);
            expect(component.model).toEqual(fakeModel);
            expect(fakeDatalayerUtilsService.sendInteractionEvent).toHaveBeenCalledWith({eventCategory: fakeEvents.category, eventAction: fakeEvents.select, eventLabel: fakeModel.partnerSelected, eventName:fakeEvents.name});
        });
    });
    describe('When saveStoragePartner() is called', function () {
        it('should set flag, dontAskAgain property on model and update datalayer when value is false, set the selected partner, stored preferences and close modal window', function () {
            fakeValue = false;
            component.model = fakeModel;
            component.saveStoragePartner(fakeValue);
            expect(fakeIbCheckPartnersDiscountsService.setPartnersDiscountsApplicationFlag).toHaveBeenCalledWith(fakeValue);
            expect(component.model.dontAskAgain).toEqual(fakeValue);
            expect(fakeDatalayerUtilsService.sendInteractionEvent).toHaveBeenCalledWith({ eventCategory: fakeEvents.category, eventAction: fakeEvents.submit, eventLabel: '', eventName: fakeEvents.name });
            expect(fakeIbCheckPartnersDiscountsService.setSelectedPartnerDiscount).toHaveBeenCalledWith(fakeModel.partnerSelected);
            expect(fakeIbCheckPartnersDiscountsService.setCurrentUserStoredPreference).toHaveBeenCalledWith(fakeModel.dontAskAgain, '');
            expect(fakeUibModalService.close).toHaveBeenCalled();
        });
        it('should update datalayer whit selected partner when value is not false, set the selected partner, stored preferences and close modal window', function () {
            fakeValue = true;
            component.model = fakeModel;
            component.saveStoragePartner(fakeValue);
            expect(fakeDatalayerUtilsService.sendInteractionEvent).toHaveBeenCalledWith({ eventCategory: fakeEvents.category, eventAction: fakeEvents.submit, eventLabel: fakeModel.partnerSelected, eventName: fakeEvents.name });
            expect(fakeIbCheckPartnersDiscountsService.setSelectedPartnerDiscount).toHaveBeenCalledWith(fakeModel.partnerSelected);
            expect(fakeIbCheckPartnersDiscountsService.setCurrentUserStoredPreference).toHaveBeenCalledWith(fakeModel.dontAskAgain, fakeModel.partnerSelected);
            expect(fakeUibModalService.close).toHaveBeenCalled();
        });
    });
});
