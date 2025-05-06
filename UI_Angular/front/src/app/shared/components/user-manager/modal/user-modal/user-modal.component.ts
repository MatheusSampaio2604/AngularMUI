import { ChangeDetectionStrategy, Component, Inject, OnInit, signal } from '@angular/core';
import { User } from '../../../../../core/models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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

  levels = [0, 1, 2, 3, 4, 5];
  allGroups = ['Administrator', 'Operator', 'Supervisor']; // substitua por dados reais se necessário

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserModalComponent>,

    @Inject(MAT_DIALOG_DATA) public data: User | null
  ) {
    this.isEditMode = !!data;

    this.userForm = this.fb.group({
      Name: [data?.name || '', Validators.required],
      FirstName: [data?.firstName || ''],
      LastName: [data?.lastName || ''],
      Level: [data?.level ?? 0, Validators.required],
      Password: [data?.password || '', this.isEditMode ? [] : Validators.required],
      UserGroups: [data?.userGroups || [], Validators.required],
      Enabled: [data?.enabled ?? true]
    });

    if (this.isEditMode) {
      this.userForm.get('Password')?.disable();
    }
  }

  ngOnInit(): void { }

  save(): void {
    if (this.userForm.invalid) return;

    const user: User = {
      ...this.userForm.getRawValue()
    };

    this.dialogRef.close(user);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
