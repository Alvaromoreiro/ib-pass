import retrieveGlobalVariables from '../general/ibe_variables';
import { updateDigitalData } from '../manage/ibe_common';

const { quadrigam } = retrieveGlobalVariables();

$(document).ready(() => {
    // eslint-disable-next-line no-undef
    digital_data.Quadrigam = quadrigam;
    updateDigitalData('view');
});

// Add paragraph__regular classes to the p elements that do not have the class paragraph__regular.
$('.ibe-accordion__collapse > div > p:not(.paragraph__regular)').addClass('paragraph paragraph__regular');
// Remove h3 if it is empty and add margin to the figure
const selectorClaimsType = 'div.ibe-claims-tipo-container > div > div > article > div > div.ibe-card-link__info';
const PROCESSED_FLAG = 'data-h3-cleaned';

const cleanCards = (root = document) => {
    root.querySelectorAll(`${selectorClaimsType}:not([${PROCESSED_FLAG}])`)
        .forEach((info) => {
            const h3 = info.querySelector('h3');
            if (!h3 || h3.textContent.trim()) return;
            h3.remove();
            info.querySelector('figure').classList.add('u-mt');
            info.setAttribute(PROCESSED_FLAG, 'true');
        });
};

cleanCards();

// Add aria-label built from data-text-aria-2 template + the card's own h3 text
const claimsAriaContainers = document.querySelectorAll('.ibe-claims-tipo-container[data-text-aria-2]');
claimsAriaContainers.forEach((container) => {
    const ariaTemplate = container.getAttribute('data-text-aria-2');

    container.querySelectorAll('.ibe-card-link__container').forEach((cardLink) => {
        const aCard = cardLink.querySelector('a');
        const h3 = cardLink.querySelector('.ibe-card-link__info h3');

        if (!aCard || !h3) return;

        const h3Text = h3.textContent.trim().toLowerCase();
        if (!h3Text) return;

        const finalTextAcc = ariaTemplate.replace('#titular de la card', h3Text);
        aCard.setAttribute('aria-label', finalTextAcc);
        // Prevent the generic a[title] blocks below from overwriting this aria-label
        aCard.removeAttribute('title');
    });
});

// Clickable cards on mobile devices
const mobileBreakpoint = 767;
const cards = document.querySelectorAll('.ibe-card-link');
cards.forEach((card) => {
    card.addEventListener('click', (e) => {
        if (window.innerWidth <= mobileBreakpoint) {
            $(card).css('cursor', 'pointer');
            const link = card.querySelector('a');
            if (link) {
                if (e.target.tagName !== 'A') {
                    link.click();
                }
            }
        }
    });
});

// Add title and aria-label to the link of the card, with the format "Title link - h3 card"
const cardsLinks = document.querySelectorAll('.ibe-card-link__container');
cardsLinks.forEach((cardLink) => {
    const h3Card = cardLink.querySelector('h3.title__h4');
    const aCard = cardLink.querySelector('a[title]');

    if (!h3Card || !aCard) return;

    const finalTextAcc = `${aCard.title.trim()} - ${h3Card.innerText.trim()}`;
    aCard.title = finalTextAcc;
    aCard.setAttribute('aria-label', finalTextAcc);
});

// Add title and aria-label to the link of the card, with the format "Title link - h2 card"
const cardsLinks2 = document.querySelectorAll('.ibe-card-link__container');
cardsLinks2.forEach((cardLink2) => {
    const h2Card = cardLink2.querySelector('h2.title__h2');
    const aCard2 = cardLink2.querySelector('a[title]');

    if (!h2Card || !aCard2) return;

    const finalTextAcc2 = `${aCard2.title.trim()} - ${h2Card.innerText.trim()}`;
    aCard2.title = finalTextAcc2;
    aCard2.setAttribute('aria-label', finalTextAcc2);
});
