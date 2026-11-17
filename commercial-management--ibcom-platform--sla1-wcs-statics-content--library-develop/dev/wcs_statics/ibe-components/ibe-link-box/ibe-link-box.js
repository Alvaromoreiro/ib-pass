/******/ (() => { // webpackBootstrap
/*!***********************************************!*\
  !*** ./dev/js/ibe-components/ibe-link-box.js ***!
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
dFrontJs.ibe_link_box = function () {
  var init = function () {
    dFrontJs.app.fcHeight();
    dFrontJs.ibe_box_ellipsis.dot('.ibe-link-box [data-dotdotdot-new]:visible', null);
  }();
  return {
    'init': init
  };
}(jQuery);
/******/ })()
;
//# sourceMappingURL=ibe-link-box.js.map