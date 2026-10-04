import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
  constructor(private service: ApiService,
              private router: Router,
              private cdr: ChangeDetectorRef
  ) {}

  isAuth(): boolean {
    return this.service.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.service.isAdmin();
  }

  logout() {
    this.service.logout();
    this.cdr.detectChanges();
  }

}
