
import { LiteralFormatterPipe } from '@src/app/shared/pipes/literalFormatter.pipe';

describe('LiteralFormatterPipe', () => {
    let pipe: LiteralFormatterPipe;

    beforeEach(() => {
        pipe = new LiteralFormatterPipe();
    });

    describe('Test to LiteralFormatterPipe', () => {

        it('transform literal of link"', (done) => {
            let tagsInfo = {
                link: {
                    tag: 'a',
                    href: '#',
                    target: '_blank',
                    title: '',
                    class: 'ib-link ib-link--underline ib-box-included__item-link'
                }
            }
            expect(pipe.transform('Texto y $$link$enlace$$', tagsInfo)).toEqual('Texto y <a href="#" target="_blank" title class="ib-link ib-link--underline ib-box-included__item-link">enlace</a>');
            done();
        });
    });
});
