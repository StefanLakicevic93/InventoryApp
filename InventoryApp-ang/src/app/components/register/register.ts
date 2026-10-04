import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  formData: any = {
    name: '',
    email: '',
    phoneNumber: '',
    password: ''
  };
  message: string | null = null;

  constructor(private service: ApiService,
              private router: Router
  ) {}

  async handleSubmit() {
    if(
      !this.formData.name ||
      !this.formData.email ||
      !this.formData.phoneNumber ||
      !this.formData.password
    ) {
      this.showMessage("All fields are required");
      return;
    }
    try {
      const response: any = await firstValueFrom(
        this.service.registerUser(this.formData)
      );
      if(response.status === 200) {
        this.showMessage(response.message);
        this.router.navigate(['/login']);
      }
    }
    catch(error: any) {
      console.log(error);
      this.showMessage(
        error?.error?.message || error?.message || "Unable to register user" + error);
    }
  }

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = null
    }, 4000);
  }

}
