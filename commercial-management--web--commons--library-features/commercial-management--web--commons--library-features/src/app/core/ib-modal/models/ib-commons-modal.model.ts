import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

/**
 * @description The configuration object that can be added to all Iberia Modals to override the default configuration
 * @property {boolean} animation - If true, the modal will be animated. <b>Default: false</b>
 * @property {boolean} ariaLabelledBy - The aria labelled by of the modal, following aria specification.
 * @property {boolean} ariaDescribedBy - The aria described by of the modal, following aria specification.
 * @property {boolean} modalBlocked - If false, the modal will be closed if you click outside of it. <b>Default: false</b>
 * @property {boolean} showBackdrop - If true, a backdrop will be shown behind the modal. <b>Default: true</b>
 * @property {string} backdropClass - The class of the backdrop to add custom styles. <b>Default: ib-modals__backdrop</b>
 * @property {boolean} verticallyCentered - If true, the modal will be automatically vertical centered. <b>Default: false</b>
 * @property {boolean} scrollable - If true, the modal will be scrollable. <b>Default: false</b>
 * @property {boolean} windowClass - Additional class to add to the modal window. <b>Default: ib-modals</b>
 * @property {boolean | string} fullscreen - Make the modal full screen, to all resolutions or only selected. <b>Default: false</b>ç
 * @property {string} size - The size of the modal. <b>Defaults to iberia custom styles</b>
 */
export type IbModalConfig = {
  animation?: boolean;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  modalBlocked?: boolean;
  showBackdrop?: boolean;
  backdropClass?: string;
  verticallyCentered?: boolean;
  scrollable?: boolean;
  windowClass?: string;
  fullscreen?: "sm" | "md" | "lg" | "xl" | "xxl" | boolean | string;
  size?: "sm" | "lg" | "xl" | string;
};

/**
 * @description The model object to show in the generic modal, with all the options to configure the modal to developer needs.
 * @property {boolean} showCloseButton - Show the X, close button in the top right corner of the modal. <b>Default: true</b>
 * @property {boolean} showHeader - Show the header of the modal. <b>Default: true</b>
 * @property {string} title - The title of the modal. <b>Default: 'MODAL_ERROR_TITLE'</b>
 * @property {Record<string, string>} titleTranslateParams - Optional parameters to add to the translate title.
 * @property {string} subtitle - The subtitle of the modal, in the header following the title. <b>Default: none</b>
 * @property {string | string[]} body - The body message of the modal, you can pass arrays of strings to show multiple paragraphs. <b>Default: none</b>
 * @property {string} hideFooter - Hide the footer of the modal, containing the buttons. <b>Default: false</b>
 * @property {string} accept - The accept red button text, in the right part of the screen as Iberia default. <b>Default: 'ACCEPT'</b>
 * @property {string} cancel - The cancel button text, in the left part of the screen as Iberia default. If the text is set, the button will show. <b>Default: 'CANCEL'</b>
 * @property {boolean} dismissOnCansel - If true, the modal will be dismissed when the cancel button is clicked, if false it will be close instead. <b>Default: true</b>
 * @property {function} onModalOpen - Function to execute when the modal is opened. <b>Default: none</b>
 * @property {function} onClose - Function to execute when the modal is closed. <b>Default: none</b>
 * @property {function} onAcceptClick - Function to execute when the accept button is clicked. <b>Default: none</b>
 * @property {function} onCancelClick - Function to execute when the accept button is clicked. <b>Default: none</b>
 */
export type GenericModalViewModel = {
  showCloseButton?: boolean;
  showHeader?: boolean;
  showCancelButton?: boolean;
  title?: string;
  titleTranslateParams?: Record<string, string>;
  subtitle?: string;
  body?: string | string[];
  hideFooter?: boolean;
  accept?: string;
  cancel?: string;
  dismissOnCancel?: boolean;
  onModalOpen?: () => void;
  onAcceptClick?: () => void;
  onCancelClick?: () => void;
  onClose?: () => void;
};

/**
 * The modal reference object returned by modal.open(), with the component instance of the modal typed correctly.
 */
export declare class IbModalRef<T> extends NgbModalRef {
  /**
   * The instance of a component used for the modal content.
   * When a `TemplateRef` is used as the content or when the modal is closed, will return `undefined`.
   */
  override get componentInstance(): T;
}

export type GenericErrorModalViewModel = GenericModalViewModel & {
  redirect?: string;
};

export type GenericErrorModalErrorModel = {
  errorCode?: number;
  quadrigam?: string;
  isLogged?: string;
  internalErrorCode?: string;
  message?: string;
  eventCategory?: string;
  eventAction?: string;
  eventLabel?: string;
};
