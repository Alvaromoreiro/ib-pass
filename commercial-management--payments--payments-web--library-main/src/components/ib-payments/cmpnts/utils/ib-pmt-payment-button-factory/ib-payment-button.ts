export class PaymentButton {

    public image:image;
    constructor (
        public id:string,
        public styles:string,
        public label:string
    ){


    }

    setImage (image:image){
        this.image=image;
    }
}

export type image ={
    src:string,
    class:string,
};