import { Router } from "@angular/router";
import { Roles } from "../enum/roles.enum";
import { LoginUser } from "./login-user.model";
import { Injectable, OnDestroy } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment.prod";
import { firstValueFrom } from "rxjs";
import { CookieService } from 'ngx-cookie-service';
import { CleanJwtPayload, JwtPayload } from "./interfaces/IJwtPayload";

@Injectable({
  providedIn: 'root'
})

export class AuthService implements OnDestroy{
  private checkInterval: any;

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService) { }

  ngOnDestroy(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  public async encryptPassword(password: string): Promise<string> {
    const data = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    //console.warn(hashHex)
    return hashHex;
  }

  private async decodeToken(token: string): Promise<JwtPayload | null> {
    try {
      const payload = token.split('.')[1];
      const decoded: JwtPayload = JSON.parse(atob(payload));
      decoded.name = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      decoded.roles = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      decoded.token = token;

      return decoded;
    } catch (e) {
      console.error('Erro ao decodificar o token:', e);
      return null;
    }
  }

    public userData() {
    try
    {
      const userCookie = this.cookieService.get('user');
      if (userCookie != undefined) {
        const user = JSON.parse(userCookie);
        console.log("USER DATA:", user)
        return user;
      }
      return "";
    }
    catch (e) {
      console.error(e);
    }
  }
  
  private async mapJwtPayload(decoded: JwtPayload): Promise<CleanJwtPayload> {
    return {
      username: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      roles: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
      level: decoded.level,
      expiration: decoded.exp
    };
  }

  public logout(): void {
    this.cookieService.delete('user');
    this.router.navigate(['/login']);
  }

  public async loginAsync(userLogin: LoginUser): Promise<boolean> {
    userLogin.password = await this.encryptPassword(userLogin.password!);
    try {
      const data = await firstValueFrom(this.http.post<any>(`${environment.ApiUrl}/User/LoginRequest`, userLogin));

      if (data.message === 'Success') {
        const decrypt = await this.decodeToken(data.data);
        //console.warn('decrypt', decrypt)
        if (decrypt) {
          this.cookieService.set('user', JSON.stringify(decrypt), new Date(decrypt.exp * 1000));
          this.startAuthWatcher();
          return true;
        }

        return false;
      } else { return false; }
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  public async registerAsync(userRegister: LoginUser): Promise<boolean> {
    //const data = await this.http.post<any>('', userLogin);
    return false;

  }

  public userName(): string | null {
    const userCookie = this.cookieService.get('user');

    if (userCookie) {
      return JSON.parse(userCookie).sub;
    } else {
      return null;
    }
  }

  public roles(): string[] | null {
    const userCookie = this.cookieService.get('user');

    if (userCookie) {
      return JSON.parse(userCookie)?.roles;
    } else {
      return null;
    }
  }

  public token(): string | null {
    const userCookie = this.cookieService.get('user');
    return userCookie ? JSON.parse(userCookie)?.token : null;
  }

  public getHeaders(): HttpHeaders {
    const token = this.token();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}`, });
  }

  public isAuthenticated(): boolean {
    const userCookie = this.cookieService.get('user');
    if (userCookie) {
      const decoded: JwtPayload = JSON.parse(userCookie);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    }
    return false;
  }

  public startAuthWatcher(intervalMs: number = 30000): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(() => {
      console.log('Checking authentication status...');
      if (!this.isAuthenticated()) {
        clearInterval(this.checkInterval);
        this.router.navigate(['/login']);
      }
    }, intervalMs);
  }

  //public logout(): Promise<void> {
  //  //localStorage.removeItem(environment.tokenName);
  //  //localStorage.removeItem(this.tokenLoggedData);
  //  //localStorage.removeItem(this.tokenUserData);
  //  /*localStorage.removeItem(this.loginUser);*/
  //  return this.userManager.signoutRedirect();
  //}

  //public async completeAuthentication(): Promise<User> {
  //  this.loginUser = this.userLogged();
  //  if (this.loginUser) {
  //    //console.log('loginuser: ', this.loginUser);
  //    return JSON.parse(localStorage.getItem(this.tokenUserData));
  //  }

  //  const user = await this.userManager.signinRedirectCallback();
  //  const usr = await this.getUser();
  //  console.log('user: ', usr);

  //  var roles = []
  //  if (Array.isArray(usr.profile.role))
  //    roles = usr.profile.role;
  //  else
  //    roles = [usr.profile.role];


  //  this.loginUser = {
  //    username: usr.profile.given_name,
  //    email: usr.profile.email,
  //    profiles: roles
  //  };


  //  localStorage.setItem(this.tokenLoggedData, JSON.stringify(this.loginUser));
  //  localStorage.setItem(this.tokenUserData, JSON.stringify(usr));
  //  localStorage.setItem(environment.tokenName, usr.access_token);

  //  return user;
  //}

  //public getUser(): Promise<User> {
  //  const user = this.userManager.getUser();
  //  console.log('get:', user);
  //  return user;
  //}

  //public userLogged(): LoginUser {
  //  if (localStorage.getItem(this.tokenLoggedData) == null || localStorage.getItem(environment.tokenName) == null || localStorage.getItem(this.tokenUserData) == null)
  //    return null;
  //  const user = JSON.parse(localStorage.getItem(this.tokenLoggedData));
  //  //console.log('loggeduser:',user);
  //  return user;
  //}

  //public ContainsPermission(permissions: Roles[]): boolean {

  //  for (var i = 0; i < permissions.length; i++) {
  //    if (permissions[i] == Roles.Administrator && this.userLogged().profiles.findIndex(x => x == "Carbo_Administrator") != -1)
  //      return true;
  //    //if (permissions[i] == Roles.Metallurgist && this.userLogged().profiles.findIndex(x => x == "Carbo_Metallurgist") != -1)
  //    //  return true;
  //    if (permissions[i] == Roles.Operator && this.userLogged().profiles.findIndex(x => x == "Carbo_Operator") != -1)
  //      return true;
  //  }
  //  return false;



  //}


}
