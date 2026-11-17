import retrieveGlobalVariables from "../general/ibe_variables";

let cities = "";
const { localeg, marketg } = retrieveGlobalVariables();

if ($("[data-destinationguidealldestinity]").length > 0) {
	// NO copy paste in imputs text
	$("[data-no-paste]").on("paste", (e) => {
		e.preventDefault();
	});
	$("[data-no-copy]").on("copy", (e) => {
		e.preventDefault();
	});

	if (localeg && marketg) {
		$.ajax({
			method: "GET",
			url: "/cs/Satellite",
			data: {
				pagename: "IB_SE/destinationguidejsonguides",
				locale: localeg,
				market: marketg,
			},
			success(data) {
				// guardar los datos en storage
				localStorage.setItem("cities", data);
				sessionStorage.setItem("cities", data);
				// guardar en variable cities los datos del storage
				if (sessionStorage.getItem("cities")) {
					cities = JSON.parse(localStorage.getItem("cities"));
				} else {
					cities = JSON.parse(sessionStorage.getItem("cities"));
				}
				// autocomplete buscador
				if ($('[data-autocomplete="cities"]').length > 0) {
					dFrontJs.ibe_autocomplete.init(
						'[data-autocomplete="cities"]',
						cities
					);
				}
				// desplegable modal
				if ($(".ibe-choose-city").length > 0) {
					// input de autocompletado en el buscador
					if ($('[data-autocomplete="cities"]').length > 0) {
						dFrontJs.ibe_searcher_choose_city.init('[data-autocomplete="cities"]', cities);
					} else {
						// contenedor que tiene el menú de pestañas
						dFrontJs.ibe_searcher_choose_city.init('#id-tab-collapse-1', cities);
					}
				}
				// activar boton de modal
				$("#dialog-destinations").removeAttr("disabled");
			},
		});
	}

	$(".ibe_form__input-button-high").click(() => {
		const regExp = /\(([^)]+)\)/;
		const input = $("#code0566").val();
		if (regExp.exec(input) !== undefined) {
			const iata = regExp.exec(input)[1];

			// recorrer el json
			for (let i = 0; i < cities.length; i++) {
				for (let j = 0; j < cities[i].cities.length; j++) {
					if (cities[i].cities[j].code === iata) {
						const { url } = cities[i].cities[j];
						window.location.href = url;
					}
				}
			}
		}
	});
}
