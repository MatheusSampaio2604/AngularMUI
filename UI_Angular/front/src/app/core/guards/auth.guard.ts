import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { JwtPayload } from '../auth/interfaces/IJwtPayload';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService, private cookieService: CookieService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const dataCookie: string | null = this.cookieService.get('user');
    const user: JwtPayload = dataCookie ? JSON.parse(dataCookie) : null;
    const requiredRole: string[] = route.data['roles'] || [];

    if (user) {
      const isExpired: Boolean = new Date().getTime() > user.exp * 1000;

      if (isExpired) {
        this.authService.logout();
        return false;
      }

      const hasRequiredRole = user.roles?.some((role: string) =>
        requiredRole.includes(role)
      );

      if (!hasRequiredRole) {
        this.router.navigate(['/unauthorized']);
        return false;
      }

      return true;

    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
