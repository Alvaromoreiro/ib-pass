function sanitizeAmpersandFilter () {
    return function (input) {
        return input ? input.replace(/&amp;/, '&') : '';
    };

}
module sanitizeAmpersandFilter {
    export const $inject = [];
}

@Filters('ib-commons-filters-module',
    [], [], sanitizeAmpersandFilter, 'sanitizeAmpersandFilter'
)()
class SanitizeAmpersandFilterClass {
    constructor () {

    }
}