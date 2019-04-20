import { ShoppingCart } from './../models/shopping-cart';
import { ShoppingCartService } from './../shopping-cart.service';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../models/product';
import { Subscription, Observable } from 'rxjs';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[];
  category: string;
  cart$: Observable<ShoppingCart>;

  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private shoppingcartService: ShoppingCartService

  ) { }

  async ngOnInit() {
    this.cart$ = (await this.shoppingcartService.getCart())
    this.populateProducts();
  }


  private applyFilter() {
    this.filteredProducts = (this.category)
      ? this.products.filter(p => p.category === this.category)
      : this.products;
  }
  private populateProducts() {
    this.productService.getAll().pipe(
      switchMap(p => {
        this.products = p;
        return this.route.queryParamMap;
      }))
      .subscribe(params => {
        this.category = params.get('category');
        this.applyFilter();
      });
  }

}