(function () {
    'use strict';

    angular
        .module('ib-content-parser-module')
        .service('ContentPreprocessorService', ContentPreprocessorService);

    ContentPreprocessorService.$inject = ['$sce'];
    function ContentPreprocessorService($sce) {

        var self = this;
        self.processContent = processContent;

        ////////////////
        /**
         *
         * @returns {Object.<Promise>}
         */
        function processContent(preContent, info) {
            var proccesedContent = processLinks(preContent, info), trustedProccesedContent;
            trustedProccesedContent = $sce.trustAsHtml(proccesedContent);

            return trustedProccesedContent;

            function processLinks(preContent, info) {
                var content = preContent.replace('href="#"', '');
                content = content.replace('target="_blank"', '');
                return content.replace(/<a\b/g, ' <a ib-link-content-parser ' + (info ? 'data-content-info="' + info + '"' : ''));
            }

        };


    }
})();
