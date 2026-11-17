import retrieveGlobalVariables from '../../general/ibe_variables';
import { getCitiesOrgDest } from '../../manage/ibe_cities-services';
import { replaceAll } from '../../general/ibe_inte-util';

const { localeg, marketg } = retrieveGlobalVariables();

const parent = $('.ibe-geo-origin');
const parentCards = $('.ibe-recommended-cards');
const buttonMore = parentCards.parent().find('.ibe-recommended-cards__bottom');
const parentId = $('.fc-reloadable-section').data('highlight-parent');
const origSelector = $('span.ibe-geo-origin__selector-button-text', $('.ibe-geo-origin__selector-button'));
const modalContainer = $('.ibe-geo-origin__container', parent);
const parentDefList = $('.ibe-geo-origin__unlocated', modalContainer);
const buttonGeo = $('.ibe-geo-origin__active-button', modalContainer);
const input = $('#flight_origin', modalContainer);
let origSelectorStoredValue = origSelector.text();
// Globarl vars
const origins = [];
let json;
let firstRender = true;

const showHideViewMore = () => {
  const cards = $('.ibe-recommended-cards__card', parentCards);
  let total = $('[data-highlighted-landigs-total]', parentCards).data('highlighted-landigs-total');
  total = (total !== undefined) ? parseInt(total, 10) : 0;
  if (total > cards.length && cards.length < 45) {
    buttonMore.removeClass('hidden');
  } else {
    buttonMore.addClass('hidden');
  }
};
const loadMoreOffers = (initialIndex, originIATA, append) => {
  const data = {
    pagename: 'IB_SE/CacheControl1h/BrowserCache3600/HighlightedLandingsT1',
    parentId,
    market: marketg,
    locale: localeg,
    originIATA,
    d: '',
  };
  if (initialIndex !== 0) {
    data.initialIndex = initialIndex;
  }
  return $.ajax({
    encoding: 'UTF-8',
    method: 'GET',
    url: '/cs/Satellite',
    data,
    beforeSend() {
      dFrontJs.ibe_loading.open('.fc-loadingParent');
    },
    error() {
      dFrontJs.ibe_loading.close('.fc-loadingParent');
    },
    success(resp) {
      dFrontJs.ibe_loading.close('.fc-loadingParent');
      if (append === true) {
        $('.ibe-recommended-cards__container', parentCards).append(resp);
      } else {
        $('.ibe-recommended-cards__container', parentCards).html(resp);
      }
      showHideViewMore();
      //dFrontJs.app.emitInView();
    },
  });
};


const clickMoreHandler = function clickMoreHandler(event) {
  event.preventDefault();
  const cards = $('.ibe-recommended-cards__card', parentCards);
  $(this).prop('disabled', true);
  origSelector.parent().prop('disabled', true);
  loadMoreOffers(cards.length, origSelector.attr('data-inte-iata'), true).always(() => {
    $(this).prop('disabled', false);
    if (!firstRender) origSelector.parent().prop('disabled', false);
  });
};

const changeInputValue = function changeInputValue(event) {
  if (event) event.preventDefault();
  if (input.val() !== '') {
    dFrontJs.ibe_validations_searcher.checkCity(input.parents('.ibe_form'), input, json);
    if (!input.parent().hasClass('ibe_form__group--error')) {
      const value = input.val();
      const aux = value.indexOf('(');
      origSelector.text(value.substring(0, aux - 1));
      origSelector.attr('data-inte-iata', value.substring(aux + 1, value.length - 1));
      modalContainer.collapse('hide');

      if (origSelectorStoredValue !== origSelector.text()) {
        origSelectorStoredValue = origSelector.text();
        origSelector.parent().prop('disabled', true);
        buttonMore.prop('disabled', true);
        loadMoreOffers(0, origSelector.attr('data-inte-iata'), false).always(() => {
          origSelector.parent().prop('disabled', false);
          buttonMore.prop('disabled', false);
        });
      }
    }
  }
};

const selectedOrigin = function selectedOrigin(event) {
  event.preventDefault();
  const item = $(this).find('p.ui-menu-item-link__city');
  input.val(`${item.text()}`);
  dFrontJs.ibe_inputs.inputActive(input);
  changeInputValue();
};
function renderListOrigins(list, type) {
  const template = $('.ib-inte-geo-origin').html();
  const insert = [];
  const max = modalContainer.data('inte-maxkm');

  list.forEach((city) => {
    const objectMap = {
      '{{cityName}}': `${city.label}`,
      '{{countryName}}': (city.dist ? `${city.dist.toFixed(0)} km, ` : '') + city.country,
    };
    const auxStr = replaceAll(template, objectMap);
    const auxObj = $(auxStr);
    auxObj.on('click', selectedOrigin);
    insert.push(auxObj);
  });

  if (type && type === 'unlocated') {
    $('.inte-unlocated-list').html(insert.slice());
    origSelector.parent().prop('disabled', false);
  } else {
    if (list[0].dist.toFixed(0) <= max) {
      $('.inte-your-position', modalContainer).append(insert.slice(0, 1));
      $('.inte-positioned-list', modalContainer).append(insert.slice(1));
    } else {
      $('.inte-your-position', modalContainer).parent().addClass('hidden');
      modalContainer.attr('data-location-groups', '1');
      $('.inte-positioned-list', modalContainer).append(insert.slice());
    }
    dFrontJs.ibe_autocomplete.updateSourceList(input, list);
    if (firstRender) $('.inte-your-position').find('li').trigger('click');
  }
  if (firstRender) {
    parent.attr('data-enabled', 'true');
    $('.ibe-geo-origin__selector-button-icon', parent).removeClass('hidden');
    origSelector.parent().prop('disabled', false);
  }
  firstRender = false;
}

const activeLocationMode = function activeLocationMode(event) {
  if (event) event.preventDefault();

  function calculateDistance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    dist *= 1.609344;

    return dist;
  }
  function createOrderedList(latitude, longitude) {
    const list = [];
    for (let i = 0; i < json.length; i++) {
      json[i].cities.forEach((city) => {
        city.dist = calculateDistance(latitude, longitude, city.latitude, city.longitude);
        const { dist } = city;
        const text = city.description;
        const iata = city.code;
        const country = city.country.description;
        const aux = {
          label: `${text} (${iata})`,
          value: `${text} (${iata})`,
          country: `${country}`,
          dist,
          iata,
        };
        list.push(aux);
      });
    }
    const sort = list.sort((a, b) => ((a.dist > b.dist) ? 1 : ((b.dist > a.dist) ? -1 : 0)));
    renderListOrigins(sort);
  }

  function success(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    createOrderedList(latitude, longitude);
    buttonGeo.off('click', activeLocationMode);
    parent.attr('data-located', 'true');
  }
  function error(err) {
    console.log(`ERROR(${err.code}): ${err.message}`);
  }
  if (!navigator.geolocation) {
    console.log('Error en navegador geolocalización');
  } else {
    navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true });
  }
};

const loadOrigins = function loadOrigins() {
  const $origins = $('a.ui-menu-item-link', parentDefList);
  if ($origins.length > 1) {
    $origins.each(function () {
      const value = $(this).find('p.ui-menu-item-link__city').text();
      const aux = value.indexOf('(');
      origins[value.substring(aux + 1, value.length - 1)] = value.substring(0, aux - 1);
    });
    getCitiesOrgDest('V-O', true)
      .then((arrOriDest) => {
        if (arrOriDest) {
          json = arrOriDest['V-O'] ? arrOriDest['V-O'] : json;
          if (json && origins) {
            for (let i = 0; i < json.length; i++) {
              json[i].cities = json[i].cities.filter((city) => city.code in origins);
            }
            dFrontJs.ibe_autocomplete.init(input, json);
            buttonGeo.off('click', activeLocationMode);
            buttonGeo.on('click', activeLocationMode);
            input.off('change', changeInputValue);
            input.on('change ', changeInputValue);
            navigator.permissions.query({ name: 'geolocation' }).then((permission) => {
              if (permission.state === 'granted') {
                activeLocationMode();
              } else {
                renderListOrigins(dFrontJs.ibe_autocomplete.cityListContructor(json), 'unlocated');
              }
            });
          }
        }
      }).catch((error) => {
        console.log(error);
        console.error('Error loading Origins');
      });
  }
};

const init = () => { 
  showHideViewMore();
  loadOrigins();
  
  dFrontJs.ibe_inputs.init();
  buttonMore.off('click', clickMoreHandler);
  buttonMore.on('click', clickMoreHandler);
};
export { init };
