import { common } from './ibe_common';
import { getAppTokenForServices, callService} from './ibe_anonymous-services';
import retrieveGlobalVariables from '../general/ibe_variables';
import * as SessionStorage from './SessionStorage';
import * as LocalStorage from './ibe-local-storage';

const {
  localeg, marketg, tokenURL, globalAppToken,
  citiesBAHService, citiesVService,
} = retrieveGlobalVariables();
const sessionStorageNameLocation = 'ibe-wcs-cities-location';
const sessionStorageName = 'ibe-wcs-cities';
const localStorageBackup = 'ibe-wcs-cities-backup';
const commonDefaultOriginCodes = ['V-O', 'M-O', 'H-O', 'C-O'];
const commonDefaultDestinationCodes = ['V-D', 'M-D'];
const emptyStored = {
  language: `${localeg.toLowerCase()}-${marketg.toUpperCase()}`,
  'V-O': null,
  'V-D': null,
  'R-O': null,
  'R-D': null,
  'H-D': null,
  'C-D': null,
};
const configMap = {
  'V-O': 'default',
  'V-D': 'default',
  'M-O': 'default',
  'M-D': 'default',
  'R-O': 'default',
  'R-D': 'default',
  'H-O': 'default',
  'H-D': 'bah',
  'C-O': 'default',
  'C-D': 'bah',
};
/*const callCitiesServiceLegacy = (cityType) => {
  const endpoints = {
    default: 'IB_SE/CacheControl6h/BrowserCache3600/Seeker/CitiesListRest',
    bah: 'IB_SE/CacheControl6h/BrowserCache3600/Seeker/SelectCityBAH',
  };
  let version = $('#SearcherContent').data('citiesversion');
  if (version === undefined || version === null) {
    version = 'default';
  }
  return new Promise(
    (resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: '/cs/Satellite',
        timeout: 2000,
        data: {
          pagename: endpoints[configMap[cityType]],
          market: marketg,
          locale: localeg,
          searchOption: cityType,
          v: version,
          d: '',
        },
      }).done((data) => {
        let tostore = false;
        let stored = SessionStorage.get(sessionStorageName);
        if (stored === null) {
          stored = emptyStored;
        }
        if (configMap[cityType] === 'default' && cityType !== 'R-O' && cityType !== 'R-D') {
          // eslint-disable-next-line prefer-destructuring
          stored['V-O'] = data[0];
          // eslint-disable-next-line prefer-destructuring
          stored['V-D'] = data[1];
          tostore = true;
        } else if (cityType === 'R-O' || cityType === 'R-D') {
          // eslint-disable-next-line prefer-destructuring
          stored['R-O'] = data[0];
          // eslint-disable-next-line prefer-destructuring
          stored['R-D'] = data[1];
          tostore = true;
        } else {
          stored[cityType] = data;
          tostore = true;
        }
        if (tostore) {
          SessionStorage.set(sessionStorageName, stored);
          if (typeof (window.localStorage) === 'object') {
            setTimeout(() => {
              LocalStorage.set(localStorageBackup, stored);
            }, 500);
          }
          resolve(stored);
        }
      }).fail(() => {
        let data;
        if (typeof (window.localStorage) === 'object') {
          data = LocalStorage.get(localStorageBackup);
          if (data && ((data[cityType])
            || (data['V-O'] && commonDefaultOriginCodes.indexOf(cityType) >= 0)
            || (data['V-D'] && commonDefaultDestinationCodes.indexOf(cityType) >= 0))) {
            SessionStorage.set(sessionStorageName, data);
            resolve(data);
          } else {
            reject();
          }
        } else { reject(); }
      });
    },
  );
};*/
const callCitiesServiceIbis = (cityType, showLocation) => {
  const endpoints = {
    default: citiesVService,
    bah: citiesBAHService,
  };
  const op = cityType[0];
  const variant = cityType[2];
  // eslint-disable-next-line arrow-body-style
  const serviceCall = (url, params, attemp) => {
    let retry = attemp !== undefined ? attemp : 0;
    const serviceCallInside = () => new Promise(
      (resolve, reject) => {
        const headers = {
          Authorization: '',
          Accept: 'application/json',
          'Accept-Language': `${localeg}-${marketg}`
        };
        if (retry <= common.MAX_ATTEMPS) {
          getAppTokenForServices(globalAppToken, tokenURL)
            .done((token) => {
              headers.Authorization = `Bearer ${token}`;
              callService(url, headers, params)
                .done((data) => { resolve(data); })
                .fail((error) => {
                  if (error.status === 401){
                    reject(error.status);
                  } else{ reject();}
                });
            })
            .fail(() => { reject(); });
        } else {
          reject();
        }
      },
    );
    return serviceCallInside();
  };
  const processBAHCities = (array) => {
    const obj = array;
    for (let i = 0; i < obj.length; i++) {
      for (let j = 0; j < obj[i].cities.length; j++) {
        obj[i].cities[j].description = obj[i].cities[j].description.substring(0, obj[i].cities[j].description.indexOf('(')).trim();
      }
    }
    return array;
  };
  return new Promise(
    (resolve, reject) => {
      let url;
      let params;
      let info;
      if (configMap[cityType] === 'bah') {
        url = `${endpoints[configMap[cityType]] + (op === 'C' ? 'car' : 'hotel')}/`;
        serviceCall(url)
          .then((data) => {
            info = processBAHCities(data);            
            resolve(info);
          })
          .catch(
            (error) => {
              let data;
              if (typeof (window.localStorage) === 'object' && error !== 401) {
                data = LocalStorage.get(localStorageBackup);
                if (data && data[cityType]) {
                  resolve(data[cityType]);
                } else {
                  reject(error);
                }
              } else { reject(error); }
            },
          );
      } else {
        url = `${endpoints[configMap[cityType]] + (variant === 'D' ? 'destination' : 'origin')}${showLocation ? '?showLocationData=true' : '/'}`;
        serviceCall(url, params).then(
          (data) => {
            resolve(data);
          },
        ).catch(
          (error) => {
            let data;
            if (!showLocation && typeof (window.localStorage) === 'object' && error !== 401) {
              data = LocalStorage.get(localStorageBackup);
              if (data && ((data[cityType])
                    || (data['V-O'] && commonDefaultOriginCodes.indexOf(cityType) >= 0)
                    || (data['V-D'] && commonDefaultDestinationCodes.indexOf(cityType) >= 0))) { 
                    resolve(data[cityType]);
              } else {
                reject(error);
              }
            } else { reject(error); }
          },
        );
      }
    },
  );
};

const getCitiesOrgDest = (cityType, showLocationData) => {
  const showLocation = showLocationData || false;
  const deferred = $.Deferred();
  const backupStorage = LocalStorage.get(localStorageBackup);
  const storageEntry = showLocation ? sessionStorageNameLocation : sessionStorageName;
  let stored = SessionStorage.get(storageEntry);
  if (!stored) {
    stored = emptyStored;
  } else if (stored.language !== `${localeg.toLowerCase()}-${marketg.toUpperCase()}`) {
    SessionStorage.remove(storageEntry);
    stored = emptyStored;
  }
  if (!showLocation && backupStorage) {
    if (backupStorage.language !== `${localeg.toLowerCase()}-${marketg.toUpperCase()}`) {
      LocalStorage.remove(localStorageBackup);
    }
  }
  const getCitiesOrgDestRetryal =  (retry) => {
      let retrial = retry|| 0
      getAppTokenForServices(globalAppToken, tokenURL).done(()=> {
      (showLocation ? getCitiesOrgDestPromise(cityType, showLocation) : Promise.all([getCitiesOrgDestPromise('V-O', showLocation), getCitiesOrgDestPromise(cityType, showLocation)]))
        .then((info) => {deferred.resolve(info)})
        .catch((info) => {
          if ( info && (info === 401 || info[0] === 401 || info[1] === 401)  && retrial < 2) {
            SessionStorage.remove('anonymousTokenForService');
            getCitiesOrgDestRetryal(++retrial);
          } else {
            deferred.reject();
          }
        });
      }).fail(()=>{deferred.reject()});
    return deferred.promise();
  };

  return new Promise ((resolve, reject)=>{
    getCitiesOrgDestRetryal()
      .done((info)=> {
        if(showLocation){
          stored[cityType] = info;
        }else{
          stored['V-O'] = info[0];
          stored['R-O'] = info[0];
          stored[cityType] = info[1];
        }
        SessionStorage.set(storageEntry, stored);
        if (!showLocation) {
          LocalStorage.set(localStorageBackup, stored);
        }
        resolve(stored);
      })
      .fail(() => {reject();})
  });
};

// eslint-disable-next-line arrow-body-style
const getCitiesOrgDestPromise = (cityType, showLocation) => {
  return new Promise(
    (resolve, reject) => {
      const storageEntry = showLocation ? sessionStorageNameLocation : sessionStorageName;
      let data = SessionStorage.get(storageEntry);
      if (data && data.language !== `${localeg.toLowerCase()}-${marketg.toUpperCase()}`) {
        SessionStorage.remove(storageEntry);
        data = undefined;
      }
      // Origin Flights memory
      if (data && ((data[cityType])
          || (data['V-O'] && commonDefaultOriginCodes.indexOf(cityType) >= 0)
          || (data['V-D'] && commonDefaultDestinationCodes.indexOf(cityType) >= 0))) {
            if (data['V-D'] && commonDefaultDestinationCodes.indexOf(cityType) >= 0) {
              resolve(data['V-D']);
            } else if (data['V-O'] && commonDefaultOriginCodes.indexOf(cityType) >= 0) {
              resolve(data['V-O']);
            } else {
              resolve(data[cityType]);
            }
      } /*else if (legacyFlag) {
        callCitiesServiceLegacy(cityType)
          .then(
            (response) => {
              resolve(response);
            },
          )
          .catch(() => { reject(); });
      } */else {
        callCitiesServiceIbis(cityType, showLocation)
          .then(
            (response) => {
              resolve(response);
            },
          )
          .catch((error) => { reject(error); });
      }
    },
  );
};

export { getCitiesOrgDest, commonDefaultDestinationCodes, commonDefaultOriginCodes };
