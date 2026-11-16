import angular from 'angular';
import 'ib-web-payments';

angular.module('ib-web-payments-templates', []).run(['$templateCache', ($templateCache) => {

    function requireAll (requireContext) {
        return requireContext.keys().map(val => {
            return {
                tpl: requireContext(val), // tpl will hold the value of your html string
                name: `web-manage-my-booking/templates/${val.split('/').pop()}` //name is just the filename
            };
        });
    }

    const modules = requireAll(
        import.meta.webpackContext(
            '../../node_modules/ib-web-payments/dist',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
            )
        );

    modules.forEach(val => {
        $templateCache.put(val.name, val.tpl);
    });
}]);
