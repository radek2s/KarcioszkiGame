import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'simple-confirm-dialog',
    template: `
    
    <h1 mat-dialog-title class="dialog-header">
    <div>{{data.title}}</div>
    </h1>
    <div mat-dialog-content>
        <p>{{data.message}}</p>
    </div>
    <div class="flex-center">
        <button mat-button  mat-flat-button color="primary" class="margin-xs" (click)="onNoClick()">{{btnTextCancel}}</button>
        <button mat-button mat-flat-button color="warn" class="margin-xs" [mat-dialog-close]="true">{{btnTextOk}}</button>
    </div>
    `,
    styleUrls: ['../../karcioszki.style.scss']
})
export class SimpleConfirmDialog {

    btnTextCancel = "Anuluj";
    btnTextOk = "Zatwierdź";

    /**
     * 
     * @param dialogReference 
     * @param data - JSON object with parameters:
     *  data.title    - Title of the dialog.
     *  data.message  - Message description.
     */
    constructor(
        private dialogReference: MatDialogRef<SimpleConfirmDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        if(data.btnTextCancel) {
            this.btnTextCancel = data.btnTextCancel
        }
        if(data.btnTextOk) {
            this.btnTextOk = data.btnTextOk
        }
    }

    onNoClick(): void {
        this.dialogReference.close(false);
    }

}
