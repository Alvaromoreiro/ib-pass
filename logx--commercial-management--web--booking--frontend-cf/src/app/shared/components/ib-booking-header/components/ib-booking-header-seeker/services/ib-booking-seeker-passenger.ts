import { SeekerPassengerInfoModel, SeekerPassengerModel } from '@src/app/core/models/ib-booking-availability/header-seeker-model';

export const passengerSelectorConstants = {
    PASSENGER_TYPES: {
        DEFAULT: 'DEFAULT',
        SENIOR: 'SENIOR',
        ADULT: 'ADULT',
        YOUNG: 'YOUNG',
        YOUTH: 'YOUTH',
        CHILD: 'CHILD',
        INFANT: 'INFANT',
        SPECIAL_NEEDS: 'SPECIAL_NEEDS'
    }
};


export class IbBookingSeekerPassengerService {
    constructor () {}

    buildDefaultPassengers (): {
        adults: SeekerPassengerModel;
        senior: SeekerPassengerModel;
        young: SeekerPassengerModel;
        child: SeekerPassengerModel;
        teenager: SeekerPassengerModel;
        infant: SeekerPassengerModel;
    } {
        const P = passengerSelectorConstants.PASSENGER_TYPES;
        const base = { maxPassengers: 9, isActive: true, isHidden: false, showMessage: false };

        const adults: SeekerPassengerModel = { passengerType: P.ADULT, minPassenger: 1, ...base, infoAge: 'HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_AGE_TEXT', count: 1 };
        const senior: SeekerPassengerModel = { passengerType: P.SENIOR, minPassenger: 0, ...base, infoAge: 'HEADER_ADVANCED_SEARCH_PASSENGER_SENIOR_AGE_TEXT', count: 0 };
        const young: SeekerPassengerModel = { passengerType: P.YOUTH, minPassenger: 0, ...base, infoAge: 'HEADER_ADVANCED_SEARCH_PASSENGER_YOUNG_AGE_TEXT', count: 0 };
        const child: SeekerPassengerModel = { passengerType: P.CHILD, minPassenger: 0, ...base, infoAge: 'HEADER_ADVANCED_SEARCH_PASSENGER_CHILD_AGE_TEXT', count: 0 };
        const teenager: SeekerPassengerModel = { passengerType: P.YOUNG, minPassenger: 0, ...base, infoAge: 'HEADER_ADVANCED_SEARCH_PASSENGER_TEENAGER_AGE_TEXT', count: 0 };
        const infant: SeekerPassengerModel = { passengerType: P.INFANT, minPassenger: 0, ...base, infoAge: 'HEADER_ADVANCED_SEARCH_PASSENGER_INFANT_AGE_TEXT', count: 0 };

        return { adults, senior, young, child, teenager, infant };
    }

    
    getPassengerCount (passengerType: string, passengers: SeekerPassengerInfoModel): number {
        const passengerTypeMap: Record<string, number> = {
            [passengerSelectorConstants.PASSENGER_TYPES.SENIOR]: passengers.numSeniors || 0,
            [passengerSelectorConstants.PASSENGER_TYPES.ADULT]: passengers.numAdults || 0,
            [passengerSelectorConstants.PASSENGER_TYPES.YOUTH]: passengers.numYouth || 0,
            [passengerSelectorConstants.PASSENGER_TYPES.YOUNG]: passengers.numTeenager || 0,
            [passengerSelectorConstants.PASSENGER_TYPES.CHILD]: passengers.numChilds || 0,
            [passengerSelectorConstants.PASSENGER_TYPES.INFANT]: passengers.numInfants || 0
        };

        return passengerTypeMap[passengerType] ?? 0;
    }
    
    
    checkSpecialPassengerOriginDestination = (passengerType: string, originCode: string, destinationCode: string, specialPassengerOriginDestinationList:unknown): boolean => {
        let  originMatchedElement: any = {}, destinationCodeMatches: boolean = false;
        if(specialPassengerOriginDestinationList && specialPassengerOriginDestinationList[passengerType]?.length > 0) {
            originMatchedElement = specialPassengerOriginDestinationList[passengerType].find( originCodeElement => originCodeElement.origin === originCode);
            if(!originMatchedElement) {
                originMatchedElement = specialPassengerOriginDestinationList[passengerType].find( originCodeElement => originCodeElement.origin === '*');
            }
            destinationCodeMatches = originMatchedElement ? originMatchedElement.destination.some( destinationCodeElement => destinationCodeElement === destinationCode || destinationCodeElement === '*' ) : false;
            if(destinationCodeMatches) {
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    };
    
}
