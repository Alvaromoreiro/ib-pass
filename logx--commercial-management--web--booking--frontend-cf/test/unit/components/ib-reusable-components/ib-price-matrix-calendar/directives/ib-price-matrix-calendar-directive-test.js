describe('ibFlightsCalendar Directive test', function () {

    var element;
    var template = '<div class="ib-table-daily" ib-flights-calendar><table><thead><tr><td class="ib-table-daily__title"></td><th id="title-0-head">th</th></tr>' +
        '</thead><tbody><tr><th id="title-0-body"><span>th<span></th><td headers="title-0-head title-0-body">td</td>' +
        '</tr></tbody></table></div>';

    beforeEach(function () {
        angular.mock.module('ib-price-matrix-calendar');
        inject(function ($rootScope, $compile, $timeout) {
            var scope = $rootScope.$new();
            element = angular.element(template);
            $compile(element)(scope);
            scope.$digest();
            $timeout.flush();//link function is using a timeout
        });
    });

    describe('when mouseenter event is trigger', function () {
        it('th head and body should have ib-table-daily__title--hovered css class', function (done) {
            element.querySelectorAll('td:not(.ib-table-daily__col--empty):not(.ib-table-daily__title)').trigger('mouseenter');
            expect(element.querySelectorAll('#title-0-head').hasClass('ib-table-daily__title--hovered')).toBe(true);
            expect(element.querySelectorAll('#title-0-body').hasClass('ib-table-daily__title--hovered')).toBe(true);
            done();
        });
    });

    describe('when mouseleave event is trigger', function () {
        it('ib-table-daily__title--hovered css class should be removed from  th head and body', function (done) {
            element.querySelectorAll('#title-0-head').addClass('ib-table-daily__title--hovered');
            element.querySelectorAll('#title-0-body').addClass('ib-table-daily__title--hovered');
            element.querySelectorAll('td:not(.ib-table-daily__col--empty):not(.ib-table-daily__title)').trigger('mouseleave');
            expect(element.querySelectorAll('#title-0-head').hasClass('ib-table-daily__title--hovered')).toBe(false);
            expect(element.querySelectorAll('#title-0-body').hasClass('ib-table-daily__title--hovered')).toBe(false);
            done();
        });
    });

});