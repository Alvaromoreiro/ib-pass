describe('PassengersInfoModel test', () => {
    let PassengersInfoModel;
    beforeEach(() => {
        angular.mock.module('ib-MmB-passengers-info-module', () => {});
        inject((_PassengersInfoModel_) => {
            PassengersInfoModel = _PassengersInfoModel_;
        });
    });

    it('initializeModel exists', () => {
        expect(PassengersInfoModel.initializeModel).toBeDefined();
    })

    it('initializeModel its ok', () => {
        PassengersInfoModel.initializeModel();
        expect(PassengersInfoModel.passengersInfo).toEqual(null);
        expect(PassengersInfoModel.optionalInformation).toEqual(null);
        expect(PassengersInfoModel.indexTab).toEqual(null);
        expect(PassengersInfoModel.companies).toEqual(null);
    })
});
