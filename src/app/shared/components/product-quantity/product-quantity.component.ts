import { ShoppingCart } from 'shared/models/shopping-cart';
import { Component, OnInit, Input } from '@angular/core';
import { ShoppingCartService } from 'shared/services/shopping-cart.service';

@Component({
  selector: 'product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.css']
})
export class ProductQuantityComponent implements OnInit {

  @Input('product') product;
  @Input('shopping-cart') shoppingCart: ShoppingCart;
  constructor(private cartService: ShoppingCartService) { }

  addToCart() {
    console.log("add to cart~" + this.product);
    this.cartService.addToCart(this.product);

  }
  removeFromCart() {
    this.cartService.removeFromCart(this.product);
  }


  ngOnInit(): void {

  }


}
