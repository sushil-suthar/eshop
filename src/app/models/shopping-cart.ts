import { ShoppingCartItem } from './shopping-cart-item';
import { Product } from './product';
export class ShoppingCart {
    items: ShoppingCartItem[] = [];
    constructor(
        public itemsMap:
            { [id: string]: ShoppingCartItem }
    ) {
        console.log("ctor:" + itemsMap)
        for (let productId in itemsMap) {
            console.log(productId);
            this.items.push(new ShoppingCartItem(itemsMap[productId].product, itemsMap[productId].quantity));
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
