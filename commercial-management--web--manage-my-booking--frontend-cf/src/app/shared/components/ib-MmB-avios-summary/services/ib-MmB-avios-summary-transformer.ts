import { Injectable } from '@angular/core';
import { MmBAppConstants } from '@src/ib-MmB-constants';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';

@Injectable({
    providedIn: 'root'
})
export class IbMmbAviosSummaryTransformer {

    constructor (
        private localStorageService: CommonsSessionStorageService
    ) { }

    generateResAviosSummaryModel = (response, flowApp) => {
        return {
            passengers: response.passengers.map((passenger) => ({
                name: this.getNameAndSurnamesByFlow(flowApp, passenger).name,
                surnames: this.getNameAndSurnamesByFlow(flowApp, passenger).surnames,
                id: passenger.id,
                memberIdentifier: passenger.memberIdentifier,
                items: passenger.ancillaries?.map((ancillary) => ({
                    title: MmBAppConstants.ANCILLARIES_LITERALS_INVOICES[ancillary.subType || ancillary.type] || ancillary.subType || ancillary.type,
                    aviosAmount: ancillary.monetaryAmount.find((item) => item.currency.code === 'AVIOS')?.amount,
                    pointsAmount: ancillary.monetaryAmount.find((item) => item.currency.code === 'TIER_POINTS')?.amount
                })),
                totalAviosPassenger: this.getPassengerTotalAviosPoints(passenger, 'AVIOS'),
                totalPointsPassenger: this.getPassengerTotalAviosPoints(passenger, 'TIER_POINTS'),
                flights: {
                    aviosAmount: passenger?.flight?.monetaryAmount.find((item) => item.currency.code === 'AVIOS')?.amount || null,
                    pointsAmount: passenger?.flight?.monetaryAmount.find((item) => item.currency.code === 'TIER_POINTS')?.amount || null
                }
            })),
            totalAvios: response.totalMonetaryAmount?.find((item) => item.currency.code === 'AVIOS')?.amount || 0,
            totalPoints: response.totalMonetaryAmount?.find((item) => item.currency.code === 'TIER_POINTS')?.amount || 0
        };
    };

    getPassengerTotalAviosPoints = (passenger, currency:string) => {
        let amount:number = 0;
        passenger.ancillaries?.forEach(ancillarie=>{
            if (ancillarie.monetaryAmount[0].currency.code === currency)
                amount += ancillarie.monetaryAmount[0].amount;
        });
        return amount + passenger.flight?.monetaryAmount?.find((item) => item.currency.code === currency)?.amount || amount;
    };

    getNameAndSurnamesByFlow = (flowApp: string, passengerInfo) => {
        switch(flowApp){
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
                case 'MMBVC':
                    const MMBVCInfo: any = this.localStorageService.get('breakdownInfo');
                    const isInfant =  passengerInfo.id.startsWith('INFANT_');
                    if (isInfant) {
                        const infant = this.searchInfoInfant(MMBVCInfo.context.passengers, passengerInfo.id);
                        passengerInfo.name = infant.name;
                        passengerInfo.surnames = infant.surname;
                    } else{
                        const passengerMMBVC: any = MMBVCInfo.context.passengers.find((item) => item.id === passengerInfo.id);
                        passengerInfo.name = passengerMMBVC.name;
                        passengerInfo.surnames = passengerMMBVC.surname;
                    }
                    break;
                case 'MMBOH':
                    const MMBOHInfo: any = this.localStorageService.get('bookingInfo');
                    const passengerMMBOH: any = MMBOHInfo.passengers.find((item) => item.passengerId === passengerInfo.id);
                    passengerInfo.name = passengerMMBOH.personalInfo.name;
                    passengerInfo.surnames = passengerMMBOH.personalInfo.surname;
                    break;
                default:
                    const DefaultInfo: any = this.localStorageService.get('bookingInfo');
                    const passengerDefault: any = DefaultInfo.passengers.find(
                        (item) => item.passengerType + '_0' + item.resiberPassengerId.toString() === passengerInfo.id
                    );
                    passengerInfo.name = passengerDefault.personalInfo.name;
                    passengerInfo.surnames = passengerDefault.personalInfo.surname;
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

    private searchInfoInfant = (passengers, id) =>{
        return passengers.find((passenger) => passenger.infant.id === id)?.infant;
    };
}
