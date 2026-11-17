import { prefixService, unaccompaniedMinorService } from '../manage/ibe_minors';
import { showErrorModal } from '../general/ibe_inte-util';
import getCityListInformation from '../independent/searcher-modules/ibe_get-city-list-info';
import retrieveGlobalVariables from '../general/ibe_variables';
import { updateDatalayer, updateDigitalData } from '../manage/ibe_common';

const { marketg } = retrieveGlobalVariables();

function minorsAloneForms() {
  function completePrefixOrigin(response) {
    const respon = response.data;
    const prefix2 = $('#prefix2');
    let originResponse;
    const iata = $('#flight_origin').val() ? ($('#flight_origin').val().split('(')[1].substring(0, 3) || $('#flight_origin').attr('data-origin-info').split('|')[1]) : '';
    const myiatainfo = getCityListInformation(window.citiesJSON.origin3tabsJSON, iata);
    const originSelect = myiatainfo.country.description;
    for (let i = 0; i < respon.length; i++) {
      originResponse = respon[i].description.split(' /')[0];
      if (originResponse.indexOf('(') != -1) {
        originResponse = originResponse.split('(')[0];
      }
      if (originResponse.indexOf(originSelect) !== -1) {
        $('#prefix2 option[selected=selected]').removeAttr('selected');
        prefix2.find(`option[value="${respon[i].code}"]`).prop('selected', true);
        prefix2.selectmenu('refresh').blur();
        break;
      }
    }
  }

  function completePrefixDestiny(response) {
    const respos = response.data;
    const prefix3 = $('#prefix3'); let
      destiResponse;
    const iata = $('#flight_destiny').val() ? ($('#flight_destiny').val().split('(')[1].substring(0, 3) || $('#flight_destiny').attr('data-destination-info').split('|')[1]) : '';
    const myiatainfo = getCityListInformation(window.citiesJSON.origin3tabsJSON, iata);
    const destiSelect = myiatainfo.country.description;
    for (let i = 0; i < respos.length; i++) {
      destiResponse = respos[i].description.split(' /')[0];
      if (destiResponse.indexOf('(') != -1) {
        destiResponse = destiResponse.split('(')[0];
      }
      if (destiResponse.indexOf(destiSelect) != -1) {
        $('#prefix3 option[selected=selected]').removeAttr('selected');
        prefix3.find(`option[value="${respos[i].code}"]`).prop('selected', true);
        prefix3.selectmenu('refresh').blur();
        break;
      }
    }
  }
  /**
       * @description Call services unaccompanied-minor
       * @param {json} dataRequest
       */

  function minorService(dataRequest) {
    const sendUnaccompaniedMinorPromise = unaccompaniedMinorService(dataRequest);
    const submitMinorsAlone = $('#submitMinorsAlone');
    sendUnaccompaniedMinorPromise.done(() => {
      $('.ibe-claim').addClass('hidden');
      $('.inte-confirm-minorsAlone').removeClass('hidden');
      dFrontJs.app.calculateHeightComponents($('.ibe-ckeckin__list'), $('.ibe-ckeckin__list-box'));
      $('html, body').animate({ scrollTop: $('#minorsAlone-form').offset().top }, 'fast');
      datalayer_general.quadrigam = 'IBCUMN';
      datalayer_general.codigoSeguimiento = datalayer_general.codigoSeguimiento.replace('IBUMNR', 'IBCUMN');
      // update digital_data
      digital_data.Quadrigam = 'IBCUMN';
      digital_data.TrackingCode = digital_data.TrackingCode.replace('IBUMNR', 'IBCUMN');
      updateDatalayer('view');
      updateDigitalData('view');
      dFrontJs.ibe_loading.close('body');
    });
    sendUnaccompaniedMinorPromise.fail((error) => {
      dFrontJs.ibe_loading.close('body');
      if (error && (error.status === 400)) {
        showErrorModal(submitMinorsAlone.data('error1'), { btnclose: true, btnaccept: true, btncancel: false });
      }else if (error && (error.status === 404 || error.status === 500)) {
        showErrorModal(submitMinorsAlone.data('error2'), { btnclose: true, btnaccept: true, btncancel: false });
      }
    });
  }
  function prefixPhoneService() {
    const prefixPromise = prefixService(); const assetid = $('body').attr('data-contentid');
    prefixPromise.done((response) => {
      const options = []; const prefix = $('#prefix'); const prefixGeneral = $('.inte-prefix'); const
        size = response.length;
      for (let i = 0; i < size; i++) {
        options.push(`<option value="${response[i].code}">${response[i].description}</option>`);
      }
      prefixGeneral.append(options.join('')).selectmenu();
      prefix.find(`option[value="${response[0].code}"]`).first().prop('selected', true);
      prefix.selectmenu('refresh');

      $('#id-tab-collapse-V-O a[data-destination-info]').on('click', '', response, completePrefixOrigin);
      $('#flight_origin').on('focusout', '', response, completePrefixOrigin);

      $(`#${assetid}id-tab-collapse-V-D a[data-origin-info]`).on('click', '', response, completePrefixDestiny);
      $('#flight_destiny').on('focusout', '', response, completePrefixDestiny);
    });
  }


  $('.inte-btnContinue').on('click', () => {
    if (dFrontJs.ibe_validate.validateForm('[data-valid-form]')) {
      const quadrigam = digital_data.Quadrigam; let iataOrigin; let iataDestination; let pnr = $('#pnr-code').val();
      window.dFrontJs.ibe_loading.open('body');

      if ($('#flight_origin').val()) {
        iataOrigin = $('#flight_origin')[0].value.split('(')[1].split(')')[0];
      }
      if ($('#flight_destiny').val()) {
        iataDestination = $('#flight_destiny')[0].value.split('(')[1].split(')')[0];
      }
      if (pnr === '') {
        pnr = null;
      }
      const dataRequest = {
        pnr,
        quadrigam,
        bookingMarket: marketg,
        minorPassenger: {
          name: $('#name1').val(),
          surname1: $('#firstSurname1').val(),
          surname2: $('#secondSurname1').val(),
          ageInYears: $('#age').val(),
        },
        contactInfo: {
          name: $('#name').val(),
          surname1: $('#firstSurname').val(),
          surname2: $('#secondSurname').val(),
          email: $('#mail').val(),
          phone: {
            prefix: $('#prefix').val(),
            phone: $('#phone-num').val(),
          },
        },
        originContactInfo: {
          name: $('#name2').val(),
          surname1: $('#firstSurname2').val(),
          surname2: $('#secondSurname2').val(),
          phone: {
            prefix: $('#prefix2').val(),
            phone: $('#phone-num2').val(),
          },
          cityCode: iataOrigin,
          address: $('#addressOrigin').val(),
        },
        destinationContactInfo: {
          name: $('#name3').val(),
          surname1: $('#firstSurname3').val(),
          surname2: $('#secondSurname3').val(),
          phone: {
            prefix: $('#prefix3').val(),
            phone: $('#phone-num3').val(),
          },
          cityCode: iataDestination,
          address: $('#addressDestination').val(),
        },
      };
      minorService(dataRequest);
    } else {
      $('[data-valid-form]').find('.ibe_form__group--error')[0].scrollIntoView();
    }
  });

  // Call prefix services
  prefixPhoneService();
}
minorsAloneForms();
