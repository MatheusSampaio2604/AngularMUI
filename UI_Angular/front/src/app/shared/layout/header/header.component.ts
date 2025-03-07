import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  username: string | null;

  constructor(private router: Router, private authService: AuthService) {
    this.username = this.getUserName();
  }

  toggleMenu() {
    this.sidenav.toggle();
  }

  getUserName(): string | null {
    return this.authService.userName();
  }

  logout() {
    this.authService.logout();
  }
}
