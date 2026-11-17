import { common } from './ibe_common';
import { getAppTokenForServices, callService} from './ibe_anonymous-services';
import retrieveGlobalVariables from '../general/ibe_variables';
import * as SessionStorage from './SessionStorage';

const {
    localeg, marketg, tokenURL, globalAppToken,
  } = retrieveGlobalVariables();

async function retrieveUrlIBHolidays(serviceUrl) {
    let iterate = true;
    let token;
    let data;
    
    const headers = {
        'Content-Type': 'application/json',
        'Accept-Language': `${localeg}-${marketg.toUpperCase()}`,
      };
      for (let i = 0; i <= common.MAX_ATTEMPS && iterate; i++) {
        token = await getAppTokenForServices(globalAppToken, tokenURL);
        headers.Authorization = `Bearer ${token}`;
        try {
          data = await callService(serviceUrl, headers, undefined, 'GET');
          iterate = false;
        } catch (error) {
          if (error.status !== 401 || i === common.MAX_ATTEMPS) {
            iterate = false;
            throw new Error('IBHolidays: Error retrieveing url');
          } else {
            iterate = true;
            SessionStorage.remove('anonymousTokenForService');
          }
        }
      }
      return data;
}

const getUrlIBHolidays = (idLanding) => {
    const deferred = $.Deferred();
    if (idLanding) {
        let serviceUrl = $("#PropertiesSpan").data('service-ibholidays');
        serviceUrl = serviceUrl.replace('{landingId}', idLanding);
        if (serviceUrl) {
            retrieveUrlIBHolidays(serviceUrl)
            .then((data) => {
                if (data !== undefined) {
                    if (data.error) {
                        deferred.reject([]);
                    } else {
                        deferred.resolve(data);
                    }
                } else { 
                    deferred.reject([]); 
                }
                })
            .catch((error) => {
                deferred.reject([]);
            });
        } else{
            deferred.reject([]);
        }
        
    } else {
        deferred.reject([]);
    }
        return deferred.promise();
  };

export default getUrlIBHolidays;