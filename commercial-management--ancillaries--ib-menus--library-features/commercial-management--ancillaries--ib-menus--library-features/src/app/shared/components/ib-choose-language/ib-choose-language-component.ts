import angular from 'angular';

const componentOptions = {
    controller: 'IbChooseLanguageController',
    controllerAs: 'ibChooseLanguageCtrl',
    bindings: {},
    templateUrl: [
        '$rootScope',
        '$attrs',
        function ($rootScope: CommonsRootScope, $attrs) {
            return (
                $rootScope.routes.templates +
        ($attrs.template || 'ib-choose-language-view.html')
            );
        }
    ]
};
const componentInfo = {
    module: 'ib-choose-language-module',
    selector: 'ibChooseLanguageComponent',
    inject: [
        'ibHeaderMainPageConstants',
        '$rootScope',
        '$filter',
        'localStorageService',
        '$window'
    ],
    required: []
};

export type dataList = {
    code: string;
    description: string;
};
export type ChangeLanguage = {
    languages: Array<dataList>;
    markets: Array<dataList>;
    selectedLanguage: dataList;
    selectedMarket: dataList;
};

export class IbChooseLanguageController implements ng.IController {
    private model: ChangeLanguage = {
        languages: null,
        markets: null,
        selectedLanguage: null,
        selectedMarket: null
    };

    constructor (
        private ibHeaderMainPageConstants: ibHeaderMainPageNameSpace.ibHeaderMainPageConstants,
        private $rootScope: CommonsRootScope,
        private $filter: angular.IFilterService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private $window: ng.IWindowService
    ) {}

    $onInit (): void {
        this.model.markets = this.ibHeaderMainPageConstants.marketsWcs;
        this.model.languages = this.getLanguage();
        this.model.selectedMarket = this.$filter('filter')(
            this.model.markets,
            (marketsList: ibHeaderMainPage.marketList): boolean => {
                return marketsList.code === this.$rootScope.appMarket;
            }
        )[0];
        this.model.selectedLanguage = this.$filter('filter')(
            this.model.languages,
            (lenguageList: ibHeaderMainPage.lenguageList): boolean => {
                return lenguageList.code === this.$rootScope.appLang;
            }
        )[0];
    }

    getLanguage = (marketCode?: string) => {
        marketCode = marketCode ? marketCode : this.$rootScope.appMarket;
        return this.ibHeaderMainPageConstants.languagesWcs[marketCode.toLowerCase()];
    };

    changeLanguage = () => {
        const urlParams: any = this.localStorageService.get('urlParams');
        const exclude = ['language', 'market'];
        let controlledURLPath: string = '';
        for (const key in urlParams) {
            if (urlParams[key] !== null && !exclude.includes(key)) {
                switch (key) {
                        case 'travelAgencies':
                            controlledURLPath += '&ckiParaAAVV=' + urlParams[key];
                            break;
                        case 'reInvoicing':
                            controlledURLPath += '&undoCKI=' + urlParams[key];
                            break;
                        default:
                            controlledURLPath += '&' + key + '=' + urlParams[key];
                            break;
                }
            }
        }
        const paramLanguage: string = `?language=${this.model.selectedLanguage.code}`;
        const paramMarket: string = `&market=${this.model.selectedMarket.code.toLowerCase()}`;
        this.$rootScope.$broadcast('languageChangedEvent');
        this.$window.location.href = `${this.$window.location.origin}${this.$window.location.pathname}${paramLanguage}${paramMarket}${controlledURLPath}${this.$window.location.hash}`;
    };

    changeLanguageForMarketSelector = () => {
        const selectedMarketCode = this.model.selectedMarket.code.toLowerCase();
        this.model.languages = this.getLanguage(selectedMarketCode);
        this.model.selectedLanguage = this.model.languages[0];
    };
}

try {
    const mod = angular.module(componentInfo.module);
    IbChooseLanguageController.$inject = componentInfo.inject;
    mod.component(
        componentInfo.selector,
        angular.extend(componentOptions, { controller: IbChooseLanguageController })
    );
} catch (error) {
    const mod = angular.module(componentInfo.module, componentInfo.required);
    IbChooseLanguageController.$inject = componentInfo.inject;
    mod.component(
        componentInfo.selector,
        angular.extend(componentOptions, { controller: IbChooseLanguageController })
    );
}
