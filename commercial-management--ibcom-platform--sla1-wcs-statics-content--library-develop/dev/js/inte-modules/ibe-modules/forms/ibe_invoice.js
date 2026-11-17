import { fillLoggedData } from '../general/ibe_login';
import { sendInvoice, sendProvinces } from '../manage/ibe_invoice';
import { getQueryParam, showErrorModal, initDateFormated } from '../general/ibe_inte-util';
import { getCustomerDataSession, isLogado } from '../manage/ibe_logged-service';
import retrieveGlobalVariables from '../general/ibe_variables';

const { localeg, marketg } = retrieveGlobalVariables();
function invoiceForms() {
  fillLoggedData();
  let nameIR; let surnameIR; let documentIR; let companyNameIR; let CIFIR;
  let languageIR; let mailIR; let addressIR; let postCodeIR; let provinceIR;
  let cityIR; let countryIR; let issueRequest; let btnModify; let btnDuplicate;
  // Function showing confirmation message for issue,reissue and duplicate services.
  function showConfirmationTicket() {
    // get user's mail for show on page confirmation
    const mailUserInovice = $('.inte-mailUser').val();
    $('.inte-mailInvoice').text(mailUserInovice);
    // hidden form2 and show page confirmation
    $('.inte-formTicket').addClass('hidden');
    $('.inte-confirmTicket').removeClass('hidden');
    $('html, body').animate({ scrollTop: $('#invoiceRequest').offset().top }, 'fast');
  }
  // Call issue services
  function servicesIssue(issueRest) {
    const sendIssuePromise = sendInvoice(issueRest, 'issue');
    sendIssuePromise.done(() => {
      showConfirmationTicket();
    });
    sendIssuePromise.fail((resp) => {
      if (resp !== undefined && resp.status !== 0) {
        const errorMsg = resp.responseJSON.errors[0] || { reason: '' };
        showErrorModal(errorMsg.reason);
      } else {
        showErrorModal(null, { btnclose: true, btnaccept: true, closereload: true });
      }
    });
  }

  // Call reissue services
  function servicesReissue(issueRest) {
    const sendReissuePromise = sendInvoice(issueRest, 'reissue');
    sendReissuePromise.done(() => {
      showConfirmationTicket();
    });
    sendReissuePromise.fail((resp) => {
      if (resp !== undefined && resp.status !== 0) {
        const errorMsg = resp.responseJSON.errors[0] || { reason: '' };
        showErrorModal(errorMsg.reason);
      } else {
        showErrorModal(null, { btnclose: true, btnaccept: true, closereload: true });
      }
    });
  }

  // Call duplicate services
  function servicesDuplicate(response) {
    const params = {
      restURLParams: `${response.ticket.ticketNumber}/surname/${response.ticket.surname}/name/${response.ticket.name}`,
    };
    const sendDuplicatePromise = sendInvoice(params, 'duplicate');
    sendDuplicatePromise.done(() => {
      showConfirmationTicket();
    });
    sendDuplicatePromise.fail((resp) => {
      if (resp !== undefined && resp.status !== 0) {
        const errorMsg = resp.responseJSON.errors[0] || { reason: '' };
        showErrorModal(errorMsg.reason);
      } else {
        showErrorModal(null, { btnclose: true, btnaccept: true, closereload: true });
      }
    });
  }
  function eventBtnTicket(event) {
    event.preventDefault();
    // Call province services
    function pronvincesSpain(province) {
      const params = { restURLParams: 'ES/states' };
      const sendProvincesPromise = sendProvinces(params);
      sendProvincesPromise.done((response) => {
        const size = response.length;
        const options = [];
        for (let i = 0; i < size; i++) {
          options.push(`<option value="${response[i].code}">${response[i].description}</option>`);
        }
        provinceIR.append(options.join('')).selectmenu();
        if (province) {
          provinceIR.find(`option[value=${province}]`).attr('selected', true);
        }
        provinceIR.selectmenu('refresh');
      });
      sendProvincesPromise.fail(() => {
        // Generic Error modal with reload
        showErrorModal(null, { btnclose: true, btnaccept: true, closereload: true });
      });
    }
    if (dFrontJs.ibe_validate.validateForm('#inv-tk-form')) {
      dFrontJs.ibe_loading.open('#tab-ticketInvoice');
      const name = $('#inv-tk-name').val() || '';
      const surname = $('#inv-tk-surname').val() || '';
      const tknum = $('#inv-tk-ticket').val() || '';
      const params = {
        restURLParams: `ticket/${encodeURI(tknum.replace('-', ''))}/surname/${encodeURI(surname.toUpperCase())}/name/${encodeURI(name.toUpperCase())}`,
      };

      const invSendPromise = sendInvoice(params, 'search');
      invSendPromise.done((response) => {
        const origin = getQueryParam('origin');
        $.ajax({
          method: 'GET',
          url: '/cs/Satellite',
          data: {
            pagename: 'IB_SE/CacheControl6h/BrowserCache3600/Forms/InvoiceTicket/Datas',
            market: marketg,
            locale: localeg,
            origin,
          },
          success(data) {
            function modifyissueRequest() {
              let email = mailIR.val();;
              let documentId = documentIR.val();
              let surnameTicket = surnameIR.val();
              const dataUser = getCustomerDataSession();
              if(email.includes('*') && response.shippingData!=null){
                email = response.shippingData.email;
              }else if(email.includes('*') && response.shippingData==null){
                if (dataUser !== null && dataUser !== undefined) {
                  if(dataUser.email!==null && dataUser.email!==undefined){
                    email = dataUser.email;
                  }
                }
              }
              if(documentId.includes('*') && response.billingData!=null){
                documentId = response.billingData.identityInformation;
              }else{
                if (dataUser !== null && dataUser !== undefined) {
                  if(dataUser.documentId!=null && dataUser.documentId!==undefined && dataUser.documentId!=""){
                    documentId= dataUser.documentId;
                  }
                }
              }
              if(surnameTicket.includes('*')){
                surnameTicket = response.ticket.surname;
              }
                
              if ((countryIR).val() === 'ES/0/0') {
                province = provinceIR.val();
              }
              issueRequest = {
                ticket: {
                  name: response.ticket.name,
                  surname: response.ticket.surname,
                  ticketNumber: response.ticket.ticketNumber,
                },
                shippingData: {
                  language: languageIR.val(),
                  email: email,
                },
                billingData: {
                  address: addressIR.val(),
                  postalCode: postCodeIR.val(),
                  city: cityIR.val(),
                  province,
                  country: countryIR.val(),
                },
              };
              if ($('#physicalPerson').is(':checked')) {
                issueRequest.billingData.name = nameIR.val();
                issueRequest.billingData.surname = surnameTicket;
                issueRequest.billingData.identityInformation = documentId;
              } else {
                issueRequest.billingData.name = companyNameIR.val();
                issueRequest.billingData.identityInformation = CIFIR.val();
              }
            }
            /*
            * Function in charge of controlling the first change
            * in the selector or input to change the button
            */
            function isChangeInputs() {
              const invoiceRequest = $('#invoiceRequest');
              const findinput = invoiceRequest.find('input');
              const findselect = invoiceRequest.find('select');
              const offInput = () => {
                dFrontJs.ibe_loading.spinnerButton();
                setTimeout(() => {
                  btnDuplicate.addClass('hidden');
                  btnModify.removeClass('hidden');
                  findinput.off('keyup', offInput);
                  findselect.off('selectmenuchange', offInput);
                }, 1250);
              };
              findinput.on('keyup', offInput);
              findselect.on('selectmenuchange', offInput);
            }
            $('#tab-ticketInvoice').html(data);
            dFrontJs.ibe_selectmenu.init();
            dFrontJs.ibe_validate.init();
            dFrontJs.app.hideShowCompanyPersonal();
            dFrontJs.ibe_tooltip.init();
            nameIR = $('#nameIR');
            surnameIR = $('#surnameIR');
            documentIR = $('#documentIR');
            companyNameIR = $('#companyNameIR');
            CIFIR = $('#CIFIR');
            languageIR = $('#languageIR');
            mailIR = $('#mailIR');
            addressIR = $('#addressIR');
            postCodeIR = $('#postCodeIR');
            provinceIR = $('#provinceIR');
            cityIR = $('#cityIR');
            countryIR = $('#countryIR');
            btnModify = $('.inte-newModify');
            btnDuplicate = $('.inte-duplicate');
            var province = '';
            // Wait until everything is initialized
            window.requestAnimFrame(() => {
              const isLogged = isLogado();
              if (response.shippingData === null && response.billingData === null) {
                fillLoggedData();
                const dataUser = getCustomerDataSession();
                if (dataUser !== null && dataUser !== undefined) {
                  languageIR.find(`option[value=${dataUser.preferredLanguage}]`).prop('selected', true);
                  languageIR.selectmenu('refresh');
                  if (isLogged.userType === 'OB') {
                    $('[data-box="company"]').show();
                    $('[data-box="personal"]').hide();
                    $('#physicalPerson').prop('checked', false);
                    $('#juridicalPerson').prop('checked', true);
                    companyNameIR.val(`${dataUser.name} ${dataUser.surnames}`);
                    CIFIR.val(dataUser.CIF);
                  } else if (isLogged.userType === 'IBPLUS' && !isLogged.isSoftUser) {
                    if(dataUser.name!=null && dataUser.name!==undefined && dataUser.name!=""){
                      nameIR.val(dataUser.name);
                    }
                    if(dataUser.surnames!=null && dataUser.surnames!==undefined && dataUser.surnames!="" ){
                      surnameIR.val(ofuscarCampo(dataUser.surnames));
                      document.getElementById('surnameIR').removeAttribute('data-validator');
                      surnameIR.addClass('ibe_form__group--disabled').attr('disabled', 'disabled');
                    }
                    if(dataUser.documentId!=null && dataUser.documentId!==undefined && dataUser.documentId!=""){
                      documentIR.val(ofuscarCampo(dataUser.documentId));
                      documentIR.addClass('ibe_form__group--disabled').attr('disabled', 'disabled');
                    }
                  }
                  if(dataUser.email!==null && dataUser.email!==undefined && dataUser.email!=""){
                    mailIR.val(ofuscarCampo(dataUser.email));
                    mailIR.addClass("ibe_form_group--disabled").attr('disabled','disabled');
                  }
                }
                btnDuplicate.addClass('hidden');
                btnModify.click(() => {
                  modifyissueRequest();
                  if (dFrontJs.ibe_validate.validateForm('[data-valid-form]')) {
                    servicesIssue(issueRequest);
                  }
                });
              } else {
                isChangeInputs();
                btnModify.addClass('hidden');
                const documentIdent = response.billingData.identityInformation.charAt(0);
                if (!isNaN(parseInt(documentIdent, 10)) || documentIdent === 'K' || documentIdent === 'L' || documentIdent === 'M' || documentIdent === 'X' || documentIdent === 'Y' || documentIdent === 'Z') {
                  nameIR.val(response.billingData.name);
                  surnameIR.val(ofuscarCampo(response.billingData.surname));
                  if(response.billingData.surname!==null && response.billingData.surname!==undefined && response.billingData.surname!=""){
                    document.getElementById('surnameIR').removeAttribute('data-validator');
                    surnameIR.addClass('ibe_form__group--disabled').attr('disabled', 'disabled');
                  }
                  documentIR.val(ofuscarCampo(response.billingData.identityInformation));
                  if(response.billingData.identityInformation!==null && response.billingData.identityInformation!==undefined && response.billingData.identityInformation!=""){
                    documentIR.addClass('ibe_form__group--disabled').attr('disabled', 'disabled');
                  }
                  $('#button-dniIR').removeClass('hidden');
                  $('#juridicalPerson').attr('disabled', true);
                  $('#juridicalPerson').parent().addClass('hidden');
                } else {
                  $('[data-box="company"]').show();
                  $('[data-box="personal"]').hide();
                  $('#physicalPerson').prop('checked', false);
                  $('#juridicalPerson').prop('checked', true);
                  companyNameIR.val(response.billingData.name);
                  CIFIR.val(response.billingData.identityInformation);
                  CIFIR.addClass('ibe_form__group--disabled').attr('disabled', 'disabled');
                  $('#button-cifIR').removeClass('hidden');
                  $('#physicalPerson').attr('disabled', true);
                  $('#physicalPerson').parent().addClass('hidden');
                }

                languageIR.find(`option[value=${response.shippingData.language}]`).prop('selected', true);
                languageIR.selectmenu('refresh');
                mailIR.val(ofuscarCampo(response.shippingData.email));
                if(response.shippingData.email!=null && response.shippingData.email!==undefined && response.shippingData.email!=""){
                  mailIR.addClass("ibe_form_group--disabled").attr('disabled','disabled');
                }
                addressIR.val(response.billingData.address);
                postCodeIR.val(response.billingData.postalCode);
                cityIR.val(response.billingData.city);
                countryIR.find(`option[value="${response.billingData.country}"]`).prop('selected', true);
                countryIR.selectmenu('refresh');
                province = response.billingData.province;
                btnModify.click(() => {
                  modifyissueRequest();
                  if (dFrontJs.ibe_validate.validateForm('[data-valid-form]')) {
                    servicesReissue(issueRequest);
                  }
                });
                btnDuplicate.click(() => {
                  if (dFrontJs.ibe_validate.validateForm('[data-valid-form]')) {
                    servicesDuplicate(response);
                  }
                });
                if ((countryIR).val() !== 'ES/0/0') {
                  provinceIR.parent().addClass('hidden');
                  provinceIR.removeAttr('required');
                }
              }
              countryIR.on('selectmenuchange', () => {
                if ((countryIR).val() !== 'ES/0/0') {
                  provinceIR.parent().addClass('hidden');
                  provinceIR.removeAttr('required');
                } else {
                  provinceIR.parent().removeClass('hidden');
                  provinceIR.attr('required', 'required');
                }
              });

              pronvincesSpain(province);
              dFrontJs.ibe_inputs.init();
            });
          },
        });
      });
      invSendPromise.always(() => {
        dFrontJs.ibe_loading.close('#tab-ticketInvoice');
      });

      invSendPromise.fail((resp) => {
        if (resp !== undefined && resp.status !== 0) {
          const errorMsg = resp.responseJSON.errors[0] || { reason: '' };
          showErrorModal(errorMsg.reason);
        } else {
          showErrorModal(null, { btnclose: true, btnaccept: true, closereload: true });
        }
      });
    }
  }

  function ofuscarCampo(text){
    if(text!=null && text!==undefined){
      if(text.includes('@')){
        const partes = text.match(/^(.)(.*)(@.*)$/);
        if(partes){
          return partes[1] + '*'.repeat(partes[2].length) + partes[3];
        }
        return '*'.repeat(text.length);
      }else{
          if(text.length <=2){
            return '*'.repeat(text.length);
          }
          if(text.length>2 && text.length <=5){
            return text[0] + '*'.repeat(text.length - 2) + text[text.length -1];
          }
          return text[0] + text[1] + '*'.repeat(text.length - 4) + text[text.length -2]+ text[text.length -1];
        }
    }
  }

  function eventBtnPacks(event) {
    event.preventDefault();
    if (dFrontJs.ibe_validate.validateForm('#inv-packs-form')) {
      dFrontJs.ibe_loading.open('#tab-JourneysInvoice');

      const resCode = $('#inv-packs-res-code').val() || '';
      const surnames = $('#inv-packs-surnames').val() || '';
      const $date = $('#date-journeys-invoice');
      const dateformat = $date.data('format').split('/');
      let dateVal = $date.val().split('/');
      const dateMap = {};
      dateformat.forEach((el, index) => {
        dateMap[el] = dateVal[index];
      });
      dateVal = `${dateMap.YYYY}-${dateMap.MM}-${dateMap.DD}`;
      const params = JSON.stringify({
        surname: surnames.toUpperCase(),
        locator: resCode,
        departureDate: dateVal,
      });
      const invoicePacksPromise = sendInvoice(params, 'bah');
      invoicePacksPromise.done(() => {
        $('.inte-formJourneys').addClass('hidden');
        $('.inte-confirmJourneys').removeClass('hidden');
      });
      invoicePacksPromise.always(() => {
        dFrontJs.ibe_loading.close('#tab-JourneysInvoice');
      });

      invoicePacksPromise.fail((resp) => {
        if (resp !== undefined && resp.status !== 0) {
          const errorMsg = resp.responseJSON.errors[0] || { reason: '' };
          showErrorModal(errorMsg.reason);
        } else {
          showErrorModal(null, { btnclose: true, btnaccept: true, closereload: true });
        }
      });
    }
  }

  const $ticket = $('#tab-ticketInvoice');
  const $ibpcks = $('#tab-JourneysInvoice');

  if ($ticket.length > 0) {
    $("[href='#tab-JourneysInvoice']").on('click', () => {
      if ($ibpcks.attr('data-loaded') === undefined) {
        dFrontJs.ibe_loading.open('#tab-JourneysInvoice');
        $.ajax({
          method: 'GET',
          url: '/cs/Satellite',
          data: {
            pagename: 'IB_SE/CacheControl6h/BrowserCache3600/Forms/JourneysInvoice',
            market: marketg,
            locale: localeg,
            d: 'Desktop',
          },
          success(data) {
            dFrontJs.ibe_loading.close('#tab-JourneysInvoice');
            $ibpcks.html(data);
            $ibpcks.attr('data-loaded', 'true');
            dFrontJs.ibe_bootstrap_collapse.init();
            window.loadDatePickerLanguage(false, dFrontJs.ibe_form_calendar.init);
            dFrontJs.modalFunction.init();
            dFrontJs.ibe_validate.init();
            initDateFormated();
            fillLoggedData();
            dFrontJs.ibe_inputs.init();
            $('#inte-btn-inv-packs').on('click', eventBtnPacks);
          },
          error() {
            dFrontJs.ibe_loading.close('#tab-JourneysInvoice');
          },
        });
      }
    });
  }
  // Event button
  $('#inv-tk-form > button').on('click', eventBtnTicket);
}
invoiceForms();
