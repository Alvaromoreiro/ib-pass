import { importAJSTemplatesToWebpackContext } from 'src/ib-booking-templates';
import type { WebpackContext } from 'src/ib-booking-templates';
function loadTemplates (): WebpackContext {
    return import.meta.webpackContext(
        'node_modules/ib-web-payments/dist',
        {
            recursive: true,
            regExp: /^(?:(?!\.component).)*\.html$/
        }
    ) ;
}


importAJSTemplatesToWebpackContext('ib-web-payments-templates', [loadTemplates()]);