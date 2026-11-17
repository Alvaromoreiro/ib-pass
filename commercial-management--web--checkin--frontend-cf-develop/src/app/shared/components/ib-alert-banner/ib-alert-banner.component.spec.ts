import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbAlertBannerComponent } from './ib-alert-banner.component';
import { Pipe } from '@angular/core';
import { IbCLinkPipe } from 'ib-web-commons/pipes';

@Pipe({
    name: "translate"
})
export class TranslatePipeMock implements PipeTransform {
    public name: string = "translate";

    public transform(query: string, ...args: unknown[]): string {
        return query;
    }
}

const IbCLinkPipeMock = {
    transform: jasmine.createSpy('IbCLinkPipeMock.transform')
}

describe('IbAlertBannerComponent', () => {
    let component: IbAlertBannerComponent;
    let fixture: ComponentFixture<IbAlertBannerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
           declarations: [IbAlertBannerComponent, TranslatePipeMock],
           providers: [{ provide: IbCLinkPipe, useValue: IbCLinkPipeMock }]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbAlertBannerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        const banner = fixture.nativeElement.querySelector('.banner-container');

        expect(component).toBeTruthy();
        expect(banner).toBeTruthy();
    });

    it('should show link text + icon if use link binding', () => {
        const href = 'https://iberia.com';
        component.link = href;
        fixture.detectChanges();

        const linkContainer = fixture.nativeElement.querySelector('.link-container');
        const link = linkContainer.querySelector('.link');

        expect(linkContainer).toBeTruthy();
        expect(link.textContent).toBe('ALERT_BANNER_MORE_INFO');
        expect(link.getAttribute('href')).toBe(href);
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('aria-label')).toBeNull();
    });

    it('should add aria-label to link if exists', () => {
        const href = 'https://iberia.com';
        const expectedAriaLabel = 'link';
        component.link = href;
        component.linkAccessibleText = expectedAriaLabel;
        fixture.detectChanges();

        const linkContainer = fixture.nativeElement.querySelector('.link-container');
        const link = linkContainer.querySelector('.link');

        expect(linkContainer).toBeTruthy();
        expect(link.getAttribute('aria-label')).toBe(expectedAriaLabel);
    });

    it('should add icon container with the correct icon + variant', () => {
        const expectedVariant = 'danger';
        const expectedIcon = 'icon-mdi_alert';

        component.variant = expectedVariant;

        fixture.detectChanges();

        const infoContainer = fixture.nativeElement.querySelector('.info-container');

        expect(infoContainer.querySelector('i').classList.contains(expectedIcon)).toBeTruthy();
        expect(infoContainer.querySelector('i').classList.contains(`icon--${expectedVariant}`)).toBeTruthy();
    });

    it('should render the correct texts from binding', () => {
        const expectedTexts = {
            title: 'title',
            body: 'body'
        };

        component.heading = expectedTexts.title;
        component.body = expectedTexts.body;

        fixture.detectChanges();

        const infoContainer = fixture.nativeElement.querySelector('.info-container');

        expect(infoContainer.querySelector('.banner-title').textContent).toBe(expectedTexts.title);
        expect(infoContainer.querySelector('.text-content').textContent).toBe(expectedTexts.body);
    });

    it('should set info icon if variant is not provided', () => {
        const expectedIcon = 'icon-informacion';

        component.variant = null;

        fixture.detectChanges();

        const infoContainer = fixture.nativeElement.querySelector('.info-container');

        expect(infoContainer.querySelector('i').classList.contains(expectedIcon)).toBeTruthy();
    });

    it('should return the custom icon name if provided', () => {
        const customIcon = 'custom-icon';
        component.icon = customIcon;

        expect(component.getIconName()).toBe(customIcon);
    });

    it('should transform the link using IbCLinkPipe when initialized', () => {
        const expectedLink = 'transformed-link';
        IbCLinkPipeMock.transform.and.returnValue(expectedLink);

        const link = 'https://example.com';
        component.linkLiteral = link;

        component.ngOnInit();

        expect(IbCLinkPipeMock.transform).toHaveBeenCalledWith(link);
        expect(component.link).toBe(expectedLink);
    });
});
