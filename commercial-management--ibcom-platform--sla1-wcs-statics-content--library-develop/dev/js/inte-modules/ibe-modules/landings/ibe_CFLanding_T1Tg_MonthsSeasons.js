import { retrieveSeeker } from './modules/ibe_asyncSeeker';
import { init as initSeoModules } from './modules/ibe_seo_modules';
import { init as initGroupedLinks } from './modules/ibe_grouped-links';

dFrontJs.ibe_compact_search.init('[data-compact-searcher="trigger"]');
retrieveSeeker('[data-compact-searcher="desktop"]');
initSeoModules();
initGroupedLinks();
