import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'simple-confirm-dialog',
    template: `
    
    <h1 mat-dialog-title class="position-relative">{{data.title}}
    <button mat-icon-button class="dialog-header-button" id="close-dialog" (click)="onNoClick()">
        <mat-icon>cancel</mat-icon>
    </button>
    </h1>
        <div mat-dialog-content>
            <p>{{data.message}}</p>
        </div>
        <div class="flex-center">
            <button mat-flat-button color="primary" [mat-dialog-close]="true">{{btnTextOk}}</button>
        </div>
    `,
    styleUrls: ['../../karcioszki.style.scss']
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
