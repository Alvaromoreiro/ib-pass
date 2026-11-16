import { TestBed } from "@angular/core/testing";
import { IbBookingErrorHandlerService } from "@shared/http-services/error/ib-booking-error-handler.service";
import { BookingRxProxy } from "@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service";
import { GetWcsPhonesService } from "@src/app/shared/http-services/wcs/ib-booking-get-wcs-phones.service";
import { AJSRootScope, CommonsSessionStorageService } from "ib-web-commons/utils";
import { catchError, of, throwError } from "rxjs";
import { StorageServiceMock } from "test/mocks/Services/StorageServiceMock";

class FakeBookingRxProxy {
    public static response = { data: { content: "Hi, I am the response" } };
    public static thrownError;
    public get = () => FakeBookingRxProxy.thrownError ?
        throwError(() => FakeBookingRxProxy.thrownError) : of(FakeBookingRxProxy.response);
}

class RootScopeMock {
    phonesList = {
        RESERVAS: "Hola, soy RESERVAS",
    };
    phonesListIBV = {
        ATTBAH: "Hola, soy ATTBAH",
    };
}

class FakeIbBookingErrorHandlerService {
    public handleErrorOperator = jasmine.createSpy("handleErrorOperator")
        .and.callFake(() => (source) => source.pipe(
            catchError((error: unknown) => {
                return throwError(() => error);
            })
        )
        );
}

describe("IbWCSPhonesService Test", () => {
    let service: GetWcsPhonesService;
    let fakeCommonsSessionStorageService: StorageServiceMock = new StorageServiceMock();
    let mockError = {
        errorCode: 404,
        data: {
            errors: [{ reason: "error" }],
        },
    };

    let fakeAJSRootScope = new RootScopeMock();

    beforeEach(() => {
        FakeBookingRxProxy.thrownError = null;
        TestBed.configureTestingModule({
            providers: [
                { provide: BookingRxProxy, useClass: FakeBookingRxProxy },
                { provide: IbBookingErrorHandlerService, useClass: FakeIbBookingErrorHandlerService },
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
                { provide: AJSRootScope, useValue: fakeAJSRootScope },
            ],
        });
        service = TestBed.inject(GetWcsPhonesService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    describe("when getPhones is called", () => {
        beforeEach(() => {
            FakeBookingRxProxy.thrownError = null;
        });

        it("and service updates $rootScope with RESERVAS", (done) => {
            fakeCommonsSessionStorageService.set("phonesList", {
                RESERVAS: "hola",
            });

            service.getPhoneByCode("RESERVAS")
                .then((response) => {
                    expect(response).toEqual("Hi, I am the response");
                    expect(fakeAJSRootScope.phonesList).toEqual({
                        RESERVAS: "Hi, I am the response",
                    });
                    const storedValue = fakeCommonsSessionStorageService.get('phonesList');
                    expect(storedValue).toEqual({
                        RESERVAS: "Hi, I am the response",
                    });
                    done();
                }).catch(() => done.fail());
        });

        it("and service updates $rootScope with ATTBAH", (done) => {
            fakeCommonsSessionStorageService.set("phonesListIBV", {
                ATTBAH: "hola",
            });

            service.getPhoneByCode("ATTBAH")
                .then((response) => {
                    expect(response).toEqual("Hi, I am the response");
                    expect(fakeAJSRootScope.phonesListIBV).toEqual({
                        ATTBAH: "Hi, I am the response",
                    });
                    const storedValue = fakeCommonsSessionStorageService.get('phonesListIBV');
                    expect(storedValue).toEqual({
                        ATTBAH: "Hi, I am the response",
                    });
                    done();
                }).catch(() => done.fail());
        });

        it("and service returns 404", (done) => {
            FakeBookingRxProxy.thrownError = mockError;
            service.getPhoneByCode("ATTBAH").then(() => { }, (responseError) => {
                expect(responseError).toEqual({
                    errorCode: 404,
                    data: {
                        errors: [{ reason: "error" }],
                    },
                });
                done();
            });
        })
    });
});
