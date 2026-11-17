import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    CommonsSessionStorageService
} from 'ib-web-commons/utils';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { IbCheckinRedirectionUtilsService } from '@src/app/shared/services/ib-utils/ib-checkin-redirection-utils.service';
import { IbCheckinPassengerRowComponent } from './ib-checkin-passenger-row.component';
import { mockPassengerInfo } from '@test/unit/app/pages/ib-checkin-seat-summary/mocks/seat-summary.mocks';

@Pipe({
    name: 'translate'
})
export class TranslatePipeMock implements PipeTransform {
    public name: string = 'translate';

    public transform(query: string, ...args: unknown[]): string {
        return query;
    }
}

describe('IbCheckinPassengerRowComponent', () => {
    let component: IbCheckinPassengerRowComponent;
    let fixture: ComponentFixture<IbCheckinPassengerRowComponent>;

    let fakeCommonsSessionStorageService: jasmine.SpyObj<CommonsSessionStorageService>;
    let fakeIbCheckinRedirectionUtilsService: jasmine.SpyObj<IbCheckinRedirectionUtilsService>;

    beforeEach(async () => {
        fakeCommonsSessionStorageService = jasmine.createSpyObj('CommonsSessionStorageService', ['get', 'set', 'remove']);
        fakeIbCheckinRedirectionUtilsService = jasmine.createSpyObj('IbCheckinRedirectionUtilsService', ['path']);

        await TestBed.configureTestingModule({
            declarations: [IbCheckinPassengerRowComponent, TranslatePipeMock],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: CommonsSessionStorageService,
                    useValue: fakeCommonsSessionStorageService
                },
                {
                    provide: IbCheckinRedirectionUtilsService,
                    useValue: fakeIbCheckinRedirectionUtilsService
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbCheckinPassengerRowComponent);
        component = fixture.componentInstance;

        component.passengerInfo = mockPassengerInfo;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have the passengerInfo from Input', () => {
        expect(component.passengerInfo).toEqual(mockPassengerInfo);
    });
});