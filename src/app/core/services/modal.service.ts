import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private dialog: MatDialog) {}

  open<T, D = any, R = any>(
    component: T,
    config?: {
      data?: D;
      width?: string;
      height?: string;
      panelClass?: string;
      disableClose?: boolean;
      autoFocus?: boolean;
    }
  ) {
    /* --mat-dialog-container-min-width */
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = config?.data || null;
    dialogConfig.width = config?.width || '25rem';
    dialogConfig.height = config?.height || undefined;
    dialogConfig.panelClass = config?.panelClass || 'custom-dialog-container';
    dialogConfig.disableClose = config?.disableClose || false;
    dialogConfig.autoFocus = config?.autoFocus ?? true;

    console.log('config:: ', config);
    console.log('dialogConfig:: ', dialogConfig);


    return this.dialog.open(component as any, dialogConfig);
  }
}
