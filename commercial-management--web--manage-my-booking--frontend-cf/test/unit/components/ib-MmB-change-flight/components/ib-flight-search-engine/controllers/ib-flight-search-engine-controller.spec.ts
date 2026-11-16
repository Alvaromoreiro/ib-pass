describe('ibFlightSearchEngine test', () => {
    let controller, $componentController, $rootScope, $scope, $timeout, el, element, template;

    let fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy()
    }

    let mockTranslateFilter = (value) => { }

    beforeEach(() => {
        angular.mock.module('ib-flight-search-engine-module', ($provide)=> {
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('translateFilter', mockTranslateFilter);
        });
        inject((_$componentController_, $filter, _$rootScope_, _$timeout_, $compile) => {
            $componentController = _$componentController_;
            $timeout = _$timeout_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $componentController('ibFlightSearchEngine', {
                $scope: $scope,
                $rootScope: $rootScope,
                $filter: $filter,
            });
            controller.flightSearchModel = {
                minDate: '16/10/2018',
                maxDate: '25/09/2020',
                daySelected: '25/09/2020',
                timeZoneSelected: 'es'
            }
            template = '<div class="ib-datepicker"><p>Texto</p></div>';
            element = angular.element(template);
            el = $compile(element)($scope);
            document.body.insertAdjacentHTML(
                'afterbegin',
                template);
            $scope.$apply();
        });
        controller.$onInit();
    });

    it('When activate() is called', (done) => {
        expect(fakeCommonsUtilService.setTitlePage).toHaveBeenCalledWith('MMB_TITLE_PAGE_AIR_SHUTTLE_SEARCH_NEW_FLIGHTS');
        done();
    });

    it('When changeDate() is called', (done) => {
        spyOn($rootScope, '$emit');
        controller.changeDate();
        expect($rootScope.$emit).toHaveBeenCalledWith('changeZoneList', controller.flightSearchModel.daySelected);
        done();
    });

    it('When sendSearchInfo() is called', (done) => {
        spyOn($rootScope, '$emit');
        let obj = {
            'selectedDay': controller.flightSearchModel.daySelected,
            'selectedTimeZone': controller.flightSearchModel.timeZoneSelected
        }
        controller.sendSearchInfo({$submitted: false, $valid: true});
        expect($rootScope.$emit).toHaveBeenCalledWith('daySelectedInfo' , obj);
        done();
    });

    it('When datePickerOpenedChange() is called and is true', (done) => {
        controller.datePickerOpenedChange(true, false);
        $timeout.flush();
        expect(controller.topClass).toEqual('ib-input__button--bottom');
        done();
    });

    it('When timeZoneComparator() is called', (done) => {
        let result = controller.timeZoneComparator(true, null);
        expect(result).toEqual(true);
        done();
    });

    it('When timeZoneComparator() is called when expected is test', (done) => {
        let result = controller.timeZoneComparator(true, 'test');
        expect(result).toEqual(false);
        done();
    });
});
