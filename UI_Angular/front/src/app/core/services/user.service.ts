import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _router: Router, private _http: HttpClient, private _auth: AuthService) { }

  public async GetUserList(): Promise<User[]> {
    try {
      const data: any = await firstValueFrom(
        this._http.get(`${environment.ApiUrl}/User/users`, { headers: this._auth.getHeaders() })
      );
      var users: User[] = [];

      if (data && data.message === 'Success') {
        users = data.data;

        return users;
      }

      return users;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
