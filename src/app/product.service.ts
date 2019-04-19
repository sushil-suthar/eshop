import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from './models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productRef: AngularFireList<any>;
  constructor(private db: AngularFireDatabase) {

  }
  create(product) {
    this.db.list('/products').push(product);
  }
  getAll(): Observable<any[]> {

    this.productRef = this.db.list('/products');
    return this.productRef.snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() }));
        })
      )
  }
  get(productId): Observable<Product> {
    return this.db.object<Product>('/products/' + productId).valueChanges()
  }
  update(productId, product) {
    return this.db.object('/products/' + productId).update(product);
  }
  delete(productId) {
    return this.db.object('/products/' + productId).remove();
  }
}

