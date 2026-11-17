import { common } from './ibe_common';
import { getAppTokenForServices, callService} from './ibe_anonymous-services';
import retrieveGlobalVariables from '../general/ibe_variables';
import * as SessionStorage from './SessionStorage';

const {
    localeg, marketg, tokenURL, globalAppToken,
} = retrieveGlobalVariables();

const serviceUrl = $('#SearcherContent, .ibe-chart__prices-container').data('pricefeed');
const sessionStorageKey = 'ib-wcs-calendar-price-feed';
const storageVal = {
    market: marketg,
};

/**
 * retrieveFeedData
 * @description function that retrives the configuration for price feed
 * @param {string} originIATA IATA code of the origin
 * @param {string} destinationIATA IATA code of the destination
 * @param {object} options  Object that contains some options
 * @param {boolean} options.isReturn to ask the service for departure or return results. false by default
 * @param {boolean} options.roundtrip to ask the service for roundtrip or one way results. true by default
 * @param {boolean} options.privateFare to ask service to private fare (CUG) prices
 * @return {Promise}
 *
 */
const retrieveFeedData = (originIATA, destinationIATA, options) => {
  const url = serviceUrl + ((options && options.isReturn === true && options.roundtrip !== false)? 'return':'departure');
  const headers = {
    Authorization: '',
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Language': `${localeg}-${marketg.toUpperCase()}`,
  };
  const params = {
    origin : originIATA,
    destination: destinationIATA,
    marketCode : marketg.toUpperCase(),
    roundtrip : !(options !== undefined && options.roundtrip === false)
  }
  return new Promise((resolve, reject) => {
    getAppTokenForServices(globalAppToken, tokenURL)
      .done((token) => {
        headers.Authorization = `Bearer ${token}`;
        callService(url,headers,JSON.stringify(params),'POST')
            .then((data) => {
              resolve(data);
            }).catch((error) => { 
              reject(error.status);
            })
      }).fail(() => {
        reject(0);
      });
  })
}
const transformServiceData  = (data) => {
  let result = null;
  let  offerDateKey;

  const transformOptions = (offer) => {
    let result = null;
    let optionDateKey = (offer.type === 'return') ? 'departureDate': 'returnDate';
    if(offer && offer.options && offer.options.length > 0 ) {
      result = {};
      for (let option of offer.options) {
        result[new Date(option[optionDateKey]).toJSON()] = option.price;
      }
    }
    return result;
  };
  if (data && data.offers && data.offers.length > 0) {
    result = {};
    for (let offer of data.offers) {
      offerDateKey = (offer.type === 'return') ? 'returnDate': 'departureDate';
      result[new Date(offer[offerDateKey]).toJSON()] = (offer.type !== 'oneway')? transformOptions(offer) : offer.price;
    }
  }
  return result;
}

const getCalendarTransformedFeedData =  async (originIATA, destinationIATA, privateFare)  => {
  if ((typeof serviceUrl === 'string') && serviceUrl.length > 0 ){
    let  callPromiseResult, iterate = true;
    let isPrivateFare = (privateFare === true) ? privateFare : false; 
    let sessionData = Object.assign(JSON.parse(JSON.stringify(storageVal)), SessionStorage.get(sessionStorageKey));
    if ( sessionData.market !== marketg ) {
      sessionData = JSON.parse(JSON.stringify(storageVal));
    }
    if (sessionData[`${originIATA}-${destinationIATA}`]){
      return sessionData[`${originIATA}-${destinationIATA}`];
    } 
    for (let i = 0; i <= common.MAX_ATTEMPS && iterate; i++) {
      try {
        await getAppTokenForServices(globalAppToken, tokenURL);  
        callPromiseResult = await Promise.all(
          [retrieveFeedData(originIATA,destinationIATA,{isReturn: false, roundtrip: true, privateFare: isPrivateFare}),
          retrieveFeedData(originIATA,destinationIATA,{isReturn: true, roundtrip: true, privateFare: isPrivateFare}),
          ]);
        iterate= false; 
      } catch (errorCode){
        if (errorCode !== 401 || i === common.MAX_ATTEMPS) {
          iterate = false;
          throw new Error('Prices Feed: Error retrieveing feed data');
        } else {
          iterate = true;
          SessionStorage.remove('anonymousTokenForService');
        }
      }
    }
    sessionData[`${originIATA}-${destinationIATA}`] = {
      departure: {info: transformServiceData(callPromiseResult[0]),
                  startDate: (callPromiseResult[0].startDate)? new Date(callPromiseResult[0].startDate) : null,
                  endDate: (callPromiseResult[0].endDate) ? new Date(callPromiseResult[0].endDate) : null
                },
      return: { info: transformServiceData(callPromiseResult[1]),
                startDate: callPromiseResult[1].startDate ? new Date(callPromiseResult[1].startDate) : null,
                endDate:  callPromiseResult[1].endDate ? new Date(callPromiseResult[1].endDate) : null
              },
      oneway: { 
              }
    }
    SessionStorage.set(sessionStorageKey, sessionData);
    return sessionData[`${originIATA}-${destinationIATA}`] ;
  } else {
    throw new Error ('Prices Feed: url not existing in HTML');
  }
}

export default getCalendarTransformedFeedData;
