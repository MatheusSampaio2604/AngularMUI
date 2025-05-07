import { Component } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UserModalComponent } from './modal/user-modal/user-modal.component';
import { MessageConfirmModalComponent } from '../modal/message-confirm-modal/message-confirm-modal.component';
import { SnackBar } from '../../utils/snackBar';

@Component({
  selector: 'app-user-manager',
  standalone: false,
  templateUrl: './user-manager.component.html',
  styleUrl: './user-manager.component.css'
})
export class UserManagerComponent {
  displayedColumns: string[] = ['name', 'First Name', 'Last Name', 'level', 'roles', 'actions'];
  users: User[] = new Array;

  constructor(private _userService: UserService, private _dialog: MatDialog, private _snackBarUtils: SnackBar) {
    this.getUserList();
  }

  private async getUserList(): Promise<void> {
    this.users = await this._userService.GetUserList();
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

  addUser() {
    this.openDialog();
  }

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
    const success = await this._userService.removeUser(user);
    if (success) {
      this.getUserList();
      this._snackBarUtils.alertMessage('Usuário removido com sucesso.', ['success-snackbar']);
    } else {
      this._snackBarUtils.alertMessage('Erro ao remover usuário.', ['error-snackbar']);
    }
  }
}
