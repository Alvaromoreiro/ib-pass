import { CommonsAviosConstantsType } from 'ib-web-commons/constants';

@Service('ib-ui-avios-summary-module', [
    'localStorageService',
    'CommonsAviosConstants'
    ])
export class IbUiAviosSummaryTransformer {
    constructor (
        private localStorageService: ng.local.storage.ILocalStorageService,
        private CommonsAviosConstants: CommonsAviosConstantsType
    ) {}

    generateResAviosSummaryModel = (response, flowApp) => {
        return {
            passengers: response.passengers.map((passenger) => ({
                name: this.getNameAndSurnamesByFlow(flowApp, passenger).name,
                surnames: this.getNameAndSurnamesByFlow(flowApp, passenger).surnames,
                id: passenger.id,
                memberIdentifier: passenger.memberIdentifier,
                items: passenger.ancillaries?.map((ancillary) => ({
                    title: this.CommonsAviosConstants.ANCILLARIES_LITERALS[ancillary.subType || ancillary.type] || ancillary.subType || ancillary.type,
                    aviosAmount: ancillary.monetaryAmount.find((item) => item.currency.code === 'AVIOS')?.amount,
                    pointsAmount: ancillary.monetaryAmount.find((item) => item.currency.code === 'TIER_POINTS')?.amount
                })),
                totalAviosPassenger: this.getPassengerTotalPoints(passenger, 'AVIOS'),
                totalPointsPassenger: this.getPassengerTotalPoints(passenger, 'TIER_POINTS'),
                flights: {
                    aviosAmount: passenger?.flight?.monetaryAmount?.find((item) => item.currency.code === 'AVIOS')?.amount || null,
                    pointsAmount: passenger?.flight?.monetaryAmount?.find((item) => item.currency.code === 'TIER_POINTS')?.amount || null
                }
            })),
            totalAvios: response.totalMonetaryAmount?.find((item) => item.currency.code === 'AVIOS')?.amount || 0,
            totalPoints: response.totalMonetaryAmount?.find((item) => item.currency.code === 'TIER_POINTS')?.amount || 0
        }; 
    
    };

    getPassengerTotalPoints = (passenger, currency: string) => {
        return passenger?.monetaryAmount
            ?.filter(m => m.currency.code === currency)
            ?.reduce((acc, curr) => acc + curr.amount, 0) ?? 0;
    };
    
    getNameAndSurnamesByFlow = (flowApp: string, passengerInfo) => {
        switch(flowApp){
                case 'BBKI':
                    const bookingInfo:any = this.localStorageService.get('bookingInfo');
                    const passengerBKI: any = bookingInfo.passengers.find(item => 
                        item.passengerId === passengerInfo.id
                    );
                    passengerInfo.name = passengerBKI.personalInfo.name;
                    passengerInfo.surnames = passengerBKI.personalInfo.surname + ' ' + passengerBKI.personalInfo.lastSurname;
                    break;
                case 'BBKIOH':
                    const bookingOHInfo:any = this.localStorageService.get('bookingInfo');
                    const passengerBKIOH: any = bookingOHInfo.passengers.find(item => 
                        item.passengerId === passengerInfo.id
                    );
                    passengerInfo.name = passengerBKIOH.personalInfo.name;
                    passengerInfo.surnames = passengerBKIOH.personalInfo.surname + ' ' + passengerBKIOH.personalInfo.lastSurname;
                    break;
                case 'MMB':
                    const MMBInfo:any = this.localStorageService.get('breakdownInfo');
                    let passengerMMB: any = '';
                    MMBInfo.context.passengers.filter(item =>{
                        if (item.id === passengerInfo.id) {
                            passengerMMB = item;
                        } else if (item?.infant?.id === passengerInfo.id ) {
                            passengerMMB = item.infant;
                        }
                    });
                    
                    passengerInfo.name = passengerMMB.name;
                    passengerInfo.surnames = passengerMMB.surname;
                    
                    break;
                case 'CKI':
                    const CKIInfo:any = this.localStorageService.get('bookingInfo');
                    const passengerCKI: any = CKIInfo.passengers.find(item => 
                        (item.type + '_0' + item.id.toString()) === passengerInfo.id
                    );
                    passengerInfo.name = passengerCKI?.name ?? '';
                    passengerInfo.surnames = passengerCKI?.surname ?? '';
                    break;
                case 'MMBVC':
                    const MMBVCInfo: any = this.localStorageService.get('breakdownInfo');

                    const isInfant = passengerInfo.id.startsWith('INFANT_');

                    if (isInfant) {
                        const infant = this.searchInfoInfant(
                            MMBVCInfo.context.passengers,
                            passengerInfo.id
                        );
                        passengerInfo.name = infant.name;
                        passengerInfo.surnames = infant.surname;
                    } else {
                        const passengerMMBVC: any = MMBVCInfo.context.passengers.find(
                            (item) => item.id === passengerInfo.id
                        );
                        passengerInfo.name = passengerMMBVC.name;
                        passengerInfo.surnames = passengerMMBVC.surname;
                    }

                    break;
                case 'MMBOH':
                    const MMBOHInfo: any = this.localStorageService.get('bookingInfo');
                    const passengerMMBOH: any = MMBOHInfo.passengers.find(
                        (item) => item.passengerId === passengerInfo.id
                    );
                    passengerInfo.name = passengerMMBOH.personalInfo.name;
                    passengerInfo.surnames = passengerMMBOH.personalInfo.surname;

                    break;
                default:
                    const DefaultInfo: any = this.localStorageService.get('bookingInfo');
                    const passengerDefault: any = DefaultInfo.passengers.find(
                        (item) => item.type + '_0' + item.id.toString() === passengerInfo.id
                    );
                    passengerInfo.name = passengerDefault.name;
                    passengerInfo.surnames = passengerDefault.surname;
                    break;
        }
        return passengerInfo;
    };
    generateReqAviosSummaryModel = (request) => {
        request?.passengers.forEach((passenger) => {
            if (!passenger.ancillaries) {
                passenger['ancillaries'] = [];
            }
        });
        return request;
    };

    private searchInfoInfant = (passengers, id) => {
        return passengers.find((passenger) => passenger.infant.id === id)?.infant;
    };
}
