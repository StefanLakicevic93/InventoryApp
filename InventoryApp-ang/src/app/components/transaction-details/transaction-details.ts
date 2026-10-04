import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-transaction-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-details.html',
  styleUrl: './transaction-details.css'
})
export class TransactionDetails {

  transactionId: string = '';
  transaction: any = null;
  status: string = '';
  message: string = '';

  constructor(private service: ApiService,
              private route: ActivatedRoute,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.transactionId = params['transactionId'];
      this.getTransactionDetails();
    })
  }

  getTransactionDetails(): void {
    if(this.transactionId) {
      this.service.getTransactionById(this.transactionId).subscribe({
        next: (transactionData: any) => {
          if(transactionData.status === 200) {
            this.transaction = transactionData.transaction;
            this.status = this.transaction.status;
          }
        }, error: (error) => {
          this.showMessage(
        error?.error?.message || error?.message || "Unable to fetch transaction by id" + error);
        }
      })
    }
  }

  handleUpdateStatus(): void {
    if(this.transactionId && this.status) {
      this.service.updateTransactionStatus(this.transactionId, this.status).subscribe({
        next: (result) => {
          this.router.navigate(['/transaction']);
        }, error: (error) => {
          this.showMessage(
        error?.error?.message || error?.message || "Unable to update transaction by id" + error);
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
