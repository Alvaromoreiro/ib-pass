/*<![CDATA[*/
		
jQuery.datepicker.regional['es'] = {
    closeText: 'Cerrar',
    prevText: 'Anterior',
    nextText: 'Siguiente',
    currentText: '$htDatos.displayHandler.getMessage("BOOKING.RB.actual")',
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'],
    dayNamesMin: ['do', 'lu', 'ma', 'mi', 'ju', 'vi', 'sá'],
    weekHeader: 'Sm',
    dateFormat: 'dd/mm/yy',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''
};
    

var language = 'es';
if ((typeof globalConfig != 'undefined') && globalConfig.currentLanguage) {
  language = globalConfig.currentLanguage;
}
jQuery.datepicker.setDefaults(jQuery.datepicker.regional[language]);
/*]]>*/

/*<![CDATA[*/
if (typeof globalConfig == 'undefined') {
    globalConfig = {};
}



if (typeof globalConfig.errorData == 'undefined') {
 globalConfig.errorData = {};
}

var defaultGlobalConfig = {
 modal : {
      closeTitle : 'Cerrar ventana',
      closeImageTitle : 'Icono cerrar',
      closeImageAlt : 'Cerrar',
      closeImageSrc : '/wcs_statics/airnostrum/img/close_modal_hover_small.png'
 }
};
globalConfig.errorData = {
errorsTitle:'Error',
strErrsOrDest: [
 'Elige una ciudad de origen.',
 'Elige una ciudad de destino.',
 'Las ciudades de origen y destino deben ser distintas'
],
strErrsDates: [
 'La fecha de salida no es válida',
 'La fecha de regreso no es válida',     
 'La fecha de SALIDA no puede ser posterior a la fecha de VUELTA.',
 'Las fechas seleccionadas son anteriores a la fecha actual.'
],
strNullDate: [ 
                 'La fecha de salida no es válida',
                 'La fecha de regreso no es válida'
              ], 
strAdviceText: 'Aviso',
strBackText: 'Volver',
strContinueText: 'Continuar',
strInvalidDate: 'La fecha de SALIDA no puede ser posterior a la fecha de VUELTA.',
strErrorGeneral: 'Debes rellenar todos los campos',
strErrsPassengers: [
      'El número de bebés no puede ser mayor que el de adultos',
      'Sólo es posible hacer reservas para un máximo de 9 pasajeros. Si lo desea puede hacer varias reservas de forma separada o póngase en contacto con Serviberia o nuestra central de reservas en su país. Puede encontrar el teléfono en la sección de contacto en el pie de página.',
      'Siempre debe viajar un adulto en la reserva. No se permite la reserva online de menores hasta 12 años (sin cumplir) viajando solos. Para ellos debes contratar el servicio de acompañamiento. <br /> Los menores de 12  a 17 años se consideran adultos a efectos de tarifa. Si deseas nuestro servicio de acompañamiento puedes realizar la compra como adulto y contratarlo posteriormente a través de nuestro teléfono de reservas. <br /> Un adulto puede viajar con un máximo de 2 menores de 5 años (1 bebé y un niño o dos niños). Si el tercer niño (o siguientes) es mayor de 5 años puedes continuar. Para más información consulte en Serviberia 901 111 500',
      'Debe seleccionar algún pasajero',
      'Los niños no pueden viajar sin adultos'
        ]
}
/*]]>*/