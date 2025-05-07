import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Groups } from '../../../../core/models/groups';
import { Permissions } from '../../../../core/models/permissions';
import { PermissionsService } from '../../../../core/services/permissions.service';

@Component({
  selector: 'app-generic-form-modal',
  standalone: false,
  templateUrl: './generic-form-modal.component.html',
  styleUrl: './generic-form-modal.component.css',
})
export class GenericFormModalComponent implements OnInit {
  form!: FormGroup;
  title = '';
  isGroup = false;
  allPermissions: Permissions[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      entity: Groups | Permissions | null,
      type: 'group' | 'permission',
      actionCreate?: (result: any) => Promise<boolean>
      actionUpdate?: (result: any) => Promise<boolean>
    },
    private _fb: FormBuilder,
    private _permissionsService: PermissionsService,
    private _dialogRef: MatDialogRef<GenericFormModalComponent>
  ) { }

  async ngOnInit() {
    this.isGroup = this.data.type === 'group';
    this.title = this.data.entity ? 'Editar' : 'Adicionar';
    this.initForm();

    if (this.isGroup) {
      this.allPermissions = await this._permissionsService.GetPermissionsList();
    }
  }

  initForm() {
    this.form = this._fb.group({
      name: [this.data.entity?.name || '', [Validators.required, Validators.pattern(/^\S+$/)]],
      description: [this.data.entity?.description || ''],
      enabled: [this.data.entity?.enabled ?? true],
      userPermissions: [this.isGroup ? (this.data.entity as Groups)?.userPermissions || [] : null, this.isGroup ? Validators.required : null]
    });
  }

  preventSpace(event: KeyboardEvent) {
    if (event.code === 'Space' || event.key === ' ') {
      event.preventDefault();
    }
  }

  onPaste(event: ClipboardEvent) {
    const pastedText = event.clipboardData?.getData('text');
    if (pastedText?.includes(' ')) {
      event.preventDefault();
    }
  }

  save() {
    if (this.form.invalid) return;

    const result = this.form.getRawValue();
    if (!this.isGroup) delete result.userPermissions;

    if (this.data.entity) {
      this.update(result);
    } else {
      this.create(result);
    }
  }

  private async create(result: any): Promise<void> {
    if (this.data.actionCreate != null) {
      const response = await this.data.actionCreate(result);

      response && this._dialogRef.close(result);
    }
  }

  private async update(result: any): Promise<void> {
    if (this.data.actionUpdate != null) {
      const response = await this.data.actionUpdate(result);

      response && this._dialogRef.close(result);
    }
  }

  cancel() {
    this._dialogRef.close(null);
  }
}
