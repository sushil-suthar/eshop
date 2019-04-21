import { ShoppingCartItem } from './shopping-cart-item';
import { Product } from './product';
export class ShoppingCart {
    items: ShoppingCartItem[] = [];

    constructor(
        private itemsMap:
            { [id: string]: ShoppingCartItem }
    ) {
        this.itemsMap = itemsMap || {};

        console.log("ctor:" + itemsMap)
        for (let productId in itemsMap) {
            console.log(productId);
            let item = itemsMap[productId];
            this.items.push(new ShoppingCartItem({ ...item, key: productId }));
        }
    }

    get totalItemsCount() {

        let count = 0;
        for (let productId in this.items) {
            count += this.items[productId].quantity
        }
        return count;
    }
    get totalPrice() {
        let sum = 0;
        for (let productId in this.items)
            sum += this.items[productId].totalPrice;
        return sum;
    }
    getQuantity(product: Product) {
        if (!product) return 0;

        let item = this.itemsMap[product.key];
        if (!item) return 0;

        let q = item ? item.quantity : 0;
        return q;
    }

}
