import { CommonsCheckLoginWCSService } from '../../../../../../src/app/core/ib-login/services/ib-commons-check-login-wcs';
import { CommonsLoginConstantsType } from '../../../../../../src/app/core/constants/ib-commons-login-constants';

describe('CommonsCheckLoginWCSService', () => {
    let service: CommonsCheckLoginWCSService;
    let mockConstants: CommonsLoginConstantsType;
    let localStorageService: any;
    let commonsUtilService: any;
    let commonsCookiesService: any;
    let $window: any;
    let $location: any;
    let $filter: any;
    let commonsLoginUtilsService: any;
    let redirectionService: any;

    beforeEach(() => {
        mockConstants = {
            SSO_COOKIES: {
                ONB_LOGGED_TOKEN: 'ONB_LOGGED_TOKEN',
                SF_LOGGED_TOKEN: 'SF_LOGGED_TOKEN',
            },
            URL_PARAMETERS: {
                ERROR: 'ERROR'
            }
        } as CommonsLoginConstantsType;
        localStorageService = jasmine.createSpyObj('localStorageService', ['set']);
        commonsUtilService = jasmine.createSpyObj('CommonsUtilService', ['getParameterByName', 'getMemberIdByToken', 'getTierLevelByToken']);
        commonsCookiesService = jasmine.createSpyObj('CommonsCookiesService', ['getCookie']);
        $window = {};
        $location = jasmine.createSpyObj('$location', ['absUrl']);
        $filter = jasmine.createSpy();
        commonsLoginUtilsService = jasmine.createSpyObj('CommonsLoginUtilsService', ['updateStateToAnonymous']);
        redirectionService = jasmine.createSpyObj('RedirectionService', ['redirectToLoginPage']);

        service = new CommonsCheckLoginWCSService(
            mockConstants,
            localStorageService,
            commonsUtilService,
            commonsCookiesService,
            $window,
            $location,
            $filter,
            commonsLoginUtilsService,
            redirectionService
        );
    });

    it('should define generateSSOInfo method', () => {
        expect(service.generateSSOInfo).toBeDefined();
    });

    it('should return login info when generateSSOInfo is called with isAnonymous as true', () => {
        const result = service.generateSSOInfo(true);
        expect(result.isLogged).toBeFalsy();
        expect(result.loggedToken).toBeNull();
    });

    it('should check SF token and return expected values', () => {
        commonsCookiesService.getCookie.and.returnValue('token');
        const result = service.checkSFToken();
        expect(result.userSFLogged).toBeTrue();
    });

    it('should generate OB login info and update localStorage when user is logged', () => {
        commonsUtilService.getParameterByName.and.returnValue(null);
        commonsCookiesService.getCookie.and.returnValue('token');
        const result = service.generateOBLoginInfo();
        expect(result.isLogged).toBeTrue();
        expect(localStorageService.set).toHaveBeenCalled();
    });

    it('should verify if token is expired', () => {
        const expireDate = '01/01/2025';
        expect(service.isTokenExpired(expireDate)).toBeTruthy();
    });

    it('should redirect to login page when no session is active and not anonymous', () => {
        commonsUtilService.getParameterByName.and.returnValue(null);
        commonsLoginUtilsService.updateStateToAnonymous.and.callThrough();
        service.generateSSOInfo(false);
        expect(commonsLoginUtilsService.updateStateToAnonymous).toHaveBeenCalled();
        expect(redirectionService.redirectToLoginPage).toHaveBeenCalled();
    });
});
