import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbBackgroundComponent } from './ib-background.component';

describe('IbBackgroundComponent', () => {
    let component: IbBackgroundComponent;
    let fixture: ComponentFixture<IbBackgroundComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [IbBackgroundComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(IbBackgroundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should render the container with class "ib-background"', () => {
        const div: HTMLDivElement = fixture.nativeElement.querySelector('.ib-background');
        expect(div).toBeTruthy();
    });

    it('should render the image with class "ib-background__img"', () => {
        const img: HTMLImageElement = fixture.nativeElement.querySelector('.ib-background__img');
        expect(img).toBeTruthy();
    });

    describe('imageUrl', () => {
        it('should use the default image when imageUrl is not provided', () => {
            const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
            expect(img.getAttribute('src')).toContain('disponibilidad_default_2000.jpg');
        });

        it('should use the provided URL when imageUrl is set', () => {
            component.imageUrl = '/custom/path/image.jpg';
            fixture.detectChanges();
            const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
            expect(img.getAttribute('src')).toBe('/custom/path/image.jpg');
        });

        it('should fall back to the default image when imageUrl is set to undefined', () => {
            component.imageUrl = '/custom/path/image.jpg';
            fixture.detectChanges();
            component.imageUrl = undefined;
            fixture.detectChanges();
            const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
            expect(img.getAttribute('src')).toBe(component.defaultImageUrl);
        });
    });

    describe('altText', () => {
        it('should display "Background" as the default alt text', () => {
            const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
            expect(img.alt).toBe('Background');
        });

        it('should display the provided alt text', () => {
            component.altText = 'Custom background image';
            fixture.detectChanges();
            const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
            expect(img.alt).toBe('Custom background image');
        });
    });

    describe('defaultImageUrl', () => {
        it('should have the correct default URL', () => {
            expect(component.defaultImageUrl).toBe(
                '/iberia-web-content/imagenes/background/generico/disponibilidad_default_2000.jpg'
            );
        });
    });
});
