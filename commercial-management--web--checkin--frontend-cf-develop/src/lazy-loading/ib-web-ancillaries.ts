import angular from 'angular';
import 'ib-web-ancillaries';
import '@pages/ib-web-ancillaries';
import '@core/constants/ib-ancillaries-constants';

angular.module('ib-web-ancillaries-templates', []).run(['$templateCache', ($templateCache) => {

    function requireAll (requireContext) {
        return requireContext.keys().map(val => {
            return {
                tpl: requireContext(val), // tpl will hold the value of your html string
                name: `web-checkin/templates/${val.split('/').pop()}` //name is just the filename
            };
        });
    }

    const modules = requireAll(
        import.meta.webpackContext(
            '../../node_modules/ib-web-ancillaries/dist',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        )
    );

    modules.forEach(val => {
        $templateCache.put(val.name, val.tpl);
    });
}]);
