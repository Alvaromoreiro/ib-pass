describe('VipLoungesService Test', () => {
    var mockResponse = {data: 'test'};
    var VipLoungesService, rootScope, $q, mockError;
    var originalImport;

    var fakeCommonsGenericProxy = {
        postGeneric: jasmine.createSpy()
    };

    var fakeMmBAppConstants = {
        DEFAULT_ENDPOINTS: {
            vipLoungesURI: 'test'
        },
        cloudServiceCustomerExperience: 'customer-experience-cloud'
    };

    var fakeLocalStorageService = {
        get: jasmine.createSpy('get').and.returnValue(null),
        set: jasmine.createSpy('set'),
        remove: jasmine.createSpy('remove')
    };

    var fakeMmBDatalayerUtilsService = {
        updateDatalayerEvents: jasmine.createSpy('updateDatalayerEvents')
    };

    var fakeMmBDataLayerService = {
        updateDatalayer: jasmine.createSpy('updateDatalayer')
    };

    beforeEach(() => {
        originalImport = globalThis.import;
        angular.mock.module('ib-MmB-services-module', ($provide) => {
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('localStorageService', fakeLocalStorageService);
            $provide.value('MmBDatalayerUtilsService', fakeMmBDatalayerUtilsService);
            $provide.value('MmBDataLayerService', fakeMmBDataLayerService);
        });

        inject(($rootScope, _VipLoungesService_, _$q_) => {
            VipLoungesService = _VipLoungesService_;
            rootScope = $rootScope;
            $q = _$q_;
        });
    });

    afterEach(() => {
        globalThis.import = originalImport;
    });

    describe('when getVipLounges() is called and resolves', () => {
        beforeEach(inject(($q) => {
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));

        it('should return data when promise resolves', (done) => {
            VipLoungesService.getVipLounges('flowId123', {number: '12345'}).then((responseData) => {
                expect(responseData).toEqual(mockResponse.data);
                expect(fakeCommonsGenericProxy.postGeneric).toHaveBeenCalledWith(
                    'test',
                    {'flowId': 'flowId123', 'frequentFlyer': {number: '12345'}}
                );
                done();
            }).catch(done.fail);
            rootScope.$digest();
        });
    });

    describe('when getVipLounges() is called and rejects', () => {
        beforeEach(inject(($q) => {
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));

        it('should reject without data when promise fails', (done) => {
            mockError = { 'errorCode': 412, 'data': { 'errors': [{ 'reason': 'error' }] } };
            VipLoungesService.getVipLounges('flowId123', {number: '12345'}).then(
                () => {
                    done.fail('Promise should have been rejected');
                },
                (responseData) => {
                    expect(responseData).toBeUndefined();
                    done();
                }
            );
            rootScope.$digest();
        });
    });

    describe('getExclusiveServicesLauncherComponent', () => {
        it('return true if the import is successful', async () => {
            spyOn(VipLoungesService, 'dynamicImporter').and.returnValue(Promise.resolve({}));

            const result = await VipLoungesService.getExclusiveServicesLauncherComponent();

            expect(result).toBe(true);
            expect(VipLoungesService.dynamicImporter).toHaveBeenCalledWith(
                fakeMmBAppConstants.cloudServiceCustomerExperience + '/viplounges/wc/customer--customer-experience--exclusive-benefits-launcher.es.js'
            );
            expect(fakeMmBDatalayerUtilsService.updateDatalayerEvents).toHaveBeenCalled();
        });
    });

    describe('getVipInvitationsComponent', () => {
        it('return true if the import is successful', async () => {
            spyOn(VipLoungesService, 'dynamicImporter').and.returnValue(Promise.resolve({}));

            const result = await VipLoungesService.getVipInvitationsComponent();

            expect(result).toBe(true);
            expect(VipLoungesService.dynamicImporter).toHaveBeenCalledWith(
                fakeMmBAppConstants.cloudServiceCustomerExperience + '/viplounges/wc/customer--customer-experience--vip-lounge-card.es.js'
            );
            expect(fakeMmBDatalayerUtilsService.updateDatalayerEvents).toHaveBeenCalled();
        });
    });

    describe('getFastTrackCardComponent', () => {
        it('return true if the import is successful', async () => {
            spyOn(VipLoungesService, 'dynamicImporter').and.returnValue(Promise.resolve({}));

            const result = await VipLoungesService.getFastTrackCardComponent();

            expect(result).toBe(true);
            expect(VipLoungesService.dynamicImporter).toHaveBeenCalledWith(
                fakeMmBAppConstants.cloudServiceCustomerExperience + '/viplounges/wc/customer--customer-experience--fast-track-card.es.js'
            );
            expect(fakeMmBDatalayerUtilsService.updateDatalayerEvents).toHaveBeenCalled();
        });
    });
});