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

		if (youtube.length > 0)
			initParam = youtube.attr('src').indexOf('?');

		if (($(window).width() < dFrontJs.resolutions.lg) || (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
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
	};
	//Ver si el video esta en autoplay y mostrar/ocultar los controles
	//Pausar video html5
	var isPaused = function () {
		var video = $('video');
		if (video.attr('autoplay')) {
			$('.video-controls').find('.video-controls__play').hide();
		} else {
			$('.video-controls').find('.video-controls__play').show();
		}
	};

	//toggleVideo
	var toggleVideo = function (video) {
		var videoDOM = video.get(0);
		if (videoDOM.paused || videoDOM.ended) {
			$('.video-controls').find('.video-controls__play').hide();
			videoDOM.play();
		} else {
			$('.video-controls').find('.video-controls__play').show();
			videoDOM.pause();

		}
	};

	//pause
	var pauseVideo = function (video) {
		var videoDOM = video.get(0);
		$('.video-controls').find('.video-controls__play').show();
		videoDOM.pause();

	};


	//Eventos jquery
	var init = function () {
		if ($('[data-video]').length > 0) {
			autoPlay();
			isPaused();
		}
		//Click sobre el video
		$('[data-video="html5"]').click(function () {
			var $this = $(this);
			toggleVideo($this);
		});
		//Click sobre los controles
		$('.video-controls').click(function () {
			var $this = $(this).parent().find('video');
			toggleVideo($this);
		});
	};
	//public functions
	return {
		'init': init,
		'pauseVideo': pauseVideo
	}
}(jQuery);
