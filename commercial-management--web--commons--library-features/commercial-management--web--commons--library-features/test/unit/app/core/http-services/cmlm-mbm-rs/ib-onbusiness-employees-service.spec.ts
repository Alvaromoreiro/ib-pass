import * as angular from 'angular';
import 'angular-mocks';
import { IbCOnBusinessEmployeesService } from '../../../../../../src/app/core/http-services/cmlm-mbm-rs/ib-onbusiness-employees-service';

describe('IbCOnBusinessEmployeesService', () => {
  let service: IbCOnBusinessEmployeesService;
  let $q: any;
  let $rootScope: any;
  let CommonsHttpServicesConstants: any;
  let CommonsGenericProxy: any;
  let localStorageService: any;
  let CommonsHttpUtilsErrorService: any;

  beforeEach(() => {
    angular.mock.module('ib-commons-http-service-module');

    CommonsGenericProxy = jasmine.createSpyObj('CommonsGenericProxy', ['getGeneric']);
    CommonsHttpUtilsErrorService = jasmine.createSpyObj(
      'CommonsHttpUtilsErrorService', 
      ['returnProcessedError', 'unauthorizedError', 'timeOutError', 'processGeneralError']
    );
    CommonsHttpServicesConstants = {
      DEFAULT_ENDPOINTS: {
        onBusinessEmployeesURI: 'some-endpoint'
      }
    };

    angular.mock.module(($provide) => {
      $provide.value('CommonsGenericProxy', CommonsGenericProxy);
      $provide.value('CommonsHttpUtilsErrorService', CommonsHttpUtilsErrorService);
      $provide.value('CommonsHttpServicesConstants', CommonsHttpServicesConstants);
    });

    inject((_$q_, _$rootScope_) => {
      $q = _$q_;
      $rootScope = _$rootScope_;
    });

    localStorageService = jasmine.createSpyObj('localStorageService', ['set']);
    $rootScope.membershipData = {};

    service = new IbCOnBusinessEmployeesService(
      $q,
      CommonsHttpServicesConstants,
      CommonsGenericProxy,
      $rootScope,
      localStorageService,
      CommonsHttpUtilsErrorService
    );
  });

  it('should handle getOnBusinessEmployeesSuccess with provided employees data', (done) => {
    const employeesData = {
      data: [
        { login: "pliki6", firstName: "Jesus", lastName: "Tob" },
        { login: "admin_s_pliki2", firstName: "Segundo", lastName: "Minado" },
        { login: "admin_m_pliki2", firstName: "Miguel", lastName: "de Castilla" },
        { login: "segundo", firstName: "Segundo", lastName: "Usuario" },
        { login: "capitan2", firstName: "Richard", lastName: "Cutero" }
      ]
    };

    CommonsGenericProxy.getGeneric.and.callFake(() => {
      const deferred = $q.defer();
      deferred.resolve(employeesData);
      return deferred.promise;
    });

    service.getOnBusinessEmployees().then(response => {
      expect(response).toEqual(employeesData.data);
      expect(localStorageService.set).toHaveBeenCalledWith('membershipData', jasmine.anything());
      done();
    });
    $rootScope.$apply();
  });

  it('should call error service on timeout error', (done) => {
    CommonsHttpUtilsErrorService.timeOutError.and.callFake((attempts, callback, error, defer) => {
      defer.reject({ errorCode: 504 });
    });

    CommonsGenericProxy.getGeneric.and.callFake(() => {
      const deferred = $q.defer();
      deferred.reject({ errorCode: 504 });
      return deferred.promise;
    });

    service.getOnBusinessEmployees().catch(() => {
      expect(CommonsHttpUtilsErrorService.returnProcessedError).toHaveBeenCalled();
      done();
    });
    $rootScope.$apply();
  });

  it('should call error service on unauthorized error', (done) => {
    CommonsHttpUtilsErrorService.unauthorizedError.and.callFake((attempts, callback, error, defer) => {
      defer.reject({ errorCode: 401 });
    });

    CommonsGenericProxy.getGeneric.and.callFake(() => {
      const deferred = $q.defer();
      deferred.reject({ errorCode: 401 });
      return deferred.promise;
    });

    service.getOnBusinessEmployees().catch(() => {
      expect(CommonsHttpUtilsErrorService.returnProcessedError).toHaveBeenCalled();
      done();
    });
    $rootScope.$apply();
  });
});
