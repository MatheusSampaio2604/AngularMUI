import { Component, ViewChild } from '@angular/core';
import { GroupsService } from '../../../core/services/groups.service';
import { SnackBar } from '../../utils/snackBar';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Groups } from '../../../core/models/groups';
import { MatTableDataSource } from '@angular/material/table';
import { MessageConfirmModalComponent } from '../modal/message-confirm-modal/message-confirm-modal.component';
import { GenericFormModalComponent } from '../modal/generic-form-modal/generic-form-modal.component';
import { createFilterPredicate } from '../../utils/table-filter-utils';

@Component({
  selector: 'app-groups-manager',
  standalone: false,
  templateUrl: './groups-manager.component.html',
  styleUrl: './groups-manager.component.css'
})
export class GroupsManagerComponent {
  displayedColumns: string[] = ['name', 'description', 'roles', 'actions'];
  groups = new MatTableDataSource<Groups>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filterValue: string = '';

  constructor(
    private _groupsService: GroupsService,
    private _dialog: MatDialog,
    private _snackBarUtils: SnackBar
  ) {

    this.groups.filterPredicate = createFilterPredicate<Groups>(['name', 'description', 'userPermissions']);

    this.getGroupsList();
  }

  applyFilter(value: string) {
    this.groups.filter = value; // ou this.users.filter / this.permissions.filter
  }

  private async getGroupsList(): Promise<void> {
    const result = await this._groupsService.GetGroupsList();
    this.groups.data = result;
    this.groups.sort = this.sort;
    this.groups.paginator = this.paginator;
  }

  edit(group: Groups) {
    this.openDialog(group);
  }

  remove(group: Groups) {
    this._dialog.open(MessageConfirmModalComponent, {
      width: '400px',
      data: {
        message: `Tem certeza que deseja remover o grupo "${group.name}"?`,
        action: async () => await this.delete(group)
      }
    });
  }

  add() {
    this.openDialog();
  }

  private openDialog(data?: Groups): void {
    const dialogRef = this._dialog.open(GenericFormModalComponent, {
      width: '750px',
      data: {
        entity: data || null,
        type: 'group',
        actionCreate: async (group: Groups) => await this.create(group),
        actionUpdate: async (group: Groups) => await this.update(group),
      }
    });

    dialogRef.afterClosed().subscribe(async (result: Groups | null) => {
      if (result) {
        this._snackBarUtils.alertMessage('Sucesso.', ['success-snackbar']);
        this.getGroupsList();
      }
    });
  }

  private async create(group: Groups): Promise<boolean> {
    const success = await this._groupsService.createGroup(group);
    return success;
  }

  private async update(group: Groups): Promise<boolean> {
    const success = await this._groupsService.updateGroup(group);
    return success;
  }

  private async delete(group: Groups): Promise<void> {
    const success = await this._groupsService.removeGroup(group);
    if (success) {
      this.getGroupsList();
      this._snackBarUtils.alertMessage('Grupo removido com sucesso.', ['success-snackbar']);
    } else {
      this._snackBarUtils.alertMessage('Erro ao remover Grupo.', ['error-snackbar']);
    }
  }
}
