import { take, map, filter } from 'rxjs/operators';
import { Product } from './models/product';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { ShoppingCartItem } from './models/shopping-cart-item';
import { Observable } from 'rxjs';
import { ShoppingCart } from './models/shopping-cart';
import { pipe } from '@angular/core/src/render3';

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
    return this.db.object<ShoppingCart>('/shopping-carts/' + cartId).valueChanges()
      .pipe(
        map(x => {
          console.log("map:" + x);

          return new ShoppingCart(null);
        })
      )
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
  async addToCart(product: Product) {
    this.updateItemQuantity(product, 1);
  }
  removeFromCart(product: Product) {
    this.updateItemQuantity(product, -1);
  }










  private async updateItemQuantity(product: Product, change: number) {
    let cartId = await this.getOrCreateCartId();
    console.log(cartId);
    let cartItem: ShoppingCartItem;

    let items$ = this.getItem(cartId, product.key);
    items$.pipe(
      take(1)
    )
      .subscribe(p => {
        if (p) {
          cartItem = p;
          cartItem.quantity += change;
          this.updateQuantity(cartItem, cartId, product.key);
        }
        else {
          console.log("not exists");
          cartItem = new ShoppingCartItem(product, 1);

          this.updateQuantity(cartItem, cartId, product.key);
        }
      })
  }
  updateQuantity(productCart: ShoppingCartItem, cartId: string, key: string) {
    console.log("updateing quantity");
    console.log(productCart);
    let items = this.db.object('/shopping-carts/' + cartId + '/items/' + key).update(productCart);
    items.then(() =>
      console.log("updated")
    )
  }


}
