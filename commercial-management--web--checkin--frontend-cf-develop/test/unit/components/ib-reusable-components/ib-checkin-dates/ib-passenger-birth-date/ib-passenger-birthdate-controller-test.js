describe('PassengerCkiBirthDateController Test', function () {

    var controller, localStorageService, rootScope, scope;

    var controllerDependencies = {
        '$scope': {},
        'localStorageService': {}
    };

    var fakeConfig = {
        DAYS_ARRAY: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18',
            '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
        MONTH_ARRAY: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        DEFAULT_TO_YEARS: 100,
        DEFAULT_FROM_YEARS: 0,
        ACTIVE_YEARS:['2020'],
        AVAILABLE_YEARS:['2020','2021']
    };

    var birthDate = {
        'day': '13',
        'month': '11',
        'year': '1993'
    }

    beforeEach(function () {
        angular.mock.module('LocalStorageModule', 'ib-passenger-cki-birth-date-module', function ($provide) {
            $provide.value('CheckinDatesConstants', fakeConfig);
        });
        inject(function ($rootScope, $controller, _localStorageService_) {
            localStorageService = _localStorageService_;
            rootScope = $rootScope;
            scope = $rootScope.$new();

            controller = $controller('PassengerCkiBirthDateController', {
                '$scope': scope,
                'localStorageService': localStorageService,
            });
            scope.$digest();
        });
    });

    describe('when call active and simple functions', function () {
        it('Gets birthDate from LocalStorageService', function (done) {
            localStorageService.set('birthDate', {
                'day': '13',
                'month': '11',
                'year': '1993'
            });
            var fakeBirthDate = localStorageService.get('birthDate');
            controller.$onInit();
            expect(birthDate).toEqual(fakeBirthDate);
            done();
        });
        it('Gets birthDate from LocalStorageService and have a literal', function (done) {
            localStorageService.set('birthDate','1993-11-13');
            var fakeBirthDate = localStorageService.get('birthDate');
            controller.$onInit();
            done();
        });
        it('Called daysSelected', function (done) {

            controller.daysSelected();
            scope.$digest();
            done();
        });
    });

    describe('Called monthsSelected', function () {

        it('Called monthsSelected first if', function (done) {
            controller.availableMonths=fakeConfig.MONTH_ARRAY;
            controller.availableYears=fakeConfig.ACTIVE_YEARS;
            controller.availableDays = fakeConfig.DAYS_ARRAY;
            controller.month = '12';
            controller.year = '2020';
            var currentDate = new Date();
            controller.day = currentDate.getDate() + 1,
            controller.monthsSelected();
            scope.$digest();
            done();
        });

        it('Called monthsSelected second if', function (done) {
            controller.availableMonths=fakeConfig.MONTH_ARRAY;
            controller.availableYears=fakeConfig.ACTIVE_YEARS;
            controller.availableDays = fakeConfig.DAYS_ARRAY;
            controller.month = '01';
            controller.year = '2020';
            var currentDate = new Date();
            controller.day = currentDate.getDate() + 1,
            controller.monthsSelected();
            scope.$digest();
            done();
        });

        it('default else', function (done) {
            controller.availableMonths=fakeConfig.MONTH_ARRAY;
            controller.day ='32';
            controller.monthsSelected();
            scope.$digest();
            done();
        });

    });
    describe('Called yearsSelected', function () {

        it('first if', function (done) {
            controller.availableYears=fakeConfig.ACTIVE_YEARS;
            controller.availableMonths=fakeConfig.MONTH_ARRAY;
            controller.year = '2020';
            var currentDate = new Date();
            controller.month = currentDate.getMonth() + 2,
            controller.yearsSelected();
            scope.$digest();
            done();
        });

        it('second if', function (done) {
            controller.availableYears=fakeConfig.AVAILABLE_YEARS;
            controller.availableMonths=fakeConfig.MONTH_ARRAY;
            controller.year = '2021';
            var currentDate = new Date();
            controller.month = currentDate.getMonth() -2;
            controller.yearsSelected();
            scope.$digest();
            done();
        });

        it('default else', function (done) {
            controller.availableYears=fakeConfig.ACTIVE_YEARS;
            controller.availableMonths=fakeConfig.MONTH_ARRAY;
            controller.yearsSelected();
            scope.$digest();
            done();
        });

    });
    describe('When Called controlBirthDate', function () {
        beforeEach(inject(function () {
            controllerDependencies.$scope = rootScope.$new();
            controllerDependencies.$scope.$digest();
            rootScope.$broadcast('controlBirthDate');
        }));
        it('Called controlBirthDate function', function (done) {
            expect(controller.day).toBe('');
            expect(controller.month).toBe('');
            expect(controller.year).toBe('');
            done();
        });
    });


});
