import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

(function () {

    angular.module('ib-MmB-change-flights-service').factory('ChangeFlightsTransformer', ChangeFlightsTransformer);


    ChangeFlightsTransformer.$inject = [];


    function ChangeFlightsTransformer() {

        return {
            transformBlackOutPeriods: transformBlackOutPeriods
        };

        function transformBlackOutPeriods(response) {
            var transformedData = { 'blackOutPeriods': [], 'maxDate': dayjs().add(360, 'day'), 'allowedPeriods': [] };
            if (response) {
                if (response.allowedPeriods?.length > 1){
                    transformedData = transformFlexAllowed(response);
                }
                else{
                transformedData.blackOutPeriods = response.blackoutPeriods;
                transformedData.maxDate = dayjs(response.allowedPeriods[0].dateTo);
                transformedData.minDate = dayjs(response.allowedPeriods[0].dateFrom);
                transformedData.allowedPeriods = response.allowedPeriods;
                }
            }
            return transformedData;
        }

        function transformFlexAllowed (response) {
            var transformedData = { 'blackOutPeriods': [], 'maxDate': dayjs().add(360, 'day'), 'allowedPeriods': [] };
            let allowPeriodsTransformArrayData = response.allowedPeriods.map((val) => ({
                dateFrom: new Date(val.dateFrom),
                dateTo: new Date (val.dateTo),
                type: val.type
            }));

        //Sort dates
        let allowPeriodsTransformArrayDataSort = allowPeriodsTransformArrayData.sort((a,b) => a.dateTo - b.dateTo);

        //Take Min and Max Date
        const allowPeriodsArrayMinDate = allowPeriodsTransformArrayData.map(allowedPeriod => allowedPeriod.dateFrom);
        const allowPeriodsArrayMaxDate =  allowPeriodsTransformArrayData.map(allowedPeriod => allowedPeriod.dateTo);
        const minDate = new Date(Math.min.apply(null,allowPeriodsArrayMinDate));
        const maxDate = new Date(Math.max.apply(null,allowPeriodsArrayMaxDate));
        transformedData.maxDate = maxDate;
        transformedData.minDate = minDate;

        //Take BlackoutPeriods
        let blackOutPeriodsArray = [];
        for (let i = 0; i< allowPeriodsTransformArrayDataSort.length-1; i++){

                let dateFrom = new Date(allowPeriodsTransformArrayDataSort[i].dateTo.setMinutes(allowPeriodsTransformArrayDataSort[i].dateTo.getMinutes() +1));
                let dateTo = new Date(allowPeriodsTransformArrayDataSort[i+1].dateFrom.setMinutes(allowPeriodsTransformArrayDataSort[i+1].dateFrom.getMinutes() -1));

                var blackOutPeriod =  { 'dateFrom': dateFrom,
                                        'dateTo': dateTo,
                                        'type': 'BLACKOUT'
                                    };

                blackOutPeriodsArray.push(blackOutPeriod);

        }
        const value = response.blackoutPeriods;
        if(response.blackoutPeriods?.length > 0){
            for (let j = 0; j< value.length; j++){
            blackOutPeriodsArray.push(value[j]);
            }
        }

        let blackOutPeriodsTransformArrayData = blackOutPeriodsArray.map((val) => ({
            dateFrom: dayjs(val.dateFrom).format('YYYY-MM-DD HH:mm'),
            dateTo: dayjs(val.dateTo).format('YYYY-MM-DD HH:mm'),
            type: val.type
        }));
        transformedData.blackOutPeriods = blackOutPeriodsTransformArrayData;
        transformedData.allowedPeriods = response.allowedPeriods;
        return transformedData;
        }
    }

})();
