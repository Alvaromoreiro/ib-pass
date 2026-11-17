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
		}
		// HIDE COMPONENT ON QR SECTION FOR MD RESOLUTION & IOS/ANDROID DEVICE
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
		'init': init,
	};
}(jQuery);
