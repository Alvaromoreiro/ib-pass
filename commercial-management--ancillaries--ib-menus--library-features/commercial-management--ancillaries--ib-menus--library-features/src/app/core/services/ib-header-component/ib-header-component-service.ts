
@Service('ib-header-component-module',
    ['HeaderTransformer', 'ibGreyBarTransformer', 'StepsTransformer', 'ibHeaderComponentServiceModel'], [])
class IbHeaderComponentService {

    constructor (
        private HeaderTransformer: any,
        private ibGreyBarTransformer: any,
        private StepsTransformer: any,
        private ibHeaderComponentServiceModel: ibHeaderComponentServiceModel
    ) {

    }

    initializeHeader = (
        redBarModel: RedBarModel.RedBarRequest,
        greyBarModel: GreyBarModel.GreyBarRequest,
        stepsBarModel: StepBarModel.StepBarRequest
    ): void => {

        const model : MenusModel.MenuModel = {
            redBarModel: this.HeaderTransformer.initHeader(redBarModel),
            greyBarModel: this.ibGreyBarTransformer.initGreyBar(greyBarModel),
            stepBarModel: this.StepsTransformer.initSteps(stepsBarModel)
        };

        if (model.stepBarModel) {
            model.stepBarModel.steps = this.HeaderTransformer.addSteps(model.stepBarModel);
        }

        this.ibHeaderComponentServiceModel.saveModel(model);
    };

}