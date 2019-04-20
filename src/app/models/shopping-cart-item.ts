import { Product } from './product';
export class ShoppingCartItem {
    constructor(init?: Partial<ShoppingCartItem>) {
        Object.assign(this, init);
    }
    key: string;
    title: string;
    price: number;
    imageUrl: string;
    quantity: number;

    get totalPrice() {
        return this.quantity * this.price;
    }
}

