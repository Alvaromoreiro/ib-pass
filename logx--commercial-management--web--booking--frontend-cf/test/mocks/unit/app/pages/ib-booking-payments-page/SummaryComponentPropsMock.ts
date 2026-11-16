import { SummaryProps } from 'commercial-management--digital--web-components-design--library';

export const SummaryDefaultMock: SummaryProps = {
    trips: [],
    passengers: {
        onClick: (pass: string) => {
        },
        types: [],
        total: ''
    },
    ancillaries: [],
    otherItems: [],
    isMultiTrip: false,
    totalPrice: '',
    avios: null,
    totalDcc: null,
    onholdPrice: null,
    upgradingBid: null,
    collapsed: false
};
