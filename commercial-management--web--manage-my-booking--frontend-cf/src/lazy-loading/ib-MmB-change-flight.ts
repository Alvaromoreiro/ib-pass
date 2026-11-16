import angular from 'angular';
import '../components/ib-MmB-change-flight';

angular.module('ib-MmB-change-flight-templates', []).run(['$templateCache', ($templateCache) => {

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
            '../components/ib-MmB-change-flight/components',
           { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        )
    );

    modules.forEach(val => {
        $templateCache.put(val.name, val.tpl);
    });
}]);