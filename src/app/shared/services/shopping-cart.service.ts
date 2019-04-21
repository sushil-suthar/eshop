import { take, map } from 'rxjs/operators';
import { Product } from 'shared/models/product';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { ShoppingCartItem } from 'shared/models/shopping-cart-item';
import { Observable } from 'rxjs';
import { ShoppingCart } from 'shared/models/shopping-cart';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }
  create() {
    return this.db.list('shopping-carts').push({
      dateCreated: new Date().getTime()
    })
  }
  public async getCart(): Promise<Observable<ShoppingCart>> {
    let cartId = await this.getOrCreateCartId();
    console.log("getcart-" + cartId);
    return this.db.object('/shopping-carts/' + cartId).valueChanges()
      .pipe(
        map(x => {
          console.log("map:" + x);
          if (x)
            return new ShoppingCart(x.items);
          return new ShoppingCart(null);
        })
      )
  }
  async addToCart(product: Product) {
    this.updateItem(product, 1);
  }
  async  deleteFromCart(product: Product) {
    console.log("deleting");
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items/' + product.key).remove();

  }
  removeFromCart(product: Product) {
    this.updateItem(product, -1);
  }
  async clearCart() {
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }





  private async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId;

    let result = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;

  }
  private getItem(cartId: string, productId: string) {
    return this.db.object<ShoppingCartItem>('/shopping-carts/' + cartId + '/items/' + productId).valueChanges()
  }
  private async updateItem(product: Product, change: number) {
    let cartId = await this.getOrCreateCartId();
    console.log(cartId);
    let cartItem: ShoppingCartItem;
    cartItem = new ShoppingCartItem();

    cartItem.title = product.title;
    cartItem.key = product.key;
    cartItem.imageUrl = product.imageUrl;
    cartItem.price = product.price;

    let item$ = this.getItem(cartId, product.key);
    item$.pipe(
      take(1)
    )
      .subscribe(p => {
        cartItem.quantity = (p) ? p.quantity + change : 1;
        if (cartItem.quantity === 0) {
          console.log("delete form cart");
          this.deleteFromCart(product);
        }
        else {
          console.log("to be updated quantity:" + cartItem.quantity);
          this.updateQuantity(cartItem, cartId, product.key);
        }
      })
  }
  private updateQuantity(productCart: ShoppingCartItem, cartId: string, key: string) {
    console.log("updateing product in cart");
    console.log(productCart);
    let items = this.db.object('/shopping-carts/' + cartId + '/items/' + key).update(productCart);
    items.then(() =>
      console.log("updated")
    )
  }


}
