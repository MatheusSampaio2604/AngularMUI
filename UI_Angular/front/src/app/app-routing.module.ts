import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './core/guards/login.guard';
import { AuthGuard } from './core/guards/auth.guard';

import { Roles } from './core/enum/roles.enum';
import { HomeComponent } from './shared/components/home/home.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { UserManagerComponent } from './shared/components/user-manager/user-manager.component';
import { UserOptionsComponent } from './shared/components/user-options/user-options.component';
import { GroupsManagerComponent } from './shared/components/groups-manager/groups-manager.component';
import { PermissionsManagerComponent } from './shared/components/permissions-manager/permissions-manager.component';
import { SettingsComponent } from './shared/components/settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => import('./core/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [LoginGuard],
  },
  {
    path: 'register',
    title: 'Register',
    component: RegisterComponent,
    canActivate: [LoginGuard],
  },

  {
    path: 'home',
    title: 'Pagina Inicial',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { roles: [Roles.Supervisor, Roles.Administrator, Roles.Operator] }
  },
  {
    path: 'account',
    title: 'Conta',
    component: UserOptionsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Roles.Supervisor, Roles.Administrator, Roles.Operator] }
  },
  {
    path: 'usermanage',
    title: 'Gerenciamento de Usuários',
    component: UserManagerComponent,
    canActivate: [AuthGuard],
    data: { roles: [Roles.Supervisor, Roles.Administrator] }
  },
  {
    path: 'groups',
    title: 'Gerenciamento de Grupos',
    component: GroupsManagerComponent,
    canActivate: [AuthGuard],
    data: { roles: [Roles.Supervisor] }
  },
  {
    path: 'permissions',
    title: 'Gerenciamento de Permissões',
    component: PermissionsManagerComponent,
    canActivate: [AuthGuard],
    data: { roles: [Roles.Supervisor] }
  },
  {
    path: 'settings',
    title: 'Configurações',
    component: SettingsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Roles.Supervisor, Roles.Administrator, Roles.Operator] }
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
