@Service(
    'ib-MmB-services-module',
    ['$window'],
    []
)
export class RedirectionService {
    constructor (
        private $window: angular.IWindowService
    ) {}

    ////////////////
    externalRedirect = (path, newTab) => {
        if (newTab) {
            this.$window.open(path);
        }else {
            this.$window.location.href=path;
        }
    };
}