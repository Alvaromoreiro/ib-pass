import { TestBed } from '@angular/core/testing';

import { IbBookingContentParserUtilsService } from '@shared/services/ib-booking-content-parser/ib-booking-content-parser-utils.service';
let attributes = {
    class: {
        textContent: 'aaa',
        value: 'hola'
    },
}
let externalLink = {
    href: {
        textContent: 'noHash',
    }
}

let internalLink = {
    href: {
        textContent: '#hash',
    }
}

let modalWithHref = {
    href: {
        textContent: 'javascript:void(0)',
    }
}

let contentId = "1476373673799"

let info = [
    {
        code: "1234567890",
        elements: [
            {
                type: "Accordion_C",
                title: "",
                subTitle: "",
                description: "Nuestro Compromiso...",
                items: [
                    {
                        title: "Responsable...",
                        description: "Todos los datos..."
                    },
                    {
                        title: "¿Qué entendemos...",
                        description: "Se entiende..."
                    },
                ]
            }
        ]
    },
    {
    code: "1476373673799",
    elements: [
        {
            type: "Accordion_C",
            title: "",
            subTitle: "",
            description: "Nuestro Compromiso...",
            items: [
                {
                    title: "Responsable...",
                    description: "Todos los datos..."
                },
                {
                    title: "¿Qué entendemos...",
                    description: "Se entiende..."
                },
            ]
        }
    ]
}
]


describe('IbBookingContentParserUtilsService', () => {
    let service: IbBookingContentParserUtilsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(IbBookingContentParserUtilsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('should specify when isExternalLink', () => {
        it('true', () => {
            let attrWithHref = {attributes, ...externalLink};
            let result = service['isExternalLink'](attrWithHref)
            expect(result).toBe(true);
        });

        it('false', () => {
            let result = service['isExternalLink'](attributes)
            expect(result).toBe(false);
        });
    })

    describe('should specify when isInternalLink', () => {
        it('is true', () => {
            let attrWithHref = {attributes, ...internalLink};
            let result = service['isInternalLink'](attrWithHref)
            expect(result).toBe(true);
        });

        it('is false', () => {
            let result = service['isInternalLink'](attributes)
            expect(result).toBe(false);
        });
    })

    describe('isModalLink', () => {
        it('is true', () => {
            let result = service['isModalLink'](attributes)
            expect(result).toBe(true);
        });

        it('is false', () => {
            let attrWithHref = {attributes, ...internalLink};
            let result = service['isModalLink'](attrWithHref)
            expect(result).toBe(false);
        });
    })

    describe('should specify when isModalWithHref', () => {
        it('is true', () => {
            let attrWithHref = {attributes, ...modalWithHref};
            let result = service['isModalWithHref'](attrWithHref)
            expect(result).toBe(true);
        });

        it('is false', () => {

            let attrWithHref = {attributes, ...externalLink};
            let result = service['isModalWithHref'](attrWithHref)
            expect(result).toBe(false);
        });
    })

    describe('searchModalContent works when it', () => {
        it('has no info', () => {
            let result = service['searchModalContent'](null, null)
            expect(result).toEqual({});
        });

        it('has no contentId', () => {
            let result = service['searchModalContent'](info, null)
            expect(result).toEqual(info[0]);
        });

        it('works as expected', () => {
            let result = service['searchModalContent'](info, contentId)
            expect(result).toEqual(info[1]);
        });
    })
});
