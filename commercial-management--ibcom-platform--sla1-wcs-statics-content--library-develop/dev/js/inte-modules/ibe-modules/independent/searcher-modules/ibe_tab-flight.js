import getCityListInformation from './ibe_get-city-list-info';
import { getQueryParam, getDateByFormat } from '../../general/ibe_inte-util';
import retrieveGlobalVariables from '../../general/ibe_variables';
import { isLogado } from '../../manage/ibe_logged-service';
import getCalendarTransformedFeedData from '../../manage/ibe_price_feed';
import * as SessionStorage from '../../manage/SessionStorage';
import { existLastSearches, updateLastSearches } from './ibe_last-searches-storage';
import {
  loadUmnrModal,
  initUmnrBirthdateValidation,
  canContinueUmnrFlow,
  openUmnrModal,
  closeUmnrDialog,
  getUmnrBirthdatesParam,
  sendUmnrInteraction,
  sendUmnrValidationEvent,
  initUmnrGa4Events,
} from '../../unmr/ibe_modal-unmr';

let { localeg, localemasterg, marketg, quadrigam, salesforceClientId, salesforceRedirectUri, salesforceURL } = retrieveGlobalVariables();
/**
 * @description Logic that affects the flights tab
 */
const $searchCont = $('#SearcherContent');
let passengersAjaxResponse;

/**
 * @description Muestra en la modal UMNR tantos bloques de fecha de nacimiento como niños
 * haya seleccionados en el buscador (los bebés no cuentan). Se ejecuta justo antes de abrir la modal.
 */
function syncUmnrMinorsCount() {
  const $dialog = $('.fc-dialog-unmr');
  const $items = $dialog.find('.ibe-modal-unmr__date-item');
  const $childrenCounter = $('#infants1').length ? $('#infants1') : $('[data-people-type="children"]').first();
  let count = parseInt($childrenCounter.text(), 10);
  if (Number.isNaN(count) || count < 1) {
    count = 1;
  }
  if (count > 8) {
    count = 8;
  }
  $items.each(function toggleMinorItem() {
    const index = parseInt($(this).attr('data-minor-index'), 10);
    $(this).toggleClass('hidden', index > count);
    $(this).toggleClass('ibe-modal-unmr__date-item--full', index === 1 && count === 1);
  });
}

/**
 * @description Lanza la búsqueda desde el flujo UMNR (ya validado) y cierra su modal.
 * GA4 (ATQ-34925) - evento "aterrizaje": ok si el flujo de búsqueda arranca sin errores
 * internos; ko ante cualquier error ajeno a la validación de campos.
 * La búsqueda se lanza ANTES de cerrar la modal: al cerrarse se resetean las fechas
 * (resetUmnrModal), así que runSearchFlow tiene que leerlas (getUmnrBirthdatesParam)
 * mientras la modal aún conserva sus valores. El cierre va en finally para que la
 * modal se cierre igual que antes ante cualquier error.
 */
function launchUmnrSearch() {
  const isRedemption = $('#tabContainer').find('.isRedemption').length > 0;
  const i = isRedemption ? 6 : 1;
  try {
    // eslint-disable-next-line no-use-before-define
    runSearchFlow(i, isRedemption, true);
    sendUmnrInteraction('aterrizaje', 'modal edad menores:ok');
  } catch (err) {
    sendUmnrInteraction('aterrizaje', 'modal edad menores:ko');
    throw err;
  } finally {
    closeUmnrDialog('.fc-dialog-unmr');
  }
}

/**
 * @description Construye y lanza la búsqueda de vuelos (flujo normal de submitV).
 * @param {number} i Índice del formulario del buscador (1, o 6 en redemption).
 * @param {boolean} isRedemption
 * @param {boolean} skipUmnrCheck Se pasa true cuando se llama desde el propio "Continuar" de
 * la modal UMNR: ya se ha pasado por ese flujo (fechas + términos validados), así que no hay
 * que volver a comprobar la condición de adultos=0/niños>0 y reabrir la modal en bucle.
 */
function runSearchFlow(i, isRedemption, skipUmnrCheck) {
      // const modalTitle = $('#tabContainer').attr('data-error');
      let dateinit = false;
      let dateend = false;
      let init = false;
      let end = false;
      let TRIP_TYPE;
      if (typeof $(`#flight_round_date${i}`) !== 'undefined') {
        dateinit = $(`#flight_round_date${i}`).val();
      }
      if (typeof $(`#flight_return_date${i}`) !== 'undefined') {
        dateend = $(`#flight_return_date${i}`).val();
      }
      if (typeof $(`#flight_origin${i}`) !== 'undefined') {
        init = $(`#flight_origin${i}`).val();
      }
      if (typeof $(`#flight_destiny${i}`) !== 'undefined') {
        end = $(`#flight_destiny${i}`).val();
      }
      if ($('option#oneway').length > 0) { // home
        if (!$('#oneway').is('option:selected')) { TRIP_TYPE = '2'; } else { TRIP_TYPE = '1'; }
      } else if (!$('#oneway').is(':checked')) {
        TRIP_TYPE = '2';
      } else {
        TRIP_TYPE = '1';
      }// vuelos,vuelo+hotel,vuelo+coche

      if (dFrontJs.ibe_validations_searcher.validateSearcher() && dateinit !== false && (dateend !== false || (TRIP_TYPE === '1')) && init !== false && end !== false) {
        // UMNR: menores viajando solos (los bebés no cuentan) -> modal en vez de búsqueda normal.
        // Solo se comprueba aquí, una vez el resto del buscador (origen/destino/fechas) es válido.
        // Se salta si venimos del "Continuar" de la propia modal (skipUmnrCheck), para no
        // reabrirla en bucle: esa condición (adultos=0 + niños) sigue siendo cierta a propósito.
        // Y solo si la property de WCS modal.unmrs.wcs.enabled lo tiene activado.
        if (!skipUmnrCheck && typeof unmrModalEnabled !== 'undefined' && unmrModalEnabled === "true") {
          const adultsCount = parseInt($(`#adult${i}`).html(), 10) || 0;
          const childrenCount = parseInt($(`#infants${i}`).html(), 10) || 0;
          if (adultsCount === 0 && childrenCount > 0) {
            syncUmnrMinorsCount();
            openUmnrModal();
            return;
          }
        }

        const appliesOMB = false;
        const splitEndCity = false;
        const initializedOMB = true;
        let flexible = 'true';
        if ($(`#flexible1${i}`).is(':checked')) {
          flexible = 'true';
        }

        const lenBegCit = $(`#flight_origin${i}`)[0].value.split('(')[0].length;
        const begCit = $(`#flight_origin${i}`)[0].value.split('(')[0].substring(0,lenBegCit-1)

        const lenEndCit = $(`#flight_destiny${i}`)[0].value.split('(')[0].length;
        const endCit = $(`#flight_destiny${i}`)[0].value.split('(')[0].substring(0,lenEndCit-1)

        const BEGIN_CITY_01 = $(`#flight_origin${i}`)[0].value.split('(')[1].substring(0, 3);
        const END_CITY_01 = $(`#flight_destiny${i}`)[0].value.split('(')[1].substring(0, 3);

        const Begindate = $(`#flight_round_date${i}`).val();
        // Genera error en el init.js que no esté con new date
        // Si se quita no hace efecto el formato de fecha. Necesitan estar los dos casos.
        const $searccalen = Begindate.split("/");
        let BEGIN_DAY_01 = $searccalen[0];
        let BEGIN_MONTH_01 = $searccalen[1];
        let BEGIN_YEAR_01 = $searccalen[2];
        if($(`#flight_round_date${i}`).attr("data-format") == "MM/DD/YYYY" ){
          BEGIN_DAY_01 = $searccalen[1];
          BEGIN_MONTH_01 = $searccalen[0];
          BEGIN_YEAR_01 = $searccalen[2];
        }

        if (BEGIN_DAY_01.length === 1) {
          BEGIN_DAY_01 = `0${BEGIN_DAY_01}`;
        }
        if (BEGIN_MONTH_01.length === 1) {
          BEGIN_MONTH_01 = `0${BEGIN_MONTH_01}`;
        }
        let END_DAY_01 = '';
        let END_MONTH_01 = '';
        let END_YEAR_01 = '';
        let Enddate = '';
        if (TRIP_TYPE === '2') {
          Enddate = $(`#flight_return_date${i}`).val();
          const $searccalenReturn = Enddate.split("/");
          END_DAY_01 = $searccalenReturn[0];
          END_MONTH_01 = $searccalenReturn[1];
          END_YEAR_01 = $searccalenReturn[2];
          if($(`#flight_return_date${i}`).attr("data-format") == "MM/DD/YYYY" ){
            END_DAY_01 = $searccalenReturn[1];
            END_MONTH_01 = $searccalenReturn[0];
            END_YEAR_01 = $searccalenReturn[2];
          }

          if (END_DAY_01.length === 1) {
            END_DAY_01 = `0${END_DAY_01}`;
          }
          if (END_MONTH_01.length === 1) {
            END_MONTH_01 = `0${END_MONTH_01}`;
          }
        }

        const FARE_TYPE = $(`#tarifa${i} option:selected`).val();
        const YCD = $(`#senior${i}`).length ? $(`#senior${i}`).html() : '';
        const ADT = $(`#adult${i}`).html();
        const YTH = $(`#young${i}`).length ? $(`#young${i}`).html() : '';
        const BNN = $(`#teenager${i}`).length ? $(`#teenager${i}`).html() : '';
        const CHD = $(`#infants${i}`).html();
        const INF = $(`#babys${i}`).html();

        let residentDiscount = '';
        let familyDiscount = '';
        let pagoAvios = 'false';
        let pagoPuntos = 'false';
        const checkPagoAvios = $('#paywithAvios:visible').is(':checked');
        const checkPagoPuntos = $('#paywithPoints:visible').is(':checked');
        let parameters;
        let host;

        if (checkPagoAvios) {
          pagoAvios = 'true';
        }
        pagoPuntos = checkPagoPuntos ? 'true' : 'false';

        let mercado = marketg; let lenguaje = localeg;
        const datos = SessionStorage.get('ib-wcs.newRedemptionMarketsRedirections');
        if (checkPagoAvios && datos
            && datos[marketg] !== undefined
            && datos[marketg].marketRedirect !== undefined
            && typeof (datos[marketg].marketRedirect) === 'string'
            && datos[marketg].marketRedirect.length > 0) {
          mercado = datos[marketg].marketRedirect;
          if (datos[marketg].localesRedirect !== undefined
              && typeof (datos[marketg].localesRedirect[localeg]) === 'string'
              && datos[marketg].localesRedirect[localeg].length > 0) {
            lenguaje = datos[marketg].localesRedirect[localeg];
          }
        }

        //PETS
        let pets = $("#flyWithPets").is(":checked");
        let pets_disabled = $("#flyWithPets").is(":disabled");
        let pago_avios = $('#paywithAvios').is(':checked');
        if(pets && !pets_disabled && !pago_avios){
          pets = "&isPetFlight=true";
        } else {
          pets = "";
        }

        let aux_lenguaje = (localemasterg!="" && checkPagoAvios && !isLogado().userLogged)?localemasterg:lenguaje;
        const IB_GROUP = $searchCont.attr('data-ibgroup');
        const codeTracking = $('#loggedUserDefaultsCugs').attr('data-inte-cugs-codeTracking');
        host = $searchCont.attr('data-inte-integrationHost') + $searchCont.attr('data-url-booking');
        parameters = `?market=${mercado
        }&language=${aux_lenguaje
        }&appliesOMB=${appliesOMB
        }&splitEndCity=${splitEndCity
        }&initializedOMB=${initializedOMB
        }&flexible=${flexible
        }&TRIP_TYPE=${TRIP_TYPE
        }&BEGIN_CITY_01=${BEGIN_CITY_01
        }&END_CITY_01=${END_CITY_01
        }&nombreOrigen=${begCit
        }&nombreDestino=${endCit
        }&BEGIN_DAY_01=${BEGIN_DAY_01
        }&BEGIN_MONTH_01=${BEGIN_YEAR_01}${BEGIN_MONTH_01
        }&BEGIN_YEAR_01=${BEGIN_YEAR_01
        }&END_DAY_01=${END_DAY_01
        }&END_MONTH_01=${END_YEAR_01}${END_MONTH_01
        }&END_YEAR_01=${END_YEAR_01
        }&FARE_TYPE=${FARE_TYPE
        }&quadrigam=${quadrigam
        }`;

        let selectedDate = {departureDate: Begindate, returnDate: Enddate};
        let currencyCode = $("#tabContainer").find("price-calendar").attr("currencycode"); 
        let selectedPrice = $("#tabContainer").find("price-calendar").attr("selectedprice"); 
        let tripType = $("#tabContainer").find("price-calendar").attr("date-oneway"); 
        changeDigitalData(BEGIN_CITY_01, END_CITY_01, tripType, selectedDate, selectedPrice, currencyCode, "buscar");

        //PETS
        parameters += pets;

        //UMNR: menor(es) viajando solo(s), se pasan las fechas de nacimiento a MMB
        if (skipUmnrCheck) {
          const umnrBirthdates = getUmnrBirthdatesParam();
          if (umnrBirthdates) {
            parameters += `&isUMFlight=true&birthDates=${umnrBirthdates}`;
          }
        }

        if (marketg !== mercado) {
          parameters += `&fromMarket=${marketg}`;
        }
        if (localeg !== lenguaje) {
          aux_lenguaje = (localemasterg!="" && checkPagoAvios && !isLogado().userLogged)?localemasterg:localeg;
          parameters += `&fromLanguage=${aux_lenguaje}`;
        }
        if (checkPagoAvios || checkPagoPuntos) {
          const adultspay = +ADT + +BNN + +YTH + +YCD;
          if (checkPagoPuntos) {
            const childrenpay = +CHD + +INF;
            parameters += `&ADT=${+adultspay}&CHD=${+childrenpay}&INF=0`;
          } else {
            parameters += `&ADT=${adultspay}&CHD=${CHD}&INF=${INF}`;
          }
        } else {
          parameters += `&ADT=${ADT}&CHD=${CHD}&INF=${INF}`;
          if (BNN) parameters += `&BNN=${BNN}`;
          if (YTH) parameters += `&YTH=${YTH}`;
          if (YCD) parameters += `&YCD=${YCD}`;
        }

        if (!$('[data-position="9"]').hasClass('hidden') && !$('#familia_numerosa_2').parent().parent().hasClass('hidden')) {
          if ($('#familia_numerosa_2').length > 0) {
            if ($('#familia_numerosa_2').val() !== 'nolarge') familyDiscount = $('#familia_numerosa_2').val();
          } else if ($('#largespecial').is(':checked')) {
            familyDiscount = $('#largespecial').val();
          } else if ($('#largegeneral').is(':checked')) {
            familyDiscount = $('#largegeneral').val();
          }
        }
        if (!$('[data-passenger-resident-radio="data-passenger-resident-radio"]').hasClass('hidden') && !$('#residencia').parent().parent().hasClass('hidden')) {
          if ($('#residencia').length > 0) {
            if ($('#residencia').val() !== 'noresident' && $('#residencia').val().length > 0) {
              residentDiscount = $('#residencia').val();
              if ((BEGIN_CITY_01 === 'LPA' || BEGIN_CITY_01 === 'SPC' || BEGIN_CITY_01 === 'TCI' || BEGIN_CITY_01 === 'FUE' || BEGIN_CITY_01 === 'ACE') && (END_CITY_01 === 'LPA' || END_CITY_01 === 'SPC' || END_CITY_01 === 'TCI' || END_CITY_01 === 'FUE' || END_CITY_01 === 'ACE')) {
                residentDiscount = 'DC';
              } else if ((BEGIN_CITY_01 === 'PMI' || BEGIN_CITY_01 === 'MAH' || BEGIN_CITY_01 === 'IBZ') && (END_CITY_01 === 'PMI' || END_CITY_01 === 'MAH' || END_CITY_01 === 'IBZ')) {
                residentDiscount = 'BI';
              }
            }
          } else if ($('#canarias').is(':checked')) {
            if ((BEGIN_CITY_01 === 'LPA' || BEGIN_CITY_01 === 'SPC' || BEGIN_CITY_01 === 'TCI' || BEGIN_CITY_01 === 'FUE' || BEGIN_CITY_01 === 'ACE') && (END_CITY_01 === 'LPA' || END_CITY_01 === 'SPC' || END_CITY_01 === 'TCI' || END_CITY_01 === 'FUE' || END_CITY_01 === 'ACE')) {
              residentDiscount = 'DC';
            } else {
              residentDiscount = $('#canarias').val();
            }
          } else if ($('#baleares').is(':checked')) {
            if ((BEGIN_CITY_01 === 'PMI' || BEGIN_CITY_01 === 'MAH' || BEGIN_CITY_01 === 'IBZ') && (END_CITY_01 === 'PMI' || END_CITY_01 === 'MAH' || END_CITY_01 === 'IBZ')) {
              residentDiscount = 'BI';
            } else {
              residentDiscount = $('#baleares').val();
            }
          } else if ($('#melilla').is(':checked')) {
            residentDiscount = $('#melilla').val();
          } else if ($('#ceuta').is(':checked')) {
            residentDiscount = $('#ceuta').val();
          }
        }
        parameters += `&residentCode=${residentDiscount}&familianumerosa=${familyDiscount}`;
        if (!$('#paywithAvios').is(':checked') && !$('#paywithPoints').is(':checked') && !isRedemption) {
          // Add parameter no Cookie to solve Currency problems
          parameters += '&BV_UseBVCookie=no';

          const travelAgent = getQueryParam('travelAgent');
          if (travelAgent !== false) {
            parameters += `&travelAgent=${travelAgent}`;
          }
        }
        if (IB_GROUP) {
          parameters += `&IB_GROUP=${IB_GROUP}`;
        }
        if (codeTracking) {
          parameters += `&codeTracking=${codeTracking}&backtourl=${encodeURIComponent(document.location.pathname + document.location.search)}`;
        }

        if (checkPagoAvios || checkPagoPuntos || ($('.inte-avios').length === 0)) {
          if (localeg === 'es' || localeg === 'pt') parameters += '&boton=Buscar';
          if (localeg === 'en') parameters += '&boton=Search';
          if (localeg === 'ca') parameters += '&boton=Cercar';
          if (localeg === 'de') parameters += '&boton=Suchen';
          if (localeg === 'fr') parameters += '&boton=Rechercher';
          if (localeg === 'it') parameters += '&boton=Ricerca';
          if (localeg === 'ja') parameters += '&boton=%E6%A4%9C%E7%B4%A2';
          if (localeg === 'nl') parameters += '&boton=Zoeken';
          if (localeg === 'ru') parameters += '&boton=%D0%9F%D0%BE%D0%B8%D1%81%D0%BA';
          if (localeg === 'zh') parameters += '&boton=%E6%90%9C%E7%B4%A2';
          parameters += `&bookingMarket=${marketg}`;
        }

        // searchExtension_Booking 
        //1. Control de primera búsqueda en la sesión actual
        const BOOKING_SESSION_FLAG = 'bookingSearchExtensionExecuted';
        const isDesktop = isDesktopWeb();
        const hasExecutedBookingThisSession = sessionStorage.getItem(BOOKING_SESSION_FLAG) === 'true';

         // 1. Datos de sesión y login
         const isLogged = isLogado();
         // Regla 1 & 6: Exclusión por nivel Oro/Platino/superior o On Business
         const isExcludedTier = isExcludedIBPlusTier(isLogged);
         const isOB = isOnBusinessUser(isLogged);

         // 3. Reglas 2 y 7
         const numSenior = parseInt(YCD, 10) || 0; 
         const numAdult  = parseInt(ADT, 10) || 0; 
         const numYoung  = parseInt(YTH, 10) || 0; 
         const numTeen   = parseInt(BNN, 10) || 0; 
         const numChild  = parseInt(CHD, 10) || 0; 
         const numBaby   = parseInt(INF, 10) || 0; 
 
         // Agrupación: Adultos (Adultos + Seniors + Jóvenes) y Menores (Adolescentes + Niños + Bebés)
         const bookingAdults   = numAdult + numSenior + numYoung;
         const bookingChildren = numTeen + numChild + numBaby;
 
         // Regla 7: Exclusión de Menores No Acompañados (UMNR)
         const hasAdultCompanion = bookingAdults > 0;
         const hasMinorPassengers = (numTeen + numChild) > 0;
         const isUMNRBooking = (!hasAdultCompanion && hasMinorPassengers) ||
                               (typeof unmrModalEnabled !== 'undefined' && unmrModalEnabled && !hasAdultCompanion && hasMinorPassengers);

        // Fechas de viaje
        const checkin = BEGIN_YEAR_01.toString() + "-" + BEGIN_MONTH_01.toString() + "-" + BEGIN_DAY_01.toString();
        let checkout = '';
        if (TRIP_TYPE === '2') {
          checkout = END_YEAR_01.toString() + "-" + END_MONTH_01.toString() + "-" + END_DAY_01.toString();
        }

        // Regla 4: Solo Ida excluido (debe ser TRIP_TYPE === '2' / Ida y Vuelta)
        const isRoundTrip = TRIP_TYPE === '2';

        // Regla 5: Exclusión si el regreso coincide con el día de salida
        const isSameDayReturn = isRoundTrip && (checkin === checkout);

        // Validación global para disparar la extensión
        let searchExtension_Booking = 
          isDesktop &&
          !hasExecutedBookingThisSession &&
          isRoundTrip &&          // Regla 4: Obligatorio Ida y Vuelta
          !isSameDayReturn &&     // Regla 5: No volver el mismo día
          !isExcludedTier &&      // Regla 1: No Platino o superiores
          !isOB &&                // Regla 6: No On Business
          !isUMNRBooking;         // Regla 7: No UMNR

        // Si cumple todas las condiciones, marcamos la sesión
        if (searchExtension_Booking) {
          sessionStorage.setItem(BOOKING_SESSION_FLAG, 'true');
        }
        if (checkPagoAvios) {
          const isLogged = isLogado();
          if (isLogged.userLogged && isLogged.userType === 'IBPLUS') {
            if(searchExtension_Booking){
              window.open( `${host + parameters}&pagoAvios=true`,'_blank');
            }else{
              window.location.href = `${host + parameters}&pagoAvios=true`;
            }
          } else {
            // [Check Avios] + not logged -> log in + New Redemption flow
            const endURL = `${host + parameters}&pagoAvios=true`;
            if(searchExtension_Booking){
              window.open(`/integration/ibplus/login/?referralURL=${encodeURIComponent(endURL)}&noState=true&locale=${localeg}`,'_blank');
            }else{
              window.location.href = `/integration/ibplus/login/?referralURL=${encodeURIComponent(endURL)}&noState=true&locale=${localeg}`;
            }
          }
        } else if (checkPagoPuntos) {
          if(searchExtension_Booking){
            window.open( `${host + parameters}&pagoPuntos=true`,'_blank');
          }else{
            window.location.href = `${host + parameters}&pagoPuntos=true`;
          }
        } else if (isRedemption) {
          if ($('.inte-avios').length === 1) {
            // [Redemption Seeker] New Redemption flow
            pagoAvios = 'true';
            if(searchExtension_Booking){
              window.open( `${host + parameters}&pagoAvios=true`,'_blank');
            }else{
              window.location.href = `${host + parameters}&pagoAvios=true`;
            }
          } else {
            pagoPuntos = 'true';
            parameters = parameters.replace('FARE_TYPE=undefined', 'FARE_TYPE=R');
            if(searchExtension_Booking){
              window.open( `${host + parameters}&pagoPuntos=true`,'_blank');
            }else{
              window.location.href = `${host + parameters}&pagoPuntos=true`;
            }
          }
        } else {
          if(searchExtension_Booking){
            window.open(host + parameters,'_blank');
          }else{
            window.location.href = host + parameters;
          }
        }
       //Llamada a booking 
       if (searchExtension_Booking) {
        // Regla 2: Envío de pasajeros contemplando adultos, niños y bebés
        searchExtensionBooking(
          END_CITY_01,
          bookingAdults,
          bookingChildren,
          checkin,
          checkout,
          numBaby,           // Regla 2: conteo de bebés
          localeg,   
          marketg,  
        );
      }
        const lastSearch = {
          nombreOrigen: begCit,
          nombreDestino: endCit,
          iataOrigen: BEGIN_CITY_01,
          iataDestino: END_CITY_01,
          fechaIda: { day: BEGIN_DAY_01.toString(), month: BEGIN_MONTH_01.toString(), year: BEGIN_YEAR_01.toString() },
          fechaVuelta: { day: END_DAY_01.toString(), month: END_MONTH_01.toString(), year: END_YEAR_01.toString() },
          fechasFlexibles: flexible.length > 0 ? JSON.parse(flexible) : null,
          adultos: parseInt(ADT, 10),
          niños: parseInt(CHD, 10),
          bebes: parseInt(INF, 10),
          senior: parseInt(YCD, 10),
          joven: ((+YTH) + (+BNN)),
          youngType: BNN !== '0' ? 'BNN' : 'YTH',
          tarifa: FARE_TYPE,
          residentes: residentDiscount,
          familia: familyDiscount,
          pagoAvios: pagoAvios.length > 0 ? JSON.parse(pagoAvios) : null,
          pagoPuntos: pagoPuntos.length > 0 ? JSON.parse(pagoPuntos) : null,
        };
        updateLastSearches(lastSearch);
        const CookieSeekerVal = `${BEGIN_CITY_01}|${END_CITY_01}|${BEGIN_DAY_01}|${BEGIN_MONTH_01}|${BEGIN_YEAR_01}|${END_DAY_01}|${END_MONTH_01}|${END_YEAR_01}|${flexible}|${ADT}|${CHD}||${INF}|${YCD}|${+YTH + +BNN}|${FARE_TYPE}|${residentDiscount}|${familyDiscount}|||||${pagoAvios}|`;
        Cookies.set('IBERIACOM_LAST_SEARCH', CookieSeekerVal, { path: '/', expires: 365, sameSite: 'strict' });
      }
}

/**
 * @description Submit flights tab. Si hay menores viajando solos (sin adultos; los bebés
 * no cuentan) abre la modal UMNR en vez de lanzar la búsqueda. Al pulsar "Continuar" en esa
 * modal se cierra y se lanza el flujo normal de búsqueda.
 */
function submitV() {
  $('#buttonSubmit1').on('submit click', (e) => {
    e.preventDefault();
    requestAnimationFrame(() => {
      // Redemption Seeker
      const isRedemption = $('#tabContainer').find('.isRedemption').length > 0;
      const i = isRedemption ? 6 : 1;

      runSearchFlow(i, isRedemption);
    });
  });
}

//Change digital datalayer when calendar selected date changed, "buscar" on desktop and "hecho" on mobile
function changeDigitalData(origin_iata, destination_iata, oneway_elem, selectedDate, selectedPrice, currencyCode, eventType){
  let tripMode = $(oneway_elem+" option:selected").attr("id");
  selectedPrice = (selectedPrice != undefined && selectedPrice != null)?selectedPrice:"NA";
  currencyCode = (selectedPrice == "NA")?"":currencyCode;
  
  // Redemption Seeker
  const isRedemption = $('#tabContainer').find('.isRedemption').length > 0;
  const i = isRedemption ? 6 : 1;
  
  if(selectedDate.departureDate && $(`#flight_round_date${i}`).attr("data-format") == "MM/DD/YYYY"){
    selectedDate.departureDate = selectedDate.departureDate.split("/");
    selectedDate.departureDate = selectedDate.departureDate[1] +"/"+ selectedDate.departureDate[0] +"/"+ selectedDate.departureDate[2];
  } 
  
  if(selectedDate.returnDate && $(`#flight_round_date${i}`).attr("data-format") == "MM/DD/YYYY"){
    selectedDate.returnDate = selectedDate.returnDate.split("/");
    selectedDate.returnDate = selectedDate.returnDate[1] +"/"+ selectedDate.returnDate[0] +"/"+ selectedDate.returnDate[2];
  } 

  //Check if a oneway/return flight, get the departure and/or return date and prices if not empty
  let eventLabel = (tripMode == "oneway" && selectedDate.departureDate && origin_iata && destination_iata)?origin_iata+"-"+destination_iata+":"+ selectedDate.departureDate +":"+ selectedPrice + currencyCode:"";
  eventLabel = (tripMode == "return" && selectedDate.departureDate && selectedDate.returnDate && origin_iata && destination_iata)?origin_iata+"-"+destination_iata+":"+ selectedDate.departureDate +";"+ selectedDate.returnDate +":"+ selectedPrice + currencyCode:eventLabel;
  
  if(eventLabel != ""){
    let digitalData = {
      'eventName': 'interaccion',
      'eventCategory': 'calendario',
      'eventAction': eventType,
      'eventLabel': eventLabel
    };
    if (window.dataLayer && typeof (window.dataLayer.push) === 'function') {
      window.dataLayer.push(digitalData, {'event': 'interaction'});
    }
  }
}

function hideShowPets(elem){
  if($(elem).is(":checked")){
    $(".ibe-people-counter__pets").parent().addClass("hidden");
  } else {
    $(".ibe-people-counter__pets").parent().removeClass("hidden");
  }
}

/**
 * Determina si el entorno es estrictamente Desktop Web.
 */
function isDesktopWeb() {
  const ua = navigator.userAgent.toLowerCase();

  // Exclusión por User Agent (Mobile y Tablets comunes)
  const isMobileOrTabletUA = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini|tablet|silk|kindle/i.test(ua);

  // Detección específica para iPad en iPadOS (reporta "Macintosh" pero tiene puntos táctiles)
  const isIPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

  // Breakpoint mínimo habitual para desktop (por encima de 1024px)
  const isDesktopWidth = window.innerWidth >= 1024;

  return !isMobileOrTabletUA && !isIPadOS && isDesktopWidth;
}

/**
 * Valida si el usuario logado tiene un nivel Iberia Plus excluido 
 */
function isExcludedIBPlusTier(isLogged) {
  // Si no está logado, no lo excluimos por nivel (se le puede mostrar Booking)
  if (!isLogged || !isLogged.userLogged) {
    return false;
  }
  
  try {
    const customerDataStr = sessionStorage.getItem('customerData');
    if (customerDataStr) {
      const customerData = JSON.parse(customerDataStr);
      const category = (customerData.category || '').toUpperCase();
      
      // Lista de niveles que NO deben ver la extensión
      // (Asumo que "PLATA" sí puede verlo, si no, añádelo a esta lista)
      const excludedTiers = ['PLATINO', 'PLATINOPRIME', 'INFINITA', 'INFINITAPRIME', 'IBERIASINGULAR'];
      
      // Si la categoría del usuario está en la lista de excluidos, devuelve true
      return excludedTiers.includes(category);
    }
  } catch (error) {
    console.error('[SearchExtension] Error leyendo customerData del sessionStorage', error);
  }

  // Por defecto, si hay algún error leyendo, no lo bloqueamos
  return false;
}

/**
 * Valida es usuario On Business
 */
function isOnBusinessUser(isLogged) {
  if (!isLogged) return false;
  const userType = (isLogged.userType || '').toUpperCase();
  const isOBUser = userType === 'ONBUSINESS' || userType === 'OB';
  const hasOBCorporateCode = typeof isCorporateOB !== 'undefined' ? isCorporateOB : false;
  
  return isOBUser || hasOBCorporateCode;
}

/**
 * Mapeo de idioma de Iberia al formato esperado por Booking.com
 */
function mapIberiaLangToBooking(lang, market) {
  const l = (lang || 'es').toLowerCase();
  const m = (market || 'ES').toUpperCase();

  if (l === 'pt') return m === 'BR' ? 'pt-br' : 'pt-pt';
  if (l === 'en') return m === 'US' ? 'en-us' : 'en-gb';
  
  if (l === 'es') {
    if (m === 'MX') return 'es-mx';
    // Mantenemos es-ar para Argentina y países vecinos de Sudamérica
    if (['AR', 'CL', 'CO', 'PE', 'EC', 'UY'].includes(m)) return 'es-ar';
  }

  return l; 
}

/**
 * Mapeo de mercado a la divisa por defecto en Booking.com
 */
function mapMarketToCurrency(market) {
  const m = (market || 'ES').toUpperCase();

  const currencyMap = {
    'ES': 'EUR', 'PT': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'DE': 'EUR',
    'GB': 'GBP',
    'US': 'USD', 
    'EC': 'USD',
    'AR': 'ARS', 
    'MX': 'MXN', 
    'CO': 'COP', 
    'CL': 'CLP', 
    'BR': 'BRL'  
  };

  // Si el mercado está en el mapa, devolvemos su moneda.
  if (currencyMap[m]) {
    return currencyMap[m];
  }

  // Si es un mercado de LATAM/América cuya moneda NO soporta Booking
  // forzamos el fallback a USD
  const latamFallbackMarkets = ['PE', 'UY', 'BO', 'PY', 'VE', 'CR', 'PA', 'GT', 'HN', 'NI', 'SV', 'DO', 'CU', 'PR'];
  if (latamFallbackMarkets.includes(m)) {
    return 'USD';
  }
  return 'EUR';
}

function searchExtensionBooking(iataDest,numAdult,numchild,checkin,checkout,numInfants = 0, lang = 'es', market = 'ES'){
  const bookingLang = mapIberiaLangToBooking(lang, market);
  const bookingCurrency = mapMarketToCurrency(market);
  const fesp_params = {
    aid : 2433305,
    hostname : "www.booking.com",
    label : "pagehome-see-2433305-click",
    iata : iataDest,
    //dest_type : "{my_destination_type_selector}",
    //dest_id : {my_destination_id_selector},
    //ss : "{my_ss_selector}"
    checkin : checkin,
    checkout : checkout,
    consent : "#consent",
    group_adults : numAdult,
    group_children : numchild,
    lang: bookingLang,
    selected_currency: bookingCurrency,
    user_country: market.toLowerCase()
  }
  function fesp_create_url(params) {
    const baseUrl = `https://www.booking.com/searchresults.${params.lang}.html`;
    const url =  new URL(baseUrl);
    //se agregan los parametros
    url.searchParams.set("aid", params.aid);
    url.searchParams.set("label", params.label);
    url.searchParams.set("iata", params.iata);
    url.searchParams.set("iata_orr", "1");
    url.searchParams.set("checkin", params.checkin);
    url.searchParams.set("checkout", params.checkout);
    url.searchParams.set("group_adults", params.group_adults);
    url.searchParams.set("group_children", params.group_children);

    // Identificación de bebés (< 2 años)
    for (let i = 0; i < numInfants; i++) {
      url.searchParams.append("age", "0");
    }

    url.searchParams.set("lang", params.lang);
    url.searchParams.set("selected_currency", params.selected_currency);
    // 3. Forzamos la actualización de sesión en Booking 
    url.searchParams.set("lang_changed", "1");

    return url.toString();
  }
  window.location.href = fesp_create_url(fesp_params);
}

/**
     * @description Show resident and large family
     * @param {Array} disc Values returned from the service (area and cities)
     */
function cntrlResFam(disc, origin3tabsJSON, destinationVJSON) {
  function getResidentObject() {
    const element = {};
    $('[data-resident]').each(function eah() {
      element[$(this).attr('data-resident')] = $(this);
    });
    return element;
  }
  /**
         * @description Show resident
         * @param {Array} data Values returned from the service (area and cities)
         */
  function putresident(data) {
    setTimeout(() => {
      const residents = getResidentObject();
      const $orig = $('#flight_origin1');
      const $dest = $('#flight_destiny1');
      const $residencia = $('#residencia');
      const $noResident = $('#noresident');
      const $noLargeFam = $('#nolarge');
      let dataService = data;
      let countryinit = '';
      let countryend = '';
      let destIATA; let origIATA;

      if ($dest.val() && $orig.val() !== undefined && $dest.val() !== '' && $orig.val() !== '') {
        destIATA = $dest[0].value.split('(')[1] || '';
        origIATA = $orig[0].value.split('(')[1] || '';

        destIATA = destIATA.substring(0, 3);
        origIATA = origIATA.substring(0, 3);
        const objorigin = origIATA.length > 0 ? getCityListInformation(origin3tabsJSON,
          origIATA.toString()) : undefined;
        const objdestination = destIATA.length > 0 ? getCityListInformation(destinationVJSON,
          destIATA.toString()) : undefined;
        countryinit = objorigin ? objorigin.country.code : null;
        countryend = objdestination ? objdestination.country.code : null;
      }
      if (dataService !== undefined && countryinit === 'ES' && countryend === 'ES') {
        $('[data-position="9"]').removeClass('hidden');// Large Family searcher home
        $('[data-position-mobile="9"]').removeClass('hidden');
        $('#familia_numerosa_2').parent().parent().removeClass('hidden'); // Large Family advance searcher
        if ($residencia.attr('data-cookiefill') === 'true') {
          $residencia.attr('data-cookiefill', 'false');
        } else {
          $residencia.val('noresident');
        }
        $residencia.selectmenu('refresh');
        // Hide all
        $('[data-passenger-resident-radio="data-passenger-resident-radio"]').addClass('hidden');
        $('[data-resident-warn]').addClass('hidden');
        $('[data-passenger-resident-radio="data-passenger-resident-radio"]').prev('h4').addClass('hidden');
        $('#residencia').parent().parent().addClass('hidden');
        $('[data-passenger-resident="data-passenger-resident"]').addClass('option-span');
        $('#spanslash').addClass('hidden');
        dataService = data.residentData;
        const residentKeys = Object.keys(residents);
        for (let i = 0; i < residentKeys.length; i += 1) {
          const key = residentKeys[i];
          if (key !== 'default') {
            if (residents[key].is('option')) {
              // ADVSeeker
              $(`#residencia-menu li:eq(${i + 1})`).addClass('hidden');
              $(`#residencia-menu li:eq(${i + 1})`).addClass('ui-state-disabled');
            } else {
              residents[key].addClass('hidden');
            }
          }
        }
        // Show elements
        let matchCounter = 0;
        let resetCheckbox = true;
        dataService.forEach((el) => {
          const match = (el.cities.indexOf(origIATA) >= 0 || el.cities.indexOf(destIATA) >= 0);
          const $resident = residents[el.area];
          if (match && $resident !== undefined) {
            matchCounter += 1;
            if ($resident.is('option')) {
              // ADVSeeker
              const index = residentKeys.indexOf(el.area);
              $(`#residencia-menu li:eq(${index + 1})`).removeClass('hidden ui-state-disabled');
            } else {
              // Seeker
              $resident.removeClass('hidden');
              if ($resident.find('input').is(':checked') && resetCheckbox) {
                resetCheckbox = false;
              }
            }
          }
        });
        dFrontJs.app.changeCheckAviosResFam('#paywithAvios');
        if (isLogado().userType === 'OB') {
          dFrontJs.app.changeCheckAviosResFam('#paywithPoints');
        }
        if (resetCheckbox) {
          $('input[name=resident]:checked').prop('checked', false);
          $noResident.prop('checked', true);
          $('[data-passenger-resident]').html($noResident.siblings('label').html());
        }
        if (matchCounter > 0) {
          $('[data-passenger-resident-radio="data-passenger-resident-radio"]').removeClass('hidden');
          $('[data-resident-warn]').removeClass('hidden');
          $('[data-passenger-resident-radio="data-passenger-resident-radio"]').prev('h4').removeClass('hidden');
          $residencia.parent().parent().removeClass('hidden');
          $('[data-passenger-resident="data-passenger-resident"]').removeClass('option-span');
          $('#spanslash').removeClass('hidden');
        }
      } else {
        $('input[name=resident]:checked').prop('checked', false);
        $noLargeFam.prop('checked', true);
        $noResident.prop('checked', true);
        $('[data-passenger-resident]').html($noResident.siblings('label').html());
        $('[data-passenger-family]').html($noLargeFam.siblings('label').html());

        $('[data-position="9"]').addClass('hidden');
        $residencia.parent().parent().addClass('hidden');
        $('[data-position-mobile="9"]').addClass('hidden');
        $('#familia_numerosa_2').parent().parent().addClass('hidden');
      }

      let isFamilyContHidden = $("#familia_numerosa_2").closest("[data-selectmenu_claim]").parent().hasClass("hidden");
      let isResidentContHidden = $("#residencia").closest("[data-selectmenu_claim]").parent().hasClass("hidden");
      
      (!isFamilyContHidden || !isResidentContHidden)?$("#familia_numerosa_2,#residencia").closest(".ibe-advanced-searcher__fare-container").removeClass("hidden"):$("#familia_numerosa_2,#residencia").closest(".ibe-advanced-searcher__fare-container").addClass("hidden");
    }, 50);
  }
  if (cntrlResFam.eventHandler === undefined) {
    cntrlResFam.eventHandler = (event) => {
      event.preventDefault();
      putresident(disc);
    };
  }

  setTimeout(() => { // It needs time 'cos data-move in responsive
    $('#flight_origin1, #flight_destiny1').focusout(() => {
      putresident(disc);
    });
    $('#tab-searcher-1 a[data-destination-info], #tab-1 a[data-destination-info], #m-tab_01 a[data-destination-info]').click(() => {
      putresident(disc);
    });
    $(document).off('ibe-loadSeekerDiscounts', cntrlResFam.eventHandler);
    $(document).on('ibe-loadSeekerDiscounts', cntrlResFam.eventHandler);
    putresident(disc);
  }, 500);
}
function resiajax(origin3tabsJSON, destinationVJSON) {
  if (resiajax.ajaxExecuted !== true) {
    resiajax.ajaxExecuted = true;
    $.ajax({
      encoding: 'UTF-8',
      method: 'GET',
      url: '/cs/Satellite',
      data: {
        pagename: 'IB_SE/CacheControl12h/BrowserCache3600/getResidentData',
        d: '',
      },
      success(data) {
        cntrlResFam(data, origin3tabsJSON, destinationVJSON);
      },
    });
  }
}
function eventclick(event) {
  const { origin3tabsJSON } = event.data;
  const { destinationVJSON } = event.data;
  resiajax(origin3tabsJSON, destinationVJSON);
  $('#flight_origin1, #flight_destiny1, #tab-searcher-1 a[data-destination-info], #tab-1 a[data-destination-info], #m-tab_01 a[data-destination-info]').off('click focus', eventclick);
}
/**
 * @description Get the resident options for searchers
 * @param {boolean} isCookie True: if exits cookie / False or empty: if not
 */
function residentajax(isCookie, origin3tabsJSON, destinationVJSON) {
  if ($('#resident-1, #residencia').length > 0 && !$('#resident-1, #residencia').hasClass('resident-loaded')) {
    $('#resident-1, #residencia').addClass('resident-loaded');

    if (isCookie) {
      // It is necessary to load residents when there is a lastsearch cookie.
      resiajax(origin3tabsJSON, destinationVJSON);
    } else {
      $('#flight_origin1, #flight_destiny1, #tab-searcher-1 a[data-destination-info], #tab-1 a[data-destination-info], #m-tab_01 a[data-destination-info]')
        .on('click focus', { origin3tabsJSON, destinationVJSON }, eventclick);
    }
  }
}
/**
     * @description Show air shuttle link
     */
function airShuttle() {
  const $pos = $('[data-position="8"]');
  const $posmob = $('[data-position-mobile="8"]');
  function condAirShuttle() {
    const isOFDT = $searchCont.data('url-quadrigam') === 'IBOFDT';
    const $other = $('#flight_origin1');
    const $this = $('#flight_destiny1');
    if ($this.val() !== undefined && $other.val() !== undefined && $this.val() !== '' && $other.val() !== '' && !isOFDT) {
      let thisiata = $this[0].value.split('(')[1] || '';
      thisiata = thisiata.substring(0, 3);
      let otheriata = $other[0].value.split('(')[1] || '';
      otheriata = otheriata.substring(0, 3);
      if ((thisiata === 'MAD' || thisiata === 'BCN') && (otheriata === 'MAD' || otheriata === 'BCN')) {
        $pos.removeClass('hidden');
        $posmob.removeClass('hidden');
      } else {
        $pos.addClass('hidden');
        $posmob.addClass('hidden');
      }
    } else {
      $pos.addClass('hidden');
      $posmob.addClass('hidden');
    }
  }

  // Funcion para prorrogar las fechas de la home al Buscador PA
  function airShuttleClickHandler(event) {
    event.preventDefault();
    const isRedemption = $('#tabContainer').find('.isRedemption').length > 0;
    const i = isRedemption ? 6 : 1;
    const dateFormat = $(`#flight_round_date${i}`).data('format');
    const href = $('.inte-airshuttlelink').attr('href');
    let dateinit = '';
    let dateend = '';
    const YCD = $(`#senior${i}`).length ? +($(`#senior${i}`).html()) : 0;
    let ADT = +($(`#adult${i}`).html());
    const YTH = $(`#young${i}`).length ? +($(`#young${i}`).html()) : 0;
    const BNN = $(`#teenager${i}`).length ? +($(`#teenager${i}`).html()) : 0;
    let depDay;
    let arrDay;
    let BEGIN_DAY_01; let BEGIN_MONTH_01;
    let BEGIN_YEAR_01; let END_DAY_01; let END_MONTH_01; let END_YEAR_01;
    let BEGIN_CITY_01 = ''; let END_CITY_01 = '';
    const params = {};
    const FARE_TYPE = $(`#tarifa${i} option:selected`).val();

    dateinit = $(`#flight_round_date${i}`).val();
    dateend = $(`#flight_return_date${i}`).val();
    BEGIN_CITY_01 = $(`#flight_origin${i}`).val() || '';
    END_CITY_01 = $(`#flight_destiny${i}`).val() || '';
    BEGIN_CITY_01 = BEGIN_CITY_01.substring(BEGIN_CITY_01.indexOf('(') + 1, BEGIN_CITY_01.indexOf(')'));
    END_CITY_01 = END_CITY_01.substring(END_CITY_01.indexOf('(') + 1, END_CITY_01.indexOf(')'));
    if (((END_CITY_01 === 'MAD' && BEGIN_CITY_01 === 'BCN')
    || (END_CITY_01 === 'BCN' && BEGIN_CITY_01 === 'MAD'))) {
      if ($('option#oneway').length > 0) { // home
        if (!$('#oneway').is('option:selected')) { params.TRIP_TYPE = '2'; } else { params.TRIP_TYPE = '1'; }
      } else if (!$('#oneway').is(':checked')) {
        params.TRIP_TYPE = '2';
      } else {
        params.TRIP_TYPE = '1';
      }
      if (dateinit !== '') {
        params.flexible = $(`#flexible1${i}`).is(':checked');
        depDay = getDateByFormat(dateinit, dateFormat);
        BEGIN_DAY_01 = `${depDay.getDate()}`;
        BEGIN_MONTH_01 = `${depDay.getMonth() + 1}`;
        BEGIN_YEAR_01 = `${depDay.getFullYear()}`;
        if (BEGIN_DAY_01.length === 1) {
          BEGIN_DAY_01 = `0${BEGIN_DAY_01}`;
        }
        if (BEGIN_MONTH_01.length === 1) {
          BEGIN_MONTH_01 = `0${BEGIN_MONTH_01}`;
        }
        if (BEGIN_DAY_01 && BEGIN_DAY_01.length > 0) {
          params.BEGIN_DAY_01 = BEGIN_DAY_01;
        }
        if (BEGIN_YEAR_01 && BEGIN_YEAR_01.length > 0) {
          params.BEGIN_YEAR_01 = BEGIN_YEAR_01;
        }
        if (BEGIN_MONTH_01 && BEGIN_MONTH_01.length > 0
          && BEGIN_YEAR_01 && BEGIN_YEAR_01.length > 0) {
          params.BEGIN_MONTH_01 = BEGIN_YEAR_01 + BEGIN_MONTH_01;
        }
      }
      END_DAY_01 = '';
      END_MONTH_01 = '';
      END_YEAR_01 = '';
      if (params.TRIP_TYPE === '2' && dateend.length > 0) {
        arrDay = getDateByFormat(dateend, dateFormat);
        END_DAY_01 = `${arrDay.getDate()}`;
        END_MONTH_01 = `${arrDay.getMonth() + 1}`;
        END_YEAR_01 = `${arrDay.getFullYear()}`;

        if (END_DAY_01.length === 1) {
          END_DAY_01 = `0${END_DAY_01}`;
        }
        if (END_MONTH_01.length === 1) {
          END_MONTH_01 = `0${END_MONTH_01}`;
        }
        if (END_DAY_01 && END_DAY_01.length > 0) {
          params.END_DAY_01 = END_DAY_01;
        }
        if (END_YEAR_01 && END_YEAR_01.length > 0) {
          params.END_YEAR_01 = END_YEAR_01;
        }
        if (END_MONTH_01 && END_MONTH_01.length > 0 && END_YEAR_01 && END_YEAR_01.length > 0) {
          params.END_MONTH_01 = END_YEAR_01 + END_MONTH_01;
        }
      }
      // Origin Destination
      if (BEGIN_CITY_01.length > 0) {
        params.BEGIN_CITY_01 = BEGIN_CITY_01;
      }
      if (END_CITY_01.length > 0) {
        params.END_CITY_01 = END_CITY_01;
      }
      params.pagoAvios = $('#paywithAvios:visible').is(':checked');
      if (FARE_TYPE && FARE_TYPE.length > 0) {
        params.FARE_TYPE = FARE_TYPE;
      }
      // Adult number
      ADT = YCD + YTH + BNN + ADT;
      if (ADT > 1) {
        params.ADT = ADT;
      }
      // eslint-disable-next-line prefer-template
      window.location.href = href + '?' + $.param(params);
    } else {
      window.location.href = href;
    }
  }
  $('.inte-airshuttlelink').off('click', airShuttleClickHandler);
  $('.inte-airshuttlelink').on('click', airShuttleClickHandler);
  condAirShuttle();
  $('#flight_origin1, #flight_destiny1').focusout(() => {
    condAirShuttle();
  });
  $('#tab-searcher-1 a[data-destination-info], #m-tab_01 a[data-destination-info]').click(() => {
    condAirShuttle();
  });
}
/**
     * @description Show Young and senior passengers with dependency of the routes
     * @param {boolean} isseekerdata True: called from the seekerdata / False or empty if not
     */
function passengersByRoute(isseekerdata, initialData) {
  const deferred = $.Deferred();
  let passSenior; let passYoung; let passTeen;
  let allS = false; // if true, senior will be shown in all cases.
  let allY = false; // if true, young will be shown in all cases.
  let allT = false; // if true, teenager will be shown in all cases.
  let all4oriS; let all4oriY; let all4oriT;
  // these are used when there is a * in the options of origin or destinations.
  let lastori; let lastdest; // these two are to save last values of origin and destination.
  let lastSeniorVal = '0'; let lastYoungVal = '0'; let lastTeenVal = '0';
  let checkChanged = false;
  let lastSeniorEnabled = false;
  let isSeniorEnabled = false;
  let lastTeenEnabled = false;
  let isTeenEnabled = false;
  let lastYoungEnabled = false;
  let isYoungEnabled = false;
  let cookieCompletedSpecialpass = isseekerdata;
  const vintageSave = $('#passengerVintage-save');
  const smsSenior = $('.senior').find('.ibe-people-counter__message--senior');
  const smsYoung = $('.young').find('.ibe-people-counter__message--young');
  const smsTeen = $('.teenager').find('.ibe-people-counter__message--teenager');
  let counterOpenAfterWarn = 0;
  if (isseekerdata) {
    lastSeniorVal = initialData.senior;
    lastTeenVal = initialData.young;
    lastYoungVal = initialData.young;
  }

  function specialPassengerUpdated(e) {
    e.preventDefault();
    if (!vintageSave.is(':visible')) {
      if (e.data.passenger === 'senior') {
        lastSeniorVal = $('#senior1').html();
      } else if (e.data.passenger === 'young') {
        lastYoungVal = $('#young1').html();
      } else if (e.data.passenger === 'teenager') {
        lastTeenVal = $('#teenager1').html();
      }
    }
  }
  function vintageSpecialPassengerUpdated(e) {
    e.preventDefault();
    const seniorSelVin = $('#senior1:visible');
    const youngSelVin = $('#young1:visible');
    const teenSelVin = $('#teenager1:visible');
    if (seniorSelVin.length > 0 && !smsSenior.is(':visible')) {
      lastSeniorVal = seniorSelVin.html();
    }
    if (youngSelVin.length > 0 && !smsYoung.is(':visible')) {
      lastYoungVal = youngSelVin.html();
    }
    if (teenSelVin.length > 0 && !smsTeen.is(':visible')) {
      lastTeenVal = teenSelVin.html();
    }
  }

  function hideDisabledPassegerAfterWarn(e) {
    e.preventDefault();
    ++counterOpenAfterWarn;
    if (counterOpenAfterWarn === 2) {
      if (smsSenior.css('display') === 'block') {
        $('.senior').addClass('hidden');
      }
      if (smsTeen.css('display') === 'block') {
        $('.teenager').addClass('hidden');
      }
      if (smsYoung.css('display') === 'block') {
        $('.young').addClass('hidden');
      }
      counterOpenAfterWarn = 0;
    }
  }

  /**
         * @description Logic to show passenger type by route
         * @param {Array} array Array values returned from the service
         * @param {String} origin  Origin input value
         * @param {String} dest Destination input value
            * @param {String} passtype Passenger type
            */
  function lookup(array, origin, dest, passtype) {
    let destinosLength;
    let destinations;
    let originParam = origin;
    let destParam = dest;
    if (passtype === '.senior') {
      destinations = all4oriS;
    } else if (passtype === '.young') {
      destinations = all4oriY;
    } else {
      destinations = all4oriT;
    }
    const destlenginit = destinations ? destinations.length : 0;
    const arrayLength = array.length;
    let i = array[0].origin === '*' ? 1 : 0;
    let j = 0;
    let continu = true;

    const seniorSel = $('.senior').find('.ibe-people-counter__buttons-more').parent();
    const youngSel = $('.young').find('.ibe-people-counter__buttons-more').parent();
    const teenSel = $('.teenager').find('.ibe-people-counter__buttons-more').parent();
    const checkedAviosorPoints = $('#paywithAvios').is(':checked') || $('#paywithPoints').is(':checked');
    const buttonPassengers = $('#flight_passengers1').length > 0 ? $('#flight_passengers1') : $('#flight_passengers_1');
    vintageSave.off('click', vintageSpecialPassengerUpdated);
    vintageSave.on('click', vintageSpecialPassengerUpdated);
    youngSel.off('click', specialPassengerUpdated);
    seniorSel.off('click', specialPassengerUpdated);
    teenSel.off('click', specialPassengerUpdated);
    buttonPassengers.off('click', hideDisabledPassegerAfterWarn);
    buttonPassengers.on('click', hideDisabledPassegerAfterWarn);
    youngSel.on('click', { passenger: 'young' }, specialPassengerUpdated);
    seniorSel.on('click', { passenger: 'senior' }, specialPassengerUpdated);
    teenSel.on('click', { passenger: 'teenager' }, specialPassengerUpdated);

    // Case ""-1
    if (originParam === '' && !destinations) {
      originParam = dest;
      destParam = '';
    }

    // Do nothing, is already showing the passenger if the lastori and lastdest are both true.
    if (checkedAviosorPoints) {
      $(passtype).addClass('hidden');
      // goes in when both are empty, senior and junior should disappear
    } else if (originParam !== lastori || destParam !== lastdest || checkChanged) {
      // reset counter
      counterOpenAfterWarn = 0;
      // Cases 1-1,1-N,1-*,*-1,*-N,1-"",""-1
      if (originParam || destParam) {
        if (destParam !== '' && destinations && destinations.indexOf(destParam) > -1) {
          if (((passtype === '.senior' && !$(passtype).hasClass('hidden') && (+lastSeniorVal > 0))
              || (passtype === '.young' && !$(passtype).hasClass('hidden') && (+lastYoungVal > 0))
              || (passtype === '.teenager' && !$(passtype).hasClass('hidden') && (+lastTeenVal > 0)))) {
            dFrontJs.ibe_searcher_people_counter.checkPassenger('active', passtype.substring(1, passtype.length));
          } else {
            $(passtype).removeClass('hidden');
            dFrontJs.ibe_searcher_people_counter.checkPassenger('active', passtype.substring(1, passtype.length));
          }
          continu = false;
        } else {
          while (i < arrayLength && continu) {
            if (originParam === array[i].origin) {
              if (destinations) {
                // Here it add the destinations that are common to all in the particular case
                destinations = destinations.concat(array[i].destination);
              } else {
                destinations = array[i].destination;
              }
              destinosLength = destinations.length;
              if (dest === '' && (destinations[0] === '*' || destinations[destlenginit] === '*')) { // case 1-*
                if (((passtype === '.senior' && !$(passtype).hasClass('hidden') && (+lastSeniorVal > 0))
                    || (passtype === '.young' && !$(passtype).hasClass('hidden') && (+lastYoungVal > 0))
                    || (passtype === '.teenager' && !$(passtype).hasClass('hidden') && (+lastTeenVal > 0)))) {
                  dFrontJs.ibe_searcher_people_counter.checkPassenger('active', passtype.substring(1, passtype.length));
                } else {
                  $(passtype).removeClass('hidden');
                  dFrontJs.ibe_searcher_people_counter.checkPassenger('active', passtype.substring(1, passtype.length));
                }
                continu = false;
              } else if (destParam !== '') {
                while (j < destinosLength && continu) {
                  if (destinations[j] === destParam || destinations[j] === '*') {
                    if (((passtype === '.senior' && !$(passtype).hasClass('hidden') && (+lastSeniorVal > 0))
                        || (passtype === '.young' && !$(passtype).hasClass('hidden') && (+lastYoungVal > 0))
                        || (passtype === '.teenager' && !$(passtype).hasClass('hidden') && (+lastTeenVal > 0)))) {
                      dFrontJs.ibe_searcher_people_counter.checkPassenger('active', passtype.substring(1, passtype.length));
                    } else {
                      $(passtype).removeClass('hidden');
                      dFrontJs.ibe_searcher_people_counter.checkPassenger('active', passtype.substring(1, passtype.length));
                    }
                    continu = false;
                  }
                  j += 1;
                }
              }
            }
            i += 1;
          }
        }
      }
    } else {
      continu = false;
    }
    if (continu) {
      if (((passtype === '.senior' && !$(passtype).hasClass('hidden') && (+lastSeniorVal > 0))
          || (passtype === '.young' && !$(passtype).hasClass('hidden') && (+lastYoungVal > 0))
          || (passtype === '.teenager' && !$(passtype).hasClass('hidden') && (+lastTeenVal > 0)))) {
        dFrontJs.ibe_searcher_people_counter.checkPassenger('disable', passtype.substring(1, passtype.length));
      } else {
        $(passtype).addClass('hidden');
      }
    }
  }
  /**
         * @description if origin/destination has been modified show/hide the senior/young passenger
         * @param {boolean} destinationinput True destination has been modified. False/empty if not
         */

  function passengersChanges(thies) {
    const oriInput = $('#flight_origin1');
    const destInput = $('#flight_destiny1');
    const valdidationOri = oriInput.parent().children('p').length === oriInput.parent().children('p.hidden').length;
    const valdidationDest = destInput.parent().children('p').length === destInput.parent().children('p.hidden').length;
    const oriVal = oriInput.val() && oriInput.val().includes('(') && valdidationOri ? oriInput.val().split('(')[1].substring(0, 3) : '';
    const destVal = destInput.val() && destInput.val().includes('(') && valdidationDest ? destInput.val().split('(')[1].substring(0, 3) : '';
    const seniorVal = $('#senior1').html();
    const youngVal = $('#young1').html();
    const teenVal = $('#teenager1').html();
    let adultVal = $('#adult1').html();
    let hiddenSenior = $('.senior').hasClass('hidden');
    let hiddenYoung = $('.young').hasClass('hidden');
    let hiddenTeen = $('.teenager').hasClass('hidden');
    const tabid = $('#flight_passengers1').length > 0 ? '#flight_passengers1' : '#flight_passengers_1';
    let resetAdult = false;
    const checkedAviosorPoints = $('#paywithAvios').is(':checked') || $('#paywithPoints').is(':checked');

    if (passSenior && !allS && passSenior.length > 0) {
      lookup(passSenior, oriVal, destVal, '.senior');
    }
    if (passYoung && !allY && passYoung.length > 0) {
      lookup(passYoung, oriVal, destVal, '.young');
    }
    if (passTeen && !allT && passTeen.length > 0) {
      lookup(passTeen, oriVal, destVal, '.teenager');
    }
    if (checkedAviosorPoints) {
      lastori = '';
      lastdest = '';
    }
    if (((oriVal !== lastori) || (destVal !== lastdest))
        || checkChanged) {
      // If was previously precompleted using cookies save actual values when change as last
      // values
      hiddenSenior = $('.senior').hasClass('hidden');
      hiddenYoung = $('.young').hasClass('hidden');
      hiddenTeen = $('.teenager').hasClass('hidden');
      lastori = oriVal;
      lastdest = destVal;
      // Update Selectors only if cities has changed or if we have pressed pay with points
      // Set to 0 last Senior when user changes adult number
      // TODO Refactorizar toda la parte que gestiona el completado de los datos
      //  Calculate Values
      // Senior block
      requestAnimationFrame(() => {
        isSeniorEnabled = smsSenior.css('display') === 'none' && !hiddenSenior;
        if (lastSeniorVal !== '0' && isSeniorEnabled !== lastSeniorEnabled && !cookieCompletedSpecialpass) {
          if (hiddenSenior || smsSenior.css('display') === 'block') {
            adultVal = +adultVal + +lastSeniorVal;
            resetAdult = true;
            $(tabid).removeClass('fc-updateSenior-loaded');
            dFrontJs.ibe_searcher_people_counter.updateResultsSenior(tabid, 0);
          } else if (smsSenior.css('display') === 'none') {
            adultVal = +adultVal - +lastSeniorVal;
            resetAdult = true;
            if (adultVal < 0) {
              lastSeniorVal = +lastSeniorVal + adultVal;
              adultVal = 0;
              if (lastSeniorVal < 0) {
                lastSeniorVal = '0';
              }
            }
            $(tabid).removeClass('fc-updateSenior-loaded');
            dFrontJs.ibe_searcher_people_counter.updateResultsSenior(tabid, lastSeniorVal);
            dFrontJs.ibe_searcher_people_counter.checkPassenger('active', 'senior');
          }
        }
        lastSeniorEnabled = isSeniorEnabled;
        isYoungEnabled = smsYoung.css('display') === 'none' && !hiddenYoung;
        if (lastYoungVal !== '0' && isYoungEnabled !== lastYoungEnabled && !cookieCompletedSpecialpass) {
          if (hiddenYoung || smsYoung.css('display') === 'block') {
            adultVal = +adultVal + +lastYoungVal;
            resetAdult = true;
            $(tabid).removeClass('fc-updateYoung-loaded');
            dFrontJs.ibe_searcher_people_counter.updateResultsYoung(tabid, 0);
          } else if (smsYoung.css('display') === 'none') {
            adultVal = +adultVal - +lastYoungVal;
            resetAdult = true;
            if (adultVal < 0) {
              lastYoungVal = +lastYoungVal + adultVal;
              adultVal = 0;
              if (lastYoungVal < 0) {
                lastYoungVal = '0';
              }
            }
            $(tabid).removeClass('fc-updateYoung-loaded');
            dFrontJs.ibe_searcher_people_counter.updateResultsYoung(tabid, lastYoungVal);
            dFrontJs.ibe_searcher_people_counter.checkPassenger('active', 'young');
          }
        }
        lastYoungEnabled = isYoungEnabled;
        isTeenEnabled = smsTeen.css('display') === 'none' && !hiddenTeen;
        if (lastTeenVal !== '0' && isTeenEnabled !== lastTeenEnabled && !cookieCompletedSpecialpass) {
          if (hiddenTeen || smsTeen.css('display') === 'block') {
            adultVal = +adultVal + +lastTeenVal;
            resetAdult = true;
            $(tabid).removeClass('fc-updateTeenager-loaded');
            dFrontJs.ibe_searcher_people_counter.updateResultsTeenager(tabid, 0);
          } else if (smsTeen.css('display') === 'none') {
            adultVal = +adultVal - +lastTeenVal;
            resetAdult = true;
            if (adultVal < 0) {
              lastTeenVal = +lastTeenVal + adultVal;
              adultVal = 0;
              if (lastTeenVal < 0) {
                lastTeenVal = '0';
              }
            }
            $(tabid).removeClass('fc-updateTeenager-loaded');
            dFrontJs.ibe_searcher_people_counter.updateResultsTeenager(tabid, lastTeenVal);
            dFrontJs.ibe_searcher_people_counter.checkPassenger('active', 'teenager');
          }
        }
        lastTeenEnabled = isTeenEnabled;
        if (resetAdult) {
          $(tabid).removeClass('fc-updateAdult-loaded');
          dFrontJs.ibe_searcher_people_counter.updateResultsAdult(tabid, adultVal);
          if (adultVal === 1 && ((seniorVal === '1' || youngVal === '1' || teenVal === '1')
        || ($('#paywithAvios').is(':checked') || $('#paywithPoints').is(':checked')))) { // This case is for when it is not updated the literal in the summary, when there is an adult and not any other special passenger.
            $(tabid).html($(tabid).attr('data-value-adult'));
          }
        }
        cookieCompletedSpecialpass = false;
      });
      // IF thies selector
      // No reactivamos lo deshabilitado por el flujo UMNR (ej. "Pagar con Avios" con 0 adultos + niños)
      if (thies && thies.length > 0) {
        thies.not('[data-disabled-umnr="true"]').removeAttr('disabled');
      }
    } else if (thies && thies.length > 0) {
      thies.not('[data-disabled-umnr="true"]').removeAttr('disabled');
    }
    let valueRange;
    // Show literals Adult range
    if (!hiddenSenior && smsSenior.css('display') === 'none' && !hiddenYoung && smsYoung.css('display') === 'none') {
      valueRange = $('#flight_passengers1').attr('data-range-adultWithSeniorAndYoung');
    } else if (!hiddenSenior && smsSenior.css('display') === 'none' && !hiddenTeen && smsTeen.css('display') === 'none') {
      valueRange = $('#flight_passengers1').attr('data-range-adultWithSeniorAndTeen');
    } else if (!hiddenSenior && smsSenior.css('display') === 'none') {
      valueRange = $('#flight_passengers1').attr('data-range-adultWithSenior');
    } else if (!hiddenYoung && smsYoung.css('display') === 'none') {
      valueRange = $('#flight_passengers1').attr('data-range-adultWithYoung');
    } else if (!hiddenTeen && smsTeen.css('display') === 'none') {
      valueRange = $('#flight_passengers1').attr('data-range-adultWithTeen');
    } else {
      valueRange = $('#flight_passengers1').attr('data-range-adult');
    }
    // Senior range
    if (smsSenior.css('display') === 'block') {
      $('.senior').find('.ibe-people-counter__people-subtitle').addClass('hidden');
    } else {
      $('.senior').find('.ibe-people-counter__people-subtitle').removeClass('hidden');
    }
    // Young range
    if (smsYoung.css('display') === 'block') {
      $('.young').find('.ibe-people-counter__people-subtitle').addClass('hidden');
    } else {
      $('.young').find('.ibe-people-counter__people-subtitle').removeClass('hidden');
    }
    // Teenager range
    if (smsTeen.css('display') === 'block') {
      $('.teenager').find('.ibe-people-counter__people-subtitle').addClass('hidden');
    } else {
      $('.teenager').find('.ibe-people-counter__people-subtitle').removeClass('hidden');
    }
    $('#adultRange').html(valueRange);
    checkChanged = false;
  }
  /**
   * @description Activate the origin and destination event
   */
  function actOriDes() {
    const inputsOD = $('#flight_origin1,#flight_destiny1');
    const checks = $('#paywithAvios,#paywithPoints');
    const modalSuggest = inputsOD.parent().find('.ui-menu');
    const inputs = $('#paywithAvios,#paywithPoints,#flight_origin1,#flight_destiny1');
    function inputHandler(event) {
      event.preventDefault();
      inputs.attr('disabled', 'disabled');
      passengersChanges(inputs);
    }
    function checkhandler(event) {
      event.preventDefault();
      inputs.attr('disabled', 'disabled');
      requestAnimationFrame(() => {
        checkChanged = true;
        passengersChanges(inputs);
      });
    }
    function suggestClick(event) {
      event.preventDefault();
      inputs.attr('disabled', 'disabled');
      requestAnimationFrame(() => {
        passengersChanges(inputs);
      });
    }

    inputsOD.off('focusout', inputHandler);
    inputsOD.on('focusout', inputHandler);
    checks.off('change', checkhandler);
    checks.on('change', checkhandler);
    modalSuggest.off('click', suggestClick);
    modalSuggest.on('click', suggestClick);
    $(document).off('seeker-od-switch', inputHandler);
    $(document).on('seeker-od-switch', inputHandler);
  }

  /**
         * @description Ajax call
         */
  function passengersAjax() {
    const handleResponse = (data) => {
      passengersAjaxResponse = data;
      passSenior = data[0];
      passYoung = data[1];
      passTeen = data[2];
      if (passSenior[0] && passSenior[0].origin === '*') {
        if (passSenior[0].destination[0] === '*') {
          allS = true; // Case *-*
          $('.senior').removeClass('hidden');
        } else {
          all4oriS = passSenior[0].destination; // Case *-1,*-N
        }
      }
      if (passYoung[0] && passYoung[0].origin === '*') {
        if (passYoung[0].destination[0] === '*') {
          allY = true; // Case *-*
          $('.young').removeClass('hidden');
        } else {
          all4oriY = passYoung[0].destination; // Case *-1,*-N
        }
      }
      if (passTeen[0] && passTeen[0].origin === '*') {
        if (passTeen[0].destination[0] === '*') {
          allT = true; // Case *-*
          $('.teenager').removeClass('hidden');
        } else {
          all4oriT = passTeen[0].destination; // Case *-1,*-N
        }
      }
      passengersChanges();
      actOriDes();
    };
    if (passengersAjaxResponse !== undefined) {
      handleResponse(passengersAjaxResponse);
      deferred.resolve();
    } else {
      $.ajax({
        encoding: 'UTF-8',
        method: 'GET',
        url: '/cs/Satellite',
        data: {
          pagename: 'IB_SE/CacheControl6h/BrowserCache3600/PassengersByRoute',
          market: marketg,
          locale: localeg,
          d: '',
        },
        success(data) {
          if (data.ERROR) {
            deferred.reject(data.ERROR);
          } else {
            handleResponse(data);
            deferred.resolve();
          }
        },
        error(e) {
          deferred.reject(e);
        },
      });
    }
  }
  /**
 * @description Disable the origin and destination event
 */
  function desactOriDes() {
    passengersAjax();
    $('#flight_origin1,#flight_destiny1').off('focusout', desactOriDes);
    $('#flight_passengers1').off('focusin', desactOriDes);
  }
  // Si se quiere cambiar a que afecte a los dem�s buscador, quitar el if
  if (isseekerdata) {
    passengersAjax();
  } else {
    $('#flight_origin1,#flight_destiny1').on('focusout', desactOriDes);
    $('#flight_passengers1').on('focusin', desactOriDes);
  }
  return deferred.promise();
}
const updateODCombinations = (originJson, destinationJson) => {
  const searcher = $('[data-search-place="V-O"]').closest('form');
  const originInput = $('[data-search-place="V-O"]', searcher);
  const destinationInput = $('[data-search-place="V-D"]', searcher);
  const checkRedemptions = $('#paywithAvios, #paywithPoints', searcher);
  const americaRestriction = ($searchCont.data('arearestriction-america') || '').toUpperCase();
  const spainRestriction = ($searchCont.data('arearestriction-spain') || '').toUpperCase();
  const europeRestriction = ($searchCont.data('arearestriction-europa') || '').toUpperCase();
  const africaRestriction = ($searchCont.data('arearestriction-africa') || '').toUpperCase();
  const oceaniaRestriction = ($searchCont.data('arearestriction-oceania') || '').toUpperCase();
  const restrictionMapConfig = {
    ES_COMM_AREA_AMERICA: (americaRestriction.length > 0) ? americaRestriction.split(',') : [],
    ES_COMM_AREA_SPAIN: (spainRestriction.length > 0) ? spainRestriction.split(',') : [],
    ES_COMM_AREA_EUROPE: (europeRestriction.length > 0) ? europeRestriction.split(',') : [],
    ES_COMM_AREA_AFRICA_M_EAST: (africaRestriction.length > 0) ? africaRestriction.split(',') : [],
    ES_COMM_AREA_ASIA_OCEANIA: (oceaniaRestriction.length > 0) ? oceaniaRestriction.split(',') : [],
  };
  let storedOrigin = originInput.val();
  let storedDest = destinationInput.val();

  const getinputArea = (cityIata, cityJson) => {
    let indexA = 0;
    let areaCode;
    for (indexA = 0; indexA < cityJson.length; indexA++) {
      for (let i = 0; i < cityJson[indexA].cities.length; i++) {
        areaCode = cityJson[indexA].area ? cityJson[indexA].area : cityJson[indexA].code;
        if (cityJson[indexA].cities[i].code === cityIata) {
          return { area: areaCode, city: cityJson[indexA].cities[i] };
        }
      }
    }
    return null;
  };
  const getRestrictedAreas = (inputArea) => {
    const restriction = [];
    if (!inputArea) {
      return [];
    }
    if (restrictionMapConfig[inputArea.area]) {
      restrictionMapConfig[inputArea.area].forEach(
        (element) => {
          restriction.push(`ES_COMM_AREA_${$.trim(element)}`);
        },
      );
      return restriction;
    }
    return [];
  };
  const calculateNewCities = (city, jsonCities) => {
    let cityArea;
    let restrictedAreasArray;
    let jsonCopy;
    if (typeof city === 'string' && city.length > 0) {
      cityArea = getinputArea(city, jsonCities);
      restrictedAreasArray = getRestrictedAreas(cityArea);
      if (restrictedAreasArray.length === 0) {
        return jsonCities;
      }
      jsonCopy = JSON.parse(JSON.stringify(jsonCities));
      return jsonCopy.filter((element) => (restrictedAreasArray.indexOf(element.code) < 0) && (element.area === undefined || restrictedAreasArray.indexOf(element.area) < 0));
    }
    return jsonCities;
  };
  if (updateODCombinations.updateInputs === undefined) {
    updateODCombinations.updateInputs = function updateInputs(force) {
      let oriValue = originInput.val();
      let destValue = destinationInput.val();
      let action = '';
      let flagforce = false;
      if(force == true){ flagforce = force;}
      let newCities;
      if (flagforce || storedDest !== destValue || storedOrigin !== oriValue) {
        storedDest = destValue;
        storedOrigin = oriValue;
        oriValue = oriValue.match(/\([A-Z]{3}\)/);
        destValue = destValue.match(/\([A-Z]{3}\)/);
        oriValue = oriValue && oriValue[0] ? oriValue[0].replace('(', '').replace(')', '') : '';
        destValue = destValue && destValue[0] ? destValue[0].replace('(', '').replace(')', '') : '';
        action = $(this).data('search-place');
        originInput.prop('disabled', true);
        originInput.parent().find('button').prop('disabled', true);
        destinationInput.prop('disabled', true);
        destinationInput.parent().find('button').prop('disabled', true);
        switch (action) {
          case 'V-O':
            newCities = calculateNewCities(oriValue, destinationJson);
            dFrontJs.ibe_searcher_choose_city.init(destinationInput, newCities);
            dFrontJs.ibe_autocomplete.init(destinationInput, newCities);
            // destinationInput.trigger('change');
            /* if (destinationInput.val().length > 0) {
              dFrontJs.ibe_validations_searcher.checkCity(searcher, destinationInput, newCities);
            } */
            break;
          case 'V-D':
            newCities = calculateNewCities(destValue, originJson);
            dFrontJs.ibe_searcher_choose_city.init(originInput, newCities);
            dFrontJs.ibe_autocomplete.init(originInput, newCities);
            // originInput.trigger('change');
            /* if (originInput.val().length > 0) {
              dFrontJs.ibe_validations_searcher.checkCity(searcher, originInput, newCities);
            } */
            break;
          default:
            dFrontJs.ibe_searcher_choose_city.init(originInput, originJson);
            dFrontJs.ibe_autocomplete.init(originInput, originJson);
            // dFrontJs.ibe_validations_searcher.checkCity(searcher, originInput, originJson);
            dFrontJs.ibe_searcher_choose_city.init(destinationInput, destinationJson);
            dFrontJs.ibe_autocomplete.init(destinationInput, destinationJson);
            // dFrontJs.ibe_validations_searcher.checkCity(searcher, destinationInput, destinationJson);
            break;
        }
        originInput.prop('disabled', false);
        originInput.parent().find('button').prop('disabled', false);
        destinationInput.prop('disabled', false);
        destinationInput.parent().find('button').prop('disabled', false);
      }
    };
  }
  if (storedOrigin.length > 0) {
    requestAnimationFrame(() => {
      updateODCombinations.updateInputs.call(originInput, true);
    });
  }
  if (storedDest.length > 0) {
    requestAnimationFrame(() => {
      updateODCombinations.updateInputs.call(destinationInput, true);
    });
  }
  if (updateODCombinations.redemptionsCheckHandler === undefined) {
    updateODCombinations.redemptionsCheckHandler = function redemptionsCheckHandler() {
      if ($(this).is(':checked')) {
        updateODCombinations.updateInputs.call(this, true);
        originInput.off('focusout', updateODCombinations.updateInputs);
        destinationInput.off('focusout', updateODCombinations.updateInputs);
      } else {
        originInput.off('focusout', updateODCombinations.updateInputs);
        originInput.on('focusout', updateODCombinations.updateInputs);
        destinationInput.off('focusout', updateODCombinations.updateInputs);
        destinationInput.on('focusout', updateODCombinations.updateInputs);
        updateODCombinations.updateInputs.call(originInput, true);
        updateODCombinations.updateInputs.call(destinationInput, true);
      }
    };
  }
  if (updateODCombinations.switchODHandler === undefined) {
    updateODCombinations.switchODHandler = function switchODHandler() {
      requestAnimationFrame(() => {
        updateODCombinations.updateInputs.call(originInput, true);
      });
      requestAnimationFrame(() => {
        updateODCombinations.updateInputs.call(destinationInput, true);
      });
    };
  }

  updateODCombinations.updateInputs.call(destinationInput, true);
  originInput.off('focusout', updateODCombinations.updateInputs);
  originInput.on('focusout', updateODCombinations.updateInputs);
  destinationInput.off('focusout', updateODCombinations.updateInputs);
  destinationInput.on('focusout', updateODCombinations.updateInputs);
  checkRedemptions.off('change', updateODCombinations.redemptionsCheckHandler);
  checkRedemptions.on('change', updateODCombinations.redemptionsCheckHandler);
  $(document).off('seeker-od-switch', updateODCombinations.switchODHandler);
  $(document).on('seeker-od-switch', updateODCombinations.switchODHandler);
};

const init = () => { // Function Initialization
  if(localemasterg!=""){
    localeg = localemasterg;
  }

  $("#paywithAvios").on("change", function(){
    hideShowPets($(this));
  });
  hideShowPets($("#paywithAvios"));

  submitV();
  // UMNR: menores viajando solos -> solo se carga la modal (AJAX + listeners) si la
  // property de WCS modal.unmrs.wcs.enabled la tiene activada.
  if (typeof unmrModalEnabled !== 'undefined' && unmrModalEnabled === "true") {
    loadUmnrModal();
    initUmnrBirthdateValidation();
    initUmnrGa4Events();
    $(document).on('click', '.ibe-modal-unmr__cta', () => {
      // GA4 (ATQ-34925) - evento 2: clic en "Continuar".
      sendUmnrInteraction('clic', 'modal edad menores:continuar');
      const canContinue = canContinueUmnrFlow();
      // GA4 (ATQ-34925) - evento 3: validación de campos (ok, o ko con las descripciones
      // de todos los errores visibles concatenadas por ",").
      sendUmnrValidationEvent(canContinue);
      if (!canContinue) {
        return;
      }
      launchUmnrSearch();
    });
  }
  // if (Cookies.get('IBERIACOM_LAST_SEARCH') === undefined || $searchCont.data('url-quadrigam') === 'IBOFDT') {
  if (existLastSearches() === false || $searchCont.data('url-quadrigam') === 'IBOFDT') {
    passengersByRoute();
  }

  $(".tooltip-pets .close-btn").on("click", function(e){
    e.preventDefault();
    $(this).closest(".tooltip-pets").addClass("hidden");
  });

  $(".ibe-people-counter__pets .icon-informacion_pet").on("click", function(e){
    e.preventDefault();
    $(".tooltip-pets").removeClass("hidden");
  });

  $("#flyWithPets").on("change", function(){
    if($(this).is(":checked")){
      sessionStorage.setItem("petsChecked", "true");
    } else {
      sessionStorage.setItem("petsChecked", "false");
    }
  });

  if(sessionStorage.getItem("petsChecked") != undefined){
    if(sessionStorage.getItem("petsChecked") == "true"){
      $("#flyWithPets").attr("checked", "checked");
    } else {
      $("#flyWithPets").removeAttr("checked");
    }
  }
};
export {
  passengersByRoute,
  submitV,
  residentajax,
  airShuttle,
  init,
  updateODCombinations,
  changeDigitalData
};
