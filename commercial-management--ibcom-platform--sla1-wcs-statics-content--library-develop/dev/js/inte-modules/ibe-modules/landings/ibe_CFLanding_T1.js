import { init as initHighlightedsModule } from './modules/ibe_highlightedLanding';
import { retrieveSeeker } from './modules/ibe_asyncSeeker';

dFrontJs.ibe_compact_search.init('[data-compact-searcher="trigger"]');
retrieveSeeker('[data-compact-searcher="desktop"]');
initHighlightedsModule();
