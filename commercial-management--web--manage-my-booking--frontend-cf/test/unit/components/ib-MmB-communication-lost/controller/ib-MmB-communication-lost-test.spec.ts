describe ('MmBCommunicationLostComponent test', function () {
    var controller, scope, window;

    var mocks = {
        MmBCommunicationLostService: {
            fakeLostCommInfo: {
                'communicationLostInfo': 'testInfo',
                'relatedContent': 'testContent'
            },
            getCommunicationLostInfo: jasmine.createSpy().and.callFake( function (){
                return mocks.MmBCommunicationLostService.fakeLostCommInfo;
            })
        },
        window: {
            print: jasmine.createSpy(),
        }
    };

    beforeEach(function () {
        angular.mock.module('ib-MmB-communication-lost-module', function($provide){
            $provide.value('MmBCommunicationLostService', mocks.MmBCommunicationLostService);
            $provide.value('$window', mocks.window);
        });
        inject(function ($componentController, $window, $rootScope) {
            scope = $rootScope.$new();
            window = $window;
            controller = $componentController('ibMmbCommunicationLost');
            scope.$digest();
        });
    });

    describe('When activate() is called', function (){
        it ('Should initiate component model', function (done) {
            controller.$onInit();
            expect(controller.model).toEqual(mocks.MmBCommunicationLostService.fakeLostCommInfo);
            done();
        })
    });

    describe('When printSummary() is called', function (){
        it ('Should call window print', function (done) {
            controller.printSummary();
            expect(mocks.window.print).toHaveBeenCalled();
            done();
        })
    });
});
