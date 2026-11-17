import retrieveGlobalVariables from '../general/ibe_variables';
const { localeg, marketg } = retrieveGlobalVariables();

//Resize images malla cards conexiones otros aeropuertos

$(window).resize(function(){
  imageCardResolutions('.ibe-bob--cards--img');
  imageCardResolutions('.ibe-bob--map--img');
});

if($('.ibe-bob--cards--img').length > 0){
  imageCardResolutions('.ibe-bob--cards--img');
}

if($('.ibe-bob--map--img').length > 0){
  imageCardResolutions('.ibe-bob--map--img');
}


function imageCardResolutions(selector){
    $(selector).each(function(){
      var bg = $(this).css('background-image');
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
            url_final = bseImagen+'_480'+extImagen;
          }else if(windowsize >= 320){
            url_final = bseImagen+'_320'+extImagen;
          }else{
            url_final = bseImagen+'_320'+extImagen;
          }

      $(this).css('background-image', 'url(' + url_final + ')');
    });
      
}

