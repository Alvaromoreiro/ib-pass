    export const DEFAULT_FLEXIBILIZATION_DATE : FlexibilizationPeriodDateModel = {
        dateFrom: "",
        dateTo: "",
        text: "",
        type: "",
        message: "",
    };
    export const DEFAULT_FLEXIBILIZATION_DATE_LIST  = [] as FlexibilizationPeriodDateModel[];

    export const DEFAULT_FLEXIBILIZATION_PERIODS_INFO : FlexibilizationPeriodsInfoModel = {
        allowedPeriods: [DEFAULT_FLEXIBILIZATION_DATE],
        blackoutPeriods: [DEFAULT_FLEXIBILIZATION_DATE],
        maxDate: "",
        minDate: "",
    };

    export const DEFAULT_FLEXIBILIZATION_FLAGS_INFO : FlexbilizationFlagsInfoModel = {
        showFlexibilizationChangeSection: false,
        showVoluntaryFlexibleFlightChange: false,
        showVoluntaryChangeFlightSection: false,
        showLinkToRubiQ: false,
    };

    export const DEFAULT_FLEXIBILIZATION_INFO_DATES : FlexibilizationInfoDates = {
        flexibilizationDate: DEFAULT_FLEXIBILIZATION_DATE,
        allowedPeriods:  [DEFAULT_FLEXIBILIZATION_DATE],
        blackoutPeriods: [DEFAULT_FLEXIBILIZATION_DATE],
        allowedPeriodsText: "",
        blackoutPeriodsText: ""
    };
    export type FlexibilizationDateModel = {
        limit: string;
        since: string;
    };
    export type FlexibilizationPeriodDateModel = {
        dateFrom: string;
        dateTo: string;
        text: string;
        message: string;
        type: string;
    };
    
    export type FlexibilizationPeriodsInfoModel = {
        allowedPeriods: FlexibilizationPeriodDateModel[];
        blackoutPeriods: FlexibilizationPeriodDateModel[];
        maxDate: string;
        minDate: string;
    };

    export type FlexbilizationFlagsInfoModel = {
        showFlexibilizationChangeSection: boolean;
        showVoluntaryFlexibleFlightChange: boolean;
        showVoluntaryChangeFlightSection: boolean;
        showLinkToRubiQ: boolean;
    };

    export type FlexibilizationInfoDates = {
        flexibilizationDate: FlexibilizationPeriodDateModel;
        allowedPeriods:  FlexibilizationPeriodDateModel[];
        blackoutPeriods: FlexibilizationPeriodDateModel[];
        allowedPeriodsText: string;
        blackoutPeriodsText: string;
    }
