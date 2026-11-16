describe('ibHeaderMainPageController', () => {
    let controller, $rootScope, $scope, localStorageService, $componentController;
    const fakeibHeaderMainPageServiceModel = {
        initializeMainPageHeader: jasmine.createSpy('initializeMainPageHeader')
    };
    const fakeCommonsModalService = {};
    const fakeCommonsUserUtilsService = {
        isIbZero: jasmine.createSpy('isIbZero').and.callFake(() => false),
        isSoftUser: jasmine.createSpy('ibHeaderMainPage')
    };

    beforeEach(() => {
        angular.mock.module(
            'ib-header-main-page-component-module',
            'LocalStorageModule',
            ($provide) => {
                $provide.value(
                    'ibHeaderMainPageServiceModel',
                    fakeibHeaderMainPageServiceModel
                );
                $provide.value('CommonsModalService', fakeCommonsModalService);
                $provide.value('CommonsUserUtilsService', fakeCommonsUserUtilsService);
            }
        );
        inject(
            (
                _$rootScope_,
                _localStorageService_,
                _$controller_,
                _$componentController_
            ) => {
                $rootScope = _$rootScope_;
                $scope = $rootScope.$new();
                localStorageService = _localStorageService_;
                $componentController = _$componentController_;
                controller = $componentController('ibHeaderMainPage');
                $rootScope.$digest();
            }
        );
    });

    afterEach(() => {
        fakeCommonsUserUtilsService.isSoftUser.calls.reset();
        fakeibHeaderMainPageServiceModel.initializeMainPageHeader.calls.reset();
    });

    describe('when functions is called ', () => {
        const showUserInfoTestSetup = ({ isSoftUser, expectedIsLogged }) => {
            fakeibHeaderMainPageServiceModel.initializeMainPageHeader.and.callFake(
                () => ({
                    login: {},
                    logged: true
                })
            );
            fakeCommonsUserUtilsService.isSoftUser.and.returnValue(isSoftUser);
            localStorageService.set('toggle', { isSoftUserHideEnabled: true });

            controller.$onInit();
            controller.showUserInfo();

            expect(controller.isLogged).toBe(expectedIsLogged);
        };

        it('activate() is Called', (done) => {
            fakeibHeaderMainPageServiceModel.initializeMainPageHeader.and.callFake(
                () => ({
                    login: {}
                })
            );
            controller.$onInit();
            expect(controller).toBeDefined();
            done();
        });

        it('showUserInfo should return the user logged state if feature flaged is disabled', () => {
            fakeibHeaderMainPageServiceModel.initializeMainPageHeader.and.callFake(
                () => ({
                    login: {},
                    logged: false
                })
            );
            controller.$onInit();
            localStorageService.remove('toggle');
            controller.showUserInfo();

            expect(controller.isLogged).toBe(false);
        });

        it('showUserInfo should return true if is hard user', () => {
            showUserInfoTestSetup({ isSoftUser: false, expectedIsLogged: true });
        });

        it('showUserInfo should return false if is soft user', () => {
            showUserInfoTestSetup({ isSoftUser: true, expectedIsLogged: false });
        });
    });
});
