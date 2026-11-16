import { of, throwError } from 'rxjs';
import { IbBookingHeaderBasketAssistCardComponent } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/components/ib-booking-header-basket-assist-card/ib-booking-header-basket-assist-card.component';
import { IbAssistCardBasketService as IbAncAssistCardBasketService } from 'ib-web-ancillaries';
import { IbCModalService } from 'ib-web-commons/ib-modal/';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';

describe('IbBookingHeaderBasketAssistCardComponent', () => {
    let component: IbBookingHeaderBasketAssistCardComponent;

    let mockRootScope: jasmine.SpyObj<any>;
    let mockIbAncAssistCardBasketService: jasmine.SpyObj<IbAncAssistCardBasketService>;
    let mockModalService: jasmine.SpyObj<IbCModalService>;
    let mockSessionStorage: jasmine.SpyObj<CommonsSessionStorageService>;

    let mockBasketFunctions: any;

    beforeEach(() => {
        mockRootScope = jasmine.createSpyObj<any>('AJSRootScope', ['$broadcast']);
        mockIbAncAssistCardBasketService = jasmine.createSpyObj<IbAncAssistCardBasketService>('IbAncAssistCardBasketService', ['deleteAssistCardFromBasket']);
        mockModalService = jasmine.createSpyObj<IbCModalService>('IbCModalService', ['showGenericError']);
        mockSessionStorage = jasmine.createSpyObj<CommonsSessionStorageService>('CommonsSessionStorageService', ['get']);

        mockBasketFunctions = {
            isLoading: jasmine.createSpy('isLoading'),
            isNotLoading: jasmine.createSpy('isNotLoading'),
            calculateAllBasket: jasmine.createSpy('calculateAllBasket'),
            saveHeaderModel: jasmine.createSpy('saveHeaderModel'),
            deleteAncillarie: jasmine.createSpy('deleteAncillarie'),
            collapseHeader: {
                closeCollapse: jasmine.createSpy('closeCollapse')
            }
        };

        mockSessionStorage.get.and.returnValue('ancillaries');

        component = new IbBookingHeaderBasketAssistCardComponent(
            mockRootScope as any,
            mockIbAncAssistCardBasketService,
            mockModalService,
            mockSessionStorage
        );

        component.basketFunctions = mockBasketFunctions;
    });

    describe('deleteAssistCard', () => {
        it('debería borrar Assist Card correctamente y actualizar el header', () => {
            mockIbAncAssistCardBasketService.deleteAssistCardFromBasket.and.returnValue(of({} as any));

            component.deleteAssistCard();

            expect(mockBasketFunctions.isLoading).toHaveBeenCalled();

            expect(mockIbAncAssistCardBasketService.deleteAssistCardFromBasket).toHaveBeenCalled();

            expect(mockRootScope.$broadcast).toHaveBeenCalledWith('basketUpdateCommonHeader');
            expect(mockRootScope.$broadcast).toHaveBeenCalledWith('setAssistCardModifyButton', false);
            expect(mockBasketFunctions.calculateAllBasket).toHaveBeenCalledWith('/ancillaries');
            expect(mockBasketFunctions.saveHeaderModel).toHaveBeenCalled();
            expect(mockBasketFunctions.deleteAncillarie).toHaveBeenCalledWith(true);
            expect(mockBasketFunctions.isNotLoading).toHaveBeenCalled();
        });

        it('debería gestionar el error al borrar Assist Card mostrando el modal y cerrando el header', () => {
            mockIbAncAssistCardBasketService.deleteAssistCardFromBasket.and.returnValue(throwError(() => new Error('API error')));

            component.deleteAssistCard();

            expect(mockBasketFunctions.isLoading).toHaveBeenCalled();

            expect(mockIbAncAssistCardBasketService.deleteAssistCardFromBasket).toHaveBeenCalled();

            expect(mockBasketFunctions.deleteAncillarie).toHaveBeenCalledWith(false);
            expect(mockBasketFunctions.isNotLoading).toHaveBeenCalled();
            expect(mockModalService.showGenericError).toHaveBeenCalled();
            expect(mockBasketFunctions.collapseHeader.closeCollapse).toHaveBeenCalled();
            expect(mockRootScope.$broadcast).not.toHaveBeenCalledWith('setAssistCardModifyButton', false);
        });

        it('no debería fallar si no existe collapseHeader en basketFunctions', () => {
            mockIbAncAssistCardBasketService.deleteAssistCardFromBasket.and.returnValue(throwError(() => new Error('API error')));
            delete mockBasketFunctions.collapseHeader;

            component.basketFunctions = mockBasketFunctions;

            component.deleteAssistCard();

            expect(mockBasketFunctions.deleteAncillarie).toHaveBeenCalledWith(false);
            expect(mockBasketFunctions.isNotLoading).toHaveBeenCalled();
            expect(mockModalService.showGenericError).toHaveBeenCalled();
        });
    });
});
