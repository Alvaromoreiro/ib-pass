import { setMaxAttachments, getBase64, showErrorModal } from '../general/ibe_inte-util';
import { isTokenExpired } from '../manage/ibe_logged-service';
import { common, changeformatdate } from '../manage/ibe_common';
import { getAppTokenForServices } from '../manage/ibe_anonymous-services';
import retrieveGlobalVariables from '../general/ibe_variables';
import * as SessionStorage from '../manage/SessionStorage';

const {
    localeg, marketg, quadrigam,
} = retrieveGlobalVariables();
const uploadedFiles = [];

function saleforceForms() {
  let serviceClaimOK = false;
  function setCookies(tokenData) {
    // Update cookies with new values
    const accessTo = new Date();
    const refreshTo = accessTo;
    refreshTo.setSeconds(refreshTo.getSeconds() + tokenData.refresh_expires_in);
    accessTo.setSeconds(accessTo.getSeconds() + tokenData.expires_in);
    Cookies.set('IBERIACOM_Claims_REFRESH', tokenData.refresh_token, { path: '/', expires: refreshTo, sameSite: 'strict' });
    Cookies.set('IBERIACOM_Claims_ACCESS', tokenData.access_token, { path: '/', expires: accessTo, sameSite: 'strict' });
  }
  // Token claims service
  function callTokenServiceClaims(serviceUrl, clientID, clientSecret, params) {
    const headers = {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Authorization: `Basic ${btoa(`${clientID}:${clientSecret}`)}`,
    };
    return $.ajax({
      url: serviceUrl,
      xhrFields: {
        withCredentials: true
      },
      type: 'POST',
      data: params,
      datatype: 'json',
      contentType: 'application/x-www-form-urlencoded',
      headers,
    });
  }
  function generateAnonymousTokenClaims(serviceUrl, clientID, clientSecret) {
    return callTokenServiceClaims(serviceUrl, clientID, clientSecret, $.param({ grant_type: 'client_credentials' }));
  }
  function getAppTokenClaims(tokenURL, clientID, clientSecret) {
    const deferred = $.Deferred();
    const cookieAccessToken = Cookies.get('IBERIACOM_Claims_ACCESS');
    const cookieRefreshToken = Cookies.get('IBERIACOM_Claims_REFRESH');
    if (!cookieRefreshToken || isTokenExpired(cookieRefreshToken)) {
      if (!cookieAccessToken) {
        generateAnonymousTokenClaims(tokenURL, clientID, clientSecret).done((tokenResponse) => {
          setCookies(tokenResponse);
          deferred.resolve(tokenResponse.access_token);
        });
      } else {
        deferred.resolve(cookieAccessToken);
      }
    } else {
      deferred.resolve(cookieAccessToken);
    }
    return deferred.promise();
  }
    const showSecondFormHTML = (e) => {
        const selec = e.elemt !== undefined ? $(e.elemt) : $(e.target);
        const ori = e.origin !== undefined ? e.origin : e.data.origin;
        const parentForm = selec.closest('.inte-contentClaims').length > 0 ? `#${selec.closest('.inte-contentClaims').attr('id')}` : undefined;
        const selectedValue = $(`${parentForm} .inte-claim-type`).val();
        if (selectedValue === 'Equipaje') {
          $(`${parentForm} .inte-pir-date input`).attr('required', 'true');
        } else {
          $(`${parentForm} .inte-pir-date input`).removeAttr('required');
        }
        if (parentForm !== undefined && ($('.inte-claims').length <= 0)) {
          $(`${parentForm} .inte-elementshowhide`).removeClass('hidden');
          $(`${parentForm} .inte-divSubmit`).removeClass('hidden');
        } else if (parentForm !== undefined && ori === 'button' && dFrontJs.ibe_validate.validateForm(`${parentForm} .inte-claims`)) {
          $(`${parentForm} .inte-slcClaimType`).addClass('ibe_form__group--disabled blockElement');
          $(`${parentForm} .inte-claim-type`).selectmenu('disable');
          $(`${parentForm} .inte-slcClaimReason`).addClass('ibe_form__group--disabled');
          $(`${parentForm} .inte-claim-reason00`).selectmenu('disable');
          // $(parentForm + ' .inte-pir input').addClass('ibe_form__group--disabled');
          $(`${parentForm} .inte-pir`).attr('placeholder', ''); // mod
          $(`${parentForm} .inte-pir`).prop('readonly', true);
          if ($(`${parentForm} .inte-claim-type`).val() === 'Equipaje') { // mod
            $('#divInformation1').addClass('hidden');
            $('#divInformation2').addClass('hidden');
          }
          $(`${parentForm} .inte-divContinue`).addClass('hidden');
          $(`${parentForm} .inte-elementshowhide`).removeClass('hidden');

          if (selectedValue !== 'Cancelación' && selectedValue !== 'Retraso') {
            $('#divMoreInformation').removeClass('hidden');
          }
          $(`${parentForm} .inte-divSubmit`).removeClass('hidden');
        } else if (parentForm !== undefined && ori === 'button') {
          $(`${parentForm} .inte-claims`).find('.ibe_form__group--error')[0].scrollIntoView();
        }
        setMaxAttachments(parentForm);

        //COMPROBACION SI ES ONBUSINESS PARA MOSTRAR CAMBIOS EN CAMPO NUM IBPLUS
        var reason = $(`${parentForm} select[id*=claim-reason]`).val();
        var $input_num_member = $("[name=iberianum]");
        if(reason.includes("OnBusiness")){
          let input_plholder = $("#loggedUserDefaults").attr("data-num-OnBusiness");
          $input_num_member.prop("placeholder", input_plholder);
          $("label[for="+ $input_num_member.attr("id") +"]").text(input_plholder);
          $input_num_member.attr("data-validator", "onBusiness");

        } else {
          let input_plholder = $("#loggedUserDefaults").attr("data-num-IBPlus");
          $input_num_member.prop("placeholder", input_plholder);
          $("label[for="+ $input_num_member.attr("id") +"]").text(input_plholder);
          $input_num_member.attr("data-validator", "ibePlus");
        }

        // CLAIMS FUNCTIONALITY - FORM COMPROBACION SI ES MODIFICAICON Y IBPLUSJOVEN
        const $tipo = $('select[name="claim-type"]');
        const $motivo = $('select[name="claim-reason00"]');
        const $numIberia = $('input[name="iberianum"]');
        const activar = $tipo.val() === 'Modificación/actualización' && $motivo.val() === 'Datos del programa Iberia Club/Iberia Joven';

        if ($tipo.val() === 'Modificación/actualización' && $motivo.val() === 'Datos del programa Iberia Club/Iberia Joven') {
            $numIberia.prop('required', activar).attr('aria-required', activar);
        }
    };
  function callPostBaggage(baggageURL, baggageData, tokenDataClaims) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Authorization: `Bearer ${tokenDataClaims}`,
    };

    return $.ajax({
      url: baggageURL,
      xhrFields: {
        withCredentials: true
      },
      type: 'POST',
      headers,
      data: JSON.stringify(baggageData),
    });
  }

  function pushBaggageService(baggageURL, baggageData, tokenDataClaims) {
    const deferred = $.Deferred();
    callPostBaggage(baggageURL, baggageData, tokenDataClaims).done((data) => {
      deferred.resolve(data);
    }).fail((error) => {
      deferred.reject({ status: error.status, data: error.responseJSON });
    });
    return deferred.promise();
  }
  function callPostClaimant(claimantURL, pnr, tkt, tokenDataClaims) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Authorization: `Bearer ${tokenDataClaims}`,
    };
    const data = {
      pnr,
      ticketNumber: tkt,
    };
    return $.ajax({
      url: claimantURL,
      xhrFields: {
        withCredentials: true
      },
      type: 'POST',
      headers,
      data: JSON.stringify(data),
    });
  }
  function pushClaimantService(claimantURL, pnr, tkt, tokenDataClaims) {
    const deferred = $.Deferred();
    callPostClaimant(claimantURL, pnr, tkt, tokenDataClaims).done((data) => {
      deferred.resolve(data);
    }).fail((error) => {
      deferred.reject({ status: error.status, data: error.responseJSON });
    });
    return deferred.promise();
  }
  function refreshAnonymousTokenClaims(serviceUrl, clientID, clientSecret, refreshToken) {
    const params = $.param({ grant_type: 'refresh_token', refresh_token: refreshToken });
    return callTokenServiceClaims(serviceUrl, clientID, clientSecret, params);
  }

  function refreshTokenClaims(tokenURL, clientID, clientSecret) {
    const deferred = $.Deferred();
    const refreshToken = Cookies.get('IBERIACOM_Claims_REFRESH');
    let refreshTokenPromise;
    if (refreshToken && !isTokenExpired(refreshToken)) {
      refreshTokenPromise = refreshAnonymousTokenClaims(tokenURL, clientID, clientSecret,
        refreshToken);
      refreshTokenPromise.done((tokenData) => {
        setCookies(tokenData);
        deferred.resolve();
      });
      refreshTokenPromise.fail(() => {
        generateAnonymousTokenClaims(tokenURL, clientID, clientSecret).done((tokenResponse) => {
          setCookies(tokenResponse);
          deferred.resolve();
        });
      });
    } else {
      generateAnonymousTokenClaims(tokenURL, clientID, clientSecret).done((tokenResponse) => {
        setCookies(tokenResponse);
        deferred.resolve();
      });
    }
    return deferred.promise();
  }
  function callClaimantService(claimantURL, pnr, tkt, clientID,
    clientSecret, claimsTokenURL, tokenDataClaims) {
    const deferred = $.Deferred();
    let currentAttemps = 0;

    function callClaimantServiceInside(claimantURLin, pnrin, tktin, clientIDin,
      clientSecretin, claimsTokenURLin) {
      const pushClaimantPromise = pushClaimantService(claimantURL, pnr, tkt, tokenDataClaims);
      pushClaimantPromise.done((response) => {
        deferred.resolve(response);
      });
      pushClaimantPromise.fail((error) => {
        if (error.status === 401) {
          if (currentAttemps < common.MAX_ATTEMPSCLAIMS) {
            currentAttemps += 1;
            refreshTokenClaims(claimsTokenURL, clientID, clientSecret).done(() => {
              getAppTokenClaims(claimsTokenURL, clientID, clientSecret).done((tokenData) => {
                callClaimantServiceInside(claimantURLin, pnrin, tktin, clientIDin, clientSecretin,
                  claimsTokenURLin, tokenData);
              });
            });
          } else {
            deferred.reject();
          }
        } else {
          deferred.reject();
        }
      });
      return deferred.promise();
    }
    return callClaimantServiceInside(claimantURL, pnr, tkt, clientID, clientSecret,
      claimsTokenURL, tokenDataClaims);
  }
  const checkPnrTkt = (e, formparent, clientID, clientSecret, claimsTokenURL, tokenDataClaims) => {
    const tkt = $(`${formparent} .inte-ticket-num`).val().replace('-', '');
    const pnr = $(`${formparent} .inte-res-code`).val().toUpperCase();
    const claimantURL = $(`${formparent} .inte-ClaimProperties`).attr('claimant');
    const callclaimant = callClaimantService(claimantURL, pnr, tkt, clientID, clientSecret,
      claimsTokenURL, tokenDataClaims);

    callclaimant.done((resp) => {
      serviceClaimOK = true;
      $(`${formparent} .inte-res-code`).addClass('ibe_form__group--disabled').attr('disabled', 'disabled');
      $(`${formparent} .inte-ticket-num`).addClass('ibe_form__group--disabled').attr('disabled', 'disabled');
      $(`${formparent} .inte-claimsPart2`).attr('goldenRecordID', resp.goldenRecordID);
      $(`${formparent} .inte-claimsPart2`).attr('pnrdate', resp.pnrdate);
      const lengthFlightDetails = resp.flightDetails ?  resp.flightDetails.length: 0;
      if (lengthFlightDetails > 0) {
        $(`${formparent} .inte-line-segment`).removeClass('ibe_form__box--claim ibe_form__box--claim-short');
        $(`${formparent} .inte-check-flight`).removeClass('hidden');
        $(`${formparent} .inte-flight-details`).remove();
        const $flightParent = $(`${formparent} [data-flight="parent"]`);
        let segmentOD;
        let radioInput;
        const addNewFlight = (id, index) => {
          let html = $(id).html();
          html = html.replace(/{{index}}/g, index);
          return html;
        };
        for (let i = 0; i < lengthFlightDetails; i += 1) {
          // Paste <li> html to complete with data
          $flightParent.append(addNewFlight('[data-flight="child"]', i));
          // Select radio input to print
          radioInput = $(`${formparent} .inte-segment-group-${i} input`);

          if (resp.flightDetails[i].segmentOrigin && resp.flightDetails[i].segmentDestination) {
            segmentOD = `${resp.flightDetails[i].segmentOrigin} - ${resp.flightDetails[i].segmentDestination}`;
            $(`${formparent} .inte-segment-group-${i} .inte-segment-OD`).text(segmentOD);
          }
          if (resp.flightDetails[i].cabinClassIndicator) {
            $(`${formparent} .inte-segment-group-${i} .inte-fares`).text(resp.flightDetails[i].cabinClassIndicator);
            radioInput.attr('data-segmt-cabine', resp.flightDetails[i].cabinClassIndicator);
          }
          if (resp.flightDetails[i].flightNumber) {
            $(`${formparent} .inte-segment-group-${i} .inte-numFlight`).text(resp.flightDetails[i].flightNumber);
            if (resp.flightDetails[i].flightNumber.indexOf('IB') !== -1) {
              $(`${formparent} .inte-segment-group-${i} .ibe-datos-vuelo__img`).removeClass('hidden');
            }
            radioInput.attr('data-segmt-num', resp.flightDetails[i].flightNumber);
          }

          if (resp.flightDetails[i].journeyOrigin) {
            radioInput.attr('data-segmt-origin', resp.flightDetails[i].journeyOrigin);
          }
          if (resp.flightDetails[i].journeyDestination) {
            radioInput.attr('data-segmt-dest', resp.flightDetails[i].journeyDestination);
          }
          if (resp.flightDetails[i].flightDate) {
            radioInput.attr('data-segmt-date', resp.flightDetails[i].flightDate);
          }
        }
        // Default checked first flight
        $('[data-flight="parent"] > li input').first().attr('checked', true);
      }
      // Passenger data auto-fill
      if( resp.passengerDetails ) {
        if (resp.passengerDetails.passengerName || resp.passengerDetails.passengerSurname) {
          $(`${formparent} .inte-segment-name`).removeClass('hidden');
          const passenger = `${resp.passengerDetails.passengerName} ${resp.passengerDetails.passengerSurname}`;
          $(`${formparent} .inte-segment-name`).text(passenger);
        }
        if (resp.passengerDetails.passengerName) {
          $(`${formparent} .inte-name`).val(resp.passengerDetails.passengerName);
          $(`${formparent} .inte-name`).addClass('ibe_form__group--disabled ibe_form__group--content').attr('disabled', 'disabled');
        }
        if (resp.passengerDetails.passengerSurname) {
          $(`${formparent} .inte-surname`).val(resp.passengerDetails.passengerSurname);
          $(`${formparent} .inte-surname`).addClass('ibe_form__group--disabled').attr('disabled', 'disabled');
        }
        if (resp.passengerDetails.telephoneNumber) {
          $(`${formparent} .inte-phone-num`).val(resp.passengerDetails.telephoneNumber);
          $(`${formparent} .inte-phone-num`).addClass('ibe_form__group--disabled').attr('disabled', 'disabled');
        }
        if (resp.passengerDetails.email){
          $(`${formparent} .inte-mail`).val(resp.passengerDetails.email);
        }
        let frequentFlyer = resp.passengerDetails.frequentFlyerID;
        if (frequentFlyer !== undefined && frequentFlyer.indexOf('IB/') !== -1 && frequentFlyer.length === 8) {
          frequentFlyer = frequentFlyer.replace('IB/', '');
          $(`${formparent} .inte-iberianum`).val(frequentFlyer);
          $(`${formparent} .inte-iberianum`).addClass('ibe_form__group--disabled').attr('disabled', 'disabled');
        }
        if (resp.passengerDetails.countryofResidence) {
          const residence = resp.passengerDetails.countryofResidence;
          const $resi = $(`${formparent} .inte-residence`);
          $resi.find(`option[value=${residence}]`).prop('selected', true);
          $resi.selectmenu('refresh');
          $resi.selectmenu('disable');
          $resi.parent('div').addClass('ibe_form__group--disabled');
        }
        if (resp.passengerDetails.identificationDocumentNumber) {
          $(`${formparent} .inte-docnum02`).val(resp.passengerDetails.identificationDocumentNumber)
            .addClass('ibe_form__group--disabled').attr('disabled', 'disabled');
        }
      }
      showSecondFormHTML(e);
      dFrontJs.ibe_inputs.init();
      dFrontJs.ibe_loading.close('body');
      $(`${formparent} .inte-claimsPart2`)[0].scrollIntoView();
    });

    // If service call fail
    callclaimant.fail(() => {
      dFrontJs.ibe_loading.close('body');
      // kofirsttry TRUE if the first modal has already been shown // SI en boton Continuar
      const kofirsttry = $(`${formparent} .inte-btnContinue`).hasClass('inte-kofirsttry');
      if (!kofirsttry) {
        // Show modal for first time
        $('.inte-first-modal-error').dialog().dialog('open');
      } else if (kofirsttry) {
        // Show second modal
        $('.inte-second-modal-error').dialog().dialog('open');
        // Block PNR and TKT
        $(`${formparent} .inte-res-code`).attr('disabled', 'disabled').addClass('ibe_form__group--disabled');
        $(`${formparent} .inte-ticket-num`).attr('disabled', 'disabled').addClass('ibe_form__group--disabled');
      }
    });
    callclaimant.always(() => {
      const dataFormsHidden = $(`${formparent} .inte-claimsPart2 [data-forms-hidden]`);
      const dataFormsHiddenService = $(`${formparent} .inte-claimsPart2 [data-forms-serviceOK-hidden]`);
      const dataFormsNotRequired = $(`${formparent} .inte-claimsPart2 [data-forms-not-required]`);
      const selectedType = $(`${formparent} .inte-claim-type`).val();
      if (dataFormsHidden.length > 0) {
        const types = dataFormsHidden.attr('data-forms-hidden');
        if (types.indexOf(selectedType) >= 0) {
          if (serviceClaimOK === true) {
            dataFormsHidden.hide();
          } else {
            const typesOK = dataFormsHiddenService.attr('data-forms-serviceOK-hidden');
            if (typesOK.indexOf('serviceOK') >= 0) {
              dataFormsHiddenService.hide();
              $(formparent).find('input.inte-uploadfile').attr('required', 'true');
            }
          }
        }
      } else if (dataFormsNotRequired.length > 0) {
        const types = dataFormsNotRequired.attr('data-forms-not-required');
        if (types.indexOf(selectedType) >= 0) {
          dataFormsNotRequired.removeAttr('required').siblings("[data-validate='exist']").remove();
        }
      }
    });
  };// checkPnrTkt

  function callBaggageService(formparent, baggageactiveURL, baggageinactiveURL, baggageData,
    isperhapsBaggageInactive, clientID, clientSecret, claimsTokenURL, tokenDataClaims) {
    const deferred = $.Deferred();
    let pushBaggagePromise;
    let currentAttemps = 0;

    function callBaggageServiceInside(formparentin, baggageactiveURLin, baggageinactiveURLin,
      clientIDin, clientSecretin, claimsTokenURLin, tokenDataClaimsin) {
      let isperhapsBaggageInactiveAux = isperhapsBaggageInactive;
      const baggageDataAux = baggageData;
      if (isperhapsBaggageInactiveAux) {
        pushBaggagePromise = pushBaggageService(baggageactiveURL, baggageData, tokenDataClaims);
      } else {
        pushBaggagePromise = pushBaggageService(baggageinactiveURL, baggageData, tokenDataClaims);
      }
      pushBaggagePromise.done((response) => {
        if (response.success === true) {
          // Continue with flow, validate PNR and TKT and show second form.
          // Avoid user to change PIR or date once it is OK.
          $('.inte-pir input').attr('data-valid-pir', 'true').attr('disabled', 'disabled').addClass('ibe_form__group--disabled');
          $('.inte-pir-date input').parent().addClass('ibe_form__group--disabled');
          $('.inte-pir-date input').attr('disabled', 'disabled');
          $(`${formparent} .inte-slcClaimType`).addClass('ibe_form__group--disabled blockElement');
          $(`${formparent} .inte-claim-type`).selectmenu('disable');
          $(`${formparent} .inte-slcClaimReason`).addClass('ibe_form__group--disabled');
          $(`${formparent} .inte-claim-reason00`).selectmenu('disable');
          checkPnrTkt({ elemt: formparent, origin: 'button' }, formparent, clientID, clientSecret, claimsTokenURL, tokenDataClaims);
          deferred.resolve();
        } else if (response.success === false && isperhapsBaggageInactiveAux) {
          // Call inactive baggage service.
          isperhapsBaggageInactiveAux = false; // Do not enter again.
          if (baggageDataAux.recordId.recordType === 'DAMAGED') {
            // It is necessary, some service has recordID, agentID and some has recordId, agentId.
            baggageDataAux.recordID = baggageDataAux.recordId;
            delete baggageDataAux.recordId;
            baggageDataAux.agentID = baggageDataAux.agentId;
            delete baggageDataAux.agentId;
          }

          baggageDataAux.date = $('.inte-pir-date input').val() ? changeformatdate($('.inte-pir-date input').val(), $('.inte-pir-date input').attr('data-format'), 'yyyy-mm-dd') : undefined;

          callBaggageServiceInside(formparentin, baggageactiveURLin, baggageinactiveURLin,
            baggageDataAux, isperhapsBaggageInactiveAux, clientIDin, clientSecretin,
            claimsTokenURLin, tokenDataClaimsin);
        } else {
          // Then Show modal telling to review PIR.
          dFrontJs.ibe_loading.close('body');
          $('.fc-dialog-pir').dialog().dialog('open');
          deferred.reject();
        }
      });
      pushBaggagePromise.fail((error) => {
        if (error.status === 401) {
          if (currentAttemps < common.MAX_ATTEMPSCLAIMS) {
            currentAttemps += 1;
            refreshTokenClaims(claimsTokenURL, clientID, clientSecret).done(() => {
              getAppTokenClaims(claimsTokenURL, clientID, clientSecret).done((tokenData) => {
                callBaggageServiceInside(formparent, baggageactiveURL, baggageinactiveURL,
                  baggageData, isperhapsBaggageInactive, clientID, clientSecret, claimsTokenURL,
                  tokenData);
              });
            });
          } else {
            dFrontJs.ibe_loading.close('body');
            $('.fc-dialog-pir').dialog().dialog('open');
            deferred.reject();
          }
        } else {
          dFrontJs.ibe_loading.close('body');
          $('.fc-dialog-pir').dialog().dialog('open');
          deferred.reject();
        }
      });
      return deferred.promise();
    }
    return callBaggageServiceInside(formparent, baggageactiveURL, baggageinactiveURL, baggageData,
      isperhapsBaggageInactive, clientID, clientSecret, claimsTokenURL, tokenDataClaims);
  }

  // Funcion mostrar el segundo formulario de claims sin llamar a servicios, para el formulario de contacto
  function showsecondFormClaims(e){
    const $formparent = $(e.target).closest('.inte-contentClaims');

    const ticketNum = ($formparent.find('.inte-ticket-num').val() || '').trim();
    const resCode = ($formparent.find('.inte-res-code').val() || '').trim();
    if (ticketNum === '' || resCode === '') {
        if (ticketNum === '') {
            $formparent.find('.inte-ticket-num').focus();
        } else {
            $formparent.find('.inte-res-code').focus();
        }
        return false;
    }
    showSecondFormHTML(e);
    $formparent.find('.inte-ticket-num').addClass('ibe_form__group--disabled').prop('disabled', true);
    $formparent.find('.inte-res-code').addClass('ibe_form__group--disabled').prop('disabled', true);
    
    return true;
  }

  function showsecondform(e) {
    const formparent = `#${$(e.target).closest('.inte-contentClaims').attr('id')}`;
    const reqType = $(`${formparent} .inte-ClaimProperties`).attr('requestType');
    const ori = e.origin !== undefined ? e.origin : e.data.origin;

    if (ori === 'button') {
      if (dFrontJs.ibe_validate.validateForm(`${formparent} .inte-claims`)) {
        const selectedType = $(`${formparent} .inte-claim-type`).val();
        // If is not necessary check again if second modal has already  been shown
        const doneshowingsecondmodal = $('.inte-second-modal-error').hasClass('inte-doneshowingsecondmodal');

        if (reqType === 'Claims' && !doneshowingsecondmodal) {
          const $properties = $(`${formparent} .inte-ClaimProperties`);
          const claimsTokenURL = $properties.attr('claimsTokenURL');
          const clientID = $properties.attr('clientID');
          const clientSecret = $properties.attr('clientSecret');
          dFrontJs.ibe_loading.open('body');
          window.scrollTo(0, 0);
          getAppTokenClaims(claimsTokenURL, clientID, clientSecret).done((tokenDataClaims) => {
            /* If it is baggage type, check if PIR has been validated before
            (show modal if not and stop).If so, check pnr and tkt. Show a loading in the meanwhile.
              const isPirOK = true; */
            const $pir = $(`${formparent} .inte-pir input`);
            if (selectedType === 'Equipaje' && $pir.attr('data-valid-pir') !== 'true') {
              let baggageactiveURL;
              let baggageinactiveURL;
              let bagRecordType;
              // Different services to call depending on subtype.
              if ($(`${formparent} .inte-claim-reason00`).val() === 'Demora') {
                baggageactiveURL = $properties.attr('baggageActiveDelayed');
                baggageinactiveURL = $properties.attr('baggageInactiveDelayed');
                bagRecordType = 'DELAYED';
              } else {
                baggageactiveURL = $properties.attr('baggageActiveDamaged');
                baggageinactiveURL = $properties.attr('baggageInactiveDamaged');
                bagRecordType = 'DAMAGED';
              }
              const pirUpCs = $pir.val().toUpperCase();
              const baggageData = {
                recordId: {
                  recordType: bagRecordType,
                  recordReference: {
                    stationCode: pirUpCs.substring(0, 3),
                    airlineCode: pirUpCs.substring(3, 5),
                    referenceNumber: pirUpCs.substring(5, 10),
                  },
                },
                agentId: 'Web',
              };
              callBaggageService(formparent, baggageactiveURL, baggageinactiveURL, baggageData,
                true, clientID, clientSecret, claimsTokenURL, tokenDataClaims);
            } else {
              checkPnrTkt(e, formparent, clientID, clientSecret, claimsTokenURL, tokenDataClaims);
            }
          });
        } else {
          showSecondFormHTML(e);
        }
      } else {
        $(`${formparent} .inte-claims`).find('.ibe_form__group--error')[0].scrollIntoView();
      }
    } else {
      showSecondFormHTML(e);
    }
  }

  /* const addNewFlight = (id, index) => {
    let html = $(id).html();
    html = html.replace(/{{index}}/g, index);
    return html;
  }; */
  // Call countries services
  function CallCountriesList(serviceUrl, authorizationToken) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept-Language': `${localeg}-${marketg}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Authorization: `Bearer ${authorizationToken}`,
    };
    return $.ajax({
      url: serviceUrl,
      xhrFields: {
        withCredentials: true
      },
      type: 'GET',
      headers,
    });
  }
  function getCountriesListService(serviceUrl, authorizationToken) {
    const deferred = $.Deferred();
    CallCountriesList(serviceUrl, authorizationToken).done((data) => {
      deferred.resolve(data);
    }).fail((error) => {
      deferred.reject({ status: error.status, data: error.responseJSON });
    });
    return deferred.promise();
  }
  function getCountriesList(countriesURL, globalAppToken, tokenURL, authorizationToken) {
    let curr = 0;
    function getCountriesListInside(authorizationTokenAux) {
      const getCountriesListPromise = getCountriesListService(countriesURL, authorizationTokenAux);
      getCountriesListPromise.done((response) => {
        const size = response.length;
        const options = [];
        for (let i = 0; i < size; i += 1) {
          options.push(`<option value="${response[i].isoCode}">${response[i].description}</option>`);
        }
        $('.inte-residence').append(options.join('')).selectmenu();
        $('.inte-residence').selectmenu('refresh');
      });
      getCountriesListPromise.fail((error) => {
        if (error.status === 401) {
          if (curr < common.MAX_ATTEMPSCLAIMS) {
            SessionStorage.remove('anonymousTokenForService');
            curr += 1;
            getAppTokenForServices(globalAppToken, tokenURL).done((tokenData) => {
              getCountriesListInside(tokenData);
            });
          }
        }
      });
    }
    return getCountriesListInside(authorizationToken);
  }
  // Create claim service
  function callPostClaims(serviceUrl, authorizationToken, requestData) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      'Accept-Language': localeg,
      Authorization: `Bearer ${authorizationToken}`,
    };
    return $.ajax({
      url: serviceUrl,
      xhrFields: {
        withCredentials: true
      },
      type: 'POST',
      headers,
      data: JSON.stringify(requestData),
    });
  }
  function pushClaimService(serviceUrl, authorizationToken, requestData) {
    const deferred = $.Deferred();
    callPostClaims(serviceUrl, authorizationToken, requestData).done((data) => {
      deferred.resolve(data);
    }).fail((error) => {
      deferred.reject({ status: error.status, data: error.responseJSON });
    });
    return deferred.promise();
  }
  function handleErrorClaims(error) {
    let defaultErrorText = $('#pComentErrorHttp').text();
    if (error.status === 400) {
      $('#h2Paramerror').removeClass('hidden');
      $('#pComentErrorParam').removeClass('hidden');
    } else {
      if (defaultErrorText.indexOf(')') > -1) {
        defaultErrorText = defaultErrorText.substring(0, defaultErrorText.indexOf('('));
      }

      $('#h2Httperror').removeClass('hidden');
      $('#pComentErrorHttp').text(`${defaultErrorText} (${error.status}).`);
      $('#pComentErrorHttp').removeClass('hidden');
      $('#h2Paramerror').addClass('hidden');
      $('#pComentErrorParam').addClass('hidden');
    }
    $('.inte-btnSendClaim').prop('disabled', false);
    // close loading
    dFrontJs.ibe_loading.close('body');
    $('.fc-dialog-claim-error').dialog().dialog('open');
  }
  // Search claim service
  function callPostSearchClaims(serviceUrl, authorizationToken, requestData) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      'Accept-Language': localeg,
      Authorization: `Bearer ${authorizationToken}`,
    };
    return $.ajax({
      url: serviceUrl,
      xhrFields: {
        withCredentials: true
      },
      type: 'POST',
      headers,
      data: JSON.stringify(requestData),
    });
  }
  function pushSearchClaimService(serviceUrl, authorizationToken, requestData) {
    const deferred = $.Deferred();
    callPostSearchClaims(serviceUrl, authorizationToken, requestData).done((data) => {
      deferred.resolve(data);
    }).fail((error) => {
      deferred.reject({ status: error.status, data: error.responseJSON });
    });
    return deferred.promise();
  }
  function removeDataFromSearchForm(formparent) {
    $(`${formparent} .inte-ref01`).val('');// mod
    $(`${formparent} .inte-lastname01`).val('');// mod
    $(`${formparent} .inte-document-type`).val('');// mod
    $(`${formparent} .inte-document-type`).selectmenu('destroy');
    dFrontJs.ibe_selectmenu.init();
    /* $('label[for="document-type-button"]').removeClass('ibe_form__selectize--label02');
      Pendiente revisar */
    $(`${formparent} .inte-docnum01`).val('');
    $(`${formparent} .inte-ref01`).parent().removeClass('ibe_form__group--content');
    $(`${formparent} .inte-lastname01`).parent().removeClass('ibe_form__group--content');
    $(`${formparent} .inte-document-type`).parent().removeClass('ibe_form__group--content');
    $(`${formparent} .inte-docnum01`).parent().removeClass('ibe_form__group--content');
  }
  function pushSearchClaim(searchClaimURL, searchClaimRequest, clientID, clientSecret,
    claimsTokenURL, authoritationToken, formparent) {
    const deferred = $.Deferred();// TODO: Promesa no necesaria no se espera return
    let curr = 0;

    function pushSearchClaimInside(authoritationTokenAux) {
      const pushSearchClaimPromise = pushSearchClaimService(searchClaimURL, authoritationTokenAux,
        searchClaimRequest);
      function pushSearchClaimPromiseSuccess(response) {
        let insertArea = $('.inte-TabModule').length > 0 ? '.inte-TabModule' : '.inte-contentClaims';
        if ($(insertArea).length === 0) {
          insertArea = '.inte-confirmation';
        }
        $(`${formparent} .inte-claims`).addClass('hidden');
        $.ajax({
          headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
          encoding: 'UTF-8',
          method: 'GET',
          url: '/cs/Satellite',
          data: {
            pagename: 'IB_SE/CacheControl0s/BrowserCache10800/Forms/State',
            market: marketg,
            locale: localeg,
            claimtype: encodeURI(response.case.reasonType),
            claimsubtype: response.case.reasonSubType ? encodeURI(response.case.reasonSubType) : '',
          },
          success(data) {
            removeDataFromSearchForm(formparent);
            $(`${formparent} .inte-claims`).addClass('hidden');
            $(insertArea).html(data);
            const d = new Date(response.case.createdDate);
            $('#createdDate')[0].innerText = `${d.getDate()}/${d.getMonth() + 1}`;
            $('#caseid')[0].innerText = response.case.caseId;
            if (response.case.caseDescription) {
              $('#pcomentarios')[0].innerText = response.case.caseDescription;
            }
            switch (response.case.status) {
              case 'Abierto':
                $('#liOpen').addClass('check');
                break;
              case 'Cancelado':
                $('#liOpen').addClass('check');
                $('#liProgress').addClass('check');
                $('#liClosed').addClass('check');
                break;
              case 'Cerrado':
                $('#liOpen').addClass('check');
                $('#liProgress').addClass('check');
                $('#liClosed').addClass('check');
                break;
              default:
                $('#liOpen').addClass('check');
                $('#liProgress').addClass('check');
            }
            // close loading
            dFrontJs.ibe_loading.close('body');
            window.scrollTo(0, 0);
            $('body').removeClass('modal-open');
          },
          error() {
          },
        });
        deferred.resolve();
      }
      function pushSearchClaimPromiseFail(error) {
        if (error.status === 401) {
          if (curr < common.MAX_ATTEMPSCLAIMS) {
            curr += 1;
            // SessionStorage.set('anonymousTokenClaims', '');
            refreshTokenClaims(claimsTokenURL, clientID, clientSecret).done(() => {
              getAppTokenClaims(claimsTokenURL, clientID, clientSecret).done((tokenData) => {
                pushSearchClaimInside(tokenData);
              });
            });
          } else {
            handleErrorClaims(error);
            deferred.reject();
          }
        } else {
          handleErrorClaims(error);
          deferred.reject();
        }
      }
      pushSearchClaimPromise.done(pushSearchClaimPromiseSuccess);
      pushSearchClaimPromise.fail(pushSearchClaimPromiseFail);
      return deferred.promise();
    }
    return pushSearchClaimInside(authoritationToken);
  }
  const tostateClaim = function stc() {
    // open loading
    dFrontJs.ibe_loading.open('body');
    window.scrollTo(0, 0);
    const formparentsend = `#${$('.inte-toStateClaim').closest('.inte-contentClaims').attr('id')}`;
    const searchClaimURL = $('.inte-ClaimSearchProperties').attr('seachClaim-end');
    const claimsTokenURL = $('.inte-ClaimSearchProperties').attr('claimsTokenURL');
    const clientID = $('.inte-ClaimSearchProperties').attr('clientID');
    const clientSecret = $('.inte-ClaimSearchProperties').attr('clientSecret');
    getAppTokenClaims(claimsTokenURL, clientID, clientSecret).done((tokenDataClaims) => {
      pushSearchClaim(searchClaimURL, this, clientID, clientSecret, claimsTokenURL,
        tokenDataClaims, formparentsend);
    });
  };
  function pushClaim(claimsURL, claimRequest, clientID, clientSecret, claimsTokenURL,
    authoritationToken, formparent) {
    const deferred = $.Deferred();
    const requestTypeCode = $(`${formparent} .inte-ClaimProperties`).attr('requestType');
    let curr = 0;
    function pushClaimInside(authoritationTokenAux) {
      const pushClaimPromise = pushClaimService(claimsURL, authoritationTokenAux, claimRequest);
      pushClaimPromise.done((response) => {
        const currentSearchClaim = {
          caseID: response.caseId,
          passengerLastName: claimRequest.passengerDetails.lastName,
          documentType: claimRequest.passengerDetails.documentType,
          documentNumber: claimRequest.passengerDetails.documentNumber,
        };

        removeDataFromSearchForm(formparent);
        $('#pResultCaseId')[0].innerText = response.caseId;
        if (requestTypeCode === 'Compensation') {
          $('.inte-compensation').replaceWith($('.inte-confirmation'));
        } else if (requestTypeCode === 'GDPR') {
          $('.inte-GDPR').replaceWith($('.inte-confirmation'));
        } else {
          $('.inte-load-formsJS').replaceWith($('.inte-confirmation'));
        }

        if (claimRequest.caseDetails.description) {
          $('#pComentarios')[0].innerText = claimRequest.caseDetails.description; // In CS Search
        }
        if (uploadedFiles.length > 0) {
          $('#divAttachments').removeClass('hidden'); // in CS Search
          for (let j = 0; j < uploadedFiles.length; j += 1) {
            $('#ulFiles').append(`<li class="ibe-list--circle__item">${uploadedFiles[j]}</li>`);
          }
        }
        $('.inte-confirmation').removeClass('hidden');
        // close loading
        dFrontJs.ibe_loading.close('body');
        window.scrollTo(0, 0);
        $('body').removeClass('modal-open');
        $('.inte-toStateClaim').on('click', tostateClaim.bind(currentSearchClaim));
        deferred.resolve();
      });
      pushClaimPromise.fail((error) => {
        if (error.status === 401) {
          if (curr < common.MAX_ATTEMPSCLAIMS) {
            curr += 1;
            // SessionStorage.remove('anonymousTokenClaims');
            refreshTokenClaims(claimsTokenURL, clientID, clientSecret).done(() => {
              getAppTokenClaims(claimsTokenURL, clientID, clientSecret).done((tokenData) => {
                pushClaimInside(tokenData);
              });
            });
          } else {
            handleErrorClaims(error);
            deferred.reject();
          }
        } else {
          handleErrorClaims(error);
          deferred.reject();
        }
      });
      return deferred.promise();
    }
    return pushClaimInside(authoritationToken);
  }
  function callServiceClaims(attachments, formparent) {
    let contact;
    // selectedType = $(`${formparent} .inte-claim-type`).val();
    const reqType = $(`${formparent} .inte-ClaimProperties`).attr('requestType');
    if (reqType !== 'GDPR') {
      if ($(`${formparent} .inte-check02`).is(':checked') || $(`${formparent} .inte-name02`).length <= 0) {
        contact = {
          contactName: $(`${formparent} .inte-name`).val(),
          contactLastName: $(`${formparent} .inte-surname`).val(),
          contactEmail: $(`${formparent} .inte-mail`).val(),
          contactPhone: $(`${formparent} .inte-phone-num`).val(),
          preferredContactChannel: $(`${formparent} .inte-contact-type`).val(),
        };
      } else {
        contact = {
          contactName: $(`${formparent} .inte-name02`).val(),
          contactLastName: $(`${formparent} .inte-surname02`).val(),
          contactEmail: $(`${formparent} .inte-mail02`).val(),
          contactPhone: $(`${formparent} .inte-phone-num02`).val(),
          preferredContactChannel: $(`${formparent} .inte-contact-type`).val(),
        };
      }
    }
    let bookingDet;
    let tkt;
    let pnr;
    if (reqType === 'Claims' && !$(`${formparent} .inte-check-flight`).hasClass('hidden')) {
      const $radiooption = $(`${formparent} input[name='radiooption']:checked`);
      tkt = $(`${formparent} .inte-ticket-num`).val().replace('-', '');
      pnr = $(`${formparent} .inte-res-code`).val().toUpperCase();
      bookingDet = {
        pnr,
        ticket: tkt,
        pir: $('#pir').val(),
        flightNumber: $radiooption.attr('data-segmt-num'),
        flightDate: $radiooption.attr('data-segmt-date'),
        flightClass: $radiooption.attr('data-segmt-cabine'),
        origin: $radiooption.attr('data-segmt-origin'),
        destination: $radiooption.attr('data-segmt-dest'),
        pnrdate: $(`${formparent} .inte-claimsPart2`).attr('pnrdate'),
      };
    } else {
      const $flgdate = $(`${formparent} .inte-date`);
      const flightDate = $flgdate.val() ? changeformatdate($flgdate.val(), $flgdate.attr('data-format'), 'yyyy-mm-dd') : undefined;
      const flightOrig = $(`${formparent} .inte-flight_origin`).val() ? $(`${formparent} .inte-flight_origin`)[0].value.split('(')[1].split(')')[0] : undefined;
      const flightDest = $(`${formparent} .inte-flight_destiny`).val() ? $(`${formparent} .inte-flight_destiny`)[0].value.split('(')[1].split(')')[0] : undefined;
      if (reqType !== 'GDPR') {
        tkt = $(`${formparent} .inte-ticket-num`).val().replace('-', '');
        pnr = $(`${formparent} .inte-res-code`).val().toUpperCase();
        bookingDet = {
          pnr,
          ticket: tkt,
          pir: $('#pir').val(),
          flightNumber: $(`${formparent} .inte-flight-num`).val().toUpperCase(),
          flightDate,
          flightClass: $(`${formparent} .inte-cabine`).val(),
          origin: flightOrig,
          destination: flightDest, // mismo que para la fecha
        };
      }
    }

    const claimRequest = {
      passengerDetails: {
        name: $(`${formparent} .inte-name`).val() ? $(`${formparent} .inte-name`).val() : '',
        lastName: $(`${formparent} .inte-surname`).val(),
        documentType: $(`${formparent} .inte-document-type02`).val(),
        documentNumber: $(`${formparent} .inte-docnum02`).val(),
        residenceCountry: $(`${formparent} .inte-residence`).val(),
        ibplusCardNumber: $(`${formparent} .inte-iberianum`).val() ? $(`${formparent} .inte-iberianum`).val() : undefined,
        ibplusCardLevel: $(`${formparent} .inte-level`).val() ? $(`${formparent} .inte-level`).val() : undefined,
        phone: $(`${formparent} .inte-phone-num`).val(),
        email: $(`${formparent} .inte-mail`).val(),
        country: marketg,
        language: localeg,
      },
      contactDetails: contact,
      bookingDetails: bookingDet,

      caseDetails: {
        caseOrigin: 'Web',
        description: $(`${formparent} .inte-textarea`).val(),
        reasonType: $(`${formparent} .inte-claim-type`).val(),
        reasonSubType: $(`${formparent} .inte-claim-reason00`).val(),
      },
      requestType: reqType,
      attachments,
    };
    const goldenRecordID = $(`${formparent} .inte-claimsPart2`).attr('goldenRecordID');
    if (pnr && tkt && goldenRecordID && reqType === 'Claims') {
      claimRequest.passengerDetails.goldenRecordID = goldenRecordID;
    }

    const claimsURL = $(`${formparent} .inte-ClaimProperties`).attr('claim-end');
    const claimsTokenURL = $(`${formparent} .inte-ClaimProperties`).attr('claimsTokenURL');
    const clientID = $(`${formparent} .inte-ClaimProperties`).attr('clientID');
    const clientSecret = $(`${formparent} .inte-ClaimProperties`).attr('clientSecret');
    if(claimRequest.caseDetails && claimRequest.caseDetails.reasonType && claimRequest.caseDetails.reasonType.length > 0 
    && ((claimRequest.caseDetails.reasonType !== 'Equipaje') || (claimRequest.caseDetails.reasonType === 'Equipaje' && bookingDet && bookingDet.pir && bookingDet.pir.length > 0 ))){
      getAppTokenClaims(claimsTokenURL, clientID, clientSecret).done((tokenDataClaims) => {
        pushClaim(claimsURL, claimRequest, clientID, clientSecret, claimsTokenURL, tokenDataClaims,
          formparent);
      });
    } else {
      showErrorModal(undefined,{ btnclose: true, btnaccept: true, closereload: true });
    }

    return true;
  }
  function GetAttachment(i, validatedFiles, attachments, formparent) {
    const numberFiles = validatedFiles.length;
    if (i < numberFiles) {
      getBase64(i, validatedFiles, (file64) => {
        const attachment = {
          body: file64.split(',')[1],
          description: `Adjunto ${i + 1}`,
          name: validatedFiles[i].name,
        };
        uploadedFiles.push(validatedFiles[i].name);
        attachments.push(attachment);
        if (attachments.length === validatedFiles.length || attachments.length > 2) {
          callServiceClaims(attachments, formparent);
        }
      });
    }
    return attachments;
  }
  // Function from result page.
  function blockClaimField(selector) {
    $(selector).val('');
    $(selector).addClass('ibe_form__group--disabled');
    $(selector).attr('placeholder', '');
    $(selector).prop('readonly', true);
    $(selector).prop('disabled', true);
    $(selector).removeAttr('required');
    $(selector).parent().removeClass('ibe_form__group--error');
    $(selector).parent().find('p').each(function ech() {
      if ($(this)[0].className.indexOf('hidden') === -1) {
        $(this).addClass('hidden');
      }
    });
  }
  function unblockClaimField(selector) {
    $(selector).val('');
    $(selector).removeClass('ibe_form__group--disabled');
    $(selector).prop('readonly', false);
    $(selector).prop('disabled', false);
    $(selector).attr('required', true);
  }

    // Remove PWA loading
    const loadingSelector = $('.inte-fullPage [data-alttext]');
    loadingSelector.html(loadingSelector.data('alttext'));

    if (quadrigam !== 'CEATCL') {
        showsecondform({ elemt: '.inte-claimsPart2', origin: 'html' });
        // OnClick del boton continuar formularios GDPR
        $('.inte-btnContinue').on('click', { origin: 'button' }, showsecondform);
    }

    // Provisional Form Relaciones-clientes nueva función schowSecondFormClaims
    // para mostrar el segundo formulario sin necesidad de llamar a servicios,
    // para el formulario de contacto
    if (quadrigam === 'CEATCL') {
        showsecondFormClaims({ elemt: '.inte-claimsPart2', origin: 'html' });
        $('.inte-btnContinue').removeClass('inte-btnContinue').addClass('inte-btnContinueCEATCL').on('click', { origin: 'button' }, showsecondFormClaims);
    }


  const urlParams = new URLSearchParams(window.location.search);
  let incidentType = urlParams.get("incident");
  if(incidentType != null){
    incidentType = incidentType.normalize("NFD").replaceAll(" ","").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  } else {
    incidentType = "";
  }
  
  let menuID = $("[name=claim-type]").attr("id");
  let spanSelected = $("#"+menuID+"-button .ui-selectmenu-text");
  let labelClaimType = $("[for="+menuID+"-button]");
  $("[name=claim-type] option").each(function(index, elem){
    let type = $(elem).val();
    type = type.normalize("NFD").replaceAll(" ","").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    if(type == incidentType){
      $(elem).attr("selected", "");
      $(spanSelected).html($(elem).html());
      $(labelClaimType).addClass("ibe_form__selectize--label02");
      $(labelClaimType).children("span").addClass("ibe_form__input-text--selectnew");
    }
  });

  // $('#id-tab-collapse-V-O').attr('data-close', 'outsideclick');
  // $('#id-tab-collapse-V-D').attr('data-close', 'outsideclick');
  // $('#aOficinas').attr("href",$("#ulHelpTools").find("a")[2].href);//mod
  // $('#aObjetosPerdidos').attr("href",$("#ulHelpTools").find("a")[4].href);//mod
  const countriesURL = $('.inte-ClaimProperties').attr('countriesURL');// It can come from any.
  if (countriesURL) {
    getAppTokenForServices(globalAppToken, tokenURL).done((tokenData) => {
      getCountriesList(countriesURL, globalAppToken, tokenURL, tokenData);
    });
  } 

  $('.inte-check02').change(function chn() {
    const slcparent = `#${$(this).closest('.inte-contentClaims').attr('id')}`;
    if ($(this).is(':checked')) {
      blockClaimField(`${slcparent} .inte-name02`);
      blockClaimField(`${slcparent} .inte-surname02`);
      blockClaimField(`${slcparent} .inte-mail02`);
      blockClaimField(`${slcparent} .inte-phone-num02`);
    } else {
      unblockClaimField(`${slcparent} .inte-name02`);
      unblockClaimField(`${slcparent} .inte-surname02`);
      unblockClaimField(`${slcparent} .inte-mail02`);
      unblockClaimField(`${slcparent} .inte-phone-num02`);
    }
  });

  $('.inte-document-type02').on('selectmenuchange', function selmenu() {
    const parentForm = `#${$(this).closest('.inte-contentClaims').attr('id')}`;
    let text; let
      docsent;
    if ($(`${parentForm} .inte-uploadfile`).attr('required') !== undefined && $(this).val() !== '') {
      text = $(this).find('option:selected').text();
      docsent = $(this).closest('.inte-contentClaims').find('.inte-docSentence');
      docsent.text(` ${text}`);
    } else if ($(this).val() !== '' && $(`${parentForm} .inte-ClaimProperties`).attr('requestType') === 'Requests') {
      text = $(this).find('option:selected').text();
      docsent = $(this).closest('.inte-contentClaims').find('.inte-docSentence');
      docsent.text(` ${text}`);
    }
  });

  $('.inte-btnSearchClaim').click(function clk(e) {
    e.preventDefault();
    const formparent = `#${$(this)[0].form.id}`;
    if (dFrontJs.ibe_validate.validateForm(formparent)) {
      // open loading
      dFrontJs.ibe_loading.open('body');
      window.scrollTo(0, 0);

      const searchClaimRequest = {
        caseID: $(`${formparent} .inte-ref01`).val(),
        passengerLastName: $(`${formparent} .inte-lastname01`).val(),
        documentType: $(`${formparent} .inte-document-type`).val(),
        documentNumber: $(`${formparent} .inte-docnum01`).val(),
      };

      const searchClaimURL = $(`${formparent} .inte-ClaimSearchProperties`).attr('seachClaim-end');
      const claimsTokenURL = $(`${formparent} .inte-ClaimSearchProperties`).attr('claimsTokenURL');
      const clientID = $(`${formparent} .inte-ClaimSearchProperties`).attr('clientID');
      const clientSecret = $(`${formparent} .inte-ClaimSearchProperties`).attr('clientSecret');

      getAppTokenClaims(claimsTokenURL, clientID, clientSecret).done((tokenDataClaims) => {
        pushSearchClaim(searchClaimURL, searchClaimRequest, clientID, clientSecret,
          claimsTokenURL, tokenDataClaims, formparent);
      });
    } else {
      $(formparent).find('.ibe_form__group--error')[0].scrollIntoView();
    }
  });

  $('.inte-btnSendClaim').click(function clk(e) {
    $(this).prop('disabled', true);
    e.preventDefault();
    const sltfromstring = `#${$(this)[0].form.id}`;
    const sltparentdiv = `#${$(this).closest('.inte-contentClaims').attr('id')}`;
    let validatedFiles = [];
    if (dFrontJs.ibe_validate.validateForm(sltfromstring)) {
      // open loading
      dFrontJs.ibe_loading.open('body');
      window.scrollTo(0, 0);
      const valFiles = $(`${sltparentdiv} .inte-uploadfile`).data('validatedFiles');
      if (valFiles) {
        validatedFiles = valFiles;
      }
      if (validatedFiles.length > 0) {
        let i = validatedFiles.length - 1;
        const attachments = [];
        for (i; i >= 0; i -= 1) {
          if (attachments.length < 3) {
            GetAttachment(i, valFiles, attachments, sltparentdiv);
          }
        }
      } else {
        const at = [];
        callServiceClaims(at, sltparentdiv);
      }
    } else {
      $(this).prop('disabled', false);
      $(sltfromstring).find('.ibe_form__group--error')[0].scrollIntoView();
    }
    return true;
  });

  // Return to claims form
  $('.inte-continue-first-modal-error').click(() => {
    const formparent = `#${$('.inte-btnContinue').closest('.inte-contentClaims').attr('id')}`; // ESTÁ MAL, NECESARIO CORREGIR.
    $('.inte-first-modal-error').dialog().dialog('close');
    // Add class to know that modal has already been shown
    $(`${formparent} .inte-btnContinue`).addClass('inte-kofirsttry');
    $(`${formparent} .inte-res-code`)[0].scrollIntoView();
  });
  // Show second form (Passenger data)
  $('.inte-continue-second-modal-error').click(() => {
    $('.inte-second-modal-error').dialog().dialog('close');
    $('.inte-second-modal-error').addClass('inte-doneshowingsecondmodal');
    $('.inte-res-code')[0].scrollIntoView(); // It'll put in view like 'all' with that class, but in this case it doesn't matter.
    showsecondform({ elemt: '.inte-claimsPart2', origin: 'button' });
  });
  $('.inte-continue-pir-modal-error').click(() => {
    $('.fc-dialog-pir').dialog().dialog('close');
    $('.inte-pir')[0].scrollIntoView();
    $('.inte-pir input').focus();
  });
}
saleforceForms();

$(document).on('blur', 'input[name="iberianum"]', function () {
    const $input = $(this);
    const $group = $input.closest('.ibe_form__group');
    const $errorMsg = $group.find('[data-validate="exist"]');
    const $validateMsg = $group.find('[data-validate="valid"]');
    const $textoMsg = $errorMsg.attr('data-validate-text') || '';
    const tipo = $('select[name="claim-type"]').val();
    const motivo = $('select[name="claim-reason00"]').val();

    const isRequeried = tipo === 'Modificación/actualización' && motivo === 'Datos del programa Iberia Club/Iberia Joven';

    if (isRequeried) {
        if (!($input.val() || '').trim()) {
            $group.addClass('ibe_form__group--error');
            $errorMsg.removeClass('hidden');
            $errorMsg.text($textoMsg);
        } else {
            if ($validateMsg.hasClass('hidden')) {
                $group.removeClass('ibe_form__group--error');
            }
            $errorMsg.addClass('hidden');
            $errorMsg.text('');
        }
    }
});

if (quadrigam === 'GDFORM') {
    if (window.location.hash && window.location.hash === '#GDFORM') {
        const $select = $('select[name="claim-type"]');
        if ($select.length) {
            $select.prop('selectedIndex', 1);
            if (typeof $select.selectmenu === 'function') {
                $select.selectmenu('refresh');
                $select.selectmenu('option', 'change').call($select);
            }
        }
    }
    if (window.location.hash && window.location.hash === '#GDFORM2') {
        const $select = $('select[name="claim-type"]');
        if ($select.length) {
            $select.prop('selectedIndex', 2);
            if (typeof $select.selectmenu === 'function') {
                $select.selectmenu('refresh');
                $select.selectmenu('option', 'change').call($select);
            }
        }
    }
    if (window.location.hash && window.location.hash === '#GDFORM3') {
        const $select = $('select[name="claim-type"]');
        if ($select.length) {
            $select.prop('selectedIndex', 3);
            if (typeof $select.selectmenu === 'function') {
                $select.selectmenu('refresh');
                $select.selectmenu('option', 'change').call($select);
            }
        }
    }
    if (window.location.hash && window.location.hash === '#GDFORM4') {
        const $select = $('select[name="claim-type"]');
        if ($select.length) {
            $select.prop('selectedIndex', 4);
            if (typeof $select.selectmenu === 'function') {
                $select.selectmenu('refresh');
                $select.selectmenu('option', 'change').call($select);
            }
        }
    }
    if (window.location.hash && window.location.hash === '#GDFORM5') {
        const $select = $('select[name="claim-type"]');
        if ($select.length) {
            $select.prop('selectedIndex', 5);
            if (typeof $select.selectmenu === 'function') {
                $select.selectmenu('refresh');
                $select.selectmenu('option', 'change').call($select);
            }
        }
    }
}


if (quadrigam === 'CEATCL') {
    if (window.location.hash && window.location.hash === '#RCFORM4') {
        const $select = $('select[name="claim-type"]');
        if ($select.length) {
            $select.prop('selectedIndex', 4);
            if (typeof $select.selectmenu === 'function') {
                $select.selectmenu('refresh');
                $select.selectmenu('option', 'change').call($select);
            }
        }
    }
}
// #sourceURL=dev/js/inte-modules/ibe-modules/forms/ibe_claims.js
