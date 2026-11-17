//*****************************************************************************
//    Proyecto: IBERIA
//    dFrontJS: tweet_wall
//    Descripcion: Cargar mas tweets (novedades y noticias)
//******************************************************************************/
dFrontJs.ibe_tweet_wall = function () {
	var init = function () {
		var $tweet_wall = $('[data-tweets="wall"]');
		var n_total, n_desktop, n_mobile, $tweets_content, tweet_list_lenght, $last_tweets_content, $items, $items_clone, i,
			n_resolution;

		if ($tweet_wall.length > 0) {
			n_total = $('.ibe-tweets-wall__item').length;
			n_desktop = $tweet_wall.data('tweets-show-desktop');
			n_mobile = $tweet_wall.data('tweets-show-mobile');

			//NEW ALL ITEMS VISIBLE
			if ($('[data-tweets-show-desktop]').data('tweetsShowDesktop') === 'all') {
				n_desktop = n_total;
			}
			if ($('[data-tweets-show-desktop]').data('tweetsShowMobile') === 'all') {
				n_mobile = n_total;
			}
			// END NEW ALL ITEMS VISIBLE

			n_resolution = ($(window).width() < dFrontJs.resolutions.md) ? n_mobile : n_desktop;
			$tweets_content = $tweet_wall.find('[data-tweets="content"]'); //all content
			tweet_list_lenght = $tweets_content.length; //list_lenght
			$last_tweets_content = $tweets_content.eq(tweet_list_lenght - 1);

			$items = $last_tweets_content.find('li:nth-child(n+' + (n_resolution + 1) + ')');
			$items_clone = $items.clone();

			$items.remove();

			//Llamada a la libreria
			dFrontJs.ibe_tweets.init('[data-function="masonry"]', '[data-function="masonry"] li');

			i = 0;
			//Boton cargas mas tweets
			$('[data-tweets="button"]').on('click', function () {
				var $aux_item_clone, $exampleDateAjax;
				$tweets_content = $tweet_wall.find('[data-tweets="content"]'); //all content
				tweet_list_lenght = $tweets_content.length; //list_lenght
				$last_tweets_content = $tweets_content.eq(tweet_list_lenght - 1);//Numero de tweets
				//Mostrar nueva lista de tweets
				if (i < $items_clone.length) {
					$aux_item_clone = $items_clone.slice(i, i + n_resolution);
					$last_tweets_content.find('ul').append($aux_item_clone).masonry('appended', $aux_item_clone);
					i = i + n_resolution;
				} else {
					$exampleDateAjax = $('[data-tweets="new"]').html();
					$tweet_wall.append($exampleDateAjax);
					//
					$tweets_content = $tweet_wall.find('[data-tweets="content"]');//all content
					tweet_list_lenght = $tweets_content.length;//list_lenght
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
