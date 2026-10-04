import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

formData: any = {
    email: '',
    password: ''
  };
  message: string | null = null;

  constructor(private service: ApiService,
              private router: Router
  ) {}

  async handleSubmit() {
    if(
      !this.formData.email ||
      !this.formData.password
    ) {
      this.showMessage("All fields are required");
      return;
    }
    try {
      const response: any = await firstValueFrom(
        this.service.loginUser(this.formData)
      );
      if(response.status === 200) {
        this.service.encryptAndSaveToStorage('token', response.token);
        this.service.encryptAndSaveToStorage('role', response.role);
        this.router.navigate(['/dashboard']);
      }
    }
    catch(error: any) {
      console.log(error);
      this.showMessage(
        error?.error?.message || error?.message || "Unable to login" + error);
    }
  }

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = null
    }, 4000);
  }

}
