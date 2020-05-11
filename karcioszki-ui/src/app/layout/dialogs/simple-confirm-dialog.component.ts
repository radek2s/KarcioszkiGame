import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'simple-confirm-dialog',
    template: `
    <h1 mat-dialog-title>{{data.title}}</h1>
    <div mat-dialog-content>
        <p>{{data.message}}</p>
    </div>
    <div mat-dialog-actions>
        <button mat-button (click)="onNoClick()">{{btnTextCancel}}</button>
        <button mat-button [mat-dialog-close]="true">{{btnTextOk}}</button>
    </div>
    `,
    styles: [`
    h1 {text-align: center}
    mat-form-field {width: 100%}
    .mat-dialog-actions {justify-content: flex-end}
    `]
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
