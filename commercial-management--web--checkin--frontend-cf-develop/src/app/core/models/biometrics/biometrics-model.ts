// namespace CKIBiometricsModel {
    type associateBoardingCards = {
        documentNumber: string,
        documentType: string,
        documentEmissionCountry: string,
        email: string,
        boardingCards: string [];
    };

export type associateBoardingCardsRequest = {
    associateBoardingCards: associateBoardingCards[];
};
    
    type biometricStatus = {
        boardingCard: string,
        status: string,
        description: string,
    };

    type validatedAssociatedStatus = {
        documentNumber: string,
        associatedStatus: biometricStatus[]
    };

export type associateBoardingCardsResponse = {
    validatedAssociatedStatus: validatedAssociatedStatus[];
};
// } 