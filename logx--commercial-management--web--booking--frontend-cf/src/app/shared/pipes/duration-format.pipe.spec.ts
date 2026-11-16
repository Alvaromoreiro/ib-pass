import { DurationFormatPipe } from '@shared/pipes/duration-format.pipe';

describe('DurationFormatPipe', () => {
    const pipe = new DurationFormatPipe();
    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });
    describe('when duration number is', () => {
        it(' greater than zero, it will return duration formatted',()=>{
            let resultValue = pipe.transform(4317)
            expect(resultValue).toEqual('71h 57min.')
        })
        it(' zero, it will return empty string',()=>{
            let resultValue = pipe.transform(0)
            expect(resultValue).toEqual('')
        })
     })
});
