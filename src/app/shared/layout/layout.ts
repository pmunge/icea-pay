import { Component, inject } from '@angular/core';
import { CommonModule} from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {RouterOutlet, Router} from '@angular/router';


import { Sidebar } from '../sidebar/sidebar';
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RouterOutlet,
    Sidebar,
    Breadcrumbs
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly user = this.auth.currentUser;

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
