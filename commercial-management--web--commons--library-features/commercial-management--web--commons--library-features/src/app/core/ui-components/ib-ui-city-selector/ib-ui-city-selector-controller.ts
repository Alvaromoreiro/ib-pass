@Component('ib-ui-city-selector-component-module', 'ibUiCitySelectorComponent', {
    bindings: {
        isCollapse: '=?',
        text: '<?',
        cssClass: '<?',
        citySelected: '=?',
        modelCities: '=?',
        containerForm: '=?',
        index: '<?',
        isOrigin: '<?',
        isOverflow: '<?',
        isLoading: '<?',
        search: '=?',
        simpleSelector: '=',
        showCodeOnInput: '<?',
        disabledInput: '=',
        hideWarning: '=?'
    },
    controllerAs: 'cityContr',
    templateUrl: ['$rootScope', ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-ui-city-selector-view.html`;
    }]
}, ['$scope', '$timeout', '$window', 'CitySelectorConstants', '$element'], [])
class CitySelectorComponentController implements ng.IController {
    public isCollapse: boolean;
    public text: any;
    public cssClass: any;
    public citySelected: any;
    public modelCities: any;
    public containerForm: any;
    public index: number;
    public isOrigin: boolean;
    public isOverflow: boolean;
    public search: any;
    public simpleSelector:boolean =false;
    public showCodeOnInput: boolean = false;
    public focused = false;
    public letterSelected = this.CitySelectorConstants.LEETERS.ALL;
    public filter = false;
    public loadingFilter = false;
    public alphabet = this.CitySelectorConstants.ALPHABET;
    public isOpen = true;
    public group: any;
    public active = false;
    public disabledInput: boolean;

    constructor (
        private $scope: ng.IScope,
        private $timeout: ng.ITimeoutService,
        private $window: ng.IWindowService,
        private CitySelectorConstants: CitySelectorConstantsNamespace.CitySelectorConstants,
        private $element
    ) {
        this.$scope.$on('$destroy', () => {
            this.$element[0].removeEventListener('selectCityResponsive', this.selectCityResponsiveHandler);
        });
    }

    $onInit () {
        this.isOpen = false;
        this.$element[0].addEventListener('selectCityResponsive', this.selectCityResponsiveHandler);

        angular.element(this.$window).on('resize', () => {
            if (this.$window.innerWidth < 1024) {
                this.isOpen = false;
            }
        });
    }

    selectCityResponsiveHandler = (event: CustomEvent) =>{
        this.citySelected = event.detail.citySelected;
        this.isOpen = false;
        this.updateSelection();
        if(this.search!==undefined) { this.search(this.citySelected.code); }
    };

    enableFocus = () => {
        this.focused = true;
        angular.element('.ib-autocomplete').removeClass('ib-autocomplete--hide');
    };

    disableFocus = () => {
        this.focused = false;
        angular.element('.ib-autocomplete').addClass('ib-autocomplete--hide');
    };

    updateSelection = () => {
        const type = this.isOrigin ? this.CitySelectorConstants.ORIGIN : this.CitySelectorConstants.DESTINY;
        this.$scope.$emit('citySelectorType', type);
        this.$scope.$emit('updateSelectedCity', this.citySelected, this.index);
    };

    changeLetter = (letter: string) => {
        this.letterSelected = letter;
    };

    validatorInput = () => {
        let isValid = false;
        if (this.citySelected) {
            isValid = angular.isObject(this.citySelected) && this.citySelected !== '';
        } else {
            isValid = false;
        }
        this.containerForm['selector_city_' + this.index].$setValidity('invalid', isValid);
        this.containerForm['selector_city_' + this.index].$submitted = true;
    };

    changeGroup = (event: angular.IAngularEvent, group: any) => {
        this.group = group;
        event.preventDefault();
    };

    filterGroup = (item) => {
        if(this.group===undefined) {
            return {group: this.group };
        } else {
            return item.group===this.group || item.group==='ALL_DESCRIPTION';
        }
    };

    focusPopup = (value: string): string => {
        const acData: any = angular.element('[data-input]:focus').val();
        const newValue: number = value.toLowerCase().indexOf(value.toLowerCase());
        return value.replace(value.substr(newValue, acData.length), '<strong class="bold">' + value.substr(newValue, acData.length) + '</strong>');
    };

    onSelect = () => {
        this.active = true;
        this.updateSelection();
        if(this.search!==undefined) { this.search(this.citySelected.code); }
    };

    selectCity = (event: angular.IAngularEvent, citySelected: any) => {
        event.preventDefault();
        event.stopPropagation();
        this.citySelected = citySelected;
        this.isOpen = false;
        this.validatorInput();
        this.updateSelection();
        if(this.search!==undefined) { this.search(this.citySelected.code); }
    };

    openCollapse = () => {
        if (this.$window.innerWidth < 1024)
            this.loadingFilter = true;
    };

    changeCountry = (group: any, event: angular.IAngularEvent) => {
        event.preventDefault();
        this.loadingFilter = false;
        this.$timeout(() => {
            this.$scope.$apply(() => {
                this.loadingFilter = true;
                this.group = group;
            });
        });
    };

    checkSpecialCharacters = (actual: string, expected: string): boolean => {
        if (angular.isString(actual)) {
            actual = this.removeAccents(actual.toLowerCase());
            expected = this.removeAccents(expected.toLowerCase());
        }
        return angular.isString(actual) && actual.indexOf(expected) !== -1;
    };

    removeAccents = (value: string): string => {
        return value.replace(/[áàâä]/g, 'a')
            .replace(/[éèêë]/g, 'e')
            .replace(/[íìîï]/g, 'i')
            .replace(/[óòôö]/g, 'o')
            .replace(/[úùûü]/g, 'u');
    };

    filterValue = (city: any): boolean => {
        const regex = new RegExp('' + this.citySelected, 'i');
        return regex.test(city.description) || regex.test(city.code);
    };
    onChange = (): void => {
        if(this.search!==undefined && !this.citySelected) { this.search(); }
    };
}