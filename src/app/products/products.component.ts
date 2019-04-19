import { ShoppingCart } from './../models/shopping-cart';
import { ShoppingCartService } from './../shopping-cart.service';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../models/product';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  filteredProducts: Product[];
  category: string;
  cart: ShoppingCart;
  subscription: Subscription;

  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private shoppingcartService: ShoppingCartService

  ) {

    productService.getAll().pipe(
      switchMap(p => {
        this.products = p;
        return route.queryParamMap;
      }))
      .subscribe(params => {
        this.category = params.get('category');
        this.filteredProducts = (this.category)
          ? this.products.filter(p => p.category === this.category)
          : this.products;
      });
  }

  async ngOnInit() {
    this.subscription = (await this.shoppingcartService.getCart())
      .subscribe(cart => {
        this.cart = cart;
        console.log("in subscribe");
        console.log(cart);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}