import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-unauthorized',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.scss'
})
export class Unauthorized {

  private auth = inject(AuthService);
  private router = inject(Router);

  goHome(): void {
    this.router.navigateByUrl(this.auth.homeRoute());
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
