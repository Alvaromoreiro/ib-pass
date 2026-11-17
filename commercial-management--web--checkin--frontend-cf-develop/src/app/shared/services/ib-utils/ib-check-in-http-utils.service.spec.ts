import { IbCheckInHttpUtilsService } from "./ib-check-in-http-utils.service";

interface CommonsHttpUtilServiceTestApi {
    refreshToken: jasmine.Spy<() => Promise<unknown>>;
}

describe('IbCheckInHttpUtilsService', () => {
    let service: IbCheckInHttpUtilsService;
    let commonsHttpUtilService: CommonsHttpUtilServiceTestApi;

    beforeEach(() => {
        commonsHttpUtilService = jasmine.createSpyObj<CommonsHttpUtilServiceTestApi>(
            'CommonsHttpUtilService',
            ['refreshToken']
        );

        service = new IbCheckInHttpUtilsService(commonsHttpUtilService);
    });

    describe('refreshToken', () => {
        it('should refresh the token through the service', async () => {
            const refreshResponse = {
                accessToken: 'new-access-token'
            };

            commonsHttpUtilService.refreshToken.and.resolveTo(refreshResponse);

            const result = await service.refreshToken();

            expect(commonsHttpUtilService.refreshToken).toHaveBeenCalledTimes(1);
            expect(result).toEqual(refreshResponse);
        });

        it('should propagate the refresh token error', async () => {
            const refreshError = new Error('Token refresh failed');

            commonsHttpUtilService.refreshToken.and.rejectWith(refreshError);

            await expectAsync(service.refreshToken()).toBeRejectedWith(refreshError);
        });
    });
});
