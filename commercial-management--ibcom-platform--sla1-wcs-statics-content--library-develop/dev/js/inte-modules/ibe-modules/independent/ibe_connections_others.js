import retrieveGlobalVariables from '../general/ibe_variables';
import { updateDigitalData } from "../manage/ibe_common";
const { localeg, marketg , quadrigam} = retrieveGlobalVariables();

/*Push event view */
digital_data.Quadrigam = quadrigam;
updateDigitalData('view');

/*Clic seccion: Audanas y equipajes / Mas informacion*/
$('div.ibe-connections-other-airports-card-container > div > div > div > div > a').on('click', function(){

  var category = $(this).html().replace(/[`´~!@#$%^&*()_|+\-=?¿;:'",.<>\{\}\[\]\\\/(\t\n|\n|\t)]/gi,'').toLowerCase();
  var aeropuerto = $(this).parent().parent().parent().find('.ibe-connections-other-airports-card__title').html();
  aeropuerto = aeropuerto.replace(/[`´~!@#$%^&*()_|+\-=?¿;:'",.<>\{\}\[\]\\\/(\t\n|\n|\t)]/gi,'').toLowerCase();

  const eventData = {
    eventName: 'interaccion',
    eventCategory: category.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
    eventAction: 'clic',
    eventLabel: aeropuerto.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
  };
  if (typeof (window.DigitalChange) !== 'undefined') {
      window.DigitalChange('interaction', eventData);
  }
  if (typeof (window.dataLayer) !== 'undefined') {
      window.dataLayer.push(eventData, { event: 'interaction' });
  }

});

/*Clic seccion: Contactar*/
$('div.ibe-box-divided__content > p > a').on('click', function(){

  var title = $(this).parent().parent().find('.title').html();
  title = title.replace(/[`´~!@#$%^&*()_|+\-=?¿;:'",.<>\{\}\[\]\\\/(\t\n|\n|\t)]/gi,'').toLowerCase();
  const eventData = {
    eventName: 'interaccion',
    eventCategory: 'contacta con nosotros',
    eventAction: 'clic',
    eventLabel: title.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
  };
  if (typeof (window.DigitalChange) !== 'undefined') {
      window.DigitalChange('interaction', eventData);
  }
  if (typeof (window.dataLayer) !== 'undefined') {
      window.dataLayer.push(eventData, { event: 'interaction' });
  }

});

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


//Resize images malla cards conexiones otros aeropuertos
$(window).resize(function(){
  imageCardResolutions();
});

if($('.ibe-connections-other-airports-card__img').length > 0){
  imageCardResolutions();
}

function imageCardResolutions(){
    $('.ibe-connections-other-airports-card__img').each(function(){
      var bg = $(this).attr('src');
      var urlinit = bg.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
      var auxInt = urlinit.lastIndexOf(".");
      var bseImagen,extImagen;
     
      bseImagen = urlinit.substring(0, auxInt);
      extImagen = urlinit.substring(auxInt, urlinit.length);
      var auxInt2 = bseImagen.lastIndexOf("_");
      bseImagen = bseImagen.substring(0, auxInt2);
     
      
      var url_final = bseImagen+'_1280'+extImagen;
      var windowsize = $(window).width();
        if(windowsize >= 1280){
            url_final = bseImagen+'_1280'+extImagen;
          }else if(windowsize >= 1024){
            url_final = bseImagen+'_1024'+extImagen;
          }else if(windowsize >= 768){
            url_final = bseImagen+'_768'+extImagen;
          }else if(windowsize >= 480){
            url_final = bseImagen+'_320'+extImagen;
          }else if(windowsize >= 320){
            url_final = bseImagen+'_320'+extImagen;
          }else{
            url_final = bseImagen+'_320'+extImagen;
          }

      $(this).attr('src',url_final);
    });
}

