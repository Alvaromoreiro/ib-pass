(function () {
    'use strict';

    angular.module('ib-MmB-transformers-module').factory('CalculatePointsTransformer', CalculatePointsTransformer);

    CalculatePointsTransformer.$inject = ['MmBAppConstants'];
    function CalculatePointsTransformer(MmBAppConstants) {
        return {
            TransCalcPointsData: TransCalcPointsData,
            genCalAviosSummary: genCalAviosSummary,
            TransCalcPointsForPassenger: TransCalcPointsForPassenger
        };

        ////////////////

        /**
         * generate request flightaviosinfo
         * @param {*} fareData
         * @param {*} ancillariesSlices
         * @param {*} ancillaries
         * @returns
         */
        function genCalAviosSummary(fareData, ancillariesSlices = null, ancillaries = null, onHold = false) {
            try {
                return {
                    currency: {
                        code: fareData.order.price.currency
                    },
                    flight: {
                        discounts: addDiscounts(fareData.order.specialDiscounts,fareData.paymentItems, fareData.order.voucherDiscount),
                        yq: onHold ? fareData.order.orderItems[0]?.passengerPrices[0]?.taxes.filter((tax) => tax.code === 'YQ').reduce((a, b) => a + b.amount, 0) : 0,
                        slices: fareData.order.slices.map((slice, index) => ({
                            id: slice.sliceId,
                            segments: slice.segments.map((seg) => ({
                                commercialCode: MmBAppConstants.AVAILABLE_COMMERCIAL_CODES.includes(
                                    seg.cabin?.fareFamily
                                )
                                    ? seg.cabin?.fareFamily
                                    : null,
                                id: seg.id,
                                operatingCarrier: {
                                    code: seg.flight.operationalCarrier.code
                                },
                                marketingCarrier: {
                                    code: seg.flight.marketingCarrier.code
                                },
                                schedule: {
                                    departureAirportCode: seg.departure.code,
                                    arrivalAirportCode: seg.arrival.code,
                                    departureDate: seg.departureDateTime.split(' ')[0]
                                },
                                bookingClass: {
                                    code: seg.cabin.rbd
                                },
                                bookingCabin: {
                                    code: seg.cabin?.code
                                },
                                fareProduct:
                                    fareData.fareFamilyConditions[index]?.commercialNameES || fareData.fareFamilyConditions[0]?.commercialNameES
                            }))
                        }))
                    },
                    passengers: fareData.passengers.map((passenger) => ({
                        id: passenger.passengerId,
                        memberIdentifier: passenger.frequentFlyerInfo?.number,
                        bookingSummary: genBookingSummary(fareData),
                        ancillaries: onHold ? genAncillariesForPassenger(ancillariesSlices, ancillaries, passenger.passengerId) : [],
                        flight: onHold ? genFlight(true, fareData, passenger) : genFlight(false,fareData, passenger)

                    }))
                };
            } catch (error) {
                return null;
            }
        }

        function genFlight(onHold, fareData, passenger) {
            if (onHold) {
                return {
                    slices: fareData.order.slices.map((slice) => ({
                        id: slice.sliceId,
                        fare: slice.detailedPrices?.find(el => el.passengerIds.includes(passenger.passengerId))?.segmentPrices[0]?.price?.fare || null,
                        totalFare: slice.detailedPrices?.find(el => el.passengerIds.includes(passenger.passengerId))?.fare || null,
                    }))
                };
            } else {
                return {
                    slices: fareData.order.slices.map((slice) => ({
                        id: slice.sliceId,
                        fare: 0,
                        totalFare: 0
                    }))
                };
            }
        }

        /**
         * generate ancillaries for request flightaviosinfo
         * @param {*} ancillariesSlices
         * @param {*} ancillaries
         * @param {*} passengerId
         * @returns
         */
        function genAncillariesForPassenger(ancillariesSlices, ancillaries, passengerId) {
            if( ancillariesSlices === null || ancillaries === null) return [];

            const renameTypes = (type)=>{
                switch (type) {
                    case 'baggage':
                        return MmBAppConstants.ANCILLARIES_TYPES.BAGGAGE;
                    case 'priorityBoarding':
                        return MmBAppConstants.ANCILLARIES_TYPES.PRIORITY_BOARDING;
                    case 'seat':
                        return MmBAppConstants.ANCILLARIES_TYPES.SEAT;
                    default:
                        return type;
                }
            };

            const ancillariesForPassenger = [];
            ancillaries.filter(anc => anc.type !== 'flight' && anc.passengerId === passengerId).map((anc)=>{
                if(anc.sliceId){
                    ancillariesForPassenger.push({
                        type: renameTypes(anc.type),
                        subtype: anc.subtype || null,
                        amounts: [{
                            fare: anc.price.fare,
                            quantity: anc.amount
                        }],
                        slices: [{
                            id: ancillariesSlices.find(slice => slice.id === anc.sliceId).id,
                            segments:[{
                                id: ancillariesSlices.find(slice => slice.id === anc.sliceId).segmentIds[0]
                            }]
                        }]
                    });
                };

                if(anc.segmentId){
                    const idSlc = ancillariesSlices.find(x => x.segmentIds[0] === anc.segmentId).id;
                    ancillariesForPassenger.push({
                        type: renameTypes(anc.type),
                        subtype: anc.subtype || null,
                        amounts: [{
                            fare: anc.price.fare,
                            quantity: 1
                        }],
                        slices: [{
                            id: ancillariesSlices.find(slice => slice.id === idSlc).id,
                            segments:[{
                                id: anc.segmentId
                            }]
                        }]
                    });
                };

            });

            return ancillariesForPassenger;
        }

        /**
         * add discounts for request flightaviosinfo
         * @param {*} specialDiscounts
         * @param {*} paymentItems
         * @returns
         */
        function addDiscounts(specialDiscounts, paymentItems, voucherDiscount) {
            let discount1 = [], discount2 = [], discount3 = [];
            if(specialDiscounts){
                discount1 =
                    specialDiscounts
                        .filter((el) => MmBAppConstants.AVAILABLE_AVIOS_DISCOUNTS.includes(el.type))
                        .map((discount) => ({
                            type: discount.type,
                            percentDiscount: discount.percentDiscount || null,
                            totalDiscount: discount.totalDiscount
                        })) || [];
            }
            if(paymentItems){
                discount2 =
                    paymentItems
                        .filter((el) => MmBAppConstants.AVAILABLE_AVIOS_DISCOUNTS.includes(el.type))
                        .map((discount) => ({
                            type: discount.type,
                            percentDiscount: discount.percentDiscount || null,
                            totalDiscount: discount.total
                        })) || [];
            }

            if(MmBAppConstants.AVAILABLE_AVIOS_DISCOUNTS.includes(voucherDiscount?.type)){
                discount3 = [{
                    type: voucherDiscount.type,
                    percentDiscount: voucherDiscount.percentDiscount || null,
                    totalDiscount: voucherDiscount.amount
                }];


            }

                return discount1.concat(discount2, discount3);


        }


        /**
         * generate total points
         * @param {*} data
         * @returns
         */
        function TransCalcPointsData (data) {
            const avios = data.totalMonetaryAmount?.filter(el => el.currency.code === 'AVIOS')[0]?.amount || 0;
            const elite = data.totalMonetaryAmount?.filter(el => el.currency.code === 'TIER_POINTS')[0]?.amount || 0;
            return { Avios: avios, Elite: elite };
        }

        /**
         * generate bookingsummary if contain tickets
         * @param {*} data
         * @returns
         */
        function genBookingSummary(fareData){
            if(fareData.tickets){
                return {
                    bookingDate: fareData.order.bookingCreationDates[0].creationDate,
                    tickets: fareData.tickets?.map((tiket) => ({
                        ticketingCarrier: {
                            code: tiket.ticketNumbers[0].substring(0, 3)
                        },
                        number: tiket.ticketNumbers[0].substring(3, tiket.ticketNumbers[0].length),
                        issuanceDate: tiket.issuanceDate ? tiket.issueDateTime.split(' ')[0] : null
                    })) || []
                };
            }else{
                return null;
            }
        }

        /**
         * generate info amount for passenger
         * @param {*} data
         * @returns
         */
        function TransCalcPointsForPassenger(data){

            return data.passengers.map((passenger)=>({
                id: passenger.id,
                memberIdentifier: passenger.memberIdentifier || null,
                avios: passenger.flight.monetaryAmount[0]?.amount || 0,
                elite: passenger.flight.monetaryAmount[1]?.amount || 0,
            }));
        }


    }
})();
