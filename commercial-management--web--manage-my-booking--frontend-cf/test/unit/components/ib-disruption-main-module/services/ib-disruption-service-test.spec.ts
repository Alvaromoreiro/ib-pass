describe('test for ib-disruption-service', () => {
    let IbDisruptionService;
    let $rootScope;
    let $q;
  
    const fakeCallAvailabilityflexibleService = {
      getAvailabilityFlexible: jasmine.createSpy('getAvailabilityFlexible').and.callFake(data => {
        const deferred = $q.defer();
        if (data) {
          deferred.resolve('OK');
        } else {
          deferred.reject('KO');
        }
        return deferred.promise;
      }),
    };
  
    beforeEach(() => {
      angular.mock.module('ib-disruption-main-module', 'ib-MmB-services-module', 'LocalStorageModule', $provide => {
        $provide.value('CallAvailabilityflexibleService', fakeCallAvailabilityflexibleService);
      });
  
      inject((_IbDisruptionService_, _$q_, _$rootScope_) => {
        IbDisruptionService = _IbDisruptionService_;
        $rootScope = _$rootScope_;
        $q = _$q_;
      });
    });
  
    describe('test for IbDisruptionService', () => {
      it('should be defined', () => {
        expect(IbDisruptionService).toBeDefined();
      });
    });
  
    describe('when callGetAvailability is called with true', () => {
        it('should call CallAvailabilityflexibleService and resolve', (done) => {
          const data = true;
          IbDisruptionService.callGetAvailability(data).then((response) => {
            expect(fakeCallAvailabilityflexibleService.getAvailabilityFlexible).toHaveBeenCalledWith(data);
            expect(response).toEqual('OK');
            done();
          });
          $rootScope.$digest();
        });
      });
      
  
      describe('when callGetAvailability is called with false', () => {
        it('should call CallAvailabilityflexibleService and reject', (done) => {
          const data = false;
          IbDisruptionService.callGetAvailability(data).then(() => {
            done.fail('The promise should not be resolved');
          }, (error) => {
            expect(error).toEqual('KO');
            expect(fakeCallAvailabilityflexibleService.getAvailabilityFlexible).toHaveBeenCalledWith(data);
            done();
          });
          $rootScope.$digest();
        });
      });
      
  });
  