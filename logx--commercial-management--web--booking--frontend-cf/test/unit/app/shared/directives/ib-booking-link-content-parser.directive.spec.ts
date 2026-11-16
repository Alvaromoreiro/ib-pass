import { Component, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { ViewportScroller } from '@angular/common';
import { IbBookingContentParserUtilsService } from '@src/app/shared/services/ib-booking-content-parser/ib-booking-content-parser-utils.service';
import { IbBookingLinkContentParserDirective } from '@src/app/shared/directives/ib-booking-link-content-parser.directive';
import { AJSBookingModalService } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';

let mockAnswer = {
  code: "1234567890",
  elements: [
      {
          type: "Accordion_C",
          title: "",
          subTitle: "",
          description: "Nuestro Compromiso...",
          items: [
              {
                  title: "Responsable...",
                  description: "Todos los datos..."
              },
              {
                  title: "¿Qué entendemos...",
                  description: "Se entiende..."
              },
          ]
      }
  ],
  subtitle: '',
  title: 'title'
}

class MockIbBookingContentParserUtilsService {
  isExternalLink(attributes: any): boolean {
    return attributes.href && attributes.href.value.startsWith('http');
  }

  isModalLink(attributes: any): boolean {
    return attributes.href && attributes.href.value.includes('modal');
  }

  isInternalLink(attributes: any): boolean {
    return attributes.href && attributes.href.value.startsWith('#');
  }

  isModalWithHref(attributes: any): boolean {
    return attributes.href && attributes.href.value.includes('modal-link');
  }

  searchModalContent(modals: any, contentId: string): any {
    return mockAnswer;
  }
}

@Component({
  template: `<a ibBookingLinkContentParser [contentInfo]="contentInfo" [contentId]="contentId" href="{{href}}">Link</a>`
})
class TestComponent {
  contentInfo = 'someContentInfo';
  contentId = 'someContentId';
  href = '#someAnchor';
}

describe('IbBookingLinkContentParserDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directive: IbBookingLinkContentParserDirective;
  let el: DebugElement;
  let viewportScrollerSpy: ViewportScroller;
  let sessionStorageService: jasmine.SpyObj<CommonsSessionStorageService>;
  let modalService: CommonsModalService;

  beforeEach(() => {
    modalService = jasmine.createSpyObj('AJSBookingModalService', ['showGenericModal']);
    sessionStorageService = jasmine.createSpyObj('CommonsSessionStorageService', ['get']);
    viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', ['scrollToAnchor']);

    TestBed.configureTestingModule({
      declarations: [TestComponent, IbBookingLinkContentParserDirective],
      providers: [
        { provide: IbBookingContentParserUtilsService, useClass: MockIbBookingContentParserUtilsService },
        { provide: AJSBookingModalService, useValue: modalService },
        { provide: CommonsSessionStorageService, useValue: sessionStorageService },
        { provide: ViewportScroller, useValue: viewportScrollerSpy }
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    el = fixture.debugElement.query(By.directive(IbBookingLinkContentParserDirective));
    directive = el.injector.get(IbBookingLinkContentParserDirective);
  });

  it('should create the directive', () => {
    expect(directive).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call handleLinks', () => {
      const handleLinksSpy = spyOn<any>(directive as any, 'handleLinks').and.callThrough();
      directive.ngOnInit();
      expect(handleLinksSpy).toHaveBeenCalled();
    });
  });

  describe('handleLinks', () => {
    it('should handle external links', () => {
      directive['attributes'] = { href: { value: 'http://external-link.com' } };
      directive['handleLinks']();
      expect(el.nativeElement.getAttribute('target')).toBe('_blank');
    });

    it('should handle modal links', () => {
      directive['attributes'] = { href: { value: 'modal-link' } };
      directive['handleLinks']();
      expect(el.nativeElement.getAttribute('href')).toBe('javascript:void(0)');
    });
  });

  describe('onclick', () => {
    it('should handle internalLinks accordingly', () => {
      const event = new MouseEvent('click');
      const defaultPrevented = spyOn<any>(event as MouseEvent, 'preventDefault').and.callThrough();

      directive['attributes'] = { href: { value: '#someAnchor' } };

      directive.onclick(event);

      expect(viewportScrollerSpy['scrollToAnchor']).toHaveBeenCalledWith('someAnchor');
      expect(defaultPrevented).toHaveBeenCalled();
    })

    it('should show modal for modal links', () => {
      const event = new MouseEvent('click');

      directive['attributes'] = { href: { value: 'modal-link' }, contentInfo: { nodeValue: 'someContentInfo' }, contentId: { nodeValue: '1234567890' } };

      sessionStorageService.get.and.returnValue({ modals: mockAnswer, text: 'needless text' });

      directive.onclick(event);
      expect(modalService.showGenericModal).toHaveBeenCalledWith(false, 'ib-generic-external-modal.html', { info: mockAnswer});
    });
  });
});