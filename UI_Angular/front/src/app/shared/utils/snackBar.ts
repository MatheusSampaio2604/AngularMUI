import { MatSnackBar } from "@angular/material/snack-bar";

export class SnackBar {
  constructor(private _snackBar: MatSnackBar) { }

  public alertMessage(message: string = '', className: string[] = ['error-snackbar']): void {
    this._snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass: className, verticalPosition: 'top', horizontalPosition: 'end',
    });
  }
}
