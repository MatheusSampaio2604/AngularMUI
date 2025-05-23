import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
 
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

import { HomeComponent } from './shared/components/home/home.component';
//import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { AuthService } from './core/auth/auth.service';
import { HeaderComponent } from './shared/layout/header/header.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { UserManagerComponent } from './shared/components/user-manager/user-manager.component';
import { UserOptionsComponent } from './shared/components/user-options/user-options.component';
import { UserModalComponent } from './shared/components/user-manager/user-modal/user-modal.component';
import { MessageConfirmModalComponent } from './shared/components/modal/message-confirm-modal/message-confirm-modal.component';
import { MatSortModule } from '@angular/material/sort';
import { GroupsManagerComponent } from './shared/components/groups-manager/groups-manager.component';
import { PermissionsManagerComponent } from './shared/components/permissions-manager/permissions-manager.component';
import { GenericFormModalComponent } from './shared/components/modal/generic-form-modal/generic-form-modal.component';
import { TableFilterComponent } from './shared/components/generics/table-filter/table-filter.component';
import { SettingsComponent } from './shared/components/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    //LoginComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent,
    UserManagerComponent,
    UserOptionsComponent,
    UserModalComponent,
    MessageConfirmModalComponent,
    GroupsManagerComponent,
    PermissionsManagerComponent,
    GenericFormModalComponent,
    TableFilterComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatSelectModule,
    MatExpansionModule,
    MatDividerModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatSortModule,
  ],
  providers: [AuthService, provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
