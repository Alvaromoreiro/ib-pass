import retrieveGlobalVariables from '../../general/ibe_variables';
import { updateLastSearches } from '../../independent/searcher-modules/ibe_last-searches-storage';
import getCalendarTransformedFeedData from '../../manage/ibe_price_feed';
import * as SessionStorage from '../../manage/SessionStorage';

const { localeg, marketg, quadrigam } = retrieveGlobalVariables();
const body = $('body');
const originCode = body.data('iata-origin');
const originName = body.data('city-origin');
const destinationCode = body.data('iata-destination');
const destinationName = body.data('city-destination');
const pricesModule = $('.ibe-chart__prices-container');
const buttonDispo = $('.inte-button-dispo', pricesModule);

const clickDisponibility = () => {
    buttonDispo.off('click', clickDisponibility);
    const tripType = pricesModule.attr('data-trip-type') === 'oneway' ? 1 : 2;
    const startDate = pricesModule.attr('data-start-date').split('-');
    const endDate = pricesModule.attr('data-end-date').split('-');
    let isValid = true;
    isValid = isValid && originCode.length > 0 && originName.length > 0 && destinationCode.length > 0 && destinationName.length > 0;
    isValid = isValid && startDate.length === 3 && (tripType === 1 || (tripType === 2 && endDate.length === 3 && endDate >= startDate));

    if (isValid) {
        const $searchCont = $('#SearcherContent');
        const host = $searchCont.attr('data-inte-integrationHost') + $searchCont.attr('data-url-booking');
        const startYear = startDate[0];
        const startMonth = startDate[1];
        const startDay = startDate[2];
        const endYear = tripType === 2 ? endDate[0] : '';
        const endMonth = tripType === 2 ? endDate[1] : '';
        const endDay = tripType === 2 ? endDate[2] : '';
        const fareType = 'R';
        const adults = 1;
        const flexible = true;
        const parameters = `?market=${marketg}&language=${localeg}&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=${flexible}&TRIP_TYPE=${tripType}&BEGIN_CITY_01=${originCode}&END_CITY_01=${destinationCode}&nombreOrigen=${originName}&nombreDestino=${destinationName}&BEGIN_DAY_01=${startDay}&BEGIN_MONTH_01=${startYear}${startMonth}&BEGIN_YEAR_01=${startYear}&END_DAY_01=${endDay}&END_MONTH_01=${endYear}${endMonth}&END_YEAR_01=${endYear}&FARE_TYPE=${fareType}&quadrigam=${quadrigam}&ADT=${adults}&BV_UseBVCookie=no`;

        const lastSearch = {
            nombreOrigen: originName,
            nombreDestino: destinationName,
            iataOrigen: originCode,
            iataDestino: destinationCode,
            fechaIda: { day: startDay, month: startMonth, year: startYear },
            fechaVuelta: { day: endDay, month: endMonth, year: endYear },
            fechasFlexibles: JSON.parse(flexible),
            adultos: adults,
            niños: 0,
            bebes: 0,
            senior: 0,
            joven: 0,
            youngType: 0,
            tarifa: fareType,
            residentes: '',
            familia: '',
            pagoAvios: false,
            pagoPuntos: false,
        };
        updateLastSearches(lastSearch);

        const CookieSeekerVal = `${originCode}|${destinationCode}|${startDay}|${startMonth}|${startYear}|${endDay}|${endMonth}|${endYear}|${flexible}|${adults}|0||0|0|0|${fareType}||||||||`;
        Cookies.set('IBERIACOM_LAST_SEARCH', CookieSeekerVal, { path: '/', expires: 365, sameSite: 'strict' });

        window.location.href = host + parameters;
    } else {
        buttonDispo.on('click', clickDisponibility);
    }
};

const getTransformedFeedData = (datos) => {
    const result = datos !== null && datos !== undefined ? datos : {};
    Object.keys(result).forEach((type) => {
        if (JSON.stringify(result[type]) !== '{}') {
            let xNext = true;
            let yNext = true;
            const { info } = result[type];
            let today = new Date();
            today = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
            let startDate = new Date(result[type].startDate);
            startDate = today.getTime() > startDate.getTime() ? today : startDate;
            const endDate = new Date(result[type].endDate);
            const newInfo = [];
            for (let xDay = 0; xDay < 90 && xNext; xDay++) {
                const xDate = new Date(startDate.getTime() + xDay * 86400000);
                const xStr = xDate.toJSON();
                const offer = { date: xStr, offers: [] };
                if (info[xStr] !== null && info[xStr] !== undefined) {
                    if (type === 'oneway') {
                        offer.price = info[xStr];
                    } else {
                        for (let yDay = 0; yDay < 90 && yNext; yDay++) {
                            const yDate = new Date(startDate.getTime() + yDay * 86400000);
                            const yStr = yDate.toJSON();
                            const option = { date: yStr, price: 0 };
                            if (info[xStr][yStr] !== null && info[xStr][yStr] !== undefined) {
                                option.price = info[xStr][yStr];
                            }
                            offer.offers.push(option);
                            yNext = !(yDate.getTime() >= endDate.getTime());
                        }
                    }
                }
                newInfo.push(offer);
                xNext = !(xDate.getTime() >= endDate.getTime());
            }
            result[type].startDate = startDate.toJSON();
            result[type].info = newInfo;
        }
    });
    return result;
};

const init = () => {
    // TODO: falta meter url service en data attr
    // TODO: falta meter property_c toggle en html
    // TODO: falta crear experiencia monentate
    if (pricesModule.length > 0) {
        const monetateConf = SessionStorage.get('ib-wcs-monetate-chartFeed');
        const checkMonetate = monetateConf === null
                            || (monetateConf[`${originCode}-${destinationCode}`]
                                && (monetateConf[`${originCode}-${destinationCode}`].markets === undefined
                                    || monetateConf[`${originCode}-${destinationCode}`].markets.length === 0
                                    || monetateConf[`${originCode}-${destinationCode}`].markets.indexOf(marketg) >= 0));

        if (originCode.length === 3 && destinationCode.length === 3) {
            if (checkMonetate) {
                // TODO: Falta meter logica de spinner
                // !: VOLVER A METER LLAMADA ONEWAY EN ibe_price_feed.js
                getCalendarTransformedFeedData(originCode, destinationCode)
                    .then((datos) => {
                        const transData = getTransformedFeedData(datos);
                        dFrontJs.ibe_chart.createAdvancedChart('chartPrices', transData);
                        dFrontJs.ibe_chart.createAdvancedChart('chartPricesReturn', transData);
                        buttonDispo.off('click', clickDisponibility);
                        buttonDispo.on('click', clickDisponibility);
                    }).catch(() => {
                        // TODO: pendiente saber qué hacer si no se recibe respuesta
                    });
            }
        }
    }
};

export { init };
