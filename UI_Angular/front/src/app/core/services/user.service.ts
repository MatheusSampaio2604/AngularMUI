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

  public async GetUserByName(name: string): Promise<User | null> {
    try {
      const data: any = await firstValueFrom(
        this._http.get<any>(`${environment.ApiUrl}/User/GetUserByName?name=${name}`, { headers: this._auth.getHeaders() })
      );
      if (data && data.message === 'Success') {
        return data.data;
      }

      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public async createUser(data: User): Promise<boolean> {
    try {
      const headers = this._auth.getHeaders();
      // data.password = await this._auth.encryptPassword(data.password!);

      const response = await firstValueFrom(this._http.post<any>(`${environment.ApiUrl}/User/CreateUserAsync`, data, { headers }));

      return response.message === 'Success';

    } catch (e) {
      console.error(e);
      return false;
    }

  }

  public async updateUser(data: User): Promise<boolean> {
    try {
      const headers = this._auth.getHeaders();
      const response = await firstValueFrom(this._http.put<any>(`${environment.ApiUrl}/User/UpdateUserAsync`, data, { headers }));

      return response.message === 'Success';

    } catch (e) {
      console.error(e);
      return false;
    }

  }

  public async removeUser(data: User): Promise<boolean> {
    try {
      const headers = this._auth.getHeaders();
      const response = await firstValueFrom(this._http.delete<any>(`${environment.ApiUrl}/User/DeleteUser?name=${data.name}`, { headers }));

      return response.message === 'Success';

    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
