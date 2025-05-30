import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UserModalComponent } from './user-modal/user-modal.component';
import { MessageConfirmModalComponent } from '../modal/message-confirm-modal/message-confirm-modal.component';
import { SnackBar } from '../../utils/snackBar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { createFilterPredicate } from '../../utils/table-filter-utils';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-user-manager',
  standalone: false,
  templateUrl: './user-manager.component.html',
  styleUrl: './user-manager.component.css'
})
export class UserManagerComponent {
  displayedColumns: string[] = ['name', 'lastName', 'firstName', 'level', 'roles', 'actions'];
  users = new MatTableDataSource<User>();
  totalUsers = 0;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filterValue: string = '';

  constructor(
    private _userService: UserService,
    private _dialog: MatDialog,
    private _snackBarUtils: SnackBar,
    private _authService: AuthService
  ) {
    this.users.filterPredicate = createFilterPredicate<User>(['name', 'firstName', 'lastName', 'level', 'userGroups']);

    this.getUserList();
  }

  applyFilter(value: string) {
    this.users.filter = value; 
  }

  private async getUserList(): Promise<void> {
    const result = await this._userService.GetUserList();
    this.users.data = result;
    this.users.sort = this.sort;
    this.users.paginator = this.paginator;
    this.totalUsers = result.length;
  }

  editUser(user: User) {
    this.openDialog(user);
  }

  removeUser(user: User) {
    this._dialog.open(MessageConfirmModalComponent, {
      width: '400px',
      data: {
        message: `Tem certeza que deseja remover o usuário "${user.name}"?`,
        action: async () => await this.deleteUser(user)
      }
    });
  }

  hasAction(name: string): boolean {
    const userName = this._authService.userName();
    return userName === name;
  }

  addUser = () =>  this.openDialog();

  private openDialog(data?: User): void {
    const dialogRef = this._dialog.open(UserModalComponent, {
      width: '750px',
      data: data
    });

    dialogRef.afterClosed().subscribe(async (result: User | null) => {
      if (result) {
        this._snackBarUtils.alertMessage('Sucesso.', ['success-snackbar']);
        this.getUserList();
      }
    });
  }

  private async deleteUser(user: User): Promise<void> {
    if (!user) {
      this._snackBarUtils.alertMessage('Usuário não encontrado.', ['error-snackbar']);
      return;
    }

    const success = await this._userService.removeUser(user);
    if (success) {
      this.getUserList();
      this._snackBarUtils.alertMessage('Usuário removido com sucesso.', ['success-snackbar']);
    } else {
      this._snackBarUtils.alertMessage('Erro ao remover usuário.', ['error-snackbar']);
    }
  }
}
