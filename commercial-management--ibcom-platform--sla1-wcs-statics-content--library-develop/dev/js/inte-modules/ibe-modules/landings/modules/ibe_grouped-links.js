const parent = $('.ibe-grouped-links');
const buttonMore = $('.ibe-grouped-links__more', parent);

const clickMoreHandler = () => {
    $('.ibe-grouped-links__item.hidden', parent).slice(0, 8).removeClass('hidden');
    if ($('.ibe-grouped-links__item.hidden', parent).length === 0) {
        buttonMore.addClass('hidden');
        buttonMore.off('click', clickMoreHandler);
    }
};

const init = () => {
    buttonMore.off('click', clickMoreHandler);
    buttonMore.on('click', clickMoreHandler);
};
export { init };
