dFrontJs.ibe_slick_gift_cards = function(){
    var calculateHeightsBanner  = function (event){
        if (event && event.type === 'resize'){
            $('[data-giftcardcalculatedheigth]').each(function () {
                $(this).height('auto');
            })
        }
        function calculateMaxHeight (selector) {
            var aux = [];
            var result = -1;
            $(selector).each(function (){
                aux.push($(this).height());
            })
            if (aux.length > 0){
                result = Math.max.apply(Math, aux);
            }
            return  result
        }
        function applyHeight (selector,heightVal) {
            if (typeof (heightVal) === 'number' && heightVal > 0)
            $(selector).each(function(){
                $(this).height(heightVal);
                $(this).attr('data-giftcardcalculatedheigth','');
            })
        }
        requestAnimFrame(function (){
            var $slick = $('[data-slick="carrousel-gift-cards"]');
            var item = $slick.find('.ibe-banner-full__item');
            applyHeight(item, calculateMaxHeight(item)); 
        });
    }

    var init = function(){
        var $slick = $('[data-slick="carrousel-gift-cards"]'),
        items = $('[data-slick="carrousel-gift-cards"] [data-item]');
        $('.ibe-gift-card__price').each(function(){
            if ($(this).html().length > 5) {
                $(this).addClass('ibe-gift-card__price--long-coins');
            }
        })
        if (items.length >=1){
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
        }
        else {
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

    return{
        "init": init
    };


}(jQuery);
