"use strict";

//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: app
//    Descripcion: Funciones principales y generales
//******************************************************************************/

/*eslint no-underscore-dangle: ['error', { 'allow': ['_ibeShowIsotipo', '_scrollImgAnim', '_showEmitOneCollapse', '_showCollapseLogin', '_scrollGif' , '_clickReset'] }]*/
var dFrontJs = {};
var galleryCarousel;
var focusArrow;
var $msgToggle;
var windowWidth;
var defaultSRC;

(function ($) {
  $.resolutions = {
    xl: "1280",
    lg: "1024",
    md: "768",
    sm: "480",
    xs: "320"
  };
})(dFrontJs);

dFrontJs.app = function () {
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
            $(this).find(".ibe-card-cont__container").css("height", maxHeight);
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
        calculateHeightComponents("[data-fc-height=" + number + "]", false);
      });
    }
  }; //Calcular maximo de los height de cada componente y aplicarselo a todos


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
      } //Reseteamos los height a 'auto' esto es importante para el resize de window


      elem.css("height", "auto");
      auxHeight = []; //Recorremos todos los elementos que queremos redimensionar

      elem.each(function () {
        var outer,
            $this = $(this);
        outer = $this.innerHeight(); //InnerHeight success critical-home

        auxHeight.push(outer);
        $this.addClass("fc-calculated");
      }); // Recogemos el valor más alto

      maxHeight = Math.max.apply(Math, auxHeight); // Le aplicamos el valor mas alto a los elementos

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
    } //Reseteamos los height a 'auto' esto es importante para el resize de window


    elem.css("height", "auto");
    auxHeight = []; //Recorremos todos los elementos que queremos redimensionar

    elem.each(function () {
      var outer;
      outer = $(this).outerHeight();
      auxHeight.push(outer);
    }); // Recogemos el valor más alto

    minHeight = Math.min.apply(Math, auxHeight); // Le aplicamos el valor mas alto a los elementos

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
      height: maxHeight
    });
    infoCard.css("height", maxHeight - footerCard);
  }; //calculateHeightHeaderGuides


  var isIE = function () {
    var myNav = navigator.userAgent.toLowerCase();
    return myNav.indexOf("msie") !== -1 ? parseInt(myNav.split("msie")[1]) : false;
  };

  var indexCarouselCardAirplane = 0; //Calcular ancho del scroll

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
  }; // ISOTIPOS EN INPUT


  var isotipoLoadinInput = function () {
    var _ibeShowIsotipo;

    var dataIsotipo = $("[data-isotipo]");

    if (dataIsotipo.length > 0) {
      _ibeShowIsotipo = function (e) {
        var element = e !== undefined ? $(e.target) : $("[data-isotipo]");
        var dataValue = $(element).val();
        var dataIsotipo = $(element).parent().find("[data-logo-isotipo]");
        var len = 2; //-urlImage = 'images/logos/isotipos/';

        var urlImage = dataIsotipo.parents("[data-airlines]").data("url");
        var airlines = dataIsotipo.parents("[data-airlines]").data("airlines");
        var isotipo = airlines.split("|");
        var srcImagen; //isotipo = ['AA','BA','CX','AY','IB','JL','LA','MH','QF','QR','RJ','S7','UL','CJ','MN','ZU','KA','YW','I2','XM','NU','4M','JJ','4C','XL','LP','ONZ','GH'];

        dataValue = dataValue.toUpperCase(); //-console.log(isotipo.indexOf(dataValue));

        if (dataValue.substr(0, 3) === "ONZ") {
          len = 3;
        } else {
          len = 2;
        }

        if (isotipo.indexOf(dataValue.substr(0, len)) > -1) {
          srcImagen = urlImage + "logo_min_" + dataValue.substr(0, len) + ".svg";
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
  }; // Hide/show Inputs in form Invoice request


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
  }; //Calculate height without border, margin etc and adapt the same element


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

    var toggleTab = $('a[data-toggle="tab"]'); //Popover compartir
    //No eliminar hasta saber para que sirve
    //Desbloquear menu responsive info chekin (breadcrumbs)

    $('[data-inforcheckin="unlock"]').click(function () {
      var $this = $(this),
          $parent = $this.parents(".ibe-infocheckin__menu"),
          $menu = $parent.find('[data-inforcheckin="menu"]');
      $menu.toggleClass("xui-infocheckin__menu-unlock");
    }); //COOKIES - Cerrar seccion de cookies

    $('[data-cookies="close"]').click(function () {
      var $this = $(this);
      $this.parents(".ibe-cookies").remove();
    }); //Filtrar salas VIP (before-fly)

    $('[data-vip-rooms="filter"]').change(function () {
      var $this = $(this),
          vip = $this.val();

      if (vip === "Todos") {
        $("[data-vip-rooms-filter]").show();
      } else {
        $("[data-vip-rooms-filter]").hide();
        $('[data-vip-rooms-filter="' + vip + '"]').show();
      }
    }); //ONBUSINESS BUTTON TO SHOW LOGIN

    $("#loginButtonOB").on('click', function (e) {
      e.preventDefault();
      $("[data-target='#tool_onbusiness']").attr('data-toggle', 'collapse');

      if (!$("#tool_onbusiness").hasClass("in")) {
        $("[data-target='#tool_onbusiness']").trigger("click");
      }

      $("[data-target='#tool_onbusiness']").removeAttr('data-toggle');
      var isMobile = window.innerWidth <= 768;

      if (isMobile) {
        $('[data-dialog="modal"].fc-dialog-onbusiness').dialog().dialog('open');
      }
    }); //Boton cerrar dentro del tab de bootstrap

    $(document).on("click", '[data-tab="close-bootstrap-tab"]', function () {
      var $this = $(this),
          $parent = $this.parents(".tab-pane"),
          id = $parent.attr("id"),
          a = $('a[href="#' + id + '"]'),
          $parentA = a.parent();
      $parent.removeClass("active");
      $parentA.removeClass("active");
      a.attr("aria-expanded", false); //event-preventDefault para los enlaces que tengan almoadillas
    }).on("click", 'a[href="#"]', function (e) {
      e.preventDefault();
    }); // //Load more news
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
          dFrontJs.app.resizeHeight('[data-resize="card-distributive-1"]');

          if ($("[data-dotdotdot]").length > 0) {
            $("[data-dotdotdot]").dotdotdot({
              watch: "window"
            });
          }
        } //Variables para cargar el calendario


        thisContent = $(this).attr("href");
        ida = $(this).parents(".ibe-tab").find(thisContent).find('[data-cal="start"]');
        vuelta = $(this).parents(".ibe-tab").find(thisContent).find('[data-cal="end"]');

        if (ida.val() !== "" && vuelta.val() !== "") {
          //Función para que actualice el valor del calendario una vez carge la tabs
          vuelta.trigger("change"); //Actualización del rango del calendario
        }

        if (vuelta.val() === "") {
          //Función para que actualice el valor del calendario una vez carge la tabs
          if ($(".ibe-advanced-searcher").length > 0) {
            if (vuelta.parents(thisContent).find("[data-calendar-disable]").length > 0 && !vuelta.parents(thisContent).find("[data-calendar-disable]").is(":checked")) {
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
        $.data(this, "resizeTimer", setTimeout(function () {
          if (window.innerWidth < dFrontJs.resolutions.lg) {
            boxdesktop.find(".ibe-card-link").appendTo(boxmobile);
          } else {
            boxmobile.find(".ibe-card-link").appendTo(boxdesktop);
          }
        }, 200));
      });
    }

    $element = $(".ib-mosaic");
    $.each($element, function (i) {
      var $this = $(this);
      setTimeout(function () {
        $this.addClass("active");
      }, 800 + i * 150);
    }); // END MOSAIC
    // CAMBIAR FUENTE AL SALTAR EN DOS LINEAS EN HEADER

    $(".ibe-emergency__info--box").find(".ibe-emergency__info--txt").each(function () {
      var $this = $(this);
      var lineHeight = parseInt($this.css("line-height")) * 2;
      var paddingBottom = parseInt($this.css("padding-bottom"));
      var paddingTop = parseInt($this.css("padding-top"));
      var total = parseInt($this.innerHeight());

      if (total > lineHeight + paddingTop + paddingBottom) {
        $this.parents(".ibe-emergency__info--box").addClass("ibe-emergency__info--box-modify");
      } else {
        $this.parents(".ibe-emergency__info--box").removeClass("ibe-emergency__info--box-modify");
      }
    }); // END CAMBIAR FUENTE
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
      $("html").animate({
        scrollTop: 0
      }, 500, "swing");
    });
  }; // GIF ANIMATED PLAY AND STOP


  var gifFunction = function () {
    var iditem = $("[data-gifanimated]").attr("id");
    var idOffsetTop = $("[data-gifanimated]").offset().top;
    var windowTop = $(window).scrollTop();
    var windowHeight = $(window).innerHeight();
    var heightComponent = $(".ibe-box-landing__container--phone").height();

    var _scrollGif = function () {
      windowTop = $(window).scrollTop();

      if (windowTop + windowHeight >= idOffsetTop + heightComponent && !$(rub.get_canvas()).hasClass("active")) {
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
      }
    });
    rub.load(function () {
      $(window).on("scroll", _scrollGif);

      if (windowTop + windowHeight >= idOffsetTop + heightComponent / 2 && !$(rub.get_canvas()).hasClass("active")) {
        rub.play();
        $(window).off("scroll", _scrollGif);
      }
    }); //END GIF ANIMATED
  };

  var _scrollImgAnim = function () {
    var item1 = $("[data-img-anim]").find(".ibe-box-landing__animation--item01");
    var item2 = $("[data-img-anim]").find(".ibe-box-landing__animation--item02");
    var offsetTop = $("[data-img-anim]").offset().top;
    var heightComponent = $("[data-img-anim] .ibe-box-landing__animation--static-mobile").innerHeight();
    var windowTop;
    var windowHeight = $(window).innerHeight();
    windowTop = $(window).scrollTop();

    if (windowTop + windowHeight >= offsetTop + heightComponent && !item1.hasClass("active") && !item2.hasClass("active")) {
      item1.addClass("active");
      item2.addClass("active");
      item2.on("animationend ", function () {
        item1.addClass("finish-animation");
        item2.addClass("finish-animation");
      });
      $(window).off("scroll", _scrollImgAnim);
    }
  }; // PLAY IMAGE ANIMATION


  var imgAnim = function () {
    $(window).on("scroll", _scrollImgAnim);
  }; //END PLAY IMAGE ANIMATION


  var renderImg = function (figure, srcImg, classImg, altImg, idImg, defaultSRC) {
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
      figure.style.opacity = 0; // 6a

      requestAnimFrame(function () {
        $(figure).removeClass("is-loading");
        $(figure).removeClass("ibe-recommended-cards--errorimage");
        $(figure).addClass("is-loaded");
        $(figure).css({
          opacity: "1",
          transition: "opacity .25s ease-in-out",
          "-moz-transition": "opacity .25s ease-in-out",
          "-webkit-transition": "opacity .25s ease-in-out"
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
    var source, index, element, sourceSrcImg, img, srcImg, classImg, idImg, altImg, newImg;
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

      if (typeof srcImg !== "undefined" && !$(figure).hasClass("is-loaded") && !$(figure).is(":hidden") && picture.length < 1) {
        renderImg(figure, srcImg, classImg, altImg, idImg, defaultSRC);
      }
    }
  };

  var renderAllImgModal = function (modal) {
    var allImgs = $(modal).find("img"); //if modal content any img

    if (allImgs.length > 0) {
      $(allImgs).each(function () {
        var img = $(this),
            figure = img.parent()[0],
            picture = $(figure).find("picture"),
            //1b
        srcImg = img.attr("data-src"),
            classImg = img.attr("class"),
            idImg = img.attr("id"),
            altImg = img.attr("alt");
        defaultSRC = img.data("default-img");

        if (typeof srcImg !== "undefined" && !$(figure).hasClass("is-loaded") && !$(figure).is(":hidden") && picture.length < 1) {
          renderImg(figure, srcImg, classImg, altImg, idImg, defaultSRC);
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
        var img = $(figure).find("img"),
            // 1a
        picture = $(figure).find("picture"),
            //1b
        srcImg = img.attr("data-src"),
            classImg = img.attr("class"),
            idImg = img.attr("id"),
            altImg = img.attr("alt");
        defaultSRC = img.data("default-img");

        if (picture.length > 0 && !picture.is(":hidden") || picture.length > 0 && $(picture).parent().hasClass("ibe-search-flights__cover-fig")) {
          renderPicture(figure, picture);
        } else if (typeof srcImg !== "undefined" && !$(figure).hasClass("is-loaded") && !$(figure).is(":hidden") && picture.length < 1) {
          renderImg(figure, srcImg, classImg, altImg, idImg, defaultSRC);
        }
      });
    });
  }; // function call new images charge


  var emitInView = function () {
    $(inView("figure").check().current).each(function (index, element) {
      if (!$(this).hasClass("is-loaded") && $(this).is(":visible")) {
        inView("figure").emit("enter", element);
      }
    });
  };

  var thisWindowWidth = window.innerWidth;

  var changeView = function () {
    if (window.innerWidth < dFrontJs.resolutions.lg && thisWindowWidth >= dFrontJs.resolutions.lg || window.innerWidth >= dFrontJs.resolutions.lg && thisWindowWidth < dFrontJs.resolutions.lg) {
      thisWindowWidth = window.innerWidth;
      return true;
    }

    return false;
  };

  var _showEmitOneCollapse = function () {
    emitInView();
    $('[data-login="logged"]').off("shown.bs.collapse", _showEmitOneCollapse);
  }; // No cpy paste in inputs type mail


  $('[data-validator="mail"], [data-validator="mail-repeat"]').bind("cut copy paste", function (e) {
    e.preventDefault();
  });
  $('[data-login="logged"]').off("shown.bs.collapse", _showEmitOneCollapse);
  $('[data-login="logged"]').on("shown.bs.collapse", _showEmitOneCollapse);
  /**
   * Disable/Enable resident and large family options when pay with avios is checked or not
   * @param {*} selector of check pay with avios #paywithAvios
   */

  var changeCheckAviosResFam = function (selector) {
    var elem = selector.target !== undefined ? selector.target : document.querySelector(selector);
    var searcher = elem.closest('.ibe-searcher.ibe-searcher--accordion');
    var isChecked = elem.checked; //Home

    if (searcher !== null) {
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
    } //Advanced Searcher
    else if (document.querySelector('.ibe-advanced-searcher') !== null) {
      var familySelect = $("#familia_numerosa_2"),
          residentSelec = $("#residencia");

      if (familySelect.length > 0 && residentSelec.length > 0) {
        if (isChecked && ($("#familia_numerosa_2-button").is(":visible") || $("#familia_numerosa_2-menu").is(":visible"))) {
          familySelect.val("nolarge");
          familySelect.selectmenu("refresh");
          familySelect.parent().addClass("ibe_form__group--disabled");
          familySelect.selectmenu("disable");
          residentSelec.val("noresident"); //residentSelec.selectmenu("refresh");

          residentSelec.parent().find(".ui-selectmenu-text").text(residentSelec.find('[data-resident="default"]').text());
          residentSelec.parent().addClass("ibe_form__group--disabled");
          residentSelec.selectmenu("disable");
        } else {
          familySelect.parent().removeClass("ibe_form__group--disabled");
          familySelect.selectmenu("enable");
          residentSelec.parent().removeClass("ibe_form__group--disabled");
          residentSelec.selectmenu("enable");
        }
      }
    }
  };

  $("[data-checkBaby]").off("change", changeCheckAviosResFam);
  $("[data-checkBaby]").on("change", changeCheckAviosResFam); //public functions

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
    changeCheckAviosResFam: changeCheckAviosResFam
  };
}(jQuery);
// // Load more news
// var show = '[data-show-more]';
// var $show = $(show);
// if ($show.length > 0) {
//     var container = $show.data('show-more');
//     var actives = $show.data('show-more-init');
//     var number = $show.data('show-more-number');
//     var total = actives;
//     $('[data-show-more="' + container + '"] li:nth-child(-n+' + total + '), [data-show-more="' + container + '"]>div:nth-child(-n+' + total + ')').slideDown('slow', function () {
//         // Animation complete.
//     });
//     $('[data-show-more-button="' + container + '"]').on('click', function () {
//         var firstShowValue = total;
//         total = total + number;
//         $('[data-show-more="' + container + '"] li:nth-child(-n+' + total + '),[data-show-more="' + container + '"]>div:nth-child(-n+' + total + ')').slideDown('slow', function () {
//             // Animation complete.
//             if ($(this).index() === firstShowValue) {
//                 scroll({
//                     top: this.offsetTop,
//                     behavior: "smooth"
//                 });
//             }
//         });
//     });
// }
// //Load more news
// 	var container = $(".ibe-card-container").attr("data-show-more");
// 	var actives = $(".ibe-card-container").attr("data-show-more-init"); //cantidad inicial que muestra
// 	var number = $(".ibe-card-container").attr("data-show-more-number"); //cantidad de card que se muestra al hacer clik
// 	var total = parseInt(actives);
// 	// Load more news default init
// 	var activesTab = $(".ibe-card-container").attr("data-show-more-init"); //cantidad inicial que muestra
// 	$("[data-show-more] li:nth-child(-n+" + activesTab + ")").css(
// 		"display",
// 		"list-item"
// 	);
// 		$('[data-show-more-button="' + container + '"]').on('click', function () {
// 			firstShowValue = total;
// 			total = total + number;
// 	$('[data-show-more="' + container + '"] li:nth-child(-n+' + total + '),[data-show-more="' + container + '"]>div:nth-child(-n+' + total + ')').slideDown('slow', function () {
// 		// Animation complete
// 		if ($(this).index() === firstShowValue) {
// 			scroll({
// 			  top: this.offsetTop,
// 			  behavior: "smooth"
// 			});
// 		}
// 	});
// 		});
"use strict";
"use strict";

dFrontJs.ibe_accessibility = function () {
  //CHANGE INPUTS LABELS
  var init = function (selector) {
    var node = $(selector);
    var inputBox = node.find('input');
    inputBox.on({
      'focus': function () {
        $(this).prev().addClass('xui-label--up');
      },
      'blur': function () {
        $(this).prev().removeClass('xui-label--up');
      }
    });
  }; //


  var imgTitle = function () {
    var link = $('a[title]').find('img[title]').parents('a');
    var title = '';
    link.on('mouseover', function () {
      title = $(this).find('img').attr('title');
      $(this).find('img').removeAttr('title');
    });
    link.on('mouseout', function () {
      $(this).find('img').attr('title', title);
    });
  };

  return {
    'init': init,
    'imgTitle': imgTitle
  };
}(jQuery);
"use strict";

/**
 * Represents accordion.js
 * @constructor
 * @author ccasalen
 * @description Example of description - This is a example of documentation with JSDoc
 * @param {string} [title="hola"] - The title of the book.
 * @param {string} otherParam - The author of the book.
 * @returns {function} dFrontJs.ibe_accordion.init()
 * @example dFrontJs.ibe_accordion.init()
 */
dFrontJs.ibe_accordion = function () {
  //Jquery ui accordion
  var init = function () {
    var $accord = $('[data-accordion]'),
        $footer = $('.ibe-footer__collapse');

    if ($accord.length > 0) {
      $accord.accordion({
        active: false,
        collapsible: true,
        heightStyle: 'content'
      });
    }

    if ($(window).width() <= 768) {
      $footer.removeClass('off');
      $footer.removeClass('in');
    } else {
      $footer.addClass('off');
    }

    $(window).resize(function () {
      if ($(window).width() >= 768) {
        $footer.addClass('in');
        $footer.addClass('off');
      }

      if ($(window).width() <= 768) {
        $footer.removeClass('in');
        $footer.removeClass('off');
      }
    });
    $('.ibe-footer-title').click(function (e) {
      if ($(window).width() >= 768) {
        e.stopPropagation();
      }
    });
  }; //pluginAccordion


  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_autocomplete = function () {
  /*eslint no-underscore-dangle: ['error', { 'allow': ['_hoverAutocomplete', '_focusAutocomplete', '_focusoutInput', '_loadCityList',
  '_inputClickSelect', '_inputClickSelect', 'cityAirportsConstructor', '_changeValidationCities', '_focusoutValidationCities', '_move', '_renderItem', '_value'] }]*/
  var _hoverAutocomplete = function ($selector) {
    var $item = $selector.find('.ui-menu-item'),
        $focus = $selector.find('.ui-state-focus');
    $item.mouseover(function () {
      $focus.removeClass('ui-state-focus');
    });
  };

  var _focusAutocomplete = function () {
    $(this).off('focusout', _focusoutInput);
    $(this).on('focusout', _focusoutInput);
    setTimeout(function () {
      if ($('[data-city-list="collapse"]').is(':visible')) {
        $('[data-city-list="collapse"]').collapse('hide');
      }
    }, 500);
  };

  var _focusoutInput = function () {
    var inputVal = $(this).val();
    var $tab = $('.ui-tabs-panel:visible');
    var listCity = $(this).parent().find('[data-tab-cities="mobile"]');
    var match = $(listCity).find('a[title="' + inputVal + '"]'); // console.log(match)

    if ($(match).length > 0) {
      $(listCity).find('.city-selected').removeClass('city-selected'); //-$(match).addClass('city-selected');

      $($tab).find(match).addClass('city-selected');
    }
  };

  var _loadCityList = function (inputCity) {
    inputCity.each(function () {
      var inputVal = $(this).val();
      var $tab = $(this).closest('.ui-tabs-panel');
      var listCity = $(this).parent().find('[data-tab-cities="mobile"]');
      var match = $(listCity).find('a[title="' + inputVal + '"]');

      if ($(match).length > 0) {
        $(listCity).find('.city-selected').removeClass('city-selected');
        $tab.each(function (key, value) {
          $(value).find(match).first().addClass('city-selected');
        });
      }
    });
  };

  var _inputClickSelect = function (e) {
    if (navigator.userAgent.match(/(iPhone)|(iPad)|(iPod)/i)) {
      $(this).get(0).setSelectionRange(0, $(this).val().length);
    } else {
      $(this).select();
    }
  }; //Función para ordenar los elementos por el label


  var sortLabel = function (a, b) {
    var accentMap = {
      'á': 'a',
      'à': 'a',
      'â': 'a',
      'é': 'e',
      'è': 'e',
      'ê': 'e',
      'ë': 'e',
      'í': 'i',
      'ï': 'i',
      'î': 'i',
      'ó': 'o',
      'ô': 'o',
      'ö': 'o',
      'û': 'u',
      'ù': 'u',
      'ú': 'u',
      'Á': 'A',
      'À': 'A',
      'Â': 'A',
      'É': 'E',
      'È': 'E',
      'Ê': 'E',
      'Ë': 'E',
      'Í': 'I',
      'Ï': 'I',
      'Î': 'I',
      'Ó': 'O',
      'Ô': 'O',
      'Ö': 'O',
      'Û': 'U',
      'Ù': 'U',
      'Ú': 'U'
    };
    var a = a.label.replace(/[^\w ]/g, function (char) {
      return accentMap[char] || char;
    }).toLowerCase();
    var b = b.label.replace(/[^\w ]/g, function (char) {
      return accentMap[char] || char;
    }).toLowerCase();
    return a < b ? -1 : a > b ? 1 : 0;
  };

  var cityAirportsConstructor = function (json) {
    var data_autocomplete = [];
    $.each(json, function () {
      var $this = this,
          //link
      name = $this.name,
          //city
      fs = $this.cityCode,
          //code
      iata = $this.iataCode,
          //IATA code
      country = $this.countryName; //country

      var aux = {
        'label': name + ' (' + iata + ')',
        'value': name + ' (' + iata + ')',
        'country': country,
        'fs': fs,
        'iata': iata
      };
      data_autocomplete.push(aux);
    }); //Ordenamos los elementos por el label alfabéticamente

    return data_autocomplete = data_autocomplete.sort(sortLabel);
  };

  var cityListContructor = function (json) {
    var data_autocomplete = [];
    var i;

    for (i = 0; i < json.length; i++) {
      $.each(json[i].cities, function () {
        var $this = this,
            //enlace
        text = $this.description,
            //ciudad
        iata = $this.code,
            country = $this.country && $this.country.description ? $this.country.description : ''; //pais

        var aux = {
          'label': text + ' (' + iata + ')',
          'value': text + ' (' + iata + ')',
          'country': country,
          'iata': iata
        };
        data_autocomplete.push(aux);
      });
    } //Ordenamos los elementos por el label alfabéticamente


    return data_autocomplete = data_autocomplete.sort(sortLabel);
  };

  var updateSourceList = function (input, list) {
    var normalize = function (term) {
      var ret = '';
      var accentMap = {
        'á': 'a',
        'à': 'a',
        'â': 'a',
        'é': 'e',
        'è': 'e',
        'ê': 'e',
        'ë': 'e',
        'í': 'i',
        'ï': 'i',
        'î': 'i',
        'ó': 'o',
        'ô': 'o',
        'ö': 'o',
        'û': 'u',
        'ù': 'u',
        'ú': 'u',
        'Á': 'A',
        'À': 'A',
        'Â': 'A',
        'É': 'E',
        'È': 'E',
        'Ê': 'E',
        'Ë': 'E',
        'Í': 'I',
        'Ï': 'I',
        'Î': 'I',
        'Ó': 'O',
        'Ô': 'O',
        'Ö': 'O',
        'Û': 'U',
        'Ù': 'U',
        'Ú': 'U'
      };

      for (var i = 0; i < term.length; i++) {
        ret += accentMap[term.charAt(i)] || term.charAt(i);
      }

      return ret;
    };

    var source = function source(request, response) {
      var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), 'i');
      response($.grep(list, function (value) {
        return matcher.test(value.label) || matcher.test(value.country) || matcher.test(normalize(value.label)) || matcher.test(normalize(value.country));
      }));
    };

    input.autocomplete('option', 'source', source);
  }; //Función para mover elementos dentro de un array
  //Función que cambia la posición del array


  var insertAndShift = function (arr, from, to) {
    var cutOut = arr.splice(from, 1)[0]; // cut the element at index 'from'

    arr.splice(to, 0, cutOut); // insert it at index 'to'
  }; //Jquery ui autocomplete
  //dFrontJs.init(selector,json) --> selector = input ; json = json ciudades correspondiente al input
  //crear una funcion accesible para llevar el json a la creación del HTML de ciudades ( choose-city )
  // en la construccion del HTML que solo se genere las ciudades del tab activo (siempre la primera tab).


  var init = function (selector, json) {
    var $tools_questions = $('[data-autocomplete="tools_questions"]');
    var equalIata = undefined;
    var valorInput;
    var $parent;
    var $tools_search_cities = $('[data-autocomplete="cities"]');
    var airports = $('[data-autocomplete="airports"]');
    var $selector = selector !== undefined ? $(selector) : $tools_search_cities;

    var data_autocomplete, _changeValidationCities, _focusoutValidationCities, _ValidationCities;

    json = json !== undefined ? json : '';

    if ($tools_questions.length > 0) {
      data_autocomplete = $tools_questions.data('autocomplete-result');
      $parent = $tools_questions.parent();
      $tools_questions.autocomplete({
        source: data_autocomplete,
        minLength: 1,
        appendTo: $parent,
        delay: 0
      });
      $('.ui-helper-hidden-accessible').hide();
    }

    if ($selector.length > 0) {
      _ValidationCities = function (selector) {
        const inputs = selector ? selector : $selector;
        var jsonValid = json;

        if (inputs.val() !== "") {
          inputs.closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="exist"]').addClass('hidden');

          if (inputs.data('autocomplete') === 'airports') {
            dFrontJs.ibe_validations_searcher.checkCity(inputs.parents('.ibe_form'), inputs, jsonValid, 'airports');
          } else {
            dFrontJs.ibe_validations_searcher.checkCity(inputs.parents('.ibe_form'), inputs, jsonValid);
          }
        } else {
          inputs.closest('.ibe_form__group').removeClass('ibe_form__group--error').find('p[data-validate]').addClass('hidden');
        }
      }; //Function to validate origin and destiny for JSON file


      _changeValidationCities = function (e) {
        var jsonValid = json;

        if ($(e.target).val() !== "") {
          $(e.target).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="exist"]').addClass('hidden');

          if ($(e.target).data('autocomplete') === 'airports') {
            dFrontJs.ibe_validations_searcher.checkCity($(e.target).parents('.ibe_form'), $(e.target), jsonValid, 'airports');
          } else {
            dFrontJs.ibe_validations_searcher.checkCity($(e.target).parents('.ibe_form'), $(e.target), jsonValid);
          }
        } else {
          $(e.target).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('p[data-validate]').addClass('hidden');
        }
      }; //Valid Inputs to click buttons and other inputs autocomplete (focusout)


      _focusoutValidationCities = function (e) {
        var jsonValid = json;

        if ($(e.target).val() !== "") {
          $(e.target).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="exist"]').addClass('hidden');

          if ($(e.target).data('autocomplete') === 'airports') {
            dFrontJs.ibe_validations_searcher.checkCity($(e.target).parents('.ibe_form'), $(e.target), jsonValid, 'airports');
          } else {
            dFrontJs.ibe_validations_searcher.checkCity($(e.target).parents('.ibe_form'), $(e.target), jsonValid);
          }
        } else {
          $(e.target).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('p[data-validate]').addClass('hidden');
        }
      };

      $selector.each(function () {
        var accentMap = {
          'á': 'a',
          'à': 'a',
          'â': 'a',
          'é': 'e',
          'è': 'e',
          'ê': 'e',
          'ë': 'e',
          'í': 'i',
          'ï': 'i',
          'î': 'i',
          'ó': 'o',
          'ô': 'o',
          'ö': 'o',
          'û': 'u',
          'ù': 'u',
          'ú': 'u',
          'Á': 'A',
          'À': 'A',
          'Â': 'A',
          'É': 'E',
          'È': 'E',
          'Ê': 'E',
          'Ë': 'E',
          'Í': 'I',
          'Ï': 'I',
          'Î': 'I',
          'Ó': 'O',
          'Ô': 'O',
          'Ö': 'O',
          'Û': 'U',
          'Ù': 'U',
          'Ú': 'U'
        };
        var $this = $(this); //input

        var data_autocomplete = [];
        var dataAutocompleteInit = [];
        var normalize, i;
        $parent = $this.parent(); //div form group
        //Función para que se seleccione todo el valor del input

        $this.off('click', _inputClickSelect);
        $this.on('click', _inputClickSelect);

        if ($this.data('autocomplete') === 'airports') {
          data_autocomplete = cityAirportsConstructor(json);
        } else {
          data_autocomplete = cityListContructor(json); //default list results
        } //Guardamos una copia del array que usaremos para formatearlo


        dataAutocompleteInit = data_autocomplete.slice();
        var autocomplete_focusout_value = "";

        var _focusOutHandler = function (selector) {
          if (selector.parent().find('.ui-state-focus:visible').length) {
            $selector.val(selector.parent().find('.ui-state-focus:visible .ui-menu-item-link').attr('title'));
          } else if (selector.parent().find('.ui-menu-item:visible').length) {
            selector.val(selector.parent().find('.ui-menu-item:visible .ui-menu-item-link').attr('title'));
          } else if (autocomplete_focusout_value != "") {
            selector.val(autocomplete_focusout_value);
          } else if (autocomplete_focusout_value == "") {
            selector.val(autocomplete_focusout_value);
          }
        };

        normalize = function (term) {
          var ret = '';

          for (i = 0; i < term.length; i++) {
            ret += accentMap[term.charAt(i)] || term.charAt(i);
          }

          return ret;
        };

        $this.off('focus', _focusAutocomplete);

        $this.autocomplete({
          autoFocus: true,
          delay: 0,
          // source: data_autocomplete,
          source: function (request, response) {
            var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), 'i');
            response($.grep(data_autocomplete, function (value) {
              // value =  value.label || value.value || value.country || value;
              return matcher.test(value.label) || matcher.test(value.country) || matcher.test(normalize(value.label)) || matcher.test(normalize(value.country));
            }));
          },
          minLength: $($this).data('char-activation') ? $($this).data('char-activation') : 3,
          appendTo: $($this).data('target') ? $($this).data('target') : $parent,
          create: function () {
            $(this).data('ui-autocomplete')._renderItem = function (ul, item) {
              if (item.isNotFound !== true) {
                return $('<li>').append('<a class="ui-menu-item-link" href="#" title="' + item.label + '">' + '<p class="ui-menu-item-link__city">' + item.label + '</p><span class="ui-menu-item-link__country">' + (item.dist ? item.dist.toFixed(0) + " km, " : '') + item.country + '</span></a>').appendTo(ul);
              } else {
                return $('<li>').append('<p class="ui-menu-item-notFound">' + item.label + '</p>').appendTo(ul);
              }
            };

            $(this).parent().find('ul.ui-autocomplete').after('<i class="arrow-list"></i>');
          },
          open: function (e, ui) {
            var acData = $(this).data('ui-autocomplete'),
                menu = $(this).data('ui-autocomplete').menu.element,
                $group = $(this).parent(),
                positioned_layer = $($this).data('positioned') !== null ? '.' + $($this).data('positioned') : null;
            var me, keywords;

            if (positioned_layer !== null) {
              $(positioned_layer).hide();
            }

            $(menu).attr('aria-hidden', false);
            acData.menu.element.find('.ui-menu-item').first().addClass('ui-state-focus');
            acData.menu.element.find('.ui-menu-item-link').each(function () {
              var me = $(this),
                  city = me.find('.ui-menu-item-link__city'),
                  country = me.find('.ui-menu-item-link__country'),
                  i = city.text().toLowerCase().indexOf(acData.term.toLowerCase()),
                  c = country.text().toLowerCase().indexOf(acData.term.toLowerCase());

              if (i >= 0) {
                keywords = acData.term.replace(/[\s\(\)]/g, '|');
                city.html(city.text().replace(new RegExp('(' + keywords + ')', 'gi'), '<strong class="bold">$1</strong>'));
              }

              if (c >= 0) {
                keywords = acData.term.replace(/[\s\(\)]/g, '|');
                country.html(country.text().replace(new RegExp('(' + keywords + ')', 'gi'), '<strong class="bold">$1</strong>'));
              }
            }); // Cerrar desplegable de ciudades al aparecer el autocomplete

            if ($('[data-city-list="collapse"]').is(':visible')) {
              $('[data-city-list="collapse"]').collapse('hide');
            }

            _hoverAutocomplete($group);
          },
          close: function (e, ui) {
            var menu = $(this).data('ui-autocomplete').menu.element,
                positioned_layer = $($this).data('positioned') !== null ? '.' + $($this).data('positioned') : null;

            if (positioned_layer !== null) {
              $(positioned_layer).show();
              $this.trigger('change');
            }

            ;
            var searchValue = $(this).val();
            var match = $(this).parent().find('a[title="' + searchValue + '"]');

            if (searchValue.length > 2) {
              if ($(match).length > 0) {
                autocomplete_focusout_value = searchValue;
              } else {
                var firstValue = menu.children(".ui-menu-item:first-child").children("a.ui-menu-item-link").attr("title");
                autocomplete_focusout_value = firstValue ? firstValue : "";
              }

              $(menu).attr('aria-hidden', true);
              data_autocomplete = dataAutocompleteInit.slice();

              _focusOutHandler($(this));

              _ValidationCities($(this));
            }
          },
          search: function (e, ui) {
            valorInput = $(this).val();
          },
          response: function (e, ui) {
            var acData = $(this).data('ui-autocomplete'),
                array = ui.content,
                sum = 0,
                sumI,
                tooltipNoResults = $(this).data('autocomplete-no-results');

            if (ui.content.length > 0) {
              $.each(ui.content, function (i) {
                var $this = $(this),
                    //elemento del array ciudades
                label = $this[0].label.replace(/[^\w ]/g, function (char) {
                  return accentMap[char] || char;
                }).toLowerCase(),
                    valorL = valorInput.length;
                var country = $this[0].country.replace(/[^\w ]/g, function (char) {
                  return accentMap[char] || char;
                }).toLowerCase();
                var iata, areEqual, letter, areLetter;

                if (label !== undefined) {
                  iata = $this[0].iata;
                  areEqual = valorInput.toLowerCase() === iata.toLocaleLowerCase();
                  letter = label.substring(0, valorL);
                  areLetter = valorInput.toLowerCase() === letter.toLocaleLowerCase();
                } //Not IATA


                if (areLetter && !areEqual) {
                  //Encuentro los elementos que me coinciden y los meto en un array aux
                  insertAndShift(array, i, sum);
                  sum++;
                }
              });
              equalIata = undefined;
              sumI = 0;
              $.each(ui.content, function (i) {
                //Coloco el iata en primera posición del array
                var $this = $(this),
                    //elemento del array ciudades
                label = $this[0].label,
                    country = $this[0].country,
                    iata,
                    areEqual;

                if (label !== undefined) {
                  iata = $this[0].iata;
                  areEqual = valorInput.toLowerCase() === iata.toLocaleLowerCase();
                }

                if (areEqual || equalIata !== undefined) {
                  insertAndShift(ui.content, i, sumI);
                  sumI++;
                }
              });
            } else if (typeof (tooltipNoResults === 'string') && tooltipNoResults.length > 0) {
              tooltipNoResults = tooltipNoResults.replace('{{inputValue}}', $(this).val());
              var noResult = {
                value: valorInput,
                label: tooltipNoResults,
                isNotFound: true
              };
              ui.content.push(noResult);
            }
          } // Cerrar desplegable de ciudades al coger el foco del input

        }).on('focus', _focusAutocomplete).autocomplete('instance')._move = function (direction, event) {
          if (!this.menu.element.is(':visible')) {
            this.search(null, event);
            return;
          }

          if (this.menu.isFirstItem() && /^previous/.test(direction) || this.menu.isLastItem() && /^next/.test(direction)) {
            if (!this.isMultiLine) {
              this._value(this.term);
            }

            this.menu[direction](event); // this.menu.blur();

            return;
          }

          this.menu[direction](event);
        }; // CALL VALIDATION CITIES WITH JSON

        /*if ($this.attr('name').indexOf('_origin') > -1 || $this.attr('name').indexOf('_destiny') > -1) {
        	//Function to Valitate origin and destiny with JSON param
        	$this.off('change', _changeValidationCities);
        	$this.on('change', _changeValidationCities);
        			$this.off('focusout', _focusoutValidationCities);
        	$this.on('focusout', _focusoutValidationCities);
        }*/


        _ValidationCities();
      });
    }

    $('.ui-helper-hidden-accessible').hide();
  }; //pluginAutocomplete


  return {
    'init': init,
    'loadCityList': _loadCityList,
    'cityListContructor': cityListContructor,
    'updateSourceList': updateSourceList
  };
}(jQuery);
"use strict";

//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: bootstrap.collapse
//    Descripcion: Funciones para el collapse de bootstrap
//******************************************************************************/
dFrontJs.ibe_bootstrap_collapse = function () {
  //Collapse Accessible
  var toggleCollapseAccesible = function (obj, type) {
    var $this = $(obj),
        $accessible = $this.parent().find('[data-toggle-status]');
    var textCollapsed, textExpanded;

    if ($accessible.length > 0) {
      textCollapsed = $accessible.data('status-open');
      textExpanded = $accessible.data('status-close');

      switch (type) {
        case 'show':
          $($accessible.context).find('.collapse.in').collapse('hide');

          if ($(obj).hasClass('ibe-searcher__calendar')) {
            $(obj).closest('.ibe_form__group--half').find('.collapse.in').collapse('hide');
          }

          $accessible.text(textCollapsed);
          break;

        case 'hide':
          $accessible.text(textExpanded);
          break;
      }
    }
  }; //Collapse igualar tamaño del componente boxy (menu-board)


  var toggleBoxy = function (obj, type) {
    var $this = $(obj),
        $boxy = $this.find('[data-boxy]');

    if ($boxy.length > 0) {
      switch (type) {
        case 'shown':
          dFrontJs.app.calculateHeightComponents($boxy, false);
          dFrontJs.app.calculateHeightComponents($boxy, false);
          dFrontJs.app.emitInView();
          break;
      }
    }
  }; //Collapse igualar tamaño del component step (partners-detail)


  var toggleSteps = function (obj, type) {
    var $this = $(obj);

    switch (type) {
      case 'shown':
        dFrontJs.app.calculateHeightComponents('.ibe-card-steps', '.ibe-card-steps__box');
        break;
    }
  }; //Mostrar lista de ciudades version movil


  var loadCityList = function (obj) {
    var $this = $(obj);

    if ($this.find('[data-function="city-list"]').length > 0) {
      if (!$this.find('[data-function="city-list"]:visible').hasClass('ioslist')) {
        $this.find('[data-function="city-list"]:visible *').css('font-size', '0');
      }
    }
  };

  var loadIOSList = function (obj) {
    var $this = $(obj);

    if ($this.find('[data-function="city-list"]').length > 0) {
      if (!$this.find('[data-function="city-list"]:visible').hasClass('ioslist')) {
        $this.find('[data-function="city-list"]:visible *').css('font-size', '');
        $this.find('[data-function="city-list"]:visible').ioslist();
      }
    }
  };

  var init = function () {
    var $collapse = $('[data-toggle="collapse"]');
    var $headernew = $('.ibe-header-new');
    var $containerCollapse = $('[data-toggle="container"]');
    var $accordion = $('.ibe-accordion').find('[data-toggle="accordion"]'); //Quitamos el margin-botton de todos los contenidos collapse para que no salga el error del salto
    //Añadir clase 'collapsed' a todos los botones

    $collapse.each(function () {
      var $this = $(this);
      $this.addClass('collapsed');
    });
    $collapse.off('keyup', collapseKeyUp);
    $collapse.on('keyup', collapseKeyUp);
    $collapse.off('focus', collapseCloseClick);
    $collapse.on('focus', collapseCloseClick);
    $headernew.find('[data-toggle="collapse"]').off('click', collapseClick);
    $headernew.find('[data-toggle="collapse"]').on('click', collapseClick); //Click on document para ocultar componentes como el 'toggle'

    $('.ibe_form__selectize').off('change', changeSelectize);
    $('.ibe_form__selectize').on('change', changeSelectize);
    $('[data-toggle="close-collapse"]').off('click', closeCollapseClick);
    $('[data-toggle="close-collapse"]').on('click', closeCollapseClick); //Eventos collapse

    $containerCollapse.off('shown.bs.collapse hidden.bs.collapse', eventsCollapse);
    $containerCollapse.on('shown.bs.collapse hidden.bs.collapse', eventsCollapse);
    $('[data-city-list="collapse"]').off('show.bs.collapse', showCityCollapse);
    $('[data-city-list="collapse"]').on('show.bs.collapse', showCityCollapse);
    $('[data-city-list="collapse"]').off('shown.bs.collapse', initIoslist);
    $('[data-city-list="collapse"]').on('shown.bs.collapse', initIoslist);
    $('[data-header-searcher="collapsed"] + [data-toggle="container"]').off('show.bs.collapse', showSearcherContainer);
    $('[data-header-searcher="collapsed"] + [data-toggle="container"]').on('show.bs.collapse', showSearcherContainer);
    $('[data-toggle="button-collapse"]').off('click', openCloseAllAccordion);
    $('[data-toggle="button-collapse"]').on('click', openCloseAllAccordion);
    $accordion.off('click', clickAccordion);
    $accordion.on('click', clickAccordion);
    $('[data-toggle="container"].ibe-accordion__collapse').off('hidden.bs.collapse', hiddenEventCollapse);
    $('[data-toggle="container"].ibe-accordion__collapse').on('hidden.bs.collapse', hiddenEventCollapse);
    $('[data-toggle="container"].ibe-accordion__collapse').off('show.bs.collapse', showCollapse);
    $('[data-toggle="container"].ibe-accordion__collapse').on('show.bs.collapse', showCollapse);
    $(document).off('click', documentEventClick);
    $(document).on('click', documentEventClick);
  };

  var hideCollapse = function (element) {
    $(element).collapse('hide');
  };

  var modalAccordion = function (modal) {
    var $modal = $(modal); //Boton cerra dentro de un toggle collapse
    //Boton cerra dentro de un toggle collapse

    function closeCollapseModal() {
      var $this = $(this),
          $collapse = $this.parents('[data-toggle="container"]');
      $collapse.collapse('hide');
    }

    $modal.find('[data-toggle="close-collapse"]').off('click', closeCollapseModal);
    $modal.find('[data-toggle="close-collapse"]').on('click', closeCollapseModal); //Eventos collapse

    function eventsCollapseModal(e) {
      if ($(this).parent().find('[data-toggle-status]').length) {
        toggleCollapseAccesible(this, e.type);
      }

      if ($(this).data('boxy') === 'collapse') {
        toggleBoxy(this, e.type);
      }

      dFrontJs.app.emitInView(); //Lazy load img refresh
    }

    $modal.find('[data-toggle="container"]').off('shown.bs.collapse hidden.bs.collapse', eventsCollapseModal);
    $modal.find('[data-toggle="container"]').on('shown.bs.collapse hidden.bs.collapse', eventsCollapseModal); //Boton cerrar varios acordeones (Ampliar todo/Cerrar todo)

    function OpenCloseCollapseModal() {
      var $this = $(this),
          textCollapsed = $this.data('text-collapsed'),
          textExpanded = $this.data('text-expanded'),
          $parent = $this.parents('.ibe-accordion'),
          $buttonCollapse = $parent.find('[data-toggle="accordion"]'),
          $collapse = $parent.find('[data-toggle="container"]');

      if ($this.hasClass('collapsed')) {
        $this.removeClass('collapsed');
        $this.text(textExpanded);

        for (i = 0; i < $collapse.length; i++) {
          $collapse.eq(i).collapse('show');
        }

        $buttonCollapse.addClass('collapsed');
      } else {
        $this.addClass('collapsed');
        $this.text(textCollapsed);

        for (i = 0; i < $collapse.length; i++) {
          $collapse.eq(i).collapse('hide');
        }

        $buttonCollapse.removeClass('collapsed');
      }
    }

    $modal.find('[data-toggle="button-collapse"]').off('click', OpenCloseCollapseModal);
    $modal.find('[data-toggle="button-collapse"]').on('click', OpenCloseCollapseModal); //Click en un acordeon

    function clickAccordionModal(e) {
      var $this = $(this);
      var $parent = $this.closest('.ibe-accordion'),
          $ibSearcher = $this.closest('.ibe-searcher'),
          $button = $parent.find('[data-toggle="button-collapse"]'),
          textCollapsed = $button.data('text-collapsed'),
          textExpanded = $this.data('text-expanded'),
          collapseOpens = $parent.find('.collapse.in').length; //previene el click en los accordion abiertos del buscador

      if ($this.is('[data-header-searcher][data-toggle="accordion"]')) {
        $this.parent().find('.ibe_form .collapse.in').collapse('hide');

        if (!$this.hasClass('collapsed')) {
          $this.closest('[data-tab-searcher="data-tab-searcher"]').find('.collapsed').removeClass('collapsed');
          setTimeout(function () {
            $this.addClass('collapsed');
          }, 100);
        } else {
          return false;
        }
      } // Toggle collapse


      if ($this.parent().find('[data-toggle="container"].in').length > 0) {
        $this.siblings('[data-toggle="container"]').collapse('hide');
        $this.removeClass('collapsed');
      } else {
        $this.siblings('[data-toggle="container"]').collapse('show');
        $this.addClass('collapsed');
      } // Cerramos los demás acordeones


      $('.ibe-accordion').not($parent).each(function () {
        var $allAccordion = $(this),
            $thisButtonCollapse = $allAccordion.find('[data-toggle="button-collapse"]');
        $allAccordion.find('.collapse.in').collapse('hide');
        $allAccordion.find('[data-toggle="accordion"].collapsed').removeClass('collapsed'); //Si otro acordeon tiene activo el ampliar todo, lo cerramos

        if (!$thisButtonCollapse.hasClass('collapsed')) {
          $thisButtonCollapse.addClass('collapsed');
          $thisButtonCollapse.text(textCollapsed);
        }
      }); //Acordeon actual

      $parent.find('[data-toggle="accordion"]').each(function () {
        var $thisAccordion = $(this); //Si hay un acordeon abierto solo

        if (collapseOpens <= 1) {
          if ($thisAccordion[0] !== $this[0]) {
            $thisAccordion.parent().find('[data-toggle="container"]').collapse('hide');
            $thisAccordion.removeClass('collapsed');
          } //Si hay mas de un acordeon abierto

        } else {
          if ($thisAccordion[0] === $this[0]) {
            if ($this.siblings('[data-toggle="container"]').hasClass('in')) {
              $this.siblings('[data-toggle="container"]').collapse('show');
              $this.addClass('collapsed');
            } else {
              $this.siblings('[data-toggle="container"]').collapse('hide');
              $this.removeClass('collapsed');
            }
          }
        }
      }); //Si el boton esta en (ampliar todo)

      if ($button.hasClass('collapsed')) {
        //Chequeamos si hay algun acordeon abierto para cambiar el estado del boton a collapsed
        if ($parent.find('.collapse.in').length > 1) {
          $button.removeClass('collapsed');
          $button.text(textExpanded);
        } else {
          $button.addClass('collapsed');
          $button.text(textCollapsed);
        }
      } else {
        if ($parent.find('.collapse.in').length === 1) {
          $button.addClass('collapsed');
          $button.text(textCollapsed);
        }
      } //preventDefault a los enlaces dentro del calendario (buscador de vuelos)

    }

    $modal.find('.ibe-accordion [data-toggle="accordion"]').off('click', clickAccordionModal);
    $modal.find('.ibe-accordion [data-toggle="accordion"]').on('click', clickAccordionModal);

    function hiddenAccordionModal(e) {
      e.stopPropagation();
    }

    $modal.find('[data-toggle="container"].ibe-accordion__collapse').off('hidden.bs.collapse', hiddenAccordionModal);
    $modal.find('[data-toggle="container"].ibe-accordion__collapse').on('hidden.bs.collapse', hiddenAccordionModal);
  }; //Control del foco del collapse en calendar


  focusArrow = false; //init

  var collapseKeyUp = function (e) {
    if (e.key === 'Enter') {
      $(this).closest('.ibe_form__group').children('[data-toggle="container"]').first().collapse('toggle');
    }
  }; //Cerrar todos los collapse dentro del nuevo header


  var collapseClick = function (e) {
    var target = $(e.currentTarget).data('target');
    var $headernew = $('.ibe-header-new');
    $headernew.find('[data-toggle="container"]:visible').each(function () {
      var $this = $(this);

      if ($this.attr('id') !== target) {
        $this.collapse('hide');
      }
    });
  }; //Click on document para ocultar componentes como el 'toggle'


  var changeSelectize = function () {
    focusArrow = true;
    setTimeout(function () {
      focusArrow = false;
    }, 350);
  }; //Boton cerrar dentro de un toggle collapse


  var closeCollapseClick = function () {
    var $this = $(this),
        $collapse = $this.parents('[data-toggle="container"]');
  }; //Eventos collapse


  var eventsCollapse = function (e) {
    if ($(this).parent().find('[data-toggle-status]').length > 0) {
      toggleCollapseAccesible(this, e.type);
    }

    if ($(this).data('boxy') === 'collapse') {
      toggleBoxy(this, e.type);
    }

    if ($(this).data('steps') === 'collapse') {
      toggleSteps(this, e.type);
    }
  }; //Select City Responsive - Click Collapse Button


  var showCityCollapse = function (e) {
    e.stopPropagation();
    loadCityList(this, e.type);
  };

  var initIoslist = function (e) {
    e.stopPropagation();
    loadIOSList(this, e.type);
  };

  var showSearcherContainer = function (e) {
    var inputs = $(e.target).find('[data-fligths-collapse-mobile="button"]');
    var $collapse = $('.ibe-searcher').find('[data-fligths-collapse-mobile="collapse"]');

    if (inputs.eq(0).val() !== "" && inputs.eq(1).val() !== "") {
      $collapse.slideDown('slow', function () {});
    } else {
      $collapse.slideUp('slow', function () {});
    }
  }; //Boton cerrar varios acordeones (Ampliar todo/Cerrar todo)


  var openCloseAllAccordion = function () {
    var $this = $(this),
        textCollapsed = $this.data('text-collapsed'),
        textExpanded = $this.data('text-expanded'),
        $parent = $this.parents('.ibe-accordion'),
        $buttonCollapse = $parent.find('[data-toggle="accordion"]'),
        $collapse = $parent.find('[data-toggle="container"]');

    if ($this.hasClass('collapsed')) {
      $this.removeClass('collapsed');
      $this.text(textExpanded);

      for (let i = 0; i < $collapse.length; i++) {
        $collapse.eq(i).collapse('show');
      }

      $buttonCollapse.addClass('collapsed');
    } else {
      $this.addClass('collapsed');
      $this.text(textCollapsed);

      for (let i = 0; i < $collapse.length; i++) {
        $collapse.eq(i).collapse('hide');
      }

      $buttonCollapse.removeClass('collapsed');
    }
  }; //Click en un acordeon


  var clickAccordion = function () {
    var $this = $(this),
        $parent = $this.closest('.ibe-accordion'),
        $ibSearcher = $this.closest('.ibe-searcher'),
        $button = $parent.find('[data-toggle="button-collapse"]'),
        textCollapsed = $button.data('text-collapsed'),
        textExpanded = $this.data('text-expanded'),
        collapseOpens = $parent.find('.collapse.in').length,
        $thisAccordion; //previene el click en los accordion abiertos del buscador

    if ($this.closest('.ibe-footer').length > 0 && !mobile) {
      return false;
    }

    if ($this.is('[data-header-searcher][data-toggle="accordion"]')) {
      $this.parent().find('.ibe_form .collapse.in').collapse('hide');

      if (!$this.hasClass('collapsed')) {
        $this.closest('[data-tab-searcher="data-tab-searcher"]').find('.collapsed').removeClass('collapsed');
        requestAnimFrame(function () {
          $this.addClass('collapsed');
        });
      } else {
        return false;
      }
    } //Toggle collapse


    if ($this.parent().find('[data-toggle="container"].in').length > 0) {
      $this.siblings('[data-toggle="container"]').collapse('hide');
      $this.removeClass('collapsed');
    } else {
      $this.siblings('[data-toggle="container"]').collapse('show');
      $this.addClass('collapsed');
    }

    if ($this.closest('.ibe-searcher').length === 0) {
      setTimeout(function () {
        $('html, body').animate({
          scrollTop: $this.offset().top
        }, 500);
      }, 500);
    } // Cerramos los demás acordeones


    if ($ibSearcher.length > 0) {
      $('.ibe-accordion').not($parent).each(function () {
        var $allAccordion = $(this),
            $thisButtonCollapse = $allAccordion.find('[data-toggle="button-collapse"]');
        $allAccordion.find('.collapse.in').collapse('hide');
        $allAccordion.find('[data-toggle="accordion"].collapsed').removeClass('collapsed');
      });
    } //Acordeon actual


    $thisAccordion = $parent.find('[data-toggle="accordion"]'); //Si hay un acordeon abierto solo

    if (collapseOpens <= 1) {
      if ($thisAccordion[0] !== $this[0]) {
        $thisAccordion.parent().find('[data-toggle="container"]').collapse('hide');
        $thisAccordion.not($this[0]).removeClass('collapsed');
      } else {
        $thisAccordion.parent().find('[data-toggle="container"]').collapse('hide');
        $thisAccordion.not($this[0]).removeClass('collapsed');
      }
    } //Si el boton esta en (ampliar todo)


    if ($button.hasClass('collapsed')) {
      //Chequeamos si hay algun acordeon abierto para cambiar el estado del boton a collapsed
      if ($parent.find('.collapse.in').length > 1) {
        $button.removeClass('collapsed');
        $button.text(textExpanded);
      } else {
        $button.addClass('collapsed');
        $button.text(textCollapsed);
      }
    } else {
      if ($parent.find('.collapse.in').length === 1) {
        $button.addClass('collapsed');
        $button.text(textCollapsed);
      }
    }
  };

  var hiddenEventCollapse = function (e) {
    e.stopPropagation();

    if ($(e.target).hasClass('ibe-accordion__collapse')) {
      if ($(this).find('[data-city-list="collapse"]').length > 0) {
        $(this).find('[data-city-list="collapse"]').collapse('hide');
      }
    }
  }; //Evento que actualiza el calendario al desplegar el accordion


  var showCollapse = function (e) {
    var ida, vuelta; // Si el elemento contiene la siguiente clase entra (esta entrando tambien en los hijos collapse dentro de collapse aunque no tengan esa clase)

    if ($(e.target).hasClass('ibe-accordion__collapse')) {
      //Variables para cargar el calendario
      ida = $(this).parents('.ibe-accordion').find('[data-cal="start"]'); //input de ida

      vuelta = $(this).parents('.ibe-accordion').find('[data-cal="end"]'); //input de vuelta

      if (ida.val() !== "" && vuelta.val() !== "") {
        vuelta.trigger('change'); //Actualización del rango del calendario
      }
    }
  };

  var documentEventClick = function (event) {
    var $headernew = $('.ibe-header-new');
    var clickover = $(event.target);
    var accordion = clickover.closest('.ibe-accordion');
    var collapse, isBtn, isChildBtn;

    if (accordion.length === 0) {
      collapse = clickover.closest('.collapse.in');
      isBtn = clickover.is('[data-toggle="collapse"]');
      isChildBtn = clickover.closest('[data-toggle="collapse"]');

      if (!collapse.length && !isBtn && !isChildBtn.length) {
        $('.ibe-tools').find('.collapse.in').not(collapse).each(function () {
          var $this = $(this),
              accordion = $this.closest('.ibe-accordion');

          if (accordion.length === 0) {
            $this.collapse('hide');
          }
        });
        $headernew.find('.collapse.in').not(collapse).each(function () {
          var $this = $(this),
              accordion = $this.closest('.ibe-accordion');

          if (accordion.length === 0) {
            $this.collapse('hide');
          }
        }); // Control de Funcionalidades del accordion del buscador de la Home - Click fuera del accordion

        if (clickover.length === 1 && clickover[0].localName !== 'body') {
          dFrontJs.ibe_searcher_accordion_mobile.showFirst();
        }
      }
    } else {
      clickover.closest('[data-toggle="container"]').find('.ibe_form .collapse.in').collapse('hide');
      $headernew.find('.collapse.in').not(collapse).each(function () {
        var $this = $(this),
            accordion = $this.closest('.ibe-accordion');

        if (accordion.length === 0) {
          $this.collapse('hide');
        }
      });
    }

    $('[data-cal-button]').removeClass('hidden');
    $('.focus-ios').removeClass('focus-ios');
  };

  var collapseCloseClick = function (e) {
    var $element = $(this);
    var $target = $(e.currentTarget).data('target').split('#')[1];

    if (!$element.parents('.ibe-searcher').length) {
      $('[data-toggle="container"]:visible').each(function () {
        var $this = $(this);

        if ($this.attr('id') !== $target && !$this.hasClass('off')) {
          $this.collapse('hide');
        }
      });
    }
  };

  return {
    'init': init,
    'hideCollapse': hideCollapse,
    'modalAccordion': modalAccordion
  };
}(jQuery);
"use strict";

dFrontJs.ibe_box_ellipsis = function () {
  //Paragraphshort with dotdotdot plugin
  var dot = function (element, height) {
    var $element = element !== undefined ? $(element) : $('[data-dotdotdot-new]');
    var $height = height !== undefined ? height : null;
    requestAnimFrame(function () {
      $element.dotdotdot({
        ellipsis: '...',
        watch: 'true',
        height: $height,
        //null default
        truncate: 'letter',
        tolerance: 0
      });
    });
  };

  var init = function () {
    // console.log('se lanza dotdotdot')
    var $element = $('[data-dotdotdot]');

    if (digital_data.Language == "zh" || digital_data.Language == "ja") {
      $element = $element.not(".ibe-carousel--warnings__text");
    }

    requestAnimFrame(function () {
      $element.dotdotdot({
        ellipsis: '...',
        watch: 'true',
        height: '20px',
        truncate: 'letter',
        tolerance: 0 //callback: function( isTruncated) {
        //reload calculate height when is truncated
        //if ($(".ibe-card-box__content--auto-height").length > 0) {
        //dFrontJs.ibe_card_box.calculateHeightBox(".ibe-card-box__content--auto-height", ".ibe-card-box__content");
        //}
        //}

      });
    });
  }; //pluginDotdotdot


  return {
    'init': init,
    'dot': dot
  };
}(jQuery);
"use strict";

//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: ibe-box-icon
//    Descripcion: Javascript para indicar el comportamiento de las tarjetas con
//    con icono y desplegable
//******************************************************************************/
dFrontJs.ibe_box_icon = function () {
  var init = function () {
    // Version con data attribute
    var $box = $('[flight-status-box]'),
        $article = $box.find('.ibe-infocheckin__box--icon'),
        $title = $article.find('.ibe-infocheckin__box-title'); // Pon de titulo principal el titulo del primero

    $article.each(function () {
      $(this).find($title).remove();
    });
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_card_box = function () {
  //ibe-card-box
  var calculateHeightText = function () {
    var selector = $('.ibe-card-box'),
        textHeight,
        heightTitle,
        lineHeightTitle,
        rest,
        initialHeightText,
        finalHeight,
        cont,
        rest;
    setTimeout(function () {
      $.each($(selector.parents('.ibe-card-box--vertical')), function () {
        var $this = $(this);
        heightTitle = $this.find($('.ibe-card-box__title')).innerHeight();
        lineHeightTitle = $this.find('.ibe-card-box__title').css('line-height').split('px')[0];
        initialHeightText = $this.find('.ibe-card-box__text').innerHeight();
        finalHeight = parseInt(initialHeightText) + parseInt(lineHeightTitle);

        if ($this.find('.ibe-card-box__title').length > 0 && heightTitle > lineHeightTitle) {
          rest = heightTitle - lineHeightTitle;
          textHeight = $this.find('.ibe-card-box__content').innerHeight();
          $this.find('.ibe-card-box__content').height(textHeight - rest);
        }
      });
    }, 1000);
  };

  var init = function () {};

  var calculateHeightBox = function (elements, child) {
    requestAnimFrame(function () {
      $(elements).find(child).css('height', 'auto');

      if (window.innerWidth >= dFrontJs.resolutions.md) {
        $.each($(elements), function () {
          var $parent = $(this).parents(':eq(1)'),
              $cards = $parent.find(elements);
          var auxHeight, maxHeight;

          if ($cards.length >= 1) {
            auxHeight = [];
            $.each($cards, function () {
              auxHeight.push($(this).find(child)[0].offsetHeight);
            });
            maxHeight = Math.max.apply(Math, auxHeight);
            $.each($cards, function () {
              $(this).find(child).css('height', maxHeight); // Parche para IE "Forzar a dar una altura al figure de la imagen"

              if ((navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) && $(this).find(child).parents('.ibe-card-box--vertical').length > 0 && window.innerWidth >= dFrontJs.resolutions.md) {
                // console.log("hay", maxHeight);
                // //backHeight = $(this).find(child).height();
                $(this).find('.ibe-card-box__figure').height(maxHeight);
              }
            });
          }
        });
      } else {
        $(elements).find(child).css('height', 'auto');
      }
    });
  };

  return {
    'init': init,
    'calculateHeightBox': calculateHeightBox,
    'calculateHeightText': calculateHeightText
  };
}(jQuery);
"use strict";

dFrontJs.ibe_card_discount = function () {
  /*eslint no-underscore-dangle: ['error', { 'allow': ['_functionHeight', '_functionDestroy'] }]*/
  //ibe-card-discount 
  var _functionHeight = function () {
    var $element = $('[data-function="discount"]');
    var heightOutstanding = $('.ibe-outstanding').innerHeight();
    $element.css('margin-top', '-' + heightOutstanding / 2 + 'px');
  };

  var _functionDestroy = function () {
    var $element = $('[data-function="discount"]');
    $element.css('margin-top', '');
  };

  var init = function () {
    if (window.innerWidth < dFrontJs.resolutions.md && window.innerWidth >= dFrontJs.resolutions.sm) {
      _functionHeight();
    }

    $(window).on('resize', function (e) {
      clearTimeout($.data(this, 'resizeDiscount'));
      $.data(this, 'resizeDiscount', setTimeout(function () {
        if (window.innerWidth < dFrontJs.resolutions.md && window.innerWidth >= dFrontJs.resolutions.sm) {
          _functionHeight();
        } else {
          _functionDestroy();
        }
      }));
    });
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_carousel = function () {
  /*eslint no-underscore-dangle: ['error', { 'allow': ['_calculateLazyImages', '_calculateLazyImagesInit'] }]*/
  var calculateHeightTitle = function () {
    $('.ibe-search-flights__cover--carousel-home').find('.title').each(function () {
      var $this = $(this);
      var lineHeight = parseInt($this.css('line-height'));
      var paddingBottom = parseInt($this.css('padding-bottom'));
      var paddingTop = parseInt($this.css('padding-top'));
      var total = parseInt($this.height());

      if (total > lineHeight + paddingTop + paddingBottom) {
        $this.parents('.ibe-carousel__full-height').addClass('ibe-carousel__full-height--title-modify');
        $this.parents('.ibe-search-flights').addClass('ibe-search-flights-modify');
      } else {
        $this.parents('.ibe-carousel__full-height').removeClass('ibe-carousel__full-height--title-modify');
      }
    });
  };

  var _calculateLazyImages = function (event, slick, currentSlide, nextSlide) {
    var picture = $(slick.$slider).find('picture');
    var $source;
    picture.each(function () {
      var dataLazySRC = $(this).find('img').attr('data-lazys');

      if (!$(this).hasClass('lazyLoadCarousel')) {
        $source = $(this).find('source');
        $source.each(function () {
          var dataLazy = $(this).attr('data-lazys');
          $(this).attr('srcset', dataLazy);
          $(this).removeAttr('data-lazys');
        });
        $(this).find('img').attr('src', dataLazySRC);
        $(this).find('img').on('error', function (e) {
          var src = navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ? e.target.src.split('.') : e.target.currentSrc.split('.'),
              type = src[src.length - 1],
              newSrc = navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ? e.target.src.split(type)[0] : e.target.currentSrc.split(type)[0],
              currentSplit = navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ? e.target.src.split('/') : e.target.currentSrc.split('/'),
              current = navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ? currentSplit[currentSplit.length - 1] : currentSplit[currentSplit.length - 1],
              resolution = checkResolution(); // console.log(current)

          $source = $(this).parent().find('source');

          if (!$(this).hasClass('onErrorCheck-' + resolution)) {
            $(this).addClass('onErrorCheck-' + resolution);
            $(this).attr('src', newSrc + 'jpg');
            $(this).removeAttr('data-lazys');
            $source.each(function () {
              var currentsrcsetSplit = $(this).attr('srcset').split('/');
              var currentsrcset = currentsrcsetSplit[currentsrcsetSplit.length - 1]; // console.log(currentsrcset)

              if (currentsrcset === current) {
                $(this).attr('srcset', $(this).attr('srcset').split(type)[0] + 'jpg');
                $(this).attr('type', 'image/jpg');
              }
            });
          }
        });
        $(this).addClass('lazyLoadCarousel');
      }
    });
  };

  var _calculateLazyImagesInit = function (event, slick, currentSlide, nextSlide) {
    var picture, dataLazySRC, $element;
    $(event.currentTarget).data('slick-active') !== undefined ? nextSlide = $(event.currentTarget).data('slick-active') : nextSlide = 0;
    picture = $(slick.$slides[nextSlide]).find('picture');
    dataLazySRC = picture.find('img').attr('data-lazys');

    if (!picture.hasClass('lazyLoadCarousel')) {
      $element = $(slick.$slides[nextSlide]).find('source');
      $element.each(function () {
        var dataLazy = $(this).attr('data-lazys');
        $(this).attr('srcset', dataLazy);
        $(this).removeAttr('data-lazys');
      });
      picture.find('img').attr('src', dataLazySRC);
      picture.find('img').on('error', function (e) {
        var src = navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ? e.target.src.split('.') : e.target.currentSrc.split('.'),
            type = src[src.length - 1],
            newSrc = navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ? e.target.src.split(type)[0] : e.target.currentSrc.split(type)[0],
            currentSplit = navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ? e.target.src.split('/') : e.target.currentSrc.split('/'),
            current = navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ? currentSplit[currentSplit.length - 1] : currentSplit[currentSplit.length - 1],
            resolution = checkResolution();

        if (!$(this).hasClass('onErrorCheck-' + resolution)) {
          $(this).addClass('onErrorCheck-' + resolution);
          $(this).attr('src', newSrc + 'jpg');
          $(this).removeAttr('data-lazys');
          $element.each(function () {
            var currentsrcsetSplit = $(this).attr('srcset').split('/');
            var currentsrcset = currentsrcsetSplit[currentsrcsetSplit.length - 1];

            if (currentsrcset === current) {
              $(this).attr('srcset', $(this).attr('srcset').split(type)[0] + 'jpg');
              $(this).attr('type', 'image/jpg');
            }
          });
        }
      });
      picture.addClass('lazyLoadCarousel');
    }
  };

  var bullets = function (carousel) {
    var bullets = carousel.parent().find('[data-theta-carousel="bullets"]').children();
    $(bullets[0]).addClass('active');
    bullets.on('click', function () {
      var index;

      if (!$(this).hasClass('active')) {
        $(this).parent().find('.active').removeClass('active');
        index = $(this).index();
        $(this).addClass('active');
        carousel.theta_carousel('moveTo', index);
      }
    });
    carousel.on('change', function (e, data) {
      var index = data.index;
      $(this).parent().find('.active').removeClass('active');
      $(bullets[index]).addClass('active');
    });
  };

  var init = function () {
    var $elementC = $('[data-slick="carrousel"]'),
        $elementS = $('[data-slick="carrousel-social"]'),
        $elementG = $('[data-slick="image-gallery"]'),
        $elementGthumbs = $('[data-slick="image-gallery-thumbs"]'),
        $thetaRight = $('[data-theta-carousel="right"]'),
        $thetaLeft = $('[data-theta-carousel="left"]'),
        $thetaBob = $('[data-theta-carousel="bob"]'),
        $elementF = $('[data-slick="full-window"]'),
        $elementFM = $('[data-slick="full-window-menu"]'),
        $elementD = $('[data-slick="more-destiny"]'),
        $elementE = $('[data-slick="more-wines"]'),
        $elementWarnings = $('[data-slick="warnings"]'),
        $elementSteps = $('[data-slick="steps"]'),
        $elementCardsSlider = $('[data-slick="cards-slider"]'),
        $elementCardsSlider2 = $('[data-slick="cards-slider2"]'),
        $elementCardsSliderBob = $('[data-slick="cards-slider-bob"]'),
        $elementCardsMobileSlider = $('[data-slick="cards-mobile-slider"]'),
        $elementWallSlider = $('[data-slick="wall-slider"]'),
        $elementImgSlider = $('[data-slick="imgs-slider"]'),
        totalSlides,
        slider,
        slideShowsConfig,
        slideItems,
        infiniteParam,
        titleSlide,
        elementR,
        parentR,
        element,
        parent,
        indexSlick;

    var pauseSlick = function () {
      $elementFM.slick('slickPause');
    };

    if ($elementC.length > 0) {
      $elementC.each(function () {
        var params = $(this).data('slick-params');
        $(this).slick(params);
      });
    }

    if ($elementS.length > 0) {
      $elementS.slick({
        dots: false,
        slidesToShow: 4,
        arrows: true,
        infinite: true,
        variableWidth: true,
        centerMode: true,
        swipe: false,
        responsive: [{
          breakpoint: 1024,
          settings: {
            swipe: true
          }
        }, {
          breakpoint: 480,
          settings: {
            arrows: true,
            centerMode: false,
            centerPadding: '',
            slidesToShow: 1,
            variableWidth: false,
            swipe: true
          }
        }]
      });
    }

    if ($elementG.length > 0) {
      totalSlides = $elementG.find('.ibe-image-gallery-slider__slide').length;

      slider = function (indexSlick) {
        $elementG.slick({
          dots: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          infinite: true,
          variableWidth: false,
          asNavFor: $elementGthumbs,
          adaptiveHeight: false,
          centerMode: false,
          swipe: true,
          fade: false,
          appendArrows: $($elementG).parent(),
          slickCurrentSlide: 5,
          initialSlide: indexSlick,
          responsive: [{
            breakpoint: 480,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '',
              slidesToShow: 1,
              variableWidth: true,
              swipe: true
            }
          }]
        });

        if ($elementGthumbs.length > 0) {
          var galleryType = $(".ibe-gallery-carousel").attr("data-gallery");
          slideShowsConfig = 7;
          infiniteParam = true;
          slideItems = $('[data-gallery="airplane"]').find('.ibe-gallery-carousel__col').length;

          if (galleryType === "experiences") {
            slideItems = $('[data-gallery="experiences"]').find('.ibe-gallery-carousel__row').length;
          }

          if (slideItems <= slideShowsConfig) {
            slideShowsConfig = slideItems;

            if (slideItems <= 2) {
              infiniteParam = false;
            }
          }

          $elementGthumbs.slick({
            slidesToShow: slideShowsConfig,
            slidesToScroll: 1,
            asNavFor: $elementG,
            infinite: infiniteParam,
            dots: false,
            arrows: false,
            centerMode: true,
            variableWidth: true,
            focusOnSelect: true,
            initialSlide: indexSlick
          });
        } //Add title


        titleSlide = $elementG.find('.slick-current img, .slick-current iframe').attr('title');
        $('.ibe-image-gallery__container-legend .ibe-image-gallery__container-legend-text').text(titleSlide);

        if ($elementG.find('.slick-current iframe').length > 0) {
          if ($(window).width() < dFrontJs.resolutions.sm) {
            $('.ibe-image-gallery__container-legend .ibe-image-gallery__container-legend-video').css('display', 'block');
          } else {
            $('.ibe-image-gallery__container-legend .ibe-image-gallery__container-legend-video').css('display', 'inline');
          }
        } else {
          $('.ibe-image-gallery__container-legend .ibe-image-gallery__container-legend-video').hide();
        }
      }; // Event open dialog


      $($elementG).parents('.ibe-dialog').on('dialogopen', function (event, ui) {
        var images = $('[data-gallery="' + galleryCarousel + '"]').find('img.ibe-gallery-carousel__img, iframe');
        var totalImages = images.length;
        var carousel = $('.fc-image-gallery').find('[data-slick="image-gallery"]');
        var carouselThumbs = $('.fc-image-gallery').find('[data-slick="image-gallery-thumbs"]');
        var image, i, contImg, divCont, slide, slideThumb;

        for (i = 0; i < totalImages; i++) {
          image = $(images[i]).clone();
          image.removeAttr('class');
          image.addClass('ibe-image-gallery-slider__img');
          contImg = $('<figure class="ibe-image-gallery-slider__cont-img"></figure>').append(image);
          divCont = $('<div class="ibe-image-gallery-slider__slide"></div>').append(contImg);

          if (image[0].tagName === 'IFRAME') {
            divCont.addClass('ibe-image-gallery-slider__slide--video');
          }

          slide = $('<div data-slick="fc-slide"></div>').append(divCont);
          slideThumb = slide.clone();
          carousel.append(slide);
          carouselThumbs.append(slideThumb);
        }

        $('body').css('overflow', 'hidden');
        $('.ibe-image-gallery__container-legend .ibe-image-gallery__container-legend-current').text(dFrontJs.app.indexCarouselCardAirplane + 1);
        $('.ibe-image-gallery__container-legend .ibe-image-gallery__container-legend-count').text(totalImages);
        slider(dFrontJs.app.indexCarouselCardAirplane);
      }); // Event close dialog

      $($elementG).parents('.ibe-dialog').on('dialogclose', function (event, ui) {
        $('body').css('overflow', 'auto');
        $($elementG).slick('unslick');
        $($elementGthumbs).slick('unslick');
        $('.fc-image-gallery').find('[data-slick="fc-slide"]').remove();
      }); // Events slick

      $elementG.on('afterChange', function (event, slick, currentSlide, nextSlide) {
        var titleSlide;
        currentSlide = currentSlide + 1;
        $('.ibe-image-gallery__container-legend .ibe-image-gallery__container-legend-current').text(currentSlide);
        titleSlide = $elementG.find('.slick-current img, .slick-current iframe').attr('title');
        $('.ibe-image-gallery__container-legend .ibe-image-gallery__container-legend-text').text(titleSlide);

        if ($elementG.find('.slick-current iframe').length > 0) {
          if ($(window).width() < dFrontJs.resolutions.sm) {
            $('.ibe-image-gallery__container-legend .ibe-image-gallery__container-legend-video').css('display', 'block');
          } else {
            $('.ibe-image-gallery__container-legend .ibe-image-gallery__container-legend-video').css('display', 'inline');
          }
        } else {
          $('.ibe-image-gallery__container-legend .ibe-image-gallery__container-legend-video').hide();
        }
      });
    }

    let autoplaySpeedContri;

    if ($('.ibe-search-flights__cover--carousel-home').length > 0 && $('.ibe-search-flights__cover--carousel-home')[0].getAttribute('data-time-transition')) {
      autoplaySpeedContri = $('.ibe-search-flights__cover--carousel-home')[0].getAttribute('data-time-transition');
    } else {
      autoplaySpeedContri = 10000;
    }

    if ($elementF.length > 0 && $elementFM.length > 0) {
      $elementF.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        asNavFor: '[data-slick="full-window-menu"]',
        nextArrow: $('.slick-next'),
        prevArrow: $('.slick-prev'),
        focusOnSelect: true
      });
      $elementFM.slick({
        autoplay: true,
        autoplaySpeed: autoplaySpeedContri,
        pauseOnFocus: false,
        pauseOnHover: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        arrows: false,
        fade: true,
        asNavFor: '[data-slick="full-window"]',
        lazyLoad: 'ondemand'
      });
      $('.slick-next, .slick-prev').off('click', pauseSlick).on("click", pauseSlick);
      $elementFM.off('swipe', pauseSlick).on('swipe', pauseSlick);
    } else if ($elementFM.length > 0) {
      indexSlick = $elementFM.data('slick-active') !== undefined ? $elementFM.data('slick-active') : 0;
      $elementFM.on('init', function (event, slick, currentSlide, nextSlide) {
        calculateHeightTitle();
        $elementFM.find('.u-hidden').removeClass('u-hidden');
        requestAnimFrame(function () {
          _calculateLazyImagesInit(event, slick, currentSlide, nextSlide);
        });
      });
      $elementFM.slick({
        autoplay: true,
        autoplaySpeed: autoplaySpeedContri,
        pauseOnFocus: false,
        pauseOnHover: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 1000,
        infinite: true,
        nextArrow: $('.slick-next'),
        prevArrow: $('.slick-prev'),
        focusOnSelect: true,
        lazyLoad: 'ondemand',
        // 'ondemand' or 'progressive',
        initialSlide: indexSlick
      });
      $('.slick-next, .slick-prev').off('click', pauseSlick).on("click", pauseSlick);
      $elementFM.off('swipe', pauseSlick).on('swipe', pauseSlick);

      if ($('[data-lazys]').length > 0) {
        $elementFM.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
          _calculateLazyImages(event, slick, currentSlide, nextSlide);

          $elementFM.off('beforeChange');
        });
      }

      requestAnimFrame(function () {
        $('[data-slick="full-window-menu"] article.row.hidden').removeClass('hidden');
      });
    }

    if ($elementD.length > 0) {
      $elementD.slick({
        'dots': false,
        'slidesToShow': 4,
        'arrows': true,
        'infinite': true,
        'centerMode': false,
        'swipe': true,
        'centerPadding': '',
        'responsive': [{
          'breakpoint': 1280,
          'arrows': true,
          'settings': {
            'slidesToShow': 3
          }
        }, {
          'breakpoint': 1024,
          'arrows': true,
          'settings': {
            'slidesToShow': 3
          }
        }, {
          'breakpoint': 768,
          'settings': {
            'arrows': false,
            'variableWidth': true,
            'centerMode': false,
            'slidesToShow': 3
          }
        }, {
          'breakpoint': 480,
          'settings': {
            'arrows': false,
            'variableWidth': true,
            'centerMode': false,
            'slidesToShow': 1
          }
        }]
      });
    }

    if ($elementE.length > 0) {
      $elementE.slick({
        'dots': true,
        'slidesToShow': 4,
        'arrows': true,
        'infinite': true,
        'centerMode': false,
        'swipe': true,
        'centerPadding': '',
        'responsive': [{
          'breakpoint': 1280,
          'arrows': true,
          'settings': {
            'slidesToShow': 4
          }
        }, {
          'breakpoint': 1024,
          'arrows': true,
          'settings': {
            'slidesToShow': 3
          }
        }, {
          'breakpoint': 768,
          'settings': {
            'arrows': false,
            'variableWidth': true,
            'centerMode': false,
            'slidesToShow': 3
          }
        }, {
          'breakpoint': 480,
          'settings': {
            'arrows': false,
            'variableWidth': true,
            'centerMode': false,
            'dots': false,
            'slidesToShow': 1
          }
        }]
      });
    }

    if ($elementSteps.length > 0) {
      $elementSteps.slick({
        'dots': true,
        'slidesToShow': 4,
        'arrows': false,
        'infinite': true,
        'centerMode': false,
        'swipe': true,
        'centerPadding': '',
        'responsive': [{
          'breakpoint': 768,
          'settings': {
            'slidesToShow': 1
          }
        }]
      });
    }

    if ($elementCardsSlider.length > 0) {
      $elementCardsSlider.slick({
        'dots': true,
        'slidesToShow': 3,
        'slidesToScroll': 3,
        'arrows': false,
        'infinite': true,
        'centerMode': false,
        'swipe': true,
        'centerPadding': '',
        'autoplay': true,
        'autoplaySpeed': 6000,
        'responsive': [{
          'breakpoint': 768,
          'settings': {
            'slidesToShow': 1,
            'slidesToScroll': 1,
            'autoplay': true,
            'autoplaySpeed': 6000
          }
        }, {
          breakpoint: 480,
          settings: {
            'slidesToShow': 1,
            'slidesToScroll': 1,
            'autoplay': true,
            'autoplaySpeed': 6000
          }
        }]
      });
    }

    if ($elementCardsSlider2.length > 0) {
      $elementCardsSlider2.slick({
        'dots': true,
        'slidesToShow': 2,
        'slidesToScroll': 1,
        'arrows': true,
        'infinite': true,
        'centerMode': false,
        'swipe': true,
        'centerPadding': '',
        'responsive': [{
          'breakpoint': 768,
          'settings': {
            'slidesToShow': 1,
            'slidesToScroll': 1,
            'autoplay': true,
            'autoplaySpeed': 5000
          }
        }, {
          breakpoint: 480,
          settings: {
            'slidesToShow': 1,
            'slidesToScroll': 1,
            'autoplay': true,
            'autoplaySpeed': 5000
          }
        }]
      });
    }

    if ($elementCardsSliderBob.length > 0) {
      $elementCardsSliderBob.slick({
        'dots': true,
        'slidesToShow': 3,
        'slidesToScroll': 1,
        'arrows': true,
        'infinite': true,
        'centerMode': false,
        'swipe': true,
        'centerPadding': '',
        'responsive': [{
          'breakpoint': 1279,
          'settings': {
            'slidesToShow': 2,
            'slidesToScroll': 1,
            'autoplay': true,
            'autoplaySpeed': 5000
          }
        }, {
          'breakpoint': 768,
          'settings': {
            'slidesToShow': 1,
            'slidesToScroll': 1,
            'autoplay': false,
            'autoplaySpeed': 5000
          }
        }]
      });
    }

    if ($elementCardsMobileSlider.length > 0) {
      $elementCardsMobileSlider.slick({
        'dots': false,
        'slidesToShow': 3,
        'slidesToScroll': 0,
        'slidesPerRow': 3,
        'arrows': false,
        'infinite': true,
        'centerMode': false,
        'swipe': true,
        'centerPadding': '',
        'responsive': [{
          'breakpoint': 768,
          'settings': {
            'slidesToShow': 1,
            'slidesToScroll': 1
          }
        }, {
          'breakpoint': 320,
          'settings': {
            'slidesToShow': 1,
            'slidesToScroll': 1,
            'dots': true
          }
        }]
      });
    }

    if ($elementWallSlider.length > 0) {
      $elementWallSlider.slick({
        rows: 2,
        slidesPerRow: 4,
        arrows: false,
        centerMode: false,
        responsive: [{
          breakpoint: 768,
          settings: {
            centerMode: true,
            rows: 1,
            slidesPerRow: 2,
            autoplay: true,
            autoplaySpeed: 5000
          }
        }, {
          breakpoint: 480,
          settings: {
            centerMode: true,
            rows: 1,
            slidesPerRow: 1,
            autoplay: true,
            autoplaySpeed: 5000
          }
        }]
      });
    } //fer


    if ($elementImgSlider.length > 0) {
      $elementImgSlider.slick({
        'dots': true,
        rows: 1,
        slidesPerRow: 6,
        arrows: false,
        centerMode: false,
        responsive: [{
          breakpoint: 1280,
          settings: {
            slidesPerRow: 4,
            dots: true
          }
        }, {
          breakpoint: 1024,
          settings: {
            slidesPerRow: 4,
            dots: true
          }
        }, {
          breakpoint: 768,
          settings: {
            slidesPerRow: 2,
            dots: true,
            autoplay: true,
            autoplaySpeed: 5000
          }
        }, {
          breakpoint: 480,
          settings: {
            centerMode: true,
            slidesPerRow: 1,
            dots: false,
            autoplay: true,
            autoplaySpeed: 5000
          }
        }]
      });
    } //Crousel theta right version


    if ($thetaRight.length > 0) {
      elementR = $thetaRight[0].outerHTML;
      parentR = $thetaRight.parent();

      if (window.innerWidth >= dFrontJs.resolutions.sm) {
        if (window.innerWidth < dFrontJs.resolutions.md) {
          $thetaRight.addClass('active-sm');
          $thetaRight.theta_carousel({
            'filter': '.ibe-box-landing__slick-item',
            'distance': 83,
            'numberOfElementsToDisplayRight': 3,
            'numberOfElementsToDisplayLeft': 0,
            'mousewheelEnabled': false,
            'designedForWidth': 550,
            'designedForHeight': 600,
            'scaleX': 1.8,
            'scaleZ': 0,
            'distanceInFallbackMode': 350,
            'path': {
              'settings': {
                'shiftX': 70,
                'shiftY': 0,
                'shiftZ': 210,
                'rotationAngleZX': -30,
                'endless': true
              },
              'type': 'line'
            },
            'perspective': 351,
            'sensitivity': 0.7,
            'sizeAdjustment': true,
            'sizeAdjustmentNumberOfConfigurableElements': 6,
            'sizeAdjustmentBezierPoints': {
              'p1': {
                'x': 0,
                'y': 100
              },
              'p2': {
                'x': 50,
                'y': 100
              },
              'p3': {
                'x': 50,
                'y': 100
              },
              'p4': {
                'x': 100,
                'y': 100
              }
            },
            'popoutSelected': true
          });
        } else {
          $thetaRight.addClass('active-md');
          $thetaRight.theta_carousel({
            'filter': '.ibe-box-landing__slick-item',
            'distance': 53,
            'numberOfElementsToDisplayRight': 3,
            'numberOfElementsToDisplayLeft': 0,
            'mousewheelEnabled': false,
            'designedForWidth': 835,
            'designedForHeight': 700,
            'scaleX': 2.8,
            'scaleZ': 0.6,
            'distanceInFallbackMode': 350,
            'path': {
              'settings': {
                'shiftX': 70,
                'shiftY': 0,
                'shiftZ': 210,
                'rotationAngleZX': -30,
                'endless': true
              },
              'type': 'line'
            },
            'perspective': 351,
            'sensitivity': 0.7,
            'sizeAdjustment': true,
            'sizeAdjustmentNumberOfConfigurableElements': 6,
            'sizeAdjustmentBezierPoints': {
              'p1': {
                'x': 0,
                'y': 100
              },
              'p2': {
                'x': 50,
                'y': 100
              },
              'p3': {
                'x': 50,
                'y': 100
              },
              'p4': {
                'x': 100,
                'y': 100
              }
            },
            'popoutSelected': true
          });
        }
      } else {
        $thetaRight.addClass('active-xs');
        $thetaRight.slick({
          infinite: true,
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: true,
          arrows: false,
          variableWidth: true
        });
      }

      $(window).on('resize', function (e) {
        if (window.innerWidth >= dFrontJs.resolutions.sm) {
          if (window.innerWidth < dFrontJs.resolutions.md) {
            $thetaRight.removeClass('active-md');

            if ($thetaRight.hasClass('active-xs')) {
              $thetaRight.removeClass('active-xs');
              $thetaRight.slick('unslick');
              $thetaRight.theta_carousel({
                'filter': '.ibe-box-landing__slick-item',
                'distance': 83,
                'numberOfElementsToDisplayRight': 3,
                'numberOfElementsToDisplayLeft': 0,
                'mousewheelEnabled': false,
                'designedForWidth': 550,
                'designedForHeight': 600,
                'scaleX': 1.8,
                'scaleZ': 0,
                'distanceInFallbackMode': 350,
                'path': {
                  'settings': {
                    'shiftX': 70,
                    'shiftY': 0,
                    'shiftZ': 210,
                    'rotationAngleZX': -30,
                    'endless': true
                  },
                  'type': 'line'
                },
                'perspective': 351,
                'sensitivity': 0.7,
                'sizeAdjustment': true,
                'sizeAdjustmentNumberOfConfigurableElements': 6,
                'sizeAdjustmentBezierPoints': {
                  'p1': {
                    'x': 0,
                    'y': 100
                  },
                  'p2': {
                    'x': 50,
                    'y': 100
                  },
                  'p3': {
                    'x': 50,
                    'y': 100
                  },
                  'p4': {
                    'x': 100,
                    'y': 100
                  }
                },
                'popoutSelected': true
              });
              $thetaRight.addClass('active-sm');
            } else {
              if (!$thetaRight.hasClass('active-sm')) {
                $thetaRight.theta_carousel({
                  'filter': '.ibe-box-landing__slick-item',
                  'distance': 83,
                  'numberOfElementsToDisplayRight': 3,
                  'numberOfElementsToDisplayLeft': 0,
                  'mousewheelEnabled': false,
                  'designedForWidth': 550,
                  'designedForHeight': 600,
                  'scaleX': 1.8,
                  'scaleZ': 0,
                  'distanceInFallbackMode': 350,
                  'path': {
                    'settings': {
                      'shiftX': 70,
                      'shiftY': 0,
                      'shiftZ': 210,
                      'rotationAngleZX': -30,
                      'endless': true
                    },
                    'type': 'line'
                  },
                  'perspective': 351,
                  'sensitivity': 0.7,
                  'sizeAdjustment': true,
                  'sizeAdjustmentNumberOfConfigurableElements': 6,
                  'sizeAdjustmentBezierPoints': {
                    'p1': {
                      'x': 0,
                      'y': 100
                    },
                    'p2': {
                      'x': 50,
                      'y': 100
                    },
                    'p3': {
                      'x': 50,
                      'y': 100
                    },
                    'p4': {
                      'x': 100,
                      'y': 100
                    }
                  },
                  'popoutSelected': true
                });
                $thetaRight.addClass('active-sm');
              }
            }
          } else {
            $thetaRight.removeClass('active-sm');

            if ($thetaRight.hasClass('active-xs')) {
              $thetaRight.slick('unslick');
              $thetaRight.removeClass('active-xs');
              $thetaRight.theta_carousel({
                'filter': '.ibe-box-landing__slick-item',
                'distance': 53,
                'numberOfElementsToDisplayRight': 3,
                'numberOfElementsToDisplayLeft': 0,
                'mousewheelEnabled': false,
                'designedForWidth': 835,
                'designedForHeight': 700,
                'scaleX': 2.8,
                'scaleZ': 0.6,
                'distanceInFallbackMode': 350,
                'path': {
                  'settings': {
                    'shiftX': 70,
                    'shiftY': 0,
                    'shiftZ': 210,
                    'rotationAngleZX': -30,
                    'endless': true
                  },
                  'type': 'line'
                },
                'perspective': 351,
                'sensitivity': 0.7,
                'sizeAdjustment': true,
                'sizeAdjustmentNumberOfConfigurableElements': 6,
                'sizeAdjustmentBezierPoints': {
                  'p1': {
                    'x': 0,
                    'y': 100
                  },
                  'p2': {
                    'x': 50,
                    'y': 100
                  },
                  'p3': {
                    'x': 50,
                    'y': 100
                  },
                  'p4': {
                    'x': 100,
                    'y': 100
                  }
                },
                'popoutSelected': true
              });
              $thetaRight.addClass('active-md');
            } else {
              if (!$thetaRight.hasClass('active-md')) {
                $thetaRight.theta_carousel({
                  'filter': '.ibe-box-landing__slick-item',
                  'distance': 53,
                  'numberOfElementsToDisplayRight': 3,
                  'numberOfElementsToDisplayLeft': 0,
                  'mousewheelEnabled': false,
                  'designedForWidth': 835,
                  'designedForHeight': 700,
                  'scaleX': 2.8,
                  'scaleZ': 0.6,
                  'distanceInFallbackMode': 350,
                  'path': {
                    'settings': {
                      'shiftX': 70,
                      'shiftY': 0,
                      'shiftZ': 210,
                      'rotationAngleZX': -30,
                      'endless': true
                    },
                    'type': 'line'
                  },
                  'perspective': 351,
                  'sensitivity': 0.7,
                  'sizeAdjustment': true,
                  'sizeAdjustmentNumberOfConfigurableElements': 6,
                  'sizeAdjustmentBezierPoints': {
                    'p1': {
                      'x': 0,
                      'y': 100
                    },
                    'p2': {
                      'x': 50,
                      'y': 100
                    },
                    'p3': {
                      'x': 50,
                      'y': 100
                    },
                    'p4': {
                      'x': 100,
                      'y': 100
                    }
                  },
                  'popoutSelected': true
                });
                $thetaRight.addClass('active-md');
              }
            }
          }
        } else {
          if (!$thetaRight.hasClass('active-xs')) {
            $thetaRight.removeClass('active-md');
            $thetaRight.removeClass('active-sm');
            $thetaRight.remove();
            parentR.prepend(elementR).html();
            $thetaRight = $('[data-theta-carousel="right"]');
            $thetaRight.slick({
              infinite: true,
              slidesToShow: 2,
              slidesToScroll: 2,
              dots: true,
              arrows: false,
              variableWidth: true
            });
            $thetaRight.addClass('active-xs');
          }
        }
      });
      bullets($thetaRight);
    } //Carousel left part


    if ($thetaLeft.length > 0) {
      element = $thetaLeft[0].outerHTML;
      parent = $thetaLeft.parent();

      if (window.innerWidth >= dFrontJs.resolutions.sm) {
        if (window.innerWidth < dFrontJs.resolutions.md) {
          $thetaLeft.addClass('active-sm');
          $thetaLeft.theta_carousel({
            filter: '.ibe-box-landing__slick-item',
            numberOfElementsToDisplayRight: 2,
            numberOfElementsToDisplayLeft: 0,
            mousewheelEnabled: false,
            designedForWidth: 850,
            designedForHeight: 600,
            distanceInFallbackMode: 350,
            scaleX: 1.41,
            path: {
              settings: {
                shiftZ: 80,
                rotationAngleZX: -40,
                endless: true
              },
              type: 'line'
            },
            perspective: 351,
            sensitivity: 0.7,
            sizeAdjustment: true,
            sizeAdjustmentNumberOfConfigurableElements: 6,
            sizeAdjustmentBezierPoints: {
              p1: {
                x: 0,
                y: 100
              },
              p2: {
                x: 50,
                y: 100
              },
              p3: {
                x: 50,
                y: 100
              },
              p4: {
                x: 100,
                y: 100
              }
            },
            popoutSelected: true
          });
        } else {
          $thetaLeft.addClass('active-md');
          $thetaLeft.theta_carousel({
            'filter': '.ibe-box-landing__slick-item',
            'distance': 70,
            'numberOfElementsToDisplayRight': 2,
            'numberOfElementsToDisplayLeft': 0,
            'mousewheelEnabled': false,
            'designedForWidth': 600,
            'designedForHeight': 500,
            'scaleX': 1.3,
            'scaleZ': 1,
            'distanceInFallbackMode': 350,
            'path': {
              'settings': {
                'shiftX': 0,
                'shiftY': 0,
                'shiftZ': 80,
                'rotationAngleZX': 50,
                'endless': true
              },
              'type': 'line'
            },
            'perspective': 351,
            'sensitivity': 0.7,
            'sizeAdjustment': true,
            'sizeAdjustmentNumberOfConfigurableElements': 6,
            'sizeAdjustmentBezierPoints': {
              'p1': {
                'x': 0,
                'y': 100
              },
              'p2': {
                'x': 50,
                'y': 100
              },
              'p3': {
                'x': 50,
                'y': 100
              },
              'p4': {
                'x': 100,
                'y': 100
              }
            },
            'popoutSelected': true
          });
        }
      } else {
        $thetaLeft.addClass('active-xs');
        $thetaLeft.slick({
          infinite: false,
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
          variableWidth: true,
          centerMode: true,
          centerPadding: '0px'
        });
      }

      $(window).on('resize', function (e) {
        if (window.innerWidth >= dFrontJs.resolutions.sm) {
          if (window.innerWidth < dFrontJs.resolutions.md) {
            if ($thetaLeft.hasClass('active-xs')) {
              $thetaLeft.removeClass('active-xs');
              $thetaLeft.slick('unslick');
              $thetaLeft.theta_carousel({
                filter: '.ibe-box-landing__slick-item',
                numberOfElementsToDisplayRight: 2,
                numberOfElementsToDisplayLeft: 0,
                mousewheelEnabled: false,
                designedForWidth: 850,
                designedForHeight: 600,
                distanceInFallbackMode: 350,
                scaleX: 1.41,
                path: {
                  settings: {
                    shiftZ: 80,
                    rotationAngleZX: -40,
                    endless: true
                  },
                  type: 'line'
                },
                perspective: 351,
                sensitivity: 0.7,
                sizeAdjustment: true,
                sizeAdjustmentNumberOfConfigurableElements: 6,
                sizeAdjustmentBezierPoints: {
                  p1: {
                    x: 0,
                    y: 100
                  },
                  p2: {
                    x: 50,
                    y: 100
                  },
                  p3: {
                    x: 50,
                    y: 100
                  },
                  p4: {
                    x: 100,
                    y: 100
                  }
                },
                popoutSelected: true
              });
              $thetaLeft.addClass('active-sm');
            } else {
              $thetaLeft.removeClass('active-md');

              if (!$thetaLeft.hasClass('active-sm')) {
                $thetaLeft.theta_carousel({
                  filter: '.ibe-box-landing__slick-item',
                  numberOfElementsToDisplayRight: 2,
                  numberOfElementsToDisplayLeft: 0,
                  mousewheelEnabled: false,
                  designedForWidth: 850,
                  designedForHeight: 600,
                  distanceInFallbackMode: 350,
                  scaleX: 1.41,
                  path: {
                    settings: {
                      shiftZ: 80,
                      rotationAngleZX: -40,
                      endless: true
                    },
                    type: 'line'
                  },
                  perspective: 351,
                  sensitivity: 0.7,
                  sizeAdjustment: true,
                  sizeAdjustmentNumberOfConfigurableElements: 6,
                  sizeAdjustmentBezierPoints: {
                    p1: {
                      x: 0,
                      y: 100
                    },
                    p2: {
                      x: 50,
                      y: 100
                    },
                    p3: {
                      x: 50,
                      y: 100
                    },
                    p4: {
                      x: 100,
                      y: 100
                    }
                  },
                  popoutSelected: true
                });
                $thetaLeft.addClass('active-sm');
              }
            }
          } else {
            if ($thetaLeft.hasClass('active-xs')) {
              $thetaLeft.removeClass('active-xs');
              $thetaLeft.slick('unslick');
              $thetaLeft.theta_carousel({
                'filter': '.ibe-box-landing__slick-item',
                'distance': 70,
                'numberOfElementsToDisplayRight': 2,
                'numberOfElementsToDisplayLeft': 0,
                'mousewheelEnabled': false,
                'designedForWidth': 600,
                'designedForHeight': 500,
                'scaleX': 1.3,
                'scaleZ': 1,
                'distanceInFallbackMode': 350,
                'path': {
                  'settings': {
                    'shiftX': 0,
                    'shiftY': 0,
                    'shiftZ': 80,
                    'rotationAngleZX': 50,
                    'endless': true
                  },
                  'type': 'line'
                },
                'perspective': 351,
                'sensitivity': 0.7,
                'sizeAdjustment': true,
                'sizeAdjustmentNumberOfConfigurableElements': 6,
                'sizeAdjustmentBezierPoints': {
                  'p1': {
                    'x': 0,
                    'y': 100
                  },
                  'p2': {
                    'x': 50,
                    'y': 100
                  },
                  'p3': {
                    'x': 50,
                    'y': 100
                  },
                  'p4': {
                    'x': 100,
                    'y': 100
                  }
                },
                'popoutSelected': true
              });
              $thetaLeft.addClass('active-md');
            } else {
              $thetaLeft.removeClass('active-sm');

              if (!$thetaLeft.hasClass('active-md')) {
                $thetaLeft.theta_carousel({
                  'filter': '.ibe-box-landing__slick-item',
                  'distance': 70,
                  'numberOfElementsToDisplayRight': 2,
                  'numberOfElementsToDisplayLeft': 0,
                  'mousewheelEnabled': false,
                  'designedForWidth': 600,
                  'designedForHeight': 500,
                  'scaleX': 1.3,
                  'scaleZ': 1,
                  'distanceInFallbackMode': 350,
                  'path': {
                    'settings': {
                      'shiftX': 0,
                      'shiftY': 0,
                      'shiftZ': 80,
                      'rotationAngleZX': 50,
                      'endless': true
                    },
                    'type': 'line'
                  },
                  'perspective': 351,
                  'sensitivity': 0.7,
                  'sizeAdjustment': true,
                  'sizeAdjustmentNumberOfConfigurableElements': 6,
                  'sizeAdjustmentBezierPoints': {
                    'p1': {
                      'x': 0,
                      'y': 100
                    },
                    'p2': {
                      'x': 50,
                      'y': 100
                    },
                    'p3': {
                      'x': 50,
                      'y': 100
                    },
                    'p4': {
                      'x': 100,
                      'y': 100
                    }
                  },
                  'popoutSelected': true
                });
                $thetaLeft.addClass('active-md');
              }
            }
          }
        } else {
          if (!$thetaLeft.hasClass('active-xs')) {
            $thetaLeft.removeClass('active-md');
            $thetaLeft.removeClass('active-sm');
            $thetaLeft.remove();
            parent.prepend(element).html();
            $thetaLeft = $('[data-theta-carousel="left"]');
            $thetaLeft.slick({
              infinite: false,
              slidesToShow: 2,
              slidesToScroll: 1,
              dots: true,
              arrows: false,
              variableWidth: true,
              centerMode: true,
              centerPadding: '0px'
            });
            $thetaLeft.addClass('active-xs');
            dFrontJs.app.emitInView();
          }
        }
      });
      bullets($thetaLeft);
    } //Crousel theta bob version


    if ($thetaBob.length > 0) {
      elementR = $thetaBob[0].outerHTML;
      parentR = $thetaBob.parent();
      $thetaBob.addClass('active-md');
      $thetaBob.theta_carousel({
        'filter': '.ibe-box-landing__slick-item',
        'distance': 43,
        'numberOfElementsToDisplayRight': 3,
        'numberOfElementsToDisplayLeft': 0,
        'mousewheelEnabled': false,
        'designedForWidth': 635,
        'designedForHeight': 700,
        'scaleX': 1.8,
        'scaleZ': 1,
        'distanceInFallbackMode': 350,
        'path': {
          'settings': {
            'shiftX': 70,
            'shiftY': 0,
            'shiftZ': 210,
            'rotationAngleZX': -30,
            'endless': true
          },
          'type': 'line'
        },
        // 'perspective': 351,
        'sensitivity': 0.7,
        'sizeAdjustment': true,
        'sizeAdjustmentNumberOfConfigurableElements': 6,
        'sizeAdjustmentBezierPoints': {
          'p1': {
            'x': 0,
            'y': 100
          },
          'p2': {
            'x': 50,
            'y': 100
          },
          'p3': {
            'x': 50,
            'y': 100
          },
          'p4': {
            'x': 100,
            'y': 100
          }
        },
        'popoutSelected': true
      });
      $(window).on('resize', function (e) {
        if (window.innerWidth >= dFrontJs.resolutions.sm) {
          $thetaBob.removeClass('active-sm'); // if (!$thetaBob.hasClass('active-md')) {
          // 	$thetaBob.theta_carousel({
          // 		'filter': '.ibe-box-landing__slick-item',
          // 		'distance': 43,
          // 		'numberOfElementsToDisplayRight': 3,
          // 		'numberOfElementsToDisplayLeft': 0,
          // 		'mousewheelEnabled': false,
          // 		'designedForWidth': 635,
          // 		'designedForHeight': 700,
          // 		'scaleX': 2.8,
          // 		'scaleZ': 0.6,
          // 		'distanceInFallbackMode': 350,
          // 		'path': {
          // 			'settings': {
          // 				'shiftX': 70,
          // 				'shiftY': 0,
          // 				'shiftZ': 210,
          // 				'rotationAngleZX': -30,
          // 				'endless': true,
          // 			},
          // 			'type': 'line'
          // 		},
          // 		// 'perspective': 351,
          // 		'sensitivity': 0.7,
          // 		'sizeAdjustment': true,
          // 		'sizeAdjustmentNumberOfConfigurableElements': 6,
          // 		'sizeAdjustmentBezierPoints': {
          // 			'p1': {
          // 				'x': 0,
          // 				'y': 100
          // 			},
          // 			'p2': {
          // 				'x': 50,
          // 				'y': 100
          // 			},
          // 			'p3': {
          // 				'x': 50,
          // 				'y': 100
          // 			},
          // 			'p4': {
          // 				'x': 100,
          // 				'y': 100
          // 			}
          // 		},
          // 		'popoutSelected': true
          // 	});
          // 	$thetaBob.addClass('active-md');
          // }
        }
      });
      bullets($thetaBob);
    } //Carousel warnings


    if ($elementWarnings.length > 0 && $elementWarnings.find('.ibe-carousel--warnings__slide ').length > 1) {
      $elementWarnings.each(function () {
        var params = $(this).data({
          arrows: true,
          dots: false,
          infinite: false
        });
        $(this).slick(params);
      });
    }
  };

  return {
    'init': init,
    'calculateHeightTitle': calculateHeightTitle
  };
}(jQuery);
"use strict";

/**
 * Represents ibe-chart.js
 * @constructor
 * @author ccasalen
 * @description Example of description - This is a component of charts
 * @param {string} [type="hola"] - type of chart
 * @param {string} [color="grey"] - Color of chart
 * @returns {function} dFrontJs.ibe_chart.init()
 * @example dFrontJs.ibe_chart.init()
 */
// import { Chart } from 'node_modules/chart.js/auto'
// const { Chart } = require("chart.js");
dFrontJs.ibe_chart = function () {
  let initData = [],
      barAvatar,
      barAdvancedAvatar,
      myChart;
  let myChartPrices = [];
  let lastSize = '';

  const init = function () {
    Chart.defaults.font.size = 12;
    Chart.defaults.font.family = "Verdana";
    Chart.defaults.color = "#666666";
    Chart.defaults.borderColor = "#DDDDDD"; // Chart.canvas.parentNode.style.width = '1500';
  };

  const moveChart = {
    id: 'moveChart',

    afterEvent(chart, args) {
      let {
        ctx,
        canvas,
        chartArea: {
          left,
          right,
          top,
          bottom,
          width,
          height
        }
      } = chart;
      canvas.addEventListener('mousemove', event => {
        const x = args.event.x;
        const y = args.event.y;

        if (x >= left - 24 && x <= left + 24 && y >= height / 2 + top - 24 && y <= height / 2 + top + 24) {
          canvas.style.cursor = 'pointer';
        } else if (x >= right - 24 && x <= right + 24 && y >= height / 2 + top - 24 && y <= height / 2 + top + 24) {
          canvas.style.cursor = 'pointer';
        } else {
          canvas.style.cursor = 'default';
        }
      });
    },

    afterDraw(chart, args, options) {
      const {
        ctx,
        data,
        chartArea: {
          left,
          right,
          top,
          bottom,
          width,
          height
        },
        scales: {
          x
        }
      } = chart;
      const angle = Math.PI / 180;
      const lastValue = data.datasets[0].data.length - 1;

      class circleArrow {
        draw(ctx, x1, y1, pixel) {
          // CIRCLE
          ctx.beginPath();
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'transparent';
          ctx.fillStyle = '#FFF';
          ctx.arc(x1, height / 2 + top, 24, angle * 0, angle * 360, false);
          ctx.stroke();
          ctx.fill();
          ctx.closePath(); // ARROW 

          ctx.beginPath();
          ctx.lineWidth = 1;
          ctx.strokeStyle = '#D7192D';
          ctx.moveTo(x1 + pixel * 2, height / 2 + top - 5);
          ctx.lineTo(x1 + pixel, height / 2 + top);
          ctx.lineTo(x1 + pixel * 2, height / 2 + top + 5);
          ctx.stroke();
          ctx.closePath();
        }

      }

      if (x.min > 0) {
        let drawLeftArrow = new circleArrow();
        drawLeftArrow.draw(ctx, left - 6, 1, 6);
      }

      if (x.max < lastValue) {
        let drawRightArrow = new circleArrow();
        drawRightArrow.draw(ctx, right - 2, 1, -6);
      }
    }

  };

  const moveScroll = (chart, data) => {
    const {
      ctx,
      canvas,
      chartArea: {
        top,
        bottom,
        left,
        right,
        width,
        height
      },
      scales: {
        x,
        y
      }
    } = chart;
    canvas.addEventListener('click', event => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const area = chart.chartArea;
      const maxShowItems = width >= 1024 ? 11 : window.innerWidth < 1024 && window.innerWidth >= 768 ? 7 : window.innerWidth < 768 && window.innerWidth >= 480 ? 4 : 2;

      if (x >= area.left - 24 && x <= area.left + 24 && y >= area.height / 2 + area.top - 24 && y <= area.height / 2 + area.top + 24) {
        chart.options.scales.x.min = chart.options.scales.x.min - maxShowItems;
        chart.options.scales.x.max = chart.options.scales.x.max - maxShowItems;

        if (chart.options.scales.x.min <= 0) {
          chart.options.scales.x.min = 0;
          chart.options.scales.x.max = maxShowItems;
        }

        chart.update();
      } else if (x >= area.right - 24 && x <= area.right + 24 && y >= area.height / 2 + area.top - 24 && y <= area.height / 2 + area.top + 24) {
        chart.options.scales.x.min = chart.options.scales.x.min + maxShowItems;
        chart.options.scales.x.max = chart.options.scales.x.max + maxShowItems;

        if (chart.options.scales.x.max >= data.datasets[0].data.length) {
          chart.options.scales.x.min = data.datasets[0].data.length - (maxShowItems + 1);
          chart.options.scales.x.max = data.datasets[0].data.length - 1;
        }

        chart.update();
      }
    });
  };

  let configSimpleChart = {
    type: 'bar',
    data: {
      labels: 'na',
      //need data
      datasets: [{
        label: 'Temperatura máxima/mínima',
        data: 'na',
        //need data
        dataMin: 'na',
        //need data
        dataForm: 'na',
        //need data
        anchor: 'center',
        backgroundColor: ['#DDDDDD'],
        barPercentage: 0.5,
        borderWidth: 1,
        borderSkipped: false,
        borderColor: ['#FFF'],
        hoverBorderColor: ['#FFF']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      onResize: event => {
        const lastMin = event.config._config.options.scales.x.min;
        const lastMax = event.config._config.options.scales.x.max;
        const currentSize = window.innerWidth >= 1024 ? 'lg' : window.innerWidth < 1024 && window.innerWidth >= 768 ? 'md' : window.innerWidth < 768 && window.innerWidth >= 480 ? 'sm' : 'xs';
        const maxShowItems = window.innerWidth >= 1024 ? 11 : window.innerWidth < 1024 && window.innerWidth >= 768 ? 7 : window.innerWidth < 768 && window.innerWidth >= 480 ? 4 : 2;

        if (lastSize != currentSize) {
          event.config._config.options.scales.x.min = 0;
          event.config._config.options.scales.x.max = maxShowItems;
          const currentMin = event.config._config.options.scales.x.min;
          const currentMax = event.config._config.options.scales.x.max;

          if (lastMax !== currentMax && lastMin !== currentMin && window.innerWidth < 1024) {
            event.config._config.plugins.push(moveChart);
          }
        }

        lastSize = currentSize;
      },
      layout: {
        padding: {
          top: 40,
          bottom: 40 // left: 10

        }
      },
      parsing: {
        xAxisKey: false,
        yAxisKey: false
      },
      plugins: {
        legend: {
          display: false,
          position: 'top'
        },
        title: {
          display: false,
          text: 'na'
        },
        tooltip: false,
        // {
        // callbacks: {
        //   label: (context) => {
        //     var minTemp = `${context.dataset.dataMin[context.dataIndex]}`;
        //     var formTemp = `${context.dataset.dataForm[context.dataIndex]}`;
        //     return context.dataset.label+ ': ' + context.raw + formTemp + ' / ' + minTemp + formTemp;
        //   }
        // }
        // },
        datalabels: {
          color: '#333333',
          anchor: 'start',
          align: 'bottom',
          offset: '30'
        }
      },
      scales: {
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0
          },
          border: {
            display: true
          },
          grid: {
            display: false,
            drawOnChartArea: true,
            drawTicks: true
          },
          min: 0,
          max: 11
        },
        y: {
          ticks: {
            // callback: function(value, index, ticks) {
            //     return '$' + value;
            // },
            display: false,
            autoSkip: true,
            maxRotation: 0,
            minRotation: 0
          },
          border: {
            display: false
          },
          grid: {
            display: true,
            drawOnChartArea: true,
            drawTicks: true
          }
        }
      }
    },
    plugins: [barAvatar]
  };
  let configAdvancedChart = {
    type: 'bar',
    data: {
      datasets: [{
        label: 'Precio',
        data: initData.map(row => row.price),
        backgroundColor: ['#DDDDDD']
      }]
    },
    options: {
      responsive: true,
      events: ['click', 'mousemove', 'hover'],
      plugins: {
        legend: {
          display: false,
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: context => {
              return context.dataset.label + ": " + context.raw + "€";
            },
            title: context => {
              return '';
            }
          }
        }
      },
      layout: {
        padding: {
          bottom: 30,
          top: 30
        }
      },
      scales: {
        x: {
          max: 22,
          beginAtZero: true,
          grid: {
            offset: false,
            display: false
          },
          ticks: {
            font: {
              weight: tick => {
                let date = new Date(tick.tick.date);

                if (date.getDay() == 0 || date.getDay() == 6) {
                  return 'bold';
                }
              }
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            offset: false
          },
          ticks: {
            callback: function (value, index, ticks) {
              return value + "€";
            }
          }
        }
      }
    }
  };

  const _barAvatar = data => {
    return {
      id: 'barAvatar',

      afterDatasetDraw(chart, args, options) {
        var {
          ctx = chart.getContext("2d"),
          chartArea: {
            top,
            bottom,
            left,
            right,
            width,
            height
          },
          scales: {
            x,
            y
          }
        } = chart;
        ctx.save();
        ctx.font = '3.75rem iberia';
        ctx.fillStyle = '#CCCCCC';

        for (let i = 0; i < data.length; i++) {
          if (data[i].icon === 'sun') {
            data[i].icon = '\uea1c'; // icon-t_soleado
          } else if (initData[i].icon === "rain") {
            data[i].icon = '\uea13'; // icon-t_lluvia
          } else if (data[i].icon === "cloud") {
            data[i].icon = '\uea19'; // icon-t_nublado
          } else if (data[i].icon === "snow") {
            data[i].icon = '\uea1d'; // icon-t_tormenta
          }

          ctx.fillText(data[i].icon, x.getPixelForValue(i) - 60 / 2, y.getPixelForValue(data[i].media));
        }
      }

    };
  };

  const _barAdvancedAvatar = data => {
    return {
      id: 'barAdvancedAvatar',

      afterDatasetDraw(chart, args, options) {
        var {
          ctx = chart.getContext("2d"),
          chartArea: {
            top,
            bottom,
            left,
            right,
            width,
            height
          },
          scales: {
            x,
            y
          }
        } = chart;
        ctx.save();
        ctx.fillStyle = '#333';
        ctx.textAlign = "center";
        let months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        let daysWeek = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

        for (let i = 0; i < x.ticks.length; i++) {
          ctx.font = '0.8125rem Verdana';
          let currentDate = new Date(data[i].date);
          let prevDate = null;

          if (i > 0) {
            prevDate = new Date(data[i - 1].date);

            if (currentDate.getMonth() != prevDate.getMonth()) {
              ctx.fillText(months[currentDate.getMonth()], x.getPixelForValue(i), 20);
            }
          }

          let tickPositionX = x.ticks[i].value;
          let tickPositionY = y.bottom;

          if (daysWeek[currentDate.getDay()] == "Sa" || daysWeek[currentDate.getDay()] == "Do") {
            ctx.font = '800 0.8125rem Verdana';
          }

          ctx.fillText(daysWeek[currentDate.getDay()], x.getPixelForValue(tickPositionX), tickPositionY + 40);
        }
      }

    };
  };

  const _getInitialDateSelected = function (data, selector) {
    let parentDate = null;

    if (data.length > 0) {
      let cheapestDate = "";
      let iterationDate = "";
      let cheapestIndex = "";

      for (let row in data) {
        iterationDate = new Date(data[row].date);

        for (let row2 in data[row].offers) {
          if (cheapestDate == "" || data[row].offers[row2].price > 0 && data[row].offers[row2].price < cheapestDate.price) {
            parentDate = data[row];
            cheapestDate = data[row].offers[row2];
            cheapestIndex = row2;
          }
        }
      }

      let dateAttrName = "";
      let priceAttrName = "";
      let barIndexAttr = "";
      let barSelectorLabel = "";

      if (selector == "chartPrices") {
        dateAttrName = "data-start-date";
        priceAttrName = "data-start-price";
        barIndexAttr = "data-start-index";
        barSelectorLabel = ".ibe-chart-price__departure";
      } else {
        dateAttrName = "data-end-date";
        priceAttrName = "data-end-price";
        barIndexAttr = "data-end-index";
        barSelectorLabel = ".ibe-chart-price__return";
      }

      $(barSelectorLabel).html(cheapestDate.price + "€");
      $(".ibe-chart__prices-container").attr(priceAttrName, cheapestDate.price);
      $(".ibe-chart__prices-container").attr(dateAttrName, cheapestDate.date);
      $(".ibe-chart__prices-container").attr(barIndexAttr, cheapestIndex);
    }

    return parentDate;
  };

  const paintBarsClick = function (myChart) {
    let endIndex = parseInt($(".ibe-chart__prices-container").attr("data-end-index"));
    let startIndex = parseInt($(".ibe-chart__prices-container").attr("data-start-index"));
    let datasetsBar = myChart.data.datasets[0];
    datasetsBar.backgroundColor = datasetsBar.data.map(row => '#DDDDDD');

    if (myChart.canvas.id == "chartPrices") {
      datasetsBar.backgroundColor[startIndex] = '#D7192D';
      startIndex = startIndex + 1;

      if (endIndex > 0) {
        endIndex = endIndex + 1;
      }
    } else if (myChart.canvas.id == "chartPricesReturn") {
      datasetsBar.backgroundColor[endIndex] = '#D7192D';
    }

    if (startIndex != undefined && endIndex != undefined) {
      for (let i = startIndex; i < endIndex; i++) {
        datasetsBar.backgroundColor[i] = '#F7D1D5';
      }
    }

    myChart.update();
  };

  const createChart = function (selector, data) {
    initData = data ? data.list ? data.list : data : [];
    barAvatar = _barAvatar(initData);
    configSimpleChart.data.datasets[0].data = initData.map(row => row.media);
    configSimpleChart.data.datasets[0].dataMin = initData.map(row => row.min);
    configSimpleChart.data.datasets[0].dataForm = initData.map(row => row.form);
    configSimpleChart.data.labels = initData.map(row => row.month);

    configSimpleChart.options.plugins.datalabels.formatter = (value, context) => {
      const minTemp = context.dataset.dataMin[context.dataIndex];
      const formTemp = context.dataset.dataForm[context.dataIndex];
      return value + formTemp + ' / ' + minTemp + formTemp;
    };

    configSimpleChart.plugins = [barAvatar, ChartDataLabels, moveChart];
    let myChart = new Chart($(selector), configSimpleChart);
    myChart.ctx.onclick = moveScroll(myChart, configSimpleChart.data); // const myChart = new Chart();
    // myChart.config.data.datasets[0].data = initData;
    // myChart.config.data.datasets[0].dataMin = initData.min;
    // myChart.update();
  };

  const createAdvancedChart = function (selector, data) {
    if (selector == "chartPrices") {
      if ($(".ibe_form__radio-input[name=flight-type]:checked").val() == "oneway") {
        initData = data && data.oneway ? data.oneway.info : [];
      } else {
        initData = data && data.return ? data.return.info : [];
      }
    } else {
      initData = data && data.departure ? data.departure.info : [];
    }

    let selectedDate = _getInitialDateSelected(initData, selector);

    if (selectedDate != null) {
      initData = selectedDate;
    }

    barAdvancedAvatar = _barAdvancedAvatar(initData.offers);
    configAdvancedChart.data.datasets[0].data = initData.offers.map(row => row.price);
    configAdvancedChart.data.labels = initData.offers.map(row => row.date);
    configAdvancedChart.plugins = [barAdvancedAvatar];
    configAdvancedChart.data.datasets[0].backgroundColor = initData.offers.map(row => '#DDDDDD');
    configAdvancedChart.data.datasets[0].barPercentage = 0.9;
    configAdvancedChart.data.datasets[0].categoryPercentage = 1;

    configAdvancedChart.options.scales.x.ticks.callback = function (index, value, ticks) {
      let date = new Date(configAdvancedChart.data.labels[index]);
      ticks[index].date = configAdvancedChart.data.labels[index];
      return date.getDate();
    };

    myChartPrices[selector] = new Chart($("#" + selector), configAdvancedChart);
    paintBarsClick(myChartPrices[selector]);

    document.getElementById(selector).onclick = function (evt) {
      let pointClicked = myChartPrices[selector].getElementsAtEventForMode(evt, 'nearest', {
        intersect: true
      }, true);
      let datasetsBar = myChartPrices[selector].data.datasets[0];

      if (pointClicked.length > 0) {
        let dateAttrName = "";
        let priceAttrName = "";
        let barIndexAttr = "";

        if (selector == "chartPrices") {
          dateAttrName = "data-start-date";
          priceAttrName = "data-start-price";
          barIndexAttr = "data-start-index";
          $(".ibe-chart-price__departure").html(datasetsBar.data[pointClicked[0].index] + "€");
        } else {
          dateAttrName = "data-end-date";
          priceAttrName = "data-end-price";
          barIndexAttr = "data-end-index";
          $(".ibe-chart-price__return").html(datasetsBar.data[pointClicked[0].index] + "€");
        }

        $(".ibe-chart__prices-container").attr(priceAttrName, datasetsBar.data[pointClicked[0].index]);
        $(".ibe-chart__prices-container").attr(dateAttrName, configAdvancedChart.data.labels[pointClicked[0].index]);
        $(".ibe-chart__prices-container").attr(barIndexAttr, pointClicked[0].index);
        paintBarsClick(myChartPrices["chartPrices"]);
        paintBarsClick(myChartPrices["chartPricesReturn"]);
      }
    };
  };

  return {
    'init': init,
    'createChart': createChart,
    'createAdvancedChart': createAdvancedChart,
    'paintBarsClick': paintBarsClick,
    'myChartPrices': myChartPrices
  };
}(jQuery);
"use strict";

/*
    Marcar simultaneamemnte los checkbox de 'Mis fechas son flexibles' en el buscador cuando están el calendario de ida y de vuelta.
 */
dFrontJs.ibe_check = function () {
  var init = function (e) {
    var a;

    function t(t) {
      var a = t.closest('.ibe-advanced-searcher').length === 0 ? t.parents('.ibe_form__group--half') : t.closest('.ibe-advanced-searcher');
      a.find(e).each(function (e, t) {
        $('#' + $(t).attr('for'))[0].checked = !$('#' + $(t).attr('for')).prop('checked');
      });
    }

    a = $(e);
    a.on('click', function (e) {
      e.preventDefault(), t($(this));
    }), a.each(function (e, a) {
      $('#' + $(a).attr('for')).on('keydown', function (e) {
        var a = e.which;
        e.preventDefault(), 32 !== a && 13 !== a || t($(this));

        switch (e.key) {
          case 'Tab':
            if ($(this).closest('.ibe_form__group--half').length) {
              if (e.shiftKey && e.keyCode === 9) {
                $(this).closest('.ibe_form__group-half').find('[data-cal]').focus();
              } else {
                $(this).closest('.ibe_form__group-half').find('[data-handler="selectDay"] a').eq(0).focus();
              }
            }

            break;

          case 'Enter':
            t($(this));
            break;

          default:
            break;
        }
      });
    });
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_column_count = function () {
  return function (nCols, element, items, columns, responsive) {
    var win = $(window);
    var $element, i;

    var calc = function (cols) {
      var itemsSelector = $(dFrontJs.columnsList).clone(),
          nItems = itemsSelector.length,
          calcRows = parseInt(nItems / cols),
          nRows = Math.floor(calcRows),
          subRows = nItems - calcRows * cols,
          position = 0,
          columnsSelector = $element.find(columns),
          j,
          i;

      for (j = 0; j < cols; j++) {
        if (subRows > j) {
          $(columnsSelector[j]).append(itemsSelector[position]);
          position++;
        }

        for (i = 0; i < nRows; i++) {
          $(columnsSelector[j]).append(itemsSelector[position]);
          position++;
        }
      }
    };

    var createList = function (e) {
      var i;
      var cols = nCols;

      for (i = 0; i < cols; i++) {
        e.append('<ul class="' + columns.replace('.', '') + '"></ul>');
      }
    };

    var reset = function (e) {
      e.children('ul').remove();
    };

    var init = function (e) {
      var destiniesToHtml = e.find('[data-destinies]').html();
      dFrontJs.columnsList = $(destiniesToHtml).find('li.ibe-list-column__item').clone();
      $element = e;
      reset(e);
      createList(e);
      calc(nCols);
    };

    for (i = 0; i < element.length; i++) {
      init($(element).eq(i));
    }
  };
}(jQuery);
"use strict";

dFrontJs.ibe_combobox = function () {
  var index = 0;

  var init = function (selector) {
    var $simple = $(selector).length > 0 ? $(selector) : $('[data-selectize="simple"]');
    var openCombobox, closeCombobox, addItem, init, optionRender; //Functions

    if ($simple.length > 0) {
      openCombobox = function (e) {
        $(e).parent().find('input').attr('aria-expanded', 'true');
      };

      closeCombobox = function (e) {
        $(e).parent().find('input').attr('aria-expanded', 'false');
      };

      addItem = function (value, item) {
        item.parent().parent().find('.option').each(function () {
          if ($(this).html() !== item.html()) {
            $(this).removeClass('selected');
          }
        });
      };

      init = function () {
        var $this = $(this); //change id dynamically for duplicate id on init component.

        setTimeout(function () {
          index++;
          $($this[0].$control_input[0]).attr('aria-owns', $this[0].$dropdown[0].id + index);
          $($this[0].$dropdown[0]).attr('id', $this[0].$dropdown[0].id + index);
        });
      };

      optionRender = function ($item, escape) {
        return '<div role="option" class="option">' + $item.text + '</div>';
      };

      $simple.selectize({
        onItemAdd: addItem,
        onInitialize: init,
        //openOnFocus: false,
        plugins: {
          'accessibility': {}
        },
        render: {
          option: optionRender
        },
        closeAfterSelect: true,
        onDropdownOpen: openCombobox,
        onDropdownClose: closeCombobox
      });
    }
  }; //pluginSelectize
  //Libreria selectize


  Selectize.define('accessibility', function (options) {
    var self = this;

    self.setup = function () {
      var original = self.setup;
      return function () {
        original.apply(self, arguments);
        self.$wrapper.attr({
          'role': 'application'
        });
        self.$dropdown.attr({
          'id': 'aria-selectize-dropdown',
          'role': 'listbox'
        });
        self.$control_input.attr({
          'aria-owns': 'aria-selectize-dropdown',
          'aria-haspopup': 'true',
          'role': 'combobox',
          'aria-autocomplete': 'list',
          'aria-expanded': 'false'
        });
      };
    }();
  });
  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_compact_offers = function () {
  var init = function (selector, index) {
    var isMobile = window.innerWidth < 768,
        node = $(selector),
        topLinkSeparation = 16,
        idName = 'dot-' + index,
        idSelector = '#' + idName,
        openBtnTxt = node.attr('data-button-open'),
        closedBtnTxt = node.attr('data-button-closed'),
        closedAriaCont = node.attr('data-cont-closed'),
        openAriaCont = node.attr('data-cont-open'),
        isContainerCollapsable,
        trigger,
        offersWrapper,
        baseLink,
        baseLinkLenght,
        collapsed,
        firstColum,
        topLink;
    var numberItemsPerRow = node.attr('data-offers-number');
    var itemsPerRow = numberItemsPerRow ? numberItemsPerRow : 3;
    var collapsable = false;
    var linkHeight, minHeight, maxHeight, isflexOffers, isflexOffers1;
    trigger = node.find('[data-offers-collapse="trigger"]');
    offersWrapper = node.find('.ibe-offer-landings__offers-wrapper');
    collapsed = trigger.attr('data-offers-collapsed');
    trigger.attr('data-offers-target', idName);
    offersWrapper.attr('id', idName);
    firstColum = $(idSelector + ' .ibe-offer-landings__offers-column:nth-child(1)');
    topLink = firstColum.find('.ibe-offer-landings__offers-title-link');
    isflexOffers = node.hasClass('ibe-offer-landings__offers-flex');
    isflexOffers1 = node.hasClass('ibe-offer-landings__offers-flex1');
    baseLink = firstColum.find('.ibe-offer-landings__offers-list li');
    baseLinkLenght = baseLink.length;

    if (isflexOffers) {
      baseLinkLenght = baseLinkLenght / 3;

      if (baseLinkLenght % 1 != 0) {
        baseLinkLenght += 1;
      }

      baseLinkLenght = parseInt(baseLinkLenght);
    }

    if (isMobile) {
      initMobile();
    } else {
      initDesktop();
    }

    trigger.on({
      'click': function (event) {
        collapsed = trigger.attr('data-offers-collapsed') === 'false' ? false : true;
        collapsed ? openOffersWrapper(trigger, collapsed) : closeOffersWrapper(trigger, collapsed);
      }
    });

    function initDesktop() {
      isContainerCollapsable = node.attr('data-content-collapsable') === 'true' ? true : false;
      baseLinkLenght > itemsPerRow && !isMobile && isContainerCollapsable ? collapsable = true : collapsable = false;

      if (!collapsable) {
        trigger.hide();
      } else {
        trigger.show();
        baseLinkLenght = node.attr("data-content-flex") ? baseLinkLenght % 3 > 0 ? parseInt(baseLinkLenght / 3 + 1) : baseLinkLenght / 3 : baseLinkLenght;
        linkHeight = baseLink[0].clientHeight, minHeight = topLink.length > 0 ? topLink[0].clientHeight + linkHeight * itemsPerRow + topLinkSeparation : linkHeight * itemsPerRow, maxHeight = topLink.length > 0 ? topLink[0].clientHeight + baseLinkLenght * linkHeight + baseLinkLenght : baseLinkLenght * linkHeight + baseLinkLenght, offersWrapper.attr('data-collapsed-height', minHeight).attr('data-opened-height', maxHeight).css('height', minHeight);

        if (isflexOffers || isflexOffers1) {
          minHeight = minHeight - 1;
          offersWrapper.attr('data-collapsed-height', minHeight).attr('data-opened-height', maxHeight).css('height', minHeight);
        }

        closeOffersWrapper(trigger, false);
      }
    }

    ;

    function initMobile() {
      trigger.attr('data-offers-collapsed', false);
      trigger.hide();
      toggleWrappedOffers(offersWrapper, true);
      offersWrapper.attr('aria-label', openAriaCont).removeAttr('data-collapsed-height').removeAttr('data-opened-height').css('height', 'auto');
    }

    ;

    function openOffersWrapper(selector, collapsed) {
      var trigger = $(selector),
          container = $('#' + trigger.attr('data-offers-target')),
          triggerIcon = $(trigger).find('.ibe-offer-landings__trigger-icon'),
          triggerText = $(trigger).find('.sr-only');
      triggerIcon.removeClass('icon-flecha_1_abajo').addClass('icon-flecha_1_arriba');
      trigger.attr('data-offers-collapsed', !collapsed).attr('aria-label', openBtnTxt);
      triggerText.text(openBtnTxt);
      toggleWrappedOffers(container, true);
      container.attr('data-offers-collapsed', !collapsed).attr('aria-label', openAriaCont).css('height', maxHeight + 'px');
    }

    ;

    function closeOffersWrapper(selector, collapsed) {
      var trigger = $(selector),
          container = $('#' + trigger.attr('data-offers-target')),
          triggerIcon = $(trigger).find('.ibe-offer-landings__trigger-icon'),
          triggerText = $(trigger).find('.sr-only');
      triggerIcon.removeClass('icon-flecha_1_arriba').addClass('icon-flecha_1_abajo');
      trigger.attr('data-offers-collapsed', !collapsed).attr('aria-label', closedBtnTxt);
      triggerText.text(closedBtnTxt);
      toggleWrappedOffers(container, false);
      container.attr('data-offers-collapsed', !collapsed).attr('aria-label', closedAriaCont).css('height', minHeight + 'px');
    }

    ;

    function toggleWrappedOffers(container, visible) {
      var containerColumn = $(container).find('.ibe-offer-landings__offers-column');
      containerColumn.each(function (columIndex) {
        var columnItem = $(this).find('.ibe-offer-landings__offers-list-item');
        columnItem.each(function (itemIndex) {
          if (itemIndex >= numberItemsPerRow) {
            visible ? $(this).show() : $(this).hide();
          }
        });
      });
    }

    ;
    $(window).on('resize', function () {
      var isMobile = window.innerWidth < 768;

      if (isMobile) {
        initMobile();
      } else {
        initDesktop();
      }
    });
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_compact_search = function () {
  var init = function (selector) {
    var node = $(selector),
        position = node.position(),
        overlay = $('.ibe-overlay'),
        detector = $('.fc-searcher-detector');
    var searcherContainer = $('[data-compact-searcher=mobile],[data-compact-searcher="desktop"]'),
        openText = $('[data-accesible-container-open]').data('accesible-container-open'),
        closeText = $('[data-accesible-container-close]').data('accesible-container-close');
    var targetParent;
    searcherContainer.css({
      display: 'none'
    });

    if (!searcherContainer.hasClass('compactSearcherInited')) {
      node.on({
        'click': function () {
          if (node.hasClass('fc-searcherOpen')) {
            closeCompactSearcher();
          } else {
            openCompactSearcher();
          }
        }
      });

      var openCompactSearcher = function () {
        var isDesktop = window.innerWidth >= 1024;
        var visibleContainer = isDesktop ? searcherContainer.filter('[data-compact-searcher="desktop"]') : searcherContainer.filter('[data-compact-searcher="mobile"]');
        var hiddenContainer = !isDesktop ? searcherContainer.filter('[data-compact-searcher="desktop"]') : searcherContainer.filter('[data-compact-searcher="mobile"]');
        var widthAuto = $('.ibe-search-compact__searcher-container--desktop .fc-searcher-detector').width() + 'px';
        node.addClass('fc-searcherOpen');
        visibleContainer.attr('aria-hidden', false);
        hiddenContainer.attr('aria-hidden', false);
        visibleContainer.attr('aria-label', openText);
        hiddenContainer.attr('aria-label', openText);
        node.hide();
        visibleContainer.css({
          overflow: 'visible'
        }); // make visible the hidden container cause is under a hidden-lg

        hiddenContainer.css({
          overflow: 'visible'
        }); // visibleContainer.css({display:'block'}).removeClass('ibe-search-compact__searcher-container--close').addClass('ibe-search-compact__searcher-container--open').addClass('fc-searcherContainer')

        if (visibleContainer.data('compact-searcher') === 'desktop') {
          visibleContainer.css({
            display: 'block'
          }).removeClass('ibe-search-compact__searcher-container--close').addClass('ibe-search-compact__searcher-container--open').addClass('fc-searcherContainer');
          visibleContainer.css({
            width: '0',
            height: '0'
          }).animate({
            width: '100%',
            height: '170px'
          }, {
            duration: 500,
            easing: 'easeOutSine',
            done: function () {
              visibleContainer.css({
                height: 'auto'
              });
            }
          });
          visibleContainer.find('.ibe-searcher--accordion').css({
            opacity: 0,
            'max-width': widthAuto,
            'min-width': widthAuto
          }).animate({
            opacity: 1
          }, {
            duration: 500,
            easing: 'easeInSine',
            done: function () {
              visibleContainer.find('.ibe-searcher--accordion').css({
                opacity: '',
                'max-width': '',
                'min-width': ''
              });
            }
          });
          hiddenContainer.css({
            display: 'block'
          });
          hiddenContainer.removeClass('ibe-search-compact__searcher-container--close').addClass('ibe-search-compact__searcher-container--open').addClass('fc-searcherContainer');
        } else {
          hiddenContainer.css({
            display: 'block'
          });
          visibleContainer.removeClass('ibe-search-compact__searcher-container--close').addClass('ibe-search-compact__searcher-container--open').addClass('fc-searcherContainer'); // visibleContainer.css({width:'100%', height:'0'}).animate({height: 'auto'}, {duration: 500, easing: 'easeOutSine'});

          visibleContainer.css({
            width: '100%'
          }).slideDown(500, 'easeInSine');
          hiddenContainer.find('.ibe-searcher--accordion').css({
            opacity: '',
            'max-width': '',
            'min-width': ''
          });
          hiddenContainer.css({
            display: 'block'
          }).removeClass('ibe-search-compact__searcher-container--close').addClass('ibe-search-compact__searcher-container--open').addClass('fc-searcherContainer'); // visibleContainer.find('.ibe-searcher--accordion').css({opacity: 0}).animate({opacity: 1},{duration: 750, easing: 'easeInSine'});
        }
      };

      var closeCompactSearcher = function () {
        var afterClose = function () {
          node.show();
          visibleContainer.css({
            display: 'none',
            width: '',
            height: ''
          });
          visibleContainer.find('.ibe-searcher--accordion').css({
            'max-width': '',
            'min-width': ''
          });
        };

        var isDesktop = window.innerWidth >= 1024;
        var widthAuto = $('.ibe-search-compact__searcher-container--desktop .fc-searcher-detector').width() + 'px';
        var visibleContainer = isDesktop ? searcherContainer.filter('[data-compact-searcher="desktop"]') : searcherContainer.filter('[data-compact-searcher="mobile"]');
        var hiddenContainer = !isDesktop ? searcherContainer.filter('[data-compact-searcher="desktop"]') : searcherContainer.filter('[data-compact-searcher="mobile"]');
        node.removeClass('fc-searcherOpen');
        visibleContainer.attr('aria-hidden', true);
        visibleContainer.attr('aria-label', closeText);
        hiddenContainer.attr('aria-hidden', true);
        hiddenContainer.attr('aria-label', closeText);
        hiddenContainer.css({
          display: 'none'
        });
        visibleContainer.removeClass('ibe-search-compact__searcher-container--open').addClass('ibe-search-compact__searcher-container--close');
        hiddenContainer.removeClass('ibe-search-compact__searcher-container--open').addClass('ibe-search-compact__searcher-container--close');
        visibleContainer.css({
          overflow: 'hidden'
        });
        hiddenContainer.css({
          overflow: 'hidden'
        });
        overlay.hide();

        if (visibleContainer.data('compact-searcher') === 'desktop') {
          visibleContainer.find('.ibe-searcher--accordion').css({
            'max-width': widthAuto,
            'min-width': widthAuto
          });
          visibleContainer.animate({
            width: '0',
            height: '0'
          }, {
            duration: 500,
            easing: 'easeOutSine',
            done: afterClose
          });
          visibleContainer.find('.ibe-searcher--accordion').animate({
            opacity: 0
          }, {
            duration: 500,
            easing: 'easeOutSine'
          });
        } else {
          // visibleContainer.animate({height: '0'}, {duration: 500, easing: 'easeOutSine', done : afterClose});
          visibleContainer.slideUp(500, 'easeOutSine', function () {
            node.show();
          }); // visibleContainer.find('.ibe-searcher--accordion').animate({opacity: 0},{duration: 750, easing: 'easeOutSine'});
        }
      };

      $(document).on('click', function (event) {
        var clickedElement, clickedParent;
        clickedElement = event.target;
        clickedParent = clickedElement.closest('.fc-searcher-detector');

        if (clickedParent === null) {
          closeCompactSearcher();
        }

        searcherContainer.addClass('compactSearcherInited');
      });
      $(document).on('keydown', function (e) {
        // ESCAPE key pressed
        var isChildrenOpen = $('.ibe-tab__container [aria-expanded="true"]').length > 0 ? true : false;

        if (e.keyCode === 27 && $('.fc-searcherOpen').length > 0 && !isChildrenOpen) {
          closeCompactSearcher();
        }
      });
      $(document).on('keyup', function (e) {
        var eventTarget = e.target;
        targetParent = eventTarget.closest('[data-function="data-compact-searcher"]');

        if (e.keyCode === 9 && targetParent === null) {
          closeCompactSearcher();
        }
      });
      $(document.body).on('setOfferSeekerWCS', openCompactSearcher);
    }
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_datatable = function () {
  /*eslint no-underscore-dangle: ['error', { 'allow': ['_clickCity', '_selectCity'] }]*/

  /**
   * Map that relates the object the tab of the seeeker that should be updated 
   * with the cities that will aplly for the tab
   */
  var citiesAndTabsMap = {}; //dFrontJs.ibe_datatable.loadJson(jsonOrigin,jsonDestiny);

  var loadJson = function (jsonOrigin, jsonDestiny, tabSelector) {
    var $click = $('[data-table-click]'),
        $change = $('[data-selectmenu-city]');
    var cities = {
      jsonOrigin: jsonOrigin,
      jsonDestiny: jsonDestiny
    };

    if (typeof tabSelector === 'string') {
      citiesAndTabsMap[tabSelector] = cities;

      if ($click.length > 0) {
        $click.off('click', _clickCity);
        $click.on('click', _clickCity);
        $change.off('change', _selectCity);
        $change.on('change', _selectCity);
      }
    }
  };
  /**
   * @name _updateCityInput
   * @description update destination or departure input of a given seeker tab
   * @param {string} type type of input to be updates (destiny/origin)
   * @param {string} value value that it's wanted the input to take
   * @param {string} tabParent selector string of seeker tab which contains the input to update
   */


  var _updateCityInput = function (type, value, tabParent) {
    var i, item, $this, text, iata, $des, $ori, maininput, json, countryCode;
    var cities;

    if (typeof tabParent === 'string') {
      cities = citiesAndTabsMap[tabParent];

      if (cities) {
        $ori = $('.ibe-searcher__col--ori input', tabParent);
        $des = $('.ibe-searcher__col--des input', tabParent);

        if (type === 'destiny') {
          json = cities.jsonDestiny;
          dFrontJs.ibe_searcher_choose_city.init($des, json);
        } else {
          json = cities.jsonOrigin;
          dFrontJs.ibe_searcher_choose_city.init($ori, json);
        }

        i = 0;
        item = undefined;

        while (i < json.length && item === undefined) {
          item = json[i].cities.find(function (item) {
            return item.code === value;
          });
          i++;
        }

        if (item !== undefined) {
          $this = item; //enlace

          text = $this.description; //ciudad

          iata = $this.code;
          countryCode = $this.country.code; //code pais
        } else {
          text = ''; //ciudad

          iata = '';
          countryCode = '';
        }

        if (iata === value || iata.length === 0) {
          if (type === 'destiny') {
            if (iata.length !== 0) {
              $des.val(text + ' (' + iata + ')');
              $des.closest('.ibe_form__group').addClass('ibe_form__group--content');
            } else {
              $des.val('');
              $des.closest('.ibe_form__group').removeClass('ibe_form__group--content');
            }

            maininput = $des;
          } else {
            if (iata.length !== 0) {
              $ori.val(text + ' (' + iata + ')');
              $ori.closest('.ibe_form__group').addClass('ibe_form__group--content');
            } else {
              $ori.val('');
              $ori.closest('.ibe_form__group').removeClass('ibe_form__group--content');
            }

            maininput = $ori;
          }

          dFrontJs.ibe_validate.compareCity(maininput, $ori, $des); // dataDestination =  countryCode+'|'+iata+'|'+text;
          //ES|BIO|Bilbao
        }
      }
    }
  };
  /**
   * @description Logic that handles the event click on a city card of mosaic or table
   * @param {*} e JQuery event 
   */


  var _clickCity = function (e) {
    var $attrIata = $(this).data('city');
    var $tableOriginDestiny = $(this).parents('[data-type-trip]').data('table-destination'); // Tipo de ciudad del selector del mosaico

    var selectorType = $tableOriginDestiny === 'destiny' ? 'origin' : 'destiny'; // Solo se obtiene resultados si el selector si la ciudad está en el selector o en la tabla
    // ofdt city attr it's used on the selector to filter the displayed results

    var selectorValue = $(this).closest('[data-ofdtcity]').data('ofdtcity');
    e.preventDefault();
    Object.keys(citiesAndTabsMap).forEach(function (tab) {
      var vintageHeader = $(tab).prev('.ibe-accordion__header:visible'); //Takes value only if this tab it's selected on vintage view (responsive)

      if ($(tab).is(":visible") || vintageHeader.length > 0) {
        requestAnimFrame(function () {
          vintageHeader.click();
          $('html, body').animate({
            scrollTop: 0
          }, 600, function () {
            $(tab + ':visible [data-cal="start"]').focus();
          });
        });
      }

      _updateCityInput($tableOriginDestiny, $attrIata, tab); // Borrar si no se quiere actualizar la ciudad en base al valor del selector del mosaico


      if (selectorValue) {
        _updateCityInput(selectorType, selectorValue, tab);
      }
    });
  };
  /**
   * @description Logic that handles the event change 
   * @param {*} e JQuery event 
   */


  var _selectCity = function (e) {
    var $attrIata = $(this).find(':selected').data('city-select');
    var $selectOriginDestiny = $(this).data('selectmenu-city');
    var type = $selectOriginDestiny === 'des' ? 'destiny' : 'origin';
    e.preventDefault();
    Object.keys(citiesAndTabsMap).forEach(function (tab) {
      _updateCityInput(type, $attrIata, tab);
    });
  };

  var init = function () {
    var $element = $('[data-datatable]'),
        $order = $('[data-table-order]'),
        $customOrder = $('[data-table-flight-status-order]'),
        $click = $('[data-table-click]'),
        $change = $('[data-selectmenu-city]'),
        $ascending = $('[data-text-ascending]'),
        $descending = $('[data-text-descending]'),
        data,
        numbers_length,
        this$,
        ascendingText,
        descendingText;

    if ($element.length > 0) {
      data = $element.data('datatable');
      numbers_length = data.numbers_length ? data.numbers_length : 6;
      $.fn.DataTable.ext.pager.numbers_length = numbers_length;
      $element.DataTable({
        'searching': false,
        'ordering': false,
        'info': false,
        'bLengthChange': false,
        'iDisplayLength': 6,
        'pageLength': 6,
        'oLanguage': {
          'oPaginate': {
            'sNext': '<span class="hideAccessible">Siguiente</span>',
            'sPrevious': '<span class="hideAccessible">Anterior</span>'
          }
        }
      });
    } else if ($customOrder.length > 0) {
      $customOrder.each(function () {
        this$ = $(this);
        ascendingText = this$.data('text-ascending');
        descendingText = this$.data('text-descending');

        if (!this$.hasClass('dataTable')) {
          this$.DataTable({
            'searching': false,
            'paging': false,
            'info': false,
            'order': [[3, 'asc']],
            'language': {
              'aria': {
                'sortAscending': ascendingText,
                'sortDescending': descendingText
              }
            }
          });
        }
      });
    } else if ($order.length > 0) {
      ascendingText = $ascending.data('text-ascending');
      descendingText = $descending.data('text-descending');
      $order.DataTable({
        'searching': false,
        'paging': false,
        'info': false,
        'order': [[1, 'asc']],
        'language': {
          'aria': {
            'sortAscending': ascendingText,
            'sortDescending': descendingText
          }
        }
      });
    }

    if ($click.length > 0 && Object.keys(citiesAndTabsMap).length > 0) {
      $click.off('click', _clickCity);
      $click.on('click', _clickCity);
      $change.off('change', _selectCity);
      $change.on('change', _selectCity);
    }
  };

  return {
    'init': init,
    'loadJson': loadJson
  };
}(jQuery);
"use strict";

dFrontJs.ibe_dateFormat = function () {
  //date format function
  var init = function () {
    if ($('[data-date-large]').length) {
      $('[data-date-large]').each(function () {
        var $this = $(this),
            dateFormatShort = $this.data('date-short'),
            dateFormatLarge = $this.data('date-large');

        if (window.innerWidth < dFrontJs.resolutions.md && $this.text() !== dateFormatShort) {
          $this.text(dateFormatShort);
        } else if (window.innerWidth >= dFrontJs.resolutions.md && $this.text() !== dateFormatLarge) {
          $this.text(dateFormatLarge);
        }
      });
    }
  }; //date format function


  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_datepicker = function () {
  var init = function ($selector, params) {
    var $datepicker = $selector ? $selector.find('[data-datepicker]') : $('[data-datepicker]');
    $datepicker.each(function () {
      var label = $(this).find('label');
      var input = $(this).find('input');
      var inputId = $(this).find('input').attr('id');
      var paramsCurrent = $.extend({}, params);
      paramsCurrent.formElements = {};
      paramsCurrent.formElements[inputId] = '%d/%m/%Y';
      paramsCurrent.noTodayButton = 'false';
      datePickerController.createDatePicker(paramsCurrent); //datePickerController.setDisabledDates(inputId, disabledDates);

      $(this).find('.date-picker-control').on('click', function () {
        var id;
        datePickerController.show(inputId);
        id = 'fd-' + inputId;

        if ($('#' + id).parents('[data-datepicker]').length === 0) {
          $('#' + id).appendTo($(this).parents('[data-datepicker]'));
        }

        label.addClass('xui-label--up');
        input.focus();
      });
      $(this).find('input').focus(function (e) {
        var id;
        datePickerController.show(inputId);
        id = 'fd-' + inputId;

        if ($('#' + id).parents('[data-datepicker]').length === 0) {
          $('#' + id).appendTo($(this).parents('[data-datepicker]'));
        }
      });
      $(this).find('input').focusout(function () {
        datePickerController.hide(inputId);
      });
    });
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_device_apps = function () {
  //Detect operation system in a device
  var init = function () {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera,
        page = $('.ibe-box-landing--skewed'),
        device = $('[data-device]'),
        ios = $('[data-skewed="ios"]'),
        android = $('[data-skewed="android"]');

    if (page.length > 0) {
      // iOS detection
      if (!page.hasClass('responsive')) {
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
          ios.css('display', 'inline-block');
          ios.css('margin-right', '0');
        } else if (/android/i.test(userAgent)) {
          android.css('display', 'inline-block');
        } else {
          ios.css('display', 'inline-block');
          android.css('display', 'inline-block');
        }

        page.addClass('responsive');
      }

      $(window).on('resize', function (e) {
        if (!page.hasClass('responsive')) {
          if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            ios.css('display', 'inline-block');
            ios.css('margin-right', '0');
          } else if (/android/i.test(userAgent)) {
            android.css('display', 'inline-block');
          } else {
            ios.css('display', 'inline-block');
          }

          page.addClass('responsive');
        }
      });
    } // HIDE COMPONENT ON QR SECTION FOR MD RESOLUTION & IOS/ANDROID DEVICE


    if (device.length > 0) {
      if (/iPad|iPhone|iPod|android/i.test(userAgent) && !window.MSStream) {
        device.css('display', 'none');
      } else {
        device.css('display', 'block');
      }

      $(window).on('resize', function (e) {
        if (/iPad|iPhone|iPod|android/i.test(userAgent) && !window.MSStream) {
          device.css('display', 'none');
        } else {
          device.css('display', 'block');
        }
      });
    }
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_document = function () {
  var init = function () {
    var $headernew = $('.ibe-header-new');
    var $dudes = $('[data-dudes]');
    var $logged = $('.ibe-header-new__logged-link');
    var containerLogged = $logged.data('target');
    $(document).on('click', function (event) {
      // START ibe-header-new.js
      //Conditions - only close if click an element outside the header
      if ($(event.target).parents('.ibe-header-new').length === 0 && !$(event.target).hasClass('ibe-header-new')) {
        if ($dudes.hasClass('open') && $('.ibe-header-new__dudes .ibe_form').is(':visible') && !$(event.target).hasClass('ibe-header-new__dudes-input') && $(event.target).attr('data-dudes') !== 'dudes' && $(event.target).parents('.ibe-header-new__dudes').length === 0) {
          $dudes.removeClass('open');
          $('.ibe-header-new__dudes .ibe_form').animate({
            width: 'toggle'
          }, 600, function () {
            $dudes.parent().animate({
              width: 'toggle'
            }, 400);
          });
        }
      }

      if (window.innerWidth < dFrontJs.resolutions.lg && $(containerLogged).is(':visible') && !$(event.target).hasClass('ibe-login') && $(event.target).parents('.ibe-login').length === 0) {
        $logged.removeClass('active');
        $(containerLogged).collapse('hide');
        $('.ibe-menu-new__overlay').hide();
        $('html, body').css({
          'overflow': ''
        });
      } // END ibe-header-new.js
      // // START ibe-modal.js
      // dFrontJs.ibe_modal.closeModal($('.ibe-dialog:visible'));
      // // END ibe-modal.js

    });
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_escape = function () {
  //init
  var init = function (element, parent) {
    var $element = $(element);
    $element.each(function () {
      $(this).on('keydown', function (e) {
        var $vintage;
        e.stopPropagation();

        if (e.keyCode === 27) {
          $(this).closest(parent).find('.collapse.in').collapse('hide');
          $vintage = $('.ibe-searcher__vintage'), $modal = $('.ibe-dinamic-modal'); // close the modal in vintage mobile version

          if ($vintage.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
            dFrontJs.ibe_modals_vintage.closeModalDatepicker();
          } else if ($modal.length > 0) {
            dFrontJs.ibe_dinamic_modal.close($modal.children());
          }
        }
      });
    });
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_filter = function () {
  // show = '[data-show-more]';
  // $show = $(show);
  // container = $show.data('show-more');
  // actives = $show.data('show-more-init');
  // number = $show.data('show-more-number');
  // total = actives;
  var checkInputs = function (inputCheck) {
    var bool = false;
    inputCheck.parents('[data-filter="menu"]').find('input[type="checkbox"]').each(function () {
      if ($(this).prop('checked')) {
        bool = true;
      }
    });

    if (!bool) {
      $('[data-filter-option="all"]').prop('checked', true);
      $('[data-filter-option="all"]').prop('disabled', true);
      $('[data-filter-item]').css('display', 'block');
    }
  };

  var init = function (selector) {
    changeItems();
    $(document).on('change', '[data-filter="menu"] input[type="checkbox"]', function (ev) {
      var $this = $(this),
          checkValue = $this.val();

      if ($('[data-filter="menu"]').find('[data-filter-option="all"]').prop('checked')) {
        ev.preventDefault();
        $('[data-filter-option="all"]').prop('disabled', true);
      } else {
        ev.preventDefault();
        $('[data-filter-option="all"]').prop('disabled', false);
      }

      if (checkValue !== 'all') {
        $('[data-filter-option="all"]').prop('checked', false);
        $('[data-filter-item]').css('display', 'none');
        $('[data-filter-option="all"]').prop('disabled', false);
        $this.parents('[data-filter="menu"]').find('input[type="checkbox"]').each(function () {
          if ($(this).prop('checked')) {
            $('[data-filter-item="' + $(this).val() + '"]').css('display', 'block');
          }
        });
        checkInputs($this);
      } else {
        $('[data-filter-item]').css('display', 'block');
        $('[data-filter="menu"] input[type="checkbox"]').not($this).prop('checked', false);
      }

      changeItems();
      dFrontJs.app.calculateHeightComponentsCard('.ibe-card-link--auto-height', '.ibe-card-link__info');
      dFrontJs.app.emitInView();
    });

    function changeItems() {
      var arr = [];
      var template, $template, $row, numItems, $itemsToShow, x, column;
      var inputsCheck = [];
      var isGrid = $('[data-content="principal-content"]').data('layout') === 'grid';
      $('[data-content="principal-content"]').empty();
      template = $('[data-filter="container"]').html();
      $template = $(template);
      $row;
      $('[data-filter="menu"]').find('input[type="checkbox"]').each(function () {
        if ($(this).prop('checked')) {
          inputsCheck.push($(this).val());
        }
      });
      numItems = 0;
      $itemsToShow = [];

      if ($('[data-filter="menu"]').find('[data-filter-option="all"]').prop('checked')) {
        $template.each(function () {
          var $this = $(this),
              dataFilter = $this.data('filter-item');
          $('[data-content="principal-content"]').empty();

          if ($this.hasClass('ibe-flights-plus-hotel__box')) {
            numItems++;
            $itemsToShow.push($this);
          }

          for (x = 0; x < $itemsToShow.length; x++) {
            if (x === 0) {
              column = $('<div class="col-lg-12 col-sm-12"></div>');
              column.append($itemsToShow[x]);
              $('[data-content="principal-content"]').append(column);
              $($itemsToShow[x]).find('.ibe-card-link').attr('class', 'ibe-card-link ibe-card-link--xl');
              $($itemsToShow[x]).find('.ibe-card-link').find('.ibe-card-link__info').css('height', '');
            } else {
              column = $('<div class="col-md-4 col-xs-12"></div>');
              column.append($itemsToShow[x]);
              $('[data-content="principal-content"]').append(column);
            }
          }
        });
      } else {
        $template.each(function () {
          var $this = $(this),
              dataFilter = $this.data('filter-item');

          if ($this.hasClass('ibe-flights-plus-hotel__box')) {
            if (inputsCheck.indexOf(dataFilter) !== -1) {
              numItems++;
              $itemsToShow.push($this);
            }
          }
        });

        for (x = 0; x < $itemsToShow.length; x++) {
          if (x === 0 && !isGrid) {
            column = $('<div class="col-lg-12 col-sm-12"></div>');
            column.append($itemsToShow[x]);
            $('[data-content="principal-content"]').append(column);
            $($itemsToShow[x]).find('.ibe-card-link').attr('class', 'ibe-card-link ibe-card-link--xl');
            $($itemsToShow[x]).find('.ibe-card-link').find('.ibe-card-link__info').css('height', '');
          } else {
            column = $('<div class="col-md-4 col-xs-12"></div>');
            column.append($itemsToShow[x]);
            $('[data-content="principal-content"]').append(column);
          }
        }
      }
    }
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_focusin = function () {
  var focusHandler = function (e, isClick, elem) {
    var $elem = $(elem);

    if (isClick) {
      if ($elem.hasClass('focus')) {
        // console.log(e,isClick, $elem)
        $elem.removeClass('focus');
      }
    } else {
      if (!$elem.hasClass('focus')) {
        // console.log(e,isClick, $elem)
        $elem.addClass('focus');
      }
    }
  }; //init


  var init = function () {
    var $element = $('[data-focusin]');
    $element.each(function () {
      var $this = $(this); // Keydown and Mousedown Events

      $this.mousedown(function (e) {
        focusHandler(e, true, e.target);
      });
      $this.keyup(function (e) {
        focusHandler(e, false, e.target);
      });
      $this.focusout(function (e) {
        focusHandler(e, true, e.target);
      });
    });
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_form_calendar = function () {
  const {
    host,
    hostname,
    href,
    origin,
    pathname,
    port,
    protocol,
    search
  } = window.location;
  host; // "ui.dev"

  hostname; // "ui"

  href; // "https://ui.dev/get-current-url-javascript/?comments=false"

  origin; // "https://ui.dev"

  pathname; // "/get-current-url-javascript/""

  port; // ""

  protocol; // "https:"

  search; // "?comments=false"

  console.log(dFrontJs);
  /*eslint no-underscore-dangle: ['error', { 'allow': ['_inputsKeyup', '_buttonCalendarTouchFocusClick', '_calStartFocus', '_roundtripFunction', '_oneWayFunction',
         '_disableCollapse', '_preventClicks', '_inputsBlur','_focusoutFunction', '_changefromFunction', '_changeEndFunction', '_defaults','_updateDatepicker','_get',
         '_mouseoverTDtoFunction', '_mouseoverTDtoFunction', '_touchStartFunction', '_mouseoverTDfromFunction', '_disableRound'] }]*/

  var dateParser = function (date, format) {
    var dateParts = date.split('/');

    if (format === 'DD/MM/YYYY') {
      return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    }

    return new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
  };

  var preventClicks = function () {
    $('[data-event="click"]').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      focusArrow = true;
      setTimeout(function () {
        focusArrow = false;
      }, 350);
    });
  };

  var initFormCalendar = function (calendar) {
    var $calForm = $('[data-function="cal-form"]'),
        $calInput = $('[data-cal="claim"]');
    var language, format, firstday, datepicker__updateDatepicker, onAfterUpdate, showMonth, totalDate, newTotalDate, dataHour, fechaInicio, fechaFin, diff, newDiff;

    if ($calForm.length) {
      //Language
      language = $calForm.attr('data-language') ? $calForm.attr('data-language') : 'en';
      $.datepicker.setDefaults($.datepicker.regional[language]); //the language is applied in integration WCS
      //Format

      format = $calForm.attr('data-format') ? $calForm.attr('data-format') : $.datepicker.regional[language].dateFormat; //Firstday

      firstday = $calForm.attr('data-firstday') ? $calForm.attr('data-firstday') : $.datepicker.regional[language].firstDay;

      Date.prototype.yyyymmdd = function (sep) {
        var mm = this.getMonth() + 1;
        var dd = this.getDate();
        return {
          'mm': mm,
          'dateFormat': [this.getFullYear(), mm, dd].join(sep),
          'yyyy': this.getFullYear(),
          'dd': dd
        };
      };

      $.datepicker._defaults.onAfterUpdate = null;
      datepicker__updateDatepicker = $.datepicker._updateDatepicker;

      $.datepicker._updateDatepicker = function (inst) {
        datepicker__updateDatepicker.call(this, inst);
        onAfterUpdate = this._get(inst, 'onAfterUpdate');
        if (onAfterUpdate) onAfterUpdate.apply(inst.input ? inst.input[0] : null, [inst.input ? inst.input.val() : '', inst]);
      };

      showMonth = 1;
      calendar.datepicker({
        dateFormat: format,
        numberOfMonths: showMonth,
        onAfterUpdate: function () {
          var thisObj = $(this),
              thisParent = thisObj.closest('.ibe_form__group'),
              thisInput = thisParent.find('[data-cal="claim"]');
          $('a.ui-corner-all').removeAttr('href');
          preventClicks(); //To avoid close de datepicker

          if (thisInput.val() === "") {
            thisObj.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');
          }
        }
      }).on('change', function () {
        var thisObj = $(this),
            thisValue = thisObj.val(),
            thisCal = thisObj.closest('.ibe-searcher__calendar'),
            thisParent = thisCal.closest('.ibe_form__group'),
            thisInput = thisParent.find('[data-cal="claim"]');
        thisInput.val(thisValue);
        thisParent.addClass('ibe_form__group--content');

        if (thisParent.find('ibe_form__group--error')) {
          thisInput.blur(); //For borrow the error
        }

        thisCal.collapse('hide');
      });
      $calInput.on('focus click', function (e) {
        var $this = $(this);

        if ($this.val() !== "") {
          $this.select();
        }
      });
      $calInput.keyup(function (e) {
        var $cal = $(this).closest('.ibe_form__group').find('[data-function="cal-form"]');

        if (e.target.value.length === 10) {
          $cal.datepicker('setDate', e.target.value); //To select input-day

          if (e.key !== 'ArrowRight' && e.key !== 'ArrowDown' && e.key !== 'ArrowLeft' && e.key !== 'ArrowUp') {
            $(this).blur();
            $cal.closest('.ibe-searcher__calendar').collapse('hide');
          }

          if (e.key === 'Tab') {
            $(this).focus();
          }
        }

        if (e.target.value.length < 10 && e.key !== 46 && e.key !== 46 && e.key !== 9 && e.key !== 229 && e.key !== 37 && e.key !== 39) {
          $cal.datepicker('setDate', null);
        }
      }); // Function for days restrictions

      $('[data-validator-range]').each(function () {
        var rangeMin = $(this).data('range-min'),
            rangeMax = $(this).data('range-max');
        rangeMin = '-' + rangeMin + 'd';
        rangeMax = '+' + rangeMax + 'd'; //console.log('entra en mi funcion', $(this), rangeMin, rangeMax)

        $('[data-function="cal-form"]').datepicker('option', 'maxDate', rangeMax);
        $('[data-function="cal-form"]').datepicker('option', 'minDate', rangeMin);
      }); //Function restrictionDays dataHourRestriction

      if ($calForm.parent().find('[data-hour-restriction]').length > 0) {
        totalDate = new Date();
        $this = $calForm.parent().find('[data-hour-restriction]');
        newTotalDate = new Date();
        dataHour = parseInt($this.attr('data-hour-restriction'));
        newTotalDate.setMilliseconds(dataHour * 60 * 60 * 1000); //Horas por segundos/hora

        newTotalDate.setHours(0);
        newTotalDate.setMinutes(0);
        newTotalDate.setSeconds(0);
        fechaInicio = totalDate.getTime();
        fechaFin = newTotalDate.getTime();
        diff = fechaFin - fechaInicio;
        newDiff = Math.ceil(diff / (1000 * 60 * 60 * 24));
        $this.datepicker('option', 'minDate', newDiff);
      }
    }
  };

  var init = function () {
    var $calInput = $('[data-cal="claim"]');
    var $buttonInput = $calInput.siblings('button');
    requestAnimFrame(function () {
      $($calInput).on('focus click', function (e) {
        var $this = $(this);

        if (!$this.parents('.ibe_form__group').hasClass('fc-initCalendar')) {
          initFormCalendar($this.parents('.ibe_form__group').find('[data-function="cal-form"]'));
          $this.parents('.ibe_form__group').addClass('fc-initCalendar');
        }
      });
      $($buttonInput).on('focus click', function (e) {
        var $this = $(this);

        if (!$this.parents('.ibe_form__group').hasClass('fc-initCalendar')) {
          initFormCalendar($this.parents('.ibe_form__group').find('[data-function="cal-form"]'));
          $this.parents('.ibe_form__group').addClass('fc-initCalendar');
        }
      });
    });
  }; //*******************************************************************************************
  //***  Función para que puedan actualizar el calendario dada una fecha  ***
  //*******************************************************************************************


  var updateFormCalendar = function (selector, start) {
    var $elemento = $(selector);
    $elemento.each(function () {
      var $this = $(this),
          ida = $this.find('[data-cal="claim"]'),
          //input de ida
      cal_ida = $this.find('[data-function="cal-form"]'),
          //calendario ida
      $journey = $('[data-journey="journey"]').length;

      if (!$this.find('.ibe-datepicker-general').hasClass('fc-initCalendar')) {
        initFormCalendar(cal_ida);
        $this.find('.ibe-datepicker-general').addClass('fc-initCalendar');
      }

      if (start !== undefined) {
        //No entro a la función si no tengo fecha de ida
        ida.val(start); //Actualizo el input+ con la fecha dada

        ida.parents('.fc_form_group').addClass('ibe_form__group--content');
        cal_ida.datepicker('setDate', start); //Selecciono la fecha en el calendario

        cal_ida.data('datesRange', [cal_ida.datepicker('getDate'), null]); //cal_vuelta.data('datesRange', [cal_ida.datepicker('getDate'), null]);

        cal_ida.datepicker('refresh'); //cal_vuelta.datepicker('refresh');

        if ($journey) {
          dFrontJs.ibe_journey.controlDates(ida);
        }
      }
    });
  };

  return {
    'init': init,
    'updateFormCalendar': updateFormCalendar
  };
}(jQuery);
"use strict";

dFrontJs.ibe_gallery = function () {
  var init = function (element) {
    var $gallery = $(element);
    var itemCurrent = 0;

    var showItem = function () {
      $(this.$items[this.currentIndex]).find('a').attr('aria-expanded', true);
      $(this.$items[this.currentIndex]).find('a').attr('aria-label', 'Para cerrar pulse Escape');
      itemCurrent = this.currentIndex;
    };

    var hideItem = function () {
      $(this.$items[itemCurrent]).find('a').attr('aria-expanded', false);
      $(this.$items[itemCurrent]).find('a').attr('aria-label', ' ');
      itemCurrent = 0;
    };

    var itemChange = function (i) {
      $(this.$items[itemCurrent]).find('a').attr('aria-expanded', false);
      $(this.$items[itemCurrent]).find('a').attr('aria-label', ' ');
      $(this.$items[i]).find('a').attr('aria-label', 'Para cerrar pulse Escape');
      $(this.$items[i]).find('a').attr('aria-expanded', true);
      itemCurrent = i;
    };

    $gallery.each(function (index) {
      $(this).GITheWall({
        scrollOffset: 300,
        animationSpeed: 300,
        arrows: false,
        responsive: true,
        closeButtonClass: 'ibe-paper-sheet__options-close',
        onContentLoading: function () {
          this.$expanderInner.addClass('hidden');
        },
        onContentLoaded: function () {
          var elem = this;
          this.$expanderInner.removeClass('hidden');
          dFrontJs.app.emitInView();
          setTimeout(function () {
            elem.resizeHeight($($gallery[index]).find('.ibe-paper-sheet').outerHeight());
          }, 100);
        },
        onShow: showItem,
        onHide: hideItem,
        onItemChange: itemChange
      });
      $(this).find('a').attr({
        'aria-expanded': 'false'
      });
    });
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

/**
 * Mapa google maps
 * @constructor
 * @author emalpica
 * @description Inyecta ubicaciones a traves de un array de objetos dentro de un
 * @param {string}  (idFrameMap, dataMarket, locate, zoom);
 * @param {string} [mapId="idFrameMap"] - Id de frame/div donde se inyecta el mapa
 * @param {string} size - Tamaño del mapa: small - medium - big
 * @param {array} [{
 * 	titulo: Titulo del marker,
 *  content: contenido html,
 *  lat: latitud,
 *  long: longitud,
 *  locate: diferenciador de marker,
 *  icon: color de icono del marker
 * }]
 * @returns {function} dFrontJs.ibe_google_map.init()
 * @example dFrontJs.ibe_google_map.init()
 */
dFrontJs.ibe_google_map = function () {
  var infowindow;
  var map;
  var divMap;
  var markers = {};
  var size;
  var position;
  var data;

  var init = function (mapId, dataMap, zoom, positionMap, sizes) {
    data = dataMap;
    divMap = document.getElementById(mapId);
    size = sizes;
    position = positionMap;

    _resizeMap(size, divMap); // paint params in google maps.


    var origin = new google.maps.LatLng(position.lat, position.long);
    var mapOptions = {
      zoom: zoom ? zoom : 12,
      center: origin
    }; // Inyect map in the DOM element (for id).

    map = new google.maps.Map(document.getElementById(mapId), mapOptions);
    infowindow = new google.maps.InfoWindow(); // Insert the makers.

    markerFunc(map, data, markers, infowindow); //add activity map
    // window.deleteActivityMap = function (id) {
    // 	// console.log("deleteActivityMap");
    // 	deleteActivity(id);
    // };
    // window.addActivityMap = function (id) {
    // 	// console.log("addActivityMap");
    // 	addActivity(id);
    // };
  };

  var _resizeMap = function (sizeMap, divMap) {
    if (sizeMap == "small") {
      divMap.classList.add("ibe-google-map--responsive-height");
      divMap.classList.add("ibe-google-map--small");
    }

    if (sizeMap == "medium") {
      divMap.classList.add("ibe-google-map--medium");
    }

    if (sizeMap == "big") {
      divMap.classList.add("ibe-google-map--big");
    }
  };

  var _constructorContent = function (dataMap, i) {
    data = dataMap;
    var content = data && data[i].content ? data[i].content : function () {//catch id item and cloneDOM
    };
    return content;
  };

  var markerFunc = function (map, dataMap, markers) {
    data = dataMap;
    var base_url = window.location.origin;

    for (i = 0; i < data.length; i++) {
      var position = new google.maps.LatLng(data[i].lat, data[i].long);
      var marker = new google.maps.Marker({
        title: data[i].title,
        position: position,
        map: map,
        icon: {
          url: base_url + "/wcs/imagenes/maps/pin-" + data[i].icon + ".png",
          labelOrigin: new google.maps.Point(15, 10)
        },
        optimized: true,
        // zIndex : 01245,
        // label: {
        // 	text: 'sersaf',
        // 	className: 'marker-label',
        // },
        id: data[i].id,
        clickable: true
      });
      google.maps.event.addListener(marker, "click", function (event, i) {
        map.panTo(event.getPosition());
        return function () {
          infowindow.setContent(_constructorContent(data, i));
          infowindow.setOptions({
            maxWidth: 232
          });
          infowindow.open(map, event);

          if (data[i].modal && data[i].modal !== "") {
            rebuildModal();
          }
        };
      }(marker, i));
      markers[data[i].locate] = marker;
    }

    if (size == "small") {
      google.maps.event.addListener(map, "bounds_changed", onBoundsChanged);
    }
  };

  function onBoundsChanged(map, divMap) {
    if (map.getDiv().firstChild.clientHeight === window.innerHeight && map.getDiv().firstChild.clientWidth === window.innerWidth) {
      if (divMap.classList.contains("ibe-google-map--responsive-height")) {
        divMap.classList.remove("ibe-google-map--responsive-height");
      }
    } else {
      if (!divMap.classList.contains("ibe-google-map--responsive-height")) {
        divMap.classList.add("ibe-google-map--responsive-height");
      }
    }
  } // Sets the map on all markers in the array.


  function setMapOnAll(map) {
    var i;
    markers = [];

    for (i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  var update = function (mapId, dataMap, zoom, positionMap, sizeMap) {
    data = dataMap;

    if (positionMap && positionMap != "") {
      position = positionMap;
    }

    var origin = new google.maps.LatLng(position.lat, position.long);

    if (sizeMap && sizeMap != "") {
      size = sizeMap;
    }

    divMap = document.getElementById(mapId);

    _resizeMap(size, divMap);

    var mapOptions = {
      zoom: zoom ? zoom : 12,
      center: origin
    };
    map = new google.maps.Map(divMap, mapOptions);
    setMapOnAll(null);
    markerFunc(map, data, markers);
  };

  function rebuildModal() {
    // reinit the modal function.
    dFrontJs.ibe_modal.init();
  }

  var changeDataMaker = function (idMap, dataMap, zoom, positionMap, sizeMap, idItem, action, updateVar) {
    var updateList = [];
    var dataUpdateList = [];
    var e;
    var parser = new DOMParser();

    for (e = 0; e < dataMap.length; e++) {
      if (dataMap[e].id == idItem) {
        var doc = parser.parseFromString(dataMap[e].content, "text/html");
        var tempContent = $(doc.body)[0];

        if (action == "delete") {
          // console.log('tempContent',tempContent.querySelector(".ibe-card-guides__link-delete"));
          tempContent.querySelector(".ibe-card-guides__link-delete").classList.add("hidden");

          if (tempContent.querySelector(".ibe-card-guides__link-add, hidden") != null) {
            tempContent.querySelector(".ibe-card-guides__link-add").removeAttribute("hidden");
          }

          if (tempContent.querySelector(".ibe-card-guides__link-add.hidden") != null) {
            tempContent.querySelector(".ibe-card-guides__link-add").classList.remove("hidden");
          }
        }

        if (action == "add") {
          // console.log('tempContent',tempContent.querySelector(".ibe-card-guides__link-add"));
          tempContent.querySelector(".ibe-card-guides__link-add").classList.add("hidden");

          if (tempContent.querySelector(".ibe-card-guides__link-delete , hidden") != null) {
            tempContent.querySelector(".ibe-card-guides__link-delete").removeAttribute("hidden");
          }

          if (tempContent.querySelector(".ibe-card-guides__link-delete.hidden") != null) {
            tempContent.querySelector(".ibe-card-guides__link-delete").classList.remove("hidden");
          }
        }

        var newContent = tempContent.querySelector("[data-card-guides]");
        dataMap[e].content = newContent.outerHTML;
      }

      updateList.push(dataMap[e]);
    }

    markers = [];
    dataUpdateList = updateList;

    if (updateVar) {
      update(idMap, updateList, zoom, positionMap, sizeMap);
    }

    return dataUpdateList;
  };

  return {
    init: init,
    markerFunc: markerFunc,
    update: update,
    changeDataMaker: changeDataMaker
  };
}(jQuery);
"use strict";

//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: guide
//    Descripcion: Funciones para el componente mis guias
//******************************************************************************/
dFrontJs.ibe_guide = function () {
  //init
  var init = function () {
    //Mostrar modal de mis guias
    $(document).on('click', '[data-guide="open-modal"]', function () {
      var $this = $(this),
          $modal = $('[data-guide="modal"]'),
          $box = $('[data-guide="modal-box"]');
      $this.parent().addClass('xui-active');
      $this.attr('aria-expanded', true);
      $('body').addClass('modal-open');
      $modal.fadeIn('show');
      $modal.attr('aria-expanded', true);
      $box.animate({
        right: '0'
      }, 'slow'); //Igualar altura de elementos (card-guide)

      if ($modal.find('[data-card-guides^="group-"]').length) {
        $modal.find('[data-card-guides^="group-"]').each(function (index) {
          var $this = $(this),
              type = $this.data('type');

          if ($modal.find('[data-card-guides="group-' + index + '"]').length) {
            switch (type) {
              case 'header':
                dFrontJs.app.calculateHeightComponents('[data-card-guides="group-' + index + '"]', '.ibe-card-guides__header');
                break;

              case 'body':
                dFrontJs.app.calculateHeightComponents('[data-card-guides="group-' + index + '"]', '.ibe-card-guides__body');
                break;

              case 'info':
                dFrontJs.app.calculateHeightComponents('[data-card-guides="group-' + index + '"]', '.ibe-card-guides__info');
                break;
            }
          }
        });
      } //Cerrar modal de mis guias

    }).on('click', '[data-guide="close-modal"]', function () {
      var $this = $(this),
          $modal = $('[data-guide="modal"]'),
          $box = $('[data-guide="modal-box"]'),
          $button_open = $('[data-guide="open-modal"]');
      $button_open.attr('aria-expanded', false);
      $modal.attr('aria-expanded', false);
      $box.animate({
        right: '-750px'
      }, 'slow', function () {
        $button_open.parent().removeClass('xui-active');
        $('body').removeClass('modal-open');
        $modal.fadeOut('show');
      });
    });
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_headerNew = function () {
  /*eslint no-underscore-dangle: ['error', { 'allow': ['_documentClickHeader', '_dudesClick', '_overlayHeaderClick', '_loggedClick', '_overlayTouchStart', '_loggedResizeClick', '_resizeHeaderFunction'] }]*/
  var _documentClickHeader = function (event) {
    var $dudes = $('[data-dudes]');
    var $logged = $('.ibe-header-new__logged-link');
    var containerLogged = $logged.data('target');

    if ($(event.target).parents('.ibe-header-new').length === 0 && !$(event.target).hasClass('ibe-header-new')) {
      if ($dudes.hasClass('open') && $('.ibe-header-new__dudes .ibe_form').is(':visible') && !$(event.target).hasClass('ibe-header-new__dudes-input') && $(event.target).attr('data-dudes') !== 'dudes' && $(event.target).parents('.ibe-header-new__dudes').length === 0) {
        $dudes.removeClass('open');
        $('.ibe-header-new__dudes .ibe_form').animate({
          width: 'toggle'
        }, 600, function () {
          $dudes.parent().animate({
            width: 'toggle'
          }, 400);
        });
      }
    }

    if (window.innerWidth < dFrontJs.resolutions.lg && $(containerLogged).is(':visible') && !$(event.target).hasClass('ibe-login') && $(event.target).parents('.ibe-login').length === 0) {
      $logged.removeClass('active');
      $(containerLogged).collapse('hide');
      $('.ibe-menu-new__overlay').hide();
      $('html, body').css({
        'overflow': ''
      });
    }
  };

  var _dudesClick = function () {
    var $this = $(this);
    $this.addClass('open');
    $this.parent().animate({
      width: 'toggle'
    }, 400, function () {
      $this.parents('.ibe-header-new__dudes').find('.ibe_form').animate({
        width: 'toggle'
      }, 600);
      $this.parents('.ibe-header-new__dudes').find('.ibe-header-new__dudes-input').focus();
    });
  };

  var _overlayHeaderClick = function (e) {
    var $logged = $('.ibe-header-new__logged-link');
    var containerLogged = $logged.data('target');
    e.preventDefault();
    $(this).hide();
    $('[data-click-toggle="popover"]').css('z-index', '');
    $('[data-function="data-focus-searcher"], .ibe-search-flights__search--overlay').css('z-index', '');
    $('[data-function="data-focus-searcher-mobile"], .ibe-search-flights__search--overlay').css('z-index', '');
    $logged.removeClass('active');
    $(containerLogged).collapse('hide');
    $('html, body').css({
      'overflow': ''
    });
  };

  var _loggedClick = function () {
    var windowWidth = window.innerWidth;
    var $overlayHeader = $('.ibe-header-new__overlay');
    var $logged = $('.ibe-header-new__logged-link');
    var containerLogged = $logged.data('target');
    var $this = $(this);

    if (windowWidth < dFrontJs.resolutions.lg) {
      requestAnimFrame(function () {
        $this.toggleClass('active');
        $overlayHeader.toggle();

        if ($('body').css('overflow') === 'hidden') {
          $('html, body').css({
            'overflow': ''
          });
        } else {
          $('html, body').css({
            'overflow': 'hidden'
          });
        }

        if ($(containerLogged).is(':visible')) {
          $overlayHeader.show();
        } else if ($(containerLogged).not(':visible')) {
          $overlayHeader.hide();
        }
      });
    }
  };

  var _overlayTouchStart = function () {
    var $logged = $('.ibe-header-new__logged-link');
    var containerLogged = $logged.data('target');
    var $overlayHeader = $('.ibe-header-new__overlay');

    if ($(containerLogged).is(':visible')) {
      requestAnimFrame(function () {
        $logged.toggleClass('active');
        $overlayHeader.hide();
        $(containerLogged).collapse('hide');
      });
    }
  };

  var _loggedResizeClick = function () {
    var $this = $(this);

    if (windowWidth < dFrontJs.resolutions.lg) {
      $this.toggleClass('active');
      $('.ibe-menu-new__overlay').toggle();

      if ($('body').css('overflow') === 'hidden') {
        $('html, body').css({
          'overflow': ''
        });
      } else {
        $('html, body').css({
          'overflow': 'hidden'
        });
      }
    }
  };

  var _resizeHeaderFunction = function () {
    var $logged = $('.ibe-header-new__logged-link');
    var containerLogged = $logged.data('target');
    windowWidth = window.innerWidth;
    clearTimeout($.data(this, 'resizeLogged'));
    $.data(this, 'resizeLogged', setTimeout(function () {
      if (windowWidth < dFrontJs.resolutions.lg) {
        //New Login
        if ($('.ibe-login.collapse').hasClass('in')) {
          $('.ibe-login.collapse.in').collapse('hide');
        } //New Logged


        if (!$logged.hasClass('logged-responsive')) {
          $(containerLogged).collapse('hide');
          $logged.addClass('logged-responsive');
          $logged.off('click', _loggedResizeClick);
          $logged.on('click', _loggedResizeClick);
        } else {
          $('.ibe-header-new__overlay').hide();
        }
      } else {
        //New Login
        if ($('.ibe-dialog--login').is(':visible')) {
          $('.ibe-dialog--login').dialog('close');
        } //New Logged


        $logged.removeClass('logged-responsive');

        if ($logged.hasClass('active')) {
          $logged.removeClass('active');
          $('.ibe-menu-new__overlay').hide();
          $('.ibe-header-new__overlay').hide();
          $(containerLogged).collapse('hide');
          $('html, body').css({
            'overflow': ''
          });
        }
      }
    }, 200));
  };

  var init = function () {
    //Search dude
    var $dudes = $('[data-dudes]');
    var $logged = $('.ibe-header-new__logged-link');
    var windowWidth = window.innerWidth;
    var $overlayHeader = $('.ibe-header-new__overlay');

    if ($overlayHeader.length === 0) {
      $('body').append('<div class="ibe-header-new__overlay" style="display: none;">');
      $overlayHeader = $('.ibe-header-new__overlay');
    }

    $overlayHeader.off('click', _overlayHeaderClick);
    $overlayHeader.on('click', _overlayHeaderClick);
    $dudes.off('click', _dudesClick);
    $dudes.on('click', _dudesClick);

    if (windowWidth < dFrontJs.resolutions.lg) {
      if (!$logged.hasClass('logged-responsive')) {
        $logged.addClass('logged-responsive');
      }

      $logged.off('click', _loggedClick);
      $logged.on('click', _loggedClick);
    } // Click Overlay closes menu header new


    $overlayHeader.off('touchstart', _overlayTouchStart);
    $overlayHeader.on('touchstart', _overlayTouchStart);
    $(window).off('resize', _resizeHeaderFunction);
    $(window).on('resize', _resizeHeaderFunction);
    $(document).off('click', _documentClickHeader);
    $(document).on('click', _documentClickHeader);
  }; //ibeHeader


  return {
    'init': init
  };
}(jQuery);
"use strict";

//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: Inputs iberia
//    Descripcion: Funcion para los inputs principales de iberia
//******************************************************************************/
dFrontJs.ibe_inputs = function () {
  /*eslint no-underscore-dangle: ['error', { 'allow': ['_blurFocusoutChangeInput', '_focusBlurInputLabel'] }]*/
  var _blurFocusoutChangeInput = function () {
    inputActive(this);
  };

  var _focusBlurInputLabel = function (e) {
    labelActive(this, e.type);
  };

  var inputActive = function (obj) {
    var $this = $(obj),
        $parent = $this.parents('.ibe_form__group'),
        $label = $this.find('.ibe_form__input-label');

    if ($this.val() !== "" && !$label.hasClass('hideAccessible') && !$this.hasClass('ibe_form__input-text--stop-animation')) {
      //Stop animation because dtaepicker has two group in the same group,
      //So the group content is added in the datepicker js
      $parent.addClass('ibe_form__group--content');
    } else {
      $parent.removeClass('ibe_form__group--content');
    }
  }; //inputActive


  var labelActive = function (obj, typeEvent) {
    var $this = $(obj);

    switch (typeEvent) {
      case 'focus':
        $this.prev().addClass('xui-label--up');
        $('.ibe-accordion__button').parent().addClass('ibe-accordion__overlay-button');
        break;

      case 'blur':
        $this.prev().removeClass('xui-label--up');
        break;
    }
  }; //labelActive


  var showHidePassword = function () {
    var $this = $(this);
    var $input = $this.siblings('input');
    var $accesibleText = $this.children('span.hideAccessible');

    if ($input.attr('type') === 'password') {
      //Change button icon
      $this.removeClass('icon-pass-hidden');
      $this.addClass('icon-pass-visible');
      $input.attr('type', 'text');
      $accesibleText.text($this.data('text-hide'));
      $input.focus();
    } else {
      $this.addClass('icon-pass-hidden');
      $this.removeClass('icon-pass-visible');
      $input.attr('type', 'password');
      $accesibleText.text($this.data('text-show'));
      $input.focus();
    }
  }; //init


  var init = function () {
    var $input_text = $('.ibe_form__input-text');
    var $input_showHideLink = $('[data-showhide]');
    $input_showHideLink.off('click', showHidePassword);
    $input_showHideLink.on('click', showHidePassword);
    $input_text.each(function () {
      inputActive(this);
    });
    $input_text.off('blur focusout change', _blurFocusoutChangeInput);
    $input_text.on('blur focusout change', _blurFocusoutChangeInput);
    $('.fc_form_group').find('input').off('focus blur', _focusBlurInputLabel);
    $('.fc_form_group').find('input').on('focus blur', _focusBlurInputLabel);
  };

  return {
    'init': init,
    'inputActive': inputActive
  };
}(jQuery);
"use strict";

//Control de múltiples trayectos
dFrontJs.ibe_journey = function () {
  /*eslint no-underscore-dangle: ['error', { 'allow': ['_clickButtonCollapse', '_addJourney', '_removeJourney'] }]*/
  var _clickButtonCollapse = function () {
    $(this).closest('.ibe_form__box').find('label.ibe_form__input-label').click();
  };

  var init = function () {
    addItems();
    $('[data-journey="journey"]').addClass('ibe-journey');
    dFrontJs.ibe_inputs.init();
    dFrontJs.ibe_selectmenu.init();
    dFrontJs.ibe_searcher_calendar.init();
    dFrontJs.ibe_validations_searcher.init();
  };

  var addItems = function () {
    var $journeyParent = $('[data-journey="parent"]');
    var $journeys = $('[data-journey="journey"]');
    var $index, i;

    if ($journeyParent.length) {
      $index = parseInt($('[data-journey-num]').attr('data-journey-num'));

      for (i = $index; i >= $journeys.length + 1; i--) {
        $journeyParent.prepend(addNewJourney('[data-journey-num]', i));
      }

      $('[data-journey="add"]').off('click', _addJourney);
      $('[data-journey="add"]').on('click', _addJourney);
      $('[data-journey="remove"]').off('click', _removeJourney);
      $('[data-journey="remove"]').on('click', _removeJourney);
      controlDates();
      showInit();
    }
  };

  var controlDates = function (obj) {
    requestAnimFrame(function () {
      var $journeys, $val, $firstCalendar, input, $pre, $next;

      if ($(obj).closest('[data-journey="journey"]').length > 0) {
        $journeys = $('[data-journey="journey"]');
        $val = $(obj).val();
        $firstCalendar = $journeys.first().find('[data-function="cal-start"]');
        $journeys.each(function (index) {
          if (index > 0) {
            input = $journeys.eq(index).find('[data-cal="start"]');
            $pre = $journeys.eq(index - 1).find('[data-function="cal-start"]');
            $next = $journeys.eq(index).find('[data-function="cal-start"]');

            if (input.val().length > 0 && $next.datepicker('getDate') < $pre.datepicker('getDate')) {
              $next.datepicker('option', 'minDate', $pre.datepicker('getDate'));
              input.val($val).trigger('change');
            } else {
              $next.datepicker('option', 'minDate', $pre.datepicker('getDate'));
              $next.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');

              if ($next.data('datesRange') !== undefined) {
                if ($next.data('datesRange')[0] !== null) {
                  $next.find('.selected-day--from').addClass('selected-day--both');
                }
              }
            }
          }
        });
        $('[data-journey="journey"] button[data-toggle="collapse"]').off('click', _clickButtonCollapse);
        $('[data-journey="journey"] button[data-toggle="collapse"]').on('click', _clickButtonCollapse);
      }
    });
  };
  /*Mostrar los 2 primeros items*/


  var showInit = function () {
    var $showInit = parseInt($('[data-journey-show]').attr('data-journey-show'));
    var $maxJourney = parseInt($('[data-journey-num]').attr('data-journey-num'));
    var $numFij = 2;
    var $journeys = $('[data-journey="journey"]');
    var i;

    for (i = 0; i < $showInit; i++) {
      if (i < $numFij) {
        $journeys.eq(i).removeClass('hidden').find('[data-journey="remove"]').parent().remove();
      } else {
        $journeys.eq(i).removeClass('hidden').find('[data-journey="remove"]').hide();
      }

      if (i + 1 === $showInit) {
        //Show the last remove button
        $journeys.eq(i).find('[data-journey="remove"]').show();
      }
    }

    if ($maxJourney === $showInit) {
      $('[data-journey="add"]').hide();
    }
  };
  /* Detecta cuando se le da a añadir un nuevo trayecto */


  var _addJourney = function () {
    var $journeyParent, $journeys, $index;
    $(this).blur();
    $journeyParent = $('[data-journey="parent"]');
    $journeys = $('[data-journey="journey"]');
    $index = $journeys.not(':hidden').length + 1;
    $journeys.find('[data-journey="remove"]').hide();
    $journeys.eq($index - 1).show().removeClass('hidden').find('[data-journey="remove"]').show();

    if ($index === $journeys.length) {
      $(this).hide();
    }
  };
  /* Detecta cuando se le da a eliminar un trayecto */


  var _removeJourney = function () {
    var $journeys;
    $(this).closest('[data-journey="journey"]').hide();
    $journeys = $('[data-journey="journey"]');
    $journeys.not(':hidden').last().find('[data-journey="remove"]').show();
    $('[data-journey="add"]').show();
  }; //Devuelve el html para añadir un trayecto


  var addNewJourney = function (id, index) {
    var html = $(id).html();
    html = html.replace(/{{index}}/g, index);
    return html;
  }; //addNewJourney
  //init


  return {
    'init': init,
    'controlDates': controlDates
  };
}(jQuery);
"use strict";

dFrontJs.ibe_keyboard_action = function () {
  var init = function () {};

  var close = function (elem) {
    // CLOSE COLLAPSE
    $(elem).on('show.bs.collapse', function () {
      $(document).on('keydown', function (e) {
        var dataKey = $(elem).data('keyboard-close');
        checkKey(e.keyCode, dataKey) ? $(elem).collapse('hide') : false;
      });
    });
  }; // check that the key pressed matches the data attribute


  var checkKey = function (keyCode, dataKey) {
    var keys = {
      27: ['esc', 'escape']
    };

    try {
      return keys[keyCode].includes(dataKey.toLowerCase());
    } catch (err) {
      return false;
    }
  };

  return {
    'init': init,
    'close': close
  };
}(jQuery);
"use strict";

//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: loading
//    Descripcion: Funcion para el componente de loading
//******************************************************************************/
dFrontJs.ibe_loading = function () {
  //init
  var openCLASS = 'ibe-loading__overlay--open';

  var init = function () {
    var $loading = $('[data-loading]'),
        $loadingSmall = $('.ibe-loading__overlay--grey'),
        $loadingNoSpace = $('.ibe-loading__overlay--nocolor'),
        $spinner = $loading.find('.ibe-loading__spinner'),
        $icon = $loading.find('.ibe-loading__icon'),
        $text = $loading.find('.ibe-loading__text'),
        spinWidth = $spinner.width();

    if ($loading.length > 0) {
      $loading.each(function () {
        $(this).parent().css('position', 'relative');

        if ($(this).is(':visible') && $(this).closest('[data-modal-login]').length === 0) {
          $(this).parent().css('min-height', '284px');
        }

        $spinner = $(this).find('.ibe-loading__spinner'), $icon = $(this).find('.ibe-loading__icon'), $text = $(this).find('.ibe-loading__text'), spinWidth = $(this).width();

        if (spinWidth < 80 && $(this).closest('[data-modal-login]').length === 0) {
          $icon.css('height', spinWidth + 'px');
          $text.css('padding-top', spinWidth + 'px');
        } else {
          $icon.removeAttr('style');
          $text.removeAttr('style');
        }
      });
    }

    if ($loadingSmall.length > 0) {
      $loading.parent().css('min-height', '64px');
    }

    if ($loadingNoSpace.length > 0) {
      $loading.parent().css('min-height', '0');
    }
  }; //dFrontJs.ibe_loading.close() || //dFrontJs.ibe_loading.close(selector)


  var close = function (selector) {
    var $loadingFull = $('[data-loading-full]'),
        $overlay = '.ibe-loading__overlay',
        $selector;

    if (selector === undefined) {
      $selector = $('body');
      $selector.find($overlay).removeClass(openCLASS);

      if ($loadingFull.length > 0) {
        $selector.css('overflow', '');
      }
    } else if (selector === 'body') {
      $selector = $('body');
      $selector.find('.ibe-loading__overlay--full').removeClass('ibe-loading__overlay--open');

      if ($loadingFull.length > 0) {
        $selector.css('overflow', '');
      }
    } else {
      $selector = $(selector);
      $selector.find($overlay).removeClass(openCLASS);
    }

    $selector.find($overlay).parent().css('min-height', '');
  }; //dFrontJs.ibe_loading.open() || //dFrontJs.ibe_loading.open(selector)


  var open = function (selector) {
    var $overlay = '.ibe-loading__overlay',
        $overlayFull = $('.ibe-loading__overlay--full'),
        $loadingSmall = $('.ibe-loading__overlay--grey'),
        $selector,
        $spinner,
        $icon,
        $text,
        spinWidth;

    if (selector === undefined) {
      $selector = $('body');
      $selector.find($overlay).addClass(openCLASS);

      if ($overlayFull.length > 0) {
        $selector.css('overflow', 'hidden');
      }
    } else if (selector === 'body') {
      $selector = $('body');
      $selector.find('.ibe-loading__overlay--full').addClass(openCLASS);

      if ($overlayFull.length > 0) {
        $selector.css('overflow', 'hidden');
      }
    } else {
      $selector = $(selector);
      $selector.find($overlay).addClass(openCLASS);
    }

    $selector.find($overlay).parent().css('position', 'relative');
    $spinner = $selector.find('.ibe-loading__spinner');
    $icon = $selector.find('.ibe-loading__icon');
    $text = $selector.find('.ibe-loading__text');
    spinWidth = $spinner.width();

    if (!spinWidth < 80) {
      // 	$icon.css('height', spinWidth + 'px');
      // 	$text.css('padding-top', spinWidth + 'px');
      // } else {
      $icon.removeAttr('style');
      $text.removeAttr('style');
    }

    if ($loadingSmall.length > 0) {
      $selector.find($overlay).parent().css('min-height', '64px');
    } else if ($selector.closest('[data-modal-login]').length !== 0) {
      $selector.find($overlay).parent().css('min-height', '');
    } else {
      $selector.find($overlay).parent().css('min-height', '284px');
    }
  };

  var spinnerButton = function (paramTime) {
    var spinnerTime = paramTime || 5000,
        $boton = $('[data-boton-send-form]'),
        newText = '',
        buttonText = '';
    $boton.find('.ibe-loading__spinner').show();
    buttonText = $boton.find('[data-boton-text]').text();
    newText = $boton.find('[data-boton-text]').data('boton-text');
    $boton.find('[data-boton-text]').text(newText);
    setTimeout(function () {
      $boton.find('[data-boton-text]').text(buttonText);
      $boton.find('.ibe-loading__spinner').hide();
    }, spinnerTime);
  };

  return {
    'init': init,
    'close': close,
    'open': open,
    'spinnerButton': spinnerButton
  };
}(jQuery);
"use strict";

/* Nuevo menu para  Iberia */
dFrontJs.ibe_menu_new = function () {
  //Abrir/Cerrar menu mobile
  var statusMenuMobile = function (action) {
    if (!$('body').hasClass('menu-action')) {
      $('body').addClass('menu-action');
    }

    if ($('.ibe-menu-new').hasClass('menu-responsive')) {
      switch (action) {
        case 'show':
          if ($('.ibe-cookies').length > 0 && $('.ibe-cookies').is(':visible')) {
            $('.ibe-cookies').slideToggle('slow', function () {
              $('.ibe-menu-new').addClass('active');
              $('body').addClass('menu-open');
              $('body').scrollTop(0);
              $('[data-menu-new="button"]').addClass('on');
              $('.ibe-menu-new__overlay').show();
              $('[data-list="menu"]').focus();
              $('.ibe-menu-new').css({
                'visibility': 'visible'
              });
              $('body').css({
                'position': 'relative'
              });
              $('html').css({
                'overflow': 'hidden'
              });
            });
          } else {
            $('.ibe-menu-new').addClass('active');
            $('body').addClass('menu-open');
            $('body').scrollTop(0);
            $('[data-menu-new="button"]').addClass('on');
            $('.ibe-menu-new__overlay').show();
            $('[data-list="menu"]').focus();
            $('.ibe-menu-new').css({
              'visibility': 'visible'
            });
            $('body').css({
              'position': 'relative'
            });
            $('html').css({
              'overflow': 'hidden'
            });
          }

          break;

        case 'hide':
          setTimeout(function () {
            $('.ibe-menu-new').css({
              'visibility': 'hidden'
            });
          }, 500);
          $('.ibe-menu-new').removeClass('active');
          $('body').removeClass('menu-open');
          $('[data-menu-new="button"]').removeClass('on');
          $('.ibe-menu-new__overlay').hide();
          $('html').css({
            'overflow': 'auto'
          });

          if ($('.ibe-cookies').length > 0) {
            $('.ibe-cookies').slideToggle();
          }

          break;
      }
    }
  }; //statusMenuMobile
  //Abrir/Cerrar submenu


  var openCloseSubmenu = function (obj, menu, type) {
    var $menuBlock = $('[data-menu-new="' + menu + '"]');

    if ($('.ibe-menu-new').hasClass('menu-responsive')) {
      if (type === 'close') {
        $('.ibe-menu-new__panel').height($($menuBlock.parents('[data-list="menu"]')[0]).height());
        $menuBlock.parent().removeClass('open-submenu');
        $menuBlock.parent().siblings().css('visibility', 'visible');
        $menuBlock.removeClass('active');
        setTimeout(function () {
          $menuBlock.css('display', 'none');
        }, 300);
        $menuBlock.parent().children('[data-link="menu"]').css('visibility', 'visible');
        $menuBlock.parents('[data-menu]').first().find('a').first().focus();
        $menuBlock.parents('ul').eq(0).find('> li > a').removeAttr('tabindex');
        $menuBlock.find('> li > a').attr('tabindex', '-1');
      } else if (type === 'open') {
        $menuBlock.css('display', 'block');
        $('.ibe-menu-new__panel').height($menuBlock.height());
        $menuBlock.parent().addClass('open-submenu');
        $menuBlock.parent().siblings().not('.open-submenu').css('visibility', 'hidden');
        $menuBlock.parent().children('[data-link="menu"]').css('visibility', 'hidden');
        $menuBlock.find('a').first().focus();
        $menuBlock.parents('ul').find('> li > a').attr('tabindex', '-1');
        $menuBlock.find('> li > a').removeAttr('tabindex');
        $menuBlock.addClass('active');
      }
    }
  }; //openCloseSubmenu


  var init = function () {
    //Variables del listado principal
    var $menu = $('.ibe-menu-new'),
        item = $('.ibe-menu-new__item'),
        link = $('.ibe-menu-new__link--tab'),
        itemsFocusout = $('.ibe-menu-new__link--tab, .ibe-menu-new__link--submenu, .ibe-menu-new__title'),
        container = $('.ibe-menu-new__container'),
        underline = $('.ibe-menu-new__item--underline'),
        myTimer,
        myTimeout;

    if ($('.ibe-menu-new__overlay').length === 0) {
      $('body').append('<div class="ibe-menu-new__overlay" style="display: none;">');
    } //Hover change background


    item.hover(function () {
      var $this = $(this);
      $this.find(container).attr('aria-hidden', false);
      $this.find(container).attr('aria-expanded', true);
      $this.find(link).attr('aria-hidden', false); //Delay to open the menu

      myTimeout = setTimeout(function () {
        item.removeClass('ibe-menu-new__item--active');
        $this.addClass('ibe-menu-new__item--active');
        item.find(container).removeClass('ibe-menu-new__container--active');
        $this.find(container).addClass('ibe-menu-new__container--active');
        underline.removeClass('ibe-menu-new__item--underline');
      }, 200);
      clearTimeout(myTimer);
    }, function () {
      var $this = $(this);
      $this.find(link).attr('aria-hidden', true);
      $this.find(container).attr('aria-hidden', true);
      $this.find(container).attr('aria-expanded', false);
      myTimer = setTimeout(function () {
        item.removeClass('ibe-menu-new__item--active');
        item.find('.ibe-menu-new__container').removeClass('ibe-menu-new__container--active');
        underline.addClass('ibe-menu-new__item--underline');
      }, 300);
      clearTimeout(myTimeout);
    }); //Focus for keyboard

    link.on('focus', function (e) {
      var $this = $(this);
      $this.parent().find(container).attr('aria-hidden', false);
      $this.parent().find(container).attr('aria-expanded', true);
      $this.parent().find(link).attr('aria-expanded', true);
      $this.parent().find(link).attr('aria-hidden', false);
      underline.removeClass('ibe-menu-new__item--underline');
      $('.ibe-menu-new__item.ibe-menu-new__item--active').removeClass('ibe-menu-new__item--active');
      $('.ibe-menu-new__container.ibe-menu-new__container--active').removeClass('ibe-menu-new__container--active');
      $('.ibe-menu-new__container.ibe-menu-new__container--active').parent().removeClass('ibe-menu-new__item--underline');
      $this.parent().addClass('ibe-menu-new__item--active');
      $this.parent().find(container).addClass('ibe-menu-new__container--active');
    });
    itemsFocusout.on('keydown', function (e) {
      if (e.keyCode === 39) {
        $(this).parents('.ibe-menu-new__item').next().children('.ibe-menu-new__link--tab').focus();
      } else if (e.keyCode === 37) {
        $(this).parents('.ibe-menu-new__item').prev().children('.ibe-menu-new__link--tab').focus();
      }

      if (e.keyCode === 27) {
        $(this).blur();
      }
    });
    itemsFocusout.on('focusout', function (e) {
      var $this = $(this);

      if (!$(e.relatedTarget).parents('.ibe-menu-new__item--active').length > 0) {
        $(link).attr('aria-hidden', true);
        $(link).attr('aria-expanded', false);
        $(container).attr('aria-expanded', false);
        $(container).attr('aria-hidden', true);

        if ($(e.relatedTarget).parents('.ibe-menu-new')) {
          item.find(container).removeClass('ibe-menu-new__container--active');
          item.removeClass('ibe-menu-new__item--active');
        }
      }

      if (!$(e.relatedTarget).parents('.ibe-menu-new').length > 0) {
        $this.parents('.ibe-menu-new__item').removeClass('ibe-menu-new__item--active');
        $this.parent().find(link).attr('aria-hidden', true);
        $this.parent().find(link).attr('aria-expanded', false);
        $this.parent().find(container).attr('aria-hidden', true);
        $this.parent().find(container).attr('aria-expanded', false);
        myTimer = setTimeout(function () {
          item.find(container).removeClass('ibe-menu-new__container--active');
          underline.addClass('ibe-menu-new__item--underline');
        }, 300);
      }
    });
    $(document).off('click touchend', '[data-open-menu-new]');
    $(document).off('click touchend', '[data-menu-new="button"]');
    $(document).off('click touchend', '.ibe-menu-new__overlay');
    $(document).off('click touchend', '[data-close-menu-new]'); /// Mostrar menu mobile

    $(document).on('click', '[data-menu-new="button"]', function () {
      var $this = $(this);

      if ($this.hasClass('on')) {
        statusMenuMobile('hide');
      } else {
        statusMenuMobile('show');
      } //Cerrar menu clickeando en el overlay

    }).on('click touchend', '.ibe-menu-new__overlay', function (e) {
      e.preventDefault();
      statusMenuMobile('hide'); //Abrir menu
    }).on('click', '[data-open-menu-new]', function () {
      var $this = $(this),
          menu = $this.data('open-menu-new');
      openCloseSubmenu($this, menu, 'open'); //Cerrar menu
    }).on('click', '[data-close-menu-new]', function () {
      var $this = $(this),
          menu = $this.data('close-menu-new');
      openCloseSubmenu($this, menu, 'close');
    });

    if (window.innerWidth < dFrontJs.resolutions.lg) {
      $menu.addClass('menu-responsive');
    } else {
      $menu.removeClass('menu-responsive');
      $('.ibe-menu-new__title').each(function () {
        if (!$(this).hasClass('ibe-menu-new__title--link')) {
          $(this).attr('tabindex', '-1');
        }
      });
    }

    $(window).on('resize', function () {
      if (window.innerWidth < dFrontJs.resolutions.lg) {
        if (!$menu.hasClass('menu-responsive')) {
          $menu.addClass('menu-responsive');
          $('.ibe-menu-new__overlay').hide();
        }
      } else {
        $menu.removeClass('active');
        $menu.removeClass('menu-responsive');
        $menu.css('visibility', '');
        $('.ibe-menu-new__item--submenu').css({
          visibility: '',
          display: ''
        });
        $('.ibe-menu-new__title').css({
          visibility: '',
          display: ''
        });
        $('.ibe-menu-new__list').css({
          visibility: '',
          display: ''
        });
        $('.ibe-menu-new__list--submenu').css({
          visibility: '',
          display: ''
        });
        $('.ibe-menu-new__panel').css('height', 'auto');
        $('.open-submenu').removeClass('open-submenu');
        $('.ibe-menu-new__item--back').css({
          visibility: '',
          display: ''
        });
        $menu.find('.active').removeClass('active').css('display', '');

        if ($('.fc-dialog-language').hasClass('ui-dialog-content')) {
          $('.fc-dialog-language').dialog('close');
        }

        if ($('.fc-dialog-dudes').hasClass('ui-dialog-content')) {
          $('.fc-dialog-dudes').dialog('close');
        }

        if ($('.fc-dialog-onbusiness').hasClass('ui-dialog-content')) {
          $('.fc-dialog-onbusiness').dialog('close');
        }

        $('.ibe-menu-new__overlay').hide();
        $('.ibe-menu-new__title').each(function () {
          if (!$(this).hasClass('ibe-menu-new__title--link')) {
            $(this).attr('tabindex', '-1');
          }
        });
      }
    }); // icons menu

    if ($('.ibe-menu-new__list--submenu').find('[class*=" icon-"]').length > 0) {
      $('.ibe-menu-new__list--submenu').each(function () {
        var $this = $(this);

        if ($this.find('[class*=" icon-"]').length > 0) {
          $this.addClass('ibe-menu-new__list--icons');
        }
      });
    }
  }; //ibe-menu-new


  return {
    'init': init,
    'statusMenuMobile': statusMenuMobile
  };
}(jQuery);
"use strict";

dFrontJs.ibe_modal = function () {
  /*eslint no-underscore-dangle: ['error', { 'allow': ['_buttonCloseClick', '_modalMainClick', '_modalButtonClickEvent', '_classPopover'] }]*/
  var $focusin;

  var nativeShowModal = function (e) {
    e.stopImmediatePropagation();
    var $dialog = $(this.dataset.modalId);
    var tabmenu, itemsTabMenu, itemsTabContainer, i, attrs;
    var chooseCity = $dialog.find('[data-choose-city="predictive"]');
    var isResponsive = window.innerWidth < 1024;

    if (isResponsive) {
      $dialog.css("display", "block");

      if ($dialog.hasClass("fc-dialog-login")) {
        $dialog.trigger("dialogopen");
      }
    }

    if ($dialog.hasClass('fc-dialog-all-destinations') && chooseCity.length === 0) {
      tabmenu = chooseCity.find('.ibe-tab__menu');
      itemsTabMenu = tabmenu.find('.ibe-tab__menu-item');
      itemsTabContainer = chooseCity.find('.ibe-tab__container .ui-tabs-panel');
      $(chooseCity).find('.ibe-tab').addClass('ibe-accordion');

      for (i = 0; i < itemsTabContainer.length; i++) {
        attrs = {
          'id': 'group_accordion_' + [i],
          'data-toggle': 'container'
        };
        let tabFilter = $(itemsTabContainer[i]).find('.ibe-filter-letter');
        tabFilter.before('<h4 class="ibe-tab__title-accordion ibe-accordion__header" data-toggle="accordion" data-target="#group_accordion_' + [i] + '"><a href="#" class="ibe-tab__title-accordion-link" title="' + $(itemsTabMenu[i].children).html() + '">' + $(itemsTabMenu[i].children).html() + '</a></h4>');
        tabFilter.addClass('ibe-accordion__collapse');
        tabFilter.attr(attrs);
      }

      chooseCity.show();
      $dialog.find('.modal-body').append(chooseCity);
    }

    var iframe = $(this).find('iframe');

    if (iframe) {
      iframe.each(function () {
        var id = $(this).attr('src');
        var autoPlay = $(this).attr('data-autoplay');
        var initParam = $(this).attr('src').indexOf('?');

        if (autoPlay) {
          if (initParam === -1) {
            $(this).attr('src', id + '?autoplay=1');
          } else {
            $(this).attr('src', id + '&autoplay=1');
          }
        }
      });
    }

    if ($(this).hasClass('fc-dialog-language') || $(this).hasClass('fc-dialog-dudes') || $(this).hasClass('fc-dialog-onbusiness')) {
      dFrontJs.ibe_menu_new.statusMenuMobile('hide');
      $('.ibe-menu-new__overlay').show();
    } //- Se llama a la funcion que pausa el video del herobanner en caso de que exista.


    if ($('[data-video="html5"]').length > 0) {
      dFrontJs.ibe_video.pauseVideo($('[data-video="html5"]'));
    }

    $dialog.find('[data-dialog="close"]').off("click");
    $dialog.find('[data-dialog="close"]').on("click", nativeCloseModal);
  };

  var nativeCloseModal = function (e, isLoginFinEvent) {
    var $dialog = null;
    var isResponsive = window.innerWidth < 1024;

    if (this != window && isLoginFinEvent == undefined) {
      $dialog = $(this).closest('[data-dialog="modal"].ibe-dialog');
      $dialog.css("display", "none");
    } else {
      if (!isResponsive || isLoginFinEvent != undefined && isLoginFinEvent == true) {
        $dialog = $('[data-dialog="modal"].ibe-dialog:visible');

        if ($dialog.length > 0) {
          $dialog.css("display", "none");
        }
      }
    }

    if ($dialog != null) {
      var iframe = $dialog.find("iframe");

      if (iframe.length > 0) {
        iframe.remove();
      }
    }
  }; //Jquery ui dialog


  var createModal = function (element, modalFull, cssClass, appendTo) {
    var $dialog = $(element);
    var $dialogFull = modalFull ? true : false;
    var initVideo = {};

    if ($dialog.length > 0 && !$dialog.hasClass('fc-init-modal')) {
      $dialog.addClass('fc-init-modal');
      $dialog.dialog({
        modal: true,
        resizable: true,
        autoOpen: false,
        closeOnEscape: true,
        closeText: 'X',
        classes: {
          'ui-dialog-content': cssClass
        },
        close: function (event, ui) {
          if ($(this).find('iframe')) {
            $(this).find('iframe').each(function () {
              var id = $(this).attr('src');
              var numAutoPlay = $(this).attr('src').indexOf('autoplay=1');

              if (numAutoPlay >= 0) {
                id = id.split(id.substr(numAutoPlay - 1, 11));
                $(this).attr('src', id[0]);
              } else {
                $(this).attr('src', id);
              }
            });
          }

          if ($(this).hasClass('fc-dialog-popover')) {
            if ($('[data-toggle="popover"]').offset() != undefined) {
              setTimeout(function () {
                var topPopoverButton = $('[data-toggle="popover"]').offset().top;
                $('html, body').animate({
                  scrollTop: topPopoverButton
                }, 500);
              }, 50);
            }
          }

          if ($(this).hasClass('fc-dialog-language') || $(this).hasClass('fc-dialog-dudes') || $(this).hasClass('fc-dialog-onbusiness')) {
            $('.ibe-menu-new__overlay').hide();
            dFrontJs.ibe_menu_new.statusMenuMobile('show');
          }

          $('body').removeClass('modal-open');
          $('html').css('overflow', '');

          if ($(this).parents('.ibe-dialog').hasClass('defaultModal')) {
            $(this).parents('.defaultModal').find('.ibe-modal').html('');
          }
        },
        create: function (event, ui) {
          if ($dialogFull) {
            $dialog.addClass('modal--fullw');
          }
        },
        open: function (event, ui) {
          var chooseCity, tabmenu, itemsTabMenu, itemsTabContainer, i, attrs;

          if ($dialog.hasClass('fc-dialog-all-destinations') && $dialog.find('[data-choose-city="predictive"]').length === 0) {
            chooseCity = $('[data-choose-city="predictive"]');
            tabmenu = chooseCity.find('.ibe-tab__menu');
            itemsTabMenu = tabmenu.find('.ibe-tab__menu-item');
            itemsTabContainer = chooseCity.find('.ibe-tab__container .ui-tabs-panel');
            $(chooseCity).find('.ibe-tab').addClass('ibe-accordion');

            for (i = 0; i < itemsTabContainer.length; i++) {
              attrs = {
                'id': 'group_accordion_' + [i],
                'data-toggle': 'container'
              };
              $(itemsTabContainer[i]).find('.ibe-filter-letter').before('<h4 class="ibe-tab__title-accordion ibe-accordion__header" data-toggle="accordion" data-target="#group_accordion_' + [i] + '"><a href="#" class="ibe-tab__title-accordion-link" title="' + $(itemsTabMenu[i].children).html() + '">' + $(itemsTabMenu[i].children).html() + '</a></h4>');
              $(itemsTabContainer[i]).find('.ibe-filter-letter').addClass('ibe-accordion__collapse');
              $(itemsTabContainer[i]).find('.ibe-filter-letter').attr(attrs);
            }

            chooseCity.show();
            $dialog.find('.modal-body').append(chooseCity);
          }

          if ($(this).find('iframe')) {
            $(this).find('iframe').each(function () {
              var id = $(this).attr('src');
              var autoPlay = $(this).attr('data-autoplay');
              var initParam = $(this).attr('src').indexOf('?');

              if (autoPlay) {
                if (initParam === -1) {
                  $(this).attr('src', id + '?autoplay=1');
                } else {
                  $(this).attr('src', id + '&autoplay=1');
                }
              }
            });
          }

          if ($(this).hasClass('fc-dialog-language') || $(this).hasClass('fc-dialog-dudes') || $(this).hasClass('fc-dialog-onbusiness')) {
            dFrontJs.ibe_menu_new.statusMenuMobile('hide');
            $('.ibe-menu-new__overlay').show();
          } //- Se llama a la funcion que pausa el video del herobanner en caso de que exista.


          if ($('[data-video="html5"]').length > 0) {
            dFrontJs.ibe_video.pauseVideo($('[data-video="html5"]'));
          }
        }
      });
    }
  };

  var showModal = function (element, modalFull, cssClass) {
    var $dialog = $(element);
    var $dialogFull = modalFull ? true : false;
    var $cssClass; // $focusin = $('html').scrollTop();

    if (cssClass !== undefined) {
      $cssClass = cssClass;
    }

    $dialog.addClass($cssClass);

    if ($dialogFull) {
      $dialog.addClass('modal--fullw');
    } else {
      $dialog.removeClass('modal--fullw');
    }

    $dialog.dialog('open'); // $('body').addClass('modal-open');
    // $('html').css('overflow', 'hidden');

    dFrontJs.app.emitInView(); //Lazy load img refresh

    if (navigator.userAgent.match(/(iPhone)|(iPad)|(iPod)/i)) {
      $('body').addClass('modal-ios').css('position', 'relative');
      $('html').css('overflow', 'auto');
    }
  };

  var _buttonCloseClick = function (e) {
    var dialog = $(this).parents('.ibe-dialog');

    if (dialog.data('reload') !== undefined) {
      document.location.reload(false);
    } else {
      e.stopImmediatePropagation(); //$('body').removeClass('modal-open');
      //$('html').css('overflow', '');

      document.getElementsByTagName("body")[0].classList.remove("modal-open");
      document.getElementsByTagName("html")[0].style.overflow = '';
      dialog.dialog('close');

      if (dialog.hasClass('defaultModal')) {
        $(this).parents('.defaultModal').find('.ibe-modal').html('');
      }

      $('html').scrollTop($focusin);
    }
  };

  var _modalMainClick = function (e) {
    if ($(e.target).find('.modal-dialog').hasClass('ibe-noClose') || e.target !== this && $(e.target).attr('data-dialog') !== 'modal') {
      // Remove stopPropagation - Click on select options in modals
      // e.stopImmediatePropagation();
      return;
    }

    if ($(this).data('reload') !== undefined) {
      document.location.reload(false);
    } else {
      e.stopImmediatePropagation();
      $('body').removeClass('modal-open');
      $('html').css('overflow', '');
      $(this).dialog('close');

      if ($(this).hasClass('defaultModal')) {
        $(this).parents('.defaultModal').find('.ibe-modal').html('');
      }
    }

    $('html').scrollTop($focusin);
  };

  var closeModal = function (buttonClose) {
    //-console.log('aa',element, $('.ibe-dialog').find('.ibe-noClose').length);
    var $modalMain = $('.ibe-dialog');
    var $buttonClose;

    if (buttonClose !== undefined) {
      $buttonClose = $(buttonClose);
    } else {
      $buttonClose = $('[data-dialog="close"]');
    } //Close dialog on Button close


    $buttonClose.off('click', _buttonCloseClick);
    $buttonClose.on('click', _buttonCloseClick); // close dialog on Body click

    $modalMain.off('click', _modalMainClick);
    $modalMain.on('click', _modalMainClick);
  };

  var clickModal = function (element, modalButton, appendTo) {
    var $modalButton;

    var _modalButtonClickEvent = function (e) {
      var $element,
          $cssClass,
          $this,
          modalFull,
          appendTo,
          $galleryAirplane,
          $galleryExperiences,
          _classPopover = 'fc-dialog-popover';
      e.preventDefault();
      $this = $(this), modalFull = $this.data('full-width');
      appendTo = $this.data('append-to');

      if (element !== undefined) {
        $element = $(element);
      } else {
        $element = $this.data('modal-view');
      }

      if ($this.parents('.popover').length > 0) {
        $cssClass = _classPopover;
      } else {
        $cssClass = undefined;
      }

      if ($(e.currentTarget).data('gallery')) {
        galleryCarousel = $(e.currentTarget).data('gallery');
      } //Card Airplane galeria de imagenes


      $galleryAirplane = $(this).parents('[data-gallery="airplane"]');
      $galleryAirplane.find('[data-modal="button"]').each(function (index) {
        if ($(this)[0] === $this[0]) {
          dFrontJs.app.indexCarouselCardAirplane = index;
        }
      }); //Card Experiences galeria de imagenes

      $galleryExperiences = $(this).parents('[data-gallery="experiences"]');
      $galleryExperiences.find('[data-modal="button"]').each(function (index) {
        if ($(this)[0] === $this[0]) {
          dFrontJs.app.indexCarouselCardAirplane = index;
        }
      }); //Inicializamos la modal pasandole la clase

      createModal($element, modalFull, $cssClass, appendTo);
      showModal($element, modalFull, $cssClass);
    };

    if (modalButton !== undefined) {
      $modalButton = $(modalButton);
    } else {
      $modalButton = $('[data-modal="button"]');
    }

    $modalButton.off('click', _modalButtonClickEvent);
    $modalButton.on('click', _modalButtonClickEvent);
  };

  var init = function (element, modalButton, appendTo) {
    closeModal();
    clickModal(element, modalButton, appendTo);
  };

  return {
    'init': init,
    'createModal': createModal,
    'showModal': showModal,
    'closeModal': closeModal,
    'clickModal': clickModal,
    'nativeCloseModal': nativeCloseModal,
    'nativeShowModal': nativeShowModal
  };
}(jQuery);
"use strict";

dFrontJs.ibe_modals_vintage = function () {
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Para abrir la modal de origen/destino con el buscador vintage
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /*eslint no-underscore-dangle: ['error', { 'allow': ['_openModalOriDes', '_calcHeight', '_openModalFamily'] }]*/
  var _openModalOriDes = function (e) {
    var $this, idList, $input, $tab;

    if (window.innerWidth < dFrontJs.resolutions.lg) {
      $this = $(e.target).parents('.ibe-searcher__col');
      idList = $(e.target).attr('data-target');
      $input = $(e.target).closest('.ibe_form__group').find('[data-autocomplete = "cities"]');
      $tab = $('.ui-tabs-panel:visible'); //if($input.val() === "" && $(idList).find('.city-selected').length >0){

      $(idList).find('.city-selected').removeClass('city-selected'); //}

      if (!$this.hasClass('modal-mode')) {
        $this.addClass('modal-mode');
        $('.ibe-modal__header-close').show();
        $this.parents('.ibe-accordion.active').css('overflow', 'hidden'); // for de first time

        if (!$(idList).find('.city-selected').length > 0 && $input.val() !== '') {
          $tab.find('li:contains(' + $input.val() + ')').find('a:first').addClass('city-selected');
        }

        requestAnimFrame(function () {
          //meter en condicional si existe la clase cityselected && el input es !== ""
          if ($(idList).find('.city-selected').length > 0 && $input.val() !== '') {
            if ($(idList).find('.ibe-tab__scroll').length > 0) {
              //-setTimeout(function () {
              $(idList).find('.ioslist-wrapper').animate({
                scrollTop: $(idList).find('.city-selected').offset().top - $(idList).find('[data-tab-cities]:visible').find('.ioslist-wrapper').offset().top + $(idList).find('[data-tab-cities]:visible').find('.ioslist-wrapper').scrollTop() - 12
              }, 1000); //-}, 3000);
            } else {
              $(idList).find('.ioslist').scrollTop(0);
            }
          }
        });
      } // Calculate city list height and adjust it in each resize


      _calcHeight(idList);

      $(window).resize(function () {
        _calcHeight(idList);
      });
    }
  }; // Calculate city list height and adjust it in each resize


  var _calcHeight = function (elem) {
    var clientHeight = document.documentElement.clientHeight;
    var containerGeneral = $(elem);
    var containerElem = containerGeneral;
    var tabElem = containerGeneral.find('[data-tab="jquery-ui"]');
    var tabContainerElem = containerGeneral.find('.ibe-tab__container');
    var tabCitiesElem = containerGeneral.find('[data-tab-cities="mobile"]');
    var cityListElem = containerGeneral.find('[data-function="city-list"]');
    var elemRefer;
    containerElem.css('min-height', clientHeight - containerElem.offset().top);

    if (tabElem.offset() !== undefined) {
      tabElem.css({
        'height': clientHeight - tabElem.offset().top,
        'min-height': clientHeight - tabElem.offset().top
      });
    }

    tabContainerElem.css({
      'height': clientHeight - tabContainerElem.offset().top - 20,
      'min-height': clientHeight - tabContainerElem.offset().top - 20
    }); //I select an element as reference to catch the height, one that is not hidden 

    elemRefer = tabCitiesElem.filter(function () {
      return $(this).offset().top > 0;
    });
    tabCitiesElem.each(function (index, element) {
      $(element).css({
        'height': clientHeight - elemRefer.offset().top - 20,
        'min-height': clientHeight - elemRefer.offset().top - 20
      });
    });
    cityListElem.each(function (index, element) {
      $(element).css({
        'height': clientHeight - elemRefer.offset().top - 20,
        'min-height': clientHeight - elemRefer.offset().top - 20
      });
    });
  }; // Modal family in searcher vintage


  var _openModalFamily = function () {
    var $that;

    if (window.innerWidth < dFrontJs.resolutions.lg) {
      $that = $('.ibe-searcher__options-col--large');

      if (!$that.hasClass('modal-mode')) {
        $that.addClass('modal-mode');
        $('.ibe-modal__header-close').show();
        $('.ibe-button-close-modal-family').show();
        $that.parents('.ibe-accordion.active').css('overflow', 'hidden');
      }

      dFrontJs.ibe_passenger.getValues();
    }
  };

  var closeModalsVintage = function (fares) {
    var $that = $('.ibe-searcher__row');
    var clientHeight = document.documentElement.clientHeight;
    var $accordion = $('.ibe-searcher__row').closest('.ibe-accordion.active');
    fares = fares !== undefined ? fares : ''; // Check if the accordion needs a scroll bar

    if ($accordion && $accordion.scrollHeight > clientHeight) {
      $accordion.css('overflow-y', 'scroll');
    } else {
      $accordion.css('overflow-y', 'visible');
    }

    $accordion.css('overflow', '');

    function closeModal() {
      $that.find('.modal-mode').removeClass('modal-mode');
      $('.ibe-modal__header-close').hide();
      $('.ibe-button-close-modal-family').hide();

      if ($that.find('.ibe-button-close-modal-passenger').length > 0) {
        $('.ibe-button-close-modal-passenger').css('display', 'none');
      }
    }

    if (fares === '') {
      setTimeout(function () {
        closeModal();
      }, 400);
    } else {
      closeModal();
    }
  }; // Modal fares in searcher vintage


  var openModalTarifas = function (e) {
    var $that;

    if (window.innerWidth < dFrontJs.resolutions.lg) {
      $that = $('.ibe-searcher__options-col--right');

      if (!$that.hasClass('modal-mode')) {
        $that.addClass('modal-mode');
        $('.ibe-modal__header-close').show();
        $that.parents('.ibe-accordion.active').css('overflow', 'hidden');
      }
    }
  }; // Modal num passenger in searcher vintage


  var openModalPassenger = function (e) {
    var $that = $('.ibe-searcher__col--alt');

    if (window.innerWidth < dFrontJs.resolutions.lg) {
      // Delete focus to input
      e.target.blur(); // The scroll up when closing the modal, for when it opens again it appears when opening

      $('.ibe-people-counter').on('hidden.bs.collapse', function () {
        $that.each(function (index, elem) {
          $(elem).scrollTop(0);
        });
      });

      if (!$that.hasClass('modal-mode')) {
        //dFrontJs.ibe_searcher_people_counter.restore_values_passengers('false');
        $that.addClass('modal-mode');
        $('.ibe-modal__header-close').show();
        $('.ibe-button-close-modal-passenger').show();
        $that.parents('.ibe-accordion.active').css('overflow', 'hidden');
      }

      $that.scrollTop(0);
    }
  }; /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Para abrir la modal en el datePicker con el buscador vintage
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////


  var openModalDatepicker = function () {
    var $this = $('.ibe-searcher__col--date');

    if (window.innerWidth < dFrontJs.resolutions.lg) {
      if (!$this.hasClass('modal-mode')) {
        $this.addClass('modal-mode');
        $('.ibe-button-close-modal').show();
        $this.parents('.ibe-accordion.active').css('overflow', 'hidden');
      }
    }
  };

  var closeModalDatepicker = function () {
    setTimeout(function () {
      var $this = $('.ibe-searcher__col--date');
      var idCal = $this.parent().find('.collapse.in');
      requestAnimFrame(function () {
        idCal.off('hide.bs.collapse');
        idCal.collapse('hide');
      }, 500);
      $this.removeClass('modal-mode');
      $('.ibe-button-close-modal').hide();
      $this.parents('.ibe-accordion.active').css('overflow', '');
    }, 200);
  };

  var init = function (selector) {
    if (selector === undefined) {
      selector = $('[data-tab-searcher] > .ibe-tab__scroll').find('[aria-selected=true]').children().attr('href');
    } ////////////////////////  calls to functions ////////////////////////////////////


    if (!$(selector).find('.ibe_form__group--half').find('.ibe-button-close-modal').length > 0) {
      $(selector).find('.ibe_form__group--half').append('<button type="button" style="display: none" data-hideAccessible="Close" data-text="Close" aria-label="Close modal" tabindex="0" data-focusin  class="ibe-button-close-modal"></button>');
    }

    if (!$(selector).find('.ibe-searcher__row--col2').find('.ibe-button-close-modal-fares').length > 0) {
      $(selector).find('.ibe-searcher__row--col2').find('.ibe-searcher__options-col--right > .ibe-modal__header-close').append('<button type="button" tabindex="0" data-focusin  data-hideAccessible="Close" data-text="Close" aria-label="Close modal" class="ibe-button-close-modal-fares"></button>');
    }

    if (!$(selector).find('.ibe-searcher__row--col2').find('.ibe-button-close-modal-family').length > 0) {
      $(selector).find('.ibe-searcher__row--col2').find('.ibe-searcher__options-col--large').append('<button type="button" data-hideAccessible="Close" tabindex="0" data-focusin data-text="Close" style="display:none" aria-label="Close modal" class="ibe-button-close-modal-family"></button>');
    }

    if (!$(selector).find('.ibe-searcher__row--col1').find('.ibe-button-close-modal-city').length > 0) {
      $(selector).find('.ibe-searcher__row--col1').find('.ibe-modal__header-close').append('<button type="button" data-hideAccessible="Close" aria-label="Close modal" data-text="Close" tabindex="0" data-focusin  class="ibe-button-close-modal-city"></button>');
    }

    if (!$(selector).find('.ibe-searcher__row--col2').find('.ibe-button-close-modal-passenger').length > 0) {
      $(selector).find('.ibe-searcher__col--alt').append('<button type="button" aria-label="Close modal" data-hideAccessible="Close" class="ibe-button-close-modal-passenger" tabindex="0" data-focusin data-text="Close" style="display: none"></button>');
    }

    $('[data-autocomplete="cities"]').parent().find('[data-toggle="collapse"]').off('click', _openModalOriDes);
    $('[data-autocomplete="cities"]').parent().find('[data-toggle="collapse"]').on('click', _openModalOriDes);
    $('.ibe-searcher__passenger-button').off('click', _openModalFamily);
    $('.ibe-searcher__passenger-button').on('click', _openModalFamily);
    $('[data-modal="data-modal"]').off('click', openModalPassenger);
    $('[data-modal="data-modal"]').on('click', openModalPassenger);
    $('.ibe-button-close-modal-fares').off('click', closeModalsVintage('yes'));
    $('.ibe-button-close-modal-fares').on('click', closeModalsVintage('yes'));
    $('.ibe-button-close-modal-city').off('click', closeModalsVintage);
    $('.ibe-button-close-modal-city').on('click', closeModalsVintage);
    $('[data-cal="end"],[data-cal="start"]').off('focus click', openModalDatepicker);
    $('[data-cal="end"],[data-cal="start"]').on('focus click', openModalDatepicker);
    $('.ibe-button-close-modal').off('click', closeModalDatepicker);
    $('.ibe-button-close-modal').on('click', closeModalDatepicker); /// Save the values in modal vintage (No save)

    $('[data-close-modal]').off('click');
    $('[data-close-modal]').on('click', function (e) {
      var $buttonSave = $(e.target).parent(),
          $closePassenger = $buttonSave.siblings('.ibe-button-close-modal-passenger'),
          $selector = $closePassenger.parent().find('.ibe_form__group').children('.fc-people-counter-active');

      if ($closePassenger.length > 0) {
        dFrontJs.ibe_searcher_people_counter.savePassenger($buttonSave, $selector);
      }

      closeModalsVintage();
    }); /// Close the modal in vintage (Save dates)

    $('.ibe-button-close-modal-passenger').click(function () {
      var $closeButton = $(this),
          $selector = $closeButton.parent().find('.ibe_form__group').children('.fc-people-counter-active');
      dFrontJs.ibe_searcher_people_counter.restorePassenger($closeButton, $selector);
      closeModalsVintage();
    }); /// Close the modal in vintage

    $('.ibe-button-close-modal-family').click(function () {
      dFrontJs.ibe_passenger.restore_values_family('true');
      closeModalsVintage();
    }); //////////////////////////End calls ///////////////////////////////////////
  };

  var reloadOriDesModal = function () {
    $('[data-autocomplete="cities"]').parent().find('[data-toggle="collapse"]').off('click', _openModalOriDes);
    $('[data-autocomplete="cities"]').parent().find('[data-toggle="collapse"]').on('click', _openModalOriDes);
  }; //public functions


  return {
    'init': init,
    'openModalTarifas': openModalTarifas,
    'closeModalsVintage': closeModalsVintage,
    'openModalPassenger': openModalPassenger,
    'closeModalDatepicker': closeModalDatepicker,
    '_openModalOriDes': _openModalOriDes,
    'openModalDatepicker': openModalDatepicker,
    'reloadOriDesModal': reloadOriDesModal
  };
}(jQuery);
"use strict";

dFrontJs.ibe_outsideclick = function () {
  /*eslint no-underscore-dangle: ["error", { "allow": ["_outsideDocumentClick", "_thisKeyup"] }]*/
  var _outsideDocumentClick = function (event) {
    var target = event.target ? event.target : window.event.srcElement;
    var $foco = $(target),
        $modal = $('.ibe-dinamic-modal');

    if (!$foco.closest('[data-close="outsideclick"]').length > 0 && !$modal.length > 0 && $('[data-close="outsideclick"]').hasClass('in')) {
      $('[data-close="outsideclick"]').collapse('hide');
    }
  };

  var init = function (selector, params) {
    $(document).off('click', _outsideDocumentClick);
    $(document).on('click', _outsideDocumentClick);
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_overlay = function () {
  /*eslint no-underscore-dangle: ['error', { 'allow': ['_clickEventOverlay', '_clickSearchBox', '_clickFocusSearcher', '_focusSearcherMobile', '_clickSearcherMobile', '_clickSeacherText'] }]*/
  var _clickEventOverlay = function (e) {
    e.preventDefault();
    $(this).hide();
    $('[data-click-toggle="popover"]').css('z-index', '');
    $('[data-function="data-focus-searcher"], .ibe-search-flights__search--overlay').css('z-index', '');
    $('[data-function="data-focus-searcher-mobile"], .ibe-search-flights__search--overlay').css('z-index', '');
    $('html').css({
      'overflow': ''
    });

    if (document.getElementById("home-CKI-Content-pop").style.display == "block") {
      document.getElementById("home-CKI-Content-pop").style.display = "none";
      document.getElementById("home-CKI-Content-pop").ariaHidden = "true";
      document.getElementById("home-CKI-processLink").style.zIndex = "";
    }
  }; //click margins y paddings


  var _clickSearchBox = function (e) {
    var $overlay = $('.ibe-overlay');
    var target = e.target || e.srcElement;
    if (target !== this) return;
    $overlay.hide();
  };

  var _clickFocusSearcher = function (e) {
    var $overlay = $('.ibe-overlay');

    if (window.innerWidth >= dFrontJs.resolutions.lg && !$overlay.is(':visible')) {
      $('[data-function="data-focus-searcher"]').css('z-index', '10000');
      $overlay.show();
    }
  };

  var _focusSearcherMobile = function (e) {
    var $overlay = $('.ibe-overlay');
    var active = $(e.currentTarget).parents('.ibe-accordion__collapse').siblings('[data-toggle="accordion"]').find('[data-function="data-focus-text"]');
    e.stopPropagation();

    if (window.innerWidth < dFrontJs.resolutions.lg && !$overlay.is(':visible')) {
      $('[data-function="data-focus-searcher-mobile"]').css('z-index', '10000');
      $('[data-function="data-focus-text"]').not(active).addClass('ibe-accordion__overlay-text');
      $('.ibe-overlay').show();
      $('.ibe-accordion__button').parent().addClass('ibe-accordion__overlay-button');
      active.removeClass('ibe-accordion__overlay-text');
    }
  }; //Click in Accordion Responsive Items in Search Component


  var _clickSearcherMobile = function () {
    var el = $(this),
        $text = el.siblings('[data-function="data-focus-text"]');
    $('.ibe-overlay').show();
    $('[data-function="data-focus-searcher-mobile"]').css('z-index', '10000');
    $text.removeClass('ibe-accordion__overlay-text');
    $('[data-function="data-focus-text"]').not($text).addClass('ibe-accordion__overlay-text');
    $('.ibe-accordion__button').parent().addClass('ibe-accordion__overlay-button');
  }; //Click in Links Responsive Items in Search Component


  var _clickSeacherText = function () {
    var el = $(this);
    $('.ibe-overlay').show();
    $('[data-function="data-focus-searcher-mobile"]').css('z-index', '10000');
    $('[data-function="data-focus-searcher-mobile"]').find('[data-function="data-focus-text"]').addClass('ibe-accordion__overlay-text');
    el.removeClass('ibe-accordion__overlay-text');
  };

  var init = function () {
    var $overlay = $('.ibe-overlay');
    var $focusSearcher = $('[data-function="data-focus-searcher"]');
    var $focusSearcherMobile = $('[data-function="data-focus-searcher-mobile"]');

    if (!$overlay.length > 0) {
      $('body').append('<div class="ibe-overlay"></div>');
      $overlay = $('.ibe-overlay');
    } // Controla algunas funcionalidades cuando se hace click sobre el overlay
    // 1 - Oculta el overlay
    // 2 - Quita atributo z-index a los popover desplegados con el atributo [data-click-toggle="popover"]
    // 3 - Quita atributo z-index a los elementos del buscador de la home


    $overlay.off('click', _clickEventOverlay);
    $overlay.on('click', _clickEventOverlay);
    $('.ibe-search-flights__search-box, [data-validate-searcher]').parent().off('click', _clickSearchBox);
    $('.ibe-search-flights__search-box, [data-validate-searcher]').parent().on('click', _clickSearchBox); // Control Overlay Buscador Desktop

    $focusSearcher.find('form').off('click focusin', _clickFocusSearcher);
    $focusSearcher.find('form').on('click focusin', _clickFocusSearcher); // Control Overlay Buscador Responsive

    $focusSearcherMobile.find('form').off('focusin', _focusSearcherMobile);
    $focusSearcherMobile.find('form').on('focusin', _focusSearcherMobile);
    $focusSearcherMobile.find('[data-toggle="accordion"] a').off('click', _clickSearcherMobile);
    $focusSearcherMobile.find('[data-toggle="accordion"] a').on('click', _clickSearcherMobile);
    $focusSearcherMobile.find('[data-toggle="accordion"] [data-function="data-focus-text"]').off('click', _clickSeacherText);
    $focusSearcherMobile.find('[data-toggle="accordion"] [data-function="data-focus-text"]').on('click', _clickSeacherText);
  };

  var showOverlay = function () {
    var $overlay = $('.ibe-overlay');

    if (!$overlay.is(':visible')) {
      $overlay.show();
    }
  };

  var hideOverlay = function () {
    var $overlay = $('.ibe-overlay');

    if ($overlay.is(':visible')) {
      $overlay.hide();
    }
  }; //init


  return {
    'init': init,
    'showOverlay': showOverlay,
    'hideOverlay': hideOverlay
  };
}(jQuery);
"use strict";

dFrontJs.ibe_passenger = function () {
  var $data_resident, $data_family;

  var init = function () {
    clickSaveValues();
    changeValues();
  };
  /* Guarda los valores de los radio buttons y actualiza el texto de pasajeros - Evento Click Botón 'Guardar' */


  var clickSaveValues = function () {
    $('.ibe-searcher__passenger [data-function="save-passenger"]').click(function () {
      var passenger = $(this).parents('.ibe-searcher__passenger');
      var content = $(this).parent();
      content.find('[data-passenger-resident-radio="data-passenger-resident-radio"]').find('.ibe_form__radio-input').each(function () {
        if ($(this).is(':checked')) {
          passenger.find('[data-passenger-resident="data-passenger-resident"]').text($(this).parent().find('label').text());
        }
      });
      content.find('[data-passenger-family-radio="data-passenger-family-radio"]').find('.ibe_form__radio-input').each(function () {
        if ($(this).is(':checked')) {
          passenger.find('[data-passenger-family="data-passenger-family"]').text($(this).parent().find('label').text());
        }
      });
      passenger.find('.ibe-searcher__passenger-button').trigger('click');
    });
  };
  /* Guarda los valores de los radio buttons y actualiza el texto de pasajeros - Evento Focus Radio Buttons */


  var changeValues = function () {
    $('.ibe-searcher__passenger [data-passenger-resident-radio="data-passenger-resident-radio"], .ibe-searcher__passenger [data-passenger-family-radio="data-passenger-family-radio"]').change(function () {
      var passenger = $(this).parents('.ibe-searcher__passenger');
      var content = $(this).parent();
      content.find('[data-passenger-resident-radio="data-passenger-resident-radio"]').find('.ibe_form__radio-input').each(function () {
        if ($(this).is(':checked')) {
          passenger.find('[data-passenger-resident="data-passenger-resident"]').text($(this).parent().find('label').text());
        }
      });
      content.find('[data-passenger-family-radio="data-passenger-family-radio"]').find('.ibe_form__radio-input').each(function () {
        if ($(this).is(':checked')) {
          passenger.find('[data-passenger-family="data-passenger-family"]').text($(this).parent().find('label').text());
        }
      });
    });
  }; /////////// Restore values of modals in searcher vintage ////////////////////////


  var getValues = function () {
    $tab = $('.ui-tabs-panel:visible'), $data_resident = $tab.find('[data-passenger-resident]').text();
    $data_family = $tab.find('[data-passenger-family]').text(); //-Restores radiobuttons in case of cancel modal

    $tab.find('input[name=resident]').each(function () {
      //-debugger
      if ($(this).next('label').text() === $data_resident) {
        $(this).prop('checked', true);
        return false;
      }
    });
    $tab.find('input[name=family]').each(function () {
      //-debugger
      if ($(this).next('label').text() === $data_family) {
        $(this).prop('checked', true);
        return false;
      }
    }); // end restores
  };

  var restore_values_family = function () {
    $tab.find('[data-passenger-resident]').text($data_resident);
    $tab.find('[data-passenger-family]').text($data_family);
  }; //----------------------------------------------------------------
  //init


  return {
    'init': init,
    'getValues': getValues,
    'restore_values_family': restore_values_family
  };
}(jQuery);
"use strict";

dFrontJs.ibe_placeholder = function () {
  //Jquery placeholder
  var init = function () {
    var $custom = $('[data-placeholder]');

    if ($custom.length > 0) {
      $custom.placeholder();

      if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) {
        $custom.blur(function () {
          var placeholderText = $(this).attr('placeholder');
          $(this).val() === placeholderText ? $(this).val('') : false;
          $(this).removeClass('ibe_form__input-text--ie-placeholder');
        });
        $custom.click(function () {
          var value;
          var placeholderText = $(this).attr('placeholder');
          $(this).val() === "" ? $(this).val(placeholderText) : false;
          value = $(this).val();
          checkPlaceHolder(value, placeholderText) ? $(this).addClass('ibe_form__input-text--ie-placeholder') : $(this).removeClass('ibe_form__input-text--ie-placeholder');
        });
        $custom.change(function () {
          var placeholderText = $(this).attr('placeholder');
          var value = $(this).val();
          checkPlaceHolder(value, placeholderText) ? $(this).addClass('ibe_form__input-text--ie-placeholder') : $(this).removeClass('ibe_form__input-text--ie-placeholder');
        });
      }
    }
  }; //pluginPlaceholder


  var checkPlaceHolder = function (value, placeholder) {
    if (value === "" || value === placeholder) {
      return true;
    }
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_popover = function () {
  /*eslint no-underscore-dangle: ['error', { 'allow': ['_showPopoverOverlay', '_shownPopover', '_hidePopover','_documentClickPopover'] }]*/
  var toggleMsg = function (status) {
    var txt;
    status ? txt = $msgToggle.data('status-open') : txt = $msgToggle.data('status-close');
    $msgToggle.text(txt);
  }; // Inmediatly show event


  var _showPopoverOverlay = function () {
    $('.ibe-overlay').show();
  }; // When Finish animation, run shown event


  var _shownPopover = function () {
    var $element = $('[data-toggle="popover"]');
    $msgToggle = $('[data-toggle-status="true"]');
    $element.next().attr('aria-hidden', 'false');

    if ($msgToggle.length > 0) {
      toggleMsg(true);
    }

    dFrontJs.ibe_inputs.init(); //dFrontJs.validationForm.init();

    dFrontJs.ibe_validate.init();
    dFrontJs.modalFunction.init(); //params: (element, modalButton, appendTo);

    dFrontJs.ibe_modal.init();
    $element.parents().find('[data-function="ibe-popover-content"]').trigger('change');

    if ($('[data-function="show-qr"]').length) {
      dFrontJs.ibe_qr.init('[data-function="show-qr"]');
    }

    $('[data-toggle="popover"] + .popover').on('focusout', function () {
      var buttonParent = $(this).parent();
      setTimeout(function () {
        if (buttonParent.has(':focus, .new-clicked-element').length === 0) {
          buttonParent.find('.ibe-button--white-effect').removeClass('active').css('z-index', '');

          if (buttonParent.find('.popover').is(':visible')) {
            buttonParent.find('.popover').popover('hide').data('bs.popover').inState.click = false;
            buttonParent.find('.ibe-button--white-effect').css('z-index', '');
            $('body').removeClass('fc-show-popover');
            $('.ibe-overlay').hide();
            $('[data-function="data-focus-searcher-mobile"], [data-function="data-focus-searcher"]').css('z-index', '');
          }
        }
      }, 200);
    });
  };

  var _hidePopover = function (e) {
    var $element = $('[data-toggle="popover"]');
    $msgToggle = $('[data-toggle-status="true"]');
    $element.next().attr('aria-hidden', 'true');

    if ($msgToggle.length > 0) {
      toggleMsg(false);
    }
  };

  var _documentClickPopover = function (e) {
    $('[data-toggle="popover"]').each(function () {
      if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
        if ($('.popover .popover-content').length) {
          $(this).parent().find('.popover .popover-content input').each(function () {
            $(this).attr('value', $(this).val());
          });
          $(this).parent().find('.popover .popover-content input:checked').each(function () {
            $(this).attr('checked', 'checked');
          });
          $(this).parent().find('.popover .popover-content input[checked="checked"]:not(:checked)').each(function () {
            $(this).removeAttr('checked');
          });
          $(this).parent().find('[data-function="ibe-popover-content"]').html($(this).parent().find('.popover .popover-content').html());
          $(this).popover('hide').data('bs.popover').inState.click = false; // fix for BS 3.3.6

          $(this).parent().removeClass('xui-icon-share-active');
          dFrontJs.ibe_inputs.init();
        }
      }
    });
  }; //Jquery popover


  var init = function () {
    var $elementOverlay = $('[data-click-toggle="popover"]');
    var $element = $('[data-toggle="popover"]');
    var lastModal, po, eventTouch;
    $element.next().attr('aria-hidden', 'true');
    $msgToggle = $('[data-toggle-status="true"]');

    if ($element.length > 0) {
      $element.popover({
        sanitize: false,
        html: true,
        content: function () {
          return $(this).parent().find('[data-function="ibe-popover-content"]').html();
        } //trigger:'click'

      });
    }

    $elementOverlay.off('show.bs.popover', _showPopoverOverlay);
    $elementOverlay.on('show.bs.popover', _showPopoverOverlay);
    $element.off('shown.bs.popover', _shownPopover);
    $element.on('shown.bs.popover', _shownPopover);
    $element.off('hidden.bs.popover', _hidePopover);
    $element.on('hidden.bs.popover', _hidePopover);
    $(document).off('click', _documentClickPopover);
    $(document).on('click', _documentClickPopover); //Control Popover Focus - Home

    if ($('.ibe-home').length) {
      lastModal = '';
      po;
      eventTouch;

      if (is_touch_device()) {
        eventTouch = 'touchend';
      } else {
        eventTouch = 'focusin';
      }

      $('[data-toggle="popover"].ibe-button--white-effect').on(eventTouch, function (e) {
        var target, tar, $elem;
        $('.ibe-button--white-effect').removeClass('active').css('z-index', '');
        $(this).addClass('active').css('z-index', '1002');
        target = e.target || e.srcElement;
        tar = $(target);

        if (lastModal !== target) {
          lastModal = target;

          if ($('.popover').is(':visible')) {
            $('.popover').popover('hide').data('bs.popover').inState.click = false;
          }

          $('.ibe-overlay').hide();
          $('[data-function="data-focus-searcher-mobile"], [data-function="data-focus-searcher"]').css('z-index', '');
        }

        $elem = $(this);

        if (!$('body').hasClass('fc-show-popover')) {
          $('body').addClass('fc-show-popover');
          $('body').on('click', function po(e) {
            var target = e.target || e.srcElement;
            var tar = $(target);
            var buttonParent;

            if ($elem.parent().find(tar).length) {
              $(target).addClass('new-clicked-element');
              setTimeout(function () {
                $('.new-clicked-element').removeClass('new-clicked-element');
              }, 200);
            } else {
              buttonParent = $elem.parent();
              buttonParent.find('.ibe-button--white-effect').removeClass('active');
              $('body').removeClass('fc-show-popover');
              setTimeout(function () {
                if (buttonParent.has(':focus, .new-clicked-element').length === 0) {
                  if (buttonParent.find('.popover').is(':visible')) {
                    buttonParent.find('.popover').popover('hide').data('bs.popover').inState.click = false;
                    $('.ibe-overlay').hide();
                    $('[data-function="data-focus-searcher-mobile"], [data-function="data-focus-searcher"]').css('z-index', '');
                    buttonParent.find('.ibe-button--white-effect').css('z-index', '');
                  }

                  $('body').unbind('click', po);
                }
              }, 200);
            }
          });
        }
      });
      $('[data-toggle="popover"].ibe-button--white-effect').on('blur', function () {
        var buttonParent = $(this).parent();
        setTimeout(function () {
          if (buttonParent.has(':focus, .new-clicked-element').length === 0) {
            buttonParent.find('.ibe-button--white-effect').removeClass('active').css('z-index', '');

            if (buttonParent.find('.popover').is(':visible')) {
              $('body').removeClass('fc-show-popover');
              buttonParent.find('.popover').popover('hide').data('bs.popover').inState.click = false;
              buttonParent.find('.ibe-button--white-effect').css('z-index', '');
              $('.ibe-overlay').hide();
              $('[data-function="data-focus-searcher-mobile"], [data-function="data-focus-searcher"]').css('z-index', '');
            }
          }
        }, 200);
      });
    }
  }; //pluginPopover


  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_progressbar = function () {
  //init
  var init = function () {
    var $element = $('[data-progressbar]'),
        progress = $element.data('progressbar');
    if ($element.length > 0) $element.progressbar({
      value: progress
    });
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: video
//    Descripcion: Funciones video html5
//******************************************************************************/
dFrontJs.ibe_qr = function (selector) {
  var init = function (selector) {
    var element;
    $(selector).on('click mouseover touchstart', function (event) {
      element = $(this).find('.ibe-infocheckin__qr');

      if (!element.is(':visible')) {
        element.show();
        element.attr('aria-hidden', false); // element.slideToggle("fast");

        element.position({
          of: element.parent(),
          my: 'right top',
          at: 'right bottom',
          collision: 'fit'
        });
        dFrontJs.app.emitInView();
      }
    });
    $(selector).on('mouseout touchleave', function (event) {
      element = $(this).find('.ibe-infocheckin__qr');

      if (element.is(':visible')) {
        element.hide();
        element.attr('aria-hidden', true); // element.slideToggle("fast");
      }
    });
  }; //public functions


  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_read_more = function () {
  var initialHeight;

  var _openClick = function (elem, callback) {
    var eventOpen = new CustomEvent('open');
    var $elem = elem !== undefined ? $(elem) : $('[data-read-more="button"]');
    var box, initHeight, heightCss, heightElem, children, eventOpenCreated;
    var callFunction = callback !== undefined ? callback : '';

    if (typeof callFunction === 'function') {
      $elem[0].addEventListener('open', callFunction);
    }

    for (var i = 0; $elem.length > i; i++) {
      box = $($elem[i]).parent().find('[data-read-more="content"]');
      initHeight = box.outerHeight();
      heightCss = parseFloat(box.css('max-height'));

      if (initHeight >= heightCss) {
        heightElem = 0;
        children = box[0].children;
        initialHeight = box.outerHeight();

        for (var index = 0; index < children.length; index++) {
          heightElem += $(children[index]).outerHeight(true);
        }

        box.css('height', initialHeight);
        box.css('max-height', 'inherit');
        box.addClass('active');
        $elem.attr('data-read-more-status', 'opened');
        $elem.text($elem.data('text-opened'));
        $elem.removeClass('icon-flecha_1_abajo');
        $elem.addClass('icon-flecha_1_arriba');
        $elem.attr('aria-expanded', 'true');
        requestAnimFrame(function () {
          box.animate({
            height: heightElem
          }, 500, 'swing'); // Disparar event.

          $elem[0].dispatchEvent(eventOpen);
        });
      }
    }
  };

  var _closeClick = function (elem, callback) {
    var eventClose = new CustomEvent('close');
    var $elem = elem !== undefined ? $(elem) : $('[data-read-more="button"]');
    var box = $elem.parent().find('[data-read-more="content"]');
    var callFunction = callback !== undefined ? callback : '';

    if (typeof callFunction === 'function') {
      $elem[0].addEventListener('close', callFunction);
    }

    $elem.attr('data-read-more-status', 'collapsed');
    $elem.text($elem.data('text-collapsed'));
    $elem.removeClass('icon-flecha_1_arriba');
    $elem.addClass('icon-flecha_1_abajo');
    $elem.attr('aria-expanded', 'false');

    if (initialHeight === undefined) {
      initialHeight = box.outerHeight(true);
      box.data('height', initialHeight);
    }

    requestAnimFrame(function () {
      box.animate({
        height: initialHeight
      }, 500, 'swing', function () {
        box.removeClass('active');
        box.css('max-height', '');
      }); // Disparar event.

      $elem[0].dispatchEvent(eventClose);
    });
  };

  var open = function (elem, callback) {
    var $elem = elem !== undefined ? $(elem) : $('[data-read-more="button"]');

    if ($elem.attr('data-created') !== 'true') {
      $elem[0].addEventListener('created', function (e) {
        _openClick(e.target, callback);
      });
    } else {
      _openClick(elem, callback);
    }
  };

  var close = function (elem, callback) {
    var $elem = elem !== undefined ? $(elem) : $('[data-read-more="button"]');

    if (!$elem.attr('data-created') !== true) {
      $elem[0].addEventListener('created', function (e) {
        _closeClick(e.target, callback);
      });
    } else {
      _closeClick(elem, callback);
    }
  };

  var destroy = function (elem) {
    var $elem = elem !== undefined ? $(elem) : $('[data-read-more="button"]');

    if ($elem.hasAttribute('data-created')) {
      $elem.removeAttr('data-created', '');
    }
  };

  var _onClickFunction = function (e) {
    var elem = e.currentTarget;
    var $elem = $(elem);
    var status = $elem.attr('data-read-more-status') !== undefined ? $elem.attr('data-read-more-status') : 'collapsed';

    if (status === 'collapsed') {
      _openClick(elem);
    } else {
      _closeClick(elem);
    }
  };

  var init = function (selector) {
    var eventCreated = new CustomEvent('created');
    var $button = selector !== undefined ? $(selector) : $('[data-read-more="button"]');
    var box, initHeight, heightCss;

    for (var i = 0; $button.length > i; i++) {
      box = $($button[i]).parent().find('[data-read-more="content"]');
      initHeight = box.outerHeight();
      heightCss = parseFloat(box.css('max-height')); // console.log(box.css('overflow'), box.css('max-height'));
      //
      // console.log(initHeight, heightCss);

      if (initHeight >= heightCss) {
        $($button[i]).on('click', _onClickFunction);
      } else {
        $($button[i]).hide();
      }

      $($button[i]).attr('data-created', true); // Disparar event.

      $button[i].dispatchEvent(eventCreated);
    }
  };

  return {
    'init': init,
    'open': open,
    'close': close
  };
}(jQuery);
"use strict";

//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: resize
//    Descripcion: Funcion para realizar resize solo en puntos de corte
//******************************************************************************/
dFrontJs.ibe_resize = function () {
  //init
  var init = function () {
    resolutionChange(window.innerWidth);
  };

  var resolutionChange = function (newSize) {
    var actualSize = 0;
    var resolutionCheck = dFrontJs.resolutions; //para añadir la resolución 135 por ejemplo usaríamos -> resolutionCheck["zx"] = 135;

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
  };

  return {
    'init': init,
    'resolutionChange': resolutionChange
  };
}(jQuery);
"use strict";

/* Menu responsive de Iberia */
dFrontJs.ibe_responsive_menu = function () {
  var init = function () {
    $('[data-menu-responsive="old"]').click(function (e) {
      if ($(this).hasClass('on')) {
        $('.ibe-responsive__main-menu .ibe-responsive__main-menu-container').animate({
          'left': '-100%'
        }, {
          duration: 250,
          complete: function () {
            $('.ibe-responsive__main-menu').hide();
          }
        });
        $(this).removeClass('on');
      } else {
        $('.ibe-responsive__main-menu').show();
        $('.ibe-responsive__main-menu .ibe-responsive__main-menu-container').animate({
          'left': '0'
        }, 250);
        $(this).addClass('on');
      }
    });
  }; //ibeResponsiveMenu


  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_scrollTop = function () {
  /*eslint no-underscore-dangle: ['error', { 'allow': ['_clickEventScroll', '_actionShowTimer'] }]*/
  //Scroll top function
  var _clickEventScroll = function (e) {
    var target = e.target || e.srcElement;
    var typeTarget = $(this).attr('data-scrollTop');
    var targetPos;

    switch (typeTarget) {
      case 'input':
        if ($(target).is('input')) {
          $('html, body').animate({
            scrollTop: $(this).offset().top
          }, 500);
        }

        break;

      case 'timer':
        targetPos = $(this);

        if ($(target).parents('.ibe-accordion__header-mobile').length || window.innerWidth < dFrontJs.resolutions.lg && ($(target).parents('.ibe-accordion__collapse').length === 0 || $(target).is('[data-searcher-accordion="first"] input[data-autocomplete="cities"]'))) {
          targetPos.find('[data-toggle="container"]').eq(0).off('shown.bs.collapse', _actionShowTimer);
          targetPos.find('[data-toggle="container"]').eq(0).on('shown.bs.collapse', _actionShowTimer);
        } else if (window.innerWidth < dFrontJs.resolutions.lg && ($(target).closest('.ibe_form__group-half').length || $(target).is('input[data-cal]') || $(target).siblings('input[data-cal]').length) && $(target).closest('.fc_form_group').find('.ibe-searcher__calendar-header:visible').length === 0) {
          setTimeout(function () {
            $('html, body').animate({
              scrollTop: $(target).closest('.ibe_form__group--half').offset().top
            }, 500);
          }, 500);
        }

        break;

      case 'partner':
        //-if(window.innerWidth < dFrontJs.resolutions.xl){
        targetPos = $(this).attr('href');
        setTimeout(function () {
          $('html, body').animate({
            scrollTop: $(targetPos).offset().top
          }, 600);
        }, 500); //-}

        break;

      case 'conditions':
        e.preventDefault();
        targetPos = $(this).attr('href');
        setTimeout(function () {
          $('html, body').animate({
            scrollTop: $(targetPos).offset().top
          }, 500);
        }, 500);
        break;

      case undefined:
        break;

      default:
        $('html, body').animate({
          scrollTop: $(this).offset().top
        }, 500);
    }
  };

  var _actionShowTimer = function (e) {
    if ($(e.target).prev('[data-toggle="accordion"]').length > 0) {
      requestAnimFrame(function () {
        $('html, body').animate({
          scrollTop: $(e.target).prev('[data-toggle="accordion"]').offset().top
        }, 500);
      });
    }
  }; // Example:
  // dFrontJs.ibe_scrollTop.scrollId('#id',600);
  // Params:
  //      [selector] as string (default: html )
  //      [time] as number (default: 500)


  var scrollId = function (selector, time) {
    var $selector = selector || 'html';
    var $time = time || 500;
    $('html, body').animate({
      scrollTop: $($selector).offset().top
    }, $time);
  };

  var init = function () {
    var $element = $('[data-scrollTop]');

    if ($element.length) {
      $element.off('click', _clickEventScroll);
      $element.on('click', _clickEventScroll);
    }
  }; //Scroll top function


  return {
    'init': init,
    'scrollId': scrollId
  };
}(jQuery);
"use strict";

dFrontJs.ibe_searcher_accordion_mobile = function () {
  /*eslint no-underscore-dangle: ['error', { 'allow': ['_activateTabAccordion', '_inputsFull', '_slideInputFocus', '_slideFirstClick', '_linkAccordionClick', '_preventNavigationLinksClick'] }]*/
  //Linka los tabs seleccionados en desktop con los accordion que deben abrirse en responsive
  var _activateTabAccordion = function () {
    var self = this;

    if (window.innerWidth < dFrontJs.resolutions.lg) {
      setTimeout(function () {
        $('[data-tab-view="desktop"]').tabs('option', 'active', parseInt($('.ibe-searcher [data-tab-view="responsive"] [data-active].collapsed').attr('data-active')));
        $(self).closest('.ibe-accordion').append($('#last-searchs-mobile').closest('.ibe-last-searchs').detach());
      });
    }
  };

  var _inputsFull = function () {
    var inputs = $('[data-fligths-collapse-mobile="button"]');
    var container = $('[data-fligths-collapse-mobile="collapse"]');

    if (inputs.eq(0).val() !== "" && inputs.eq(1).val() !== "") {
      setTimeout(function () {
        container.slideDown('slow');
      });
    }
  };

  var _slideInputFocus = function () {
    var container = $('[data-fligths-collapse-mobile="collapse"]');
    setTimeout(function () {
      container.slideDown('slow');
    });
  }; //Colapsa y deja visible por defecto los 2 primeros inputs del primer accordion del buscador


  var _slideFirstClick = function (e) {
    var searcher = $('.ibe-searcher');
    var inputs = $('[data-fligths-collapse-mobile="button"]');

    if (inputs.eq(0).val() !== "" && inputs.eq(1).val() !== "") {
      setTimeout(function () {
        searcher.find('[data-fligths-collapse-mobile="collapse"]').slideDown('slow');
      });
    } else {
      setTimeout(function () {
        searcher.find('[data-fligths-collapse-mobile="collapse"]').slideUp('slow');
      });
    }
  }; //Permite clickar sobre los enlaces en forma de accordion


  var _linkAccordionClick = function (e) {
    var $this = $(this);

    if ($('.ibe-overlay').is(':visible')) {
      $this.children('[data-function="data-focus-text"]').toggleClass('ibe-accordion__overlay-text');

      if ($this.find('a').attr('target')) {
        window.open($this.find('a').attr('href'), $this.find('a').attr('target'));
      } else if ($this.find('a').length > 0) {
        window.location.href = $this.find('a').attr('href');
      } else {
        $this.find('button.link').click();
        e.stopPropagation();
      }
    }
  }; //Previene la navegación de los elementos <a> de los tabs


  var _preventNavigationLinksClick = function (e) {
    e.preventDefault();
  };

  var init = function () {
    var btn = $('[data-fligths-collapse-mobile="button"]');
    var first = $('.ibe-searcher').find('[data-searcher-accordion="first"] [data-prevent="click"]');
    btn.off('focus', _slideInputFocus);
    btn.on('focus', _slideInputFocus);
    first.off('click', _slideFirstClick);
    first.on('click', _slideFirstClick);
    $('[data-fligths-collapse-mobile="button-tab"]').off('click', _preventNavigationLinksClick);
    $('[data-fligths-collapse-mobile="button-tab"]').on('click', _preventNavigationLinksClick);
    $('[data-tab-searcher="data-tab-searcher"]').find('[data-toggle="link"]').off('click', _linkAccordionClick);
    $('[data-tab-searcher="data-tab-searcher"]').find('[data-toggle="link"]').on('click', _linkAccordionClick);
    moveContentResponsive();
    $('[data-tab-view="responsive"] .ibe-tab__container .ibe-accordion [data-active]').off('click', _activateTabAccordion);
    $('[data-tab-view="responsive"] .ibe-tab__container .ibe-accordion [data-active]').on('click', _activateTabAccordion);
    $('[data-searcher-accordion="first"]').find('.hidden-xl [data-city-list="collapse"]').off('focusout click', _inputsFull);
    $('[data-searcher-accordion="first"]').find('.hidden-xl [data-city-list="collapse"]').on('focusout click', _inputsFull);
  };

  var showFirst = function () {
    var searcherAccordion = $('[data-searcher-accordion]'),
        $ibSearcher = $('.ibe-searcher'),
        inputs;

    if (searcherAccordion.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
      //Colapsa los data-searcher-accordion="others"
      $('[data-searcher-accordion="others"] [data-header-searcher]').removeClass('collapsed').siblings('.collapse.in').collapse('hide'); //Colapsa el data-searcher-accordion="first" y lo pone en su estado original (mostrando 2 inputs)

      $ibSearcher.find('[data-searcher-accordion="first"] [data-header-searcher="collapsed"]').addClass('collapsed').siblings('[data-toggle="container"].ibe-accordion__collapse').collapse('show').removeClass('collapsed').addClass('collapse in').css('min-height', ''); //Colapsa todos los collapses al pulsar fuera

      $ibSearcher.find('[data-searcher-accordion] [data-header-searcher="collapsed"] + [data-toggle="container"] .collapse.in').collapse('hide');
      inputs = $('[data-fligths-collapse-mobile="button"]');

      if ($ibSearcher.find('[data-searcher-accordion="first"] [data-header-searcher="collapsed"]').hasClass('collapsed') && inputs.eq(0).val() !== "" && inputs.eq(1).val() !== "") {
        requestAnimFrame(function () {
          $ibSearcher.find('[data-fligths-collapse-mobile="collapse"]').slideDown('slow');
        });
      } else {
        requestAnimFrame(function () {
          $ibSearcher.find('[data-fligths-collapse-mobile="collapse"]').slideUp('slow');
        });
      }

      $ibSearcher.find('[data-function="data-focus-text"]').removeClass('ibe-accordion__overlay-text');
      $ibSearcher.find('.ibe-accordion__button').parent().removeClass('ibe-accordion__overlay-button');
      $ibSearcher.find('[data-function="data-focus-searcher-mobile"]').css('z-index', '');
      $('[data-tab-view="desktop"]').tabs('option', 'active', parseInt($ibSearcher.find('[data-tab-view="responsive"] [data-active].collapsed').attr('data-active')));
    }
  }; //Permite clickar sobre los enlaces en forma de accordion


  var linkAccordion = function () {
    $('[data-tab-searcher="data-tab-searcher"]').find('[data-toggle="link"]').click(function (e) {
      var $this = $(this);

      if ($('.ibe-overlay').is(':visible')) {
        $this.children('[data-function="data-focus-text"]').toggleClass('ibe-accordion__overlay-text');

        if ($this.find('a').attr('target')) {
          window.open($this.find('a').attr('href'), $this.find('a').attr('target'));
        } else if ($this.find('a').length > 0) {
          window.location.href = $this.find('a').attr('href');
        } else {
          $this.find('button.link').click();
          e.stopPropagation();
        }
      }
    });
  }; //Mueve los campos del formulario del buscador de Móvil a Desktop


  var moveContentResponsive = function (e) {
    var tabDesktop = $('[data-move="tab"]');
    var tabMobile = $('[data-move="tab-mobile"]');
    tabDesktop.each(function (index, value) {
      var i;
      var parentDesktop = $(this).find('[data-move="parent"]');
      var parentMobile = tabMobile.eq(index).find('[data-move="parent-mobile"]');

      for (i = 0; i < $(this).find(parentDesktop).length; i++) {
        var equivalentMobile = getObjectPosition(parentMobile, parentDesktop.eq(i).data('position'));
        parentDesktop.eq(i).children().prependTo(equivalentMobile);
        parentDesktop.eq(i).hasClass('ibe_form__group--half-only-round') ? equivalentMobile.addClass('ibe_form__group--half-only-round') : '';
      } // }

    });

    function getObjectPosition(array, position) {
      var i;

      for (i = 0; i < array.length; i++) {
        if (array.eq(i).data('position-mobile') === position) {
          return array.eq(i);
        }
      }
    }
  }; //init


  return {
    'init': init,
    'showFirst': showFirst
  };
}(jQuery);
"use strict";

dFrontJs.ibe_searcher_accordion = function () {
  /*eslint no-underscore-dangle: ['error', { 'allow': ['_activateTabAccordionDesktop'] }]*/
  //Linka los tabs seleccionados en desktop con los accordion que deben abrirse en responsive
  var _activateTabAccordionDesktop = function (e) {
    e.stopPropagation();
    setTimeout(function () {
      var $active = $('[data-tab-view="desktop"]').tabs('option', 'active');
      var $accordions = $('[data-tab-view="responsive"] [data-active]');
      $accordions.eq($active).click();
    });
  };

  var init = function () {
    moveContentResponsive();
    $('[data-tab-view="desktop"] > .ibe-tab__scroll .ibe-tab__menu-item a').off('click', _activateTabAccordionDesktop);
    $('[data-tab-view="desktop"] > .ibe-tab__scroll .ibe-tab__menu-item a').on('click', _activateTabAccordionDesktop); // dFrontJs.ibe_searcher_calendar.init();
  }; //Mueve los campos del formulario del buscador de Móvil a Desktop


  var moveContentResponsive = function (e) {
    var tabDesktop = $('[data-move="tab"]');
    var tabMobile = $('[data-move="tab-mobile"]');
    tabMobile.each(function (index, value) {
      var i;
      var parentMobile = $(this).find('[data-move="parent-mobile"]');
      var parentDesktop = tabDesktop.eq(index).find('[data-move="parent"]');

      for (i = 0; i < $(this).find(parentMobile).length; i++) {
        parentMobile.eq(i).children().prependTo(getObjectPosition(parentDesktop, parentMobile.eq(i).data('position-mobile')));
      }
    });

    function getObjectPosition(array, position) {
      var i;

      for (i = 0; i < array.length; i++) {
        if (array.eq(i).data('position') === position) {
          return array.eq(i);
        }
      }
    }
  }; //init


  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_searcher_vintage = function () {
  /*eslint no-underscore-dangle: ['error', { 'allow': ['_buttonClickShowHide', '_resizeSearcherVintage'] }]*/
  var _buttonClickShowHide = function () {
    var $this = $(this);

    if ($this.parent().hasClass('active')) {
      $this.parent().removeClass('active');
      $('html, body').css('overflow', '');
    } else {
      if ($('[data-autocomplete="cities"]').length > 0) {
        dFrontJs.ibe_autocomplete.loadCityList($('[data-autocomplete="cities"]'));
      }

      $this.parent().addClass('active');
      $('html, body').css('overflow', 'hidden');
    }
  };

  var _resizeSearcherVintage = function () {
    var $this = $('.ibe-searcher__vintage').find('.ibe-accordion__header');

    if (window.innerWidth >= dFrontJs.resolutions.lg) {
      if ($this.parent().hasClass('active')) {
        $this.parent().removeClass('active');
        $('html, body').css('overflow', '');
        $this.next().collapse('hide');
      }

      if ($('[data-autocomplete="cities"]').length > 0) {
        dFrontJs.ibe_autocomplete.loadCityList($('[data-autocomplete="cities"]'));
      }
    }
  };

  var init = function () {
    var $accordion = $('.ibe-searcher__vintage').find('.ibe-accordion__header');
    $accordion.off('click', _buttonClickShowHide);
    $accordion.on('click', _buttonClickShowHide);
    $(window).off('resize', _resizeSearcherVintage);
    $(window).on('resize', _resizeSearcherVintage);
  }; //init


  return {
    'init': init,
    'buttonClickShowHide': _buttonClickShowHide
  };
}(jQuery);
"use strict";

//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: Calendario
//    Descripcion: Calendario en buscador de vuelos
//******************************************************************************/
dFrontJs.ibe_searcher_calendar = function () {
  /*eslint no-underscore-dangle: ['error', { 'allow': ['_inputsKeyup', '_buttonCalendarTouchFocusClick', '_calStartFocus', '_roundtripFunction', '_oneWayFunction',
  '_disableCollapse', '_preventClicks', '_inputsBlur','_focusoutFunction', '_changefromFunction', '_changeEndFunction', '_defaults','_updateDatepicker','_get',
  '_mouseoverTDtoFunction', '_mouseoverTDtoFunction', '_touchStartFunction', '_mouseoverTDfromFunction', '_disableRound'] }]*/
  var endTimeCalendar;

  var getDatePickerMaxDate = function (selector) {
    var maxValue = $(selector).attr('data-maxrange') || '361';
    maxValue = parseInt(maxValue, 10);

    if (!isNaN(maxValue)) {
      if (maxValue > 1) {
        return maxValue - 1 + '';
      } else {
        return '1';
      }
    }

    return '360';
  };

  var dateParser = function (date, format) {
    var dateParts = date.split('/');

    if (format === 'DD/MM/YYYY') {
      return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    }

    return new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
  };

  var checkDate = function (date, format) {
    if (format === 'DD/MM/YYYY') {
      return /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/.test(date);
    }

    return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/.test(date);
  };

  var _inputsKeyup = function (e) {
    var $this = $(this),
        $first_parent = $this.closest('.ibe_form__group--half'),
        $from_calendar = $first_parent.find('[data-function="cal-start"]'),
        $to_calendar = $first_parent.find('[data-function="cal-end"]'),
        input_from = $first_parent.find('[data-cal="start"]'),
        input_to = $first_parent.find('[data-cal="end"]').length > 0 ? $first_parent.find('[data-cal="end"]') : input_from,
        key = e.which,
        $vintage = $('.ibe-searcher__vintage'),
        $colDate = $vintage.find('.ibe-searcher__col--date'),
        $modal = $('.ibe-dinamic-modal');
    var datepicker = {
      minDate: 0,
      maxDate: getDatePickerMaxDate($from_calendar)
    };
    var dataCal, value, dateFormat, date, group, today, dataDayCalendar, dateRestriction, dataHour, dataNumDays, value_from, date_from, value_to, date_to;
    var errorDate; //- 10 Maximun date caracterers in imputs data calendars

    if ($this.attr('data-cal').length > 0 && $this.val().length > 10) {
      dataCal = $this.val();
      $this.val(dataCal.substr(0, 10));
    } //- ///////////////////////////////////////////////////////
    // Journeys without calendar-end


    if ($this.parents('[data-journey]').length > 0 && $this.val().length === 0) {
      requestAnimFrame(function () {
        $from_calendar.datepicker('setDate', -1);
        $from_calendar.data('datesRange', [null, null]);
        $from_calendar.datepicker('refresh');
        dFrontJs.ibe_journey.controlDates(input_from);
      });
    }

    if (e.target.value.length === 10 && key !== 8 && key !== 46 && key !== 9 && key !== 229 && key !== 37 && key !== 39) {
      value = e.target.value;
      dateFormat = $this.data('format');
      date = dateParser(value, dateFormat);
      group = $(e.target).closest('.ibe_form__group--half');
      today = new Date(new Date().setHours(0, 0, 0, 0));
      dataDayCalendar = group.closest('[data-hour-restriction]');
      focusDatepicker(e.target);

      if (dataDayCalendar.length > 0) {
        dateRestriction = new Date();
        dataHour = parseInt(dataDayCalendar.eq(0).data()['hourRestriction']);
        dateRestriction.setMilliseconds(dataHour * 60 * 60 * 1000); //Horas por segundos/hora

        dateRestriction.setHours(0);
        dateRestriction.setMinutes(0);
        dateRestriction.setSeconds(0);
        dataNumDays = dataDayCalendar.length ? parseInt(dataDayCalendar.eq(0).data()['hourRestriction']) : 0;
      }
      /*if (!input_from.hasClass('initRangeDatepicker')) {
      	input_from.addClass('initRangeDatepicker');
      	$from_calendar.datepicker('option', 'beforeShowDay', rangeDays);
      	if (!$this.parents('[data-journey="parent"]').length > 0) {
      		input_to.addClass('initRangeDatepicker');
      		requestAnimFrame(function () {
      			$to_calendar.datepicker('option', 'beforeShowDay', rangeDays);
      		});
      	}
      }*/


      errorDate = true;

      if (!checkDate(value, dateFormat)) {
        group.addClass('ibe_form__group--error');
        group.find('[data-validate]').addClass('hidden');
        group.find('[data-validate="parse"]').removeClass('hidden');

        if ($('.ibe-dinamic-modal').length > 0) {
          group.closest('.ibe-dinamic-modal').removeClass('ibe-dinamic-modal');
        }
      } else if (date.getTime() > new Date().setDate(new Date().getDate() + datepicker.maxDate)) {
        group.addClass('ibe_form__group--error');
        group.find('[data-validate]').addClass('hidden');
        group.find('[data-validate="max"]').removeClass('hidden');
      } else if (date.getTime() < new Date(today)) {
        group.addClass('ibe_form__group--error');
        group.find('[data-validate]').addClass('hidden');
        group.find('[data-validate="valid"]').removeClass('hidden');
      } else if (date.getTime() < dateRestriction) {
        group.addClass('ibe_form__group--error');
        group.find('[data-validate]').addClass('hidden');
        group.find('[data-validate="restriction"]').removeClass('hidden');
      } else {
        group.find('[data-validate="max"]').addClass('hidden');
        group.find('[data-validate="valid"]').addClass('hidden');
        group.find('[data-validate="restriction"]').addClass('hidden');
        group.find('[data-validate="parse"]').addClass('hidden');

        if (!group.find('[data-validate]').not('.hidden').length) {
          group.removeClass('ibe_form__group--error');
        }

        errorDate = false;
      }

      if (input_from.val().length === 10 && input_to.val().length !== 10 && !errorDate && dFrontJs.ibe_validations_searcher.dateValidator(group)) {
        if ($modal.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
          // Only oneway
          requestAnimFrame(function () {
            if (input_from.val() !== "" && $('input[data-click="oneway"]').length > 0 && !$('input[data-click="oneway"]').is(':checked')) {
              dFrontJs.ibe_dinamic_modal.close(input_from);
            }
          });
        }

        $from_calendar.datepicker('setDate', date);
        $to_calendar.datepicker('setDate', date);
        $to_calendar.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');
        $to_calendar.find('td.range').removeClass('range');
        $from_calendar.find('td.range').removeClass('range');
        $from_calendar.data('datesRange', [date, null]);
        $to_calendar.data('datesRange', [date, null]);
        $from_calendar.trigger('change');
        $from_calendar.datepicker('refresh');
        $to_calendar.datepicker('refresh');
      } else if (input_from.val().length !== 10 && input_to.val().length === 10 && !errorDate && dFrontJs.ibe_validations_searcher.dateValidator(group)) {
        $from_calendar.datepicker('setDate', date);
        $to_calendar.datepicker('setDate', date);
        $from_calendar.data('datesRange', [null, date]);
        $to_calendar.data('datesRange', [null, date]);
        input_from.focus();
        $to_calendar.trigger('change');
        $from_calendar.datepicker('refresh');
        $to_calendar.datepicker('refresh');
      } else if (input_from.val().length === 10 && input_to.val().length === 10 && !errorDate && dFrontJs.ibe_validations_searcher.dateValidator(group)) {
        dateFormat = $this.data('format');
        value_from = input_from.val();
        date_from = dateParser(value_from, dateFormat);
        value_to = input_to.val();
        date_to = dateParser(value_to, dateFormat);
        $from_calendar.datepicker('setDate', date_from);
        $to_calendar.datepicker('setDate', date_to);
        $from_calendar.data('datesRange', [$from_calendar.datepicker('getDate'), $to_calendar.datepicker('getDate')]);
        $to_calendar.data('datesRange', [$from_calendar.datepicker('getDate'), $to_calendar.datepicker('getDate')]);
        $from_calendar.trigger('change');

        if ($vintage.length > 0) {
          dFrontJs.ibe_modals_vintage.closeModalDatepicker();
        }

        if ($(e.target).parents('.ibe_form').find('[data-cal="end"]').length > 0 && $(e.target).attr('data-cal') === 'start' && $from_calendar.data('datesRange')[0].getTime() > $from_calendar.data('datesRange')[1].getTime()) {
          //For open the calendar in specific months
          $to_calendar.datepicker('setDate', $from_calendar.datepicker('getDate'));
          $to_calendar.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');
          $to_calendar.find('td.range').removeClass('range');
          $from_calendar.find('td.range').removeClass('range');
          $from_calendar.data('datesRange', [$from_calendar.datepicker('getDate'), null]);
          $to_calendar.data('datesRange', [$from_calendar.datepicker('getDate'), null]);
          $to_calendar.trigger('change');
          $from_calendar.datepicker('refresh');
          $to_calendar.datepicker('refresh');
          input_to.focus(); //open de to calendar

          requestAnimFrame(function () {
            input_to.val('');
            input_to.closest('.ibe_form__group-half').removeClass('ibe_form__group--content');
          });
        } else if ($(e.target).attr('data-cal') === 'end' && $from_calendar.data('datesRange')[0].getTime() > $from_calendar.data('datesRange')[1].getTime()) {
          $from_calendar.datepicker('setDate', $to_calendar.datepicker('getDate'));
          $from_calendar.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');
          $to_calendar.find('td.range').removeClass('range');
          $from_calendar.find('td.range').removeClass('range');
          $from_calendar.data('datesRange', [null, $to_calendar.datepicker('getDate')]);
          $to_calendar.data('datesRange', [null, $to_calendar.datepicker('getDate')]);
          $from_calendar.trigger('change');
          $from_calendar.datepicker('refresh');
          $to_calendar.datepicker('refresh');
          input_from.focus(); //open de to calendar

          requestAnimFrame(function () {
            input_from.val('');
            input_from.closest('.ibe_form__group-half').removeClass('ibe_form__group--content');
          });
        } else {
          if ($(e.target).attr('data-cal') === 'start') {
            $from_calendar.trigger('change');
          } else {
            $to_calendar.trigger('change');
          }

          $from_calendar.datepicker('refresh');
          $to_calendar.datepicker('refresh');

          if (!$this.parents('[data-journey="parent"]').length > 0 && $from_calendar.data('datesRange')[0] !== null && $from_calendar.data('datesRange')[0].getTime() === $from_calendar.data('datesRange')[1].getTime()) {
            $from_calendar.find('.selected-day--from').addClass('selected-day--both');
          }

          $(e.target).blur();

          if ($modal.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
            dFrontJs.ibe_dinamic_modal.close($(e.target));
          }
        }
      }
    } else if (e.target.value.length === 0 && key !== 9 && key !== 229 && key !== 37 && key !== 39) {
      if ($(e.target).attr('data-cal') === 'start') {
        $from_calendar.datepicker('setDate', null);

        if (input_to.val().length > 0) {
          $from_calendar.data('datesRange', [null, $to_calendar.datepicker('getDate')]);
          $to_calendar.data('datesRange', [null, $to_calendar.datepicker('getDate')]);
        } else {
          $to_calendar.datepicker('setDate', null);
          $from_calendar.data('datesRange', [null, null]);
          $to_calendar.data('datesRange', [null, null]);
        }
      } else {
        $to_calendar.datepicker('setDate', null);

        if (input_from.val().length > 0) {
          $from_calendar.data('datesRange', [$from_calendar.datepicker('getDate'), null]);
          $to_calendar.data('datesRange', [$from_calendar.datepicker('getDate'), null]);
        } else {
          $from_calendar.datepicker('setDate', null);
          $from_calendar.data('datesRange', [null, null]);
          $to_calendar.data('datesRange', [null, null]);
        }
      }

      focusDatepicker(e.target);
      $from_calendar.datepicker('refresh');
      $to_calendar.datepicker('refresh');
    }
  };

  var _buttonCalendarTouchFocusClick = function (e) {
    var $this = $(this); //INITCALENDAR when click input (this Calendar)

    if (!$this.parents('.ibe_form__group--half').hasClass('fc-initCalendar')) {
      initCalendar($this.parents('.ibe_form__group--half').find('[data-function="cal-start"]'), $this.parents('.ibe_form__group--half').find('[data-function="cal-end"]'));
      $this.parents('.ibe_form__group--half').addClass('fc-initCalendar');
    }
  };

  var _calStartFocus = function () {
    $(this).closest('.ibe_form__group').find('.ibe-searcher__calendar--end').collapse('hide');
  };

  var activeOneWayFunction = function (selector) {
    var $parent = selector.closest('.ibe-tab__container-desktop'),
        $input_from = $parent.find('[data-cal="start"]'),
        $from_val = $input_from.val(),
        $input_to = $parent.find('[data-cal="end"]'),
        $to_val = $input_to.val(),
        $from_cal = $parent.find('[data-function="cal-start"]'),
        $to_cal = $parent.find('[data-function="cal-end"]');

    if ($input_to.val().length < 10) {
      $input_to.val('');
      $input_to.closest('.ibe_form__group-half').removeClass('ibe_form__group--content');

      if ($to_cal.find('.selected-day--from').length === 0 && $from_cal.find('.selected-day--from').length === 0) {
        $to_cal.datepicker('setDate', 'null');
      }
    }

    $input_to.parent().addClass('xui-return-date-hide');
    $input_from.parent().addClass('xui-one-way').parent().removeClass('icon-caret_derecha').closest('.ibe_form__group--error').find('[data-cal="start"]').trigger('change');
    $input_from.closest('.ibe_form__group--half').addClass('ibe_form__group--half-only-round');

    if ($from_val.length !== "") {
      $input_from.closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
    } else {
      $input_from.closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
      $input_from.closest('.ibe_form__group').find('[data-validate="exist-one-way"]').removeClass('hidden');
    }

    if (selector.closest('[data-validate-searcher]').length > 0) {
      if ($from_val !== "" && $to_val !== "" || $from_val === "" && $to_val !== "") {
        $from_cal.find('.selected-day--to').removeClass('selected-day--to');
        $from_cal.find('.range').removeClass('range');
      }
    }

    $from_cal.datepicker('refresh');
  };

  var activeRountripFunction = function (selector) {
    var $input_from = selector.closest('.ibe-tab__container-desktop').find('[data-cal="start"]'),
        $input_to = selector.closest('.ibe-tab__container-desktop').find('[data-cal="end"]'),
        $from_cal = selector.closest('.ibe-tab__container-desktop').find('[data-function="cal-start"]'),
        $to_cal = selector.closest('.ibe-tab__container-desktop').find('[data-function="cal-end"]');
    $input_to.parent().removeClass('xui-return-date-hide');
    $input_from.parent().removeClass('xui-one-way').parent().addClass('icon-caret_derecha').closest('.ibe_form__group--error').find('[data-cal="start"]').trigger('change');
    $input_from.closest('.ibe_form__group--half').removeClass('ibe_form__group--half-only-round');

    if ($input_from.val() !== "" && $input_to.val() !== "") {
      $from_cal.datepicker('refresh');
      $to_cal.datepicker('refresh');
    } else if ($input_from.val() !== "" && $input_to.val() === "") {
      $to_cal.datepicker('setDate', $from_cal.datepicker('getDate'));
      $input_to.focus();
    }

    if ($input_from.val() === "" || $input_to.val() === "") {
      $input_from.closest('.ibe_form__group').find('[data-validate="exist-one-way"]').addClass('hidden');
      $input_from.closest('.ibe_form__group').find('[data-validate="exist"]').removeClass('hidden');
    } else {
      $input_from.closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
    }

    $from_cal.datepicker('refresh');
    $to_cal.datepicker('refresh');
  };

  var _roundtripFunction = function () {
    if ($(this).is(':checked')) {
      activeRountripFunction($(this));
    }
  };

  var _oneWayFunction = function () {
    var $this = $(this);

    if ($this.is(':checked')) {
      activeOneWayFunction($this);
    }
  };

  var _disableCollapse = function (e) {
    e.preventDefault();
    e.stopPropagation();
  }; //Function for avoid close when click in the datepicker


  var _preventClicks = function (e) {
    e.preventDefault();
    e.stopPropagation();
    focusArrow = true;
    setTimeout(function () {
      focusArrow = false;
    }, 350);
  };

  var clickReturnPuente = function (e) {
    if ($(this).is(':checked')) {
      $('.ibe-advanced-searcher').find('.ibe-return-puente').hide();
    } else {
      $('.ibe-advanced-searcher').find('.ibe-return-puente').show();
    }
  };

  var clickChangeOrder = function (e) {
    var go = $('[data-ori-go]').val();
    var retu = $('[data-ori-return]').val();
    $('[data-ori-go]').val(retu);
    $('[data-ori-return]').val(go);
    $('[data-des-go]').val(go);
    $('[data-des-return]').val(retu);
  };

  var clickOneWay = function (e) {
    var $this, $group, $groupTo, $inputsTo, $linkTo, $selectTo, $inputCal, $calendarTo, $calendarFrom, $inputFrom;

    if (e === undefined) {
      e = $('[data-calendar-disable]:visible');
    }

    if (e.target !== undefined) {
      $this = $(this);
    } else {
      $this = $(e[0]);
    }

    $group = $this.closest('.ibe_form').find('.ibe_form__group-half');
    $groupTo = $group.last();
    $inputFrom = $group.find('[data-cal="start"]');
    $inputsTo = $groupTo.find('input');
    $linkTo = $groupTo.find('a');
    $selectTo = $groupTo.find('select');
    $inputCal = $groupTo.find('[data-cal="end"]');
    $calendarTo = $groupTo.find('[data-function="cal-end"]');
    $calendarFrom = $group.find('[data-function="cal-start"]');

    if ($this.is(':checked')) {
      $groupTo.addClass('ibe_form__group-half-one-way');
      $inputsTo.attr('disabled', 'disabled');
      $linkTo.attr('tabindex', '-1');
      $selectTo.selectmenu('disable');
      $groupTo.removeClass('ibe_form__group--content');

      if ($calendarFrom.find('.selected-day--to').length > 0) {
        $calendarFrom.find('.selected-day--to').removeClass('selected-day--to');
        $calendarFrom.find('.range').removeClass('range');
      }

      dFrontJs.ibe_validations_searcher.dateValidator($('[data-cal="start"]:visible').parents('.ibe_form__group'));
    } else {
      $groupTo.removeClass('ibe_form__group-half-one-way');
      $inputsTo.removeAttr('disabled');
      $linkTo.attr('tabindex', '0');
      $selectTo.selectmenu('enable');

      if ($calendarTo.find('.selected-day--to').length > 0) {
        $calendarFrom.datepicker('refresh');
        $calendarTo.datepicker('refresh');
        $groupTo.addClass('ibe_form__group--content');
      }
    }
  };

  var _inputsBlur = function (e) {
    var $target = $(e.target);
    var $this, $parent;

    if (!($target.hasClass('ui-datepicker-prev') || $target.hasClass('ui-datepicker-next') || $target.hasClass('ibe-form__check-label'))) {
      e.stopPropagation();
      $this = $(this);
      $parent = $this.closest('[data-toggle="container"]');
      $parent.addClass('isFocus');
      setTimeout(function () {
        var $focus = $(':focus');

        if (!$focus.closest('[data-toggle="container"]').hasClass('isFocus')) {
          $parent.collapse('hide');
        }

        $parent.removeClass('isFocus');
      });
    }
  }; //Init Calendar library


  var initCalendar = function ($from, $to) {
    var _focusoutFunction = function (e) {
      var $element = $(e.target),
          $parent = $element.closest('.ibe_form__group--half'),
          $elementFrom = $parent.find('[data-cal="start"]'),
          $elementTo = $parent.find('[data-cal="end"]'),
          $calendar_start = $parent.find('[data-function="cal-start"]'),
          $calendar_end = $parent.find('[data-function="cal-end"]');

      if ($element.val() === "") {
        if ($(e.target).attr('data-cal') === 'start' && $calendar_start.find('.selected-day--from').length > 0) {
          $calendar_start.data('datesRange')[0] = null;
          $calendar_start.datepicker('refresh');

          if ($calendar_end.length > 0) {
            $calendar_end.data('datesRange')[0] = null;
            $calendar_end.datepicker('refresh');
          }
        } else if ($(e.target).attr('data-cal') === 'end' && $calendar_end.find('.selected-day--to').length > 0) {
          $calendar_start.data('datesRange')[1] = null;
          $calendar_start.datepicker('refresh');

          if ($calendar_end.length > 0) {
            $calendar_end.data('datesRange')[1] = null;
            $calendar_end.datepicker('refresh');
          }
        }
      } else if ($parent.hasClass('ibe_form__group--error')) {
        if ($element.attr('data-cal') === 'start' && $calendar_start.find('.selected-day--from').length > 0 && $elementFrom.val().length !== 10) {
          $calendar_start.data('datesRange')[0] = null;
          $calendar_start.datepicker('refresh');

          if ($calendar_end.length > 0) {
            $calendar_end.data('datesRange')[1] = null;
            $calendar_end.datepicker('refresh');
          }
        } else if ($(e.target).attr('data-cal') === 'end' && $calendar_end.find('.selected-day--to').length > 0 && $elementTo.val().length !== 10) {
          $calendar_start.data('datesRange')[1] = null;
          $calendar_start.datepicker('refresh');

          if ($calendar_end.length > 0) {
            $calendar_end.data('datesRange')[1] = null;
            $calendar_end.datepicker('refresh');
          }
        }
      }

      focusDatepicker($(this));
    };

    var _changefromFunction = function () {
      var thisObj = $(this),
          thisValue = thisObj.val(),
          searcherCal = thisObj.closest('.ibe-searcher__calendar'),
          thisParent = thisObj.closest('.ibe_form__group').parent(),
          $calendar_start = thisParent.find('[data-function="cal-start"]'),
          starthour = 0,
          startmin = 0,
          value,
          selector,
          nights;

      if (thisParent.find('.xui-one-way').length <= 0 && !thisParent.find('[data-cal="end"]').prop('disabled')) {
        if (thisParent.find('[data-cal="end"]').siblings('[data-cal-button]').length) {
          thisParent.find('[data-cal="end"]').siblings('[data-cal-button]').click();
        } else {
          if (thisParent.find('[data-cal="end"]').val() === "") {
            thisParent.find('[data-cal="end"]').focus();
          }
        }
      } else {
        thisObj.blur();
      }

      if (thisObj.parents('[data-journey]').length > 0) {
        $calendar_start.find('.selected-day--from').addClass('selected-day--both');

        if (thisObj.data('datesRange') !== undefined) {
          thisObj.data('datesRange')[1] = $calendar_start.datepicker('getDate');
        }
      }

      if (thisObj.closest('.ibe_form__group-full').find('.ibe_form__selectize-multi__selectors').length > 0) {
        starthour = searcherCal.find('[data-cal="hour"]').eq(0).val();
        startmin = searcherCal.find('[data-cal="min"]').eq(0).val();
        thisValue = thisValue + '/' + starthour + ':' + startmin;
      }

      thisParent.find('[data-cal="start"]').val(thisValue);
      searcherCal.collapse('hide');

      if (navigator.userAgent.match(/(Android)|(webOS)|(BlackBerry)|(Windows Phone)/i)) {
        thisParent.find('[data-cal="start"]').attr('readonly', true);
      }

      if (navigator.userAgent.match(/(iPhone)|(iPad)|(iPod)/i)) {
        thisParent.find('[data-cal="start"]').siblings('[data-cal-button]').removeClass('hidden');
      }

      if ($('[data-max-night]').length > 0) {
        value = $('[data-max-night]').data('max-night');
        selector = $('.ibe-search-collapse__button--minus');
        nights = parseInt($('[data-night-counter]').text());
        dFrontJs.ibe_counter_night.visualValidation(nights, value, selector);
      }

      focusDatepicker(thisObj);
    };

    var _changeEndFunction = function () {
      var thisObj = $(this),
          thisValue = thisObj.val(),
          thisParent = thisObj.closest('.ibe_form__group').parent(),
          searcherCal = thisObj.closest('.ibe-searcher__calendar'),
          thisToday = thisObj.find('.ui-datepicker-today'),
          endhour = 0,
          endmin = 0,
          value,
          selector,
          nights; //thisParent.find('[data-function="cal-start"]').datepicker('option', 'maxDate', thisObj.datepicker('getDate'));

      thisParent.find('[data-function="cal-start"]').datepicker('refresh');

      if (thisObj.closest('.ibe_form__group-full').find('.ibe_form__selectize-multi__selectors').length) {
        endhour = searcherCal.find('[data-cal="hour"]').eq(0).val();
        endmin = searcherCal.find('[data-cal="min"]').eq(0).val();
        thisValue = thisValue + '/' + endhour + ':' + endmin;
      }

      thisParent.find('[data-cal="end"]').val(thisValue);
      searcherCal.collapse('hide');

      if (thisObj.closest('[data-validate-searcher]').length) {//dateValidator($(this).closest('.ibe_form__group'));
      }

      if (navigator.userAgent.match(/(Android)|(webOS)|(BlackBerry)|(Windows Phone)/i)) {
        thisParent.find('[data-cal="end"]').attr('readonly', true);
        thisParent.find('[data-cal="end"]').siblings('[data-cal-button]').removeClass('hidden');
      }

      if (navigator.userAgent.match(/(iPhone)|(iPad)|(iPod)/i)) {
        thisParent.find('[data-cal="end"]').siblings('[data-cal-button]').removeClass('hidden');
      }

      if (thisToday) {
        setTimeout(function (e) {
          thisToday.addClass('ui-datepicker-current-day');
          thisToday.removeClass('ui-datepicker-today');
        }, 50);
      }

      if ($('[data-max-night]').length > 0) {
        value = $('[data-max-night]').data('max-night');
        selector = $('.ibe-search-collapse__button--plus');
        nights = parseInt($('[data-night-counter]').text());
        dFrontJs.ibe_counter_night.visualValidation(nights, value, selector);
      }

      focusDatepicker(thisObj);
    };

    var $calStart = $('[data-function="cal-start"]');
    var $journey = $from.closest($('[data-journey]')).length;
    var datepicker, language, format, firstday, datepicker__updateDatepicker, onAfterUpdate, showMonth, totalDate, $this, newTotalDate, dataHour, fechaInicio, fechaFin, diff, newDiff;

    if ($calStart.length) {
      datepicker = {
        minDate: 0,
        maxDate: getDatePickerMaxDate($calStart)
      }; //Language

      language = $calStart.attr('data-language') ? $calStart.attr('data-language') : 'en';
      $.datepicker.setDefaults($.datepicker.regional[language]); //the language is applied in integration WCS
      //Format

      format = $calStart.attr('data-format') ? $calStart.attr('data-format') : $.datepicker.regional[language].dateFormat; //Firstday

      firstday = $calStart.attr('data-firstday') ? $calStart.attr('data-firstday') : $.datepicker.regional[language].firstDay;

      Date.prototype.yyyymmdd = function (sep) {
        var mm = this.getMonth() + 1;
        var dd = this.getDate();
        return {
          'mm': mm,
          'dateFormat': [this.getFullYear(), mm, dd].join(sep),
          'yyyy': this.getFullYear(),
          'dd': dd
        };
      };

      $.datepicker._defaults.onAfterUpdate = null;
      datepicker__updateDatepicker = $.datepicker._updateDatepicker;

      $.datepicker._updateDatepicker = function (inst) {
        datepicker__updateDatepicker.call(this, inst);
        onAfterUpdate = this._get(inst, 'onAfterUpdate');
        if (onAfterUpdate) onAfterUpdate.apply(inst.input ? inst.input[0] : null, [inst.input ? inst.input.val() : '', inst]);
      };

      showMonth = getNumberMonth();
      $from.off('change');
      $from.datepicker({
        minDate: datepicker.minDate,
        maxDate: datepicker.maxDate,
        dateFormat: format,
        firstDay: firstday,
        numberOfMonths: showMonth,
        beforeShowDay: rangeDays,
        onSelect: function (e, date) {
          var $this = $(this),
              $parent = $this.parents('.ibe_form__group--half'),
              $this_to = $parent.find('[data-function="cal-end"]').length > 0 ? $parent.find('[data-function="cal-end"]') : $this,
              $input_from = $parent.find('[data-cal="start"]'),
              $vintage = $('.ibe-searcher__vintage'),
              $input_to = $parent.find('[data-cal="end"]').length > 0 ? $parent.find('[data-cal="end"]') : $input_from,
              $modal = $('.ibe_form__group-half').find('[data-dinamic-open]'),
              idCal,
              dateTo,
              dateForm,
              _mouseoverTDtoFunction;
          /*
          if (!$input_from.hasClass('initRangeDatepicker')) {
          	$input_from.addClass('initRangeDatepicker');
          	$this.datepicker('option', 'beforeShowDay', rangeDays);
          	if (!$this.parents('[data-journey="parent"]').length > 0) {
          		$input_to.addClass('initRangeDatepicker');
          		requestAnimFrame(function () {
          			$this_to.datepicker('option', 'beforeShowDay', rangeDays);
          		});
          	}
          }*/


          requestAnimFrame(function () {
            if ($this.data('datesRange')[1] !== null && $this.data('datesRange')[0].getTime() === $this.data('datesRange')[1].getTime()) {
              $this_to.find('.selected-day--from').addClass('selected-day--both');
              $this.find('.selected-day--from').addClass('selected-day--both');
            }

            if ($this.data('datesRange')[1] === null && $this.data('datesRange')[0].getTime()) {
              $this.find('.selected-day--from').addClass('selected-day--both');
            }
          });

          if ($this.parents('[data-journey="parent"]').length > 0) {
            $this.find('.selected-day--from').addClass('selected-day--both');
          }

          $this.trigger('change');

          if ($journey) {
            dFrontJs.ibe_journey.controlDates($this);
          }

          if ($parent.hasClass('ibe_form__group--error') && $input_to.val().length === 10 || $parent.hasClass('ibe_form__group--error') && $input_from.val().length === 10) {
            $parent.removeClass('ibe_form__group--error');
            $parent.find('[data-validate]').addClass('hidden');
          }

          if ($vintage.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
            idCal = $input_from.attr('data-target');
            $(idCal).off('hide.bs.collapse', _disableCollapse);
            $(idCal).collapse('hide'); // Only oneway

            requestAnimFrame(function () {
              var colDate;

              if ($input_from.val() !== "" && $('input[data-function="oneway"]:checked').length > 0) {
                colDate = $('.ibe-searcher__col--date');
                colDate.removeClass('modal-mode');
                $('.ibe-button-close-modal').hide();
                colDate.parents('.ibe-accordion.active').css('overflow', '');
              }
            }, 500);
          } else if ($modal.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
            // Only oneway
            requestAnimFrame(function () {
              if ($input_from.val() !== "" && $('input[data-click="oneway"]').length > 0 && !$('input[data-click="oneway"]').is(':checked')) {
                dFrontJs.ibe_dinamic_modal.close($modal);
              }
            }, 500);
          }

          _mouseoverTDtoFunction = function () {
            var hoverDate = $('a', this).html() + '/' + ($(this).data('month') + 1) + '/' + $(this).data('year'),
                //Cell where hover
            dateParts = hoverDate.split('/'),
                date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]),
                time = date.getTime(),
                day_to,
                td = $(this).parents('.ibe_form__group--half').find('[data-function="cal-end"]').find('td');

            if ($this.data('datesRange')[0] !== null) {
              day_to = $this.data('datesRange')[0].getTime(); //Day to
            } //$('.isHover').removeClass('isHover');
            //$(this).addClass('isHover');


            $(td).each(function (index) {
              var dateClass = $(this).attr('class') || '';
              var dateMatch = [];
              var year, month, day;

              if ($(this).data('month')) {
                year = $(this).data('year');
                month = $(this).data('month');
                day = $('a', this).html();
              } else {
                dateMatch = dateClass.match(/\bactualDate-(([0-9]{1,2})_([0-9]{1,2})_([0-9]{4}))\b/);

                if (dateMatch && dateMatch.length === 5) {
                  year = parseInt(dateMatch[4], 10);
                  month = parseInt(dateMatch[3], 10) - 1;
                  day = parseInt(dateMatch[2], 10);
                }
              }

              var cellDate = day + '/' + (month + 1) + '/' + year,
                  //All cell date
              dateParts = cellDate.split('/'),
                  dateCell = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]),
                  timeCell = dateCell.getTime(),
                  $roundtrip = $('[data-function="roundtrip"]'),
                  $switch = $('[data-click="oneway"]');

              if (day_to <= timeCell && timeCell <= time && $roundtrip.is(':checked') || day_to <= timeCell && timeCell <= time && $switch.is(':checked')) {
                //If td in the middel of to date and hover date
                $(this).addClass('mouse');
              } else {
                $(this).removeClass('mouse');
              }
            });
          }; //Function to mouseover


          $this_to.off('mouseover', '.ui-datepicker td', _mouseoverTDtoFunction);
          $this_to.on('mouseover', '.ui-datepicker td', _mouseoverTDtoFunction); //Update array for the days in both calendar

          dateTo = $this_to.datepicker('getDate');
          dateForm = $this.datepicker('getDate');
          $this.data('datesRange', [dateForm, dateTo]);
          $this_to.data('datesRange', [dateForm, dateTo]);
          $this_to.datepicker('refresh'); //Show specific month at calendar

          if ($input_to.val() === "") {
            $this_to.datepicker('setDate', dateForm);
            $this_to.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');
            $this_to.find('.range').removeClass('range');
          }

          if ($this.data('datesRange')[1] !== null) {
            //If exist date in to
            if ($this.data('datesRange')[0].getTime() > $this.data('datesRange')[1].getTime()) {
              //If date from is late than to
              $this_to.find('td.selected-day--to').removeClass('selected-day--to');
              $this_to.find('.range').removeClass('range');
              $this.find('.range').removeClass('range');
              $this.data('datesRange', [dateForm, null]);
              $this_to.data('datesRange', [dateForm, null]);
              $input_to.val('');
              !$input_to.prop('disabled') && $input_to.focus(); //open de to calendar

              $input_to.closest('.ibe_form__group-half').removeClass('ibe_form__group--content');
              $this_to.datepicker('setDate', 'null'); //For open the calendar in specific months

              $this_to.datepicker('setDate', dateForm);
              $this_to.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');
            } else if ($input_to.val() !== "") {
              if ($vintage.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
                dFrontJs.ibe_modals_vintage.closeModalDatepicker();
              } else if ($modal.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
                dFrontJs.ibe_dinamic_modal.close($parent);
              }
            }
          }
        },
        onAfterUpdate: function () {
          var $this = $(this),
              selParent = $this.closest('.ibe_form__group--half').parent(),
              elem = selParent.find('[data-cal="start"]'),
              $dataDayCalendar = $this.parent().find('[data-hour-restriction]');
          selParent.find('a.ui-corner-all').attr('href', '#');
          $('[data-event="click"]').off('click', _preventClicks);
          $('[data-event="click"]').on('click', _preventClicks);

          if ($dataDayCalendar.length && (!elem.val() || elem.closest('.ibe_form__group--error').length)) {
            $dataDayCalendar.parents('.ibe_form__group').find('[data-function="cal-end"]').find('.ui-datepicker-current-day').removeClass('ui-datepicker-today');
            $dataDayCalendar.parents('.ibe_form__group').find('[data-function="cal-start"]').find('.ui-datepicker-current-day').addClass('ui-datepicker-today').removeClass('ui-datepicker-current-day');
          } else {
            $dataDayCalendar.parents('.ibe_form__group').find('[data-function="cal-end"]').find('.ui-datepicker-current-day').removeClass('ui-datepicker-today');
          }

          noFlightsTooltip(this);
        }
      }).on('change', _changefromFunction).on('focusout', _focusoutFunction).parents('.ibe_form__group--half').find('[data-cal="start"]').on('keyup', _inputsKeyup);

      if ($from.parents('.ibe_form__group--half').find('[data-cal="start"]') === "") {
        $from.datepicker('setDate', null); //Default set null date datepicker Start
      }

      if ($journey) {
        dFrontJs.ibe_journey.controlDates($from.parents('.ibe_form__group--half').find('.hasDatepicker'));
      }

      $to.off('change');
      $to.datepicker({
        minDate: datepicker.minDate,
        maxDate: datepicker.maxDate,
        dateFormat: format,
        firstDay: firstday,
        numberOfMonths: showMonth,
        beforeShowDay: rangeDays,
        onSelect: function () {
          var $this = $(this),
              $parent = $this.parents('.ibe_form__group--half'),
              $this_from = $parent.find('[data-function="cal-start"]'),
              $input_from = $parent.find('[data-cal="start"]'),
              $input_to = $parent.find('[data-cal="end"]'),
              $vintage = $('.ibe-searcher__vintage'),
              $modal = $('.ibe_form__group-half').find('[data-dinamic-open]'),
              idCal,
              colDate,
              dateTo,
              dateFrom,
              _mouseoverTDtoFunction,
              _mouseoverTDfromFunction;
          /*if (!$input_to.hasClass('initRangeDatepicker')) {
          	$input_to.addClass('initRangeDatepicker');
          	$input_from.addClass('initRangeDatepicker');
          	$this.datepicker('option', 'beforeShowDay', rangeDays);
          	requestAnimFrame(function () {
          		$this_from.datepicker('option', 'beforeShowDay', rangeDays);
          	});
          }*/


          requestAnimFrame(function () {
            if ($this.data('datesRange')[0] !== null && $this.data('datesRange')[0].getTime() === $this.data('datesRange')[1].getTime()) {
              $this_from.find('.selected-day--from').addClass('selected-day--both');
              $this.find('.selected-day--from').addClass('selected-day--both');
            }
          });
          $this.trigger('change');
          dFrontJs.ibe_journey.controlDates($this);

          if ($parent.hasClass('ibe_form__group--error') && $input_from.val().length === 10) {
            $parent.removeClass('ibe_form__group--error');
            $parent.find('[data-validate]').addClass('hidden');
          }

          if ($vintage.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
            idCal = $input_to.attr('data-target');
            $(idCal).off('hide.bs.collapse', _disableCollapse);
            $(idCal).collapse('hide');

            if ($input_from.val() !== "" && $input_to.val() !== "") {
              colDate = $('.ibe-searcher__col--date');
              colDate.removeClass('modal-mode');
              $('.ibe-button-close-modal').hide();
              colDate.parents('.ibe-accordion.active').css('overflow', '');
            }
          }

          _mouseoverTDfromFunction = function () {
            var hoverDate = $('a', this).html() + '/' + ($(this).data('month') + 1) + '/' + $(this).data('year'),
                //Cell where hover
            dateParts = hoverDate.split('/'),
                date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]),
                time = date.getTime(),
                day_from,
                //Day from
            td = $(this).parents('.ibe_form__group--half').find('[data-function="cal-start"]').find('td');

            if ($this.data('datesRange')[1] !== null) {
              day_from = $this.data('datesRange')[1].getTime();
            }

            $(td).each(function () {
              var year,
                  month,
                  day,
                  cellDate,
                  dateParts,
                  dateCell,
                  timeCell,
                  $roundtrip,
                  $switch,
                  dateClass,
                  dateMatch = [];
              dateClass = $(this).attr('class') || '';

              if ($(this).data('month')) {
                year = $(this).data('year');
                month = $(this).data('month');
                day = $('a', this).html();
              } else {
                dateMatch = dateClass.match(/\bactualDate-(([0-9]{1,2})_([0-9]{1,2})_([0-9]{4}))\b/);

                if (dateMatch && dateMatch.length === 5) {
                  year = parseInt(dateMatch[4], 10);
                  month = parseInt(dateMatch[3], 10) - 1;
                  day = parseInt(dateMatch[2], 10);
                }
              }

              cellDate = day + '/' + (month + 1) + '/' + year; //All cell date

              dateParts = cellDate.split('/');
              dateCell = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
              timeCell = dateCell.getTime();
              $roundtrip = $('[data-function="roundtrip"]');
              $switch = $('[data-click="oneway"]');

              if (timeCell <= day_from && time <= timeCell && $roundtrip.is(':checked') || timeCell <= day_from && time <= timeCell && $switch.is(':checked')) {
                //If td in the middel of to date and hover date
                $(this).addClass('mouse');
              } else {
                $(this).removeClass('mouse');
              }
            });
          }; //Function to mouseover


          $this_from.off('mouseover', '.ui-datepicker td', _mouseoverTDfromFunction);
          $this_from.on('mouseover', '.ui-datepicker td', _mouseoverTDfromFunction);
          dateFrom = $this_from.datepicker('getDate');
          dateTo = $this.datepicker('getDate');

          if ($input_from.val() !== "") {
            $this.data('datesRange', [dateFrom, dateTo]);
            $this_from.data('datesRange', [dateFrom, dateTo]);
          } else {
            //Show specific month at calendar
            $this_from.datepicker('setDate', dateTo);
            $this_from.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');
            $this_from.find('td.selected-day--from').removeClass('selected-day--from');
            $this_from.find('td.range').removeClass('range');
            $this.find('td.range').removeClass('range');
            $this.data('datesRange', [null, dateTo]);
            $this_from.data('datesRange', [null, dateTo]);
            $input_from.focus(); //If not has from, open it
          }

          if ($this.data('datesRange')[0] !== null) {
            if ($this.data('datesRange')[0].getTime() === $this.data('datesRange')[1].getTime()) {
              $this_from.find('td.selected-day--from').addClass('selected-day--both');
              $this.find('td.selected-day--from').addClass('selected-day--both');
            }

            if ($this.data('datesRange')[1].getTime() < $this.data('datesRange')[0].getTime()) {
              $this_from.find('td.selected-day--from').removeClass('selected-day--from');
              $this_from.find('td.range').removeClass('range');
              $this.find('td.range').removeClass('range');
              $this.data('datesRange', [null, dateTo]);
              $this_from.data('datesRange', [null, dateTo]);
              $input_from.val('');
              $input_from.closest('.ibe_form__group-half').removeClass('ibe_form__group--content'); //Show specific month at calendar

              $this_from.datepicker('setDate', dateTo);
              $this_from.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');
              $this_from.datepicker('refresh');
              $input_from.focus();
            } else {
              if ($modal.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
                dFrontJs.ibe_dinamic_modal.close($parent);
              }
            }
          }

          $this_from.datepicker('refresh');
        },
        onAfterUpdate: function (date, elem) {
          var $this = $(this),
              selParent = $this.closest('.ibe_form__group--half'),
              elem = selParent.find('[data-cal="start"]'),
              $dataDayCalendar = $this.parent().find('[data-hour-restriction]');
          selParent.find('a.ui-corner-all').attr('href', '#');
          $('[data-event="click"]').off('click', _preventClicks);
          $('[data-event="click"]').on('click', _preventClicks);

          if ($dataDayCalendar.length && (!elem.val() && $this.val() || elem.closest('.ibe_form__group--error').length)) {
            $dataDayCalendar.parents('.ibe_form__group').find('[data-function="cal-start"],[data-function="cal-end"]').find('.ui-datepicker-days-cell-over').addClass('ui-datepicker-today');

            if (elem.closest('.ibe_form__group--error').length) {
              $dataDayCalendar.parents('.ibe_form__group').find('[data-function="cal-end"]').find('.ui-datepicker-current-day').removeClass('end-selected');
              $dataDayCalendar.parents('.ibe_form__group').find('[data-function="cal-end"]').find('.ui-datepicker-current-day').removeClass('ui-datepicker-today');
            }
          } else {
            $dataDayCalendar.parents('.ibe_form__group').find('[data-function="cal-end"]').find('.ui-datepicker-current-day').removeClass('ui-datepicker-today');
          }

          noFlightsTooltip(this);
        }
      }).on('change', _changeEndFunction).on('focusout', _focusoutFunction).parents('.ibe_form__group--half').find('[data-cal="end"]').on('keyup', _inputsKeyup);

      if ($to.parents('.ibe_form__group--half').find('[data-cal="start"]') === "") {
        $to.datepicker('setDate', null); //Default set null date datepicker End
      } //change date for hours


      totalDate = new Date(); //Function for hour restriction

      if ($from.parent().find('[data-hour-restriction]').length > 0) {
        $this = $from.parent().find('[data-hour-restriction]');
        newTotalDate = new Date();
        dataHour = parseInt($this.attr('data-hour-restriction'));
        newTotalDate.setMilliseconds(dataHour * 60 * 60 * 1000); //Horas por segundos/hora

        newTotalDate.setHours(0);
        newTotalDate.setMinutes(0);
        newTotalDate.setSeconds(0);
        fechaInicio = totalDate.getTime();
        fechaFin = newTotalDate.getTime();
        diff = fechaFin - fechaInicio;
        newDiff = Math.ceil(diff / (1000 * 60 * 60 * 24));
        $this.parents('.ibe_form__group').find('[data-function="cal-start"],[data-function="cal-end"]').datepicker('option', 'minDate', newDiff);
      }
    }
  }; //initCalendar
  ////////


  var _touchStartFunction = function (e) {
    var $this = $(this),
        $header_top = $('.ibe_form__group-half').height(),
        $htmlScrollTop = $('html').scrollTop() > 0 ? $('html').scrollTop() : $('body').scrollTop(),
        $vintage = $('.ibe-searcher__vintage'),
        $modal = $this.parent().find('[data-dinamic-open]'),
        calendar,
        parent,
        thisContainer;

    if (!$this.parents('.ibe_form__group--half').hasClass('fc-initCalendar')) {
      initCalendar($this.parents('.ibe_form__group--half').find('[data-function="cal-start"]'), $this.parents('.ibe_form__group--half').find('[data-function="cal-end"]'));
      $this.parents('.ibe_form__group--half').addClass('fc-initCalendar');
    } // e.preventDefault();


    e.stopImmediatePropagation(); //Collapse others data-toggle="container" collapsed when data-cal-button clicks/touchstarts

    $('[data-toggle="container"]').not($(this).parents()).collapse('hide');

    if (!$this.hasClass('hidden')) {
      $this.addClass('hidden');
      $this.closest('.fc_form_group').find('[data-cal]').addClass('collapsed');
      $this.closest('.fc_form_group').find('[data-toggle="container"]').collapse('show');
    }

    calendar = $this.parent().find('[data-cal]').data('cal');
    parent = $this.closest('.ibe_form__group');

    if (calendar === 'start') {
      parent.find('[data-cal="end"] + [data-cal-button]').removeClass('hidden');
      parent.find('[data-cal="start"] + [data-cal-button]').addClass('hidden');
      parent.find('[data-function="cal-end"]').parent().collapse('hide');
      $('.focus-ios').removeClass('focus-ios');
      parent.find('[data-cal="start"]').parent().addClass('focus-ios');
    } else {
      parent.find('[data-cal="start"] + [data-cal-button]').removeClass('hidden');
      parent.find('[data-cal="end"] + [data-cal-button]').addClass('hidden');
      parent.find('[data-function="cal-start"]').parent().collapse('hide');
      $('.focus-ios').removeClass('focus-ios');
      parent.find('[data-cal="end"]').parent().addClass('focus-ios');
    } //For vintage open modals


    if ($vintage.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
      dFrontJs.ibe_modals_vintage.openModalDatepicker();
    }

    if ($modal.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
      thisContainer = $this.closest('.ibe_form__group-half').find('[data-toggle="container"]');
      $this.closest('.ibe_form__group').addClass('ibe-dinamic-modal');
      $this.closest('.ibe_form__group').attr('data-keyboard-close', 'esc');
      $('body').css('overflow', 'hidden');
      $this.parents('.ibe_form__group-half').find('.ibe-searcher__calendar').animate({
        scrollTop: 0
      });

      if ($this.val() !== "") {
        setTimeout(function () {
          var selectedToTop, aux;

          if ($this.attr('data-cal') === 'start') {
            // requestAnimationFrame(function(){
            aux = $this.parents('.ibe_form__group-half').find('.selected-day--from').parents('.ui-datepicker-group').offset();

            if (aux !== undefined) {
              selectedToTop = aux.top - parseInt($header_top) - $htmlScrollTop;
            } // })

          } else {
            aux = $this.parents('.ibe_form__group-half').find('.selected-day--to').parents('.ui-datepicker-group').offset();

            if (aux !== undefined) {
              selectedToTop = aux.top - parseInt($header_top) - $htmlScrollTo;
            }
          }

          $this.parents('.ibe_form__group-half').find('.ibe-searcher__calendar').animate({
            scrollTop: selectedToTop
          }, 600);
        }, 900);
      }
    }
  };

  var init = function () {
    var $from = $('[data-function="cal-start"]'),
        $end = $('[data-function="cal-end"]'),
        $both = $('[data-cal]'),
        $checkDisabledCalendar = $('[data-calendar-disable]:visible'),
        $input_fromVisible = $('[data-cal="start"]:visible'),
        $input_toVisible = $('[data-cal="end"]:visible');
    requestAnimFrame(function () {
      if ($('[data-one-month]').length > 0 && !$input_fromVisible.parents('.ibe_form__group--half').hasClass('fc-initCalendar')) {
        initCalendar($input_fromVisible.parents('.ibe_form__group--half').find('[data-function="cal-start"]'), $input_toVisible.parents('.ibe_form__group--half').find('[data-function="cal-end"]'));
        $input_fromVisible.parents('.ibe_form__group--half').addClass('fc-initCalendar');
      } //- Control de Teclado de Dispositivos Móviles Reales


      if (navigator.userAgent.match(/(Android)|(webOS)|(BlackBerry)|(Windows Phone)/i)) {
        $('[data-cal="start"]').attr('readonly', true);
        $('[data-cal="end"]').attr('readonly', true);
      } else if (navigator.userAgent.match(/(iPhone)|(iPad)|(iPod)/i)) {
        $('[data-cal="start"]').each(function () {
          var text = $(this).siblings('label').text();
          var button = '<button type="button" class="ibe_form__button-hide" data-cal-button="start"><span class="hideAccessible">' + text + '</span></button>';
          $(button).insertAfter($(this));
        });
        $('[data-cal="end"]').each(function () {
          var text = $(this).siblings('label').text();
          var button = '<button type="button" class="ibe_form__button-hide" data-cal-button="end"><span class="hideAccessible">' + text + '</span></button>';
          $(button).insertAfter($(this));
        }); //Touchstart for work in ios

        $('[data-cal-button]').off('touchstart click', _touchStartFunction);
        $('[data-cal-button]').on('touchstart click', _touchStartFunction);
      } // Update the multi-journey calendar (advanced search), when the date is modified automatically. Use the 'keyup' functionality
      //Focus Inverse Accesible Keyboard


      $('[data-cal="start"]').off('focus', _calStartFocus);
      $('[data-cal="start"]').on('focus', _calStartFocus); //Prevent the collapse of the calendar in IOS devices when selecting first return

      $('[data-cal="start"],[data-cal="end"]').on('focus', function (e) {
        var eventInput = $(e.target);
        var calendar = $(eventInput.data('target'));

        if (navigator.userAgent.match(/(iPhone)|(iPad)|(iPod)/i)) {
          $('.focus-ios').removeClass('focus-ios');
          eventInput.addClass('focus-ios'); // Delete height for collapse in

          if (navigator.userAgent.match(/(iPhone)/i)) {
            // Delete height for collapse in
            calendar.css('height', '');
          }
        }
      }); //INITCALENDAR when click input (this Calendar)

      $('[data-cal="end"],[data-cal="start"]').on('focus click', function (e) {
        var $this = $(this);
        var $header_top = $('.ibe_form__group-half').height(),
            $htmlScrollTop = $('html').scrollTop() > 0 ? $('html').scrollTop() : $('body').scrollTop(),
            $vintage = $('.ibe-searcher__vintage'),
            $modal = $this.is('[data-dinamic-open]'),
            $journey = $('[data-journey="journey"]').length,
            idCal = $(this).attr('data-target'),
            $parent = $this.closest('.ibe_form__group--half'),
            $input_from = $parent.find('[data-cal="start"]'),
            $input_to = $parent.find('[data-cal="end"]'),
            $from_cal = $parent.find('[data-function="cal-start"]'),
            $to_cal = $parent.find('[data-function="cal-end"]'),
            thisContainer,
            id,
            $id;

        if (!$this.parents('.ibe_form__group--half').hasClass('fc-initCalendar')) {
          initCalendar($this.parents('.ibe_form__group--half').find('[data-function="cal-start"]'), $this.parents('.ibe_form__group--half').find('[data-function="cal-end"]'));
          $this.parents('.ibe_form__group--half').addClass('fc-initCalendar');
        }

        if ($(idCal).parents('.ibe-dinamic-modal').length > 0 && $this.attr('aria-expanded') === 'true') {
          e.stopPropagation();
        }

        if ($vintage.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
          //Al abrir el calendario, reinicio su posicion (top 0)
          $this.parents('.ibe-searcher__col.ibe-searcher__col--date.modal-mode').find('.ibe-searcher__calendar--all-months').animate({
            scrollTop: 0
          });
          idCal = $(this).attr('data-target'); //si tiene fecha, hacer scroll hacia la ida o la vuelta

          if ($(this).val() !== "") {
            setTimeout(function () {
              var selectedToTop, aux;

              if ($this.attr('data-cal') === 'start') {
                aux = $this.parents('.ibe_form__group-half').find('.selected-day--from').parents('.ui-datepicker-group').offset();

                if (aux !== undefined) {
                  selectedToTop = aux.top - parseInt($header_top);
                }
              } else {
                aux = $this.parents('.ibe_form__group-half').find('.selected-day--to').parents('.ui-datepicker-group').offset();

                if (aux !== undefined) {
                  selectedToTop = aux.top - parseInt($header_top);
                }
              }

              $this.parents('.ibe-searcher__col.ibe-searcher__col--date.modal-mode').find('.ibe-searcher__calendar--all-months').animate({
                scrollTop: selectedToTop
              }, 600);
            }, 900);
          } else {
            setTimeout(function () {
              var selectedToTop, aux;

              if ($this.attr('data-cal') === 'start') {
                aux = $this.parents('.ibe_form__group-half').find('.selected-day--to').parents('.ui-datepicker-group').offset();

                if (aux !== undefined) {
                  selectedToTop = aux.top - parseInt($header_top);
                }
              } else {
                aux = $this.parents('.ibe_form__group-half').find('.selected-day--from').parents('.ui-datepicker-group').offset();

                if (aux !== undefined) {
                  selectedToTop = aux.top - parseInt($header_top);
                }
              }

              $this.parents('.ibe-searcher__col.ibe-searcher__col--date.modal-mode').find('.ibe-searcher__calendar--all-months').animate({
                scrollTop: selectedToTop
              }, 600);
            }, 900);
          }

          if ($(idCal).hasClass('in')) {
            $(idCal).off('hide.bs.collapse', _disableCollapse);
            $(idCal).on('hide.bs.collapse', _disableCollapse);
          } else {
            $(idCal).off('hide.bs.collapse', _disableCollapse);
          }
        }

        if ($modal && window.innerWidth < dFrontJs.resolutions.lg) {
          thisContainer = $this.closest('.ibe_form__group-half').find('[data-toggle="container"]');
          $this.closest('.ibe_form__group').addClass('ibe-dinamic-modal');
          $this.closest('.ibe_form__group').attr('data-keyboard-close', 'esc');
          $('body').css('overflow', 'hidden');
          $this.parents('.ibe_form__group-half').find('.ibe-searcher__calendar').animate({
            scrollTop: 0
          });

          if ($this.val() !== "") {
            setTimeout(function () {
              var selectedToTop, aux;

              if ($this.attr('data-cal') === 'start') {
                // requestAnimationFrame(function(){
                aux = $this.parents('.ibe_form__group-half').find('.selected-day--from').parents('.ui-datepicker-group').offset();

                if (aux !== undefined) {
                  selectedToTop = aux.top - parseInt($header_top) - $htmlScrollTop;
                } // })

              } else {
                aux = $this.parents('.ibe_form__group-half').find('.selected-day--to').parents('.ui-datepicker-group').offset();

                if (aux !== undefined) {
                  selectedToTop = aux.top - parseInt($header_top) - $htmlScrollTop;
                }
              }

              $this.parents('.ibe_form__group-half').find('.ibe-searcher__calendar').animate({
                scrollTop: selectedToTop
              }, 600);
            }, 900);
          }
        }

        if ($(this).parents('.ibe-search-flights__search-box').length > 0) {
          $('.ibe-overlay').show();
          $('[data-function="data-focus-searcher"], [data-function="data-focus-searcher-mobile"], .ibe-search-flights__search--overlay').css('z-index', '10000');
        }

        if (!$('[data-toggle="container"]').hasClass('off')) {
          $('[data-toggle="container"]').not($(this).parents()).collapse('hide');
        }

        $this = $(this);
        id = $this.attr('data-target');
        $id = $(id);

        if ($id.is(':hidden')) {
          //- Control de Teclado de Dispositivos Móviles Reales
          if (navigator.userAgent.match(/(Android)|(webOS)|(BlackBerry)|(Windows Phone)/i)) {
            $id.collapse('show');
            $this.removeClass('collapse');
          }

          if (navigator.userAgent.match(/(iPhone)|(iPad)|(iPod)/i)) {
            $this.siblings('[data-cal-button]').removeClass('hidden');
          } else {
            $id.collapse('show');
            $this.removeClass('collapse');
          }
        }

        if (!$this.parents('[data-journey="parent"]').length > 0) {
          if ($input_from.val() !== "" && $input_to.val() === "") {
            $to_cal.datepicker('setDate', $from_cal.datepicker('getDate'));
          } else if ($input_from.val() === "" && $input_to.val() !== "") {
            $from_cal.datepicker('setDate', $to_cal.datepicker('getDate'));
          }
        }
      }); //Focus Accesible Keyboard - Test

      $('.ibe-searcher__calendar--start,.ibe-searcher__calendar--end').off('blur', _inputsBlur);
      $('.ibe-searcher__calendar--start,.ibe-searcher__calendar--end').on('blur', _inputsBlur);

      if ($('[data-one-month]').length) {
        $('[data-one-month]').parents('.ibe_form__group').find('[data-function="cal-start"], [data-function="cal-end"]').datepicker('option', 'numberOfMonths', 1);
      }

      $('[data-cal="start"]').closest('.ibe_form__group--half').parent().find('.ibe-searcher__calendar').css('opacity', '1'); //Control Foco Datepìcker
      // ------------------------------- Control focus datepicker ---------------------------------------------------
      //-------------------------------------------------------------------------------------------------------------

      if ($from.length) {
        $from.change(function (e) {
          focusDatepicker($(this));
        });
        $end.change(function (e) {
          focusDatepicker($(this));
        });
        $both.each(function (e) {
          focusDatepicker($(this));
        });
      }

      changeNumberMonth($from, $end);

      if ($checkDisabledCalendar.is(':checked')) {
        clickOneWay();
      } //*******************************************************************************************
      //*** Cambiar campos de fechas en el buscador de vuelos al elegir solo ida, o ida y vuelta***
      //*******************************************************************************************


      $('[data-calendar-disable]').off('click', clickOneWay);
      $('[data-calendar-disable]').on('click', clickOneWay); //*******************************************************************************************
      //*** Mostrar / ocultar la vuelta en españa puente aereo***
      //*******************************************************************************************

      $('[data-return-puente]').off('click', clickReturnPuente);
      $('[data-return-puente]').on('click', clickReturnPuente); //*******************************************************************************************
      //*** Cambiar orden de vuelo MAD/BCN en españa puente aereo***
      //*******************************************************************************************

      $('[data-change-order]').off('click', clickChangeOrder);
      $('[data-change-order]').on('click', clickChangeOrder); //----------------------------------------------------------------------------------------------------------
      //-------------------------------- Funcionalidad sólo ida, ida y vuelta ------------------------------------
      //----------------------------------------------------------------------------------------------------------

      if ($('[data-function="oneway"]').length) {
        $('[data-function="oneway"]').off('click', _oneWayFunction);
        $('[data-function="oneway"]').on('click', _oneWayFunction);
        $('[data-function="roundtrip"]').off('click', _roundtripFunction);
        $('[data-function="roundtrip"]').on('click', _roundtripFunction);
      }

      if ($('[data-click="oneway"]').length > 0) {
        $('[data-click="oneway"]').off('click', _disableRound);
        $('[data-click="oneway"]').on('click', _disableRound);
      }

      endTimeCalendar = Date.now();
    });
  };

  var focusDatepicker = function (object) {
    var obj = $(object);
    var parent = obj.closest('.fc_form_group');

    if (obj.val() !== "") {
      parent.addClass('ibe_form__group--content');
    } else {
      parent.removeClass('ibe_form__group--content');
    }
  };

  var getNumberMonth = function () {
    var $vintage = $('.ibe-searcher__vintage'),
        $modal = $('.ibe_form__group-half').find('[data-dinamic-open]');

    if ($vintage.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
      return 12;
    } else if ($modal.length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
      return 12;
    }

    if (window.innerWidth < dFrontJs.resolutions.md) {
      return 1;
    }

    return 2;
  }; //-----------------------------------------------------------------------------------------------------
  //-------------------------------- CHANGE FOR VINTAGE DATE RESPONSIVE ---------------------------------
  //----------------------------------------------------------------------------------------------------


  var changeNumberMonth = function ($from, $end) {
    var $vintage = $('.ibe-searcher__vintage'),
        $modal = $('.ibe_form__group-half').find('[data-dinamic-open]'),
        $advancedFly = $('.ibe-advanced-searcher--fly'),
        $ida = $advancedFly.find('[data-function="cal-start"]'),
        $vuelta = $advancedFly.find('[data-function="cal-end"]');

    if ($vintage.length > 0) {
      if (window.innerWidth < dFrontJs.resolutions.lg) {
        $vintage.find('[data-function="cal-start"], [data-function="cal-end"]').parent().addClass('ibe-searcher__calendar--all-months');
      } else {
        $vintage.find('[data-function="cal-start"], [data-function="cal-end"]').parent().removeClass('ibe-searcher__calendar--all-months');
      }

      $(window).on('resize', function (e) {
        if (window.innerWidth < dFrontJs.resolutions.lg) {
          $vintage.find('[data-function="cal-start"], [data-function="cal-end"]').parent().addClass('ibe-searcher__calendar--all-months');
        }

        $from.each(function () {
          $(this).datepicker('option', 'numberOfMonths', getNumberMonth());
        });
        $end.each(function () {
          $(this).datepicker('option', 'numberOfMonths', getNumberMonth());
        });
      });
    } else if ($modal.length > 0) {
      $(window).on('resize', function () {
        if (window.innerWidth < dFrontJs.resolutions.lg) {
          $modal.find('[data-function="cal-start"], [data-function="cal-end"]').parent().addClass('ibe-searcher__calendar--all-months');
        }

        $from.each(function () {
          $(this).datepicker('option', 'numberOfMonths', getNumberMonth());
        });
        $end.each(function () {
          $(this).datepicker('option', 'numberOfMonths', getNumberMonth());
        });
      });
    } else {
      $from.each(function () {
        $(this).datepicker('option', 'numberOfMonths', getNumberMonth());
      });
      $end.each(function () {
        $(this).datepicker('option', 'numberOfMonths', getNumberMonth());
      });

      if ($advancedFly.length > 0) {
        $ida.each(function () {
          $(this).datepicker('option', 'numberOfMonths', 1);
        });
        $vuelta.each(function () {
          $(this).datepicker('option', 'numberOfMonths', 1);
        });
      }
    }
  }; //*******************************************************************************************
  //***  Función para que puedan actualizar el calendario dada una fecha  ***
  //*******************************************************************************************


  var updateCalendar = function (selector, start, end) {
    var $elemento = $(selector);
    $elemento.each(function () {
      var $this = $(this),
          $parent = $this.closest('.ibe-tab__container'),
          $check = $parent.find('[data-function="roundtrip"]'),
          ida = $this.find('[data-cal="start"]'),
          //input de ida
      vuelta = $this.find('[data-cal="end"]'),
          //input de vuelta
      cal_ida = $this.find('[data-function="cal-start"]'),
          //calendario ida
      cal_vuelta = $this.find('[data-function="cal-end"]'),
          //calendario vuelta
      $journey = $('[data-journey="journey"]').length;

      if (!$this.parents('.ibe_form__group--half').hasClass('fc-initCalendar')) {
        initCalendar(cal_ida, cal_vuelta);
        $this.parents('.ibe_form__group--half').addClass('fc-initCalendar');
      }

      requestAnimFrame(function () {
        /*	if (ida.length > 0 && !ida.hasClass('initRangeDatepicker')) {
        		ida.addClass('initRangeDatepicker')
        		cal_ida.data('feedata', restrictions);
        		cal_ida.datepicker('option', 'beforeShowDay', rangeDays);
        		if (vuelta.length > 0 && !vuelta.hasClass('initRangeDatepicker')) {
        			vuelta.addClass('initRangeDatepicker');
        			cal_vuelta.data('feedata', restrictions);
        			cal_vuelta.datepicker('option', 'beforeShowDay', rangeDays);
        		}
        	}*/
        if (start !== undefined && start !== null) {
          //No entro a la función si no tengo fecha de ida
          ida.val(start); //Actualizo el input+ con la fecha dada

          ida.parents('.fc_form_group').addClass('ibe_form__group--content');
          cal_ida.datepicker('setDate', start); //Selecciono la fecha en el calendario

          cal_ida.data('datesRange', [cal_ida.datepicker('getDate'), null]);
          cal_vuelta.data('datesRange', [cal_ida.datepicker('getDate'), null]);
          cal_ida.datepicker('refresh');
          cal_vuelta.datepicker('refresh');
          ida.trigger('change'); //update validate input val

          if ($journey) {
            dFrontJs.ibe_journey.controlDates(ida);
          }

          if ($check.is(':checked')) {
            cal_vuelta.data('datesRange', [cal_ida.datepicker('getDate'), null]);
            cal_vuelta.datepicker('refresh');
          }

          if (end !== undefined && end !== null) {
            //No entro a la función si no tngo fecha de vuelta
            vuelta.val(end);
            vuelta.parents('.fc_form_group').addClass('ibe_form__group--content');
            cal_vuelta.datepicker('setDate', end);
            cal_ida.data('datesRange', [cal_ida.datepicker('getDate'), cal_vuelta.datepicker('getDate')]);
            cal_vuelta.data('datesRange', [cal_ida.datepicker('getDate'), cal_vuelta.datepicker('getDate')]);
            cal_ida.datepicker('refresh');
            cal_vuelta.datepicker('refresh');
            ida.trigger('change'); //update validate input val

            vuelta.trigger('change'); //Actualización del rango del calendario
          }
        }
      });
    });
  };

  var isDateAvailable = function (caldate, type, restrictionConfig, selectedDate) {
    var restriction, cellDate, cellDateStr, lastdate, keys, utcSelected, startDate;

    if (restrictionConfig) {
      restriction = restrictionConfig[type];
      cellDate = new Date(Date.UTC(caldate.getFullYear(), caldate.getMonth(), caldate.getDate()));
      cellDateStr = cellDate.toJSON();

      if (restriction.endDate === null) {
        lastdate = new Date();
        lastdate.setTime(lastdate.getTime() + 90 * 86400000);
      } else {
        lastdate = new Date(restriction.endDate);
      }

      if (restriction && restriction.info) {
        keys = Object.keys(restriction.info);
        startDate = new Date(restriction.startDate);

        if (cellDate.getTime() >= startDate.getTime() && cellDate.getTime() <= lastdate.getTime()) {
          if (selectedDate === null || selectedDate === undefined) {
            return typeof restriction.info[cellDateStr] === 'object' || typeof restriction.info[cellDateStr] === 'number';
          } else if (selectedDate) {
            utcSelected = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()));
            utcSelected = utcSelected.toJSON();

            if (restriction.info[utcSelected]) {
              return typeof restriction.info[utcSelected][cellDateStr] === 'object' || typeof restriction.info[utcSelected][cellDateStr] === 'number';
            } else {
              return isDateAvailable(caldate, type === 'departure' ? 'return' : 'departure', restrictionConfig);
            }
          }
        }
      } else if (restriction.info === null && cellDate.getTime() <= lastdate.getTime()) {
        return false;
      }
    }

    return true;
  };

  var noFlightsTooltip = function (selector) {
    var parent = $(selector);
    var literal = $('[data-noflights-tooltip]').data('noflights-tooltip');
    var noFlightsTooltipOptions = {
      animation: false,
      placement: 'top',
      trigger: 'hover',
      template: '<div class="tooltip ib-calendar--tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="icon-menos_2"></div><div class="tooltip-inner"></div></div>'
    };
    setTimeout(function () {
      var highlighted = parent.find('.date-has-tooltip span');
      highlighted.tooltip('destroy');
      highlighted.attr('title', literal);
      highlighted.tooltip(noFlightsTooltipOptions);
    }, 300);
  };

  var rangeDays = function (date) {
    if (rangeDays.self !== this) {
      rangeDays.self = this;
      rangeDays.this$ = $(this);
      rangeDays.formParent = rangeDays.this$.closest('form');
      rangeDays.roundtrip$ = rangeDays.formParent.find('[data-function="roundtrip"]');
      rangeDays.advanced$ = rangeDays.this$.parents('.ibe-advanced-searcher');
      rangeDays.oneway$ = rangeDays.advanced$.find('[data-calendar-disable]');
      rangeDays.calendarParent$ = rangeDays.this$.parents('.ibe_form__group--half');
      rangeDays.cal_from$ = rangeDays.calendarParent$.find('[data-function="cal-start"]');
      rangeDays.cal_end$ = rangeDays.calendarParent$.find('[data-function="cal-end"]');
      rangeDays.input_from$ = rangeDays.calendarParent$.find('[data-cal="start"]');
      rangeDays.input_to$ = rangeDays.calendarParent$.find('[data-cal="end"]');
      rangeDays.switch$ = rangeDays.formParent.find('[data-click="oneway"]');
    }

    var $this = rangeDays.this$,
        isDayEnabled = true,
        $roundtrip = rangeDays.roundtrip$,
        $advanced = rangeDays.advanced$,
        $oneway = rangeDays.oneway$,
        $cal_from = rangeDays.cal_from$,
        $cal_end = rangeDays.cal_end$,
        $input_from = rangeDays.input_from$,
        $input_to = rangeDays.input_to$,
        lastKnownDate = new Date(),
        auxSelectedDate,
        dateClass = ' actualDate-' + date.getDate() + '_' + (date.getMonth() + 1) + '_' + date.getFullYear() + ' ',
        $switch = rangeDays.switch$,
        minDate = new Date(),
        showNotAvailTooltip = false;
    minDate.setTime(new Date().getTime() + $cal_from.datepicker("option", "minDate") * 86400000);
    minDate.setHours(0);
    minDate.setMinutes(0);
    minDate.setSeconds(0);
    minDate.setMilliseconds(0);
    lastKnownDate.setTime(lastKnownDate.getTime() + 90 * 86400000);

    if ($this.data('feedata') && $this.data('feedata')['departure'].endDate) {
      lastKnownDate = new Date($this.data('feedata')['departure'].endDate);
    }

    if ($this.data('feedata')) {
      if ($roundtrip.length > 0 && !$roundtrip.is(':checked') || $advanced.length > 0 && $oneway.is(':checked')) {
        isDayEnabled = isDateAvailable(date, 'oneway', $this.data('feedata'));
      } else if ($this.data('function') === 'cal-start') {
        auxSelectedDate = $cal_end.datepicker('getDate');

        if (auxSelectedDate !== null && auxSelectedDate !== undefined && $input_to.val().length > 0 && $input_to.val() !== $input_to.attr('placeholder')) {
          if (date.getTime() < auxSelectedDate.getTime() && auxSelectedDate.getTime() <= lastKnownDate.getTime()) {
            isDayEnabled = isDateAvailable(date, 'return', $this.data('feedata'), auxSelectedDate);
          } else {
            isDayEnabled = isDateAvailable(date, 'departure', $this.data('feedata'));
          }
        } else {
          isDayEnabled = isDateAvailable(date, 'departure', $this.data('feedata'));
        }
      } else if ($this.data('function') === 'cal-end') {
        auxSelectedDate = $cal_from.datepicker('getDate');

        if (auxSelectedDate !== null && auxSelectedDate !== undefined && $input_from.val().length > 0 && $input_from.val() !== $input_from.attr('placeholder')) {
          if (date.getTime() >= auxSelectedDate.getTime() && auxSelectedDate.getTime() <= lastKnownDate.getTime()) {
            isDayEnabled = isDateAvailable(date, 'departure', $this.data('feedata'), auxSelectedDate);
          } else {
            isDayEnabled = isDateAvailable(date, 'return', $this.data('feedata'));
          }
        } else {
          isDayEnabled = isDateAvailable(date, 'return', $this.data('feedata'));
        }
      }
    }

    showNotAvailTooltip = !isDayEnabled && date.getTime() >= minDate.getTime();

    if ($this.data('datesRange') !== undefined) {
      // for (var i = 0; i < $this.data('datesRange').length; i++) {
      if (new Date($this.data('datesRange')[0]).getTime() === date.getTime()) {
        return [isDayEnabled, dateClass + 'selected-day--from' + (showNotAvailTooltip ? ' date-has-tooltip ' : '')];
      } else if (new Date($this.data('datesRange')[1]).getTime() === date.getTime() && $roundtrip.length === 0 && $oneway.length === 0 && $switch.length === 0) {
        return [isDayEnabled, dateClass + 'selected-day--to' + (showNotAvailTooltip ? ' date-has-tooltip ' : '')];
      } else if (new Date($this.data('datesRange')[1]).getTime() === date.getTime() && $roundtrip.is(':checked')) {
        return [isDayEnabled, dateClass + 'selected-day--to' + (showNotAvailTooltip ? ' date-has-tooltip ' : '')];
      } else if (new Date($this.data('datesRange')[1]).getTime() === date.getTime() && $advanced.length > 0 && !$oneway.is(':checked')) {
        return [isDayEnabled, dateClass + 'selected-day--to' + (showNotAvailTooltip ? ' date-has-tooltip ' : '')];
      } else if (new Date($this.data('datesRange')[1]).getTime() === date.getTime() && $switch.is(':checked')) {
        return [isDayEnabled, dateClass + 'selected-day--to' + (showNotAvailTooltip ? ' date-has-tooltip ' : '')];
      }

      if (new Date($this.data('datesRange')[0]).getTime() <= date.getTime() && new Date($this.data('datesRange')[1]).getTime() >= date.getTime() && $roundtrip.length === 0 && $oneway.length === 0 && $switch.length === 0) {
        if ($this.data('datesRange')[0] !== null) {
          return [isDayEnabled, dateClass + 'range' + (showNotAvailTooltip ? ' date-has-tooltip ' : '')];
        }
      } else if (new Date($this.data('datesRange')[0]).getTime() <= date.getTime() && new Date($this.data('datesRange')[1]).getTime() >= date.getTime() && $roundtrip.is(':checked')) {
        if ($this.data('datesRange')[0] !== null) {
          return [isDayEnabled, dateClass + 'range' + (showNotAvailTooltip ? ' date-has-tooltip ' : '')];
        }
      } else if (new Date($this.data('datesRange')[0]).getTime() <= date.getTime() && new Date($this.data('datesRange')[1]).getTime() >= date.getTime() && $advanced.length > 0 && !$oneway.is(':checked')) {
        if ($this.data('datesRange')[0] !== null) {
          return [isDayEnabled, dateClass + 'range' + (showNotAvailTooltip ? ' date-has-tooltip ' : '')];
        }
      } else if (new Date($this.data('datesRange')[0]).getTime() <= date.getTime() && new Date($this.data('datesRange')[1]).getTime() >= date.getTime() && $switch.is(':checked')) {
        if ($this.data('datesRange')[0] !== null) {
          return [isDayEnabled, dateClass + 'range' + (showNotAvailTooltip ? ' date-has-tooltip ' : '')];
        }
      }
    }

    return [isDayEnabled, dateClass + (showNotAvailTooltip ? 'date-has-tooltip' : '')];
  };

  var _disableRound = function () {
    var $this = $(this),
        $parent = $this.closest('.ibe-search-collapse'),
        $input_from = $parent.find('[data-cal="start"]'),
        $from_val = $input_from.val(),
        $input_to = $parent.find('[data-cal="end"]'),
        $to_val = $input_to.val(),
        $from_cal = $parent.find('[data-function="cal-start"]'),
        $to_cal = $parent.find('[data-function="cal-end"]');

    if (!$this.is(':checked')) {
      if ($input_to.val().length < 10) {
        $input_to.val('');
        $input_to.closest('.ibe_form__group-half').removeClass('ibe_form__group--content');

        if ($to_cal.find('.selected-day--from').length === 0 && $from_cal.find('.selected-day--from').length === 0) {
          $to_cal.datepicker('setDate', 'null');
        }
      }

      $input_from.closest('.icon-caret_derecha').removeClass('icon-caret_derecha').closest('.ibe_form__group--error').find('[data-cal="start"]').trigger('change');
      $input_from.closest('.ibe_form__group--half').addClass('ibe_form__group--half-only-round');

      if ($from_val !== "" && $to_val !== "" || $from_val === "" && $to_val !== "") {
        $from_cal.find('.selected-day--to').removeClass('selected-day--to');
        $from_cal.find('.range').removeClass('range');
      } else {
        $input_to.closest('.ibe_form__group-half').addClass('ibe_form__group--content');
        $from_cal.datepicker('refresh');
        $to_cal.datepicker('refresh');
      }
    } else {
      $input_from.closest('.ibe_form__group-half').addClass('icon-caret_derecha').closest('.ibe_form__group--error').find('[data-cal="start"]').trigger('change');
      $input_from.closest('.ibe_form__group--half').removeClass('ibe_form__group--half-only-round');

      if ($from_val !== "" && $to_val !== "" || $from_val === "" && $to_val !== "") {
        $from_cal.find('.selected-day--to').removeClass('selected-day--to');
        $from_cal.find('.range').removeClass('range');
      } else if ($to_val === "") {
        $input_to.closest('.ibe_form__group-half').removeClass('ibe_form__group--content');
      } else {
        $input_to.closest('.ibe_form__group-half').addClass('ibe_form__group--content');
        $from_cal.datepicker('refresh');
        $to_cal.datepicker('refresh');
      }
    }

    if (quadrigam !== "HMADVS" && quadrigam !== "HMEXPS" && quadrigam !== "HMPLRC" && quadrigam !== "HMFAQS" && !quadrigam.startsWith("HMEX")) {
      dFrontJs.ibe_validations_searcher.dateValidator($input_from.parents('.ibe_form__group.ibe_form__group--half'));
    } else {
      if ($('#SearcherContent > div > form > fieldset > div.ibe-search-collapse__row.ibe-search-collapse__row--first > div > div.ibe-search-collapse__item.ibe-search-collapse__item--input.ibe-searcher__stopover-calendar > div').find('[data-validate="exist-one-way"]').hasClass('hidden') && !$('#SearcherContent > div > form > fieldset > div.ibe-search-collapse__row.ibe-search-collapse__row--first > div > div.ibe-search-collapse__item.ibe-search-collapse__item--input.ibe-searcher__stopover-calendar > div').find('[data-validate="exist"]').hasClass('hidden')) {
        $('#SearcherContent > div > form > fieldset > div.ibe-search-collapse__row.ibe-search-collapse__row--first > div > div.ibe-search-collapse__item.ibe-search-collapse__item--input.ibe-searcher__stopover-calendar > div').find('[data-validate="exist-one-way"]').removeClass('hidden');
        $('#SearcherContent > div > form > fieldset > div.ibe-search-collapse__row.ibe-search-collapse__row--first > div > div.ibe-search-collapse__item.ibe-search-collapse__item--input.ibe-searcher__stopover-calendar > div').find('[data-validate="exist"]').addClass('hidden');
      } else if (!$('#SearcherContent > div > form > fieldset > div.ibe-search-collapse__row.ibe-search-collapse__row--first > div > div.ibe-search-collapse__item.ibe-search-collapse__item--input.ibe-searcher__stopover-calendar > div').find('[data-validate="exist-one-way"]').hasClass('hidden') && $('#SearcherContent > div > form > fieldset > div.ibe-search-collapse__row.ibe-search-collapse__row--first > div > div.ibe-search-collapse__item.ibe-search-collapse__item--input.ibe-searcher__stopover-calendar > div').find('[data-validate="exist"]').hasClass('hidden')) {
        $('#SearcherContent > div > form > fieldset > div.ibe-search-collapse__row.ibe-search-collapse__row--first > div > div.ibe-search-collapse__item.ibe-search-collapse__item--input.ibe-searcher__stopover-calendar > div').find('[data-validate="exist-one-way"]').addClass('hidden');
        $('#SearcherContent > div > form > fieldset > div.ibe-search-collapse__row.ibe-search-collapse__row--first > div > div.ibe-search-collapse__item.ibe-search-collapse__item--input.ibe-searcher__stopover-calendar > div').find('[data-validate="exist"]').removeClass('hidden');
      }
    }
  };

  var keyupFunction = function (selector) {
    $(selector).off('keyup', _inputsKeyup);
    $(selector).on('keyup', _inputsKeyup);
  };

  var performanceTime = function (time) {
    var $time = time || endTimeCalendar;
    return $time - performance.timing.navigationStart;
  }; //Mover check avios en el buscador de puente aereo


  var moveCheckAviosPuente = function (e) {
    var dataMove = $('[data-move-check]');

    if (dataMove.length > 0 && window.innerWidth < dFrontJs.resolutions.md) {
      dataMove.insertBefore($('[data-move-inmobile]'));
      dataMove.css('display', 'block');
    } else {
      $('[data-check-indesktop]').append(dataMove);
    }
  };

  var updateAvailableDates = function (selector, restrictions) {
    var parent = $(selector);
    var cal_ida = parent.find('[data-function=cal-start]');
    var cal_vuelta = parent.find('[data-function=cal-end]');
    cal_ida.data('feedata', restrictions);
    cal_vuelta.data('feedata', restrictions);
    cal_ida.datepicker('refresh');
    cal_vuelta.datepicker('refresh');
  };

  return {
    'init': init,
    'initCalendar': initCalendar,
    'updateCalendar': updateCalendar,
    'changeNumberMonth': changeNumberMonth,
    'getNumberMonth': getNumberMonth,
    'clickOneWay': clickOneWay,
    'activeOneWayFunction': activeOneWayFunction,
    'activeRountripFunction': activeRountripFunction,
    'keyupFunction': keyupFunction,
    'performanceTime': performanceTime,
    'moveCheckAviosPuente': moveCheckAviosPuente,
    'updateAvailableDates': updateAvailableDates
  };
}(jQuery);
"use strict";

dFrontJs.ibe_searcher_choose_city = function () {
  /*eslint no-underscore-dangle: ['error', { 'allow': ['_loadSelectedCity', '_cityClick', '_letterClick', '_createIosList', '_buttonInit','_constructor'] }]*/
  var arrayToResize = [];

  var _loadSelectedCity = function ($input) {
    var value = $input.val(),
        cities = $input.parent().find('[data-filter-result]');
    cities.each(function () {
      var $this = $(this);

      if ($this.text() === value) {
        $this.addClass('city-selected');
      }
    });
  };

  var selectedCity = function ($selector) {
    var $cityList = $selector.find('[data-tab-cities="mobile"]'),
        $container = $cityList.parent(),
        $cityActive = $container.find('.city-selected'),
        $input = $selector.find('[data-autocomplete="cities"]');

    if ($cityActive.length > 0) {
      if ($input.val() === "") {
        $cityActive.removeClass('city-selected');
      } else {
        if ($cityList.find('.ioslist').length === 0) {
          if ($cityList.find('.ioslist-wrapper').offset() !== undefined) {
            setTimeout(function () {
              $cityList.find('.ioslist-wrapper').animate({
                scrollTop: $cityList.find('.city-selected').offset().top - $cityList.find('.ioslist-wrapper').offset().top + $cityList.find('.ioslist-wrapper').scrollTop() - 12
              }, 1000);
            }, 1000);
          } // Rest of ocassions

        } else {
          $cityList.find('.ioslist').animate({
            scrollTop: $cityList.find('.city-selected').offset().top - $cityList.find('.ioslist').offset().top + $cityList.find('.ioslist').scrollTop() - 12
          }, 600);
        }
      }
    }
  };

  var _cityClick = function () {
    var $this = $(this),
        text = $this.text(),
        $collapse = $this.parents('.ibe-choose-city'),
        $parent = $collapse.parents('.ibe_form__group'),
        $input = $parent.find('.ibe_form__input-text'),
        dataDestinationInfo = $this.attr('data-destination-info'),
        $modal = $('.ibe-dinamic-modal'),
        $vintage;
    $input.val(text);
    $input.trigger('focusout');
    $collapse.collapse('hide');
    $input.attr('data-destination-info', dataDestinationInfo);

    if ($modal) {
      $this.parents('[data-city-list]').find('.city-selected').removeClass('city-selected');
      $this.addClass('city-selected');
      dFrontJs.ibe_dinamic_modal.close($this);
    } /////// To close the modal in case of vintage search//////////////////


    $vintage = $('.ibe-searcher__vintage');

    if ($vintage.length > 0) {
      $this.parents('[data-city-list]').find('.city-selected').removeClass('city-selected');
      $this.addClass('city-selected');
      dFrontJs.ibe_modals_vintage.closeModalsVintage();
    } //////////////////// End close the modal /////////////////////////////////////

  };

  var _letterClick = function () {
    var $this = $(this),
        $parent = $this.parents('.ibe-filter-letter__header'),
        data = $this.data('filter-letter'),
        active = 'ibe-filter-letter__menu-item--active'; //Menu active

    $parent.find('.' + active).removeClass(active);
    $this.parent().addClass(active); //Condicion 'todos' o por letra 'A'

    if (data === 'all') {
      $parent.parent().find('.ui-tabs-panel:visible [data-filter-result]').parent().show();
    } else {
      $parent.parent().find('.ui-tabs-panel:visible [data-filter-result]').parent().hide();
      $parent.parent().find('.ui-tabs-panel:visible [data-filter-result="' + data + '"]').parent().show();
    }
  };

  var _createIosList = function (currentTab) {
    requestAnimFrame(function () {
      //Request for first load tabs
      var $currentTab = $(currentTab);

      if ($currentTab.find('[data-function="city-list"]').length > 0 && $currentTab.find('.ioslist').html().length > 0 && !$currentTab.hasClass('started')) {
        $currentTab.addClass('started');
        $currentTab.find('[data-function="city-list"]').ioslist();
      }
    });
  };

  var countryListConstructor = function (selector, json) {
    var $parent = $(selector).parent(),
        countryListMenu = $parent.find('.ibe-tab__menu'),
        countryListContent = $parent.find('.ibe-tab__container'),
        docFragment = document.createDocumentFragment(),
        docFragmentContent = document.createDocumentFragment(),
        classNAMEdiv1 = 'ibe-filter-letter',
        classNAMEdiv2 = 'ibe-filter-letter__container',
        classNAMEioslist = 'ioslist',
        classNAMEul = 'ibe-filter-letter__result',
        classNAMEli = 'ibe-tab__menu-item',
        classNAMEa = 'link link__regular',
        idSelector = $('.fc-dialog-all-destinations').is(':visible') ? $('[data-modal-view=".fc-dialog-all-destinations"]').attr('id') : $(selector).parents('.ibe_form__group').find('.ibe_form__input-text').attr('id');

    if (countryListMenu.parents('.ibe-choose-city').find('.ibe-tab').hasClass('ui-tabs')) {
      countryListMenu.parents('.ibe-choose-city').find('.ibe-tab').tabs('destroy');
      countryListMenu.html('');
      countryListContent.find('[data-tab-cities]').remove();
    }

    $.each(json, function (index) {
      // CountryListMenu
      var $this = this,
          country = $this.description,
          code = $this.code,
          div1 = document.createElement('div'),
          div2 = document.createElement('div'),
          div3 = document.createElement('div'),
          ul = document.createElement('ul'),
          li = document.createElement('li'),
          a = document.createElement('a'); //pais

      li.classList.add(classNAMEli);
      a.classList.addMany(classNAMEa);

      if (window.innerWidth < dFrontJs.resolutions.lg && !$('.fc-dialog-all-destinations').is(':visible')) {
        a.setAttribute('href', '#tab-cities-mobile-' + index + '-' + idSelector);
      } else {
        a.setAttribute('href', '#tab-cities-' + index + '-' + idSelector);
      }

      a.setAttribute('title', country);
      a.textContent = country;
      li.appendChild(a);
      docFragment.appendChild(li); // End CountryListMenu
      // CountryListContent

      if (window.innerWidth < dFrontJs.resolutions.lg && !$('.fc-dialog-all-destinations').is(':visible')) {
        div1.setAttribute('data-tab-cities', 'mobile');
        div1.setAttribute('id', 'tab-cities-mobile-' + index + '-' + idSelector);
        div2.setAttribute('data-function', 'city-list');
        div2.classList.add(classNAMEioslist);
        div1.appendChild(div2);
        docFragmentContent.appendChild(div1);
      } else {
        ul.classList.add(classNAMEul);
        div1.setAttribute('data-tab-cities', 'desktop');
        div1.setAttribute('id', 'tab-cities-' + index + '-' + idSelector);
        div2.classList.add(classNAMEdiv1);
        div3.classList.add(classNAMEdiv2);
        div3.appendChild(ul);
        div2.appendChild(div3);
        div1.appendChild(div2);
        docFragmentContent.appendChild(div1);
      } // End CountryListContent

    });
    countryListMenu.append(docFragment);
    countryListContent.append(docFragmentContent);
  };

  var cityListConstructor = function (selector, tab, json) {
    var _selector = selector.get(0);

    var $parent = _selector.parentElement;
    var $activeTab, listActive, positionActiveTab, currentTab, ulList, docFragment, letter, letterAux, ul, div, div2, html, classNAMEli, classNAMEa, classNAMEdiv, classNAMEdiv2, city;
    var dialog = document.querySelector('.fc-dialog-all-destinations');
    var isDialogVisible = dialog ? dialog.checkVisibility() : false;
    var isMobile = window.innerWidth < dFrontJs.resolutions.lg && !isDialogVisible;

    if (tab === -1) {
      $activeTab = isDialogVisible ? _selector.querySelector('.ui-tabs-active') : $parent.querySelector('.ui-tabs-active');
    } else {
      $activeTab = isDialogVisible ? _selector.querySelector('.ui-tabs-active') : mobile ? $parent.querySelector('.hidden-lg.hidden-xl').querySelector('.ui-tabs-active') : $parent.querySelector('.hidden-xs.hidden-sm.hidden-md').querySelector('.ui-tabs-active');
    }

    listActive = $activeTab.getAttribute('aria-controls');
    positionActiveTab = [].slice.call($activeTab.parentNode.children).indexOf($activeTab);
    docFragment = document.createDocumentFragment();
    letter = $('[data-filter-letter]');
    letterAux = '';
    ul;
    div = document.createElement('div');
    div2 = document.createElement('div');
    html = '';
    classNAMEli = 'ibe-filter-letter__result-item';
    classNAMEa = 'link link__regular';
    classNAMEdiv = 'ioslist-group-container';
    classNAMEdiv2 = 'ioslist-group-header'; // [data-destination-info='' --> Country|IATA|locationID || description]
    //meter en document y añadir el listado final después del <for> var docFragment = document.createDocumentFragment();

    json[positionActiveTab].cities.forEach(function (current) {
      var $this = current,
          country = $this.country.description,
          //pais
      city = $this.description,
          //ciudad
      iata = $this.code,
          //IATA
      letter = city.charAt(0),
          url = $this.url || "#ni",
          dataDestinationInfo = $this.country.locationId !== undefined ? $this.country.code + '|' + $this.code + '|' + $this.country.locationId : $this.country.code + '|' + $this.code + '|' + $this.description,
          //First letter
      // ulAux = ul,
      li = document.createElement('li'),
          a = document.createElement('a'); //MOBILE

      if (isMobile) {
        if (letterAux !== letter) {
          letterAux = letter;
          div = document.createElement('div');
          div2 = document.createElement('div');
          ul = document.createElement('ul');
          div2.textContent = letterAux;
          div.appendChild(div2);
        }

        div.classList.add(classNAMEdiv);
        div2.classList.add(classNAMEdiv2);
        a.classList.addMany(classNAMEa);
        a.setAttribute('href', url);
        a.setAttribute('title', city + ' (' + iata + ')');
        a.setAttribute('data-filter-result', letter);
        a.setAttribute('data-country', country);
        a.setAttribute('data-destination-info', dataDestinationInfo);
        a.textContent = city + ' (' + iata + ')';
        li.appendChild(a);
        ul.appendChild(li);
        div.appendChild(ul);
        docFragment.appendChild(div);
      } else {
        //DESKTOP
        li.classList.add(classNAMEli);
        a.classList.addMany(classNAMEa);
        a.setAttribute('href', url);
        a.setAttribute('title', city + ' (' + iata + ')');
        a.setAttribute('data-filter-result', letter);
        a.setAttribute('data-country', country);
        a.setAttribute('data-destination-info', dataDestinationInfo);
        a.textContent = city + ' (' + iata + ')';
        li.appendChild(a);
        docFragment.appendChild(li);
      }
    });

    if (isMobile) {
      ulList = $parent.querySelector('.hidden-lg.hidden-xl').querySelectorAll('[data-tab-cities="mobile"]');
      ulList.forEach(function (node) {
        var item = node.parentElement;
        item = item.querySelector('#' + listActive).querySelector('.ioslist');
        item.append(docFragment);
      });
    } else {
      ulList = $parent.querySelectorAll('[data-cities-list]');
      ulList.forEach(function (node) {
        var item = node.querySelector('#' + listActive).querySelector('.ibe-filter-letter__result');
        item.append(docFragment);
      });
    }

    if (!$activeTab.classList.contains('loaded_cities')) {
      $activeTab.classList.add('loaded_cities');
    }

    letter.off('click', _letterClick);
    letter.on('click', _letterClick);
    city = $('[data-filter-result]');
    city.off('click', _cityClick);
    city.on('click', _cityClick);

    if (isMobile) {
      currentTab = $activeTab.closest('.ibe-choose-city--mobile');
      currentTab = currentTab.querySelector('.ui-tabs-panel[aria-labelledby=' + $activeTab.getAttribute('aria-labelledby') + ']'); // requestAnimFrame(function(){

      _createIosList(currentTab); // });

    } else {
      requestAnimFrame(function () {
        var item = document.querySelector('.ibe-filter-letter__menu-item');
        item.classList.remove('ibe-filter-letter__menu-item--active');
        var all = document.querySelector('[data-filter-letter="all"]');
        all = all.parentElement;
        all.classList.add('ibe-filter-letter__menu-item--active');
      });
    }
  };

  var _buttonInit = function (selector, json) {
    var $input = $('[data-autocomplete="cities"]');
    var $selector = selector !== undefined ? $(selector) : $input;
    json = json !== undefined ? json : '';
    $selector.each(function () {
      var $button = mobile ? $(this).parent().find('.hidden-lg.hidden-xl button:not([data-dinamic-close])') : $(this).parent().find('.hidden-xs.hidden-sm.hidden-md button:not([data-dinamic-close])');

      if ($(this).data('modal-view') === '.fc-dialog-all-destinations') {
        $button = $(this);
      }

      var selector = $(this).data('modal-view') === '.fc-dialog-all-destinations' ? $('.fc-dialog-all-destinations:visible').find('.modal-body') : $(this),
          tab = $(selector).parent().find('[data-tab="jquery-ui"]');
      var $parent, $activeTab, positionActiveTab;
      countryListConstructor(selector, json);
      dFrontJs.ibe_tab.iniTabsjquery(tab, json);
      $parent = $(selector).parent();
      $activeTab = mobile ? $parent.find('.hidden-lg.hidden-xl .ui-tabs-active') : $parent.find('.hidden-xs.hidden-sm.hidden-md .ui-tabs-active');
      positionActiveTab = $activeTab.index();
      cityListConstructor(selector, positionActiveTab, json);
    });
  };

  var init = function (selector, json) {
    var $selector = selector !== undefined ? $(selector) : '';
    json = json !== undefined ? json : '';

    _buttonInit($selector, json);

    arrayToResize.push({
      $selector: $selector,
      json: json
    });
    $(window).on('resize', function () {
      clearTimeout($.data(this, 'resizeCity'));
      $.data(this, 'resizeCity', setTimeout(function () {
        var i;

        if (dFrontJs.app.changeView()) {
          for (i = 0; arrayToResize.length > i; i++) {
            if (!arrayToResize[i].$selector.hasClass('initSearcherChooseCityResize')) {
              arrayToResize[i].$selector.addClass('initSearcherChooseCityResize');

              _buttonInit(arrayToResize[i].$selector, arrayToResize[i].json);
            }
          }
        }
      }, 100));
    });
  }; //init


  return {
    'init': init,
    'selectedCity': selectedCity,
    'cityListConstructor': cityListConstructor,
    'arrayToResize': arrayToResize
  };
}(jQuery);
"use strict";

//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: People counter
//    Descripcion: Funcion para seleccionar pasajeros en buscador de hotel
//******************************************************************************/

/*eslint no-underscore-dangle: ["error", { "allow": ["__constructor", "_print"] }]*/
dFrontJs.ibe_searcher_people_counter = function () {
  //Variables
  var $obj = 0,
      $input = 0,
      $list = 0,
      $parent = 0,
      $important = 0,
      $babies = 0,
      $counter = 0,
      $babiesCount = 0,
      $peopleAdult,
      $peopleChildren,
      $peopleBabies,
      $peopleSenior,
      $peopleYoung,
      $count,
      $peopleTeenager,
      $form,
      classPlus = 'ibe-people-counter__counter--plus',
      classNone = 'ibe-people-counter__counter--none',
      $agesList = ['02', '02', '02', '02', '02', '02', '02', '02'],
      countNumber,
      nine; //Constructor

  /**@name constructor 
   * @description Initialize selectors for a people counter compontent
   * @param $this Selector of the html for people counter component
   */

  var __constructor = function ($this) {
    $obj = $this;
    $form = $this.parents('.ibe_form__group');
    $input = $form.find('.ibe_form__input-text');
    $list = $this.parents('.ibe-people-counter__list');
    $parent = $this.parents('.ibe-people-counter__list-item');
    $count = $parent.find('[data-people-counter="counter"]');
    $important = $list.find('.fc-people-counter-important');
    $babies = $list.find('.fc-people-counter-babies');
    $babiesCount = $list.find('.fc-people-counter-babies').find('[data-people-counter="counter"]');
    $peopleSenior = '[data-people-type="senior"]';
    $peopleAdult = '[data-people-type="adult"]';
    $peopleChildren = '[data-people-type="children"]';
    $peopleBabies = '[data-people-type="babies"]';
    $peopleYoung = '[data-people-type="young"]';
    $peopleTeenager = '[data-people-type="teenager"]';
  }; //Restamos o sumamos al contador actual

  /**@name lessOrPlus
   * @param
   * @description Add or subtract in one the number of pasengers
   */


  var lessOrPlus = function () {
    var c = parseInt($count.text());
    $obj.data('people-counter-button') == 'less' ? c-- : c++;
    return c;
  }; //Devuelve el numero maximo de personas

  /**@name getNumberOrPeople
   * @param
   * @description Returns the number of people
   * @return An integer with the number of people that are not babies
   */


  var getNumberOrPeople = function () {
    var n = 0;
    $.each($list.find('.ibe-people-counter__list-item').not($parent).not($babies), function () {
      n = n + parseInt($(this).find('[data-people-counter="counter"]').html());
    });
    n = n + countNumber;
    return n;
  }; //Recorre el objeto que se le pasa por parametro y suma sus contadores

  /**@name getSumCountersObj
   * @param $o A selector that it's wanted to sum the total number of passengers
   * @description Returns the number of people
   * @return An integer with the number of people
   */


  var getSumCountersObj = function ($o) {
    var i = 0;
    $.each($o, function () {
      i = i + parseInt($(this).find('[data-people-counter="counter"]').text());
    });
    return i;
  }; //Actualiza y guarda las edades seleccionadas al añadir o eliminar niños

  /**@name updateAgesList
   * @param array
   * @description Updates the ages of child's ages array
   */


  var updateAgesList = function (array) {
    var i;
    setTimeout(function () {
      for (i = 0; i < array.length; i++) {
        $agesList[i] = array.eq(i).val();
      }
    }, 500);
  }; //Guarda los valores de las edades cuando éstos cambian su valor

  /**@name udpdateValueChildren
   * @param array
   * @description Update variable that store the Children ages values
   */


  var udpdateValueChildren = function () {
    $('.fc-people-counter-children select').on('change', function () {
      updateAgesList($('.fc-people-counter-children select'));
    });
  }; //Validaciones visuales

  /**@name visualValidations 
   * @description Enable or disable the buttons to add or substract children
   * @param parentElem
   * @param listElem
   * @param imp
  */


  var visualValidations = function (parentElem, listElem, imp) {
    var $parentIn = parentElem || $parent;
    var $listIn = listElem || $list;
    var sumChil, sumBabies, sumMin, total;
    $important = imp || $important;
    $babiesCount = $listIn.find('.fc-people-counter-babies').find('[data-people-counter="counter"]');

    if ($($parentIn).parents('[data-validate-searcher]').length || $($parentIn).parents('[data-valid-form]').length) {
      if ($babiesCount.html() == getSumCountersObj($important)) {
        $listIn.find('.fc-people-counter-babies').addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').attr('disabled', 'disabled');
      } else if (!$('[data-checkBaby]:visible').is(':checked')) {
        $listIn.find('.fc-people-counter-babies').removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').removeAttr('disabled');
      }

      $listIn.find('[data-people-counter="counter"]').each(function () {
        if (parseInt($(this).html()) == 0) {
          $(this).parent().addClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').attr('disabled', 'disabled');
        } else if ($(this).data('people-type') == 'children' && $(this).html() >= 1) {
          $(this).parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').removeAttr('disabled');
        } else if ($(this).html() >= 1) {
          $(this).parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').removeAttr('disabled');
        }
      });

      switch (getSumCountersObj($important) + getSumCountersObj($listIn.find('.fc-people-counter-children'))) {
        case 1:
          $listIn.find('[data-people-counter="counter"]').each(function () {
            if ($(this).html() == 1) {
              $(this).parent().addClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').attr('disabled', 'disabled');
            }
          });
          break;

        case 9:
          $important.addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').attr('disabled', 'disabled');
          $listIn.find('.fc-people-counter-children').addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').attr('disabled', 'disabled');
          break;

        default:
          if (getSumCountersObj($important) > 1) {
            //>=0 para que niños puedan viajar solos sino >1
            $important.find('[data-people-counter="counter"]').each(function () {
              if ($(this).html() > 0) {
                $(this).parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').removeAttr('disabled');
              }
            });
          } else {
            $important.find('[data-people-counter="counter"]').each(function () {
              if ($(this).html() > 0) {
                $(this).parent().addClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').attr('disabled', 'disabled');
              }
            });
          }

          $listIn.find('.fc-people-counter-children [data-people-counter="counter"]').each(function () {
            //toggle para que niños no puedan viajar solos
            if ($(this).html() > 0) {
              $(this).parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').removeAttr('disabled');
            }
          });
          $listIn.find('.fc-people-counter-children').removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').removeAttr('disabled');
          $important.each(function (i, element) {
            if (!$(element).find('.ibe-people-counter__message').hasClass('active')) {
              $(element).removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').removeAttr('disabled');
            }
          });
      }

      if (parseInt($babiesCount.html()) >= 1) {
        $babiesCount.parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').removeAttr('disabled');
      }

      sumChil = parseInt($listIn.find('.fc-people-counter-children [data-people-counter="counter"]').html());
      sumChil = !isNaN(sumChil) ? sumChil : 0;
      sumBabies = isNaN(parseInt($babiesCount.html())) ? 0 : parseInt($babiesCount.html());
      sumMin = sumChil + sumBabies;
      total = sumChil + getSumCountersObj($important);

      if (sumMin > 2 * getSumCountersObj($important) && getSumCountersObj($important) !== 0) {
        $listIn.find('.fc-people-counter-children').removeClass('ibe-people-counter__item-children-alone');
        $listIn.find('.fc-people-counter-children').addClass('ibe-people-counter__item-children');
      } else if (sumChil > 0 && getSumCountersObj($important) == 0) {
        $listIn.find('.fc-people-counter-children').removeClass('ibe-people-counter__item-children');
        $listIn.find('.fc-people-counter-children').addClass('ibe-people-counter__item-children-alone');
        $listIn.find('.fc-people-counter-children').addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').attr('disabled', 'disabled');
      } else if (total == 9) {
        $listIn.find('.fc-people-counter-children').addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').attr('disabled', 'disabled');
      } else {
        $important.each(function (i, element) {
          if (!$(element).find('.ibe-people-counter__message').hasClass('active')) {
            $(element).removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').removeAttr('disabled');
          }
        });
        $listIn.find('.fc-people-counter-children').removeClass('ibe-people-counter__item-children');
        $listIn.find('.fc-people-counter-children').removeClass('ibe-people-counter__item-children-alone');
        $listIn.find('.fc-people-counter-children').removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').removeAttr('disabled');
      }
    }
  }; //Mostrar las edades de los niños


  var showChildrenAges = function (countChildren, parent, list) {
    var $countChildren = countChildren || countNumber;
    var $ages, $selectors, id, html, minAges, maxAges, i, index, $select;
    $parent = parent || $parent;
    $list = list || $list;
    $ages = $parent.find('.ibe-people-counter__ages');
    $selectors = $parent.find('.ibe_form__selectize-multi__selectors'); //Con el siguiente data distinguimos los distintos ids de los elementos de los formularios en cada tab

    id = $list.attr('data-id');
    $selectors.html('');

    if ($countChildren <= 0) {
      $ages.css('display', 'none');
    } else {
      html = '';
      minAges = $ages.data('min-ages') || 2;
      maxAges = $ages.data('max-ages') || 17;

      for (i = 0; i < $countChildren; i++) {
        html += '<label class="hideAccessible" for="' + id + 'children_' + i + '">Ni&ntilde;o ' + (i + 1) + '</label>' + '<select class="ibe_form__selectize" name="' + id + 'children_' + i + '" data-selectize="simple" id="' + id + 'children_' + i + '">';

        for (index = minAges; index <= maxAges; index++) {
          if (index < 10) {
            html += '<option value="0' + index + '">0' + index + '</option>';
          } else {
            html += '<option value="' + index + '">' + index + '</option>';
          }
        }

        html += '</select>';
      }

      $selectors.append(html);
      dFrontJs.ibe_combobox.init();
      $select = $parent.find('select');

      for (i = 0; i < $select.length; i++) {
        $select.eq(i)[0].selectize.setValue($agesList[i].toString());
      }

      udpdateValueChildren();
      setTimeout(function () {
        $ages.css('display', 'block');
      }, 100);
    }
  }; //Init


  var init = function (elem) {
    var $element, $thisTime, list, imp, item, countn;

    if (elem !== undefined) {
      $element = $(elem);
      $thisTime = $element.parent();
      list = $thisTime.find('.ibe-people-counter__list');
      imp = list.find('.fc-people-counter-important');
    } else {
      $thisTime = $('.ibe-people-counter').parent();
      list = $thisTime.find('.ibe-people-counter__list');
      imp = list.find('.fc-people-counter-important');
    }

    $.each($thisTime, function () {
      item = $(this).find('.ibe-people-counter__list-item');
      list = $(this).find('.ibe-people-counter__list');
      imp = list.find('.fc-people-counter-important');

      if (!$(this).find('button').hasClass('fc-people-counter-active')) {
        $(this).find('button').not('[data-dinamic-close]').addClass('fc-people-counter-active');

        __constructor($(this));

        visualValidations(item, list, imp);
        $(this).find($('[data-people-counter-button]')).on('click', function () {
          var i, total, b, j, babiesRecount, adultsRecount, seniorRecount, youngRecount, childrenRecount, teenagerRecount, recount, $people_counter, aType, html, _print;

          __constructor($(this)); //Recogemos el valor actual del contador


          countNumber = lessOrPlus(); //Recogemos el numero maximo de personas

          nine = getNumberOrPeople(); //Si es adulto (Senior, Adulto, Jovenes)

          if ($parent.hasClass('fc-people-counter-important') && nine <= 9) {
            i = getSumCountersObj($important.not($parent));

            if (countNumber <= 0) {
              countNumber = 0; //toggle para que niños no puedan viajar solos( cambiar también el visual )

              if (i <= 0) {
                countNumber = 1;
              }
            }

            $count.html(countNumber);
            total = getSumCountersObj($important);

            if ($parent.hasClass('fc-people-counter-important')) {
              //Comprobar numero de bebes
              b = parseInt($babies.find('[data-people-counter="counter"]').text());

              if (total < b) {
                $babies.find('[data-people-counter="counter"]').html(total);
              }
            } //Si es bebé

          } else if ($parent.hasClass('fc-people-counter-babies')) {
            //Recojemos el numero maximo de adultos
            j = getSumCountersObj($important);

            if (countNumber > 0) {
              if (countNumber >= j) {
                countNumber = j;
              }
            } else {
              countNumber = 0;
            }

            $count.html(countNumber); //Si es niños
          } else if ($parent.hasClass('fc-people-counter-children') && nine <= 9) {
            if (countNumber > 9) {
              countNumber = 9;
            } else if (countNumber < 0) {
              countNumber = 0;
            }

            $count.html(countNumber); //Edades de los niños

            showChildrenAges();
          } //Aplicar estilos --plus/--none


          if (nine <= 9) {
            countNumber > 0 ? $count.addClass(classPlus).removeClass(classNone) : $count.addClass(classNone).removeClass(classPlus);
          } else if (nine > 9) {
            if (parseInt($babiesCount.html()) !== 0) {
              countNumber > 0 ? $babiesCount.addClass(classPlus).removeClass(classNone) : $babiesCount.addClass(classNone).removeClass(classPlus);
            } else {
              $babiesCount.addClass(classNone).removeClass(classPlus);
            }
          } //Validaciones visuales


          visualValidations($(this)); //Recuento

          babiesRecount = getSumCountersObj($list.find('.ibe-people-counter__list-item.fc-people-counter-babies'));
          adultsRecount = getSumCountersObj($list.find('[data-people-type="adult"]').parents('.ibe-people-counter__list-item.fc-people-counter-important'));
          seniorRecount = getSumCountersObj($list.find('[data-people-type="senior"]').parents('.ibe-people-counter__list-item.fc-people-counter-important'));
          youngRecount = getSumCountersObj($list.find('[data-people-type="young"]').parents('.ibe-people-counter__list-item.fc-people-counter-important'));
          childrenRecount = getSumCountersObj($list.find('.ibe-people-counter__list-item.fc-people-counter-children'));
          teenagerRecount = getSumCountersObj($list.find('[data-people-type="teenager"]').parents('.ibe-people-counter__list-item.fc-people-counter-important'));
          recount = getSumCountersObj($list.find('.ibe-people-counter__list-item'));

          if ($('[data-text-adults]').length > 0) {
            $people_counter = $input.parent().find('.ibe-people-counter__counter--plus'); //selected element

            aType = [];
            html = '';
            $people_counter.each(function () {
              aType.push($(this).data('peopleType')); //push people type to array
            }); //Function for print element with coma

            _print = function (recount, type, textP, textS) {
              var aux;

              if (recount > 0) {
                if (aType.length > 1 && aType[0] !== type) {
                  aux = ', ';
                } else {
                  aux = '';
                }

                html += aux + updateInput(recount, textP, textS, type, $input);
              }

              return html;
            };

            html = _print(seniorRecount, 'senior', 'text-seniors', 'text-senior');
            html = _print(adultsRecount, 'adult', 'text-adults', 'text-adult');
            html = _print(youngRecount, 'young', 'text-youngs', 'text-young');
            html = _print(teenagerRecount, 'teenager', 'text-teenagers', 'text-teenager');
            html = _print(childrenRecount, 'children', 'text-children', 'text-child');
            html = _print(babiesRecount, 'baby', 'text-babies', 'text-baby');
            $input.text(html);
            $input.val(html);
          } else {
            //Numero de pasajeros en el input principal
            $people_counter = $input.parent().find('.ibe-people-counter__counter--plus'); //selected element

            aType = [];
            html = '';
            $people_counter.each(function () {
              aType.push($(this).data('peopleType')); //push people type to array
            });

            if (recount >= 1) {
              html = recount + ' ' + $input.data('text-passenger');
            } else {
              if (aType[0] == 'senior') {
                html = $input.data('value-senior');
              } else if (aType[0] == 'young') {
                html = $input.data('value-young');
              } else if (aType[0] == 'teenager') {
                html = $input.data('value-teenager');
              } else {
                html = $input.data('value-adult');
              }
            }

            $input.text(html);
            $input.val(html);
          }
        });
      }
    });
    $('[data-checkBaby]').off('change', changeCheckAviosSearch);
    $('[data-checkBaby]').on('change', changeCheckAviosSearch);
  };
  /*****************************************************************************************************************/

  /*****************************************************************************************************************/

  /*********************************** FUNCIONES PARA ACTUALIZAR PASAJEROS ***************************************/

  /***********************************************************************************************************/

  /*****************************************************************************************************************/
  //Update function for passangers


  var updateInput = function (num, plural, singular, type, input) {
    var value = '';

    if (num > 1) {
      return value + num + ' ' + input.data(plural) + '';
    } else if (num == 1) {
      return value + num + ' ' + input.data(singular) + '';
    }

    return '';
  }; //updateResults - generic for home


  var updateResults = function (selector, num, people) {
    var $selector = $(selector),
        recount = 0,
        list = $selector.next().find('.ibe-people-counter__list'),
        html,
        $people_counter,
        aType;
    num = num || 0; //Numero de pasajeros en el input principal

    $selector.each(function () {
      list = $(this).next().find('.ibe-people-counter__list');
      $(this).next().find(people).text(num); //actualizamos el numero de adultos

      recount = getSumCountersObj(list.find('.ibe-people-counter__list-item'));
      $people_counter = list.find('.ibe-people-counter__counter--plus'); //selected element

      aType = [];
      html = '';
      $people_counter.each(function () {
        if (parseInt($(this).text()) === 0) {
          $(this).addClass(classNone).removeClass(classPlus);
        } else {
          aType.push($(this).data('peopleType')); //push people type to array
        }
      });

      if (recount >= 1) {
        html = recount + ' ' + $(this).data('text-passenger');
      } else {
        if (aType[0] == 'senior') {
          html = $(this).data('value-senior');
        } else if (aType[0] == 'young') {
          html = $(this).data('value-young');
        } else if (aType[0] == 'teenager') {
          html = $(this).data('value-teenager');
        } else {
          html = $(this).data('value-adult');
        }
      }

      $(this).text(html);
      $(this).val(html);
    });
    updateColor(selector);
  }; //Actualizar el color


  var updateColor = function (selector) {
    var $selector = $(selector),
        $count = $selector.next().find('[data-people-counter="counter"]'),
        nine = 0,
        item,
        list = $selector.next().find('.ibe-people-counter__list'),
        imp = list.find('.fc-people-counter-important'); // Recogemos el valor actual del contador para actualizar los estados

    $count.each(function (i) {
      item = $(this).parents('.ibe-people-counter__list-item');
      list = $(this).parents('.ibe-people-counter__list');
      imp = list.find('.fc-people-counter-important'); //Recogemos el numero maximo de personas

      if ($(this).not('[data-people-type="babies"]').text()) {
        nine = nine + parseInt($(this).not('[data-people-type="babies"]').text());
      }

      if (parseInt($(this).text()) > 0) {
        $(this).addClass(classPlus).removeClass(classNone);
      } else {
        $(this).addClass(classNone).removeClass(classPlus);
      }

      visualValidations(item, list, imp);
    });
  }; //updateResults - numSenior

  /**@name updateResultsAdult 
   * @description Update the value of Adult passengers
   * @param selector Selector that points to flight passenger module
   * @param numAdult Number of adults that it's wanted to assing
  */


  var updateResultsAdult = function (selector, numAdult) {
    var people = $peopleAdult,
        $selector = $(selector),
        $adult,
        $container = $selector.parent().find('.ibe-people-counter');

    if ($selector.data('text-adults') == undefined) {
      if (numAdult == 0) {
        $adult = $(selector).parent().find('[data-people-type="adult"]');
        $adult.removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
      }

      updateResults(selector, numAdult, people);
    } else {
      $selector.each(function () {
        var $input, html, _print, childrenRecount, babiesRecount, seniorRecount, youngRecount, teenagerRecount;

        if (!$(this).hasClass('fc-updateAdult-loaded')) {
          $input = $(this);
          html = ''; //Function for print element with coma

          _print = function (recount, type, textP, textS) {
            var aux;

            if (recount > 0) {
              if (html.length > 0) {
                aux = ', ';
              } else {
                aux = '';
              }

              html += aux + updateInput(recount, textP, textS, type, $input);
            }

            return html;
          };

          $(this).next().find(people).text(numAdult);
          childrenRecount = $(this).next().find($peopleChildren).text();
          babiesRecount = $(this).next().find($peopleBabies).text();
          seniorRecount = $(this).next().find($peopleSenior).text();
          youngRecount = $(this).next().find($peopleYoung).text();
          teenagerRecount = $(this).next().find($peopleTeenager).text();
          html = _print(seniorRecount, 'senior', 'text-seniors', 'text-senior');
          html = _print(numAdult, 'adult', 'text-adults', 'text-adult');
          html = _print(youngRecount, 'young', 'text-youngs', 'text-young');
          html = _print(teenagerRecount, 'teenager', 'text-teenagers', 'text-teenager');
          html = _print(childrenRecount, 'children', 'text-children', 'text-child');
          html = _print(babiesRecount, 'baby', 'text-babies', 'text-baby');
          $(this).text(html);
          $(this).val(html);
          $(this).addClass('fc-updateAdult-loaded');
        }
      });
      updateColor(selector);
    }

    if (!$container.hasClass('save')) {
      $container.addClass('save');
    }

    $(selector).data('adultSave', numAdult);
  }; //updateResults - numChildren

  /**@name updateResultsChildren 
   * @description Update the value of Children passengers
   * @param selector Selector that points to flight passenger module
   * @param numChildren Number of Children that it's wanted to assing
   * @param ages array of chilldren ages
  */


  var updateResultsChildren = function (selector, numChildren, ages) {
    var $selector = $(selector),
        people = $peopleChildren,
        $ages = ages,
        $parent = $selector.parent().find('.fc-people-counter-children'),
        $list = $selector.next().find('.ibe-people-counter__list'),
        $container = $selector.parent().find('.ibe-people-counter'),
        html,
        adultsRecount,
        babiesRecount,
        seniorRecount,
        youngRecount,
        teenagerRecount,
        i; //Entra en la Home

    if ($selector.data('text-adults') == undefined) {
      updateResults(selector, numChildren, people); //LLamamos a la función que muestra las edades

      $selector.each(function () {
        $parent = $(this).parent().find('.fc-people-counter-children');
        $list = $(this).next().find('.ibe-people-counter__list');
        showChildrenAges(numChildren, $parent, $list);
      }); //Actualizar las edades de los niños

      if ($ages !== undefined) {
        if ($(selector).parent().find('.ibe-people-counter').length > 0) {
          for (i = 0; i <= ages.length - 1; i++) {
            if ($(selector).parent().find('#Vchildren_' + i).length > 0) {
              $(selector).parent().find('.ibe-people-counter__ages').find('#Vchildren_' + i)[0].selectize.setValue($ages[i]);
            }

            if ($(selector).parent().find('#VCchildren_' + i).length > 0) {
              $(selector).parent().find('.ibe-people-counter__ages').find('#VCchildren_' + i)[0].selectize.setValue($ages[i]);
            }
          }
        }
      }
    } else {
      //no entra en la home
      html = '';
      $selector.each(function () {
        if (!$(this).hasClass('fc-updateChildren-loaded')) {
          $input = $(this);
          html = '';
          $parent = $(this).parent().find('.fc-people-counter-children');
          $list = $(this).next().find('.ibe-people-counter__list');
          adultsRecount = $(this).next().find($peopleAdult).text();
          $(this).next().find(people).text(numChildren);
          babiesRecount = $(this).next().find($peopleBabies).text();
          seniorRecount = $(this).next().find($peopleSenior).text();
          youngRecount = $(this).next().find($peopleYoung).text();
          teenagerRecount = $(this).next().find($peopleTeenager).text(); //Function for print element with coma

          _print = function (recount, type, textP, textS) {
            var aux;

            if (recount > 0) {
              if (html.length > 0) {
                aux = ', ';
              } else {
                aux = '';
              }

              html += aux + updateInput(recount, textP, textS, type, $input);
            }

            return html;
          };

          html = _print(seniorRecount, 'senior', 'text-seniors', 'text-senior');
          html = _print(adultsRecount, 'adult', 'text-adults', 'text-adult');
          html = _print(youngRecount, 'young', 'text-youngs', 'text-young');
          html = _print(teenagerRecount, 'teenager', 'text-teenagers', 'text-teenager');
          html = _print(numChildren, 'children', 'text-children', 'text-child');
          html = _print(babiesRecount, 'baby', 'text-babies', 'text-baby');
          $(this).text(html);
          $(this).val(html); //LLamamos a la función que muestra las edades

          showChildrenAges(numChildren, $parent, $list); //Actualizar las edades de los niños

          if ($ages !== undefined) {
            if ($(selector).parent().find('.ibe-people-counter').length > 0) {
              for (i = 0; i <= ages.length - 1; i++) {
                if ($(selector).parent().find('#Vchildren_' + i).length > 0) {
                  $(selector).parent().find('.ibe-people-counter__ages').find('#Vchildren_' + i)[0].selectize.setValue($ages[i]);
                }

                if ($(selector).parent().find('#VCchildren_' + i).length > 0) {
                  $(selector).parent().find('.ibe-people-counter__ages').find('#VCchildren_' + i)[0].selectize.setValue($ages[i]);
                }
              }
            }
          }

          $(this).addClass('fc-updateChildren-loaded');
        }
      });
      updateColor(selector);
    }

    if (!$container.hasClass('save')) {
      $container.addClass('save');
    }

    $(selector).data('childrenSave', numChildren);
    $(selector).data('agesSave', ages);
  }; //updateResults - numBabies

  /**@name updateResulupdateResultsBabiestsChildren 
   * @description Update the value of babies passengers
   * @param selector Selector that points to flight passenger module
   * @param numBabies Number of babies
  */


  var updateResultsBabies = function (selector, numBabies) {
    var $selector = $(selector),
        people = $peopleBabies,
        $container = $selector.parent().find('.ibe-people-counter'),
        html,
        $input,
        $people_counter,
        aType,
        _print,
        adultsRecount,
        childrenRecount,
        seniorRecount,
        youngRecount,
        teenagerRecount; //Entra en la Home


    if ($selector.data('text-adults') == undefined) {
      updateResults(selector, numBabies, people);
    } else {
      // NO Entra en la Home
      html = '';
      $selector.each(function () {
        if (!$(this).hasClass('fc-updateBabies-loaded')) {
          $input = $(this);
          html = ''; //Function for print element with coma

          _print = function (recount, type, textP, textS) {
            var aux;

            if (recount > 0) {
              if (html.length > 0) {
                aux = ', ';
              } else {
                aux = '';
              }

              html += aux + updateInput(recount, textP, textS, type, $input);
            }

            return html;
          };

          adultsRecount = $(this).next().find($peopleAdult).text();
          childrenRecount = $(this).next().find($peopleChildren).text();
          $(this).next().find($peopleBabies).text(numBabies);
          seniorRecount = $(this).next().find($peopleSenior).text();
          youngRecount = $(this).next().find($peopleYoung).text();
          teenagerRecount = $(this).next().find($peopleTeenager).text();
          html = _print(seniorRecount, 'senior', 'text-seniors', 'text-senior');
          html = _print(adultsRecount, 'adult', 'text-adults', 'text-adult');
          html = _print(youngRecount, 'young', 'text-youngs', 'text-young');
          html = _print(teenagerRecount, 'teenager', 'text-teenagers', 'text-teenager');
          html = _print(childrenRecount, 'children', 'text-children', 'text-child');
          html = _print(numBabies, 'baby', 'text-babies', 'text-baby');
          $(this).text(html);
          $(this).val(html);
          $(this).addClass('fc-updateBabies-loaded');
        }
      });
      updateColor(selector);
    }

    if (!$container.hasClass('save')) {
      $container.addClass('save');
    }

    $(selector).data('babiesSave', numBabies);
  }; //updateResults - numSenior

  /**@name updateResultsSenior 
   * @description Update the value of Senior passengers
   * @param selector Selector that points to flight passenger module
   * @param numSenior Number of Senior that it's wanted to assing
  */


  var updateResultsSenior = function (selector, numSenior) {
    var people = $peopleSenior,
        $selector = $(selector),
        $container = $selector.parent().find('.ibe-people-counter'),
        html,
        $input,
        _print,
        adultsRecount,
        childrenRecount,
        youngRecount,
        teenagerRecount,
        babiesRecount; //Entra en la Home


    if ($selector.data('text-adults') == undefined) {
      updateResults(selector, numSenior, people);
    } else {
      // No entra en la home
      html = '';
      $selector.each(function () {
        if (!$(this).hasClass('fc-updateSenior-loaded')) {
          $input = $(this);
          html = ''; //Function for print element with coma

          _print = function (recount, type, textP, textS) {
            var aux;

            if (recount > 0) {
              if (html.length > 0) {
                aux = ', ';
              } else {
                aux = '';
              }

              html += aux + updateInput(recount, textP, textS, type, $input);
            }

            return html;
          };

          adultsRecount = $(this).next().find($peopleAdult).text();
          childrenRecount = $(this).next().find($peopleChildren).text();
          babiesRecount = $(this).next().find($peopleBabies).text();
          $(this).next().find(people).text(numSenior);
          youngRecount = $(this).next().find($peopleYoung).text();
          teenagerRecount = $(this).next().find($peopleTeenager).text();
          html = _print(numSenior, 'senior', 'text-seniors', 'text-senior');
          html = _print(adultsRecount, 'adult', 'text-adults', 'text-adult');
          html = _print(youngRecount, 'young', 'text-youngs', 'text-young');
          html = _print(teenagerRecount, 'teenager', 'text-teenagers', 'text-teenager');
          html = _print(childrenRecount, 'children', 'text-children', 'text-child');
          html = _print(babiesRecount, 'baby', 'text-babies', 'text-baby');
          $(this).text(html);
          $(this).val(html);
          $(this).addClass('fc-updateSenior-loaded');
        }
      });
      updateColor(selector);
    }

    if (!$container.hasClass('save')) {
      $container.addClass('save');
    }

    $(selector).data('seniorSave', numSenior);
  }; //updateResults -

  /**@name updateResultsYoung 
   * @description Update the value of Young passengers
   * @param selector Selector that points to flight passenger module
   * @param numYoung Number of Young that it's wanted to assing
  */


  var updateResultsYoung = function (selector, numYoung) {
    var people = $peopleYoung,
        $selector = $(selector),
        $container = $selector.parent().find('.ibe-people-counter'),
        html,
        $input,
        _print,
        adultRecount,
        childrenRecount,
        seniorRecount,
        teenagerRecount,
        babiesRecount; //Entra en  la Home


    if ($selector.data('text-adults') == undefined) {
      updateResults(selector, numYoung, people);
    } else {
      //No Entra en la Home
      html = '';
      $selector.each(function () {
        if (!$(this).hasClass('fc-updateYoung-loaded')) {
          $input = $(this);
          html = ''; //Function for print element with coma

          _print = function (recount, type, textP, textS) {
            var aux;

            if (recount > 0) {
              if (html.length > 0) {
                aux = ', ';
              } else {
                aux = '';
              }

              html += aux + updateInput(recount, textP, textS, type, $input);
            }

            return html;
          };

          adultRecount = $(this).next().find($peopleAdult).text();
          childrenRecount = $(this).next().find($peopleChildren).text();
          babiesRecount = $(this).next().find($peopleBabies).text();
          seniorRecount = $(this).next().find($peopleSenior).text();
          $(this).next().find(people).text(numYoung);
          teenagerRecount = $(this).next().find($peopleTeenager).text();
          html = _print(seniorRecount, 'senior', 'text-seniors', 'text-senior');
          html = _print(adultRecount, 'adult', 'text-adults', 'text-adult');
          html = _print(numYoung, 'young', 'text-youngs', 'text-young');
          html = _print(teenagerRecount, 'teenager', 'text-teenagers', 'text-teenager');
          html = _print(childrenRecount, 'children', 'text-children', 'text-child');
          html = _print(babiesRecount, 'baby', 'text-babies', 'text-baby');
          $(this).text(html);
          $(this).val(html);
          $(this).addClass('fc-updateYoung-loaded');
        }
      });
      updateColor(selector);
    }

    if (!$container.hasClass('save')) {
      $container.addClass('save');
    }

    $(selector).data('youngSave', numYoung);
  }; //updateResults - numTeenager

  /**@name updateResultsTeenager 
   * @description Update the value of Teenager passengers
   * @param selector Selector that points to flight passenger module
   * @param numTeenager Number of Teenager that it's wanted to assing
  */


  var updateResultsTeenager = function (selector, numTeenager) {
    var people = $peopleTeenager,
        $selector = $(selector),
        $container = $selector.parent().find('.ibe-people-counter'),
        html,
        $input,
        _print,
        adultRecount,
        childrenRecount,
        seniorRecount,
        youngRecount,
        babiesRecount; //Entra en  la Home


    if ($selector.data('text-teenager') == undefined) {
      updateResults(selector, numTeenager, people);
    } else {
      //No Entra en la Home
      html = '';
      $selector.each(function () {
        if (!$(this).hasClass('fc-updateTeenager-loaded')) {
          $input = $(this);
          html = ''; //Function for print element with coma

          _print = function (recount, type, textP, textS) {
            var aux;

            if (recount > 0) {
              if (html.length > 0) {
                aux = ', ';
              } else {
                aux = '';
              }

              html += aux + updateInput(recount, textP, textS, type, $input);
            }

            return html;
          };

          adultRecount = $(this).next().find($peopleAdult).text();
          childrenRecount = $(this).next().find($peopleChildren).text();
          babiesRecount = $(this).next().find($peopleBabies).text();
          seniorRecount = $(this).next().find($peopleSenior).text();
          youngRecount = $(this).next().find($peopleYoung).text();
          $(this).next().find(people).text(numTeenager);
          html = _print(seniorRecount, 'senior', 'text-seniors', 'text-senior');
          html = _print(adultRecount, 'adult', 'text-adults', 'text-adult');
          html = _print(youngRecount, 'young', 'text-youngs', 'text-young');
          html = _print(numTeenager, 'teenager', 'text-teenagers', 'text-teenager');
          html = _print(childrenRecount, 'children', 'text-children', 'text-child');
          html = _print(babiesRecount, 'baby', 'text-babies', 'text-baby');
          $(this).text(html);
          $(this).val(html);
          $(this).addClass('fc-updateTeenager-loaded');
        }
      });
      updateColor(selector);
    }

    if (!$container.hasClass('save')) {
      $container.addClass('save');
    }

    $(selector).data('teenagerSave', numTeenager);
  }; ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////// SEARCHER VINTAGE /////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////// Function to save passenger ///////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  var savePassenger = function (button, selector) {
    var $container = button.parent().find('.ibe-people-counter').length ? button.parent().find('.ibe-people-counter') : button.closest('.ibe_form__group').find('.ibe-people-counter');
    var $agesBox, $inputAge, $agesValue;
    $(selector).data('seniorSave', $container.find('[data-people-type="senior"]').text());
    $(selector).data('adultSave', $container.find('[data-people-type="adult"]').text());
    $(selector).data('youngSave', $container.find('[data-people-type="young"]').text());
    $(selector).data('teenagerSave', $container.find('[data-people-type="teenager"]').text());
    $(selector).data('childrenSave', $container.find('[data-people-type="children"]').text());
    $(selector).data('babiesSave', $container.find('[data-people-type="babies"]').text());

    if ($(selector).data('childrenSave') !== '0') {
      $agesBox = $container.find('.ibe-people-counter__ages');
      $inputAge = $agesBox.find('.selectize-input');
      $(selector).data('agesSave', []);
      $inputAge.each(function () {
        $agesValue = $(this).find('[data-value]').text();
        $(selector).data('agesSave').push($agesValue);
      });
    }

    $container.addClass('save');
  }; ///////////////////////////// Restore values in modal mode where click X /////////////////////////////////////////


  var restorePassenger = function (button, selector) {
    var $save = button.parent().find('.ibe-modal__button-save').length ? button.parent().find('.ibe-modal__button-save') : button.parent().find('.ibe-dinamic-modal__button--save'),
        $container = $save.parent().find('.ibe-people-counter').length ? $save.parent().find('.ibe-people-counter') : $save.closest('.ibe_form__group').find('.ibe-people-counter'),
        $list = $container.find('.ibe-people-counter__list'),
        $people = $list.find('.ibe-people-counter__list-item > [data-people-type]'),
        $ages = $container.find('.ibe-people-counter__ages');

    if ($container.hasClass('save')) {
      $people.each(function () {
        var $type = $(this).attr('data-people-type');
        var i;

        switch ($type) {
          case 'adult':
            if ($(this).text() !== $(selector).data('adultSave')) {
              if ($(selector).data('adultSave') == '0') {
                $(this).removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
              }

              updateResults(selector, $(selector).data('adultSave'), $peopleAdult);
            }

            break;

          case 'senior':
            if ($(this).text() !== $(selector).data('seniorSave')) {
              if ($(selector).data('seniorSave') == '0') {
                $(this).removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
              }

              updateResults(selector, $(selector).data('seniorSave'), $peopleSenior);
            }

            break;

          case 'young':
            if ($(this).text() !== $(selector).data('youngSave')) {
              if ($(selector).data('youngSave') == '0') {
                $(this).removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
              }

              updateResults(selector, $(selector).data('youngSave'), $peopleYoung);
            }

            break;

          case 'teenager':
            if ($(this).text() !== $(selector).data('teenagerSave')) {
              if ($(selector).data('teenagerSave') == '0') {
                $(this).removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
              }

              updateResults(selector, $(selector).data('teenagerSave'), $peopleTeenager);
            }

            break;

          case 'babies':
            if ($(this).text() !== $(selector).data('babiesSave')) {
              if ($(selector).data('babiesSave') == '0') {
                $(this).removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
              }

              updateResults(selector, $(selector).data('babiesSave'), $peopleBabies);
            }

            break;

          case 'children':
            if ($(this).text() !== $(selector).data('childrenSave')) {
              if ($(selector).data('childrenSave') == '0') {
                $(this).removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
              }

              updateResults(selector, $(selector).data('childrenSave'), $peopleChildren);
            }

            break;
        } //Actualizar las edades de los niños


        if ($(selector).data('agesSave') !== undefined) {
          if ($(selector).parent().find('.ibe-people-counter').length > 0) {
            for (i = 0; i <= $(selector).data('agesSave').length - 1; i++) {
              if ($(selector).parent().find('#Vchildren_' + i).length > 0) {
                $(selector).parent().find('.ibe-people-counter__ages').find('#Vchildren_' + i)[0].selectize.setValue($(selector).data('agesSave')[i]);
              }

              if ($(selector).parent().find('#VCchildren_' + i).length > 0) {
                $(selector).parent().find('.ibe-people-counter__ages').find('#VCchildren_' + i)[0].selectize.setValue($(selector).data('agesSave')[i]);
              }
            }
          }
        }
      });
      updateColor(selector);
    } else {
      $people.each(function () {
        var i, $inputAge;
        var $type = $(this).attr('data-people-type');

        switch ($type) {
          case 'adult':
            if ($(this).text() !== '1') {
              updateResults(selector, 1, $peopleAdult);
            }

            break;

          case 'senior':
            if ($(this).text() !== '0') {
              $(this).removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
              updateResults(selector, 0, $peopleSenior);
            }

            break;

          case 'young':
            if ($(this).text() !== '0') {
              $(this).removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
              updateResults(selector, 0, $peopleYoung);
            }

            break;

          case 'teenager':
            if ($(this).text() !== '0') {
              $(this).removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
              updateResults(selector, 0, $peopleTeenager);
            }

            break;

          case 'babies':
            if ($(this).text() !== '0') {
              $(this).removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
              updateResults(selector, 0, $peopleBabies);
            }

            break;

          case 'children':
            if ($(this).text() !== '0') {
              $(this).removeClass('ibe-people-counter__counter--plus').addClass('ibe-people-counter__counter--none');
              updateResults(selector, 0, $peopleChildren);
              $ages.css('display', 'none');
              $inputAge = $ages.find('.selectize-input');

              for (i = 0; i <= $inputAge.length - 1; i++) {
                if ($(selector).parent().find('#Vchildren_' + i).length > 0) {
                  $(selector).parent().find('.ibe-people-counter__ages').find('#Vchildren_' + i)[0].selectize.setValue('02');
                }

                if ($(selector).parent().find('#VCchildren_' + i).length > 0) {
                  $(selector).parent().find('.ibe-people-counter__ages').find('#VCchildren_' + i)[0].selectize.setValue('02');
                }
              }
            }

            break;
        }
      });
      updateColor(selector);
    }
  };

  var deleteBabies = function (status, select) {
    var itemBaby = select.find('[data-people-type="babies"]').closest('.ibe-people-counter__list-item');

    if (status) {
      itemBaby.addClass('hidden');
    } else {
      itemBaby.removeClass('hidden');
    }
  };

  var getBabies = function (select) {
    return select.find('[data-people-type="babies"]').text();
  };

  var showMessageAviosBabies = function (status, select) {
    var itemBaby = select.find('.fc-people-counter-babies'),
        counterItem = itemBaby.find('[data-people-counter="counter"]'),
        $babiesMessage = select.find('[data-validate="baby-redemption"]'),
        important = select.find('.fc-people-counter-important');

    if (status) {
      $babiesMessage.removeClass('hidden');
      $babiesMessage.closest('.ibe_form__group').addClass('ibe_form__group--error');
      counterItem.html('0');
      counterItem.addClass('ibe-people-counter__counter--none');
      itemBaby.addClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').attr('disabled', 'disabled');
      itemBaby.addClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').trigger('click');
      itemBaby.addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').attr('disabled', 'disabled');
      itemBaby.addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').addClass('ibe-people-counter__buttons-no-hover');
      itemBaby.find('.ibe-people-counter__message').addClass('active');
    } else {
      $babiesMessage.addClass('hidden');
      $babiesMessage.closest('.ibe_form__group').removeClass('ibe_form__group--error');

      if (!parseInt(itemBaby.find('[data-people-type="babies"]').html()) >= 1) {
        itemBaby.addClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').attr('disabled', 'disabled');
      } else {
        itemBaby.removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button="less"]').removeAttr('disabled');
      }

      if (parseInt(itemBaby.find('[data-people-type="babies"]').html()) < getSumCountersObj(important)) {
        itemBaby.removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').removeAttr('disabled');
        itemBaby.removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').removeClass('ibe-people-counter__buttons-no-hover');
      }
      /*else {
      itemBaby.addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').attr('disabled','disabled');
      itemBaby.addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').addClass('ibe-people-counter__buttons-no-hover');
      			}*/


      itemBaby.find('.ibe-people-counter__message').removeClass('active');
    }
  };

  var changeCheckAviosSearch = function (e) {
    var $target = $(e.target) || $(e.srcElement),
        $form = $target.closest('[data-parent-avios]'),
        $babiesMessage = $form.find('[data-validate="baby-redemption"]');
    $('.ibe-people-counter').on('shown.bs.collapse', function () {
      if ($target.is(':checked')) {
        $babiesMessage.addClass('hidden');
        $babiesMessage.closest('.ibe_form__group').removeClass('ibe_form__group--error');
      }
    });

    if ($target.is(':checked')) {
      $form.find('.fc-people-counter-babies').addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').attr('disabled', 'disabled');

      if (getBabies($form) > 0) {
        showMessageAviosBabies(true, $form);
      } else {
        $form.find('.fc-people-counter-babies .ibe-people-counter__message').addClass('active');
        $form.find('.fc-people-counter-babies').find('[data-people-counter-button="more"]').addClass('ibe-people-counter__buttons-no-hover');
      }
    } else {
      showMessageAviosBabies(false, $form);
    }
  }; //dFrontJs.ibe_searcher_people_counter.checkPassenger('active','senior', '#form1')


  var checkPassenger = function (state, typePassenger, form) {
    var $state = state !== undefined ? state : 'active';
    var $typePassenger = typePassenger !== undefined ? typePassenger : 'senior';
    var $form = form !== undefined ? $(form) : $('form:visible');
    var $babiesMessage = $form.find('[data-validate="baby-redemption"]');
    $('.ibe-people-counter').on('shown.bs.collapse', function () {
      $babiesMessage.addClass('hidden');
      $babiesMessage.closest('.ibe_form__group').removeClass('ibe_form__group--error');
    });

    if ($state === 'active') {
      $form.find('.ibe-people-counter [data-people-type="' + $typePassenger + '"]').parent().removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').removeAttr('disabled');
      $form.find('.ibe-people-counter [data-people-type="' + $typePassenger + '"]').parent().find('.ibe-people-counter__message').removeClass('active');
      $babiesMessage.addClass('hidden');
      $babiesMessage.closest('.ibe_form__group').removeClass('ibe_form__group--error');
    } else {
      $form.find('.ibe-people-counter [data-people-type="' + $typePassenger + '"]').parent().addClass('ibe-people-counter__item-plus').find('[data-people-counter-button="more"]').attr('disabled', 'disabled');
      $form.find('.ibe-people-counter [data-people-type="' + $typePassenger + '"]').parent().find('.ibe-people-counter__message').addClass('active');
      $babiesMessage.removeClass('hidden');
      $babiesMessage.closest('.ibe_form__group').addClass('ibe_form__group--error');
    }
  }; // When you open the selector, take the focus so that it does not close automatically


  if (window.innerWidth > dFrontJs.resolutions.lg) {
    // When you open the selector, take the focus so that it does not close automatically
    $('.ibe-people-counter').on('shown.bs.collapse', function () {
      $(this).attr('tabindex', '0').addClass('ibe-people-counter--focus-not-border').focus();
      $('.ibe-searcher__col--alt').scrollTop(0);
    });
  } //Public functions


  return {
    'init': init,
    'updateResultsAdult': updateResultsAdult,
    'updateResultsChildren': updateResultsChildren,
    'updateResultsBabies': updateResultsBabies,
    'updateResultsSenior': updateResultsSenior,
    'updateResultsYoung': updateResultsYoung,
    'updateResultsTeenager': updateResultsTeenager,
    'savePassenger': savePassenger,
    'restorePassenger': restorePassenger,
    'getBabies': getBabies,
    'deleteBabies': deleteBabies,
    'showMessageAviosBabies': showMessageAviosBabies,
    'changeCheckAviosSearch': changeCheckAviosSearch,
    'checkPassenger': checkPassenger
  };
}(jQuery);
"use strict";

//**********************************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: People counter
//    Descripcion: Funcion para seleccionar pasajeros en buscador de hotel - Versión Selectmenu
//**********************************************************************************************/
dFrontJs.ibe_searcher_people_counter_selectmenu = function () {
  /*eslint no-underscore-dangle: ["error", { "allow": ["__constructor"] }]*/
  //Variables
  var $obj = 0,
      $input = 0,
      $list = 0,
      $parent = 0,
      $important = 0,
      $babies = 0,
      $counter = 0,
      $babiesCount = 0;
  var $agesList = ['02', '02', '02', '02', '02', '02', '02', '02']; //Constructor

  var __constructor = function ($this) {
    $obj = $this;
    $form = $this.parents('.ibe_form__group'), $input = $form.find('.ibe_form__input-text'), $list = $this.parents('.ibe-people-counter__list');
    $parent = $this.parents('.ibe-people-counter__list-item');
    $count = $parent.find('[data-people-counter-selectmenu="counter"]');
    $important = $list.find('.fc-people-counter-important-selectmenu');
    $babies = $list.find('.fc-people-counter-babies-selectmenu');
    $babiesCount = $list.find('.fc-people-counter-babies-selectmenu').find('[data-people-counter-selectmenu="counter"]');
  }; //Restamos o sumamos al contador actual


  var lessOrPlus = function () {
    c = parseInt($count.text());
    $obj.data('people-counter-button-selectmenu') === 'less' ? c-- : c++;
    return c;
  }; //Devuelve el numero maximo de personas


  var getNumberOrPeople = function () {
    var n = 0;
    $.each($list.find('.ibe-people-counter__list-item').not($parent).not($babies), function () {
      n = n + parseInt($(this).find('[data-people-counter-selectmenu="counter"]').html());
    });
    n = n + countNumber;
    return n;
  }; //Recorre el objeto que se le pasa por parametro y suma sus contadores


  var getSumCountersObj = function ($o) {
    var i = 0;
    $.each($o, function () {
      i = i + parseInt($(this).find('[data-people-counter-selectmenu="counter"]').text());
    });
    return i;
  }; //Actualiza y guarda las edades seleccionadas al añadir o eliminar niños


  var updateAgesList = function (array) {
    setTimeout(function () {
      var i;

      for (i = 0; i < array.length; i++) {
        $agesList[i] = array.eq(i).val();
      }
    }, 500);
  }; //Guarda los valores de las edades cuando éstos cambian su valor


  var udpdateValueChildren = function () {
    $('.fc-people-counter-children-selectmenu select').on('change', function () {
      updateAgesList($('.fc-people-counter-children-selectmenu select'));
    });
  }; //Validaciones visuales


  var visualValidations = function ($o) {
    var sumChil, sumMin;

    if ($($parent).parents('[data-validate-searcher]').length) {
      if ($babiesCount.html() === getSumCountersObj($important)) {
        $list.find('.fc-people-counter-babies-selectmenu').addClass('ibe-people-counter__item-plus').find('[data-people-counter-button-selectmenu="more"]').attr('disabled', 'disabled');
      } else {
        $list.find('.fc-people-counter-babies-selectmenu').removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button-selectmenu="more"]').removeAttr('disabled');
      }

      $list.find('[data-people-counter-selectmenu="counter"]').each(function () {
        if ($(this).html() === 0) {
          $(this).parent().addClass('ibe-people-counter__item-minus').find('[data-people-counter-button-selectmenu="less"]').attr('disabled', 'disabled');
        } else if ($(this).html() > 1) {
          $(this).parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button-selectmenu="less"]').removeAttr('disabled');
        }
      });

      switch (getSumCountersObj($important) + getSumCountersObj($list.find('.fc-people-counter-children-selectmenu'))) {
        case 1:
          $list.find('[data-people-counter-selectmenu="counter"]').each(function () {
            if ($(this).html() === 1) {
              $(this).parent().addClass('ibe-people-counter__item-minus').find('[data-people-counter-button-selectmenu="less"]').attr('disabled', 'disabled');
            }
          });
          break;

        case 9:
          $important.addClass('ibe-people-counter__item-plus').find('[data-people-counter-button-selectmenu="more"]').attr('disabled', 'disabled');
          $list.find('.fc-people-counter-children-selectmenu').addClass('ibe-people-counter__item-plus').find('[data-people-counter-button-selectmenu="more"]').attr('disabled', 'disabled');
          break;

        default:
          if (getSumCountersObj($important) > 1) {
            //>=0 para que niños puedan viajar solos sino >1
            $important.find('[data-people-counter-selectmenu="counter"]').each(function () {
              if ($(this).html() > 0) {
                $(this).parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button-selectmenu="less"]').removeAttr('disabled');
              }
            });
          } else {
            $important.find('[data-people-counter-selectmenu="counter"]').each(function () {
              if ($(this).html() > 0) {
                $(this).parent().addClass('ibe-people-counter__item-minus').find('[data-people-counter-button-selectmenu="less"]').attr('disabled', 'disabled');
              }
            });
          }

          $list.find('.fc-people-counter-children-selectmenu [data-people-counter-selectmenu="counter"]').each(function () {
            //toggle para que niños no puedan viajar solos
            if ($(this).html() > 0) {
              $(this).parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button-selectmenu="less"]').removeAttr('disabled');
            }
          });
          $important.removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button-selectmenu="more"]').removeAttr('disabled');
          $list.find('.fc-people-counter-children-selectmenu').removeClass('ibe-people-counter__item-plus').find('[data-people-counter-button-selectmenu="more"]').removeAttr('disabled');
      }

      if ($babiesCount.html() >= 1) {
        $babiesCount.parent().removeClass('ibe-people-counter__item-minus').find('[data-people-counter-button-selectmenu="less"]').removeAttr('disabled');
      }

      sumChil = parseInt($list.find('.fc-people-counter-children-selectmenu [data-people-counter-selectmenu="counter"]').html());
      sumMin = sumChil + parseInt($babiesCount.html());

      if (sumMin > 2 * getSumCountersObj($important) && getSumCountersObj($important) !== 0) {
        $list.find('.fc-people-counter-children-selectmenu').removeClass('ibe-people-counter__item-children-alone');
        $list.find('.fc-people-counter-children-selectmenu').addClass('ibe-people-counter__item-children');
      } else if (sumChil > 0 && getSumCountersObj($important) === 0) {
        $list.find('.fc-people-counter-children-selectmenu').removeClass('ibe-people-counter__item-children');
        $list.find('.fc-people-counter-children-selectmenu').addClass('ibe-people-counter__item-children-alone');
      } else {
        $list.find('.fc-people-counter-children-selectmenu').removeClass('ibe-people-counter__item-children');
        $list.find('.fc-people-counter-children-selectmenu').removeClass('ibe-people-counter__item-children-alone');
      }
    }
  }; //Mostrar las edades de los niños


  var showChildrenAges = function () {
    var $ages = $parent.find('.ibe-people-counter__ages'),
        $selectors = $parent.find('.ibe_form__selectize-multi__selectors'),
        html,
        selected,
        i,
        j,
        ages; //Con el siguiente data distinguimos los distintos ids de los elementos de los formularios en cada tab

    var id = $list.attr('data-id');
    $selectors.html('');

    if (countNumber <= 0) {
      $ages.css('display', 'none');
    } else {
      html = '';
      ages = ['02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];

      for (i = 0; i < countNumber; i++) {
        html += '<label class="hideAccessible" for="' + id + 'children_' + i + '">Ni&ntilde;o ' + i + '</label>' + '<select class="ibe-select ibe-select--selectize" name="' + id + 'children_' + i + '" data-selectmenu-edit id="' + id + 'children_' + i + '">';
        selected = $agesList[i];

        for (j = 0; j < ages.length; j++) {
          if (ages[j] === selected) {
            html += '<option value="' + ages[j] + '" selected>' + ages[j] + '</option>';
          } else {
            html += '<option value="' + ages[j] + '">' + ages[j] + '</option>';
          }
        }

        html += '</select>';
      }

      $selectors.append(html);
      dFrontJs.ibe_selectmenu.init();
      $('[data-selectmenu-edit]').siblings('.custom-combobox').removeClass('ibe-select__edit--open');
      $('[data-selectmenu-edit]').siblings('.custom-combobox').find('.ibe-select__autocomplete').hide();
      udpdateValueChildren();
      setTimeout(function () {
        $ages.css('display', 'block');
      }, 100);
    }
  }; //Init


  var init = function () {
    $('[data-validate-searcher] .fc-people-counter-babies-selectmenu [data-people-counter-button-selectmenu="less"]').each(function () {
      __constructor($(this));

      visualValidations($(this));
    });
    $('[data-people-counter-button-selectmenu]').on('click', function (e) {
      var classPlus = 'ibe-people-counter__counter--plus',
          classNone = 'ibe-people-counter__counter--none',
          i,
          b,
          j,
          total,
          recount,
          html;

      __constructor($(this)); //Recogemos el valor actual del contador


      countNumber = lessOrPlus(); //Recogemos el numero maximo de personas

      nine = getNumberOrPeople(); //Si es adulto (Senior, Adulto, Jovenes)

      if ($parent.hasClass('fc-people-counter-important-selectmenu') && nine <= 9) {
        i = getSumCountersObj($important.not($parent));

        if (countNumber <= 0) {
          countNumber = 0; //toggle para que niños no puedan viajar solos( cambiar también el visual )

          if (i <= 0) {
            countNumber = 1;
          }
        }

        $count.html(countNumber);
        total = getSumCountersObj($important);

        if ($parent.hasClass('fc-people-counter-important-selectmenu')) {
          //Comprobar numero de bebes
          b = parseInt($babies.find('[data-people-counter-selectmenu="counter"]').text());

          if (total < b) {
            $babies.find('[data-people-counter-selectmenu="counter"]').html(total);
          }
        } //Si es bebé

      } else if ($parent.hasClass('fc-people-counter-babies-selectmenu')) {
        //Recojemos el numero maximo de adultos
        j = getSumCountersObj($important);

        if (countNumber > 0) {
          if (countNumber >= j) {
            countNumber = j;
          }
        } else {
          countNumber = 0;
        }

        $count.html(countNumber); //Si es niños
      } else if ($parent.hasClass('fc-people-counter-children-selectmenu') && nine <= 9) {
        if (countNumber > 9) {
          countNumber = 9;
        } else if (countNumber < 0) {
          countNumber = 0;
        }

        $count.html(countNumber); //Edades de los niños

        showChildrenAges();
      } //Aplicar estilos --plus/--none


      if (nine <= 9) {
        countNumber > 0 ? $count.addClass(classPlus).removeClass(classNone) : $count.addClass(classNone).removeClass(classPlus);
      } else if (nine > 9) {
        if (!parseInt($babiesCount.html()) === 0) {
          countNumber > 0 ? $babiesCount.addClass(classPlus).removeClass(classNone) : $babiesCount.addClass(classNone).removeClass(classPlus);
        } else {
          $babiesCount.addClass(classNone).removeClass(classPlus);
        }
      } //Validaciones visuales


      visualValidations($(this)); //Recuento

      recount = getSumCountersObj($list.find('.ibe-people-counter__list-item').not('.fc-people-counter-babies-selectmenu')); //Numero de pasajeros en el input principal

      html = recount > 1 ? recount + ' ' + $input.data('text-passenger') : $input.data('value');
      $input.val(html);
    });
  }; //Public functions


  return {
    'init': init
  };
}(jQuery);
"use strict";

//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: rooms
//    Descripcion: Funcion para seleccionar habitaciones en buscador de hotel
//******************************************************************************/

/*eslint no-underscore-dangle: ['error', { 'allow': ['_updateAgesList', '_updateValueChildren'] }]*/
dFrontJs.ibe_searcher_room = function () {
  var $countRoom = 1;
  var $agesList1 = ['02', '02', '02', '02', '02', '02', '02', '02', '02'];
  var $agesList2 = ['02', '02', '02', '02', '02', '02', '02', '02', '02'];
  var $agesList3 = ['02', '02', '02', '02', '02', '02', '02', '02', '02'];
  var $agesList4 = ['02', '02', '02', '02', '02', '02', '02', '02', '02']; //Actualiza y guarda las edades seleccionadas al añadir o eliminar niños

  var _updateAgesList = function (e) {
    var array = $('[data-searcher-room="children-ages"]');
    var i;
    array.each(function (index, value) {
      for (i = 0; i < $(array).eq(index).find('select').length; i++) {
        switch (index) {
          case 0:
            $agesList1[i] = array.eq(index).find('select').eq(i).val();
            break;

          case 1:
            $agesList2[i] = array.eq(index).find('select').eq(i).val();
            break;

          case 2:
            $agesList3[i] = array.eq(index).find('select').eq(i).val();
            break;

          case 3:
            $agesList4[i] = array.eq(index).find('select').eq(i).val();
            break;
        }
      }
    });
  }; //Cambiar tamaño del contenedor por si hay seleccionado mas de 8 niños


  var testingNumberChildrenRoom = function ($container) {
    var $this = $(this),
        child = false,
        classExtend = 'ibe-searcher-room--extend';
    $container.find('[data-searcher-room="children"]').each(function () {
      if ($(this).val() > 4) {
        child = true;
      }
    });

    if (child) {
      $container.addClass(classExtend);
    } else {
      $container.removeClass(classExtend);
    }
  }; //testingNumberChildrenRoom
  //Cambiar numero de habitaciones del input principal


  var changeTextInput = function ($this) {
    var $button = $this.parents('.ibe_form__group').find('.ibe_form__input-text').not('[data-select-rooms]'),
        rooms = $this.find('[data-searcher-room^="room-"]').length,
        text = ' ' + $button.attr('data-text-room'),
        $input = $('[data-select-rooms="select"]');
    text = rooms > 1 ? ' ' + $button.attr('data-text-room-plural') : ' ' + $button.attr('data-text-room');
    $button.val(rooms + text);
    $button.text(rooms + text);

    if ($input.length > 0) {
      $input.val(rooms);
      $input.selectmenu('refresh');
    }
  }; //changeTextInput
  //Devuelve el html para añadir habitaciones


  var addNewRoom = function ($room, sequence, index) {
    var html = $room.find('[data-template-searcher-room]').html();
    html = html.replace(/{{index}}/g, index);
    html = html.replace(/{{sequence}}/g, sequence);
    return html;
  }; //addNewRoom


  var roomsModify = function ($room, sequence, index) {
    var html = $room.find('[data-template-searcher-room]').html();
    html = html.replace(/{{index}}/g, index);
    html = html.replace(/{{sequence}}/g, sequence);
    return html;
  }; //roomsModify
  //Devuelve el numero maximo de personas en todas las habitaciones


  var numMaxPeopleRooms = function ($obj) {
    //Numero maximo de personas en total en todas las habitaciones
    var i = 0;
    $obj.each(function () {
      var aux = parseInt($(this).val());

      if (aux) {
        i = i + aux;
      }
    });
    return i;
  }; //numMaxPeopleRooms
  //Desactiva o activar inputs dependiente del numero de personas


  var disabledEnabledInputs = function ($rooms, numMaxPeople) {
    var $obj = $rooms.find('[data-selectize-multi="hide-label"]').not('[data-searcher-room="babies"]');

    if (numMaxPeople >= 9) {
      $.each($obj, function () {
        var $this = $(this);

        if ($this.val() <= 0) {
          $this[0].selectize.disable();
          $this.parents('.ibe_form__selectize-multi').addClass('ibe_form__selectize-multi--disabled');
        } else {
          $(this).parents('.ibe_form__selectize-multi').removeClass('ibe_form__selectize-multi--disabled');
        }
      });
      $.each($rooms.find('[data-searcher-room^="room-"]'), function () {
        var $this = $(this);

        if ($this.find('[data-searcher-room="adults"]').val() <= 0) {
          $this.find('[data-searcher-room="babies"]')[0].selectize.disable();
          $this.find('[data-searcher-room="babies"]').parents('.ibe_form__selectize-multi').addClass('ibe_form__selectize-multi--disabled');
        }
      });
    } else {
      $.each($rooms.find('[data-selectize-multi="hide-label"]'), function () {
        $(this)[0].selectize.enable();
        $(this).parents('.ibe_form__selectize-multi').removeClass('ibe_form__selectize-multi--disabled');
      });
    }
  }; //disabledEnabledInputs
  //Cambiar texto añadir habitaciones


  var changeTextButtonAddRooms = function ($container) {
    var $button = $container.find('[data-searcher-room="add-room"]'),
        $txtComplete = $container.find('[data-no-more-rooms="true"]'),
        lng = $container.find('[data-searcher-room^="room-"]').length;

    if (lng >= 4) {
      $txtComplete.css('display', 'inline-block');
      $button.hide();
    } else {
      $txtComplete.css('display', 'none');
      $button.show();
    }
  }; //changeTextButtonAddRooms
  // Inicia por defecto con un adulto al añadir adultos


  var initAdults = function ($rooms, numMaxPeople) {
    var $objAdult = $rooms.find('[data-selectize-multi="hide-label"]').not('[data-searcher-room="children"]').not('[data-searcher-room="babies"]');
    var $objChildren = $rooms.find('[data-selectize-multi="hide-label"]').not('[data-searcher-room="adults"]').not('[data-searcher-room="babies"]');
    var changed = false;

    if (numMaxPeople >= 9) {
      $.each($objChildren, function () {
        var $this = $(this);

        if ($this.val() > 1) {
          $this[0].selectize.setValue($this.val() - 1);
          changed = true;
          return false;
        }
      });

      if (changed === false) {
        $.each($objAdult, function () {
          var $this = $(this);

          if ($this.val() > 1) {
            $this[0].selectize.setValue($this.val() - 1);
            return false;
          }
        });
      }
    }
  }; //initAdults
  //Recalc options of all selects


  var recalculateAllSelects = function ($room) {
    var numMaxPeople = numMaxPeopleRooms($room.find('[data-selectize-multi="hide-label"]').not('[data-searcher-room="babies"]')),
        $selects = $room.find('[data-selectize-multi="hide-label"]').not('[data-searcher-room="babies"]');
    var x, i;
    $.each($selects, function () {
      var $self = $(this),
          selfValue = $self.val(),
          selectJson = [];
      var begin = $($self[0]).attr('data-searcher-room') === 'adults' ? 1 : 0;

      for (x = 9; x > selfValue; x--) {
        $self[0].selectize.removeOption(x);
      }

      for (i = begin; i <= 9 - (numMaxPeople - selfValue); i++) {
        selectJson.push({
          'value': i,
          'text': i
        });
      }

      $self[0].selectize.addOption(selectJson);
    });
  }; //recalculateAllSelects
  //Guarda los valores de las edades cuando éstos cambian su valor


  var _updateValueChildren = function () {
    var array = $('[data-searcher-room="children-ages"]');
    var $agesList;
    var i;
    array.each(function (index, value) {
      for (i = 0; i < array.eq(index).find('select').length; i++) {
        if (index === 0) {
          $agesList = $agesList1;
        } else if (index === 1) {
          $agesList = $agesList2;
        } else if (index === 2) {
          $agesList = $agesList3;
        } else if (index === 3) {
          $agesList = $agesList4;
        }

        array.eq(index).find('select').eq(i)[0].selectize.setValue($agesList[i]);
      }
    });
  }; //Eliminar Habitaciones


  var deleteRooms = function ($element) {
    var $this = $element,
        index = $this.attr('data-index'),
        $container = $this.parents('.ibe-searcher-room'),
        $rooms = $this.parents('.ibe-searcher-room__container'),
        $room = $container.find('[data-searcher-room^="room-"]'),
        $parent = $this.parents('[data-searcher-room="room-' + index + '"]'),
        i,
        j,
        numMaxPeople;
    $countRoom--;

    if ($room.length > 1) {
      $parent.remove();
      $room = $container.find('[data-searcher-room^="room-"]');
      i = 1;
      $room.each(function () {
        var $this = $(this),
            $number = $this.find('[data-searcher-room="number"]');
        $this.attr('data-index', i);
        $this.attr('data-sequence', i);
        $this.attr('data-searcher-room', 'room-' + i);
        $this.find('[data-searcher-room="delete"]').attr('data-index', i); //input adulto

        $this.find('[data-searcher-room="adults"]').parent().find('label').attr('for', $this.find('[data-searcher-room="adults"]').parent().find('label').attr('for').replace($this.find('[data-searcher-room="adults"]').attr('name'), 'adult_' + i));
        $this.find('[data-searcher-room="adults"]').parent().find('.selectize-control input').attr('id', $this.find('[data-searcher-room="adults"]').parent().find('.selectize-control input').attr('id').replace($this.find('[data-searcher-room="adults"]').attr('name'), 'adult_' + i));
        $this.find('[data-searcher-room="adults"]').attr('name', 'adult_' + i).attr('id', 'adult_' + i); //niños

        $this.find('[data-searcher-room="children"]').parent().find('label').attr('for', $this.find('[data-searcher-room="children"]').parent().find('label').attr('for').replace($this.find('[data-searcher-room="children"]').attr('name'), 'children_' + i));
        $this.find('[data-searcher-room="children"]').parent().find('.selectize-control input').attr('id', $this.find('[data-searcher-room="children"]').parent().find('.selectize-control input').attr('id').replace($this.find('[data-searcher-room="children"]').attr('name'), 'children_' + i));
        $this.find('[data-searcher-room="children"]').attr('name', 'children_' + i).attr('id', 'children_' + i); //bebes

        $this.find('[data-searcher-room="babies"]').parent().find('label').attr('for', $this.find('[data-searcher-room="babies"]').parent().find('label').attr('for').replace($this.find('[data-searcher-room="babies"]').attr('name'), 'baby_' + i));
        $this.find('[data-searcher-room="babies"]').parent().find('.selectize-control input').attr('id', $this.find('[data-searcher-room="babies"]').parent().find('.selectize-control input').attr('id').replace($this.find('[data-searcher-room="babies"]').attr('name'), 'baby_' + i));
        $this.find('[data-searcher-room="babies"]').attr('name', 'baby_' + i).attr('id', 'baby_' + i); //edades

        $this.find('[data-searcher-room="children-ages"] select').each(function (actual) {
          var $sel = $(this);
          $sel.parent().find('label').eq(actual).attr('for', $sel.parent().find('label').eq(actual).attr('for').replace($sel.attr('name'), 'room_children_' + i + '-' + (actual + 1)));
          $sel.parent().find('.selectize-control input').eq(actual).attr('id', $sel.parent().find('.selectize-control input').eq(actual).attr('id').replace($sel.attr('name'), 'room_children_' + i + '-' + (actual + 1)));
          $sel.attr('name', 'room_children_' + i + '-' + (actual + 1)).attr('id', 'room_children_' + i + '-' + (actual + 1));
        });
        $number.html(i + 'º');
        i++;
        $room = $this.parents('.ibe-searcher-room');
        $rooms = $this.parents('.ibe-searcher-room__container'); //Recalcular las opciones de todos los select

        recalculateAllSelects($room); //Comprobamos el numero maximo de personas en las habitaciones

        numMaxPeople = numMaxPeopleRooms($rooms.find('[data-selectize-multi="hide-label"]').not('[data-searcher-room="babies"]'));

        if (numMaxPeople > 9) {
          j = 9 - (numMaxPeople - value);
          $this[0].selectize.setValue(j);
        } //Desactivar o activar los selectize segun el numero de personas


        disabledEnabledInputs($rooms, numMaxPeople);
      });
      changeTextInput($container);
    }

    changeTextButtonAddRooms($container);
  }; //Añadir habitaciones


  var addRooms = function ($element) {
    var $container = $element,
        $room = $container.find('.ibe-searcher-room__container'),
        $last = $room.find('[data-searcher-room^="room-"]').last(),
        index = $last.attr('data-index'),
        sequence = $last.attr('data-sequence'),
        numMaxPeople,
        html,
        selected;
    index++;
    sequence++;
    $countRoom++;

    if (sequence <= 4) {
      //Comprobamos el numero maximo de personas en las habitaciones
      numMaxPeople = numMaxPeopleRooms($room.find('[data-selectize-multi="hide-label"]').not('[data-searcher-room="babies"]')); //Añadimos la nueva habitacion

      html = addNewRoom($room, sequence, index);
      $room.append(html);
      dFrontJs.ibe_combobox.init(); // Por defecto añade un adulto

      initAdults($room, numMaxPeople);
      selected = 1; //Volvemos a recoger el ultimo item

      $last = $room.find('[data-searcher-room^="room-"]').last();
      $last.find('[data-searcher-room="adults"]')[0].selectize.setValue(selected); //Desactivar o activar los selectize segun el numero de personas

      disabledEnabledInputs($room, numMaxPeople); //Un adulto por defecto al añadir habitacion si el numero de personas no sobrepasa el maximo

      if (numMaxPeople < 9) {
        $last.find('.selectize-control').first().addClass('selectize-control--show-label');
        $last.find('.ibe_form__input-label').first().css('display', 'block');
      } //Cambiar estado del input de habitaciones


      changeTextInput($container);
    }

    changeTextButtonAddRooms($container);
  }; //Inicializar template


  var initTemplate = function (selector) {
    var $templates = $(selector);
    $.each($templates, function () {
      var $this = $(this),
          index = 1,
          sequence = 1,
          $container = $this.parents('.ibe-searcher-room'),
          $room = $container.find('.ibe-searcher-room__container'),
          $firstRoom = $('[data-searcher-room="room-' + index + '"]'); //Esto seria la funcion addRoom

      var html = addNewRoom($room, index, sequence);
      $room.append(html);
      dFrontJs.ibe_combobox.init();
      $room.find('[data-searcher-room="adults"]')[0].selectize.setValue(2);
      $room.find('[data-searcher-room="adults"]').closest('.ibe_form__selectize-multi--hide-label').find('.ibe_form__input-label').show();
      $room.find('[data-searcher-room="adults"]').siblings('.selectize-control').addClass('selectize-control--show-label'); //La primera habitacion eliminamos los botones de borrar

      $room.find('[data-searcher-room="delete"]').remove(); //Seleccionamos 2 adultos por defecto en la primera habitacion

      if ($firstRoom.length > 0) {
        $.each($firstRoom, function () {
          var $this = $(this);
          $this.find('.selectize-control').first().addClass('selectize-control--show-label');
          $this.find('.ibe_form__input-label').first().css('display', 'block');
        });
      }
    });
  }; //initTemplate


  var chargeSearcherRoomInit = function (e) {
    var positionCounter;

    if (e !== undefined) {
      if (!$(this).hasClass('fc-searcher-room-opened')) {
        $(this).addClass('fc-searcher-room-opened');
      }
    }

    $('.ibe-searcher-room').each(function () {
      if (!$(this).hasClass('fc-searcher-room-active')) {
        positionCounter = $('.ibe-people-counter');
        positionCounter.position({
          my: 'right bottom',
          at: 'right bottom',
          collision: 'fit fit'
        });
        initTemplate('[data-template-searcher-room]'); //Selectize "buscador habitaciones"

        $(document).on('change', '[data-selectize-multi="hide-label"]', function () {
          var $this = $(this),
              value = $this.val(),
              $room = $this.parents('.ibe-searcher-room'),
              $rooms = $this.parents('.ibe-searcher-room__container'),
              $container = $this.parents('[data-searcher-room^="room-"]'),
              $parent = $this.parents('.ibe_form__selectize-multi'),
              $text = $parent.find('.ibe_form__input-label'),
              data,
              $babies,
              babiesValue,
              selectJson,
              i,
              countBabies,
              numMaxPeople,
              j; //Si el valor es cero reseteamos el selectize

          if (value === '0') {
            $this[0].selectize.setValue('');
          } //Recalcular las opciones de todos los select


          recalculateAllSelects($room);
          data = $this.data('searcher-room');

          switch (data) {
            case 'adults':
              //Cambiamos el numero maximo de bebes por habitacion/Cambiamos el numero maximo de bebes por habitacion
              $babies = $container.find('[data-searcher-room="babies"]');
              babiesValue = $container.find('[data-searcher-room="babies"]').val();
              selectJson = [];
              $babies[0].selectize.clearOptions();

              for (i = 0; i <= value; i++) {
                selectJson.push({
                  'value': i,
                  'text': i
                });
              }

              $babies[0].selectize.addOption(selectJson);
              countBabies = 0;
              $.each($rooms.find('[data-searcher-room="adults"]'), function () {
                countBabies = countBabies + parseInt($(this).val());
              });
              countBabies = $babies.val();

              if (babiesValue > 0) {
                if (babiesValue >= value) {
                  $babies[0].selectize.setValue(value);
                } else {
                  $babies[0].selectize.setValue(babiesValue);
                }
              }

              break;

            case 'children':
              break;
          } //Volvemos a recoger el valor reseteado para evitar errores


          value = $this.val();

          if (value == 0 || value == "") {
            $text.css('display', 'none');
            $parent.find('.selectize-control').removeClass('selectize-control--show-label');
          } else {
            $text.css('display', 'block');
            $parent.find('.selectize-control').addClass('selectize-control--show-label');
          } //Comprobamos el numero maximo de personas en las habitaciones


          numMaxPeople = numMaxPeopleRooms($rooms.find('[data-selectize-multi="hide-label"]').not('[data-searcher-room="babies"]'));

          if (numMaxPeople > 9) {
            j = 9 - (numMaxPeople - value);
            $this[0].selectize.setValue(j);
          } //Desactivar o activar los selectize segun el numero de personas


          disabledEnabledInputs($rooms, numMaxPeople); //Elegir la edad en el buscador (searcher)
        }).on('change', '[data-searcher-room="children"]', function (e) {
          var $this = $(this),
              value = $this.val(),
              $container = $this.parents('.ibe-searcher-room'),
              $parent = $this.parents('.ibe-searcher-room__item'),
              $collapse = $parent.find('[data-searcher-room="children-ages"]'),
              html,
              minAges,
              maxAges,
              options,
              countRoom,
              classLabel,
              template,
              tpl,
              i,
              select,
              newIndex;

          if (value == 0 || value == "") {
            $collapse.find('.ibe-searcher-room__column-ages').find('.ibe_form__selectize-multi__selectors').html('');
            $collapse.css('display', 'none');
          } else {
            html = '';
            minAges = $collapse.data('min-ages') || 2;
            maxAges = $collapse.data('max-ages') || 17;
            options = '';
            countRoom = $(this).parents('[data-searcher-room]').find('[data-searcher-room="number"]').text().substring(0, 1);
            classLabel = 'hideAccesible';
            template = $('[data-select-children-years]').html();
            tpl = '';

            if (template) {
              for (i = 1; i <= value; i++) {
                tpl = template.replace(/{{countRoom}}/g, countRoom);
                tpl = template.replace(/{{index}}/g, i);
                html += tpl;
              }

              $collapse.find('.ibe-searcher-room__column-ages').find('.ibe_form__selectize-multi__selectors').html(html);

              if (!maxAges) {
                select = $collapse.find('.ibe-searcher-room__column-ages').find('.ibe_form__selectize-multi__selectors').find('select');
                select.find('option').remove();

                for (newIndex = minAges; newIndex <= maxAges; newIndex++) {
                  if (newIndex < 10) {
                    options += '<option value="0' + newIndex + '">0' + newIndex + '</option>';
                  } else {
                    options += '<option value="' + newIndex + '">' + newIndex + '</option>';
                  }
                }

                select.append(options);
              }
            } else {
              for (i = 1; i <= value; i++) {
                if ($collapse.parents('.ibe-advanced-searcher').length > 0) {
                  html += '<div class="ibe_form__selectize-multi-min">';
                  classLabel = 'ibe_form__input-label-min';
                }

                html += '<label for="room_children_' + countRoom + '-' + i + '" class="' + classLabel + '">Edad ni&ntilde;o ' + i + '</label>' + '<select name="room_children_' + countRoom + '-' + i + '" data-selectize="simple" id="room_children_' + countRoom + '-' + i + '" class="ibe_form__selectize">';

                for (newIndex = minAges; newIndex <= maxAges; newIndex++) {
                  if (newIndex < 10) {
                    html += '<option value="0' + newIndex + '">0' + newIndex + '</option>';
                  } else {
                    html += '<option value="' + newIndex + '">' + newIndex + '</option>';
                  }
                }

                html += '</select>';

                if ($collapse.parents('.ibe-advanced-searcher').length > 0) {
                  html += '</div>';
                }
              }

              $collapse.find('.ibe-searcher-room__column-ages').find('.ibe_form__selectize-multi__selectors').html(html);
            }

            dFrontJs.ibe_combobox.init();
            dFrontJs.ibe_tooltip.init();
            $('[data-searcher-room="children-ages"]').off('change', _updateAgesList);
            $.when(_updateValueChildren(e)).then($('[data-searcher-room="children-ages"]').on('change', _updateAgesList));
            setTimeout(function () {
              if (window.innerWidth > 600 && $('[data-searcher-room="children-ages"]').parents('.ibe-advanced-searcher__separator').length === 0) {
                $collapse.css('display', 'inline-block');
              } else {
                $collapse.css('display', 'block');
              }
            }, 100);
          }

          testingNumberChildrenRoom($container); //Eliminar linea de habitacion
        }).on('click', '[data-searcher-room="delete"]', function (e) {
          deleteRooms($(this));
          e.stopPropagation(); //Añadir nueva habitacion
        }).on('click', '[data-searcher-room="add-room"]', function (e) {
          addRooms($(this).parents('.ibe-searcher-room'));
        }).on('selectmenuchange', '[data-select-rooms="select"]', function () {
          var $this = $(this),
              sVal = $this.val(),
              $container = $this.parent().closest('[data-select-rooms]').find('.ibe-searcher-room'),
              $room = $container.find('.ibe-searcher-room__container'),
              $last = $room.find('[data-searcher-room^="room-"]').last(),
              index = $last.attr('data-index'),
              sequence = $last.attr('data-sequence'),
              i,
              numMaxPeople,
              html,
              selected;

          if (sVal > sequence) {
            sVal = sVal - sequence;

            for (i = 0; i < sVal; i++) {
              index++;
              sequence++;
              $countRoom++; //Comprobamos el numero maximo de personas en las habitaciones

              numMaxPeople = numMaxPeopleRooms($room.find('[data-selectize-multi="hide-label"]').not('[data-searcher-room="babies"]')); //Añadimos la nueva habitacion

              html = addNewRoom($room, sequence, index);
              $room.append(html);
              dFrontJs.ibe_combobox.init(); // Por defecto añade un adulto

              initAdults($room, numMaxPeople);
              selected = 1; //Volvemos a recoger el ultimo item

              $last = $room.find('[data-searcher-room^="room-"]').last();
              $last.find('[data-searcher-room="adults"]')[0].selectize.setValue(selected); //Desactivar o activar los selectize segun el numero de personas

              disabledEnabledInputs($room, numMaxPeople); //Un adulto por defecto al añadir habitacion si el numero de personas no sobrepasa el maximo

              if (numMaxPeople < 9) {
                $last.find('.selectize-control').first().addClass('selectize-control--show-label');
                $last.find('.ibe_form__input-label').first().css('display', 'block');
              }
            }
          } else if (sequence > sVal) {
            sVal = sequence - sVal;

            for (i = 0; i < sVal; i++) {
              $room.find('[data-searcher-room^="room-"]').last().remove();
              recalculateAllSelects($room);

              if (numMaxPeople < 9) {
                $last.find('.selectize-control').first().addClass('selectize-control--show-label');
                $last.find('.ibe_form__input-label').first().css('display', 'block');
              }

              disabledEnabledInputs($room, numMaxPeople);
            }
          }
        });
        $(this).addClass('fc-searcher-room-active');
      }
    });
  }; //Eventos jquery


  var init = function () {
    if ($('.ibe-advanced-searcher').length > 0) {
      chargeSearcherRoomInit();
    }

    $('[data-text-room]').off('click', chargeSearcherRoomInit);
    $('[data-text-room]').on('click', chargeSearcherRoomInit);
  }; //public functions
  //Actualizar Habitaciones
  // Example: dFrontJs.ibe_searcher_room.updateRooms("#searcher-rooms-1",4)


  var updateRooms = function (selector, numberRooms) {
    var sequence, i;
    sequence = $(selector).find('.ibe-searcher-room__container [data-searcher-room^="room-"]').last().attr('data-sequence');

    if (numberRooms > sequence) {
      for (i = sequence; numberRooms > i; i++) {
        addRooms($(selector));
      }
    } else {
      for (i = numberRooms; sequence > i; i++) {
        deleteRooms($(selector).find('.ibe-searcher-room__container [data-searcher-room^="room-"]').last().find('[data-searcher-room="delete"]'));
      }
    }
  }; //Actualizar numero de adultos
  // Example: dFrontJs.ibe_searcher_room.updateAdults("#searcher-rooms-1",1,3)


  var updateAdults = function (selector, room, numberAdult) {
    var $numberAdult = numberAdult || 0;

    if ($(selector).find('[data-sequence="' + room + '"]').length > 0) {
      $(selector).find('[data-sequence="' + room + '"]').find($('[data-searcher-room="adults"]'))[0].selectize.setValue($numberAdult);
    }
  }; //Actualizar numero de niños
  // Example: dFrontJs.ibe_searcher_room.updateChildren("#searcher-rooms-1",1,3)


  var updateChildren = function (selector, room, numberChildren) {
    var $numberChildren = numberChildren || 0;

    if ($(selector).find('[data-sequence="' + room + '"]').length > 0) {
      $(selector).find('[data-sequence="' + room + '"]').find($('[data-searcher-room="children"]'))[0].selectize.setValue($numberChildren);
    }
  }; //Actualizar numero de bebes
  // Example: dFrontJs.ibe_searcher_room.updateBabies("#searcher-rooms-1",1,3)


  var updateBabies = function (selector, room, numberBabies) {
    var $numberBabies = numberBabies || 0;

    if ($(selector).find('[data-sequence="' + room + '"]').length > 0) {
      $(selector).find('[data-sequence="' + room + '"]').find($('[data-searcher-room="babies"]'))[0].selectize.setValue($numberBabies);
    }
  }; //Actualizar edades de niños
  // Example: dFrontJs.ibe_searcher_room.updateAgesChildren("#searcher-rooms-1",1,["03","05","10"])


  var updateAgesChildren = function (selector, room, numberAges) {
    var i,
        $numberAges = numberAges;

    if ($(selector).find('[data-sequence="' + room + '"]').length > 0) {
      for (i = 0; i <= $numberAges.length - 1; i++) {
        if ($(selector).find('[data-sequence="' + room + '"] #room_children_' + room + '-' + (i + 1)).length > 0) {
          $(selector).find('[data-sequence="' + room + '"]').find('#room_children_' + room + '-' + (i + 1))[0].selectize.setValue($numberAges[i]);
        }
      }
    }
  };

  return {
    'init': init,
    'initTemplates': initTemplate,
    'updateRooms': updateRooms,
    'updateAdults': updateAdults,
    'updateChildren': updateChildren,
    'updateBabies': updateBabies,
    'updateAgesChildren': updateAgesChildren,
    'chargeSearcherRoomInit': chargeSearcherRoomInit
  };
}(jQuery);
"use strict";

dFrontJs.ibe_select_tab = function () {
  //Jquery ui accordion
  var init = function () {
    var select = $('[data-ibe-select-tab="content"]');
    $.each(select, function () {
      $(this).on('change', function () {
        $('[data-ibe-select-tab="content"]').closest('[data-ibe-select-tab="container"]').children().find('[data-ibe-select-tab][data-ibe-select-tab!="content"][data-ibe-select-tab!="container"]').addClass('hidden');
        $('[data-ibe-select-tab="' + $(this).closest('[data-ibe-select-tab="content"]').val() + '"]').each(function () {
          $(this).removeClass('hidden');
        });
      });
    });
  }; //pluginAccordion


  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_selectmenu = function () {
  /*eslint no-underscore-dangle: ["error", { "allow": ["_createAutocomplete", "_createShowAllButton", "_on", "_trigger", "_renderItem"] }]*/
  var init = function (selector) {
    var $select = $('[data-selectmenu]'),
        $selectEdit = $('[data-selectmenu-edit]'),
        $selectLabel = $('[data-selectmenu_claim]'),
        $vintage = $('.ibe-searcher__vintage'),
        $modal = $('.ibe-dinamic-modal');
    requestAnimFrame(function () {
      var i, initialvalue, select;

      if ($selectEdit) {
        for (i = 0; $selectEdit.length > i; i++) {
          select = $($selectEdit[i]); //Creamos el combobox

          function selecciona_value(objInput) {
            var valor_input = objInput.value;
            var longitud = valor_input.length;
            var range;

            if (objInput.setSelectionRange) {
              objInput.focus();
              objInput.setSelectionRange(0, longitud);
            } else if (objInput.createTextRange) {
              range = objInput.createTextRange();
              range.collapse(true);
              range.moveEnd('character', longitud);
              range.moveStart('character', 0);
              range.select();
            }
          }

          $.widget('custom.combobox', {
            //Casuistica sin data-placeholder
            _create: function () {
              this.wrapper = $('<div>').addClass('custom-combobox ibe-select__edit').insertAfter(this.element);
              this.element.hide();

              this._createAutocomplete();

              this._createShowAllButton();
            },
            _createAutocomplete: function () {
              //Aquí solo entra una vez
              var elementEmpty = '',
                  element,
                  selected,
                  wasOpen,
                  value; //Casuistica sin data-placeholder

              if (!select.attr('data-placeholder')) {
                element = this.element.children();
                element.each(function (i) {
                  var $this = $(this); //Aquí estamos cogiendo los option

                  if ($this.val() === "") {
                    elementEmpty = $(this).text();
                  }
                });
              }

              selected = this.element.children(':selected'); //El option del select que aparece seleccionado por defecto

              value = selected.val() ? selected.text() : elementEmpty;
              wasOpen = false;
              this.label = $('<label for="select-edit-' + (i + this.uuid) + '" class="ibe-select__label ibe-select__input">').appendTo(this.wrapper).text(value);
              initialvalue = this.label.text();
              this.input = $('<input id="select-edit-' + (i + this.uuid) + '" name="select-edit' + (i + this.uuid) + '">').appendTo(this.wrapper).val(value).addClass('ibe-select__input custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left').click(function (e) {
                selecciona_value(e.currentTarget);
                wasOpen = $(this).autocomplete('widget').is(':visible');
                $(this).trigger('focus');
                $(this).autocomplete('search', ''); //Search empty text, show all items

                if (wasOpen) {
                  $(this).parent().find('.ibe-select__autocomplete').toggle();
                  $(this).parent().toggleClass('ibe-select__edit--open');
                }
              }).autocomplete({
                appendTo: this.wrapper,
                delay: 0,
                minLength: 0,
                // autoFocus: true,    // auto select in search input text
                source: $.proxy(this, '_source'),
                position: {
                  my: 'left top',
                  at: 'left bottom',
                  collision: 'fit'
                },
                create: function () {
                  $(this).autocomplete('close');
                },
                open: function () {
                  $(this).parent().addClass('ibe-select__edit--open');
                },
                close: function () {
                  $(this).parent().removeClass('ibe-select__edit--open');
                },
                select: function () {
                  var valueS = $(this).parent().siblings('select').find('option:selected').text();
                  $(this).val(valueS);
                  $(this).blur();
                }
              }).focus(function (e) {
                selecciona_value(e.currentTarget);
              });

              if (select.attr('data-placeholder')) {
                this.input.attr('placeholder', select.attr('data-placeholder'));
                this.wrapper.addClass('ibe-select__placeholder');
              }

              this.wrapper.find('.ui-autocomplete').addClass('ibe-select__autocomplete');

              this._on(this.input, {
                autocompleteselect: function (event, ui) {
                  ui.item.option.selected = true;

                  this._trigger('select', event, {
                    item: ui.item.option
                  });

                  this.bindings.eq(0).trigger('change');
                  this.label.text(ui.item.value);
                },
                autocompletechange: '_removeIfInvalid'
              });
            },
            _createShowAllButton: function () {
              var input = this.input,
                  wasOpen = false;
              $('<a class="ibe-select__toggle custom-combobox-toggle ui-corner-right" aria-label="Button combobox">').appendTo(this.wrapper).button({
                icons: {
                  primary: 'ui-icon-triangle-1-s'
                },
                text: false
              }).removeClass('ui-corner-all').on('mousedown', function () {
                wasOpen = input.autocomplete('widget').is(':visible');
              }).on('click', function () {
                input.trigger('focus'); // Close if already visible

                if (wasOpen) {
                  return;
                } // Pass empty string as value to search for, displaying all results


                input.autocomplete('search', '');
              });
            },
            _source: function (request, response) {
              var accentMap = {
                'á': 'a',
                'à': 'a',
                'â': 'a',
                'é': 'e',
                'è': 'e',
                'ê': 'e',
                'ë': 'e',
                'í': 'i',
                'ï': 'i',
                'î': 'i',
                'ó': 'o',
                'ô': 'o',
                'ö': 'o',
                'û': 'u',
                'ù': 'u',
                'Á': 'A',
                'À': 'A',
                'Â': 'A',
                'É': 'E',
                'È': 'E',
                'Ê': 'E',
                'Ë': 'E',
                'Í': 'I',
                'Ï': 'I',
                'Î': 'I',
                'Ó': 'O',
                'Ô': 'O',
                'Ö': 'O',
                'Û': 'U',
                'Ù': 'U'
              };
              var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), 'i');
              var matcher2 = new RegExp($.ui.autocomplete.escapeRegex(request.term.replace(/[^\w ]/g, function (char) {
                return accentMap[char] || char;
              })), 'i');
              response(this.element.children('option').map(function () {
                var text = $(this).text();
                if (this.value && (!request.term || matcher.test(text) || matcher2.test(text.replace(/[^\w ]/g, function (char) {
                  return accentMap[char] || char;
                })))) return {
                  label: text,
                  value: text,
                  option: this
                };
              }));
            },
            _removeIfInvalid: function (event, ui) {
              var value, valueLowerCase, valid; // Selected an item, nothing to do

              if (ui.item) {
                select.find('.ibe-select__label').text(event.target.value);
                return;
              }

              select.find('.ibe-select__label').text(initialvalue);
              this.label.text(initialvalue); // Search for a match (case-insensitive)

              value = this.input.val();
              valueLowerCase = value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
              valid = false;
              this.element.children('option').each(function () {
                if ($(this).text().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === valueLowerCase) {
                  this.selected = valid = true;
                  return false;
                }
              }); // Found a match, nothing to do

              if (valid) {
                $(event.target).parents().siblings('label').text(event.target.value);
                $(event.target).siblings('label').text(event.target.value);
                return;
              } // Remove invalid value


              this.input.val(initialvalue);
              this.element.val(''); // this._delay(function () {
              //   this.input.tooltip('close').attr('title', '');
              // }, 2500);d

              this.input.autocomplete('instance').term = '';
            },
            _destroy: function () {
              this.wrapper.remove();
              this.element.show();
            }
          });
          $(select).combobox(); // console.log($selectEdit.value())

          if ($selectEdit.parent().hasClass('ibe_form__group--select-edit')) {}
        }
      }
    });
    requestAnimFrame(function () {
      if ($select) {
        $select.each(function () {
          var select = $(this);
          var id = $(this).attr('id');
          var addscroll = $(this).data('addscroll');

          select.selectmenu({
            appendTo: $(this).parent(),
            position: {
              my: 'left top',
              at: 'left bottom',
              collision: 'flip flip'
            },
            create: function () {
              if (addscroll !== undefined) {
                $('#' + id + '-menu').addClass('ibe-select__menu--scroll');
              }

              $('#' + id + '-menu').addClass('ibe-select__menu');
              $('#' + id + '-button').addClass('ibe-select__button');
              $('#' + id + '-button').find('span').attr('role', 'presentation');
            },
            open: function () {
              $('#' + id + '-button').addClass('ibe-select__button--open'); /////// To open / close the modal in case of vintage search//////////////////

              if ($('#' + id + '-button').parents('.ibe-searcher__vintage').length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
                dFrontJs.ibe_modals_vintage.openModalTarifas();
              } /////// End open / close the modal modal ////////////////////////////
              //Selectmenu Disable modal option in advanced searcher - IBDIGITAL


              if (!$(this).parents('.ibe-advanced-searcher').length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
                dFrontJs.ibe_dinamic_modal.open($('#' + id + '-button'));
              }
            },
            close: function () {
              if (window.innerWidth < dFrontJs.resolutions.lg) {
                dFrontJs.ibe_dinamic_modal.close($('#' + id + '-button'));
              }

              $('#' + id + '-button').removeClass('ibe-select__button--open');

              if ($('#' + id + '-button').parents('.ibe-searcher__vintage').length > 0 && window.innerWidth < dFrontJs.resolutions.lg) {
                dFrontJs.ibe_modals_vintage.closeModalsVintage('yes');
              }
            },
            change: function (event, ui) {
              if ($(ui.item.element).data('function')) {
                if ($(ui.item.element).data('src')) {
                  window.location = $(ui.item.element).data('src');
                } else {
                  if ($(ui.item.element).data('function') === 'oneway') {
                    dFrontJs.ibe_searcher_calendar.activeOneWayFunction(select);
                  } else if ($(ui.item.element).data('function') === 'roundtrip') {
                    dFrontJs.ibe_searcher_calendar.activeRountripFunction(select);
                  }
                }
              }
            }
          }).data('ui-selectmenu')._renderItem = function (ul, item) {
            var src = item.element.data('src');

            if (src) {
              return $('<li>').append('<a class="ui-menu-item-link ui-menu-item-wrapper" href="' + src + '" title="' + item.label + '">' + '<span class="ui-menu-item-link__text">' + item.label + '</span></a>').appendTo(ul);
            }

            return $('<li>').append('<div class="ui-menu-item-wrapper"' + item.label + '>' + '<span class="ui-menu-item-link__text">' + item.label + '</span></div>').appendTo(ul);
          };
        });
      }
    });
    requestAnimFrame(function () {
      if ($selectLabel) {
        $selectLabel.each(function () {
          var select = $(this).find('select');
          select.selectmenu({
            change: function (event, ui) {
              var value = select.val();
              var div = $(this).parent();
              var label = div.find('label');
              var text = label.find('span');
              var parentForm,
                  selectedValue,
                  selctrelated,
                  listaMotivos,
                  options = [],
                  i;

              if (value.length > 0) {
                $(label).addClass('ibe_form__selectize--label02');
                $(text).addClass('ibe_form__input-text--selectnew');
              } else {
                $(label).removeClass('ibe_form__selectize--label02');
                $(text).removeClass('ibe_form__input-text--selectnew');
              }

              if (select.hasClass('inte-claim-type')) {
                parentForm = '#' + select.closest('.inte-contentClaims').attr('id');
                selectedValue = $(parentForm + ' .inte-claim-type')[0].value;
                $(parentForm + ' .inte-claim-reason00').parent().removeClass('ibe_form__group--error');
                $(parentForm + ' .inte-claim-reason00').parent().find('p').each(function () {
                  if ($(this)[0].className.indexOf('hidden') === -1) {
                    $(this).addClass('hidden');
                  }
                });

                if (selectedValue === 'Equipaje') {
                  $('.inte-pir').removeClass('hidden');
                  $('.inte-pir-date').removeClass('hidden');
                  $('#divInformation1').removeClass('hidden');
                  $('#divInformation2').removeClass('hidden');
                  $('#pir').attr('Required', 'true');
                  $('[data-valid-form] #pir').focusout(function () {
                    if ($(this).attr('required') === 'required') {
                      if (!$(this).val()) {
                        $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="exist"]').each(function () {
                          $(this).removeClass('hidden');
                          $(this).html($(this).data('validate-text'));
                        });
                        $(this).closest('.ibe_form__group').find('[data-validate="valid"]').addClass('hidden');
                      } else {
                        $(this).closest('.ibe_form__group').has('[data-validate="exist"]:visible').removeClass('ibe_form__group--error').find('[data-validate="exist"]').addClass('hidden');

                        if ($(this).val().match('[a-zA-Z]{5}[0-9]{5}') && $(this).val().length === 10) {
                          $(this).closest('.ibe_form__group').has('[data-validate="valid"]:visible').removeClass('ibe_form__group--error').find('[data-validate="valid"]').addClass('hidden');
                        } else {
                          $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
                            $(this).removeClass('hidden');
                            $(this).html($(this).data('validate-text'));
                          });
                        }
                      }
                    }
                  });
                } else if ($('#divInformation2').length > 0) {
                  $('.inte-pir').addClass('hidden');
                  $('.inte-pir-date').addClass('hidden');
                  $('#divInformation1').addClass('hidden');
                  $('#divInformation2').addClass('hidden');
                  $('.inte-pir input').removeAttr('Required');
                  $('.inte-pir-date input').removeAttr('Required');
                  $('#pir').parent().removeClass('ibe_form__group--error');
                  $('#pir').parent().find('p').each(function () {
                    if ($(this)[0].className.indexOf('hidden') === -1) {
                      $(this).addClass('hidden');
                    }
                  });
                }

                $(parentForm + ' .inte-claim-reason00').children('option:not(:first)').remove();
                $(parentForm + ' .inte-claim-reason00').selectmenu('refresh');
                selctrelated = $(parentForm + ' .inte-claim-type option:selected').attr('data-related');
                listaMotivos = getSubtypes(parentForm);

                for (i = 0; i < listaMotivos.length; i++) {
                  if (listaMotivos[i].parent === selectedValue || listaMotivos[i].parent.indexOf(selctrelated) > -1) {
                    options.push('<option value="' + listaMotivos[i].id + '">' + listaMotivos[i].value + '</option>');
                  }
                }

                if (options.length > 0) {
                  $(parentForm + ' .inte-claim-reason00').attr('Required', 'true');
                  $(parentForm + ' .inte-slcClaimReason').removeClass('hide');
                  $(parentForm + ' .inte-claim-reason00').append(options.join('')).selectmenu();
                  $(parentForm + ' .inte-claim-reason00').selectmenu('refresh');

                  if ($(parentForm + ' .inte-slcClaimReason').length > 0) {
                    if ($(parentForm + ' .inte-slcClaimReason')[0].className.indexOf('ibe_form__group--disabled') > -1) {
                      $(parentForm + ' .inte-slcClaimReason').removeClass('ibe_form__group--disabled');
                      $(parentForm + ' .inte-claim-reason00').selectmenu('enable');
                    }
                  }

                  $(parentForm + ' .inte-claim-reason00').parent().removeClass('ibe_form__group--error');
                  $(parentForm + ' .inte-claim-reason00').parent().find('p').each(function () {
                    if ($(this)[0].className.indexOf('hidden') === -1) {
                      $(this).addClass('hidden');
                    }
                  });
                  $(parentForm + ' .inte-claim-reason00').val('');
                  $(parentForm + ' .inte-claim-reason00').selectmenu('destroy');
                  dFrontJs.ibe_selectmenu.init();
                  $(parentForm + ' .inte-claim-reason00').parent().removeClass('ibe_form__group--content');
                } else {
                  $(parentForm + ' .inte-claim-reason00').removeAttr('Required');
                  $(parentForm + ' .inte-slcClaimReason').addClass('hide');
                  $(parentForm + ' .inte-slcClaimReason').addClass('ibe_form__group--disabled');
                  $(parentForm + ' .inte-claim-reason00').selectmenu('disable');
                  $(parentForm + ' .inte-claim-reason00').parent().removeClass('ibe_form__group--error');
                  $(parentForm + ' .inte-claim-reason00').parent().find('p').each(function () {
                    if ($(this)[0].className.indexOf('hidden') === -1) {
                      $(this).addClass('hidden');
                    }
                  });
                }
              } else if (select.hasClass('inte-type')) {
                parentForm = '#' + select.closest('.inte-typesubtypeForm').attr('id');
                selectedValue = $(parentForm + ' .inte-type')[0].value;
                options = [];
                selctrelated = $(parentForm + ' .inte-type option:selected').attr('data-related');
                listaMotivos = getSubtypes(parentForm);

                for (i = 0; i < listaMotivos.length; i++) {
                  if (listaMotivos[i].parent === selectedValue || listaMotivos[i].parent.indexOf(selctrelated) > -1) {
                    options.push('<option value="' + listaMotivos[i].id + '">' + listaMotivos[i].value + '</option>');
                  }
                }

                $(parentForm + ' .inte-subtype').children('option:not(:first)').remove();
                $(parentForm + ' .inte-subtype').selectmenu('refresh');
                $(parentForm + ' .inte-subtype').append(options.join('')).selectmenu();
                $(parentForm + ' .inte-subtype').selectmenu('refresh');
              }
            },
            open: function (event) {
              var id = $(this).attr('id');
              var menu = $('#' + id + '-menu'); //Ocultar Selecciona (primer elemento que mostramos de ejemplo)

              if (event.target[0].value === "") {
                menu.find('li').first().hide();
              }
            },
            close: function () {
              var $this = $(this);

              if ($('[data-valid-form] [required]')) {
                if ($this.attr('required') === 'required') {
                  if (!$this.val()) {
                    $this.closest('.ibe_form__group').addClass('ibe_form__group--error');
                    $this.closest('.ibe_form__group').find('[data-validate]').each(function () {
                      var $this = $(this);
                      $this.removeClass('hidden');
                      $this.html($this.data('validate-text'));
                    });
                  } else {
                    $this.closest('.ibe_form__group').has('[data-validate-text]:visible').removeClass('ibe_form__group--error');
                    $this.closest('.ibe_form__group').find('[data-validate]').each(function () {
                      var $this = $(this);
                      $this.addClass('hidden');
                    });
                  }
                }
              }
            }
          });
        });
      }
    });
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: Inputs show hide element
//    Descripcion: Funcion para mostrar y ocultar un elemento
//******************************************************************************/
dFrontJs.ibe_show_hide_element = function () {
  //init
  var init = function () {
    $('[data-show-hide]').on('click', function () {
      var $this = $(this),
          parent = $this.parent(),
          target = $this.data('show-hide-target'),
          action = $this.data('show-hide');
      parent.siblings().removeClass('active');
      parent.addClass('active');

      if (action === 'show') {
        $('[data-show-hide-target="' + target + '"]').attr('aria-expanded', true);
        $(target).show();
        $(target).attr('aria-expanded', true);
      } else {
        $('[data-show-hide-target="' + target + '"]').attr('aria-expanded', false);
        $(target).hide();
        $(target).attr('aria-expanded', false);
      }
    });
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_tab = function () {
  var iniTabsjquery = function (selector, json) {
    var $this = $(selector);
    var param_active = $this.data('tab-active') !== undefined ? $this.data('tab-active') : 0;
    var param_disable = $this.data('tab-disable') !== undefined ? $this.data('tab-disable') : '';
    json = json !== undefined ? json : '';
    $this.tabs({
      active: param_active,
      disabled: [param_disable],
      activate: function (event, ui) {
        dFrontJs.app.emitInView();

        if ($(ui.newTab[0]).parents('[data-city-list="collapse"]').length > 0 && !$(ui.newTab[0]).hasClass('loaded_cities')) {
          $(ui.newTab[0]).addClass('loaded_cities');
          var selectorNewSelector = $('.fc-dialog-all-destinations').is(':visible') ? $('.fc-dialog-all-destinations:visible').find('.modal-body') : $(ui.newTab[0].children).parents('.fc_form_group').find('input');
          var selectorNewTab = $(ui.newTab[0].children).parent();
          dFrontJs.ibe_searcher_choose_city.cityListConstructor(selectorNewSelector, selectorNewTab, json);
        }

        $('.ioslist-wrapper').scrollTop(0);
      }
    });
  }; //Plugin tab


  var init = function (selector) {
    //Bootstrap tabdrop
    var btnReload = $('[data-reload-animation="true"]');
    var btd = selector === undefined ? $('[data-tab="bootstrap-tabdrop"]') : $(selector);
    var bt = selector === undefined ? $('[data-tab="jquery-ui"]:not(.ui-tabs)') : $(selector);
    var btt = $('[data-tab="bootstrap-tab"]');

    if (btd.length > 0) {
      $.each(btd, function () {
        var $this = $(this),
            text = $this.data('tab-text'); //console.log($this.children().length);
        //-btd.tabdrop({

        $this.tabdrop({
          'text': text
        }); // }

        $this.addClass('ibe-tab-menu__tabdrop');
        $this.on('click', function () {
          requestAnimFrame(function () {
            dFrontJs.app.emitInView();
          });
        });
      });
    } //Tab jQuery ui


    if (bt.length > 0) {
      bt.each(function () {
        var $this = $(this);

        if (!$this.parent().hasClass('ibe-choose-city')) {
          iniTabsjquery($this);
        }
      });
      bt.find('.ibe-tab__container').removeClass('hidden');
      bt.css('min-height', 'inherit');
    } //Bootstrap tab


    if (btt.length > 0) {
      btt.tab();
    } // Reload mosaic animation


    if (btnReload.length) {
      reloadAnimation();
      $(btnReload).click(reloadAnimation);
    }
  }; //pluginTab
  // Function to change view mosaic/list


  var reloadAnimation = function () {
    $('.ibe_mosaic').find('.ibe_mosaic__piece').removeClass('active');
    setTimeout(function () {
      $('.ibe_mosaic').find('.ibe_mosaic__piece').addClass('active');
    });
  };

  return {
    'init': init,
    'reloadAnimation': reloadAnimation,
    'iniTabsjquery': iniTabsjquery
  };
}(jQuery);
"use strict";

//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: Table detail
//    Descripcion: Function to show the detail of a row of the table in collapse
//******************************************************************************/
dFrontJs.ibe_data_flight_status_table = function () {
  /*eslint no-underscore-dangle: ['error', { 'allow': ['_closeStructureDetailTable', '_openStructureDetailTable'] }]*/
  var _closeStructureDetailTable = function ($structure) {
    $structure.remove();
  };

  var _openStructureDetailTable = function ($structure, $row) {
    var $atribute = $row.parents('.ibe-tab__container').find('[data-box-detail]'),
        icon = 'ibe-flight-status__icon ibe-flight-status__icon--status icon-' + $($row).data('icon'),
        $copy = $atribute.clone(),
        textColor = '',
        coord,
        detailBox = $('.ibe-table-flight-status__detail-box');

    if ($($row).next('.tr-active').length === 0) {
      $('.tr-active').remove();
      $structure.insertAfter($row);

      if ($('.box-active').find('[data-box-detail]').length === 0) {
        $copy.appendTo('.box-active');
        $copy.css('display', 'block');
      }

      $($row).next('tr').css('cursor', 'inherit');
      $structure.show(500);
      $('[data-close-detail]').click(function () {
        _closeStructureDetailTable($structure);
      });

      if (window.innerWidth < dFrontJs.resolutions.md) {
        coord = $($row).next('tr').position();
        $('html, body').animate({
          scrollTop: coord.top + $($row).height()
        }, 600);
      }

      windowWidth = window.innerWidth;
      clearTimeout($.data(this, 'resizeOpen'));
      $.data(this, 'resizeOpen', setTimeout(function () {
        var coord;

        if (windowWidth < dFrontJs.resolutions.md) {
          coord = $($row).next('tr').position();
          $('html, body').animate({
            scrollTop: coord.top + $($row).height()
          }, 600);
        }
      })); //-console.log('boton', $(this).next('tr').find('[data-close-detail]'))
      //- Fill the dates
      //FLIGHT

      $($row).next('tr').find('[data-flight-date]').html($($row).data('flight-date'));
      $($row).next('tr').find('[data-flight-duration]').html($($row).data('flight-duration'));
      $($row).next('tr').find('[data-state]').html($($row).data('state')); //-console.log($($row).data('state'));			

      $($row).next('tr').find('[data-icon]').removeClass();
      $($row).next('tr').find('[data-icon]').addClass(icon);
      $($row).next('tr').find('[data-flight]').html($($row).data('flight'));
      $($row).next('tr').find('[data-airplane]').html($($row).data('airplane'));
      $($row).next('tr').find('[data-puntuality1]').html($($row).data('puntuality1'));
      $($row).next('tr').find('[data-puntuality2]').html($($row).data('puntuality2'));
      $detailBox = $row.parents('.ibe-tab__container').find('.ibe-table-flight-status__detail-box');
      deteleColors = 'ibe-table-flight-status__text--green ibe-table-flight-status__text--brown ibe-table-flight-status__text--black ibe-table-flight-status__text--grey';
      textColor = $($row).data('flight-color');
      $detailBox.find('[data-icon]').removeClass(deteleColors).addClass('ibe-table-flight-status__text--' + textColor).parent().find('[data-state]').removeClass(deteleColors).addClass('ibe-table-flight-status__text--' + textColor);
      $detailBox.find('[data-confirmed-departure-from], [data-confirmed-departure-to]').removeClass(deteleColors).addClass('ibe-table-flight-status__text--' + textColor);
      $detailBox.find('.ibe-table-flight-status__td-detail-left > .ibe-table-flight-status__text').eq(1).removeClass(deteleColors).addClass('ibe-table-flight-status__text--' + textColor);
      $detailBox.find('.ibe-table-flight-status__td-detail-left > .ibe-table-flight-status__text').eq(5).removeClass(deteleColors).addClass('ibe-table-flight-status__text--' + textColor); // FROM

      $($row).next('tr').find('[data-from]').html($($row).data('from'));
      $($row).next('tr').find('[data-scheduled-departure-responsive-from]').html($($row).data('hour-scheduled-from'));
      $($row).next('tr').find('[data-scheduled-departure-from]').html($($row).data('hour-scheduled-from'));
      $($row).next('tr').find('[data-confirmed-departure-resposive-from]').html($($row).data('confirmed-departure-from'));
      $($row).next('tr').find('[data-confirmed-departure-from]').html($($row).data('confirmed-departure-from'));
      $($row).next('tr').find('[data-terminal-responsive-from]').html($($row).data('terminal-from'));
      $($row).next('tr').find('[data-terminal-from]').html($($row).data('terminal-from'));
      $($row).next('tr').find('[data-gate-responsive-from]').html($($row).data('gate-from'));
      $($row).next('tr').find('[data-gate-from]').html($($row).data('gate-from'));

      if ($($row).data('date-departure') !== undefined && $($row).data('date-departure') !== "") {
        if (window.innerWidth < dFrontJs.resolutions.sm) {
          $($row).next('tr').find('[data-date-departure-responsive]').show();
          $($row).next('tr').find('[data-date-departure-responsive]').html($($row).data('date-departure'));
        } else {
          $($row).next('tr').find('[data-date-departure]').show();
          $($row).next('tr').find('[data-date-departure]').html($($row).data('date-departure'));
        }
      } else {
        if (window.innerWidth < dFrontJs.resolutions.sm) {
          $($row).next('tr').find('[data-date-departure-responsive]').hide();
          $($row).next('tr').find('[data-date-departure-responsive]').html('');
        } else {
          $($row).next('tr').find('[data-date-departure]').hide();
          $($row).next('tr').find('[data-date-departure]').html('');
        }
      } //- TO


      $($row).next('tr').find('[data-to]').html($($row).data('to'));
      $($row).next('tr').find('[data-scheduled-departure-responsive-to]').html($($row).data('hour-scheduled-to'));
      $($row).next('tr').find('[data-scheduled-departure-to]').html($($row).data('hour-scheduled-to'));
      $($row).next('tr').find('[data-confirmed-departure-resposive-to]').html($($row).data('confirmed-departure-to'));
      $($row).next('tr').find('[data-confirmed-departure-to]').html($($row).data('confirmed-departure-to'));
      $($row).next('tr').find('[data-terminal-responsive-to]').html($($row).data('terminal-to'));
      $($row).next('tr').find('[data-terminal-to]').html($($row).data('terminal-to'));
      $($row).next('tr').find('[data-gate-responsive-to]').html($($row).data('gate-to'));
      $($row).next('tr').find('[data-gate-to]').html($($row).data('gate-to'));

      if ($($row).data('date-arrival') !== undefined && $($row).data('date-arrival') !== "") {
        if (window.innerWidth < dFrontJs.resolutions.sm) {
          $($row).next('tr').find('[data-date-arrival-responsive]').show();
          $($row).next('tr').find('[data-date-arrival-responsive]').html($($row).data('date-arrival'));
        } else {
          $($row).next('tr').find('[data-date-arrival]').show();
          $($row).next('tr').find('[data-date-arrival]').html($($row).data('date-arrival'));
        }
      } else {
        if (window.innerWidth < dFrontJs.resolutions.sm) {
          $($row).next('tr').find('[data-date-arrival-responsive]').hide();
          $($row).next('tr').find('[data-date-arrival-responsive]').html('');
        } else {
          $($row).next('tr').find('[data-date-arrival]').hide();
          $($row).next('tr').find('[data-date-arrival]').html('');
        }
      }
    } else {
      $('.tr-active').remove();
    }
  }; //init


  var init = function (_parent) {
    var $structure,
        $tr = $('[data-flight-status-tr]', _parent),
        $close = $('[data-close-detail]', _parent);

    if (window.innerWidth < dFrontJs.resolutions.lg) {
      $structure = $('<tr class="ibe-table-flight-status__tr tr-active"><td class="ibe-table-flight-status__td--detail" colspan="6"><div class="ibe-table-flight-status__detail box-active"></div></td></tr>').hide();
    } else {
      $structure = $('<tr class="ibe-table-flight-status__tr tr-active"><td class="ibe-table-flight-status__td--detail" colspan="6"><div class="ibe-table-flight-status__detail box-active"></div></td></tr>').hide();
    }

    windowWidth = window.innerWidth;
    clearTimeout($.data(this, 'resizeInit'));
    $.data(this, 'resizeInit', setTimeout(function () {
      if (windowWidth < dFrontJs.resolutions.lg) {
        $structure = $('<tr class="ibe-table-flight-status__tr tr-active"><td class="ibe-table-flight-status__td--detail" colspan="6"><div class="ibe-table-flight-status__detail box-active"></div></td></tr>').hide();
      } else {
        $structure = $('<tr class="ibe-table-flight-status__tr tr-active"><td class="ibe-table-flight-status__td--detail" colspan="6"><div class="ibe-table-flight-status__detail box-active"></div></td></tr>').hide();
      }
    })); //console.log($close);

    $close.on('click', function (e) {
      _closeStructureDetailTable($structure);
    }); //- Call from intro

    $tr.keypress(function (e) {
      if (e.which === 13) {
        _openStructureDetailTable($structure, $(this));
      }
    }); //- Call from click

    $tr.click(function (e) {
      _openStructureDetailTable($structure, $(this));
    });
  };

  return {
    'init': init,
    '_closeStructureDetailTable': _closeStructureDetailTable
  };
}(jQuery);
"use strict";

dFrontJs.ibe_textarea = function () {
  /*eslint no-underscore-dangle: ["error", { "allow": ["_keyupTextarea"] }]*/
  var text_max = $('[data-textarea-max]').length > 0 ? $('[data-textarea]').data('textarea-max') : 1500;

  var _keyupTextarea = function () {
    var tval = $('[data-textarea]').val();
    var text_length = tval.length;
    var text_remaining = text_max - text_length;

    if (text_length <= text_max) {
      $('[data-textarea-text]').html(text_remaining);
    } else {
      $(this).val(tval.substr(0, text_max));
    }
  };

  var init = function (selector) {
    var $selector = selector !== undefined ? $(selector) : $('[data-textarea]');
    $selector.off('keyup', _keyupTextarea);
    $selector.on('keyup', _keyupTextarea);
  };

  $('[data-textarea-text]').html(text_max);
  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_tooltip = function () {
  /*eslint no-underscore-dangle: ['error', { 'allow': ['_tooltipGenericInserted', '_tooltipGenericShown', '_showTooltipGeneric', '_closeTooltipButton'] }]*/
  var initLibraryTooltip = function () {
    var $element = $('[data-tooltip="bootstrap"]');

    if ($element.length > 0) {
      $.each($element, function () {
        var $this = $(this);
        var htmlTooltip = $this.find('[data-tooltip="content"]').html();
        $this.tooltip({
          position: {
            my: 'center top',
            at: 'center bottom'
          },
          items: $this,
          content: htmlTooltip
        });
      });
    }
  };

  var _tooltipGenericInserted = function () {
    $(this).next().css('opacity', '0');
  };

  var _tooltipGenericShown = function () {
    var $this = $(this),
        distButtonL = $this.position().left,
        //distance left of button
    distTooltipL = $this.next().position().left,
        //distance left of tooltip
    wTooltip = $this.next().width(),
        $thisTooltip = $this.next(),
        leftTooltip = $thisTooltip.offset().left,
        paddingContainer = 16,
        paddingLeft,
        paddingRight;

    if ($('.ibe-box__primary').length > 0) {
      paddingLeft = parseInt($this.parents('.ibe-box__primary').css('padding-left').substr(0, 2));
      paddingRight = parseInt($this.parents('.ibe-box__primary').css('padding-right').substr(0, 2));
    } else {
      paddingLeft = parseInt($this.parents('.ibe-tab__container').css('padding-left').substr(0, 2));
      paddingRight = parseInt($this.parents('.ibe-tab__container').css('padding-right').substr(0, 2));
    }

    if (window.innerWidth < dFrontJs.resolutions.sm) {
      paddingContainer = 0;
      leftTooltip = leftTooltip - 16;
    }

    if (window.innerWidth < dFrontJs.resolutions.lg) {
      if (leftTooltip <= Math.round((window.innerWidth - $this.parents('.container').innerWidth() + paddingContainer * 2) / 2)) {
        $this.next().css({
          'left': 0
        });
        $('.arrow-desktop-tooltip-head').remove();
        $('head').append('<style class="arrow-desktop-tooltip-head">.ibe-message-tooltip--type02:before{left:' + ($this.position().left + 6) + 'px }</style>');
      } else if (distTooltipL + wTooltip + paddingLeft + paddingRight > $this.parents('.container').innerWidth()) {
        $this.next().css({
          'left': '',
          'right': 0
        });
        $('.arrow-desktop-tooltip-head').remove();
        $('head').append('<style class="arrow-desktop-tooltip-head">.ibe-message-tooltip--type02:before{left: ' + ($this.position().left - $this.next().position().left + 6) + 'px }</style>');
      } else {
        $('.arrow-desktop-tooltip-head').remove();
      }
    } else {
      $('.arrow-desktop-tooltip-head').remove();
    }

    $(this).next().css('opacity', '1');
  };

  var positionTooltip = function () {
    var $tooltipGeneric = $('[data-tooltipGeneric]');

    if ($tooltipGeneric) {
      $tooltipGeneric.off('inserted.bs.tooltip', _tooltipGenericInserted);
      $tooltipGeneric.on('inserted.bs.tooltip', _tooltipGenericInserted);
      $tooltipGeneric.off('shown.bs.tooltip', _tooltipGenericShown);
      $tooltipGeneric.on('shown.bs.tooltip', _tooltipGenericShown);
      $tooltipGeneric.tooltip({
        template: '<div class="tooltip  ibe-message-tooltip ibe-message-tooltip--type02" role="tooltip"><div class="arrow ibe-message-tooltip__button-close ibe-message__button-close--type02 icon-cerrar"></div><div class="tooltip-inner ibe-message-tooltip__inner"></div></div>',
        //html: true,
        placement: 'bottom'
      });
    }
  };

  var _showTooltipGeneric = function () {
    var $tooltip = $('.tooltip');
    $tooltip.not(this).hide();
    $tooltip.not(this).prev().blur();
  };

  var _closeTooltipButton = function () {
    $(this).parents('[data-tooltip="bootstrap"]').tooltip('hide');
  };

  var init = function () {
    var $element = $('[data-tooltip="bootstrap"]');
    var $tooltipGeneric = $('[data-tooltipGeneric]');
    var $buttonTooltip = $('[data-tooltip="close"]');
    initLibraryTooltip();
    positionTooltip(); // Only one tooltip should ever be open at a time

    $tooltipGeneric.off('show.bs.tooltip', _showTooltipGeneric);
    $tooltipGeneric.on('show.bs.tooltip', _showTooltipGeneric); //Button close

    $buttonTooltip.off('click', _closeTooltipButton);
    $buttonTooltip.on('click', _closeTooltipButton);
    $(window).resize(function (e) {
      $element.tooltip('hide');
    });
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_tweets = function () {
  var init = function (list) {
    $(list).masonry({
      itemSelector: '.ibe-tweets-wall__item',
      percentPosition: true
    }); // });
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: tweet_wall
//    Descripcion: Cargar mas tweets (novedades y noticias)
//******************************************************************************/
dFrontJs.ibe_tweet_wall = function () {
  var init = function () {
    var $tweet_wall = $('[data-tweets="wall"]');
    var n_total, n_desktop, n_mobile, $tweets_content, tweet_list_lenght, $last_tweets_content, $items, $items_clone, i, n_resolution;

    if ($tweet_wall.length > 0) {
      n_total = $('.ibe-tweets-wall__item').length;
      n_desktop = $tweet_wall.data('tweets-show-desktop');
      n_mobile = $tweet_wall.data('tweets-show-mobile'); //NEW ALL ITEMS VISIBLE

      if ($('[data-tweets-show-desktop]').data('tweetsShowDesktop') === 'all') {
        n_desktop = n_total;
      }

      if ($('[data-tweets-show-desktop]').data('tweetsShowMobile') === 'all') {
        n_mobile = n_total;
      } // END NEW ALL ITEMS VISIBLE


      n_resolution = $(window).width() < dFrontJs.resolutions.md ? n_mobile : n_desktop;
      $tweets_content = $tweet_wall.find('[data-tweets="content"]'); //all content

      tweet_list_lenght = $tweets_content.length; //list_lenght

      $last_tweets_content = $tweets_content.eq(tweet_list_lenght - 1);
      $items = $last_tweets_content.find('li:nth-child(n+' + (n_resolution + 1) + ')');
      $items_clone = $items.clone();
      $items.remove(); //Llamada a la libreria

      dFrontJs.ibe_tweets.init('[data-function="masonry"]', '[data-function="masonry"] li');
      i = 0; //Boton cargas mas tweets

      $('[data-tweets="button"]').on('click', function () {
        var $aux_item_clone, $exampleDateAjax;
        $tweets_content = $tweet_wall.find('[data-tweets="content"]'); //all content

        tweet_list_lenght = $tweets_content.length; //list_lenght

        $last_tweets_content = $tweets_content.eq(tweet_list_lenght - 1); //Numero de tweets
        //Mostrar nueva lista de tweets

        if (i < $items_clone.length) {
          $aux_item_clone = $items_clone.slice(i, i + n_resolution);
          $last_tweets_content.find('ul').append($aux_item_clone).masonry('appended', $aux_item_clone);
          i = i + n_resolution;
        } else {
          $exampleDateAjax = $('[data-tweets="new"]').html();
          $tweet_wall.append($exampleDateAjax); //

          $tweets_content = $tweet_wall.find('[data-tweets="content"]'); //all content

          tweet_list_lenght = $tweets_content.length; //list_lenght

          $last_tweets_content = $tweets_content.eq(tweet_list_lenght - 1);
          $items = $last_tweets_content.find('li:nth-child(n+' + (n_resolution + 1) + ')');
          $items_clone = $items.clone();
          $items.remove();
          dFrontJs.ibe_tweets.init('[data-function="masonry"]', '[data-function="masonry"] li');
          i = 0;
        }
      });
    }
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_uploadfile = function () {
  //Jquery ui upload
  var init = function () {
    var file = $('[data-file]');
    var files;

    if (file) {
      file.each(function () {
        var $thisItem = $(this);
        var acceptAttr = $(this).attr('accept');

        if (!$thisItem.hasClass('uploadInit')) {
          $thisItem.addClass('uploadInit');
          $thisItem.on('change', function (event) {
            var $this = $(this),
                $parent = $this.parents('.ibe-upload'),
                $list = $parent.find('[data-fileList]'),
                validatedFiles = $this.data('validatedFiles') !== undefined ? $this.data('validatedFiles') : [],
                validatedNames = $this.data('validatedNames') !== undefined ? $this.data('validatedNames') : [],
                numFiles = $this.data('numfiles') !== undefined ? $this.data('numfiles') : 3,
                sizeTotal = $this.data('sizeTotal') !== undefined ? $this.data('sizeTotal') : 0.0;
            files = event.originalEvent.target.files;
            $(files).each(function (i, thisItem) {
              var info, name, size, type, validImageTypes, validTypes, attributeValue, index, sum;
              $parent.find('[data-alert]').not('[data-alert="required"]').addClass('hidden');

              if (validatedFiles.length < numFiles) {
                info = $this[0].files[i];
                name = info.name;
                size = (info.size / 1000000).toPrecision(2);
                type = info.type;
                validImageTypes = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
                validTypes = [];
                attributeValue = acceptAttr.split(','); //[.jpg,.png,.xls...]

                for (index = 0; index < attributeValue.length; index++) {
                  switch (attributeValue[index]) {
                    case '.gif':
                      validTypes.push(validImageTypes[0]);
                      break;

                    case '.jpeg':
                      validTypes.push(validImageTypes[1]);
                      break;

                    case '.jpg':
                      validTypes.push(validImageTypes[1]);
                      break;

                    case '.png':
                      validTypes.push(validImageTypes[3]);
                      break;

                    case '.pdf':
                      validTypes.push(validImageTypes[4]);
                      break;

                    case '.doc':
                      validTypes.push(validImageTypes[5]);
                      break;

                    case '.docx':
                      validTypes.push(validImageTypes[6]);
                      break;

                    case '.xlsx':
                      validTypes.push(validImageTypes[7]);
                      break;

                    case '.xls':
                      validTypes.push(validImageTypes[8]);
                      break;
                  }
                }

                if ($.inArray(type, validTypes) >= 0) {
                  if ($.inArray(name, validatedNames) < 0) {
                    sum = sizeTotal + parseFloat(size);

                    if (sum < 5) {
                      $list.append('<li class="ibe-list--files__item"> <p> <span class="ibe-list--files__text">' + name + '</span><span class="ibe-list--files__text ibe-list--files__text--grey">(' + size + 'MB' + ')</span></p> <a href="#" title="Eliminar" class="icon-cerrar ibe-list--files__link" data-fileClose>Eliminar</a></li>');
                      validatedFiles.push(thisItem);
                      validatedNames.push(name); // Simplest case

                      sizeTotal += parseFloat(size);

                      if (validatedFiles.length > 0) {
                        $this.closest('.ibe_form__group').removeClass('ibe_form__group--error');
                        $this.closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
                      } else {
                        $this.closest('.ibe_form__group').addClass('ibe_form__group--error');
                        $this.closest('.ibe_form__group').find('[data-validate="exist"]').removeClass('hidden');
                      }
                    } else {
                      $list.parent().find('[data-alert="size"]').removeClass('hidden');
                    }
                  } else {
                    $list.parent().find('[data-alert="same"]').removeClass('hidden');
                  }
                } else {
                  $list.parent().find('[data-alert="type"]').removeClass('hidden');
                }
              } else {
                $list.parent().find('[data-alert="files"]').removeClass('hidden');
              }
            }); //Remove item List

            $('[data-fileClose]').click(function () {
              var $parent = $(this).parents('.ibe-upload');
              var name, $thisElement, positionItem, positionItem2;
              $(this).parents('[data-fileList]').parent().find('[data-alert="same"]').addClass('hidden');
              $(this).parents('[data-fileList]').parent().find('[data-alert="files"]').addClass('hidden');
              name = $(this).parent().find('.ibe-list--files__text').first().text();
              $thisElement = $(this).parent();
              $(validatedFiles).each(function (i, file) {
                if (file.name === name) {
                  positionItem = validatedFiles.indexOf(file);
                  positionItem2 = validatedNames.indexOf(name);
                  validatedFiles.splice(positionItem, 1); // Simplest case

                  validatedNames.splice(positionItem2, 1); // Simplest case

                  $thisElement.remove();
                  sizeTotal = sizeTotal - parseFloat((file.size / 1000000).toPrecision(2));
                  $this.data('sizeTotal', $this.data('sizeTotal') - parseFloat((file.size / 1000000).toPrecision(2)));
                }

                if (validatedFiles.length > 0) {
                  $parent.find('.ibe_form__group').removeClass('ibe_form__group--error');
                  $parent.find('.ibe_form__group [data-validate="exist"]').addClass('hidden');
                } else {
                  $parent.find('.ibe_form__group').addClass('ibe_form__group--error');
                  $parent.find('.ibe_form__group [data-validate="exist"]').removeClass('hidden');
                }
              });
            }); //Empty val input

            $(this).val('');
            $this.data('validatedFiles', validatedFiles);
            $this.data('validatedNames', validatedNames);
            $this.data('sizeTotal', sizeTotal);
          });
        }
      });
    }
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

/*
 Validation for forms.
*/

/*eslint no-underscore-dangle: ["error", { "allow": ["_oneWayWarranty", "_roundtripWarranty"] }]*/
dFrontJs.ibe_validate = function () {
  var dateParser = function (date, format) {
    var dateParts = date.split('/');

    if (format === 'DD/MM/YYYY') {
      return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    }

    return new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
  };

  var clearAllErrors = function (value) {
    value.closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate]').addClass('hidden');
  };

  var isFormatValid = function (valor) {
    valor.closest('.ibe_form__group').has('[data-validate="valid"]:visible').removeClass('ibe_form__group--error').find('[data-validate="valid"]').addClass('hidden');
  };

  var noFormatValid = function (valor) {
    clearAllErrors(valor);
    valor.closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
      $(this).removeClass('hidden');
      $(this).html($(this).data('validate-text'));
    });
  };

  var compareCity = function (input, ori, des) {
    var searcher = input !== undefined ? $(input).parents('.ibe_form') : $('input[name*=_origin]').parents('.ibe_form');
    var origin = ori !== undefined ? ori : searcher.find('input[name*=_origin]');
    var destiny = des !== undefined ? des : searcher.find('input[name*=_destiny]');

    if (origin.val() === destiny.val()) {
      input.closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="equal"]').each(function () {
        $(this).removeClass('hidden');
        $(this).html($(this).data('validate-text'));
      });
    } else {
      input.parents('.ibe_form__group').parent().parent().find('.ibe_form__group').each(function () {
        $(this).removeClass('ibe_form__group--error');
        $(this).find('[data-validate="equal"]').addClass('hidden');
      });
    }
  };

  var valid_luhn_algorithm = function (value) {
    var nCheck = 0,
        nDigit = 0,
        bEven = false,
        n,
        cDigit; // accept only digits, dashes or spaces

    if (/[^0-9-\s]+/.test(value)) return false;
    if (parseInt(value) === 0) return false; // The Luhn Algorithm. It's so pretty.

    value = value.replace(/\D/g, '');

    for (n = value.length - 1; n >= 0; n--) {
      cDigit = value.charAt(n);
      nDigit = parseInt(cDigit, 10);

      if (bEven) {
        if ((nDigit *= 2) > 9) nDigit -= 9;
      }

      nCheck += nDigit;
      bEven = !bEven;
    }

    return nCheck % 10 === 0;
  };

  var formatTicket = function (event) {
    var aKey = 65,
        cKey = 67,
        vKey = 86,
        key = event.keyCode || event.which,
        num = event.target.value,
        pattern = /^\d{3}-\d{10}$/;
    if (key === 8 || key === 9 || key === 46) return true;

    if (key !== 222 && (key >= 48 && key <= 57 || key >= 96 && key <= 105 || key >= 35 && key <= 40 || key === aKey && event.ctrlKey || key === vKey && event.ctrlKey || key === cKey && event.ctrlKey)) {
      if (num.length === 3) {
        if (num.split('-').length <= 1) {
          num = num.replace(num, num.substr(0, 3) + '-' + num.substr(3, num.length));
        }
      }

      if (num.length > 3) {
        if (num.split('-').length <= 1) {
          num = num.replace(num, num.substr(0, 3) + '-' + num.substr(3, num.length));
        }
      }

      if (num.split('-').length <= 1 && key === vKey && event.ctrlKey && num.length > 3) {
        num = num.replace(num, num.substr(0, 3) + '-' + num.substr(3, num.length));
      }

      if (num.length > 14) {
        event.target.value = num.substr(0, 14);
      } else {
        event.target.value = num;
      }
    } else {
      return false;
    }

    if (event.type === 'keyup' && key === vKey && event.ctrlKey) {
      setTimeout(function () {
        if (pattern.test(num) === false) {
          event.target.value = '';
          num = '';
        }
      }, 200);
    }
  };

  var numFlight = function (input) {
    var airlines;
    input = input !== undefined ? $(input) : $('[data-isotipo]:visible');
    airlines = input.parents('[data-airlines]').data('airlines');

    if (input.length > 0) {
      if (input.val().match(new RegExp('^(' + airlines + ')([0-9]+)$', 'i')) && input.val().length >= 3 && input.val().length < 7) {
        isFormatValid(input);
      } else {
        noFormatValid(input);
      }
    }
  };
  /*Event to validate username for onbusiness login form, it shows a "not valid format" error
  *	Params
  *		regex: Regex of chars that are allowed
  */


  var keyBlockandCleanOB = function (event) {
    var keyVal,
        removeRegex,
        regex,
        val,
        self = $(this);
    regex = new RegExp(event.data.regex); //keyVal = event.keyCode || event.which;

    keyVal = $('.user-login-OB').val();

    if (!regex.test(keyVal)) {
      $('.user-login-OB').closest(".ibe_form__group").find('.ibe_form__msg-info').addClass("hidden");
      $('.user-login-OB').closest(".ibe_form__group").addClass("ibe_form__group--error");
      let errorSpan = $('.user-login-OB').closest(".ibe_form__group").find('[data-validate="valid"]');
      errorSpan.html(errorSpan.data("validate-text")).removeClass("hidden");
      errorSpan.removeClass("hidden");
    } else {
      $('.user-login-OB').closest(".ibe_form__group").removeClass("ibe_form__group--error");
      $('.user-login-OB').closest(".ibe_form__group").find('.ibe_form__msg-info').addClass("hidden");
    }
  };
  /*Event that filters whch letters cand be written and remove not allowed when paste 
  *	receives two regex on event data 
  *		removeRegex Regex of chars that must be removed
  *		regex: Regex of chars that are allowed
  */


  var keyBlockandClean = function (event) {
    var keyVal,
        removeRegex,
        regex,
        val,
        self = $(this);

    if (event && event.data) {
      keyVal = event.keyCode || event.which;
      keyVal = String.fromCharCode(keyVal);

      if (event.data.removeRegex && event.type !== 'keypress') {
        setTimeout(function () {
          removeRegex = new RegExp(event.data.removeRegex);
          val = self.val();
          val = val.replaceAll(removeRegex, '');
          self.val(val);
        }, 50);
      } else {
        regex = new RegExp(event.data.regex);
        return regex.test(keyVal);
      }
    }

    return true;
  };

  var pnrTKTKeyFilter = function (evt) {
    var keyVal,
        self = $(this),
        event = evt,
        val = self.val();
    keyVal = event.originalEvent.key;

    if (val.length > 0 && val.length <= 6 && /[a-zA-Z]{1,6}/.test(val)) {
      self.attr('maxlength', 6);
    } else {
      self.attr('maxlength', 14);
    }

    event.data = {
      regex: /[a-z0-9\-]/gi,
      removeRegex: /[^a-z0-9\-]/gi
    };
    return keyBlockandClean.call(this, event);
  };

  var keyupValidation = function () {
    var val = $(this).val();

    if ($(this).data('validator') === 'pnr-tkt') {
      if (val && val.length > 0) {
        if (/(^[a-zA-Z0-9]{0,6}$)|(^[0-9]{03}[- ]?[0-9]{0,10}$)/.test($(this).val())) {
          isFormatValid($(this));
        } else {
          noFormatValid($(this));
        }
      } else if (!$(this).val() && !$(this).attr('required')) {
        clearAllErrors($(this));
      }
    }
  };

  var init = function () {
    var inputTicket = $('[data-format="ticket"]');
    var inputTktPnr = $('[data-format="pnr-tkt"]');
    var inputpersonal = $('[data-format="personal"]');
    var validRequired = $('[data-valid-form] [required]');
    var inputUserOB = $('[data-format="user-onbusiness"]'); //Added keydown for android compatibility

    inputTicket.off('keydown keyup', formatTicket);
    inputTktPnr.off('keypress keydown  paste', pnrTKTKeyFilter);
    inputpersonal.off('keypress keydown paste', keyBlockandClean);
    inputTicket.on('keydown keyup', formatTicket);
    inputTktPnr.on('keypress keydown paste', {
      regex: /[a-z0-9\-]/gi,
      removeRegex: /[^a-z0-9\-]/gi
    }, pnrTKTKeyFilter);
    inputpersonal.on('keypress keydown paste', {
      regex: /^(?!.*[0-9*¡!?¿<>\\\\ºª|/\·@#$%&,;=?¿())_¬+{}\[\]"~\^€$£])/gi,
      removeRegex: /[0-9*¡!?¿<>\\ºª|/\·@#$%&,;=?¿())_+~¬{}\[\]"\^€$£]/gi
    }, keyBlockandClean);
    validRequired.off('keyup', keyupValidation);
    validRequired.on('keyup', keyupValidation);
    inputUserOB.off('keypress keydown paste');
    inputUserOB.on('keyup paste', {
      regex: /^[a-zA-Z0-9\-_.'@]*$/gi
    }, keyBlockandCleanOB);

    if ($('[data-valid-form] [required][data-validator="file"]').length > 0) {
      $('[data-valid-form] [required][data-validator="file"]').closest('.ibe_form__group').find('[data-validate="exist"]').each(function () {
        $(this).html($(this).data('validate-text'));
      });
    }

    validRequired.focusout(function (e) {
      var $this = $(this);
      var pattern, expression, regex, t, nif, fecha, format, arrF, group, flight, dataDayCalendar, re, formatCal, cadena, airlines, validatePinLength, num, sum, uni, c, date2, fechaCalendar, rangeMin, rangeMax, dateRestriction, datepickerGeneral, dataHour, dataNumDays, splitDate, dateSelected, oneDay, dateNow, diffDays, sum, number;

      if (!$(this).val() && $(this).data('validator') !== 'file' && $(this).prop('type') !== 'checkbox') {
        if (!(e.relatedTarget !== null && e.relatedTarget.closest('.ibe_form__group'))) {
          // Remove all error message (when data-validate attr aren't input)
          $(this).closest('.ibe_form__group').find('[data-validate]:not("input")').addClass('hidden');
          $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="exist"]').each(function () {
            $(this).removeClass('hidden');
            $(this).html($(this).data('validate-text'));
          });
        }
      } else if ($(this).data('validator') !== 'file') {
        $(this).closest('.ibe_form__group').has('[data-validate="exist"]:visible').removeClass('ibe_form__group--error').find('[data-validate="exist"]').addClass('hidden');

        if ($(this).data('validator') === 'PIR') {
          if ($(this).val().match('[a-zA-Z]{5}[0-9]{5}') && $(this).val().length === 10) {
            isFormatValid($(this));
          } else {
            noFormatValid($(this));
          }
        } else if ($(this).data('validator') === 'cod-ticket') {
          cadena = $(this).val();

          if ($(this).val().match('^[0-9-]*$') && cadena.indexOf('075-') > -1 && $(this).val().length === 14) {
            isFormatValid($(this));
          } else {
            noFormatValid($(this));
          }
        } else if ($(this).data('validator') === 'numflight') {
          numFlight($(this));
        } else if ($(this).data('validator') === 'code') {
          if ($(this).val().match('^[a-zA-Z0-9]*$') && $(this).val().length > 4 && $(this).val().length < 7) {
            isFormatValid($(this));
          } else {
            noFormatValid($(this));
          }
        } else if ($(this).data('validator') === 'ibePlus' && $(this).val().length > 0) {
          if (valid_luhn_algorithm($(this).val())) {
            isFormatValid($(this));
          } else {
            pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

            if (pattern.test($(this).val()) === true) {
              isFormatValid($(this));
            } else {
              noFormatValid($(this));
            }
          }
        } else if ($(this).data('validator') === 'onBusiness' && $(this).val().length > 0) {
          if (!$(this).val().match('^OB[0-9-]{8}$')) {
            noFormatValid($(this));
          } else {
            sum = 0;
            number = $(this).val();

            for (i = 2; i < number.length - 1; i++) {
              sum = sum + parseInt(number.charAt(i));
            }

            result = sum % 7 === parseInt(number.charAt(number.length - 1));

            if (result) {
              isFormatValid($(this));
            } else {
              noFormatValid($(this));
            }
          }
        } else if ($(this).data('validator') === 'pin' && $(this).val().length > 0) {
          var globalPattern = /^((?!.*[\s])(.){6,20})$/gm;

          if (globalPattern.test($(this).val())) {
            isFormatValid($(this));
          } else {
            noFormatValid($(this));
          }
        } else if ($(this).data('validator') === 'ticket') {
          if ($(this).val().match('^[0-9]*$') && $(this).val().length === 13 || $(this).val().match('^[0-9]+( |-[0-9])*[0-9]+$') && $(this).val().length === 14) {
            isFormatValid($(this));
          } else {
            noFormatValid($(this));
          }
        } else if ($(this).data('validator') === 'tel') {
          if ($(this).val()) {
            expression = /(^[+][0-9 ]+$)|(^[0-9 ]{8,30}$)/;
            regex = new RegExp(expression);
            t = $(this).val();

            if (t.match(regex)) {
              $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate]').addClass('hidden');
            } else {
              $(this).closest('.ibe_form__group').find('[data-validate]').addClass('hidden'); //remove all error messages for show only 1

              if (isNaN(t)) {
                // if not number
                $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="letter"]').each(function () {
                  $(this).removeClass('hidden');
                  $(this).html($(this).data('validate-text'));
                });
              } else {
                noFormatValid($(this));
              }
            }
          } // if (/.test($(this).val()) && $(this).val().length > 1 && $(this).val().length <= 20 ) {

        } else if ($(this).data('validator') === 'cod-postal') {
          if (/^[0-9 ]*$/.test($(this).val()) && $(this).val().length === 5) {
            isFormatValid($(this));
          } else {
            noFormatValid($(this));
          }
        } else if ($(this).data('validator') === 'price') {
          if ($(this).val().match('^[0-9 a-zA-Z,.€$£¥]*$')) {
            isFormatValid($(this));
          } else {
            noFormatValid($(this));
          }
        } else if ($(this).data('validator') === 'plus') {
          if ($(this).val()) {
            if (/^[0-9]*$/.test($(this).val()) && $(this).val().length > 7 && $(this).val().length < 13) {
              isFormatValid($(this));
            } else {
              noFormatValid($(this));
            }
          }
        } else if ($(this).data('validator') === 'nif-cif') {
          nif = $(this).val().toUpperCase().replace(/[\s\-]+/g, '');

          if (/^(\d|[XYZ])\d{7}[A-Z]$/.test(nif)) {
            num = nif.match(/\d+/);
            num = (nif[0] !== 'Z' ? nif[0] !== 'Y' ? 0 : 1 : 2) + num;

            if (nif[8] === 'TRWAGMYFPDXBNJZSQVHLCKE'[num % 23]) {
              //return /^\d/.test(nif)? 'DNI': 'NIE';
              $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="valid"]').addClass('hidden');
            }
          } else if (/^[ABCDEFGHJKLMNPQRSUVW]\d{7}[\dA-J]$/.test(nif)) {
            for (sum = 0, i = 1; i < 8; ++i) {
              num = nif[i] << i % 2;
              uni = num % 10;
              sum += (num - uni) / 10 + uni;
            }

            c = (10 - sum % 10) % 10;

            if (nif[8] === c || nif[8] === 'JABCDEFGHI'[c]) {
              //return /^[KLM]/.test(nif)? 'ESP': 'CIF';
              $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="valid"]').addClass('hidden');
            }
          } else {
            $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
              $(this).removeClass('hidden');
              $(this).html($(this).data('validate-text'));
            });
            $(this).closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
          }
        } else if ($(this).data('validator') === 'mail') {
          pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;

          if ($this.val() && pattern.test($this.val()) === true) {
            isFormatValid($this);
          } else {
            noFormatValid($this);
          }
        } else if ($(this).data('validator') === 'mail-repeat') {
          if ($(this).data('different') !== undefined) {
            if ($(this).val() !== $(this).closest('.row').prev().find('input[type=text]').val()) {
              $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="different"]').each(function () {
                $(this).removeClass('hidden');
                $(this).html($(this).data('validate-text'));
              });
              $(this).closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
            } else {
              $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="different"]').addClass('hidden');
            }
          }
        } else if ($(this).data('validator') === 'personal') {
          if ($(this).val()) {
            if (/^(?!.*[0-9*¡!?¿<>\\\\ºª|/\·@#$%&,;=?¿())_¬+{}\[\]"~\^€$£])/.test($(this).val()) && $(this).val().length <= 30) {
              isFormatValid($(this));
            } else {
              noFormatValid($(this));
            }
          } else if (!$(this).val() && !$(this).attr('required')) {
            clearAllErrors($(this));
          }
        } else if ($(this).data('validator') === 'flight') {
          if ($(this).val().match('[a-zA-Z]{2}[0-9]{1,4}$')) {
            isFormatValid($(this));
          } else {
            noFormatValid($(this));
          }
        } else if ($(this).data('validator') === 'partner') {
          if ($(this).val().match('^[0-9]*$') && $(this).val().length === 8) {
            isFormatValid($(this));
          } else {
            noFormatValid($(this));
          }
        } else if ($(this).data('validator') === 'url') {
          expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;
          regex = new RegExp(expression);
          t = $(this).val();

          if (t.match(regex)) {
            $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="valid"]').addClass('hidden');
          } else {
            $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
              $(this).removeClass('hidden');
              $(this).html($(this).data('validate-text'));
            });
          }
        } else if ($(this).data('validator') === 'date') {
          //Take de value and convert to an array
          fecha = $(this).val();
          format = $(this).data('format');
          arrF = fecha.split('/'); //Change the position of the array to MM/DD/AAAAA
          //fecha = arrF[1] + '/' + arrF[0] + '/' + arrF[2];

          if (format === 'DD/MM/YYYY') {
            re = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
          } else {
            re = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
          }

          if (re.test(fecha)) {
            isFormatValid($(this));
            $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error');
          } else {
            noFormatValid($(this));
          }
        } else if ($(this).data('validator') === 'date-valid') {
          //Take de value and convert to an array
          fecha = $(this).val();
          group = $('.ibe_form__group');
          format = $(this).data('format');
          flight = $(this).data('flight');
          dataDayCalendar = group.find('[data-hour-restriction]');

          if (format === 'DD/MM/YYYY') {
            re = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
            formatCal = 'dd/mm/yy';
          } else {
            re = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
            formatCal = 'mm/dd/yy';
          }

          if (re.test(fecha)) {
            if (flight === 'start') {
              date2 = $('.ibe_form__group').find('[data-flight="return"]').val();

              if (date2 !== "") {
                if ($.datepicker.parseDate(formatCal, date2) < $.datepicker.parseDate(formatCal, fecha)) {
                  clearAllErrors($(this));
                  $(this).closest('.ibe-datepicker-general').addClass('ibe_form__group--error').find('[data-validate="range-return"]').each(function () {
                    $(this).removeClass('hidden');
                    $(this).html($(this).data('validate-text'));
                  });
                  return false;
                } // else


                $('.ibe-datepicker-general').find('[data-validate="range-return"]').addClass('hidden');
                $('.ibe-datepicker-general').find('[data-validate="range-go"]').addClass('hidden');
                isFormatValid($(this));
                $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error');
                $('.ibe-datepicker-general').find('[data-validate="range-go"]').closest('.ibe_form__group').removeClass('ibe_form__group--error');
              }
            } else {
              date2 = $('.ibe_form__group').find('[data-flight="start"]').val();

              if (date2 !== "") {
                if ($.datepicker.parseDate(formatCal, date2) > $.datepicker.parseDate(formatCal, fecha)) {
                  clearAllErrors($(this));
                  $(this).closest('.ibe-datepicker-general').addClass('ibe_form__group--error').find('[data-validate="range-go"]').each(function () {
                    $(this).removeClass('hidden');
                    $(this).html($(this).data('validate-text'));
                  });
                } else {
                  isFormatValid($(this));

                  if ($('.ibe-datepicker-general').find('[data-validate="range-return"]').is(':visible')) {
                    $('.ibe-datepicker-general').find('[data-validate="range-return"]').addClass('hidden');
                    $('.ibe-datepicker-general').find('[data-validate="range-return"]').closest('.ibe_form__group').removeClass('ibe_form__group--error');
                  }

                  $('.ibe-datepicker-general').find('[data-validate="range-go"]').addClass('hidden');
                  $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error');
                }
              }
            }

            if (dataDayCalendar.length > 0 && $(this).val() !== "") {
              dateRestriction = new Date();
              datepickerGeneral = $(this).closest('.ibe-datepicker-general');
              dataHour = parseInt(dataDayCalendar.eq(0).data()['hourRestriction']);
              dateRestriction.setMilliseconds(dataHour * 60 * 60 * 1000); //Horas por segundos/hora

              dateRestriction.setHours(0);
              dateRestriction.setMinutes(0);
              dateRestriction.setSeconds(0);
              dataNumDays = dataDayCalendar.length ? parseInt(dataDayCalendar.eq(0).data()['hourRestriction']) : 0;

              if (dataNumDays > 0 && dateParser(fecha, format).getTime() < dateRestriction) {
                clearAllErrors($(this));
                datepickerGeneral.addClass('ibe_form__group--error').find('[data-validate="restriction"]').each(function () {
                  $(this).removeClass('hidden');
                  $(this).html($(this).data('validate-text'));
                });
              } else {
                isFormatValid($(this));

                if ($(this).closest('.ibe_form__group').find('[data-validate="restriction"]').is(':visible')) {
                  $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="restriction"]').addClass('hidden');
                }
              }
            }
          } else {
            //noFormatValid($(this));
            clearAllErrors($(this));
            $(this).closest('.ibe_form__group').find('[data-validate]').html('');
            $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
              $(this).removeClass('hidden');
              $(this).html($(this).data('validate-text'));
            });
            $(this).closest('.ibe_form__group').find('[data-validate="range-go"]').addClass('hidden');
            $(this).closest('.ibe_form__group').find('[data-validate="range-return"]').addClass('hidden');
          }
        } else if ($(this).data('validator') === 'pnr-tkt') {
          if ($(this).val()) {
            if (/(^[a-zA-Z0-9]{5,6}$)|(^[0-9]{3}[- ]?[0-9]{10}$)|(^[0-9]{16}$)/.test($(this).val())) {
              isFormatValid($(this));
            } else {
              noFormatValid($(this));
            }
          } else if (!$(this).val() && !$(this).attr('required')) {
            clearAllErrors($(this));
          }
        }

        if ($(this).data('validator-range') === 'range-custom') {
          // Check that the date is between a range of days
          fechaCalendar = $(this).val();
          format = $(this).data('format');
          rangeMin = $(this).data('range-min');
          rangeMax = $(this).data('range-max');

          if (format === 'DD/MM/YYYY') {
            re = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
          } else {
            re = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
          }

          if (re.test(fechaCalendar)) {
            splitDate = fechaCalendar.split('/');

            if (format === 'DD/MM/YYYY') {
              dateSelected = new Date(splitDate[2], splitDate[1] - 1, splitDate[0]);
            } else {
              dateSelected = new Date(splitDate[2], splitDate[0] - 1, splitDate[1]);
            }

            oneDay = 24 * 60 * 60 * 1000;
            dateNow = new Date();
            dateNow.setHours(0, 0, 0, 0);
            diffDays = Math.round(Math.abs(dateSelected.getTime() - dateNow.getTime()) / oneDay);

            if (dateNow > dateSelected) {
              if (diffDays <= parseInt(rangeMin)) {
                $('.ibe-datepicker-general').find('[data-validate="range-min"]').addClass('hidden');
                $('.ibe-datepicker-general').find('[data-validate="range-max"]').addClass('hidden');
                isFormatValid($(this));
                $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error');
              } else {
                $('.ibe-datepicker-general').find('[data-validate="range-max"]').addClass('hidden');
                $(this).closest('.ibe-datepicker-general').addClass('ibe_form__group--error').find('[data-validate="range-min"]').each(function () {
                  $(this).removeClass('hidden');
                  $(this).html($(this).data('validate-text'));
                });
              }
            } else {
              if (diffDays <= parseInt(rangeMax)) {
                $('.ibe-datepicker-general').find('[data-validate="range-min"]').addClass('hidden');
                $('.ibe-datepicker-general').find('[data-validate="range-max"]').addClass('hidden');
                $(this).closest('.ibe-datepicker-general').removeClass('ibe_form__group--error');
                isFormatValid($(this));
              } else {
                $('.ibe-datepicker-general').find('[data-validate="range-min"]').addClass('hidden');
                $(this).closest('.ibe-datepicker-general').addClass('ibe_form__group--error').find('[data-validate="range-max"]').each(function () {
                  $(this).removeClass('hidden');
                  $(this).html($(this).data('validate-text'));
                });
              }
            }
          }
        }
      }

      function isFormatValid(valor) {
        valor.closest('.ibe_form__group').has('[data-validate="valid"]:visible').removeClass('ibe_form__group--error').find('[data-validate="valid"]').addClass('hidden');
      }

      function noFormatValid(valor) {
        clearAllErrors(valor);
        valor.closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
          $(this).removeClass('hidden');
          $(this).html($(this).data('validate-text'));
        });
      }
    });
    $('[data-valid-form] input:not([required])').focusout(function () {
      var nif, num, sum, uni, c, pattern, expression, regex, t, validatePinLength, airlines;

      if ($(this).data('validator') === 'plus') {
        if ($(this).val()) {
          if (/^[0-9]*$/.test($(this).val()) && $(this).val().length > 7 && $(this).val().length < 13) {
            $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="valid"]').addClass('hidden');
          } else {
            $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
              $(this).removeClass('hidden');
              $(this).html($(this).data('validate-text'));
            });
            $(this).closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
          }
        } else if (!$(this).val() && !$(this).attr('required')) {
          clearAllErrors($(this));
        }
      } else if ($(this).data('validator') === 'nif') {
        nif = $(this).val().toUpperCase().replace(/[\s\-]+/g, '');

        if (/^(\d|[XYZ])\d{7}[A-Z]$/.test(nif)) {
          num = nif.match(/\d+/);
          num = (nif[0] !== 'Z' ? nif[0] !== 'Y' ? 0 : 1 : 2) + num;

          if (nif[8] === 'TRWAGMYFPDXBNJZSQVHLCKE'[num % 23]) {
            //return /^\d/.test(nif)? 'DNI': 'NIE';
            $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="valid"]').addClass('hidden');
          }
        } else if (/^[ABCDEFGHJKLMNPQRSUVW]\d{7}[\dA-J]$/.test(nif)) {
          for (sum = 0, i = 1; i < 8; ++i) {
            num = nif[i] << i % 2;
            uni = num % 10;
            sum += (num - uni) / 10 + uni;
          }

          c = (10 - sum % 10) % 10;

          if (nif[8] === c || nif[8] === 'JABCDEFGHI'[c]) {
            //return /^[KLM]/.test(nif)? 'ESP': 'CIF';
            $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="valid"]').addClass('hidden');
          }
        } else {
          $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
            $(this).removeClass('hidden');
            $(this).html($(this).data('validate-text'));
          });
          $(this).closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
        }
      } else if ($(this).data('validator') === 'mail') {
        if ($(this).val()) {
          pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;

          if (pattern.test($(this).val()) === true) {
            $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="valid"]').addClass('hidden');

            if ($(this).data('different') !== undefined) {
              if ($(this).val() !== $(this).closest('.row').prev().find('input[type=text]').val()) {
                $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="different"]').each(function () {
                  $(this).removeClass('hidden');
                  $(this).html($(this).data('validate-text'));
                });
                $(this).closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
              } else {
                $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="different"]').addClass('hidden');
              }
            }
          } else {
            $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
              $(this).removeClass('hidden');
              $(this).html($(this).data('validate-text'));
            });
            $(this).closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
          }
        } else if (!$(this).val() && !$(this).attr('required')) {
          clearAllErrors($(this));
        }
      } else if ($(this).data('validator') === 'personal') {
        if ($(this).val()) {
          if (/^(?!.*[0-9*¡!?¿<>\\\\ºª|/\·@#$%&,;=?¿())_¬+{}\[\]"~\^€$£])/.test($(this).val()) && $(this).val().length <= 30) {
            isFormatValid($(this));
          } else {
            noFormatValid($(this));
          }
        } else if (!$(this).val() && !$(this).attr('required')) {
          clearAllErrors($(this));
        }
      } else if ($(this).data('validator') === 'tel') {
        if ($(this).val()) {
          expression = /(^[+][0-9 ]+$)|(^[0-9 ]{8,30}$)/;
          regex = new RegExp(expression);
          t = $(this).val();

          if (t.match(regex)) {
            $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate]').addClass('hidden');
          } else {
            $(this).closest('.ibe_form__group').find('[data-validate]').addClass('hidden'); //remove all error messages for show only 1

            if (isNaN(t)) {
              // if not number
              $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="letter"]').each(function () {
                $(this).removeClass('hidden');
                $(this).html($(this).data('validate-text'));
              });
            } else {
              noFormatValid($(this));
            }
          }
        } else if (!$(this).val() && !$(this).attr('required')) {
          clearAllErrors($(this));
        }
      } else if ($(this).data('validator') === 'cod-postal') {
        if ($(this).val()) {
          if (/^[0-9]*$/.test($(this).val()) && $(this).val().length === 5) {
            isFormatValid($(this));
          } else {
            noFormatValid($(this));
          }
        } else if (!$(this).val() && !$(this).attr('required')) {
          clearAllErrors($(this));
        }
      } else if ($(this).data('validator') === 'ibePlus') {
        if ($(this).val().length > 0) {
          if (valid_luhn_algorithm($(this).val())) {
            $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="valid"]').addClass('hidden');
          } else {
            pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

            if (pattern.test($(this).val()) === true) {
              $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="valid"]').addClass('hidden');
            } else {
              $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
                $(this).removeClass('hidden');
                $(this).html($(this).data('validate-text'));
              });
            }
          }
        } else {
          clearAllErrors($(this));
        }
      } else if ($(this).data('validator') === 'pin' && $(this).val().length > 0) {
        var globalPattern = /^((?!.*[\s])(.){6,20})$/gm;

        if (globalPattern.test($(this).val())) {
          $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="valid"]').addClass('hidden');
        } else {
          $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
            $(this).removeClass('hidden');
            $(this).html($(this).data('validate-text'));
          });
        }
      } else if ($(this).data('validator') === 'numflight') {
        numFlight($(this));
      } else if ($(this).data('validator') === 'code') {
        if ($(this).val()) {
          if ($(this).val().match('^[a-zA-Z0-9_]*$') && $(this).val().length > 4 && $(this).val().length < 7) {
            $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="valid"]').addClass('hidden');
          } else {
            $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
              $(this).removeClass('hidden');
              $(this).html($(this).data('validate-text'));
            });
            $(this).closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
          }
        } else if (!$(this).val() && !$(this).attr('required')) {
          clearAllErrors($(this));
        }
      } else if ($(this).data('validator') === 'pnr-tkt') {
        if ($(this).val()) {
          if (/(^[a-zA-Z0-9]{5,6}$)|(^[0-9]{3}[- ]?[0-9]{10}$)|(^[0-9]{16}$)/.test($(this).val())) {
            isFormatValid($(this));
          } else {
            noFormatValid($(this));
          }
        } else if (!$(this).val() && !$(this).attr('required')) {
          clearAllErrors($(this));
        }
      }
    });
    $('[data-valid-form]').find('input[data-validator="date"]').each(function () {
      $(this).on('keydown', function (e) {
        var key = e.key,
            newDate,
            iDate;

        if (key === undefined || key === 'Unidentified') {
          key = String.fromCharCode(e.keyCode);
        }

        if (key === 'Backspace' || key === 'Delete') {
          $(this).closest('.fc_form_group').find('.collapse.in').collapse('hide');
        }

        if (!isNaN(key) || key === '/') {
          newDate = $(this).val().substr(0, e.target.selectionStart) + key + $(this).val().substr(e.target.selectionStart, $(this).val().length);
          iDate = checkPartialDate(newDate, $(this).data('format'));

          switch (iDate) {
            case true:
              $(this).val(newDate);
              break;

            case false:
              if (e.target.selectionStart < $(this).val().length) {
                iDate = checkPartialDate($(this).val().substr(0, e.target.selectionStart) + key, $(this).data('format'));

                switch (iDate) {
                  case true:
                    $(this).val($(this).val().substr(0, e.target.selectionStart) + key);
                    break;

                  case false:
                    break;

                  default:
                    $(this).val(iDate);
                }
              }

              break;

            default:
              $(this).val(iDate);
          }
        }

        if (key !== 'Backspace' && key !== 'Delete' && key !== 'Tab' && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 38 && e.keyCode !== 39 && e.keyCode !== 40) {
          e.preventDefault();
        }
      });
    }); //Function for checkbox for oneway and roundtrip

    $('[data-oneway]').off('click', _oneWayWarranty);
    $('[data-oneway]').on('click', _oneWayWarranty);
    $('[data-roundtrip]').off('click', _roundtripWarranty);
    $('[data-roundtrip]').on('click', _roundtripWarranty);
  };

  var nocopyPaste = function () {
    // NO copy paste in imputs text
    $('[data-no-paste]').on('paste', function (e) {
      e.preventDefault(); //-alert('Esta acción está prohibida');
    });
    $('[data-no-copy]').on('copy', function (e) {
      e.preventDefault(); //-alert('Esta acción está prohibida');
    });
  };

  var _oneWayWarranty = function () {
    if ($(this).is(':checked')) {
      $('[data-cal-end]').parent().hide();
    }
  };

  var _roundtripWarranty = function () {
    if ($(this).is(':checked')) {
      $('[data-cal-end]').parent().show();
    }
  };

  var validateLoginFormOB = function (dataOb) {
    var regex = new RegExp(/^[a-zA-Z0-9\-_.'@]*$/gi);
    var result = true;
    var errorSpan = null;
    $(".inte-linkOB").closest(".ibe-form__fieldset").find(".ibe_form__group").removeClass("ibe_form__group--error");
    $(".inte-linkOB").closest(".ibe-form__fieldset").find(".ibe_form__msg-info").addClass("hidden");

    if (dataOb.username != "") {
      if (!regex.test(dataOb.username)) {
        result = false;
        errorSpan = $(".user-login-OB").closest(".ibe_form__group").children('[data-validate="valid"]');
        errorSpan.closest(".ibe_form__group").addClass("ibe_form__group--error");
        errorSpan.html(errorSpan.data("validate-text")).removeClass("hidden");
      }
    } else {
      result = false;
      errorSpan = $(".user-login-OB").closest(".ibe_form__group").children('[data-validate="exist"]');
      errorSpan.closest(".ibe_form__group").addClass("ibe_form__group--error");
      errorSpan.html(errorSpan.data("validate-text")).removeClass("hidden");
    }

    if (dataOb.password == "") {
      result = false;
      errorSpan = $(".passw-login-OB").closest(".ibe_form__group").children('[data-validate="exist"]');
      errorSpan.closest(".ibe_form__group").addClass("ibe_form__group--error");
      errorSpan.html(errorSpan.data("validate-text")).removeClass("hidden");
    }

    return result;
  };

  var validateForm = function (form) {
    var selector = form || '';
    var date = new Date();
    $(selector + '[data-valid-form] [data-selectmenu][required]').each(function () {
      if ($(this).next('.ui-selectmenu-button:visible')) {
        if ($(this).val() === "") {
          $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="exist"]').each(function () {
            $(this).removeClass('hidden');
            $(this).html($(this).data('validate-text'));
          });
        }
      }
    });
    $(selector + '[data-valid-form] [required]:visible').each(function () {
      var group, format, flight, validatedFiles, expression, regex, t, fecha, re, dataDayCalendar, formatCal, date2, dateRestriction, datepickerGeneral, dataHour, dataNumDays, fechaCalendar, rangeMin, rangeMax, splitDate, dateSelected, oneDay, dateNow, diffDays;

      if (!$(this).val() && $(this).prop('type') !== 'checkbox') {
        if ($(this).val() === "") {
          // Remove all error message (when data-validate attr aren't input)
          $(this).closest('.ibe_form__group').find('[data-validate]:not("input")').addClass('hidden');
          $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="exist"]').each(function () {
            $(this).removeClass('hidden');
            $(this).html($(this).data('validate-text'));
          });
        }

        if ($(this).data('validator') === 'file') {
          validatedFiles = $(this).data('validatedFiles');

          if (validatedFiles !== undefined) {
            $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error');
            $(this).closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
          } else {
            $(this).closest('.ibe_form__group').addClass('ibe_form__group--error');
            $(this).closest('.ibe_form__group').find('[data-validate="exist"]').removeClass('hidden');
          }
        }
      } else {
        if ($(this).prop('type') === 'checkbox') {
          if (!$(this).is(':checked')) {
            $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="exist"]').each(function () {
              $(this).removeClass('hidden');
              $(this).html($(this).data('validate-text'));
            });
          }
        }

        if ($(this).data('validator') === 'PIR') {
          if ($(this).val().match('[a-zA-Z]{5}[0-9]{5}') && $(this).val().length === 10) {
            isFormatValid($(this));
          } else {
            noFormatValid($(this));
          }
        } else if ($(this).data('validator') === 'ticket') {
          if ($(this).val().match("^[0-9]*$") && $(this).val().length === 13 || $(this).val().match("^[0-9]+( |-[0-9])*[0-9]+$") && $(this).val().length === 14) {
            isFormatValid($(this));
          } else {
            noFormatValid($(this));
          }
        } else if ($(this).data('validator') === 'price') {
          if ($(this).val().match('^[0-9 a-zA-Z,.€$£¥]*$')) {
            isFormatValid($(this));
          } else {
            noFormatValid($(this));
          }
        } else if ($(this).data('validator') === 'personal') {
          if ($(this).val()) {
            if (/^(?!.*[0-9*¡!?¿<>\\\\ºª|/\·@#$%&,;=?¿())_¬+{}\[\]"~\^€$£])/.test($(this).val()) && $(this).val().length <= 30) {
              isFormatValid($(this));
            } else {
              noFormatValid($(this));
            }
          } else if (!$(this).val() && !$(this).attr('required')) {
            clearAllErrors($(this));
          }
        } else if ($(this).data('validator') === 'flight') {
          if ($(this).val().match('[a-zA-Z]{2}[0-9]{1,4}$')) {
            isFormatValid($(this));
          } else {
            noFormatValid($(this));
          }
        } else if ($(this).data('validator') === 'partner') {
          if ($(this).val().match('^[0-9]*$') && $(this).val().length === 8) {
            isFormatValid($(this));
          } else {
            noFormatValid($(this));
          }
        } else if ($(this).data('validator') === 'url') {
          expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;
          regex = new RegExp(expression);
          t = $(this).val();

          if (t.match(regex)) {
            $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="valid"]').addClass('hidden');
          } else {
            $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
              $(this).removeClass('hidden');
              $(this).html($(this).data('validate-text'));
            });
          }
        } else if ($(this).data('validator') === 'date') {
          //Take de value and convert to an array
          fecha = $(this).val();
          format = $(this).data('format'); //Change the position of the array to MM/DD/AAAAA
          //fecha = arrF[1] + '/' + arrF[0] + '/' + arrF[2];

          if (format === 'DD/MM/YYYY') {
            re = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
          } else {
            re = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
          }

          if (re.test(fecha)) {
            isFormatValid($(this));
            $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error');
          } else {
            noFormatValid($(this));
          }
        } else if ($(this).data('validator') === 'date-valid') {
          //Take de value and convert to an array
          fecha = $(this).val();
          group = $('.ibe_form__group');
          format = $(this).data('format');
          flight = $(this).data('flight');
          dataDayCalendar = group.find('[data-hour-restriction]');

          if (format === 'DD/MM/YYYY') {
            re = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
            formatCal = 'dd/mm/yy';
          } else {
            re = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
            formatCal = 'mm/dd/yy';
          }

          if (re.test(fecha)) {
            if (flight === 'start') {
              date2 = $('.ibe_form__group').find('[data-flight="return"]').val();

              if (date2 !== "") {
                if ($.datepicker.parseDate(formatCal, date2) < $.datepicker.parseDate(formatCal, fecha)) {
                  clearAllErrors($(this));
                  $(this).closest('.ibe-datepicker-general').addClass('ibe_form__group--error').find('[data-validate="range-return"]').each(function () {
                    $(this).removeClass('hidden');
                    $(this).html($(this).data('validate-text'));
                  });
                  return false;
                } //else


                $('.ibe-datepicker-general').find('[data-validate="range-return"]').addClass('hidden');
                $('.ibe-datepicker-general').find('[data-validate="range-go"]').addClass('hidden');
                isFormatValid($(this));
                $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error');
                $('.ibe-datepicker-general').find('[data-validate="range-go"]').closest('.ibe_form__group').removeClass('ibe_form__group--error');
              }
            } else {
              date2 = $('.ibe_form__group').find('[data-flight="start"]').val();

              if (date2 !== "") {
                if ($.datepicker.parseDate(formatCal, date2) > $.datepicker.parseDate(formatCal, fecha)) {
                  clearAllErrors($(this));
                  $(this).closest('.ibe-datepicker-general').addClass('ibe_form__group--error').find('[data-validate="range-go"]').each(function () {
                    $(this).removeClass('hidden');
                    $(this).html($(this).data('validate-text'));
                  });
                } else {
                  isFormatValid($(this));

                  if ($('.ibe-datepicker-general').find('[data-validate="range-return"]').is(':visible')) {
                    $('.ibe-datepicker-general').find('[data-validate="range-return"]').addClass('hidden');
                    $('.ibe-datepicker-general').find('[data-validate="range-return"]').closest('.ibe_form__group').removeClass('ibe_form__group--error');
                  }

                  $('.ibe-datepicker-general').find('[data-validate="range-go"]').addClass('hidden');
                  $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error');
                }
              }
            }

            if (dataDayCalendar.length > 0 && $(this).val() !== "") {
              dateRestriction = new Date();
              datepickerGeneral = $(this).closest('.ibe-datepicker-general');
              dataHour = parseInt(dataDayCalendar.eq(0).data()['hourRestriction']);
              dateRestriction.setMilliseconds(dataHour * 60 * 60 * 1000); //Horas por segundos/hora

              dateRestriction.setHours(0);
              dateRestriction.setMinutes(0);
              dateRestriction.setSeconds(0);
              dataNumDays = dataDayCalendar.length ? parseInt(dataDayCalendar.eq(0).data()['hourRestriction']) : 0;

              if (dataNumDays > 0 && dateParser(fecha, format).getTime() < dateRestriction) {
                clearAllErrors($(this));
                datepickerGeneral.addClass('ibe_form__group--error').find('[data-validate="restriction"]').each(function () {
                  $(this).removeClass('hidden');
                  $(this).html($(this).data('validate-text'));
                });
              } else {
                isFormatValid($(this));

                if ($(this).closest('.ibe_form__group').find('[data-validate="restriction"]').is(':visible')) {
                  $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="restriction"]').addClass('hidden');
                }
              }
            }
          } else {
            //noFormatValid($(this));
            clearAllErrors($(this));
            $(this).closest('.ibe_form__group').find('[data-validate]').html('');
            $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
              $(this).removeClass('hidden');
              $(this).html($(this).data('validate-text'));
            });
            $(this).closest('.ibe_form__group').find('[data-validate="range-go"]').addClass('hidden');
            $(this).closest('.ibe_form__group').find('[data-validate="range-return"]').addClass('hidden');
            return false;
          }
        } else if ($(this).data('validator') === 'pnr-tkt') {
          if ($(this).val()) {
            if (/(^[a-zA-Z0-9]{5,6}$)|(^[0-9]{3}[- ]?[0-9]{10}$)|(^[0-9]{16}$)/.test($(this).val())) {
              isFormatValid($(this));
            } else {
              noFormatValid($(this));
            }
          } else if (!$(this).val() && !$(this).attr('required')) {
            clearAllErrors($(this));
          }
        } else if ($(this).data('validator') === 'mail') {
          if ($(this).val()) {
            regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;

            if (regex.test($(this).val())) {
              isFormatValid($(this));

              if ($(this).data('different') !== undefined) {
                if ($(this).val() !== $(this).closest('.row').prev().find('input[type=text]').val()) {
                  noFormatValid($(this));
                } else {
                  $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="different"]').addClass('hidden');
                }
              }
            } else {
              $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
                $(this).removeClass('hidden');
                $(this).html($(this).data('validate-text'));
              });
            }
          }
        }

        if ($(this).data('validator-range') === 'range-custom') {
          // Check that the date is between a range of days
          fechaCalendar = $(this).val();
          format = $(this).data('format');
          rangeMin = $(this).data('range-min');
          rangeMax = $(this).data('range-max');

          if (format === 'DD/MM/YYYY') {
            re = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
          } else {
            re = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
          }

          if (re.test(fechaCalendar)) {
            splitDate = fechaCalendar.split('/');

            if (format === 'DD/MM/YYYY') {
              dateSelected = new Date(splitDate[2], splitDate[1] - 1, splitDate[0]);
            } else {
              dateSelected = new Date(splitDate[2], splitDate[0] - 1, splitDate[1]);
            }

            oneDay = 24 * 60 * 60 * 1000;
            dateNow = new Date();
            dateNow.setHours(0, 0, 0, 0);
            diffDays = Math.round(Math.abs(dateSelected.getTime() - dateNow.getTime()) / oneDay);

            if (dateNow > dateSelected) {
              if (diffDays <= parseInt(rangeMin)) {
                $('.ibe-datepicker-general').find('[data-validate="range-min"]').addClass('hidden');
                $('.ibe-datepicker-general').find('[data-validate="range-max"]').addClass('hidden');
                isFormatValid($(this));
                $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error');
              } else {
                $('.ibe-datepicker-general').find('[data-validate="range-max"]').addClass('hidden');
                $(this).closest('.ibe-datepicker-general').addClass('ibe_form__group--error').find('[data-validate="range-min"]').each(function () {
                  $(this).removeClass('hidden');
                  $(this).html($(this).data('validate-text'));
                });
              }
            } else {
              if (diffDays <= parseInt(rangeMax)) {
                $('.ibe-datepicker-general').find('[data-validate="range-min"]').addClass('hidden');
                $('.ibe-datepicker-general').find('[data-validate="range-max"]').addClass('hidden');
                $(this).closest('.ibe-datepicker-general').removeClass('ibe_form__group--error');
                isFormatValid($(this));
              } else {
                $('.ibe-datepicker-general').find('[data-validate="range-min"]').addClass('hidden');
                $(this).closest('.ibe-datepicker-general').addClass('ibe_form__group--error').find('[data-validate="range-max"]').each(function () {
                  $(this).removeClass('hidden');
                  $(this).html($(this).data('validate-text'));
                });
              }
            }
          }
        }
      }
    });
    $(selector + '[data-valid-form] input:not([required])').each(function () {
      var expression, regex, t, cadena, pattern, sum, num, c, nif, airlines, validatePinLength, uni, sum, number;

      if ($(this).data('validator') === 'plus') {
        if ($(this).val()) {
          if ($(this).val().match('^[0-9]*$') && $(this).val().length > 7 && $(this).val().length < 13) {
            $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="valid"]').addClass('hidden');
          } else {
            $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
              $(this).removeClass('hidden');
              $(this).html($(this).data('validate-text'));
            });
          }
        }
      } else if ($(this).data('validator') === 'personal') {
        if ($(this).val()) {
          if (/^(?!.*[0-9*¡!?¿<>\\\\ºª|/\·@#$%&,;=?¿())_¬+{}\[\]"~\^€$£])/.test($(this).val()) && $(this).val().length <= 30) {
            isFormatValid($(this));
          } else {
            noFormatValid($(this));
          }
        } else if (!$(this).val() && !$(this).attr('required')) {
          clearAllErrors($(this));
        }
      } else if ($(this).data('validator') === 'num-flight') {
        if ($(this).val().match('^([a-z]+[0-9]){4,6}$') && $(this).val().length > 4 && $(this).val().length < 7) {
          $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="valid"]').addClass('hidden');
        } else {
          $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
            $(this).removeClass('hidden');
            $(this).html($(this).data('validate-text'));
          });
        }
      } else if ($(this).data('validator') === 'code') {
        if ($(this).val()) {
          if ($(this).val().match('^[a-zA-Z0-9_]*$') && $(this).val().length > 4 && $(this).val().length < 7) {
            $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="valid"]').addClass('hidden');
          } else {
            $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
              $(this).removeClass('hidden');
              $(this).html($(this).data('validate-text'));
            });
          }
        }
      } else if ($(this).data('validator') === 'tel') {
        if ($(this).val()) {
          expression = /(^[+][0-9 ]+$)|(^[0-9 ]{8,30}$)/;
          regex = new RegExp(expression);
          t = $(this).val();

          if (t.match(regex)) {
            $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate]').addClass('hidden');
          } else {
            $(this).closest('.ibe_form__group').find('[data-validate]').addClass('hidden'); //remove all error messages for show only 1

            if (isNaN(t)) {
              // if not number
              $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="letter"]').each(function () {
                $(this).removeClass('hidden');
                $(this).html($(this).data('validate-text'));
              });
            } else {
              noFormatValid($(this));
            }
          }
        }
      } else if ($(this).data('validator') === 'cod-postal') {
        if ($(this).val()) {
          if ($(this).val().match('^[0-9]*$') && $(this).val().length === 5) {
            isFormatValid($(this));
          } else {
            noFormatValid($(this));
          }
        }
      } else if ($(this).data('validator') === 'cod-ticket') {
        cadena = $(this).val();

        if ($(this).val().match('^[0-9-]*$') && cadena.indexOf('075-') > -1 && $(this).val().length === 14) {
          isFormatValid($(this));
        } else {
          noFormatValid($(this));
        }
      } else if ($(this).data('validator') === 'ibePlus' && $(this).val().length > 0) {
        if (valid_luhn_algorithm($(this).val())) {
          isFormatValid($(this));
        } else {
          pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

          if (pattern.test($(this).val()) === true) {
            isFormatValid($(this));
          } else {
            noFormatValid($(this));
          }
        }
      } else if ($(this).data('validator') === 'onBusiness' && $(this).val().length > 0) {
        if (!$(this).val().match('^OB[0-9-]{8}$')) {
          noFormatValid($(this));
        } else {
          sum = 0;
          number = $(this).val();

          for (i = 2; i < number.length - 1; i++) {
            sum = sum + parseInt(number.charAt(i));
          }

          result = sum % 7 === parseInt(number.charAt(number.length - 1));

          if (result) {
            isFormatValid($(this));
          } else {
            noFormatValid($(this));
          }
        }
      } else if ($(this).data('validator') === 'pin' && $(this).val().length > 0) {
        var globalPattern = /^((?!.*[\s])(.){6,20})$/gm;

        if (globalPattern.test($(this).val())) {
          isFormatValid($(this));
        } else {
          noFormatValid($(this));
        }
      } else if ($(this).data('validator') === 'numflight') {
        numFlight($(this));
      } else if ($(this).data('validator') === 'nif') {
        nif = $(this).val();
        nif = nif.toUpperCase().replace(/[\s\-]+/g, '');

        if (/^(\d|[XYZ])\d{7}[A-Z]$/.test(nif)) {
          num = nif.match(/\d+/);
          num = (nif[0] !== 'Z' ? nif[0] !== 'Y' ? 0 : 1 : 2) + num;

          if (nif[8] === 'TRWAGMYFPDXBNJZSQVHLCKE'[num % 23]) {
            //return /^\d/.test(nif)? 'DNI': 'NIE';
            isFormatValid($(this));
          }
        } else if (/^[ABCDEFGHJKLMNPQRSUVW]\d{7}[\dA-J]$/.test(nif)) {
          for (sum = 0, i = 1; i < 8; ++i) {
            num = nif[i] << i % 2;
            uni = num % 10;
            sum += (num - uni) / 10 + uni;
          }

          c = (10 - sum % 10) % 10;

          if (nif[8] === c || nif[8] === 'JABCDEFGHI'[c]) {
            //return /^[KLM]/.test(nif)? 'ESP': 'CIF';
            isFormatValid($(this));
          }
        } else {
          noFormatValid($(this));
        }
      } else if ($(this).data('validator') === 'mail') {
        if ($(this).val()) {
          pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;

          if (pattern.test($(this).val())) {
            isFormatValid($(this));

            if ($(this).data('different') !== undefined) {
              if ($(this).val() !== $(this).closest('.row').prev().find('input[type=text]').val()) {
                noFormatValid($(this));
              } else {
                $(this).closest('.ibe_form__group').removeClass('ibe_form__group--error').find('[data-validate="different"]').addClass('hidden');
              }
            }
          } else {
            $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="valid"]').each(function () {
              $(this).removeClass('hidden');
              $(this).html($(this).data('validate-text'));
            });
          }
        }
      } else if ($(this).data('validator') === 'pnr-tkt') {
        if ($(this).val()) {
          if (/(^[a-zA-Z0-9]{5,6}$)|(^[0-9]{3}[- ]?[0-9]{10}$)|(^[0-9]{16}$)/.test($(this).val())) {
            isFormatValid($(this));
          } else {
            noFormatValid($(this));
          }
        } else if (!$(this).val() && !$(this).attr('required')) {
          clearAllErrors($(this));
        }
      }
    });

    if ($(selector + '[data-valid-form]').find('.ibe_form__group--error').length > 0) {
      return false;
    }

    return true;
  };

  var checkPartialDate = function (date, format) {
    if (/[A-zÀ-ÿ]/.test(date.replace('/', '').toLowerCase())) {
      return false;
    }

    switch (date.length) {
      case 1:
        if (format === 'DD/MM/YYYY') {
          if (parseInt(date) > 3) {
            return '0' + date + '/';
          }

          return date;
        }

        if (parseInt(date.substr(0, 1)) >= 2) {
          return '0' + date.substr(0, 1) + '/';
        }

        return date;
        break;

      case 2:
        if (format === 'DD/MM/YYYY') {
          if (/^(0[1-9]|1\d|2\d|3[01])$/.test(date)) {
            return date + '/';
          }

          return false;
        }

        if (/^(0[1-9]|1[0-2])$/.test(date)) {
          return date + '/';
        }

        return false;
        break;

      case 3:
        if (format === 'DD/MM/YYYY') {
          if (/^(0[1-9]|1\d|2\d|3[01])\/$/.test(date)) {
            return date;
          }

          return false;
        }

        if (/^(0[1-9]|1[0-2])\/$/.test(date)) {
          return date;
        }

        return false;
        break;

      case 4:
        if (format === 'DD/MM/YYYY') {
          if (/^(0[1-9]|1\d|2\d|3[01])\/$/.test(date.substr(0, 3))) {
            if (parseInt(date.substr(3, 4)) >= 2) {
              return date.substr(0, 3) + '0' + date.substr(3, 4) + '/';
            }

            return date;
          }

          return false;
        }

        if (/^(0[1-9]|1[0-2])\/$/.test(date.substr(0, 3))) {
          if (parseInt(date.substr(3, 4)) > 3) {
            return date.substr(0, 3) + '0' + date.substr(3, 4) + '/';
          }

          return date;
        }

        return false;
        break;

      case 5:
        if (format === 'DD/MM/YYYY') {
          if (/^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])$/.test(date)) {
            return date + '/';
          }

          return false;
        }

        if (/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])$/.test(date)) {
          return date + '/';
        }

        return false;
        break;

      case 6:
        if (format === 'DD/MM/YYYY') {
          if (/^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/$/.test(date)) {
            return date;
          }

          return false;
        }

        if (/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/$/.test(date)) {
          return date;
        }

        return false;
        break;

      case 7:
        if (format === 'DD/MM/YYYY') {
          return /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(1|2)$/.test(date);
        }

        return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(1|2)$/.test(date);
        break;

      case 8:
        if (format === 'DD/MM/YYYY') {
          return /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)$/.test(date);
        }

        return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)$/.test(date);
        break;

      case 9:
        if (format === 'DD/MM/YYYY') {
          return /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{1}$/.test(date);
        }

        return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{1}$/.test(date);
        break;

      case 10:
        if (format === 'DD/MM/YYYY') {
          return /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/.test(date);
        }

        return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/.test(date);
        break;

      default:
        return false;
    }
  };

  return {
    'init': init,
    'validateForm': validateForm,
    'formatTicket': formatTicket,
    'nocopyPaste': nocopyPaste,
    'numFlight': numFlight,
    'compareCity': compareCity,
    'validateLoginFormOB': validateLoginFormOB
  };
}(jQuery);
"use strict";

dFrontJs.ibe_validations_searcher = function () {
  //Init
  //Init validations searcher

  /*eslint no-underscore-dangle: ['error', { 'allow': ['_thisKeypress', '_thisKeyup'] }]*/
  var dateParser = function (date, format) {
    var dateParts = date.split('/');

    if (format === 'DD/MM/YYYY') {
      return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    }

    return new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
  };

  var selectableDate = function (date, format) {
    var dateParts = date.split('/');

    if (format === 'DD/MM/YYYY') {
      return parseInt(dateParts[0]) < 27 || new Date(dateParts[2], dateParts[1] - 1, dateParts[0]).getMonth() === new Date(dateParts[2], dateParts[1] - 1, dateParts[0] - 5).getMonth();
    }

    return parseInt(dateParts[0]) < 27 || new Date(dateParts[2], dateParts[0], dateParts[1] - 1).getMonth() === new Date(dateParts[2], dateParts[0] - 5, dateParts[1] - 1).getMonth();
  };

  var getDatePickerMaxDate = function (selector) {
    var maxValue = $(selector).attr('data-maxrange') || '361';
    maxValue = parseInt(maxValue, 10);

    if (!isNaN(maxValue)) {
      if (maxValue > 1) {
        return maxValue - 1;
      } else {
        return 1;
      }
    }

    return 360;
  };

  var checkPartialDate = function (date, format) {
    if (/[A-zÀ-ÿ]/.test(date.replace('/', '').toLowerCase())) {
      return false;
    }

    switch (date.length) {
      case 1:
        if (format === 'DD/MM/YYYY') {
          if (parseInt(date) > 3) {
            return '0' + date + '/';
          }

          return date;
        }

        if (parseInt(date.substr(0, 1)) >= 2) {
          return '0' + date.substr(0, 1) + '/';
        }

        return date;
        break;

      case 2:
        if (format === 'DD/MM/YYYY') {
          if (/^(0[1-9]|1\d|2\d|3[01])$/.test(date)) {
            return date + '/';
          }

          return false;
        }

        if (/^(0[1-9]|1[0-2])$/.test(date)) {
          return date + '/';
        }

        return false;
        break;

      case 3:
        if (format === 'DD/MM/YYYY') {
          if (/^(0[1-9]|1\d|2\d|3[01])\/$/.test(date)) {
            return date;
          }

          return false;
        }

        if (/^(0[1-9]|1[0-2])\/$/.test(date)) {
          return date;
        }

        return false;
        break;

      case 4:
        if (format === 'DD/MM/YYYY') {
          if (/^(0[1-9]|1\d|2\d|3[01])\/$/.test(date.substr(0, 3))) {
            if (parseInt(date.substr(3, 4)) >= 2) {
              return date.substr(0, 3) + '0' + date.substr(3, 4) + '/';
            }

            return date;
          }

          return false;
        }

        if (/^(0[1-9]|1[0-2])\/$/.test(date.substr(0, 3))) {
          if (parseInt(date.substr(3, 4)) > 3) {
            return date.substr(0, 3) + '0' + date.substr(3, 4) + '/';
          }

          return date;
        }

        return false;
        break;

      case 5:
        if (format === 'DD/MM/YYYY') {
          if (/^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])$/.test(date)) {
            return date + '/';
          }

          return false;
        }

        if (/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])$/.test(date)) {
          return date + '/';
        }

        return false;
        break;

      case 6:
        if (format === 'DD/MM/YYYY') {
          if (/^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/$/.test(date)) {
            return date;
          }

          return false;
        }

        if (/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/$/.test(date)) {
          return date;
        }

        return false;
        break;

      case 7:
        if (format === 'DD/MM/YYYY') {
          return /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(1|2)$/.test(date);
        }

        return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(1|2)$/.test(date);
        break;

      case 8:
        if (format === 'DD/MM/YYYY') {
          return /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)$/.test(date);
        }

        return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)$/.test(date);
        break;

      case 9:
        if (format === 'DD/MM/YYYY') {
          return /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{1}$/.test(date);
        }

        return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{1}$/.test(date);
        break;

      case 10:
        if (format === 'DD/MM/YYYY') {
          return /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/.test(date);
        }

        return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/.test(date);
        break;

      default:
        return false;
    }
  };

  var checkDate = function (date, format) {
    if (format === 'DD/MM/YYYY') {
      return /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/.test(date);
    }

    return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/.test(date);
  };

  var isFocusing;

  var dateValidator = function (group) {
    var dtoday = new Date(new Date().setHours(0, 0, 0, 0));
    var dateO = new Date(new Date().setHours(0, 0, 0, 0));
    var roundElement = group.find('input[data-cal="start"]');
    var round = roundElement.val();
    var roundFormat = group.find('input[data-cal="start"]').data('format');
    var retFormat = roundFormat;
    var retElement = group.find('input[data-cal="end"]').length > 0 ? group.find('input[data-cal="end"]') : roundElement;
    var ret = retElement.val();
    var dataDayCalendar = group.find('[data-hour-restriction]');
    var maxrange = getDatePickerMaxDate(group.find('[data-maxrange]'));
    var dateRestriction;
    var dataHour;
    var dataNumDays;

    if (dataDayCalendar.length > 0) {
      dateRestriction = new Date();
      dataHour = parseInt(dataDayCalendar.eq(0).data()['hourRestriction']);
      dateRestriction.setMilliseconds(dataHour * 60 * 60 * 1000); //Horas por segundos/hora

      dateRestriction.setHours(0);
      dateRestriction.setMinutes(0);
      dateRestriction.setSeconds(0);
      dataNumDays = dataDayCalendar.length ? parseInt(dataDayCalendar.eq(0).data()['hourRestriction']) : 0;
    } //-console.log('compara:', dateParser(round, roundFormat), dtoday, dateParser(round, roundFormat).getTime(), new Date().setDate(new Date().getDate() + 330))
    // date inserted is empty


    if (round === "") {
      //group.find("[data-function="cal-start"]").datepicker('setDate', new Date());
      //group.find("[data-function="cal-end"]").datepicker('option', 'minDate', group.find("[data-function="cal-start"]").datepicker('getDate'));
      //group.find('[data-validate]').addClass('hidden');
      // group.find('[data-validate="exist"]').removeClass('hidden');
      //END UNDEFINED (ONEWAY)
      if (roundElement === retElement || retElement.is(':hidden') || retElement.prop('disabled')) {
        group.addClass('ibe_form__group--error').find('[data-validate="exist-one-way"]').each(function () {
          $(this).removeClass('hidden');
          $(this).html($(this).data('validate-text'));
        });
      } else {
        // if (ret === ""){
        group.addClass('ibe_form__group--error').find('[data-validate="exist"]').each(function () {
          $(this).removeClass('hidden');
          $(this).html($(this).data('validate-text'));
        }); // }
      }

      if (group.find('[data-validate]').not('.hidden').length) {
        group.find('[data-validate]').not('.hidden').closest('.ibe_form__group').addClass('ibe_form__group--error');
      } else {
        group.removeClass('ibe_form__group--error');
      }

      if (group.closest('.ibe_form').find('input[data-function="roundtrip"]').length === 1 && group.closest('.ibe_form').find('input[data-function="roundtrip"]:checked').length === 0) {
        group.find('[data-function="cal-end"]').closest('.fc_form_group').find('.collapse.in').collapse('hide');
      }

      if (ret !== "" && (!checkDate(ret, retFormat) || !selectableDate(ret, retFormat))) {
        group.addClass('ibe_form__group--error');
        group.find('[data-validate]').addClass('hidden');
        group.find('[data-validate="parse"]').removeClass('hidden'); //group.find("[data-function="cal-end"]").datepicker('setDate');
        //group.find("[data-function="cal-start"]").datepicker('option', 'maxDate', 330);

        group.find('.collapse.in').collapse('hide');

        if ($('.ibe-dinamic-modal').length > 0) {
          group.closest('.ibe-dinamic-modal').removeClass('ibe-dinamic-modal');
        }

        return false;
      } else if (ret !== "" && checkDate(ret, retFormat) && selectableDate(ret, retFormat)) {
        return true;
      }

      return false; // date format is incorrect
    } else if (ret === "" && !group.find('input[data-cal="start"]').parents('.ibe_form__group').hasClass('ibe_form__group--half-only-round') && !group.find('input[data-cal="end"]').parents('.ibe_form__group-half').hasClass('ibe_form__group-half-one-way')) {
      //END UNDEFINED (ONEWAY)
      // if (ret === "") {
      group.addClass('ibe_form__group--error').find('[data-validate="exist"]').each(function () {
        $(this).removeClass('hidden');
        $(this).html($(this).data('validate-text'));
      }); // }
      // requestAnimFrame(function () {

      if ($('.ibe-stopover').length > 0) {
        group.find('[data-validate="exist"]').removeClass('hidden');
        group.find('[data-validate]').not('.hidden').closest('.ibe_form__group').addClass('ibe_form__group--error');
      }

      if (round !== "" && checkDate(round, roundFormat) && selectableDate(round, roundFormat)) {
        return true;
      } // });


      return false;
    } else if (group.find('input[data-cal="start"]').parent().hasClass('xui-one-way') || group.find('input[data-cal="start"]').parents('.ibe_form__group').hasClass('ibe_form__group--half-only-round')) {
      if (!checkDate(round, roundFormat) || !selectableDate(round, roundFormat)) {
        group.addClass('ibe_form__group--error');
        group.find('[data-validate]').addClass('hidden');
        group.find('[data-validate="parse"]').removeClass('hidden');
        return false;
      } else if (dateParser(round, roundFormat).getTime() < dtoday.getTime() && !group.hasClass('ibe_form__group--error')) {
        group.addClass('ibe_form__group--error');
        group.find('[data-validate]').addClass('hidden');
        group.find('[data-validate="valid"]').removeClass('hidden');
        group.find('.collapse.in').collapse('hide');
        return false;
      } else if (dataNumDays > 0 && dateParser(round, roundFormat).getTime() < dateRestriction) {
        group.addClass('ibe_form__group--error');
        group.find('[data-validate]').addClass('hidden');
        group.find('[data-validate="restriction"]').removeClass('hidden');
        return false;
      }

      group.find('[data-validate]').addClass('hidden');
      group.removeClass('ibe_form__group--error');
      return true;
    } else if (!checkDate(round, roundFormat) || !selectableDate(round, roundFormat)) {
      //group.find('[data-function="cal-start"]').datepicker('setDate', new Date());
      //group.find('[data-function="cal-end"]').datepicker('option', 'minDate', group.find('[data-function="cal-start"]').datepicker('getDate'));
      //group.find('[data-function="cal-end"] .end-selected').removeClass('end-selected');
      group.addClass('ibe_form__group--error');
      group.find('[data-validate]').addClass('hidden');
      group.find('[data-validate="parse"]').removeClass('hidden');
      group.find('.collapse.in').collapse('hide');

      if ($('.ibe-dinamic-modal').length > 0) {
        group.closest('.ibe-dinamic-modal').removeClass('ibe-dinamic-modal');
      }
    } else if (dateParser(round, roundFormat).getTime() > new Date().setDate(new Date().getDate() + maxrange)) {
      //group.find('[data-function="cal-start"]').datepicker('setDate', new Date());
      //group.find('[data-function="cal-end"]').datepicker('option', 'minDate', group.find('[data-function="cal-start"]').datepicker('getDate'));
      group.addClass('ibe_form__group--error');
      group.find('[data-validate]').addClass('hidden');
      group.find('[data-validate="max"]').removeClass('hidden');
      return false; // } else if (date.getTime() < new Date(today)) {
      // 	group.addClass('ibe_form__group--error');
      // 	group.find('[data-validate]').addClass('hidden');
      // 	group.find('[data-validate="valid"]').removeClass('hidden');
    } else if (dateParser(round, roundFormat).getTime() < dtoday.getTime()) {
      group.addClass('ibe_form__group--error');
      group.find('[data-validate]').addClass('hidden');
      group.find('[data-validate="valid"]').removeClass('hidden');
      group.find('.collapse.in').collapse('hide');

      if ($('.ibe-dinamic-modal').length > 0) {
        group.closest('.ibe-dinamic-modal').removeClass('ibe-dinamic-modal');
      }
    } else if (ret !== "" && (!checkDate(ret, retFormat) || !selectableDate(ret, retFormat))) {
      group.addClass('ibe_form__group--error');
      group.find('[data-validate]').addClass('hidden');
      group.find('[data-validate="parse"]').removeClass('hidden'); //group.find('[data-function="cal-end"]').datepicker('setDate');
      //group.find('[data-function="cal-start"]').datepicker('option', 'maxDate', 330);

      group.find('.collapse.in').collapse('hide');

      if ($('.ibe-dinamic-modal').length > 0) {
        group.closest('.ibe-dinamic-modal').removeClass('ibe-dinamic-modal');
      }

      return false;
    } else if (dateParser(ret, retFormat).getTime() > new Date().setDate(new Date().getDate() + maxrange)) {
      group.addClass('ibe_form__group--error');
      group.find('[data-validate]').addClass('hidden');
      group.find('[data-validate="max"]').removeClass('hidden'); //group.find('[data-function="cal-end"]').datepicker('setDate');
      //group.find('[data-function="cal-start"]').datepicker('option', 'maxDate', 330);

      return false;
    } else if (dateParser(ret, roundFormat).getTime() < dtoday.getTime()) {
      group.addClass('ibe_form__group--error');
      group.find('[data-validate]').addClass('hidden');
      group.find('[data-validate="valid"]').removeClass('hidden');
      group.find('.collapse.in').collapse('hide');

      if ($('.ibe-dinamic-modal').length > 0) {
        group.closest('.ibe-dinamic-modal').removeClass('ibe-dinamic-modal');
      } //} else if (dataNumDays > 0 && dateParser(round, roundFormat).getTime() < new Date().setHours(0, 0, 0, 0) + parseInt($('[data-hour-restriction]').eq(0).data()['hourRestriction'] / 24)) {

    } else if (dataNumDays > 0 && dateParser(round, roundFormat).getTime() < dateRestriction) {
      group.addClass('ibe_form__group--error');
      group.find('[data-validate]').addClass('hidden');
      group.find('[data-validate="restriction"]').removeClass('hidden');
      return false;
    } else if ((ret === "" || ret === undefined) && dataNumDays === 0) {
      //group.find('[data-function="cal-start"]').datepicker('setDate', round);
      //group.find('[data-function="cal-start"]').datepicker('option', 'maxDate', 330);
      //group.find('[data-function="cal-end"]').datepicker('option', 'minDate', round);
      //group.find('[data-function="cal-end"]').datepicker('setDate');
      group.removeClass('ibe_form__group--error');
      group.find('[data-validate]').addClass('hidden');
      return true;
    } else if (!group.hasClass('ibe_form__group--error') && dateParser(round, roundFormat) < dateRestriction) {
      //group.find('[data-function="cal-start"]').datepicker('setDate', new Date());
      group.addClass('ibe_form__group--error');
      group.find('[data-validate]').addClass('hidden');

      if (dateO.getTime() > dtoday.getTime() && dateParser(round, roundFormat).getTime() >= dtoday.getTime()) {
        group.find('[data-validate="restriction"]').removeClass('hidden');
      } else {
        group.find('[data-validate="valid"]').removeClass('hidden');
      }

      return false;
    } else if (!group.hasClass('ibe_form__group--error') && dateParser(ret, roundFormat) < dateRestriction) {
      //group.find('[data-function="cal-start"]').datepicker('setDate', new Date());
      group.addClass('ibe_form__group--error');
      group.find('[data-validate]').addClass('hidden');

      if (dateO.getTime() > dtoday.getTime() && dateParser(ret, roundFormat).getTime() >= dtoday.getTime()) {
        group.find('[data-validate="restriction"]').removeClass('hidden');
      } else {
        group.find('[data-validate="valid"]').removeClass('hidden');
      }

      return false;
    } else if (group.find('input[data-cal="end"]:visible:not(:disabled)').length === 0 && !group.find('input[data-cal="end"]').closest('[data-searcher-accordion]')) {
      //group.find('[data-function="cal-start"]').datepicker('setDate', round);
      //group.find('[data-function="cal-end"]').datepicker('option', 'minDate', round);
      //group.find('[data-function="cal-end"]').datepicker('setDate', new Date());
      group.find('[data-function="cal-end"]').closest('.fc_form_group').find('.collapse.in').collapse('hide');
      group.removeClass('ibe_form__group--error');
      group.find('[data-validate]').addClass('hidden');
      return false;
    } else {
      //group.find('[data-function="cal-start"]').datepicker('setDate', round);
      //group.find('[data-function="cal-start"]').datepicker('option', 'maxDate', ret);
      //group.find('[data-function="cal-end"]').datepicker('option', 'minDate', round);
      //group.find('[data-function="cal-end"]').datepicker('setDate', ret);
      group.removeClass('ibe_form__group--error');
      group.find('[data-validate]').addClass('hidden');
      return true;
    }
  }; //Valida el tab abierto actualmente y devuelve true/false si es valido/ivalido


  var submiting = false;
  var isOpen = false;

  var validateSearcher = function (json) {
    var inputsValid = $('[data-validate-searcher] .ibe_form:visible').first().find('input[name*=_origin], input[name*=_destiny], input[data-cal="start"], input[data-cal="end"], [data-text-passenger]').not(':hidden');
    var res = true;
    var result = true;
    submiting = true;
    json = json !== undefined ? json : '';
    setTimeout(function () {
      submiting = false;
    }, 300);
    inputsValid.closest('.ibe_form__group').find('.collapse.in').collapse('hide');
    inputsValid.each(function () {
      if ($(this).attr('data-cal') === 'start' || $(this).attr('data-cal') === 'end') {
        dateValidator($(this).closest('.ibe_form__group'));

        if (!dateValidator($(this).closest('.ibe_form__group'))) {
          res = false;
          result = res;
        } else {
          res = true;
        }
      } else {
        switch ($(this).attr('data-validate')) {
          case 'input-origin':
            if (json !== "") {
              dFrontJs.ibe_validations_searcher.checkCity($(this).parents('.ibe_form'), $(this), json);
            } else {
              dFrontJs.ibe_validations_searcher.checkCity($(this).parents('.ibe_form'), $(this));
            }

            break;

          case 'input-destiny':
            if (json !== "") {
              dFrontJs.ibe_validations_searcher.checkCity($(this).parents('.ibe_form'), $(this), json);
            } else {
              dFrontJs.ibe_validations_searcher.checkCity($(this).parents('.ibe_form'), $(this));
            }

        }

        if ($(this).val() === "") {
          $(this).closest('.ibe_form__group').addClass('ibe_form__group--error').find('[data-validate="exist"]').each(function () {
            $(this).removeClass('hidden');
            $(this).html($(this).data('validate-text'));
          });
          res = false;
          result = res;
        }
      }

      if ($(this).closest('.ibe_form__group').hasClass('ibe_form__group--error')) {
        res = false;
        result = res;
      } else {
        res = true;
      }
    }); //if exist only one case false then all validation is false and not continue ; then return false;

    if (!result) {
      res = result;
    }

    return res;
  };

  var insertDate = function (e, key, _this) {
    var newDate = _this.val();

    var iDate = checkPartialDate(newDate, _this.data('format'));

    switch (iDate) {
      case true:
        _this.val(newDate);

        break;

      case false:
        if (e.target.selectionStart < _this.val().length) {
          iDate = checkPartialDate(_this.val().substr(0, e.target.selectionStart) + key, _this.data('format'));

          switch (iDate) {
            case true:
              _this.val(_this.val().substr(0, e.target.selectionStart) + key);

              break;

            case false:
              break;

            default:
              _this.val(iDate);

          }
        }

        break;

      default:
        _this.val(iDate);

    }
  };

  var keyBloqued = function (e, key) {
    // backspace: / delete: 8 // Sup: 46 // left arrow: 37 // up arrow: 38 // right arrow : 39// down arrow : 40
    if (key !== 'Backspace' && key !== 'Delete' && key !== 'Tab' && e.keyCode !== 8 && e.keyCode !== 46 && e.keyCode !== 37 && e.keyCode !== 38 && e.keyCode !== 39 && e.keyCode !== 40) {
      e.preventDefault();
    }
  };

  var onFocusOut = function (_this, node) {
    $(document).off('mousedown touchstart');
    $(document).on('mousedown touchstart', function (e) {
      if ($(e.target).parents('.ibe-searcher__calendar').length > 0) {
        isOpen = true;
      } else {
        isOpen = false;
      }
    });

    _this.on('blur', function (e) {
      var $elem = _this;
      isFocusing = true; // forzamos el change al hacer foco fuera del input
      //

      if (!isOpen) {
        _this.change();
      } else {
        isOpen = false;
      }

      setTimeout(function () {
        var $thisInp = $elem;

        if ($elem.closest('.ibe_form__group-half').find(node).length === 0 && !submiting) {
          setTimeout(function () {
            dFrontJs.ibe_journey.controlDates($thisInp);
          }, 50);
        }
      }, 300);
    });
  };

  var _thisKeypress = function (e) {
    if (!(navigator.userAgent.match(/(iPhone)|(iPad)|(iPod)/i) ||
    /* No es Ipad */
    /\d/.test(e.key) ||
    /* Allow Number */
    /\//.test(e.key) ||
    /* Allow caracter '/' */
    /Backspace/.test(e.key) ||
    /* Allow Delete */
    /Delete/.test(e.key) ||
    /* Allow Sup */
    /ArrowLeft/.test(e.key) ||
    /* Allow Cursor left */
    /ArrowRight/.test(e.key)
    /* Allow Cursor right */
    )) {
      e.preventDefault();
    }
  };

  var _thisKeyup = function (e) {
    var key = e.key;
    var $this = $(this);
    var inputVal = $this.val();
    var inputFormat = $this.data('format');

    if (key === undefined || key === 'Unidentified') {
      key = String.fromCharCode(e.keyCode);
    }

    if (key === 'Backspace' || key === 'Delete') {
      if (!$(this).parents().find('.modal-mode').length > 0) {
        $(this).closest('.fc_form_group').find('.collapse.in').collapse('hide');
      }
    }

    if (!isNaN(key) || key === '/') {
      insertDate(e, key, $this); // if ($this.val().length === 10) {
      //
      // 	switch (dateValidator($this.closest('.ibe_form__group'))) {
      // 		case true:
      // 			$this.closest('.fc_form_group').find('.collapse.in').collapse('hide');
      // 			if ($this.closest('.ibe_form__group').find('input[data-cal="end"]').siblings('[data-cal-button]').length && !submiting) {
      // 				requestAnimFrame(function () {
      // 					$this.closest('.ibe_form__group').find('input[data-cal="end"]').siblings('[data-cal-button]').click();
      // 					isFocusing = false;
      // 				});
      // 			} else if (!submiting) {
      // 				$this.closest('.ibe_form__group').find('input[data-cal="end"]').focus();
      // 			}
      // 			break;
      // 		case false:
      // 			$this.closest('.fc_form_group').find('.collapse.in').collapse('hide');
      // 			if ($('.ibe-dinamic-modal').length > 0) {
      // 				$this.closest('.ibe-dinamic-modal').removeClass('ibe-dinamic-modal');
      // 			}
      //
      // 	}
      // 	isFocusing = true;
      //
      // } else {
      // 	isFocusing = false;
      // }
    } // caracteres que no generen eventos


    keyBloqued(e, key);
  };

  var checkCity = function (searcher, input, json, type) {
    var _searcher = searcher.get(0);

    var _input = input.get(0);

    var group = _input.closest('.ibe_form__group');

    var ori = _searcher.querySelector('input[name*=_origin]');

    var dest = _searcher.querySelector('input[name*=_destiny]');

    var results = json !== undefined ? json : _input.dataset.validationjson !== undefined ? JSON.parse(_input.dataset.validationjson) : '';
    var xtype = type !== undefined ? type : undefined;
    var complete = false;
    var i, parentOri, parentDest;

    if (json !== undefined) {
      _input.dataset.validationjson = JSON.stringify(json);
    }

    if (xtype === undefined || xtype === 'cities') {
      for (i = 0; i < results.length; i++) {
        $.each(results[i].cities, function () {
          if (this.description + ' (' + this.code + ')' === input.val()) {
            complete = true;
            return false;
          }
        });
      }
    } else if (xtype === 'airports') {
      for (i = 0; i < results.length; i++) {
        if (results[i].name + ' (' + results[i].iataCode + ')' === input.val()) {
          complete = true;
          break;
        }
      }
    }

    if (results === '') {
      complete = true;
    }

    switch (complete) {
      case true:
        group.classList.remove('ibe_form__group--error');
        group.querySelector('[data-validate="exist"]').classList.add('hidden');

        if (document.querySelector('[data-journey]') !== null) {
          ori = _input.closest('.ibe-journey').querySelector('input[name*=_origin]');
          dest = _input.closest('.ibe-journey').querySelector('input[name*=_destiny]');
        }

        if (ori.value === dest.value) {
          if (_input.value) {
            group.classList.add('ibe_form__group--error');
            var msg = group.querySelector('[data-validate="equal"]');
            msg.classList.remove('hidden');
            msg.value = msg.getAttribute('data-validate-text');
          }
        } else {
          parentOri = ori.closest('.ibe_form__group');
          parentDest = dest.closest('.ibe_form__group');
          parentOri.querySelector('[data-validate="equal"]').classList.add('hidden');
          parentDest.querySelector('[data-validate="equal"]').classList.add('hidden');

          if (parentOri.querySelectorAll('[data-validate="equal"].hidden').length === 0) {
            parentOri.classList.remove('ibe_form__group--error');
          }

          if (parentDest.querySelectorAll('[data-validate="equal"].hidden').length === 0) {
            parentDest.classList.remove('ibe_form__group--error');
          }
        }

        break;

      case false:
        if (input.val() !== "") {
          group.classList.add('ibe_form__group--error');
          msg = group.querySelector('[data-validate="exist"]');
          msg.classList.remove('hidden');
          msg.value = msg.getAttribute('data-validate-text');
          group.querySelector('[data-validate="equal"]').classList.add('hidden');
        }

        break;
    }
  };

  var init = function () {
    var validSearcher = $('[data-validate-searcher]');

    if (validSearcher.length) {
      validSearcher.find('[data-validate-text]').each(function () {
        $(this).html($(this).data('validate-text'));
      });
      validSearcher.find('.ibe_form').each(function () {
        if ($(this).hasClass('loaded')) {
          return true;
        }

        $(this).addClass('loaded');
        $(this).on('submit', function (e) {
          if (!validSearcher) {
            e.preventDefault();
          }
        });
      });
    }
  };

  return {
    'init': init,
    'dateValidator': dateValidator,
    'validateSearcher': validateSearcher,
    'insertDate': insertDate,
    'checkCity': checkCity
  };
}(jQuery);
"use strict";

//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: video
//    Descripcion: Funciones video html5
//******************************************************************************/
dFrontJs.ibe_video = function () {
  //Autoplay en escritorio / stop en mobile
  //autoPlay
  var autoPlay = function () {
    //Video html5
    var html5 = $('[data-video="html5"]'),
        //Video youtube
    youtube = $('[data-video="youtube"]'),
        initParam;
    if (youtube.length > 0) initParam = youtube.attr('src').indexOf('?');

    if ($(window).width() < dFrontJs.resolutions.lg || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      html5.removeAttr('autoplay');

      if (initParam === -1) {
        youtube.attr('src', youtube.attr('src') + '?autoplay=0');
      } else {
        youtube.attr('src', youtube.attr('src') + '&autoplay=0');
      }
    } else {
      html5.attr('autoplay');

      if (initParam === -1) {
        youtube.attr('src', youtube.attr('src') + '?autoplay=1');
      } else {
        youtube.attr('src', youtube.attr('src') + '&autoplay=1');
      }
    }
  }; //Ver si el video esta en autoplay y mostrar/ocultar los controles
  //Pausar video html5


  var isPaused = function () {
    var video = $('video');

    if (video.attr('autoplay')) {
      $('.video-controls').find('.video-controls__play').hide();
    } else {
      $('.video-controls').find('.video-controls__play').show();
    }
  }; //toggleVideo


  var toggleVideo = function (video) {
    var videoDOM = video.get(0);

    if (videoDOM.paused || videoDOM.ended) {
      $('.video-controls').find('.video-controls__play').hide();
      videoDOM.play();
    } else {
      $('.video-controls').find('.video-controls__play').show();
      videoDOM.pause();
    }
  }; //pause


  var pauseVideo = function (video) {
    var videoDOM = video.get(0);
    $('.video-controls').find('.video-controls__play').show();
    videoDOM.pause();
  }; //Eventos jquery


  var init = function () {
    if ($('[data-video]').length > 0) {
      autoPlay();
      isPaused();
    } //Click sobre el video


    $('[data-video="html5"]').click(function () {
      var $this = $(this);
      toggleVideo($this);
    }); //Click sobre los controles

    $('.video-controls').click(function () {
      var $this = $(this).parent().find('video');
      toggleVideo($this);
    });
  }; //public functions


  return {
    'init': init,
    'pauseVideo': pauseVideo
  };
}(jQuery);
"use strict";

dFrontJs.ibe_view_more = function () {
  var init = function () {
    var $element = $('[data-view-more="parent"]');
    var $button;

    if ($element.length > 0) {
      $button = $element.find('[data-view-more="button"]');
      $button.css('display', 'none');
      $('[data-value="more"]').css('display', 'block');
      $('[data-view-more="container"] *:last-child').css('margin-bottom', '0'); //Events

      $button.on('click', function (e) {
        var $this = $(this),
            $text = $this.parent().find('[data-view-more="container"]');
        e.preventDefault();
        $text.css({
          'float': 'left',
          'width': '100%'
        });

        if ($this.hasClass('ibe-link-view-more--more')) {
          $this.addClass('ibe-link-view-more--less').removeClass('ibe-link-view-more--more');
          $this.text($this.data('text-expanded'));
          $this.attr('title', $this.data('text-expanded'));
        } else {
          $this.addClass('ibe-link-view-more--more').removeClass('ibe-link-view-more--less');
          $this.text($this.data('text-collapsed'));
          $this.attr('title', $this.data('text-collapsed'));

          if ($(window).scrollTop() > $this.parent().offset().top) {
            $('html, body').animate({
              scrollTop: $this.parent().offset().top
            }, 1000);
          }
        }

        if ($text.hasClass('xui-collapse_moreInfo-text-close')) {
          $text.switchClass('xui-collapse_moreInfo-text-close', 'xui-collapse__moreInfo-link-open', 400);
        } else {
          $text.switchClass('xui-collapse__moreInfo-link-open', 'xui-collapse_moreInfo-text-close', 400);
        }

        $text.css({
          'float': 'none',
          'width': '100%'
        });
      });
    }
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_warnings = function () {
  var init = function () {
    var $button = $('[data-warnings="close"]'),
        //close button serious warning
    $serious = $('[data-warnings="serious"]'),
        //serious warning
    $slight = $('[data-warnings="slight"]'); //slight warning

    if ($serious.length === 0) {
      //if not exist serious show slight
      $slight.show().attr('aria-hidden', 'false');
      $slight.show();
    }

    $button.on('click keypress', function (event) {
      var code; //when click close hide serious and show slight

      $serious.hide().attr('aria-hidden', 'true');
      $slight.show().attr('aria-hidden', 'false');

      if (event.type === 'keypress') {
        code = event.charCode || event.keyCode;

        if (code === 32 || code === 13) {
          $slight.focus();
        }
      }
    });
  }; //pluginAccordion


  return {
    'init': init
  };
}(jQuery);
"use strict";

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
  }; //getWeekDay
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
  }; //getWeekDay
  //init


  var init = function (element) {
    if ($(element).length > 0) {
      $.getJSON('js/WWO.json', function (data) {
        $.each(data, function (key, obj) {
          var weather = $(element); //Temporada (lluvia, nublado, parcialmente_nublado, etc)

          var weatherDesc = obj.current_condition[0].weatherDesc[0].value;
          var weatherCode = obj.current_condition[0].weatherCode;
          var wClass = ''; // Temperatura actual en fahrenheit y celsius

          var current_temp_F = obj.current_condition[0].temp_F;
          var current_temp_C = obj.current_condition[0].temp_C; //Max/Min temperatura en fahrenheit

          var tempMaxF = obj.weather[0].tempMaxF;
          var tempMinF = obj.weather[0].tempMinF; //Max/Min temperatura en celsius

          var tempMaxC = obj.weather[0].tempMaxC;
          var tempMinC = obj.weather[0].tempMinC; //Fecha

          var date = new Date(obj.weather[0].date),
              day = date.getDate(),
              week_day = getWeekDay(date.getDay()),
              month = getMonth(date.getMonth());

          switch (weatherCode) {
            case '113':
              //Clear/Sunny
              wClass = 'ibe-tempo__list-weather__item-degrees--icon-sun';
              break;

            case '116':
              //Partly Cloudy
              wClass = 'ibe-tempo__list-weather__item-degrees--icon-mostly-cloudy';
              break;

            case '299':
              //Moderate rain at times
              wClass = 'ibe-tempo__list-weather__item-degrees--icon-showers';
              break;
          } //HTML


          weather.find('[data-wwo="week_day"]').html(week_day);
          weather.find('[data-wwo="day"]').html(day + ' ' + month);
          weather.find('[data-wwo="icon"]').addClass(wClass);
          weather.find('[data-wwo="current_temp"]').html(current_temp_C + 'º');
          weather.find('[data-wwo="weather"]').html(weatherDesc);
          weather.find('[data-wwo="tempMax"]').html(tempMaxC + 'º');
          weather.find('[data-wwo="tempMin"]').html(tempMinC + 'º');
        });
      }).fail(function () {});
    }
  };

  return {
    'init': init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_banner = function () {
  function renderBackground(banner, img, resolution, format) {
    var imgUrl = "".concat(img, "_").concat(resolution, ".").concat(format);
    var defaultUrl = img + '.' + format;
    $.ajax({
      url: imgUrl,
      type: 'HEAD',
      success: function () {
        banner.css('background-image', 'url(' + imgUrl + ')');
      },
      error: function () {
        banner.css('background-image', 'url(' + defaultUrl + ')');
      }
    });
  }

  var init = function () {
    var banner = $('[data-background]'),
        img = banner.data('background'),
        resolution = banner.data('background-resolution') || '1280',
        format = banner.data('background-format') || 'png';

    if (window.innerWidth >= dFrontJs.resolutions.xl) {
      resolution = '1280';
    } else if (window.innerWidth >= dFrontJs.resolutions.lg) {
      resolution = '1024';
    } else if (window.innerWidth >= dFrontJs.resolutions.md) {
      resolution = '768';
    } else if (window.innerWidth >= dFrontJs.resolutions.sm) {
      resolution = '480';
    } else if (window.innerWidth >= dFrontJs.resolutions.xs) {
      resolution = '320';
    }

    renderBackground(banner, img, resolution, format);
  }; //


  return {
    "init": init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_collapse = function () {
  var _slideToogle = function (container) {
    container.slideToggle();
  };

  var _clickElement = function () {
    var $this = $(this),
        $container = $this.parents().find('[data-toggle-content]'),
        $button = $('.ibe-search-collapse__item--button-s');

    if (!$container.is(':visible')) {
      $button.removeClass('collapsed');

      _slideToogle($container);
    } else if ($this.data('toggle-element') === 'both' || $this.data('toggle-element') === 'close') {
      $button.addClass('collapsed');

      _slideToogle($container);
    }
  };

  var _$dataclickClickEvent = function () {
    var $this = $(this),
        $data = $this.data('click'),
        $block = $this.parents().find('[data-open="' + $data + '"]');

    if ($block.length > 0 && !$this.is(':checked')) {
      $block.hide('fade');
    } else {
      $block.show('fade');
    }
  }; // Event CLICK


  var init = function () {
    var $element = $('[data-toggle-element]'),
        $click = $('[data-click]'),
        $button = $('.ibe-search-collapse__item--button-s'),
        $dataToggle = $('[data-toggle-element="both"]');
    $button.addClass('collapsed');
    $click.off('click', _$dataclickClickEvent);
    $click.on('click', _$dataclickClickEvent);
    $element.off('click', _clickElement);
    $element.on('click', _clickElement);
  };

  return {
    "init": init
  };
}(jQuery);
"use strict";

/* eslint-disable no-var */
dFrontJs.ibe_counter_night = function () {
  var _lessOrPlus = ($count, $obj) => {
    var c = parseInt($count.text());
    $obj.data("night-button") === "less" ? c-- : c++;
    return c;
  }; //Función para revertir el formato


  var _convertDateFormat = function (string) {
    var info = string.split('/').reverse().join('-');
    return info;
  }; //Función para formato en inglés


  var _getFormattedDate = function (date) {
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return _convertDateFormat(day + '/' + month + '/' + year);
  };

  var _maxNights = function (countNumber, sum, res) {
    var fechaInicioFormat = $('[data-cal="start"]').data("format");
    var numberMessage$ = $('.ibe-message-tooltip__content--number');
    var oneway = $('[data-validate-searcher]').find('.ibe_form__group--half-only-round').length;
    var fechaInicio, fechaFin;

    if (fechaInicioFormat == 'DD/MM/YYYY') {
      fechaInicio = _convertDateFormat($('[data-cal="start"]').val());
      fechaFin = _convertDateFormat($('[data-cal="end"]').val());
    }

    if (fechaInicioFormat == 'MM/DD/YYYY') {
      fechaInicio = _getFormattedDate(new Date($('[data-cal="start"]').val()));
      fechaFin = _getFormattedDate(new Date($('[data-cal="end"]').val()));
    }

    if (fechaInicio > "" && fechaFin > "" && fechaInicio <= fechaFin && oneway === 0) {
      fechaInicio = new Date(fechaInicio).getTime();
      fechaFin = new Date(fechaFin).getTime();
      var diff = fechaFin - fechaInicio;
      diff = diff / (1000 * 60 * 60 * 24);

      if (diff >= 2 && fechaInicioFormat == 'DD/MM/YYYY') {
        diff--;
      }

      if (diff >= 2 && fechaInicioFormat == 'MM/DD/YYYY') {
        diff--;
      } //-console.log(fechaInicio, fechaFin, "count:", countNumber, "diff:", diff);


      if (countNumber >= diff || diff === 1 || diff === 0) {
        if (diff === 0) {
          diff++;
        }

        $('[data-night-counter]').html("0" + diff);
        numberMessage$.html(diff);
        countNumber = diff;

        if (diff === 1 || countNumber === 1) {
          res.attr('disabled', 'disabled');
        } else {
          res.removeAttr('disabled');
        }

        return false;
      } // Casos sueltos


      if (countNumber === 1 && diff > 1) {
        sum.removeAttr("disabled");
      }

      if (countNumber > 1) {
        res.removeAttr("disabled");
      }

      if (countNumber === 5) {
        numberMessage$.html(countNumber);
      }
    }

    return true;
  };

  var visualValidation = function (countNumber, value, $this) {
    var sum = $this.parent().find('[data-night-button ="plus"]'),
        res = $this.parent().find('[data-night-button ="less"]');

    if (!_maxNights(countNumber, sum, res) || countNumber === value) {
      sum.attr("disabled", "disabled");
    } else if (countNumber === 1) {
      res.attr('disabled', 'disabled');
    } else if (sum.attr('disabled') === 'disabled') {
      sum.removeAttr("disabled");
    } else if (res.attr('disabled') === 'disabled') {
      res.removeAttr('disabled');
    }
  }; // Event CLICK


  var init = function () {
    var $element = $('[data-max-night]'),
        value = $element.data('max-night'),
        $count = $('[data-night-counter]'),
        $button = $('[data-night-button]'),
        $less = $('[data-night-button="less"]'),
        $plus = $('[data-night-button="plus"]'),
        oneway$ = $('[data-click="oneway"]'),
        roundDate = $('#searcher-calendar-1 [data-function]'),
        returnDate = $('#searcher-calendar-end-1 [data-function]'); //Allow lessOrPlus change when date is actualised

    roundDate.on('change', function () {
      visualValidation(parseInt($count.html()), value, $less);
    });
    returnDate.on('change', function () {
      visualValidation(parseInt($count.html()), value, $less);
    });
    $less.attr('disabled', 'disabled');
    $button.on('click', function () {
      var $this = $(this),
          $obj = $this,
          countNumber = _lessOrPlus($count, $obj);

      if (countNumber > 9) {
        $count.html(countNumber);
      } else {
        $count.html('0' + countNumber);
      }

      visualValidation(countNumber, value, $this);
    }); // Resetar el contador a uno cada vez qe se pulse en ida y vuelta

    oneway$.on('click', function () {
      $('[data-night-button ="plus"]').removeAttr("disabled");
      $('[data-night-button ="less"]').attr('disabled', 'disabled');
      $('.ibe-message-tooltip__content--number').html(value);
      $('[data-night-counter]').html("01");
    });
  }; //


  return {
    "init": init,
    "visualValidation": visualValidation
  };
}(jQuery);
"use strict";

dFrontJs.ibe_dinamic_modal = function () {
  var _disableCollapse = function (e) {
    e.stopPropagation();
    e.preventDefault();
  };

  var _keyDown = function (e, $this) {
    e.stopPropagation();

    if (e.keyCode === 27) {
      close($this);
    }
  };

  var open = function ($this) {
    var $group = $this.closest('.ibe_form__group'),
        calendar = $this.attr('data-target');

    if (window.innerWidth < dFrontJs.resolutions.lg) {
      $group.addClass('ibe-dinamic-modal');
      $group.attr("data-keyboard-close", "esc");
      $('body').css('overflow', 'hidden');
    }

    if ($group.children('[data-autocomplete="cities"]').length > 0) {
      dFrontJs.ibe_searcher_choose_city.selectedCity($group);
    } else {
      $group.scrollTop(0);
    }

    $(this).off("keydown", _keyDown);
    $(this).on("keydown", _keyDown);
  };

  var close = function ($this) {
    var $group = $this.closest('.ibe-dinamic-modal'),
        $collapse = $group.find('.in'),
        $calendar = $this.parent().find('.ibe-searcher__calendar');
    $group.removeClass('ibe-dinamic-modal');
    $('body').css('overflow', 'auto');

    if ($collapse.length > 0) {
      $collapse.collapse('hide');
    }
  };

  var _openClickDinamic = function () {
    var $this = $(this),
        calendar = $this.attr('data-target');

    if ($(calendar).hasClass('fc-date-loaded')) {
      $(calendar).addClass('in');
    }

    open($this);
  };

  var _closeClickDinamic = function () {
    var $this = $(this),
        $selector = $this.closest('.ibe_form__group').children('.fc-people-counter-active');

    if ($(this).data('dinamic-close') === 'reset') {
      if ($selector) {
        dFrontJs.ibe_searcher_people_counter.restorePassenger($this, $selector);
      }
    } else if ($(this).data('dinamic-close') === 'save') {
      if ($selector) {
        dFrontJs.ibe_searcher_people_counter.savePassenger($this, $selector);
      }
    }

    close($this);
  };

  var init = function () {
    $('[data-dinamic-close]').off('click', _closeClickDinamic);
    $('[data-dinamic-close]').on('click', _closeClickDinamic);
    $('[data-dinamic-open]').off('click', _openClickDinamic);
    $('[data-dinamic-open]').on('click', _openClickDinamic);
  };

  var resize = function () {
    if (window.innerWidth >= dFrontJs.resolutions.lg) {
      if ($('body').css('overflow', 'hidden')) {
        $('body').css('overflow', 'auto');
      }

      if ($('.ibe-dinamic-modal').length > 0) {
        $('.ibe-dinamic-modal').removeClass('ibe-dinamic-modal');
      }
    }
  };

  return {
    "init": init,
    "open": open,
    "close": close,
    "resize": resize
  };
}(jQuery);
"use strict";

dFrontJs.ibe_floatbanner = function () {
  function renderFloatBackground(banner, img) {
    banner.css('background-image', 'url("' + img + '")');
  } // Event CLICK


  var init = function () {
    var banner = $('[data-floatbackground]');
    banner.each(function () {
      var img = $(this).data("floatbackground");
      $(this).attr('data-floatbackground', '');
      renderFloatBackground($(this), img);
    });
  };

  return {
    "init": init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_slick_gift_cards = function () {
  var calculateHeightsBanner = function (event) {
    if (event && event.type === 'resize') {
      $('[data-giftcardcalculatedheigth]').each(function () {
        $(this).height('auto');
      });
    }

    function calculateMaxHeight(selector) {
      var aux = [];
      var result = -1;
      $(selector).each(function () {
        aux.push($(this).height());
      });

      if (aux.length > 0) {
        result = Math.max.apply(Math, aux);
      }

      return result;
    }

    function applyHeight(selector, heightVal) {
      if (typeof heightVal === 'number' && heightVal > 0) $(selector).each(function () {
        $(this).height(heightVal);
        $(this).attr('data-giftcardcalculatedheigth', '');
      });
    }

    requestAnimFrame(function () {
      var $slick = $('[data-slick="carrousel-gift-cards"]');
      var item = $slick.find('.ibe-banner-full__item');
      applyHeight(item, calculateMaxHeight(item));
    });
  };

  var init = function () {
    var $slick = $('[data-slick="carrousel-gift-cards"]'),
        items = $('[data-slick="carrousel-gift-cards"] [data-item]');
    $('.ibe-gift-card__price').each(function () {
      if ($(this).html().length > 5) {
        $(this).addClass('ibe-gift-card__price--long-coins');
      }
    });

    if (items.length >= 1) {
      window.addEventListener('resize', calculateHeightsBanner);
      $slick.on('init', calculateHeightsBanner);
      items.removeClass('hidden');
      $slick.slick({
        dots: true,
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        variableWidth: true,
        adaptiveHeight: true,
        cssEase: 'linear',
        speed: 400
      });
    } else {
      $slick.slick({
        dots: false,
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        variableWidth: true,
        adaptiveHeight: true,
        cssEase: 'linear',
        speed: 400
      });
    }
  };

  return {
    "init": init
  };
}(jQuery);
"use strict";

dFrontJs.ibe_slick = function () {
  var calculateHeight = function (box) {
    if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) {
      dFrontJs.app.calculateHeightComponents(box, false);
    } else {
      dFrontJs.app.adaptHeight(box);
    }
  };

  var inicializateSlick = function (slick) {
    slick.not('.slick-initialized').slick({
      dots: true,
      arrows: false,
      slidesToShow: 2,
      slidesToScroll: 2,
      infinite: false,
      variableWidth: true,
      adaptiveHeight: true,
      responsive: [{
        breakpoint: 768,
        infinite: false,
        variableWidth: true,
        adaptiveHeight: true,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }, {
        breakpoint: 1024,
        infinite: false,
        variableWidth: true,
        adaptiveHeight: true,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }, {
        breakpoint: 10000,
        settings: 'unslick'
      }]
    });
  };

  var init = function () {
    var box = $('[data-resize="info-box"]'),
        slick = $('[data-slick="info-box"]');
    inicializateSlick(slick);
    calculateHeight(box);
  }; //


  return {
    "init": init,
    "calculateHeight": calculateHeight,
    "inicializateSlick": inicializateSlick
  };
}(jQuery);
"use strict";

/* eslint-disable no-extend-native */

/* eslint-disable prefer-rest-params */

/* eslint-disable prefer-destructuring */

/* eslint-disable no-bitwise */

/* eslint-disable newline-per-chained-call */

/* eslint-disable max-len */

/* eslint-disable camelcase */

/* eslint-disable no-var */
//* ****************************************************************************
// Document ready
//* *****************************************************************************/

/* eslint no-underscore-dangle: ['error', { 'allow': ['_tooltipTouchStartClick', '_disableClickbodyClick', '_ibeSeacherFocusout', '_collapseTouchstart','_documentTouchstart',
  '_documentGeneralClick', '_sameoofficeClick'] }] */
// import { loadjsfile } from '../inte-modules/ibe-modules/general/ibe_inte-util';
var is_touch_device = () => 'ontouchstart' in window;

var getAtributes = function ($node) {
  var attrs = {};
  $.each($node[0].attributes, (index, attribute) => {
    attrs[attribute.name] = attribute.value;
  });
  return attrs;
};

var mobile;
var desktop;

var checkResolution = function () {
  var thisResolution = window.innerWidth;

  if (thisResolution >= dFrontJs.resolutions.xl) {
    return 'xl';
  }

  if (thisResolution >= dFrontJs.resolutions.lg && thisResolution < dFrontJs.resolutions.xl) {
    return 'lg';
  }

  if (thisResolution >= dFrontJs.resolutions.md && thisResolution < dFrontJs.resolutions.lg) {
    return 'md';
  }

  if (thisResolution >= dFrontJs.resolutions.sm && thisResolution < dFrontJs.resolutions.md) {
    return 'sm';
  }

  if (thisResolution >= dFrontJs.resolutions.xs && thisResolution < dFrontJs.resolutions.sm) {
    return 'xs';
  }
}; //--------------------------


var fnReady = function () {
  var _sameoofficeClick;

  dFrontJs.ibe_check.init('[data-control="check"]');
  dFrontJs.app.init(); // Eventos jquery

  if (window.innerWidth < dFrontJs.resolutions.lg && $('.ibe-searcher__vintage').length > 0) {
    dFrontJs.ibe_modals_vintage.init(); // Modals in vintage
  }

  dFrontJs.ibe_resize.init(); // Componentsloca

  dFrontJs.ibe_view_more.init();
  dFrontJs.ibe_combobox.init(); // Inicializar libreria selectize

  dFrontJs.ibe_placeholder.init(); // Inicializar jquery placeholder

  dFrontJs.ibe_accordion.init(); // Inicializar accordion jquery accordion

  dFrontJs.ibe_popover.init(); // Inicializar popover bootstrap

  if ($('[data-dotdotdot]').length > 0) {
    // loadjsfile(`components/ibe-box-elllipsis.js`);
    dFrontJs.ibe_box_ellipsis.init(); // Inicializar dotdotdot colapsar texto
  }

  if ($('[data-progressbar]').length > 0) {
    dFrontJs.ibe_progressbar.init(); // Inicializar progressbar
  }

  if ($('[data-tooltip="bootstrap"]').length > 0 || $('[data-tooltipGeneric]').length > 0) {
    dFrontJs.ibe_tooltip.init(); // Inicializar tooltip
  } // if ($('[data-datatable]').length > 0) {


  dFrontJs.ibe_datatable.init(); // Inicializar datatable pagination
  // }

  if ($('[data-slick]').length > 0 || $('[data-theta-carousel]').length > 0) {
    dFrontJs.ibe_carousel.init(); // Inicializar slick carrousel
  }

  if ($('[data-wwo]').length > 0) {
    dFrontJs.ibe_wwo.init('[data-wwo="day-1"]');
  }

  if ($('[data-tab]').length > 0) {
    dFrontJs.ibe_tab.init(); // Inicializar tab jquery ui
  }

  if ($('.ibe-searcher-room').length > 0) {
    dFrontJs.ibe_searcher_room.init();
  }

  if ($('.ibe-people-counter').length > 0) {
    dFrontJs.ibe_searcher_people_counter.init();
  }

  dFrontJs.ibe_overlay.init();

  if ($('[data-video]').length > 0) {
    dFrontJs.ibe_video.init();
  }

  dFrontJs.ibe_inputs.init();
  dFrontJs.ibe_bootstrap_collapse.init();

  if ($('[data-tweets="wall"]').length > 0) {
    dFrontJs.ibe_tweet_wall.init();
  }

  if ($('[data-guide="open-modal"]').length > 0 || $('[data-guide="close-modal"]').length > 0) {
    dFrontJs.ibe_guide.init();
  } // if ($('[data-validate="origin-destiny"]').length > 0) {
  //    dFrontJs.ibe_validate.initValCity('[data-validate="origin-destiny"]');
  // }


  if ($('[data-show-hide]').length > 0) {
    dFrontJs.ibe_show_hide_element.init();
  }

  if ($('a[title]').find('img[title]').parents('a')) {
    dFrontJs.ibe_accessibility.imgTitle();
  }

  if ($('[data-filter]').length > 0) {
    dFrontJs.ibe_filter.init();
  }

  dFrontJs.ibe_loading.init();

  if ($('[data-ibe-select-tab]').length > 0) {
    dFrontJs.ibe_select_tab.init();
  }

  if ($('[data-selectmenu]').length > 0 || $('[data-selectmenu-edit]').length > 0 || $('[data-selectmenu_claim]').length > 0) {
    dFrontJs.ibe_selectmenu.init();
  }

  if ($('[data-function="masonry"]').length > 0) {
    dFrontJs.ibe_tweets.init('[data-function="masonry"]', '[data-function="masonry"] li');
  }

  if ($('[data-validate-searcher]').length > 0) {
    dFrontJs.ibe_validations_searcher.init();
  }

  if ($('[data-searcher_room-selectmenu]').length > 0) {
    dFrontJs.ibe_searcher_room_selectmenu.init();
  }

  if ($('[data-people-counter-button-selectmenu]').length > 0) {
    dFrontJs.ibe_searcher_people_counter_selectmenu.init();
  }

  if ($('.ibe-searcher__passenger').length > 0) {
    dFrontJs.ibe_passenger.init();
  }

  if ($('[data-textarea]').length > 0) {
    dFrontJs.ibe_textarea.init();
  }

  dFrontJs.ibe_uploadfile.init();
  dFrontJs.ibe_outsideclick.init();
  dFrontJs.ibe_validate.init();
  dFrontJs.ibe_card_box.calculateHeightText();
  dFrontJs.ibe_menu_new.init();
  dFrontJs.ibe_headerNew.init();
  dFrontJs.ibe_dateFormat.init(); // Elegir formato de fecha

  dFrontJs.ibe_modal.init(); // Escape Collapse [data-cal] inputs and collapse start and end calendars

  dFrontJs.ibe_escape.init($('[data-cal]'), '.ibe_form__group');
  dFrontJs.ibe_escape.init($('.ibe-searcher__calendar--start'), '.ibe_form__group');
  dFrontJs.ibe_escape.init($('.ibe-searcher__calendar--end'), '.ibe_form__group');

  if ($('[data-keyboard-close]').length > 0) {
    dFrontJs.ibe_keyboard_action.close($('[data-keyboard-close]'));
  }

  dFrontJs.ibe_warnings.init(); // Warnings

  dFrontJs.ibe_device_apps.init(); // Detect the operation system

  dFrontJs.ibe_focusin.init(); // Focusin

  if ($('[data-cal="claim"]').length > 0) {
    dFrontJs.ibe_form_calendar.init(); // Datepicker for de forms
  } // Detail in table


  if ($('[data-flight-status-table]').length > 0) {
    dFrontJs.ibe_data_flight_status_table.init();
  } // Version con data attribute

  /* if($('[data-box^="box-icon-"]').length > 0){
      dFrontJs.ibe_box_icon.init();
  } */
  // Si encuentra más de un box icon entonces tenemos una lista


  if ($('.ibe-flight-status__section').find('.ibe-infocheckin__box--icon').length > 1) {
    dFrontJs.ibe_box_icon.init();
  }

  dFrontJs.app.inviewFunction();

  if ($('[data-gifanimated]').length > 0) {
    dFrontJs.app.gifFunction(); // Start or Stop Gif Animated
  }

  if ($('[data-img-anim]').length > 0) {
    dFrontJs.app.imgAnim(); // Start Image Animation
  }

  if ($('.ibe-searcher__vintage').length > 0) {
    dFrontJs.ibe_searcher_vintage.init();
  }

  if ($('[data-function="discount"]').length > 0) {
    dFrontJs.ibe_card_discount.init();
  } // Inicializador del calendar solo cuando existe


  if ($('[data-function="cal-start"]').length > 0) {
    dFrontJs.ibe_searcher_calendar.init();
  }

  if ($('[data-function="show-qr"]').length) {
    dFrontJs.ibe_qr.init('[data-function="show-qr"]');
  }

  $('.ibe-home .slick-menu.slick-full-window article.row').addClass('hidden').parent().find('article.row:not("slick-cloned")').eq(dFrontJs.app.indexCarouselCardAirplane).removeClass('hidden'); // CRR: Insertamos esta condicion para que las modales del menu vintage se eejcuten en movil correctamente

  if (window.innerWidth < dFrontJs.resolutions.lg && $('.ibe-searcher__vintage').length > 0) {
    dFrontJs.ibe_modals_vintage.init(); // Modals in vintage
  }

  if (window.innerWidth >= dFrontJs.resolutions.lg) {
    dFrontJs.ibe_searcher_accordion.init(); // dFrontJs.ibe_overlay.init();

    setTimeout(() => {
      $('[data-tab-view="responsive"]').find('[data-active]').eq($('[data-tab-view="desktop"]').attr('data-tab-active')).click();
    }, 500);
  } else {
    $('.ibe-header').addClass('fc-init'); // dFrontJs.ibe_searcher_accordion_mobile.init();   //Comment to charge in main.js for Ajax tabs //Se comenta porque se carga en el main por la carga Ajax de los tabs

    dFrontJs.ibe_searcher_accordion_mobile.showFirst();
    dFrontJs.ibe_bootstrap_collapse.hideCollapse('[data-collapse="hide-resize"]');
    dFrontJs.ibe_inputs.init(); // dFrontJs.ibe_overlay.init();

    setTimeout(() => {
      $('[data-tab-view="responsive"]').find('[data-active]').eq($('[data-tab-view="desktop"]').attr('data-tab-active')).click();
    }, 500);
  }

  setTimeout(() => {
    dFrontJs.ibe_scrollTop.init();
  }, 600); // Function for banner with background in float

  if ($('[data-floatbackground]').length > 0) {
    dFrontJs.ibe_floatbanner.init();
  } // Dfront Columns list


  checkDeviceColumnList(false); // Vista info_checkin

  if ($('.ibe-vidBanner__text').length > 0) {
    dFrontJs.app.resizeHeight('.ibe-vidBanner__text');
  }

  if ($('[data-resize="card-distributive-1"]').length > 0) {
    dFrontJs.app.resizeHeight('[data-resize="card-distributive-1"]');
  }

  if ($('[data-resize="card-distributive-2"]').length > 0) {
    dFrontJs.app.resizeHeight('[data-resize="card-distributive-2"]');
  } // Vista Equipaje de mano


  if ($('[data-fc-box-height]').length) {
    dFrontJs.app.calculateHeightComponents('.ibe-box-divided', '[data-fc-box-height]');
    dFrontJs.app.calculateHeightComponents('.ibe-box-divided', '[data-fc-box-title-height]');
  } // ibe-link-card


  if ($('.ibe-card-link--auto-height').length) {
    dFrontJs.app.calculateHeightComponentsCard('.ibe-card-link--auto-height', '.ibe-card-link__info');
    dFrontJs.app.calculateHeightComponentsCard('.ibe-card-cont--auto-height', '.ibe-card-cont__container');
  } // ibe-link-card--news


  if ($('.ibe-card-link--auto-height-xs').length) {
    dFrontJs.app.calculateHeightComponentsCard('.ibe-card-link--auto-height-xs', '.ibe-card-link__info');
  } // ibe-card--auto-height


  if ($('.ibe-card--auto-height').length) {
    dFrontJs.app.calculateHeightComponentsCard('.ibe-card--auto-height', '.ibe-card-link__info');
  } // ibe-card-box--auto-height
  // if ($(".ibe-card-box__title--auto-height").length) {
  //   dFrontJs.ibe_card_box.calculateHeightBox(".ibe-card-box__title--auto-height", ".ibe-card-box__title");
  // }


  if ($('.ibe-card-box__content--auto-height').length) {
    dFrontJs.ibe_card_box.calculateHeightBox('.ibe-card-box__content--auto-height', '.ibe-card-box__content');
  }

  if ($('.ibe-card-box__container--auto-height').length) {
    dFrontJs.ibe_card_box.calculateHeightBox('.ibe-card-box__container--auto-height', '.ibe-card-box__container');
  }

  if ($('[data-function^="google-gallery"]').length) {
    dFrontJs.ibe_gallery.init('[data-function^="google-gallery"]');
  } //* ***************************************************************************************************
  //* ** Recogida y devolucion de coche (misma ciudad o ciudades diferentes) en el buscador de vuelos ***
  //* ***************************************************************************************************


  if ($('[data-function="sameoffice"]').length) {
    _sameoofficeClick = function () {
      if ($(this).is(':checked')) {
        $(this).parents('.ibe-tab__container-desktop').find('.ibe-searcher__car-diferent-city').addClass('xui-car-city-hide');
        $(this).parents('.ibe-tab__container-desktop').find('.ibe-searcher__car-same-city').removeClass('xui-car-city-hide');
      } else {
        $(this).parents('.ibe-tab__container-desktop').find('.ibe-searcher__car-diferent-city').removeClass('xui-car-city-hide');
        $(this).parents('.ibe-tab__container-desktop').find('.ibe-searcher__car-same-city').addClass('xui-car-city-hide');
      }
    };

    $('[data-function="sameoffice"]').off('click', _sameoofficeClick);
    $('[data-function="sameoffice"]').on('click', _sameoofficeClick);
  } //* **********************************************************************************
  //* ** Cierre de elemento de galeria cuando hacemos scroll en la lista de imagenes ***
  //* **********************************************************************************


  if ($('[data-function="google-gallery"]').length) {
    $('[data-function="google-gallery"] .ibe-food-table__list').bind('touchmove', () => {
      $('[data-function="google-gallery"]').find('.GI_TW_close').trigger('touchstart');
    });
    $('[data-function="google-gallery"] .ibe-food-table__link').bind('click', e => {
      var target = e.target || e.srcElement;
      $('.ibe-food-table__list').stop().animate({
        scrollLeft: $(target).parents('.ibe-food-table__item')[0].offsetLeft
      }, 500);
    });
  }

  $('[data-day-calendar] [data-function="cal-end"] .ui-datepicker-current-day').removeClass('ui-datepicker-current-day');
  requestAnimFrame(() => {
    $('[data-tab="bootstrap-tabdrop"]').trigger('resize');
  }, 700); // Function for ib-slick

  if ($('[data-slick="info-box"]').length > 0) {
    dFrontJs.ibe_slick.init();
  }

  if ($('[data-slick="carrousel-gift-cards"]').length > 0) {
    dFrontJs.ibe_slick_gift_cards.init();
  } // Function for dinamic modals


  if ($('[data-dinamic-open]').length > 0) {
    dFrontJs.ibe_dinamic_modal.init();
  } // Function for banner with background


  if ($('[data-background]').length > 0) {
    dFrontJs.ibe_banner.init();
  } // Function for click input and toggle content


  if ($('[data-toggle-element]').length > 0) {
    dFrontJs.ibe_collapse.init();
  } // Function for calculate night


  if ($('[data-max-night]').length > 0) {
    dFrontJs.ibe_counter_night.init();
  } // compact searcher

  /* if ($('[data-function="data-compact-searcher"]').length > 0) {
    dFrontJs.ibe_compact_search.init('[data-compact-searcher="trigger"]');
  } */
  // Function for compact offers


  if ($('[data-function="data-offers-collapser"]').length > 0) {
    $('[data-function="data-offers-collapser"]').each(function (index) {
      $(this).attr('data-offers-id', index);
      dFrontJs.ibe_compact_offers.init("[data-offers-id=\"".concat(index, "\"]"), index);
    });
  }

  if ($('[data-chart]').length > 0) {
    dFrontJs.ibe_chart.init();
  }
};

var reload = function ($selector) {
  fnReady();
  $(window).trigger('load');
};

$(document).ready(fnReady);

DOMTokenList.prototype.addMany = function (classes) {
  var i;
  var array = classes.split(' ');

  for (i = 0, length = array.length; i < length; i++) {
    this.add(array[i]);
  }
};

window.requestAnimFrame = (() => window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (
/* function */
callback,
/* DOMElement */
element) {
  window.setTimeout(callback, 1000 / 60);
})();

window.requestIdleCallback = window.requestIdleCallback || function (cb) {
  var start = Date.now();
  return setTimeout(() => {
    cb({
      didTimeout: false,

      timeRemaining() {
        return Math.max(0, 50 - (Date.now() - start));
      }

    });
  }, 1);
};

window.cancelIdleCallback = window.cancelIdleCallback || function (id) {
  clearTimeout(id);
};

if (window.innerWidth >= dFrontJs.resolutions.lg) {
  desktop = true;
  mobile = false;
} else {
  desktop = false;
  mobile = true;
} // polyfills


if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;

    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);

    return null;
  };
}

if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value(predicate) {
      var o;
      var len;
      var thisArg;
      var k;
      var kValue; // 1. Let O be ? ToObject(this value).

      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      o = Object(this); // 2. Let len be ? ToLength(? Get(O, "length")).

      len = o.length >>> 0; // 3. If IsCallable(predicate) is false, throw a TypeError exception.

      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      } // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.


      thisArg = arguments[1]; // 5. Let k be 0.

      k = 0; // 6. Repeat, while k < len

      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        kValue = o[k];

        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        } // e. Increase k by 1.


        k++;
      } // 7. Return undefined.


      return undefined;
    },

    configurable: true,
    writable: true
  });
}

(function () {
  if (typeof window.CustomEvent === 'function') return false;

  function CustomEvent(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})(); //* ****************************************************************************
// Window onload
//* *****************************************************************************/


window.onload = function () {
  var cardIberiaPlus;

  var _tooltipTouchStartClick;

  var _ibeSeacherFocusout;

  var _collapseTouchstart;

  var _documentGeneralClick; // Vista preapara tu equipaje


  if ($('[data-function="prepare-baggage"]').length) {
    dFrontJs.app.resizeHeight('[data-function="prepare-baggage"]');
  }

  if ($('[data-function="prepare-baggage-child"]').length) {
    dFrontJs.app.calculateHeightComponents('[data-function="prepare-baggage"]', '[data-function="prepare-baggage-child"]');
  }

  if ($('[data-resize="gallery"]').length > 0) {
    dFrontJs.app.calculateHeightMin('.ibe-infocheckin__box--gallery', '[data-resize="gallery"]');
  } // Alturas de ibe-minibox-icon


  if ($('[data-fc-minibox-height]').length) {
    dFrontJs.app.calculateHeightComponents('[data-fc-minibox-height]', false);
    dFrontJs.app.calculateHeightComponents('[data-fc-minibox-height]', '.ibe-minibox-icon__title');
  }

  if ($('[data-fc-minibox-loged-height]').length) {
    dFrontJs.app.calculateHeightComponents('[data-fc-minibox-loged-height]', false);
    dFrontJs.app.calculateHeightComponents('[data-fc-minibox-loged-height]', '.ibe-minibox-icon__title');
  } // Vista Tarjetas de Iberia Plus


  cardIberiaPlus = '[data-card-iberia-plus="auto-height"]';

  if ($(cardIberiaPlus).length > 0) {
    dFrontJs.app.calculateHeightComponents(cardIberiaPlus, '.ibe-card-iberia-plus__header');
    dFrontJs.app.calculateHeightComponents(cardIberiaPlus, '.ibe-card-iberia-plus__body');
  }

  if ($('.ibe-ckeckin__list').length > 0) {
    dFrontJs.app.calculateHeightComponents('.ibe-ckeckin__list-container', '.ibe-ckeckin__list-box');
  }

  if ($('.ioslist-wrapper').length) {
    $('.ioslist-wrapper').scrollTop(0);
  } // Function for checkbox for personal or legal person


  if ($('[data-type="personal"]').length) {
    dFrontJs.app.hideShowCompanyPersonal();
  } // Añadir calculo de altura para template que no sea emergency


  if ($('[data-fc-height]').length > 0) {
    $('[data-fc-height]').each(function () {
      var number;

      if (!$(this).hasClass('fc-calculated')) {
        number = $(this).attr('data-fc-height');
        dFrontJs.app.calculateHeightComponents("[data-fc-height=".concat(number, "]"), false);
      }
    });
  } // Igualar altura de la cabecera de (guide-chicago)


  if ($('[data-guide="header"]').length) {
    dFrontJs.app.calculateHeightHeaderGuides('[data-guide="header"]');
  } // Poner input en modo lectura en selectize simples.


  if ($('[data-select="true"]').length > 0) {
    $('.ibe_form__selectize--only-select.selectize-control').find('input').addClass('input-readonly');
    $('.ibe_form__selectize--only-select.selectize-control').find('input').attr('readonly', 'readonly');
  }

  _tooltipTouchStartClick = function (e) {
    var $buttonClose = $(this);
    var $toolt = $buttonClose.closest('.ibe-message-tooltip');

    var _disableClickbodyClick = function () {
      $toolt.removeClass('hidden');
      $toolt.css('display', '');
    };

    if (e.type === 'touchstart') {
      $toolt.hide('slow', () => {
        setTimeout(() => {
          $('.disabledClick').remove();
          $toolt.addClass('hidden');
          $('.disabledClick,body').off('click', _disableClickbodyClick);
          $('.disabledClick,body').on('click', _disableClickbodyClick);
        }, 100);
      });
      e.stopPropagation();
    } else {
      $toolt.hide('slow');
      setTimeout(() => {
        $toolt.css('display', '');
      }, 1000);
    }
  };

  $('.ibe-message-tooltip__button-close').off('touchstart click', _tooltipTouchStartClick);
  $('.ibe-message-tooltip__button-close').on('touchstart click', _tooltipTouchStartClick);

  _ibeSeacherFocusout = function (event) {
    var $elem = $(this);
    var hasFocus;
    setTimeout(() => {
      if (!$elem.parent().hasClass('ibe_form__box')) {
        hasFocus = $elem.closest('.ibe_form__group, .ibe-searcher__passenger, .ibe-searcher__calendar-header').find(':focus, .new-clicked-element').length;

        if (!hasFocus && !focusArrow) {// selectFocus(target);
        } else {
          $('body').on('click', function cd(e) {
            var target = e.target || e.srcElement;
            var tar = $(target);

            if (!tar.closest('[data-event="click"]').length && !$elem.closest('.ibe_form__group, .ibe-searcher__passenger').find(tar).length && tar.length == 1 && tar[0].localName != 'body') {
              selectFocus($elem);
            }

            $(this).unbind('click', cd);
          });
        }
      }
    }, 200);
  };

  $('.ibe-searcher [data-toggle="collapse"]').off('focusout', _ibeSeacherFocusout);
  $('.ibe-searcher [data-toggle="collapse"]').on('focusout', _ibeSeacherFocusout);

  _collapseTouchstart = function (event) {
    var $elem = $(this);

    var _documentTouchstart = function (e) {
      var target = e.target || e.srcElement;
      var tar = $(target);

      if (!tar.closest('[data-event="click"]').length && !$elem.closest('.ibe_form__group, .ibe-searcher__passenger').find(tar).length && tar.length == 1 && tar[0].localName != 'body') {
        selectFocus($elem);
      }
    };

    $(document).on('touchstart', _documentTouchstart);
    $(document).on('touchstart', _documentTouchstart);
  };

  if (navigator.userAgent.match(/(ipad)/i)) {
    $('[data-tab-view="desktop"] [data-toggle="collapse"], [data-tab-view="desktop"] [data-cal-button]').off('touchstart', _collapseTouchstart);
    $('[data-tab-view="desktop"] [data-toggle="collapse"], [data-tab-view="desktop"] [data-cal-button]').on('touchstart', _collapseTouchstart);
  }

  function selectFocus(obj) {
    obj = $(obj);

    if (obj.closest('.ibe_form__group, .ibe-searcher__passenger')) {
      dFrontJs.ibe_bootstrap_collapse.hideCollapse(obj.closest('.ibe_form__group, .ibe-searcher__passenger').find('[data-toggle="container"]'));
    }
  }

  _documentGeneralClick = function () {
    if ($('.ibe-modal').is(':visible')) {
      $('body').addClass('modal-open');

      if (navigator.userAgent.match(/(iPhone)|(iPad)|(iPod)/i)) {
        $('body').addClass('menu-action modal-open').css('position', 'relative');
        $('html').css('overflow', 'auto');
        $('body').addClass('modal-ios');
      }
    } else if ($('.ibe-modal:visible').length === 0 && $('body').hasClass('modal-open')) {
      $('body').removeClass('modal-open').removeClass('modal-ios');
    }
  };

  $(document).off('click', _documentGeneralClick);
  $(document).on('click', _documentGeneralClick); // setTimeout(function(){$('[data-tab="bootstrap-tabdrop"]').trigger('resize')}, 700);
}; //* ****************************************************************************
// Window resize
//* *****************************************************************************/


$(window).on('resize', function () {
  var $slickInfo;
  var win;
  var $vid_banner;
  var $vintage;
  var cardIberiaPlus;

  if (window.innerWidth >= dFrontJs.resolutions.lg) {
    mobile = false;
    desktop = true;
  } else {
    mobile = true;
    desktop = false;
  }
  /** ***************************************************************************** */

  /* -------------------- MODULE INFO - STOPOVER ----------------------------------*/

  /** ***************************************************************************** */


  $slickInfo = $('[data-slick="info-box"]');

  if ($slickInfo.length > 0) {
    dFrontJs.ibe_slick.init();
  }
  /** ***************************************************************************** */

  /* -------------------- MODULE INFO - STOPOVER ----------------------------------*/

  /** ***************************************************************************** */
  // Function for banner with background


  if ($('[data-background]').length > 0) {
    dFrontJs.ibe_banner.init();
  }
  /** **************************************************************************** */
  // Function for dinamic modals


  if ($('[data-dinamic-open]').length > 0) {
    dFrontJs.ibe_dinamic_modal.resize();
  }

  if ($('[data-date-large]').length > 0) {
    dFrontJs.ibe_dateFormat.init(); // Elegir formato de fecha
  }

  if (!dFrontJs.ibe_resize.resolutionChange(window.innerWidth)) {
    setTimeout(() => {
      $('[data-tab="bootstrap-tabdrop"]').trigger('resize');
    }, 50);
    return false;
  } // Loading


  dFrontJs.ibe_loading.init();

  if (window.innerWidth >= dFrontJs.resolutions.md) {
    desktop = true;
  } else {
    desktop = false;
  } // vista info_checkin


  win = $(this);
  $vid_banner = $('.ibe-vidBanner__text');

  if ($vid_banner.length > 0) {
    if (win.width() < dFrontJs.resolutions.lg && win.width() >= dFrontJs.resolutions.md) {
      dFrontJs.app.resizeHeight('.ibe-vidBanner__text');
    } else {
      $vid_banner.css('height', 'auto');
    }
  }

  checkDeviceColumnList(true);

  if (window.innerWidth >= dFrontJs.resolutions.lg) {
    dFrontJs.ibe_searcher_accordion.init();
    dFrontJs.ibe_inputs.init(); // dFrontJs.ibe_overlay.init();

    $('body').removeClass('modal-open');
    $vintage = $('.ibe-searcher__vintage');

    if ($vintage.length > 0) {
      dFrontJs.ibe_modals_vintage.closeModalDatepicker();
      dFrontJs.ibe_modals_vintage.closeModalsVintage(); // $("[data-cal='end'],[data-cal='start']").off('focus click', dFrontJs.ibe_modals_vintage.openModalDatepicker());
    }
  } else {
    if (navigator.userAgent.match(/(Android)|(webOS)|(BlackBerry)|(Windows Phone)|(iPhone)|(iPad)|(iPod)/i)) {
      dFrontJs.ibe_searcher_accordion_mobile.init();
      dFrontJs.ibe_bootstrap_collapse.hideCollapse('[data-collapse="hide-resize"]');
      dFrontJs.ibe_inputs.init(); // dFrontJs.ibe_overlay.init();
    } else {
      dFrontJs.ibe_searcher_accordion_mobile.init();
      dFrontJs.ibe_bootstrap_collapse.hideCollapse('[data-collapse="hide-resize"]');
      dFrontJs.ibe_inputs.init(); // dFrontJs.ibe_overlay.init();
    }

    $vintage = $('.ibe-searcher__vintage');

    if ($vintage.length > 0) {
      dFrontJs.ibe_modals_vintage.init();
    }

    dFrontJs.ibe_headerNew.init();
  } // Init Overlay and Inputs Animation in Resize Event


  $('.ibe-accordion__button').parent().removeClass('ibe-accordion__overlay-button'); // vista layout-card-link

  if ($('.ibe-card-link--auto-height').length > 0) {
    dFrontJs.app.calculateHeightComponentsCard('.ibe-card-link--auto-height', '.ibe-card-link__info');
    dFrontJs.app.calculateHeightComponentsCard('.ibe-card-cont--auto-height', '.ibe-card-cont__container');
  } // ibe-link-card--news


  if ($('.ibe-card-link--auto-height-xs').length) {
    dFrontJs.app.calculateHeightComponentsCard('.ibe-card-link--auto-height-xs', '.ibe-card-link__info');
  } // ibe-card-box
  // if ($(".ibe-card-box__title--auto-height").length) {
  //   dFrontJs.ibe_card_box.calculateHeightBox(".ibe-card-box__title--auto-height", ".ibe-card-box__title");
  // }


  if ($('.ibe-card-box__content--auto-height').length) {
    dFrontJs.ibe_card_box.calculateHeightBox('.ibe-card-box__content--auto-height', '.ibe-card-box__content');
  } // ibe-card--auto-height


  if ($('.ibe-card--auto-height').length) {
    dFrontJs.app.calculateHeightComponentsCard('.ibe-card--auto-height', '.ibe-card-link__info');
  } // vista layout-card-distributive


  if ($('[data-resize="card-distributive-1"]').length > 0) {
    dFrontJs.app.resizeHeight('[data-resize="card-distributive-1"]');
  }

  if ($('[data-resize="card-distributive-2"]').length > 0) {
    dFrontJs.app.resizeHeight('[data-resize="card-distributive-2"]');
  } // Vista Equipaje de mano


  if ($('[data-fc-box-height]').length) {
    dFrontJs.app.calculateHeightComponents('.ibe-box-divided', '[data-fc-box-height]');
    dFrontJs.app.calculateHeightComponents('.ibe-box-divided', '[data-fc-box-title-height]');
  } // Vista preapara tu equipaje


  if ($('[data-function="prepare-baggage"]').length) {
    dFrontJs.app.resizeHeight('[data-function="prepare-baggage"]');
  }

  if ($('[data-function="prepare-baggage-child"]').length) {
    dFrontJs.app.calculateHeightComponents('[data-function="prepare-baggage"]', '[data-function="prepare-baggage-child"]');
  } // Alturas de ibe-minibox-icon


  if ($('[data-fc-minibox-height]').length) {
    dFrontJs.app.calculateHeightComponents('[data-fc-minibox-height]', false);
    dFrontJs.app.calculateHeightComponents('[data-fc-minibox-height]', '.ibe-minibox-icon__title');
  }

  if ($('[data-fc-minibox-loged-height]').length) {
    dFrontJs.app.calculateHeightComponents('[data-fc-minibox-loged-height]', false);
    dFrontJs.app.calculateHeightComponents('[data-fc-minibox-loged-height]', '.ibe-minibox-icon__title');
  } // Mover check avios en el buscador de puente aereo


  if ($('.ibe-advanced-searcher__puente').length > 0) {
    dFrontJs.ibe_searcher_calendar.moveCheckAviosPuente();
  } // Añadir calculo de altura para template que no sea emergency


  if ($('[data-fc-height]').length > 0) {
    $('[data-fc-height]').each(function () {
      var number = $(this).attr('data-fc-height');
      dFrontJs.app.calculateHeightComponents("[data-fc-height=".concat(number, "]"), false);
    });
  }

  if ($('.ibe-ckeckin__list').length > 0) {
    dFrontJs.app.calculateHeightComponents('.ibe-ckeckin__list', '.ibe-ckeckin__list-box');
  } // Resize Steps para partners


  if ($('.ibe-card-steps').length > 0) {
    dFrontJs.app.calculateHeightComponents('.ibe-card-steps', '.ibe-card-steps__box');
  } // cambio de numero de meses en datepicker


  if ($('[data-function="cal-start"]').length) {
    if (window.innerWidth < dFrontJs.resolutions.md) {
      $('[data-function="cal-start"]').datepicker('option', 'numberOfMonths', 1);
      $('[data-function="cal-end"]').datepicker('option', 'numberOfMonths', 1);
    } else {
      $('[data-function="cal-start"]').datepicker('option', 'numberOfMonths', 2);
      $('[data-function="cal-end"]').datepicker('option', 'numberOfMonths', 2);
    }

    if ($('[data-cal="start"][data-one-month]').length) {
      $('[data-cal="start"][data-one-month]').parents('.ibe_form__group').find('[data-function="cal-start"], [data-function="cal-end"]').datepicker('option', 'numberOfMonths', 1);
    }

    requestAnimFrame(() => {
      $('[data-cal="start"]').closest('.ibe_form__group--half').parent().find('.ibe-searcher__calendar').css('opacity', '1');
    });
  } // Vista Tarjetas de Iberia Plus


  cardIberiaPlus = '[data-card-iberia-plus="auto-height"]';

  if ($(cardIberiaPlus).length > 0) {
    dFrontJs.app.calculateHeightComponents(cardIberiaPlus, '.ibe-card-iberia-plus__header');
    dFrontJs.app.calculateHeightComponents(cardIberiaPlus, '.ibe-card-iberia-plus__body');
  }

  if (desktop) {
    $('.ibe-footer .ibe-footer__collapse').removeClass('collapse');
  } // Ocultar collapse en responsive


  if ($('[data-collapse="hide-resize"]').length > 0) {
    dFrontJs.ibe_bootstrap_collapse.hideCollapse('[data-collapse="hide-resize"]');
  }

  if ($('[data-guide="header"]').length) {
    dFrontJs.app.calculateHeightHeaderGuides('[data-guide="header"]');
  } // Ocultar Overlay con resize


  if (navigator.userAgent.match(/(Android)|(webOS)|(BlackBerry)|(Windows Phone)|(iPhone)|(iPad)|(iPod)/i)) {
    $('.ibe-overlay').hide();
    $('[data-function="data-focus-searcher-mobile"], [data-function="data-focus-searcher"]').css('z-index', '');
  }

  $('[data-function="data-focus-searcher"]').css('z-index', '');
  $('[data-toggle="accordion"]').children('[data-function="data-focus-text"]').removeClass('ibe-accordion__overlay-text');
  $('[data-toggle="link"]').children('[data-function="data-focus-text"]').removeClass('ibe-accordion__overlay-text');
  $('[data-toggle="link"]').children('[data-function="data-focus-text"]').css('z-index'); // activate new logged

  if ($('.popover').is(':visible')) {
    $('.ibe-overlay').show();
  } else {
    $('.ibe-overlay').hide();
    $('[data-function="data-focus-searcher-mobile"], [data-function="data-focus-searcher"]').css('z-index', '');
  } // dFrontJs.ibe_card_box.calculateHeightText();


  if ($('.ibe-searcher__vintage').length > 0) {
    if (window.innerWidth < dFrontJs.resolutions.lg) {// dFrontJs.ibe_modals_vintage.resizeMobile(); // Modals in vintage)
    } else {// dFrontJs.ibe_modals_vintage.resizeDesktop(); // Modals in vintage
    }
  }
}); // Dfront Columns list

function checkDeviceColumnList(responsive) {
  if (window.innerWidth < dFrontJs.resolutions.md && window.innerWidth >= dFrontJs.resolutions.xs) {
    dFrontJs.ibe_column_count(2, '[data-columns-list]', '[data-columns-list] .ibe-list-column .ibe-list-column__item', '.ibe-list-column', responsive);
  } else {
    dFrontJs.ibe_column_count(4, '[data-columns-list]', '[data-columns-list] .ibe-list-column .ibe-list-column__item', '.ibe-list-column', responsive);
  }
}