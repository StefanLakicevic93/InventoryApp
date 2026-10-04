import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Pagination } from '../pagination/pagination';

@Component({
  selector: 'app-transaction',
  imports: [CommonModule, Pagination, FormsModule],
  templateUrl: './transaction.html',
  styleUrl: './transaction.css'
})
export class Transaction {

  transactions: any[] = [];
  message: string = '';
  searchInput: string = '';
  valueToSearch: string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 5;

  constructor(private service: ApiService,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.service.getAllTransactions(this.valueToSearch).subscribe({
      next: (res: any) => {
        const transactions = res.transactions || [];
        this.totalPages = Math.ceil(transactions.length / this.itemsPerPage);
        this.transactions = transactions.slice(
          (this.currentPage - 1) * this.itemsPerPage,
          this.currentPage * this.itemsPerPage);
      }, error: (error) => {
        this.showMessage(
        error?.error?.message || error?.message || "Unable to fetch transactions" + error);
      }
    })
  }

  handleSearch(): void {
    this.currentPage = 1;
    this.valueToSearch = this.searchInput;
    this.loadTransactions();
  }

  navigateToTransactionDetailsPage(transactionId: string): void {
    this.router.navigate([`/transaction/${transactionId}`]);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTransactions();
  }

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }

}
