import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Pagination } from '../pagination/pagination';

@Component({
  selector: 'app-product',
  imports: [CommonModule, Pagination],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class Product {

  products: any[] = [];
  message: string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 10;

  constructor(private service: ApiService,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.service.getAllProducts().subscribe({
      next: (res: any) => {
        const products = res.products || [];
        this.totalPages = Math.ceil(products.length / this.itemsPerPage);
        this.products = products.slice(
          (this.currentPage - 1) * this.itemsPerPage,
          this.currentPage * this.itemsPerPage);
      }, error: (error) => {
        this.showMessage(
        error?.error?.message || error?.message || "Unable to fetch products" + error);
      }
    })
  }

  handleDeleteProduct(productId: string): void {
    if(window.confirm("Are you sure you want to delete this product?")) {
      this.service.deleteProduct(productId).subscribe({
      next: (res: any) => {
        if(res.status === 200) {
          this.showMessage("Product deleted successfully");
          this.fetchProducts();
        }
      }, error: (error) => {
        this.showMessage(
        error?.error?.message || error?.message || "Unable to delete product" + error);
      }
    })
    }
  }

  navigateToAddProductPage(): void {
    this.router.navigate(['/add-product']);
  }

  navigateToEditProductPage(productId: string): void {
    this.router.navigate([`/edit-product/${productId}`]);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchProducts();
  }

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }

}
