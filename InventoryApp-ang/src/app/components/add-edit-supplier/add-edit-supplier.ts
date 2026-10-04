import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-add-edit-supplier',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-supplier.html',
  styleUrl: './add-edit-supplier.css'
})
export class AddEditSupplier {

  message: string = '';
  isEditing: boolean = false;
  supplierId: string | null = null;
  formData: any = {
    name: '',
    address: ''
  };

  constructor(private service: ApiService,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.supplierId = this.router.url.split('/')[2];
    if(this.supplierId) {
      this.isEditing = true;
      this.fetchSupplier();
    }
  }

  fetchSupplier(): void {
    this.service.getSupplierById(this.supplierId!).subscribe({
      next: (res: any) => {
        if(res.status === 200) {
          this.formData = {
          name: res.supplier.name,
          address: res.supplier.address
        };
        }      
      }, error: (error: any) => {
        this.showMessage(
        error?.error?.message || error?.message || "Unable to fetch supplier" + error);
      }
    });
  }

  handleSubmit() {
    if(!this.formData.name || !this.formData.address) {
      this.showMessage("All fields are required");
      return;
    }
    const supplierData = {
      name: this.formData.name,
      address: this.formData.address
    };
    if(this.isEditing) {
      this.service.updateSupplierBy(this.supplierId!, supplierData).subscribe({
        next: (res: any) => {
          if(res.status === 200) {
            this.showMessage("Supplier updated successfully");
            this.router.navigate(['/supplier']);
          }
        }, error: (error) => {
          this.showMessage(error?.error?.message || error?.message || "Unable to edit supplier" + error);
        }
      });
    }
    else {
      this.service.addSupplier(supplierData).subscribe({
        next: (res: any) => {
          if(res.status === 200) {
            this.showMessage("SUpplier added successfully");
            this.router.navigate(['/supplier']);
          }
        }, error: (error: any) => {
          this.showMessage(error?.error?.message || error?.message || "Unable to add supplier" + error);
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
