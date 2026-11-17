dFrontJs.ibe_wwo = function () {
	//Recojer el dia de la semana
	var getWeekDay = function (d) {
		switch (d) {
			case 0:
				return 'LUN';
				break;
			case 1:
				return 'MAR';
				break;
			case 2:
				return 'MIE';
				break;
			case 3:
				return 'JUE';
				break;
			case 4:
				return 'VIE';
				break;
			case 5:
				return 'SAB';
				break;
			case 6:
				return 'DOM';
				break;
		}
	};//getWeekDay
	//Recojer el mes
	var getMonth = function (m) {
		switch (m) {
			case 0:
				return 'ENE';
				break;
			case 1:
				return 'FEB';
				break;
			case 2:
				return 'MAR';
				break;
			case 3:
				return 'ABR';
				break;
			case 4:
				return 'MAY';
				break;
			case 5:
				return 'JUN';
				break;
			case 6:
				return 'JUL';
				break;
			case 7:
				return 'AGO';
				break;
			case 8:
				return 'SEP';
				break;
			case 9:
				return 'OCT';
				break;
			case 10:
				return 'NOB';
				break;
			case 11:
				return 'DIC';
				break;
		}
	};//getWeekDay
	//init
	var init = function (element) {
		if ($(element).length > 0) {
			$.getJSON('js/WWO.json', function (data) {
				$.each(data, function (key, obj) {
					var weather = $(element);
					//Temporada (lluvia, nublado, parcialmente_nublado, etc)
					var weatherDesc = obj.current_condition[0].weatherDesc[0].value;
					var weatherCode = obj.current_condition[0].weatherCode;
					var wClass = '';

					// Temperatura actual en fahrenheit y celsius
					var current_temp_F = obj.current_condition[0].temp_F;
					var current_temp_C = obj.current_condition[0].temp_C;
					//Max/Min temperatura en fahrenheit
					var tempMaxF = obj.weather[0].tempMaxF;
					var tempMinF = obj.weather[0].tempMinF;
					//Max/Min temperatura en celsius
					var tempMaxC = obj.weather[0].tempMaxC;
					var tempMinC = obj.weather[0].tempMinC;
					//Fecha
					var date = new Date(obj.weather[0].date),
						day = date.getDate(),
						week_day = getWeekDay(date.getDay()),
						month = getMonth(date.getMonth());
					switch (weatherCode) {
						case '113'://Clear/Sunny
							wClass = 'ibe-tempo__list-weather__item-degrees--icon-sun';
							break;
						case '116'://Partly Cloudy
							wClass = 'ibe-tempo__list-weather__item-degrees--icon-mostly-cloudy';
							break;
						case '299'://Moderate rain at times
							wClass = 'ibe-tempo__list-weather__item-degrees--icon-showers';
							break;
					}
					//HTML
					weather.find('[data-wwo="week_day"]').html(week_day);
					weather.find('[data-wwo="day"]').html(day + ' ' + month);
					weather.find('[data-wwo="icon"]').addClass(wClass);
					weather.find('[data-wwo="current_temp"]').html(current_temp_C + 'º');
					weather.find('[data-wwo="weather"]').html(weatherDesc);
					weather.find('[data-wwo="tempMax"]').html(tempMaxC + 'º');
					weather.find('[data-wwo="tempMin"]').html(tempMinC + 'º');
				});
			}).fail(function () {
			});
		}
	};
	return {
		'init': init
	};
}(jQuery);
