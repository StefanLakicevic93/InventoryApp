import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface Categ {
  id: string,
  name: string
}

@Component({
  selector: 'app-category',
  imports: [CommonModule, FormsModule],
  templateUrl: './category.html',
  styleUrl: './category.css'
})
export class Category {

  categories: Categ[] = [];
  categoryName: string = '';
  message: string = '';
  isEditing: boolean = false;
  editingCategoryId: string | null = null;

  constructor(private service: ApiService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
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

  addCategory(): void {
    if(!this.categoryName) {
      this.showMessage("Category name is required");
      return;
    }
    this.service.createCategory({name: this.categoryName}).subscribe({
      next: (res: any) => {
        if(res.status === 200) {
          this.showMessage("Category added successfully");
          this.categoryName = '';
          this.getCategories();
        }
      }, error: (error) => {
        this.showMessage(
        error?.error?.message || error?.message || "Unable to add category" + error);
      }
    })
  }

  editCategory(): void {
    if(!this.editingCategoryId || !this.categoryName) {
      return;
    }
    this.service.updateCategoryBy(this.editingCategoryId, {name: this.categoryName}).subscribe({
      next: (res: any) => {
        if(res.status === 200) {
          this.showMessage("Category updated successfully");
          this.categoryName = '';
          this.isEditing = false;
          this.getCategories();
        }
      }, error: (error) => {
        this.showMessage(
        error?.error?.message || error?.message || "Unable to edit category" + error);
      }
    })
  }

  handleEditCategory(category: Categ): void {
    this.isEditing = true;
    this.editingCategoryId = category.id;
    this.categoryName = category.name;
  }

  handleDeleteCategory(categoryId: string): void {
    if(window.confirm("Are you sure you want to delete this category?")) {
      this.service.deleteCategory(categoryId).subscribe({
      next: (res: any) => {
        if(res.status === 200) {
          this.showMessage("Category deleted successfully");
          this.getCategories();
        }
      }, error: (error) => {
        this.showMessage(
        error?.error?.message || error?.message || "Unable to delete category" + error);
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
