import { init as initGroupedLinks } from './modules/ibe_grouped-links';
import { init as initSeoModules } from './modules/ibe_seo_modules';
import { init as initWeatherModule } from './modules/ibe_weather_module';
import { init as initPriceChartModule } from './modules/ibe_prices_chart_module';
import { retrieveSeeker } from './modules/ibe_asyncSeeker';
import { init as standardOfLiving } from './modules/ibe_standardOfLiving';
import { init as initOfferCards } from './modules/ibe_offer_cards';

const typeLanding = $('body').attr('data-landing-template');

if ($('.ibe-search-compact__searcher-container--desktop [data-compact-searcher="trigger"]').length > 0) {
    dFrontJs.ibe_compact_search.init('[data-compact-searcher="trigger"]');
}
retrieveSeeker('[data-compact-searcher="desktop"]'); // Compact Search

if (typeLanding === 'Tg-Area-Landing' || typeLanding === 'Tg-Country-Landing' || typeLanding === 'Tg-Region-Landing') {
    initGroupedLinks(); // Child list
}
if (typeLanding === 'T2-Origin') {
    initSeoModules(); // SEO modules flexbox
} else if (typeLanding === 'T2-Destination') {
    standardOfLiving(); // Standard of living module
    initWeatherModule(); // Weather module
} else if (typeLanding === 'T3-Landing') {
    initPriceChartModule(); // price chart
    initWeatherModule(); // Weather module
    standardOfLiving(); // Standard of living module
    initOfferCards();
}
