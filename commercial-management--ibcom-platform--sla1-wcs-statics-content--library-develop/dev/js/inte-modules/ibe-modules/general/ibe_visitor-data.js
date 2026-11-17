import * as SessionStorage from '../manage/SessionStorage';

/**
 * @description Get the  user information necessary to pass to the segmentation function.
 * @returns JSON Object.
 */
function getVisitorData() {
  // Variable save parameters Data
  let segmentationParams = $('[data-SegmentationParams]').attr('data-SegmentationParams');
  segmentationParams = (segmentationParams) ? JSON.parse(segmentationParams).params : [];
  const visitorParams = {};

  function lookUpCookie(element) {
    let cookieVal;
    // OnBusiness
    if (element.paramName === 'lgOB') {
      cookieVal = Cookies.get('IBERIACOM_SSO_CIP');// Boolean cookie
    } else {
      cookieVal = Cookies.get(element.paramName);
    }
    if (cookieVal) { // if exist or true
      visitorParams[element.paramName] = cookieVal;
    }
  }
  function lookUpSessionStorage(element) {
    let storageVal;
    // IBPlus Log in case
    if ((element.paramName === 'logadoIBPlus'
                || element.paramName === 'numAvios'
                || element.paramName === 'nvIBP'
                || element.paramName === 'isSantaderOne')
                && !lookUpSessionStorage.ibplusSet) {
      storageVal = SessionStorage.get('customerData');
      if (storageVal) {
        visitorParams.logadoIBPlus = true;
        if (storageVal.category) {
          visitorParams.nvIBP = storageVal.category;
        }
        if (storageVal.dumboInfo && storageVal.dumboInfo.tier && storageVal.dumboInfo.tier.length > 0) {
          visitorParams.isSantaderOne = true;
        }; 
        lookUpSessionStorage.ibplusSet = true;
      }
    } else if (element.paramName === 'lgOB' && SessionStorage.get('customerDataOB')) {
      visitorParams[element.paramName] = 'true';
    } else if (element.paramName === 'logadoIBZero' && SessionStorage.get('customerDataZero')) {
      visitorParams[element.paramName] = 'true';
    } else {
      // General case
      storageVal = SessionStorage.get(element.paramName);
      if (storageVal) {
        visitorParams[element.paramName] = storageVal;
      }
    }
  }
  function lookUpURL(element) {
    let urlParams = window.location.search;
    const pattern = new RegExp('[&?]+');
    urlParams = urlParams.split(pattern).filter((el) => (el.length > 0));

    let tupla;
    urlParams.forEach((el) => {
      tupla = el.split('=');
      if (element.paramName === tupla[0] && tupla[1]) {
        visitorParams[element.paramName] = tupla[1];
      }
    });
  }
  segmentationParams.forEach((element) => {
    switch (element.retrieveFrom) {
      case 'Cookie':
        lookUpCookie(element);
        break;
      case 'Session Storage':
        lookUpSessionStorage(element);
        break;
      case 'URL':
        lookUpURL(element);
        break;
    }
  });

  return visitorParams;
}
export default getVisitorData;
