import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JwtPayload } from '../auth/interfaces/IJwtPayload';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private router: Router, private _cookieService: CookieService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const cookie = this._cookieService.get('user');
    const userString: JwtPayload = cookie ? JSON.parse(cookie) : null;

    if (userString) {
      try {
        const user = userString;
        const isExpired = !user.exp || new Date().getTime() > user.exp * 1000;

        if (!isExpired) {
          this.router.navigate(['/home']);
          return false; // Impede o acesso à tela de login se o usuário estiver autenticado
        }
      } catch (error) {
        console.error('Erro ao analisar o usuário do localStorage:', error);
      }
    }

    return true; // Permite acessar a página de login se não estiver autenticado
  }
}
