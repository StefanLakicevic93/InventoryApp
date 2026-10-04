import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-product',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-edit-product.html',
  styleUrl: './add-edit-product.css'
})
export class AddEditProduct {

  productId: string | null = null;
  name: string = '';
  sku: string = '';
  price: string = '';
  categoryId: string = '';
  description: string = '';
  imageFile: File | null = null;
  imageUrl: string = '';
  isEditing: boolean = false;
  categories: any[] = [];
  message: string = '';
  stockQuantity: string = '';

  constructor(private service: ApiService,
              private route: ActivatedRoute,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productId');
    this.fetchCategories();
    if(this.productId) {
      this.isEditing = true;
      this.fetchProductById(this.productId);
    }
  }

  fetchCategories(): void {
    this.service.getAllCategories().subscribe({
      next: (res: any) => {
        if(res.status === 200) {
          this.categories = res.categories;
        }
      }, error: (error) => {
        this.showMessage(
        error?.error?.message || error?.message || "Unable to get all categories" + error);
      }
    })
  }

  fetchProductById(productId: string): void {
    this.service.getProductById(productId).subscribe({
      next: (res: any) => {
        if(res.status === 200) {
          const product = res.product;
        this.name = product.name;
        this.sku = product.sku;
        this.stockQuantity = product.stockQuantity;
        this.price = product.price;
        this.categoryId = product.categoryId;
        this.description = product.description;
        this.imageUrl = product.imageUrl;
        } else {
          this.showMessage(res.message);
        }       
      }, error: (error) => {
        this.showMessage(
        error?.error?.message || error?.message || "Unable to get all categories" + error);
      }
    })
  }

  handleImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if(input?.files?.[0]) {
      this.imageFile = input.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        this.imageUrl = reader.result as string;
      }
      reader.readAsDataURL(this.imageFile);
    }
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", this.name);
    formData.append("sku", this.sku);
    formData.append("stockQuantity", this.stockQuantity);
    formData.append("price", this.price);
    formData.append("categoryId", this.categoryId);
    formData.append("description", this.description);
    if(this.imageFile) {
      formData.append("imageFile", this.imageFile);
    }
    if(this.isEditing) {
      formData.append("productId", this.productId!);
      this.service.updateProduct(formData).subscribe({
        next: (res: any) => {
          if(res.status === 200) {
            this.showMessage("Product updated successfully");
            this.router.navigate(['/product']);
          }
        }, error: (error) => {
          this.showMessage(
        error?.error?.message || error?.message || "Unable to update product" + error);
        }
      })
    } else {
      this.service.addProduct(formData).subscribe({
        next: (res: any) => {
          if(res.status === 200) {
            this.showMessage("Product added successfully");
            this.router.navigate(['/product']);
          }
        }, error: (error) => {
          this.showMessage(
        error?.error?.message || error?.message || "Unable to add product" + error);
        }
      })
    }
  }

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }

}
