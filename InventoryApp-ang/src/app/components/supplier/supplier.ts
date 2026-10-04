import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-supplier',
  imports: [CommonModule],
  templateUrl: './supplier.html',
  styleUrl: './supplier.css'
})
export class Supplier {

  suppliers: any[] = [];
  message: string | null = null;

  constructor(private service: ApiService,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.getSuppliers();
  }

  getSuppliers(): void {
    this.service.getAllSuppliers().subscribe({
      next: (res: any) => {
        if(res.status === 200) {
          this.suppliers = res.suppliers;
        } else {
          this.showMessage(res.message);
        }
      }, error: (error) => {
        this.showMessage(
        error?.error?.message || error?.message || "Unable to get suppliers" + error);
      }
    })
  }

  navigateToAddSupplierPage(): void {
    this.router.navigate(['/add-supplier']);
  }

  navigateToEditSupplierPage(supplierId: string): void {
    this.router.navigate([`/edit-supplier/${supplierId}`]);
  }

  handleDeleteSupplier(supplierId: string): void {
    if(window.confirm("Are you sure you want to delete this supplier?")) {
      this.service.deleteSupplier(supplierId).subscribe({
      next: () => {
        this.showMessage("Supplier deleted successfully");
        this.getSuppliers();
      },
      error: (error) => {
        this.showMessage(
        error?.error?.message || error?.message || "Unable to delete supplier" + error);
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
