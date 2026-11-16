export const filterFake = jasmine.createSpy('$filter').and.callFake((filter) => {
    let filterFunc:any = () => {
        return ('');
    };
    switch (filter) {
        case 'translate':
            filterFunc = () => {
                return 'Translated Text';
            };
            break;
        case 'literalFormatter':
            filterFunc = () => {
                return 'Translated Text';
            };
            break;
        case 'LinksFilter':
            filterFunc = () => {
                return 'Linked Text';
            };
            break;
        case 'DurationFormatFilter':
            filterFunc = () =>  {
                return '0h 52min.';
            };
            break;
        case 'DateFormatFilter':
            filterFunc = () => {
                return {
                    formatedDate: '10/10/2050'
                };
            };
            break;
        default:
            break;
    }

    return filterFunc;
});
