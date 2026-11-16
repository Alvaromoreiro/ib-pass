import * as angular from 'angular';

interface TemplateModule {
    tpl: string;
    name: string;
}

type WebpackContext = {
    keys(): string[];
    (id: string): string;
};

function requireAll(requireContext: WebpackContext): TemplateModule[] {
    return requireContext.keys().map(val => ({
        tpl: requireContext(val),
        name: `web-manage-my-booking/templates/${val.split('/').pop()}`
    }));
}

function loadAppTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            './app',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        ) as WebpackContext
    );
}

function loadBookingDashboardTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            './components/ib-MmB-booking-dashboard/assets',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        ) as WebpackContext
    );
}

function loadBookingsListTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            './components/ib-MmB-bookings-list/assets',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        ) as WebpackContext
    );
}

function loadOtpModalTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-commons/dist',
            { recursive: true, regExp: /ib-ui-otp-modal-view\.html/ }
        ) as WebpackContext
    );
}

function loadOtpErrorModalTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-commons/dist',
            { recursive: true, regExp: /ib-ui-otp-modal-error-view\.html/ }
        ) as WebpackContext
    );
}

function loadChangeFlightTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            './components/ib-MmB-change-flight/assets',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        ) as WebpackContext
    );
}

function loadFlightConfirmationTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            './components/ib-MmB-flight-confirmation/assets',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        ) as WebpackContext
    );
}

function loadPassengersInfoTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            './components/ib-MmB-passengers-info/assets',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        ) as WebpackContext
    );
}

function loadRebookErrorTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            './components/ib-Mmb-rebook-error/assets',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        ) as WebpackContext
    );
}

function loadBookingManagementTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            './components/ib-MmB-booking-management',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        ) as WebpackContext
    );
}

function loadCommunicationLostTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            './components/ib-MmB-communication-lost',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        ) as WebpackContext
    );
}

function loadFlexibilizationTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            './components/ib-MmB-flexibilization',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        ) as WebpackContext
    );
}

function loadSearchTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            './components/ib-MmB-search',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        ) as WebpackContext
    );
}

function loadDisruptionMainTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            './components/ib-disruption-main/assests',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        ) as WebpackContext
    );
}

function loadReusableComponentsTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            './components/ib-reusable-components',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        ) as WebpackContext
    );
}

function loadWebCommonsTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-commons/dist',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        ) as WebpackContext
    );
}

function loadMenusTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-menus/dist',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        ) as WebpackContext
    );
}

function loadPaymentsViewTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-payments/dist',
            { recursive: true, regExp: /ib-pmt-view\.html/ }
        ) as WebpackContext
    );
}

function loadPaymentsMmbConfirmationTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-payments/dist',
            { recursive: true, regExp: /ib-pmt-mmb-confirmation-view\.html/ }
        ) as WebpackContext
    );
}

function loadPaymentsOrderConfirmationTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-payments/dist',
            { recursive: true, regExp: /ib-pmt-order-confirmation-view\.html/ }
        ) as WebpackContext
    );
}

function loadPaymentsCommunicationLostTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-payments/dist',
            { recursive: true, regExp: /ib-pmt-communication-lost-view\.html/ }
        ) as WebpackContext
    );
}

function loadVoluntaryRefundsTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            './components/ib-MmB-voluntary-refunds',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        ) as WebpackContext
    );
}

function loadAncillariesPageTemplates(): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            './components/ib-MmB-ancillaries-page',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        ) as WebpackContext
    );
}

function getAllTemplates(): TemplateModule[] {
    return [
        ...loadAppTemplates(),
        ...loadBookingDashboardTemplates(),
        ...loadBookingsListTemplates(),
        ...loadOtpErrorModalTemplates(),
        ...loadOtpModalTemplates(),
        ...loadChangeFlightTemplates(),
        ...loadFlightConfirmationTemplates(),
        ...loadPassengersInfoTemplates(),
        ...loadRebookErrorTemplates(),
        ...loadBookingManagementTemplates(),
        ...loadCommunicationLostTemplates(),
        ...loadFlexibilizationTemplates(),
        ...loadSearchTemplates(),
        ...loadDisruptionMainTemplates(),
        ...loadReusableComponentsTemplates(),
        ...loadWebCommonsTemplates(),
        ...loadMenusTemplates(),
        ...loadPaymentsViewTemplates(),
        ...loadPaymentsMmbConfirmationTemplates(),
        ...loadPaymentsOrderConfirmationTemplates(),
        ...loadPaymentsCommunicationLostTemplates(),
        ...loadVoluntaryRefundsTemplates(),
        ...loadAncillariesPageTemplates()
    ];
}

angular.module('web-manage-my-booking-templates', []).run([
    '$templateCache',
    ($templateCache) => {
        getAllTemplates().forEach(val => {
            $templateCache.put(val.name, val.tpl);
        });
    }
]);