@Service("ib-commons-http-service-module", ["$q"])
export class IbCLinksProxy {
  constructor(private $q: ng.IQService) {}

  /**
   * Makes the http call to retrieve the app links in a Sync way.
   * @param {String} url the static url to get the links.
   * @returns {Object} the links in case of success and the error object in case of error.
   */
  getLinksSync = (url: string): void => {
    let response = {};
    const defer = this.$q.defer();
    $.ajax({
      url: url,
      dataType: "json",
      async: false,
      success: function (data) {
        response = data;
      },
      error: function (error) {
        response = { data: error.statusText, errorCode: error.status };
      },
    });
    return defer.resolve(response);
  };
}
