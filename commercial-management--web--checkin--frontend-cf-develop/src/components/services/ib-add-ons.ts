@Service('ib-checkin-services-module',
    ['CheckinAppConstants', 'localStorageService', '$window', '$rootScope'])

class AddOnService {

    public googletag;
    public idAddOn;
    constructor (
        private CheckinAppConstants: CheckinAppConstants,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private $window: ng.IWindowService,
        private $rootScope: CommonsRootScope
    ) {
        this.googletag = this.$window.googletag = this.$window.googletag || {};
        this.googletag.cmd = this.googletag.cmd || [];
        this.idAddOn;
    }

    initAddOn = (): void => {
        this.googletag.cmd.push(() => {
            this.googletag.defineSlot(this.$rootScope.GOOGLE_ADS_URIS.TYPE_0, [[728, 90]], this.$rootScope.BANNER_IDS.TYPE_0).addService(this.googletag.pubads());
            this.googletag.defineSlot(this.$rootScope.GOOGLE_ADS_URIS.TYPE_1, [[300, 250]], this.$rootScope.BANNER_IDS.TYPE_1).addService(this.googletag.pubads());
            this.googletag.defineSlot(this.$rootScope.GOOGLE_ADS_URIS.TYPE_2, [[300, 600]], this.$rootScope.BANNER_IDS.TYPE_2).addService(this.googletag.pubads());
            this.googletag.defineSlot(this.$rootScope.GOOGLE_ADS_URIS.TYPE_3, [[160, 600]], this.$rootScope.BANNER_IDS.TYPE_3).addService(this.googletag.pubads());
            this.googletag.pubads().setTargeting('ib-lang', '"' + this.CheckinAppConstants.lang + '"');
            this.googletag.pubads().enableSingleRequest();
            this.googletag.pubads().collapseEmptyDivs();
            this.googletag.enableServices();
            this.googletag.pubads().addEventListener('slotRenderEnded', (event) => {
                if (event.slot.getSlotElementId() === this.idAddOn) {
                    this.$rootScope.$broadcast('bannerRenderedEvent', !event.isEmpty);
                }
            });
        });
    };
    displayAddOn = (idAddOnRendered):void =>{
        this.googletag.pubads().refresh();
        this.idAddOn = idAddOnRendered;
        this.googletag.cmd.push(() => {
            this.googletag.display(this.idAddOn);
        });
    };
    clearAddOns = ():void => {
        this.googletag.pubads().clear();
    };
}