@Service('ib-footer-component-module',
    ['localStorageService', 'rx'], ['rx'])
class ibFooterComponentServiceModel {
    private model: MenusModel.FooterModel;
    private subject: any; // Rx.Subject<any> ;

    constructor (
        private localStorageService: angular.local.storage.ILocalStorageService,
        private rx: any
    ) {
        this.subject  = new this.rx.Subject();
    }

    saveModel = (model: MenusModel.FooterModel): void =>{
        this.model = model;
        this.subject.onNext(model);
        this.localStorageService.set('footerComponentModel', this.model);
    };
    getSubscriptionToFooterComponentModel = (handler: (data: MenusModel.FooterModel) => void) : MenusModel.FooterModel =>{
        return this.subject.subscribe(handler);
    };

    unSubscriptionToFooterComponentModel = ():void =>{
        this.subject.unsubscribe();
    };

    getModelService = (): MenusModel.FooterModel =>{
        return this.model;
    };

    cleanModelService = (): void =>{
        this.model = null;
        this.localStorageService.remove('footerComponentModel');
    };

    getFooterYear = (): number =>{
        return new Date().getFullYear();
    };
}