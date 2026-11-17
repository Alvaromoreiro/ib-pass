import { ContactData, MockContactData } from 'cypress/support/command-models';

/** *****************************
 *
 * UTILS
 *
 ***************************** */

let isDisableGA4: boolean = false;
let bookingInfo: any = {};
let isInhibitBC: boolean = false;
let isDeinvoice: boolean = false;
let isCarrierConnect: boolean = false;

/**
 * Enable/disable validate GA4 (only dev)
 */
export const disabledGA4 = (): void => { isDisableGA4 = true; };

/**
 * Returns the negation of the variable 'isDisableGA4'
 * @returns isDisabledGA4 boolean
 */
export const isEnableGA4 = (): boolean => { return !isDisableGA4; };

/**
 * Create mock fill contact data
 * @returns array contactData
 */
export const mockContactData = (clickCheckUserForAll?: boolean): MockContactData => {
    const booking: any = getBookingInfo();
    const contactData: ContactData[] = [];
    let isRequired: boolean = false;
    if (Array.isArray(booking.passengers)) {
        const passengers = clickCheckUserForAll ? booking.passengers[0] : booking.passengers;
        passengers.forEach((passenger, index) => {
            contactData.push({
                phone: `66622211${index}`,
                email: `test${index}@tes.es`
            });
            const requitedContactData = passenger.requiredInformation.includes('CONTACT_DATA');
            const requitedApi = passenger.requiredInformation.includes('API');
            if(requitedContactData && !requitedApi) isRequired = true;
        });
    }

    return {contactData, isRequired};
};

/**
 * Create mock data fill form apis
 * @param isApisUSA boolean (optional)
 * @returns array passengers
 */
export const mockPassengerApisInfo = (isApisUSA?: boolean): any[] => {
    const numberText = ['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve'];
    const passengerApisInfo = [];
    const booking: any = getBookingInfo();
    if (Array.isArray(booking.passengers)) {
        const passengers = booking.passengers;
        passengers.forEach((passenger, index) => {
            const passengerApi: any = {
                name: `Test${numberText[index]}`,
                phone: '321321321',
                email: `test${numberText[index]}@test.es`,
                surname: `Tester${numberText[index]} tester`,
                birthday: {
                    day: '01',
                    month: '01',
                    year: '1980'
                },
                document: {
                    type: 'Passport',
                    number: '234254523',
                    expirationDate: {
                        day: '01',
                        month: '01',
                        year: '2027'
                    },
                    emissionCountry: 'USA'
                },
                gender: 'male',
                country: 'USA',
                nationality: 'USA',
                prefixLabel: 'España / +34',
                emergencyContact: {
                    name: 'emergency one',
                    phone: '321312321'
                }
            };
            if(isApisUSA) {
                passengerApi.destinationUSA = {
                    address:'example street',
                    zipCode:'11111',
                    city: 'example city',
                    state:'Alabama'
                };
            }

            passengerApisInfo.push(passengerApi);
        });
    }
    return passengerApisInfo;
};

/**
 * Get data service booking info
 * @returns data booking info
 */
export const getBookingInfo = (): any => { return bookingInfo;};

/**
 * Set response intercept to service booking info
 * @param data booking info
 */
export const setBookingInfo = (data: any): any => {
    bookingInfo = data;
    cy.wrap(bookingInfo).as('bookingInfo');
};

/**
 * Get isInhibitionBC
 * @returns boolean
 */
export const getInhibitBC = (): boolean => { return isInhibitBC;};

/**
 * Set isInhibitionBC
 * @param data boolean
 */
export const setInhibitBC = (data: boolean): void => { isInhibitBC = data;};

/**
 * Get isInhibitionBC
 * @returns boolean
 */
export const getCarrierConnectEnabled = (): boolean => { return isCarrierConnect;};

/**
 * Set is carrier connect
 * @param data boolean
 */
export const setCarrierConnectEnabled = (carrierConnectEnabled: boolean): void => { isCarrierConnect = carrierConnectEnabled;};

/**
 * Reset value isInhibitionBC
 */
export const resetInhibitBC = (): void => { isInhibitBC = false;};

/**
 * Check inhibit boarding card exist
 */
export const checkInhibitBoardingCard = (): void => {
    const existInhibit = (segment) => {
        let existInhibit: boolean = false;
        if(Array.isArray(segment.passengers)) {
            const passengers = segment.passengers;
            passengers.forEach(passenger => {
                const includeString = (item) => item !== 'AIRCHECK_REASON' && item !== 'INHIBIT_REASON' && item.includes('REASON');
                const checkInhibitExist = !existInhibit && Array.isArray(passenger.inhibitBoardingCard) && passenger.inhibitBoardingCard.some(includeString);
                if(checkInhibitExist) {
                    existInhibit = true;
                    setInhibitBC(existInhibit);
                }
            });
        }
    };
    const booking: any = getBookingInfo();
    setCarrierConnectEnabled(booking.carrierConnectEnabled);
    booking.outwardSegments.forEach(existInhibit);
    booking.returnSegments.forEach(existInhibit);
};

/**
 * Get isDeinvoice
 * @returns boolean
 */
export const getIsDeinvoice = (): boolean => { return isDeinvoice;};

/**
 * Set isDeinvoice
 * @param data boolean
 */
export const setIsDeinvoice = (data: boolean): void => { isDeinvoice = data;};
