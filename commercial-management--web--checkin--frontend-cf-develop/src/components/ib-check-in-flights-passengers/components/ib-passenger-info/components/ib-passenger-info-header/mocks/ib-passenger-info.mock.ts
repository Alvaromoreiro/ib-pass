import { IbPassengerInfo } from '@src/app/core/models/ib-check-in-flights-passengers/ib-passenger-info.model';

const passengerInfoMock: Partial<IbPassengerInfo> = {
    name: 'John',
    surname: 'Doe',
    gender: 'M',
    pasStatus: {
        isChecked: true,
        available: true,
        hasSBY: false,
        isApiEsta: false,
        reason: []
    }
};

export const getPassengerInfoMock = (overrides: Partial<IbPassengerInfo> = {}): IbPassengerInfo => {
    return {
        ...passengerInfoMock,
        ...overrides
    } as IbPassengerInfo;
};