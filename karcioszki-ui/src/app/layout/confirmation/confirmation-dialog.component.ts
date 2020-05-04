import { Component, Input, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.html',
  styleUrls: ['../../app.component.scss']
})
export class ConfirmationDialogComponent {

  title: string;
  message: string;
  btnOkText: string;
  btnCancelText: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public inputData: any) {
    this.title = inputData.title;
    this.message = inputData.message;
    this.btnCancelText = inputData.btnCancelText;
    this.btnOkText = inputData.btnOkText;
  }

  public decline() {
    this.dialogRef.close(false);
  }

  public accept() {
    this.dialogRef.close(true);
  }

}