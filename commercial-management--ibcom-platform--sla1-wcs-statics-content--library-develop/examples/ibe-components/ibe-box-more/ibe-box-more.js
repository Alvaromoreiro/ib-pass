/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***********************************************!*\
  !*** ./dev/js/ibe-components/ibe-box-more.js ***!
  \***********************************************/
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
dFrontJs.ibe_box_more = function () {
  var init = function () {
    $('.ibe-box-more__content').css({
      "max-height": "8rem"
    }, {
      "overflow": "hidden"
    });
    dFrontJs.ibe_read_more.init();
  }();

  return {
    'init': init
  };
}(jQuery);
/******/ })()
;