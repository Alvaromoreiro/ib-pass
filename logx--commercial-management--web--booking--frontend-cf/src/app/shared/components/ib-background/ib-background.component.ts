import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
    selector: 'ib-background',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="ib-background">
        <img 
            class="ib-background__img" 
            [src]="imageUrl || defaultImageUrl" 
            [alt]="altText"
        >
        </div>
    `
})
export class IbBackgroundComponent {
    @Input() imageUrl?: string;
    @Input() altText: string = 'Background';

    readonly defaultImageUrl = '/iberia-web-content/imagenes/background/generico/disponibilidad_default_2000.jpg';
}

downgradeToAJSComponent(
    'ibBackground',
    {
        component: IbBackgroundComponent,
        inputs: ['imageUrl', 'altText'],
        outputs: []
    },
    'ib-not-avaibility-module'
);

export class IbBackgroundLegacyComponent {}
