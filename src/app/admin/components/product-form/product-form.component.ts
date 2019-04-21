import { Product } from 'shared/models/product';
import { ProductService } from 'shared/services/product.service';
import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'shared/services/category.service';
import { Router, ActivatedRoute } from '@angular/router';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  categories$;
  product: Product;
  id;
  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute) {
    this.categories$ = this.categoryService.getAll();
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.productService.get(this.id).pipe(
        take(1)
      )
        .subscribe(p => this.product = p);
    }
  }

  ngOnInit() {
  }
  save(product) {
    if (this.id)
      this.productService.update(this.id, product);
    else
      this.productService.create(product);

    console.log(product);
    this.router.navigate(['/admin/products']);
  }
  delete() {
    if (confirm("Are you sure to delete this product?")) {
      this.productService.delete(this.id);
      this.router.navigate(['/admin/products']);
    }
  }

}
