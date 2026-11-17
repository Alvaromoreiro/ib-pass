//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: resize
//    Descripcion: Funcion para realizar resize solo en puntos de corte
//******************************************************************************/
dFrontJs.ibe_resize = function () {
	//init
	var init = function () {		
		resolutionChange(window.innerWidth);
	}

	var resolutionChange = function (newSize) {
		var actualSize = 0;
		var resolutionCheck = dFrontJs.resolutions;
		//para añadir la resolución 135 por ejemplo usaríamos -> resolutionCheck["zx"] = 135;
		var resLen = Object.keys(resolutionCheck).length;
		var resValues = Object.keys(resolutionCheck).map(function (e) {
			return resolutionCheck[e];
		});
		var i, res;
		for (i = 0; i <= resLen; i++) {
			res = parseInt(resValues[i]);
			if (newSize >= res) {
				switch (actualSize === res) {
					case false:
						actualSize = res;
						return true;
						break;
					case true:
						return false;
						break;
				}
			}
		}
		return false;
	}
	return {
		'init': init,
		'resolutionChange': resolutionChange
	}
}(jQuery);

