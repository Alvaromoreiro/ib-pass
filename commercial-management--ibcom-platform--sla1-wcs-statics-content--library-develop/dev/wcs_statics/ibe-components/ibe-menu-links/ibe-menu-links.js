/******/ (() => { // webpackBootstrap
/*!*************************************************!*\
  !*** ./dev/js/ibe-components/ibe-menu-links.js ***!
  \*************************************************/
/**
 * Represents ibe-menu-links.js
 * @constructor
 * @author ccasalen
 * @description Example of description - This is a example of documentation with JSDoc
 * @param {string} [title="hola"] - The title of the book.
 * @param {string} otherParam - The author of the book.
 * @returns {function} dFrontJs.ibe_menu_links.init()
 * @example dFrontJs.ibe_menu_links.init()
 */
dFrontJs.ibe_menu_links = function () {
  var _clickFunction = function (e) {
    var elem = e.currentTarget;
    var idRef = $(elem).data('scroll');
    var heightId = $(idRef).offset().top;
    $('html, body').animate({
      scrollTop: heightId
    }, 1000, 'swing');
  };
  var init = function () {
    $('[data-scroll]').on('click', _clickFunction);
  };
  init();
  $(document).on('loaded-ibe-component-css', function (evt, data) {
    if (data.indexOf('ibe-menu-links' >= 0)) {
      init();
    }
  });
  return {
    'init': init
  };
}(jQuery);
/******/ })()
;
//# sourceMappingURL=ibe-menu-links.js.map