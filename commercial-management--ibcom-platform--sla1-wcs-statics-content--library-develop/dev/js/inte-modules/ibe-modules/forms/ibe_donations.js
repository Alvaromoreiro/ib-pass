import { replaceAll, showErrorModal, redirectByQuadrigam } from '../general/ibe_inte-util';
import { setNumberFormat, updateDatalayer, updateDigitalData } from '../manage/ibe_common';
import { isLogado, getCustomerDataSession } from '../manage/ibe_logged-service';
import sendRequestAviosDonation from '../manage/ibe_donations';
import { fillLoggedData } from '../general/ibe_login';
import retrieveGlobalVariables from '../general/ibe_variables';
import * as SessionStorage from '../manage/SessionStorage';

const { localeg, marketg } = retrieveGlobalVariables();

function aviosDonationForm() {
  let firstStep$; let formStepElement; let $centralSection;
  let $formDonation; let code; let userInfo; let
    nameOng;
  let $inputAvios; let $inputFF; let $submitButton; let $check;
  let confirmStepElement; let $dynamicElement;
  let responseService = '';
  /** Function to display confirmation (ack=acknowledgment) */
  function ackView() {
    let innerHTML = '';
    let updateAvios = '';
    // Service sometimes return string and other times return number
    const responseAvios = `${responseService.aviosRemaining}`;
    // update user's Avios value

    updateAvios = setNumberFormat(responseAvios, localeg, marketg);
    const $logged = $('#loggedUser');
    $('#loggedUserAvios', $logged).text(updateAvios);
    $('#loggedUserAviosNew', $logged).text(updateAvios);
    userInfo.avios = parseInt(responseAvios, 10);
    SessionStorage.set('customerData', userInfo);
    // complete scipt template with datas
    $dynamicElement = $('#aviosDonation-dynamic');
    const mapObj = {
      '{{data-userInfo-name}}': userInfo.name,
      '{{data-userInfo-surnames}}': userInfo.surnames,
      '{{data-aviosDonados}}': setNumberFormat($inputAvios.val(), localeg, marketg),
      '{{data-ong-name}}': nameOng,
    };
    innerHTML += replaceAll(confirmStepElement, mapObj);
    $dynamicElement.empty();
    $dynamicElement.html(innerHTML);
    $('html, body').animate({ scrollTop: $dynamicElement.offset().top - 10 }, 'slow');
  }

  /** Function to check enough Avios */
  const checkEnoughAvios = () => {
    const $group = $inputAvios.closest('.ibe_form__group');
    const $pError = $group.find("[data-validate='balance']");
    // if($inputAvios.val().length > 0){
    if ($inputAvios.val() > userInfo.avios) {
      $group.addClass('ibe_form__group--error');
      $pError.removeClass('hidden');
      $pError.html($pError.data('validate-text'));
    } else {
      $pError.addClass('hidden');
      if ($group.find('p:not(.hidden)').length === 0) {
        $group.removeClass('ibe_form__group--error');
      }
    }
    // }
  };
    /** Function to call Avios Donation Service */
  function callAviosDonationService() {
    const request = {
      ffnumber: $inputFF.val(),
      ngo: code,
      avios_amount: parseInt($inputAvios.val(), 10),
    };

    const setDatalayer = () => {
      datalayer_general.quadrigam = 'AVIOCO';
      datalayer_general.codigoSeguimiento = datalayer_general.codigoSeguimiento.replace('AVIOFO', 'AVIOCO');
      datalayer_general.donaOng = code;
      datalayer_general.aviosDonados = $inputAvios.val();
      datalayer_general.donaCertif = $check.is(':checked') ? 'si' : 'no';
      // update digital_data
      digital_data.Quadrigam = 'AVIOCO';
      digital_data.TrackingCode = digital_data.TrackingCode.replace('AVIOFO', 'AVIOCO');
      updateDatalayer('view');
      updateDigitalData('view');
    };
    // Request avios donation DONE
    function callSucceed(resp) {
      dFrontJs.ibe_loading.close('body');
      setDatalayer();
      responseService = resp;
      ackView();
    }
    // Request avios donation FAIL
    function callFailure(resp) {
      dFrontJs.ibe_loading.close('body');
      const errorMsg = resp.responseJSON ? resp.responseJSON.errors[0]
      || { code: null } : { code: null };
      // Amount not allowed.
      if (errorMsg.code === 'CMLM_AVD_1003') {
        showErrorModal($submitButton.data('error-balance'), { btnclose: true, btnaccept: true, btncancel: true });
      } else if (errorMsg.code === 'CMLM_AVD_1013') {
        showErrorModal($submitButton.data('error-quantity'), { btnclose: true, btnaccept: true, btncancel: true });
      } else if (resp && (resp.status === 404 || resp.status === 409 || resp.status === 500)) {
        showErrorModal($submitButton.data('error-donation'), { btnclose: true, btnaccept: true, closereload: true });
      } else {
        showErrorModal(null, { btnclose: true, btnaccept: true, closereload: true });
      }
      $submitButton.prop('disabled', false);
    }
    sendRequestAviosDonation(request).then(callSucceed, callFailure);
  }
  /** Function to send form info to server and deal with response */
  const formSubmit = (e) => {
    const maxValue = $inputAvios.data('max-value');
    const minValue = $inputAvios.data('min-value');
    const actualValue = parseInt($inputAvios.val());
    const $group = $inputAvios.closest('.ibe_form__group');
    const $pError = $group.find("[data-validate='limits']");
    $submitButton.prop('disabled', true);
    e.preventDefault();
    if (isNaN(actualValue) || (actualValue < minValue || actualValue > maxValue)) {
      $group.addClass('ibe_form__group--error');
      $pError.removeClass('hidden');
      $pError.html($pError.data('validate-text'));
    } else {
      $pError.addClass('hidden');
      if ($group.find('p:not(.hidden)').length === 0) {
        $group.removeClass('ibe_form__group--error');
      }
    }


    if (dFrontJs.ibe_validate.validateForm(`#${$formDonation.attr('id')}`)) { // dFrontJS
      // dFrontJs.ibe_loading.open('body');
      window.scrollTo(0, 0);
      dFrontJs.ibe_loading.open('body');
      callAviosDonationService();
    } else {
      $submitButton.prop('disabled', false);
    }
  };


  /** Function to display form step form and  */
  const ongSelected = function ongSelected() {
    // Set values ONGs
    const $ongLink = $(this, firstStep$);
    let innerHTML = '';
    const $imgAviosDonation = $('.inte-imgAviosDonation', $centralSection).find('img');
    code = $ongLink.attr('data-codeong');
    nameOng = $ongLink.attr('data-ong');
    userInfo = getCustomerDataSession();
    const srcImg = $ongLink.attr('data-img-src').length > 0 ? $ongLink.attr('data-img-src') : $imgAviosDonation.attr('src');
    const altImg = $ongLink.attr('data-img-alt').length > 0 ? $ongLink.attr('data-img-alt') : $imgAviosDonation.attr('alt');

    const mapObj = {
      '{{data-ong-img-src}}': srcImg,
      '{{data-ong-img-alt}}': altImg,
      '{{data-ong-img-title}}': $ongLink.attr('data-img-title'),
      '{{data-ong-icon-src}}': $ongLink.attr('data-icon-src'),
      '{{data-ong-icon-alt}}': $ongLink.attr('data-icon-alt'),
      '{{data-ong-icon-title}}': $ongLink.attr('data-icon-title'),
      '{{data-ong-body}}': $ongLink.siblings('div .inte-ongbody').html(),
      '{{data-userInfo-name}}': userInfo.name,
      '{{data-userInfo-surnames}}': userInfo.surnames,
      '{{data-userInfo-numAvios}}': setNumberFormat(userInfo.avios, localeg, marketg),
    };
    innerHTML += replaceAll(formStepElement, mapObj);
    $centralSection.empty();
    $centralSection.html(innerHTML);
    $('html, body').animate({ scrollTop: $('#aviosDonation-dynamic').offset().top - 10 }, 'slow');
    $formDonation = $('#aviosDonation-form');
    $submitButton = $('#submitDonation', $formDonation);
    $check = $('#check-ong', $formDonation);
    const $formWarrant = $('.inte-formWarrant', $formDonation);
    $inputAvios = $('#id-avios', $formDonation);
    $inputFF = $('#id-ibplus', $formDonation);
    // update datalayer_general
    datalayer_general.quadrigam = 'AVIOFO';
    datalayer_general.codigoSeguimiento = datalayer_general.codigoSeguimiento.replace('AVIOSO', 'AVIOFO');
    // update digital_data
    digital_data.Quadrigam = 'AVIOFO';
    digital_data.TrackingCode = digital_data.TrackingCode.replace('AVIOSO', 'AVIOFO');
    updateDatalayer('view');
    updateDigitalData('view');
    // refresh page with return link
    $('.inte-refresh').on('click', () => {
      // eslint-disable-next-line no-self-assign
      window.location.href = window.location.href;
    });
    // autocomplete inputs' values with customer's datas
    fillLoggedData();
    dFrontJs.ibe_inputs.init();
    dFrontJs.ibe_validate.init();
    // Check for warrant
    $check.change(() => {
      if ($check.is(':checked')) {
        if (userInfo.address.length > 0) {
          $formWarrant.removeClass('hidden');
        } else {
          $check.prop('checked', false);
          showErrorModal($check.attr('data-errorMsg'));
        }
      } else {
        $formWarrant.addClass('hidden');
      }
    });
    // Submit button
    $submitButton.on('click', formSubmit);
    // check enough Avios
    $inputAvios.on('focusout', checkEnoughAvios);
    $inputAvios.on('keypress', function allowKeys(ei) {
      const input = $(this);
      if (input.val().length === 0) {
        return (ei.charCode >= 49 && ei.charCode <= 57);
      }
      return (ei.charCode >= 48 && ei.charCode <= 57);
    });
    $inputAvios.on('focus keyup', function validateAvios() {
      const input = $(this);
      const maxVal = input.data('max-value');
      const minVal = input.data('min-value');
      const value = parseInt(input.val(), 10);
      const $group = input.closest('.ibe_form__group');
      const $pError = $group.find("[data-validate='limits']");
      if (isNaN(value) || (value < minVal || value > maxVal)) {
        $group.addClass('ibe_form__group--error');
        $pError.removeClass('hidden');
        $pError.html($pError.data('validate-text'));
      } else {
        $pError.addClass('hidden');
        if ($group.find('p:not(.hidden)').length === 0) {
          $group.removeClass('ibe_form__group--error');
        }
      }
    });
  };

  const init = () => {
    firstStep$ = $('#aviosDonation-intro');// Parent for first step
    formStepElement = $('#aviosDonationForm-template').html(); // variable to save html text from script template
    confirmStepElement = $('#aviosDonationConfirmation-template').html();
    $centralSection = $('.inte-centralSection');
    $formDonation = '';
    const $ongLinks = $('.inte-ONGlink');
    const $gotoLoginLink = $('.inte-goToLogin', firstStep$);// Selector that points to donation's form
    const $gotoUpgrade = $('.inte-goToUpgrade', firstStep$);

    $ongLinks.on('click', ongSelected);
    $gotoUpgrade.on('click', () => { redirectByQuadrigam(marketg, localeg, 'IRUPG'); });
    $gotoLoginLink.on('click', () => {
      // Path must be absolute to send it to old platform
      const url = `/integration/ibplus/login/?referralURL=${encodeURIComponent(window.location.pathname)}`;
      window.location.href = url;
    });

    const hideShowButtons = function () {
      const isLogged = isLogado();
      if (isLogged.userLogged && isLogged.userType === 'IBPLUS') {
        $ongLinks.removeClass('hidden');
        $gotoUpgrade.addClass('hidden');
        $gotoLoginLink.addClass('hidden');
      } // user is not logged
      else if (isLogged.userLogged && isLogged.userType === 'IBZERO') {
        $ongLinks.addClass('hidden'); // hide link for ONG 
        $gotoUpgrade.removeClass('hidden');
        $gotoLoginLink.addClass('hidden');
      } else {
        $ongLinks.addClass('hidden'); // hide link for ONG donation
        $gotoUpgrade.addClass('hidden');
        $gotoLoginLink.removeClass('hidden');
      }
    };
    $(document).on('loginEventWCS', hideShowButtons);
    hideShowButtons();
  };


  // Init element
  init();
}
aviosDonationForm();
