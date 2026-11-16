import { Directive, ElementRef, Injector, Input, Inject, Output, EventEmitter, OnInit } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';
import { HeaderCompleteOriginDestinationResponse, HeaderCompletePassengerInfo } from '@src/app/core/models/ib-booking-availability/header-model';
import { AJSRootScope } from 'ib-web-commons/utils';

@Directive( {
    selector: 'ib-header-seeker-legacy'
} )
export class ibHeaderSeekerComponentDirective extends UpgradeComponent implements OnInit {
    @Input() trips: HeaderCompleteOriginDestinationResponse[];
    @Input() passengers: HeaderCompletePassengerInfo;
    @Input() redemption: any;
    @Input() isOnbusiness: boolean;
    @Input() isHMad: boolean;
    @Input() openCalendar: any;
    @Output() closeSeeker = new EventEmitter<any>();
    @Output() backToMainEvent = new EventEmitter<boolean>();
    constructor (
        @Inject(AJSRootScope) private rootScope: CommonsRootScope,
        elementRef: ElementRef, injector: Injector
    ) {
        // We must pass the name of the directive as used by AngularJS to the super
        super( 'ibHeaderSeekerComponent', elementRef, injector );
        this.rootScope.$on( 'toggleAdvancedSearch', this.close );
        this.rootScope.$on( 'backToMain', this.backToMain );
    }
    close = ( event, close ) => {
        this.closeSeeker.emit( close );
    };
    backToMain = ( event, goToHome ) => {
        this.backToMainEvent.emit( goToHome );
    };
}
