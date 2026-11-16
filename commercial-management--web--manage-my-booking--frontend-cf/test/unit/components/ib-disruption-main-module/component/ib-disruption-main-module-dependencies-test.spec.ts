describe('ib-disruption-main-module dependencies', function () {
    it('should include ib-disruption-passenger-rights-module', function () {
        var dependencies = angular.module('ib-disruption-main-module').requires;

        expect(dependencies).toContain('ib-disruption-passenger-rights-module');
    });
});
