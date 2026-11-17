import { responsive, initDateFormated } from '../../general/ibe_inte-util';
import { getCitiesOrgDest, commonDefaultDestinationCodes, commonDefaultOriginCodes} from '../../manage/ibe_cities-services';

const $searchCont = $('#SearcherContent');

function loadCitiesSearchers(code, origin3tabsJSON, destinationVJSON, destinationHJSON,
  destinationCJSON, originRJSON, destinationRJSON) {
  if (origin3tabsJSON || destinationVJSON || destinationHJSON
        || destinationCJSON || originRJSON || destinationRJSON) {
    const codeAux = code;
    let JSonCities;
    dFrontJs.ibe_tab.init();
    if ($('[data-searcher-accordion]').length > 0 && !$('[data-searcher-accordion]').hasClass('inte-accordion-done')) {
      $('[data-searcher-accordion]').addClass('inte-accordion-done');
      dFrontJs.ibe_searcher_accordion.init();
    }
    if (commonDefaultOriginCodes.indexOf(code) >= 0) {
      JSonCities = origin3tabsJSON;
    } else if (commonDefaultDestinationCodes.indexOf(code) >= 0) {
      JSonCities = destinationVJSON;
    } else {
      switch (codeAux) {
        case 'H-D':
          JSonCities = destinationHJSON;
          break;
        case 'C-D':
          JSonCities = destinationCJSON;
          break;
        case 'R-O':
          JSonCities = originRJSON;
          break;
        case 'R-D':
          JSonCities = destinationRJSON;
          break;
        default:
      }
    }
    dFrontJs.ibe_autocomplete.init($(`[data-search-place="${codeAux}"]:not(.inte-cities-loaded)`), JSonCities);
    dFrontJs.ibe_searcher_choose_city.init($(`[data-search-place="${codeAux}"]:not(.inte-cities-loaded)`), JSonCities);
    $(`[data-search-place="${codeAux}"]`).addClass('inte-cities-loaded');

    if (responsive() !== 'desktop') {
      dFrontJs.ibe_searcher_accordion_mobile.init();
    }

    dFrontJs.ibe_bootstrap_collapse.init();
    dFrontJs.ibe_overlay.init();
    const lengthDatakey = $('[data-keyboard-close]').length;
    if (lengthDatakey > 0) {
      dFrontJs.ibe_keyboard_action.close($('[data-keyboard-close]'));
    }
    if ($searchCont.length > 0 && $(`[data-search-place="${codeAux.replace('O', 'D')}"]`).hasClass('inte-cities-loaded')
            && $(`[data-search-place="${codeAux.replace('D', 'O')}"]`).hasClass('inte-cities-loaded')) {
    // It has to be a booking seeker, and it has to be called only once per tab,
    // also if any tab has that class, the JSON var exits and the seekerdata
    // will be able to do its jobs.
      dFrontJs.ibe_selectmenu.init();
      initDateFormated();
    }
    $('.icon-senalizacion_mapas').show();
    $('.ibe-searcher__odSwitch').removeClass('hidden');
  }
}

// Load cities from tabs in searchers
const loadOrigDest = async function (code, origin3tabsJSON, destinationVJSON, destinationHJSON,
  destinationCJSON, originRJSON, destinationRJSON) {
  let origin3tabsJSONAux = origin3tabsJSON;
  let destinationVJSONAux = destinationVJSON;
  let destinationHJSONAux = destinationHJSON;
  let destinationCJSONAux = destinationCJSON;
  let originRJSONAux = originRJSON;
  let destinationRJSONAux = destinationRJSON;
  let bool = true;
  const initInputs = ()=> {
    switch (code) {
      case 'V-D':
        if (destinationVJSONAux) {        
          loadCitiesSearchers('V-O', origin3tabsJSONAux, destinationVJSONAux, destinationHJSONAux,
          destinationCJSONAux, originRJSONAux, destinationRJSONAux);
          loadCitiesSearchers(code, origin3tabsJSONAux, destinationVJSONAux, destinationHJSONAux,
            destinationCJSONAux, originRJSONAux, destinationRJSONAux);
  
          bool = false;
        }
        break;
      case 'H-D':
        if (destinationHJSONAux) {
          loadCitiesSearchers('H-O', origin3tabsJSONAux, destinationVJSONAux, destinationHJSONAux,
          destinationCJSONAux, originRJSONAux, destinationRJSONAux);
          loadCitiesSearchers(code, origin3tabsJSONAux, destinationVJSONAux, destinationHJSONAux,
            destinationCJSONAux, originRJSONAux, destinationRJSONAux);
  
          bool = false;
        }
        break;
      case 'C-D':
        if (destinationCJSONAux) {
          loadCitiesSearchers('C-O', origin3tabsJSONAux, destinationVJSONAux, destinationHJSONAux,
          destinationCJSONAux, originRJSONAux, destinationRJSONAux);
          loadCitiesSearchers(code, origin3tabsJSONAux, destinationVJSONAux, destinationHJSONAux,
            destinationCJSONAux, originRJSONAux, destinationRJSONAux);
          bool = false;
        }
        break;
      case 'M-D':
        if (destinationVJSONAux) {
          loadCitiesSearchers('M-O', origin3tabsJSONAux, destinationVJSONAux, destinationHJSONAux,
          destinationCJSONAux, originRJSONAux, destinationRJSONAux);
          loadCitiesSearchers(code, origin3tabsJSONAux, destinationVJSONAux, destinationHJSONAux,
            destinationCJSONAux, originRJSONAux, destinationRJSONAux);
  
          bool = false;
        }
        break;
      case 'R-D':
        if (destinationRJSONAux) {
          loadCitiesSearchers('R-O', origin3tabsJSONAux, destinationVJSONAux, destinationHJSONAux,
          destinationCJSONAux, originRJSONAux, destinationRJSONAux);
          loadCitiesSearchers(code, origin3tabsJSONAux, destinationVJSONAux, destinationHJSONAux,
            destinationCJSONAux, originRJSONAux, destinationRJSONAux);
          bool = false;
        }
        break;
      default:
            // nothing
    }
  }
  initInputs();

  

  async function callAjaxOrDest(codeAux) {
    const citiesInfo = await getCitiesOrgDest(codeAux);
    
    if (citiesInfo) {
      origin3tabsJSONAux = citiesInfo['V-O'];
      destinationVJSONAux = citiesInfo['V-D'];
      destinationHJSONAux = citiesInfo['H-D'];
      destinationCJSONAux = citiesInfo['C-D'];
      originRJSONAux = citiesInfo['R-O'];
      destinationRJSONAux = citiesInfo['R-D'];
      if(codeAux === 'M-D' && !destinationVJSONAux) destinationVJSONAux = citiesInfo['M-D'];
    }
    return {
      origin3tabsJSONAux,
      destinationVJSONAux,
      destinationHJSONAux,
      destinationCJSONAux,
      originRJSONAux,
      destinationRJSONAux,
    };
  }
  let arrOriDest;
  if (bool) {
    arrOriDest = await callAjaxOrDest(code);
  }
  if (arrOriDest) {
    origin3tabsJSONAux = arrOriDest.origin3tabsJSONAux ? arrOriDest.origin3tabsJSONAux : origin3tabsJSONAux;
    destinationVJSONAux = arrOriDest.destinationVJSONAux ? arrOriDest.destinationVJSONAux : destinationVJSONAux;
    destinationHJSONAux = arrOriDest.destinationHJSONAux ? arrOriDest.destinationHJSONAux : destinationHJSONAux;
    destinationCJSONAux = arrOriDest.destinationCJSONAux ? arrOriDest.destinationCJSONAux : destinationCJSONAux;
    originRJSONAux = arrOriDest.originRJSONAux ? arrOriDest.originRJSONAux : originRJSONAux;
    destinationRJSONAux = arrOriDest.destinationRJSONAux ? arrOriDest.destinationRJSONAux : destinationRJSONAux;
    initInputs();
  }

  return {
    origin3tabsJSONAux,
    destinationVJSONAux,
    destinationHJSONAux,
    destinationCJSONAux,
    originRJSONAux,
    destinationRJSONAux,
  };
};
// Check for origin and destination to load in inputs.

const checkifcitiesneeded = async (origin3tabsJSON, destinationVJSON, destinationHJSON,
  destinationCJSON, originRJSON, destinationRJSON) => {
  let origin3tabsJSONAux = origin3tabsJSON;
  let destinationVJSONAux = destinationVJSON;
  let destinationHJSONAux = destinationHJSON;
  let destinationCJSONAux = destinationCJSON;
  let originRJSONAux = originRJSON;
  let destinationRJSONAux = destinationRJSON;
  const loaduniq = []; let j = 0;
  const loaduniqDOM = $.uniqueSort($('[data-search-place]:not(.inte-cities-loaded)').map(function maps() {
    if (/^[a-zA-Z]{1}-D$/.test($(this).attr('data-search-place'))) {
      return $(this).attr('data-search-place');
    }
  }).get());

  $.each(loaduniqDOM, (i, el) => {
    // Add unique values.
    if ($.inArray(el, loaduniq) === -1) loaduniq.push(el);
  });
  for (; j < loaduniq.length; j += 1) {
    // This should be a loop with only two elements, one for origin and another for destination.
    const arrOriDest = await loadOrigDest(loaduniq[j], origin3tabsJSONAux, destinationVJSONAux, destinationHJSONAux,
      destinationCJSONAux, originRJSONAux, destinationRJSONAux);
    if (arrOriDest) {
      origin3tabsJSONAux = arrOriDest.origin3tabsJSONAux;
      destinationVJSONAux = arrOriDest.destinationVJSONAux;
      destinationHJSONAux = arrOriDest.destinationHJSONAux;
      destinationCJSONAux = arrOriDest.destinationCJSONAux;
      originRJSONAux = arrOriDest.originRJSONAux;
      destinationRJSONAux = arrOriDest.destinationRJSONAux;
    }
  }
  return {
    origin3tabsJSONAux,
    destinationVJSONAux,
    destinationHJSONAux,
    destinationCJSONAux,
    originRJSONAux,
    destinationRJSONAux,
  };
};

export default checkifcitiesneeded;
