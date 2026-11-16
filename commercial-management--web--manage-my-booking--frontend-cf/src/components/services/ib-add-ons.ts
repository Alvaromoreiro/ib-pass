@Service(
    'ib-MmB-services-module',
    ['$rootScope', '$window', 'MmBAppConstants'],
    []
)   
export class AddOnService {

    private googletag = this.$window.googletag = this.$window.googletag || {};
    private idAddOn;

    constructor (
        private $rootScope: any,
        private $window: angular.IWindowService,
        private MmBAppConstants) {
        this.googletag.cmd = this.googletag.cmd || [];
    }

    //Function that adds  
    initAddOn = () => {
        this.googletag.cmd.push(() => {
            this.googletag.defineSlot(this.$rootScope.GOOGLE_ADS_URIS.TYPE_0, [[728, 90]], this.$rootScope.BANNER_IDS.TYPE_0).addService(this.googletag.pubads());
            this.googletag.defineSlot(this.$rootScope.GOOGLE_ADS_URIS.TYPE_1, [[300, 250]], this.$rootScope.BANNER_IDS.TYPE_1).addService(this.googletag.pubads());
            this.googletag.defineSlot(this.$rootScope.GOOGLE_ADS_URIS.TYPE_2, [[300, 600]], this.$rootScope.BANNER_IDS.TYPE_2).addService(this.googletag.pubads());
            this.googletag.defineSlot(this.$rootScope.GOOGLE_ADS_URIS.TYPE_3, [[160, 600]], this.$rootScope.BANNER_IDS.TYPE_3).addService(this.googletag.pubads());
            this.googletag.pubads().setTargeting('ib-lang', '"' + this.MmBAppConstants.lang + '"');
            this.googletag.pubads().enableSingleRequest();
            this.googletag.pubads().collapseEmptyDivs();
            this.googletag.enableServices();
            this.googletag.pubads().addEventListener('slotRenderEnded', (event) => {
                if (event.slot.getSlotElementId() === this.idAddOn) {
                    this.$rootScope.$emit('bannerRenderedEvent', !event.isEmpty);
                }
            });
        });
    };

    displayAddOn = (idAddOnRendered) => {
        this.googletag.pubads().refresh();
        this.idAddOn = idAddOnRendered;
        this.googletag.cmd.push(() => {
            this.googletag.display(this.idAddOn);
        });
    };

    clearAddOns = () => {
        this.googletag.pubads().clear();
    };
}