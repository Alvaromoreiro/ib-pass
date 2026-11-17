import * as angular from 'angular';

interface TemplateModule {
    tpl: string;
    name: string;
}

type WebpackContext = {
    keys(): string[];
    (id: string): string;
};

function requireAll (requireContext: WebpackContext): TemplateModule[] {
    return requireContext.keys().map(val => ({
        tpl: requireContext(val),
        name: `web-checkin/templates/${val.split('/').pop()}`
    }));
}

function loadComponentsTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            './components',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        ) as WebpackContext
    );
}

function loadAppPagesTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            './app/pages',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        ) as WebpackContext
    );
}

function loadGenericCompleteModalTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-commons/dist',
            { recursive: true, regExp: /generic-complete-modal\.html/ }
        ) as WebpackContext
    );
}

function loadGenericInfoModalTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-commons/dist',
            { recursive: true, regExp: /generic-info-modal\.html/ }
        ) as WebpackContext
    );
}

function loadGenericLoginModalErrorTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-commons/dist',
            { recursive: true, regExp: /generic-login-modal-error\.html/ }
        ) as WebpackContext
    );
}

function loadGenericWaitModalTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-commons/dist',
            { recursive: true, regExp: /generic-wait-modal\.html/ }
        ) as WebpackContext
    );
}

function loadGenericErrorModalTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-commons/dist',
            { recursive: true, regExp: /ib-generic-error-modal\.html/ }
        ) as WebpackContext
    );
}

function loadGenericExternalModalTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-commons/dist',
            { recursive: true, regExp: /ib-generic-external-modal\.html/ }
        ) as WebpackContext
    );
}

function loadModalLoadingPlaneTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-commons/dist',
            { recursive: true, regExp: /ib-modal-loading-plane\.html/ }
        ) as WebpackContext
    );
}

function loadUiLoadingViewTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-commons/dist',
            { recursive: true, regExp: /ib-ui-loading-view\.html/ }
        ) as WebpackContext
    );
}

function loadLoginReusableIframeTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-commons/dist',
            { recursive: true, regExp: /ib-ui-login-reusable-iframe-view\.html/ }
        ) as WebpackContext
    );
}

function loadPrefixCityTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-commons/dist',
            { recursive: true, regExp: /ib-ui-prefix-city\.html/ }
        ) as WebpackContext
    );
}

function loadLoginIframeTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-commons/dist',
            { recursive: true, regExp: /ib-ui-login-iframe-view\.html/ }
        ) as WebpackContext
    );
}

function loadAviosSummaryTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-commons/dist',
            { recursive: true, regExp: /ib-ui-avios-summary-view\.html/ }
        ) as WebpackContext
    );
}

function loadAviosSummaryBannerTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-commons/dist',
            { recursive: true, regExp: /ib-ui-avios-summary-banner-view\.html/ }
        ) as WebpackContext
    );
}

function loadExpiryDatesSelectTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-commons/dist',
            { recursive: true, regExp: /ib-ui-expiry-dates-select\.html/ }
        ) as WebpackContext
    );
}

function loadModalSessionTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-commons/dist',
            { recursive: true, regExp: /ib-modal-session\.html/ }
        ) as WebpackContext
    );
}

function loadPrefixCityViewTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-commons/dist',
            { recursive: true, regExp: /ib-ui-prefix-city-view\.html/ }
        ) as WebpackContext
    );
}

function loadChangeStatusUserModalTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-commons/dist',
            { recursive: true, regExp: /ib-modal-change-status-user-modal\.html/ }
        ) as WebpackContext
    );
}

function loadOtpModalTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-commons/dist',
            { recursive: true, regExp: /ib-ui-otp-modal-view\.html/ }
        ) as WebpackContext
    );
}

function loadOtpErrorModalTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-commons/dist',
            { recursive: true, regExp: /ib-ui-otp-modal-error-view\.html/ }
        ) as WebpackContext
    );
}

function loadMenusTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-menus/dist',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        ) as WebpackContext
    );
}

function loadAncillariesTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-ancillaries/dist',
            { recursive: true, regExp: /ib-ancillaries-view\.html/ }
        ) as WebpackContext
    );
}

function loadPaymentsViewTemplates (): TemplateModule[] {
    return requireAll(
        import.meta.webpackContext(
            '../node_modules/ib-web-payments/dist',
            { recursive: true, regExp: /ib-pmt-view\.html/ }
        ) as WebpackContext
    );
}

function getAllTemplates (): TemplateModule[] {
    return [
        ...loadComponentsTemplates(),
        ...loadAppPagesTemplates(),
        ...loadGenericCompleteModalTemplates(),
        ...loadGenericInfoModalTemplates(),
        ...loadGenericLoginModalErrorTemplates(),
        ...loadGenericWaitModalTemplates(),
        ...loadGenericErrorModalTemplates(),
        ...loadGenericExternalModalTemplates(),
        ...loadModalLoadingPlaneTemplates(),
        ...loadUiLoadingViewTemplates(),
        ...loadLoginReusableIframeTemplates(),
        ...loadPrefixCityTemplates(),
        ...loadLoginIframeTemplates(),
        ...loadAviosSummaryTemplates(),
        ...loadAviosSummaryBannerTemplates(),
        ...loadExpiryDatesSelectTemplates(),
        ...loadModalSessionTemplates(),
        ...loadPrefixCityViewTemplates(),
        ...loadChangeStatusUserModalTemplates(),
        ...loadOtpModalTemplates(),
        ...loadOtpErrorModalTemplates(),
        ...loadMenusTemplates(),
        ...loadAncillariesTemplates(),
        ...loadPaymentsViewTemplates()
    ];
}

angular.module('web-checkin-templates', []).run([
    '$templateCache',
    ($templateCache) => {
        getAllTemplates().forEach(val => {
            $templateCache.put(val.name, val.tpl);
        });
    }
]);