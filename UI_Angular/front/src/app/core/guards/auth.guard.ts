import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const dataCookie: string | null = localStorage.getItem('user');
    const user: { username: string, token: string, expiration: number, role: string } = dataCookie ? JSON.parse(dataCookie) : null;
    const requiredRole: string[] = route.data['role'] || [];

    //console.warn(route.routeConfig?.path)
    console.warn(requiredRole)
    console.warn(user)

    if (user) {
      // Verifica se o usuário existe e se a data de expiração já passou
      const isExpired: Boolean = new Date().getTime() > user.expiration;

      //console.warn(user, isExpired)

      if (isExpired) {
        this.authService.logout();
        return false; // Bloqueia o acesso à rota
      } else if (!requiredRole.includes(user.role)) {
        return false; // Permite acessar a rota
      } else {
        return true;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }

  }
}
