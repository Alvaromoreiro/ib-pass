xdescribe('AdvancedHeaderSearchService test', () => {
    let service,localStorageService;
    const fakeCabinTypeService = {
        fakeSuccessResponse: true,
        getCabinTypes: jasmine.createSpy('getCabinTypes').and.callFake(()=>{
            return fakeCabinTypeService.fakeSuccessResponse? Promise.resolve(): Promise.reject('error');
        })
    };
    const fakeGetDestinationsService = {
        fakeSuccessResponse: true,
        getDestinationAreasCitiesList: jasmine.createSpy('getDestinationAreas').and.callFake(()=>{
            return fakeGetDestinationsService.fakeSuccessResponse? Promise.resolve(): Promise.reject('error');
        })
    };
    const fakeAdvSearchTransformer = {
        createNewAdvancedSearch: jasmine.createSpy('createNewAdvancedSearch'),
        initializeCabinsModel: jasmine.createSpy('initializeCabinsModel'),
        initializeAreasModel: jasmine.createSpy('initializeAreasModel')

    };

    const fakePassengerConf = {origin:'LON',destination: '*'};
    const fakePassengerList =  {
        SENIOR: [fakePassengerConf],
        YOUNG: [fakePassengerConf],
        TEENAGER: [fakePassengerConf],
        specialPassengerMarket: 'ES'
    };
    const fakegetSpecialPassengerOriginDestinationListService = {
        fakeSuccessResponse: true,
        getSpecialPassengerOriginDestinationList: jasmine.createSpy('getSpecialPassengerOriginDestinationList').and.callFake(()=>{
            return fakegetSpecialPassengerOriginDestinationListService.fakeSuccessResponse? Promise.resolve([fakePassengerConf]) : Promise.reject('error');
        })
    };


    beforeEach(() => {
        fakeCabinTypeService.fakeSuccessResponse = true;
        fakeGetDestinationsService.fakeSuccessResponse= true;
        fakegetSpecialPassengerOriginDestinationListService.fakeSuccessResponse = true;
        angular.mock.module('ib-header-advanced-search-module', 'LocalStorageModule', ($provide) => {
            $provide.value('CabinTypesService', fakeCabinTypeService);
            $provide.value('GetDestinationsService', fakeGetDestinationsService);
            $provide.value('AdvancedSearchTransformer', fakeAdvSearchTransformer);
            $provide.value('getSpecialPassengerOriginDestinationListService', fakegetSpecialPassengerOriginDestinationListService);
        });
        inject((_AdvancedHeaderSearchService_, _localStorageService_) => {
            localStorageService = _localStorageService_;
            service = _AdvancedHeaderSearchService_;
        });
    });

    describe('TEST getCabinTypes' , ()=> {
        beforeEach(()=> {
            fakeAdvSearchTransformer.initializeCabinsModel = jasmine.createSpy('initializeCabinsModel');
        });
        it ('Resolve OK', (done) => {
            service.getCabinTypes()
                .then(()=> {
                    expect (fakeAdvSearchTransformer.initializeCabinsModel).toHaveBeenCalled();
                    done();
                })
                .catch(()=> {done.fail();});
        });
        xit ('Resolve KO', (done) => {
            fakeCabinTypeService.fakeSuccessResponse = false;
            service.getCabinTypes()
                .then(()=> {
                    done.fail();
                })
                .catch(()=> {
                    done();
                });
        });
    });
    describe('TEST getDestinationAreas' , ()=> {
        beforeEach(()=> {
            fakeAdvSearchTransformer.initializeAreasModel = jasmine.createSpy('initializeAreasModel');
        });
        it ('Resolve OK', (done) => {
            service.getDestinationAreas()
                .then(()=> {
                    expect (fakeAdvSearchTransformer.initializeAreasModel).toHaveBeenCalled();
                    done();
                })
                .catch(()=> {
                    done.fail();
                });
        });
        xit ('Resolve KO', (done) => {
            fakeGetDestinationsService.fakeSuccessResponse = false;
            service.getDestinationAreas()
                .then(()=> {
                    done.fail();
                })
                .catch((error) => {
                    done();
                });
        });
    });
    it('Test createRequestNewAdvancedSearch', (done) => {
        service.createRequestNewAdvancedSearch();
        expect(fakeAdvSearchTransformer.createNewAdvancedSearch).toHaveBeenCalled();
        done();
    });
    describe('TEST getSpecialPassengerOriginDestination' , ()=> {
        it ('Resolve OK', (done) => {
            localStorageService.remove('specialPassengersByMarketList');
            service.getSpecialPassengerOriginDestination('ES')
                .then((data)=> {
                    expect(data).toEqual(fakePassengerList);
                    done();
                })
                .catch((err)=> {
                    done.fail();
                });
        });
        xit ('Resolve KO', (done) => {
            localStorageService.remove('specialPassengersByMarketList');
            fakegetSpecialPassengerOriginDestinationListService.fakeSuccessResponse = false;
            service.getSpecialPassengerOriginDestination('ES')
                .then(()=> {
                    done.fail();
                })
                .catch(()=> {
                    done();
                });
        });
        it ('Resolve with LocalStorage Value', (done) => {
            localStorageService.set('specialPassengersByMarketList', fakePassengerList);
            fakegetSpecialPassengerOriginDestinationListService.fakeSuccessResponse = false;
            service.getSpecialPassengerOriginDestination('ES')
                .then((data)=> {
                    expect(data).toEqual(fakePassengerList);
                    done();
                })
                .catch(()=> {
                    done.fail();
                });
        });
    });

});