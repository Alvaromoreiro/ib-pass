import retrieveGlobalVariables from '../general/ibe_variables';
import { updateDigitalData } from "../manage/ibe_common";
const { localeg, marketg , quadrigam} = retrieveGlobalVariables();

/*Push event view */
digital_data.Quadrigam = quadrigam;
updateDigitalData('view');

/*Clic seccion: Faqs*/
$('.ibe-accordion__header > a').on('click', function(){
  var title = $(this).html();
  title = title.replace(/[´`~!@#$%^&*()_|+\-=?¿;:'",.<>\{\}\[\]\\\/(\t\n|\n|\t)]/gi,'').toLowerCase();
  title = title.substring(0, 29);
  const eventData = {
    eventName: 'interaccion',
    eventCategory: 'preguntas frecuentes',
    eventAction: 'view faq',
    eventLabel: title.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
  };
  if (typeof (window.DigitalChange) !== 'undefined') {
      window.DigitalChange('interaction', eventData);
  }
  if (typeof (window.dataLayer) !== 'undefined') {
      window.dataLayer.push(eventData, { event: 'interaction' });
  }
});

if($('.tabla-connections').length > 0){
  $('#llegadas').on('selectmenuchange', function(e,ui) {
    var pllegada = ui.item.value;
    var psalida = $('#salidas').val();
    $.ajax({
      method: 'GET',
      url: '/cs/Satellite',
      data: {
        pagename: 'IB_SE/getConnectionMadrid',
        market: marketg,
        locale: localeg,
        puertaLlegada: pllegada,
        puertaSalida: psalida
      },
      success(data) {
        $('.conexionesBlock').html(data);
      }
    });
  });

  $('#salidas').on('selectmenuchange', function(e,ui) {
    var psalida = ui.item.value;
    var pllegada = $('#llegadas').val();
    $.ajax({
      method: 'GET',
      url: '/cs/Satellite',
      data: {
        pagename: 'IB_SE/getConnectionMadrid',
        market: marketg,
        locale: localeg,
        puertaLlegada: pllegada,
        puertaSalida: psalida
      },
      success(data) {
        $('.conexionesBlock').html(data);
      }
    });
  });

  if(window.innerWidth >= dFrontJs.resolutions.md){
    $('.tabla-connections-mobile').css('display','none');
    $('.tabla-connections').css('display','block');
  }else{
    $('.tabla-connections').css('display','none');
    $('.tabla-connections-mobile').css('display','block');
  }

  $(window).resize(function () {
    if ($(window).width() >= dFrontJs.resolutions.md) {
      $('.tabla-connections-mobile').css('display','none');
      $('.tabla-connections').css('display','block');
    }
    if ($(window).width() <= dFrontJs.resolutions.md) {
      $('.tabla-connections').css('display','none');
      $('.tabla-connections-mobile').css('display','block');
    }
  });
}

if($('.modal-qr-conexiones').length > 0){
 var modalId = $('.modal-qr-conexiones').attr("data-id");
 $.ajax({
  method: 'GET',
  url: '/cs/Satellite',
  data: {
    pagename: 'IB_SE/getModalConnections',
    market: marketg,
    locale: localeg,
    cid: modalId
  },
  success(data) {
    $('body').append(data);
    dFrontJs.ibe_modal.closeModal();
  }
 });

}

if($('.ibe-connections-container-col').length > 0){

  if(window.innerWidth >= dFrontJs.resolutions.md){
    $('.link-connections-mobile').css('display','none');
    $('.modal-qr-conexiones').css('display','inline');
  }else{
    $('.link-connections-mobile').css('display','inline');
    $('.modal-qr-conexiones').css('display','none');
  }

  $(window).resize(function () {
    if ($(window).width() >= dFrontJs.resolutions.md) {
      $('.link-connections-mobile').css('display','none');
      $('.modal-qr-conexiones').css('display','inline');
    }
    if ($(window).width() <= dFrontJs.resolutions.md) {
      $('.link-connections-mobile').css('display','inline');
      $('.modal-qr-conexiones').css('display','none');
    }
  });

 }