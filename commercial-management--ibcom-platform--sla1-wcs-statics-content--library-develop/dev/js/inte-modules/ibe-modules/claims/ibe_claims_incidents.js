import retrieveGlobalVariables from '../general/ibe_variables';
import { updateDigitalData } from '../manage/ibe_common';

const { quadrigam } = retrieveGlobalVariables();

$(document).ready(() => {
    // eslint-disable-next-line no-undef
    digital_data.Quadrigam = quadrigam;
    updateDigitalData('view');

    // provisionally replace p with h2/h3 based on class names until content is updated in CMS
    const headingMap = {
        title__h2: 'h2',
        title__h3: 'h3',
        title__h4: 'h3',
    };

    Object.entries(headingMap).forEach(([className, tag]) => {
        document.querySelectorAll(`p.${className}`).forEach((p) => {
            const heading = document.createElement(tag);
            Array.from(p.attributes).forEach((attr) => {
                heading.setAttribute(attr.name, attr.value);
            });
            heading.innerHTML = p.innerHTML;
            p.parentNode.replaceChild(heading, p);
        });
    });

    // ACC Add alt text to empty img alt using h3 text from the same card
    document.querySelectorAll('.ibe-card-link__info').forEach((info) => {
        const h3 = info.querySelector('h3');
        if (!h3) return;

        const h3Text = h3.textContent.toLowerCase();
        const container = info.closest('.col-xs-12') || info.parentElement;
        const img = container.querySelector('img[alt=""]');

        if (img && h3Text) {
            img.setAttribute('alt', `icono ${h3Text}`);
        }
    });

    // Add ibe-card-link to col containers inside infocheckin articles
    document.querySelectorAll('.ibe-infocheckin__box .row.flex-direction-row > [class*="col-"]').forEach((col) => {
        col.classList.add('ibe-card-link-ayuda');
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

    const cardsAyuda = document.querySelectorAll('.ibe-card-link-ayuda');
    cardsAyuda.forEach((cardA) => {
        cardA.addEventListener('click', (e) => {
            if (window.innerWidth <= mobileBreakpoint) {
                $(cardA).css('cursor', 'pointer');
                const linkA = cardA.querySelector('a');
                if (linkA && e.target.tagName !== 'A') {
                    linkA.click();
                }
            }
        });
    });
});

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

// Add aria-label built from data-text-aria-3 template + the card's own h3 text
const claimsAriaContainers = document.querySelectorAll('.ibe-claims-tipo-container[data-text-aria-3]');
claimsAriaContainers.forEach((container) => {
    const ariaTemplate = container.getAttribute('data-text-aria-3');

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

// Update aria-label on accordion collapse/expand button
const accordionToggleButtons = document.querySelectorAll('[data-toggle="button-collapse"]');
accordionToggleButtons.forEach((btn) => {
    // Set initial aria-label based on initial state
    const isCollapsed = btn.classList.contains('collapsed');
    btn.setAttribute('aria-label', isCollapsed ? btn.getAttribute('data-text-collapsed-aria-label') : btn.getAttribute('data-text-expanded-aria-label'));
    btn.addEventListener('click', () => {
        // After click, the class 'collapsed' is toggled by your existing XUI framework
        // We use a small timeout to let the framework update the class first
        setTimeout(() => {
            const nowCollapsed = btn.classList.contains('collapsed');
            btn.setAttribute('aria-label', nowCollapsed ? btn.getAttribute('data-text-collapsed-aria-label') : btn.getAttribute('data-text-expanded-aria-label'));
        }, 0);
    });
});

// Add aria-label from title on links where title provides additional context
document.querySelectorAll('a[title]').forEach((link) => {
    const titleText = link.getAttribute('title').trim();
    const linkText = link.textContent.trim();
    if (titleText.toLowerCase() !== linkText.toLowerCase()) {
        link.setAttribute('aria-label', link.getAttribute('title'));
    }
});

// ACC Eliminar title redundante en links donde sea igual al texto del enlace
document.querySelectorAll('a[title]').forEach((link) => {
    const titleText = link.getAttribute('title').trim().toLowerCase();
    const linkText = link.textContent.trim().toLowerCase();

    if (titleText === linkText) {
        link.removeAttribute('title');
    }
});
