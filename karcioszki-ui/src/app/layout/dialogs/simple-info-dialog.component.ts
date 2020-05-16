import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'simple-confirm-dialog',
    template: `
    <div class="relative">
        <button mat-icon-button id="close-dialog" (click)="onNoClick()">
            <mat-icon>cancel</mat-icon>
        </button>
        <h1 mat-dialog-title>{{data.title}}</h1>
        <div mat-dialog-content>
            <p>{{data.message}}</p>
        </div>
        <div mat-dialog-actions>
            <button mat-button [mat-dialog-close]="true">{{btnTextOk}}</button>
        </div>
    </div>
    `,
    styles: [`
    h1 {text-align: center}
    mat-form-field {width: 100%}
    .mat-dialog-actions {justify-content: flex-end}
    `]
})
export class SimpleInfoDialog {

    btnTextOk = "OK";

    /**
     * 
     * @param dialogReference 
     * @param data - JSON object with parameters:
     *  data.title    - Title of the dialog.
     *  data.message  - Message description.
     */
    constructor(
        private dialogReference: MatDialogRef<SimpleInfoDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        if(data.btnTextOk) {
            this.btnTextOk = data.btnTextOk
        }
    }

    onNoClick(): void {
        this.dialogReference.close(false);
    }

}
