import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OriginDestinationPipe } from './pipes/slice-origin-destination/origin-destination.pipe';

@NgModule({
    declarations: [
        OriginDestinationPipe
    ],
    exports: [
        OriginDestinationPipe
    ],
    imports: [
        CommonModule
    ]
})
export class IbSharedModule {}
