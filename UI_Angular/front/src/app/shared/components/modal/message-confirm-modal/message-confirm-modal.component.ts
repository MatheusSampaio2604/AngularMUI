import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmAction } from '../../../../core/models/confirmAction.model';

@Component({
  selector: 'app-message-confirm-modal',
  standalone: false,
  templateUrl: './message-confirm-modal.component.html',
  styleUrl: './message-confirm-modal.component.css'
})
export class MessageConfirmModalComponent {
  constructor(
    public _dialogRef: MatDialogRef<MessageConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmAction
  ) { }

  onConfirm(): void {
    this.data.action(); // executa a ação passada
    this._dialogRef.close();
  }

  onCancel(): void {
    this._dialogRef.close();
  }
}
