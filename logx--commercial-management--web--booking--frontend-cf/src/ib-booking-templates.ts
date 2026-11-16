import * as angular from 'angular';
//import 'ib-web-ancillaries/templates';

interface TemplateModule {
    tpl: string;
    name: string;
}

export type WebpackContext = {
    keys(): string[];
    (id: string): string;
};

function requireAllTemplates (requireContext: WebpackContext): TemplateModule[] {
    return requireContext.keys().map(val => ({
        tpl: requireContext(val),
        name: `web-booking/templates/${val.split('/').pop()}`
    }));
}

function loadSharedTemplates (): WebpackContext {
    return import.meta.webpackContext(
        'src/app/shared',
        {
            recursive: true,
            regExp: /^(?:(?!\.component).)*\.html$/
        }
    ); 
}


function loadWebCommonsTemplates (): WebpackContext {
    return import.meta.webpackContext(
        'node_modules/ib-web-commons/dist',
        { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
    ); 
}


function loadOtpModalTemplates (): WebpackContext {
    return import.meta.webpackContext(
        'node_modules/ib-web-commons/dist',
        { recursive: true, regExp: /ib-ui-otp-modal-view\.html/ }
    ); 
    
}

function loadOtpErrorModalTemplates (): WebpackContext {
    return import.meta.webpackContext(
        'node_modules/ib-web-commons/dist',
        { recursive: true, regExp: /ib-ui-otp-modal-error-view\.html/ }
    ); 
}

const rulesMap: (() => WebpackContext)[] = [
    loadSharedTemplates,
    loadWebCommonsTemplates,
    loadOtpModalTemplates,
    loadOtpErrorModalTemplates
];


export const importAJSTemplatesToWebpackContext = (moduleName: string, webpackContexts: WebpackContext[]) => {
    try {
        angular.module(moduleName);
    } catch (error) {
        angular.module(moduleName, []).run([
            '$templateCache',
            ($templateCache: angular.ITemplateCacheService) => {
                webpackContexts.forEach((context: WebpackContext) => {
                    requireAllTemplates(context).forEach((template: TemplateModule) => {
                        $templateCache.put(template.name, template.tpl);
                    });
                });
            }
        ]);
    }
};



importAJSTemplatesToWebpackContext('web-booking-templates', rulesMap.map(rule => rule()));

