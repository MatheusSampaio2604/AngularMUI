import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Groups } from '../models/groups';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor(private _router: Router, private _http: HttpClient, private _auth: AuthService) { }

  public async GetGroupsList(): Promise<Groups[]> {
    try {
      const data: any = await firstValueFrom(
        this._http.get(`${environment.ApiUrl}/User/Groups`, { headers: this._auth.getHeaders() })
      );
      var groups: Groups[] = [];

      if (data && data.message === 'Success') {
        groups = data.data;

        return groups;
      }

      return groups;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  public async createGroup(data: Groups): Promise<boolean> {
    try {
      const headers = this._auth.getHeaders();

      const response = await firstValueFrom(this._http.post<any>(`${environment.ApiUrl}/User/CreateGroupAsync`, data, { headers }));

      return response.message === 'Success';

    } catch (e) {
      console.error(e);
      return false;
    }

  }

  public async updateGroup(data: Groups): Promise<boolean> {
    try {
      const headers = this._auth.getHeaders();
      const response = await firstValueFrom(this._http.put<any>(`${environment.ApiUrl}/User/UpdateGroupAsync`, data, { headers }));

      return response.message === 'Success';

    } catch (e) {
      console.error(e);
      return false;
    }

  }

  public async removeGroup(data: Groups): Promise<boolean> {
    try {
      const headers = this._auth.getHeaders();
      const response = await firstValueFrom(this._http.delete<any>(`${environment.ApiUrl}/User/DeleteGroupAsync?name=${data.name}`, { headers }));

      return response.message === 'Success';

    } catch (e) {
      console.error(e);
      return false;
    }
  }

}
