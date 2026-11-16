import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

(function () {
    'use strict';

    angular
        .module('ib-MmB-filters-module')
        .filter('DateFormatFilter', DateFormatFilter);

    DateFormatFilter.$inject = ['$rootScope', 'MmBAppConstants'];
    function DateFormatFilter($rootScope, MmBAppConstants) {
        var months = [
            'MONTH_JANUARY',
            'MONTH_FEBRUARY',
            'MONTH_MARCH',
            'MONTH_APRIL',
            'MONTH_MAY',
            'MONTH_JUNE',
            'MONTH_JULY',
            'MONTH_AUGUST',
            'MONTH_SEPTEMBER',
            'MONTH_OCTOBER',
            'MONTH_NOVEMBER',
            'MONTH_DECEMBER'
        ];
        var weekDays = [
            'WEEKDAY_MONDAY',
            'WEEKDAY_TUESDAY',
            'WEEKDAY_WEDNESDAY',
            'WEEKDAY_THURSDAY',
            'WEEKDAY_FRYDAY',
            'WEEKDAY_SATURDAY',
            'WEEKDAY_SUNDAY'
        ];

        return formatDate;

        ////////////////

        function formatDate(inputDate, format) {
            var dateTime, date, numWeekDay, month, deleteHyphen, transformedDate, utilsDate;
            if (inputDate) {
                dateTime = inputDate.indexOf(' ') !== -1 ? inputDate.split(' ')[1] : '';
                date = dayjs(inputDate);
                numWeekDay = date.isoWeekday();
                month = date.month();
                deleteHyphen = new RegExp('-', 'g');
                transformedDate = inputDate.replace(deleteHyphen, '/');
                utilsDate = {
                    'dateTime': dateTime,
                    'weekDay': weekDays[numWeekDay - 1],
                    'day': date.date(),
                    'monthNumber': month + 1,
                    'month': months[month],
                    'year': date.year(),
                    'originalDate': dayjs(transformedDate).format()
                };
                utilsDate['formatedDate'] = getFormatedDate(date, format).formatedDate;
            }
            return utilsDate;
        };

         /**
         * Retrieve the formatted date based on the current language
         * @param {*} date Parameter that collects the filter date
         * @param {*} format Parameter that collects the format of the filter that must be recovered from the locals
         * When the 'iberia-web-content/locales/locale_*.js' has the correct format, we have to change the 'MmBAppConstants' by the call to 'CommonsSessionStorageService' to get the 'commercialInfo' => constantData = this.CommonsSessionStorageService.get('commercialInfo')
         * dateFormatByLanguage = commercialData.languages[languageIndex].dateFormat[format]
         */
        function getFormatedDate(date, format) {
            let language = $rootScope.appLang, constantsData = MmBAppConstants, formatedDate = null;
            let languageIndex = 0; let dateFormatByLanguage = null;
            if (language && constantsData?.FORMAT_DATE) {
                let {dateFormatByLanguageInit, foundedLanguage} = formatDateWhile(languageIndex, constantsData,language, format);
                dateFormatByLanguage = dateFormatByLanguageInit;
                formatedDate = foundedLanguage && dateFormatByLanguage ? dayjs(date).format(dateFormatByLanguage) : dayjs(date).format(constantsData.FORMAT_DATE[0].dateFormat.gaDate);
            } else {
                formatedDate = dayjs(date).format('L');
            };

            return { 'formatedDate': formatedDate, 'dateFormatByLanguage': dateFormatByLanguage };
        };

        function formatDateWhile(languageIndex, constantsData, language, format) {
            let dateFormatByLanguageInit = null;
            let foundedLanguage = false;

            while (!foundedLanguage && languageIndex < constantsData.FORMAT_DATE.length) {
                if (constantsData.FORMAT_DATE[languageIndex].code === language.toLowerCase()) {
                    dateFormatByLanguageInit = constantsData.FORMAT_DATE[languageIndex].dateFormat[format];
                    foundedLanguage = true;
                }
                languageIndex++;
            }
            return {dateFormatByLanguageInit, foundedLanguage};
        };
    };

   
})();
