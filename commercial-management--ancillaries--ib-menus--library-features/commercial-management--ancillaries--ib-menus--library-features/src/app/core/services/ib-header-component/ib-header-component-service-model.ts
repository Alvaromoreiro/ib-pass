
@Service('ib-header-component-module',
    ['localStorageService', 'rx'], ['rx'])
class ibHeaderComponentServiceModel {
    private model: MenusModel.MenuModel;
    private subject: any; // Rx.Subject<any> ;

    constructor (
        private localStorageService: angular.local.storage.ILocalStorageService,
        private rx: any
    ) {
        this.subject  = new this.rx.Subject();
    }

    saveModel = (model: MenusModel.MenuModel): void =>{
        this.model = model;
        this.subject.onNext(model);
        this.localStorageService.set('headerComponentModel', this.model);
        this.localStorageService.set('headerModel', this.model);
    };
    getSubscriptionToHeaderComponentModel = (handler: (data: MenusModel.MenuModel) => void) : MenusModel.MenuModel =>{
        return this.subject.subscribe(handler);
    };

    unSubscriptionToHeaderComponentModel = ():void =>{
        this.subject.unsubscribe();
    };

    getModelService = (): MenusModel.MenuModel =>{
        return this.model;
    };

    cleanModelService = (): void =>{
        this.model = null;
        this.localStorageService.remove('headerComponentModel');
    };

    saveGreyModelService = (greyBarModel: MenusModel.GreyBarModel): void =>{
        this.model.greyBarModel = greyBarModel;
        this.saveModel(this.model);
    };

    saveRedModelService = (redBarModel: MenusModel.RedBarModel): void =>{
        this.model.redBarModel = redBarModel;
        this.saveModel(this.model);
    };

    saveStepModelService = (stepsBarModel: MenusModel.StepsModel): void =>{
        this.model.stepBarModel = stepsBarModel;
        this.saveModel(this.model);
    };

    getGreyModelService = (): MenusModel.GreyBarModel =>{
        return this.model.greyBarModel;
    };

    getRedModelService = (): MenusModel.RedBarModel =>{
        return this.model.redBarModel;
    };

    getStepModelService = (): MenusModel.StepsModel =>{
        return this.model.stepBarModel;
    };

}