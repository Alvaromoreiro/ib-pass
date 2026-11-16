describe ('MmBCommunicationLostService test', function (){
    var service;

    var localStorageObj = {
        issueOrderInfo: { testIssueOrder: true},
        creditCardTypes: { testCreditCardTypes: true}
    }

    var mocks = {
        localStorageService: {
            get : function (key) {
                return localStorageObj[key];
            }
        },
        MmBCommunicationLostTransformer: {
            generateCommunicationLostInfo: jasmine.createSpy()
        }
    }

    beforeEach(function () {
        angular.mock.module('ib-MmB-communication-lost-module', function($provide){
            $provide.value('localStorageService', mocks.localStorageService);
            $provide.value('MmBCommunicationLostTransformer', mocks.MmBCommunicationLostTransformer);
        });
        inject(function (_MmBCommunicationLostService_) {
            service = _MmBCommunicationLostService_;
        });
    });
    describe('When getCommunicationLostInfo() is called', function (){
        it ('Shold call to transformer passing some localstorage info', function (done) {
            service.getCommunicationLostInfo();
            expect(mocks.MmBCommunicationLostTransformer.generateCommunicationLostInfo)
                .toHaveBeenCalledWith(localStorageObj.issueOrderInfo, localStorageObj.creditCardTypes);
            done();
        })
    });
});
