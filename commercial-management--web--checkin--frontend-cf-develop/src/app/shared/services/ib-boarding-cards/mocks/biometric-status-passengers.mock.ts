import { ICkiBiometricStatusPassengers, IPassengersList } from '@src/app/core/models/storage/cki-biometric-status-passengers.model';

const passengersList: IPassengersList[] = [
    {
        id: '1'
    } as IPassengersList,
    {
        id: '2'
    } as IPassengersList,
    {
        id: '3'
    } as IPassengersList
];

export const getBiometricStatusPassengeMock = (partial: boolean = false): Partial<ICkiBiometricStatusPassengers> => ({
    passengersList: partial
        ? passengersList.slice(0, 1)
        : passengersList
});
