import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgReactComponent } from '@src/app/shared/components/react/ng-react.component';
import { ElementRef, Component, NgZone } from '@angular/core';


@Component({
  template: '<ng-react [component]="testComponent" [props]="testProps"></ng-react>'
})
class TestHostComponent {
    testComponent = () => null;
    testProps = { text: 'Hello' };
}

type NgReactComponentTestView = {
    root: {
        render: (node: unknown) => void;
        unmount: () => void;
    };
};

describe('NgReactComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: NgReactComponent<any>;
    let componentView: NgReactComponentTestView;
    let ngZone: NgZone;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [NgReactComponent, TestHostComponent],
            providers: [{ provide: ElementRef, useValue: { nativeElement: document.createElement('div') } }]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.debugElement.children[0].componentInstance;
        componentView = component as unknown as NgReactComponentTestView;
        ngZone = TestBed.inject(NgZone);
        spyOn(ngZone, 'runOutsideAngular').and.callFake(<T>(fn: (...args: any[]) => T): T => fn());
    });

    afterEach(() => {
        fixture?.destroy();
    });

    it('debería crearse', () => {
        expect(component).toBeTruthy();
    });

    it('debería renderizar el componente React con las props dadas', () => {
        spyOn(componentView.root, 'render');
        fixture.detectChanges();
        expect(ngZone.runOutsideAngular).toHaveBeenCalled();
        expect(componentView.root.render).toHaveBeenCalled();
    });

    it('debería desmontar el componente React al destruirse', () => {
        spyOn(componentView.root, 'unmount');
        fixture.destroy();
        expect(ngZone.runOutsideAngular).toHaveBeenCalled();
        expect(componentView.root.unmount).toHaveBeenCalled();
    });
});