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