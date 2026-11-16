import { Injectable, Inject } from '@angular/core';
import { AJSCurrencyService } from 'ib-web-commons/utils';

@Injectable({providedIn: 'root'})
export class OthersFeesViewModelService {
    constructor (
        @Inject( AJSCurrencyService ) private CurrencyService: CurrencyService
    ) { }

    public getOthersViewModel ( currency ) {
        return {
            hasElements: false,
            others: [],
            total: {
                total: 0,
                totalFormatted: this.CurrencyService.formatPrice( currency, 0, true )
            }
        };
    }

    public getOtherInfo ( otherFee, type, currency ) {
        let other: any = {};
        switch ( type ) {
                case 'DONATION':
                    other = this.createDonationFee( otherFee );
                    break;
                case 'ONHOLD_IBERIA_PAY_AFOP':
                case 'ONHOLD_CREDITCARD':
                case 'ONHOLD_IBERIA_PAY':
                case 'ONHOLD':
                    other = this.createCardOnHold( otherFee, currency );
                    break;
                case 'SUMMARY_OTHER_FEES_ADMINISTRATION':
                    other = this.createAdminFee( otherFee );
                    break;
                case 'CARD':
                default:
                    other = this.createCardFeed( otherFee );
                    break;
        }
        return other;
    }

    public createCardFeed ( cardfee ) {
        return {
            type: 'CARD',
            description: 'SUMMARY_OTHER_FEES_CREDIT_CARD',
            totalFormatted: cardfee.parsedFee || cardfee.totalPriceInfo || cardfee.totalFormatted,
            total: cardfee.totalFee || cardfee.total
        };
    }

    public createAdminFee ( cardfee ) {
        return {
            type: 'SUMMARY_OTHER_FEES_ADMINISTRATION',
            description: 'SUMMARY_OTHER_FEES_ADMINISTRATION',
            totalFormatted: cardfee.parsedFee || cardfee.totalPriceInfo,
            total: cardfee.totalFee || cardfee.total
        };
    }

    public createDonationFee ( donationFee ) {
        return {
            type: 'DONATION',
            description: donationFee.description,
            total: donationFee.total,
            totalFormatted: donationFee.totalFormatted
        };
    }

    public createCardOnHold ( cardfee, currency ) {
        const total = typeof cardfee.total !== 'undefined' ? cardfee.total : 0;

        return {
            type: 'ONHOLD',
            description: total === 0 ? 'PRICE_BREAKDOWN_ON_HOLD_24HRS' : 'PRICE_BREAKDOWN_ON_HOLD',
            totalFormatted: this.CurrencyService.formatPrice( currency, -Math.abs( total ), true ),
            total: -Math.abs( total )
        };
    }

    public deleteInfo ( othersModel, otherType, currency ) {
        if ( otherType ) {
            othersModel.others.forEach( ( fee, index ) => {
                if ( fee.type === otherType || fee.description === otherType ) {
                    othersModel.others.splice(index, 1);
                }
            });
        } else {
            othersModel = this.getOthersViewModel( currency );
        }
    }

    public updateInfo ( othersModel, currency ) {
        let total = 0;
        othersModel.others.forEach( ( fee ) => {
            total += fee.total;
        });
        othersModel.total = {
            total: total,
            totalFormatted: this.CurrencyService.formatPrice( currency, total, true )
        };
        othersModel.hasElements = othersModel.total.total >= 0 ||  othersModel.total.total < 0;

    }
}
