import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-sell',
  imports: [CommonModule, FormsModule],
  templateUrl: './sell.html',
  styleUrl: './sell.css'
})
export class Sell {

  products: any[] = [];
    suppliers: any[] = [];
    productId: string = '';
    description: string = '';
    quantity: string = '';
    message: string = '';
  
    constructor(private service: ApiService) {}
  
    ngOnInit(): void {
      this.fetchProducts();
    }
  
    fetchProducts(): void {
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
    }
  
    handleSubmit(): void {
      if(!this.productId || !this.quantity) {
        this.showMessage("Please fill all the fields");
        return;
      }
      const body = {
        productId: this.productId,
        description: this.description,
        quantity: parseInt(this.quantity, 10),
      }
      this.service.sellProduct(body).subscribe({
        next: (res: any) => {
          if(res.status === 200) {
            this.showMessage(res.message);
            this.resetForm();
          }      
        }, error: (error) => {
          this.showMessage(
          error?.error?.message || error?.message || "Unable to sell product" + error);
        }
      });
    }
  
    resetForm(): void {
      this.productId = '';
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
