export class TitleAngularServiceMock {
    constructor() { }
    setTitle(title: string) {
        document.title = title;
    }
    getTitle() {
        return document.title;
    }

}