//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: app
//    Descripcion: Funciones principales y generales
//******************************************************************************/
/*eslint no-underscore-dangle: ['error', { 'allow': ['_ibeShowIsotipo', '_scrollImgAnim', '_showEmitOneCollapse', '_showCollapseLogin', '_scrollGif' , '_clickReset'] }]*/

var dFrontJs = {};
var galleryCarousel;
var focusArrow; var $msgToggle; var windowWidth; var defaultSRC;

(function ($) {
	$.resolutions = {
		xl: "1280",
		lg: "1024",
		md: "768",
		sm: "480",
		xs: "320",
	};
})(dFrontJs);

dFrontJs.app = (function () {
	//Funcion general para aplicar el mismo height a elementos cogiendo de referencia el máximo
	var resizeHeight = function (element) {
		var auxHeight = [],
			maxHeight;
		$(element).css("height", "auto");
		$.each($(element), function () {
			auxHeight.push($(this).outerHeight());
		});
		maxHeight = Math.max.apply(Math, auxHeight);
		$(element).css("height", maxHeight);
	}; //resizeHeight

	//Resize de height del componente card-link
	var calculateHeightComponentsCard = function (elements, child) {
		var auxHeight, maxHeight;
		$(elements).find(child).css("height", "auto");
		$.each($(elements), function () {
			var $parent = $(this).parents(":eq(2)"),
				$cards = $parent.find(elements);
			if ($cards.length > 1) {
				auxHeight = [];
				$.each($cards, function () {
					if ($(this)[0].hasAttribute("data-inte-height")) {
						auxHeight.push($(this).find(child).height());
					} else {
						auxHeight.push($(this).find(child).outerHeight());
					}
				});
				maxHeight = Math.max.apply(Math, auxHeight);
				$.each($cards, function () {
					$(this).find(child).css("height", maxHeight);
				});
			}
		});
		/* Si hay una mezcla entre card-link y card-cont
		(.ibe-card--auto-height) para igualar los dos tipos de tarjetas */
		if (elements === ".ibe-card--auto-height") {
			$(elements).find(".ibe-card-cont__container").css("height", "auto");
			$.each($(elements), function () {
				var auxHeight, maxHeight;
				var $parent = $(this).parents(":eq(2)"),
					$cards = $parent.find(elements);
				if ($cards.length > 1) {
					auxHeight = [];
					$.each($cards, function () {
						auxHeight.push($(this).outerHeight());
					});
					maxHeight = Math.max.apply(Math, auxHeight);
					$.each($cards, function () {
						$(this)
							.find(".ibe-card-cont__container")
							.css("height", maxHeight);
					});
				}
			});
		}
	}; //calculateHeightComponentsCard

	//CONVERT in THIS COMPONENT for ibe-components
	var fcHeight = function () {
		if ($("[data-fc-height]").length > 0) {
			$("[data-fc-height]").each(function () {
				var number = $(this).attr("data-fc-height");
				calculateHeightComponents(
					"[data-fc-height=" + number + "]",
					false
				);
			});
		}
	};
	//Calcular maximo de los height de cada componente y aplicarselo a todos
	var calculateHeightComponents = function (elements, child) {
		var auxHeight, maxHeight;
		/*
		 * Funcion para redimensionar el alto (height) equitativo de un grupo de componentes
		 * @param string => elements  si el alto se le aplica al elemento contenedor
		 * @param string/boolean => child: si el alto se le quiere aplicar a un elemento hijo del componente
		 */
		requestAnimFrame(function () {
			var elem;
			if (typeof child === "boolean") {
				elem = $(elements);
			} else {
				elem = $(elements).find(child);
			}
			//Reseteamos los height a 'auto' esto es importante para el resize de window
			elem.css("height", "auto");
			auxHeight = [];
			//Recorremos todos los elementos que queremos redimensionar
			elem.each(function () {
				var outer,
					$this = $(this);
				outer = $this.innerHeight(); //InnerHeight success critical-home
				auxHeight.push(outer);
				$this.addClass("fc-calculated");
			});
			// Recogemos el valor más alto
			maxHeight = Math.max.apply(Math, auxHeight);
			// Le aplicamos el valor mas alto a los elementos
			elem.css("height", maxHeight);
		});
	}; //calculateHeightComponents
	//Calcular minimo de los height de cada componente y aplicarselo a todos
	var calculateHeightMin = function (elements, child) {
		var auxHeight, minHeight;
		/*
		 * Funcion para redimensionar el alto (height) equitativo de un grupo de componentes
		 * @param string => elements  si el alto se le aplica al elemento contenedor
		 * @param string/boolean => child: si el alto se le quiere aplicar a un elemento hijo del componente
		 */
		var elem;
		if (typeof child === "boolean") {
			elem = $(elements);
		} else {
			elem = $(elements).find(child);
		}
		//Reseteamos los height a 'auto' esto es importante para el resize de window
		elem.css("height", "auto");
		auxHeight = [];
		//Recorremos todos los elementos que queremos redimensionar
		elem.each(function () {
			var outer;
			outer = $(this).outerHeight();
			auxHeight.push(outer);
		});
		// Recogemos el valor más alto
		minHeight = Math.min.apply(Math, auxHeight);
		// Le aplicamos el valor mas alto a los elementos
		elem.css("height", minHeight);
	}; //calculateHeightMin

	//Calcular altura de la cabecera de la vista 'Guia Chicago'
	var calculateHeightHeaderGuides = function (element) {
		var auxHeight, maxHeight, outer, footerCard, infoCard;
		var elem = $(element),
			figure = elem.find('[data-guide="figure"]'),
			plans = elem.find('[data-guide="add-plans"]');
		if (plans.length === 0) {
			plans = $('[data-guide="add-plans"]');
		}
		figure.css("height", "auto");
		plans.find(".ibe-card-link__info").css("height", "auto");
		plans.find(".ibe-card-link__footer").css("height", "auto");
		auxHeight = [];
		outer = figure.outerHeight();
		auxHeight.push(outer);
		outer = plans.outerHeight();
		auxHeight.push(outer);
		maxHeight = Math.max.apply(Math, auxHeight);

		footerCard = plans.find(".ibe-card-link__footer").outerHeight();
		infoCard = plans.find(".ibe-card-link__info");
		figure.css({
			"max-height": maxHeight,
			height: maxHeight,
		});
		infoCard.css("height", maxHeight - footerCard);
	}; //calculateHeightHeaderGuides
	var isIE = function () {
		var myNav = navigator.userAgent.toLowerCase();
		return myNav.indexOf("msie") !== -1
			? parseInt(myNav.split("msie")[1])
			: false;
	};

	var indexCarouselCardAirplane = 0;

	//Calcular ancho del scroll
	var calculateScrollWidth = function () {
		var outer, w1, w2, rest;
		var inner = document.createElement("p");
		inner.style.width = "100%";
		inner.style.height = "200px";

		outer = document.createElement("div");
		outer.style.position = "absolute";
		outer.style.top = "0px";
		outer.style.left = "0px";
		outer.style.visibility = "hidden";
		outer.style.width = "200px";
		outer.style.height = "150px";
		outer.style.overflow = "hidden";
		outer.appendChild(inner);

		document.body.appendChild(outer);
		w1 = inner.offsetWidth;
		outer.style.overflow = "scroll";
		w2 = inner.offsetWidth;

		rest = w1 - w2;

		if (w1 === w2) {
			w2 = outer.clientWidth;
		}

		document.body.removeChild(outer);

		return rest;
	};

	// ISOTIPOS EN INPUT
	var isotipoLoadinInput = function () {
		var _ibeShowIsotipo;
		var dataIsotipo = $("[data-isotipo]");
		if (dataIsotipo.length > 0) {
			_ibeShowIsotipo = function (e) {
				var element =
					e !== undefined ? $(e.target) : $("[data-isotipo]");
				var dataValue = $(element).val();
				var dataIsotipo = $(element)
					.parent()
					.find("[data-logo-isotipo]");
				var len = 2;
				//-urlImage = 'images/logos/isotipos/';
				var urlImage = dataIsotipo
					.parents("[data-airlines]")
					.data("url");
				var airlines = dataIsotipo
					.parents("[data-airlines]")
					.data("airlines");
				var isotipo = airlines.split("|");
				var srcImagen;
				//isotipo = ['AA','BA','CX','AY','IB','JL','LA','MH','QF','QR','RJ','S7','UL','CJ','MN','ZU','KA','YW','I2','XM','NU','4M','JJ','4C','XL','LP','ONZ','GH'];
				dataValue = dataValue.toUpperCase();
				//-console.log(isotipo.indexOf(dataValue));
				if (dataValue.substr(0, 3) === "ONZ") {
					len = 3;
				} else {
					len = 2;
				}

				if (isotipo.indexOf(dataValue.substr(0, len)) > -1) {
					srcImagen =
						urlImage +
						"logo_min_" +
						dataValue.substr(0, len) +
						".svg";
					dataIsotipo.attr("src", srcImagen);
					dataIsotipo.css("display", "block");
				} else {
					dataIsotipo.attr("src", "");
					dataIsotipo.css("display", "none");
				}
				if (dataValue.length > 0) {
					dFrontJs.ibe_validate.numFlight(element);
				}
			};

			_ibeShowIsotipo();

			dataIsotipo.off("onpaste", _ibeShowIsotipo);
			dataIsotipo.on("onpaste", _ibeShowIsotipo);
			dataIsotipo.off("keyup", _ibeShowIsotipo);
			dataIsotipo.on("keyup", _ibeShowIsotipo);
		}
	};

	// Hide/show Inputs in form Invoice request
	var hideShowCompanyPersonal = function () {
		$(".ibe_form__box--center-big").find(".ibe-loading__spinner").hide();

		$('[data-box="company"]').hide();
		$('[data-type="personal"]').on("click", function () {
			if ($(this).is(":checked")) {
				$('[data-box="personal"]').show();
				$('[data-box="company"]').hide();
			}
		});
		$('[data-type="company"]').on("click", function () {
			if ($(this).is(":checked")) {
				$('[data-box="company"]').show();
				$('[data-box="personal"]').hide();
			}
		});
	};

	//Calculate height without border, margin etc and adapt the same element
	var adaptHeight = function (element) {
		var auxHeight, maxHeight;
		auxHeight = [];
		$.each($(element), function () {
			auxHeight.push($(this).outerHeight());
		});
		maxHeight = Math.max.apply(Math, auxHeight);
		$(element).css("min-height", maxHeight);
	}; //calculateHeight
	//Eventos jquery{

	var init = function () {
		var boxdesktop, boxmobile, $element, _showCollapseLogin;
		var toggleTab = $('a[data-toggle="tab"]');
		//Popover compartir
		//No eliminar hasta saber para que sirve
		//Desbloquear menu responsive info chekin (breadcrumbs)
		$('[data-inforcheckin="unlock"]').click(function () {
			var $this = $(this),
				$parent = $this.parents(".ibe-infocheckin__menu"),
				$menu = $parent.find('[data-inforcheckin="menu"]');
			$menu.toggleClass("xui-infocheckin__menu-unlock");
		});
		//COOKIES - Cerrar seccion de cookies
		$('[data-cookies="close"]').click(function () {
			var $this = $(this);
			$this.parents(".ibe-cookies").remove();
		});
		//Filtrar salas VIP (before-fly)
		$('[data-vip-rooms="filter"]').change(function () {
			var $this = $(this),
				vip = $this.val();
			if (vip === "Todos") {
				$("[data-vip-rooms-filter]").show();
			} else {
				$("[data-vip-rooms-filter]").hide();
				$('[data-vip-rooms-filter="' + vip + '"]').show();
			}
		});
		//ONBUSINESS BUTTON TO SHOW LOGIN
		$("#loginButtonOB").on('click', function(e){
			e.preventDefault();
			$("[data-target='#tool_onbusiness']").attr('data-toggle', 'collapse');
			if(!$("#tool_onbusiness").hasClass("in")){
				$("[data-target='#tool_onbusiness']").trigger("click");
			}
			$("[data-target='#tool_onbusiness']").removeAttr('data-toggle');

			var isMobile = window.innerWidth <= 768;
			if(isMobile){
				$('[data-dialog="modal"].fc-dialog-onbusiness').dialog().dialog('open');
			}
		});

		//BUTTON TO SHOW/HIDE CLAIM TYPE CARDS
		$(".btnShowClaims").on("click", function(){
			if($(".ibe-claims-tipo-hidden.hidden").length > 0){
				$(".ibe-claims-tipo-hidden").removeClass("hidden");
				$(".btnShowClaimsLess").removeClass("hidden");
				$(".btnShowClaimsMore").addClass("hidden");
			} else {
				$(".ibe-claims-tipo-hidden").addClass("hidden");
				$(".btnShowClaimsLess").addClass("hidden");
				$(".btnShowClaimsMore").removeClass("hidden");
			}
		});

		//Boton cerrar dentro del tab de bootstrap
		$(document)
			.on("click", '[data-tab="close-bootstrap-tab"]', function () {
				var $this = $(this),
					$parent = $this.parents(".tab-pane"),
					id = $parent.attr("id"),
					a = $('a[href="#' + id + '"]'),
					$parentA = a.parent();
				$parent.removeClass("active");
				$parentA.removeClass("active");
				a.attr("aria-expanded", false);
				//event-preventDefault para los enlaces que tengan almoadillas
			})
			.on("click", 'a[href="#"]', function (e) {
				e.preventDefault();
			});

		// //Load more news
		// var container = $(".ibe-card-container").attr("data-show-more");
		// var actives = $(".ibe-card-container").attr("data-show-more-init"); //cantidad inicial que muestra
		// var number = $(".ibe-card-container").attr("data-show-more-number"); //cantidad de card que se muestra al hacer clik
		// var total = parseInt(actives);

		//Load more news default init
		// var activesTab = $(".ibe-card-container").attr("data-show-more-init"); //cantidad inicial que muestra

		// $("[data-show-more] li:nth-child(-n+" + activesTab + ")").css(
		// 	"display",
		// 	"list-item"
		// );

		// 	$('[data-show-more-button="' + container + '"]').on('click', function () {
		// 		firstShowValue = total;
		// 		total = total + number;
		// $('[data-show-more="' + container + '"] li:nth-child(-n+' + total + '),[data-show-more="' + container + '"]>div:nth-child(-n+' + total + ')').slideDown('slow', function () {
		// 	// Animation complete
		// 	if ($(this).index() === firstShowValue) {
		// 		scroll({
		// 		  top: this.offsetTop,
		// 		  behavior: "smooth"
		// 		});
		// 	}
		// });
		// 	});
		// });

		/* Event Tab */

		if (toggleTab.length > 0) {
			toggleTab.on("shown.bs.tab", function () {
				var thisContent, ida, vuelta;
				if ($('[data-resize="card-distributive-1"]').length > 0) {
					dFrontJs.app.resizeHeight(
						'[data-resize="card-distributive-1"]'
					);
					if ($("[data-dotdotdot]").length > 0) {
						$("[data-dotdotdot]").dotdotdot({
							watch: "window",
						});
					}
				}
				//Variables para cargar el calendario
				thisContent = $(this).attr("href");
				ida = $(this)
					.parents(".ibe-tab")
					.find(thisContent)
					.find('[data-cal="start"]');
				vuelta = $(this)
					.parents(".ibe-tab")
					.find(thisContent)
					.find('[data-cal="end"]');
				if (ida.val() !== "" && vuelta.val() !== "") {
					//Función para que actualice el valor del calendario una vez carge la tabs
					vuelta.trigger("change"); //Actualización del rango del calendario
				}
				if (vuelta.val() === "") {
					//Función para que actualice el valor del calendario una vez carge la tabs
					if ($(".ibe-advanced-searcher").length > 0) {
						if (
							vuelta
								.parents(thisContent)
								.find("[data-calendar-disable]").length > 0 &&
							!vuelta
								.parents(thisContent)
								.find("[data-calendar-disable]")
								.is(":checked")
						) {
							vuelta.trigger("change"); //Actualización del rango del calendario
						}
					} else {
						vuelta.trigger("change"); //Actualización del rango del calendario
					}
				}
			});
		}

		if ($("[data-box]").length > 0) {
			boxdesktop = $('[data-box="card-link"]');
			boxmobile = $('[data-box="card-link-mobile"]');
			if (window.innerWidth < dFrontJs.resolutions.lg) {
				boxdesktop.find(".ibe-card-link").appendTo(boxmobile);
			}
			$(window).on("resize", function () {
				clearTimeout($.data(this, "resizeTimer"));
				$.data(
					this,
					"resizeTimer",
					setTimeout(function () {
						if (window.innerWidth < dFrontJs.resolutions.lg) {
							boxdesktop
								.find(".ibe-card-link")
								.appendTo(boxmobile);
						} else {
							boxmobile
								.find(".ibe-card-link")
								.appendTo(boxdesktop);
						}
					}, 200)
				);
			});
		}

		$element = $(".ib-mosaic");
		$.each($element, function (i) {
			var $this = $(this);
			setTimeout(function () {
				$this.addClass("active");
			}, 800 + i * 150);
		});
		// END MOSAIC
		// CAMBIAR FUENTE AL SALTAR EN DOS LINEAS EN HEADER
		$(".ibe-emergency__info--box")
			.find(".ibe-emergency__info--txt")
			.each(function () {
				var $this = $(this);
				var lineHeight = parseInt($this.css("line-height")) * 2;
				var paddingBottom = parseInt($this.css("padding-bottom"));
				var paddingTop = parseInt($this.css("padding-top"));
				var total = parseInt($this.innerHeight());
				if (total > lineHeight + paddingTop + paddingBottom) {
					$this
						.parents(".ibe-emergency__info--box")
						.addClass("ibe-emergency__info--box-modify");
				} else {
					$this
						.parents(".ibe-emergency__info--box")
						.removeClass("ibe-emergency__info--box-modify");
				}
			});
		// END CAMBIAR FUENTE

		/////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Codigo para que salte el deplegable del login cuando se pulse el subtitulo de la pagina de avios
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////
		_showCollapseLogin = function () {
			$("#tool_login").collapse("show");
		};
		$("[data-openlogin]").off("click", _showCollapseLogin);
		$("[data-openlogin]").on("click", _showCollapseLogin);

		$('button[type="reset"]').off("click", _clickReset);
		$('button[type="reset"]').on("click", _clickReset);
	}; //init

	var _clickReset = function () {
		requestAnimFrame(function () {
			dFrontJs.ibe_inputs.init();
			$("html").animate(
				{
					scrollTop: 0,
				},
				500,
				"swing"
			);
		});
	};
	// GIF ANIMATED PLAY AND STOP
	var gifFunction = function () {
		var iditem = $("[data-gifanimated]").attr("id");
		var idOffsetTop = $("[data-gifanimated]").offset().top;
		var windowTop = $(window).scrollTop();
		var windowHeight = $(window).innerHeight();
		var heightComponent = $(".ibe-box-landing__container--phone").height();
		var _scrollGif = function () {
			windowTop = $(window).scrollTop();
			if (
				windowTop + windowHeight >= idOffsetTop + heightComponent &&
				!$(rub.get_canvas()).hasClass("active")
			) {
				//Play gif
				rub.play();
				$(rub.get_canvas()).addClass("active"); //Add class for only one loop
				//stop scroll event
				$(window).off("scroll", _scrollGif);
			}
		};
		var rub = new SuperGif({
			gif: document.getElementById(iditem),
			progressbar_height: 0,
			max_width: "100%",
			on_end: function (e) {
				//One loop end
				rub.pause(); //Pause gif
				rub.move_to(rub.get_length() - 1); //Load the last frame of the gif
			},
		});
		rub.load(function () {
			$(window).on("scroll", _scrollGif);
			if (
				windowTop + windowHeight >= idOffsetTop + heightComponent / 2 &&
				!$(rub.get_canvas()).hasClass("active")
			) {
				rub.play();
				$(window).off("scroll", _scrollGif);
			}
		});

		//END GIF ANIMATED
	};

	var _scrollImgAnim = function () {
		var item1 = $("[data-img-anim]").find(
			".ibe-box-landing__animation--item01"
		);
		var item2 = $("[data-img-anim]").find(
			".ibe-box-landing__animation--item02"
		);
		var offsetTop = $("[data-img-anim]").offset().top;
		var heightComponent = $(
			"[data-img-anim] .ibe-box-landing__animation--static-mobile"
		).innerHeight();
		var windowTop;
		var windowHeight = $(window).innerHeight();
		windowTop = $(window).scrollTop();
		if (
			windowTop + windowHeight >= offsetTop + heightComponent &&
			!item1.hasClass("active") &&
			!item2.hasClass("active")
		) {
			item1.addClass("active");
			item2.addClass("active");
			item2.on("animationend ", function () {
				item1.addClass("finish-animation");
				item2.addClass("finish-animation");
			});

			$(window).off("scroll", _scrollImgAnim);
		}
	};

	// PLAY IMAGE ANIMATION
	var imgAnim = function () {
		$(window).on("scroll", _scrollImgAnim);
	};
	//END PLAY IMAGE ANIMATION

	var renderImg = function (
		figure,
		srcImg,
		classImg,
		altImg,
		idImg,
		defaultSRC
	) {
		var newImg;
		$(figure).addClass("is-loading"); // 3a

		// 4a
		newImg = new Image();
		$(newImg).attr("src", srcImg);

		if (classImg !== undefined) {
			$(newImg).addClass(classImg);
		}
		if (altImg !== undefined) {
			$(newImg).attr("alt", altImg);
		}
		if (idImg !== undefined) {
			$(newImg).attr("alt", idImg);
		}

		newImg.addEventListener("load", function () {
			figure.innerHTML = ""; // 5a
			figure.appendChild(this);
			figure.style.opacity = 0;

			// 6a
			requestAnimFrame(function () {
				$(figure).removeClass("is-loading");
				$(figure).removeClass("ibe-recommended-cards--errorimage");
				$(figure).addClass("is-loaded");
				$(figure).css({
					opacity: "1",
					transition: "opacity .25s ease-in-out",
					"-moz-transition": "opacity .25s ease-in-out",
					"-webkit-transition": "opacity .25s ease-in-out",
				});
			});
		});
		newImg.addEventListener("error", function () {
			if (defaultSRC !== undefined) {
				$(newImg).attr("src", defaultSRC);
			}
		});
	};

	var renderPicture = function (figure, picture) {
		var source,
			index,
			element,
			sourceSrcImg,
			img,
			srcImg,
			classImg,
			idImg,
			altImg,
			newImg;

		$(figure).addClass("is-loading"); // 3b

		// 4b
		source = $(picture).find("source");

		for (index = 0; index < source.length; index++) {
			element = source[index];
			sourceSrcImg = $(element).attr("data-src");
			$(element).attr("srcset", sourceSrcImg);
			$(element).removeAttr("data-src");
		}

		img = $(picture).find("img");
		srcImg = img.attr("data-src");
		classImg = img.attr("class");
		idImg = img.attr("id");
		altImg = img.attr("alt");

		$(img).attr("src", srcImg);

		if (classImg !== undefined) {
			$(img).addClass(classImg);
		}
		if (altImg !== undefined) {
			$(img).attr("alt", altImg);
		}
		if (idImg !== undefined) {
			$(img).attr("alt", idImg);
		}
		$(img).removeAttr("data-src");

		requestAnimFrame(function () {
			$(figure).removeClass("is-loading");
			$(figure).addClass("is-loaded");
		});
	};

	var renderImgExtra = function (img) {
		var $img = $(img);
		var figure, picture, srcImg, classImg, idImg, altImg;
		if ($img.length > 0) {
			figure = $img.parent()[0];
			picture = $(figure).find("picture"); //1b
			srcImg = $img.attr("data-src");
			classImg = $img.attr("class");
			idImg = $img.attr("id");
			altImg = $img.attr("alt");
			defaultSRC = $img.data("default-img");

			if (
				typeof srcImg !== "undefined" &&
				!$(figure).hasClass("is-loaded") &&
				!$(figure).is(":hidden") &&
				picture.length < 1
			) {
				renderImg(figure, srcImg, classImg, altImg, idImg, defaultSRC);
			}
		}
	};

	var renderAllImgModal = function (modal) {
		var allImgs = $(modal).find("img");
		//if modal content any img
		if (allImgs.length > 0) {
			$(allImgs).each(function () {
				var img = $(this),
					figure = img.parent()[0],
					picture = $(figure).find("picture"), //1b
					srcImg = img.attr("data-src"),
					classImg = img.attr("class"),
					idImg = img.attr("id"),
					altImg = img.attr("alt");
				defaultSRC = img.data("default-img");

				if (
					typeof srcImg !== "undefined" &&
					!$(figure).hasClass("is-loaded") &&
					!$(figure).is(":hidden") &&
					picture.length < 1
				) {
					renderImg(
						figure,
						srcImg,
						classImg,
						altImg,
						idImg,
						defaultSRC
					);
				}
			});
		}
	};

	var inviewFunction = function (limit) {
		var offset = limit !== undefined ? limit : -220;
		inView.offset().top = offset; //Value negative
		inView.offset().right = -400; //Value negative for overflow images horizontal scroll

		requestAnimFrame(function () {
			inView("figure").on("enter", function (figure) {
				var img = $(figure).find("img"), // 1a
					picture = $(figure).find("picture"), //1b
					srcImg = img.attr("data-src"),
					classImg = img.attr("class"),
					idImg = img.attr("id"),
					altImg = img.attr("alt");
				defaultSRC = img.data("default-img");

				if (
					(picture.length > 0 && !picture.is(":hidden")) ||
					(picture.length > 0 &&
						$(picture)
							.parent()
							.hasClass("ibe-search-flights__cover-fig"))
				) {
					renderPicture(figure, picture);
				} else if (
					typeof srcImg !== "undefined" &&
					!$(figure).hasClass("is-loaded") &&
					!$(figure).is(":hidden") &&
					picture.length < 1
				) {
					renderImg(
						figure,
						srcImg,
						classImg,
						altImg,
						idImg,
						defaultSRC
					);
				}
			});
		});
	};

	// function call new images charge
	var emitInView = function () {
		$(inView("figure").check().current).each(function (index, element) {
			if (!$(this).hasClass("is-loaded") && $(this).is(":visible")) {
				inView("figure").emit("enter", element);
			}
		});
	};

	var thisWindowWidth = window.innerWidth;
	var changeView = function () {
		if (
			(window.innerWidth < dFrontJs.resolutions.lg &&
				thisWindowWidth >= dFrontJs.resolutions.lg) ||
			(window.innerWidth >= dFrontJs.resolutions.lg &&
				thisWindowWidth < dFrontJs.resolutions.lg)
		) {
			thisWindowWidth = window.innerWidth;
			return true;
		}
		return false;
	};

	var _showEmitOneCollapse = function () {
		emitInView();
		$('[data-login="logged"]').off(
			"shown.bs.collapse",
			_showEmitOneCollapse
		);
	};

	// No cpy paste in inputs type mail
	$('[data-validator="mail"], [data-validator="mail-repeat"]').bind(
		"cut copy paste",
		function (e) {
			e.preventDefault();
		}
	);

	$('[data-login="logged"]').off("shown.bs.collapse", _showEmitOneCollapse);
	$('[data-login="logged"]').on("shown.bs.collapse", _showEmitOneCollapse);

	/**
	 * Disable/Enable resident and large family options when pay with avios is checked or not
	 * @param {*} selector of check pay with avios #paywithAvios
	 */
	var changeCheckAviosResFam = function (selector) {
		var elem = selector.target !== undefined ? selector.target : document.querySelector(selector);
		if(elem!==null){
			var searcher = elem.closest('.ibe-searcher.ibe-searcher--accordion');
			var isChecked = elem.checked;
		}
		//Home
		if (elem!==null && searcher !== null) {
			var passenger = searcher.querySelector('[data-passenger-resident-radio="data-passenger-resident-radio"]');
			var family = searcher.querySelector('[data-passenger-family-radio="data-passenger-family-radio"]');
			
			if (passenger !== null && family !== null) {
				var arrayPassenger = passenger.querySelectorAll('.ibe_form__radio input');
				var arrayfamily = family.querySelectorAll('.ibe_form__radio input');
				var firstPassenger = arrayPassenger[0];
				var firstFamily = arrayfamily[0];
				var warn = searcher.querySelector('[data-resident-warn]');

				if (isChecked) {
					warn.classList.add('hidden');
					arrayPassenger.forEach(item => item.disabled = true);
					arrayfamily.forEach(item => item.disabled = true);
					firstPassenger.disabled = false;
					firstPassenger.checked = true;
					firstFamily.disabled = false;
					firstFamily.checked = true;
					searcher.querySelector('[data-passenger-resident]').innerHTML = firstPassenger.nextSibling.innerText;
					searcher.querySelector('[data-passenger-family]').innerHTML = firstFamily.nextSibling.innerText;
				} else {
					if ((quadrigam === "IBHMPA" || quadrigam === "IBHMPI") && !$('[data-passenger-resident-radio="data-passenger-resident-radio"]').hasClass("hidden")) {
						warn.classList.remove('hidden');
					}
					arrayPassenger.forEach(item => item.disabled = false);
					arrayfamily.forEach(item => item.disabled = false);
				}
			}
		}
		//Advanced Searcher
		else if (document.querySelector('.ibe-advanced-searcher') !== null) {
			var familySelect = $("#familia_numerosa_2"),
				residentSelec = $("#residencia");
			if (familySelect.length > 0 && residentSelec.length > 0) {
				let isVisibleMenu = ($("#familia_numerosa_2-button").is(":visible") || $("#familia_numerosa_2-menu").is(":visible"));
				if (isChecked && isVisibleMenu) {
					familySelect.val("nolarge");
					familySelect.selectmenu("refresh");
					familySelect.parent().addClass("ibe_form__group--disabled");
					familySelect.selectmenu("disable");
					residentSelec.val("noresident");
					//residentSelec.selectmenu("refresh");
					residentSelec
						.parent()
						.find(".ui-selectmenu-text")
						.text(
							residentSelec
								.find('[data-resident="default"]')
								.text()
						);
					residentSelec
						.parent()
						.addClass("ibe_form__group--disabled");
					residentSelec.selectmenu("disable");
				} else {
					familySelect
						.parent()
						.removeClass("ibe_form__group--disabled");
					familySelect.selectmenu("enable");
					residentSelec
						.parent()
						.removeClass("ibe_form__group--disabled");
					residentSelec.selectmenu("enable");
				}
			}
		}
	};
	$("[data-checkBaby]").off("change", changeCheckAviosResFam);
	$("[data-checkBaby]").on("change", changeCheckAviosResFam);

	//public functions
	return {
		init: init,
		resizeHeight: resizeHeight,
		calculateHeightComponentsCard: calculateHeightComponentsCard,
		calculateHeightComponents: calculateHeightComponents,
		calculateHeightMin: calculateHeightMin,
		calculateHeightHeaderGuides: calculateHeightHeaderGuides,
		indexCarouselCardAirplane: indexCarouselCardAirplane,
		isIE: isIE,
		calculateScrollWidth: calculateScrollWidth,
		gifFunction: gifFunction,
		imgAnim: imgAnim,
		inviewFunction: inviewFunction,
		emitInView: emitInView,
		renderImgExtra: renderImgExtra,
		renderAllImgModal: renderAllImgModal,
		adaptHeight: adaptHeight,
		changeView: changeView,
		hideShowCompanyPersonal: hideShowCompanyPersonal,
		isotipoLoadinInput: isotipoLoadinInput,
		fcHeight: fcHeight,
		changeCheckAviosResFam: changeCheckAviosResFam,
	};
})(jQuery);
