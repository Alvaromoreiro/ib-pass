/* eslint-disable no-unused-expressions */
import { init as tabflights, changeDigitalData } from './searcher-modules/ibe_tab-flight';
import seekerData from './searcher-modules/ibe_seeker-data';
import {responsive, initDateFormated, getQuerystrParams, replaceAll, redirectByQuadrigam } from '../general/ibe_inte-util';
import getCityListInformation from './searcher-modules/ibe_get-city-list-info';
import { dologin } from '../general/ibe_login';
import retrieveGlobalVariables from '../general/ibe_variables';
import { isLogado } from '../manage/ibe_logged-service';
import checkifcitiesneeded from './searcher-modules/ibe_check-if-needed';
import dosegmentation from '../general/ibe_segmentation';
import { updateLastSearches, updateLastSearchesMT, getLastSearchMT, getAllValidSearhes, existLastSearches, getSpecificSearch, updateLastSearchesSO, existLastSearchesSO, getLastSearchSO} from './searcher-modules/ibe_last-searches-storage';
import * as SessionStorage from '../manage/SessionStorage';
import { getCitiesOrgDest } from '../manage/ibe_cities-services';
import { updateDatalayer, updateDigitalData } from '../manage/ibe_common';
import * as LocalStorage from '../manage/ibe-local-storage';
import { updateOriginDestiny } from '../landings/modules/ibe_asyncSeeker';
import { CalendarElement } from 'commercial-management--digital--price-calendar-library';

let { localeg, localemasterg, marketg, quadrigam } = retrieveGlobalVariables();

/**
 * @description Search logic
 */
let origin3tabsJSON; let destinationVJSON; let destinationHJSON; let destinationCJSON;
let originRJSON; let destinationRJSON; let originSOJSON; let destinationSOJSON;
let isCalendarPrevOpened = false;
const $searchCont = $('#SearcherContent');

//prepopulate stopover last search
const loadPrepopulateSO = () => { 
    //stopover last search
    const lastSearchSO = getLastSearchSO();

    if (lastSearchSO && $('body').find('[data-inte-stop-over]')){
        const objorigin = getCityListInformation(originSOJSON, lastSearchSO.nombreOrigen);
        const prevalueo = objorigin ? `${objorigin.description} (${objorigin.code})` : undefined;

        const objdestiny= getCityListInformation(destinationSOJSON, lastSearchSO.nombreDestino);
        const prevalueoDestiny = objdestiny ? `${objdestiny.description} (${objdestiny.code})` : undefined;

        $('#flight_origin_stop').val(prevalueo);
        $('#flight_origin_stop').parent().addClass('ibe_form__group--content');
        $('#flight_destiny_stop').val(prevalueoDestiny);
        $('#flight_destiny_stop').parent().addClass('ibe_form__group--content');

        if(lastSearchSO.checkIdaYVuelta === true){
          $('#round-trip').prop("checked",true);
          var date_ida_en = lastSearchSO.fechaIda;
          var date_vuelta_en = lastSearchSO.fechaVuelta;
          //controlamos si estamos en idioma en ingles para setearle el formato ingles de manera visual
          if((localeg === 'en' && marketg !== 'GB' && marketg !== 'IE')  || (localeg === 'es' && marketg === 'US')){
            var date_ida = (lastSearchSO.fechaIda).split("/");
            var date_vuelta = (lastSearchSO.fechaVuelta).split("/");
            //Conversion ida
            var f1_ida = new Date(date_ida[2], date_ida[1]-1, date_ida[0]);
            var dd_ida = f1_ida.getDate() < 10 ? "0" + f1_ida.getDate() : f1_ida.getDate();
            var mm_ida = f1_ida.getMonth() < 9 ? "0" + parseInt(f1_ida.getMonth() + 1,10)  :  parseInt(f1_ida.getMonth() + 1,10) ;
            var y_ida = f1_ida.getFullYear();
            
            date_ida_en = mm_ida + '/'+ dd_ida + '/'+ y_ida;
            //Conversion vuelta
            var f2_vuelta = new Date(date_vuelta[2], date_vuelta[1]-1, date_vuelta[0]);
            var dd_vuelta = f2_vuelta.getDate() < 10 ? "0" + f2_vuelta.getDate() : f2_vuelta.getDate();
            var mm_vuelta = f2_vuelta.getMonth() < 9 ? "0" + parseInt(f2_vuelta.getMonth() + 1,10)  : parseInt(f2_vuelta.getMonth() + 1,10) ;
            var y_vuelta = f2_vuelta.getFullYear();
            
            date_vuelta_en = mm_vuelta + '/'+ dd_vuelta + '/'+ y_vuelta;
          }

          $('#flight_round_date1').val(date_ida_en);
          $('#flight_return_date1').val(date_vuelta_en);
          //actualizar calendario
          dFrontJs.ibe_searcher_calendar.updateCalendar($('.ibe-searcher__stopover-calendar'),date_ida_en,date_vuelta_en);
        }else{
          //oneway
          $('#round-trip').prop("checked",false);
          $('div[data-open="oneway"]').hide('fade');
          //active one way function
          if ($('[data-click="oneway"]').length > 0) {
            var parent = $('.ibe-search-collapse');
            var input_from = parent.find('[data-cal="start"]');
            var from_val = input_from.val();
            var input_to = parent.find('[data-cal="end"]');
            var to_val = input_to.val();
            var from_cal = parent.find('[data-function="cal-start"]');
            var to_cal = parent.find('[data-function="cal-end"]');
      
            if(input_to.val().length < 10){
            input_to.val('');
            input_to.closest('.ibe_form__group-half').removeClass('ibe_form__group--content');
            if (to_cal.find('.selected-day--from').length === 0 && from_cal.find('.selected-day--from').length === 0) {
              to_cal.datepicker('setDate', 'null');
            }
            }
        
            input_from.closest('.icon-caret_derecha').removeClass('icon-caret_derecha').closest('.ibe_form__group--error').find('[data-cal="start"]').trigger('change');
            input_from.closest('.ibe_form__group--half').addClass('ibe_form__group--half-only-round');
        
        
            if (from_val !== "" && to_val !== "" || from_val === "" && to_val !== "") {
            from_cal.find('.selected-day--to').removeClass('selected-day--to');
            from_cal.find('.range').removeClass('range');
            } else {
            input_to.closest('.ibe_form__group-half').addClass('ibe_form__group--content');
            from_cal.datepicker('refresh');
            to_cal.datepicker('refresh');
            }
          }
            var date_ida_en = lastSearchSO.fechaIda;
            //controlamos si venimos de un idioma que no sea ingles o viceversa para el formato fecha
            //y intercambiamos mes/día al contrario
            if((localeg === 'en' && marketg !== 'GB' && marketg !== 'IE') || (localeg === 'es' && marketg === 'US')){
              var date_ida = (lastSearchSO.fechaIda).split("/");
              var date_vuelta = (lastSearchSO.fechaVuelta).split("/");
              //Conversion ida
              var f1_ida = new Date(date_ida[2], date_ida[1]-1, date_ida[0]);
              var dd_ida = f1_ida.getDate() < 10 ? "0" + f1_ida.getDate() : f1_ida.getDate();
              var mm_ida = f1_ida.getMonth() < 9 ? "0" + parseInt(f1_ida.getMonth() + 1,10)  : parseInt(f1_ida.getMonth() + 1,10) ;
              var y_ida = f1_ida.getFullYear();
              
              date_ida_en = mm_ida + '/'+ dd_ida + '/'+ y_ida;
            }
        
            $('#flight_round_date1').val(date_ida_en);
            //actualizar calendario
            dFrontJs.ibe_searcher_calendar.updateCalendar($('.ibe-searcher__stopover-calendar'),date_ida_en);
        }
      
        if(lastSearchSO.stopOverIda === true){
          $('#going').prop("checked",true);
        }else{
          $('#going').prop("checked",false);
        }

        $('.ibe-search-collapse__txt--count').html(lastSearchSO.nights);
        $('#adult1').html(lastSearchSO.adultos);
        $('#infants1').html(lastSearchSO.niños);
        $('#babys1').html(lastSearchSO.bebes);
        
        //validacionNochesLimitesMasyMenos
        const nights = parseInt(lastSearchSO.nights,10);
        const adultos = parseInt(lastSearchSO.adultos, 10);
        const niños = parseInt(lastSearchSO.niños, 10);
        const bebes = parseInt(lastSearchSO.bebes, 10);
      
        const maxPassengers = 9; //adultos y niños solo
        const totalAdultosNiños = adultos + niños;
        const totalPassengers = adultos + niños + bebes;
        $('#flight_passengers1').html(totalPassengers.toString()+" "+$('#flight_passengers1').attr('data-text-passenger'));

        //personasLimitesMasymenos
        $('#adult1').removeClass('ibe-people-counter__counter--none');
        $('#infants1').removeClass('ibe-people-counter__counter--none');
        $('#babys1').removeClass('ibe-people-counter__counter--none');
        if(adultos >= 1){
          $('#adult1').parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').removeAttr('disabled');
        }
        if(niños >= 1){
          $('#infants1').parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').removeAttr('disabled');
        }
        if(bebes >= 1){
          $('#babys1').parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').removeAttr('disabled');
        }
      
        if(totalAdultosNiños == maxPassengers){
          $('#adult1').parent().addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').attr('disabled', 'disabled');
          $('#infants1').parent().addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').attr('disabled', 'disabled');
        }
      
        if(adultos == bebes){
          $('#babys1').parent().addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').attr('disabled', 'disabled');
        }
        // Function for click input and toggle content
        if ($('[data-toggle-element="both"]').length > 0) {
              
            var date_1 = (lastSearchSO.fechaIda).split("/");
            var date_2 = (lastSearchSO.fechaVuelta).split("/");
            var f1 = new Date(date_1[2], date_1[1]-1, date_1[0]);
            var f2 = new Date(date_2[2], date_2[1]-1, date_2[0]);
            var day_as_milliseconds = 86400000;
            var diff_in_millisenconds = f2 - f1;
            var diff_in_days = diff_in_millisenconds / day_as_milliseconds;

            if(nights > 1){
              var element =  $('#SearcherContent').find('[data-night-button="less"]');
              element.removeAttr('disabled');
            }
            //control nights searcher
            if(nights === 9 || (nights + 1) == diff_in_days){
              var element =  $('#SearcherContent').find('[data-night-button="plus"]');
              element.attr('disabled', 'disabled');
            }
       }
    }   
};

// Change the number of journeys shown
function changeNumJourneys() {
  const lastSearchMT = getLastSearchMT();
  if (lastSearchMT && $('body').find('[data-journey-show]')) {
    $("[data-journey-show='2']").attr('data-journey-show', lastSearchMT.numJourneys);
  }
}

const submitMT = () => {
  $('#buttonSubmit4').on('submit click', (e) => {
    e.preventDefault();
    const i = 4;
    let num = 0;
    let numsum = 1;
    // const modalTitle = $('#tabContainer').attr('data-error');
    let numjourneys = 0;

    if (dFrontJs.ibe_validations_searcher.validateSearcher()) {
      // const { quadrigam } = window.datalayer_general;
      let parameters = `?bookingMarket=${marketg
      }&TRIP_TYPE=3`;

      const dateinit = {};
      const init = {};
      const BEGIN_DAY_01 = {};
      const BEGIN_MONTH_01 = {};
      const BEGIN_YEAR_01 = {};
      const end = {};
      const BEGIN_CITY_01 = {};
      const END_CITY_01 = {};
      const BEGIN_HOUR_01 = {};
      // Genera error en el init.js que no esté con new date
      // Si se quita no hace efecto el formato de fecha. Necesitan estar los dos casos.
      let getdates1 = $("[data-function='cal-start']").datepicker({
        dateFormat: $('.hasDatepicker').attr('data-format'),
      });
      let getdates2 = $("[data-function='cal-start']").datepicker({
        dateFormat: $('.hasDatepicker').attr('data-format'),
      });

      for (num = 1; num <= 4; num += 1) {
        numsum += 1;
        if ($($('[data-journey="journey"]')[num - 1]).is(':hidden')) {
          BEGIN_CITY_01[num - 1] = BEGIN_CITY_01[num - 1] ? BEGIN_CITY_01[num - 1] : '';
          END_CITY_01[num - 1] = END_CITY_01[num - 1] ? END_CITY_01[num - 1] : '';
          BEGIN_DAY_01[num - 1] = BEGIN_DAY_01[num - 1] ? BEGIN_DAY_01[num - 1] : '';
          BEGIN_MONTH_01[num - 1] = BEGIN_MONTH_01[num - 1] ? BEGIN_MONTH_01[num - 1] : '';
          BEGIN_YEAR_01[num - 1] = BEGIN_YEAR_01[num - 1] ? BEGIN_YEAR_01[num - 1] : '';

          parameters += `&text-from${numsum}-visible=`
                        + `&BEGIN_CITY_0${num}=`
                        + `&text-to${numsum}-visible=`
                        + `&END_CITY_0${num}=`
                        + `&text-date-from${numsum}=`
                        + `&BEGIN_DAY_0${num}=`
                        + `&BEGIN_MONTH_0${num}=`
                        + `&BEGIN_YEAR${numsum}_01=`
                        + `&BEGIN_HOUR_0${num}=`;
        } else {
          numjourneys += 1;
          dateinit[num - 1] = $(`#flight_round_date4${num}`).val();
          init[num - 1] = $(`#flight_origin-mt${num}`).val();
          end[num - 1] = $(`#flight_destiny-mt${num}`).val();
          getdates1 = getdates1.datepicker('setDate', new Date(dateinit[num - 1]));
          getdates2 = getdates2.datepicker('setDate', dateinit[num - 1]);

          BEGIN_CITY_01[num - 1] = init[num - 1].split('(')[1].substring(0, 3);
          END_CITY_01[num - 1] = end[num - 1].split('(')[1].substring(0, 3);
          BEGIN_DAY_01[num - 1] = (`0${getdates1.datepicker('getDate').getDate()}`).slice(-2);
          BEGIN_MONTH_01[num - 1] = (`0${getdates1.datepicker('getDate').getMonth() + 1}`).slice(-2);
          BEGIN_YEAR_01[num - 1] = getdates1.datepicker('getDate').getFullYear();
          BEGIN_HOUR_01[num - 1] = $(`#hora-ida-mt${num}`).val();


          parameters += `&text-from${numsum}-visible=${init[num - 1]
          }&BEGIN_CITY_0${num}=${BEGIN_CITY_01[num - 1]
          }&text-to${numsum}-visible=${end[num - 1]
          }&END_CITY_0${num}=${END_CITY_01[num - 1]
          }&text-date-from${numsum}=${dateinit[num - 1]
          }&BEGIN_DAY_0${num}=${BEGIN_DAY_01[num - 1]
          }&BEGIN_MONTH_0${num}=${BEGIN_YEAR_01[num - 1]}${BEGIN_MONTH_01[num - 1]
          }&BEGIN_YEAR${numsum}_01=${BEGIN_YEAR_01[num - 1]
          }&BEGIN_HOUR_0${num}=${BEGIN_HOUR_01[num - 1]}`;
        }
      }

      /* if ($(`#flexible1${i}`).is(':checked')) {
        const flexible = 'true';
      } */

      const FARE_TYPE = $(`#tarifa${i} option:selected`).val();
      const ADT = $(`#adult${i}`).html();
      const CHD = $(`#infants${i}`).html();
      const INF = $(`#babys${i}`).html();

      const host = $searchCont.attr('data-inte-integrationHost') + $searchCont.attr('data-url-multipleJourneys');

      parameters += `&numTrayectos=${numjourneys
      }&FARE_TYPE=${FARE_TYPE
      }&ADT=${ADT
      }&CHD=${CHD
      }&INF=${INF
      }&YCD=0&YTH=0&quadrigam=${quadrigam}`;

      const lastSearch = {
        iataOrigen: BEGIN_CITY_01[0],
        iataDestino: END_CITY_01[0],
        fechaIda: { day: BEGIN_DAY_01[0].toString(), month: BEGIN_MONTH_01[0].toString(), year: BEGIN_YEAR_01[0].toString() },
        fechaVuelta: { day: '', month: '', year: '' },
        adultos: parseInt(ADT, 10),
        niños: parseInt(CHD, 10),
        bebes: parseInt(INF, 10),
        senior: 0,
        joven: 0,
        tarifa: FARE_TYPE,
      };
      updateLastSearches(lastSearch);
      const CookieSeekerVal = `${BEGIN_CITY_01[0]}|${END_CITY_01[0]}|${BEGIN_DAY_01[0]}|${BEGIN_MONTH_01[0]}|${BEGIN_YEAR_01[0]}|||||${ADT}|${CHD}||${INF}|||${FARE_TYPE}|||||`;
      Cookies.set('IBERIACOM_LAST_SEARCH', CookieSeekerVal, { path: '/', expires: 365, sameSite: 'strict' });

      const lastSearchMT = {
        adultos: parseInt(ADT, 10),
        niños: parseInt(CHD, 10),
        bebes: parseInt(INF, 10),
        tarifa: FARE_TYPE,
        numJourneys: numjourneys,
        combinations: [],
      };
      for (let y = 0; y < 4; y++) {
        lastSearchMT.combinations.push(
          {
            iataOrigen: BEGIN_CITY_01[y],
            iataDestino: END_CITY_01[y],
            fechaIda: { day: BEGIN_DAY_01[y].toString(), month: BEGIN_MONTH_01[y].toString(), year: BEGIN_YEAR_01[y].toString() },
          },
        );
      }
      updateLastSearchesMT(lastSearchMT);
      const CookieSeekerValMT = `${ADT}|${CHD}||${INF}|||${FARE_TYPE}|${numjourneys}|${BEGIN_CITY_01[0]}|${END_CITY_01[0]}|${BEGIN_DAY_01[0]}|${BEGIN_MONTH_01[0]}|${BEGIN_YEAR_01[0]}||${BEGIN_CITY_01[1]}|${END_CITY_01[1]}|${BEGIN_DAY_01[1]}|${BEGIN_MONTH_01[1]}|${BEGIN_YEAR_01[1]}||${BEGIN_CITY_01[2]}|${END_CITY_01[2]}|${BEGIN_DAY_01[2]}|${BEGIN_MONTH_01[2]}|${BEGIN_YEAR_01[2]}||${BEGIN_CITY_01[3]}|${END_CITY_01[3]}|${BEGIN_DAY_01[3]}|${BEGIN_MONTH_01[3]}|${BEGIN_YEAR_01[3]}||||||`;
      Cookies.set('IBERIACOM_LAST_MULTIPLESEARCH', CookieSeekerValMT, { path: '/', expires: 365, sameSite: 'strict' });

      window.location.href = host + parameters;
    }
  });
};

const submitVH = function svh() {
  $('#buttonSubmit2').on('submit click', (e) => {
    e.preventDefault();
    const i = 2;
    // const modalTitle = $('#tabContainer').attr('data-error');
    let dateinit = false;
    let dateend = false;
    let init = false;
    let end = false;
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
    if (dFrontJs.ibe_validations_searcher.validateSearcher() && dateinit !== false
    && dateend !== false && init !== false && end !== false) {
      const host = $searchCont.attr('data-url-bahEndpoint');
      // const appliesOMB = false;
      // const splitEndCity = false;
      // const initializedOMB = true;
      /* let flexible = 'false';
      if ($(`#flexible1${i}`).is(':checked')) {
        flexible = 'true';
      } */
      const textendcity = $(`#flight_destiny${i}`)[0].value.replace('&amp;', '&');
      const BEGIN_CITY_01 = $(`#flight_origin${i}`)[0].value.split('(')[1].substring(0, 3);
      const END_CITY_01 = textendcity.split('(')[1].substring(0, 3);

      const Begindate = $(`#flight_round_date${i}`).val();
      // Genera error en el init.js que no esté con new date
      // Si se quita no hace efecto el formato de fecha. Necesitan estar los dos casos
      const $searccalen = $("#searcher-calendar-end-2 [data-function='cal-end']");
      const $hasdate = $('.hasDatepicker');
      $searccalen.datepicker({
        dateFormat: $hasdate.attr('data-format'),
      }).datepicker('setDate', new Date(Begindate));
      $searccalen.datepicker({
        dateFormat: $hasdate.attr('data-format'),
      }).datepicker('setDate', Begindate);
      let searGetDate = $searccalen.datepicker('getDate');
      const BEGIN_DAY_01 = (`0${searGetDate.getDate()}`).slice(-2);
      const BEGIN_MONTH_01 = (`0${searGetDate.getMonth() + 1}`).slice(-2);
      const BEGIN_YEAR_01 = searGetDate.getFullYear();

      const objorigin = getCityListInformation(origin3tabsJSON, BEGIN_CITY_01);
      const objdestination = getCityListInformation(destinationHJSON, END_CITY_01, null, textendcity.split(' (')[0]);
      const BEGIN_COUNTRY = objorigin ? objorigin.country.code : undefined;
      const codeBAH = objdestination ? objdestination.locationId : undefined;
      const Enddate = $(`#flight_return_date${i}`).val();
      $searccalen.datepicker({
        dateFormat: $hasdate.attr('data-format'),
      }).datepicker('setDate', new Date(Enddate));
      $searccalen.datepicker({
        dateFormat: $hasdate.attr('data-format'),
      }).datepicker('setDate', Enddate);
      searGetDate = $searccalen.datepicker('getDate');
      let END_DAY_01 = searGetDate.getDate();
      let END_MONTH_01 = searGetDate.getMonth() + 1;
      const END_YEAR_01 = searGetDate.getFullYear();

      if (END_DAY_01.toString().length === 1) {
        END_DAY_01 = `0${END_DAY_01}`;
      }
      if (END_MONTH_01.toString().length === 1) {
        END_MONTH_01 = `0${END_MONTH_01}`;
      }

      const FARE_TYPE = $(`#tarifa${i} option:selected`).val();
      const adult = ['adult_1', 'adult_2', 'adult_3', 'adult_4'];
      const children = ['children_1', 'children_2', 'children_3', 'children_4'];
      const baby = ['baby_1', 'baby_2', 'baby_3', 'baby_4'];
      const hotelChildrenAge = ['hotel_children_age_1', 'hotel_children_age_2', 'hotel_children_age_3', 'hotel_children_age_4'];
      for (let numAux = 1; numAux <= 4; numAux += 1) {
        adult[numAux] = $(`#adult_${numAux} option:selected`).val();
        children[numAux] = $(`#children_${numAux} option:selected`).val();
        baby[numAux] = $(`#baby_${numAux} option:selected`).val();
        hotelChildrenAge[numAux] = '';
        if (typeof children[numAux] !== 'undefined') {
          $(`select[id^="room_children_${numAux}-"]`).each(function ech() {
            hotelChildrenAge[numAux] += `${$(this).val()}##`;
          });
        }
      }
      if (!adult[1]) {
        // There is no lastsearchcookie and the user click search without checking passengers/rooms
        adult[1] = '2';
      }

      let rooms;
      if ($('#flight_hotel_room').length > 0) {
        rooms = $('#flight_hotel_room').val().charAt(0);
      } else {
        rooms = $('#rooms option:selected').val();
      }

      // Vuelos+Hotel
      $.ajax({
        method: 'GET',
        url: $searchCont.attr('data-url-wcs'),
        data: {
          pagename: 'IB_SE/CacheControl0s/Seeker/SeekerCipher',
          quadrigram: quadrigam,
          bahType: 'Hotel',
          host,
          language: localeg,
          bahSourcedomain: $searchCont.attr('data-inte-integrationHost'),
          market: marketg,
          BEGIN_CITY_01,
          END_CITY_01,
          handbackUrl: $searchCont.attr('data-inte-integrationHost') + $searchCont.attr('data-url-handbackUrl'),
          handbackSecureUrl: $searchCont.attr('data-inte-integrationHost') + $searchCont.attr('data-url-handbackUrl'),
          adult_1: adult[1],
          adult_2: adult[2],
          adult_3: adult[3],
          adult_4: adult[4],
          children_1: children[1],
          children_2: children[2],
          children_3: children[3],
          children_4: children[4],
          baby_1: baby[1],
          baby_2: baby[2],
          baby_3: baby[3],
          baby_4: baby[4],
          BEGIN_DAY_01,
          BEGIN_YEAR_01,
          BEGIN_MONTH_01,
          END_DAY_01,
          END_YEAR_01,
          END_MONTH_01,
          FARE_TYPE,
          BEGIN_COUNTRY,
          hotel_children_age_1: hotelChildrenAge[1],
          hotel_children_age_2: hotelChildrenAge[2],
          hotel_children_age_3: hotelChildrenAge[3],
          hotel_children_age_4: hotelChildrenAge[4],
          codeBAH,
          flight_hotel_room: rooms,
          FareSearch: 'true', // Is a param for SHAPE, security in Flows
          d: '',
        },
        success(data) {
          const roomsDesc = [];
          let auxRoom;
          let auxAges;
          for (let iAux = 1; iAux <= +rooms; iAux += 1) {
            auxAges = hotelChildrenAge[iAux].split('##');
            auxAges.pop();
            auxRoom = {
              adults: adult[iAux],
              childAges: auxAges,
              babies: baby[iAux],
            };
            roomsDesc.push(auxRoom);
          }
          const BAH_HOTEL = codeBAH;

          const parsePassenger = (rooms, type) => {
            let total = 0;
            for (let index = 0; index < rooms.length; index++) {
              if (type !== 'children') {
                total += parseInt(rooms[index][type], 10); 
              } else {
                total += parseInt(rooms[index]['childAges'].length, 10);
              }
            }
            return total;
          };
          const lastSearch = {
            iataOrigen: BEGIN_CITY_01,
            iataDestino: END_CITY_01,
            fechaIda: { day: BEGIN_DAY_01.toString(), month: BEGIN_MONTH_01.toString(), year: BEGIN_YEAR_01.toString() },
            fechaVuelta: { day: END_DAY_01.toString(), month: END_MONTH_01.toString(), year: END_YEAR_01.toString() },
            tarifa: FARE_TYPE,
            rooms: parseInt(rooms, 10),
            roomsDesc,
            bah: BAH_HOTEL,
            adultos: parsePassenger(roomsDesc,'adults'),
            niños: parsePassenger(roomsDesc,'children'),
            bebes: parsePassenger(roomsDesc,'babies'),
            senior: 0,
            joven: 0,
          };
          updateLastSearches(lastSearch);

          const CookieSeekerVal = `${BEGIN_CITY_01}|${END_CITY_01}|${BEGIN_DAY_01}|${BEGIN_MONTH_01}|${BEGIN_YEAR_01}|${END_DAY_01}|${END_MONTH_01}|${END_YEAR_01}||||||||${FARE_TYPE}|||${rooms}|${JSON.stringify(roomsDesc)}|${BAH_HOTEL}||`;
          Cookies.set('IBERIACOM_LAST_SEARCH', CookieSeekerVal, { path: '/', expires: 365, sameSite: 'strict' });

          // Send form
          const formElement = document.createElement('form');
          $(formElement).attr('action', host)
            .attr('method', 'POST')
            .attr('id', 'form_VH');
          const inputElement = document.createElement('input');
          $(inputElement).attr('name', 'ENCRYPT_STRING')
            .attr('type', 'hidden')
            .attr('value', data);
          $('body').append(formElement);
          $('#form_VH').append(inputElement);
          $('#form_VH').submit();
        },
      });
    }
  });
};

function submitVC() {
  $('#buttonSubmit3').on('submit click', (e) => {
    e.preventDefault();
    const i = 3;
    let num = 1;
    // const modalTitle = $('#tabContainer').attr('data-error');
    let dateinit = false;
    let dateend = false;
    let init = false;
    let end = false;
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
    if (dFrontJs.ibe_validations_searcher.validateSearcher() && dateinit
    !== false && dateend !== false && init !== false && end !== false) {
      const host = $searchCont.attr('data-url-bahEndpoint');
      /* const appliesOMB = false;
      const splitEndCity = false;
      const initializedOMB = true; */
      /* if ($(`#flexible1${i}`).is(':checked')) {
        var flexible = 'true';
      } else {
        var flexible = 'false';
      } */
      const textendcity = $(`#flight_destiny${i}`)[0].value.replace('&amp;', '&');
      const BEGIN_CITY_01 = $(`#flight_origin${i}`)[0].value.split('(')[1].substring(0, 3);
      const END_CITY_01 = textendcity.split('(')[1].substring(0, 3);

      const Begindate = $(`#flight_round_date${i}`).val();
      // Genera error en el init.js que no esté con new date
      // Si se quita no hace efecto el formato de fecha. Necesitan estar los dos casos.
      const $hasdate = $('.hasDatepicker');
      const $searccalen = $("#searcher-calendar-end-3 [data-function='cal-end']");
      $searccalen.datepicker({
        dateFormat: $hasdate.attr('data-format'),
      }).datepicker('setDate', new Date(Begindate));
      $searccalen.datepicker({
        dateFormat: $hasdate.attr('data-format'),
      }).datepicker('setDate', Begindate);
      let searGetDate = $searccalen.datepicker('getDate');
      const BEGIN_DAY_01 = (`0${searGetDate.getDate()}`).slice(-2);
      const BEGIN_MONTH_01 = (`0${searGetDate.getMonth() + 1}`).slice(-2);
      const BEGIN_YEAR_01 = searGetDate.getFullYear();

      const objorigin = getCityListInformation(origin3tabsJSON, BEGIN_CITY_01);
      const objdestination = getCityListInformation(destinationCJSON, END_CITY_01, null, textendcity.split(' (')[0]);
      const BEGIN_COUNTRY = objorigin ? objorigin.country.code : undefined;
      const codeBAH = objdestination ? objdestination.locationId : undefined;

      const Enddate = $(`#flight_return_date${i}`).val();
      $searccalen.datepicker({
        dateFormat: $hasdate.attr('data-format'),
      }).datepicker('setDate', new Date(Enddate));
      $searccalen.datepicker({
        dateFormat: $hasdate.attr('data-format'),
      }).datepicker('setDate', Enddate);
      searGetDate = $searccalen.datepicker('getDate');
      const END_DAY_01 = (`0${searGetDate.getDate()}`).slice(-2);
      const END_MONTH_01 = (`0${searGetDate.getMonth() + 1}`).slice(-2);
      const END_YEAR_01 = searGetDate.getFullYear();

      const FARE_TYPE = $(`#tarifa${i} option:selected`).val();
      const ADT = $(`#adult${i}`).html();
      const CHD = $(`#infants${i}`).html();
      const INF = $(`#babys${i}`).html();

      // Recuperar edades de los ninios
      const carChildrenAge = ['car_children_age_1', 'car_children_age_2', 'car_children_age_3', 'car_children_age_4', 'car_children_age_5', 'car_children_age_6', 'car_children_age_7', 'car_children_age_8'];
      for (num = 0; num < 8; num += 1) {
        carChildrenAge[num] = $(`#Vchildren_${num} option:selected`).val();
        if (carChildrenAge[num] !== undefined) {
          const pos = carChildrenAge[num].charAt(0);
          if (pos === '0') {
            carChildrenAge[num] = carChildrenAge[num].replace('0', '');
          }
        } else {
          carChildrenAge[num] = '';
        }
      }
      // Vuelos+coche
      $.ajax({
        method: 'GET',
        url: $searchCont.attr('data-url-wcs'),
        data: {
          pagename: 'IB_SE/CacheControl0s/Seeker/SeekerCipher',
          quadrigram: quadrigam,
          bahType: 'Car',
          host,
          language: localeg,
          bahSourcedomain: $searchCont.attr('data-inte-integrationHost'),
          market: marketg,
          BEGIN_CITY_01,
          END_CITY_01,
          handbackUrl: $searchCont.attr('data-inte-integrationHost') + $searchCont.attr('data-url-handbackUrl'),
          handbackSecureUrl: $searchCont.attr('data-inte-integrationHost') + $searchCont.attr('data-url-handbackUrl'),
          adult_1: ADT,
          children_1: CHD,
          baby_1: INF,
          BEGIN_DAY_01,
          BEGIN_YEAR_01,
          BEGIN_MONTH_01,
          END_DAY_01,
          END_YEAR_01,
          END_MONTH_01,
          FARE_TYPE,
          codeBAH,
          BEGIN_COUNTRY,
          CAR_CHILD_AGE_1: carChildrenAge[0],
          CAR_CHILD_AGE_2: carChildrenAge[1],
          CAR_CHILD_AGE_3: carChildrenAge[2],
          CAR_CHILD_AGE_4: carChildrenAge[3],
          CAR_CHILD_AGE_5: carChildrenAge[4],
          CAR_CHILD_AGE_6: carChildrenAge[5],
          CAR_CHILD_AGE_7: carChildrenAge[6],
          CAR_CHILD_AGE_8: carChildrenAge[7],
          FareSearch: 'true', // Is a param for SHAPE, security in Flows
          d: '',
        },
        success(data) {
          const BAH_CAR = codeBAH;
          const AGE_ARRAY = [carChildrenAge[0], carChildrenAge[1], carChildrenAge[2],
            carChildrenAge[3], carChildrenAge[4], carChildrenAge[5], carChildrenAge[6],
            carChildrenAge[7]];
          for (let iAux = AGE_ARRAY.length - 1; iAux >= 0; iAux -= 1) {
            if (AGE_ARRAY[iAux] === '') {
              AGE_ARRAY.pop();
            } else if (AGE_ARRAY[iAux].length < 2) {
              AGE_ARRAY[iAux] = `0${AGE_ARRAY[iAux]}`;
            }
          }
          const lastSearch = {
            iataOrigen: BEGIN_CITY_01,
            iataDestino: END_CITY_01,
            fechaIda: { day: BEGIN_DAY_01.toString(), month: BEGIN_MONTH_01.toString(), year: BEGIN_YEAR_01.toString() },
            fechaVuelta: { day: END_DAY_01.toString(), month: END_MONTH_01.toString(), year: END_YEAR_01.toString() },
            adultos: parseInt(ADT, 10),
            niños: parseInt(CHD, 10),
            senior: 0,
            joven: 0,
            ageArray: AGE_ARRAY,
            bebes: parseInt(INF, 10),
            tarifa: FARE_TYPE,
            bah: BAH_CAR,
          };
          updateLastSearches(lastSearch);
          const CookieSeekerVal = `${BEGIN_CITY_01}|${END_CITY_01}|${BEGIN_DAY_01}|${BEGIN_MONTH_01}|${BEGIN_YEAR_01}|${END_DAY_01}|${END_MONTH_01}|${END_YEAR_01}||${ADT}|${CHD}|${AGE_ARRAY}|${INF}|||${FARE_TYPE}|||||${BAH_CAR}||`;
          Cookies.set('IBERIACOM_LAST_SEARCH', CookieSeekerVal, { path: '/', expires: 365, sameSite: 'strict' });

          // Send form
          const formElement = document.createElement('form');
          $(formElement).attr('action', host)
            .attr('method', 'POST')
            .attr('id', 'form_VC');
          const inputElement = document.createElement('input');
          $(inputElement).attr('name', 'ENCRYPT_STRING')
            .attr('type', 'hidden')
            .attr('value', data);
          $('body').append(formElement);
          $('#form_VC').append(inputElement);
          $('#form_VC').submit();
        },
      });
    }
  });
}

const submitSO = () => {
  $('#buttonSubmitSO').on('submit click', (e) => {
    e.preventDefault();

    /*Métrica buscar stop over*/
    const eventData = {
      eventName: 'interaccion',
      eventCategory: quadrigam,
      eventAction: 'clic',
      eventLabel: 'buscar' ,
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
    
    const i = 1;
    let num = 0;
    let numsum = 1;
    let numjourneys = 0;

    if (dFrontJs.ibe_validations_searcher.validateSearcher()) {
      var stopoverleg;
      let parameters = `?bookingMarket=${marketg}&TRIP_TYPE=3`;
      let cityOrigin2; let cityOrigin3;
      let date2; let date3; 
      let nights = parseInt($('.ibe-search-collapse__txt--count').html());
      let nightsCookie = parseInt($('.ibe-search-collapse__txt--count').html());
      const BEGIN_CITY = ['BEGIN_CITY_1', 'BEGIN_CITY_2', 'BEGIN_CITY_3'];
      const END_CITY = ['END_CITY_1', 'END_CITY_2', 'END_CITY_3'];
      const BEGIN_DAY = ['BEGIN_DAY_1', 'BEGIN_DAY_2', 'BEGIN_DAY_3'];
      const BEGIN_MONTH = ['BEGIN_MONTH_1', 'BEGIN_MONTH_2', 'BEGIN_MONTH_3'];
      const BEGIN_YEAR = ['BEGIN_YEAR_1', 'BEGIN_YEAR_2', 'BEGIN_YEAR_3'];
      let dateInit = ['dateinit_1', 'dateinit_2', 'dateinit_3'];
      // const dateEnd = ['dateEnd_1', 'dateEnd_2', 'dateEnd_3'];
      const checkedIyV = $('#round-trip').is(':checked');
      let MAD;
      if (marketg === 'RU') {
        MAD = 'Мадрид (MAD)';
      } else if (marketg === 'CN') {
        MAD = '马德里 (MAD)';
      } else if (marketg === 'JP') {
        MAD = 'マドリード (MAD)';
      } else {
        MAD = 'Madrid (MAD)';
      }
      const iataOrigen = $('#flight_origin_stop').val(); 
      const iataDestino = $('#flight_destiny_stop').val();
      const beginCity = iataOrigen.split('(')[1].substring(0, 3);
      const endCity = iataDestino.split('(')[1].substring(0, 3);
       
      const cityOrigin1 = $('#flight_origin_stop').val(); // City of the first journey the same for all cases
      var date1 = $(`#flight_round_date${i}`).val(); // The date of the first journey is the same in all cases
      date3 = $(`#flight_return_date${i}`).val(); // Date third journey
      if (!checkedIyV || $('#going').is(':checked')) { // Case: On outbound journey
        stopoverleg = "ida";
        cityOrigin2 = MAD; // City second journey
        cityOrigin3 = $('#flight_destiny_stop').val(); // City third journey
        const objCityInfo = getCityListInformation(originSOJSON, cityOrigin1.split('(')[1].substring(0, 3));
        if ((objCityInfo && objCityInfo.area === 'ES_COMM_AREA_AMERICA') || ((originSOJSON[0].area === 'ES_COMM_AREA_AMERICA') && (originSOJSON[0].code === objCityInfo.area))) {
          nights += 1;
        }

        var date_1 = ($('#flight_round_date1').val()).split("/"); //ida
        var date_2 = ($('#flight_return_date1').val()).split("/"); //vuelta
        if((localeg === 'en' && marketg !== 'GB' && marketg !== 'IE') || (localeg === 'es' && marketg === 'US')){
          //fecha ida
          var fida = new Date(date_1[2], parseInt(date_1[0],10)-1, date_1[1]);
          var dd = fida.getDate() < 10 ? "0" + fida.getDate() : fida.getDate();
          var mm = fida.getMonth() < 9 ? "0" + parseInt(fida.getMonth() + 1,10)  : parseInt(fida.getMonth() + 1,10) ;
          var y = fida.getFullYear();
        
          date1 = dd + '/'+ mm + '/'+ y;
          
          //fecha vuelta
          var fvuelta = new Date(date_2[2], parseInt(date_2[0],10)-1, date_2[1]);
          var dd = fvuelta.getDate() < 10 ? "0" + fvuelta.getDate() : fvuelta.getDate();
          var mm = fvuelta.getMonth() < 9 ? "0" + parseInt(fvuelta.getMonth() + 1,10)  : parseInt(fvuelta.getMonth() + 1,10) ;
          var y = fvuelta.getFullYear();

          date3 = dd + '/'+ mm + '/'+ y;
          //fecha parada
          var f1 = new Date(date_1[2], parseInt(date_1[0],10)-1, date_1[1]);
          f1.setDate( f1.getDate() + nights );
  
          var dd = f1.getDate() < 10 ? "0" + f1.getDate() : f1.getDate();
          var mm = f1.getMonth() < 9 ? "0" + parseInt(f1.getMonth() + 1,10)  : parseInt(f1.getMonth() + 1,10) ;
          var y = f1.getFullYear();
  
          date2 = dd + '/'+ mm + '/'+ y;
        }else{
          var f1 = new Date(date_1[2], date_1[1]-1, date_1[0]);
          f1.setDate( f1.getDate() + nights );

          var dd = f1.getDate() < 10 ? "0" + f1.getDate() : f1.getDate();
          var mm = f1.getMonth() < 9 ? "0" + parseInt(f1.getMonth() + 1,10)  : parseInt(f1.getMonth() + 1,10) ;
          var y = f1.getFullYear();

          date2 = dd + '/'+ mm + '/'+ y;
        }
      } else { // Case: On return journey
        stopoverleg = "vuelta";
        cityOrigin2 = $('#flight_destiny_stop').val(); // City second journey
        cityOrigin3 = MAD; // City third journey
        date3 = $(`#flight_return_date${i}`).val(); // Date second journey
        const objCityInfo = getCityListInformation(destinationSOJSON, cityOrigin2.split('(')[1].substring(0, 3));
        if ((objCityInfo && objCityInfo.area === 'ES_COMM_AREA_AMERICA') || ((originSOJSON[0].area === 'ES_COMM_AREA_AMERICA') && (originSOJSON[0].code === objCityInfo.area))) {
          nights += 1;
        }

        var date_1 = ($('#flight_return_date1').val()).split("/");//vuelta
        var date_2 = ($('#flight_round_date1').val()).split("/");//ida
        if((localeg === 'en' && marketg !== 'GB' && marketg !== 'IE') || (localeg === 'es' && marketg === 'US')){
          //fecha ida
          var fida = new Date(date_2[2], parseInt(date_2[0],10)-1, date_2[1]);
          var dd = fida.getDate() < 10 ? "0" + fida.getDate() : fida.getDate();
          var mm = fida.getMonth() < 9 ? "0" + parseInt(fida.getMonth() + 1,10)  : fida.getMonth() + 1;
          var y = fida.getFullYear();

          date1 = dd + '/'+ mm + '/'+ y;
          //fecha vuelta
          var fvuelta = new Date(date_1[2],parseInt(date_1[0],10)-1, date_1[1]);
          var dd = fvuelta.getDate() < 10 ? "0" + fvuelta.getDate() : fvuelta.getDate();
          var mm = fvuelta.getMonth() < 9 ? "0" + parseInt(fvuelta.getMonth() + 1,10)  : parseInt(fvuelta.getMonth() + 1,10) ;
          var y = fvuelta.getFullYear();

          date3 = dd + '/'+ mm + '/'+ y;
          //fecha parada
          var f1 = new Date(date_1[2], parseInt(date_1[0],10)-1, date_1[1]);
          f1.setDate( f1.getDate() - nights );
  
          var dd = f1.getDate() < 10 ? "0" + f1.getDate() : f1.getDate();
          var mm = f1.getMonth() < 9 ? "0" + parseInt(f1.getMonth() + 1,10)  : parseInt(f1.getMonth() + 1,10)  ;
          var y = f1.getFullYear();

          date2 = dd + '/'+ mm + '/'+ y;
        }else{
          var f1 = new Date(date_1[2], date_1[1]-1, date_1[0]);
          f1.setDate( f1.getDate() - nights );

          var dd = f1.getDate() < 10 ? "0" + f1.getDate() : f1.getDate();
          var mm = f1.getMonth() < 9 ? "0" + parseInt(f1.getMonth() + 1,10)  : parseInt(f1.getMonth() + 1,10) ;
          var y = f1.getFullYear();

          date2 = dd + '/'+ mm + '/'+ y;
        }
      }

      const cityOrigin = [cityOrigin1, cityOrigin2, cityOrigin3];
      const cityDestiny = [cityOrigin2, cityOrigin3, cityOrigin1];
      dateInit = [date1, date2, date3];
      let searGetDate; 
      for (num = 0; num <= 2; num += 1) {
        numsum += 1;
        numjourneys += 1;
        BEGIN_CITY[num] = cityOrigin[num].split('(')[1].substring(0, 3);
        END_CITY[num] = cityDestiny[num].split('(')[1].substring(0, 3);
        
        //fecha invertida
        var dateString = dateInit[num];
        dateString = dateString.substring(3, 5)+"/"+dateString.substring(0, 2)+"/"+dateString.substring(6, 10);         
        searGetDate = new Date(dateString);
        BEGIN_DAY[num] = (`0${searGetDate.getDate()}`).slice(-2);
        BEGIN_MONTH[num] = (`0${searGetDate.getMonth() + 1}`).slice(-2);
        BEGIN_YEAR[num] = searGetDate.getFullYear();

        parameters += `&text-from${numsum}-visible=${cityOrigin[num]
        }&BEGIN_CITY_0${[num + 1]}=${BEGIN_CITY[num]
        }&text-to${numsum}-visible=${cityDestiny[num]
        }&END_CITY_0${[num + 1]}=${END_CITY[num]
        }&text-date-from${numsum}=${dateInit[num]
        }&BEGIN_DAY_0${[num + 1]}=${BEGIN_DAY[num]
        }&BEGIN_MONTH_0${[num + 1]}=${BEGIN_YEAR[num]}${BEGIN_MONTH[num]
        }&BEGIN_YEAR${numsum}_01=${BEGIN_YEAR[num]
        }&BEGIN_HOUR_0${[num + 1]}=0000`;
        if (num === 1 && !checkedIyV) { break; }
      }
      const ADT = $(`#adult${i}`).html();
      const CHD = $(`#infants${i}`).html();
      const INF = $(`#babys${i}`).html();
      const stopOverIda = $('#going').is(':checked');
      const pasajeros = $('#flight_passengers1').html();
      const host = $searchCont.attr('data-inte-integrationHost') + $searchCont.attr('data-url-multipleJourneys');
      parameters += `&StopoverLeg=${stopoverleg
                }&numTrayectos=${numjourneys
                }&FARE_TYPE=R`
                + `&ADT=${ADT
                }&CHD=${CHD
                }&INF=${INF
                }&quadrigam=${quadrigam
                }&backtourl=/${marketg.toLowerCase()}/${localeg.toLowerCase()}/stopover-in-madrid/`;

      window.location.href = host + parameters;
      const lastSearch = {
        nombreOrigen: beginCity,
        nombreDestino: endCity,
        checkIdaYVuelta: checkedIyV,
        stopOverIda: stopOverIda,
        nights: nightsCookie,
        fechaIda: date1,
        fechaVuelta: date3,
        pasajeros: pasajeros,
        adultos: parseInt(ADT, 10),
        niños: parseInt(CHD, 10),
        bebes: parseInt(INF, 10),
        locale: localeg
      };
      updateLastSearchesSO(lastSearch);
      const CookieSeekerVal = `${beginCity}|${endCity}|${checkedIyV}|${stopOverIda}|${nightsCookie}|${date1}|${date3}|${pasajeros}|${ADT}|${CHD}|${INF}|${localeg}|`;
      Cookies.set('IBERIACOM_LAST_SEARCH_SO', CookieSeekerVal, { path: '/', expires: 365, sameSite: 'strict' });
    }
  });
};

const submitPA = () => {
  if ($('#5li').hasClass('active')) {
    $('.inte-cardWhite').removeClass('hidden');
    initDateFormated();
    dFrontJs.ibe_searcher_calendar.moveCheckAviosPuente();
  }

  $('#bSearchOpen').on('submit click', (e) => {
    e.preventDefault();
    // eslint-disable-next-line prefer-template
    let host = $searchCont.attr('data-inte-integrationHost') + $searchCont.attr('data-url-booking');
    if (dFrontJs.ibe_validations_searcher.validateSearcher()) {
      const BEGIN_CITY_01 = $('#originPA').val().split('(')[1].substring(0, 3);
      const FARE_TYPE = $('#tarifa5 option:selected').val();
      const FARE_TYPE_END = $('#tarifa51 option:selected').val();
      let TRIP_TYPE;
      const ADT = $('#adult5').html();
      if (!$('#onewayPA').is(':checked')) {
        TRIP_TYPE = '2';
      } else {
        TRIP_TYPE = '1';
      }
      let parameters = `?quadrigam=${quadrigam
      }&market=${marketg
      }&language=${localeg
      }&BEGIN_CITY_01=${BEGIN_CITY_01
      }&TRIP_TYPE=${TRIP_TYPE
      }&FARE_TYPE=${FARE_TYPE
      }&FARE_TYPE_END=${FARE_TYPE_END
      }&BEGIN_DAY_01=`
            + '&BEGIN_MONTH_01='
            + '&BEGIN_YEAR_01='
            + '&END_DAY_01='
            + '&END_MONTH_01='
            + '&END_YEAR_01='
            + `&ADT=${ADT}`;

      if (localeg === 'es') parameters += '&boton=Ver+Tarifa';
      if (localeg === 'en') parameters += '&boton=Check+fare';
      if (localeg === 'ca') parameters += '&boton=Veure+Tarifa';

      if ($('#paywithAviosO').is(':checked')) {
        parameters += '&CHECK_AVIOS=1';
      } else if ($('#paywithPuntosO').is(':checked')) {
        parameters += '&cipVisitor=true&NUM_PAX=9&check_point=1';
      }
      window.location.href = host + parameters + '#!/ibshuttle';
    }
  });

  $('#bSearchClosed').on('submit click', (e) => {
    e.preventDefault();
    const host = $searchCont.attr('data-inte-integrationHost') + $searchCont.attr('data-url-booking');
    if (dFrontJs.ibe_validations_searcher.validateSearcher()) {
      const BEGIN_CITY_01 = $('#originPA').val().split('(')[1].substring(0, 3);
      const END_CITY_01 = $('#destinationPA').val().split('(')[1].substring(0, 3);
      let FARE_TYPE = $('#tarifa5 option:selected').val();
      let FARE_TYPE_END = $('#tarifa51 option:selected').val();
      FARE_TYPE = FARE_TYPE === 'E' ? 'N' : FARE_TYPE;
      FARE_TYPE_END = FARE_TYPE_END === 'E' ? 'N' : FARE_TYPE_END;
      const ADT = $('#adult51').html();
      let TRIP_TYPE;
      let flexible = 'false';
      if ($('#flexible151').is(':checked')) {
        flexible = 'true';
      }
      if (!$('#onewayPA').is(':checked')) {
        TRIP_TYPE = '2';
      } else {
        TRIP_TYPE = '1';
      }

      const beginDate = $('#flight_round_date51').val();
      // Genera error en el init.js que no esté con new date
      // Si se quita no hace efecto el formato de fecha. Necesitan estar los dos casos.
      const $searccalen = $('#searcher-calendar-end-51' + " [data-function='cal-end']");
      const $hasdate = $('.hasDatepicker');
      $searccalen.datepicker({
        dateFormat: $hasdate.attr('data-format'),
      }).datepicker('setDate', new Date(beginDate));
      $searccalen.datepicker({
        dateFormat: $hasdate.attr('data-format'),
      }).datepicker('setDate', beginDate);
      let searGetDate = $searccalen.datepicker('getDate');
      let BEGIN_DAY_01 = searGetDate.getDate();
      let BEGIN_MONTH_01 = searGetDate.getMonth() + 1;
      const BEGIN_YEAR_01 = searGetDate.getFullYear();
      if (BEGIN_DAY_01.toString().length === 1) {
        BEGIN_DAY_01 = `0${BEGIN_DAY_01}`;
      }
      if (BEGIN_MONTH_01.toString().length === 1) {
        BEGIN_MONTH_01 = `0${BEGIN_MONTH_01}`;
      }
      let END_DAY_01 = '';
      let END_MONTH_01 = '';
      let END_YEAR_01 = '';
      if (TRIP_TYPE === '2') {
        const Enddate = $('#flight_return_date51').val();
        $searccalen.datepicker({
          dateFormat: $hasdate.attr('data-format'),
        }).datepicker('setDate', new Date(Enddate));
        $searccalen.datepicker({
          dateFormat: $hasdate.attr('data-format'),
        }).datepicker('setDate', Enddate);
        searGetDate = $searccalen.datepicker('getDate');
        END_DAY_01 = searGetDate.getDate();
        END_MONTH_01 = searGetDate.getMonth() + 1;
        END_YEAR_01 = searGetDate.getFullYear();

        if (END_DAY_01.toString().length === 1) {
          END_DAY_01 = `0${END_DAY_01}`;
        }
        if (END_MONTH_01.toString().length === 1) {
          END_MONTH_01 = `0${END_MONTH_01}`;
        }
      }

      let aux_localeleg = (localemasterg!="")?localemasterg:localeg;
      let parameters = `?quadrigam=${quadrigam
      }&market=${marketg
      }&language=${aux_localeleg
      }&appliesOMB=false`
            + '&splitEndCity=false'
            + '&initializedOMB=true'
            + `&BEGIN_CITY_01=${BEGIN_CITY_01
            }&END_CITY_01=${END_CITY_01
            }&FARE_TYPE=${FARE_TYPE
            }&FARE_TYPE_END=${FARE_TYPE_END
            }&TRIP_TYPE=${TRIP_TYPE
            }&flexible=${flexible
            }&BEGIN_DAY_01=${BEGIN_DAY_01
            }&BEGIN_MONTH_01=${BEGIN_YEAR_01}${BEGIN_MONTH_01
            }&BEGIN_YEAR_01=${BEGIN_YEAR_01
            }&END_DAY_01=${END_DAY_01
            }&END_MONTH_01=${END_YEAR_01}${END_MONTH_01
            }&END_YEAR_01=${END_YEAR_01
            }&residentCode=`
            + '&familianumerosa='
            + `&ADT=${ADT}`;

      if ($('#paywithAviosC').is(':checked') || $('#paywithPuntosC').is(':checked')) {
        /* host = $searchCont.attr('data-inte-integrationHost') + $searchCont.attr
          ('data-url-bookOBandRedemptionEndPoint'); */
        parameters += `&bookingMarket=${marketg}`;
        if (localeg === 'es') parameters += '&boton=Buscar';
        if (localeg === 'en') parameters += '&boton=Search';
        if (localeg === 'ca') parameters += '&boton=Cercar';
      }
      if ($('#paywithAviosC').is(':checked')) {
        // New Redemption flow [Check Avios] + Logged
        const isLogged = isLogado();
        if (isLogged.userLogged && isLogged.userType === 'IBPLUS') {
          window.location.href = `${host + parameters}&pagoAvios=true`;
        } else {
          // [Check Avios] + not logged -> log in + New Redemption flow
          window.location.href = `/integration/ibplus/login/?referralURL=${encodeURIComponent(`${host + parameters}&pagoAvios=true`)}`;
        }
      } else if ($('#paywithPuntosC').is(':checked')) {
        window.location.href = `${host + parameters}&pagoPuntos=true`;
      } else {
        window.location.href = host + parameters;
      }
    }
  });
};
// Switch Orig and Dest values component
const initSwitchOD = function () {
  let $tabAffecting = $("[id*='tab-'] > form,[id*=m-tab-searcher]:has(input)");
  $tabAffecting = $tabAffecting.not('.inte-seekerdata-Done');

  $tabAffecting.find('.ibe-searcher__odSwitch').on('click', function (e) {
    e.preventDefault();
    const selcstringO = "[id*='flight_origin']:not([id*='flight_origin-mt']), #flight_origin-mt1";
    const selcstringD = "[id*='flight_destiny']:not([id*='flight_destiny-mt']), #flight_destiny-mt1";
    const $seekerO = $(this).parent().find(selcstringO);
    const $seekerD = $(this).parent().find(selcstringD);
    const seekerOval = $seekerO.val();
    const seekerDval = $seekerD.val();
    // Reset values
    $seekerO.val('').trigger('change');
    $seekerD.val('').trigger('change');
    // Exchange values
    $seekerO.val(seekerDval);
    $seekerD.val(seekerOval);
    $(document).trigger('seeker-od-switch');
    $seekerO.trigger('change');
    $seekerD.trigger('change');
  });
};
const setDatalayer = (category, action, label) => {
  datalayer_general.eventCategory = category;
  datalayer_general.eventAction = action;
  datalayer_general.eventLabel = label;
  digital_data.eventCategory = category;
  digital_data.eventAction = action;
  digital_data.eventLabel = label;
  digital_data.eventName = 'interaccion';
  updateDatalayer('link');
  updateDigitalData('interaction');
};

// Click Event for Advance Seeker and load tab.
function loadseektab(e, ui) {
    let $this;
  if (ui) {
    $this = ui.newTab.children();
  } else {
    $this = $(this);
  }
  if (!$this.hasClass('inte-tab-loaded')) {
    let id = $this.attr('href');
    if (!id) {
      $this = $this.siblings();
      id = $this.attr('href');
    }

    const se = $this.attr('data-se');
    loadSeekerTab(id, se);
    $(`[href='${$this.attr('href')}']`).addClass('inte-tab-loaded');
    if (ui) {
      ui.oldTab.children().addClass('inte-tab-loaded');
    }
  }
  $this.off('click tabsactivate', loadseektab);
}

const lastSearchFunctionality = () => {
  let searches;
  const $tabLastSearch = $('.inte-tab-lastSearches').not('.inte-lastsearch-loaded');
  const isTab = $tabLastSearch.length > 0;
  const clickHandler = (event) => {
    const tabsSeeker = $("[id*='tab-'] > form,[id*=m-tab-searcher]:has(input)");
    const tabs = [...(tabsSeeker.not(':hidden')), ...(tabsSeeker.not(':visible'))];
    dFrontJs.ibe_bootstrap_collapse.hideCollapse('#last-searchs-desktop, #last-searchs-mobile');
    $('body').removeClass('modal-open');
    setDatalayer('Clickhome', 'UltimasBusquedas', `${event.data.iataOrigen}-${event.data.iataDestino}`);
    setTimeout(() => {
      tabs.forEach((element) => {
        seekerData(origin3tabsJSON, destinationVJSON, destinationHJSON,
          destinationCJSON, originRJSON, destinationRJSON, undefined, undefined, event.data, $(element));
      });
    }, 400);
  };

  function setSearchOfferFunctionality (event, tabAffecting, offer) {
    const $tabAffecting = tabAffecting;
    const tabs = [...($tabAffecting.not(':hidden')), ...($tabAffecting.not(':visible'))];
    dFrontJs.ibe_bootstrap_collapse.hideCollapse('#last-searchs-desktop, #last-searchs-mobile');
    $('body').removeClass('modal-open');
    setTimeout(() => {
      tabs.forEach((element) => {
        seekerData(origin3tabsJSON, destinationVJSON, destinationHJSON,
          destinationCJSON, originRJSON, destinationRJSON, undefined, undefined, offer, $(element));
      });
    }, 400);
  };

  const selectedLS = (event) => {
    event.preventDefault();
    const search = event.data;
    const host = $searchCont.attr('data-inte-integrationHost') + $searchCont.attr('data-url-booking');
    let parameters;
    const appliesOMB = false;
    const splitEndCity = false;
    const initializedOMB = true;
    const isRedemption = $('#tabContainer').find('.isRedemption').length > 0;

    const TRIP_TYPE = (!search.fechaVuelta.day && !search.fechaVuelta.month && !search.fechaVuelta.year) ? '1' : '2';
    const BEGIN_CITY_01 = search.iataOrigen;
    const END_CITY_01 = search.iataDestino;
    const BEGIN_DAY_01 = search.fechaIda.day;
    const BEGIN_MONTH_01 = search.fechaIda.year + search.fechaIda.month;
    const BEGIN_YEAR_01 = search.fechaIda.year;
    const END_DAY_01 = search.fechaVuelta.day;
    const END_MONTH_01 = search.fechaVuelta.year + search.fechaVuelta.month;
    const END_YEAR_01 = search.fechaVuelta.year;
    const FARE_TYPE = search.tarifa;
    const YCD = search.senior || 0;
    const ADT = search.adultos || 0;
    const YTH = search.youngType === 'YTH' ? search.joven : 0;
    const BNN = search.youngType === 'BNN' ? search.joven : 0;
    const CHD = search.niños || 0;
    const INF = search.bebes || 0;
    const residentDiscount = search.familia || '';
    const familyDiscount = search.residentes || '';
    const checkPagoAvios = search.pagoAvios || false;
    const checkPagoPuntos = search.pagoPuntos || false;
    const flexible = search.fechasFlexibles || true;

    // Market and locale
    let mercado = marketg; let lenguaje = localeg;
    const datos = SessionStorage.get('ib-wcs.newRedemptionMarketsRedirections');
    if (checkPagoAvios && datos && datos[marketg] !== undefined
        && datos[marketg].marketRedirect !== undefined && typeof (datos[marketg].marketRedirect) === 'string'
        && datos[marketg].marketRedirect.length > 0) {
      mercado = datos[marketg].marketRedirect;
      if (datos[marketg].localesRedirect !== undefined
          && typeof (datos[marketg].localesRedirect[localeg]) === 'string'
          && datos[marketg].localesRedirect[localeg].length > 0) {
        lenguaje = datos[marketg].localesRedirect[localeg];
      }
    }

    parameters = `?${$.param({
      market: mercado,
      language: lenguaje,
      appliesOMB,
      splitEndCity,
      initializedOMB,
      flexible,
      TRIP_TYPE,
      BEGIN_CITY_01,
      END_CITY_01,
      BEGIN_DAY_01,
      BEGIN_MONTH_01,
      BEGIN_YEAR_01,
      END_DAY_01,
      END_MONTH_01,
      END_YEAR_01,
      FARE_TYPE,
      quadrigam,
    })}`;

    parameters += marketg !== mercado ? `&fromMarket=${marketg}` : '';
    parameters += localeg !== lenguaje ? `&fromLanguage=${localeg}` : '';

    if (checkPagoAvios || checkPagoPuntos) {
      const adultspay = +ADT + +BNN + +YTH + +YCD;
      if (checkPagoPuntos) {
        const childrenpay = +CHD + +INF;
        parameters += `&${$.param({ ADT: adultspay, CHD: childrenpay, INF: 0 })}`;
      } else {
        parameters += `&${$.param({ ADT: adultspay, CHD, INF })}`;
      }
    } else {
      parameters += `&${$.param({ ADT, CHD, INF })}`;
      parameters += BNN >= 0 ? `&BNN=${BNN}` : '';
      parameters += BNN >= 0 ? `&YTH=${YTH}` : '';
      parameters += BNN >= 0 ? `&YCD=${YCD}` : '';
    }

    parameters += `&${$.param({ residentCode: residentDiscount, familianumerosa: familyDiscount })}`;
    parameters += (!checkPagoAvios && !checkPagoPuntos && !isRedemption) ? '&BV_UseBVCookie=no' : '';

    if (checkPagoAvios) {
      const isLogged = isLogado();
      if (isLogged.userLogged && isLogged.userType === 'IBPLUS') {
        window.location.href = `${host + parameters}&pagoAvios=true`;
      } else {
        // [Check Avios] + not logged -> log in + New Redemption flow
        window.location.href = `/integration/ibplus/login/?referralURL=${encodeURIComponent(`${host + parameters}&pagoAvios=true`)}`;
      }
    } else if (checkPagoPuntos) {
      window.location.href = `${host + parameters}&pagoPuntos=true`;
    } else {
      window.location.href = host + parameters;
    }
    setDatalayer('Clickhome', 'UltimasBusquedas', `${search.iataOrigen}-${search.iataDestino}`);
    updateLastSearches(search);
  };

  const renderLastSearchs = (num) => {
    const template = $('.ib-inte-lastSearch-row').html();
    const insert = [];
    const numItems = (typeof (num) === 'number' && num > 0 && num <= searches.length) ? num : searches.length;
    let auxObj;
    const dateFormat = isTab ? $tabLastSearch.data('format') : $('[data-cal=start]').data('format');
    for (let index = 0; index < numItems; index++) {
      const dateStart = dateFormat.replace('DD', searches[index].fechaIda.day).replace('MM', searches[index].fechaIda.month).replace('YYYY', searches[index].fechaIda.year);
      const dateEnd = searches[index].fechaVuelta.day.length > 0 ? dateFormat.replace('DD', searches[index].fechaVuelta.day).replace('MM', searches[index].fechaVuelta.month).replace('YYYY', searches[index].fechaVuelta.year) : '';
      const objOrigin = getCityListInformation(origin3tabsJSON, searches[index].iataOrigen);
      const stringOrigin = objOrigin ? `${objOrigin.description} (${objOrigin.code})` : undefined;
      const objDest = getCityListInformation(destinationVJSON, searches[index].iataDestino);
      const stringDest = objDest ? `${objDest.description} (${objDest.code})` : undefined;
      const objectMap = {
        '{{index}}': index,
        '{{departureString}}': `${stringOrigin}`,
        '{{destinationString}}': `${stringDest}`,
        '{{travelString}}': `${searches[index].iataOrigen} - ${searches[index].iataDestino}`,
        '{{startDate}}': dateStart,
        '{{endDate}}': dateEnd,
        '{{passengerNumber}}': searches[index].adultos + searches[index].senior + searches[index].joven + searches[index].niños + searches[index].bebes,
        '{{adults}}': searches[index].adultos + searches[index].senior + searches[index].joven,
        '{{kids}}': searches[index].niños ? searches[index].niños : 0,
        '{{babies}}': searches[index].bebes ? searches[index].bebes : 0,
        '{{hiddenAvios}}': searches[index].pagoAvios ? '' : ' hidden',
      };
      const auxStr = replaceAll(template, objectMap);
      auxObj = $(auxStr);
      if (isTab) {
        auxObj.on('click', null, searches[index], selectedLS);
      } else {
        auxObj.on('click', null, searches[index], clickHandler);
      }
      insert.push(auxObj);
    }
    $('.ibe-last-searchs .ibe-last-searchs__list').append(insert);
    if (isTab) $tabLastSearch.addClass('inte-lastsearch-loaded');
  };
  const init = () => {
    searches = getAllValidSearhes();
    if (searches && searches.length > 0) {
      if (isTab) {
        $('#tabContainer > ul[data-tab]').addClass('inte-has-lastSearch');
        $('.inte-last-searchs').removeClass('hidden');
        renderLastSearchs(30);
      } else {
        $('.ibe-last-searchs').removeClass('hidden');
        renderLastSearchs(3);
      }
    } else if (isTab) {
      const $pNotData = $tabLastSearch.find('p.inte-notData');
      const $ulTabs = $('#tabContainer > ul[data-tab]');
      const $aNotData = $pNotData.find('a[data-funCode]');
      const aTab1Selector = `a[data-se="${$aNotData.attr('data-funCode')}"]`;
      $ulTabs.addClass('inte-has-lastSearch');
      $tabLastSearch.addClass('inte-lastsearch-loaded');
      $tabLastSearch.find('p.inte-hasData').addClass('hidden');
      $pNotData.removeClass('hidden');
      $aNotData.on('click', (e) => {
        e.preventDefault();
        $ulTabs.find(aTab1Selector).trigger('click');
      });
    }
    $('.ibe-last-searchs__trigger[data-target="#last-searchs-mobile"]').on('click', () => {
      if (window.innerWidth < dFrontJs.resolutions.sm) {
        requestAnimationFrame(() => {
          $('body').addClass('modal-open');
        });
      }
    });
    $(document).off('ib-seeker-data-completed', init);
  };
  const addTab = () => {
    const templateLi = $('.ib-inte-lastSearch-tab').html();
    const $ulTabs = $('#tabContainer > ul[data-tab]').not('.inte-has-lastSearch');
    if ($ulTabs.length > 0) {
      $ulTabs.prepend(templateLi);
      dFrontJs.ibe_resize.init();
      $ulTabs.resize().addClass('inte-has-lastSearch');
      $(document).off('loginEventWCS', addTab);
      $('#lastSearchTabLink a').on('click', loadseektab);
      $('#lastSearchTabLink a').on('click', () => {
        $('.inte-cardWhite').addClass('hidden');
      });
    }
  };
  const isLogged = isLogado();
  const cookieConsent = Cookies.get('OptanonConsent') || '';
  if (!isTab) {
    if (quadrigam === 'IBHMPA' || quadrigam === 'IBHMPI') {
      if ($('.inte-seekerdata-Done').length === 0
        && isLogged.userLogged && (isLogged.userType === 'IBPLUS' || isLogged.userType == 'IBZERO')
        && (cookieConsent.indexOf('C0005:1') >= 0 || window.location.host.includes('ibcwcslocal'))
      ) {
        $(document).on('ib-seeker-data-completed', init);
      } else if ((cookieConsent.indexOf('C0005:1') >= 0 || window.location.host.includes('ibcwcslocal'))) {
        $(document).on('loginEventWCS', init);
      }
    } else if (isLogged.userLogged && (isLogged.userType === 'IBPLUS' || isLogged.userType == 'IBZERO')
      && (cookieConsent.indexOf('C0005:1') >= 0 || window.location.host.includes('ibcwcslocal'))) {
      addTab();
    } else if (cookieConsent.indexOf('C0005:1') >= 0 || window.location.host.includes('ibcwcslocal')) {
      $(document).on('loginEventWCS', addTab);
    }
    seekerData(origin3tabsJSON, destinationVJSON, destinationHJSON,
      destinationCJSON, originRJSON, destinationRJSON);
    $(document.body).on('setOfferSeekerWCS', setSearchOfferFunctionality);
  } else if (isLogged.userLogged && (isLogged.userType === 'IBPLUS' || isLogged.userType == 'IBZERO')
        && (cookieConsent.indexOf('C0005:1') >= 0 || window.location.host.includes('ibcwcslocal'))) {
    init();
  } else if (isLogged.userLogged && (isLogged.userType === 'IBPLUS' || isLogged.userType == 'IBZERO')) {
    redirectByQuadrigam(marketg.toLowerCase(), localeg, 'IBADVS');
  } else {
    window.location.href = `/integration/ibplus/login/?referralURL=${encodeURIComponent(window.location.pathname)}`;
  }
};
/**
 * Habilita la activación de checkboxes con la tecla Enter.
 * 
 * @param {string} selector 
 */
function enableCheckboxActivationWithEnter(selector = 'input[type="checkbox"]') {
  document.querySelectorAll(selector).forEach(checkbox => {
    checkbox.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault(); 
        checkbox.checked = !checkbox.checked; // Cambia el estado del checkbox
        checkbox.dispatchEvent(new Event('change')); 
        checkbox.dispatchEvent(new Event('click')); 
      }
    });
  });
}

/**
 * @description Tabs Advanced searcher, searcher home.
 * Print html of tab selected
 * @param tabid Id tab selector. Example: #tab-searcher-1, #tab-3, etc...
 * @param se Name SiteEntry of Seeker tab. Example:Seeker/tab1, AdvSeeker/AirShuttle, etc...
 */
function loadSeekerTab(tabid, se) {
  function initSeekerTab(tabid, se) {
    // Particular inits
    if (se === 'Seeker/tab1' || se === 'AdvSeeker/Flights') {
      dFrontJs.ibe_searcher_people_counter.init();
      dFrontJs.ibe_passenger.init();
      dologin.pointsCheckifApply();
      // Setup check Avios disable of discounts (resident and family)
      $('[data-checkBaby]').off('change', dFrontJs.app.changeCheckAviosResFam);
      $('[data-checkBaby]').on('change', dFrontJs.app.changeCheckAviosResFam);
      if (isLogado().userLogged) {
        window.requestAnimFrame(() => {
          dosegmentation();
        });
      }
      tabflights();
      if ($("body[data-landing-template=T3-Landing]").length > 0 || $('body[data-landing-template=T2-Destination]').length > 0 || $('body[data-landing-template=T2-Origin]').length > 0) {
        updateOriginDestiny('#flight_origin1', '#flight_destiny1');
      }
    } else if (se === 'Seeker/tab2' || se === 'AdvSeeker/FlightHotel') {
      dFrontJs.ibe_searcher_room.init();
      submitVH();
      if ($("body[data-landing-template=T3-Landing]").length > 0 || $('body[data-landing-template=T2-Destination]').length > 0 || $('body[data-landing-template=T2-Origin]').length > 0) {
        updateOriginDestiny('#flight_origin2', '#flight_destiny2');
      }
    } else if (se === 'Seeker/tab3' || se === 'AdvSeeker/FlightCar') {
      dFrontJs.ibe_searcher_people_counter.init();
      dFrontJs.ibe_passenger.init();
      submitVC();
      $('#tab-searcher-3,#tab-5,#m-tab_03').addClass('searcher-function');
      if ($("body[data-landing-template=T3-Landing]").length > 0 || $('body[data-landing-template=T2-Destination]').length > 0 || $('body[data-landing-template=T2-Origin]').length > 0) {
        updateOriginDestiny('#flight_origin3', '#flight_destiny3');
      }
    } else if (se === 'AdvSeeker/MultipleJourneys') {
      dFrontJs.ibe_searcher_people_counter.init();
      changeNumJourneys();
      dFrontJs.ibe_journey.init();
      dFrontJs.ibe_passenger.init();
      submitMT();
    } else if (se === 'AdvSeeker/AirShuttle') {
      dFrontJs.ibe_searcher_people_counter.init();
      dFrontJs.ibe_passenger.init();
      dFrontJs.ibe_tab.init();
      dFrontJs.ibe_selectmenu.init();
      dologin.pointsCheckifApply();
      submitPA();
    } else if (se === 'AdvSeeker/LastSearches') {
      getCitiesOrgDest('V-D')
        .then((arrOriDest) => {
          if (arrOriDest) {
            origin3tabsJSON = arrOriDest['V-O'] ? arrOriDest['V-O'] : origin3tabsJSON;
            destinationVJSON = arrOriDest['V-D'] ? arrOriDest['V-D'] : destinationVJSON;
            lastSearchFunctionality();
          }
        }).catch((error) => {
          console.log(error);
          console.error('Error loading Origin and destination');
        });
    }

    checkifcitiesneeded(origin3tabsJSON, destinationVJSON, destinationHJSON,
      destinationCJSON, originRJSON, destinationRJSON)
      .then((arrOriDest) => {
        if (arrOriDest) {
          origin3tabsJSON = arrOriDest.origin3tabsJSONAux ? arrOriDest.origin3tabsJSONAux : origin3tabsJSON;
          destinationVJSON = arrOriDest.destinationVJSONAux ? arrOriDest.destinationVJSONAux : destinationVJSON;
          destinationHJSON = arrOriDest.destinationHJSONAux ? arrOriDest.destinationHJSONAux : destinationHJSON;
          destinationCJSON = arrOriDest.destinationCJSONAux ? arrOriDest.destinationCJSONAux : destinationCJSON;
          originRJSON = arrOriDest.originRJSONAux ? arrOriDest.originRJSONAux : originRJSON;
          destinationRJSON = arrOriDest.destinationRJSONAux ? arrOriDest.destinationRJSONAux : destinationRJSON;
          lastSearchFunctionality();
          if ($searchCont.attr('data-url-quadrigam') === 'IBOFDT') {
            if (se === 'Seeker/tab1') {
              dFrontJs.ibe_datatable.loadJson(origin3tabsJSON, destinationVJSON, '#tab-flights');
              dFrontJs.ibe_modals_vintage.reloadOriDesModal();
              if ($("body[data-landing-template=T3-Landing]").length > 0 || $('body[data-landing-template=T2-Destination]').length > 0 || $('body[data-landing-template=T2-Origin]').length > 0) {
                updateOriginDestiny('#flight_origin1', '#flight_destiny1');
              }
            } else if (se === 'Seeker/tab2') {
              dFrontJs.ibe_datatable.loadJson(origin3tabsJSON, destinationHJSON, '#tab-flightshotel');
              dFrontJs.ibe_modals_vintage.reloadOriDesModal();
              if ($("body[data-landing-template=T3-Landing]").length > 0 || $('body[data-landing-template=T2-Destination]').length > 0 || $('body[data-landing-template=T2-Origin]').length > 0) {
                updateOriginDestiny('#flight_origin2', '#flight_destiny2');
              }
            } else if (se === 'Seeker/tab3') {
              dFrontJs.ibe_datatable.loadJson(origin3tabsJSON, destinationCJSON, '#tab-flightscar');
              dFrontJs.ibe_modals_vintage.reloadOriDesModal();
              if ($("body[data-landing-template=T3-Landing]").length > 0 || $('body[data-landing-template=T2-Destination]').length > 0 || $('body[data-landing-template=T2-Origin]').length > 0) {
                updateOriginDestiny('#flight_origin3', '#flight_destiny3');
              }
            }
          }
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        console.error('Error loading Origin and destination');
      });
    if (se.indexOf('AdvSeeker') < 0) {
      // No overlay in AdvSeeker
      dFrontJs.ibe_overlay.init();
    }
    if (responsive() !== 'desktop') {
      dFrontJs.ibe_searcher_accordion_mobile.init();
    }
    if ($('.ibe-searcher__vintage').length > 0) {
      dFrontJs.ibe_searcher_vintage.init();
      if (window.innerWidth < dFrontJs.resolutions.lg) {
        dFrontJs.ibe_modals_vintage.init(tabid); // Modals in vintage
      }
    }
    // dFrontJs.ibe_tab.init(); //Get in place the dropdown cities.
    dFrontJs.ibe_inputs.init();
    dFrontJs.ibe_bootstrap_collapse.init();
    dFrontJs.ibe_searcher_calendar.init();
    dFrontJs.ibe_tooltip.init();
    dFrontJs.ibe_validations_searcher.init();
    initDateFormated();
    initSwitchOD();
    if ($('[data-keyboard-close]').length > 0) {
      dFrontJs.ibe_keyboard_action.close($('[data-keyboard-close]'));
    }
    // $(window).trigger("load"); [JLR] This shouldn't be done.
    //checkbox enter
    enableCheckboxActivationWithEnter();
  }

  const $tabidmobile = $(tabid.toString().replace('#', '#m-'));
  if (se !== undefined && $(tabid).find('input').length <= 0 && $tabidmobile.find('input').length <= 0) {
    const pagename = `IB_SE/CacheControl6h/BrowserCache3600/${se}`;
    $.ajax({
      method: 'GET',
      url: '/cs/Satellite',
      data: {
        pagename,
        market: marketg,
        locale: localeg,
        d: '',
      },
      beforeSend() {
        dFrontJs.ibe_loading.open(tabid);
        dFrontJs.ibe_loading.open($tabidmobile.find('[id^="m-tab_0"]'));
      },
      success(data) {
        dFrontJs.ibe_loading.close();
        $(tabid).html(data);
        initSeekerTab(tabid, se);
      },
    });
  }
}

const dInteStopOver = () => {
  let originsJSON; let destinationsJSON = {};
  const inputOriSelector = $('#flight_origin_stop');
  const inputDestSelector = $('#flight_destiny_stop');

  /**
    Function to create and insert HTML whith cities in input origin/destination
    Inputs:
        - type:
                "all" -> create and insert HTML with all cities
                "connections" -> create and insert HTML with connections
        - fromInput: "O" or "D", input where insert new cities
    * */
  const createCitiesListSO = function cso(type, fromInput) {
    let $selectorinput; let jsonData; let citySelected; let allCities; let citiesConnections;
    let i; let l; let foundArea; let foundCity; let cityConnections; let arrayNew = [];
    function buscoCity(city) {
      return city.code === this;
    }
    if (fromInput === 'O') {
      allCities = JSON.parse(JSON.stringify(originSOJSON));
      $selectorinput = inputOriSelector;
      jsonData = JSON.parse(JSON.stringify(originSOJSON));
      citySelected = inputDestSelector;
    } else if (fromInput === 'D') {
      allCities = JSON.parse(JSON.stringify(destinationSOJSON));
      $selectorinput = inputDestSelector;
      jsonData = JSON.parse(JSON.stringify(destinationSOJSON));
      citySelected = inputOriSelector;
    }
    /**
         * jsonData: se obtiene un json con las ciudades de conexión para la ciudad seleccionada
         * De ese json se sacará el array de cities que contiene los códigos de ciudades de conexión
         * Para esos códigos de ciudades necesito obtener su code,decription y country,
         * esto de buscará el el json de todas las ciudades (allCities)
         */
    if (type !== 'all') {
      citySelected = citySelected[0].value.split('(')[1].substring(0, 3);
      jsonData = getCityListInformation(jsonData, citySelected).areaConnections;
      for (i = 0; i < jsonData.length; i += 1) {
        citiesConnections = jsonData[i].cities;
        if (citiesConnections.length > 0) {
          foundArea = allCities[i];
          for (l = 0; l < citiesConnections.length; l += 1) {
            cityConnections = citiesConnections[l];
            foundCity = foundArea.cities.find(buscoCity.bind(cityConnections));
            if (foundCity) {
              delete foundCity.areaConnections;
              arrayNew.push(foundCity);
            }
          }
          jsonData[i].cities = arrayNew;
          arrayNew = [];
        }
      }
    }
    dFrontJs.ibe_searcher_choose_city.init($selectorinput, jsonData);
    dFrontJs.ibe_autocomplete.init($selectorinput, jsonData);
    initDateFormated();
  };
  /**
    Function to inicialize input with his specific logic
    Cases:
        - Origin input and Destination input are empty -> Show all cities in both inputs
        - Origin input is not empty and Destination input is empty ->
        // Show connections for origin input in destination input
        - Origin input is empty and Destination input is not empty ->
        // Show connections for destination input in origin input
        - Origin input is not empty and Destination input is not empty,
        // and choose new origin input -> Check if new connection origin <->
        // destinations is possible, if is not possible reset destination input
        - Origin input is not empty and Destination input is not empty,
        // and choose new destination input -> Check if new connection destination <->
        // origin is possible, if is not possible reset origin input

    * */
   
      
  const initInputSO = function iso(fromInput) {
    // Check if connection origin <-> destination is possible
    function checkCityConnection(json, inputSelected, inputCheck) {
      let isConnected = false;
      if (inputCheck.length > 0) {
        connected:
        for (let i = 0; (i < json.length); i += 1) {
          const objCities = json[i].cities;
          for (let j = 0; (j < objCities.length); j += 1) {
            if (inputSelected.indexOf(objCities[j].code) > 0) {
              const areasConnectionsCities = objCities[j].areaConnections;
              for (let k = 0; k < areasConnectionsCities.length; k += 1) {
                if (areasConnectionsCities[k].cities.length > 0) {
                  const connectionsCities = areasConnectionsCities[k].cities;
                  for (let l = 0; (l < connectionsCities.length); l += 1) {
                    if (inputCheck.indexOf(connectionsCities[l]) > 0) {
                      isConnected = true;
                      break connected;
                    }
                  }
                }
              }
            }
          }
        }
      }
      return isConnected;
    }

    let inputSelected; let inputCheck = '';
    let jsonData = {};
    const fromInputAux = fromInput;
    if (fromInputAux === 'O') {
      inputSelected = inputOriSelector;
      inputCheck = inputDestSelector;
      jsonData = originsJSON;
    } else if (fromInputAux === 'D') {
      inputSelected = inputDestSelector;
      inputCheck = inputOriSelector;
      jsonData = destinationsJSON;
    }
    const datavalidatetheOther = inputCheck.val() !== '' && !$('p[data-validate]', inputCheck.parent()).is(':visible');
    const datavalidateThis = inputSelected.val() !== '' && !$('p[data-validate]', inputSelected.parent()).is(':visible');

    if (datavalidateThis) {
      // Check if other input is correct an#id-tab-collapse-stop check connections between inputs
      if (datavalidatetheOther
        && checkCityConnection(jsonData, inputSelected.val(), inputCheck.val())) {
        createCitiesListSO('all', 'O');
        createCitiesListSO('all', 'D');
      } else {
        // reset other input
        inputCheck.val('');
        inputCheck.parent().removeClass('ibe_form__group--content');
        // Remove error class
        inputCheck.closest('.ibe_form__group').has('[data-validate-text]:visible').removeClass('ibe_form__group--error');
        inputCheck.closest('.ibe_form__group').find('[data-validate-text]').each(function ech() {
          $(this).addClass('hidden');
        });

        // Create and insert HTML with new connections
        if (fromInputAux === 'O') {
          createCitiesListSO('connections', 'D');
          createCitiesListSO('all', 'O');
        } else if (fromInputAux === 'D') {
          createCitiesListSO('connections', 'O');
          createCitiesListSO('all', 'D');
        }
      }
    } else if (datavalidatetheOther) { // If input is cleaned
      // Create and insert HTML with new connections
      if (fromInputAux === 'O') {
        createCitiesListSO('connections', 'O');
        createCitiesListSO('all', 'D');
      } else if (fromInputAux === 'D') {
        createCitiesListSO('connections', 'D');
        createCitiesListSO('all', 'O');
      }
    } else {
      // Create and insert HTML with all origin and destination cities
      createCitiesListSO('all', 'O');
      createCitiesListSO('all', 'D');
    }
  };

  const init = () => {
    let lastOrigin; let lastDestination;
    $.ajax({
      encoding: 'UTF-8',
      method: 'GET',
      url: '/cs/Satellite',
      data: {
        pagename: 'IB_SE/CacheControl6h/BrowserCache3600/Seeker/CitiesStopOver',
        market: marketg,
        locale: localeg,
        d: '',
      },
      success(data) {
        if (data.length > 0) {
          originsJSON = data[0];
          destinationsJSON = data[1];

          originSOJSON = originsJSON;
          destinationSOJSON = destinationsJSON;

          createCitiesListSO('all', 'O');
          createCitiesListSO('all', 'D');

          loadPrepopulateSO();
          $('.icon-senalizacion_mapas').show();
          submitSO();
        }
      },
    });

    inputOriSelector.on('change, focusout', () => {
      if ((inputOriSelector.val() === '' && inputOriSelector.val() !== lastOrigin) || (inputOriSelector.val() !== '' && inputOriSelector.val() !== lastOrigin && !$('p[data-validate]', inputOriSelector.parent()).is(':visible'))) {
        initInputSO('O');
        lastOrigin = inputOriSelector.val();
      }
    });
    inputDestSelector.on('change, focusout', () => {
      if ((inputDestSelector.val() === '' && inputDestSelector.val() !== lastDestination) || (inputDestSelector.val() !== '' && inputDestSelector.val() !== lastDestination && !$('p[data-validate]', inputDestSelector.parent()).is(':visible'))) {
        initInputSO('D');
        lastDestination = inputDestSelector.val();
      }
    });
  };
  init();
  // return init;
};

const calendarReactInit = () => {
  CalendarElement.registerComponent();
}

const configCalendarReact = () => {
  //CALENDARS 
  let calendar = $("price-calendar");
  calendar.each(function(index, elem){
    //VARIABLES
    let date_reset = $(elem).attr("date-reset");
    let departure_elem = $(elem).attr("date-departure");
    let return_elem = $(elem).attr("date-return");
    let oneway_elem = $(elem).attr("date-oneway");
    let origin_city = $(elem).attr("origin-city");
    let destination_city = $(elem).attr("destination-city");

    //RESET SELECTION
    resetCalendarSelection(date_reset, departure_elem, return_elem, elem);
    
    //ORIGIN AND DESTINATION CHANGE
    changeOriginDestCalendar(origin_city, destination_city, elem);

    //CAPTURE KEY EVENTS ON DATE INPUTS FOR ACCESIBILITY
    captureKeysDateInputs(departure_elem, return_elem, oneway_elem, elem);

    //CLOSE TOOLTIP
    $(".ibe-searcher__calendar-tooltip .close-btn").on("click", function(e){
      e.preventDefault();
      $(this).closest(".ibe-searcher__calendar-tooltip").addClass("hidden");
    });
    $(".ibe-searcher__calendar-btn").on("click", function(e){
       e.preventDefault();
       $(this).closest(".ibe-searcher__calendar-footer").find(".ibe-searcher__calendar-tooltip").removeClass("hidden");
    });

    //SELECTION ON CALENDAR
    $(elem).on('calendarDateChange', calendarDateChange);

    //SHOW AND HIDE CALENDAR WHEN FOCUS IN
    showHideCalendar(departure_elem, return_elem, date_reset, elem, origin_city, destination_city, oneway_elem);
  });
}

//HANDLER FUNCTION FOR CALENDAR DATE CHANGED EVENT (REACT COMPONENT)
const calendarDateChange = (event) => {
  const calendar_target = event.currentTarget;
  const { selectedDate, selectedPrice, currencyCode } = event.detail;
  
  let departure_elem = $(calendar_target).attr("date-departure");
  let return_elem = $(calendar_target).attr("date-return");
  let oneway_elem = $(calendar_target).attr("date-oneway");
  let origin_iata = $(calendar_target).attr("origin-iata");
  let destination_iata = $(calendar_target).attr("destination-iata");

  let tripMode = $(oneway_elem + " option:selected").attr("id");

  let finalDeparture = selectedDate.departureDate || "";
  let finalReturn = selectedDate.returnDate || "";

  // Actualizar atributos en el custom element
  $(calendar_target).attr("departure-date", finalDeparture);
  $(calendar_target).attr("return-date", finalReturn);
  $(calendar_target).attr("selectedPrice", selectedPrice);
  $(calendar_target).attr("currencyCode", currencyCode);

  // Sincronización si existe un segundo calendario en el DOM
  let calendar_sync = $(calendar_target).attr("calendar-identifier");
  if (calendar_sync != undefined && calendar_sync != null) {
    $(calendar_sync).off("calendarDateChange");

    $(calendar_sync).attr("departure-date", finalDeparture);
    $(calendar_sync).attr("return-date", finalReturn);
    $(calendar_sync).attr("selectedPrice", selectedPrice);
    $(calendar_sync).attr("currencyCode", currencyCode);

    $(calendar_sync).on('calendarDateChange', calendarDateChange);
  }

  // Asignar los valores a los inputs de WCS
  $(departure_elem).val(finalDeparture);
  $(return_elem).val(finalReturn);

  // Clases CSS visuales de los inputs
  if (finalDeparture) {
    $(departure_elem).closest(".ibe_form__group-half.fc_form_group").addClass("ibe_form__group--content");
  } else {
    $(departure_elem).closest(".ibe_form__group-half.fc_form_group").removeClass("ibe_form__group--content");
  }

  if (finalReturn) {
    $(return_elem).closest(".ibe_form__group-half.fc_form_group").addClass("ibe_form__group--content");
  } else {
    $(return_elem).closest(".ibe_form__group-half.fc_form_group").removeClass("ibe_form__group--content");
  }

  let isMobile = window.innerWidth < 1024;

  // REGLA DE CIERRE ESTRICTA
  if (!isMobile) {
    if (tripMode === "oneway" && finalDeparture) {
      $(calendar_target).closest(".ibe-searcher__calendar-react").removeClass("show");
    } else if (tripMode === "return" && finalDeparture && finalReturn) {
      $(calendar_target).closest(".ibe-searcher__calendar-react").removeClass("show");
    } else {
      $(calendar_target).closest(".ibe-searcher__calendar-react").addClass("show");
    }
  }

  dFrontJs.ibe_validations_searcher.dateValidator($(departure_elem).parents('.ibe_form__group.ibe_form__group--half'));
  changePetToggle(finalDeparture);

  if ($(calendar_target).closest(".ibe-searcher__calendar-react--mobile").length == 0 && !isMobile) {
    changeDigitalData(origin_iata, destination_iata, oneway_elem, selectedDate, selectedPrice, currencyCode, "seleccion");
  }
}

//Checks the departure date, and if it's less than 48hrs compared to the current date, 
// disables the pet toggle and shows a message to the customer
function changePetToggle(date){
  if(date != undefined && date != "") {
    date = date.split("/");
    let departure_date = "";
    //Declares the variables
    if((localeg == 'en'&& marketg == 'US') || (localeg == 'es' && marketg == 'US') ){
      departure_date = new Date(date[2], date[0]-1, date[1]);
    } else {
      departure_date = new Date(date[2], date[1]-1, date[0]);
    }
    departure_date.setHours(0,0,0,0);
    
    let current_date = new Date();
    current_date.setHours(0,0,0,0);
    let day_as_milliseconds = 86400000;
    //Compares the current date to the departure date to know how many days of diffenrece there are between the dates
    let difference_mili = departure_date - current_date;
    //More than 2 days
    if(difference_mili >= day_as_milliseconds*2) {
      $("#flyWithPets").removeAttr("disabled");
      $(".ibe-searcher-switch").removeClass("hidden");
      $(".ibe-people-counter__people-subtitle--enabled").removeClass("hidden");
      $(".ibe-people-counter__people-subtitle--disabled").addClass("hidden");
    } else {
      $("#flyWithPets").attr("disabled", "disabled");
      $(".ibe-searcher-switch").addClass("hidden");
      $(".ibe-people-counter__people-subtitle--enabled").addClass("hidden");
      $(".ibe-people-counter__people-subtitle--disabled").removeClass("hidden");
    }
  }
}

const captureKeysDateInputs = (departure_elem, return_elem, oneway_elem, elem) => {
  const $calendarWrapper = $(elem).closest(".ibe-searcher__calendar-react");
  const $dateInputs = $(departure_elem + "," + return_elem);

  // CIERRE POR FOCO EN OTROS CAMPOS DE LA PAGINA (Origen, Destino, Pasajeros, etc.)
  $(document).off("focusin.calendarClose").on("focusin.calendarFocus", "input, select, button, a", function (e) {
    let isMobile = window.innerWidth < 1024;
    if (isMobile) return;

    let $target = $(e.target);
    let isDateInput = $target.is($dateInputs);
    let isInsideCalendar = $target.closest(".ibe-searcher__calendar-react").length > 0;

    if (!isDateInput && !isInsideCalendar) {
      $calendarWrapper.removeClass("show");
    }
  });

  // CONTROL TECLADO EN LOS INPUTS DE FECHA
  if($(elem).attr("id").indexOf("desktop") != -1){
    $dateInputs.off("keydown").on("keydown", function (e) {
      let isMobile = window.innerWidth < 1024;
      let $input = $(this);
      let isDepartureInput = $input.is(departure_elem);
      let isReturnInput = $input.is(return_elem);

      if (!isMobile) {
        switch (e.keyCode) {
          case 27: // ESCAPE
            if($calendarWrapper.hasClass("show")) {
              $calendarWrapper.removeClass("show");
            }
          break;
          case 9: // TAB
            if (e.shiftKey) {
              if (isDepartureInput) {
                $calendarWrapper.removeClass("show");
              } else if (isReturnInput) {
                $calendarWrapper.addClass("show");
              }
              return;
            }

            $input.closest(".ibe_form__group-half.fc_form_group").addClass("ibe_form__group--content");

            if ($(departure_elem).val()) $(elem).attr("departure-date", $(departure_elem).val());
            if ($(return_elem).val()) $(elem).attr("return-date", $(return_elem).val());

            dFrontJs.ibe_validations_searcher.dateValidator($input.parents('.ibe_form__group.ibe_form__group--half'));
            $calendarWrapper.addClass("show");
          break;
          case 13: // ENTER
            e.preventDefault();
            $input.closest(".ibe_form__group-half.fc_form_group").addClass("ibe_form__group--content");
            ($(departure_elem).val())?$(elem).attr("departure-date", $(departure_elem).val()):"";
            ($(return_elem).val())?$(elem).attr("return-date", $(return_elem).val()):"";
            dFrontJs.ibe_validations_searcher.dateValidator($input.parents('.ibe_form__group.ibe_form__group--half'));

            let tripMode = $(oneway_elem + " option:selected").attr("id");

            if (tripMode === "oneway" && $(departure_elem).val()) {
              $calendarWrapper.removeClass("show");
            } else if (tripMode === "return" && isReturnInput && $(departure_elem).val() && $(return_elem).val()) {
              $calendarWrapper.removeClass("show");
            } else if (tripMode === "return" && isDepartureInput) {
              $calendarWrapper.addClass("show");
            }
          break;
          default:
            const permitidas = [
              8,   // Backspace
              46,  // Delete
              37,  // Flecha izquierda
              39   // Flecha derecha
            ];
            if(e.key.match(/^[0-9/]+$/) || permitidas.includes(e.keyCode)){
              dFrontJs.ibe_validations_searcher.dateValidator($input.parents('.ibe_form__group.ibe_form__group--half'));
            } else {
              return false;
            }
        }
      }
    });
  }
}

const changeOriginDestCalendar = (origin_city, destination_city, elem) => {
  //WHEN ORIGIN OR DESTINATION CHANGES, GET THE CITY IATA AND PUT IT INTO THE CALENDAR
  $(origin_city).on("focusout", function(){
      let city = $(this).val();
      let index_substr = city.indexOf("(");
      city = city.substring(index_substr+1, city.length-1);
      $(elem).attr("origin-iata", city);
  });

  $(destination_city).on("focusout", function(){
      let city = $(this).val();
      let index_substr = city.indexOf("(");
      city = city.substring(index_substr+1, city.length-1);
      $(elem).attr("destination-iata", city);
  });
}

const resetCalendarSelection = (date_reset, departure_elem, return_elem, elem) => {
  $(date_reset).on("click", function(e){
    e.preventDefault();
    //RESET VALUES IN INPUTS
    $(departure_elem).val("");
    $(return_elem).val("");
    //DEFAULT STYLE FOR INPUTS (EMPTY)
    $(departure_elem).closest(".ibe_form__group-half.fc_form_group").removeClass("ibe_form__group--content");
    $(return_elem).closest(".ibe_form__group-half.fc_form_group").removeClass("ibe_form__group--content");
   
    //REMOVED DATA ATTR FROM CALENDAR
    let syncCalendar = $(elem).attr("calendar-identifier");
    $(elem).removeAttr("departure-date");
    $(elem).removeAttr("return-date");
    $(syncCalendar).removeAttr("departure-date");
    $(syncCalendar).removeAttr("return-date");

    //CALENDAR RESET SELECTION
    $(elem)[0].resetSelectedDate();
    $(syncCalendar)[0].resetSelectedDate();
  });
}

//SET DEFAULT VALUES IN SESSION TO CALENDARS
const setSessionDates = (departure_elem, return_elem, elem) => {
    let fechaIda = $(departure_elem).val();
    let fechaVuelta = $(return_elem).val();
    if(fechaIda != undefined && fechaIda != ""){
      let calendar_sync = $(elem).attr("calendar-identifier");
      $(elem).attr("departure-date", fechaIda);
      $(calendar_sync).attr("departure-date", fechaIda);

      if(fechaVuelta != undefined && fechaVuelta != ""){
        $(elem).attr("return-date", fechaVuelta);
        $(calendar_sync).attr("return-date", fechaVuelta);
      }
    }
}

const showHideCalendar = (departure_elem, return_elem, date_reset, elem, origin_city, destination_city, oneway_elem) => {
  //SHOW IF DESKTOP OR SHOW MODAL WHEN MOBILE
  let isMobile = window.innerWidth < 1024;
  let calendarContainer = $(elem).closest(".ibe-searcher__calendar-react");

  //SHOW/HIDE CALENDAR CONTAINER DEPENDING ON IF IT IS ALREADY OPENED WHEN CLICK ON INPUT
  $(departure_elem+","+return_elem).on("mousedown", function(){
    isMobile = window.innerWidth < 1024;
    if(!isMobile){
      if($(elem).attr("id").indexOf("desktop") != -1){
        isCalendarPrevOpened = (calendarContainer.hasClass("show"))?true:false;
        (calendarContainer.hasClass("show"))?calendarContainer.removeClass("show"):calendarContainer.addClass("show");
      }
    }
  });

  $(departure_elem+","+return_elem).on("focusin", function(){
    //WHEN CALENDAR SHOWS UP IT GETS THE ORIGIN/DESTINATION CITY TO SET THE PRICE AND THE TRIP (ONE WAY/ROUND) TO CHANGE CALENDAR MODE (RANGE, SINGLE)
    $(origin_city).trigger("focusout");
    $(destination_city).trigger("focusout");
    checkOneWaySelection(oneway_elem, elem);
    setSessionDates(departure_elem, return_elem, elem);

    isMobile = window.innerWidth < 1024;
    if(!isMobile){
      isCalendarPrevOpened = (calendarContainer.hasClass("show"))?true:false;
      calendarContainer.addClass("show");
    } else {
      let modal = $(elem).attr('modal-identifier');
      if(modal != undefined && modal != null){
        if($(modal).parent().hasClass("ui-dialog ui-corner-all")){
          $(modal).parent().css("display", "block");
          $(modal).css("display", "block");
          $("body").addClass("modal-open");
          $(modal).find(".ibe_form__group-half.icon-caret_derecha").removeClass("icon-caret_derecha");

          $(modal).find(".ibe-modal__options-icon--close").off("click");
          $(modal).find(".ibe-modal__options-icon--close").on("click", function(){
            $(modal).parent().css("display", "none");
            $("body").removeClass("modal-open");
          });

          let calendar = $(modal).find(".ibe-searcher__calendar-react price-calendar");
          let origin_iata = $(calendar).attr("origin-iata");
          let destination_iata = $(calendar).attr("destination-iata");
          $(modal).find(".ibe-button--red.ibe-button--modal").off("click");
          $(modal).find(".ibe-button--red.ibe-button--modal").on("click", function(){
            let selectedDate = {departureDate: calendar.attr("departure-date"), returnDate: calendar.attr("return-date")}; 
            let selectedPrice = calendar.attr("selectedPrice");
            let currencyCode = calendar.attr("currencyCode");
            changeDigitalData(origin_iata, destination_iata, oneway_elem, selectedDate, selectedPrice, currencyCode, "seleccion");
            $(modal).parent().css("display", "none");
            $("body").removeClass("modal-open");
          });
        } else 
          $(modal).dialog().dialog("open");
      }
    }
  });
  //HIDE IF CLICK OUTSIDE THE CALENDAR OR INPUTS
  const hideDesktopCalendar = function(e) {
      isMobile = window.innerWidth < 1024;
      let target = e.target;
      if(!isMobile){
        let isCalendarContainer = $(target).closest(".ibe-searcher__calendar-react").length;
        if (isCalendarContainer == 0 && (target.id == "" || departure_elem.indexOf(target.id) == -1) && (target.id == "" || return_elem.indexOf(target.id) == -1)) {
            $(elem).closest(".ibe-searcher__calendar-react").removeClass("show");
        }
      }
  }
  
  document.body.removeEventListener("click", hideDesktopCalendar);
  document.body.addEventListener("click", hideDesktopCalendar);
}

const checkOneWaySelection = (oneway_elem, elem) => {
  let oneway_round_option = $(oneway_elem+" option:selected").attr("id");
  let synCalendar = $(elem).attr("calendar-identifier");
  let returnDatesInput = $(elem).attr("date-return");

  if(oneway_round_option == "return"){
    $(elem).attr("range-mode", "range");
    $(synCalendar).attr("range-mode", "range");
    //SHOW RETURN DATE INPUT (MOBILE)
    $(returnDatesInput).closest(".ibe_form__group-half--mobile").removeClass("hidden");

  } else if(oneway_round_option == "oneway") {
    $(elem).attr("range-mode", "single");
    $(synCalendar).attr("range-mode", "single");
    //HIDE RETURN DATE INPUT (MOBILE)
    $(returnDatesInput).closest(".ibe_form__group-half--mobile").addClass("hidden");
  }
}

const init = () => { // Function Initialization
  if(localemasterg!=""){
    localeg = localemasterg;
  }
  //checkbox enter
  enableCheckboxActivationWithEnter();
  calendarReactInit();
  if ($('[data-journey="parent"]').length > 0) {
    changeNumJourneys();
    dFrontJs.ibe_journey.init();
  }

  //Calendar React
  configCalendarReact();

  if ($("body[data-landing-template=T3-Landing]").length > 0 || $('body[data-landing-template=T2-Destination]').length > 0 || $('body[data-landing-template=T2-Origin]').length > 0) {
    const iataO = $('[data-iata-origin]').data('iata-origin');
    const cityO = $('[data-city-origin]').data('city-origin');
    const iataD = $('[data-iata-destination]').data('iata-destination');
    const cityD = $('[data-city-destination]').data('city-destination');

    let jsonLastSearch = null;
    if (existLastSearches()) {
      jsonLastSearch = getSpecificSearch(0);
      if(iataO!==undefined){
        jsonLastSearch.nombreOrigen = cityO;
        jsonLastSearch.iataOrigen = iataO;
      }else{
        //Estamos en T2-destino
        if(iataD!==undefined && jsonLastSearch.iataOrigen == iataD){
          jsonLastSearch.iataOrigen = '';
          jsonLastSearch.nombreOrigen = '';
        }
      }
      if(iataD!==undefined){
        jsonLastSearch.nombreDestino = cityD;
        jsonLastSearch.iataDestino = iataD;
      }else{
        //Estamos en T2-origen
        if(iataO!==undefined && jsonLastSearch.iataDestino == iataO){
          jsonLastSearch.iataDestino = '';
          jsonLastSearch.nombreDestino = '';
        }
      }
      
      
      jsonLastSearch.expirationTimestamp = new Date().setTime(new Date().getTime() + 90 * 86400000);
      updateLastSearches(jsonLastSearch);
    } else {
      // Creamos la fecha de hoy
      const today = new Date();
      const day = `${(today.getDate())}`.padStart(2, '0');
      const currentMonth = `${(today.getMonth()) + 1}`.padStart(2, '0');
      const year = today.getFullYear();
      // Lo creamos en el localstorage
      const lastSearch = {
        iataOrigen: iataO,
        iataDestino: iataD,
        nombreDestino: cityD,
        nombreOrigen: cityO,
        fechaIda: { day: day.toString(), month: currentMonth.toString(), year: year.toString() },
        fechaVuelta: { day: '', month: '', year: '' },
        adultos: 1,
        niños: 0,
        senior: 0,
        joven: 0,
        bebes: 0,
        tarifa: 'R',
      };
      updateLastSearches(lastSearch);
    }
    if (Cookies.get('IBERIACOM_LAST_SEARCH') !== undefined && Cookies.get('IBERIACOM_LAST_SEARCH') !== null) {
      const cookieLastSearch = Cookies.get('IBERIACOM_LAST_SEARCH').split('|');
      if (cookieLastSearch.length > 0) {
        if(iataO!==undefined){
          cookieLastSearch[0] = iataO;
        }else{
          //Estamos en T2-destino
          if(iataD!==undefined && cookieLastSearch[0]== iataD){
            cookieLastSearch[0] ='';
          }
        }
        if(iataD!==undefined){
          cookieLastSearch[1] = iataD;
        }else{
          //Estamos en T2-origen
          if(iataO!==undefined && cookieLastSearch[1]== iataO){
            cookieLastSearch[1] ='';
          }
        }
        let nuevaCookie = '';
        for (let i = 0; i <= cookieLastSearch.length - 1; i++) {
          if (i === cookieLastSearch.length - 1) {
            nuevaCookie += cookieLastSearch[i];
          } else {
            nuevaCookie += `${cookieLastSearch[i]}|`;
          }
        }
        if (nuevaCookie !== '') {
          Cookies.set('IBERIACOM_LAST_SEARCH', nuevaCookie, { path: '/', expires: 365, sameSite: 'strict' });
        }
      }
    } else {
      // Creamos la cookie
      // eslint-disable-next-line camelcase
      const nueva_Cookie = `${iataO}|${iataD}|`;
      Cookies.set('IBERIACOM_LAST_SEARCH', nueva_Cookie, { path: '/', expires: 365, sameSite: 'strict' });
    }
  }
  const isLastSearchTab = $('.inte-tab-lastSearches').length > 0;
  if (isLastSearchTab) {
    getCitiesOrgDest('V-D')
      .then((arrOriDest) => {
        if (arrOriDest) {
          origin3tabsJSON = arrOriDest['V-O'] ? arrOriDest['V-O'] : origin3tabsJSON;
          destinationVJSON = arrOriDest['V-D'] ? arrOriDest['V-D'] : destinationVJSON;
          lastSearchFunctionality();
        }
      }).catch((error) => {
        console.log(error);
        console.error('Error loading Origin and destination');
      });
  } else {
    checkifcitiesneeded(origin3tabsJSON, destinationVJSON, destinationHJSON,
      destinationCJSON, originRJSON, destinationRJSON)
      .then((arrOriDest) => {
        if (arrOriDest) {
          origin3tabsJSON = arrOriDest.origin3tabsJSONAux ? arrOriDest.origin3tabsJSONAux : origin3tabsJSON;
          destinationVJSON = arrOriDest.destinationVJSONAux ? arrOriDest.destinationVJSONAux : destinationVJSON;
          destinationHJSON = arrOriDest.destinationHJSONAux ? arrOriDest.destinationHJSONAux : destinationHJSON;
          destinationCJSON = arrOriDest.destinationCJSONAux ? arrOriDest.destinationCJSONAux : destinationCJSON;
          originRJSON = arrOriDest.originRJSONAux ? arrOriDest.originRJSONAux : originRJSON;
          destinationRJSON = arrOriDest.destinationRJSONAux ? arrOriDest.destinationRJSONAux : destinationRJSON;
          lastSearchFunctionality();
          if ($searchCont.attr('data-url-quadrigam') === 'IBOFDT') {
            dFrontJs.ibe_datatable.loadJson(origin3tabsJSON, destinationVJSON, '#tab-flights');
            dFrontJs.ibe_modals_vintage.reloadOriDesModal();
          }
        }
        tabflights();
        initSwitchOD();
        submitVH();
        submitVC();
        submitMT();
        submitPA();
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        console.error('Error loading Origin and destination');
        tabflights();
        initSwitchOD();
        submitVH();
        submitVC();
        submitMT();
        submitPA();
      });
  }
  if ($("body[data-landing-template=T3-Landing]").length > 0 || $('body[data-landing-template=T2-Destination]').length > 0 || $('body[data-landing-template=T2-Origin]').length > 0) {
    updateOriginDestiny('#flight_origin1', '#flight_destiny1');
    updateOriginDestiny('#flight_origin2', '#flight_destiny2');
    updateOriginDestiny('#flight_origin3', '#flight_destiny3');
  }
  $(".search-tab, [data-function='data-focus-text']").on('click', loadseektab);
  $('[data-tab-searcher]').on('tabsactivate', loadseektab);
  $(".search-tab, [data-function='data-focus-text']").on('click', function clk() {
    const $this = $(this);
    const id = $this.attr('href');
    if (id === '#tab-3') {
      $('.inte-cardWhite').removeClass('hidden');
    } else {
      $('.inte-cardWhite').addClass('hidden');
    }
  });

};

if ($('[data-inte-stop-over]').length > 0) {
  dInteStopOver();
} else {
  init();
}
export {
  init,
  getCityListInformation,
  dInteStopOver,
};
