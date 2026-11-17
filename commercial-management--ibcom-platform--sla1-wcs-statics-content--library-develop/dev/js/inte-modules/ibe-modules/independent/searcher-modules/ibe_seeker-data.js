import {
  passengersByRoute, residentajax, airShuttle, updateODCombinations,
} from './ibe_tab-flight';
import { getQuerystrParams, initDateFormated } from '../../general/ibe_inte-util';
import getCityListInformation from './ibe_get-city-list-info';
import retrieveGlobalVariables from '../../general/ibe_variables';
import { getSpecificSearch, getLastSearchMT } from './ibe_last-searches-storage';

const { marketg } = retrieveGlobalVariables();
const $searchCont = $('#SearcherContent');
let storedLastSearch;
let fareEquivalenciesData;

// Preselect city in searcher depending on market.
function preSelectCity(origin3tabsJSON, destinationVJSON, destinationHJSON,
  destinationCJSON, originRJSON, destinationRJSON) {
  const iata = $searchCont.data('iata-maincity');
  const destIata = $searchCont.data('iata-destcity');
  let citiesDesJSON; let citiesOriJSON = origin3tabsJSON;
  if (destinationVJSON) {
    citiesDesJSON = destinationVJSON;
  } else if (destinationHJSON) {
    citiesDesJSON = destinationHJSON;
  } else if (destinationCJSON) {
    citiesDesJSON = destinationCJSON;
  } else if (destinationRJSON) {
    citiesOriJSON = originRJSON;
    citiesDesJSON = destinationRJSON;
  }
  const objorigin = citiesOriJSON && iata ? getCityListInformation(citiesOriJSON, iata) : undefined;
  const objdestination = citiesDesJSON && destIata ? getCityListInformation(citiesDesJSON, destIata) : undefined;
  const prevalueo = objorigin ? `${objorigin.description} (${objorigin.code})` : undefined;
  const prevalueD = objdestination ? `${objdestination.description} (${objdestination.code})` : undefined;

  if (prevalueo !== undefined) {
    $('#flight_origin1,#flight_origin2,#flight_origin3,#flight_origin6,#flight_origin-mt1')
      .each(function loop() {
        if ($(this).val() === undefined || $(this).val().length === 0) {
          $(this).val(prevalueo);
        }
      });
    $('#flight_origin1,#flight_origin2,#flight_origin3,#flight_origin6,#flight_origin-mt1').parent().addClass('ibe_form__group--content');
  }
  if (prevalueD !== undefined) {
    $('#flight_destiny1,#flight_destiny2,#flight_destiny3,#flight_destiny-mt1')
      .each(function loop() {
        if ($(this).val() === undefined || $(this).val().length === 0) {
          $(this).val(prevalueo);
        }
      });
    $('#flight_destiny1,#flight_destiny2,#flight_destiny3,#flight_destiny-mt1').parent().addClass('ibe_form__group--content');
  }
}

const faresEquivalencies = () =>{
  return new Promise((resolve, reject) => {
    if (fareEquivalenciesData) {
      resolve(fareEquivalenciesData);
    } else {
      $.ajax({
        encoding: 'UTF-8',
        method: 'GET',
        url: '/cs/Satellite',
        data: {
          pagename: 'IB_SE/CacheControl6h/BrowserCache3600/Seeker/FareEquivalencies',
          d: '',
        },
      }).then((data) => {
        if (typeof data === 'object') {
          fareEquivalenciesData = data;
          resolve(data);
        } else {
          reject(data);
        }
      })
        .catch(() => { reject(); });
    }
  });
};

// SEEKER PRECOMPLETE
function seekerData(origin3tabsJSON, destinationVJSON, destinationHJSON, destinationCJSON,
  originRJSON, destinationRJSON, originSOJSON, destinationSOJSON, searchdata, selector) {
  let lastSearch = getSpecificSearch(0);
  if (typeof (searchdata) === 'object') {
    lastSearch = searchdata;
    storedLastSearch = searchdata;
  } else if (searchdata === undefined && storedLastSearch !== undefined) {
    lastSearch = storedLastSearch;
  }
  window.requestAnimationFrame(() => {
    const isOFDT = $searchCont.data('url-quadrigam') === 'IBOFDT';
    const isStopOver = $searchCont.data('url-quadrigam') === 'HMADVS';
    let $tabAffecting;
    const paramsSeeker = getQuerystrParams();
    let precompUrlParams = false;
    let isAirShuttle = false;
    // The class is searched for the correct tab, so it will not enter more than necessary
    function passengersComplete(adult, senior, young, children, babies, childrenAge) {
      const passengers = $tabAffecting.find('.ibe_passenger-auto');
      if (passengers.length > 0 && (adult || senior || young || children)) {
        let resetAdult = false;
        let adultAux = adult;
        const idButtonsTab = !isAirShuttle ? [`#${passengers.attr('id')}`] : [`#${passengers.attr('id')}`, `#${passengers.attr('id')}1`];
        const thereAreSenior = $tabAffecting.find('.senior').length > 0 && !$('.senior').hasClass('hidden');
        const thereAreTeenager = $tabAffecting.find('.teenager').length > 0 && !$('.teenager').hasClass('hidden');
        const thereAreYoung = $tabAffecting.find('.young').length > 0 && !$('.young').hasClass('hidden');
        const isRedemption = $tabAffecting.find('.isRedemption').length > 0;
        // El flujo de menores viajando solos (UMNR) solo aplica en la pestaña Vuelo (#tab-searcher-1
        // en desktop, #m-tab-searcher-1 en mobile: el buscador mueve el markup entre ambos wrappers
        // responsive, ver moveContentResponsive en ibe-searcher-accordion-mobile.js)
        // y si la property de WCS modal.unmrs.wcs.enabled lo tiene activado;
        // no debe afectar a otras pestañas del buscador como Vuelo+Coche (#tab-searcher-3)
        const minorsAloneFlowEnabled = $tabAffecting.closest('#tab-searcher-1, #m-tab-searcher-1').length > 0 && typeof unmrModalEnabled !== 'undefined' && unmrModalEnabled === "true";
        dFrontJs.ibe_searcher_people_counter.init();
        // Adults sum for V+C
        if (!thereAreSenior && +senior > 0) {
          adultAux = +adultAux + +senior;
        }
        if (!thereAreYoung && !thereAreTeenager && +young > 0) {
          adultAux = +adultAux + +young;
        }
        idButtonsTab.forEach((idButtonTab) => {
          // updateResultsAdult solo reconstruye el texto resumen la primera vez que se llama
          // sobre un elemento (guard interno fc-updateAdult-loaded); al restaurar la última
          // búsqueda hay que forzarlo a recalcular quitando esa clase antes.
          $(idButtonTab).removeClass('fc-updateAdult-loaded');
          if (adultAux > 0) {
            dFrontJs.ibe_searcher_people_counter.updateResultsAdult(idButtonTab, adultAux);
          } else if (minorsAloneFlowEnabled && +children > 0) {
            // Menores viajando solos (0 adultos): forzamos el contador de adultos a 0 antes de
            // pintar los niños, para que el texto no arrastre el valor de adultos precargado en el HTML.
            dFrontJs.ibe_searcher_people_counter.updateResultsAdult(idButtonTab, 0);
          }
          if (children > 0) {
            dFrontJs.ibe_searcher_people_counter
              .updateResultsChildren(idButtonTab, children, childrenAge);
          }
          if (babies > 0 && !isRedemption) {
            dFrontJs.ibe_searcher_people_counter.updateResultsBabies(idButtonTab, babies);
          }
          if (thereAreSenior && senior > 0) {
            dFrontJs.ibe_searcher_people_counter.updateResultsSenior(idButtonTab, senior);
            resetAdult = true;
          }
          if (thereAreYoung && young > 0) {
            dFrontJs.ibe_searcher_people_counter.updateResultsYoung(idButtonTab, young);
            resetAdult = true;
          }
          if (thereAreTeenager && young > 0) {
            resetAdult = true;
            dFrontJs.ibe_searcher_people_counter.updateResultsTeenager(idButtonTab, young);
          }
          if (+adultAux === 0 && resetAdult) {
            $(idButtonTab).removeClass('fc-updateAdult-loaded');
            dFrontJs.ibe_searcher_people_counter.updateResultsAdult(idButtonTab, 0);
          }
        });
      }
    }
    // Fucntion to autocomplete destination by data-iata-dest and (optional) data-code-bah data attrs
        function preDestinationByDataAttr() {
            const selcstringD = "[id*='flight_destiny']:not([id*='flight_destiny-mt']), #flight_destiny-mt1";
            const code = $tabAffecting.find('[data-search-place]').attr('data-search-place');
            const iataBAHLand = $('body[data-iata-dest]').data('iata-dest');
            const codeBAHLand = $('body[data-bah-dest]').data('bah-dest');
            if (iataBAHLand) {
                let citiesDesJSON;
                if (code.indexOf('R') > -1) {
                    citiesDesJSON = destinationRJSON;
                } else if (code.indexOf('V') > -1 || code.indexOf('M') > -1) {
                    citiesDesJSON = destinationVJSON;
                } else if (code.indexOf('H') > -1) {
                    citiesDesJSON = destinationHJSON;
                } else if (code.indexOf('C') > -1) {
                    citiesDesJSON = destinationCJSON;
                }
                let objdestination = citiesDesJSON && iataBAHLand && codeBAHLand.length > 0 ? getCityListInformation(citiesDesJSON, iataBAHLand, codeBAHLand) : undefined;
                objdestination = !objdestination || codeBAHLand.length <= 0 ? getCityListInformation(citiesDesJSON, iataBAHLand) : objdestination;
                const prevalueD = objdestination ? `${objdestination.description} (${objdestination.code})` : undefined;
                if (prevalueD) {
                    const container = $('[data-fligths-collapse-mobile="collapse"]');
                    $tabAffecting.find(selcstringD).val(prevalueD);
                    $tabAffecting.find(selcstringD).parent().addClass('ibe_form__group--content');
                    container.slideDown('slow', () => {
                    });
                }
            }
        }
        
    if (isStopOver) {
      $tabAffecting = $("[data-url-quadrigam='HMADVS']");
    } else if (!selector) {
      $tabAffecting = $("[id*='tab-'] > form,[id*=m-tab-searcher]:has(input)");
    } else {
      $tabAffecting = $(selector);
    }

    if (!selector) {
      $tabAffecting = $tabAffecting.not('.inte-seekerdata-Done');
    }
    isAirShuttle = $tabAffecting.is('#tab-3 > form');

    if ((paramsSeeker.BEGIN_CITY_01 && paramsSeeker.BEGIN_CITY_01.length > 0)
      || (paramsSeeker.END_CITY_01 && paramsSeeker.END_CITY_01.length > 0)) {
      precompUrlParams = true;
    }
    // Remove tab from tabAffecting isrshuttle to not complete using cookies
    if (!(precompUrlParams && isAirShuttle)) {
      $tabAffecting.addClass('inte-seekerdata-Done');
      $tabAffecting = $tabAffecting.not('#tab-3 > form');
    }
    if ($tabAffecting.length > 0 && (!lastSearch || isOFDT) && !precompUrlParams && !isStopOver) {
      if (!isAirShuttle) {
        preSelectCity(origin3tabsJSON, destinationVJSON, destinationHJSON,
          destinationCJSON, originRJSON, destinationRJSON);
          preDestinationByDataAttr();
        if (marketg === 'ES' && ($tabAffecting.find('#largegeneral').length > 0 || $tabAffecting.find('#familia_numerosa_2').length > 0)) {
          // Init Some features
          residentajax(false, origin3tabsJSON, destinationVJSON, destinationHJSON,
            destinationCJSON, originRJSON, destinationRJSON);
          if ($('.ibe-search-flights').length > 0) {
            // Only in searcher home
            airShuttle();
          }
        }
      }
      // If $tabAffecting dont undefined and not ""
    } else if ($tabAffecting && $tabAffecting.length > 0) {
      const code = $tabAffecting.find('[data-search-place]').attr('data-search-place');
      let citiesOriJSON; let citiesDesJSON;
      if (isStopOver) {
        citiesOriJSON = originSOJSON;
        citiesDesJSON = destinationSOJSON;
      } else if (code) {
        if (code.indexOf('R') > -1) {
          citiesOriJSON = originRJSON;
          citiesDesJSON = destinationRJSON;
        } else {
          citiesOriJSON = origin3tabsJSON;
          if (code.indexOf('V') > -1 || code.indexOf('M') > -1) {
            citiesDesJSON = destinationVJSON;
          } else if (code.indexOf('H') > -1) {
            citiesDesJSON = destinationHJSON;
          } else if (code.indexOf('C') > -1) {
            citiesDesJSON = destinationCJSON;
          }
        }
      }
      const lastSearchMT = getLastSearchMT();
      // let cookieSeekerMT = Cookies.get('IBERIACOM_LAST_MULTIPLESEARCH');
      // eslint-disable-next-line no-nested-ternary
      const tabSelector = isStopOver ? `#${$tabAffecting.attr('id')}` : (`${$tabAffecting.attr('id')}`.startsWith('m-tab-searcher-')) ? `#${$tabAffecting.attr('id')}` : `#${$tabAffecting.parent().attr('id')}`;
      let originSeeker; let destinationSeeker;
      let dayB = ''; let monthB = ''; let yearB = ''; let dayE = ''; let monthE = ''; let yearE = ''; let flexibleSeeker = '';
      let senior = ''; let adult = ''; let young = ''; let children = ''; let childrenAge = ''; let babies = ''; let datafare = '';
      let datemj = ''; let dateReturn = ''; let dateBegin = '';
      let residentdis = ''; let familyDis = ''; let codeBAH = ''; let pagoAvios = ''; let pagoPuntos = '';
      const dtoday = new Date();
      const dBegin = new Date();
      let hasdoneMT = false;
      initDateFormated();
      const dateToday = new Date();
      const format = $("input[id*='flight_round_date']").attr('data-format');
      const currentday = dateToday.getDate();
      const currentmonth = dateToday.getMonth();
      const currentyear = dateToday.getFullYear();
      dtoday.setFullYear(currentyear, currentmonth, currentday);
      let triptype = '';

      // If is tab-2 (MultipleJourneys) and exist cookieMT
      if (tabSelector === '#tab-2' && lastSearchMT) {

        adult = lastSearchMT.adultos || 0;
        children = lastSearchMT.niños || 0;
        babies = lastSearchMT.bebes || 0;
        senior = 0;
        young = 0;
        //datafare = lastSearchMT.tarifa || '';
        const numJourneys = lastSearchMT.numJourneys || '';
        const combinations = lastSearchMT.combinations || '';
        let i = 1;
        let objOrigin; let objDestination;
        let prevalueO; let prevalueD; let selcstringO; let selcstringD;

        for (i = 0; i < numJourneys; i += 1) {
          // MultipleJourneys ORIGIN
          objOrigin = citiesOriJSON && combinations[i].iataOrigen ? getCityListInformation(citiesOriJSON, combinations[i].iataOrigen) : undefined;
          prevalueO = objOrigin ? `${objOrigin.description} (${objOrigin.code})` : undefined;
          selcstringO = $(`input[id*='flight_origin-mt${i + 1}']`);
          if (prevalueO) {
            $tabAffecting.find(selcstringO).val(prevalueO);
            $tabAffecting.find(selcstringO).parent().addClass('ibe_form__group--content');
          }
          // MultipleJourneys DESTINATION
          objDestination = citiesDesJSON && combinations[i].iataDestino ? getCityListInformation(citiesDesJSON, combinations[i].iataDestino) : undefined;
          prevalueD = objDestination ? `${objDestination.description} (${objDestination.code})` : undefined;
          selcstringD = $(`input[id*='flight_destiny-mt${i + 1}']`);

          if (prevalueD) {
            const container = $('[data-fligths-collapse-mobile="collapse"]');
            $tabAffecting.find(selcstringD).val(prevalueD);
            $tabAffecting.find(selcstringD).parent().addClass('ibe_form__group--content');
            container.slideDown('slow', () => {
            });
          }

          // MultipleJourneys DATES
          if (combinations[i].fechaIda.year !== undefined && combinations[i].fechaIda.month !== undefined
            && combinations[i].fechaIda.day !== undefined) {
            const inputFechaMT = $(`input[id*='flight_round_date4${i + 1}']`);
            dateBegin = inputFechaMT.attr('data-format').replace('DD', combinations[i].fechaIda.day).replace('MM',
              combinations[i].fechaIda.month).replace('YYYY', combinations[i].fechaIda.year);
            dBegin.setFullYear(combinations[i].fechaIda.year,
              combinations[i].fechaIda.month - 1, combinations[i].fechaIda.day);
            if (dtoday <= dBegin) { // check if cookie has before date that
              datemj = inputFechaMT.parent().parent();
              dFrontJs.ibe_searcher_calendar.updateCalendar(datemj, dateBegin);
            }
          }
        }
        hasdoneMT = true;
        // If is parameters in URL
      } else if (precompUrlParams) {
        originSeeker = paramsSeeker.BEGIN_CITY_01;
        destinationSeeker = paramsSeeker.END_CITY_01;
        if (paramsSeeker.BEGIN_DAY_01 && paramsSeeker.BEGIN_MONTH_01
          && paramsSeeker.BEGIN_YEAR_01) {
          dayB = paramsSeeker.BEGIN_DAY_01;
          monthB = paramsSeeker.BEGIN_MONTH_01.substring(4);
          yearB = paramsSeeker.BEGIN_YEAR_01;
        } else {
          dayB = '';
          monthB = '';
          yearB = '';
        }
        if (paramsSeeker.END_DAY_01 && paramsSeeker.END_MONTH_01 && paramsSeeker.END_YEAR_01) {
          dayE = paramsSeeker.END_DAY_01;
          monthE = paramsSeeker.END_MONTH_01.substring(4);
          yearE = paramsSeeker.END_YEAR_01;
        } else {
          dayE = '';
          monthE = '';
          yearE = '';
        }
        flexibleSeeker = paramsSeeker.flexible || '';
        adult = paramsSeeker.ADT || 0;
        children = paramsSeeker.CHD || 0;
        childrenAge = '';
        senior = paramsSeeker.YCD || 0;
        if (paramsSeeker.BNN && paramsSeeker.BNN > 0) {
          young = paramsSeeker.BNN;
        } else if (paramsSeeker.YTH && paramsSeeker.YTH > 0) {
          young = paramsSeeker.YTH;
        } else {
          young = 0;
        }
        babies = paramsSeeker.INF || 0;
        datafare = paramsSeeker.FARE_TYPE || '';
        triptype = paramsSeeker.TRIP_TYPE || '';
        pagoAvios = paramsSeeker.pagoAvios || '';
        residentdis = paramsSeeker.residentCode;
        if (residentdis === 'DC') {
          residentdis = 'RC';
        } else if (residentdis === 'BI') {
          residentdis = 'BP';
        } else {
          residentdis = residentdis|| '';
        }
        familyDis = paramsSeeker.familianumerosa;
        // If is V,V+H,V+C or MultipleJourneys and exist cookieSeeker
      } else {
        originSeeker = lastSearch.iataOrigen || '';
        destinationSeeker = lastSearch.iataDestino || '';
        dayB = lastSearch.fechaIda.day || '';
        monthB = lastSearch.fechaIda.month || '';
        yearB = lastSearch.fechaIda.year || '';
        dayE = lastSearch.fechaVuelta.day || '';
        monthE = lastSearch.fechaVuelta.month || '';
        yearE = lastSearch.fechaVuelta.year || '';
        flexibleSeeker = lastSearch.fechasFlexibles || '';
        adult = lastSearch.adultos || 0;
        children = lastSearch.niños || 0;
        childrenAge = lastSearch.ageArray || ''; 
        babies = lastSearch.bebes || 0;
        senior = lastSearch.senior || 0;
        young = lastSearch.joven || 0;
        //datafare = lastSearch.tarifa || '';
        // cases when it is inter-island
        if (lastSearch.residentes === 'DC') {
          residentdis = 'RC';
        } else if (lastSearch.residentes === 'BI') {
          residentdis = 'BP';
        } else {
          residentdis = lastSearch.residentes || '';
        }
        familyDis = lastSearch.familia || '';
        codeBAH = lastSearch.bah || '';
        pagoAvios = lastSearch.pagoAvios || '';
        pagoPuntos = lastSearch.pagoPuntos || '';
      }
      if (!hasdoneMT) {
        let objdestination;
        if (!isAirShuttle) {
          if (citiesOriJSON) {
            const objorigin = getCityListInformation(citiesOriJSON, originSeeker);
            const prevalueo = objorigin ? `${objorigin.description} (${objorigin.code})` : undefined;

            // ORIGIN
            const selcstringO = "[id*='flight_origin']:not([id*='flight_origin-mt']), #flight_origin-mt1";
            if (prevalueo) {
              $tabAffecting.find(selcstringO).val(prevalueo);
              $tabAffecting.find(selcstringO).parent().addClass('ibe_form__group--content');
            }
          }
          if (citiesDesJSON) {
            // DESTINATION
            const selcstringD = "[id*='flight_destiny']:not([id*='flight_destiny-mt']), #flight_destiny-mt1";
            let prevalueD;
            // Init codeBAH to a known value if it's not initialized
            codeBAH = codeBAH !== undefined ? codeBAH : '';
            if (codeBAH.length > 0) {
              objdestination = getCityListInformation(citiesDesJSON, destinationSeeker, codeBAH);
              prevalueD = objdestination ? `${objdestination.description} (${objdestination.code})` : undefined;
            }
            if (!prevalueD || codeBAH.length <= 0) {
              objdestination = getCityListInformation(citiesDesJSON, destinationSeeker);
              prevalueD = objdestination ? `${objdestination.description} (${objdestination.code})` : undefined;
            }
            if (prevalueD) {
              const container = $('[data-fligths-collapse-mobile="collapse"]');
              $tabAffecting.find(selcstringD).val(prevalueD);
              $tabAffecting.find(selcstringD).parent().addClass('ibe_form__group--content');
              container.slideDown('slow', () => {
              });
            } else {
              $tabAffecting.find(selcstringD).val('');
              $tabAffecting.find(selcstringD).parent().removeClass('ibe_form__group--content');
            }
            preDestinationByDataAttr();
          }
        } else if (originSeeker === 'BCN' && destinationSeeker === 'MAD') {
          $('.ibe-btn-changeorigin').trigger('click');
        }
        // DATES
        if (yearB.length > 0 && monthB.length > 0 && dayB.length > 0) {
          dBegin.setFullYear(yearB, monthB - 1, dayB);
          if (dtoday <= dBegin) { // check if cookie has before date that today
            dateBegin = $("input[id*='flight_round_date']").attr('data-format').replace('DD', dayB).replace('MM', monthB)
              .replace('YYYY', yearB);
            if (tabSelector !== '#tab-2') {
              const dReturn = new Date();
              const dateSelector = $tabAffecting.length > 1 ? `${tabSelector},#${$tabAffecting[1].id}` : tabSelector;
              dReturn.setFullYear(yearE, monthE - 1, dayE);
              if (dayB.length > 0 && monthB.length > 0 && yearB.length > 0 && $("input[id*='flight_return_date']") && dBegin <= dReturn) { // Check if the last search was Return
                dateReturn = $("input[id*='flight_return_date']").attr('data-format').replace('DD', dayE).replace('MM', monthE)
                  .replace('YYYY', yearE);
                dFrontJs.ibe_searcher_calendar.updateCalendar(dateSelector, dateBegin, dateReturn);
              } else {
                $('[data-cal="end"]', $tabAffecting).val('');
                $('[data-cal="end"]', $tabAffecting).removeClass('ibe_form__group--content');
                dFrontJs.ibe_searcher_calendar.updateCalendar(dateSelector, dateBegin);
              }
            } else {
              // Multiples journeys only complete the date of the first Route
              datemj = $('#flight_round_date41').parent().parent();
              dFrontJs.ibe_searcher_calendar.updateCalendar(datemj, dateBegin);
            }
          }
        }
      }

      // FLEXIBLES DATES
      flexibleSeeker = flexibleSeeker.toString();
      if (flexibleSeeker === 'false') {
        $tabAffecting.find("[id*='flexible']").prop('checked', false);
      }
      // The identifier is searched only once per tab. We only want it to be done once
      // if it were a normal selector it would be done every time the function is called
      if ($tabAffecting.find('#oneway').length > 0) {
        // IDAYVUELTA
        if (triptype === '1' || (dayE.length <= 0 && monthE.length <= 0 && yearE.length <= 0 && !precompUrlParams)) {
          if ($('option#oneway').length > 0) { // home
            $('#oneway').prop('selected', true);
            $('#oneway').closest('select').selectmenu('refresh');
          } else { // vuelos,vuelos+hotel,vuelo+coche
            $('#oneway').prop('checked', true);
          }
          dFrontJs.ibe_searcher_calendar.clickOneWay();
          if ($('article.ibe-infocheckin__box--overflow.no_paddingBottom').length) {
            const $grouppA = $('#oneway').closest('.ibe_form').find('.ibe_form__group.ibe_form__group--half .ibe_form__group-half');
            const $groupp = $grouppA.eq(1);
            $groupp.addClass('ibe_form__group-half-one-way').find('input').attr('disabled', 'disabled').val('');
            $groupp.find('a').attr('tabindex', '-1');
          } else {
            const $oneway = $("[data-function='oneway']").closest('.ibe-tab__container-desktop');
            $oneway.find("[data-cal='end']").parent().addClass('xui-return-date-hide');
            $oneway.find("[data-cal='start']").parent().addClass('xui-one-way').parent()
              .removeClass('icon-caret_derecha')
              .closest('.ibe_form__group--error')
              .find("[data-cal='start']")
              .trigger('change');
            $oneway.find("[data-cal='start']").closest('.ibe_form__group--half').addClass('ibe_form__group--half-only-round');
          }
        } else if (!precompUrlParams) {
          if ($('option#return').length > 0) { // home
            $('#return').prop('selected', true);
            $('#return').closest('select').selectmenu('refresh');
          } else { // vuelos,vuelos+hotel,vuelo+coche
            $('#return').prop('checked', true);
          }
          dFrontJs.ibe_searcher_calendar.clickOneWay();
          if ($('article.ibe-infocheckin__box--overflow.no_paddingBottom').length) {
            const $grouppA = $('#oneway').closest('.ibe_form').find('.ibe_form__group.ibe_form__group--half .ibe_form__group-half');
            const $groupp = $grouppA.eq(1);
            $groupp.removeClass('ibe_form__group-half-one-way').find('input').removeAttr('disabled');
            $groupp.find('a').attr('tabindex', '-1');
          } else {
            const $oneway = $("[data-function='oneway']").closest('.ibe-tab__container-desktop');
            $oneway.find("[data-cal='end']").parent().removeClass('xui-return-date-hide');
            $oneway.find("[data-cal='start']").parent().removeClass('xui-one-way').parent()
              .addClass('icon-caret_derecha')
              .closest('.ibe_form__group--error')
              .find("[data-cal='start']")
              .trigger('change');
            $oneway.find("[data-cal='start']").closest('.ibe_form__group--half').removeClass('ibe_form__group--half-only-round');
          }
        }
      } else if (isAirShuttle && triptype === '1') {
        requestAnimationFrame(() => {
          $('#onewayPA').trigger('click');
        });
      } else if (triptype === '1' && $('#round-trip').length > 0) {
        requestAnimationFrame(() => {
          $('input[data-click="oneway"]').trigger('click');
        });
      }
      // FARES
      // The identifier is searched only once per tab. We only want it to be done once
      // if it were a normal selector it would be done every time the function is called
      if (datafare.length > 0) {
        const tarifa = $tabAffecting.find('#tarifa1,#tarifa4,#tarifa2,#tarifa3,#tarifa5,#tarifa51');
        let optionFare = tarifa.find(`option[value=${datafare}]`);
        if (optionFare.length > 0) {
          optionFare.prop('selected', true);
          tarifa.selectmenu('refresh');
        } else {
          faresEquivalencies()
            .then((data) => {
              const dataKeys = Object.keys(data);
              let faresArray;
              let objectIt = dataKeys.length - 1;
              let fareType;
              let arrayIt = 0;
              while (optionFare.length <= 0 && objectIt >= 0) {
                faresArray = data[dataKeys[objectIt--]];
                while (faresArray.indexOf(datafare) >= 0
                  && optionFare.length <= 0
                  && arrayIt < faresArray.length) {
                  fareType = faresArray[arrayIt++];
                  optionFare = tarifa.find(`option[value=${fareType}]`);
                }
                arrayIt = 0;
              }
              if (optionFare.length > 0) {
                optionFare.prop('selected', true);
                tarifa.selectmenu('refresh');
              }
            }).catch();
        }
      }
      // PASSENGERS
      if ($tabAffecting.find('#flight_origin1').length > 0) {
        const seniorSel = $('[data-people-type="senior"]', $tabAffecting);
        const teenSel = $('[data-people-type="teenager"]', $tabAffecting);
        const youngSel = $('[data-people-type="young"]', $tabAffecting);
        //  Reset HTML value 
        $('[data-people-type="adult"]', $tabAffecting).html('1');
        seniorSel.html('0');
        seniorSel.parent().addClass('hidden');
        youngSel.html('0');
        youngSel.parent().addClass('hidden');
        teenSel.html('0');
        teenSel.parent().addClass('hidden');
        $('[data-people-type="children"]', $tabAffecting).html('0');
        $('[data-people-type="babies"]', $tabAffecting).html('0');
        passengersByRoute(true, { adult, senior, young }).always(() => {
          passengersComplete(adult, senior, young, children, babies, childrenAge);
        });
      } else if (!$tabAffecting.find('#searcher-rooms-1').length > 0) {
        $('[data-people-type="adult"]', $tabAffecting).html('1');
        $('[data-people-type="children"]', $tabAffecting).html('0');
        $('[data-people-type="babies"]', $tabAffecting).html('0');
        $('.ibe-people-counter__ages', $tabAffecting).hide();
        passengersComplete(adult, senior, young, children, babies, childrenAge);
      }
      // The identifier is searched only once per tab. We only want it to be done once
      // if it were a normal selector it would be done every time the function is called.
      if ($tabAffecting.find('#searcher-rooms-1').length > 0) {
        const rooms = lastSearch.rooms || 0;
        const roomsDesc = lastSearch.roomsDesc || '';
        let i;

        if (roomsDesc && (!seekerData.isRoomSet || selector !== undefined)) {
          seekerData.isRoomSet = true;
          dFrontJs.ibe_searcher_room.chargeSearcherRoomInit();
          dFrontJs.ibe_searcher_room.updateRooms('#searcher-rooms-1', rooms);
          for (i = 1; (i <= rooms) && (i <= roomsDesc.length); i += 1) {
            dFrontJs.ibe_searcher_room.updateChildren('#searcher-rooms-1', i, roomsDesc[i - 1].childAges.length);
            dFrontJs.ibe_searcher_room.updateAdults('#searcher-rooms-1', i, roomsDesc[i - 1].adults);
            dFrontJs.ibe_searcher_room.updateBabies('#searcher-rooms-1', i, roomsDesc[i - 1].babies);
            dFrontJs.ibe_searcher_room.updateAgesChildren('#searcher-rooms-1', i, roomsDesc[i - 1].childAges);
          }
        }
      }
      // DISCOUNTS
      // The identifier is searched only once per tab. We only want it to be done once
      // if it were a normal selector it would be done every time the function is called
      if (marketg === 'ES' && ($tabAffecting.find('#largegeneral').length > 0 || $tabAffecting.find('#familia_numerosa_2').length > 0)) {
        requestAnimationFrame(() => {
          if (typeof (familyDis) === 'string' && familyDis.length > 0) {
            // FAMILY
            const $inputfam = $(`input[value="${familyDis}"]`);
            const $noLargeFam = $('#nolarge');
            $('input[name=family]:checked').prop('checked', false);
            $noLargeFam.prop('checked', true);
            $('[data-passenger-family]').html($inputfam.siblings('label').html());
            $inputfam.prop('checked', true);

            // Advanced Seeker
            const $famnum2 = $('#familia_numerosa_2');
            $famnum2.find(`option[value='${familyDis}']`).attr('selected', true);
            $famnum2.siblings('label').addClass('ibe_form__selectize--label02');
            $famnum2.siblings('label').children().addClass('ibe_form__input-text--selectnew');
            $famnum2.selectmenu('refresh');
          } else {
            const $noLargeFam = $('#nolarge');
            $('input[name=family]:checked').prop('checked', false);
            $noLargeFam.prop('checked', true);
            $('[data-passenger-family]').html($noLargeFam.siblings('label').html());

            // Advanced Seeker
            const $famnum2 = $('#familia_numerosa_2');
            $famnum2.find(`option[value='${familyDis}']`).attr('selected', true);
            $famnum2.siblings('label').addClass('ibe_form__selectize--label02');
            $famnum2.siblings('label').children().addClass('ibe_form__input-text--selectnew');
            $famnum2.selectmenu('refresh');
          }



          if (typeof (residentdis) === 'string' && residentdis.length > 0) {
            // RESIDENTS
            // Adv Seeker
            const $residen = $('#residencia');
            $residen.val(residentdis);
            $residen.attr('data-cookiefill', true);
            $residen.siblings('label').addClass('ibe_form__selectize--label02');
            $residen.siblings('label').children().addClass('ibe_form__input-text--selectnew');
            // $residen.selectmenu("refresh");
            // Home
            const $noResident = $('#noresident');
            const $inputres = $(`input[value="${residentdis}"]`);
            $('input[name=resident]:checked').prop('checked', false);
            $noResident.prop('checked', true);
            $('[data-passenger-resident]').html($inputres.siblings('label').html());
            $inputres.prop('checked', true);
          } else {
            const $residen = $('#residencia');
            $residen.val('noresident');
            $residen.attr('data-cookiefill', true);
            $residen.siblings('label').addClass('ibe_form__selectize--label02');
            $residen.siblings('label').children().addClass('ibe_form__input-text--selectnew');
            // $residen.selectmenu("refresh");
            // Home
            const $noResident = $('#noresident');
            $('input[name=resident]:checked').prop('checked', false);
            $noResident.prop('checked', true);
            $('[data-passenger-resident]').html($noResident.siblings('label').html());
          }
          // IT has to init when cookie values are on place
          residentajax(true, origin3tabsJSON, destinationVJSON);
          if ($('.ibe-search-flights').length > 0) {
            // Only in searcher home
            airShuttle();
          }
        });
      }
      const pagoAviosCheck = $('#paywithAvios');
      pagoAvios = pagoAvios.toString();
      const prevStatus = pagoAviosCheck.is(':checked').toString();
      // CHECK PAY WITH AVIOS
      window.requestAnimationFrame(() => {
        if (pagoAvios === 'true' && pagoAviosCheck.length > 0 && !isAirShuttle) {
          window.requestAnimationFrame(() => {
            if (pagoAvios !== prevStatus) {
              pagoAviosCheck.trigger('click');
            } else {
              pagoAviosCheck.prop('checked', false);
              pagoAviosCheck.trigger('click');
            }
          });
          dFrontJs.ibe_searcher_people_counter.changeCheckAviosSearch({ target: '#paywithAvios' });
        } else if (pagoAvios !== 'true' && pagoAviosCheck.length > 0 && !isAirShuttle) {
          pagoAviosCheck.prop('checked', false);
          dFrontJs.ibe_searcher_people_counter.changeCheckAviosSearch({ target: '#paywithAvios' });
        } else if (pagoAvios === 'true' && isAirShuttle) {
          $('#paywithAviosC').trigger('click');
          $('#paywithAviosO').trigger('click');
        }
      });
      // CHECK PAY WITH POINTS
      if (pagoAvios !== 'true') {
        window.requestAnimationFrame(() => {
          const pagoPuntosCheck = $('#paywithPoints');
          pagoPuntos = pagoPuntos.toString();
          if (pagoPuntos === 'true' && pagoPuntosCheck.length > 0 && !isAirShuttle) {
            pagoPuntosCheck.prop('checked', true);
            dFrontJs.ibe_searcher_people_counter.changeCheckAviosSearch({ target: '#paywithPoints' });
          } else if (pagoPuntos !== 'true' && pagoPuntosCheck.length > 0 && !isAirShuttle) {
            pagoPuntosCheck.prop('checked', false);
            dFrontJs.ibe_searcher_people_counter.changeCheckAviosSearch({ target: '#paywithPoints' });
          } else if (pagoPuntos === 'true' && isAirShuttle) {
            $('#paywithPuntosC').trigger('click');
            $('#paywithPuntosO').trigger('click');
          }
        });
      }
    }
    //
    if (quadrigam !== 'CIPIBADVS' && quadrigam !== 'IBUPTS' && $tabAffecting.find('#flight_origin1,#flight_destiny1').length > 0) {
      updateODCombinations(origin3tabsJSON, destinationVJSON);
    }
    
    $(document).trigger('ib-seeker-data-completed');
    $tabAffecting.addClass('inte-seekerdata-Done');
  });
}
export default seekerData;
