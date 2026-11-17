export interface ICkiBiometricStatusPassengers {
    prefixList: IPrefixList[]
    formatsList: IFormatsList[]
    channelsList: IChannelsList[]
    passengersList: IPassengersList[]
    segmentsList: string[]
    downloadFormatSelected: any[]
    indexPassengerSelected: number
    showEmail: boolean
    showPhone: boolean
    showBiometric: boolean
    selectedTab: number
    documents: IDocument[]
    passengersStatusBySegment: PassengersStatusBySegment[]
}

export interface IPrefixList {
    code: string
    description: string
    countryCode: string
}

export interface IFormatsList {
    type: string
    class: string
    description: string
    isSelected: boolean
    priority: number
}

export interface IChannelsList {
    type: string
    class: string
    description: string
    isSelected: boolean
    priority: number
}

export interface IPassengersList {
    id: string
    type: string
    name: string
    surname: string
    biometricBoardingStatus: string
    phone: IPhone
}

export interface IPhone {
    countryCode: string
}

export interface IDocument {
    segments: CkiBoardingCardModal.ModalSegmentInfo[]
    contactDataRequired: boolean
    biometricConditions: BiometricConditions
    type: string
}

export interface BiometricConditions {
    conditions: Condition[]
}

export interface Condition {
    condition: string
    code: string
}

export interface PassengersStatusBySegment {
    segment: string
    status: string
    id: string
    type: string
}
