import { importAJSTemplatesToWebpackContext } from 'src/ib-booking-templates';
import type { WebpackContext } from 'src/ib-booking-templates';
function loadTemplates (): WebpackContext {
    return import.meta.webpackContext(
        './',
        {
            recursive: true,
            regExp: /^(?:(?!\.component).)*\.html$/
        }
    ) ;
}


importAJSTemplatesToWebpackContext('web-booking-availability-templates', [loadTemplates()]);