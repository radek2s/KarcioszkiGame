import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'simple-input-dialog',
    template: `
    <h1 mat-dialog-title class="dialog-header">
    <div>{{data.title}}</div>
    <div *ngIf="data.optional" class="dialog-header-buttons">
        <button mat-icon-button id="close-dialog" (click)="onNoClick()">
            <mat-icon>cancel</mat-icon>
        </button>
    </div>
    </h1>
    <div mat-dialog-content>
    <p>{{data.message}}</p>
    <mat-form-field [formGroup]="simpleInputForm">
        <input *ngIf="data.optional" matInput [placeholder]="data.placeholder" [(ngModel)]="inputData">
        <input *ngIf="!data.optional" matInput formControlName="simpleInput" [placeholder]="data.placeholder" [(ngModel)]="inputData" required>
    </mat-form-field>
    </div>
    <div mat-dialog-actions>
        <button *ngIf="data.optional" mat-button (click)="onNoClick()">Anuluj</button>
        <button mat-button [mat-dialog-close]="inputData" [disabled]="simpleInput.invalid">Zatwierdź</button>
    </div>
    `,
    styles: [`
    .dialog-header { display: flex; justify-content: center; position: relative;}
    .dialog-header-buttons {position: absolute; right: 0; top: 0;}
    .mat-dialog-actions {justify-content: flex-end}
    .mat-form-field {width: 100%}
    `]
})
export class SimpleInputDialog {

    inputData: string;
    simpleInputForm: FormGroup;

    /**
     * 
     * @param dialogReference 
     * @param data - JSON object with parameters:
     *  data.title         - Title of the dialog.
     *  data.message       - Message description.
     *  data.placeholder   - Placeholder of the input.
     *  data.optional [true|false] - if True dialog can be closed without changes
     *
     */
    constructor(
        private dialogReference: MatDialogRef<SimpleInputDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(): void {
        this.simpleInputForm = new FormGroup({'simpleInput': new FormControl()});
    }

    onNoClick(): void {
        this.dialogReference.close();
    }

    get simpleInput() {
        return this.simpleInputForm.get('simpleInput');
    }
}
