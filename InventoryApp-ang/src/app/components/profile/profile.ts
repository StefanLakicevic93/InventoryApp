import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {

  user: any = null;
  message: string = '';

  constructor(private service: ApiService) {}

  ngOnInit(): void {
    this.fetchUserInfo();
  }

  fetchUserInfo(): void {
    this.service.getLoggedInUserInfo().subscribe({
      next: (res) => {
        this.user = res;
      }, error: (error) => {
        this.showMessage(
        error?.error?.message || error?.message || "Unable to get user info" + error);
      }
    })
  }

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }

}
