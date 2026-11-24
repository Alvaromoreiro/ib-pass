

xdescribe('Test of PmtCustomerCardsFeesService', ()=>{
    //Elements of test
    let pmtCustomerCardsFeesService, rootScope;

    //Fakes and Spyes
    let fakePmtConstants ={};
    let fakeCommonsGenericProxy ={};

    beforeEach(()=>{

        angular.mock.module('pmt-customer-cards-fees-service', ($provide)=>{
            $provide.value('PmtConstants', fakePmtConstants);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
        });


        inject((_PmtCustomerCardsFeesService_)=>{
            pmtCustomerCardsFeesService = _PmtCustomerCardsFeesService_;
        });
    });



    describe('the PmtCustomerCardsFeesService is initizalice', ()=>{

        it('', (done)=>{
            done();
        });

    });


});