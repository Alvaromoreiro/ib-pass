
import angular from 'angular';

angular
    .module('ib-booking-filters-module')
    .filter('EliminateWordsFilter', EliminateWordsFilter);

function EliminateWordsFilter () {

    return eliminateWordsFilter;

    ////////////////

    function eliminateWordsFilter (text, words) {
        angular.forEach(words.split(' '), (word)=> {
            const reg = new RegExp(word, 'g');
            text = text.replace(reg, '');
        });
        return text;
    }
}
