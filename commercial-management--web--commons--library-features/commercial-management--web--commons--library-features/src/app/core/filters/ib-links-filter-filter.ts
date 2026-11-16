import { CommonsConstantsType } from "../constants/ib-commons-constants";

function LinksFilter(
  CommonsConstants: CommonsConstantsType,
  $window: ng.IWindowService,
  localStorageService: angular.local.storage.ILocalStorageService,
  $rootScope: CommonsRootScope,
) {
  const market: string = $rootScope.appMarket
    ? $rootScope.appMarket.toLowerCase()
    : CommonsConstants.market.toLowerCase();
  const lang: string = $rootScope.appLang
    ? $rootScope.appLang.toLowerCase()
    : CommonsConstants.lang.toLowerCase();
  const links = {
    IBCOSE_MOD_INFOCK_LINK_AERO_ES:
      $window.location.origin + "/" + market + "/autocheckin/",
    IBCOSE_MOD_INFOCK_LINK_AERO_EN:
      $window.location.origin + "/" + market + "/autocheckin_en/",
    IBCOSE_MOD_INFOCK_LINK_AERO_IT:
      $window.location.origin + "/" + market + "/autocheckin_it/",
    IBCOSE_MOD_INFOCK_LINK_AERO_FR:
      $window.location.origin + "/" + market + "/autocheckin_fr/",
    IBCOSE_MOD_INFOCK_LINK_AERO_PT:
      $window.location.origin + "/" + market + "/autocheckin_pt/",
    IBCOSE_MOD_INFOCK_LINK_AERO_DE:
      $window.location.origin + "/" + market + "/checkinautomaten/",
    IBCOSE_MOD_INFOCK_LINK_AERO_CA:
      $window.location.origin + "/" + market + "/autocheckin.cat/",
    IBCOSE_MOD_INFOCK_LINK_AERO_RU:
      $window.location.origin + "/" + market + "/kiosk-registratsii/",
    IBCOSE_MOD_INFOCK_LINK_AERO_JA:
      $window.location.origin + "/" + market + "/autocheckin/",
    IBCOSE_MOD_INFOCK_LINK_AERO_ZH:
      $window.location.origin + "/" + market + "/autocheckin/",
    IBCOSE_MOD_INFOCK_LINK_AERO_NL:
      $window.location.origin + "/" + market + "/autocheckin_en/",
    IBCOSE_MOD_INFOCK_LINK_HELP_ES:
      $window.location.origin +
      "/web/product.do?cntCat=Productos/IBCOSEPOPUP&cntId=codigoreserva",
    IBCOSE_MOD_INFOCK_LINK_HELP_EN:
      $window.location.origin +
      "/web/product.do?cntCat=Productos/IBCOSEPOPUP&cntId=codigoreserva",
    IBCOSE_MOD_INFOCK_LINK_HELP_IT:
      $window.location.origin +
      "/web/product.do?cntCat=Productos/IBCOSEPOPUP&cntId=codigoreserva",
    IBCOSE_MOD_INFOCK_LINK_HELP_FR:
      $window.location.origin +
      "/web/product.do?cntCat=Productos/IBCOSEPOPUP&cntId=codigoreserva",
    IBCOSE_MOD_INFOCK_LINK_HELP_PT:
      $window.location.origin +
      "/web/product.do?cntCat=Productos/IBCOSEPOPUP&cntId=codigoreserva",
    IBCOSE_MOD_INFOCK_LINK_HELP_DE:
      $window.location.origin +
      "/web/product.do?cntCat=Productos/IBCOSEPOPUP&cntId=codigoreserva",
    IBCOSE_MOD_INFOCK_LINK_HELP_CA:
      $window.location.origin +
      "/web/product.do?cntCat=Productos/IBCOSEPOPUP&cntId=codigoreserva",
    IBCOSE_MOD_INFOCK_LINK_HELP_RU:
      $window.location.origin +
      "/web/product.do?cntCat=Productos/IBCOSEPOPUP&cntId=codigoreserva",
    IBCOSE_MOD_INFOCK_LINK_HELP_JA:
      $window.location.origin +
      "/web/product.do?cntCat=Productos/IBCOSEPOPUP&cntId=codigoreserva",
    IBCOSE_MOD_INFOCK_LINK_HELP_ZH:
      $window.location.origin +
      "/web/product.do?cntCat=Productos/IBCOSEPOPUP&cntId=codigoreserva",
    IBCOSE_MOD_INFOCK_LINK_HELP_NL:
      $window.location.origin +
      "/web/product.do?cntCat=Productos/IBCOSEPOPUP&cntId=codigoreserva",
    IBCOSE_MOD_INFOCK_LINK_PIN_ES:
      $window.location.origin +
      "/" +
      market +
      "/iberiaplus/recuperar-password/",
    IBCOSE_MOD_INFOCK_LINK_PIN_EN:
      $window.location.origin + "/" + market + "/iberiaplus/recover-password/",
    IBCOSE_MOD_INFOCK_LINK_PIN_IT:
      $window.location.origin + "/" + market + "/iberiaplus/recupera-password/",
    IBCOSE_MOD_INFOCK_LINK_PIN_FR:
      $window.location.origin +
      "/" +
      market +
      "/iberiaplus/recuperer-mot-de-passe/",
    IBCOSE_MOD_INFOCK_LINK_PIN_PT:
      $window.location.origin + "/" + market + "/iberiaplus/recuperar-senha/",
    IBCOSE_MOD_INFOCK_LINK_PIN_DE:
      $window.location.origin +
      "/" +
      market +
      "/iberiaplus/passwort-wiederherstellen/",
    IBCOSE_MOD_INFOCK_LINK_PIN_CA:
      $window.location.origin +
      "/" +
      market +
      "/iberiaplus/recuperar-contrasenya/",
    IBCOSE_MOD_INFOCK_LINK_PIN_RU:
      $window.location.origin + "/" + market + "/iberiaplus/vosstanovit-parol/",
    IBCOSE_MOD_INFOCK_LINK_PIN_JA:
      $window.location.origin + "/" + market + "/iberiaplus/recover-password/",
    IBCOSE_MOD_INFOCK_LINK_PIN_ZH:
      $window.location.origin + "/" + market + "/iberiaplus/recover-password/",
    IBCOSE_MOD_INFOCK_LINK_PIN_NL:
      $window.location.origin +
      "/" +
      market +
      "/iberiaplus/wachtwoord-herstellen/",
    IBCOSE_MOD_INFOCK_LINK_CONDI_ES:
      $window.location.origin + "/" + market + "/reserva-de-asientos/",
    IBCOSE_MOD_INFOCK_LINK_CONDI_EN:
      $window.location.origin + "/" + market + "/seat-reservation/",
    IBCOSE_MOD_INFOCK_LINK_CONDI_IT:
      $window.location.origin + "/" + market + "/prenotazione-posti-a-sedere/",
    IBCOSE_MOD_INFOCK_LINK_CONDI_FR:
      $window.location.origin + "/" + market + "/reservations-sieges/",
    IBCOSE_MOD_INFOCK_LINK_CONDI_PT:
      $window.location.origin + "/" + market + "/reserva-lugares/",
    IBCOSE_MOD_INFOCK_LINK_CONDI_DE:
      $window.location.origin + "/" + market + "/platzreservierung/",
    IBCOSE_MOD_INFOCK_LINK_CONDI_CA:
      $window.location.origin + "/" + market + "/reserva-seients/",
    IBCOSE_MOD_INFOCK_LINK_CONDI_RU:
      $window.location.origin + "/" + market + "/bronirovanie-mest/",
    IBCOSE_MOD_INFOCK_LINK_CONDI_JA:
      $window.location.origin + "/" + market + "/reserva-de-asientos/",
    IBCOSE_MOD_INFOCK_LINK_CONDI_ZH:
      $window.location.origin + "/" + market + "/seat-reservation/",
    IBCOSE_MOD_INFOCK_LINK_CONDI_NL:
      $window.location.origin + "/" + market + "/seat-reservation/",
    IBCOSE_MOD_INFOCK_LINK_DESTINI_ES:
      $window.location.origin + "/" + market + "/hora-limite/",
    IBCOSE_MOD_INFOCK_LINK_DESTINI_EN:
      $window.location.origin + "/" + market + "/time-limit/",
    IBCOSE_MOD_INFOCK_LINK_DESTINI_IT:
      $window.location.origin + "/" + market + "/ora-limite/",
    IBCOSE_MOD_INFOCK_LINK_DESTINI_FR:
      $window.location.origin + "/" + market + "/heure-limite/",
    IBCOSE_MOD_INFOCK_LINK_DESTINI_PT:
      $window.location.origin + "/" + market + "/hora-limite.pt/",
    IBCOSE_MOD_INFOCK_LINK_DESTINI_DE:
      $window.location.origin + "/" + market + "/annahme-schlusszeiten/",
    IBCOSE_MOD_INFOCK_LINK_DESTINI_CA:
      $window.location.origin + "/" + market + "/hora-limit/",
    IBCOSE_MOD_INFOCK_LINK_DESTINI_RU:
      $window.location.origin + "/" + market + "/limit-vremeni/",
    IBCOSE_MOD_INFOCK_LINK_DESTINI_JA:
      $window.location.origin + "/" + market + "/hora-limite/",
    IBCOSE_MOD_INFOCK_LINK_DESTINI_ZH:
      $window.location.origin + "/" + market + "/time-limit/",
    IBCOSE_MOD_INFOCK_LINK_DESTINI_NL:
      $window.location.origin + "/" + market + "/time-limit/",
    MANAGE_MY_BOOKING_LINK_ES:
      $window.location.origin + "/" + market + "/gestion-de-reservas/",
    MANAGE_MY_BOOKING_LINK_EN:
      $window.location.origin + "/" + market + "/manage-my-booking/",
    MANAGE_MY_BOOKING_LINK_IT:
      $window.location.origin + "/" + market + "/gestion-e-prenotazioni/",
    MANAGE_MY_BOOKING_LINK_FR:
      $window.location.origin + "/" + market + "/gestion-de-reservations/",
    MANAGE_MY_BOOKING_LINK_PT:
      $window.location.origin + "/" + market + "/gesta-o-reservas/",
    MANAGE_MY_BOOKING_LINK_DE:
      $window.location.origin + "/" + market + "/meine-buchung-bearbeiten/",
    MANAGE_MY_BOOKING_LINK_CA:
      $window.location.origin + "/" + market + "/gestio-de-reserves/",
    MANAGE_MY_BOOKING_LINK_RU:
      $window.location.origin + "/" + market + "/upravlenie-bronirovaniem/",
    MANAGE_MY_BOOKING_LINK_JA:
      $window.location.origin + "/" + market + "/gestion-de-reservas/",
    MANAGE_MY_BOOKING_LINK_ZH:
      $window.location.origin + "/" + market + "/manage-my-booking/",
    MANAGE_MY_BOOKING_LINK_NL:
      $window.location.origin + "/" + market + "/manage-my-booking/",
    CKIANC_MOD_INFOCK_LINK_ESPEQ_ES:
      $window.location.origin + "/" + market + "/equipajes/especiales/",
    CKIANC_MOD_INFOCK_LINK_ESPEQ_EN:
      $window.location.origin + "/" + market + "/luggage/special/",
    CKIANC_MOD_INFOCK_LINK_ESPEQ_IT:
      $window.location.origin + "/" + market + "/bagaglio/speciali/",
    CKIANC_MOD_INFOCK_LINK_ESPEQ_FR:
      $window.location.origin + "/" + market + "/bagages/speciaux/",
    CKIANC_MOD_INFOCK_LINK_ESPEQ_PT:
      $window.location.origin + "/" + market + "/bagagem/especiais/",
    CKIANC_MOD_INFOCK_LINK_ESPEQ_DE:
      $window.location.origin + "/" + market + "/sondergepack/",
    CKIANC_MOD_INFOCK_LINK_ESPEQ_CA:
      $window.location.origin + "/" + market + "/equipatges/especials",
    CKIANC_MOD_INFOCK_LINK_ESPEQ_RU:
      $window.location.origin + "/" + market + "/bagazh/spetsialnyy/",
    CKIANC_MOD_INFOCK_LINK_ESPEQ_JA:
      $window.location.origin + "/" + market + "/equipajes/especiales/",
    CKIANC_MOD_INFOCK_LINK_ESPEQ_ZH:
      $window.location.origin + "/" + market + "/luggage/special/",
    CKIANC_MOD_INFOCK_LINK_ESPEQ_NL:
      $window.location.origin + "/" + market + "/luggage/special/",
    CKIANC_MOD_INFOCK_LINK_IBPLUS_ES:
      $window.location.origin + "/" + market + "/equipajes/franquicia-bodega/",
    CKIANC_MOD_INFOCK_LINK_IBPLUS_EN:
      $window.location.origin + "/" + market + "/luggage/allowance-in-hold/",
    CKIANC_MOD_INFOCK_LINK_IBPLUS_IT:
      $window.location.origin + "/" + market + "/bagaglio/franchigia-in-stiva/",
    CKIANC_MOD_INFOCK_LINK_IBPLUS_FR:
      $window.location.origin + "/" + market + "/bagages/franchise-en-soute/",
    CKIANC_MOD_INFOCK_LINK_IBPLUS_PT:
      $window.location.origin + "/" + market + "/bagagem/franquia-de-bagagem/",
    CKIANC_MOD_INFOCK_LINK_IBPLUS_DE:
      $window.location.origin +
      "/" +
      market +
      "/gepack/freigepack-im-frachtraum/",
    CKIANC_MOD_INFOCK_LINK_IBPLUS_CA:
      $window.location.origin +
      "/" +
      market +
      "/equipatges/franquicia-en-bodega/",
    CKIANC_MOD_INFOCK_LINK_IBPLUS_RU:
      $window.location.origin + "/" + market + "/bagazh/bez-poshliny-vina/",
    CKIANC_MOD_INFOCK_LINK_IBPLUS_JA:
      $window.location.origin + "/" + market + "/luggage/allowance-in-hold/",
    CKIANC_MOD_INFOCK_LINK_IBPLUS_ZH:
      $window.location.origin + "/" + market + "/luggage/allowance-in-hold/",
    CKIANC_MOD_INFOCK_LINK_IBPLUS_NL:
      $window.location.origin + "/" + market + "/luggage/allowance-in-hold/",
    CKIANC_MOD_INFOCK_LINK_LONDHEA_ES:
      $window.location.origin +
      "/web/product.do?menuId=EQUFRA&cntCat=Productos/EQUIFR&cntId=EQFARELHR&quadrigam=EQUFRA",
    CKIANC_MOD_INFOCK_LINK_LONDHEA_EN:
      $window.location.origin +
      "/web/product.do?menuId=EQUFRA&cntCat=Productos/EQUIFR&cntId=EQFARELHR&quadrigam=EQUFRA",
    CKIANC_MOD_INFOCK_LINK_LONDHEA_IT:
      $window.location.origin +
      "/web/product.do?menuId=EQUFRA&cntCat=Productos/EQUIFR&cntId=EQFARELHR&quadrigam=EQUFRA",
    CKIANC_MOD_INFOCK_LINK_LONDHEA_FR:
      $window.location.origin +
      "/web/product.do?menuId=EQUFRA&cntCat=Productos/EQUIFR&cntId=EQFARELHR&quadrigam=EQUFRA",
    CKIANC_MOD_INFOCK_LINK_LONDHEA_PT:
      $window.location.origin +
      "/web/product.do?menuId=EQUFRA&cntCat=Productos/EQUIFR&cntId=EQFARELHR&quadrigam=EQUFRA",
    CKIANC_MOD_INFOCK_LINK_LONDHEA_DE:
      $window.location.origin +
      "/web/product.do?menuId=EQUFRA&cntCat=Productos/EQUIFR&cntId=EQFARELHR&quadrigam=EQUFRA",
    CKIANC_MOD_INFOCK_LINK_LONDHEA_CA:
      $window.location.origin +
      "/web/product.do?menuId=EQUFRA&cntCat=Productos/EQUIFR&cntId=EQFARELHR&quadrigam=EQUFRA",
    CKIANC_MOD_INFOCK_LINK_LONDHEA_RU:
      $window.location.origin +
      "/web/product.do?menuId=EQUFRA&cntCat=Productos/EQUIFR&cntId=EQFARELHR&quadrigam=EQUFRA",
    CKIANC_MOD_INFOCK_LINK_LONDHEA_JA:
      $window.location.origin +
      "/web/product.do?menuId=EQUFRA&cntCat=Productos/EQUIFR&cntId=EQFARELHR&quadrigam=EQUFRA",
    CKIANC_MOD_INFOCK_LINK_LONDHEA_ZH:
      $window.location.origin +
      "/web/product.do?menuId=EQUFRA&cntCat=Productos/EQUIFR&cntId=EQFARELHR&quadrigam=EQUFRA",
    CKIANC_MOD_INFOCK_LINK_LONDHEA_NL:
      $window.location.origin +
      "/web/product.do?menuId=EQUFRA&cntCat=Productos/EQUIFR&cntId=EQFARELHR&quadrigam=EQUFRA",
    CKIANC_MOD_INFOCK_LINK_ADEQ_ES:
      $window.location.origin + "/" + market + "/compra-exceso-equipaje/",
    CKIANC_MOD_INFOCK_LINK_ADEQ_EN:
      $window.location.origin + "/" + market + "/baggage/additional-baggage/",
    CKIANC_MOD_INFOCK_LINK_ADEQ_IT:
      $window.location.origin + "/" + market + "/bagaglio/bagaglio-aggiuntivo/",
    CKIANC_MOD_INFOCK_LINK_ADEQ_FR:
      $window.location.origin + "/" + market + "/acheter-excedent-bagages/",
    CKIANC_MOD_INFOCK_LINK_ADEQ_PT:
      $window.location.origin + "/" + market + "/bagagem/bagagem-adicional/",
    CKIANC_MOD_INFOCK_LINK_ADEQ_DE:
      $window.location.origin + "/" + market + "/gepaeck/zusatzgepack/",
    CKIANC_MOD_INFOCK_LINK_ADEQ_CA:
      $window.location.origin + "/" + market + "/compra-exces-equipatge/",
    CKIANC_MOD_INFOCK_LINK_ADEQ_RU:
      $window.location.origin +
      "/" +
      market +
      "/pokupka-prava-na-provoz-sverkhlimitnogo-bagazha/",
    CKIANC_MOD_INFOCK_LINK_ADEQ_JA:
      $window.location.origin + "/" + market + "/compra-exceso-equipaje/",
    CKIANC_MOD_INFOCK_LINK_ADEQ_ZH:
      $window.location.origin + "/" + market + "/baggage/additional-baggage/",
    CKIANC_MOD_INFOCK_LINK_ADEQ_NL:
      $window.location.origin + "/" + market + "/baggage/additional-baggage/",
    CKIANC_MOD_INFOCK_LINK_EQAY_ES:
      $window.location.origin + "/jba/ay/es_ES/baggage/jbaCarryOnBaggage.html",
    CKIANC_MOD_INFOCK_LINK_EQAY_EN:
      $window.location.origin + "/jba/ay/en_GB/baggage/jbaCarryOnBaggage.html",
    CKIANC_MOD_INFOCK_LINK_EQAY_IT:
      $window.location.origin + "/jba/ay/en_GB/baggage/jbaCarryOnBaggage.html",
    CKIANC_MOD_INFOCK_LINK_EQAY_FR:
      $window.location.origin + "/jba/ay/en_GB/baggage/jbaCarryOnBaggage.html",
    CKIANC_MOD_INFOCK_LINK_EQAY_PT:
      $window.location.origin + "/jba/ay/en_GB/baggage/jbaCarryOnBaggage.html",
    CKIANC_MOD_INFOCK_LINK_EQAY_DE:
      $window.location.origin + "/jba/ay/en_GB/baggage/jbaCarryOnBaggage.html",
    CKIANC_MOD_INFOCK_LINK_EQAY_CA:
      $window.location.origin + "/jba/ay/es_ES/baggage/jbaCarryOnBaggage.html",
    CKIANC_MOD_INFOCK_LINK_EQAY_RU:
      $window.location.origin + "/jba/ay/en_GB/baggage/jbaCarryOnBaggage.html",
    CKIANC_MOD_INFOCK_LINK_EQAY_JA:
      $window.location.origin + "/jba/ay/en_GB/baggage/jbaCarryOnBaggage.html",
    CKIANC_MOD_INFOCK_LINK_EQAY_ZH:
      $window.location.origin + "/jba/ay/en_GB/baggage/jbaCarryOnBaggage.html",
    CKIANC_MOD_INFOCK_LINK_EQAY_NL:
      $window.location.origin + "/jba/ay/en_GB/baggage/jbaCarryOnBaggage.html",
    CKIANC_MOD_INFOCK_LINK_EQAA_ES:
      $window.location.origin + "/jba/aa/es_US/baggage/carryOnAllowance.html",
    CKIANC_MOD_INFOCK_LINK_EQAA_EN:
      $window.location.origin + "/jba/aa/en_US/baggage/carryOnAllowance.html",
    CKIANC_MOD_INFOCK_LINK_EQAA_IT:
      $window.location.origin + "/jba/aa/en_US/baggage/carryOnAllowance.html",
    CKIANC_MOD_INFOCK_LINK_EQAA_FR:
      $window.location.origin + "/jba/aa/en_US/baggage/carryOnAllowance.html",
    CKIANC_MOD_INFOCK_LINK_EQAA_PT:
      $window.location.origin + "/jba/aa/en_US/baggage/carryOnAllowance.html",
    CKIANC_MOD_INFOCK_LINK_EQAA_DE:
      $window.location.origin + "/jba/aa/en_US/baggage/carryOnAllowance.html",
    CKIANC_MOD_INFOCK_LINK_EQAA_CA:
      $window.location.origin + "/jba/aa/es_US/baggage/carryOnAllowance.html",
    CKIANC_MOD_INFOCK_LINK_EQAA_RU:
      $window.location.origin + "/jba/aa/en_US/baggage/carryOnAllowance.html",
    CKIANC_MOD_INFOCK_LINK_EQAA_JA:
      $window.location.origin + "/jba/aa/en_US/baggage/carryOnAllowance.html",
    CKIANC_MOD_INFOCK_LINK_EQAA_ZH:
      $window.location.origin + "/jba/aa/en_US/baggage/carryOnAllowance.html",
    CKIANC_MOD_INFOCK_LINK_EQAA_NL:
      $window.location.origin + "/jba/aa/en_US/baggage/carryOnAllowance.html",
    CKIANC_MOD_INFOCK_LINK_EQBA_ES:
      $window.location.origin + "/jba/ba/es_ES/baggage/bagcabin.html",
    CKIANC_MOD_INFOCK_LINK_EQBA_EN:
      $window.location.origin + "/jba/ba/en_GB/baggage/bagcabin.html",
    CKIANC_MOD_INFOCK_LINK_EQBA_IT:
      $window.location.origin + "/jba/ba/en_GB/baggage/bagcabin.html",
    CKIANC_MOD_INFOCK_LINK_EQBA_FR:
      $window.location.origin + "/jba/ba/en_GB/baggage/bagcabin.html",
    CKIANC_MOD_INFOCK_LINK_EQBA_PT:
      $window.location.origin + "/jba/ba/en_GB/baggage/bagcabin.html",
    CKIANC_MOD_INFOCK_LINK_EQBA_DE:
      $window.location.origin + "/jba/ba/en_GB/baggage/bagcabin.html",
    CKIANC_MOD_INFOCK_LINK_EQBA_CA:
      $window.location.origin + "/jba/ba/es_ES/baggage/bagcabin.html",
    CKIANC_MOD_INFOCK_LINK_EQBA_RU:
      $window.location.origin + "/jba/ba/en_GB/baggage/bagcabin.html",
    CKIANC_MOD_INFOCK_LINK_EQBA_JA:
      $window.location.origin + "/jba/ba/en_GB/baggage/bagcabin.html",
    CKIANC_MOD_INFOCK_LINK_EQBA_ZH:
      $window.location.origin + "/jba/ba/en_GB/baggage/bagcabin.html",
    CKIANC_MOD_INFOCK_LINK_EQBA_NL:
      $window.location.origin + "/jba/ba/en_GB/baggage/bagcabin.html",
    CKIANC_MOD_INFOCK_LINK_EQULON_ES:
      $window.location.origin +
      "/web/product.do?menuId=EQUIMA&cntCat=Productos/EQUIFR&cntId=EQFARELHR&quadrigam=EQUIMA",
    CKIANC_MOD_INFOCK_LINK_EQULON_EN:
      $window.location.origin + "/" + market + "/luggage/hand-luggage/",
    CKIANC_MOD_INFOCK_LINK_EQULON_IT:
      $window.location.origin + "/" + market + "/bagaglio/a-mano/",
    CKIANC_MOD_INFOCK_LINK_EQULON_FR:
      $window.location.origin + "/" + market + "/bagages/a-main/",
    CKIANC_MOD_INFOCK_LINK_EQULON_PT:
      $window.location.origin + "/" + market + "/bagagem/de-mao/",
    CKIANC_MOD_INFOCK_LINK_EQULON_DE:
      $window.location.origin + "/" + market + "/gepack/handgepack/",
    CKIANC_MOD_INFOCK_LINK_EQULON_CA:
      $window.location.origin + "/" + market + "/equipatges/de-ma/",
    CKIANC_MOD_INFOCK_LINK_EQULON_RU:
      $window.location.origin + "/" + market + "/bagazh/ruchnaya-klad/",
    CKIANC_MOD_INFOCK_LINK_EQULON_JA:
      $window.location.origin + "/" + market + "/luggage/hand-luggage/",
    CKIANC_MOD_INFOCK_LINK_EQULON_ZH:
      $window.location.origin + "/" + market + "/luggage/hand-luggage/",
    CKIANC_MOD_INFOCK_LINK_EQULON_NL:
      $window.location.origin + "/" + market + "/luggage/hand-luggage/",
    CKIANC_MOD_INFOCK_LINK_DANOBJ_ES:
      $window.location.origin +
      "/" +
      market +
      "/equipajes/articulos-peligrosos/",
    CKIANC_MOD_INFOCK_LINK_DANOBJ_EN:
      $window.location.origin + "/" + market + "/luggage/dangerous-goods/",
    CKIANC_MOD_INFOCK_LINK_DANOBJ_IT:
      $window.location.origin + "/" + market + "/bagaglio/articoli-pericolosi/",
    CKIANC_MOD_INFOCK_LINK_DANOBJ_FR:
      $window.location.origin + "/" + market + "/bagages/articles-dangereux/",
    CKIANC_MOD_INFOCK_LINK_DANOBJ_PT:
      $window.location.origin + "/" + market + "/bagagem/artigos-perigosos/",
    CKIANC_MOD_INFOCK_LINK_DANOBJ_DE:
      $window.location.origin +
      "/" +
      market +
      "/gepack/gefahrliche-gegenstande/",
    CKIANC_MOD_INFOCK_LINK_DANOBJ_CA:
      $window.location.origin +
      "/" +
      market +
      "/equipatges/articles-perillosos/",
    CKIANC_MOD_INFOCK_LINK_DANOBJ_RU:
      $window.location.origin + "/" + market + "/bagazh/opasnye-predmety/",
    CKIANC_MOD_INFOCK_LINK_DANOBJ_JA:
      $window.location.origin +
      "/" +
      market +
      "/equipajes/articulos-peligrosos/",
    CKIANC_MOD_INFOCK_LINK_DANOBJ_ZH:
      $window.location.origin + "/" + market + "/luggage/dangerous-goods/",
    CKIANC_MOD_INFOCK_LINK_DANOBJ_NL:
      $window.location.origin + "/" + market + "/luggage/dangerous-goods/",
    CKIANC_MOD_INFOCK_LINK_LIQ_ES:
      $window.location.origin + "/" + market + "/equipajes/de-mano/",
    CKIANC_MOD_INFOCK_LINK_LIQ_EN:
      $window.location.origin + "/" + market + "/hand/luggage/",
    CKIANC_MOD_INFOCK_LINK_LIQ_IT:
      $window.location.origin + "/" + market + "/bagaglio/a-mano/",
    CKIANC_MOD_INFOCK_LINK_LIQ_FR:
      $window.location.origin + "/" + market + "/bagages/a-main/",
    CKIANC_MOD_INFOCK_LINK_LIQ_PT:
      $window.location.origin + "/" + market + "/bagagem/de-mao/",
    CKIANC_MOD_INFOCK_LINK_LIQ_DE:
      $window.location.origin + "/" + market + "/gepack/handgepack/",
    CKIANC_MOD_INFOCK_LINK_LIQ_CA:
      $window.location.origin + "/" + market + "/equipatges/de-ma/",
    CKIANC_MOD_INFOCK_LINK_LIQ_RU:
      $window.location.origin + "/" + market + "/bagazh/ruchnaya-klad/",
    CKIANC_MOD_INFOCK_LINK_LIQ_JA:
      $window.location.origin + "/" + market + "/equipajes/de-mano/",
    CKIANC_MOD_INFOCK_LINK_LIQ_ZH:
      $window.location.origin + "/" + market + "/hand/luggage/",
    CKIANC_MOD_INFOCK_LINK_LIQ_NL:
      $window.location.origin + "/" + market + "/hand/luggage/",
    CKIANC_MOD_INFOCK_LINK_ELECDIS_ES:
      $window.location.origin +
      "/" +
      market +
      "/equipajes/dispositivos-electronicos/",
    CKIANC_MOD_INFOCK_LINK_ELECDIS_EN:
      $window.location.origin + "/" + market + "/luggage/electronic-devices/",
    CKIANC_MOD_INFOCK_LINK_ELECDIS_IT:
      $window.location.origin +
      "/" +
      market +
      "/bagaglio/apparecchiatur-elettroniche/",
    CKIANC_MOD_INFOCK_LINK_ELECDIS_FR:
      $window.location.origin +
      "/" +
      market +
      "/bagages/appareils-electroniques/",
    CKIANC_MOD_INFOCK_LINK_ELECDIS_PT:
      $window.location.origin +
      "/" +
      market +
      "/bagagem/dispositivos-electronicos/",
    CKIANC_MOD_INFOCK_LINK_ELECDIS_DE:
      $window.location.origin + "/" + market + "/gepack/elektronische-gerate/",
    CKIANC_MOD_INFOCK_LINK_ELECDIS_CA:
      $window.location.origin +
      "/" +
      market +
      "/equipatges/dispositius-electronics/",
    CKIANC_MOD_INFOCK_LINK_ELECDIS_RU:
      $window.location.origin + "/" + market + "/bagazh/elektronnye-pribory/",
    CKIANC_MOD_INFOCK_LINK_ELECDIS_JA:
      $window.location.origin +
      "/" +
      market +
      "/equipajes/dispositivos-electronicos/",
    CKIANC_MOD_INFOCK_LINK_ELECDIS_ZH:
      $window.location.origin + "/" + market + "/luggage/electronic-devices/",
    CKIANC_MOD_INFOCK_LINK_ELECDIS_NL:
      $window.location.origin + "/" + market + "/luggage/electronic-devices/",
    CKIANC_MOD_INFOCK_LINK_AA_ES:
      $window.location.origin + "/jba/ay/es_ES/baggage/jbaCheckedBaggage.html",
    CKIANC_MOD_INFOCK_LINK_AA_EN:
      $window.location.origin + "/jba/aa/en_US/baggage/baggageAllowance.html",
    CKIANC_MOD_INFOCK_LINK_AA_IT:
      $window.location.origin + "/jba/aa/en_US/baggage/baggageAllowance.html",
    CKIANC_MOD_INFOCK_LINK_AA_FR:
      $window.location.origin + "/jba/aa/en_US/baggage/baggageAllowance.html",
    CKIANC_MOD_INFOCK_LINK_AA_PT:
      $window.location.origin + "/jba/aa/en_US/baggage/baggageAllowance.html",
    CKIANC_MOD_INFOCK_LINK_AA_DE:
      $window.location.origin + "/jba/aa/en_US/baggage/baggageAllowance.html",
    CKIANC_MOD_INFOCK_LINK_AA_CA:
      $window.location.origin + "/jba/ay/es_ES/baggage/jbaCheckedBaggage.html",
    CKIANC_MOD_INFOCK_LINK_AA_RU:
      $window.location.origin + "/jba/aa/en_US/baggage/baggageAllowance.html",
    CKIANC_MOD_INFOCK_LINK_AA_JA:
      $window.location.origin + "/jba/aa/en_US/baggage/baggageAllowance.html",
    CKIANC_MOD_INFOCK_LINK_AA_ZH:
      $window.location.origin + "/jba/aa/en_US/baggage/baggageAllowance.html",
    CKIANC_MOD_INFOCK_LINK_AA_NL:
      $window.location.origin + "/jba/aa/en_US/baggage/baggageAllowance.html",
    CKIANC_MOD_INFOCK_LINK_AY_ES:
      $window.location.origin + "/jba/ay/es_ES/baggage/jbaCheckedBaggage.html",
    CKIANC_MOD_INFOCK_LINK_AY_EN:
      $window.location.origin + "/jba/ay/en_GB/baggage/jbaCheckedBaggage.html",
    CKIANC_MOD_INFOCK_LINK_AY_IT:
      $window.location.origin + "/jba/ay/en_GB/baggage/jbaCheckedBaggage.html",
    CKIANC_MOD_INFOCK_LINK_AY_FR:
      $window.location.origin + "/jba/ay/en_GB/baggage/jbaCheckedBaggage.html",
    CKIANC_MOD_INFOCK_LINK_AY_PT:
      $window.location.origin + "/jba/ay/en_GB/baggage/jbaCheckedBaggage.html",
    CKIANC_MOD_INFOCK_LINK_AY_DE:
      $window.location.origin + "/jba/ay/en_GB/baggage/jbaCheckedBaggage.html",
    CKIANC_MOD_INFOCK_LINK_AY_CA:
      $window.location.origin + "/jba/ay/es_ES/baggage/jbaCheckedBaggage.html",
    CKIANC_MOD_INFOCK_LINK_AY_RU:
      $window.location.origin + "/jba/ay/en_GB/baggage/jbaCheckedBaggage.html",
    CKIANC_MOD_INFOCK_LINK_AY_JA:
      $window.location.origin + "/jba/ay/en_GB/baggage/jbaCheckedBaggage.html",
    CKIANC_MOD_INFOCK_LINK_AY_ZH:
      $window.location.origin + "/jba/ay/en_GB/baggage/jbaCheckedBaggage.html",
    CKIANC_MOD_INFOCK_LINK_AY_NL:
      $window.location.origin + "/jba/ay/en_GB/baggage/jbaCheckedBaggage.html",
    CKIANC_MOD_INFOCK_LINK_BA_ES:
      $window.location.origin + "/jba/ba/es_ES/baggage/bagchk.html",
    CKIANC_MOD_INFOCK_LINK_BA_EN:
      $window.location.origin + "/jba/ba/en_GB/baggage/bagchk.html",
    CKIANC_MOD_INFOCK_LINK_BA_IT:
      $window.location.origin + "/jba/ba/en_GB/baggage/bagchk.html",
    CKIANC_MOD_INFOCK_LINK_BA_FR:
      $window.location.origin + "/jba/ba/en_GB/baggage/bagchk.html",
    CKIANC_MOD_INFOCK_LINK_BA_PT:
      $window.location.origin + "/jba/ba/en_GB/baggage/bagchk.html",
    CKIANC_MOD_INFOCK_LINK_BA_DE:
      $window.location.origin + "/jba/ba/en_GB/baggage/bagchk.html",
    CKIANC_MOD_INFOCK_LINK_BA_CA:
      $window.location.origin + "/jba/ba/es_ES/baggage/bagchk.html",
    CKIANC_MOD_INFOCK_LINK_BA_RU:
      $window.location.origin + "/jba/ba/en_GB/baggage/bagchk.html",
    CKIANC_MOD_INFOCK_LINK_BA_JA:
      $window.location.origin + "/jba/ba/en_GB/baggage/bagchk.html",
    CKIANC_MOD_INFOCK_LINK_BA_ZH:
      $window.location.origin + "/jba/ba/en_GB/baggage/bagchk.html",
    CKIANC_MOD_INFOCK_LINK_BA_NL:
      $window.location.origin + "/jba/ba/en_GB/baggage/bagchk.html",
    "IBCOCF&IBECCF_LINK_RENT_ES":
      "http://production.rent-at-avis.com/avisonline/es/avis_iberia.nsf/c/home",
    "IBCOCF&IBECCF_LINK_RENT_EN":
      "http://production.rent-at-avis.com/avisonline/es/avis_iberia.nsf/c/gb+home",
    "IBCOCF&IBECCF_LINK_RENT_IT":
      "http://production.rent-at-avis.com/avisonline/es/avis_iberia.nsf/c/gb+home",
    "IBCOCF&IBECCF_LINK_RENT_FR":
      "http://production.rent-at-avis.com/avisonline/es/avis_iberia.nsf/c/gb+home",
    "IBCOCF&IBECCF_LINK_RENT_PT":
      "http://production.rent-at-avis.com/avisonline/es/avis_iberia.nsf/c/pt+home_",
    "IBCOCF&IBECCF_LINK_RENT_DE":
      "http://production.rent-at-avis.com/avisonline/es/avis_iberia.nsf/c/gb+home",
    "IBCOCF&IBECCF_LINK_RENT_CA":
      "http://production.rent-at-avis.com/avisonline/es/avis_iberia.nsf/c/home",
    "IBCOCF&IBECCF_LINK_RENT_RU":
      "http://production.rent-at-avis.com/avisonline/es/avis_iberia.nsf/c/gb+home",
    "IBCOCF&IBECCF_LINK_RENT_JA":
      "http://production.rent-at-avis.com/avisonline/es/avis_iberia.nsf/c/gb+home",
    "IBCOCF&IBECCF_LINK_RENT_ZH":
      "http://production.rent-at-avis.com/avisonline/es/avis_iberia.nsf/c/gb+home",
    "IBCOCF&IBECCF_LINK_RENT_NL":
      "http://production.rent-at-avis.com/avisonline/es/avis_iberia.nsf/c/gb+home",
    ONE_WORLD_LINK_ES:
      $window.location.origin +
      "/" +
      market +
      "/nuestras-alianzas/oneworld/?language=" +
      CommonsConstants.lang,
    ONE_WORLD_LINK_EN:
      $window.location.origin +
      "/" +
      market +
      "/our-alliances/oneworld/?language=" +
      CommonsConstants.lang,
    ONE_WORLD_LINK_IT:
      $window.location.origin +
      "/" +
      market +
      "/le-nostre-alleanze/oneworld/?language=" +
      CommonsConstants.lang,
    ONE_WORLD_LINK_FR:
      $window.location.origin +
      "/" +
      market +
      "/nos-alliances/oneworld/?language=" +
      CommonsConstants.lang,
    ONE_WORLD_LINK_PT:
      $window.location.origin +
      "/" +
      market +
      "/nossas-aliancas/oneworld/?language=" +
      CommonsConstants.lang,
    ONE_WORLD_LINK_DE:
      $window.location.origin +
      "/" +
      market +
      "/unsere-allianzen/oneworld/?language=" +
      CommonsConstants.lang,
    ONE_WORLD_LINK_CA:
      $window.location.origin +
      "/" +
      market +
      "/les-nostres-aliances/oneworld/?language=" +
      CommonsConstants.lang,
    ONE_WORLD_LINK_RU:
      $window.location.origin +
      "/" +
      market +
      "/our-alliances/oneworld/?language=" +
      CommonsConstants.lang,
    ONE_WORLD_LINK_JA:
      $window.location.origin +
      "/" +
      market +
      "/our-alliances/oneworld/?language=" +
      CommonsConstants.lang,
    ONE_WORLD_LINK_ZH:
      $window.location.origin +
      "/" +
      market +
      "/our-alliances/oneworld/?language=" +
      CommonsConstants.lang,
    ONE_WORLD_LINK_NL:
      $window.location.origin +
      "/" +
      market +
      "/our-alliances/oneworld/?language=" +
      CommonsConstants.lang,
    SPECIAL_REQUIREMENTS_EMERGENCY_SEATS_ES:
      $window.location.origin + "/" + market + "/reserva-de-asientos/",
    SPECIAL_REQUIREMENTS_EMERGENCY_SEATS_EN:
      $window.location.origin + "/" + market + "/seat-reservation/",
    SPECIAL_REQUIREMENTS_EMERGENCY_SEATS_IT:
      $window.location.origin + "/" + market + "/prenotazione-posti-a-sedere/",
    SPECIAL_REQUIREMENTS_EMERGENCY_SEATS_FR:
      $window.location.origin + "/" + market + "/reservations-sieges/",
    SPECIAL_REQUIREMENTS_EMERGENCY_SEATS_PT:
      $window.location.origin + "/" + market + "/reserva-lugares/",
    SPECIAL_REQUIREMENTS_EMERGENCY_SEATS_DE:
      $window.location.origin + "/" + market + "/platzreservierung/",
    SPECIAL_REQUIREMENTS_EMERGENCY_SEATS_CA:
      $window.location.origin + "/" + market + "/reserva-seients/",
    SPECIAL_REQUIREMENTS_EMERGENCY_SEATS_RU:
      $window.location.origin + "/" + market + "/bronirovanie-mest/",
    SPECIAL_REQUIREMENTS_EMERGENCY_SEATS_JA:
      $window.location.origin + "/" + market + "/seat-reservation/",
    SPECIAL_REQUIREMENTS_EMERGENCY_SEATS_ZH:
      $window.location.origin + "/" + market + "/seat-reservation/",
    SPECIAL_REQUIREMENTS_EMERGENCY_SEATS_NL:
      $window.location.origin + "/" + market + "/seat-reservation/",
    PHONE_SERVICE_CENTER_ES:
      $window.location.origin + "/" + market + "/serviberia/",
    PHONE_SERVICE_CENTER_EN:
      $window.location.origin + "/" + market + "/serviberia_en/",
    PHONE_SERVICE_CENTER_IT:
      $window.location.origin + "/" + market + "/serviberia_it/",
    PHONE_SERVICE_CENTER_FR:
      $window.location.origin + "/" + market + "/serviberia_fr/",
    PHONE_SERVICE_CENTER_PT:
      $window.location.origin + "/" + market + "/serviberia_pt/",
    PHONE_SERVICE_CENTER_DE:
      $window.location.origin + "/" + market + "/serviberia_de/",
    PHONE_SERVICE_CENTER_CA:
      $window.location.origin + "/" + market + "/serviberia_cat/",
    PHONE_SERVICE_CENTER_RU:
      $window.location.origin + "/" + market + "/serviberia_ru/",
    PHONE_SERVICE_CENTER_JA:
      $window.location.origin + "/" + market + "/serviberia/",
    PHONE_SERVICE_CENTER_ZH:
      $window.location.origin + "/" + market + "/serviberia/",
    PHONE_SERVICE_CENTER_NL:
      $window.location.origin + "/" + market + "/serviberia_en/",
    TICKET_SALES_OFFICE_ES:
      $window.location.origin + "/" + market + "/oficinas/",
    TICKET_SALES_OFFICE_EN:
      $window.location.origin + "/" + market + "/offices/",
    TICKET_SALES_OFFICE_IT: $window.location.origin + "/" + market + "/uffici/",
    TICKET_SALES_OFFICE_FR:
      $window.location.origin + "/" + market + "/agences/",
    TICKET_SALES_OFFICE_PT: $window.location.origin + "/" + market + "/lojas/",
    TICKET_SALES_OFFICE_DE:
      $window.location.origin + "/" + market + "/buros-weltweit/",
    TICKET_SALES_OFFICE_CA:
      $window.location.origin + "/" + market + "/oficines/",
    TICKET_SALES_OFFICE_RU:
      $window.location.origin + "/" + market + "/filialy/",
    TICKET_SALES_OFFICE_JA:
      $window.location.origin + "/" + market + "/oficinas/",
    TICKET_SALES_OFFICE_ZH:
      $window.location.origin + "/" + market + "/offices/",
    TICKET_SALES_OFFICE_NL:
      $window.location.origin + "/" + market + "/offices/",
    TRAVEL_INFORMATION_BA_ES:
      $window.location.origin +
      "/jba/ba/es_ES/travelInformation/mmbseatingpolicy.html",
    TRAVEL_INFORMATION_BA_EN:
      $window.location.origin +
      "/jba/ba/en_GB/travelInformation/mmbseatingpolicy.html",
    TRAVEL_INFORMATION_BA_IT:
      $window.location.origin +
      "/jba/ba/en_GB/travelInformation/mmbseatingpolicy.html",
    TRAVEL_INFORMATION_BA_FR:
      $window.location.origin +
      "/jba/ba/en_GB/travelInformation/mmbseatingpolicy.html",
    TRAVEL_INFORMATION_BA_PT:
      $window.location.origin +
      "/jba/ba/en_GB/travelInformation/mmbseatingpolicy.html",
    TRAVEL_INFORMATION_BA_DE:
      $window.location.origin +
      "/jba/ba/en_GB/travelInformation/mmbseatingpolicy.html",
    TRAVEL_INFORMATION_BA_CA:
      $window.location.origin +
      "/jba/ba/es_ES/travelInformation/mmbseatingpolicy.html",
    TRAVEL_INFORMATION_BA_RU:
      $window.location.origin +
      "/jba/ba/en_GB/travelInformation/mmbseatingpolicy.html",
    TRAVEL_INFORMATION_BA_JA:
      $window.location.origin +
      "/jba/ba/en_GB/travelInformation/mmbseatingpolicy.html",
    TRAVEL_INFORMATION_BA_ZH:
      $window.location.origin +
      "/jba/ba/en_GB/travelInformation/mmbseatingpolicy.html",
    TRAVEL_INFORMATION_BA_NL:
      $window.location.origin +
      "/jba/ba/en_GB/travelInformation/mmbseatingpolicy.html",
    TRAVEL_INFORMATION_AA_ES:
      $window.location.origin + "/jba/aa/es_US/travelInformation/seats.html",
    TRAVEL_INFORMATION_AA_EN:
      $window.location.origin + "/jba/aa/en_US/travelInformation/seats.html",
    TRAVEL_INFORMATION_AA_IT:
      $window.location.origin + "/jba/aa/en_US/travelInformation/seats.html",
    TRAVEL_INFORMATION_AA_FR:
      $window.location.origin + "/jba/aa/en_US/travelInformation/seats.html",
    TRAVEL_INFORMATION_AA_PT:
      $window.location.origin + "/jba/aa/en_US/travelInformation/seats.html",
    TRAVEL_INFORMATION_AA_DE:
      $window.location.origin + "/jba/aa/en_US/travelInformation/seats.html",
    TRAVEL_INFORMATION_AA_CA:
      $window.location.origin + "/jba/aa/es_US/travelInformation/seats.html",
    TRAVEL_INFORMATION_AA_RU:
      $window.location.origin + "/jba/aa/en_US/travelInformation/seats.html",
    TRAVEL_INFORMATION_AA_JA:
      $window.location.origin + "/jba/aa/en_US/travelInformation/seats.html",
    TRAVEL_INFORMATION_AA_ZH:
      $window.location.origin + "/jba/aa/en_US/travelInformation/seats.html",
    TRAVEL_INFORMATION_AA_NL:
      $window.location.origin + "/jba/aa/en_US/travelInformation/seats.html",
    TRAVEL_INFORMATION_AY_ES:
      $window.location.origin +
      "/jba/ay/es_ES/travelInformation/jbaConditionsOfCarriage.html",
    TRAVEL_INFORMATION_AY_EN:
      $window.location.origin +
      "/jba/ay/en_GB/travelInformation/jbaConditionsOfCarriage.html",
    TRAVEL_INFORMATION_AY_IT:
      $window.location.origin +
      "/jba/ay/en_GB/travelInformation/jbaConditionsOfCarriage.html",
    TRAVEL_INFORMATION_AY_FR:
      $window.location.origin +
      "/jba/ay/en_GB/travelInformation/jbaConditionsOfCarriage.html",
    TRAVEL_INFORMATION_AY_PT:
      $window.location.origin +
      "/jba/ay/en_GB/travelInformation/jbaConditionsOfCarriage.html",
    TRAVEL_INFORMATION_AY_DE:
      $window.location.origin +
      "/jba/ay/en_GB/travelInformation/jbaConditionsOfCarriage.html",
    TRAVEL_INFORMATION_AY_CA:
      $window.location.origin +
      "/jba/ay/es_ES/travelInformation/jbaConditionsOfCarriage.html",
    TRAVEL_INFORMATION_AY_RU:
      $window.location.origin +
      "/jba/ay/en_GB/travelInformation/jbaConditionsOfCarriage.html",
    TRAVEL_INFORMATION_AY_JA:
      $window.location.origin +
      "/jba/ay/en_GB/travelInformation/jbaConditionsOfCarriage.html",
    TRAVEL_INFORMATION_AY_ZH:
      $window.location.origin +
      "/jba/ay/en_GB/travelInformation/jbaConditionsOfCarriage.html",
    TRAVEL_INFORMATION_AY_NL:
      $window.location.origin +
      "/jba/ay/en_GB/travelInformation/jbaConditionsOfCarriage.html",
    PAYMENT_REFOUNDS_ES:
      $window.location.origin + "/" + market + "/reembolsos/",
    PAYMENT_REFOUNDS_EN: $window.location.origin + "/" + market + "/refunds/",
    PAYMENT_REFOUNDS_IT: $window.location.origin + "/" + market + "/refunds/",
    PAYMENT_REFOUNDS_FR: $window.location.origin + "/" + market + "/refunds/",
    PAYMENT_REFOUNDS_PT: $window.location.origin + "/" + market + "/refunds/",
    PAYMENT_REFOUNDS_DE: $window.location.origin + "/" + market + "/refunds/",
    PAYMENT_REFOUNDS_CA:
      $window.location.origin + "/" + market + "/reembolsos/",
    PAYMENT_REFOUNDS_RU: $window.location.origin + "/" + market + "/vozvrat/",
    PAYMENT_REFOUNDS_JA: $window.location.origin + "/" + market + "/refunds/",
    PAYMENT_REFOUNDS_ZH: $window.location.origin + "/" + market + "/refunds/",
    PAYMENT_REFOUNDS_NL: $window.location.origin + "/" + market + "/refunds/",
    IBCOAC_MOD_INFOCK_LINK_PASRIGHTS_ES:
      $window.location.origin + "/" + market + "/derechos-pasajero/",
    IBCOAC_MOD_INFOCK_LINK_PASRIGHTS_EN:
      $window.location.origin + "/" + market + "/passengers-rights/",
    IBCOAC_MOD_INFOCK_LINK_PASRIGHTS_CA:
      $window.location.origin + "/" + market + "/drets-del-passatger/",
    IBCOAC_MOD_INFOCK_LINK_PASRIGHTS_PT:
      $window.location.origin + "/" + market + "/direitos-do-passageiro/",
    IBCOAC_MOD_INFOCK_LINK_PASRIGHTS_IT:
      $window.location.origin + "/" + market + "/diritti-del-passeggero/",
    IBCOAC_MOD_INFOCK_LINK_PASRIGHTS_FR:
      $window.location.origin + "/" + market + "/droits-du-passager/",
    IBCOAC_MOD_INFOCK_LINK_PASRIGHTS_DE:
      $window.location.origin + "/" + market + "/rechte-des-passagiers/",
    IBCOAC_MOD_INFOCK_LINK_PASRIGHTS_NL:
      $window.location.origin + "/" + market + "/passengers-rights/",
    IBCOAC_MOD_INFOCK_LINK_PASRIGHTS_RU:
      $window.location.origin + "/" + market + "/passengers-rights/",
    IBCOAC_MOD_INFOCK_LINK_PASRIGHTS_JA:
      $window.location.origin + "/" + market + "/passengers-rights/",
    IBCOAC_MOD_INFOCK_LINK_PASRIGHTS_ZH:
      $window.location.origin + "/" + market + "/passengers-rights/",
    GREY_HEADER_LINK_NAME:
      $window.location.origin + "/web/iberiaPlusHomePrivada.do?menuId=IBMIBP",
    GREY_HEADER_LINK_AVIOS:
      $window.location.origin + "/web/listMovements.do?menuId=IBPTOS",
    GREY_HEADER_REGISTRATION:
      $window.location.origin + "/web/userRegistration.do?tabId=&menuId=IBHMPA",
    "IBCOCF&IBECCF_LINK_TRAVEL":
      "https://www.magroup-online.com/wl/iba/" + CommonsConstants.lang + "/",
    "IBCOCF&IBECCF_LINK_HOTEL":
      "https://www.booking.com/index.html?aid=380264&label=pagemytrips-ban-380264-click",
    IBCOSE_ENLACE_REGISTRO:
      $window.location.origin + "/web/userRegistration.do",
    IBCOAC_MOD_INFOCK_LINK_PASRIGHTS:
      $window.location.origin +
      "/web/product.do?cntCat=Productos/DERPAS&cntId=derechos_del_pasajero",
    IBERIA_DESTINATIONS_IMAGES:
      $window.location.origin + "/wcs/imagenes/destinos/calculadoraAvios/",
    IBERIA_NEW_REDEMPTION_SEARCH_ENGINE_ES:
      $window.location.origin + "/" + market + "/buscador-vuelos-con-avios/",
    IBERIA_NEW_REDEMPTION_SEARCH_ENGINE_CA:
      $window.location.origin + "/" + market + "/cercador-vols-amb-avios/",
    IBERIA_NEW_REDEMPTION_SEARCH_ENGINE_EN:
      $window.location.origin +
      "/" +
      market +
      "/search-engine-flights-with-avios/",
    IBERIA_NEW_REDEMPTION_SEARCH_ENGINE_FR:
      $window.location.origin +
      "/" +
      market +
      "/moteur-de-recherche-vols-avec-avios/",
    IBERIA_NEW_REDEMPTION_SEARCH_ENGINE_IT:
      $window.location.origin +
      "/" +
      market +
      "/motore-di-ricerca-voli-con-avios/",
    IBERIA_NEW_REDEMPTION_SEARCH_ENGINE_DE:
      $window.location.origin + "/" + market + "/suchmaschine-fluge-mit-avios/",
    IBERIA_NEW_REDEMPTION_SEARCH_ENGINE_NL:
      $window.location.origin +
      "/" +
      market +
      "/zoekmachine-vluchten-met-avios/",
    IBERIA_NEW_REDEMPTION_SEARCH_ENGINE_ZH:
      $window.location.origin +
      "/" +
      market +
      "/zh/search-engine-flights-with-avios/",
    IBERIA_NEW_REDEMPTION_SEARCH_ENGINE_JA:
      $window.location.origin +
      "/" +
      market +
      "/ja/search-engine-flights-with-avios/",
    IBERIA_NEW_REDEMPTION_SEARCH_ENGINE_PT:
      $window.location.origin + "/" + market + "/buscador-de-voos-com-avios/",
    IBERIA_NEW_REDEMPTION_SEARCH_ENGINE_RU:
      $window.location.origin + "/" + market + "/poisk-biletov-za-avios/",
    IBERIA_NEW_LOGIN_ES: $window.location.origin + "/" + market + "/es/login/",
    IBERIA_NEW_LOGIN_CA: $window.location.origin + "/" + market + "/ca/login/",
    IBERIA_NEW_LOGIN_EN: $window.location.origin + "/" + market + "/en/login/",
    IBERIA_NEW_LOGIN_FR: $window.location.origin + "/" + market + "/fr/login/",
    IBERIA_NEW_LOGIN_IT: $window.location.origin + "/" + market + "/it/login/",
    IBERIA_NEW_LOGIN_DE: $window.location.origin + "/" + market + "/de/login/",
    IBERIA_NEW_LOGIN_NL: $window.location.origin + "/" + market + "/nl/login/",
    IBERIA_NEW_LOGIN_ZH: $window.location.origin + "/" + market + "/zh/login/",
    IBERIA_NEW_LOGIN_JA: $window.location.origin + "/" + market + "/ja/login/",
    IBERIA_NEW_LOGIN_PT: $window.location.origin + "/" + market + "/pt/login/",
    IBERIA_NEW_LOGIN_RU: $window.location.origin + "/" + market + "/ru/login/",
    IBERIA_NEW_REDEMPTION_BOOKING_ES: $window.location.origin + "/flights/",
    IB_INCOMPLETE_PROFILE_ES:
      $window.location.origin + "/" + market + "/iberiaplus/registrese/",
    IB_INCOMPLETE_PROFILE_CA:
      $window.location.origin + "/" + market + "/iberiaplus/registri-s/",
    IB_INCOMPLETE_PROFILE_EN:
      $window.location.origin + "/" + market + "/iberiaplus/register/",
    IB_INCOMPLETE_PROFILE_FR:
      $window.location.origin + "/" + market + "/iberiaplus/inscrivez-vous/",
    IB_INCOMPLETE_PROFILE_IT:
      $window.location.origin + "/" + market + "/iberiaplus/registrati/",
    IB_INCOMPLETE_PROFILE_DE:
      $window.location.origin +
      "/" +
      market +
      "/iberiaplus/melden-sie-sich-jetzt-an/",
    IB_INCOMPLETE_PROFILE_NL:
      $window.location.origin + "/" + market + "/iberiaplus/register/",
    IB_INCOMPLETE_PROFILE_ZH:
      $window.location.origin + "/" + market + "/iberiaplus/register/",
    IB_INCOMPLETE_PROFILE_JA:
      $window.location.origin + "/" + market + "/iberiaplus/register/",
    IB_INCOMPLETE_PROFILE_PT:
      $window.location.origin + "/" + market + "/iberiaplus/registe-se/",
    IB_INCOMPLETE_PROFILE_RU:
      $window.location.origin + "/" + market + "/iberiaplus/registratsiya/",
    FLASH_OFFERS_DESTINATIONS_IMAGES:
      $window.location.origin + "/wcs/imagenes/destinos/city_",
    FLASH_OFFERS_BANNER_IMAGES:
      $window.location.origin +
      "/wcs/imagenes/destinos/flashoffers/herobanner_flashoffer_detalle_",
    FLASH_OFFERS_CARROUSEL_BANNER_IMAGES:
      $window.location.origin +
      "/wcs/imagenes/destinos/flashoffers/herobanner_flashoffer_principal_",
    FLY_WITH_IB_PETS_CA:
      $window.location.origin + "/" + market + "/viatjar-amb-iberia/animals/",
    FLY_WITH_IB_PETS_DE:
      $window.location.origin + "/" + market + "/mit-iberia-reisen/haustieren/",
    FLY_WITH_IB_PETS_EN:
      $window.location.origin + "/" + market + "/fly-with-iberia/pets/",
    FLY_WITH_IB_PETS_ES:
      $window.location.origin + "/" + market + "/viajar-con-iberia/animales",
    FLY_WITH_IB_PETS_FR:
      $window.location.origin + "/" + market + "/voyager-avec-iberia/animaux/",
    FLY_WITH_IB_PETS_IT:
      $window.location.origin + "/" + market + "/volare-con-iberia/animali/",
    FLY_WITH_IB_PETS_PT:
      $window.location.origin + "/" + market + "/voe-com-iberia/animais/",
    FLY_WITH_IB_PETS_RU:
      $window.location.origin +
      "/" +
      market +
      "/puteshestviya-s-iberia/zhivotnye/",
  };
  return (text: string, language: string): string => {
    const value = language ? `_${language.toUpperCase()}` : "";
    const linkId = `${text}${value}`;
    const res = links[linkId];
    const linksList = localStorageService.get("linksList") || {};
    const generalLinksList = localStorageService.get("generalLinksList") || {};
    let link: CommonsFilterModels.LinkFilterData = linksList[text]
      ? linksList[text]
      : generalLinksList[text]
        ? generalLinksList[text]
        : { uri: `/${text}` };

    if (!res) {
      let valueOrigin = link.needsOrigin ? $window.location.origin : "";
      let valueMarket = link.needsMarket ? `/${market}` : "";
      let valueLang = link.needsLang ? `/${lang}` : "";

      return `${valueOrigin}${valueMarket}${valueLang}${link.uri}`;
    }
    return res;
  };
}
module LinksFilter {
  export const $inject = [
    "CommonsConstants",
    "$window",
    "localStorageService",
    "$rootScope",
  ];
}
@Filters(
  "ib-commons-filters-module",
  ["CommonsConstants", "$window", "localStorageService", "$rootScope"],
  [],
  LinksFilter,
  "LinksFilter",
)()
class LinksFilterClass {
  constructor() {}
}
