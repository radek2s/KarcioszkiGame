import { Component, Inject } from '@angular/core';
import { CardsPackage } from 'src/app/models/CardsPackage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
    selector: 'pin-validation-dialog',
    template: `
    <div class="relative">
        <button mat-icon-button id="close-dialog" (click)="onNoClick()">
            <mat-icon>cancel</mat-icon>
        </button>
        <h1 mat-dialog-title>Podaj PIN paczki</h1>
        <div mat-dialog-content>
        <mat-form-field>
            <input matInput placeholder="Numer PIN:" [(ngModel)]=inputPin>
        </mat-form-field>
        </div>
        <div mat-dialog-actions>
            <button mat-button (click)="validatePin()">Zatwierdź</button>
        </div>
    </div>
    `
})
export class PinValidationDialog {

    inputPin: string;

    constructor(public dialogReference: MatDialogRef<PinValidationDialog>, @Inject(MAT_DIALOG_DATA) public packageData: CardsPackage) {}

    private validatePin() {
        if(this.inputPin === this.packageData.pin) {
            this.dialogReference.close(true)
        } else {
            this.dialogReference.close()
        }
    }
    onNoClick(): void {
        this.dialogReference.close();
    }  
}
