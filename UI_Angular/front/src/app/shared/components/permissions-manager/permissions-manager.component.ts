import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PermissionsService } from '../../../core/services/permissions.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackBar } from '../../utils/snackBar';
import { MessageConfirmModalComponent } from '../modal/message-confirm-modal/message-confirm-modal.component';
import { Permissions } from '../../../core/models/permissions';
import { GenericFormModalComponent } from '../modal/generic-form-modal/generic-form-modal.component';

@Component({
  selector: 'app-permissions-manager',
  standalone: false,
  templateUrl: './permissions-manager.component.html',
  styleUrl: './permissions-manager.component.css'
})
export class PermissionsManagerComponent {
  displayedColumns: string[] = ['name', 'description', 'actions'];
  permissions = new MatTableDataSource<Permissions>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filterValue: string = '';

  constructor(
    private _permissionsService: PermissionsService,
    private _dialog: MatDialog,
    private _snackBarUtils: SnackBar
  ) {
    this.permissions.filterPredicate = (data: Permissions, filter: string) => {
      const nameMatch = data.name?.toLowerCase().includes(filter);
      const descriptionMatch = data.description?.toLowerCase().includes(filter);
      const item = data.enabled;
      return nameMatch || descriptionMatch || item;
    };

    this.getPermissionsList();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.permissions.filter = filterValue.trim().toLowerCase();
  }

  private async getPermissionsList(): Promise<void> {
    const result = await this._permissionsService.GetPermissionsList();
    this.permissions.data = result;
    this.permissions.sort = this.sort;
    this.permissions.paginator = this.paginator;
  }

  add() {
    this.openDialog();
  }

  edit(permission: Permissions) {
    this.openDialog(permission);
  }

  remove(permission: Permissions) {
    this._dialog.open(MessageConfirmModalComponent, {
      width: '400px',
      data: {
        message: `Tem certeza que deseja remover a permissão "${permission.name}"?`,
        action: async () => await this.delete(permission)
      }
    });
  }

  private openDialog(data?: Permissions): void {
    const dialogRef = this._dialog.open(GenericFormModalComponent, {
      width: '750px',
      data: {
        entity: data || null,
        type: 'permission',
        actionCreate: async (permission: Permissions) => await this.create(permission),
        actionUpdate: async (permission: Permissions) => await this.update(permission),
      }
    });

    dialogRef.afterClosed().subscribe(async (result: Permissions | null) => {
      if (result) {
        this._snackBarUtils.alertMessage('Sucesso.', ['success-snackbar']);
        this.getPermissionsList();
      }
    });
  }

  private async update(permission: Permissions): Promise<boolean> {
    const success = await this._permissionsService.updatePermission(permission);
    return success;
  }

  private async create(permission: Permissions): Promise<boolean> {
    const success = await this._permissionsService.createPermission(permission);
    return success;
  }

  private async delete(permission: Permissions): Promise<void> {
    const success = await this._permissionsService.removePermission(permission);
    if (success) {
      this.getPermissionsList();
      this._snackBarUtils.alertMessage('Permissão removida com sucesso.', ['success-snackbar']);
    } else {
      this._snackBarUtils.alertMessage('Erro ao remover Permissão.', ['error-snackbar']);
    }
  }
}
