import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { Roles } from '../../../core/enum/roles.enum';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  username: string | null;
  userRoles: string[] | null;
  Roles = Roles;

  constructor(private router: Router, private authService: AuthService) {
    this.username = this.getUserName();
    this.userRoles = this.getRoles();
    //  console.warn(this.username);
    //console.warn(this.userRoles);
  }

  toggleMenu() {
    this.sidenav.toggle();
  }

  getUserName(): string | null {
    return this.authService.userName();
  }

  getRoles(): string[] | null {
    return this.authService.roles();
  }


  logout() {
    this.authService.logout();
  }
}
