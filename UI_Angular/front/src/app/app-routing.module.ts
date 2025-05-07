import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './core/guards/login.guard';
import { AuthGuard } from './core/guards/auth.guard';

import { HomeComponent } from './shared/components/home/home.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { UserManagerComponent } from './shared/components/user-manager/user-manager.component';
import { UserOptionsComponent } from './shared/components/user-options/user-options.component';
import { Roles } from './core/enum/roles.enum';
import { GroupsManagerComponent } from './shared/components/groups-manager/groups-manager.component';
import { PermissionsManagerComponent } from './shared/components/permissions-manager/permissions-manager.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LoginGuard] },

  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { roles: [Roles.Supervisor, Roles.Administrator, Roles.Operator] } },
  { path: 'account', component: UserOptionsComponent, canActivate: [AuthGuard], data: { roles: [Roles.Supervisor, Roles.Administrator, Roles.Operator] } },
  { path: 'usermanage', component: UserManagerComponent, canActivate: [AuthGuard], data: { roles: [Roles.Supervisor, Roles.Administrator] } },

  { path: 'groups', component: GroupsManagerComponent, canActivate: [AuthGuard], data: { roles: [Roles.Supervisor] } },
  { path: 'permissions', component: PermissionsManagerComponent, canActivate: [AuthGuard], data: { roles: [Roles.Supervisor] } },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
