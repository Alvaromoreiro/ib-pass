

jQuery.datepicker.regional['en'] = {
    closeText: 'Close',
    prevText: 'Back',
    nextText: 'Next',
    currentText: '$htDatos.displayHandler.getMessage("BOOKING.RB.actual")',
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    weekHeader: 'Wk',
    dateFormat: 'dd/mm/yy',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''
};
			
var language = 'en';
if ((typeof globalConfig != 'undefined') && globalConfig.currentLanguage) {
    language = globalConfig.currentLanguage;
}
jQuery.datepicker.setDefaults(jQuery.datepicker.regional[language]);

    if (typeof globalConfig == 'undefined') {
            globalConfig = {};
    }

    
        
    if (typeof globalConfig.errorData == 'undefined') {
            globalConfig.errorData = {};
    }
        
    var defaultGlobalConfig = {
            modal : {
                closeTitle : 'Close',
                closeImageTitle : 'Close',
                closeImageAlt : 'Close',
                closeImageSrc : '/wcs_statics/airnostrum/img/close_modal_hover_small.png'
            }
    };
    globalConfig.errorData = {
        errorsTitle:'Error',
        strErrsOrDest: [
            'Choose an origin city',
            'Choose a destination city',
            'The origin and destination cities must be different'
        ],
        strErrsDates: [
            'The outbound date is not valid',
            'The return date is not valid',     
            'RETURN date must be after DEPARTURE date',
            'The dates you have selected are prior to the current date'
        ],
        strNullDate: [ 
                            'The outbound date is not valid',
                            'The return date is not valid'
                        ], 
        strAdviceText: 'Notice',
        strBackText: 'Back',
        strContinueText: 'Continue',
        strInvalidDate: 'RETURN date must be after DEPARTURE date',
        strErrorGeneral: 'You must fill in all fields',
        strErrsPassengers: [
                'Number of infants cannot be higher than number of adults',
                'It is only possible to make a booking for a maximun of 9 people. If you wish you can make several separate bookings or contact Serviberia or our Call Centre for your country. You will find the telephone number in the contacts section at the foot of the page.',
                'An adult must always fly in the reservation. Online reservations for minors under 12 years old flying alone are not permitted. You must purchase the companion service for these minors.<br /> Minors between 12 and 17 years old are considered adults for the fare purposes. If you want our companion service you can make the purchase as an adult and later sign up through our telephone reservation service.<br /> An adult can travel with a maximum of two children aged under five (one baby and one or two children). If the third child (or following) is older than five you may continue. For further information, consult Serviberia 901 111 500',
                'You should choose a passenger',
                'Children cannot fly without an adult'
                ]
    }
