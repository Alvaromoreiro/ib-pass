dFrontJs.ibe_carousel = function () {
	/*eslint no-underscore-dangle: ['error', { 'allow': ['_calculateLazyImages', '_calculateLazyImagesInit'] }]*/
	var calculateHeightTitle = function () {

		$('.ibe-search-flights__cover--carousel-home').find('.title').each(function () {
			var $this = $(this);
			var lineHeight = parseInt($this.css('line-height'));
			var paddingBottom = parseInt($this.css('padding-bottom'));
			var paddingTop = parseInt($this.css('padding-top'));
			var total = parseInt($this.height());
			if (total > (lineHeight + paddingTop + paddingBottom)) {
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
					var src = (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ? e.target.src.split('.') : e.target.currentSrc.split('.')),
						type = src[src.length - 1],
						newSrc = (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ? e.target.src.split(type)[0] : e.target.currentSrc.split(type)[0]),
						currentSplit = (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ? e.target.src.split('/') : e.target.currentSrc.split('/')),
						current = (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ? currentSplit[currentSplit.length - 1] : currentSplit[currentSplit.length - 1]),
						resolution = checkResolution();
					// console.log(current)
					$source = $(this).parent().find('source');
					if (!$(this).hasClass('onErrorCheck-' + resolution)) {
						$(this).addClass('onErrorCheck-' + resolution);
						$(this).attr('src', newSrc + 'jpg');
						$(this).removeAttr('data-lazys');
						$source.each(function () {
							var currentsrcsetSplit = $(this).attr('srcset').split('/');
							var currentsrcset = currentsrcsetSplit[currentsrcsetSplit.length - 1];
							// console.log(currentsrcset)
							if (currentsrcset === current) {
								$(this).attr('srcset', $(this).attr('srcset').split(type)[0] + 'jpg');
								$(this).attr('type', 'image/jpg');
							}
						});
					}
				});
				$(this).addClass('lazyLoadCarousel');
			}
		})
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
				var src = (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ? e.target.src.split('.') : e.target.currentSrc.split('.')),
					type = src[src.length - 1],
					newSrc = (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ? e.target.src.split(type)[0] : e.target.currentSrc.split(type)[0]),
					currentSplit = (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ? e.target.src.split('/') : e.target.currentSrc.split('/')),
					current = (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ? currentSplit[currentSplit.length - 1] : currentSplit[currentSplit.length - 1]),
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
			totalSlides, slider, slideShowsConfig, slideItems, infiniteParam, titleSlide, elementR, parentR, element, parent,
			indexSlick;

		var pauseSlick = function () {
			$elementFM.slick('slickPause');
		}

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
				responsive: [
					{
						breakpoint: 1024,
						settings: {
							swipe: true
						}
					},
					{
						breakpoint: 480,
						settings: {
							arrows: true,
							centerMode: false,
							centerPadding: '',
							slidesToShow: 1,
							variableWidth: false,
							swipe: true
						}
					}
				]
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
					responsive: [
						{
							breakpoint: 480,
							settings: {
								arrows: false,
								centerMode: true,
								centerPadding: '',
								slidesToShow: 1,
								variableWidth: true,
								swipe: true
							}
						}
					]
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

				}
				//Add title
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
			}
			// Event open dialog
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
			});

			// Event close dialog
			$($elementG).parents('.ibe-dialog').on('dialogclose', function (event, ui) {
				$('body').css('overflow', 'auto');
				$($elementG).slick('unslick');
				$($elementGthumbs).slick('unslick');
				$('.fc-image-gallery').find('[data-slick="fc-slide"]').remove();
			});

			// Events slick
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
		if (($elementF.length > 0) && ($elementFM.length > 0)) {
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
				lazyLoad: 'ondemand',    // 'ondemand' or 'progressive',
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
				'responsive': [
					{
						'breakpoint': 1280,
						'arrows': true,
						'settings': {
							'slidesToShow': 3
						}
					},
					{
						'breakpoint': 1024,
						'arrows': true,
						'settings': {
							'slidesToShow': 3
						}
					},
					{
						'breakpoint': 768,
						'settings': {
							'arrows': false,
							'variableWidth': true,
							'centerMode': false,
							'slidesToShow': 3
						}
					},
					{
						'breakpoint': 480,
						'settings': {
							'arrows': false,
							'variableWidth': true,
							'centerMode': false,
							'slidesToShow': 1
						}
					}
				]
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
				'responsive': [
					{
						'breakpoint': 1280,
						'arrows': true,
						'settings': {
							'slidesToShow': 4
						}
					},
					{
						'breakpoint': 1024,
						'arrows': true,
						'settings': {
							'slidesToShow': 3
						}
					},
					{
						'breakpoint': 768,
						'settings': {
							'arrows': false,
							'variableWidth': true,
							'centerMode': false,
							'slidesToShow': 3
						}
					},
					{
						'breakpoint': 480,
						'settings': {
							'arrows': false,
							'variableWidth': true,
							'centerMode': false,
							'dots': false,
							'slidesToShow': 1
						}
					}
				]
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
				'responsive': [
					{
						'breakpoint': 768,
						'settings': {
							'slidesToShow': 1
						}
					},
				]
			})
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
				'responsive': [
					{
						'breakpoint': 768,
						'settings': {
							'slidesToShow': 1,
							'slidesToScroll': 1,
							'autoplay': true,
							'autoplaySpeed': 6000,
						}
					},
					{
						breakpoint: 480,
						settings: {
							'slidesToShow': 1,
							'slidesToScroll': 1,
							'autoplay': true,
							'autoplaySpeed': 6000,
						}
					}
				]
			})
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
				'responsive': [
					{
						'breakpoint': 768,
						'settings': {
							'slidesToShow': 1,
							'slidesToScroll': 1,
							'autoplay': true,
							'autoplaySpeed': 5000,
						}
					},
					{
						breakpoint: 480,
						settings: {
							'slidesToShow': 1,
							'slidesToScroll': 1,
							'autoplay': true,
							'autoplaySpeed': 5000,
						}
					}
				]
			})
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
				'responsive': [
					{
						'breakpoint': 1279,
						'settings': {
							'slidesToShow': 2,
							'slidesToScroll': 1,
							'autoplay': true,
							'autoplaySpeed': 5000,
						}
					},
					{
						'breakpoint': 768,
						'settings': {
							'slidesToShow': 1,
							'slidesToScroll': 1,
							'autoplay': false,
							'autoplaySpeed': 5000,
						}
					},
				]
			})
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
				'responsive': [
					{
						'breakpoint': 768,
						'settings': {
							'slidesToShow': 1,
							'slidesToScroll': 1
						}
					},
					{
						'breakpoint': 320,
						'settings': {
							'slidesToShow': 1,
							'slidesToScroll': 1,
							'dots': true,
						}
					},
				]
			})
		}

		if ($elementWallSlider.length > 0) {
			$elementWallSlider.slick({
				rows: 2,
				slidesPerRow: 4,
				arrows: false,
				centerMode: false,
				responsive: [
					{
						breakpoint: 768,
						settings: {
							centerMode: true,
							rows: 1,
							slidesPerRow: 2,
							autoplay: true,
							autoplaySpeed: 5000,
						}
					},
					{
						breakpoint: 480,
						settings: {
							centerMode: true,
							rows: 1,
							slidesPerRow: 1,
							autoplay: true,
							autoplaySpeed: 5000,
						}
					},
				]
			})
		}
		//fer
		if ($elementImgSlider.length > 0) {
			$elementImgSlider.slick({
				'dots': true,
				rows: 1,
				slidesPerRow: 6,
				arrows: false,
				centerMode: false,
				responsive: [
					{
						breakpoint: 1280,
						settings: {
							slidesPerRow: 4,
							dots: true
						}
					},
					{
						breakpoint: 1024,
						settings: {
							slidesPerRow: 4,
							dots: true
						}
					},
					{
						breakpoint: 768,
						settings: {
							slidesPerRow: 2,
							dots: true,
							autoplay: true,
							autoplaySpeed: 5000,
						}
					},
					{
						breakpoint: 480,
						settings: {
							centerMode: true,
							slidesPerRow: 1,
							dots: false,
							autoplay: true,
							autoplaySpeed: 5000,
						}
					},
				]
			})
		}

		//Crousel theta right version
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
								'endless': true,
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
								'endless': true,
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
				})
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
										'endless': true,
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
											'endless': true,
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
							$thetaRight.removeClass('active-xs')
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
										'endless': true,
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
											'endless': true,
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
						})
						$thetaRight.addClass('active-xs');
					}
				}
			});
			bullets($thetaRight);
		}

		//Carousel left part
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
								'endless': true,
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
										'endless': true,
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
											'endless': true,
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
						})
						$thetaLeft.addClass('active-xs');
						dFrontJs.app.emitInView();
					}

				}


			});

			bullets($thetaLeft);
		}

		//Crousel theta bob version
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
						'endless': true,
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
					$thetaBob.removeClass('active-sm');

					// if (!$thetaBob.hasClass('active-md')) {
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
		}

		//Carousel warnings
		if ($elementWarnings.length > 0 && $elementWarnings.find('.ibe-carousel--warnings__slide ').length > 1) {

			$elementWarnings.each(function () {
				var params = $(this).data({ arrows: true, dots: false, infinite: false });
				$(this).slick(params);
			});

		}
	};
	return {
		'init': init,
		'calculateHeightTitle': calculateHeightTitle
	};
}(jQuery);
