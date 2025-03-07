import { Router } from "@angular/router";
import { Roles } from "../enum/roles.enum";
import { LoginUser } from "./login-user.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root' // Garante que o serviço está disponível globalmente
})

export class AuthService {
  /*  private userManager: UserManager;*/
  private tokenLoggedData: string = 'carboLoggedUserData';
  private tokenUserData: string = 'carboUserData';


  //public loginUser: LoginUser;

  constructor(private router: Router, private http: HttpClient) {

    //this.userManager = new UserManager({    //  authority: environment.IssuerUri,    //  client_id: 'CarboUi',    //  redirect_uri: environment.Uri + '/login-callback',
    //  response_type: 'code',    //  scope: 'openid profile email role carbo_api carbo_model',    //  post_logout_redirect_uri: environment.Uri    //});
    //this.loginUser = this.userLogged();
    //if (!this.loginUser) {
    //  this.loginUser = {
    //    username: '',
    //    email: '',
    //    profiles: []
    //  }

    //}

  }

  public logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  public async loginAsync(userLogin: LoginUser): Promise<boolean> {
    //const data = await this.http.post<any>('', userLogin);

    if (userLogin.username === 'admin' && userLogin.password === 'admin') {
      const user = {
        username: userLogin.username,
        token: 'abc123',
        expiration: new Date().getTime() + 450000, // 7.5 min em milissegundos
        role: Roles.Administrator
      };

      localStorage.setItem('user', JSON.stringify(user));
      return true;
    } else {
      return false;
    }


  }

  public async registerAsync(userRegister: LoginUser): Promise<boolean> {
    //const data = await this.http.post<any>('', userLogin);

    if (userRegister.username === 'admin' && userRegister.password === 'admin') {
      const user = {
        username: userRegister.username,
        token: 'abc123',
        expiration: new Date().getTime() + 450000,
        role: Roles.Administrator
        // 7.5 min em milissegundos
      };

      localStorage.setItem('user', JSON.stringify(user));
      return true;
    } else {
      return false;
    }


  }

  public userName(): string | null {
    const userCookie = localStorage.getItem('user');

    //console.warn(userCookie);

    if (userCookie) {
      return JSON.parse(userCookie).username;
    } else {
      return null;
    }
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
