var imagemin = require("imagemin"),    // The imagemin module.
	webp = require("imagemin-webp"),   // imagemin's WebP plugin.
	outputFolder = "./dev/images/content/carousel/",            // Output folder
	PNGImages = "./dev/images/content/carousel/*.png",         // PNG images
	JPEGImages = "./dev/images/content/carousel/*.jpg";        // JPEG images

imagemin([PNGImages], outputFolder, {
	plugins: [webp({
		lossless: true // Losslessly encode images
	})]
});

imagemin([JPEGImages], outputFolder, {
	plugins: [webp({
		quality: 65 // Quality setting from 0 to 100
	})]
});
