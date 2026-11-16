import { SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbMmbManagePetcInfoModalComponent } from '@src/components/ib-MmB-booking-dashboard/components/ib-MmB-management-tab/components/ib-MmB-manage-petc-info/components/ib-MmB-manage-petc-info-modal/ib-MmB-manage-petc-info-modal.component';
import { IbMmbManagePetcInfoComponent } from '@src/components/ib-MmB-booking-dashboard/components/ib-MmB-management-tab/components/ib-MmB-manage-petc-info/ib-MmB-manage-petc-info.component'
import { PetcFlightInfo } from '@src/components/ib-MmB-booking-dashboard/components/ib-MmB-management-tab/components/ib-MmB-manage-petc-info/models/petc-info.model';
import { IbMmbManagePetcInfoTransformerService } from '@src/components/ib-MmB-booking-dashboard/components/ib-MmB-management-tab/components/ib-MmB-manage-petc-info/transformer/ib-MmB-manage-petc-info-transformer.service';
import { LiteralFormatterPipe } from '@src/app/shared/pipes/literalFormatter.pipe';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { IbCLinkPipe } from 'ib-web-commons/pipes';
import { AJSRootScope } from 'ib-web-commons/utils';
import { TranslateService } from '@ngx-translate/core';
import { TranslatePipeMock } from 'test/unit/utils/pipe-mock.pipe';
import { AJSMmBDatalayerUtilsService } from '@src/components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service-bridge.service';

describe('IbMmbManagePetcInfoComponent', () => {
    let component: IbMmbManagePetcInfoComponent;
    let fixture: ComponentFixture<IbMmbManagePetcInfoComponent>;
    let modalServiceMock: jasmine.SpyObj<IbCModalService>;
    let petcTransformerMock: jasmine.SpyObj<IbMmbManagePetcInfoTransformerService>;
    let translateServiceMock: jasmine.SpyObj<TranslateService>;
    let literalFormatterPipeMock: jasmine.SpyObj<LiteralFormatterPipe>;
    let ibCLinkPipeMock: jasmine.SpyObj<IbCLinkPipe>;
    let datalayerUtilsServiceMock: jasmine.SpyObj<any>;
    const rootScopeMock = {};

    const mockPetcFlightInfo: PetcFlightInfo = {
        sliceId: 'slice-001',
        departure: {
            code: 'MAD',
            name: 'Madrid',
        },
        arrival: {
            code: 'BCN',
            name: 'Barcelona',
        },
        pets: [
            {
                passengerName: 'Cristian',
                passengerId: '123456789',
                animalType: 'Perro',
                subtype: 'DOG',
                emd: 'PENDING_PAYMENT',
                isPendingPayment: true,
                orderItemId: '123345456',
            },
            {
                passengerName: 'Ana',
                passengerId: '111222333',
                animalType: 'Ave',
                subtype: 'BIRD',
                emd: 'PAID',
                isPendingPayment: false,
                orderItemId: '789456123',
            }
        ]
    } as unknown as PetcFlightInfo;

    const mockPetcFlightInfoEmpty: PetcFlightInfo = {
        sliceId: 'slice-002',
        departure: {
            code: '',
            name: '',
        },
        arrival: {
            code: '',
            name: '',
        },
        pets: []
    } as PetcFlightInfo;

    const singlepetcsinglePet: PetcFlightInfo = {
        sliceId: 'slice-003',
        pets: [
            {
                passengerName: 'Carlos',
                passengerId: '987654321',
                animalType: 'Gato',
                subtype: 'CAT',
                emd: 'PAID',
                isPendingPayment: false,
                orderItemId: '654321987',
            }
        ]
    } as PetcFlightInfo;

    const mockTransformedData: PetcFlightInfo[] = [mockPetcFlightInfo, mockPetcFlightInfoEmpty];

    beforeEach(async () => {
        modalServiceMock = jasmine.createSpyObj<IbCModalService>('IbCModalService', ['showGenericComponentModal']);
        petcTransformerMock = jasmine.createSpyObj<IbMmbManagePetcInfoTransformerService>('IbMmbManagePetcInfoTransformerService', ['transformPetcData']);
        translateServiceMock = jasmine.createSpyObj<TranslateService>('TranslateService', ['instant']);
        literalFormatterPipeMock = jasmine.createSpyObj<LiteralFormatterPipe>('LiteralFormatterPipe', ['transform']);
        ibCLinkPipeMock = jasmine.createSpyObj<IbCLinkPipe>('IbCLinkPipe', ['transform']);
        datalayerUtilsServiceMock = jasmine.createSpyObj('MmBDatalayerUtilsService', ['updateDatalayerInfo']);

        petcTransformerMock.transformPetcData.and.returnValue(mockTransformedData);
        translateServiceMock.instant.and.callFake((key: string) => key);
        literalFormatterPipeMock.transform.and.callFake((value: string) => value);
        ibCLinkPipeMock.transform.and.returnValue('http://mock-pets-link.com');

        await TestBed.configureTestingModule({
            declarations: [IbMmbManagePetcInfoComponent, TranslatePipeMock],
            providers: [
                { provide: IbCModalService, useValue: modalServiceMock },
                { provide: IbMmbManagePetcInfoTransformerService, useValue: petcTransformerMock },
                { provide: TranslateService, useValue: translateServiceMock },
                { provide: LiteralFormatterPipe, useValue: literalFormatterPipeMock },
                { provide: IbCLinkPipe, useValue: ibCLinkPipeMock },
                { provide: AJSRootScope, useValue: rootScopeMock },
                { provide: AJSMmBDatalayerUtilsService, useValue: datalayerUtilsServiceMock }
            ],
        })
            .compileComponents();
        fixture = TestBed.createComponent(IbMmbManagePetcInfoComponent);
        component = fixture.componentInstance;
    });

    describe('petc component created', () => {
        it('should create the component the petc', () => {
            expect(component).toBeTruthy();
        });

        it('should initialize petcItems as empty array', () => {
            expect(component.petcItems).toEqual([]);
        });
    });

    describe('ngOnInit', () => {
        it('should call transformPetcData and set petcItems', () => {
            component.ngOnInit();
            expect(petcTransformerMock.transformPetcData).toHaveBeenCalled();
            expect(component.petcItems).toEqual(mockTransformedData);
        });
    });

    describe('ngOnChanges', () => {
        beforeEach(() => {
            component.model = [];
            component.flights = [];
            component.passengers = [];
            petcTransformerMock.transformPetcData.calls.reset();
        });

        it('should change if there is a change in the model', () => {
            const changes: SimpleChanges = {
                model: { currentValue: [], previousValue: null, firstChange: false, isFirstChange: () => false }
            };
            component.ngOnChanges(changes);
            expect(petcTransformerMock.transformPetcData).toHaveBeenCalled();
        });

        it('should change if there is a change in the flights', () => {
            const changes: SimpleChanges = {
                flights: { currentValue: [], previousValue: null, firstChange: false, isFirstChange: () => false }
            };
            component.ngOnChanges(changes);
            expect(petcTransformerMock.transformPetcData).toHaveBeenCalled();
        });

        it('should change if there is a change in the passengers', () => {
            const changes: SimpleChanges = {
                passengers: { currentValue: [], previousValue: null, firstChange: false, isFirstChange: () => false }
            };
            component.ngOnChanges(changes);
            expect(petcTransformerMock.transformPetcData).toHaveBeenCalled();
        });
    });


    describe('hasPendingPayment', () => {
        it('should return true when any flight has pending payment', () => {
            component.petcItems = mockTransformedData;
            const result = component.hasPendingPayment();
            expect(result).toBeTrue();
        })
        it('should return false when no flight has pending payment', () => {
            component.petcItems = [mockPetcFlightInfoEmpty];
            const result = component.hasPendingPayment();
            expect(result).toBeFalse();
        });
    });

    describe('isActiveLink', () => {
        it('isActiveLink is called with pets and returns true', () => {
            const result = component.isActiveLink(mockPetcFlightInfo);
            expect(result).toBeTrue();
        });

        it('isActiveLink is called without pets and returns false', () => {
            const result = component.isActiveLink(mockPetcFlightInfoEmpty);
            expect(result).toBeFalse();
        });
    });

    describe('openModalConditions', () => {
        it('Call modalService.showGenericComponentModal with the correct parameters.', () => {
            component.petcItems = mockTransformedData;
            const mockModalRef = {
                componentInstance: {
                    model: null
                }
            };
            modalServiceMock.showGenericComponentModal.and.returnValue(mockModalRef as any);

            component.openModalConditions();

            expect(modalServiceMock.showGenericComponentModal).toHaveBeenCalledWith(
                IbMmbManagePetcInfoModalComponent,
                {
                    windowClass: 'ib-modals ib-modals--md ib-modals--petc',
                    modalBlocked: false
                }
            );
        });

        it('should set model on componentInstance with all flights', () => {
            component.petcItems = mockTransformedData;
            const mockModalRef = {
                componentInstance: {
                    model: null as any
                }
            };
            modalServiceMock.showGenericComponentModal.and.returnValue(mockModalRef as any);

            component.openModalConditions();

            expect(mockModalRef.componentInstance.model).toEqual({ petcInfo: mockTransformedData, messagePets: 'MMB_PETC_PETS_INFO' });
        });

        it('should not throw when modalRef is null', () => {
            modalServiceMock.showGenericComponentModal.and.returnValue(null as any);
            expect(() => component.openModalConditions()).not.toThrow();
        });

        it('should call updateDatalayerInfo when opening modal', () => {
            component.petcItems = mockTransformedData;
            const mockModalRef = {
                componentInstance: {
                    model: null
                }
            };
            modalServiceMock.showGenericComponentModal.and.returnValue(mockModalRef as any);

            component.openModalConditions();

            expect(datalayerUtilsServiceMock.updateDatalayerInfo).toHaveBeenCalled();
            expect(datalayerUtilsServiceMock.updateDatalayerInfo).toHaveBeenCalledWith(
                'ancillaries',
                'modal mascotas',
                'MOPETC'
            );
        });
    });

    describe('getPetsCount', () => {
        it('should return correct count when pets exist', () => {
            expect(component.getPetsCount(mockPetcFlightInfo)).toBe(2);
        });
        it('should return 0 when pets array is empty', () => {
            expect(component.getPetsCount(mockPetcFlightInfoEmpty)).toBe(0);
        });
        it('should return 0 when flight is null', () => {
            expect(component.getPetsCount(null as any)).toBe(0);
        });
    });
    describe('hasMultiplePets', () => {
        it('should return true when more than one pet', () => {
            expect(component.hasMultiplePets(mockPetcFlightInfo)).toBeTrue();
        });

        it('should return false when only one pet', () => {
            expect(component.hasMultiplePets(singlepetcsinglePet)).toBeFalse();
        });

        it('should return false when no pets', () => {
            expect(component.hasMultiplePets(mockPetcFlightInfoEmpty)).toBeFalse();
        });
    });

    describe('trackBySliceId', () => {
        it('should return the sliceId of the flight', () => {
            expect(component.trackBySliceId(0, mockPetcFlightInfo)).toBe('slice-001');
        });
    });
});