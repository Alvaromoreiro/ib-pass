import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from '../../../../../mocks/Services/StorageServiceMock';
import { BookingPageUtilsService } from '@shared/services/ib-utils/ib-booking-page-utils.service';
import { TitleAngularServiceMock } from '../../../../../mocks/Services/TitleAngularMock';
import { TranslateServiceMock } from '../../../../../mocks/Services/TranslateServiceAngularMock';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { TranslateService } from '@ngx-translate/core';
import { WindowMock } from '../../../../../mocks/class/WindowMock';
import { RootScopeMock } from 'test/mocks/class/RootScopeMock';

describe('BookingPageUtilsService', () => {
    let fakeRootScope: RootScopeMock;
    let fakeTitle: TitleAngularServiceMock;
    let fakeSessionStorage: StorageServiceMock;
    let fakeTranslate: TranslateServiceMock;
    let fakeWindow: WindowMock;
    let service;

    beforeEach(() => {
        fakeRootScope = new RootScopeMock();
        fakeSessionStorage = new StorageServiceMock();
        fakeTranslate = new TranslateServiceMock();
        fakeTitle = new TitleAngularServiceMock();
        fakeWindow = new WindowMock('BookingPageUtilsService');

        TestBed.configureTestingModule({
            providers: [
                { provide: AJSRootScope, useValue: fakeRootScope },
                { provide: Title, useValue: fakeTitle },
                { provide: TranslateService, useValue: fakeTranslate},
                { provide: CommonsSessionStorageService, useValue: fakeSessionStorage },
                { provide: WINDOW_TOKEN, useValue: fakeWindow}
            ]
        });
        service = TestBed.inject(BookingPageUtilsService);

    });

    describe('Test setPageTitle', () => {
        it('Test is set', (done) => {
            fakeTitle.setTitle = jasmine.createSpy('setTitle').and.callFake(fakeTitle.setTitle)
            service.setPageTitle('TITLE_LITERAL');
            setTimeout(() => {
                expect(fakeTitle.setTitle).toHaveBeenCalledWith('TITLE_LITERAL');
                done();
            });
        });
    });

    describe( 'Test isMobile', () => {
        beforeEach( () => {
            delete fakeRootScope[ 'isMobile' ];
        } );
        it('InnerWith < 768 ', () => {
            fakeWindow.innerWidth = 600;
            expect(service.isMobile()).toEqual({general: true, header:true})
        });
        it('InnerWith < 1024 && InnerWith > 768', () => {
            fakeWindow.innerWidth = 768;
            expect(service.isMobile()).toEqual({general: false, header:true})
        });
        it('InnerWith >= 1024 ', () => {
            fakeWindow.innerWidth = 1024;
            expect(service.isMobile()).toEqual({general: false, header:false})
        });
        it('Resize to InnerWith < 768 ', (done) => {
            fakeWindow.innerWidth = 1024;
            fakeWindow.dispatchEvent(new Event('resize'));
            fakeWindow.innerWidth = 320;
            fakeWindow.dispatchEvent(new Event('resize'));
            setTimeout(() => {
                expect(service.isMobile()).toEqual({ general: true, header: true });
                done();
            })

        });
        it('Resize to InnerWith < 1024 && InnerWith > 768', (done) => {
            fakeWindow.innerWidth = 1024;
            fakeWindow.dispatchEvent(new Event('resize'));
            fakeWindow.innerWidth = 768;
            fakeWindow.dispatchEvent(new Event('resize'));
            setTimeout(() => {
                expect(service.isMobile()).toEqual({ general: false, header: true })
                done();
            });

        });
        it('Resize to InnerWith >= 1024 ', (done) => {
            fakeWindow.innerWidth = 600;
            fakeWindow.dispatchEvent(new Event('resize'));
            fakeWindow.innerWidth = 1024;
            fakeWindow.dispatchEvent(new Event('resize'));
            setTimeout(() => {
                expect(service.isMobile()).toEqual({ general: false, header: false })
                done();
            });
        });

    });

    describe( 'Test getDeviceType', () => {
        describe( 'when deviceType is a mobile ', function () {
            it( ' deviceType should be equals to mobile', function ( done ) {
                let returnDeviceType;
                fakeSessionStorage.set( 'channel', 'mobi' );
                returnDeviceType = service.getDeviceType();
                expect( returnDeviceType ).toBe( 'mobile' );
                done();
            } );
        } );
        describe( 'when deviceType is not a mobile', function () {
            it( 'deviceType should be equals to desktop', function ( done ) {
                let returnDeviceType;
                fakeSessionStorage.set( 'channel', 'desktop' );
                fakeWindow.innerWidth = 1026;
                returnDeviceType = service.getDeviceType();
                expect( returnDeviceType ).toBe( 'desktop' );
                done();
            } );
            it( 'deviceType should be equals to tablet', function ( done ) {
                let returnDeviceType;
                fakeSessionStorage.set( 'channel', 'tablet' );
                fakeWindow.innerWidth = 500;
                returnDeviceType = service.getDeviceType();
                expect( returnDeviceType ).toBe( 'tablet' );
                done();

            } );
            it( 'deviceType should be equals to mobile', function ( done ) {
                let returnDeviceType;
                fakeSessionStorage.set( 'channel', 'mobile' );
                fakeWindow.innerWidth = 400;
                returnDeviceType = service.getDeviceType();
                expect( returnDeviceType ).toBe( 'mobile' );
                done();
            } );
        } );
    } );
    describe( 'getFooterModel is called', () => {
        it( 'should return the model properly', () => {
            const model = service.getFooterModel();
            expect( model.phoneInfo.prefix ).toEqual( '(+34) ' );
        });
    });
});
