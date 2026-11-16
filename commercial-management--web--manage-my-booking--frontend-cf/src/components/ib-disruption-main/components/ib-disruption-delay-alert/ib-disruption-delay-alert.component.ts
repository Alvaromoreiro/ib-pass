import { Component, Inject, Input, OnInit } from '@angular/core';
import { AJSRootScope, downgradeToAJSComponent } from 'ib-web-commons/utils';
import { MmBAppConstants } from '@src/ib-MmB-constants';

interface RootScopeWithLocale {
    appMarket?: string;
    appLang?: string;
}

interface FlightCity {
    description?: string;
}

interface FlightSegment {
    departureCity?: FlightCity;
    arrivalCity?: FlightCity;
}

interface DelayedFlightSlice {
    segments?: FlightSegment[];
}

@Component({
    selector: 'ib-disruption-delay-alert',
    templateUrl: './ib-disruption-delay-alert-view.component.html'
})
export class IbDisruptionDelayAlertComponent implements OnInit {
    @Input() public flights: DelayedFlightSlice[] | null;

    public linkMoreInfo: string;
    private flightsStatusByLanguage: Record<string, string> = {
        ca: MmBAppConstants.FLIGHT_STATUS.CA,
        es: MmBAppConstants.FLIGHT_STATUS.ES,
        pt: MmBAppConstants.FLIGHT_STATUS.PT,
        en: MmBAppConstants.FLIGHT_STATUS.EN,
        fr: MmBAppConstants.FLIGHT_STATUS.FR,
        it: MmBAppConstants.FLIGHT_STATUS.IT,
        nl: MmBAppConstants.FLIGHT_STATUS.NL,
        de: MmBAppConstants.FLIGHT_STATUS.DE,
        ru: MmBAppConstants.FLIGHT_STATUS.RU,
        zh: MmBAppConstants.FLIGHT_STATUS.ZH,
        ja: MmBAppConstants.FLIGHT_STATUS.JA
    };

    constructor(
        @Inject(AJSRootScope) private $rootScope: RootScopeWithLocale
    ) { }

    ngOnInit(): void {
        this.linkMoreInfo = this.generateMoreInfoUrl();
    }

    public get hasSingleFlight(): boolean {
        return !!this.flights?.length && this.flights.length === 1;
    }

    public get hasMultipleFlights(): boolean {
        return !!this.flights?.length && this.flights.length > 1;
    }

    public get originDescription(): string | undefined {
        return this.flights?.[0]?.segments?.[0]?.departureCity?.description;
    }

    public get destinationDescription(): string | undefined {
        return this.flights?.[0]?.segments?.[0]?.arrivalCity?.description;
    }

    public generateMoreInfoUrl(): string {
        const market = (this.$rootScope.appMarket || '').toLowerCase();
        const language = (this.$rootScope.appLang || '').toLowerCase();
        return `https://www.iberia.com/${market}${this.getEndPath(language)}`;
    }

    public getEndPath(language: string): string {
        return this.flightsStatusByLanguage[language] || MmBAppConstants.FLIGHT_STATUS.EN;
    }
}

downgradeToAJSComponent('ibDisruptionDelayAlert', {
    component: IbDisruptionDelayAlertComponent,
    inputs: ['flights']
}, 'ib-disruption-delay-alert-module');
