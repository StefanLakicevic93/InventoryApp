import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css'
})
export class Pagination {

  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>;

  get pageNumbers() {
    return Array.from({
      length: this.totalPages
    },
  (_, i) => i + 1);
  }

  onPageChange(page: number): void {
    if(page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

}
