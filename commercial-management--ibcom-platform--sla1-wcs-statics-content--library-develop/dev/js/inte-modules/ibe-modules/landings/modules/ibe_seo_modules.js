import { responsive } from '../../general/ibe_inte-util';

const allContainers = $('.ibe-offer-landings_container');
const allMoreBtn = $('.ibe-grouped-links__more', allContainers);
const allLessBtn = $('.ibe-grouped-links__less', allContainers);
const allLists = $('.ibe-offer-landings__origin-list', allContainers);

const scrollListHandler = (event) => {
    let elem = event;
    if (elem.currentTarget != null) {
        elem = elem.currentTarget;
    }
    const parentModule = $(elem).closest('.ibe-offer-landings__offers-container');
    const container = parentModule.find('.ibe-offer-landings__origin-list');
    const pagination = parentModule.find('.ibe-offer-landings__offers-pagination');
    const totalChilds = container.find('.ibe-offer-landings__offers-list-item');
    const numChildsPerColumnResponsive = container.data('links-height-responsive');
    const righBorderContainer = container.offset().left + container.width();
    const marginRange = 10;
    let minCurrentColumn = parseInt(pagination.attr('data-pagination'), 10);
    const righBorderNextCol = minCurrentColumn + numChildsPerColumnResponsive <= totalChilds.length ? totalChilds.eq(minCurrentColumn + numChildsPerColumnResponsive - 1).offset().left + totalChilds.eq(minCurrentColumn + numChildsPerColumnResponsive - 1).width() : righBorderContainer + 2 * marginRange;
    const leftBorderPrevCol = minCurrentColumn > 1 ? totalChilds.eq(minCurrentColumn - numChildsPerColumnResponsive - 1).offset().left : 0;

    if (leftBorderPrevCol >= container.offset().left) {
        minCurrentColumn -= numChildsPerColumnResponsive;
    } else if (righBorderContainer - righBorderNextCol > -marginRange) {
        minCurrentColumn += numChildsPerColumnResponsive;
    }
    const maxCurrentColumn = minCurrentColumn + (numChildsPerColumnResponsive - 1) > totalChilds.length ? totalChilds.length : minCurrentColumn + (numChildsPerColumnResponsive - 1);
    const minLastColumn = parseInt(pagination.find('p>span').html(), 10);
    if (minLastColumn !== minCurrentColumn) {
        pagination.attr('data-pagination', minCurrentColumn);
        pagination.find('p>span').html(`${minCurrentColumn}-${maxCurrentColumn}`);
    }
};

const resizeModule = (type, parentModule) => {
    const container = $(parentModule).find('.ibe-offer-landings__origin-list');
    const containerHeight = container.height();
    const numChildsToShow = container.data('show-links');
    let numChildsPerColumn = container.data('links-height');
    const numChildsPerColumnResponsive = container.data('links-height-responsive');
    const totalChilds = container.find('.ibe-offer-landings__offers-list-item');
    const hiddenChilds = totalChilds.filter('.inte-hidden');
    const showChilds = totalChilds.filter(':not(.inte-hidden)');
    const rowHeight = totalChilds.get(0).getBoundingClientRect().height;
    const lessButton = parentModule.find('.ibe-grouped-links__less');
    const moreButton = parentModule.find('.ibe-grouped-links__more');
    const pagination = parentModule.find('.ibe-offer-landings__offers-pagination');

    if (type === 'reset') {
        numChildsPerColumn = totalChilds.length < numChildsToShow ? totalChilds.length / (numChildsToShow / numChildsPerColumn) : numChildsPerColumn;
        showChilds.slice(numChildsToShow, totalChilds.length).addClass('inte-hidden');
        container.css('height', `${rowHeight * Math.ceil(numChildsPerColumn, 10)}px`);

        lessButton.addClass('hidden');
        moreButton.css('visibility', 'visible');
        moreButton.off('click', clickMoreHandlerOrigin);
        moreButton.on('click', clickMoreHandlerOrigin);

        const itemsVisible = container.find('.ibe-offer-landings__offers-list-item').not('.inte-hidden').length;
        pagination.find('p>span').html(itemsVisible);
    } else if (type === 'grow') {
        numChildsPerColumn = hiddenChilds.length < numChildsToShow ? hiddenChilds.length / (numChildsToShow / numChildsPerColumn) : numChildsPerColumn;
        hiddenChilds.slice(0, numChildsToShow).removeClass('inte-hidden');
        container.css('height', `${containerHeight + (rowHeight * Math.ceil(numChildsPerColumn, 10))}px`);
        container.css('max-height', 'unset');

        if (container.find('.ibe-offer-landings__offers-list-item.inte-hidden').length === 0) {
            moreButton.css('visibility', 'hidden');
            moreButton.off('click', clickMoreHandlerOrigin);
        }
        lessButton.removeClass('hidden');

        const itemsVisible = container.find('.ibe-offer-landings__offers-list-item').not('.inte-hidden').length;
        pagination.find('p>span').html(itemsVisible);
    } else if (type === 'responsive') {
        container.css('height', 'auto');
        container.css('max-height', `${(rowHeight * numChildsPerColumnResponsive) + 30}px`);
        pagination.attr('data-pagination', 1);
        if (container.scrollLeft() !== 0) {
            container.scrollLeft(0);
        } else {
            scrollListHandler(container);
        }
    }
};

const clickMoreHandlerOrigin = (event) => resizeModule('grow', $(event.currentTarget).closest('.ibe-offer-landings_container'));
const clickLessHandlerOrigin = (event) => resizeModule('reset', $(event.currentTarget).closest('.ibe-offer-landings_container'));
const initDesktop = () => $('.ibe-offer-landings_container').each((index, parentModule) => resizeModule('reset', $(parentModule)));
const initMobile = () => $('.ibe-offer-landings_container').each((index, parentModule) => resizeModule('responsive', $(parentModule)));

const init = () => {
    allMoreBtn.off('click', clickMoreHandlerOrigin);
    allMoreBtn.on('click', clickMoreHandlerOrigin);
    allLessBtn.off('click', clickLessHandlerOrigin);
    allLessBtn.on('click', clickLessHandlerOrigin);
    allLists.off('scroll', scrollListHandler);
    allLists.on('scroll', scrollListHandler);
    $(window).on('resize', () => (window.innerWidth < 768 ? initMobile() : initDesktop()));

    if (responsive() === 'desktop' || responsive() === 'tablet') {
        initDesktop();
    } else {
        initMobile();
    }
};
export { init };
