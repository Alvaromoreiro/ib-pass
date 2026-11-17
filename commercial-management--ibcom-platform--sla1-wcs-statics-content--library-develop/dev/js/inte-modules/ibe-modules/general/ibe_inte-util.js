import retrieveGlobalVariables from './ibe_variables';

const { localeg, marketg } = retrieveGlobalVariables();
/**
 * @description This function contains some other functions that can be reused along the JS code.
 * @returns void
 */
/** getQuerystrParams
   * Parse querystring of a given url or location url to a JS object
   */
const getQuerystrParams = (url) => {
  const urlAux = url || document.location.href;
  const params = {}; let
    match = null;
  if (urlAux && typeof urlAux === 'string') {
    const regExp = /([^?=&]+)(=([^&#]*))/g;
    while (match = regExp.exec(urlAux)) {
      params[match[1]] = match[3];
    }
  }
  return params;
};
  // Get params from the URL.
const getQueryParam = (param) => {
  const result = document.location.search.match(new RegExp(`(\\?|&)${param}(\\[\\])?=([^&]*)`));
  return result ? result[3] : false;
};
const getDateByFormat = (datestr, format, asUTC) => {
  let result = {};
  let regExp = null;
  let regExp2 = null;
  let matchFormat = null;
  let matchValue = null;
  if (typeof (datestr) === 'string' && typeof (format) === 'string') {
    datestr = datestr.replace(/[a-z]/gi, '|');

    regExp = /[a-z]+|[0-9]+/gi;
    regExp2 = /[a-z]+|[0-9]+/gi;
    matchFormat = regExp.exec(format);
    matchValue = regExp2.exec(datestr);

    while (matchFormat && matchValue) {
      result[matchFormat[0]] = matchValue[0];
      matchFormat = regExp.exec(format);
      matchValue = regExp2.exec(datestr);
    }

    if (asUTC !== true) {
      return new Date(result.YYYY || 0, (result.MM || 1) - 1, result.DD || 0,
        result.hh || 0, result.mm || 0, result.ss || 0, result.lll || 0);
    }
    return new Date(Date.UTC(result.YYYY || 0, (result.MM || 1) - 1, result.DD || 0,
      result.hh || 0, result.mm || 0, result.ss || 0, result.lll || 0));
  }
  result = null;

  return result;
};
const replaceAll = function repl(str, mapObj) {
  const arr = Object.keys(mapObj);
  let re;
  let strAux = str;
  $.each(arr, (key, value) => {
    re = new RegExp(value, 'g');
    // eslint-disable-next-line no-unused-vars
    strAux = strAux.replace(re, mapObj[value]);
  });
  return strAux;
};
const redirectByQuadrigam = (market, locale, quadrigam, contentType, target) => {
  contentType = contentType || 'Page';
  const targetCode = target || '';
  if (locale && market) {
    $.ajax({
      method: 'GET',
      url: '/cs/Satellite',
      data: {
        pagename: 'IB_SE/Logic/Navigation/GetURLJSON',
        c: contentType,
        quadrigam,
        market: market.toUpperCase(),
        locale: locale.toLowerCase(),
        d: '',
      },
      success(data) {
        let urlExp = data.url;
        if (quadrigam === 'IBLOIN') {
          urlExp += window.location.search;
        }
        if (urlExp.indexOf(' ') > -1) {
          urlExp = urlExp.replace(' ', '+');
        }
        window.top.location = urlExp + targetCode;
      },
    });
  }
};
const loadjsfile = (filename, onload) => {
  const fileref = document.createElement('script');
  const scrurl = `/wcs_statics/js/ibe-modules/${filename}`;
  fileref.setAttribute('type', 'text/javascript');
  fileref.setAttribute('src', scrurl);
  fileref.onload = onload;
  fileref.setAttribute('async', 'async');
  if ($(`script[src='${scrurl}']`).length === 0) {
    document.getElementsByTagName('head')[0].appendChild(fileref);
  }
};
const initDateFormated = () => {
  // Seeker Dates. Rewrite date with js. With nginx and Akamai it does not update
  const $calstart = $("[data-function='cal-start']");
  const $calform = $("[data-function='cal-form']");
  if ($calstart.length > 0 || $calform.length > 0) {
    $('footer').append('<div id="datePicker"></div>');
    const $datepck = $('#datePicker');
    $datepck.datepicker({
      dateFormat: $calstart ? $calstart.attr('data-format') : $calform.attr('data-format'),
      setDate: new Date(),
    });
    $('.dateO, .dateD').html($datepck.val());
    $datepck.datepicker('destroy').remove();
    $datepck.remove();
  }
};
const responsive = () => {
  let resolucion;
  if (window.innerWidth < 768) {
    resolucion = 'mobile';
  } else if (window.innerWidth >= 1024) {
    resolucion = 'desktop';
  } else {
    resolucion = 'tablet';
  }
  return resolucion;
};
// Opens Modals
const callModalwcs = (locale, market, assettype, assetid,
  assetorigin, modalTitle, modalURL, modalFull) => {
  $.ajax({
    encoding: 'UTF-8',
    method: 'GET',
    url: '/cs/Satellite',
    data: {
      pagename: 'IB_SE/CacheControl6h/BrowserCache3600/Page/ShowModal',
      locale,
      market,
      assettype,
      assetid,
      origin: assetorigin,
      modalTitle,
      url: modalURL,
      d: '',
    },
    success(data) {
      $('.defaultModal').html(data);
      if ($('#modalTitle').html().trim() == '') {
        $('#modalTitle').html(modalTitle);
      }
      if ($('.modal-dialog').find('.ibe-accordion')) {
        dFrontJs.ibe_bootstrap_collapse.modalAccordion($('.modal-dialog'));
      }
      if ($('img[data-src]', data).length > 0) {
        dFrontJs.app.renderAllImgModal('.defaultModal');
      }
      dFrontJs.ibe_modal.closeModal();
    },
  });
}

/*
 * Default modal behaviour to show content from links embedded in rich text
 */
dFrontJs.modalFunction = (function () {
  const init = () => {
    // Inicializamos la modal pasandole la clase
    // params: (element, modalButton, modalFull, cssClass, appendTo);

    dFrontJs.ibe_modal.init('.defaultModal', '.modal-link');
    $('.modal-link:not(inte-modalInit)').each(function modalink() {
      $(this).click((e) => {
        e.preventDefault();
        const $this = $(this);
        const modalFull = $this.data('full-width');
        // Recover asset to show
        const assetid = $this.attr('data-contentid');
        const assettype = $this.attr('data-contenttype');
        const assetorigin = $this.attr('data-contentorigin');
        const modalTitle = $this.attr('title');
        let modalURL;
        $this.addClass('inte-modalInit');
        if ($this.attr('href') !== '#') {
          modalURL = $this.attr('href');
        } else if ($this.attr('data-href')) {
          modalURL = $this.attr('data-href');
        } else {
          modalURL = '#';
        }
        callModalwcs(localeg, marketg, assettype, assetid, assetorigin, modalTitle, modalURL, modalFull);
      });
    });
  };
  return {
    init,
  };
}(jQuery));
/**	showErrorModal:
 * This functions displays a generic modal with a red button.
 * HTML of this modal is on the CSElement (IB_CS/Presentation/Page/GenericErrorModal)
 * that must be called when the page is created to ensure that HTML code of modal is included
 *
 * Inputs:
 * 	-	text (optional): 	Text message on modal if it's not provided modal will show a default text
 *  -	flags (optional):	JavaScript object that contains boolean flags to custom if some components are shown
 * 	expected: {btnclose:[true/false], btnaccept:[true/false], btncancel[true/false], closereload[true/false], bodyNoClose[true/false]}
 * 	-	title (Optional): Title of modal
 *  -   textBold (Optional): Text message on modal with bold class
 */
const showErrorModal = (text, flags, title, textBold) => {
  // Intitialize with default flags
  /*
  closeReload: Page is reloaded on accept and close
  btnclose: Show/hide close button
  btnaccept: Show/hide accept button
*/
  const ops = flags || { btnclose: true, btnaccept: true, closereload: false };
  const modal = $('.inte-errormodal');
  function setUpModal() {
    const modal$ = modal.length > 0 ? modal : $('.inte-errormodal');
    const mtitle$ = modal$.find('.title');
    const mtext$ = modal$.find('.modal-body > p.paragraph__regular--modal-claim');
    const mtextBold$ = modal$.find('.modal-body > p.bold');
    const btnaccept$ = modal$.find('.inte-modal-acceptbtn');
    const btnclose$ = modal$.find('.inte-modal-closebtn');
    const btncancel$ = modal$.find('.inte-modal-cancelbtn');
    const mdialog$ = modal$.find('.modal-dialog');

    // Change title only if provided
    if (title !== undefined && typeof (title) === 'string') {
      mtitle$.html(title);
    } else {
      mtitle$.html(mtitle$.data('defaulttitle'));
    }
    if (text !== undefined && typeof (text) === 'string') {
      mtext$.html(text);
    } else {
      mtext$.html(mtext$.data('defaulttext'));
    }
    if (textBold !== undefined && typeof (textBold) === 'string') {
      mtextBold$.removeClass('hidden');
      mtextBold$.html(textBold);
    } else {
      mtextBold$.addClass('hidden');
    }
    // Setup visualization
    if (ops.btnaccept) {
      btnaccept$.prop('disabled', false).show();
    } else {
      btnaccept$.prop('disabled', true).hide();
    }
    if (ops.btnclose) {
      btnclose$.prop('disabled', false).show();
    } else {
      btnclose$.prop('disabled', true).hide();
    }
    if (ops.btncancel) {
      btncancel$.prop('disabled', false).show();
    } else {
      btncancel$.prop('disabled', true).hide();
    }
    if (ops.bodyNoClose) {
      mdialog$.addClass('ibe-noClose');
    } else {
      mdialog$.removeClass('ibe-noClose');
    }

    ops.closereload && modal$.data('reload', 'reload');
    // Open modal:
    dFrontJs.ibe_modal.createModal('.inte-errormodal');
    dFrontJs.ibe_modal.showModal('.inte-errormodal');
  }
  if (modal.length > 0) {
    setUpModal();
  } else {
    $.ajax({
      method: 'GET',
      url: '/cs/Satellite',
      data: {
        pagename: 'IB_SE/CacheControl6h/BrowserCache3600/GenericErrorModal',
        market: marketg,
        locale: localeg,
        d: 'Desktop',
      },
    })
      .done((data) => {
        $('body').append(data);
        dFrontJs.ibe_modal.closeModal();
        setUpModal();
      })
      .fail(() => {
        console.error('Cannot retrieve generic error modal');
      });
  }
}
const getBase64 = (i, validatedFiles, callback) => {
  const f = validatedFiles[i];
  const reader = new FileReader();
  reader.readAsDataURL(f);
  reader.onload = (e) => {
    callback(e.target.result);
  };
  reader.onerror = (error) => {
    throw error;
  };
}

const setMaxAttachments = (parentForm) => {
  const $parentForm = $(parentForm);
  const parent = $parentForm.find('.ibe-upload');
  const $errorMax = parent.find('[data-alert=files] p');
  const $input = parent.find('input');
  const numfiles = $input.attr('data-numFiles');
  const maxAttachments = (numfiles !== undefined && numfiles.length > 0) ? numfiles : '3';
  const valueError = $errorMax.text().replace('{numFiles}', maxAttachments);
  $errorMax.text(valueError);
}

/**
 * Difference beetwen dateFrom and dateTo in days, months or years
 * @param {*} dateFrom 
 * @param {*} dateTo  
 * @param {*} type months, years
 * @returns Default in days 
 */
const getDatesDifference = (dateFrom, dateTo, type) => {
  var result = 0;
  if (dateFrom && dateTo) {
    dateFrom = getDateByFormat(dateFrom, 'YYYY-MM-DD');
    dateTo = getDateByFormat(dateTo, 'YYYY-MM-DD');
    switch (type) {
      case "months":
        result = dateTo.getMonth() - dateFrom.getMonth() + (12 * (dateTo.getFullYear() - dateFrom.getFullYear()));
        break;
      case "years":
        result = dateTo.getFullYear() - dateFrom.getFullYear();
        break;
      default:
        result = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24));
    }
    return result;
  } else {
    return result;
  }
}

const updateMonetatePagetype = (pgtype) => {
  if (window.monetateQ && typeof pgtype === 'string') {
    setTimeout(() => {
      window.monetateQ.push(['setPageType', pgtype]);
      window.monetateQ.push(['trackData']);
    }, 250);
  }
};

const digestSHA256 = async(message) => {
  const encoder = new TextEncoder();
  const hashBuffer  =  await window.crypto.subtle.digest('SHA-256', encoder.encode(message));
  const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
};

/**
 * Returns if the page loads the web-iberia-plus angular app.
 * @returns {boolean} True if the page is the private area angular app.
 */
export function isPrivateAreaApp() {
  return Boolean(document.querySelector('meta[name="fAppD"][content="IB_PLUS"]'));
}

export {
  getQuerystrParams,
  getDateByFormat,
  replaceAll,
  redirectByQuadrigam,
  loadjsfile,
  getQueryParam,
  initDateFormated,
  responsive,
  callModalwcs,
  showErrorModal,
  getBase64,
  setMaxAttachments,
  getDatesDifference,
  updateMonetatePagetype,
  digestSHA256,
};
