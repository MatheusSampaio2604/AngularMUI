import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { firstValueFrom } from 'rxjs';
import { Permissions } from '../models/permissions';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private _router: Router, private _http: HttpClient, private _auth: AuthService) { }

  public async GetPermissionsList(): Promise<Permissions[]> {
    try {
      const data: any = await firstValueFrom(
        this._http.get(`${environment.ApiUrl}/User/Permissions`, { headers: this._auth.getHeaders() })
      );
      var permissions: Permissions[] = [];

      if (data && data.message === 'Success') {
        permissions = data.data;

        return permissions;
      }

      return permissions;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  public async createPermission(data: Permissions): Promise<boolean> {
    try {
      const headers = this._auth.getHeaders();

      const response = await firstValueFrom(this._http.post<any>(`${environment.ApiUrl}/User/CreatePermissionAsync`, data, { headers }));

      return response.message === 'Success';

    } catch (e) {
      console.error(e);
      return false;
    }

  }

  public async updatePermission(data: Permissions): Promise<boolean> {
    try {
      const headers = this._auth.getHeaders();
      const response = await firstValueFrom(this._http.put<any>(`${environment.ApiUrl}/User/UpdatePermissionAsync`, data, { headers }));

      return response.message === 'Success';
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  public async removePermission(data: Permissions): Promise<boolean> {
    try {
      const headers = this._auth.getHeaders();
      const response = await firstValueFrom(this._http.delete<any>(`${environment.ApiUrl}/User/DeletePermissionAsync?name=${data.name}`, { headers }));

      return response.message === 'Success';
    } catch (e) {
      console.error(e);
      return false;
    }
  }

}
