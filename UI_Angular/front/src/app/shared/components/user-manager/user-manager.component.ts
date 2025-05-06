import { Component } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UserModalComponent } from './modal/user-modal/user-modal.component';

@Component({
  selector: 'app-user-manager',
  standalone: false,
  templateUrl: './user-manager.component.html',
  styleUrl: './user-manager.component.css'
})
export class UserManagerComponent {
  displayedColumns: string[] = ['name', 'First Name', 'Last Name', 'level', 'roles', 'actions'];
  users: User[];
  //  = [
  //  { name: 'Admin 1', email: 'admin1@email.com', role: 'Administrator' },
  //  { name: 'User 1', email: 'user1@email.com', role: 'User' },
  //  { name: 'Admin 2', email: 'admin2@email.com', role: 'Administrator' },
  //  { name: 'User 2', email: 'user2@email.com', role: 'User' }
  //];

  constructor(private _userService: UserService, private _dialog: MatDialog) {
    this.users = [];
    this.getUserList();
  }

  private async getUserList(): Promise<void> {
    this.users = await this._userService.GetUserList();
  }

  editUser(user: User) {
    this.openDialog(user);
  }

  addUser() {
    this.openDialog();
  }

  private openDialog(data?: User): void {
    const dialogRef = this._dialog.open(UserModalComponent, {
      width: '750px',
      data: data
    });

    dialogRef.afterClosed().subscribe((result: User | null) => {
      if (result) {
        console.warn('dados recebidos:', result, data)
        if (data) {
          //this._userService.UpdateUser(result);
        } else {
          //this._userService.CreateUser(result);
        }
        //this.getUserList();
      }
    });
  }


}
