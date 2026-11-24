import type { PmtPageController } from '../ib-pmt-controller';

export type LoggedCardLookupParams = {
    selectedLoggedCard: any;
    customerCreditCards: any;
    issuerCountry: any;
    creditCardFormModel: any;
};

function getCardTypeCards(customerCreditCards: any, cardType: string) {
    return customerCreditCards[cardType];
}

function shouldAssignIssuerCountry(card: any): boolean {
    return card.profileCardId !== 'newCard' && !card.profileAddressInfo.country;
}

function isMatchingActiveLoggedCard(card: any, selectedLoggedCard: any): boolean {
    return card.active && card.profileCardId === selectedLoggedCard.profileCardId;
}

function findLoggedCardInList(cards: any[], selectedLoggedCard: any, issuerCountry: any) {
    let cardIndex = 0;
    while (cardIndex < cards.length) {
        const card = cards[cardIndex];
        if (isMatchingActiveLoggedCard(card, selectedLoggedCard)) {
            if (shouldAssignIssuerCountry(card)) {
                card.profileAddressInfo.country = issuerCountry;
            }
            return card;
        }
        cardIndex++;
    }
    return null;
}

export function getSelectedLoggedCardImpl(ctrl: PmtPageController, params: LoggedCardLookupParams) {
    const { selectedLoggedCard, customerCreditCards, issuerCountry, creditCardFormModel } = params;
    if (!selectedLoggedCard || !customerCreditCards) {
        return null;
    }
    const cards = getCardTypeCards(customerCreditCards, creditCardFormModel.type);
    return findLoggedCardInList(cards, selectedLoggedCard, issuerCountry);
}
