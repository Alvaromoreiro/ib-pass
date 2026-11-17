/* eslint-disable no-var */
dFrontJs.ibe_counter_night = function() {
    var _lessOrPlus = ($count, $obj) => {
        var c = parseInt($count.text());
        ($obj.data("night-button") === "less") ? c-- : c++;
        return c;
    };

    //Función para revertir el formato
    var _convertDateFormat = function (string) {
        var info = string.split('/').reverse().join('-');
        return info;
    };

    //Función para formato en inglés
    var _getFormattedDate = function (date) {
        var year = date.getFullYear();
	  
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
	  
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
		
        return _convertDateFormat(day + '/' + month + '/' + year);
	  
    };

    var _maxNights = function (countNumber, sum, res){
        var fechaInicioFormat = $('[data-cal="start"]').data("format");
        var numberMessage$ = $('.ibe-message-tooltip__content--number');
        var oneway = $('[data-validate-searcher]').find('.ibe_form__group--half-only-round').length;
        var fechaInicio, fechaFin;
        if (fechaInicioFormat == 'DD/MM/YYYY'){
            fechaInicio = _convertDateFormat($('[data-cal="start"]').val());
            fechaFin = _convertDateFormat($('[data-cal="end"]').val());
        }
        if (fechaInicioFormat == 'MM/DD/YYYY') {
            fechaInicio = _getFormattedDate(new Date($('[data-cal="start"]').val()));
            fechaFin = _getFormattedDate(new Date($('[data-cal="end"]').val()));
        }
		
        if(fechaInicio > "" && fechaFin > "" && fechaInicio <= fechaFin && oneway === 0){
            fechaInicio = new Date(fechaInicio).getTime();
            fechaFin    = new Date(fechaFin).getTime();
            var diff = fechaFin - fechaInicio;
            diff = diff/(1000*60*60*24);
            if(diff >= 2 && fechaInicioFormat == 'DD/MM/YYYY'){
                diff--;
            }
            if(diff >= 2 && fechaInicioFormat == 'MM/DD/YYYY'){
                diff--;
            }
            //-console.log(fechaInicio, fechaFin, "count:", countNumber, "diff:", diff);
            if(countNumber >= diff || diff === 1 || diff === 0){
                if (diff === 0){
                    diff++;
                }
                $('[data-night-counter]').html("0"+diff);
                numberMessage$.html(diff);
                countNumber = diff;
                if(diff === 1 || countNumber === 1){
                    res.attr('disabled', 'disabled');
                }else{
                    res.removeAttr('disabled');
                }
                return false;
            }

            // Casos sueltos
            if(countNumber === 1 && diff > 1){
                sum.removeAttr("disabled");
            }
            if(countNumber > 1){
                res.removeAttr("disabled");
            }
		
            if(countNumber === 5){
                numberMessage$.html(countNumber);
            }
			
        }
		
        return true;
    };

    var visualValidation= function (countNumber, value, $this){	
		
        var sum = $this.parent().find('[data-night-button ="plus"]'),
            res = $this.parent().find('[data-night-button ="less"]');
        if(!_maxNights(countNumber, sum, res) || countNumber === value) {
            sum.attr("disabled", "disabled");
        }else if(countNumber === 1){
            res.attr('disabled', 'disabled');
        }else if(sum.attr('disabled') === 'disabled'){
            sum.removeAttr("disabled");
        }else if(res.attr('disabled') === 'disabled'){
            res.removeAttr('disabled');
        }
    };



    // Event CLICK
    var init = function (){
        var $element = $('[data-max-night]'),
            value = $element.data('max-night'),
            $count = $('[data-night-counter]'),
            $button = $('[data-night-button]'),
            $less = $('[data-night-button="less"]'),
            $plus = $('[data-night-button="plus"]'),
            oneway$ = $('[data-click="oneway"]'),
            roundDate = $('#searcher-calendar-1 [data-function]'),
            returnDate = $('#searcher-calendar-end-1 [data-function]');

        //Allow lessOrPlus change when date is actualised
        roundDate.on('change', function (){
            visualValidation(parseInt($count.html()),value,$less);
        });
        returnDate.on('change', function (){
            visualValidation(parseInt($count.html()),value,$less);
        });

        $less.attr('disabled','disabled');

        $button.on('click', function (){
            var $this = $(this),
                $obj = $this,
                countNumber = _lessOrPlus($count, $obj);

            if(countNumber > 9){
                $count.html(countNumber);
            }else{
                $count.html('0'+countNumber);
            }

            visualValidation(countNumber,value,$this);


        });
        // Resetar el contador a uno cada vez qe se pulse en ida y vuelta
        oneway$.on('click', function (){
            $('[data-night-button ="plus"]').removeAttr("disabled");
            $('[data-night-button ="less"]').attr('disabled', 'disabled');
            $('.ibe-message-tooltip__content--number').html(value);
            $('[data-night-counter]').html("01");
        })


    };//
    return{
        "init": init,
        "visualValidation": visualValidation
    };
}(jQuery);

