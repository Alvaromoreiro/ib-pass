import { Component, OnInit, OnDestroy, ElementRef, Input, Inject} from '@angular/core';
import { CardSimple, CardSimpleProps, Text, TextProps } from 'commercial-management--digital--web-components-design--library';
import { downgradeToAJSComponent, AJSRootScope } from 'ib-web-commons/utils';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TranslateService } from '@ngx-translate/core';
@Component({
    selector: 'ib-pmt-confirmation-onhold-alert',
    template: '',
    styleUrls: ['./ib-pmt-confirmation-onhold-alert.component.scss']
})
export class IbPmtConfirmationOnholdAlertComponent implements OnInit, OnDestroy {
    private reactRoot: Root;
    @Input() endOrderTime: ConfirmationTypes.EndOrderTime;

    constructor (
        @Inject(AJSRootScope) private rootScope: CommonsRootScope,
        private ElementRef: ElementRef,
        private TranslateService: TranslateService
    ){
        this.reactRoot = createRoot(this.ElementRef.nativeElement);
    }
    ngOnDestroy (): void {
        this.reactRoot.unmount();
    }
    ngOnInit (): void {
        this.reactRoot.render(React.createElement(CardSimple, this.getComponentProps()));
    }
    
    private getTitle = () :string => {
        return this.TranslateService.instant('ONHOLD_CONFIRMATION_ALERT_TITLE', {hours: this.endOrderTime?.hoursLeft});
    };

    private getChildren = () :React.ReactNode => {
        const props:TextProps = {font: 'verdana', size: 'lg-regular'};
        const formatTime = (time: number): string => time < 10 ? `0${time}` : `${time}`;
        return React.createElement(React.Fragment, null,
            React.createElement(Text, props, this.TranslateService.instant('ONHOLD_CONFIRMATION_ALET_TEXT_ 1')),
            React.createElement(Text, props, this.TranslateService.instant('ONHOLD_CONFIRMATION_ALET_TEXT_ 2', {
                date: this.endOrderTime.formatedDate,
                hour: formatTime(this.endOrderTime.hour),
                minutes: formatTime(this.endOrderTime.minutes)
            }))
        );
    };

    private getComponentProps = () :CardSimpleProps => {
        return {
            title: this.getTitle(),
            children: this.getChildren(),
            buttonProps: {
                onClick: this.ctaAction.bind(this),
                children: React.createElement(Text, {font: 'verdana', size: 'lg-regular'}, this.TranslateService.instant('ONHOLD_CONFIRMATION_CTA'))
            }
            
        };
    };

    private ctaAction = () :void => {
        this.rootScope.$broadcast('redirectToMMB');
    };
}
downgradeToAJSComponent(
    'ibPmtConfirmationOnholdAlertComponentLegacy',
    {
        component: IbPmtConfirmationOnholdAlertComponent,
        inputs: [],
        outputs: []
    },
    'ib-pmt-order-confirmation-module'
);
