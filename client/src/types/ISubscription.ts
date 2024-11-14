export interface ISubscription {
    name: string;
    date: number;
    description: string;
    price: number;
    salePrice?: number;
}

export interface IPay {
    price: number;
    name: string;
    date: number;
    userId: string;
}
