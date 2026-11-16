namespace DatalayerBKIModel {

    export type ViewItemList = {
        items: Item[];
    };

    export type Item = {
        item_name: string;
        item_id: string;
        price: number;
        item_brand: string;
        item_category: string;
        item_category2: string;
        item_category3: string;
        item_variant: string;
        quantity: number;
    };

    export type Points = {
        Avios: string;
        Elite: string;
    };
}