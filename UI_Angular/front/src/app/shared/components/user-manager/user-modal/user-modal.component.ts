import { ChangeDetectionStrategy, Component, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../../core/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../../core/models/user.model';
import { SnackBar } from '../../../utils/snackBar'
import { Groups } from '../../../../core/models/groups';
import { GroupsService } from '../../../../core/services/groups.service';

@Component({
  selector: 'app-user-modal',
  standalone: false,
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserModalComponent implements OnInit {
  userForm: FormGroup;
  isEditMode: boolean;

  levels = [0, 1, 2, 3];
  allGroups: Groups[] = [];

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<UserModalComponent>,
    private _userService: UserService,
    private _groupService: GroupsService,
    private _snackBarUtils: SnackBar,
    @Inject(MAT_DIALOG_DATA) public data: User | null
  ) {
    this.isEditMode = !!data;

    this.userForm = this._fb.group({
      Name: [data?.name || '', Validators.required],
      FirstName: [data?.firstName || ''],
      LastName: [data?.lastName || ''],
      Password: [data?.password || '', this.isEditMode ? [] : Validators.required],
      Level: [data?.level ?? 0, Validators.required],
      UserGroups: [data?.userGroups || [], Validators.required],
      Enabled: [data?.enabled ?? true]
    });

    if (this.isEditMode) {
      this.userForm.get('Password')?.disable();
    }
  }

  async ngOnInit(): Promise<void> {
    this.allGroups = await this._groupService.GetGroupsList();
  }

  save(): void {
    if (this.userForm.invalid) return;

    const user: User = { ...this.userForm.getRawValue() };

    if (this.data) {
      this._userService.updateUser(user).then(success => {
        if (success) {
          this._dialogRef.close(user);
        } else {
          this._snackBarUtils.alertMessage('Erro ao atualizar dados, tente novamente.', ['error-snackbar'])
        }
      });
    } else {
      this._userService.createUser(user).then(success => {
        if (success) {
          this._dialogRef.close(user);
        } else {
          this._snackBarUtils.alertMessage('Erro ao salvar usuário, tente novamente.', ['error-snackbar'])
        }
      });
    }
  }

  cancel(): void {
    this._dialogRef.close(null);
  }
}
