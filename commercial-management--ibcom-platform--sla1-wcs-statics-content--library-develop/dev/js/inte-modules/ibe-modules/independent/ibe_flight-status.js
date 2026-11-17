import {
  initDateFormated, replaceAll, getDateByFormat, getQuerystrParams, getDatesDifference,
} from '../general/ibe_inte-util';
import flightStatusServices from '../manage/ibe_flight-status';
import retrieveGlobalVariables from '../general/ibe_variables';
import { updateDatalayer, updateDigitalData } from '../manage/ibe_common';

const { localeg, marketg } = retrieveGlobalVariables();

const flightStatusSeeker = () => {
  const active = $('#flightStatus-tabs').find('li.active > a').attr('href') || null;
  const linkTabNum = $('a[href="#tab-fs-number"]');
  const linkTabairport = $('a[href="#tab-fs-airport"]');
  const linkTabOrigDest = $('a[href="#tab-fs-route"]');
  const { flightStatusState } = window;

  // FlightStatus - Call airports Origin/Destination
  const loadAirports = () => {
    let airportList;
    const init = (general) => {
      if (airportList) {
        dFrontJs.ibe_autocomplete.init($('[data-autocomplete="airports"]', general), airportList);
      } else {
        let localeFS;
        if (localeg === 'ca') {
          localeFS = 'es';
        } else if (localeg === 'ru' || localeg === 'nl' || localeg === 'it') {
          localeFS = 'en';
        } else {
          localeFS = localeg;
        }
        $.ajax({
          method: 'GET',
          url: '/cs/Satellite',
          data: {
            pagename: 'IB_SE/CacheControl7d/BrowserCache3600/Seeker/AirportListRest',
            locale: localeFS,
            d: '',
          },
          success(data) {
            airportList = data;
            // $('.inte-airports',general).append(data);
            dFrontJs.ibe_autocomplete.init($('[data-autocomplete="airports"]', general), airportList);
          },
        });
      }
    };
    return { init };
  };

  function getStringDate(dateString, withDay, withoutYear) {
    let dateFormatted = '';

    if (typeof (dateString) === 'string' && dateString.length > 0) {
      const dateObject = getDateByFormat(dateString, 'YYYY-MM-DD');
      let dayString = $.datepicker.regional[localeg].dayNames[dateObject.getDay()];
      const monthString = $.datepicker.regional[localeg].monthNames[dateObject.getMonth()];
      const yearNumber = dateObject.getUTCFullYear();
      const dayNumber = dateObject.getDate();

      dayString = withDay ? `${dayString.charAt(0).toUpperCase() + dayString.slice(1)}, ` : '';

      if ($('[data-cal]').attr('data-format').substring(0, 2).toUpperCase() === 'DD') {
        dateFormatted = `${dayString + dayNumber} ${monthString}`;
      } else {
        dateFormatted = `${dayString + monthString} ${dayNumber}`;
      }

      if (withoutYear !== true) {
        dateFormatted = `${dateFormatted} ${yearNumber}`;
      }
    }

    return dateFormatted;
  }

  // Format a number into a two digit string
  function formatTwoDigits(n) {
    return n < 10 ? `0${n}` : n;
  }
  function flightDurationConversion(timeInMinutes) {
    const minutes = timeInMinutes % 60;
    const hours = (timeInMinutes - minutes) / 60;
    return `${hours}:${formatTwoDigits(minutes)}h`;
  }

  function flightTimeFormat(dateString) {
    let formattedDate = '';
    const dateObject = getDateByFormat(dateString, 'YYYY-MM-DD|hh:mm:ss.lll');
    let hours;
    let minutes;
    if (!Number.isNaN(Date.parse(dateString))) {
      hours = formatTwoDigits(dateObject.getHours());
      minutes = formatTwoDigits(dateObject.getMinutes());
      formattedDate = `${hours}:${minutes}`;
    }

    return formattedDate;
  }

  function getMilliseconds(date) {
    const dateObj = getDateByFormat(date, 'YYYY-MM-DD|hh:mm:ss.lll');
    const result = dateObj || new Date();
    return result.getTime();
  }
  
  const statusColorFS = () => {
    const table = $('#inte-dataState');
    const delayedGeneral = table.attr('data-inte-delayed') || '-';
    const onTimeLiteral = table.attr('data-inte-estimate') || '-';
    const realLiteral = table.attr('data-inte-real') || '-';
    const delayedLiteral = delayedGeneral.slice(0, 1) + delayedGeneral.slice(1).toLowerCase();
    const exec = (fsData) => {
      let resultMin; let respectiveStatus; let colorStatus; let icon;
      const stateArrival = `${onTimeLiteral}: ${flightTimeFormat(fsData.arrivalTime.estimate)}`;
      let stateDeparture = `${onTimeLiteral}: ${flightTimeFormat(fsData.departureTime.estimate)}`;
      respectiveStatus = flightStatusState[fsData.status].status;

      icon = flightStatusState[fsData.status].icon;
      colorStatus = 'grey';
      /**
      If the state is active, 2 cases must be taken into account:
      1. If (estimated time of arrival - scheduled time of arrival) < 15m - shows the status (On time)
      2. If (estimated time of arrival - scheduled time of arrival) > 15m - shows the status (Delayed)
      * */
      if (fsData.status === 'A') {
        const publishedATms = fsData.arrivalTime.published !== undefined ? getMilliseconds(fsData.arrivalTime.published) : '';
        const scheduledATms = fsData.arrivalTime.estimate !== undefined ? getMilliseconds(fsData.arrivalTime.estimate) : '';
        resultMin = scheduledATms - publishedATms;
        if (resultMin > (15 * 60 * 1000)) {
          respectiveStatus = flightStatusState[fsData.status].status1;
          colorStatus = 'brown';
          stateDeparture = `${delayedLiteral}: ${flightTimeFormat(fsData.departureTime.estimate)}`;
        } else {
          colorStatus = 'green';
          if (fsData.departureTime.confirmed !== undefined) {
            stateDeparture = `${realLiteral}: ${flightTimeFormat(fsData.departureTime.confirmed)}`;
          }
        }
      } else if (fsData.status === 'C') {
        colorStatus = 'black';
      }
      /**
      If the state is Scheduled you have to have the account:
      1. If (publishedDepartureTime - local data)> 24h - shows the status (Scheduled)
      2. If (publishedDepartureTime - local data)< 24h - shows:
       a. If (estimated time of departure - scheduled time of departure) < 15m - shows the status (On time)
       b. If (estimated time of departure - scheduled time of departure) > 15m - shows the status (Delayed)
      * */
      if (fsData.status === 'S') {
        const publishedDTms = fsData.departureTime.published !== undefined ? getMilliseconds(fsData.departureTime.published) : '';
        const scheduledDTms = fsData.departureTime.estimate !== undefined ? getMilliseconds(fsData.departureTime.estimate) : '';
        resultMin = scheduledDTms - publishedDTms;
        const departureTimeUTC = getMilliseconds(fsData.departureTime.timeUTC);
        const presentDate = getMilliseconds(new Date());
        const resultHour = departureTimeUTC - presentDate;
        if (resultHour < (24 * 60 * 60 * 1000)) {
          icon = flightStatusState[fsData.status].icon1;
          if (resultMin > 15 * 60 * 1000) {
            respectiveStatus = flightStatusState[fsData.status].status2;
            colorStatus = 'brown';
            stateDeparture = `${delayedLiteral}: ${flightTimeFormat(fsData.departureTime.estimate)}`;
          } else {
            colorStatus = 'green';
            respectiveStatus = flightStatusState[fsData.status].status1;
          }
        }
      }
      const capsRespectiveStatus = respectiveStatus.slice(0, 1)
       + respectiveStatus.slice(1).toLowerCase();
      return {
        colorStatus, respectiveStatus, icon, stateArrival, stateDeparture, capsRespectiveStatus,
      };
    };
    return { exec };
  };
  function datasResult(fsData, parentTab) {
    const template = $('.flight-status-template', parentTab).html();
    const table = $('.inte-flight-status-tbody', parentTab);

    // Clean table
    table.parent().DataTable().destroy();
    table.empty();
    let mapObj; let functionColor; let colorStatus; let respectiveStatus;
    let capsStatus; let icon; let stateArrival; let stateDeparture;
    let index = 0; let dayDiff; let carrierName;
    // if ($('#aerolineas').length > 0) {
    const airlines = [];
    // }
    let innerHTML = '';
    fsData.forEach((elementService) => {
      index += 1;
      functionColor = statusColorFS().exec(elementService);
      colorStatus = functionColor.colorStatus;
      respectiveStatus = functionColor.respectiveStatus;
      capsStatus = functionColor.capsRespectiveStatus;
      icon = functionColor.icon;
      stateArrival = functionColor.stateArrival;
      stateDeparture = functionColor.stateDeparture;
      dayDiff = getDatesDifference((elementService.departureTime.published),
        (elementService.arrivalTime.published));
      if (dayDiff > 0) {
        dayDiff = `(+${dayDiff})`;
      } else if (dayDiff < 0) {
        dayDiff = `(${dayDiff})`;
      } else {
        dayDiff = '';
      }
      if ($('#aerolineas').length > 0) {
        carrierName = elementService.carrierName;
        if (!airlines.includes(carrierName)) {
          airlines.push(carrierName);
        }
      }
      mapObj = {
        '{{index}}': index,
        '{{data-flight}}': elementService.codeshareCode === undefined && elementService.codeshareNumber === undefined ? elementService.carrierCode + elementService.flightNumber : elementService.codeshareCode + elementService.codeshareNumber,
        '{{data-flight-complete}}': elementService.codeshareCode === undefined && elementService.codeshareNumber === undefined ? elementService.carrierCode + elementService.flightNumber : `${elementService.codeshareCode + elementService.codeshareNumber} / ${elementService.carrierCode}${elementService.flightNumber}`,
        '{{data-carrierName}}': elementService.carrierName !== undefined ? elementService.carrierName : '-',
        '{{data-city-origin}}': elementService.departure.cityName !== undefined ? elementService.departure.cityName : '-',
        '{{data-iata-origin}}': elementService.departure.airportCode !== undefined ? elementService.departure.airportCode : '-',
        '{{data-terminal-origin}}': elementService.departure.terminal !== undefined ? elementService.departure.terminal : '-',
        '{{data-city-destiny}}': elementService.arrival.cityName !== undefined ? elementService.arrival.cityName : '-',
        '{{data-iata-destiny}}': elementService.arrival.airportCode !== undefined ? elementService.arrival.airportCode : '-',
        '{{data-terminal-destiny}}': elementService.arrival.terminal !== undefined ? elementService.arrival.terminal : '-',
        '{{data-date}}': elementService.departureTime.estimate !== undefined ? getStringDate(elementService.departureTime.estimate, false) : '-',
        '{{data-duration}}': elementService.flightDuration !== undefined ? flightDurationConversion(elementService.flightDuration) : '-',
        '{{data-plane-type}}': elementService.planeType !== undefined ? elementService.planeType : '-',
        '{{data-date-departure}}': dayDiff !== '' && elementService.departureTime.published !== undefined ? getStringDate(elementService.departureTime.published, false, true) : '',
        '{{data-hour-estimated-origin}}': elementService.departureTime.estimate !== undefined ? flightTimeFormat(elementService.departureTime.estimate) : '-',
        '{{data-hour-scheduled-origin}}': elementService.departureTime.published !== undefined ? flightTimeFormat(elementService.departureTime.published) : '-',
        '{{data-hour-confirmed-origin}}': elementService.departureTime.confirmed !== undefined ? flightTimeFormat(elementService.departureTime.confirmed) : '-',
        '{{data-gate}}': elementService.departure.gate !== undefined ? elementService.departure.gate : '-',
        '{{data-baggage}}': elementService.arrival.baggage !== undefined ? elementService.arrival.baggage : '-',
        '{{data-date-arrival}}': dayDiff !== '' && elementService.arrivalTime.published !== undefined ? getStringDate(elementService.arrivalTime.published, false, true) : '',
        '{{data-hour-estimated-destiny}}': elementService.arrivalTime.estimate !== undefined ? flightTimeFormat(elementService.arrivalTime.estimate) : '-',
        '{{data-hour-scheduled-destiny}}': elementService.arrivalTime.published !== undefined ? flightTimeFormat(elementService.arrivalTime.published) : '-',
        '{{data-hour-confirmed-destiny}}': elementService.arrivalTime.confirmed !== undefined ? flightTimeFormat(elementService.arrivalTime.confirmed) : '-',
        '{{data-status}}': elementService.status !== undefined ? respectiveStatus : '-',
        '{{data-state}}': elementService.status !== undefined ? capsStatus : '-',
        '{{data-status-icon}}': elementService.status !== undefined ? icon : '-',
        '{{data-airline-image}}': elementService.carrierCode !== undefined ? `/wcs/logos/flightstatus/logo_pos_${elementService.carrierCode}.svg` : '-',
        '{{data-airline-isotipo}}': elementService.carrierCode !== undefined ? `/wcs/logos/flightstatus/logo_min_${elementService.carrierCode}.svg` : '-',
        '{{data-date-ms-arrival-published}}': elementService.arrivalTime.published !== undefined ? getMilliseconds(elementService.arrivalTime.published) : '-',
        '{{data-date-ms-departure-published}}': elementService.departureTime.published !== undefined ? getMilliseconds(elementService.departureTime.published) : '-',
        '{{data-flight-status}}': colorStatus === 'brown' || colorStatus === 'green' ? '' : 'hidden',
        '{{data-flight-status-responsive}}': colorStatus === 'brown' || colorStatus === 'green' ? 'hidden' : '',
        '{{data-flight-color}}': colorStatus,
        '{{data-flight-stateArrival}}': stateArrival,
        '{{data-flight-stateDeparture}}': stateDeparture,
        '{{data-plusone}}': dayDiff,
      };
      innerHTML += replaceAll(template, mapObj);
    });
    function filterAirlines() {
      const selected = $('#aerolineas').find('option:selected').attr('value');
      if (selected === $(`[data-company="${selected}"]`, parentTab).data('company')) {
        $('[data-company]').hide();
        $(`[data-company="${selected}"]`).show();
      } else if (selected === 'All') {
        $('[data-company]').show();
      }
    }
    if ($('#aerolineas').length > 0) {
      // Array airlines
      airlines.sort();
      let optionAll = $('#aerolineas option:first').detach()[0].outerHTML;
      for (let x = 0; x < airlines.length; x++) {
        optionAll = optionAll.concat(`<option value="${airlines[x]}">${airlines[x]}</option>`);
      }
      $('#aerolineas').html(optionAll);
      $('#aerolineas').selectmenu('refresh');
      $('#aerolineas').on('selectmenuchange', filterAirlines);
    }

    table.html(innerHTML);
  }
  function flightStatusTabOrigDest() {
    const tabid = 'tab-fs-route';
    const tabPage = 'IB_SE/CacheControl6h/BrowserCache3600/FlightStatus/tabOrigDest';
    const parent = $(`#${tabid}`);

    function loadTabStatusRoute() {
      const deferred = $.Deferred();
      linkTabOrigDest.off('click', flightStatusTabOrigDest);
      if (parent.children('.ibe-tab__container-desktop').length === 0) {
        dFrontJs.ibe_loading.open(`#${tabid}`);
        $.ajax({
          encoding: 'UTF-8',
          method: 'GET',
          url: '/cs/Satellite',
          data: {
            pagename: tabPage,
            market: marketg,
            locale: localeg,
            d: 'Desktop',
          },
        }).done((data) => {
          deferred.resolve(data);
        }).fail(() => {
          linkTabOrigDest.on('click', flightStatusTabOrigDest);
          deferred.reject();
        });
      } else if (parent.length > 0) {
        deferred.resolve(null);
      } else {
        deferred.reject();
      }
      return deferred.promise();
    }
    function searchRouteFlightStatus(event) {
      // Retrieve Airport and Date
      event.preventDefault();

      function showResultsFlightStatus(fsData) {
        if (fsData && fsData.length > 0) {
          // Titles
          $('.inte-flight-status-city-origin', parent).text(fsData[0].departure.cityName);
          $('.inte-flight-status-iata-origin', parent).text(fsData[0].departure.airportCode);
          $('.inte-flight-status-city-destiny', parent).text(fsData[0].arrival.cityName);
          $('.inte-flight-status-iata-destiny', parent).text(fsData[0].arrival.airportCode);
          $('.inte-flight-status-date', parent).text(getStringDate(fsData[0].departureTime.estimate, true));

          // Rows
          datasResult(fsData, parent);
          // Show results
          $('.inte-flight-status-title', parent).removeClass('hidden');
          $('.inte-flight-status-results', parent).removeClass('hidden');
          $('.inte-flight-status-info', parent).removeClass('hidden');
          $('.inte-flight-status-not-results', parent).addClass('hidden');
          dFrontJs.ibe_data_flight_status_table.init(`#${tabid}`);
          dFrontJs.ibe_datatable.init();
        } else {
          $('.inte-flight-status-title', parent).addClass('hidden');
          $('.inte-flight-status-results', parent).addClass('hidden');
          $('.inte-flight-status-info', parent).addClass('hidden');
          $('.inte-flight-status-tbody', parent).empty();
          $('.inte-flight-status-not-results', parent).removeClass('hidden');
        }
      }
      if (dFrontJs.ibe_validate.validateForm('#seekFSform')) {
        const destination = $('#flight_destiny', parent).val().match(/\(\w+\)/)[0].replace(/[\(,\)]/g, '');
        const origin = $('#flight_origin', parent).val().match(/\(\w+\)/)[0].replace(/[\(,\)]/g, '');
        const $dateInput = $('#form_calendar', parent);
        const dateFormat = $dateInput.data('format').toUpperCase().split('/');
        const dateStr = $dateInput.val().split('/');
        const dateMap = {};
        dateFormat.forEach((el, index) => { dateMap[el] = dateStr[index]; });
        const dateObj = new Date(dateMap.YYYY, dateMap.MM - 1, dateMap.DD);

        dFrontJs.ibe_loading.open('body');
        flightStatusServices().getRouteStatus(origin, destination, dateObj)
          .done((data) => {
            // Function to print table
            dFrontJs.ibe_loading.close('body');
            showResultsFlightStatus(data);
          })
          .fail(() => {
            // Show Fail message
            dFrontJs.ibe_loading.close('body');

            $('.inte-flight-status-title', parent).addClass('hidden');
            $('.inte-flight-status-results', parent).addClass('hidden');
            $('.inte-flight-status-info', parent).addClass('hidden');
            $('.inte-flight-status-tbody', parent).empty();
            $('.inte-flight-status-not-results', parent).removeClass('hidden');
          });
      }
    }
    if (parent.length > 0) {
      loadTabStatusRoute()
        .done((data) => {
          if (data !== null) {
            parent.append(data);
            dFrontJs.ibe_validate.init();
            dFrontJs.ibe_inputs.init();
            dFrontJs.ibe_form_calendar.init();
            dFrontJs.ibe_tab.init();
            dFrontJs.ibe_selectmenu.init();
          }
          loadAirports().init(parent);
          initDateFormated();
          $('#searchFS').on('submit click', searchRouteFlightStatus);
        })
        .always(() => {
          dFrontJs.ibe_loading.close(`#${tabid}`);
        });
    }
  }
  const flightStatusAirportTab = () => {
    const idTab = 'tab-fs-airport';
    const pagename = 'IB_SE/CacheControl6h/BrowserCache3600/FlightStatus/tabAirport';
    const parent = $(`#${idTab}`);
    function loadTabFSAirports() {
      const deferred = $.Deferred();
      linkTabairport.off('click', flightStatusAirportTab);
      if (parent.children('.ibe-tab__container-desktop').length === 0) {
        dFrontJs.ibe_loading.open(`#${idTab}`);
        $.ajax({
          encoding: 'UTF-8',
          method: 'GET',
          url: '/cs/Satellite',
          data: {
            pagename,
            market: marketg,
            locale: localeg,
            d: 'Desktop',
          },
        }).done((data) => {
          deferred.resolve(data);
        }).fail(() => {
          linkTabairport.on('click', flightStatusAirportTab);
          deferred.reject();
        });
      } else if (parent.length > 0) {
        deferred.resolve(null);
      } else {
        deferred.reject();
      }
      return deferred.promise();
    }
    function searchAirportFlightStatus(event) {
      event.preventDefault();
      function showResultsFlightStatusAirport(fsData, checkOriginDest) {
        if (fsData && fsData.length > 0) {
          // Titles
          if ($('#FSsalida').is(':checked')) {
            $('.inte-flight-status-city-origin', parent).text(fsData[0].departure.airportName);
            $('.inte-flight-status-iata-origin', parent).text(fsData[0].departure.airportCode);
            $('.inte-flight-status-city-destiny', parent).text('');
            $('.inte-flight-status-iata-destiny', parent).text('');
            $('.inte-flight-status-date', parent).text(getStringDate(fsData[0].departureTime.estimate, true));
          } else {
            $('.inte-flight-status-city-destiny', parent).text(fsData[0].arrival.airportName);
            $('.inte-flight-status-iata-destiny', parent).text(fsData[0].arrival.airportCode);
            $('.inte-flight-status-city-origin', parent).text('');
            $('.inte-flight-status-iata-origin', parent).text('');
            $('.inte-flight-status-date', parent).text(getStringDate(fsData[0].arrivalTime.estimate, true));
          }

          // Rows
          datasResult(fsData, parent);
          // Show results
          $('.inte-icon', parent).addClass('hidden');
          $('.inte-flight-status-title', parent).removeClass('hidden');
          $('.inte-flight-status-results', parent).removeClass('hidden');
          $('.inte-flight-status-info', parent).removeClass('hidden');
          $('.inte-flight-status-not-results', parent).addClass('hidden');
          dFrontJs.ibe_data_flight_status_table.init(`#${idTab}`);
          dFrontJs.ibe_datatable.init();
          if (checkOriginDest === 'llegada') { $(`.fs-airport--${checkOriginDest}`, parent).trigger('click'); }
        } else {
          $('.inte-flight-status-title', parent).addClass('hidden');
          $('.inte-flight-status-results', parent).addClass('hidden');
          $('.inte-flight-status-info', parent).addClass('hidden');
          $('.inte-flight-status-tbody', parent).empty();
          $('.inte-flight-status-not-results', parent).removeClass('hidden');
        }
      }
      if (dFrontJs.ibe_validate.validateForm('#seekFSAform')) {
        const airportInput = $('#FSAairports').val().match(/\(\w+\)/)[0].replace(/[\(,\)]/g, '');
        const dateInput = $('#FSAdates');
        let hourInput = $('#FSAhours').val().replace(':00', '');
        if (hourInput.indexOf(0) === 0) { hourInput = hourInput.replace('0', ''); }
        const dateFormat = dateInput.data('format').toUpperCase().split('/');
        const hour = parseInt(hourInput, 10);
        const dateStr = dateInput.val().split('/');
        const dateMap = {}; let checkOriginDest = 'llegada';
        if ($('#FSsalida').is(':checked')) { checkOriginDest = 'salida'; }
        dateFormat.forEach((el, index) => { dateMap[el] = dateStr[index]; });
        const dateObj = new Date(dateMap.YYYY, dateMap.MM - 1, dateMap.DD, hour, 0, 0);
        dateObj.setHours(dateObj.getHours());
        dFrontJs.ibe_loading.open('body');
        flightStatusServices().getFlightStatusAirports(airportInput, dateObj, checkOriginDest)
          .done((data) => {
            // Function to print table
            dFrontJs.ibe_loading.close('body');
            if (data.length > 0) {
              showResultsFlightStatusAirport(data, checkOriginDest);
            } else {
              $('.inte-flight-status-not-results', parent).removeClass('hidden');
              $('.inte-flight-status-results', parent).addClass('hidden');
              $('.inte-flight-status-info', parent).addClass('hidden');
            }
          })
          .fail(() => {
            // Show Fail message
            dFrontJs.ibe_loading.close('body');
            $('.inte-flight-status-not-results', parent).removeClass('hidden');
            $('.inte-flight-status-results', parent).addClass('hidden');
            $('.inte-flight-status-info', parent).addClass('hidden');
          });
      }
    }
    if (parent.length > 0) {
      dFrontJs.ibe_loading.open(`#${idTab}`);
      loadTabFSAirports()
        .done((data) => {
          if (data !== null) {
            parent.append(data);
            dFrontJs.ibe_validate.init();
            dFrontJs.ibe_inputs.init();
            dFrontJs.ibe_form_calendar.init();
            dFrontJs.ibe_tab.init();
            dFrontJs.ibe_selectmenu.init();
          }
          initDateFormated();
          loadAirports().init(parent);
          $('#submitFSAirport').on('submit click', searchAirportFlightStatus);
        })
        .always(() => {
          dFrontJs.ibe_loading.close(`#${idTab}`);
        });
    }
  };
  function loadTab(tabParent) {
    const deferred = $.Deferred();
    const pagename = 'IB_SE/CacheControl6h/BrowserCache3600/FlightStatus/tabFlightNum';
    if (tabParent.children('.ibe-tab__container-desktop').length === 0) {
      $.ajax({
        encoding: 'UTF-8',
        method: 'GET',
        url: '/cs/Satellite',
        data: {
          pagename,
          market: marketg,
          locale: localeg,
          d: 'Desktop',
        },
      }).done((data) => {
        deferred.resolve(data);
      }).fail(() => {
        deferred.reject();
      });
    } else if (tabParent.length > 0) {
      deferred.resolve(null);
    } else {
      deferred.reject();
    }
    return deferred.promise();
  }
  function flightStatusFlightCodeTab() {
    const tabid = 'tab-fs-number';
    const tabParent = $(`#${tabid}`);
    function parametersFS() {
      const paramsFS = getQuerystrParams();
      const preCompleteFS = !!(paramsFS.flightNumber
        && (paramsFS.BEGIN_DAY_01 && paramsFS.BEGIN_MONTH_01 && paramsFS.BEGIN_YEAR_01));
      if (preCompleteFS) {
        dFrontJs.ibe_form_calendar.init();
        window.loadDatePickerLanguage(false, () => {
          let dateFS;
          $('#fsN-flghtNum').val(paramsFS.flightNumber);
          dFrontJs.ibe_inputs.init();
          dFrontJs.app.isotipoLoadinInput();
          dateFS = new Date();
          const day = paramsFS.BEGIN_DAY_01;
          const month = paramsFS.BEGIN_MONTH_01.substring(4);
          const year = paramsFS.BEGIN_YEAR_01;
          if (year.length > 0 && month.length > 0 && day.length > 0) {
            dateFS.setFullYear(year, month - 1, day);
            dateFS = $('#fsN-calendarInput').attr('data-format').replace('DD', day).replace('MM', month)
              .replace('YYYY', year);
            dFrontJs.ibe_form_calendar.updateFormCalendar('#tab-fs-number', dateFS);
            $('#submitFSNumber').trigger('click');
            dFrontJs.ibe_scrollTop.scrollId('#flightStatus-tabs');
          }
        });
      }
    }
    function searchFlightStatus(event) {
      event.preventDefault();
      function renderFlightStatus(data) {
        // Data shoul have only one element
        data = data[0];
        const duration = data.flightDuration !== undefined ? flightDurationConversion(data.flightDuration) : '-';
        const fdate = data.departureTime.estimate !== undefined ? getStringDate(data.departureTime.estimate, false) : '-';
        const schdate_orig = data.departureTime.published !== undefined ? flightTimeFormat(data.departureTime.published) : '-';
        const confdate_orig = data.departureTime.confirmed !== undefined ? flightTimeFormat(data.departureTime.confirmed) : '-';
        const schdate_dest = data.arrivalTime.published !== undefined ? flightTimeFormat(data.arrivalTime.published) : '-';
        const confdate_dest = data.arrivalTime.confirmed !== undefined ? flightTimeFormat(data.arrivalTime.confirmed) : '-';
        const statusData = statusColorFS().exec(data);
        const dayDiff = getDatesDifference((data.departureTime.published), (data.arrivalTime.published));
        const dateDepartureStr = dayDiff !== 0 && data.departureTime.published !== undefined ? getStringDate(data.departureTime.published, false, true) : '';
        const dateArrivalStr = dayDiff !== 0 && data.arrivalTime.published !== undefined ? getStringDate(data.arrivalTime.published, false, true) : '';

        if (dateDepartureStr.length === 0) {
          $('[data-date-departure]', tabParent).addClass('hidden');
        } else {
          $('[data-date-departure]', tabParent).removeClass('hidden').html(dateDepartureStr);
        }

        if (dateArrivalStr.length === 0) {
          $('[data-date-arrival]', tabParent).addClass('hidden');
        } else {
          $('[data-date-arrival]', tabParent).removeClass('hidden').html(dateArrivalStr);
        }

        $('[data-flight]', tabParent).html(data.codeshareCode === undefined && data.codeshareNumber === undefined ? data.carrierCode + data.flightNumber : `${data.codeshareCode + data.codeshareNumber} / ${data.carrierCode}${data.flightNumber}`);
        $('[data-statusicon]', tabParent)
          .removeClass('icon-avion_ida icon-mas_2 icon-aterrizaje icon-reloj-bold')
          .addClass(`icon-${statusData.icon}` || '-');
        $('[data-status]', tabParent).html(statusData.capsRespectiveStatus || '-');
        $('[data-flight-duration]', tabParent).html(duration);
        $('[data-flight-date]', tabParent).html(fdate);
        $('[data-airplane]', tabParent).html(data.planeType || '-');
        $('[data-from]', tabParent).html(`${data.departure.cityName} (${data.departure.airportCode})`);
        $('[data-to]', tabParent).html(`${data.arrival.cityName} (${data.arrival.airportCode})`);
        $('[data-scheduled-departure-from],[data-scheduled-departure-responsive-from]', tabParent).html(schdate_orig);
        $('[data-confirmed-departure],[data-confirmed-departure-responsive]', tabParent).html(confdate_orig);
        $('[data-scheduled-departure-to],[data-scheduled-departure-responsive-to]', tabParent).html(schdate_dest);
        $('[data-confirmed-arrival],[data-confirmed-arrival-responsive]', tabParent).html(confdate_dest);
        $('[data-terminal-from],[data-terminal-responsive-from]', tabParent).html(data.departure.terminal || '-');
        $('[data-terminal-to],[data-terminal-responsive-to]', tabParent).html(data.arrival.terminal || '-');
        $('[data-gate-from],[data-gate-responsive-from]', tabParent).html(data.departure.gate || '-');
        $('[data-gate-to],[data-gate-responsive-to]', tabParent).html(data.arrival.baggage || '-');
        $('.inte-flight-status-date', tabParent).text(getStringDate(data.departureTime.estimate, true));
        $('.inte-flight-status-results', tabParent).removeClass('hidden');
        $('.inte-flight-status-not-results', tabParent).addClass('hidden');
        $('[data-statuscolor]', tabParent)
          .removeClass('ibe-table-flight-status__text--grey ibe-table-flight-status__text--green ibe-table-flight-status__text--brown ibe-table-flight-status__text--black')
          .addClass(`ibe-table-flight-status__text--${statusData.colorStatus}`);
      }
      if (dFrontJs.ibe_validate.validateForm('#seekFSNform')) {
        const dateInput$ = $('#fsN-calendarInput', tabParent);
        const flightNum = $('#fsN-flghtNum', tabParent).val();
        const dateFormat = dateInput$.data('format').toUpperCase().split('/');
        const dateStr = dateInput$.val().split('/');
        const dateMap = {};
        dateFormat.forEach((el, index) => { dateMap[el] = dateStr[index]; });
        const dateObj = new Date(dateMap.YYYY, dateMap.MM - 1, dateMap.DD);
        dFrontJs.ibe_loading.open('body');
        flightStatusServices().getFlightStatus(flightNum, dateObj)
          .done((datas) => {
            // Function to print table
            if (datas.length > 0) {
              renderFlightStatus(datas);
            } else {
              $('.inte-flight-status-not-results', tabParent).removeClass('hidden');
              $('.inte-flight-status-results', tabParent).addClass('hidden');
            }
            dFrontJs.ibe_loading.close('body');
          })
          .fail(() => {
            // Show Fail message
            dFrontJs.ibe_loading.close('body');
            $('.inte-flight-status-not-results', tabParent).removeClass('hidden');
            $('.inte-flight-status-results', tabParent).addClass('hidden');
          });
      }
    }

    if (tabParent.length > 0) {
      dFrontJs.ibe_loading.open(`#${tabid}`);
      linkTabNum.off('click', flightStatusFlightCodeTab);
      loadTab(tabParent)
        .done((data) => {
          if (data !== null) {
            tabParent.append(data);
            dFrontJs.ibe_validate.init();
            dFrontJs.ibe_inputs.init();
            dFrontJs.ibe_form_calendar.init();
            dFrontJs.ibe_tab.init();
            dFrontJs.app.isotipoLoadinInput();
          }
          initDateFormated();
          $('#submitFSNumber').on('submit click', searchFlightStatus);
          parametersFS();
        })
        .fail(() => {
          linkTabNum.on('click', flightStatusFlightCodeTab);
        })
        .always(() => {
          dFrontJs.ibe_loading.close(`#${tabid}`);
        });
    }
  }
  /**
  Implements the status logic for the 3 tabs of the Flight Status page
  * */

  function updateDigitalDataFS() {
    const tab = $(this).parent().attr('data-currentQuadrigam');
    if (digital_data.Quadrigam !== tab) {
      digital_data.Quadrigam = tab;
      digital_data.TrackingCode = `${localeg}/${marketg}/${tab}`;
      updateDigitalData('view');
      datalayer_general.quadrigam = tab;
      datalayer_general.codigoSeguimiento = `${localeg}/${marketg}/${tab}`;
      updateDatalayer('view');
    }
  }

  if (active === '#tab-fs-route') {
    flightStatusTabOrigDest();
    linkTabNum.on('click', flightStatusFlightCodeTab);
    linkTabairport.on('click', flightStatusAirportTab);
  }
  if (active === '#tab-fs-number') {
    dFrontJs.app.isotipoLoadinInput();
    flightStatusFlightCodeTab();
    linkTabOrigDest.on('click', flightStatusTabOrigDest);
    linkTabairport.on('click', flightStatusAirportTab);
  }
  if (active === '#tab-fs-airport') {
    flightStatusAirportTab();
    linkTabOrigDest.on('click', flightStatusTabOrigDest);
    linkTabNum.on('click', flightStatusFlightCodeTab);
  }
  linkTabNum.on('click', updateDigitalDataFS);
  linkTabOrigDest.on('click', updateDigitalDataFS);
  linkTabairport.on('click', updateDigitalDataFS);
};
flightStatusSeeker();
