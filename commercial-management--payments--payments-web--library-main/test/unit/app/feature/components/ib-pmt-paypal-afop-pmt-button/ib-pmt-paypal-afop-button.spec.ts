

xdescribe('Test of PayPalAfopButtonController', ()=>{
    //Elements of test
    let payPalAfopButtonController, rootScope;

    //Fakes and Spyes
    let fakePmtConstants ={};
    let fakeCommonsGenericProxy ={};
    let fake$Window = {};


    beforeEach(()=>{

        angular.mock.module('ib-pmt-paypal-afop-button-module', ($provide)=>{
            $provide.value('PmtConstants', fakePmtConstants);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('$window', fake$Window);

        });



        inject(($componentController, $rootScope:CommonsRootScope)=>{
            rootScope = $rootScope.$new();
            //$componentController(componentName, locals, [bindings], [ident]);
            payPalAfopButtonController = $componentController('pmtPaypalAfopButton', {
                $scope:rootScope.$scope,
                $rootScope :rootScope
            }, {});
            $rootScope.$apply();
        });

    });


    describe('the payPalAfopButtonController is initizalice', ()=>{

        it('', (done)=>{

            done();
        });

    });


});