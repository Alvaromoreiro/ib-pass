import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { IbUserInfoHeaderComponent } from 'src/app/shared/components/ib-user-info-header/ib-user-info-header.component';
import { IbAvatarStoreService, IbCUserStoreRepositoryService } from 'ib-web-commons/services';
import { DebugElement } from '@angular/core';
import {TranslatePipeMock} from 'test/unit/test-utilities';
import { Observable, of } from 'rxjs';
import { IberiaWebUser, State } from 'ib-web-commons/models';

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
                TranslatePipeMock
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbUserInfoHeaderComponent);
        component = fixture.componentInstance;
        spyAvatarStoreService = TestBed.inject(IbAvatarStoreService) as jasmine.SpyObj<IbAvatarStoreService>;
        spyUserStoreService = TestBed.inject(IbCUserStoreRepositoryService) as jasmine.SpyObj<IbCUserStoreRepositoryService>;
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


});