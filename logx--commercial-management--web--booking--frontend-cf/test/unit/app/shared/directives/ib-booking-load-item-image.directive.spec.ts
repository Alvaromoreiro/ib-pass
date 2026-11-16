import { ElementRef, Renderer2, SimpleChange, SimpleChanges } from '@angular/core';
import { IbBookingLoadItemImageDirective } from '@shared/directives/ib-booking-load-item-image.directive';

describe('IbBookingLoadItemImageDirective', () => {
    let directive: IbBookingLoadItemImageDirective;
    let rendererMock: Renderer2;
    let elementRefMock: ElementRef;
    let nativeElementMock: HTMLElement;

    beforeEach(() => {
      nativeElementMock = document.createElement('div');
      elementRefMock = new ElementRef(nativeElementMock);

      rendererMock = jasmine.createSpyObj('Renderer2', ['setStyle']);

      directive = new IbBookingLoadItemImageDirective(elementRefMock, rendererMock);
    });

    describe('When loadItemImage directive is called', () => {
      let imageMock: jasmine.SpyObj<HTMLImageElement>;

      beforeEach(() => {
        imageMock = jasmine.createSpyObj('HTMLImageElement', ['onload', 'onerror'], { src: '' });
        spyOn(window as any, 'Image').and.returnValue(imageMock);
      });

      it('should set the background-image style to the image URL if the image loads successfully', () => {
        const imageUrl = 'http://example.com/image.jpg';
        directive.ibLoadItemImage = imageUrl;
        const changes: SimpleChanges = {
            ibLoadItemImage: new SimpleChange(null, imageUrl, false)
        };
        directive.ngOnChanges(changes);
        imageMock.onload(this);

        expect(rendererMock.setStyle).toHaveBeenCalledWith(nativeElementMock, 'background-image', `url(${imageUrl})`);
      });

      it('should set the background-image style to the default image URL if the image fails to load', () => {
        const imageUrl = 'invalid-url';
        const defaultImageUrl = 'http://example.com/default.jpg';
        directive.ibLoadItemImage = imageUrl;
        directive.defaultImage = defaultImageUrl;
        const changes: SimpleChanges = {
            ibLoadItemImage: new SimpleChange(null, imageUrl, false),
            defaultImage: new SimpleChange(null, defaultImageUrl, false)
        };

        directive.ngOnChanges(changes);
        imageMock.onerror(this);

        expect(rendererMock.setStyle).toHaveBeenCalledWith(nativeElementMock, 'background-image', `url(${defaultImageUrl})`);
      });
    });
  });
