import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-purchase',
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase.html',
  styleUrl: './purchase.css'
})
export class Purchase {

  products: any[] = [];
  suppliers: any[] = [];
  productId: string = '';
  supplierId: string = '';
  description: string = '';
  quantity: string = '';
  message: string = '';

  constructor(private service: ApiService) {}

  ngOnInit(): void {
    this.fetchProductsAndSuppliers();
  }

  fetchProductsAndSuppliers(): void {
    this.service.getAllProducts().subscribe({
      next: (res: any) => {
        if(res.status === 200) {
          this.products = res.products;
        }      
      }, error: (error) => {
        this.showMessage(
        error?.error?.message || error?.message || "Unable to fetch products" + error);
      }
    });
    this.service.getAllSuppliers().subscribe({
      next: (res: any) => {
        if(res.status === 200) {
          this.suppliers = res.suppliers;
        }      
      }, error: (error) => {
        this.showMessage(
        error?.error?.message || error?.message || "Unable to fetch suppliers" + error);
      }
    });
  }

  handleSubmit(): void {
    if(!this.productId || !this.supplierId || !this.quantity) {
      this.showMessage("Please fill all the fields");
      return;
    }
    const body = {
      productId: this.productId,
      supplierId: this.supplierId,
      description: this.description,
      quantity: parseInt(this.quantity, 10),
    }
    this.service.purchaseProduct(body).subscribe({
      next: (res: any) => {
        if(res.status === 200) {
          this.showMessage(res.message);
          this.resetForm();
        }      
      }, error: (error) => {
        this.showMessage(
        error?.error?.message || error?.message || "Unable to purchase product" + error);
      }
    });
  }

  resetForm(): void {
    this.productId = '';
    this.supplierId = '';
    this.description = '';
    this.quantity = '';
  };

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }

}
