import { TestBed } from "@angular/core/testing";
import { IbBookingErrorHandlerService } from "@src/app/shared/http-services/error";
import { BookingSalesforceRxProxy } from "@src/app/shared/http-services/proxy/ib-booking-salesforce-rx-proxy.service";
import { ibSubscriptionPermissionService } from "@src/app/shared/services/ib-utils/ib-subscriptions-permission.service";
import { catchError, of, throwError } from "rxjs";

class IbBookingErrorHandlerServiceMock {
    public handleErrorOperator = jasmine.createSpy('handleErrorOperator').and.callFake(()=> (source) => source.pipe(
        catchError((error: unknown) => {
            return throwError(() => error);
        })
    ));
}

class BookingSalesforceRxProxyMock {
    public static response;
    public static thrownError;
    public post = () => BookingSalesforceRxProxyMock.thrownError? throwError(()=> BookingSalesforceRxProxyMock.thrownError) : of(BookingSalesforceRxProxyMock.response);
    public get = () => BookingSalesforceRxProxyMock.thrownError? throwError(()=> BookingSalesforceRxProxyMock.thrownError) : of(BookingSalesforceRxProxyMock.response);
    public put = () => BookingSalesforceRxProxyMock.thrownError? throwError(()=> BookingSalesforceRxProxyMock.thrownError) : of(BookingSalesforceRxProxyMock.response);
};

describe('Subscription Permission Service Test', () => {
    let service: ibSubscriptionPermissionService;
    let mockError = {
        'errorCode': 404,
        'data': {
            'errors': [{ 'reason': 'error' }]
        }
    }

    beforeEach( async () => {
        BookingSalesforceRxProxyMock.response = {};
        BookingSalesforceRxProxyMock.thrownError = null;
        TestBed.configureTestingModule( {
            imports: [  ],
            providers: [
                { provide: BookingSalesforceRxProxy, useClass: BookingSalesforceRxProxyMock },
                { provide: IbBookingErrorHandlerService, useClass: IbBookingErrorHandlerServiceMock },
            ],
        } );
        service = TestBed.inject( ibSubscriptionPermissionService );
    });
    it( 'should be created', () => {
        expect( service ).toBeTruthy();
    } );

    describe('getMarketingPerms should', () => { 
        beforeEach(() => {
            BookingSalesforceRxProxyMock.thrownError = null;
        })
        it('should return the response on 200OK', async () => {
            const res = await service.getMarketingPermissions();
            expect(res).toEqual({});
        })

        it('should throw error', async () => {
            BookingSalesforceRxProxyMock.thrownError = mockError;
            try {
                await service.getMarketingPermissions();
                fail('Expected method to throw');
            } catch (err) {
                expect(err).toEqual({ errorCode: 404, data: {errors: [{reason: 'error'} ]} });
            }
        })
     })

     describe('setMarketingPerm should', () => { 
        beforeEach(() => {
            BookingSalesforceRxProxyMock.thrownError = null;
        })
        it('should grant permission and modify object if type is commercial campaign', () => {
            const input = [{permissionType: 'COMMERCIAL_CAMPAIGN' as any, permissionGranted: false}];
            const expected = [{permissionType: 'COMMERCIAL_CAMPAIGN' as any, permissionGranted: true}];
            const result = service.setMarketingPermission(input, false);
            expect(result).toEqual(expected);
        })

        it('should grant permission and modify object if type is magazine', () => {
            const input = [{permissionType: 'MAGAZINE' as any, permissionGranted: false}];
            const expected = [{permissionType: 'MAGAZINE' as any, permissionGranted: true}];
            const result = service.setMarketingPermission(input, true);
            expect(result).toEqual(expected);
        })

        it('should not modify permissions for other types', () => {
            const input = [{permissionType: 'OTHER_TYPE' as any, permissionGranted: false}];
            const expected = [{permissionType: 'OTHER_TYPE' as any, permissionGranted: false}];
            const result = service.setMarketingPermission(input, false);
            expect(result).toEqual(expected);
        })

        it('should handle multiple permissions correctly', () => {
            const input = [
                {permissionType: 'COMMERCIAL_CAMPAIGN' as any, permissionGranted: false},
                {permissionType: 'OTHER_TYPE' as any, permissionGranted: false}
            ];
            const expected = [
                {permissionType: 'COMMERCIAL_CAMPAIGN' as any, permissionGranted: true},
                {permissionType: 'OTHER_TYPE' as any, permissionGranted: false}
            ];
            const result = service.setMarketingPermission(input, false);
            expect(result).toEqual(expected);
        })
     })


     describe('reqMarketingPerm', () => { 
        beforeEach(() => {
            BookingSalesforceRxProxyMock.thrownError = null;
        })
        it('should return the response on 200OK', async () => {
            const res = await service.reqMarketingPermission([{}], false);
            expect(res).toEqual({});
        })

        it('should throw error', async () => {
            BookingSalesforceRxProxyMock.thrownError = mockError;
            try {
                await service.reqMarketingPermission([{permissionType: 'COMMERCIAL_CAMPAIGN' as any, permissionGranted: false}], false);
                fail('Expected method to throw');
            } catch (err) {
                expect(err).toEqual({ errorCode: 404, data: {errors: [{reason: 'error'} ]} });
            }
        })
     })

});
