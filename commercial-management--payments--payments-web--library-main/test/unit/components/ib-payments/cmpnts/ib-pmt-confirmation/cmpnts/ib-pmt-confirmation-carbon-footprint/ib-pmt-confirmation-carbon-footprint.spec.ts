import { Pipe, PipeTransform } from '@angular/core';
import { IbCLinkPipe } from 'ib-web-commons/pipes';
import { IbPmtConfirmationCarbonFootprintComponent } from './../../../../../../../../src/components/ib-payments/cmpnts/ib-pmt-confirmation/cmpnts/ib-pmt-confirmation-carbon-footprint/ib-pmt-confirmation-carbon-footprint.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from 'test/mocks/services/StorageServiceMock';

@Pipe({
    name: 'translate'
})
export class TranslateMockPipe implements PipeTransform {
    public name: string = 'translate';

    public transform (query: string, ...args: any[]): any {
        if (args && args.length > 0) {
            return query + JSON.stringify(args[0]);
        }
        return query;
    }
}

@Pipe({
    name: 'link'
})
export class IbCLinkMockPipe implements PipeTransform {
    public transform (link: string): any {
        return link;
    }
}

describe ('Test IbPmtConfirmationCarbonFootprintComponent', ()=> {
    let component: IbPmtConfirmationCarbonFootprintComponent ;
    let fixture: ComponentFixture<IbPmtConfirmationCarbonFootprintComponent>;
    let fakeCommonsSessionStorageService = new StorageServiceMock();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                IbPmtConfirmationCarbonFootprintComponent,
                IbCLinkMockPipe,
                TranslateMockPipe
            ],
            providers: [
                {
                    provide: CommonsSessionStorageService,
                    useValue: fakeCommonsSessionStorageService
                },
                {
                    provide: IbCLinkPipe,
                    useClass: IbCLinkMockPipe
                }
            ]
        }).compileComponents();
    });

    beforeEach(function () {
        fixture = TestBed.createComponent(IbPmtConfirmationCarbonFootprintComponent);
        component = fixture.componentInstance;
        fakeCommonsSessionStorageService.set('PNR', '1234');
        fixture.detectChanges();
    });

    describe ('Test IbPmtConfirmationCarbonFootprintComponent', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should display model values', () => {
            component.model = {
                name: 'John',
                kilosCo2eFormatted: '53,02',
                priceFormatted: '0.99€',
                flight: {
                    numPax: 1,
                    segments: [
                        {
                            from: 'MAD',
                            to: 'BCN',
                            cabin: 'economy'
                        }
                    ]
                }
            };

            fixture.detectChanges();

            const bannerTitle = fixture.nativeElement.querySelector('.ib-box-promo__title');



            const bannerDescription = fixture.nativeElement.querySelector('.ib-box-promo__description-text');


            const bannerButton = fixture.nativeElement.querySelector('.ib-box-promo__description-button a');
            const link = bannerButton.getAttribute('href');
            expect(link).toContain('MAD');
            expect(link).toContain('BCN');

        });

        it('should generate chooose url based on flight model value', () => {
            component.model = {
                name: 'John',
                kilosCo2eFormatted: '53,02',
                priceFormatted: '0.99€',
                flight: {
                    numPax: 1,
                    segments: [
                        {
                            from: 'MAD',
                            to: 'BCN',
                            cabin: 'economy',
                            roundTrip: false,
                            stops: ['GRX']
                        }
                    ]
                }
            };

            fixture.detectChanges();

            const expectedUrl = 'FOOTPRINT_CONFIRMATION_LINK?page=blendedPage&items[0][type]=flights.fromTo&items[0][from]=MAD&items[0][to]=BCN&items[0][passengers]=1&items[0][roundTrip]=False&items[0][stops][0]=GRX&orderId=1234';
            expect(component.choooseUrl).toBe(expectedUrl);
        });
        describe('capitalizeNameIfAllUppercase', () => {
            it('should return null when capitalizing null', () => {
                expect(component.capitalizeNameIfAllUppercase(null)).toBeNull();
            });

            it('should return empty string when capitalizing empty string', () => {
                expect(component.capitalizeNameIfAllUppercase('')).toBe('');
            });

            it('should capitalize multiple names', () => {
                expect(component.capitalizeNameIfAllUppercase('LUIS MANUEL')).toBe('Luis Manuel');
            });

            it('should keep lowercase name as is', () => {
                expect(component.capitalizeNameIfAllUppercase('Luis')).toBe('Luis');
            });
        });
    });

});
