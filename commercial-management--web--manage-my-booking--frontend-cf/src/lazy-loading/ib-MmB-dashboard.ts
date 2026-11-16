import angular from 'angular';
import 'ib-web-ancillaries';
import '../components/ib-MmB-booking-dashboard';
import '../components/ib-disruption-main';
import '../components/ib-MmB-health-form';

angular.module('ib-web-dashboard-templates', []).run(['$templateCache', ($templateCache) => {

    function requireAll (requireContext) {
        return requireContext.keys().map(val => {
            return {
                tpl: requireContext(val), // tpl will hold the value of your html string
                name: `web-manage-my-booking/templates/${val.split('/').pop()}` //name is just the filename
            };
        });
    }

    let modules = requireAll(
        import.meta.webpackContext(
            '../../node_modules/ib-web-ancillaries',
           { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
        )
    );

    modules = modules.concat(
        requireAll(
            import.meta.webpackContext(
                '../components/ib-MmB-booking-dashboard',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
            )
        )
    );

    modules = modules.concat(
        requireAll(
            import.meta.webpackContext(
                '../components/ib-MmB-health-form',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
            )
        )
    );

    modules = modules.concat(
        requireAll(
            import.meta.webpackContext(
                '../components/ib-disruption-main/components',
            { recursive: true, regExp: /^(?:(?!\.component).)*\.html$/ }
            )
        )
    );

    modules.forEach(val => {
        $templateCache.put(val.name, val.tpl);
    });
}]);
