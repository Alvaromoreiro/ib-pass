(function loadControllerMain() {
  // CONTROLER IBE-COMPONENTS
  const STATICS_ROOT = `${window.location.origin}/wcs_statics/`;
  const properties = $('#ibcomProperties').data('general-properties');
  let staticsVersion;
  if (properties) {
    staticsVersion = properties.staticsVersion;
  } else {
    staticsVersion = '?v=2020.04';
  }
  const loadController = () => {
    const loadjscssController = (filename, filetype, elemt, onload) => {
      let fileref;
      if (filetype === 'js') { // if filename is a external JavaScript file
        fileref = document.createElement('script');
        fileref.setAttribute('type', 'text/javascript');
        fileref.setAttribute('src', STATICS_ROOT + filename);
        fileref.setAttribute('defer', 'true');
        fileref.onload = () => {
          if (onload) {
            onload(elemt);
          }
          elemt.removeAttribute('data-js');
          $(document).trigger('loaded-ibe-component-js', filename);
        };
      } else if (filetype === 'css') { // if filename is an external CSS file
        fileref = document.createElement('link');
        fileref.setAttribute('rel', 'stylesheet');
        fileref.setAttribute('type', 'text/css');
        fileref.setAttribute('href', STATICS_ROOT + filename);
        fileref.onload = () => {
          const cssAttr = $(elemt).data('css');
          if (onload) {
            onload(elemt);
          }
          $(`[data-css="${cssAttr}"][data-css-loadwaiting]`).removeAttr('data-css').removeAttr('data-css-loadwaiting');
          $(`link[href*="${STATICS_ROOT + filename}"]`).data('isloaded', true);
          $(document).trigger('loaded-ibe-component-css', filename);
        };
      }
      if (typeof fileref !== 'undefined') { document.getElementsByTagName('head')[0].appendChild(fileref); }
    };

    const getOffsetTop = (element) => {
      let offsetTop = 0;
      let el = element;
      while (el) {
        offsetTop += el.offsetTop;
        el = el.offsetParent;
      }
      return offsetTop;
    };
    const loadCssJs = () => {
      // console.log("doload");
      const list = document.querySelectorAll('[data-css]');
      const currentScrollPosition = document.documentElement.scrollTop;
      // need for any IE work solution
      NodeList.prototype.forEach = Array.prototype.forEach;
      if (list.length > 0) {
        list.forEach((elemt) => {
          // get current scroll postion absolute.
          const elemAbsolutePosition = getOffsetTop(elemt);
          if (elemAbsolutePosition <= (currentScrollPosition + window.innerHeight + 600)) {
            // console.log("to load");
            if (elemt.dataset.css) {
              elemt.dataset.css.split(',').forEach((toLoad) => {
                if (document.querySelector(`link[href*="${toLoad}"]`) === null) {
                  elemt.setAttribute('data-css-loadwaiting', 'true');
                  loadjscssController(`${toLoad}.css${staticsVersion}`, 'css', elemt);
                } else {
                  if ($(`link[href*="${toLoad}"]`).data('isloaded') !== true) {
                    elemt.setAttribute('data-css-loadwaiting', 'true');
                  } else {
                    elemt.removeAttribute('data-css');
                  }
                  elemt.removeAttribute('data-js');
                }
              });
            }
            if (elemt.dataset.js && document.querySelector(`script[src*="${elemt.dataset.js}"]`) === null) {
              loadjscssController(`${elemt.dataset.js}.js${staticsVersion}`, 'js', elemt);
            }
            elemt.removeAttribute('data-js');
          }
        });
      } else {
        window.removeEventListener('scroll', loadCssJs);
      }
    };
    loadCssJs();
    if (document.querySelector('[data-css]')) { // If still there are some not already loaded.
      window.addEventListener('scroll', loadCssJs);
    }
  };
  loadController();

  // falta controlar

  // END CONTROLER IBE-COMPONENTS
}());
