import { Observable } from 'rxjs';
export class TranslateServiceMock {
    private dictionary: object;
    constructor(dictionary?: object ) {
        dictionary ??= dictionary
    }
    public get(literal: string) {
        return new Observable((suscriber) => {
            suscriber.next(this.dictionary?.[literal] ?? literal)
            suscriber.complete();
         })
    }

}
