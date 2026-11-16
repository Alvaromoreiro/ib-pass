import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { IbUserInfoHeaderComponent } from '@shared/components/ib-booking-header/components/ib-user-info-header/ib-user-info-header.component';
import { IbAvatarStoreService, IbCUserStoreRepositoryService } from 'ib-web-commons/services';
import { TranslatePipeMock } from '@src/app/shared/components/ib-booking-partners-modal/ib-booking-partners-modal.component.spec';
import { Observable, of } from 'rxjs';
import { IberiaWebUser, State } from 'ib-web-commons/models';
import { customerDataMock } from 'test/unit/app/services/ib-booking-availability/call-commercial-mocks/call-commercial-mocks';
import { Pipe } from '@angular/core';

const mockAvatarStoreService = jasmine.createSpyObj<IbAvatarStoreService>('IbAvatarStore', ['getAvatar', 'deleteAvatarURL']);
const mockUserStoreService = jasmine.createSpyObj<IbCUserStoreRepositoryService>('IbCUserStoreRepositoryService', ['getUserState']);

const mockUserData: State<IberiaWebUser> = {
    isLoading: false,
    value: {
        appUserInfo: {
            logged: true,
            userType: 'IB_ZERO'
        },
        personalInfo: {
            name: 'Prueba',
            surname: 'Test',
            secondSurname: 'string',
            gender: 'Male',
            email: 'string'
        }
    } as any
};
@Pipe({
    name: 'link'
})
export class LinkPipeMock implements PipeTransform {
    public name = 'translate';

    public transform (query: string, ...args: any[]): unknown {
        return query;
    }
}

describe('IbUserInfoHeaderComponent test', () => {
    let component: IbUserInfoHeaderComponent;
    let fixture: ComponentFixture<IbUserInfoHeaderComponent>;
    let spyAvatarStoreService: jasmine.SpyObj<IbAvatarStoreService>;
    let spyUserStoreService: jasmine.SpyObj<IbCUserStoreRepositoryService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: IbAvatarStoreService, useValue: mockAvatarStoreService },
                { provide: IbCUserStoreRepositoryService, useValue: mockUserStoreService }
            ],
            declarations: [
                IbUserInfoHeaderComponent,
                TranslatePipeMock,
                LinkPipeMock
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbUserInfoHeaderComponent);
        component = fixture.componentInstance;
        spyAvatarStoreService = TestBed.inject(IbAvatarStoreService) as jasmine.SpyObj<IbAvatarStoreService>;
        spyUserStoreService = TestBed.inject( IbCUserStoreRepositoryService ) as jasmine.SpyObj<IbCUserStoreRepositoryService>;
        sessionStorage.setItem( 'ib-booking-app.membershipData', JSON.stringify( customerDataMock ) );
    });

    it('should exist', () => {
        expect(component).toBeTruthy();
    });

    describe('[CPA-187] when component inits, and get UserInfo', () => {

        it('and returns user data, should fill data', () => {

            mockUserStoreService.getUserState.and.callFake(() => {

                return of(mockUserData);

            });

            fixture.detectChanges();
            expect(component.userData).toEqual({
                appUserInfo: {
                    logged: true,
                    userType: 'IB_ZERO'
                },
                personalInfo: {
                    name: 'Prueba',
                    surname: 'Test',
                    secondSurname: 'string',
                    gender: 'Male',
                    email: 'string'
                }
            } as any);
            expect(component.isLogged).toEqual(true);
            expect(component.isIbZero).toEqual(true);
            component.userData = undefined;
            component.isLogged = undefined;
            component.isIbZero = undefined;
            component.isOnb = undefined;
            fixture.detectChanges();
        });

        it('and fail returns user data, should be undefined', () => {

            mockUserStoreService.getUserState.and.callFake(() => {

                return new Observable((subscriber) => {
                    subscriber.error('ERROR');
                });

            });

            fixture.detectChanges();
            expect(component.userData).toEqual(undefined);
            component.userData = undefined;
            fixture.detectChanges();
        });

    });



    describe('[CPA-187] when component inits, and get avatar', () => {

        it('and returns avatar url, should show url', () => {

            mockUserStoreService.getUserState.and.callFake(() => {

                return of(mockUserData);

            });
            mockAvatarStoreService.getAvatar.and.callFake(() => {
                return of('/$/TEST_URL');
            });


            fixture.detectChanges();
            expect(component.imageSrc).toBe('/$/TEST_URL');
            component.imageSrc = undefined;
            fixture.detectChanges();
        });

        it('and returns avatar error, should be undefined', () => {

            mockUserStoreService.getUserState.and.callFake(() => {

                return of(mockUserData);

            });
            mockAvatarStoreService.getAvatar.and.callFake(() => {
                return new Observable((subscriber) => {
                    subscriber.error('ERROR');
                });
            });


            fixture.detectChanges();
            expect(component.imageSrc).toBe(undefined);
            component.imageSrc = undefined;
            fixture.detectChanges();
        });

    });
    describe( 'when component inits, and isOnb', () => {
        it( 'should set roleOnb', fakeAsync( () => {
            const userData = {
                isLoading: false,
                value: {
                    appUserInfo: {
                        logged: true,
                        userType: 'ONB'
                    },
                    personalInfo: {
                        name: 'Prueba',
                        surname: 'Test',
                        secondSurname: 'string',
                        gender: 'Male',
                        email: 'string'
                    }
                } as any
            };
            mockUserStoreService.getUserState.and.callFake(() => {
                return of( userData );
            } );
            mockAvatarStoreService.getAvatar.and.callFake(() => {
                return of('/$/TEST_URL');
            });

            fixture.detectChanges();
            flushMicrotasks();
            tick( 1000 );
            expect( component.isOnb ).toBe( true );
        }));
    } );


});
