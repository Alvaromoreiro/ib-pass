import retrieveGlobalVariables from '../general/ibe_variables';
import { getAppTokenForServices, callService } from './ibe_anonymous-services';
import { common, updateDatalayer, updateDigitalData } from './ibe_common';
import * as SessionStorage from './SessionStorage';

const {
  localeg, marketg, tokenURL, globalAppToken,
} = retrieveGlobalVariables();
/** getFlightStatuses
 * INPUTS:
 * origin: IATA code
 * destination: IATA code
 * dates: Date object with the departure date
 * arlines: String with desired airlines codes pipe separeted EX : IB|BA
 *
 * RETURN: FligStats object with the information of the routes that match
 * with input parameter
 *
 */

function flightStatusServices() {
  const filterResult = (data) => {
    const dAirports = data.appendix.airports;
    const dAirlines = data.appendix.airlines;
    const dEquipments = data.appendix.equipments;
    const dStatus = data.flightStatuses;
    const fStatuses = []; let estimateDep; let estimateArr;
    let depAirport; let publishedDep; let publishedArr; let arrAirport; let timeUTC; let timeUTCArr;
    dStatus.forEach((el) => {
      if (el.operationalTimes.actualGateDeparture) {
        estimateDep = el.operationalTimes.actualGateDeparture.dateLocal;
        timeUTC = el.operationalTimes.actualGateDeparture.dateUtc;
      } else if (el.operationalTimes.estimatedGateDeparture) {
        estimateDep = el.operationalTimes.estimatedGateDeparture.dateLocal;
        timeUTC = el.operationalTimes.estimatedGateDeparture.dateUtc;
      } else if (el.operationalTimes.scheduledGateDeparture) {
        estimateDep = el.operationalTimes.scheduledGateDeparture.dateLocal;
        timeUTC = el.operationalTimes.scheduledGateDeparture.dateUtc;
      } else {
        estimateDep = undefined;
        timeUTC = undefined;
      }

      if (el.operationalTimes.actualGateArrival) {
        estimateArr = el.operationalTimes.actualGateArrival.dateLocal;
        timeUTCArr = el.operationalTimes.actualGateArrival.dateUtc;
      } else if (el.operationalTimes.estimatedGateArrival) {
        estimateArr = el.operationalTimes.estimatedGateArrival.dateLocal;
        timeUTCArr = el.operationalTimes.estimatedGateArrival.dateUtc;
      } else if (el.operationalTimes.scheduledGateArrival) {
        estimateArr = el.operationalTimes.scheduledGateArrival.dateLocal;
        timeUTCArr = el.operationalTimes.scheduledGateArrival.dateUtc;
      } else {
        estimateArr = undefined;
        timeUTCArr = undefined;
      }

      if (el.operationalTimes.publishedDeparture) {
        publishedDep = el.operationalTimes.publishedDeparture.dateLocal;
      } else if (el.operationalTimes.flightPlanPlannedDeparture) {
        publishedDep = el.operationalTimes.flightPlanPlannedDeparture.dateLocal;
      } else {
        publishedDep = undefined;
      }

      if (el.operationalTimes.publishedArrival) {
        publishedArr = el.operationalTimes.publishedArrival.dateLocal;
      } else if (el.operationalTimes.flightPlanPlannedArrival) {
        publishedArr = el.operationalTimes.flightPlanPlannedArrival.dateLocal;
      } else {
        publishedArr = undefined;
      }

      depAirport = dAirports.filter((obj) => obj.iata === el.departureAirportFsCode);
      arrAirport = dAirports.filter((obj) => obj.iata === el.arrivalAirportFsCode);

      const depInfo = {
        airportCode: el.departureAirportFsCode,
        airportName: depAirport.length > 0 ? depAirport[0].name : undefined,
        cityName: depAirport.length > 0 ? depAirport[0].city : undefined,
        terminal: el.airportResources ? el.airportResources.departureTerminal : undefined,
        gate: el.airportResources ? el.airportResources.departureGate : undefined,
      };
      const arrInfo = {
        airportCode: el.arrivalAirportFsCode,
        airportName: arrAirport.length > 0 ? arrAirport[0].name : undefined,
        cityName: arrAirport.length > 0 ? arrAirport[0].city : undefined,
        terminal: el.airportResources ? el.airportResources.arrivalTerminal : undefined,
        baggage: el.airportResources ? el.airportResources.baggage : undefined,
      };
      const departureTime = {
        estimate: estimateDep,
        timeUTC,
        published: publishedDep,
        confirmed: estimateDep,
      };
      const arrivalTime = {
        estimate: estimateArr,
        timeUTCArr,
        published: publishedArr,
        confirmed: estimateArr,
      };

      const filteredCarrier = dAirlines.filter((obj) => obj.iata === el.carrierFsCode);
      const filterCodeshare = el.codeshares ? el.codeshares.filter((obj) => obj.fsCode === 'IB') : [];
      const filteredEquipment = (el.flightEquipment) ? dEquipments.filter(
        (obj) => obj.iata === el.flightEquipment.actualEquipmentIataCode,
      ) : [];
      const aux = {
        status: el.status,
        flightDuration: el.flightDurations.blockMinutes
          ? el.flightDurations.blockMinutes : el.flightDurations.scheduledBlockMinutes,
        flightNumber: el.flightNumber,
        codeshareNumber: filterCodeshare.length > 0 ? filterCodeshare[0].flightNumber : undefined,
        carrierCode: el.carrierFsCode,
        codeshareCode: filterCodeshare.length > 0 ? filterCodeshare[0].fsCode : undefined,
        carrierName: filteredCarrier.length > 0 ? filteredCarrier[0].name : undefined,
        planeType: filteredEquipment.length > 0 ? filteredEquipment[0].name : undefined,
        departureTime,
        arrivalTime,
        departure: depInfo,
        arrival: arrInfo,
      };
      fStatuses.push(aux);
    });
    return fStatuses;
  };
  const retrieveFlightAvailability = async (serviceUrl) => {
    let iterate = true;
    let token;
    let data;
    const locale = (localeg === undefined || localeg === 'ca') ? 'es' : localeg;
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-Language': `${locale}-${marketg.toUpperCase()}`,
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
          throw new Error('FlightStatus: Error retrieveing flight availability');
        } else {
          iterate = true;
          SessionStorage.remove('anonymousTokenForService');
        }
      }
    }
    return data;
  };
  const getRouteFlightsSatuses = (origin, destination, date) => {
    const deferred = $.Deferred();
    const result = [];
    const airlineCode = $('#FSairlineByRoute').val();
    const properties = $('#FlightStatsProperties');
    const year = date.getFullYear();
    const day = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();
    const month = (date.getMonth() < 9) ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
    // Service doesn't provide translation in Catalan
    const setDatalayer = (data) => {
      const err = data.error;
      datalayer_general.quadrigam = 'RETFLR';
      datalayer_general.codigoSeguimiento = `${localeg}/${marketg}/RETFLR`;
      datalayer_general.salidasLlegadas = `${origin}-${destination}`;
      datalayer_general.fechaSalidaLlegada = `${day}/${month}/${date.getFullYear()}`;
      // update digital_data
      digital_data.Quadrigam = 'RETFLR';
      digital_data.TrackingCode = `${localeg}/${marketg}/RETFLR`;
      $('#inte-dataOriginDest').attr('data-currentQuadrigam', digital_data.Quadrigam);
      if (err) {
        datalayer_general.codigoError = `FS_RTS_${err.httpStatusCode}`;
        datalayer_general.subCodigoError = err.errorCode;
        datalayer_general.descripcionError = err.errorMessage;
      }
      updateDatalayer('view');
      updateDigitalData('view');
    };
    if (origin && destination && date && properties) {
      let urlService = $('#inte-dataState').data('flightstatus-byroute');
      urlService = urlService.replace('{departureAirport}', origin);
      urlService = urlService.replace('{arrivalAirport}', destination);
      urlService = urlService.replace('{depOrArr}', 'dep');
      urlService = urlService.replace('{year}', year);
      urlService = urlService.replace('{month}', month);
      urlService = urlService.replace('{day}', day);
      urlService = `${urlService}?company=${airlineCode}`;
      retrieveFlightAvailability(urlService)
        .then((data) => {
          if (data) {
            setDatalayer(data);
            if (data.error) {
              deferred.reject(result);
            } else {
              deferred.resolve(filterResult(data));
            }
          } else { deferred.reject(result); }
        })
        .catch((error) => {
          const err = { httpStatusCode: +error.status, errorCode: 'SERVER_UNAVAILABLE', errorMessage: 'Server is unavailable or caused a timeout' };
          setDatalayer({ error: err });
          deferred.reject(result);
        });
    } else {
      deferred.reject(result);
    }

    return deferred.promise();
  };
    /* Function get information about a concrete Flight given a flight number
      and carrier code
     */
  const getFlightStatus = (flightNumber, date) => {
    const deferred = $.Deferred();
    const airlines = $('#tabFSNum-info').data('airlines');
    const regexpStr = airlines.length > 0 ? `^(${airlines})([0-9]+)$` : '^([a-z]{2,3})([0-9]+)$';
    let fnumber = flightNumber.match(new RegExp(regexpStr, 'i'));
    let carrierCode = '';
    const result = [];
    const year = date.getFullYear();
    const day = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();
    const month = (date.getMonth() < 9) ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
    const setDatalayer = (data) => {
      const err = data.error;
      datalayer_general.quadrigam = 'RETVUR';
      datalayer_general.codigoSeguimiento = `${localeg}/${marketg}/RETVUR`;
      datalayer_general.fechaSalidaLlegada = `${day}/${month}/${date.getFullYear()}`;
      datalayer_general.salidasLlegadas = flightNumber.toUpperCase();
      // update digital_data
      digital_data.Quadrigam = 'RETVUR';
      digital_data.TrackingCode = `${localeg}/${marketg}/RETVUR`;
      $('#inte-dataNumVuelo').attr('data-currentQuadrigam', digital_data.Quadrigam);
      if (err !== undefined) {
        datalayer_general.codigoError = `FS_RTS_${err.httpStatusCode}`;
        datalayer_general.subCodigoError = err.errorCode;
        datalayer_general.descripcionError = err.errorMessage;
      }
      updateDatalayer('view');
      updateDigitalData('view');
    };
    if (fnumber != null) {
      carrierCode = fnumber[1] || '';
      fnumber = fnumber[2] || '';
    }

    if (carrierCode.length > 0 && fnumber.length > 0) {
      let urlService = $('#inte-dataState').data('flightstatus-bycode');
      urlService = urlService.replace('{carrier}', carrierCode);
      urlService = urlService.replace('{flight}', fnumber);
      urlService = urlService.replace('{year}', year);
      urlService = urlService.replace('{month}', month);
      urlService = urlService.replace('{day}', day);
      retrieveFlightAvailability(urlService)
        .then((data) => {
          if (data !== undefined) {
            setDatalayer(data);
            if (data.error) {
              deferred.reject(result);
            } else {
              deferred.resolve(filterResult(data));
            }
          } else { deferred.reject(result); }
        })
        .catch((error) => {
          const err = { httpStatusCode: +error.status, errorCode: 'SERVER_UNAVAILABLE', errorMessage: 'Server is unavailable or caused a timeout' };
          setDatalayer({ error: err });
          deferred.reject(result);
        });
    } else {
      deferred.reject(result);
    }
    return deferred.promise();
  };
    /**
     *Function that obtains the status of the flight from the AIRPORT of departure or arrival.
     */
  const getFlightStatusAirports = (airport, date, checkOriginDest) => {
    const deferred = $.Deferred();
    const result = [];
    let airportRD;
    const airlineCode = $('#FSairlineByAirport').val();
    const year = date.getFullYear();
    const day = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();
    const month = (date.getMonth() < 9) ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
    const setDatalayer = (data) => {
      const err = data.error;
      datalayer_general.quadrigam = 'RETAPR';
      datalayer_general.codigoSeguimiento = `${localeg}/${marketg}/RETAPR`;
      datalayer_general.fechaSalidaLlegada = `${day}/${month}/${date.getFullYear()}`;
      datalayer_general.salidasLlegadas = `${checkOriginDest}-${airport}`;
      // update digital_data
      digital_data.Quadrigam = 'RETAPR';
      digital_data.TrackingCode = `${localeg}/${marketg}/RETAPR`;
      $('#inte-dataAirport').attr('data-currentQuadrigam',digital_data.Quadrigam);
      if (err !== undefined) {
        datalayer_general.codigoError = `FS_RTS_${err.httpStatusCode}`;
        datalayer_general.subCodigoError = err.errorCode;
        datalayer_general.descripcionError = err.errorMessage;
      }
      updateDatalayer('view');
      updateDigitalData('view');
    };
    if ($('#FSsalida').is(':checked')) {
      airportRD = 'dep';
    } else {
      airportRD = 'arr';
    }
    if (airport && date) {
      let urlService = $('#inte-dataState').data('flightstatus-byairport');
      urlService = urlService.replace('{airport}', airport);
      urlService = urlService.replace('{depOrArr}', airportRD);
      urlService = urlService.replace('{year}', year);
      urlService = urlService.replace('{month}', month);
      urlService = urlService.replace('{day}', day);
      urlService = urlService.replace('{hourOfDay}', date.getHours());
      urlService = `${urlService}?company=${airlineCode}`;
      retrieveFlightAvailability(urlService)
        .then((data) => {
          if (data !== undefined) {
            setDatalayer(data);
            if (data.error) {
              deferred.reject(result);
            } else {
              deferred.resolve(filterResult(data));
            }
          } else {
            deferred.reject(result);
          }
        })
        .catch((error) => {
          const err = { httpStatusCode: +error.status, errorCode: 'SERVER_UNAVAILABLE', errorMessage: 'Server is unavailable or caused a timeout' };
          setDatalayer({ error: err });
          deferred.reject(result);
        });
    } else {
      deferred.reject(result);
    }

    return deferred.promise();
  };

  return {
    getRouteStatus: getRouteFlightsSatuses,
    getFlightStatus,
    getFlightStatusAirports,
  };
}
export default flightStatusServices;
