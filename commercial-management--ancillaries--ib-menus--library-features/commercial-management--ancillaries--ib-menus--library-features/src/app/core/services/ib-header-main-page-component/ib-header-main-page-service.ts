@Service('ib-header-main-page-component-module', ['localStorageService', 'ibHeaderMainPageConstants', '$rootScope', '$filter', 'CommonsUserUtilsService'])
class ibHeaderMainPageServiceModel {
    private viewInfo: ibHeaderMainPage.MainInfo;
    constructor (
        private localStorageService: angular.local.storage.ILocalStorageService,
        private ibHeaderMainPageConstants: ibHeaderMainPageNameSpace.ibHeaderMainPageConstants,
        private $rootScope: CommonsRootScope,
        private $filter: angular.IFilterService,
        private CommonsUserUtilsService: CommonsUserUtilsService
    ) { }

    initializeMainPageHeader = (): ibHeaderMainPage.MainInfo => {
        const lenguageList: Array<ibHeaderMainPage.lenguageList> = this.ibHeaderMainPageConstants.languagesWcs[this.$rootScope.appMarket.toLowerCase()];
        const marketList: Array<ibHeaderMainPage.marketList> = this.ibHeaderMainPageConstants.marketsWcs;
        const loggedInfo: ibHeaderMainPage.loggedInfo = this.getCustomerData();
        this.viewInfo = {
            customerData: loggedInfo.customerData,
            languages: lenguageList,
            markets: marketList,
            selectedLanguage: this.$filter('filter')(lenguageList, ((lenguageList: ibHeaderMainPage.lenguageList): boolean => { return lenguageList.code === this.$rootScope.appLang; }))[0],
            selectedMarket: this.$filter('filter')(marketList, ((marketsList: ibHeaderMainPage.marketList): boolean => { return marketsList.code === this.$rootScope.appMarket; }))[0],
            marketLabel: this.$filter('filter')(this.ibHeaderMainPageConstants.marketsWcs, ((marketsList): boolean => { return marketsList.code === this.$rootScope.appMarket; }))[0].description,
            logged: loggedInfo.isLogged
        };
        return this.viewInfo;
    };

    private getCustomerData = (): ibHeaderMainPage.loggedInfo => {
        const response: ibHeaderMainPage.loggedInfo = { customerData: null, isLogged: null };

        if (this.CommonsUserUtilsService.isSoftUser()) {
            return response;
        }

        const CustomerInfo: any = this.localStorageService.get('customerData');
        // ONB info
        const MembershipInfo: any = this.localStorageService.get('membershipData');
        const isIbZero = this.CommonsUserUtilsService.isIbZero();

        if (CustomerInfo) {
            return {
                customerData: {
                    name: `${CustomerInfo.personalInfo.name || CustomerInfo.personalInfo.contactEmail} ${CustomerInfo.personalInfo.surname1}`.trim(),
                    avios: !isIbZero ? CustomerInfo.generalInfo.aviosTransformed : null
                },
                isLogged: true
            };
        }

        if (MembershipInfo) {
            const userInfo = MembershipInfo.userInfo;
            return {
                customerData: {
                    name: `${userInfo.firstName || userInfo.email} ${userInfo.lastName || ''}`.trim(),
                    avios: null
                },
                isLogged: true
            };
        }

        return response;
    };
}