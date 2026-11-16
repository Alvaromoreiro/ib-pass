import { TestBed } from "@angular/core/testing";
import { BookingHeaderConstants } from "@shared/components/ib-booking-header/ib-booking-header-constants";
import { BookingHeaderGreyBarTransformerService } from "@shared/components/ib-booking-header/services/transformers/ib-booking-header-grey-bar-transformer.service";
import { WINDOW_TOKEN } from "@src/app/core/config/ib-booking-app-tokens";
import { IbCUserUtilsService } from "ib-web-commons/utils";

const fakeWindow = {
    location : {
        reload: jasmine.createSpy('reload'),
    }
}
class CommonsUserUtilsServiceMock {
    isIbZeroResponse = false;
    isSoftResponse = false
    isIbZero = jasmine.createSpy('isIbZero').and.callFake(() => this.isIbZeroResponse);
    isSoftUser = jasmine.createSpy('isSoftUser').and.callFake(()=> this.isSoftResponse)
}
let service: BookingHeaderGreyBarTransformerService;
let CommonsUserUtilsService: CommonsUserUtilsServiceMock;
describe('Test BookingHeaderGreyBarTransformerService', () => {

    describe('Test initGreyBar', () => {
        beforeEach(() => {
        CommonsUserUtilsService = new CommonsUserUtilsServiceMock();
        fakeWindow.location.reload.calls.reset();
        TestBed.configureTestingModule({
            declarations: [],
            imports: [],
            schemas: [],
            providers: [
                { provide: WINDOW_TOKEN, useValue: fakeWindow },
                { provide: IbCUserUtilsService, useValue: CommonsUserUtilsService}
            ],
        });
        service = TestBed.inject(BookingHeaderGreyBarTransformerService);
        })

        it('when model is null', () => {
            const model = service.initGreyBar(null);
            expect(model).toBeUndefined();

        });
        it('when model is not logged and login is defined', () => {
            const inputModel= {
                onLogin: () => {},
                afterLogin: () => {},
                onError: () => { },
                userLogged: 'ib',
                show: true
            }
            const model = service.initGreyBar(inputModel);
            expect(model).toEqual(
                {
                    login: {
                        onLogin: inputModel.onLogin,
                        afterLogin: inputModel.afterLogin,
                        onError: inputModel.onError,
                    },
                    loggedData:{},
                    userLogged: 'ib',
                    isLogged: false,
                    isONB: false,
                    show:true
                }
            );

        })
        it('when model is logged as IBPLUS ', () => {
            CommonsUserUtilsService.isIbZeroResponse = false;
            CommonsUserUtilsService.isSoftResponse = false;
            const inputModel= {
                userLogged: 'ib',
                show: true,
                loggedData: {
                    personalInfo: {
                        name: 'name',
                        surname1: 'surname'
                    },
                    generalInfo: {
                        aviosTransformed: '0'
                    }
                }
            }
            const model = service.initGreyBar(inputModel);
            expect(model).toEqual(
                {
                    login: {
                        onLogin: fakeWindow.location.reload,
                        afterLogin: fakeWindow.location.reload,
                        onError: fakeWindow.location.reload,
                    },
                    loggedData: {
                        name: inputModel.loggedData.personalInfo.name,
                        surname: inputModel.loggedData.personalInfo.surname1,
                        avios: inputModel.loggedData.generalInfo.aviosTransformed.toString(),
                        isLogged: true,
                    },
                    userLogged: 'ib',
                    isLogged: true,
                    isONB: false,
                    show:true
                }
            );

        })

        it('when model is logged as IBPLUS and is SoftUser', () => {
            CommonsUserUtilsService.isIbZeroResponse = false;
            CommonsUserUtilsService.isSoftResponse = true;
            const inputModel= {
                onLogin: () => {},
                afterLogin: () => {},
                onError: () => { },
                userLogged: 'ib',
                show: true,
                loggedData: {
                    personalInfo: {
                        name: 'name',
                        surname1: 'surname'
                    },
                    generalInfo: {
                        avios: 0
                    }
                }
            }
            const model = service.initGreyBar(inputModel);
            expect(model).toEqual(
                {
                    login: {
                        onLogin: inputModel.onLogin,
                        afterLogin: inputModel.afterLogin,
                        onError: inputModel.onError,
                    },
                    loggedData: {
                        name: inputModel.loggedData.personalInfo.name,
                        surname: null,
                        avios: inputModel.loggedData.generalInfo.avios.toString(),
                        isLogged: false,
                    },
                    userLogged: 'ib',
                    isLogged: true,
                    isONB: false,
                    show:true
                }
            );

        })

        it('when model is logged as IBZERO', () => {
            CommonsUserUtilsService.isIbZeroResponse = true;
            CommonsUserUtilsService.isSoftResponse = false;
            const inputModel= {
                onLogin: () => {},
                afterLogin: () => {},
                onError: () => { },
                userLogged: 'ib',
                show: true,
                loggedData: {
                    personalInfo: {
                        name: 'name',
                        surname1: 'surname'
                    },
                    generalInfo: {
                        avios: 0
                    }
                }
            }
            const model = service.initGreyBar(inputModel);
            expect(model).toEqual(
                {
                    login: {
                        onLogin: inputModel.onLogin,
                        afterLogin: inputModel.afterLogin,
                        onError: inputModel.onError,
                    },
                    loggedData: {
                        name: inputModel.loggedData.personalInfo.name,
                        surname: inputModel.loggedData.personalInfo.surname1,
                        avios: null,
                        isLogged: true,
                    },
                    userLogged: 'ib',
                    isLogged: true,
                    isONB: false,
                    show:true
                }
            );

        })
        it('when model is logged as IBZERO and soft', () => {
            CommonsUserUtilsService.isIbZeroResponse = true;
            CommonsUserUtilsService.isSoftResponse = true;
            const inputModel= {
                onLogin: () => {},
                afterLogin: () => {},
                onError: () => { },
                userLogged: 'ib',
                show: true,
                loggedData: {
                    personalInfo: {
                        name: 'name',
                        surname1: 'surname'
                    },
                    generalInfo: {
                        avios: 0
                    }
                }
            }
            const model = service.initGreyBar(inputModel);
            expect(model).toEqual(
                {
                    login: {
                        onLogin: inputModel.onLogin,
                        afterLogin: inputModel.afterLogin,
                        onError: inputModel.onError,
                    },
                    loggedData: {
                        name: inputModel.loggedData.personalInfo.name,
                        surname: null,
                        avios: null,
                        isLogged: false,
                    },
                    userLogged: 'ib',
                    isLogged: true,
                    isONB: false,
                    show:true
                }
            );

        })
        it('when model is logged as ONB', () => {
            CommonsUserUtilsService.isIbZeroResponse = true;
            CommonsUserUtilsService.isSoftResponse = false;
            const inputModel= {
                onLogin: () => {},
                afterLogin: () => {},
                onError: () => { },
                userLogged: BookingHeaderConstants.LOGIN_TYPES.ONB,
                show: true,
                loggedData: {
                    userInfo: {
                        firstName: 'name',
                        lastName: 'lastname',
                    },
                    pointsTransformed: '0'
                }
            }
            const model = service.initGreyBar(inputModel);
            expect(model).toEqual(
                {
                    login: {
                        onLogin: inputModel.onLogin,
                        afterLogin: inputModel.afterLogin,
                        onError: inputModel.onError,
                    },
                    loggedData: {
                        name: inputModel.loggedData.userInfo.firstName,
                        surname: inputModel.loggedData.userInfo.lastName,
                        points: inputModel.loggedData.pointsTransformed,
                        isLogged: true,
                    },
                    userLogged: BookingHeaderConstants.LOGIN_TYPES.ONB,
                    isLogged: true,
                    isONB: true,
                    show:true
                }
            );

        })
    })
})


