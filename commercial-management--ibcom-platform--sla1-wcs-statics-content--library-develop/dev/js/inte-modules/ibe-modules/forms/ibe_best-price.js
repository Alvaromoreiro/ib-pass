import { sendPNRValidate, sendRequestBestPrice } from '../manage/ibe_best-price';
import { changeformatdate, updateDatalayer, updateDigitalData } from '../manage/ibe_common';
import {
  showErrorModal, initDateFormated, getBase64, setMaxAttachments,
} from '../general/ibe_inte-util';
import checkifcitiesneeded from '../independent/searcher-modules/ibe_check-if-needed';
import retrieveGlobalVariables from '../general/ibe_variables';

const { localeg, marketg } = retrieveGlobalVariables();

function bestPriceForm() {
  $('.inte-btnContinue').on('submit click', (e) => {
    e.preventDefault();
    function callServiceBestPrice(images, formparent) {
      const parent = $(formparent);
      let ffInfo; let slice;
      const company = $('.inte-IBP', parent).val().length > 0 ? 'IB' : '';
      if (company.length > 0) {
        ffInfo = {
          company,
          number: $('.inte-IBP', parent).val(),

        };
      }
      const title = $('.inte-MR', parent).is(':checked') ? 'MR' : 'MRS';
      const personalInfo = {
        firstName: $('.inte-firstName', parent).val(),
        firstSurname: $('.inte-firstSurname', parent).val(),
        lastSurname: $('.inte-secondSurname', parent).val(),
        title,
      };
      const contactInfo = {
        phone: $('.inte-phone', parent).val(),
        email: $('.inte-email', parent).val(),
      };
      const $dateDep = $('.inte-dateDep', parent); const $dateArriv = $('.inte-dateArriv', parent);
      const flightDate1 = $dateDep.val() ? changeformatdate($dateDep.val(), $dateDep.attr('data-format'), 'yyyy-mm-dd') : undefined;
      const flightDate2 = $dateArriv.val() ? changeformatdate($dateArriv.val(), $dateArriv.attr('data-format'), 'yyyy-mm-dd') : undefined;
      const flightOrig = $('.inte-origin', parent).val() ? $('.inte-origin', parent)[0].value.split('(')[1].split(')')[0] : undefined;
      const flightDest = $('.inte-destiny', parent).val() ? $('.inte-destiny', parent)[0].value.split('(')[1].split(')')[0] : undefined;
      const tripType = $('.inte-oneway', parent).is(':checked') ? 'ONE_WAY' : 'ROUND_TRIP';
      if (tripType === 'ROUND_TRIP') {
        slice = [{
          origin: flightOrig, destination: flightDest, date: flightDate1,
        }, {
          origin: flightDest, destination: flightOrig, date: flightDate2,
        }];
      } else {
        slice = [{
          origin: flightOrig, destination: flightDest, date: flightDate1,
        }];
      }
      const orderInfo = {
        tripType,
        paxNumber: $('.inte-paxNum', parent).val(),
        locator: $('.inte-locator', parent).val(),
        price: $('.inte-price1', parent).val(),
        cabinType: $('.inte-cabine', parent).val(),
        slices: slice,
      };
      const $dateFound = $('.inte-date', parent);
      const dateFound = changeformatdate($dateFound.val(), $dateFound.attr('data-format'), 'yyyy-mm-dd');
      const bestPriceInfo = {
        bestPriceFoundDateTime: dateFound,
        url: $('.inte-url', parent).val(),
        comments: $('.inte-textarea', parent).val(),
        price: $('.inte-price2', parent).val(),
        images,
      };
      const request = {
        ffInfo,
        personalInfo,
        contactInfo,
        orderInfo,
        bestPricingInfo: bestPriceInfo,
      };

      // Construir y realizar llamada al servicio
      sendRequestBestPrice(request)
        .done((resp) => {
          dFrontJs.ibe_loading.close('body');
          $('.inte-formBP').addClass('hidden');
          $('.inte-BPConfirm').removeClass('hidden');
          $('#inte-reference').text(resp.claimCode);
          // update datalayer_general
          datalayer_general.quadrigam = 'GPRMIC';
          datalayer_general.codigoSeguimiento = datalayer_general.codigoSeguimiento.replace('GPRMIF', 'GPRMIC');
          updateDatalayer('view');
          // update digital_data
          digital_data.Quadrigam = 'GPRMIC';
          digital_data.TrackingCode = digital_data.TrackingCode.replace('GPRMIF', 'GPRMIC');
          updateDigitalData('view');
        })
        .fail((resp) => {
          dFrontJs.ibe_loading.close('body');
          let errorMsg;
          if (resp && resp.status === 400) {
            errorMsg = resp.responseJSON.errors[0] || { reason: null };
            showErrorModal(errorMsg.reason, { btnclose: true, btnaccept: true, btncancel: true });
          } else {
            showErrorModal(null, { btnclose: true, btnaccept: true, closereload: true });
          }
          $('.inte-btnSendBestPrice').prop('disabled', false);
          if (errorMsg) {
            datalayer_general.codigoError = errorMsg.code;
            datalayer_general.subCodigoError = '';
            datalayer_general.descripcionError = errorMsg.reason;
          }
        });
    }
    function GetImages(i, validatedFiles, images, formparent) {
      const numberFiles = validatedFiles.length;
      if (i < numberFiles) {
        getBase64(i, validatedFiles, (file64) => {
          const image = {
            filename: validatedFiles[i].name.replace(/ /g, ''),
            content: file64.split(',')[1],
          };
          // uploadedFiles.push(validatedFiles[i].name);
          images.push(image);
          if (images.length === validatedFiles.length || images.length > 1) {
            callServiceBestPrice(images, formparent);
          }
        });
      }
      return images;
    }
    function initBestPriceForm(data, pnr) {
      let validatedFiles = [];
      // Show form
      const insertSelector = $('section.ibe-infocheckin');
      insertSelector.children(':not(header)').remove();
      insertSelector.append(data);
      if ($('#formBestPrice').length > 0) {
        const sltparentdiv = `#${$('.inte-contentBestPrice').attr('id')}`;
        // Set PNR value
        $('.inte-pnrInput').val(pnr);
        $('.inte-pnrInput').attr('disabled', 'disabled');
        // Set current date
        const current = new Date();
        const day = current.getDate() < 10 ? `0${current.getDate()}` : current.getDate();
        const month = current.getMonth() < 9 ? `0${current.getMonth() + 1}` : current.getMonth() + 1;// Month 0 is January
        const date = $('.inte-currentDate').attr('value').replace('DD', day).replace('MM', month)
          .replace('YYYY', current.getFullYear());
        $('.inte-currentDate').val(date);
        $('.inte-currentDate').attr('disabled', 'disabled');
        // Init components
        dFrontJs.ibe_inputs.init();
        dFrontJs.ibe_validate.init();
        dFrontJs.ibe_selectmenu.init();
        dFrontJs.ibe_autocomplete.init();
        dFrontJs.ibe_textarea.init();
        dFrontJs.ibe_uploadfile.init();
        window.loadDatePickerLanguage(false, dFrontJs.ibe_form_calendar.init);
        dFrontJs.ibe_modal.init();
        dFrontJs.ibe_validate.nocopyPaste();
        initDateFormated();
        checkifcitiesneeded()
          .catch(() => {
            // eslint-disable-next-line no-console
            console.error("Couldn't retrieve origin / destination");
          });
        setMaxAttachments(sltparentdiv);
        // Function for continue button
        $('.inte-btnSendBestPrice').click(function clk(e){
          $(this).prop('disabled', true);
          e.preventDefault();
          const sltfromstring = `#${$(this)[0].form.id}`;
          if (dFrontJs.ibe_validate.validateForm(sltfromstring)) {
            // currentAttempsClaims = 1;
            // open loading
            dFrontJs.ibe_loading.open('body');
            window.scrollTo(0, 0);
            const valFiles = $(`${sltparentdiv} .inte-uploadfileBestPrice`).data('validatedFiles');
            if (valFiles) {
              validatedFiles = valFiles;
            }
            if (validatedFiles.length > 0) {
              let i = validatedFiles.length - 1;
              const images = [];
              for (i; i >= 0; i--) {
                if (images.length < 2) {
                  GetImages(i, validatedFiles, images, sltparentdiv);
                }
              }
            } else {
              const at = [];
              callServiceBestPrice(at, sltparentdiv);
            }
          } else {
            $(this).prop('disabled', false);
            $(sltfromstring).find('.ibe_form__group--error')[0].scrollIntoView();
          }
          return true;
        });
      }
    }
    function servicePNRValidate() {
      const params = `${$('.inte-res-code').val().toUpperCase()}/is-iberia-order`;
      const sendPNRValidatePromise = sendPNRValidate(params);
      dFrontJs.ibe_loading.open('body');
      sendPNRValidatePromise.done(() => {
        $.ajax({
          method: 'GET',
          url: '/cs/Satellite',
          data: {
            pagename: 'IB_SE/CacheControl6h/BrowserCache3600/Forms/BestPriceClaim',
            market: marketg,
            locale: localeg,
          },
          success(data) {
            dFrontJs.ibe_loading.close('body');
            const pnr = $('.inte-res-code').val().toUpperCase();
            initBestPriceForm(data, pnr);
            // update datalayer_general
            datalayer_general.quadrigam = 'GPRMIF';
            datalayer_general.codigoSeguimiento = datalayer_general.codigoSeguimiento.replace('GPRMIN', 'GPRMIF');
            updateDatalayer('view');
            // update digital_data
            digital_data.Quadrigam = 'GPRMIF';
            digital_data.TrackingCode = digital_data.TrackingCode.replace('GPRMIN', 'GPRMIF');
            updateDigitalData('view');
          },
        });
      });
      sendPNRValidatePromise.fail((resp) => {
        dFrontJs.ibe_loading.close('body');
        let errorMsg;
        if (resp && (resp.status === 400 || resp.status === 404)) {
          errorMsg = resp.responseJSON.errors[0] || { reason: null };
          showErrorModal(errorMsg.reason, { btnclose: true, btnaccept: true, btncancel: true });
        } else {
          showErrorModal(null, { btnclose: true, btnaccept: true, closereload: true });
        }
        if (errorMsg) {
          datalayer_general.codigoError = errorMsg.code;
          datalayer_general.subCodigoError = '';
          datalayer_general.descripcionError = errorMsg.reason;
        }
      });
    }
    if (dFrontJs.ibe_validate.validateForm('[data-valid-form]')) {
      servicePNRValidate();
    }
  });
}
bestPriceForm();
