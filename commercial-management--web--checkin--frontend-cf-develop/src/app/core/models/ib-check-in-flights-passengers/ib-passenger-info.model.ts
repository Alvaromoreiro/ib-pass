export interface IbPassengerInfo {
    id: number
    type: string
    requiredInformation: any[]
    isSelected: boolean
    name: string
    surname: string
    gender: string
    infant: IInfant
    pasStatus: IPasStatus
    requiresApis: boolean
    fieldStatus: IFieldStatus
    contactData: IContactData
    language: string
    frequentFlyer: IFrequentFlyer
    inhibitBoardingCard: IInhibitBoardingCard
    initialData: IInitialData
    items: any[]
}

interface IPasStatus {
    available: boolean
    isChecked: boolean
    reason: any
    isApiEsta: boolean
    hasSBY: boolean
}

interface IFieldStatus {
    contactData: IContactDataStatus
    emergencyData: IEmergencyData
    gender: IGender
    frequentFlyer: IFrequentFlyerStatus
}

interface IContactDataStatus {
    available: boolean
    show: boolean
    mandatory: boolean
}

interface IEmergencyData {
    available: boolean
    show: boolean
    mandatory: boolean
}

interface IGender {
    show: boolean
    mandatory: boolean
}

interface IFrequentFlyerStatus {
    show: boolean
    mandatory: boolean
    isOpenPA: boolean
}

interface IContactData {
    denyNewsLetter: boolean
    email: string
    phone: IPhone
    emergency: IEmergency
    available: boolean
}

interface IPhone {
    countryCode: string
    number: string
}

interface IEmergency {
    phone: IPhone
}

interface IFrequentFlyer {
    info: IInfo
    enabled: boolean
}

interface IInfo {
    number: string
    iataCompanyCode: string
}

interface IInhibitBoardingCard {
    status: boolean
    reason: any[]
    url: string
}

interface IInitialData {
    contact: IContact
    emergency: IEmergency
}

interface IContact {
    gender: string
    phone: IPhone
    email: string
    frequentFlyer: IFrequentFlyer
}

interface IInfant {
    name: string
    surname: string
}