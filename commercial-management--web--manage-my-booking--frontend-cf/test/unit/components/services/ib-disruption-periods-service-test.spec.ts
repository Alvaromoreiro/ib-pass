describe('DisruptionPeriodsService Test', function () {
    var mockResponse = 'Ok';
    var DisruptionPeriodsService, rootScope, q, localStorageService, $scope;
    var bookingInfo = { 'genericDisruptionCapabilitiesInformation': {'id': 1},
                      'flexibilizationCapabilitiesInformation': {'id': 1},
                      'flowId' :'TWFuYWdlTXlCb29raW5nQElCNDg0YmI3YjQ5OTBkNDI4Zjg5Y2MyY2Y4NGExYTkzMDM%3D'
                    };


    var fakeDisruptionPeriodsProxy = { getGeneric: jasmine.createSpy() };

    var fakeCommonsNewHttpUtilsErrorService = {
        'controlError': jasmine.createSpy('controlError').and.callFake(function (error) {
            return error;
        })
    };

    var fakeMmBUtilsErrorService = {
        processGeneralError: jasmine.createSpy(),
        processGeneralErrorWithProperties: jasmine.createSpy(),
        unauthorizedError: jasmine.createSpy(),
        internalServerError: jasmine.createSpy(),
        customErrorNameCorrection: jasmine.createSpy(),
    };

    var MmBAppConstantsFake = {};

    beforeEach(function () {
        angular.mock.module('ib-MmB-services-module', 'LocalStorageModule', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeDisruptionPeriodsProxy);
            $provide.value('MmBAppConstants', MmBAppConstantsFake);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('MmBUtilsErrorService', fakeMmBUtilsErrorService);
        });
        inject(function ($rootScope, _DisruptionPeriodsService_, $q, _localStorageService_) {
            DisruptionPeriodsService = _DisruptionPeriodsService_;
            rootScope = $rootScope;
            $scope = $rootScope.$new();
            q = $q;
            localStorageService = _localStorageService_;
            localStorageService.clearAll();
            localStorageService.set('bookingInfo', bookingInfo);
        });
    });

   describe('when getDisruptionPeriods() is called', function () {
         beforeEach(inject(function ($q) {
             fakeDisruptionPeriodsProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                 var deferred = $q.defer();
                 deferred.resolve(mockResponse);
                 return deferred.promise;
             });
         }));

       it('should genericDisruptionCapabilitiesInformation exist', function () {
          var disruptionID;
          bookingInfo.genericDisruptionCapabilitiesInformation.id = 1;
          disruptionID = bookingInfo.genericDisruptionCapabilitiesInformation.id;

          expect(bookingInfo.genericDisruptionCapabilitiesInformation).toBeDefined();
          expect(bookingInfo.genericDisruptionCapabilitiesInformation.id).toBeDefined();
          expect(disruptionID).toEqual(1);
       });
       it('should flexibilizationCapabilitiesInformation exist', function () {
           var disruptionID;
           bookingInfo.flexibilizationCapabilitiesInformation.id = 1;
           disruptionID = bookingInfo.flexibilizationCapabilitiesInformation.id;

          expect(bookingInfo.flexibilizationCapabilitiesInformation).toBeDefined();
          expect(bookingInfo.flexibilizationCapabilitiesInformation.id).toBeDefined();
          expect(disruptionID).toEqual(1);
       });
       it('should genericDisruptionCapabilitiesInformation exist', function (done) {

         expect(bookingInfo.genericDisruptionCapabilitiesInformation).toBeDefined();
         expect(bookingInfo.genericDisruptionCapabilitiesInformation.id).toBeDefined();

         DisruptionPeriodsService.getDisruptionPeriods().then(function (responseData) {
             localStorageService.clearAll();
             done();
         }, angular.noop);
         rootScope.$digest();

       });
       it('should flexibilizationCapabilitiesInformation exist', function (done) {

         expect(bookingInfo.flexibilizationCapabilitiesInformation).toBeDefined();
         expect(bookingInfo.flexibilizationCapabilitiesInformation.id).toBeDefined();

         DisruptionPeriodsService.getDisruptionPeriods().then(function (responseData) {
             localStorageService.clearAll();
             done();
         }, angular.noop);
         rootScope.$digest();

       });

   });

   describe('when getDisruptionPeriods Proxy rejects the promise ', function () {
       var mockError;

       beforeEach(inject(function ($q) {
           fakeDisruptionPeriodsProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
               var deferred = $q.defer();
               deferred.reject(mockError);
               return deferred.promise;
           });
           bookingInfo.genericDisruptionCapabilitiesInformation.id = 0;
       }));


       it('with 408 error code, should be returned error data', function () {
           mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };

           DisruptionPeriodsService.getDisruptionPeriods().then(angular.noop, function (responseError) {
               expect(responseError.errorCode).toEqual(408);
           });
           rootScope.$digest();
       });

       it('with 500 error code, should be returned error data', function () {
           mockError = { 'errorCode': 500, 'data': { 'errors': [{ 'reason': 'error' }] } };
           DisruptionPeriodsService.getDisruptionPeriods().then(angular.noop, function (responseError) {
               expect(responseError.errorCode).toEqual(500);
           });
           rootScope.$digest();
       });

       it('with non 401, 408 or 500 error code,should be returned procesed error', function () {
           mockError = { 'errorCode': 403, 'data': { 'errors': [{ 'reason': 'error' }] } };
           DisruptionPeriodsService.getDisruptionPeriods().then(angular.noop, function (responseError) {
               expect(responseError.errorCode).toEqual(403);
           });
           rootScope.$digest();
       });

   });

});
