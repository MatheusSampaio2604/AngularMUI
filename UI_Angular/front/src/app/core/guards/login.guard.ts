import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const userString: { username: string, token: string, expiration: number } = JSON.parse(localStorage.getItem('user') || '{}');

    if (userString) {
      try {
        const user = userString;
        const isExpired = !user.expiration || new Date().getTime() > user.expiration;

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
